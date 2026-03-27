import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function GPUVMsAzure() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Azure GPU VMs for Local Inference
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Azure offers GPU-accelerated virtual machines through the N-series family, spanning
        training-focused NC-series with NVIDIA A100 and H100 GPUs to inference-optimized NV-series
        with T4 and A10 GPUs. This section covers the available options, driver installation, and
        practical recommendations for running local LLM inference alongside NemoClaw.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GPU VM Families
      </h2>

      <ComparisonTable
        title="Azure GPU VMs for Inference"
        headers={['VM Size', 'GPU', 'VRAM', 'vCPUs', 'RAM', 'Approx. $/hr']}
        rows={[
          ['Standard_NC4as_T4_v3', 'NVIDIA T4', '16 GB', '4', '28 GB', '~$0.53'],
          ['Standard_NC8as_T4_v3', 'NVIDIA T4', '16 GB', '8', '56 GB', '~$0.75'],
          ['Standard_NV36ads_A10_v5', 'NVIDIA A10', '24 GB', '36', '440 GB', '~$2.07'],
          ['Standard_NC24ads_A100_v4', 'NVIDIA A100', '80 GB', '24', '220 GB', '~$3.67'],
          ['Standard_ND96asr_v4', '8x NVIDIA A100', '8x 40 GB', '96', '900 GB', '~$27.20'],
        ]}
      />

      <NoteBlock type="info" title="Inference Recommendation">
        <p>
          For NemoClaw local inference, the <strong>Standard_NC4as_T4_v3</strong> is the budget
          choice for 7B parameter models, while the <strong>Standard_NV36ads_A10_v5</strong>
          handles 13B models with its 24 GB VRAM. The T4-based NC-series offers the best price
          for entry-level GPU inference on Azure. The A100-based NC-series is for large models
          (30B+) where the additional VRAM and memory bandwidth justify the cost premium.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Driver Installation
      </h2>

      <StepBlock
        title="Install NVIDIA Drivers on Azure GPU VMs"
        steps={[
          {
            title: 'Use the NVIDIA GPU Driver Extension (recommended)',
            content: 'Azure provides a VM extension that automatically installs the correct NVIDIA driver:\n\naz vm extension set \\\n  --resource-group nemoclaw-rg \\\n  --vm-name nemoclaw-gpu \\\n  --name NvidiaGpuDriverLinux \\\n  --publisher Microsoft.HpcCompute \\\n  --version 1.9\n\nThis installs the GRID or Tesla driver appropriate for your GPU type and reboots the VM.',
          },
          {
            title: 'Wait for the extension to complete',
            content: 'The extension takes 5-10 minutes to install. Check status:\n\naz vm extension show \\\n  --resource-group nemoclaw-rg \\\n  --vm-name nemoclaw-gpu \\\n  --name NvidiaGpuDriverLinux \\\n  --query provisioningState',
          },
          {
            title: 'SSH in and verify',
            content: 'After the extension completes and the VM reboots:\n\nssh azureuser@<public-ip>\nnvidia-smi\n\nYou should see the GPU model, driver version, and CUDA version listed.',
          },
          {
            title: 'Install CUDA toolkit (optional)',
            content: 'If your inference framework requires the CUDA toolkit (not just the driver):\n\nwget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb\nsudo dpkg -i cuda-keyring_1.1-1_all.deb\nsudo apt update && sudo apt install -y cuda-toolkit-12-4',
          },
        ]}
      />

      <CodeBlock
        language="bash"
        title="Manual Driver Installation Alternative"
        code={`# If the extension fails, install manually:
sudo apt update
sudo apt install -y ubuntu-drivers-common
sudo ubuntu-drivers devices
sudo ubuntu-drivers autoinstall
sudo reboot

# After reboot, verify:
nvidia-smi`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Setting Up Local Inference
      </h2>

      <CodeBlock
        language="bash"
        title="Configure Ollama on Azure GPU VM"
        code={`# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model based on your VRAM
# T4 (16 GB): 7B quantized models
ollama pull llama3:8b-instruct-q4_K_M

# A10 (24 GB): 13B quantized models
ollama pull llama3:13b-instruct-q4_K_M

# A100 (80 GB): 70B quantized models
ollama pull llama3:70b-instruct-q4_K_M

# Test inference
ollama run llama3:8b-instruct-q4_K_M "Explain what NemoClaw does"

# Configure NemoClaw to use local Ollama
# Edit ~/nemoclaw/openclaw.json:
# {
#   "llm": {
#     "provider": "ollama",
#     "baseUrl": "http://localhost:11434",
#     "model": "llama3:8b-instruct-q4_K_M"
#   }
# }`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Azure-Specific GPU Considerations
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Quota requests:</span> New Azure subscriptions have
          zero GPU quota. Request quota through the Azure Portal: Subscription > Usage + Quotas >
          search for "NC" or "NV" series. Approval typically takes 1-3 business days.
        </li>
        <li>
          <span className="font-semibold">Region availability:</span> GPU VMs are available in
          limited regions. East US, West US 2, and West Europe typically have the best availability.
          Check region availability in the Azure Pricing Calculator.
        </li>
        <li>
          <span className="font-semibold">Spot pricing:</span> Azure Spot VMs offer up to 90%
          discount on GPU instances. Set a maximum price to limit your spend and handle eviction
          gracefully.
        </li>
        <li>
          <span className="font-semibold">Low-priority VMs:</span> Similar to Spot but available
          through Azure Batch. Good for batch inference workloads but not recommended for
          always-on NemoClaw deployments.
        </li>
      </ul>

      <WarningBlock title="NVv3 vs NVads A10 Series">
        <p>
          Azure has older NV-series VMs (NVv3) with NVIDIA M60 GPUs. These are designed for
          visualization workloads, not ML inference. The M60 has 8 GB VRAM per GPU partition
          and lacks the Tensor Cores needed for efficient LLM inference. Always choose the newer
          NCas T4 or NVads A10 series for inference workloads. The "v3" in the name can be
          confusing -- check the actual GPU model, not just the series version.
        </p>
      </WarningBlock>

      <ExerciseBlock
        question="Which Azure VM extension simplifies NVIDIA driver installation on GPU VMs?"
        options={[
          'AzureMonitorLinuxAgent',
          'CustomScriptExtension',
          'NvidiaGpuDriverLinux',
          'DockerExtension',
        ]}
        correctIndex={2}
        explanation="The NvidiaGpuDriverLinux extension (publisher: Microsoft.HpcCompute) automatically detects the GPU type, downloads the appropriate NVIDIA driver, installs it, and reboots the VM. This is the recommended approach over manual driver installation."
      />

      <ReferenceList
        references={[
          {
            title: 'Azure N-series GPU VMs',
            url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/sizes-gpu',
            type: 'docs',
            description: 'Complete reference for Azure GPU-accelerated VM sizes.',
          },
          {
            title: 'NVIDIA GPU Driver Extension for Azure',
            url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/extensions/hpccompute-gpu-linux',
            type: 'docs',
            description: 'How to install NVIDIA drivers using the Azure VM extension.',
          },
        ]}
      />
    </div>
  )
}
