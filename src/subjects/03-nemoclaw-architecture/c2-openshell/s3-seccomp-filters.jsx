import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content';

export default function SeccompFilters() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Seccomp Filters
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While Landlock controls <em>which files</em> a process can access, seccomp
        controls <em>which system calls</em> a process can make. Together they form a
        two-layer defense: even if an attacker finds a way to trick Landlock, seccomp
        can block the dangerous kernel operations needed to exploit that trick.
        OpenShell uses seccomp-bpf (seccomp with Berkeley Packet Filter programs) to
        filter syscalls for every sandboxed agent process.
      </p>

      <DefinitionBlock
        term="seccomp-bpf"
        definition="Secure Computing mode with BPF (Berkeley Packet Filter) is a Linux kernel feature that allows a process to install a filter program that examines every system call the process makes. The filter can allow, deny, log, or kill based on the syscall number and its arguments. Once installed, the filter cannot be removed and applies to all child processes."
        example="A seccomp filter that allows read(), write(), and open() but kills the process on execve() -- preventing execution of arbitrary binaries."
        seeAlso={['BPF', 'Landlock', 'Privilege Escalation', 'Syscall']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        How Seccomp Works in OpenShell
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenShell compiles a seccomp filter from the NemoClaw policy configuration and
        loads it into the kernel before launching the agent process. The filter is a BPF
        program -- essentially a small, efficient virtual machine program that runs inside
        the kernel for every syscall. This makes the per-syscall overhead negligible
        (typically under 100 nanoseconds).
      </p>

      <CodeBlock
        title="Seccomp filter loading (conceptual)"
        language="python"
        code={`# Simplified view of what OpenShell does internally

import ctypes

# Define the BPF filter program
# Each instruction checks the syscall number
filter_program = compile_seccomp_policy({
    "default_action": "SCMP_ACT_ERRNO",   # deny by default (return EPERM)
    "syscalls": [
        # File I/O
        {"names": ["read", "write", "open", "openat", "close"],
         "action": "SCMP_ACT_ALLOW"},
        # Memory management
        {"names": ["mmap", "mprotect", "munmap", "brk"],
         "action": "SCMP_ACT_ALLOW"},
        # Process management (limited)
        {"names": ["fork", "clone", "wait4", "exit_group"],
         "action": "SCMP_ACT_ALLOW"},
        # Networking (through gateway only)
        {"names": ["socket", "connect", "sendto", "recvfrom"],
         "action": "SCMP_ACT_ALLOW"},
        # Dangerous syscalls -- explicitly blocked
        {"names": ["ptrace", "mount", "reboot", "kexec_load"],
         "action": "SCMP_ACT_KILL"},
    ]
})

# Load the filter -- no going back
prctl(PR_SET_NO_NEW_PRIVS)
seccomp(SECCOMP_SET_MODE_FILTER, filter_program)`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Allowed vs. Blocked Syscalls
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenShell's default seccomp profile allows approximately 60 of the 340+
        available Linux system calls. The allowed set is carefully chosen to support
        typical agent workloads (running Python, Node.js, shell scripts, git) while
        blocking syscalls that could be used for privilege escalation or sandbox escape.
      </p>

      <ComparisonTable
        title="Syscall Categories"
        headers={['Category', 'Examples', 'Action']}
        rows={[
          ['File I/O', 'read, write, open, openat, close, stat, fstat, lstat, lseek', 'Allow'],
          ['Memory', 'mmap, mprotect, munmap, brk, mremap', 'Allow'],
          ['Process (basic)', 'fork, clone (restricted flags), wait4, exit_group, getpid', 'Allow'],
          ['Time', 'clock_gettime, gettimeofday, nanosleep', 'Allow'],
          ['Signals', 'rt_sigaction, rt_sigprocmask, kill (self only)', 'Allow'],
          ['Networking', 'socket, connect, bind, sendto, recvfrom, select, poll, epoll_*', 'Allow'],
          ['Directory', 'getdents64, mkdir, rmdir, rename, unlink', 'Allow'],
          ['Process tracing', 'ptrace', 'Kill'],
          ['Mounting', 'mount, umount2, pivot_root', 'Kill'],
          ['Module loading', 'init_module, finit_module, delete_module', 'Kill'],
          ['System control', 'reboot, kexec_load, swapon, swapoff', 'Kill'],
          ['Namespace manipulation', 'unshare, setns (most flags)', 'Deny (EPERM)'],
          ['Raw I/O', 'iopl, ioperm', 'Kill'],
          ['Kernel keyring', 'add_key, request_key, keyctl', 'Deny (EPERM)'],
        ]}
        highlightDiffs
      />

      <NoteBlock type="info" title="Allow vs. Deny vs. Kill">
        <p>OpenShell uses three seccomp actions:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><strong>Allow</strong> -- the syscall proceeds normally</li>
          <li><strong>Deny (ERRNO)</strong> -- the syscall returns an error (EPERM) but the process continues. Used for syscalls that programs might attempt harmlessly.</li>
          <li><strong>Kill</strong> -- the process is immediately terminated. Used for syscalls that have no legitimate use in a sandbox and indicate an active attack.</li>
        </ul>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Preventing Privilege Escalation
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The primary purpose of seccomp in OpenShell is preventing privilege escalation.
        Even if an attacker finds a vulnerability in the agent's code or a library, the
        seccomp filter limits what they can do with it. Key defenses include:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>No ptrace</strong> -- an attacker cannot attach to other processes to
          read their memory (which could contain credentials in the blueprint process).
          The ptrace syscall is killed immediately.
        </li>
        <li>
          <strong>No mount</strong> -- an attacker cannot mount a new filesystem to
          bypass Landlock restrictions. Mounting requires the mount syscall, which is
          killed.
        </li>
        <li>
          <strong>No namespace manipulation</strong> -- an attacker cannot create new
          user or mount namespaces to escape the sandbox. The unshare and setns syscalls
          are denied for most flag combinations.
        </li>
        <li>
          <strong>Restricted clone flags</strong> -- the clone syscall (used by fork) is
          allowed, but only with safe flags. Flags like CLONE_NEWUSER (create new user
          namespace) are denied.
        </li>
        <li>
          <strong>PR_SET_NO_NEW_PRIVS</strong> -- before the seccomp filter is loaded,
          OpenShell sets the no-new-privileges bit. This ensures that execve() cannot
          gain additional privileges through setuid/setgid binaries.
        </li>
      </ul>

      <CodeBlock
        title="Demonstrating seccomp enforcement"
        language="bash"
        code={`# Inside the sandbox: allowed syscalls work normally
$ python3 -c "print('hello')"
hello

$ ls /sandbox
project_files/  .local/

# Attempting a blocked syscall
$ python3 -c "import ctypes; ctypes.CDLL(None).mount(b'none', b'/mnt', b'tmpfs', 0, None)"
Killed  # Process immediately terminated -- mount is a kill-action syscall

# Attempting a denied (but not kill) syscall
$ python3 -c "import ctypes; ctypes.CDLL(None).unshare(0x10000000)"
OSError: [Errno 1] Operation not permitted  # EPERM -- process continues

# Checking the seccomp status from inside
$ cat /proc/self/status | grep Seccomp
Seccomp:        2
Seccomp_filters:        1
# Seccomp: 2 means SECCOMP_MODE_FILTER (BPF filter active)`}
      />

      <WarningBlock title="Seccomp Filters Are Permanent">
        Like Landlock rules, seccomp filters cannot be removed once applied. They are
        inherited by all child processes. There is no way for the sandboxed process
        (or any process it spawns) to lift the restrictions. Even if an attacker gains
        root capabilities inside the sandbox, the seccomp filter remains in effect
        because of the no-new-privileges bit.
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Custom Seccomp Profiles
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw allows operators to customize the seccomp profile through policy files.
        This is useful when an agent needs syscalls that the default profile blocks.
        For example, an agent that works with performance profiling might need
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">perf_event_open</code>.
      </p>

      <CodeBlock
        title="Custom seccomp policy additions"
        language="yaml"
        code={`# .nemoclaw/policies/seccomp-custom.yaml
seccomp:
  # Start from the default profile
  extends: default

  # Add specific syscalls
  allow:
    - perf_event_open    # Needed for profiling agent
    - inotify_init1      # Needed for file watching

  # Override action for specific syscalls (change from kill to deny)
  override:
    - name: ptrace
      action: deny       # Log and deny instead of kill (for debugging)`}
      />

      <ExerciseBlock
        question="Why does OpenShell use 'kill' action for mount() but 'deny' (EPERM) for unshare()?"
        options={[
          'mount is more dangerous than unshare',
          'mount() should never be called by legitimate agent code, so calling it indicates an attack. unshare() might be called harmlessly by some runtimes that can recover from EPERM.',
          'Kill action is faster than deny action',
          'It is a historical accident from an earlier version',
        ]}
        correctIndex={1}
        explanation="The choice between kill and deny depends on whether legitimate software might accidentally call the syscall. Some language runtimes and libraries probe for namespace support by calling unshare() and handling the error gracefully. Killing the process for such a probe would break legitimate code. In contrast, no legitimate agent code should ever call mount(), so any attempt is treated as hostile."
      />

      <ReferenceList
        references={[
          {
            title: 'seccomp-bpf Kernel Documentation',
            url: 'https://docs.kernel.org/userspace-api/seccomp_filter.html',
            type: 'docs',
            description: 'Linux kernel documentation for seccomp with BPF filters.',
          },
          {
            title: 'OpenShell Seccomp Profiles',
            url: 'https://docs.nvidia.com/openshell/seccomp',
            type: 'docs',
            description: 'Default and custom seccomp profiles in OpenShell.',
          },
        ]}
      />
    </div>
  );
}
