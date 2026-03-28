import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function ComputeEngine() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Creating a GCE VM for NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Google Cloud Platform's Compute Engine (GCE) provides virtual machines with predictable
        performance and tight integration with Google's global network. For NemoClaw, GCE offers
        competitive pricing, a wide range of machine types, and excellent network performance.
        This section walks through creating a properly configured GCE VM from scratch.
      </p>

      <NoteBlock type="info" title="Prerequisites">
        <p>
          You need a GCP account with a billing-enabled project. Install the
          <code> gcloud</code> CLI locally and authenticate with <code>gcloud auth login</code>.
          Alternatively, use the GCP Console web interface for all steps.
        </p>
      </NoteBlock>

      <StepBlock
        title="Create a GCE VM via Console"
        steps={[
          {
            title: 'Navigate to Compute Engine',
            content: 'In the GCP Console, go to Compute Engine > VM Instances > Create Instance. If this is your first time using Compute Engine, you may need to wait a moment for the API to be enabled.',
          },
          {
            title: 'Name and region',
            content: 'Name the instance "nemoclaw-prod" or similar. Select a region close to your team. For US-based teams, us-central1 (Iowa) typically offers the best pricing and availability. Select any available zone within the region.',
          },
          {
            title: 'Choose machine type',
            content: 'Under Machine Configuration, select the E2 series for cost-effective general purpose. Choose e2-standard-4 (4 vCPU, 16 GB RAM) as the recommended starting point. For budget testing, e2-standard-2 (2 vCPU, 8 GB) works. For larger teams, c2-standard-8 (8 vCPU, 32 GB) provides CPU-optimized performance.',
          },
          {
            title: 'Select boot disk',
            content: 'Click "Change" on the Boot Disk section. Select Ubuntu 22.04 LTS as the operating system. Change the disk size from the default 10 GB to 30 GB. Select "Balanced persistent disk" (pd-balanced) for the disk type -- it offers good performance at reasonable cost.',
          },
          {
            title: 'Configure firewall',
            content: 'Under Firewall, do NOT check "Allow HTTP traffic" or "Allow HTTPS traffic". NemoClaw does not need any public web ports. SSH access is allowed by default through GCP\'s IAP (Identity-Aware Proxy) or the OS Login feature.',
          },
          {
            title: 'Configure SSH access',
            content: 'Under Security > SSH Keys, add your public SSH key. Alternatively, leave this empty and use GCP\'s browser-based SSH or gcloud compute ssh which handles key management automatically.',
          },
          {
            title: 'Network tags',
            content: 'Under Networking > Network Tags, add the tag "nemoclaw". This tag will be used to apply firewall rules specifically to this instance.',
          },
          {
            title: 'Create the VM',
            content: 'Click "Create" and wait for the instance to start. This typically takes 30-60 seconds.',
          },
          {
            title: 'Connect via SSH',
            content: 'Use the gcloud CLI:\n\ngcloud compute ssh nemoclaw-prod --zone=us-central1-a\n\nOr click the "SSH" button in the Console to open a browser-based terminal.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        CLI Alternative
      </h2>

      <CodeBlock
        language="bash"
        title="Create GCE VM via gcloud CLI"
        code={`# Create the VM
gcloud compute instances create nemoclaw-prod \\
  --zone=us-central1-a \\
  --machine-type=e2-standard-4 \\
  --image-family=ubuntu-2204-lts \\
  --image-project=ubuntu-os-cloud \\
  --boot-disk-size=30GB \\
  --boot-disk-type=pd-balanced \\
  --tags=nemoclaw \\
  --metadata=enable-oslogin=TRUE

# The --metadata=enable-oslogin=TRUE flag enables OS Login,
# which uses your Google identity for SSH access instead of
# manually managing SSH keys.

# SSH into the instance
gcloud compute ssh nemoclaw-prod --zone=us-central1-a

# Get the external IP
gcloud compute instances describe nemoclaw-prod \\
  --zone=us-central1-a \\
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GCP SSH Access Methods
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GCP offers several SSH access methods, each with different security characteristics:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">gcloud compute ssh:</span> The recommended method.
          Automatically manages SSH keys, supports OS Login, and works through IAP tunneling
          which does not require a public IP or open SSH port.
        </li>
        <li>
          <span className="font-semibold">IAP TCP Forwarding:</span> Routes SSH through Google's
          Identity-Aware Proxy. The VM does not need a public IP address at all. Enable with:
          <code> gcloud compute ssh nemoclaw-prod --tunnel-through-iap</code>.
        </li>
        <li>
          <span className="font-semibold">Browser SSH:</span> Click the "SSH" button in the Console.
          Opens a terminal in your browser. Convenient but lacks the ability to set up port
          forwarding for the Control UI.
        </li>
        <li>
          <span className="font-semibold">Direct SSH:</span> Traditional SSH with your own key pair.
          Requires port 22 open in the firewall. Use this if you prefer standard SSH workflows.
        </li>
      </ul>

      <NoteBlock type="tip" title="IAP Tunneling: No Public IP Needed">
        <p>
          Using IAP TCP forwarding, you can SSH into your NemoClaw instance without assigning it
          a public IP address at all. This is the most secure option because the instance is
          completely unreachable from the public internet. Outbound connections (to LLM APIs, Slack,
          etc.) still work through Cloud NAT. Forward the Control UI through IAP:
          <code> gcloud compute ssh nemoclaw-prod --tunnel-through-iap -- -L 18789:localhost:18789</code>
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Static External IP (Optional)
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Like AWS Elastic IPs, GCP ephemeral external IPs change when the instance is stopped and
        restarted. Reserve a static IP if you need a consistent address:
      </p>

      <CodeBlock
        language="bash"
        title="Reserve and Assign a Static IP"
        code={`# Reserve a static IP
gcloud compute addresses create nemoclaw-ip \\
  --region=us-central1

# Get the reserved IP
gcloud compute addresses describe nemoclaw-ip \\
  --region=us-central1 \\
  --format='get(address)'

# Assign to your instance (requires instance restart)
gcloud compute instances delete-access-config nemoclaw-prod \\
  --zone=us-central1-a \\
  --access-config-name="External NAT"

gcloud compute instances add-access-config nemoclaw-prod \\
  --zone=us-central1-a \\
  --address=STATIC_IP_ADDRESS`}
      />

      <WarningBlock title="Static IP Charges">
        <p>
          GCP charges ~$7.30/month for a static IP that is reserved but not attached to a running
          instance. If you stop your NemoClaw instance for extended periods, consider releasing
          the static IP to avoid charges. Unlike AWS, GCP also charges a small fee for static
          IPs even when attached and in use (~$1.46/month).
        </p>
      </WarningBlock>

      <ExerciseBlock
        question="What is the most secure SSH access method for a NemoClaw GCE instance?"
        options={[
          'Direct SSH with port 22 open to 0.0.0.0/0',
          'Browser-based SSH from the GCP Console',
          'IAP TCP Forwarding with no public IP assigned',
          'VNC remote desktop connection',
        ]}
        correctIndex={2}
        explanation="IAP (Identity-Aware Proxy) TCP forwarding routes SSH through Google's proxy infrastructure, meaning the VM does not need a public IP address or an open SSH port. Authentication is handled through your Google identity. This eliminates the entire attack surface of a public-facing SSH port."
      />

      <ReferenceList
        references={[
          {
            title: 'GCE Quickstart',
            url: 'https://cloud.google.com/compute/docs/quickstart-linux',
            type: 'docs',
            description: 'Official quickstart for creating a Linux VM on Google Compute Engine.',
          },
          {
            title: 'IAP TCP Forwarding',
            url: 'https://cloud.google.com/iap/docs/using-tcp-forwarding',
            type: 'docs',
            description: 'How to use Identity-Aware Proxy for secure SSH access without public IPs.',
          },
        ]}
      />
    </div>
  )
}
