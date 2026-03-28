import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function GPUVMs() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        GPU VMs on Google Cloud for Local Inference
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Google Cloud offers a compelling GPU lineup for local LLM inference, including NVIDIA T4,
        L4, A100, and H100 GPUs. GCP's flexible machine type system lets you attach GPUs to
        custom machine configurations, giving you precise control over vCPU and memory alongside
        your GPU allocation. This section covers GPU options, zone availability, driver setup,
        and practical recommendations for NemoClaw inference workloads.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Available GPU Types
      </h2>

      <ComparisonTable
        title="GCP GPU Options for Inference"
        headers={['GPU', 'VRAM', 'Machine Type', 'On-Demand $/hr', 'Best For']}
        rows={[
          ['NVIDIA T4', '16 GB', 'n1-standard-4 + 1x T4', '~$0.52', 'Budget inference, 7B models'],
          ['NVIDIA L4', '24 GB', 'g2-standard-4 (1x L4)', '~$0.70', 'Efficient inference, 13B models'],
          ['NVIDIA A100 40GB', '40 GB', 'a2-highgpu-1g', '~$3.67', 'Large models, 30B+ params'],
          ['NVIDIA A100 80GB', '80 GB', 'a2-ultragpu-1g', '~$5.07', 'Very large models, 70B quantized'],
          ['NVIDIA H100', '80 GB', 'a3-highgpu-1g', '~$7.24', 'Maximum throughput, latest architecture'],
        ]}
      />

      <NoteBlock type="info" title="The L4 Sweet Spot">
        <p>
          The NVIDIA L4 on the g2-standard machine type is GCP's best option for NemoClaw inference.
          At 24 GB VRAM with the Ada Lovelace architecture, it handles quantized 13B models
          efficiently at roughly $500/month -- nearly 40% less than the T4's monthly cost when
          factoring in the L4's superior inference throughput. It is available in more zones than
          A100 or H100.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Zone Availability
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GPU availability varies significantly by zone. Not all GPU types are available in all
        regions, and popular zones frequently run out of capacity. Here are the most reliable
        zones for each GPU type:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">T4:</span> Widely available. Best in us-central1-a,
          us-east1-c, europe-west1-b, asia-east1-c.
        </li>
        <li>
          <span className="font-semibold">L4:</span> Available in us-central1-a, us-east4-c,
          europe-west1-b, asia-northeast1-b.
        </li>
        <li>
          <span className="font-semibold">A100:</span> Limited availability. Check us-central1-a,
          us-east1-c, europe-west4-a. Often requires quota increase requests.
        </li>
        <li>
          <span className="font-semibold">H100:</span> Most limited. Available in us-central1,
          us-east4. Requires explicit quota approval.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Check GPU Availability in a Zone"
        code={`# List available accelerator types in a zone
gcloud compute accelerator-types list \\
  --filter="zone:us-central1-a" \\
  --format="table(name,zone,description)"

# Check your GPU quota
gcloud compute project-info describe \\
  --format="table(quotas.metric,quotas.limit,quotas.usage)" \\
  | grep -i gpu

# Request a quota increase if needed
# Go to: IAM & Admin > Quotas > Filter for "GPUS_ALL_REGIONS"
# or specific GPU type quotas`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Creating a GPU VM
      </h2>

      <StepBlock
        title="Launch a GPU VM for NemoClaw"
        steps={[
          {
            title: 'Request GPU quota (if needed)',
            content: 'New GCP projects have a GPU quota of 0. Go to IAM & Admin > Quotas, filter for the GPU type you want (e.g., "NVIDIA_L4_GPUS"), and request an increase. Approval typically takes 1-2 business days.',
          },
          {
            title: 'Create the GPU VM (L4 example)',
            content: 'gcloud compute instances create nemoclaw-gpu \\\n  --zone=us-central1-a \\\n  --machine-type=g2-standard-4 \\\n  --accelerator=type=nvidia-l4,count=1 \\\n  --maintenance-policy=TERMINATE \\\n  --image-family=ubuntu-2204-lts \\\n  --image-project=ubuntu-os-cloud \\\n  --boot-disk-size=50GB \\\n  --boot-disk-type=pd-balanced \\\n  --tags=nemoclaw \\\n  --metadata=enable-oslogin=TRUE\n\nNote: --maintenance-policy=TERMINATE is required for GPU instances. GCP cannot live-migrate GPU VMs.',
          },
          {
            title: 'SSH into the GPU VM',
            content: 'gcloud compute ssh nemoclaw-gpu --zone=us-central1-a',
          },
          {
            title: 'Install NVIDIA drivers',
            content: 'GCP provides a convenient driver install script:\n\ncurl -fsSL https://raw.githubusercontent.com/GoogleCloudPlatform/compute-gpu-installation/main/linux/install_gpu_driver.py -o install_gpu_driver.py\nsudo python3 install_gpu_driver.py\n\nThis detects your GPU model and installs the appropriate driver version. Reboot after installation:\nsudo reboot',
          },
          {
            title: 'Verify GPU access',
            content: 'After reboot, verify the driver:\n\nnvidia-smi\n\nYou should see the L4 (or your chosen GPU) listed with driver and CUDA versions.',
          },
          {
            title: 'Install NemoClaw and configure local inference',
            content: 'Follow the standard NemoClaw installation, then configure the local LLM backend:\n\ncurl -fsSL https://install.nemoclaw.dev | bash\ncd ~/nemoclaw\nnpx nemoclaw onboard\n\nDuring onboarding, select "local" as the LLM provider and configure the Ollama or vLLM endpoint.',
          },
        ]}
      />

      <WarningBlock title="GPU VM Maintenance Policy">
        <p>
          GPU instances on GCP must have their maintenance policy set to TERMINATE because live
          migration is not supported for GPU VMs. This means during scheduled maintenance events,
          GCP will stop your instance, perform maintenance on the host, and then restart it.
          Ensure your NemoClaw systemd service is configured to start on boot so it recovers
          automatically after maintenance events.
        </p>
      </WarningBlock>

      <CodeBlock
        language="bash"
        title="Alternative: Deep Learning VM Image"
        code={`# GCP offers pre-configured Deep Learning VM images
# with NVIDIA drivers, CUDA, and ML frameworks installed

gcloud compute instances create nemoclaw-gpu \\
  --zone=us-central1-a \\
  --machine-type=g2-standard-4 \\
  --accelerator=type=nvidia-l4,count=1 \\
  --maintenance-policy=TERMINATE \\
  --image-family=common-cu124-ubuntu-2204 \\
  --image-project=deeplearning-platform-release \\
  --boot-disk-size=50GB \\
  --boot-disk-type=pd-balanced \\
  --tags=nemoclaw \\
  --metadata="install-nvidia-driver=True"

# This image comes with CUDA 12.4 pre-installed
# Saves 15-20 minutes of driver installation`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Multi-GPU Configurations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For running larger models (30B+ parameters), you may need multiple GPUs. GCP supports
        multi-GPU VMs with up to 8 GPUs per instance for A100 and H100 types. Inference frameworks
        like vLLM automatically shard models across multiple GPUs using tensor parallelism.
      </p>

      <CodeBlock
        language="bash"
        title="Multi-GPU VM Example"
        code={`# 4x A100 for running 70B parameter models
gcloud compute instances create nemoclaw-multi-gpu \\
  --zone=us-central1-a \\
  --machine-type=a2-highgpu-4g \\
  --maintenance-policy=TERMINATE \\
  --image-family=common-cu124-ubuntu-2204 \\
  --image-project=deeplearning-platform-release \\
  --boot-disk-size=200GB \\
  --boot-disk-type=pd-ssd \\
  --tags=nemoclaw

# Verify all GPUs are visible
nvidia-smi
# Should show 4x A100 GPUs`}
      />

      <ExerciseBlock
        question="Why must GPU instances on GCP have their maintenance policy set to TERMINATE?"
        options={[
          'GPU instances cost more and need to be terminated to save money',
          'GCP cannot live-migrate VMs with attached GPUs, so they must be stopped for host maintenance',
          'GPU drivers are incompatible with live migration',
          'It is a billing requirement for GPU instances',
        ]}
        correctIndex={1}
        explanation="Live migration moves a running VM from one physical host to another without downtime. This process is not supported for VMs with attached GPUs because GPU state (VRAM contents, running computations) cannot be transferred between physical GPUs. Instead, GCP stops the VM, performs host maintenance, and restarts it."
      />

      <ReferenceList
        references={[
          {
            title: 'GCP GPU Documentation',
            url: 'https://cloud.google.com/compute/docs/gpus',
            type: 'docs',
            description: 'Complete guide to GPU VMs on Google Cloud including types, zones, and quotas.',
          },
          {
            title: 'GCP Deep Learning VM Images',
            url: 'https://cloud.google.com/deep-learning-vm/docs/introduction',
            type: 'docs',
            description: 'Pre-configured VM images with GPU drivers and ML frameworks.',
          },
        ]}
      />
    </div>
  )
}
