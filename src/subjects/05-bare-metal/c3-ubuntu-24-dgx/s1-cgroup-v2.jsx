import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock } from '../../../components/content'

export default function CgroupV2() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Understanding cgroup v2 on Ubuntu 24.04
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Ubuntu 24.04 LTS (Noble Numbat) introduces a significant change from Ubuntu 22.04: it uses
        cgroup v2 (also called the unified cgroup hierarchy) as the default and only cgroup
        implementation. Ubuntu 22.04 used cgroup v1 by default with cgroup v2 available as an
        opt-in. This change affects how container runtimes manage resource limits and process
        isolation, and it has direct implications for NemoClaw sandbox management.
      </p>

      <DefinitionBlock
        term="Control Groups (cgroups)"
        definition="A Linux kernel feature that organizes processes into hierarchical groups and applies resource limits (CPU, memory, I/O, network) to those groups. Container runtimes like Docker rely heavily on cgroups to enforce resource isolation between containers. cgroup v2 is the modern unified hierarchy that replaces the fragmented v1 implementation."
        example="When NemoClaw creates a sandbox with --memory 4g, Docker uses cgroups to ensure the sandbox container cannot consume more than 4 GB of RAM. If it exceeds this limit, the kernel's OOM killer terminates processes inside the container."
        seeAlso={['Container Isolation', 'Resource Limits', 'OOM Killer']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        cgroup v1 vs cgroup v2
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The transition from cgroup v1 to v2 is not merely a version bump -- it is a fundamental
        redesign of how the kernel organizes and controls process resources. Understanding the
        differences helps explain why some tools and configurations that worked on Ubuntu 22.04
        may need adjustment on Ubuntu 24.04.
      </p>

      <ComparisonTable
        title="cgroup v1 vs cgroup v2"
        headers={['Feature', 'cgroup v1', 'cgroup v2']}
        highlightDiffs
        rows={[
          ['Hierarchy', 'Multiple hierarchies (one per controller)', 'Single unified hierarchy'],
          ['Controllers', 'Each mounted separately (cpu, memory, etc.)', 'All controllers in one tree'],
          ['Delegation', 'Complex, error-prone', 'Clean delegation to unprivileged users'],
          ['Memory accounting', 'Approximate', 'Accurate, includes kernel memory'],
          ['PSI (Pressure Stall Info)', 'Not available', 'Built-in resource pressure monitoring'],
          ['Default on Ubuntu 22.04', 'Yes', 'No (opt-in)'],
          ['Default on Ubuntu 24.04', 'No (removed)', 'Yes (only option)'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Impact on Container Runtimes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Docker Engine 24+ fully supports cgroup v2, so NemoClaw sandboxes work correctly on
        Ubuntu 24.04 with modern Docker. However, some older tools and container runtimes may
        have compatibility issues:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Docker Engine 24+:</span> Full cgroup v2 support. No
          issues. This is what NemoClaw requires.
        </li>
        <li>
          <span className="font-semibold">Docker Engine 20-23:</span> Partial cgroup v2 support.
          Some resource limit features may not work correctly. Upgrade recommended.
        </li>
        <li>
          <span className="font-semibold">containerd 1.6+:</span> Full cgroup v2 support.
        </li>
        <li>
          <span className="font-semibold">Older runc versions:</span> Versions before 1.1 may
          fail to create containers on cgroup v2 systems. Docker 24+ includes a compatible runc.
        </li>
      </ul>

      <CodeBlock
        title="Verify cgroup version on your system"
        language="bash"
        code={`# Check which cgroup version is active
stat -fc %T /sys/fs/cgroup/
# "cgroup2fs" = cgroup v2 (Ubuntu 24.04)
# "tmpfs"     = cgroup v1 (Ubuntu 22.04)

# Alternative check:
mount | grep cgroup
# cgroup v2 shows: cgroup2 on /sys/fs/cgroup type cgroup2
# cgroup v1 shows: multiple cgroup mounts (cpu, memory, etc.)

# Check Docker's cgroup driver
docker info | grep "Cgroup"
# Expected on Ubuntu 24.04:
#  Cgroup Driver: systemd
#  Cgroup Version: 2`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Compatibility Issues and Solutions
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The most common cgroup v2 compatibility issue with NemoClaw is the cgroup driver mismatch.
        Docker can use either the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">cgroupfs</code> driver
        or the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">systemd</code> driver.
        On Ubuntu 24.04, the systemd driver is required because systemd manages the cgroup hierarchy.
      </p>

      <WarningBlock title="Cgroup Driver Mismatch">
        <p>
          If Docker is configured to use the <code>cgroupfs</code> driver on a cgroup v2 system,
          containers may fail to start or exhibit resource limit issues. Ensure your daemon.json
          specifies <code>"exec-opts": ["native.cgroupdriver=systemd"]</code> or omit the setting
          entirely (systemd is the default on Ubuntu 24.04).
        </p>
      </WarningBlock>

      <CodeBlock
        title="Ensure correct cgroup driver in daemon.json"
        language="json"
        code={`{
  "storage-driver": "overlay2",
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        cgroup v2 Benefits for NemoClaw
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Despite the migration complexity, cgroup v2 provides real benefits for NemoClaw sandboxes:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Accurate Memory Accounting:</span> cgroup v2 tracks
          kernel memory usage per container, giving NemoClaw more precise resource reporting.
        </li>
        <li>
          <span className="font-semibold">Pressure Stall Information (PSI):</span> NemoClaw can
          monitor resource pressure inside sandboxes, detecting when a sandbox is CPU-starved or
          memory-constrained before it hits hard limits.
        </li>
        <li>
          <span className="font-semibold">Better Delegation:</span> cgroup v2's delegation model
          allows NemoClaw to safely grant sandboxes the ability to manage their own sub-cgroups,
          enabling finer-grained resource control within the sandbox.
        </li>
        <li>
          <span className="font-semibold">Unified Hierarchy:</span> Simpler debugging and
          monitoring because all resource controllers are in a single tree rather than scattered
          across multiple mount points.
        </li>
      </ul>

      <NoteBlock type="info" title="DGX OS Uses cgroup v2">
        <p>
          NVIDIA DGX OS 6.x is based on Ubuntu 24.04 and uses cgroup v2 exclusively. All the
          cgroup v2 considerations in this section apply to DGX systems. The next section covers
          the <code>nemoclaw setup-spark</code> command, which automates the cgroup v2 configuration
          specifically for DGX Spark hardware.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In summary, cgroup v2 on Ubuntu 24.04 is fully compatible with NemoClaw when using Docker
        Engine 24+ with the systemd cgroup driver. The transition requires awareness but not major
        changes to the NemoClaw workflow. The next section covers the automated setup for DGX
        Spark systems.
      </p>
    </div>
  )
}
