import { ComparisonTable, NoteBlock } from '../../../components/content'

export default function IsolationStrategies() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Isolation Strategies
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Isolating AI agents from the host system and from each other is the foundational requirement
        for agent security. Multiple isolation strategies exist, each operating at a different level
        of the system stack and offering different tradeoffs between security strength, performance
        overhead, and operational complexity. Understanding these strategies is essential for
        appreciating why NemoClaw chose its particular approach.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Containers: Process-Level Isolation
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Container runtimes like Docker, Podman, and containerd use Linux kernel features --
        namespaces, cgroups, and overlay filesystems -- to create isolated environments that share
        the host kernel. Each container gets its own view of the process table, network stack,
        filesystem, and user namespace.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For AI agents, containers provide a familiar and well-understood isolation boundary. The
        agent runs inside a container with a defined filesystem, limited network access (via Docker
        network policies), and resource constraints (via cgroup limits). Containers are fast to
        start, lightweight compared to VMs, and have excellent tooling support.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        However, containers share the host kernel, which means that kernel vulnerabilities can
        potentially allow container escapes. Container security depends heavily on proper
        configuration -- running as non-root, dropping capabilities, using read-only filesystems,
        and applying seccomp profiles. Misconfigured containers (such as those running with
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">--privileged</code>)
        provide essentially no isolation. Additionally, container orchestration adds operational
        complexity that may be excessive for simple agent deployments.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Virtual Machines: Hardware-Level Isolation
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Virtual machines (VMs), managed by hypervisors like KVM, Xen, or VMware, provide the
        strongest isolation available. Each VM runs its own kernel, has its own virtual hardware,
        and is separated from the host and other VMs at the hardware level. Modern lightweight VM
        technologies like Firecracker (used by AWS Lambda) and Cloud Hypervisor can boot a
        microVM in under 200 milliseconds, making them viable for agent workloads.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The security properties of VMs are compelling: even a complete kernel compromise within the
        VM does not affect the host system. The attack surface is reduced to the hypervisor
        interface, which is much smaller than the kernel syscall surface shared by containers.
        For high-security agent deployments handling sensitive data, VMs provide the strongest
        available isolation.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The downsides are resource overhead and operational complexity. Each VM requires its own
        kernel, init system, and base operating system, consuming significantly more memory and
        disk than a container. Boot times, while improving, are still longer than process or
        container startup. Managing VM images, snapshots, and networking requires additional
        infrastructure. For many agent use cases, this overhead is not justified by the security
        requirements.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Linux Security Modules: Kernel-Level Policy Enforcement
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Linux Security Modules (LSMs) are a framework built into the Linux kernel that allows
        security policies to be enforced at the kernel level without requiring containers or VMs.
        The three major LSMs relevant to agent security are AppArmor, SELinux, and Landlock.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">AppArmor</span> uses path-based access control profiles.
          Each profile defines which files a process can access and what operations it can perform.
          AppArmor is relatively easy to configure but requires profiles to be loaded by root and
          is not stackable with other LSMs in all configurations.
        </li>
        <li>
          <span className="font-semibold">SELinux</span> uses label-based mandatory access control.
          Every file, process, and resource is assigned a security label, and a policy defines
          which label interactions are permitted. SELinux is extremely powerful but notoriously
          complex to configure and debug. Its policies can be hundreds of pages long.
        </li>
        <li>
          <span className="font-semibold">Landlock</span> is the newest LSM (Linux 5.13+) and is
          specifically designed for unprivileged sandboxing. Unlike AppArmor and SELinux, Landlock
          policies can be applied by unprivileged processes to themselves -- no root access
          required. This makes Landlock uniquely suited for application-level sandboxing where
          the agent process restricts its own capabilities at startup.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        LSMs provide fine-grained control with minimal performance overhead because enforcement
        happens in the kernel, on the critical path of system calls. There is no virtualization
        layer, no container runtime, and no additional processes -- just kernel-level policy
        checks on every relevant operation.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Network Namespaces: Network-Level Isolation
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Linux network namespaces provide complete network stack isolation. A process running in its
        own network namespace has its own network interfaces, routing tables, firewall rules, and
        socket bindings. By default, a new network namespace has no connectivity -- not even to
        localhost. Connectivity must be explicitly configured by creating virtual network interfaces
        and setting up routing and firewall rules.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For agent isolation, network namespaces provide a powerful deny-by-default network posture.
        The agent starts with zero network access, and specific routes are added only for
        explicitly allowed endpoints. This is fundamentally different from firewall rules applied
        to a shared network stack, where the default posture is typically allow-all and rules must
        be written to block specific traffic. With namespaces, the security model is inverted:
        nothing gets through unless you build the path.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Network namespaces can be combined with virtual ethernet (veth) pairs and iptables/nftables
        rules to create sophisticated network topologies. A proxy running in the host namespace can
        forward allowed traffic into the agent's namespace while blocking everything else,
        providing both isolation and visibility into the agent's network activity.
      </p>

      <ComparisonTable
        title="Comparison of Isolation Strategies"
        headers={['Strategy', 'Isolation Level', 'Performance', 'Complexity', 'Root Required', 'Best For']}
        rows={[
          [
            'Containers (Docker/Podman)',
            'Process-level; shared kernel',
            'Low overhead; fast startup',
            'Moderate; requires runtime and image management',
            'Typically yes (rootless mode available)',
            'General-purpose isolation with good tooling',
          ],
          [
            'VMs (KVM/Firecracker)',
            'Hardware-level; separate kernel',
            'Higher overhead; more memory and disk',
            'High; requires hypervisor and image management',
            'Yes',
            'High-security workloads; untrusted code execution',
          ],
          [
            'LSMs (AppArmor/SELinux)',
            'Kernel-level policy enforcement',
            'Minimal; in-kernel checks',
            'High for SELinux; moderate for AppArmor',
            'Yes (except Landlock)',
            'Fine-grained access control on existing processes',
          ],
          [
            'Landlock LSM',
            'Kernel-level; self-sandboxing',
            'Minimal; in-kernel checks',
            'Low; simple API, unprivileged',
            'No',
            'Application-level sandboxing without root',
          ],
          [
            'seccomp',
            'Syscall-level filtering',
            'Minimal; in-kernel checks',
            'Moderate; requires syscall knowledge',
            'No',
            'Blocking dangerous system calls',
          ],
          [
            'Network Namespaces',
            'Complete network stack isolation',
            'Minimal; kernel-native',
            'Moderate; requires networking knowledge',
            'Yes (for initial setup)',
            'Deny-by-default network isolation',
          ],
        ]}
        highlightDiffs
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why NemoClaw Chose Landlock + seccomp + Network Namespaces
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's security architecture is built on the combination of Landlock, seccomp, and
        network namespaces. This choice reflects a careful balancing of several design goals:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">No container or VM dependency:</span> NemoClaw runs
          directly on the host system without requiring Docker, Podman, or a hypervisor. This
          dramatically simplifies deployment -- especially on bare metal, development machines,
          and edge environments where container runtimes may not be available or desired.
        </li>
        <li>
          <span className="font-semibold">Minimal performance overhead:</span> All three mechanisms
          operate at the kernel level with negligible performance impact. There is no
          virtualization layer, no container runtime overhead, and no additional process scheduling.
          The agent runs at near-native speed.
        </li>
        <li>
          <span className="font-semibold">Defense in depth:</span> Each mechanism covers a different
          dimension of security. Landlock handles filesystem access, seccomp handles system call
          filtering, and network namespaces handle network isolation. A vulnerability in any single
          mechanism does not compromise the others.
        </li>
        <li>
          <span className="font-semibold">Unprivileged self-sandboxing:</span> Landlock and seccomp
          can be applied by unprivileged processes to themselves. The NemoClaw runtime (OpenShell)
          drops its own privileges at startup, meaning the sandbox is applied from within rather
          than requiring external enforcement.
        </li>
        <li>
          <span className="font-semibold">Declarative policy model:</span> Policies for all three
          mechanisms are defined in simple configuration files. Operators can specify allowed
          filesystem paths, allowed network endpoints, and allowed system calls without writing
          code or understanding kernel internals.
        </li>
      </ul>

      <NoteBlock type="info" title="Composability Is Key">
        <p>
          The power of NemoClaw's approach lies not in any single mechanism but in their
          composition. Landlock alone cannot prevent network-based data exfiltration. seccomp alone
          cannot restrict filesystem access. Network namespaces alone cannot prevent reading
          sensitive files. Together, they create a comprehensive security boundary that addresses
          filesystem, network, and system call attack surfaces simultaneously. This is the
          defense-in-depth principle applied at the kernel level.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will dive deep into each of these three mechanisms -- Landlock,
        seccomp, and network namespaces -- to understand how they work at a technical level and how
        NemoClaw uses them to create a robust agent sandbox.
      </p>
    </div>
  )
}
