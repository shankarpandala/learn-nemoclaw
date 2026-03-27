import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function DigitalOcean() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        NemoClaw on DigitalOcean
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        DigitalOcean is known for its simplicity and developer-friendly interface. For NemoClaw,
        it offers a straightforward deployment experience with predictable pricing and no hidden
        costs. Droplets (DigitalOcean's VMs) are ideal for small to medium NemoClaw deployments
        where you want a clean, simple infrastructure without the complexity of AWS, GCP, or Azure.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Recommended Droplet Sizes
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Basic 4 GB ($24/mo):</span> 2 vCPUs, 4 GB RAM, 80 GB SSD.
          Bare minimum for testing. Will run NemoClaw but may struggle under concurrent sessions.
        </li>
        <li>
          <span className="font-semibold">Basic 8 GB ($48/mo):</span> 4 vCPUs, 8 GB RAM, 160 GB SSD.
          Good for small teams (up to 5 users). The minimum recommended for reliable operation.
        </li>
        <li>
          <span className="font-semibold">CPU-Optimized 8 GB ($80/mo):</span> 4 dedicated vCPUs,
          8 GB RAM, 100 GB NVMe SSD. Recommended for production. Dedicated CPUs ensure consistent
          performance unlike shared basic Droplets.
        </li>
        <li>
          <span className="font-semibold">CPU-Optimized 16 GB ($160/mo):</span> 8 dedicated vCPUs,
          16 GB RAM, 200 GB NVMe SSD. For larger teams or heavy usage patterns.
        </li>
      </ul>

      <NoteBlock type="tip" title="Dedicated CPU Droplets">
        <p>
          DigitalOcean's Basic Droplets use shared vCPUs, meaning your performance can be affected
          by neighboring VMs. CPU-Optimized Droplets provide dedicated cores with guaranteed
          performance. For production NemoClaw deployments, the extra cost of dedicated CPUs is
          worth the consistency -- especially for policy evaluation latency which directly impacts
          agent responsiveness.
        </p>
      </NoteBlock>

      <StepBlock
        title="Deploy NemoClaw on DigitalOcean"
        steps={[
          {
            title: 'Create a Droplet',
            content: 'Log into the DigitalOcean dashboard and click Create > Droplets. Select Ubuntu 22.04 (LTS) x64 as the image. Choose a datacenter region close to your team.',
          },
          {
            title: 'Select the Droplet size',
            content: 'Under "CPU options", select "Dedicated CPU" for production use. Choose the 4 vCPU / 8 GB plan ($80/mo) as a recommended starting point.',
          },
          {
            title: 'Configure authentication',
            content: 'Select "SSH keys" and add your public key. DigitalOcean also supports password authentication, but SSH keys are strongly recommended.',
          },
          {
            title: 'Enable monitoring and backups',
            content: 'Check "Monitoring" (free) for CPU, memory, and disk metrics in the dashboard. Optionally enable "Backups" ($16/mo for the 8 GB plan) for weekly automated snapshots.',
          },
          {
            title: 'Set the hostname',
            content: 'Name it something descriptive like "nemoclaw-prod". Add a tag like "nemoclaw" for organization.',
          },
          {
            title: 'Create the Droplet',
            content: 'Click Create Droplet. It provisions in about 30 seconds. Copy the IP address from the dashboard.',
          },
          {
            title: 'Configure the firewall',
            content: 'Go to Networking > Firewalls > Create Firewall. Add an inbound rule for SSH (port 22) from your IP only. Apply it to the "nemoclaw" tag. This is equivalent to a cloud security group.',
          },
          {
            title: 'SSH and install NemoClaw',
            content: 'ssh root@<droplet-ip>\n\n# Create a non-root user first\nadduser nemoclaw\nusermod -aG sudo nemoclaw\nrsync --archive --chown=nemoclaw:nemoclaw ~/.ssh /home/nemoclaw\n\n# Switch to the new user\nsu - nemoclaw\n\n# Update and install dependencies\nsudo apt update && sudo apt upgrade -y\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs git build-essential\n\n# Install NemoClaw\ncurl -fsSL https://install.nemoclaw.dev | bash\ncd ~/nemoclaw && npx nemoclaw onboard',
          },
          {
            title: 'Set up systemd service',
            content: 'Create the service file as described in previous sections, using User=nemoclaw and WorkingDirectory=/home/nemoclaw/nemoclaw. Enable and start the service.',
          },
        ]}
      />

      <WarningBlock title="Do Not Run NemoClaw as Root">
        <p>
          DigitalOcean Droplets default to root SSH access. Always create a dedicated non-root
          user for running NemoClaw. Running the Gateway and policy engine as root means any
          vulnerability could lead to full system compromise. Create a "nemoclaw" user with sudo
          privileges and run all NemoClaw processes under that account.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        DigitalOcean CLI Alternative
      </h2>

      <CodeBlock
        language="bash"
        title="Create Droplet via doctl"
        code={`# Install doctl and authenticate
# brew install doctl (macOS) or snap install doctl (Linux)
doctl auth init

# Create the Droplet
doctl compute droplet create nemoclaw-prod \\
  --image ubuntu-22-04-x64 \\
  --size c-4-8gib \\
  --region nyc1 \\
  --ssh-keys YOUR_SSH_KEY_FINGERPRINT \\
  --enable-monitoring \\
  --tag-names nemoclaw \\
  --wait

# Get the IP
doctl compute droplet get nemoclaw-prod --format PublicIPv4

# Create firewall
doctl compute firewall create \\
  --name nemoclaw-fw \\
  --inbound-rules "protocol:tcp,ports:22,address:YOUR_IP/32" \\
  --outbound-rules "protocol:tcp,ports:all,address:0.0.0.0/0 protocol:udp,ports:all,address:0.0.0.0/0" \\
  --tag-names nemoclaw`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        DigitalOcean Advantages for NemoClaw
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Predictable pricing:</span> No hidden data transfer
          charges, no per-request API fees. The monthly price includes a generous data transfer
          allowance (4-8 TB depending on plan).
        </li>
        <li>
          <span className="font-semibold">Simple firewall:</span> DigitalOcean Cloud Firewalls
          are free and apply by tag, making it easy to manage access for multiple Droplets.
        </li>
        <li>
          <span className="font-semibold">Snapshots:</span> Manual snapshots cost $0.06/GB/month
          and provide point-in-time backups of your entire Droplet. Take a snapshot before major
          NemoClaw updates.
        </li>
        <li>
          <span className="font-semibold">Monitoring built-in:</span> Free monitoring provides
          CPU, memory, disk, and network graphs directly in the dashboard without installing
          agents.
        </li>
      </ul>

      <ExerciseBlock
        question="Why is the CPU-Optimized Droplet recommended over the Basic Droplet for production NemoClaw?"
        options={[
          'CPU-Optimized Droplets have more storage',
          'CPU-Optimized Droplets use dedicated cores ensuring consistent performance',
          'Basic Droplets do not support Ubuntu 22.04',
          'CPU-Optimized Droplets include free backups',
        ]}
        correctIndex={1}
        explanation="Basic Droplets use shared vCPUs where performance can fluctuate based on other tenants on the same physical host. CPU-Optimized Droplets provide dedicated CPU cores with guaranteed clock speed, ensuring consistent policy evaluation latency and agent responsiveness -- critical for production NemoClaw."
      />

      <ReferenceList
        references={[
          {
            title: 'DigitalOcean Droplet Documentation',
            url: 'https://docs.digitalocean.com/products/droplets/',
            type: 'docs',
            description: 'Complete guide to creating and managing DigitalOcean Droplets.',
          },
          {
            title: 'DigitalOcean Cloud Firewalls',
            url: 'https://docs.digitalocean.com/products/networking/firewalls/',
            type: 'docs',
            description: 'How to configure network firewalls for Droplets.',
          },
        ]}
      />
    </div>
  )
}
