import { CodeBlock, NoteBlock, DefinitionBlock } from '../../../components/content'

export default function LandlockSeccompNamespaces() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Landlock, Seccomp & Network Namespaces Primer
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's security sandbox is built on three Linux kernel primitives: Landlock for
        filesystem access control, seccomp for system call filtering, and network namespaces for
        network isolation. This section provides a technical primer on each mechanism, including
        how it works at the kernel level, basic usage examples, and how NemoClaw combines all three
        for defense-in-depth security.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Landlock LSM: Filesystem Access Control
      </h2>

      <DefinitionBlock
        term="Landlock"
        definition="A Linux Security Module (LSM) available since Linux 5.13 that enables unprivileged processes to restrict their own filesystem access. Landlock policies are stackable (multiple layers can be applied) and irrevocable (once applied, a process cannot remove or weaken its own restrictions). Landlock operates at the kernel level, enforcing access checks on every filesystem operation."
        example="A process can use Landlock to restrict itself to only read files in /home/user/project and write files in /home/user/project/output, with all other filesystem access denied."
        seeAlso={['LSM', 'Mandatory Access Control', 'Unprivileged Sandboxing']}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock works by creating a ruleset that defines which filesystem actions are permitted on
        which paths. The process creates a ruleset, adds rules specifying allowed paths and
        operations (read, write, execute, make directories, etc.), and then enforces the ruleset on
        itself. Once enforced, the restrictions cannot be removed -- they persist for the lifetime
        of the process and are inherited by all child processes.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The key Landlock operations are: creating a ruleset that declares which access types are
        handled (and therefore restricted), adding path rules that grant specific access types to
        specific filesystem paths, and enforcing the ruleset which activates the restrictions.
      </p>

      <CodeBlock
        language="python"
        title="Landlock Basic Usage (Python with ctypes)"
        code={`import os
import ctypes

# Landlock constants (from linux/landlock.h)
LANDLOCK_ACCESS_FS_READ_FILE = 1 << 2
LANDLOCK_ACCESS_FS_WRITE_FILE = 1 << 5
LANDLOCK_ACCESS_FS_READ_DIR = 1 << 0
LANDLOCK_ACCESS_FS_MAKE_REG = 1 << 6

# Step 1: Create a ruleset
# The handled_access_fs bitmask declares which access types
# this ruleset governs. Any access type listed here is DENIED
# unless a rule explicitly grants it.
ruleset_attr = create_ruleset_attr(
    handled_access_fs=(
        LANDLOCK_ACCESS_FS_READ_FILE |
        LANDLOCK_ACCESS_FS_WRITE_FILE |
        LANDLOCK_ACCESS_FS_READ_DIR |
        LANDLOCK_ACCESS_FS_MAKE_REG
    )
)
ruleset_fd = landlock_create_ruleset(ruleset_attr)

# Step 2: Add rules granting specific access to specific paths
# Allow reading from the project directory
add_path_rule(ruleset_fd, "/home/user/project",
    LANDLOCK_ACCESS_FS_READ_FILE | LANDLOCK_ACCESS_FS_READ_DIR)

# Allow writing only to the output subdirectory
add_path_rule(ruleset_fd, "/home/user/project/output",
    LANDLOCK_ACCESS_FS_WRITE_FILE | LANDLOCK_ACCESS_FS_MAKE_REG)

# Step 3: Enforce the ruleset (irrevocable)
prctl(PR_SET_NO_NEW_PRIVS, 1)  # Required before enforcement
landlock_restrict_self(ruleset_fd)

# From this point forward:
# - Reading /home/user/project/src/main.py  -> ALLOWED
# - Writing /home/user/project/output/result.txt -> ALLOWED
# - Reading /home/user/.ssh/id_rsa  -> DENIED (EACCES)
# - Writing /home/user/project/src/main.py -> DENIED (EACCES)`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The critical property for agent security is irrevocability. Once Landlock restrictions are
        applied, the process cannot bypass them -- not through fork/exec, not through file
        descriptor tricks, not through any userspace mechanism. The enforcement happens in the kernel
        on every relevant system call. Even if an agent is compromised via prompt injection, it
        cannot escape its Landlock restrictions.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Seccomp: System Call Filtering
      </h2>

      <DefinitionBlock
        term="seccomp (Secure Computing Mode)"
        definition="A Linux kernel feature that allows a process to restrict the system calls it can make. In BPF mode (seccomp-bpf), a Berkeley Packet Filter program is loaded that inspects each system call and its arguments, deciding whether to allow, deny, or kill the process. Like Landlock, seccomp filters are irrevocable and inherited by child processes."
        example="A seccomp filter can allow read, write, open, close, and mmap system calls while blocking dangerous calls like ptrace, mount, reboot, and kexec_load."
        seeAlso={['BPF', 'System Call', 'Privilege Escalation']}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While Landlock controls which files a process can access, seccomp controls which kernel
        operations a process can perform at all. System calls are the interface between userspace
        processes and the kernel -- every operation that requires kernel involvement (file I/O,
        network communication, process management, memory allocation) goes through a system call.
        By filtering system calls, seccomp can prevent entire categories of dangerous operations.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Seccomp-bpf filters are specified as BPF (Berkeley Packet Filter) programs that inspect the
        system call number and arguments and return an action: allow the call, return an error,
        send a signal, or kill the process. In practice, most seccomp profiles use a deny-list
        approach, blocking known-dangerous syscalls while allowing the hundreds of syscalls needed
        for normal operation.
      </p>

      <CodeBlock
        language="python"
        title="Seccomp Filter Example (using the seccomp library)"
        code={`import seccomp

# Create a filter with a default action of ALLOW
# (In production, you might use KILL or ERRNO as default)
f = seccomp.SyscallFilter(seccomp.ALLOW)

# Block dangerous system calls

# Prevent loading kernel modules
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "init_module")
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "finit_module")

# Prevent mounting filesystems
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "mount")
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "umount2")

# Prevent process tracing (anti-debugging/anti-injection)
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "ptrace")

# Prevent changing user/group identity
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "setuid")
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "setgid")
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "setreuid")
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "setregid")

# Prevent system reboot
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "reboot")

# Prevent kernel parameter modification
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "syslog")
f.add_rule(seccomp.ERRNO(seccomp.errno.EPERM), "kexec_load")

# Load the filter (irrevocable)
f.load()

# From this point forward, blocked syscalls return EPERM
# Normal operations (read, write, open, exec) still work`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Seccomp is particularly important for preventing privilege escalation. Even if an attacker
        gains code execution within the agent's process, they cannot use system calls to load
        kernel modules, mount filesystems, trace other processes, or change the process's identity.
        These are the building blocks of most privilege escalation attacks, and seccomp removes
        them entirely.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Network Namespaces: Network Isolation
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Network namespaces provide complete isolation of the network stack. A process running in a
        separate network namespace has its own network interfaces, IP addresses, routing table,
        firewall rules, and socket state. By default, a new network namespace has only a loopback
        interface -- no connectivity to the host network, no internet access, nothing.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        To provide selective connectivity, a virtual ethernet (veth) pair is created. One end of the
        pair exists in the host namespace and the other in the agent's namespace. Traffic flows
        through this virtual link, and iptables/nftables rules in the host namespace control which
        traffic is forwarded and which is dropped.
      </p>

      <CodeBlock
        language="bash"
        title="Setting Up a Network Namespace with Selective Access"
        code={`# Create a new network namespace for the agent
sudo ip netns add agent-sandbox

# Create a veth pair (virtual ethernet cable)
sudo ip link add veth-host type veth peer name veth-agent

# Move one end into the agent's namespace
sudo ip link set veth-agent netns agent-sandbox

# Configure IP addresses
sudo ip addr add 10.0.0.1/24 dev veth-host
sudo ip link set veth-host up

sudo ip netns exec agent-sandbox ip addr add 10.0.0.2/24 dev veth-agent
sudo ip netns exec agent-sandbox ip link set veth-agent up
sudo ip netns exec agent-sandbox ip link set lo up

# Set default route in agent namespace (through host)
sudo ip netns exec agent-sandbox ip route add default via 10.0.0.1

# Enable IP forwarding on host
sudo sysctl -w net.ipv4.ip_forward=1

# NAT agent traffic through host's network interface
sudo iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o eth0 -j MASQUERADE

# ALLOW ONLY specific destinations (deny-by-default)
sudo iptables -A FORWARD -s 10.0.0.2 -d 104.18.0.0/16 -j ACCEPT   # PyPI
sudo iptables -A FORWARD -s 10.0.0.2 -d 140.82.0.0/16 -j ACCEPT   # GitHub
sudo iptables -A FORWARD -s 10.0.0.2 -j DROP                        # Block all else
sudo iptables -A FORWARD -d 10.0.0.2 -j ACCEPT                      # Allow responses

# Run the agent inside the namespace
sudo ip netns exec agent-sandbox sudo -u agentuser /usr/bin/agent-process`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The deny-by-default property of network namespaces is what makes them so powerful for agent
        security. Unlike firewall rules on a shared network stack (which must anticipate and block
        every dangerous destination), network namespaces start with zero connectivity. The operator
        explicitly adds only the routes and forwarding rules needed for the agent's legitimate
        traffic. Any network request to a destination not in the allow list is silently dropped at
        the kernel level.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        How NemoClaw Combines All Three
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's runtime (OpenShell) applies all three mechanisms at agent startup, creating a
        layered security boundary:
      </p>

      <ul className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Network namespace creation:</span> Before the agent
          process starts, OpenShell creates a dedicated network namespace and configures veth pairs
          and routing rules based on the operator's network policy. Only explicitly allowed
          domains are routable from the namespace.
        </li>
        <li>
          <span className="font-semibold">Landlock enforcement:</span> At process startup, the
          agent applies Landlock rules restricting filesystem access to only the directories
          specified in the operator's filesystem policy. Credential files, system directories, and
          other sensitive paths are inaccessible.
        </li>
        <li>
          <span className="font-semibold">Seccomp filter loading:</span> A seccomp-bpf filter is
          loaded that blocks dangerous system calls -- preventing privilege escalation, kernel
          module loading, filesystem mounting, and process tracing.
        </li>
        <li>
          <span className="font-semibold">Credential injection:</span> API keys and tokens needed
          by the agent are injected into the process environment but are not present in any
          filesystem path accessible to the agent. The agent can use the credentials for API calls
          but cannot read them from files or exfiltrate them.
        </li>
      </ul>

      <NoteBlock type="info" title="Defense in Depth in Practice">
        <p>
          Consider a prompt injection attack that instructs the agent to read SSH keys and send
          them to an external server. With NemoClaw's layered sandbox:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>
            <strong>Landlock blocks the file read:</strong> The agent cannot access ~/.ssh because
            it is outside the allowed filesystem paths. Attack stopped at layer 1.
          </li>
          <li>
            <strong>Even if Landlock were bypassed</strong>, the network namespace blocks the
            exfiltration: the attacker's server is not in the allowed network destinations.
            Attack stopped at layer 2.
          </li>
          <li>
            <strong>Even if both were bypassed</strong>, seccomp blocks the dangerous system calls
            needed for advanced exploitation techniques. Attack stopped at layer 3.
          </li>
        </ul>
        <p className="mt-2">
          An attacker would need to bypass all three independent kernel-level security mechanisms
          simultaneously to achieve a successful exploit. This is the practical value of
          defense in depth.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With this understanding of the security primitives that NemoClaw builds upon, we are now
        ready to examine the software platforms that NemoClaw protects. In the next chapter, we
        will explore OpenClaw and NemoClaw themselves -- what they are, how they relate to each
        other, and why the combination provides a complete solution for safe AI agent deployment.
      </p>
    </div>
  )
}
