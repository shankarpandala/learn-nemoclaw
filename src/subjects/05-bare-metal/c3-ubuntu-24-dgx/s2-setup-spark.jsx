import { CodeBlock, NoteBlock, StepBlock, WarningBlock, DefinitionBlock } from '../../../components/content'

export default function SetupSpark() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        DGX Spark Setup with setup-spark
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NVIDIA DGX Spark is a compact desktop AI system designed for developers, researchers,
        and data scientists. Running NemoClaw on DGX Spark requires specific configuration for
        cgroup v2, GPU access, and the DGX-optimized Docker runtime. Rather than performing these
        steps manually, NemoClaw provides the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">sudo nemoclaw setup-spark</code> command
        that automates the entire process.
      </p>

      <DefinitionBlock
        term="DGX Spark"
        definition="An NVIDIA desktop-class AI workstation powered by the Grace Blackwell platform. It runs DGX OS (based on Ubuntu 24.04) and includes an integrated NVIDIA GPU with unified memory architecture. DGX Spark is designed for local AI development, inference, and fine-tuning workloads."
        example="A developer uses DGX Spark to run NemoClaw sandboxes with GPU passthrough, allowing AI agents to perform local model inference inside a secure, policy-controlled environment."
        seeAlso={['DGX OS', 'GPU Passthrough', 'Grace Blackwell']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What setup-spark Does
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">setup-spark</code> command
        performs a series of configuration steps that are specific to the DGX Spark hardware and
        DGX OS environment. Running this command is a prerequisite before using <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw onboard</code> on
        a DGX Spark system.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">cgroup v2 Driver Configuration:</span> Ensures Docker
          is using the systemd cgroup driver, which is required on DGX OS's cgroup v2 hierarchy.
        </li>
        <li>
          <span className="font-semibold">NVIDIA Container Runtime:</span> Configures Docker to
          use the NVIDIA container runtime as the default, enabling GPU access from within
          sandboxes without per-container flags.
        </li>
        <li>
          <span className="font-semibold">GPU Device Permissions:</span> Sets up the correct
          device permissions and cgroup device rules so that sandboxes can access GPU hardware.
        </li>
        <li>
          <span className="font-semibold">Memory and Swap Configuration:</span> Adjusts cgroup
          memory controller settings for optimal GPU-compute workloads, including enabling memory
          swap accounting.
        </li>
        <li>
          <span className="font-semibold">NemoClaw Blueprint Optimization:</span> Configures
          NemoClaw to use a DGX-optimized blueprint that includes CUDA libraries, cuDNN, and
          GPU-aware tooling pre-installed in the sandbox.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Running setup-spark
      </h2>

      <WarningBlock title="Requires sudo">
        <p>
          The <code>setup-spark</code> command modifies system-level Docker configuration, kernel
          parameters, and device permissions. It must be run with sudo. This is the only NemoClaw
          command that requires elevated privileges -- all subsequent operations (onboard, connect,
          etc.) run as your normal user.
        </p>
      </WarningBlock>

      <StepBlock
        title="Run the DGX Spark setup"
        steps={[
          {
            title: 'Ensure NemoClaw CLI is installed',
            content: 'The CLI must be installed before running setup-spark.',
            code: `nemoclaw --version
# If not installed, run the install script first:
# curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash`,
          },
          {
            title: 'Run the setup-spark command',
            content: 'This command takes 1-3 minutes depending on what needs to be configured.',
            code: `sudo nemoclaw setup-spark

# Expected output:
# [1/6] Detecting DGX Spark hardware... OK (Grace Blackwell, 128 GB unified memory)
# [2/6] Configuring Docker cgroup v2 driver... OK
# [3/6] Installing NVIDIA container runtime... OK (already installed)
# [4/6] Setting GPU device permissions... OK
# [5/6] Configuring memory controller... OK
# [6/6] Setting DGX-optimized blueprint... OK
#
# DGX Spark setup complete.
# Run 'nemoclaw onboard' to create your first GPU-enabled sandbox.`,
          },
          {
            title: 'Verify the configuration',
            content: 'Check that Docker is correctly configured for DGX Spark.',
            code: `# Verify NVIDIA runtime is configured
docker info | grep -i runtime
# Should include: nvidia

# Verify GPU is accessible from Docker
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu24.04 nvidia-smi
# Should display GPU info

# Verify cgroup configuration
docker info | grep "Cgroup"
# Cgroup Driver: systemd
# Cgroup Version: 2`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Configuration Files Modified
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For transparency, here are the files that <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">setup-spark</code> modifies.
        Backups are created automatically before any changes (with a <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">.nemoclaw-backup</code> suffix).
      </p>

      <CodeBlock
        title="Files modified by setup-spark"
        language="bash"
        code={`# Docker daemon configuration
/etc/docker/daemon.json
# Adds NVIDIA runtime, systemd cgroup driver, GPU device access

# The resulting daemon.json looks like:
cat /etc/docker/daemon.json`}
      />

      <CodeBlock
        title="daemon.json after setup-spark"
        language="json"
        code={`{
  "default-runtime": "nvidia",
  "runtimes": {
    "nvidia": {
      "path": "nvidia-container-runtime",
      "runtimeArgs": []
    }
  },
  "exec-opts": ["native.cgroupdriver=systemd"],
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}`}
      />

      <CodeBlock
        title="Additional files modified"
        language="bash"
        code={`# NemoClaw configuration (per-user)
~/.nemoclaw/config.yaml
# Sets default blueprint to "nemoclaw-dgx:latest"

# View the change:
cat ~/.nemoclaw/config.yaml
# default_blueprint: nemoclaw-dgx:latest
# gpu_enabled: true
# gpu_count: all`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Onboarding After setup-spark
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        After running setup-spark, the onboard process is identical to other platforms but
        automatically uses the DGX-optimized blueprint and enables GPU passthrough.
      </p>

      <CodeBlock
        title="Onboard a GPU-enabled sandbox"
        language="bash"
        code={`# Onboard uses DGX blueprint by default after setup-spark
nemoclaw onboard --name gpu-sandbox

# The sandbox automatically has GPU access:
nemoclaw gpu-sandbox exec -- nvidia-smi
# Should display GPU information from inside the sandbox

# You can also explicitly specify GPU options:
nemoclaw onboard --name gpu-sandbox --gpus all
nemoclaw onboard --name gpu-sandbox --gpus 0  # specific GPU index`}
      />

      <NoteBlock type="tip" title="Non-GPU Sandboxes on DGX">
        <p>
          Even on DGX Spark, you can create sandboxes without GPU access. This is useful for
          agent workloads that do not need GPU compute. Use <code>nemoclaw onboard --gpus none</code> to
          create a CPU-only sandbox. This also reduces the attack surface of the sandbox since
          GPU device access is a potential vector for sandbox escape.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The next section covers additional DGX-specific hardware optimizations, including GPU
        memory allocation strategies and NVIDIA driver configuration for maximum performance
        inside sandboxes.
      </p>
    </div>
  )
}
