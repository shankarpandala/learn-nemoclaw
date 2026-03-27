import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock, PolicyViewer, ReferenceList } from '../../../components/content';

export default function LandlockEnforcement() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Landlock Enforcement
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock is a Linux Security Module (LSM) that allows unprivileged processes to
        restrict their own filesystem access. In OpenShell, Landlock is the primary
        mechanism for controlling what an agent can read, write, and execute on the
        filesystem. Unlike traditional Unix permissions (which are user-based), Landlock
        rules are process-based and cannot be removed once applied -- even by root.
      </p>

      <DefinitionBlock
        term="Landlock LSM"
        definition="A stackable Linux Security Module introduced in kernel 5.13 that enables unprivileged access control. A process can create a Landlock ruleset defining which filesystem operations are allowed on which paths, then restrict itself to that ruleset. Once self-restricted, the process and all its descendants are permanently bound by those rules for the lifetime of the process."
        example="A sandboxed agent can be restricted to read-write /sandbox and /tmp, read-only /usr and /lib, and no access to /home, /root, or /etc/shadow."
        seeAlso={['LSM', 'seccomp', 'Mandatory Access Control']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        How Landlock Works in OpenShell
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When the NemoClaw blueprint applies a sandbox configuration, it translates the
        user's policy declarations into a Landlock ruleset. OpenShell then applies this
        ruleset to the sandboxed process using a sequence of kernel calls:
      </p>

      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Create a new Landlock ruleset with <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">landlock_create_ruleset()</code></li>
        <li>Add path rules for each allowed filesystem path using <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">landlock_add_rule()</code></li>
        <li>Enforce the ruleset on the current process using <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">landlock_restrict_self()</code></li>
        <li>Fork the agent process, which inherits the restrictions</li>
      </ol>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        After step 3, the restrictions are permanent. There is no{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">landlock_unrestrict_self()</code> -- that
        system call does not exist and never will. This is by design: security
        restrictions that can be removed by the restricted process are not real
        restrictions.
      </p>

      <CodeBlock
        title="Landlock ruleset creation (C, simplified)"
        language="bash"
        code={`// Conceptual C code showing the kernel API OpenShell uses

// Step 1: Create a ruleset that handles filesystem access
struct landlock_ruleset_attr attr = {
    .handled_access_fs =
        LANDLOCK_ACCESS_FS_READ_FILE |
        LANDLOCK_ACCESS_FS_WRITE_FILE |
        LANDLOCK_ACCESS_FS_READ_DIR |
        LANDLOCK_ACCESS_FS_MAKE_REG |
        LANDLOCK_ACCESS_FS_EXECUTE
};
int ruleset_fd = landlock_create_ruleset(&attr, sizeof(attr), 0);

// Step 2: Allow read-write on /sandbox
struct landlock_path_beneath_attr sandbox_rule = {
    .allowed_access =
        LANDLOCK_ACCESS_FS_READ_FILE |
        LANDLOCK_ACCESS_FS_WRITE_FILE |
        LANDLOCK_ACCESS_FS_READ_DIR |
        LANDLOCK_ACCESS_FS_MAKE_REG,
    .parent_fd = open("/sandbox", O_PATH)
};
landlock_add_rule(ruleset_fd, LANDLOCK_RULE_PATH_BENEATH, &sandbox_rule, 0);

// Step 2b: Allow read-only on /usr
struct landlock_path_beneath_attr usr_rule = {
    .allowed_access =
        LANDLOCK_ACCESS_FS_READ_FILE |
        LANDLOCK_ACCESS_FS_READ_DIR |
        LANDLOCK_ACCESS_FS_EXECUTE,
    .parent_fd = open("/usr", O_PATH)
};
landlock_add_rule(ruleset_fd, LANDLOCK_RULE_PATH_BENEATH, &usr_rule, 0);

// Step 3: Enforce -- no going back after this
prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0);
landlock_restrict_self(ruleset_fd, 0);

// Step 4: Fork the agent -- child inherits all restrictions
pid_t agent_pid = fork();`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Default Filesystem Permissions
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenShell's default Landlock policy provides a carefully designed set of
        filesystem permissions. The guiding principle is <strong>least privilege</strong>:
        grant only what the agent needs to function, deny everything else.
      </p>

      <ComparisonTable
        title="Default Filesystem Access Rules"
        headers={['Path', 'Access Level', 'Rationale']}
        rows={[
          ['/sandbox', 'Read-Write', 'Agent working directory -- where project files are mounted and work is done'],
          ['/tmp', 'Read-Write', 'Temporary files -- many tools and libraries require /tmp'],
          ['/usr', 'Read-Only + Execute', 'System binaries and libraries -- agent needs to run tools like python, git, node'],
          ['/lib', 'Read-Only + Execute', 'Shared libraries -- required for dynamically linked binaries'],
          ['/lib64', 'Read-Only + Execute', 'x86_64 shared libraries -- symlinked on many distributions'],
          ['/proc/self', 'Read-Only', 'Process info -- some runtimes need /proc/self/exe and /proc/self/maps'],
          ['/dev/null', 'Read-Write', 'Null device -- required by many programs'],
          ['/dev/urandom', 'Read-Only', 'Random number generation -- required by cryptographic libraries'],
          ['/home', 'Denied', 'User home directories -- never accessible to the agent'],
          ['/root', 'Denied', 'Root home directory -- never accessible to the agent'],
          ['/etc', 'Denied (with exceptions)', 'System config -- /etc/resolv.conf and /etc/ssl/certs are read-only'],
        ]}
      />

      <PolicyViewer
        title="OpenShell Landlock Policy (YAML)"
        policy={`# Default OpenShell Landlock filesystem policy
# Applied by NemoClaw blueprint during sandbox creation

filesystem:
  rules:
    - path: /sandbox
      access: [read, write, create, delete]
      comment: "Agent working directory"

    - path: /tmp
      access: [read, write, create, delete]
      comment: "Temporary files"

    - path: /usr
      access: [read, execute]
      comment: "System binaries and libraries"

    - path: /lib
      access: [read, execute]
      comment: "Shared libraries"

    - path: /proc/self
      access: [read]
      comment: "Process self-info"

    - path: /etc/resolv.conf
      access: [read]
      comment: "DNS configuration"

    - path: /etc/ssl/certs
      access: [read]
      comment: "TLS certificates"

  # Everything not listed above is DENIED
  default: deny`}
        annotations={[
          { line: 7, text: '/sandbox is the only directory where the agent can create and modify files. Project files are bind-mounted here.' },
          { line: 11, text: '/tmp is needed by Python, Node.js, and many other runtimes for temporary file creation.' },
          { line: 15, text: 'Execute permission on /usr allows running installed tools. Write is denied -- the agent cannot install system packages.' },
          { line: 27, text: 'Read-only /etc/resolv.conf is required for DNS resolution inside the sandbox.' },
          { line: 33, text: 'The default-deny policy means any path not explicitly listed is completely inaccessible.' },
        ]}
      />

      <WarningBlock title="No Write Access to System Paths">
        The agent cannot write to <code>/usr</code>, <code>/lib</code>, or any system
        path. This means{' '}
        <code>apt install</code>, <code>pip install --system</code>, and similar
        commands will fail inside the sandbox. Agent dependencies must be pre-installed
        in the sandbox image or installed to <code>/sandbox/.local</code> using
        user-level installers like <code>pip install --user</code>.
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Landlock ABI Versions
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock has evolved across kernel versions. Each ABI version adds new
        capabilities:
      </p>

      <ComparisonTable
        title="Landlock ABI Versions"
        headers={['ABI Version', 'Kernel', 'Added Capabilities']}
        rows={[
          ['v1', '5.13+', 'Basic filesystem access control (read, write, execute, create, delete)'],
          ['v2', '5.19+', 'File referring/linking/renaming restrictions'],
          ['v3', '6.2+', 'Network port binding and connection restrictions (TCP)'],
          ['v4', '6.7+', 'IOCTL restrictions on files'],
        ]}
      />

      <NoteBlock type="info" title="Graceful Degradation">
        OpenShell detects the available Landlock ABI version at startup and adjusts its
        enforcement accordingly. On a kernel with ABI v1, filesystem rules work but
        network port restrictions are enforced through the network namespace alone
        (which is less granular). OpenShell will warn you if critical features are
        unavailable due to kernel version.
      </NoteBlock>

      <ExerciseBlock
        question="What happens if a sandboxed agent tries to read /home/user/.ssh/id_rsa?"
        options={[
          'The read succeeds because the file exists on the host filesystem',
          'The read returns an empty file',
          'The kernel returns EACCES (Permission Denied) because /home is not in the Landlock ruleset',
          'OpenShell intercepts the read and returns a fake file',
        ]}
        correctIndex={2}
        explanation="Landlock enforcement happens at the kernel level. When the agent calls open() on a path not covered by any rule in the ruleset, the kernel's LSM hook denies the operation with EACCES. The process never sees the file's contents -- the denial happens before any data is read. There is no interception or fakery; it is a hard kernel-level denial."
      />

      <ReferenceList
        references={[
          {
            title: 'Landlock Kernel Documentation',
            url: 'https://docs.kernel.org/userspace-api/landlock.html',
            type: 'docs',
            description: 'Official Linux kernel documentation for the Landlock security module.',
          },
          {
            title: 'OpenShell Filesystem Policies',
            url: 'https://docs.nvidia.com/openshell/filesystem',
            type: 'docs',
            description: 'How OpenShell translates YAML policies into Landlock rulesets.',
          },
        ]}
      />
    </div>
  );
}
