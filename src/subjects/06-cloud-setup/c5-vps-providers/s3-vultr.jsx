import { CodeBlock, NoteBlock, ComparisonTable, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function Vultr() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        NemoClaw on Vultr
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Vultr is a cloud provider with 32 datacenter locations worldwide, offering a mix of
        cloud compute, bare metal, and GPU instances. For NemoClaw, Vultr provides competitive
        pricing with the added advantage of GPU instance availability -- a rarity among smaller
        cloud providers. This section covers Vultr's compute options, GPU instances, and the
        deployment process.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Compute Options
      </h2>

      <ComparisonTable
        title="Vultr Instance Types for NemoClaw"
        headers={['Plan', 'vCPUs', 'RAM', 'Storage', 'Monthly Cost', 'Notes']}
        rows={[
          ['Cloud Compute (Regular)', '2', '4 GB', '80 GB SSD', '$24', 'Testing only, shared CPUs'],
          ['Cloud Compute (Regular)', '4', '8 GB', '160 GB SSD', '$48', 'Small team, shared CPUs'],
          ['Cloud Compute (High Freq.)', '4', '8 GB', '128 GB NVMe', '$48', 'Better single-thread performance'],
          ['Optimized Cloud', '4', '16 GB', '240 GB NVMe', '$90', 'Dedicated CPUs, production recommended'],
          ['Optimized Cloud', '8', '32 GB', '480 GB NVMe', '$180', 'Large team production'],
          ['Cloud GPU (A100)', '12', '120 GB', '1400 GB NVMe', '$~2,500', 'Local inference with A100 GPU'],
        ]}
      />

      <NoteBlock type="info" title="High Frequency Compute">
        <p>
          Vultr's High Frequency instances run on 3+ GHz processors with NVMe storage, offering
          better single-thread performance than regular instances. Since NemoClaw's Gateway is
          largely single-threaded for message processing, High Frequency instances can provide
          noticeably better response times at the same price point.
        </p>
      </NoteBlock>

      <StepBlock
        title="Deploy NemoClaw on Vultr"
        steps={[
          {
            title: 'Create a Vultr account',
            content: 'Sign up at vultr.com. Add a payment method and optionally add your SSH public key under Account > SSH Keys.',
          },
          {
            title: 'Deploy a server',
            content: 'Click Deploy > Cloud Compute. Select "Optimized Cloud Compute" for production. Choose a location near your team. Select Ubuntu 22.04 x64 as the server image.',
          },
          {
            title: 'Select the plan',
            content: 'Choose the 4 vCPU / 16 GB plan ($90/mo) for production use. Select your SSH key for authentication.',
          },
          {
            title: 'Configure firewall group',
            content: 'Go to Products > Firewall. Create a new group named "nemoclaw". Add a rule: Protocol TCP, Port 22, Source YOUR_IP/32, Action Accept. Link the firewall group to your server.',
          },
          {
            title: 'SSH and initial setup',
            content: 'ssh root@<server-ip>\n\n# Create a non-root user\nadduser nemoclaw && usermod -aG sudo nemoclaw\nrsync --archive --chown=nemoclaw:nemoclaw ~/.ssh /home/nemoclaw\n\n# Harden SSH\nsed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config\necho "PasswordAuthentication no" >> /etc/ssh/sshd_config\nsystemctl restart sshd',
          },
          {
            title: 'Install NemoClaw',
            content: 'su - nemoclaw\nsudo apt update && sudo apt upgrade -y\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs git build-essential\n\ncurl -fsSL https://install.nemoclaw.dev | bash\ncd ~/nemoclaw && npx nemoclaw onboard',
          },
          {
            title: 'Set up systemd and verify',
            content: 'Create the nemoclaw.service systemd unit, enable, and start it. Verify with:\nnpx nemoclaw status',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Vultr GPU Instances
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Vultr is one of the few independent cloud providers offering GPU instances. Their Cloud
        GPU product provides NVIDIA A100 GPUs suitable for local LLM inference. This is
        particularly useful if you want GPU capability without committing to AWS, GCP, or Azure.
      </p>

      <CodeBlock
        language="bash"
        title="Deploying a Vultr GPU Instance"
        code={`# Vultr GPU instances are deployed through the web interface
# or API. The CLI (vultr-cli) also supports GPU deployment.

# Install vultr-cli
# macOS: brew install vultr/vultr-cli/vultr-cli
# Linux: snap install vultr-cli

# List available GPU plans
vultr-cli plans list --type vgpu

# Create a GPU instance
vultr-cli instance create \\
  --plan vgpu-a100-1c-12g-120ram \\
  --region ewr \\
  --os 387 \\
  --ssh-keys YOUR_KEY_ID \\
  --label nemoclaw-gpu

# NVIDIA drivers come pre-installed on Vultr GPU instances
# Verify after SSH:
nvidia-smi`}
      />

      <NoteBlock type="tip" title="GPU Driver Pre-Installation">
        <p>
          Vultr GPU instances come with NVIDIA drivers pre-installed when you select a compatible
          OS image. This saves the 15-20 minutes of manual driver installation. After provisioning,
          simply SSH in, verify with <code>nvidia-smi</code>, and proceed directly to installing
          Ollama or your preferred inference framework.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Vultr-Specific Features
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Snapshots:</span> Free automatic snapshots available.
          Manual snapshots are also free (limited by account storage quota). Take advantage
          of this for zero-cost NemoClaw backups.
        </li>
        <li>
          <span className="font-semibold">Startup scripts:</span> Vultr supports boot scripts
          that run on first launch. Use this to automate NemoClaw installation on new instances.
        </li>
        <li>
          <span className="font-semibold">Reserved IPs:</span> Static IPv4 addresses at $3/month.
          Useful if you need a consistent IP for SSH access.
        </li>
        <li>
          <span className="font-semibold">DDoS protection:</span> Included at no extra cost in
          select locations. Not critical for NemoClaw (no public ports) but a nice safety net.
        </li>
      </ul>

      <ExerciseBlock
        question="What advantage does Vultr offer over most independent VPS providers for NemoClaw deployments requiring local inference?"
        options={[
          'Vultr is the cheapest VPS provider',
          'Vultr offers managed Kubernetes clusters',
          'Vultr provides GPU instances (A100) for local LLM inference',
          'Vultr includes free domain registration',
        ]}
        correctIndex={2}
        explanation="Vultr is one of the few independent cloud providers (outside AWS/GCP/Azure) that offers GPU instances. Their Cloud GPU product with NVIDIA A100 GPUs enables local LLM inference, which is a capability typically only available on the major cloud platforms."
      />

      <ReferenceList
        references={[
          {
            title: 'Vultr Cloud Compute',
            url: 'https://www.vultr.com/products/cloud-compute/',
            type: 'docs',
            description: 'Vultr cloud compute plans and pricing.',
          },
          {
            title: 'Vultr Cloud GPU',
            url: 'https://www.vultr.com/products/cloud-gpu/',
            type: 'docs',
            description: 'GPU-accelerated instances on Vultr.',
          },
        ]}
      />
    </div>
  )
}
