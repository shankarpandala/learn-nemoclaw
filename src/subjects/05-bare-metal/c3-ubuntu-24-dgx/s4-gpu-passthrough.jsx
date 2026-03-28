import { CodeBlock, NoteBlock, StepBlock, WarningBlock, DefinitionBlock, ExerciseBlock } from '../../../components/content'

export default function GpuPassthrough() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        GPU Passthrough to Sandboxes
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GPU passthrough allows NemoClaw sandboxes to directly access NVIDIA GPU hardware for
        compute workloads. This is essential for AI agent tasks that involve model inference,
        fine-tuning, or any CUDA-based computation. NemoClaw uses the NVIDIA Container Toolkit
        (nvidia-container-toolkit) to expose GPU devices to sandbox containers securely and
        efficiently.
      </p>

      <DefinitionBlock
        term="NVIDIA Container Toolkit"
        definition="A set of tools and libraries that enables NVIDIA GPU support within container runtimes like Docker. It includes the nvidia-container-runtime (a modified OCI runtime), libnvidia-container (which handles GPU device injection), and configuration utilities. The toolkit intercepts container creation and mounts the necessary GPU device nodes, driver libraries, and firmware into the container's filesystem."
        example="When NemoClaw creates a sandbox with --gpus all, the NVIDIA Container Toolkit injects /dev/nvidia0, /dev/nvidiactl, and the CUDA driver libraries into the container, making the GPU accessible to processes inside the sandbox."
        seeAlso={['Container Runtime', 'CUDA', 'Device Mapping']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Installing the NVIDIA Container Toolkit
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        On DGX OS, the NVIDIA Container Toolkit is pre-installed. On other Ubuntu systems with
        NVIDIA GPUs, you must install it manually. If you ran <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">sudo nemoclaw setup-spark</code>,
        the toolkit is already configured. For non-DGX systems, follow these steps.
      </p>

      <StepBlock
        title="Install NVIDIA Container Toolkit on Ubuntu"
        steps={[
          {
            title: 'Configure the NVIDIA package repository',
            content: 'Add the NVIDIA Container Toolkit GPG key and repository.',
            code: `curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \\
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \\
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \\
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list`,
          },
          {
            title: 'Install the toolkit',
            content: 'Update the package list and install the NVIDIA container toolkit.',
            code: `sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit`,
          },
          {
            title: 'Configure Docker to use the NVIDIA runtime',
            content: 'Register the NVIDIA runtime with Docker.',
            code: 'sudo nvidia-ctk runtime configure --runtime=docker',
          },
          {
            title: 'Restart Docker',
            content: 'Apply the runtime configuration changes.',
            code: 'sudo systemctl restart docker',
          },
          {
            title: 'Verify GPU access from Docker',
            content: 'Test that containers can access the GPU.',
            code: `docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu24.04 nvidia-smi
# Should display your GPU information`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Device Mapping in NemoClaw
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw provides several options for controlling which GPUs are visible to a sandbox.
        This is important for multi-GPU systems where you want to isolate specific GPUs for
        specific sandboxes, or for security reasons where you want to limit GPU access.
      </p>

      <CodeBlock
        title="GPU device mapping options"
        language="bash"
        code={`# Pass all GPUs to the sandbox
nemoclaw onboard --name full-gpu --gpus all

# Pass a specific GPU by index
nemoclaw onboard --name single-gpu --gpus 0

# Pass multiple specific GPUs
nemoclaw onboard --name multi-gpu --gpus 0,1

# Pass GPUs by UUID (useful for consistent mapping)
GPU_UUID=$(nvidia-smi --query-gpu=uuid --format=csv,noheader | head -1)
nemoclaw onboard --name uuid-gpu --gpus "device=$GPU_UUID"

# Create a sandbox with no GPU access
nemoclaw onboard --name cpu-only --gpus none`}
      />

      <CodeBlock
        title="Verify GPU access inside a sandbox"
        language="bash"
        code={`# Connect to the sandbox
nemoclaw full-gpu connect

# Inside the sandbox:
nvidia-smi
# Should display GPU info matching the host

# Check CUDA availability
python3 -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
python3 -c "import torch; print(f'GPU count: {torch.cuda.device_count()}')"
python3 -c "import torch; print(f'GPU name: {torch.cuda.get_device_name(0)}')"

# Run a simple CUDA operation
python3 -c "
import torch
x = torch.randn(1000, 1000, device='cuda')
y = torch.matmul(x, x)
print(f'CUDA computation successful. Result shape: {y.shape}')
"

# Exit the sandbox
exit`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GPU Security Considerations
      </h2>

      <WarningBlock title="GPU Access Expands the Attack Surface">
        <p>
          Granting GPU access to a sandbox gives the agent direct hardware access through the
          NVIDIA driver. While the NVIDIA Container Toolkit provides isolation, GPU device access
          has historically been a vector for container escape vulnerabilities. Only enable GPU
          passthrough for sandboxes that genuinely need it. Use <code>--gpus none</code> for
          sandboxes that only need CPU compute.
        </p>
      </WarningBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's security policies can further restrict GPU usage within a sandbox. Even with
        GPU passthrough enabled, you can use policy rules to limit which CUDA operations are
        permitted.
      </p>

      <CodeBlock
        title="GPU-related policy restrictions"
        language="yaml"
        code={`# Example policy snippet for GPU sandboxes
gpu:
  # Allow inference but block training-related operations
  allow_inference: true
  allow_training: false

  # Limit GPU memory per process
  max_memory_per_process: 8g

  # Block direct device file access (agent uses CUDA API only)
  block_device_files: true

  # Log all GPU operations for auditing
  audit_gpu_ops: true`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Troubleshooting GPU Passthrough
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Common GPU passthrough issues and their solutions:
      </p>

      <CodeBlock
        title="GPU troubleshooting commands"
        language="bash"
        code={`# Issue: "nvidia-smi: command not found" inside sandbox
# Fix: Verify NVIDIA runtime is configured
docker info | grep -i runtime
# Should include "nvidia"
# If not, run: sudo nvidia-ctk runtime configure --runtime=docker

# Issue: "Failed to initialize NVML: Driver/library version mismatch"
# Fix: Driver version on host doesn't match libraries in sandbox
nvidia-smi  # Check host driver version
nemoclaw my-sandbox exec -- cat /usr/local/cuda/version.json
# Update the sandbox blueprint or host driver to match

# Issue: "no CUDA-capable device is detected"
# Fix: Ensure --gpus flag was used during onboard
nemoclaw my-sandbox inspect | grep gpu
# If GPU is not configured, recreate with GPU:
nemoclaw my-sandbox destroy
nemoclaw onboard --name my-sandbox --gpus all

# Issue: GPU out of memory inside sandbox
# Fix: Check GPU memory usage across all sandboxes
nvidia-smi
nemoclaw gpu-status
# Free GPU memory by stopping unused sandboxes`}
      />

      <NoteBlock type="info" title="Hot-Adding GPUs Is Not Supported">
        <p>
          GPU device mapping is set at sandbox creation time and cannot be changed while the
          sandbox is running. To change GPU allocation, you must destroy and recreate the sandbox.
          Plan your GPU allocation before creating sandboxes, especially in multi-user environments.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="Why should you use --gpus none for sandboxes that do not need GPU compute?"
        options={[
          'GPU passthrough slows down CPU operations',
          'GPU access expands the attack surface and wastes GPU memory',
          'NemoClaw does not support mixed GPU and CPU sandboxes',
          'The NVIDIA driver is incompatible with non-GPU workloads',
        ]}
        correctIndex={1}
        explanation="GPU device access gives the sandbox direct hardware access through the NVIDIA driver, which expands the potential attack surface. Additionally, even idle GPU contexts consume some GPU memory. Only enable GPU passthrough when the workload genuinely requires it."
      />
    </div>
  )
}
