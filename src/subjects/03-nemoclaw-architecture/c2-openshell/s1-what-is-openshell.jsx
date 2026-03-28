import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, ArchitectureDiagram, WarningBlock, ReferenceList } from '../../../components/content';

export default function WhatIsOpenShell() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        What Is OpenShell?
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NVIDIA OpenShell is the sandbox runtime that NemoClaw uses to isolate autonomous
        agents. It is part of the broader NVIDIA Agent Toolkit and provides
        kernel-level isolation using Linux Security Modules (LSMs), seccomp filters,
        and network namespaces. If NemoClaw is the brain that decides what the sandbox
        should look like, OpenShell is the hands that build and enforce it.
      </p>

      <DefinitionBlock
        term="OpenShell"
        definition="A lightweight sandbox runtime developed by NVIDIA that provides container-like isolation without requiring a container runtime. It uses Landlock LSM for filesystem access control, seccomp-bpf for syscall filtering, and Linux network namespaces for network isolation. OpenShell is designed specifically for isolating AI agent workloads."
        example="openshell create --name my-sandbox --policy ./sandbox-policy.yaml"
        seeAlso={['Landlock LSM', 'seccomp-bpf', 'Network Namespace', 'NVIDIA Agent Toolkit']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Container-Like, But Different
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Developers familiar with Docker or Podman will find OpenShell conceptually similar
        but architecturally different. Containers use kernel namespaces (PID, mount,
        network, user) combined with cgroups to create isolated environments.
        OpenShell uses a different approach: it relies primarily on <strong>LSM
        enforcement</strong> (Landlock) rather than mount namespaces for filesystem
        isolation. This gives it some distinct advantages and trade-offs.
      </p>

      <ComparisonTable
        title="OpenShell vs. Traditional Containers"
        headers={['Aspect', 'Docker/Podman', 'OpenShell']}
        rows={[
          ['Filesystem isolation', 'Mount namespace (overlay FS)', 'Landlock LSM (kernel-level ACLs)'],
          ['Syscall filtering', 'seccomp (optional)', 'seccomp (always on)'],
          ['Network isolation', 'Network namespace + veth', 'Network namespace + gateway bridge'],
          ['Root required', 'Rootless mode available but complex', 'No root required (unprivileged Landlock)'],
          ['Image required', 'Yes (OCI image)', 'No (uses host filesystem with restrictions)'],
          ['Startup time', '~500ms-2s', '~50-200ms'],
          ['Overhead', 'Moderate (overlay FS, cgroups)', 'Minimal (LSM hooks only)'],
          ['Use case', 'General workloads', 'AI agent isolation'],
        ]}
        highlightDiffs
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        The Three Pillars of OpenShell Isolation
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenShell's security model rests on three enforcement mechanisms, each operating
        at the kernel level:
      </p>

      <ArchitectureDiagram
        title="OpenShell Isolation Layers"
        components={[
          { name: 'Landlock LSM', description: 'Filesystem access control', color: 'blue' },
          { name: 'seccomp-bpf', description: 'Syscall filtering', color: 'green' },
          { name: 'Network Namespace', description: 'Network isolation', color: 'purple' },
        ]}
        connections={[
          { from: 'Landlock LSM', to: 'seccomp-bpf', label: 'defense in depth' },
          { from: 'seccomp-bpf', to: 'Network Namespace', label: 'defense in depth' },
        ]}
      />

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Landlock LSM</strong> -- Controls which files and directories the sandboxed
          process can read, write, and execute. Unlike traditional Unix permissions,
          Landlock rules are enforced at the kernel level and cannot be bypassed by the
          process, even if it somehow gains root inside the sandbox. Landlock rules are
          applied per-process and inherited by child processes.
        </li>
        <li>
          <strong>seccomp-bpf</strong> -- Filters which system calls the sandboxed process can
          make. This prevents privilege escalation attacks that rely on dangerous syscalls
          like <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">ptrace</code>,
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">mount</code>, or
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">reboot</code>.
          The filter is compiled into BPF bytecode and loaded into the kernel, making it
          extremely fast.
        </li>
        <li>
          <strong>Network Namespaces</strong> -- Gives the sandbox its own network stack
          completely isolated from the host. The sandbox cannot see or interact with the
          host's network interfaces. The only network access available is through the
          OpenShell gateway, which forwards approved traffic according to policy.
        </li>
      </ul>

      <NoteBlock type="info" title="LSM Enforcement vs. Container Isolation">
        A key insight is that Landlock operates at the <em>system call</em> level, not
        at the filesystem level. When a process inside a Landlock sandbox calls{' '}
        <code>open("/etc/passwd", O_RDONLY)</code>, the kernel's LSM hook checks the
        Landlock ruleset before granting access. There is no separate filesystem
        layer, no overlay, no copy-on-write. The process sees the real host
        filesystem but can only access what the rules allow. This is faster and simpler
        than container overlay filesystems, but it means the sandbox shares the host's
        filesystem content (read-only paths show the host's actual files).
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Why Not Just Use Containers?
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw could have been built on Docker or another OCI runtime, but OpenShell
        was chosen for several reasons specific to the AI agent use case:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>No image management</strong> -- agents need access to the user's project
          files. With containers, this requires bind mounts, volume configuration, and
          careful UID mapping. OpenShell just restricts access to the existing filesystem.
        </li>
        <li>
          <strong>Sub-second startup</strong> -- agents may start and stop sandboxes
          frequently during a session. Container startup (even rootless) takes 500ms-2s.
          OpenShell sandboxes start in 50-200ms.
        </li>
        <li>
          <strong>No daemon</strong> -- Docker requires dockerd; Podman is daemonless but
          still requires conmon. OpenShell is a single process with no background daemon.
        </li>
        <li>
          <strong>Unprivileged by default</strong> -- Landlock is available to unprivileged
          processes on kernels 5.13+. No root, no setuid, no capabilities needed.
        </li>
      </ul>

      <WarningBlock title="Kernel Version Requirement">
        OpenShell requires Linux kernel 5.13 or later for Landlock support. For full
        functionality (including Landlock ABI v3 with network port restrictions),
        kernel 6.2 or later is recommended. Run{' '}
        <code>uname -r</code> to check your kernel version. macOS and Windows are not
        supported -- OpenShell is Linux-only by design.
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        OpenShell in the NemoClaw Stack
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenShell is a dependency of the NemoClaw blueprint, not something users install
        or manage separately. When the blueprint's Apply stage runs, it calls OpenShell's
        API to create and configure the sandbox. The blueprint translates high-level
        policy declarations (like "allow network access to pypi.org") into low-level
        OpenShell configuration (Landlock rules, seccomp filters, network namespace
        rules).
      </p>

      <CodeBlock
        title="Checking OpenShell availability"
        language="bash"
        code={`# Verify OpenShell is installed and the kernel supports it
$ openshell check
OpenShell v1.4.0
  Landlock: supported (ABI v4, kernel 6.8.0)
  seccomp:  supported (bpf, kernel 6.8.0)
  netns:    supported
  Status:   ready

# If Landlock is not supported:
$ openshell check
OpenShell v1.4.0
  Landlock: NOT SUPPORTED (kernel 5.10 < 5.13 required)
  seccomp:  supported
  netns:    supported
  Status:   degraded (filesystem isolation unavailable)`}
      />

      <NoteBlock type="tip" title="Quick Orientation">
        You rarely interact with OpenShell directly. NemoClaw's blueprint handles all
        OpenShell calls. The main exception is the{' '}
        <code>openshell term</code> command, which opens a TUI for monitoring sandbox
        activity. Think of OpenShell as the engine inside the car -- NemoClaw is the
        driver.
      </NoteBlock>

      <ReferenceList
        references={[
          {
            title: 'NVIDIA OpenShell Documentation',
            url: 'https://docs.nvidia.com/openshell/',
            type: 'docs',
            description: 'Official documentation for the OpenShell sandbox runtime.',
          },
          {
            title: 'NVIDIA Agent Toolkit',
            url: 'https://developer.nvidia.com/agent-toolkit',
            type: 'docs',
            description: 'The broader toolkit that includes OpenShell, NemoClaw, and other agent infrastructure.',
          },
          {
            title: 'Landlock LSM Kernel Documentation',
            url: 'https://docs.kernel.org/userspace-api/landlock.html',
            type: 'docs',
            description: 'Linux kernel documentation for the Landlock security module.',
          },
        ]}
      />
    </div>
  );
}
