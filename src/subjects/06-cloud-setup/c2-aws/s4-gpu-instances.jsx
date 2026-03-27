import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function GPUInstances() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        GPU Instances for Local Inference on AWS
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Running large language models locally on your NemoClaw instance eliminates API call costs,
        reduces latency, and keeps all data within your infrastructure. AWS offers several GPU
        instance families suitable for LLM inference. This section covers the key options, NVIDIA
        driver setup, and practical considerations for choosing the right GPU instance.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GPU Instance Families
      </h2>

      <ComparisonTable
        title="AWS GPU Instances for Inference"
        headers={['Instance', 'GPU', 'VRAM', 'vCPUs', 'RAM', 'On-Demand $/hr', 'Best For']}
        rows={[
          ['g4dn.xlarge', 'NVIDIA T4', '16 GB', '4', '16 GB', '~$0.526', 'Small models (7B params), budget inference'],
          ['g4dn.2xlarge', 'NVIDIA T4', '16 GB', '8', '32 GB', '~$0.752', 'Small models with more CPU headroom'],
          ['g5.xlarge', 'NVIDIA A10G', '24 GB', '4', '16 GB', '~$1.006', 'Medium models (13B params), good price/performance'],
          ['g5.2xlarge', 'NVIDIA A10G', '24 GB', '8', '32 GB', '~$1.212', 'Medium models with concurrent workloads'],
          ['p3.2xlarge', 'NVIDIA V100', '16 GB', '8', '61 GB', '~$3.06', 'Older but powerful, high RAM for Gateway'],
          ['p4d.24xlarge', '8x NVIDIA A100', '8x 40 GB', '96', '1152 GB', '~$32.77', 'Large models (70B+), multi-GPU inference'],
        ]}
      />

      <NoteBlock type="info" title="Recommended Starting Point">
        <p>
          For most NemoClaw deployments with local inference, the <strong>g5.xlarge</strong> offers
          the best balance of price and performance. Its 24 GB VRAM can run quantized 13B parameter
          models comfortably, and its A10G GPU delivers strong inference throughput. The g4dn.xlarge
          is a solid budget option for 7B models.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        NVIDIA Driver Setup
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GPU instances require NVIDIA drivers and the CUDA toolkit to be installed before the GPU
        can be used for inference. AWS provides a Deep Learning AMI with drivers pre-installed,
        but if you are using a standard Ubuntu AMI, you will need to install drivers manually.
      </p>

      <StepBlock
        title="Install NVIDIA Drivers on Ubuntu 22.04"
        steps={[
          {
            title: 'Update and install prerequisites',
            content: 'sudo apt update && sudo apt upgrade -y\nsudo apt install -y linux-headers-$(uname -r) build-essential',
          },
          {
            title: 'Add the NVIDIA driver repository',
            content: 'sudo apt install -y ubuntu-drivers-common\nsudo ubuntu-drivers devices\n\nThis shows the recommended driver version for your GPU. Typically you want the latest "server" driver.',
          },
          {
            title: 'Install the recommended driver',
            content: 'sudo ubuntu-drivers autoinstall\n\nAlternatively, install a specific version:\nsudo apt install -y nvidia-driver-535-server',
          },
          {
            title: 'Reboot the instance',
            content: 'sudo reboot\n\nWait 1-2 minutes, then SSH back in.',
          },
          {
            title: 'Verify the driver installation',
            content: 'nvidia-smi\n\nThis should display the GPU model, driver version, CUDA version, temperature, and memory usage. If you see an error, the driver did not install correctly.',
          },
          {
            title: 'Install CUDA toolkit (optional but recommended)',
            content: 'wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb\nsudo dpkg -i cuda-keyring_1.1-1_all.deb\nsudo apt update\nsudo apt install -y cuda-toolkit-12-4\n\nAdd to PATH:\nexport PATH=/usr/local/cuda-12.4/bin:$PATH\necho \'export PATH=/usr/local/cuda-12.4/bin:$PATH\' >> ~/.bashrc',
          },
        ]}
      />

      <CodeBlock
        language="bash"
        title="Quick Alternative: AWS Deep Learning AMI"
        code={`# Instead of manual driver setup, launch with the DL AMI:
# AMI Name: "Deep Learning AMI (Ubuntu 22.04)"
# This comes with NVIDIA drivers, CUDA, cuDNN, and
# popular ML frameworks pre-installed.

# Find the latest DL AMI:
aws ec2 describe-images \\
  --owners amazon \\
  --filters "Name=name,Values=Deep Learning AMI (Ubuntu 22.04)*" \\
  --query 'sort_by(Images, &CreationDate)[-1].[ImageId,Name]' \\
  --output text`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Running Local Models with NemoClaw
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Once drivers are installed, you can configure NemoClaw to use a local LLM backend instead
        of (or in addition to) cloud API providers. NemoClaw supports local inference through
        compatible backends like Ollama, vLLM, or llama.cpp server.
      </p>

      <CodeBlock
        language="bash"
        title="Setting Up Ollama for Local Inference"
        code={`# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (adjust based on your VRAM)
# 16 GB VRAM (T4/V100): Use 7B quantized models
ollama pull codellama:7b-instruct-q4_K_M

# 24 GB VRAM (A10G): Use 13B quantized models
ollama pull codellama:13b-instruct-q4_K_M

# Verify the model runs
ollama run codellama:7b-instruct-q4_K_M "Write a hello world in Python"

# Ollama serves on http://localhost:11434 by default
# Configure NemoClaw to use it in openclaw.json:
# {
#   "llm": {
#     "provider": "ollama",
#     "baseUrl": "http://localhost:11434",
#     "model": "codellama:13b-instruct-q4_K_M"
#   }
# }`}
      />

      <WarningBlock title="VRAM Limitations">
        <p>
          If you attempt to load a model that exceeds available VRAM, inference will fall back to
          CPU processing (if the backend supports it), resulting in dramatically slower response
          times -- often 10-50x slower. Always verify that your chosen model fits within GPU
          memory. Run <code>nvidia-smi</code> while the model is loaded to confirm VRAM usage
          is within bounds.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GPU Instance Availability
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GPU instances are in high demand and frequently unavailable in popular regions. If you
        cannot launch a GPU instance in your preferred region, try these strategies:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Try alternate regions</span> -- us-west-2 (Oregon) and
          us-east-1 (Virginia) typically have the most capacity.
        </li>
        <li>
          <span className="font-semibold">Request a quota increase</span> -- new AWS accounts have
          a GPU instance quota of zero. Go to Service Quotas in the AWS Console and request an
          increase for your desired instance type.
        </li>
        <li>
          <span className="font-semibold">Use Spot instances</span> -- GPU Spot instances can be
          60-90% cheaper than On-Demand and are often available when On-Demand capacity is exhausted.
        </li>
        <li>
          <span className="font-semibold">Consider capacity reservations</span> -- for guaranteed
          availability, reserve capacity in advance (comes with a cost commitment).
        </li>
      </ul>

      <ExerciseBlock
        question="You want to run a quantized 13B parameter model for local inference with NemoClaw on AWS. Which instance type offers the best price/performance?"
        options={[
          'g4dn.xlarge (T4, 16 GB VRAM) -- cheapest GPU option',
          'g5.xlarge (A10G, 24 GB VRAM) -- balanced price/performance',
          'p3.2xlarge (V100, 16 GB VRAM) -- powerful GPU',
          'p4d.24xlarge (8x A100, 320 GB VRAM) -- maximum performance',
        ]}
        correctIndex={1}
        explanation="The g5.xlarge with its A10G GPU (24 GB VRAM) is the best choice. 13B quantized models typically require 18-22 GB of VRAM, which fits comfortably in the A10G's 24 GB but exceeds the T4/V100's 16 GB. The p4d is massive overkill and costs 30x more."
      />

      <ReferenceList
        references={[
          {
            title: 'AWS GPU Instance Types',
            url: 'https://aws.amazon.com/ec2/instance-types/#Accelerated_Computing',
            type: 'docs',
            description: 'Complete specifications for all GPU-accelerated EC2 instance families.',
          },
          {
            title: 'NVIDIA Driver Installation on Linux',
            url: 'https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/',
            type: 'docs',
            description: 'Official NVIDIA guide for installing datacenter GPU drivers.',
          },
          {
            title: 'Ollama Documentation',
            url: 'https://ollama.ai/',
            type: 'docs',
            description: 'Getting started with Ollama for local LLM inference.',
          },
        ]}
      />
    </div>
  )
}
