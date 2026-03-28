import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, ComparisonTable } from '../../../components/content'

export default function CustomSeccomp() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Writing Custom Seccomp-BPF Profiles
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While Landlock controls which filesystem paths and network ports a sandboxed process can
        access, seccomp-bpf operates at a lower level: it controls which system calls the
        process can make at all. A system call (syscall) is the interface between user-space
        programs and the Linux kernel. Every meaningful operation -- opening a file, creating a
        network socket, forking a process, changing permissions, loading a kernel module -- goes
        through a syscall. By restricting which syscalls are available, seccomp-bpf provides a
        fundamental layer of defense that complements Landlock's path-based restrictions.
      </p>

      <DefinitionBlock
        term="seccomp-bpf"
        definition="Secure Computing mode with Berkeley Packet Filter (seccomp-bpf) is a Linux kernel feature that allows a process to define a filter program (written in BPF bytecode) that is applied to every system call the process makes. The filter can allow, deny, log, or trap each syscall based on its number and arguments. Once applied, the filter cannot be removed or weakened -- it persists for the lifetime of the process and is inherited by all child processes."
        example="A seccomp-bpf filter that allows read, write, mmap, open, close, and a handful of other syscalls needed for normal operation, while blocking mount, reboot, kexec_load, ptrace, and other dangerous syscalls that a sandboxed agent should never need."
        seeAlso={['System Call', 'BPF', 'Sandboxing', 'Landlock']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        NemoClaw's Default Seccomp Profile
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw ships with a default seccomp profile that blocks syscalls that sandboxed agents
        should never need. This default profile is based on Docker's default seccomp profile
        (which blocks approximately 44 of the 300+ syscalls on x86_64) but is further tightened
        for the agent use case. The default profile blocks:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Kernel module operations:</span> init_module,
          finit_module, delete_module -- loading kernel modules could compromise the entire host.
        </li>
        <li>
          <span className="font-semibold">Mount operations:</span> mount, umount2, pivot_root --
          manipulating the filesystem namespace is dangerous from within a sandbox.
        </li>
        <li>
          <span className="font-semibold">Reboot and power:</span> reboot, kexec_load,
          kexec_file_load -- no agent should be able to reboot the host.
        </li>
        <li>
          <span className="font-semibold">Namespace creation:</span> unshare, setns (with
          certain flags) -- creating new namespaces could be used to escape the sandbox.
        </li>
        <li>
          <span className="font-semibold">Tracing:</span> ptrace, process_vm_readv,
          process_vm_writev -- debugging other processes could be used to inspect or manipulate
          processes outside the sandbox.
        </li>
        <li>
          <span className="font-semibold">Raw I/O:</span> iopl, ioperm -- direct hardware I/O
          access bypasses all kernel protections.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When You Need a Custom Profile
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The default profile works for most agent use cases, but certain specialized agents may
        require syscalls that the default profile blocks. Conversely, you may want to further
        restrict the profile to block syscalls that the default allows but your specific agent
        does not need. Common scenarios requiring custom profiles include:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          Agents that need to run containers or use container runtimes (may need unshare,
          clone3 with namespace flags).
        </li>
        <li>
          Agents that perform performance profiling (may need perf_event_open).
        </li>
        <li>
          Ultra-restrictive environments where you want to block even fork/execve to prevent
          the agent from spawning any subprocesses.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Analyzing Syscall Requirements
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before writing a custom seccomp profile, you need to know which syscalls your agent
        actually uses. The strace tool is the standard approach for this analysis.
      </p>

      <CodeBlock
        language="bash"
        title="Analyzing syscall usage with strace"
      >{`# Run the agent under strace and collect syscall statistics
strace -c -f -o /tmp/syscall-summary.txt nemoclaw run --blueprint my-agent \\
  --prompt "Perform a typical task"

# -c: count time, calls, and errors for each syscall
# -f: follow child processes (important -- agents spawn subprocesses)

cat /tmp/syscall-summary.txt
# Output shows a table of syscalls used, with call count and time

# For more detail, trace actual syscall arguments:
strace -f -e trace=network -o /tmp/network-syscalls.txt nemoclaw run --blueprint my-agent \\
  --prompt "Perform a typical task"

# Trace only specific syscall categories:
# -e trace=file       File-related syscalls
# -e trace=network    Network-related syscalls
# -e trace=process    Process management syscalls
# -e trace=memory     Memory management syscalls`}</CodeBlock>

      <CodeBlock
        language="bash"
        title="Generating a minimal seccomp profile from strace output"
      >{`# Record all unique syscalls used during a representative workload
strace -f -o /tmp/raw-trace.txt nemoclaw run --blueprint my-agent \\
  --prompt "Perform a comprehensive task"

# Extract unique syscall names
grep -oP '^\\[pid \\d+\\] \\K\\w+' /tmp/raw-trace.txt | sort -u > /tmp/used-syscalls.txt

# Or use NemoClaw's built-in profiler
nemoclaw seccomp profile --blueprint my-agent \\
  --prompt "Perform a comprehensive task" \\
  --output my-seccomp-profile.json

# This runs the agent, records all syscalls, and generates a
# seccomp profile that allows only the observed syscalls plus
# a safety margin for uncommon code paths.`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Writing a Custom Seccomp Profile
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw uses the OCI/Docker seccomp profile JSON format, which is more human-readable
        than raw BPF bytecode. The profile specifies a default action and a list of syscalls
        with per-syscall actions.
      </p>

      <CodeBlock
        language="json"
        title="Custom seccomp profile (seccomp-profile.json)"
      >{`{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 1,
  "architectures": ["SCMP_ARCH_X86_64", "SCMP_ARCH_AARCH64"],
  "syscalls": [
    {
      "names": [
        "read", "write", "close", "fstat", "lstat", "stat",
        "poll", "lseek", "mmap", "mprotect", "munmap", "brk",
        "ioctl", "access", "pipe", "select", "sched_yield",
        "dup", "dup2", "nanosleep", "getpid", "socket",
        "connect", "sendto", "recvfrom", "sendmsg", "recvmsg",
        "bind", "listen", "accept", "getsockname", "getpeername",
        "clone", "fork", "execve", "exit", "wait4", "kill",
        "uname", "fcntl", "flock", "fsync", "fdatasync",
        "truncate", "ftruncate", "getdents", "getcwd", "chdir",
        "mkdir", "rmdir", "creat", "link", "unlink", "symlink",
        "readlink", "chmod", "chown", "umask", "gettimeofday",
        "getrlimit", "getrusage", "sysinfo", "times",
        "getuid", "getgid", "geteuid", "getegid",
        "setpgid", "getppid", "getpgrp",
        "rt_sigaction", "rt_sigprocmask", "rt_sigreturn",
        "pread64", "pwrite64", "readv", "writev",
        "openat", "mkdirat", "newfstatat", "unlinkat",
        "renameat2", "faccessat", "pipe2", "epoll_create1",
        "epoll_ctl", "epoll_wait", "eventfd2", "timerfd_create",
        "signalfd4", "accept4", "dup3", "getrandom",
        "memfd_create", "clone3", "close_range",
        "openat2", "pidfd_open", "futex", "set_robust_list",
        "get_robust_list", "epoll_pwait", "arch_prctl",
        "set_tid_address", "exit_group", "tgkill",
        "prlimit64", "sched_getaffinity", "madvise",
        "rseq", "clock_gettime", "clock_nanosleep"
      ],
      "action": "SCMP_ACT_ALLOW"
    },
    {
      "names": ["ptrace"],
      "action": "SCMP_ACT_LOG",
      "comment": "Log ptrace attempts for debugging but still deny"
    }
  ]
}`}</CodeBlock>

      <CodeBlock
        language="yaml"
        title="Referencing the custom profile in a blueprint"
      >{`# blueprint.yaml
policies:
  seccomp:
    profile: "policies/seccomp-profile.json"
    # Or use a preset:
    # preset: "strict"    # NemoClaw's strict preset
    # preset: "default"   # NemoClaw's default preset
    # preset: "permissive" # Docker's default (less restrictive)`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Testing Seccomp Rules
      </h2>

      <CodeBlock
        language="bash"
        title="Testing a custom seccomp profile"
      >{`# Dry-run: show which syscalls would be blocked/allowed
nemoclaw seccomp test --profile policies/seccomp-profile.json

# Run the agent with the custom profile and verbose seccomp logging
nemoclaw run --blueprint ./my-agent/ --seccomp-log \\
  --prompt "Perform a typical task"

# Check the seccomp audit log for denied syscalls
# (requires auditd or journald)
journalctl -k | grep SECCOMP
# Or:
dmesg | grep seccomp`}</CodeBlock>

      <WarningBlock title="Testing Is Critical">
        <p>
          An overly restrictive seccomp profile will cause the agent to crash or malfunction in
          subtle ways. A missing syscall might cause a segfault, a library to fail initialization,
          or a subprocess to silently fail. Always test custom profiles with a comprehensive
          workload and check both the agent's output and the seccomp audit log for denied syscalls.
          When in doubt, use SCMP_ACT_LOG instead of SCMP_ACT_ERRNO during testing to identify
          syscalls that are needed without breaking the agent.
        </p>
      </WarningBlock>

      <ComparisonTable
        title="Seccomp Actions"
        headers={['Action', 'Behavior', 'Use Case']}
        rows={[
          ['SCMP_ACT_ALLOW', 'Allow the syscall', 'Syscalls the agent needs'],
          ['SCMP_ACT_ERRNO', 'Return an error to the caller', 'Block dangerous syscalls gracefully'],
          ['SCMP_ACT_KILL_PROCESS', 'Kill the entire process', 'Critical security violations'],
          ['SCMP_ACT_LOG', 'Allow but log to audit', 'Testing and monitoring'],
          ['SCMP_ACT_TRAP', 'Send SIGSYS signal', 'Debugging and custom handlers'],
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Custom seccomp profiles give you fine-grained control over the system call surface
        available to sandboxed agents. Combined with Landlock filesystem restrictions and network
        namespace isolation, seccomp-bpf completes the defense-in-depth security model that makes
        NemoClaw's sandbox robust against even sophisticated attacks. The next section covers
        advanced network namespace configuration for agents that need more complex networking
        setups.
      </p>
    </div>
  )
}
