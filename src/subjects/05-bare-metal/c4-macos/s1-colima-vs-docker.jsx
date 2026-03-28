import { CodeBlock, NoteBlock, ComparisonTable, DefinitionBlock } from '../../../components/content'

export default function ColimaVsDocker() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Colima vs Docker Desktop on macOS
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        macOS does not run containers natively. Unlike Linux, where Docker uses the host kernel's
        namespaces and cgroups directly, Docker on macOS must run a Linux virtual machine and
        execute containers inside that VM. There are two primary approaches to providing this
        Linux VM on macOS: Docker Desktop and Colima. Understanding the differences between
        these two options is important for choosing the right setup for NemoClaw.
      </p>

      <DefinitionBlock
        term="Colima"
        definition="A lightweight, open-source command-line tool that creates and manages Linux virtual machines on macOS (and Linux) for running container runtimes. Colima uses Lima (Linux Machines) under the hood, which provisions a VM using the macOS Virtualization.framework (on Apple Silicon) or QEMU. It provides a Docker-compatible socket without the Docker Desktop GUI or licensing requirements."
        example="Running `colima start --cpu 4 --memory 8` creates a Linux VM with 4 CPUs and 8 GB RAM, then exposes a Docker socket at the default location so that `docker` CLI commands work transparently."
        seeAlso={['Lima', 'Docker Desktop', 'Virtualization.framework']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Side-by-Side Comparison
      </h2>

      <ComparisonTable
        title="Colima vs Docker Desktop"
        headers={['Feature', 'Colima', 'Docker Desktop']}
        highlightDiffs
        rows={[
          ['Interface', 'CLI only', 'GUI + CLI'],
          ['License', 'MIT (free for all use)', 'Free for personal/small business; paid for enterprise'],
          ['Resource usage', 'Lightweight (~200 MB idle)', 'Heavier (~500+ MB idle)'],
          ['VM backend (Apple Silicon)', 'Virtualization.framework', 'Virtualization.framework'],
          ['VM backend (Intel Mac)', 'QEMU', 'HyperKit or QEMU'],
          ['Docker Compose', 'Supported (via plugin)', 'Built-in'],
          ['Kubernetes', 'Optional (k3s)', 'Built-in (single-node)'],
          ['File sharing', 'VirtioFS or 9P', 'VirtioFS, gRPC FUSE, osxfs'],
          ['Volume performance', 'Good with VirtioFS', 'Good with VirtioFS (macOS 12.5+)'],
          ['NemoClaw compatible', 'Yes (recommended)', 'Yes'],
          ['Update mechanism', 'brew upgrade colima', 'Auto-update in app'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why Colima Is Recommended for NemoClaw
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw recommends Colima on macOS for several reasons:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">No licensing concerns:</span> Colima is MIT-licensed and
          free for all users, including enterprise. Docker Desktop requires a paid subscription for
          organizations with more than 250 employees or $10M in annual revenue.
        </li>
        <li>
          <span className="font-semibold">Lower resource overhead:</span> Colima's VM is lighter
          weight, leaving more resources available for NemoClaw sandboxes. This matters because
          both the VM and the sandboxes compete for CPU and memory.
        </li>
        <li>
          <span className="font-semibold">Precise resource control:</span> Colima lets you specify
          exact CPU and memory allocations for the VM at startup. Docker Desktop also allows this
          but through a GUI settings panel.
        </li>
        <li>
          <span className="font-semibold">Scriptability:</span> Colima is fully CLI-driven, making
          it easy to script and automate setup. This aligns with NemoClaw's CLI-first approach.
        </li>
        <li>
          <span className="font-semibold">Transparency:</span> Colima uses well-known open-source
          components (Lima, QEMU, Virtualization.framework) with clear behavior. Docker Desktop is
          a proprietary application with complex internal behavior.
        </li>
      </ul>

      <NoteBlock type="info" title="Docker Desktop Works Too">
        <p>
          If you already have Docker Desktop installed and configured, NemoClaw works with it
          perfectly well. You do not need to switch to Colima. The NemoClaw CLI communicates with
          Docker through the standard Docker socket, so it is agnostic to whether Colima or Docker
          Desktop provides that socket. The recommendation for Colima is about simplicity and
          licensing, not functionality.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Resource Allocation for NemoClaw
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        On macOS, the Linux VM that runs containers must be given explicit CPU and memory
        allocations from the host. These resources are reserved -- they are not shared dynamically
        with macOS. You need to allocate enough to the VM for both Docker itself and at least one
        NemoClaw sandbox.
      </p>

      <ComparisonTable
        title="Recommended VM Resources for NemoClaw"
        headers={['Use Case', 'VM CPUs', 'VM Memory', 'VM Disk']}
        rows={[
          ['Single sandbox (light)', '4', '8 GB', '30 GB'],
          ['Single sandbox (development)', '4-6', '12 GB', '40 GB'],
          ['Two sandboxes', '6-8', '16 GB', '60 GB'],
        ]}
      />

      <CodeBlock
        title="Configure Colima resources"
        language="bash"
        code={`# Start Colima with recommended resources for NemoClaw
colima start --cpu 4 --memory 12 --disk 40

# Or modify an existing Colima instance:
colima stop
colima start --cpu 6 --memory 16 --disk 60

# Verify the VM resources:
colima status
# INFO[0000] colima is running using macOS Virtualization.Framework
# INFO[0000] runtime: docker
# INFO[0000] arch: aarch64
# INFO[0000] cpus: 4
# INFO[0000] memory: 12 GiB
# INFO[0000] disk: 40 GiB`}
      />

      <CodeBlock
        title="Configure Docker Desktop resources"
        language="bash"
        code={`# Docker Desktop resources are configured in the GUI:
# Docker Desktop > Settings > Resources > Advanced
#   CPUs: 4+
#   Memory: 12+ GB
#   Virtual disk limit: 40+ GB
#
# Or via the settings file:
cat ~/Library/Group\\ Containers/group.com.docker/settings.json | \\
  python3 -c "import sys,json; d=json.load(sys.stdin); print(f'CPUs: {d.get(\"cpus\")}, Memory: {d.get(\"memoryMiB\")} MB')"
`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Switching Between Colima and Docker Desktop
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        You should only run one container runtime at a time. Running both Colima and Docker Desktop
        simultaneously causes Docker socket conflicts. If switching, stop one before starting the
        other.
      </p>

      <CodeBlock
        title="Switch between runtimes"
        language="bash"
        code={`# Stop Docker Desktop (from CLI):
osascript -e 'quit app "Docker Desktop"'

# Start Colima:
colima start --cpu 4 --memory 12

# OR stop Colima and use Docker Desktop:
colima stop
open -a "Docker Desktop"`}
      />

      <NoteBlock type="tip" title="Check Which Docker Socket Is Active">
        <p>
          Use <code>docker context ls</code> to see which Docker context is active. If you see
          both Colima and Desktop contexts, ensure only the intended one is marked as current.
          Use <code>docker context use colima</code> or <code>docker context use default</code> to
          switch.
        </p>
      </NoteBlock>
    </div>
  )
}
