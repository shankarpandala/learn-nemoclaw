import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock } from '../../../components/content'

export default function MacosLimitations() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        macOS Limitations
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While NemoClaw works well on macOS, there are important differences compared to running
        on native Linux. These differences stem from the fundamental architecture: on macOS,
        containers run inside a Linux virtual machine, adding a layer of indirection that affects
        security, performance, and feature availability. Understanding these limitations helps
        set appropriate expectations and avoid frustration.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        No Host-Level Landlock
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock is a Linux kernel security module. Since macOS is not Linux, Landlock is not
        available on the macOS host. However, NemoClaw sandboxes run inside a Linux VM (Colima
        or Docker Desktop), and that VM does have a Linux kernel. The practical implications are:
      </p>

      <ComparisonTable
        title="Landlock Availability: Linux vs macOS"
        headers={['Layer', 'Native Linux', 'macOS (Colima/Docker Desktop)']}
        highlightDiffs
        rows={[
          ['Host kernel Landlock', 'Available (5.13+)', 'Not available (macOS kernel)'],
          ['VM kernel Landlock', 'N/A (no VM)', 'Available inside the Linux VM'],
          ['Sandbox Landlock', 'Yes, kernel-enforced', 'Yes, but VM kernel-enforced'],
          ['Escape to host via Landlock bypass', 'Reaches host OS', 'Reaches VM only (not macOS host)'],
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In practice, sandboxes on macOS use Landlock within the Linux VM's kernel. If an agent
        were to bypass Landlock (which is extremely difficult), it would escape into the Linux VM,
        not into macOS itself. This means macOS actually provides an additional isolation layer
        (the VM boundary) that native Linux does not have. However, NemoClaw cannot enforce
        Landlock policies at the macOS host level for any operations outside the VM.
      </p>

      <NoteBlock type="info" title="The VM Is an Extra Security Layer">
        <p>
          Ironically, the VM layer that limits macOS functionality also provides additional
          security. A sandbox escape on native Linux reaches the host OS. A sandbox escape on
          macOS reaches the Colima/Docker Desktop VM, which itself is isolated from macOS by the
          hypervisor. This is defense in depth -- not by design, but by architecture.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Network Namespace Differences
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        On native Linux, NemoClaw can create network namespaces that provide fine-grained network
        isolation for sandboxes -- controlling exactly which IP ranges, ports, and DNS servers the
        sandbox can access. On macOS, the networking story is more complex because of the VM layer.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Port mapping:</span> Sandbox ports must be mapped
          through the VM to be accessible from macOS. On native Linux, port mapping goes
          directly from the container to the host. On macOS, it goes container to VM to macOS
          -- an extra hop that can cause subtle differences.
        </li>
        <li>
          <span className="font-semibold">DNS resolution:</span> Sandboxes on macOS resolve DNS
          through the VM's network stack, which forwards to macOS's resolver. This usually works
          transparently but can cause issues with corporate VPNs or split-DNS configurations.
        </li>
        <li>
          <span className="font-semibold">Host network mode:</span> The <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">--network host</code> mode
          gives the sandbox access to the VM's network, not the macOS host's network. This is
          a common source of confusion.
        </li>
        <li>
          <span className="font-semibold">mDNS / Bonjour:</span> macOS local network services
          discovered via mDNS (Bonjour) are not directly accessible from inside sandboxes. The
          VM has its own network namespace that does not participate in mDNS.
        </li>
      </ul>

      <CodeBlock
        title="Debugging network issues on macOS"
        language="bash"
        code={`# Check sandbox network from inside
nemoclaw my-sandbox exec -- ip addr show
nemoclaw my-sandbox exec -- cat /etc/resolv.conf

# Test connectivity from sandbox to internet
nemoclaw my-sandbox exec -- curl -s https://httpbin.org/ip

# Test connectivity from macOS to sandbox exposed ports
# If sandbox exposes port 8080:
curl http://localhost:8080

# Check Colima VM's IP address
colima status | grep "address"
# Or:
colima ssh -- ip addr show`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Performance Considerations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The VM layer introduces performance overhead. While modern hypervisors (especially Apple's
        Virtualization.framework) are efficient, there are measurable differences compared to
        running NemoClaw on native Linux.
      </p>

      <ComparisonTable
        title="Performance: Native Linux vs macOS VM"
        headers={['Operation', 'Native Linux', 'macOS (Colima VZ + VirtioFS)']}
        highlightDiffs
        rows={[
          ['Sandbox startup', '2-3 seconds', '5-8 seconds'],
          ['CPU-bound tasks', 'Full native speed', '~95-98% native speed'],
          ['File I/O (inside sandbox)', 'Full native speed', '~90-95% native speed'],
          ['File I/O (mounted host dirs)', 'Full native speed', '~60-80% native speed'],
          ['Network throughput', 'Full native speed', '~90% native speed'],
          ['Memory overhead', '~100 MB per sandbox', '~100 MB + VM overhead (~300 MB)'],
        ]}
      />

      <WarningBlock title="Mounted Host Directories Are Slow">
        <p>
          Mounting macOS host directories into sandboxes (for accessing your code on the Mac
          filesystem from inside the sandbox) incurs significant I/O overhead because every file
          operation must cross the VM boundary. For performance-sensitive workloads, copy files
          into the sandbox rather than mounting them. VirtioFS (with Colima's <code>--mount-type virtiofs</code>)
          provides the best performance, but it is still slower than native filesystem access.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        No GPU Passthrough
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        macOS does not support passing NVIDIA GPUs to the Linux VM. This is because macOS uses
        Apple's Metal graphics API, not NVIDIA CUDA, and Apple does not provide GPU passthrough
        to Linux VMs. If you need GPU-accelerated sandboxes, you must use a Linux machine with
        an NVIDIA GPU.
      </p>

      <NoteBlock type="info" title="Apple Neural Engine and Metal">
        <p>
          Apple Silicon chips include the Apple Neural Engine (ANE) and Metal-compatible GPU.
          These are not accessible from Linux VMs or Docker containers. Some ML frameworks
          (PyTorch, TensorFlow) support Metal via the MPS backend on the macOS host, but this
          acceleration is not available inside NemoClaw sandboxes, which run Linux.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Summary of Limitations
      </h2>

      <ComparisonTable
        title="macOS Limitation Summary"
        headers={['Limitation', 'Impact', 'Workaround']}
        rows={[
          ['No host Landlock', 'Low -- VM provides alternative isolation', 'VM boundary acts as extra layer'],
          ['Network indirection', 'Medium -- port mapping and DNS differences', 'Use bridge networking, test connectivity'],
          ['Slower file I/O for mounts', 'Medium -- affects mounted host directories', 'Use VirtioFS, or copy files into sandbox'],
          ['No NVIDIA GPU passthrough', 'High for GPU workloads', 'Use Linux machine for GPU workloads'],
          ['VM resource overhead', 'Low -- ~300 MB extra memory', 'Allocate sufficient VM resources'],
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Despite these limitations, macOS is a fully viable development platform for NemoClaw. The
        majority of agent development and testing workflows operate without any noticeable
        difference. The limitations primarily affect advanced use cases: GPU workloads, high-performance
        file I/O with mounted directories, and complex network configurations.
      </p>
    </div>
  )
}
