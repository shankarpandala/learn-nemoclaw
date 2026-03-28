import { NoteBlock, CodeBlock, DefinitionBlock, WarningBlock } from '../../../components/content'

export default function LandlockInternals() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Landlock Internals: Kernel-Level Filesystem Enforcement
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw does not rely on user-space permission checks to enforce filesystem policy.
        User-space enforcement can be bypassed by a sufficiently clever process -- it can
        manipulate file descriptors, use alternative system calls, or exploit race conditions.
        Instead, NemoClaw uses Landlock, a Linux Security Module (LSM) that enforces access
        control at the kernel level. Once Landlock rules are applied, they cannot be circumvented
        by any user-space code, regardless of how the sandboxed agent attempts to access files.
      </p>

      <DefinitionBlock
        term="Landlock"
        definition="A Linux Security Module introduced in kernel 5.13 that enables unprivileged processes to create filesystem access-control sandboxes. Unlike traditional Unix permissions, Landlock rules are stackable, inheritable, and cannot be removed once applied to a process. It provides a programmatic interface for building least-privilege filesystem policies."
        seeAlso={['Linux Security Module', 'Seccomp', 'AppArmor', 'SELinux']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        How Landlock Works
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock operates through a three-step process: ruleset creation, rule addition, and
        enforcement. Understanding each step is important for grasping how NemoClaw's filesystem
        policy is applied and why it is so difficult to bypass.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6">
        Step 1: Ruleset Creation
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The enforcement process begins by creating a Landlock ruleset. A ruleset is a container
        for access-control rules. When creating a ruleset, the process specifies which categories
        of filesystem operations will be governed. These categories include reading files, writing
        files, executing files, creating directories, removing files, and several others.
      </p>

      <CodeBlock
        language="javascript"
        title="Conceptual ruleset creation (pseudocode)"
        code={`// Create a ruleset that governs file read, write, and execute
const ruleset = landlock.createRuleset({
  handledAccessFs: [
    'READ_FILE',      // Reading file contents
    'READ_DIR',       // Listing directory contents
    'WRITE_FILE',     // Writing to files
    'REMOVE_FILE',    // Deleting files
    'REMOVE_DIR',     // Deleting directories
    'MAKE_REG',       // Creating regular files
    'MAKE_DIR',       // Creating directories
    'EXECUTE',        // Executing files
  ]
});`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        By declaring which operations are "handled" by the ruleset, Landlock knows which
        operations to intercept. Any handled operation that does not have a matching allow
        rule will be denied. Operations not listed as handled are unaffected -- they follow
        normal Unix permission checks.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6">
        Step 2: Adding Rules
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        After creating the ruleset, specific rules are added to grant access to particular paths.
        Each rule associates a filesystem path with a set of allowed operations. NemoClaw
        translates its policy configuration into Landlock rules:
      </p>

      <CodeBlock
        language="javascript"
        title="Conceptual rule addition (pseudocode)"
        code={`// Grant read-write access to /sandbox
landlock.addRule(ruleset, {
  path: '/sandbox',
  allowedAccess: [
    'READ_FILE', 'READ_DIR', 'WRITE_FILE',
    'MAKE_REG', 'MAKE_DIR', 'REMOVE_FILE', 'REMOVE_DIR'
  ]
});

// Grant read-write access to /tmp
landlock.addRule(ruleset, {
  path: '/tmp',
  allowedAccess: [
    'READ_FILE', 'READ_DIR', 'WRITE_FILE',
    'MAKE_REG', 'MAKE_DIR', 'REMOVE_FILE', 'REMOVE_DIR'
  ]
});

// Grant read-only access to /usr
landlock.addRule(ruleset, {
  path: '/usr',
  allowedAccess: ['READ_FILE', 'READ_DIR', 'EXECUTE']
});

// Grant read-only access to /etc
landlock.addRule(ruleset, {
  path: '/etc',
  allowedAccess: ['READ_FILE', 'READ_DIR']
});`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Rules are additive. You can only grant access, never deny it explicitly. The deny-by-default
        behavior comes from the ruleset's handled operations: if an operation is handled but no
        rule grants it for a particular path, it is denied. This means NemoClaw only needs to
        specify what is allowed -- everything else is automatically blocked.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6">
        Step 3: Enforcement
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Once all rules are added, the ruleset is enforced by restricting the current process.
        This is done via the{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          landlock_restrict_self()
        </code>{' '}
        system call. After this call, the process -- and all of its future children -- are bound
        by the Landlock rules. The restrictions cannot be removed, relaxed, or overridden.
      </p>

      <CodeBlock
        language="javascript"
        title="Enforcing the ruleset (pseudocode)"
        code={`// Apply the ruleset to the current process
// After this call, restrictions are permanent and irreversible
landlock.restrictSelf(ruleset);

// Now start the agent process
// It inherits all Landlock restrictions
spawnAgent();`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Rule Inheritance
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        One of Landlock's most important properties is inheritance. When a process restricted by
        Landlock creates a child process (via fork or exec), the child inherits all of the parent's
        restrictions. The child cannot escape the sandbox by spawning a new process. This is
        critical for agent sandboxing because agents frequently spawn subprocesses -- running
        shell commands, starting build tools, launching test suites. Every subprocess is
        automatically confined by the same filesystem rules.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Furthermore, Landlock rules are stackable. A child process can add additional restrictions
        on top of the inherited ones, but it can never remove or weaken existing restrictions.
        This means a compromised subprocess cannot grant itself more access than the sandbox
        originally allowed. The security boundary only tightens, never loosens.
      </p>

      <WarningBlock title="Landlock Restrictions Are Irreversible">
        <p>
          Once a Landlock ruleset is enforced on a process, it cannot be undone. There is no
          "unlock" operation. The only way to run code without the restrictions is to start
          a new process outside the sandbox. This irreversibility is a feature, not a limitation.
          It means that even if an attacker gains code execution inside the sandbox, they cannot
          disable the filesystem restrictions.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Kernel Version Requirements
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock was introduced in Linux kernel 5.13 and has been enhanced in subsequent releases.
        Different kernel versions support different sets of access operations:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Kernel 5.13 (Landlock ABI v1):</span> Basic filesystem
          restrictions -- read, write, execute, create, remove operations.
        </li>
        <li>
          <span className="font-semibold">Kernel 5.19 (Landlock ABI v2):</span> Added file
          refer (rename/link across directories) restrictions.
        </li>
        <li>
          <span className="font-semibold">Kernel 6.2 (Landlock ABI v3):</span> Added file
          truncate restrictions.
        </li>
        <li>
          <span className="font-semibold">Kernel 6.7+ (Landlock ABI v4+):</span> Added
          network and IOCTL restrictions.
        </li>
      </ul>

      <NoteBlock type="info" title="NemoClaw's Kernel Requirements">
        <p>
          NemoClaw requires a Linux kernel that supports Landlock. During the onboard process,
          NemoClaw checks for Landlock availability and reports an error if the kernel does
          not support it. For the best security coverage, use a kernel version 6.2 or later,
          which includes the most comprehensive set of Landlock access controls.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why Landlock Over Other Mechanisms
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Linux offers several security mechanisms for filesystem access control: traditional Unix
        permissions, ACLs, AppArmor, SELinux, and seccomp. NemoClaw chose Landlock because it
        uniquely combines several properties needed for agent sandboxing. It does not require
        root privileges to apply (unlike AppArmor and SELinux profiles). It is programmatic
        rather than policy-file based, making it easy to apply dynamically during sandbox
        initialization. Its restrictions are irreversible and inheritable, which is essential
        for containing autonomous agents that spawn subprocesses. And it operates at the kernel
        level, making it resistant to user-space bypass techniques.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will look at how to customize filesystem rules when your agent
        needs access to paths beyond the defaults.
      </p>
    </div>
  )
}
