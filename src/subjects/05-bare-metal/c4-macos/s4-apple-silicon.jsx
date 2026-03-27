import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock, ExerciseBlock } from '../../../components/content'

export default function AppleSilicon() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Apple Silicon Considerations
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Apple Silicon Macs (M1, M2, M3, M4 and their Pro/Max/Ultra variants) use the ARM64
        (aarch64) architecture rather than x86_64 (Intel). This has direct implications for
        NemoClaw because container images, the Linux VM, and any binaries inside sandboxes must
        be compatible with the ARM64 architecture. NemoClaw supports Apple Silicon natively, but
        there are nuances worth understanding.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        ARM64 Native Support
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw publishes its blueprint images for both x86_64 and ARM64 architectures. When you
        run <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw onboard</code> on
        an Apple Silicon Mac, it automatically pulls the ARM64 version of the blueprint. The Linux
        VM created by Colima also runs an ARM64 Linux kernel. This means everything runs natively
        -- no emulation is involved for NemoClaw's core functionality.
      </p>

      <CodeBlock
        title="Verify architecture"
        language="bash"
        code={`# Check host architecture
arch
# Expected on Apple Silicon: arm64

# Check Colima VM architecture
colima ssh -- uname -m
# Expected: aarch64

# Check sandbox architecture
nemoclaw my-sandbox exec -- uname -m
# Expected: aarch64

# Verify the blueprint is ARM64
docker inspect nemoclaw-base:latest --format '{{.Architecture}}'
# Expected: arm64`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Rosetta for x86 Images
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Some agent workloads may depend on x86-only container images or binaries. Apple's Rosetta
        2 translation layer can run x86_64 binaries on ARM64, and Colima can be configured to
        enable Rosetta translation inside the Linux VM. This allows x86_64 Docker images to run
        on Apple Silicon, albeit with a performance penalty.
      </p>

      <CodeBlock
        title="Enable Rosetta support in Colima"
        language="bash"
        code={`# Start Colima with Rosetta enabled (requires macOS 13+)
colima start \\
  --cpu 4 \\
  --memory 12 \\
  --disk 40 \\
  --vm-type vz \\
  --mount-type virtiofs \\
  --rosetta

# Verify Rosetta is available inside the VM
colima ssh -- cat /proc/sys/fs/binfmt_misc/rosetta
# Should show: enabled

# Test running an x86_64 image
docker run --rm --platform linux/amd64 ubuntu:22.04 uname -m
# Output: x86_64 (running via Rosetta translation)`}
      />

      <WarningBlock title="Rosetta Performance Overhead">
        <p>
          Running x86_64 binaries via Rosetta incurs a 20-40% performance penalty compared to
          native ARM64 execution. For NemoClaw, always use the native ARM64 blueprint (the default).
          Only use Rosetta for specific agent workloads that require x86-only tools or libraries.
          If an agent primarily needs x86 execution, consider running NemoClaw on an Intel/AMD
          Linux machine instead.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Performance Across Apple Silicon Generations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw performance varies across Apple Silicon generations based on CPU core count,
        memory bandwidth, and total available memory. The following table provides guidance on
        what to expect.
      </p>

      <ComparisonTable
        title="NemoClaw Performance by Apple Silicon"
        headers={['Chip', 'Max RAM', 'Recommended Sandboxes', 'Notes']}
        rows={[
          ['M1 (8 GB)', '8 GB', '1 sandbox (tight)', 'Minimum viable; expect memory pressure'],
          ['M1 (16 GB)', '16 GB', '1-2 sandboxes', 'Comfortable for development'],
          ['M1 Pro/Max', '32-64 GB', '2-4 sandboxes', 'Good performance; more CPU cores help'],
          ['M2 (8 GB)', '8 GB', '1 sandbox (tight)', 'Similar to M1 8 GB'],
          ['M2 Pro/Max', '32-96 GB', '2-4 sandboxes', 'Fast single-core boosts sandbox startup'],
          ['M3 Pro/Max', '36-128 GB', '3-6 sandboxes', 'Best single-core performance'],
          ['M4 Pro/Max', '48-128 GB', '3-6 sandboxes', 'Latest generation; excellent performance'],
          ['M1/M2 Ultra', '128-192 GB', '6-10+ sandboxes', 'Mac Studio/Pro; production-viable'],
        ]}
      />

      <NoteBlock type="tip" title="Memory Is the Primary Constraint">
        <p>
          On Apple Silicon Macs, CPU is rarely the bottleneck for NemoClaw. Memory is the primary
          constraint because it is shared between macOS, the Colima VM, and all sandboxes. A Mac
          with 8 GB of RAM can run one sandbox but will frequently experience memory pressure. 16
          GB is the recommended minimum, and 32 GB provides a comfortable multi-sandbox experience.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Colima VM Type: VZ vs QEMU
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        On Apple Silicon, Colima supports two VM backends: VZ (Apple Virtualization.framework) and
        QEMU. The choice significantly affects performance.
      </p>

      <ComparisonTable
        title="VZ vs QEMU on Apple Silicon"
        headers={['Feature', 'VZ (Virtualization.framework)', 'QEMU']}
        highlightDiffs
        rows={[
          ['Performance', 'Near-native', '~70-80% of native'],
          ['Startup time', '2-3 seconds', '5-10 seconds'],
          ['VirtioFS support', 'Yes', 'Yes (9P also available)'],
          ['Rosetta support', 'Yes (macOS 13+)', 'No'],
          ['Stability', 'Excellent', 'Good'],
          ['Recommended', 'Yes', 'Only if VZ is not available'],
        ]}
      />

      <CodeBlock
        title="Use VZ backend (recommended)"
        language="bash"
        code={`# Start with VZ (recommended for Apple Silicon)
colima start --vm-type vz --mount-type virtiofs --cpu 4 --memory 12

# If VZ is not available (older macOS), fall back to QEMU:
colima start --vm-type qemu --cpu 4 --memory 12`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Multi-Architecture Agent Workloads
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If your agent needs to build or test software for both ARM64 and x86_64 targets (for example,
        building Docker images that will run on x86 servers), you can use Docker's buildx with
        multi-platform support inside a NemoClaw sandbox.
      </p>

      <CodeBlock
        title="Multi-architecture builds inside a sandbox"
        language="bash"
        code={`# Inside a NemoClaw sandbox on Apple Silicon:

# Check available platforms
docker buildx ls
# Should show linux/arm64 (native) and linux/amd64 (via Rosetta or QEMU)

# Build a multi-platform image
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest .`}
      />

      <ExerciseBlock
        question="When running NemoClaw on an Apple Silicon Mac with 16 GB of RAM, what is the primary resource constraint?"
        options={[
          'CPU core count',
          'GPU acceleration',
          'Memory shared between macOS, VM, and sandboxes',
          'Disk I/O speed',
        ]}
        correctIndex={2}
        explanation="Memory is the primary constraint on Apple Silicon Macs because it is shared between macOS, the Colima VM, and all NemoClaw sandboxes. With 16 GB, you can comfortably run 1-2 sandboxes. CPU is rarely the bottleneck thanks to Apple Silicon's strong single-core performance."
      />
    </div>
  )
}
