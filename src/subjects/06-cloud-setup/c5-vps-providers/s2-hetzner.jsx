import { CodeBlock, NoteBlock, ComparisonTable, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function Hetzner() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        NemoClaw on Hetzner Cloud
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Hetzner Cloud has earned a strong reputation among developers for offering exceptional
        price-to-performance ratios, particularly in European regions. Based in Germany, Hetzner
        provides cloud servers at roughly half the cost of equivalent DigitalOcean or AWS instances,
        making it an excellent choice for NemoClaw deployments -- especially for EU-based teams
        or those with budget constraints.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Recommended Server Types
      </h2>

      <ComparisonTable
        title="Hetzner Cloud Server Options"
        headers={['Type', 'vCPUs', 'RAM', 'Storage', 'Monthly Cost', 'Use Case']}
        rows={[
          ['CX22', '2 shared', '4 GB', '40 GB NVMe', '~$4.50', 'Testing only'],
          ['CX32', '4 shared', '8 GB', '80 GB NVMe', '~$8.50', 'Small team, budget option'],
          ['CX42', '8 shared', '16 GB', '160 GB NVMe', '~$16.50', 'Medium team production'],
          ['CPX31', '4 dedicated', '8 GB', '160 GB NVMe', '~$14', 'Small team, dedicated CPUs'],
          ['CPX41', '8 dedicated', '16 GB', '240 GB NVMe', '~$26', 'Recommended production'],
          ['CCX23', '4 dedicated', '16 GB', '80 GB NVMe', '~$19', 'CPU-optimized, AMD EPYC'],
        ]}
      />

      <NoteBlock type="info" title="Unbeatable Price-Performance">
        <p>
          Hetzner's CPX41 (8 dedicated vCPUs, 16 GB RAM) costs approximately $26/month. An
          equivalent AWS instance (c6i.2xlarge) costs roughly $245/month -- nearly 10x more.
          Even accounting for differences in network and managed services, Hetzner delivers
          outstanding value for compute-focused workloads like NemoClaw.
        </p>
      </NoteBlock>

      <StepBlock
        title="Deploy NemoClaw on Hetzner Cloud"
        steps={[
          {
            title: 'Create a Hetzner Cloud account',
            content: 'Sign up at cloud.hetzner.com. Create a new project named "nemoclaw". Hetzner requires identity verification which typically takes 1-2 business days for new accounts.',
          },
          {
            title: 'Add your SSH key',
            content: 'In the project, go to Security > SSH Keys > Add SSH Key. Paste your public key and give it a name.',
          },
          {
            title: 'Create a server',
            content: 'Click Servers > Create Server. Select a location (Falkenstein, Nuremberg, or Helsinki for EU; Ashburn or Hillsboro for US). Choose Ubuntu 22.04 as the image. Select CPX31 or CPX41 for production.',
          },
          {
            title: 'Configure firewall',
            content: 'Go to Firewalls > Create Firewall. Add an inbound rule: Protocol TCP, Port 22, Source YOUR_IP/32. Apply the firewall to your server.',
          },
          {
            title: 'SSH and create a user',
            content: 'ssh root@<server-ip>\n\nadduser nemoclaw\nusermod -aG sudo nemoclaw\nrsync --archive --chown=nemoclaw:nemoclaw ~/.ssh /home/nemoclaw\n\n# Disable root SSH login\nsed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config\nsystemctl restart sshd\n\n# Reconnect as the new user\nexit\nssh nemoclaw@<server-ip>',
          },
          {
            title: 'Install NemoClaw',
            content: 'sudo apt update && sudo apt upgrade -y\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs git build-essential\n\ncurl -fsSL https://install.nemoclaw.dev | bash\ncd ~/nemoclaw && npx nemoclaw onboard',
          },
          {
            title: 'Configure systemd service',
            content: 'Create the nemoclaw.service file (same pattern as previous sections) and enable it:\n\nsudo systemctl daemon-reload\nsudo systemctl enable nemoclaw\nsudo systemctl start nemoclaw',
          },
          {
            title: 'Verify and access',
            content: 'npx nemoclaw status\n\nAccess Control UI via SSH tunnel:\nssh -L 18789:localhost:18789 nemoclaw@<server-ip>',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Hetzner CLI (hcloud)
      </h2>

      <CodeBlock
        language="bash"
        title="Deploy via hcloud CLI"
        code={`# Install hcloud CLI
# macOS: brew install hcloud
# Linux: snap install hcloud

# Configure with your API token
hcloud context create nemoclaw
# Enter your API token from the Hetzner Cloud Console

# Create a server
hcloud server create \\
  --name nemoclaw-prod \\
  --type cpx41 \\
  --image ubuntu-22.04 \\
  --location nbg1 \\
  --ssh-key your-key-name

# Create and apply firewall
hcloud firewall create --name nemoclaw-fw
hcloud firewall add-rule nemoclaw-fw \\
  --direction in \\
  --protocol tcp \\
  --port 22 \\
  --source-ips YOUR_IP/32

hcloud firewall apply-to-resource nemoclaw-fw \\
  --type server \\
  --server nemoclaw-prod

# Get server IP
hcloud server ip nemoclaw-prod`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Hetzner-Specific Considerations
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Data transfer:</span> Hetzner includes 20 TB of outbound
          traffic per month on all cloud servers. This is exceptionally generous and more than
          enough for any NemoClaw deployment.
        </li>
        <li>
          <span className="font-semibold">Snapshots:</span> Snapshots are priced at EUR 0.0119/GB/month.
          A 30 GB snapshot costs about EUR 0.36/month -- extremely affordable for regular backups.
        </li>
        <li>
          <span className="font-semibold">Volumes:</span> Attach additional block storage volumes
          starting at EUR 0.0440/GB/month if you need more disk space for logs or workspace data.
        </li>
        <li>
          <span className="font-semibold">No GPU instances:</span> Hetzner Cloud does not currently
          offer GPU instances. If you need local LLM inference, you will need to use Hetzner's
          dedicated servers (bare metal) or choose a different provider for the GPU component.
        </li>
        <li>
          <span className="font-semibold">GDPR compliance:</span> Hetzner's EU datacenters
          (Germany, Finland) keep all data within the European Union, which can be advantageous for
          teams with GDPR requirements.
        </li>
      </ul>

      <ExerciseBlock
        question="What makes Hetzner Cloud particularly attractive for budget-conscious NemoClaw deployments?"
        options={[
          'Hetzner offers free GPU instances',
          'Hetzner provides dedicated CPU servers at roughly 1/10th the cost of equivalent AWS instances',
          'Hetzner includes free managed Kubernetes',
          'Hetzner does not require a credit card',
        ]}
        correctIndex={1}
        explanation="Hetzner's primary advantage is exceptional price-to-performance. A CPX41 with 8 dedicated vCPUs and 16 GB RAM costs ~$26/month, compared to ~$245/month for an equivalent c6i.2xlarge on AWS. This makes Hetzner ideal for teams that need production-grade compute without enterprise cloud budgets."
      />

      <ReferenceList
        references={[
          {
            title: 'Hetzner Cloud Documentation',
            url: 'https://docs.hetzner.com/cloud/',
            type: 'docs',
            description: 'Official Hetzner Cloud documentation including server types and pricing.',
          },
          {
            title: 'hcloud CLI Reference',
            url: 'https://github.com/hetznercloud/cli',
            type: 'github',
            description: 'Hetzner Cloud command-line tool for server management.',
          },
        ]}
      />
    </div>
  )
}
