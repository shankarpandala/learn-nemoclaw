import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function SecurityGroups() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Firewall and Security Group Configuration
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A properly configured firewall is the first line of defense for any cloud-hosted NemoClaw
        deployment. Unlike a typical web application that needs to expose HTTP ports to the internet,
        NemoClaw requires no public-facing ports at all. The Gateway communicates outbound to LLM
        APIs and messaging platforms -- it does not need to accept inbound connections from the
        public internet. This makes the firewall configuration remarkably simple: allow SSH for
        administration, block everything else inbound, and use a VPN or tunnel for remote access
        to the Control UI.
      </p>

      <DefinitionBlock
        term="Security Group"
        definition="A virtual firewall provided by cloud platforms (AWS, GCP, Azure) that controls inbound and outbound network traffic to cloud instances. Security groups operate at the instance level and evaluate rules statelessly for inbound and statefully for return traffic. They are the cloud equivalent of iptables or nftables rules."
        example="An AWS security group with a single inbound rule allowing TCP port 22 from your office IP address, and a default outbound rule allowing all traffic. This permits SSH access while blocking all other inbound connections."
        seeAlso={['Firewall Rule', 'Network ACL', 'VPC']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why NemoClaw Needs No Public Ports
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Understanding why NemoClaw does not need inbound ports requires understanding its
        communication model. The OpenClaw Gateway initiates all external connections outbound:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Slack integration</span> uses Socket Mode, which establishes
          an outbound WebSocket connection to Slack's servers. Slack pushes events through this
          connection. No inbound webhook port is needed.
        </li>
        <li>
          <span className="font-semibold">Discord integration</span> connects outbound to Discord's
          gateway via WebSocket. Again, no inbound port is required.
        </li>
        <li>
          <span className="font-semibold">LLM API calls</span> (Anthropic, OpenAI) are outbound HTTPS
          requests. The LLM provider never initiates connections to your server.
        </li>
        <li>
          <span className="font-semibold">The Control UI</span> listens on port 18789 but should only
          be accessible to administrators, not the public internet. Access should be through SSH
          tunneling, VPN, or Tailscale.
        </li>
      </ul>

      <WarningBlock title="Never Expose the Control UI to the Public Internet">
        <p>
          The Control UI has no built-in authentication. Anyone who can reach port 18789 can view all
          conversations, modify agent configurations, and change policy rules. Exposing this port
          publicly is equivalent to giving anonymous users full administrative access to your NemoClaw
          deployment. Always access it through a tunnel or VPN.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The Minimal Security Group
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The ideal security group for a NemoClaw instance has exactly one inbound rule and
        permissive outbound rules. Here is the configuration expressed in a provider-agnostic format:
      </p>

      <CodeBlock
        language="text"
        title="Recommended Security Group Rules"
        code={`INBOUND RULES:
  Rule 1: SSH
    Protocol: TCP
    Port:     22
    Source:   <your-ip>/32    (or your office CIDR block)
    Action:   ALLOW

  Rule 2 (implicit):
    All other inbound traffic: DENY

OUTBOUND RULES:
  Rule 1: All traffic
    Protocol: All
    Port:     All
    Destination: 0.0.0.0/0
    Action:   ALLOW`}
      />

      <NoteBlock type="tip" title="Restricting SSH Source IP">
        <p>
          Always restrict the SSH source to your specific IP address or a narrow CIDR range.
          Using <code>0.0.0.0/0</code> (anywhere) for SSH access exposes your instance to brute-force
          attacks from the entire internet. If your IP changes frequently, consider using a VPN with a
          static IP as your SSH bastion, or use Tailscale to eliminate the need for public SSH entirely.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Provider-Specific Configuration
      </h2>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        AWS Security Groups
      </h3>

      <CodeBlock
        language="bash"
        title="Create AWS Security Group via CLI"
        code={`# Create the security group
aws ec2 create-security-group \\
  --group-name nemoclaw-sg \\
  --description "NemoClaw - SSH only inbound" \\
  --vpc-id vpc-0123456789abcdef0

# Add SSH rule (replace YOUR_IP with your actual IP)
aws ec2 authorize-security-group-ingress \\
  --group-name nemoclaw-sg \\
  --protocol tcp \\
  --port 22 \\
  --cidr YOUR_IP/32

# Verify the rules
aws ec2 describe-security-groups \\
  --group-names nemoclaw-sg \\
  --query 'SecurityGroups[0].IpPermissions'`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        GCP Firewall Rules
      </h3>

      <CodeBlock
        language="bash"
        title="Create GCP Firewall Rule via gcloud"
        code={`# Create firewall rule for SSH
gcloud compute firewall-rules create nemoclaw-allow-ssh \\
  --direction=INGRESS \\
  --priority=1000 \\
  --network=default \\
  --action=ALLOW \\
  --rules=tcp:22 \\
  --source-ranges=YOUR_IP/32 \\
  --target-tags=nemoclaw

# Verify
gcloud compute firewall-rules describe nemoclaw-allow-ssh`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Azure Network Security Group
      </h3>

      <CodeBlock
        language="bash"
        title="Create Azure NSG via az CLI"
        code={`# Create NSG
az network nsg create \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-nsg

# Add SSH rule
az network nsg rule create \\
  --resource-group nemoclaw-rg \\
  --nsg-name nemoclaw-nsg \\
  --name AllowSSH \\
  --priority 100 \\
  --direction Inbound \\
  --access Allow \\
  --protocol Tcp \\
  --destination-port-ranges 22 \\
  --source-address-prefixes YOUR_IP/32`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        VPN and Tailscale for Remote Access
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The most secure approach eliminates public SSH entirely. Instead of exposing port 22 to
        the internet, install Tailscale on both your local machine and the cloud instance. Tailscale
        creates a WireGuard-based mesh VPN that assigns each device a stable private IP. You can then
        access SSH and the Control UI over the Tailscale network without any public inbound rules at all.
      </p>

      <CodeBlock
        language="bash"
        title="Zero-Public-Port Setup with Tailscale"
        code={`# On your cloud instance (after initial SSH setup):
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Once Tailscale is running, remove the SSH inbound rule entirely:
# AWS:
aws ec2 revoke-security-group-ingress \\
  --group-name nemoclaw-sg \\
  --protocol tcp \\
  --port 22 \\
  --cidr YOUR_IP/32

# Now SSH via Tailscale IP:
ssh user@100.x.y.z    # Tailscale-assigned IP

# Access Control UI via Tailscale:
# http://100.x.y.z:18789`}
      />

      <NoteBlock type="info" title="Tailscale Free Tier">
        <p>
          Tailscale offers a generous free tier for personal use (up to 100 devices, 3 users).
          For team deployments, their paid plans include ACL management, audit logs, and SSO
          integration. This makes it an excellent choice for securing NemoClaw access without
          the complexity of a traditional VPN setup.
        </p>
      </NoteBlock>

      <StepBlock
        title="Security Group Audit Checklist"
        steps={[
          {
            title: 'Verify inbound rules',
            content: 'Confirm that the only inbound rule is SSH (port 22) from a restricted source IP. No other ports should be open inbound.',
          },
          {
            title: 'Check for 0.0.0.0/0 on SSH',
            content: 'If SSH is open to all IPs, immediately restrict it to your specific IP or CIDR range. Open SSH is a common misconfiguration.',
          },
          {
            title: 'Confirm Control UI is not exposed',
            content: 'Verify that port 18789 is not listed in any inbound rule. Access should only be through SSH tunnel or VPN.',
          },
          {
            title: 'Review outbound rules',
            content: 'Outbound should allow all traffic so NemoClaw can reach LLM APIs and messaging platforms. If you have strict outbound policies, ensure ports 443 (HTTPS) and 53 (DNS) are allowed.',
          },
          {
            title: 'Test from outside',
            content: 'Use an external tool like nmap or a port scanner to verify that only SSH is reachable from the internet. Test from a different network than your allowed IP.',
          },
        ]}
      />

      <ExerciseBlock
        question="Why does NemoClaw not require any inbound HTTP/HTTPS ports to function with Slack?"
        options={[
          'Slack sends messages via email, not HTTP',
          'NemoClaw uses Slack Socket Mode which establishes an outbound WebSocket connection',
          'Slack messages are stored in a shared database that NemoClaw polls',
          'NemoClaw uses a CDN to receive Slack events',
        ]}
        correctIndex={1}
        explanation="Slack Socket Mode works by having the application (NemoClaw's Gateway) establish an outbound WebSocket connection to Slack's servers. Slack then pushes events through this persistent connection. Since the connection is initiated outbound, no inbound port needs to be open."
      />

      <ReferenceList
        references={[
          {
            title: 'AWS Security Groups Documentation',
            url: 'https://docs.aws.amazon.com/vpc/latest/userguide/security-groups.html',
            type: 'docs',
            description: 'Official AWS guide to security group rules and best practices.',
          },
          {
            title: 'Tailscale Documentation',
            url: 'https://tailscale.com/kb/',
            type: 'docs',
            description: 'Tailscale knowledge base covering setup, ACLs, and integration guides.',
          },
        ]}
      />
    </div>
  )
}
