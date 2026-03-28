import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock } from '../../../components/content'

export default function LandlockDeepDive() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Advanced Landlock: Ruleset Layering and Path Hierarchies
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In earlier chapters, we introduced Landlock as the Linux kernel feature that NemoClaw
        uses to enforce filesystem access policies. We covered the basics: how Landlock restricts
        which paths a sandboxed process can read, write, and execute. This section goes deeper
        into Landlock's architecture, covering the subtleties that matter when you are building
        complex security policies -- ruleset layering, path hierarchy semantics, inheritance
        across forked processes, and the differences between kernel versions that affect which
        features are available.
      </p>

      <DefinitionBlock
        term="Landlock Ruleset"
        definition="A Landlock ruleset is a kernel object that defines a set of access rights restricted for a set of filesystem paths. Once a ruleset is applied to a thread (via landlock_restrict_self), it constrains all subsequent filesystem operations by that thread and any threads or processes it creates. Multiple rulesets can be layered on top of each other, with the intersection of their allowed operations determining the effective permissions."
        example="A NemoClaw sandbox applies a base ruleset that denies all filesystem access, then adds rules allowing read access to /workspace/src and read-write access to /workspace/output. The effective permissions are the union of these specific rules intersected with the base restriction."
        seeAlso={['Landlock', 'Filesystem Policy', 'Access Control']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Ruleset Layering
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock supports stacking multiple rulesets on a single thread. When multiple rulesets
        are active, an operation is allowed only if every active ruleset permits it. This is
        an intersection model, not a union model -- adding a new ruleset can only further restrict
        access, never expand it. This is a fundamental security property: no code that runs after
        a Landlock ruleset is applied can escape the restrictions, even if it applies its own
        additional ruleset.
      </p>

      <CodeBlock
        language="c"
        title="Landlock ruleset layering in C (simplified)"
      >{`// Layer 1: Applied by NemoClaw sandbox initialization
// Allows: read /workspace, read-write /tmp
struct landlock_ruleset_attr ruleset_attr_1 = {
    .handled_access_fs =
        LANDLOCK_ACCESS_FS_READ_FILE |
        LANDLOCK_ACCESS_FS_READ_DIR |
        LANDLOCK_ACCESS_FS_WRITE_FILE |
        LANDLOCK_ACCESS_FS_MAKE_REG,
};
int ruleset_fd_1 = landlock_create_ruleset(&ruleset_attr_1, sizeof(ruleset_attr_1), 0);

// Add rules to layer 1
add_path_rule(ruleset_fd_1, "/workspace",
    LANDLOCK_ACCESS_FS_READ_FILE | LANDLOCK_ACCESS_FS_READ_DIR);
add_path_rule(ruleset_fd_1, "/tmp",
    LANDLOCK_ACCESS_FS_READ_FILE | LANDLOCK_ACCESS_FS_WRITE_FILE | LANDLOCK_ACCESS_FS_MAKE_REG);

landlock_restrict_self(ruleset_fd_1, 0);

// Layer 2: Applied by the agent runtime for additional restrictions
// Further restricts to only /workspace/src (subset of layer 1's /workspace)
int ruleset_fd_2 = landlock_create_ruleset(&ruleset_attr_2, sizeof(ruleset_attr_2), 0);
add_path_rule(ruleset_fd_2, "/workspace/src",
    LANDLOCK_ACCESS_FS_READ_FILE | LANDLOCK_ACCESS_FS_READ_DIR);
add_path_rule(ruleset_fd_2, "/tmp",
    LANDLOCK_ACCESS_FS_READ_FILE | LANDLOCK_ACCESS_FS_WRITE_FILE);

landlock_restrict_self(ruleset_fd_2, 0);

// Effective permissions (intersection of layer 1 and layer 2):
//   /workspace/src: read (allowed by both layers)
//   /workspace/other: DENIED (allowed by layer 1, but not by layer 2)
//   /tmp: read + write (allowed by both layers)
//   /tmp MAKE_REG: DENIED (allowed by layer 1, but not by layer 2)`}</CodeBlock>

      <NoteBlock type="info" title="Why Layering Matters for NemoClaw">
        <p>
          NemoClaw uses ruleset layering to implement defense in depth. The OpenClaw sandbox
          applies a base restrictive ruleset, and NemoClaw may apply additional layers based on
          the blueprint's policies. If a blueprint's policy contains a misconfiguration that is
          overly permissive, the base layer still provides a safety net. The effective permissions
          are always the most restrictive combination of all layers.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Path Hierarchy Rules
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock's path-based rules follow the filesystem hierarchy, but the semantics are not
        always intuitive. Understanding how rules interact with directory hierarchies is
        essential for writing correct policies.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Directory rules include subdirectories:</span> A rule
          granting read access to /workspace implicitly grants read access to /workspace/src,
          /workspace/src/main.py, and all other descendants. Access is hierarchical by default.
        </li>
        <li>
          <span className="font-semibold">File rules are exact:</span> A rule granting access to
          a specific file (e.g., /etc/resolv.conf) applies only to that file, not to the
          containing directory or sibling files.
        </li>
        <li>
          <span className="font-semibold">Parent directory access is not implied:</span> Granting
          access to /workspace/src/main.py does not grant access to /workspace/src/ (the directory
          listing). The process can read the file but cannot list the directory contents. This can
          cause confusing behavior if the agent tries to discover files before reading them.
        </li>
        <li>
          <span className="font-semibold">Symlinks are resolved:</span> Landlock evaluates rules
          against the resolved (real) path, not the symlink path. A rule allowing access to
          /workspace/link will not grant access if the link points to /etc/shadow. The real
          target path must be allowed.
        </li>
      </ul>

      <CodeBlock
        language="yaml"
        title="NemoClaw filesystem policy with hierarchy awareness"
      >{`# Common pattern: grant read to a tree, write to a subtree
rules:
  # Read the entire project
  - path: "/workspace"
    access: read
    recursive: true

  # But only write to the output directory
  - path: "/workspace/output"
    access: read-write
    recursive: true

  # Grant access to a specific config file without exposing its directory
  - path: "/workspace/.env.example"
    access: read
    recursive: false   # Does not apply to descendants (file has none)

# NemoClaw translates these YAML rules into Landlock system calls,
# handling the conversion from human-readable access levels to
# Landlock access flags.`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Inheritance Across Processes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock rulesets are inherited by child processes created via fork() and preserved
        across execve(). This means that when a sandboxed agent spawns a subprocess -- for
        example, running git, python, or a build tool -- that subprocess inherits all Landlock
        restrictions from its parent. There is no escape hatch: the child process cannot remove
        or weaken the parent's Landlock restrictions, even if it runs as a different user or
        executes a setuid binary.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This property is critical for NemoClaw's security model. Agents frequently execute shell
        commands and spawn child processes. Without process inheritance, a malicious or
        compromised agent could bypass filesystem restrictions simply by running a new process.
        With Landlock inheritance, the sandbox is inescapable for the entire process tree.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Kernel Version Differences
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock has evolved across kernel versions, with each version adding new capabilities.
        NemoClaw detects the kernel version at runtime and uses the most capable Landlock ABI
        available. Understanding the differences helps you know what protections are in place on
        your specific system.
      </p>

      <ComparisonTable
        title="Landlock ABI Versions and Capabilities"
        headers={['ABI Version', 'Kernel', 'Added Capabilities']}
        rows={[
          ['ABI 1', '5.13+', 'Basic filesystem access control: read, write, execute, make_* for files and directories'],
          ['ABI 2', '5.19+', 'File refer (moving/linking files across different Landlock domains)'],
          ['ABI 3', '6.2+', 'File truncation control (LANDLOCK_ACCESS_FS_TRUNCATE)'],
          ['ABI 4', '6.7+', 'Network access control (TCP bind and connect restrictions)'],
          ['ABI 5', '6.10+', 'ioctl on device files control'],
        ]}
      />

      <WarningBlock title="ABI 4 and Network Control">
        <p>
          Landlock ABI 4 (kernel 6.7+) added TCP network restrictions directly in Landlock,
          allowing bind and connect operations to be controlled by port. NemoClaw can use this
          to supplement its network namespace-based restrictions with an additional kernel-level
          enforcement layer. However, if you are running on a kernel older than 6.7, NemoClaw
          relies solely on network namespaces and iptables for network control. Check your kernel
          version with uname -r and the available Landlock ABI with the landlock status file in
          /sys/kernel/security/landlock/abi-version (if present).
        </p>
      </WarningBlock>

      <CodeBlock
        language="bash"
        title="Checking Landlock support on your system"
      >{`# Check kernel version
uname -r

# Check if Landlock is enabled
cat /sys/kernel/security/landlock/abi-version 2>/dev/null || echo "Landlock not available"

# Expected: a number (1, 2, 3, 4, or 5) indicating the ABI version

# Check NemoClaw's detected Landlock capabilities
nemoclaw system info | grep -i landlock
# Output example:
# Landlock ABI: 4
# Landlock filesystem: enabled
# Landlock network: enabled (ABI 4+)`}</CodeBlock>

      <NoteBlock type="info" title="Graceful Degradation">
        <p>
          NemoClaw is designed to work across kernel versions with graceful degradation. On
          older kernels, features that require newer Landlock ABIs are handled by alternative
          mechanisms (e.g., network namespaces instead of Landlock network rules) or disabled
          with a warning. The nemoclaw system info command shows exactly which security features
          are available on your system and which mechanisms NemoClaw is using for each.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Understanding Landlock at this level of detail enables you to write more precise
        filesystem policies, debug access denials effectively, and make informed decisions about
        kernel version requirements for your NemoClaw deployments. The next section covers
        another kernel-level security mechanism: seccomp-bpf, which controls which system calls
        the sandboxed process can make.
      </p>
    </div>
  )
}
