import { CodeBlock, NoteBlock, ComparisonTable, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function Linode() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        NemoClaw on Linode (Akamai Cloud)
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Linode, now part of Akamai Connected Cloud, is a veteran cloud provider with a focus on
        simplicity and developer experience. With datacenters across the globe and a straightforward
        pricing model, Linode is a solid choice for NemoClaw deployments. The Dedicated CPU plans
        are particularly well-suited for the consistent performance NemoClaw requires.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Recommended Plans
      </h2>

      <ComparisonTable
        title="Linode Plans for NemoClaw"
        headers={['Plan Type', 'vCPUs', 'RAM', 'Storage', 'Monthly Cost', 'Recommendation']}
        rows={[
          ['Shared 4 GB', '2 shared', '4 GB', '80 GB', '$24', 'Testing only'],
          ['Shared 8 GB', '4 shared', '8 GB', '160 GB', '$48', 'Budget small team'],
          ['Dedicated 8 GB', '4 dedicated', '8 GB', '160 GB', '$72', 'Production (small team)'],
          ['Dedicated 16 GB', '8 dedicated', '16 GB', '320 GB', '$144', 'Production (recommended)'],
          ['Dedicated 32 GB', '16 dedicated', '32 GB', '640 GB', '$288', 'Large team, heavy usage'],
        ]}
      />

      <NoteBlock type="tip" title="Dedicated CPU Plans">
        <p>
          Linode's Dedicated CPU plans guarantee consistent CPU performance by allocating physical
          cores exclusively to your instance. For NemoClaw, this means policy evaluation latency
          remains stable even when neighboring instances on the same host are under heavy load.
          The difference between shared and dedicated CPU is often noticeable in p99 latency metrics.
        </p>
      </NoteBlock>

      <StepBlock
        title="Deploy NemoClaw on Linode"
        steps={[
          {
            title: 'Create a Linode',
            content: 'Log into cloud.linode.com and click Create Linode. Select Ubuntu 22.04 LTS as the distribution. Choose a region close to your team.',
          },
          {
            title: 'Select a plan',
            content: 'Under "Linode Plan", select the "Dedicated CPU" tab. Choose the 4 vCPU / 8 GB plan ($72/mo) for small teams or 8 vCPU / 16 GB ($144/mo) for production.',
          },
          {
            title: 'Set root password and SSH key',
            content: 'Enter a root password (required by Linode even with SSH keys). Add your SSH public key under "SSH Keys". The SSH key provides the actual access method -- the root password is for emergency console access.',
          },
          {
            title: 'Create the Linode',
            content: 'Click Create Linode. Provisioning takes 1-2 minutes. Copy the IP address from the Linode dashboard.',
          },
          {
            title: 'Configure firewall',
            content: 'Linode offers Cloud Firewall. Go to Firewalls > Create Firewall. Add an inbound rule for SSH (TCP 22) from your IP. Assign the firewall to your Linode. Note: Linode Cloud Firewalls default to allowing all outbound traffic.',
          },
          {
            title: 'Initial server hardening',
            content: 'ssh root@<linode-ip>\n\n# Create non-root user\nadduser nemoclaw\nusermod -aG sudo nemoclaw\nrsync --archive --chown=nemoclaw:nemoclaw ~/.ssh /home/nemoclaw\n\n# Harden SSH\nsed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config\nsed -i "s/#PasswordAuthentication yes/PasswordAuthentication no/" /etc/ssh/sshd_config\nsystemctl restart sshd',
          },
          {
            title: 'Install NemoClaw',
            content: 'su - nemoclaw\nsudo apt update && sudo apt upgrade -y\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs git build-essential\n\ncurl -fsSL https://install.nemoclaw.dev | bash\ncd ~/nemoclaw && npx nemoclaw onboard',
          },
          {
            title: 'Configure systemd and verify',
            content: 'Create the nemoclaw.service systemd unit file, enable, and start:\n\nsudo systemctl enable nemoclaw\nsudo systemctl start nemoclaw\nnpx nemoclaw status',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Linode CLI Alternative
      </h2>

      <CodeBlock
        language="bash"
        title="Deploy via Linode CLI"
        code={`# Install Linode CLI
pip3 install linode-cli

# Configure with your API token
linode-cli configure

# Create the Linode
linode-cli linodes create \\
  --type g6-dedicated-4 \\
  --region us-east \\
  --image linode/ubuntu22.04 \\
  --root_pass "$(openssl rand -base64 32)" \\
  --authorized_keys "$(cat ~/.ssh/id_ed25519.pub)" \\
  --label nemoclaw-prod \\
  --tags nemoclaw

# Get the IP
linode-cli linodes list --label nemoclaw-prod --format ipv4

# Create firewall
linode-cli firewalls create \\
  --label nemoclaw-fw \\
  --rules.inbound_policy DROP \\
  --rules.outbound_policy ACCEPT

# Add SSH rule (done via API call)
# linode-cli firewalls rules-update <firewall-id> ...`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Linode-Specific Features
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">LISH (Linode Shell):</span> Emergency out-of-band
          console access through the Linode Manager. If you lock yourself out of SSH due to a
          firewall misconfiguration, LISH provides direct console access. Access it through
          the Linode dashboard or via SSH to lish-us-east.linode.com.
        </li>
        <li>
          <span className="font-semibold">Backups:</span> Automated backups at $5-20/month
          depending on plan size. Includes daily, weekly, and bi-weekly snapshots with one
          manual slot.
        </li>
        <li>
          <span className="font-semibold">NodeBalancers:</span> If you run multiple NemoClaw
          instances, Linode's NodeBalancers ($10/mo) provide load balancing. Useful for
          multi-instance deployments with shared policy management.
        </li>
        <li>
          <span className="font-semibold">Block Storage Volumes:</span> Attach additional NVMe
          storage at $0.10/GB/month if the built-in storage is insufficient for your workspace
          data and logs.
        </li>
      </ul>

      <ExerciseBlock
        question="What is LISH and when would you use it with a NemoClaw Linode?"
        options={[
          'A load balancer for distributing traffic across Linodes',
          'An out-of-band console that provides access even when SSH is broken',
          'A log shipping service for centralized logging',
          'A managed database service for session storage',
        ]}
        correctIndex={1}
        explanation="LISH (Linode Shell) is an out-of-band serial console that provides direct access to your Linode regardless of its network state. If a firewall misconfiguration, SSH daemon crash, or network issue prevents SSH access, LISH lets you log in directly to fix the problem -- similar to Azure Serial Console."
      />

      <ReferenceList
        references={[
          {
            title: 'Linode Getting Started',
            url: 'https://www.linode.com/docs/products/compute/compute-instances/get-started/',
            type: 'docs',
            description: 'Official Linode quickstart guide for creating compute instances.',
          },
          {
            title: 'Linode Cloud Firewall',
            url: 'https://www.linode.com/docs/products/networking/cloud-firewall/',
            type: 'docs',
            description: 'How to configure Linode Cloud Firewalls.',
          },
        ]}
      />
    </div>
  )
}
