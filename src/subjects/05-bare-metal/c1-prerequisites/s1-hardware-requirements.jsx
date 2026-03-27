import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock } from '../../../components/content'

export default function HardwareRequirements() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Hardware Requirements
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before installing NemoClaw on bare metal or a Linux workstation, it is essential to understand
        the hardware requirements. NemoClaw runs sandboxed environments that package an entire
        operating system image, an OpenShell runtime, and your agent workloads inside isolated
        containers. This means your host machine must have enough CPU, memory, and disk to support
        both the host operating system and at least one running sandbox.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The requirements vary depending on what you plan to do. A developer running a single sandbox
        for experimentation needs far less than an operator running multiple concurrent sandboxes
        with GPU workloads. This section covers the minimum, recommended, and production-grade
        hardware specifications.
      </p>

      <DefinitionBlock
        term="NemoClaw Sandbox"
        definition="A lightweight, isolated container environment created by NemoClaw that encapsulates an OpenShell runtime, a set of security policies, and the agent workload. Each sandbox consumes its own CPU, memory, and disk resources on the host machine."
        example="Running `nemoclaw onboard` creates a sandbox from a blueprint image (~2.4 GB compressed, ~6 GB uncompressed on disk)."
        seeAlso={['Blueprint', 'OpenShell', 'Container Isolation']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Minimum Requirements
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        These are the absolute minimum specifications needed to run a single NemoClaw sandbox. Running
        at these minimums is suitable only for initial testing and is not recommended for sustained
        development work.
      </p>

      <ComparisonTable
        title="Minimum Hardware Specifications"
        headers={['Resource', 'Minimum', 'Notes']}
        rows={[
          ['CPU', '4 vCPUs', 'x86_64 or ARM64 architecture'],
          ['RAM', '8 GB', 'Host OS + 1 sandbox; expect swapping under load'],
          ['Disk', '20 GB free', 'Sandbox image ~2.4 GB compressed, ~6 GB uncompressed'],
          ['Network', 'Broadband internet', 'Required for initial image download and updates'],
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        You can check your current hardware resources using standard Linux commands. Run these to
        verify that your machine meets the minimum thresholds before proceeding with installation.
      </p>

      <CodeBlock
        title="Check CPU count"
        language="bash"
        code={`# Check number of CPU cores
nproc
# Or for more detail:
lscpu | grep -E "^CPU\\(s\\)|^Model name|^Architecture"`}
      />

      <CodeBlock
        title="Check available RAM"
        language="bash"
        code={`# Check total and available memory
free -h
# Look at the "total" and "available" columns`}
      />

      <CodeBlock
        title="Check available disk space"
        language="bash"
        code={`# Check disk space on the root partition
df -h /
# Docker images typically live under /var/lib/docker
df -h /var/lib/docker 2>/dev/null || echo "Docker not yet installed"`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Recommended Specifications
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For a comfortable development experience -- running one or two sandboxes simultaneously,
        with room for the agent to execute build processes, run tests, and perform file operations
        without constant resource pressure -- the following specifications are recommended.
      </p>

      <ComparisonTable
        title="Recommended Hardware by Use Case"
        headers={['Use Case', 'CPU', 'RAM', 'Disk']}
        rows={[
          ['Single sandbox (development)', '4-6 vCPUs', '16 GB', '40 GB free'],
          ['Two concurrent sandboxes', '8 vCPUs', '16-32 GB', '60 GB free'],
          ['GPU workloads (ML/AI)', '8+ vCPUs', '32 GB+', '100 GB+ free'],
          ['Production (multi-sandbox)', '16+ vCPUs', '64 GB+', '200 GB+ SSD'],
        ]}
      />

      <NoteBlock type="tip" title="SSD vs HDD Makes a Significant Difference">
        <p>
          NemoClaw sandboxes perform frequent filesystem operations -- reading policies, writing
          logs, and executing agent workloads that may involve compiling code or installing packages.
          An SSD (especially NVMe) dramatically improves sandbox startup time and overall
          responsiveness. On a spinning HDD, sandbox creation can take 3-5x longer, and agent
          operations that touch the filesystem will feel noticeably sluggish.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Understanding the Sandbox Image Size
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When you first run <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw onboard</code>,
        the CLI downloads a compressed sandbox blueprint image. This image is approximately 2.4 GB
        compressed and expands to roughly 6 GB on disk. The image contains a minimal Linux userland,
        the OpenShell runtime, default security policies, and the tooling necessary for agent
        operations.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Each sandbox you create shares the base image layers (thanks to Docker's copy-on-write
        filesystem), so running two sandboxes does not double the disk usage. However, each sandbox
        creates its own writable layer for any modifications the agent makes -- installed packages,
        generated files, logs, and so on. Plan for an additional 2-5 GB per sandbox for this
        writable layer, depending on workload.
      </p>

      <CodeBlock
        title="Estimate Docker disk usage"
        language="bash"
        code={`# After installation, check how much space Docker is consuming
docker system df

# For detailed breakdown:
docker system df -v`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Virtualization and Cloud Instances
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw works inside virtual machines and cloud instances, not just on physical hardware.
        If you are provisioning a cloud VM for NemoClaw development, the same resource guidelines
        apply. When selecting an instance type, keep the following in mind:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">AWS:</span> A <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">t3.xlarge</code> (4 vCPUs, 16 GB RAM) is a good starting point. For GPU work, use a <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">g4dn.xlarge</code> or better.
        </li>
        <li>
          <span className="font-semibold">GCP:</span> An <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">e2-standard-4</code> or <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">n2-standard-4</code> instance works well.
        </li>
        <li>
          <span className="font-semibold">Azure:</span> A <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">Standard_D4s_v5</code> provides 4 vCPUs and 16 GB RAM.
        </li>
      </ul>

      <WarningBlock title="Nested Virtualization">
        <p>
          NemoClaw uses Docker containers, which rely on Linux kernel features. If you are running
          inside a VM, ensure that the VM supports nested containerization. Most modern cloud
          providers support this by default, but some on-premises hypervisors (especially older
          versions of VMware or Hyper-V) may require explicit configuration to enable it. Without
          proper container support, sandbox creation will fail.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GPU Considerations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If your agent workloads involve machine learning inference, model fine-tuning, or any
        CUDA-based computation, you will need an NVIDIA GPU. NemoClaw supports GPU passthrough
        to sandboxes via the nvidia-container-toolkit. The GPU requirements depend on your specific
        workload, but as a general guideline:
      </p>

      <ComparisonTable
        title="GPU Requirements by Workload"
        headers={['Workload', 'Minimum GPU', 'VRAM']}
        rows={[
          ['No GPU workloads', 'Not required', 'N/A'],
          ['Small model inference', 'NVIDIA T4 or GTX 1080', '8 GB'],
          ['Medium model inference', 'NVIDIA A10G or RTX 3090', '24 GB'],
          ['Large model / fine-tuning', 'NVIDIA A100 or H100', '40-80 GB'],
        ]}
      />

      <NoteBlock type="info" title="GPU Setup is Covered Later">
        <p>
          Detailed GPU passthrough configuration is covered in the Ubuntu 24.04 / DGX chapter.
          For now, just ensure your hardware meets the baseline CPU, RAM, and disk requirements.
          GPU setup is an optional, additive step.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="A developer wants to run two NemoClaw sandboxes simultaneously for testing. Which of the following is the recommended minimum RAM?"
        options={[
          '4 GB',
          '8 GB',
          '16 GB',
          '64 GB',
        ]}
        correctIndex={2}
        explanation="For two concurrent sandboxes, 16-32 GB of RAM is recommended. 8 GB is the absolute minimum for a single sandbox, and 4 GB is insufficient. 64 GB is recommended for production multi-sandbox deployments."
      />
    </div>
  )
}
