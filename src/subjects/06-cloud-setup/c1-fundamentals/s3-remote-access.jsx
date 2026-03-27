import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function RemoteAccess() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Secure Remote Access to Cloud NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Once your NemoClaw instance is running in the cloud, you need reliable and secure methods
        to access it for administration, monitoring, and debugging. This section covers four
        primary approaches: SSH tunneling, VS Code Remote SSH, Tailscale, and WireGuard. Each
        has distinct advantages depending on your workflow and security requirements.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        SSH Tunneling
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        SSH tunneling (also called SSH port forwarding) is the simplest method for accessing
        NemoClaw's Control UI without exposing it publicly. You create an encrypted tunnel from
        your local machine to the remote instance, forwarding a local port to the remote port
        where the Control UI listens.
      </p>

      <CodeBlock
        language="bash"
        title="SSH Local Port Forwarding"
        code={`# Forward local port 18789 to remote port 18789
ssh -L 18789:localhost:18789 ubuntu@your-instance-ip

# Now open in your browser:
# http://localhost:18789

# To run the tunnel in the background without an interactive shell:
ssh -fNL 18789:localhost:18789 ubuntu@your-instance-ip

# -f  Run in background
# -N  No remote command (tunnel only)
# -L  Local port forwarding

# Forward multiple ports at once (Control UI + custom metrics):
ssh -L 18789:localhost:18789 -L 9090:localhost:9090 ubuntu@your-instance-ip`}
      />

      <NoteBlock type="tip" title="SSH Config for Convenience">
        <p>
          Add your NemoClaw instance to <code>~/.ssh/config</code> to avoid typing long commands
          every time:
        </p>
      </NoteBlock>

      <CodeBlock
        language="text"
        title="~/.ssh/config"
        code={`Host nemoclaw
  HostName 54.123.45.67
  User ubuntu
  IdentityFile ~/.ssh/nemoclaw-key.pem
  LocalForward 18789 localhost:18789
  ServerAliveInterval 60
  ServerAliveCountMax 3`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With this configuration, you simply run <code>ssh nemoclaw</code> and the tunnel is
        established automatically. The <code>ServerAliveInterval</code> setting sends keepalive
        packets every 60 seconds to prevent the connection from being dropped by intermediate
        firewalls or NAT devices.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        VS Code Remote SSH
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        VS Code's Remote SSH extension provides a seamless development experience on your cloud
        instance. It installs a lightweight VS Code server on the remote machine, giving you full
        editor capabilities including file browsing, integrated terminal, and extension support --
        all running on the remote instance's hardware.
      </p>

      <StepBlock
        title="Setting Up VS Code Remote SSH"
        steps={[
          {
            title: 'Install the Remote SSH extension',
            content: 'In VS Code, open the Extensions panel (Ctrl+Shift+X) and search for "Remote - SSH" by Microsoft. Install it.',
          },
          {
            title: 'Configure SSH host',
            content: 'Press Ctrl+Shift+P, type "Remote-SSH: Open Configuration File", and add your NemoClaw instance details (same format as ~/.ssh/config shown above).',
          },
          {
            title: 'Connect to the instance',
            content: 'Press Ctrl+Shift+P, type "Remote-SSH: Connect to Host", and select your NemoClaw instance. VS Code will install its server component on the remote machine (first connection only).',
          },
          {
            title: 'Open the NemoClaw directory',
            content: 'Once connected, use File > Open Folder to navigate to your NemoClaw installation directory, typically /opt/nemoclaw or ~/nemoclaw.',
          },
          {
            title: 'Access the Control UI',
            content: 'VS Code automatically detects port forwarding. When NemoClaw is running, VS Code will offer to forward port 18789. You can also manually forward ports in the "Ports" panel at the bottom of the VS Code window.',
          },
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The advantage of VS Code Remote SSH over plain SSH is the ability to edit NemoClaw
        configuration files, policy rules, and SOUL.md documents with full editor features
        including syntax highlighting, IntelliSense, and integrated git. For teams that frequently
        modify NemoClaw policies, this workflow is significantly more productive than command-line
        editing.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Tailscale
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Tailscale is a zero-configuration mesh VPN built on WireGuard. It assigns each device a
        stable IP address in the 100.x.y.z range and handles NAT traversal, key management, and
        access control automatically. For NemoClaw deployments, Tailscale is the recommended
        approach because it eliminates the need for any public inbound ports.
      </p>

      <CodeBlock
        language="bash"
        title="Installing Tailscale on Your NemoClaw Instance"
        code={`# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start Tailscale and authenticate
sudo tailscale up

# Check your Tailscale IP
tailscale ip -4
# Output: 100.64.0.2 (example)

# From your local machine (also running Tailscale):
ssh ubuntu@100.64.0.2

# Access Control UI directly:
# http://100.64.0.2:18789

# No SSH tunneling needed -- Tailscale creates a direct encrypted path`}
      />

      <NoteBlock type="info" title="Tailscale SSH">
        <p>
          Tailscale can replace OpenSSH entirely with its built-in SSH server. Enable it
          with <code>tailscale up --ssh</code> on the remote instance. This allows SSH access
          using Tailscale identity without managing SSH keys -- authentication is handled through
          your Tailscale identity provider (Google, GitHub, Microsoft, etc.).
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        WireGuard (Manual Setup)
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        WireGuard is the underlying protocol that Tailscale uses, but you can also configure it
        directly for full control over your VPN topology. Manual WireGuard setup is more complex
        than Tailscale but gives you complete control over routing, DNS, and network configuration.
        It is best suited for teams with existing WireGuard infrastructure or specific compliance
        requirements.
      </p>

      <CodeBlock
        language="bash"
        title="WireGuard Setup on the NemoClaw Instance (Server Side)"
        code={`# Install WireGuard
sudo apt update && sudo apt install -y wireguard

# Generate server keys
wg genkey | sudo tee /etc/wireguard/server_private.key | wg pubkey | sudo tee /etc/wireguard/server_public.key
sudo chmod 600 /etc/wireguard/server_private.key

# Create server config
sudo cat > /etc/wireguard/wg0.conf << 'EOF'
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <server-private-key>

[Peer]
# Your local machine
PublicKey = <client-public-key>
AllowedIPs = 10.0.0.2/32
EOF

# Start WireGuard
sudo wg-quick up wg0
sudo systemctl enable wg-quick@wg0`}
      />

      <WarningBlock title="WireGuard Requires an Inbound Port">
        <p>
          Unlike Tailscale which uses NAT traversal, a manual WireGuard server requires
          UDP port 51820 to be open in your security group. This is still more secure than
          exposing SSH or HTTP ports, since WireGuard uses cryptographic authentication and
          silently drops all packets from unknown peers. However, it does increase your attack
          surface compared to a zero-inbound-port Tailscale setup.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Comparison of Access Methods
      </h2>

      <ComparisonTable
        title="Remote Access Methods Compared"
        headers={['Method', 'Setup Complexity', 'Public Ports Needed', 'Best For']}
        rows={[
          ['SSH Tunneling', 'Low', 'SSH (22)', 'Quick access, single user, simple setups'],
          ['VS Code Remote SSH', 'Low', 'SSH (22)', 'Active development on NemoClaw config/policies'],
          ['Tailscale', 'Very Low', 'None', 'Team access, zero-trust, recommended default'],
          ['WireGuard (manual)', 'High', 'UDP 51820', 'Existing WireGuard infra, compliance requirements'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Best Practices
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Use key-based SSH authentication only.</span> Disable
          password authentication in <code>/etc/ssh/sshd_config</code> by setting
          <code> PasswordAuthentication no</code>. This eliminates brute-force password attacks.
        </li>
        <li>
          <span className="font-semibold">Disable root SSH login.</span> Set
          <code> PermitRootLogin no</code> in sshd_config. Use a regular user and
          <code> sudo</code> when elevated privileges are needed.
        </li>
        <li>
          <span className="font-semibold">Keep SSH keys secure.</span> Use Ed25519 keys
          (<code>ssh-keygen -t ed25519</code>) and protect private keys with a passphrase.
          Never share private keys across team members -- each person should have their own key pair.
        </li>
        <li>
          <span className="font-semibold">Rotate access regularly.</span> Remove SSH keys and
          Tailscale devices for team members who no longer need access. Audit authorized_keys
          files monthly.
        </li>
        <li>
          <span className="font-semibold">Log all access.</span> SSH logs to
          <code> /var/log/auth.log</code> by default. Tailscale provides audit logs in its admin
          console. Review these logs periodically for unexpected access patterns.
        </li>
      </ul>

      <ExerciseBlock
        question="Which remote access method allows you to run a NemoClaw cloud instance with zero public inbound ports?"
        options={[
          'SSH tunneling with key-based auth',
          'VS Code Remote SSH',
          'Tailscale',
          'Manual WireGuard VPN',
        ]}
        correctIndex={2}
        explanation="Tailscale uses NAT traversal to establish connections without any inbound ports. SSH tunneling and VS Code Remote SSH both require port 22 open, and manual WireGuard requires UDP port 51820."
      />

      <ReferenceList
        references={[
          {
            title: 'VS Code Remote SSH Documentation',
            url: 'https://code.visualstudio.com/docs/remote/ssh',
            type: 'docs',
            description: 'Official guide for setting up and using VS Code Remote SSH.',
          },
          {
            title: 'Tailscale Getting Started',
            url: 'https://tailscale.com/kb/1017/install/',
            type: 'docs',
            description: 'Installation and initial setup guide for Tailscale.',
          },
          {
            title: 'WireGuard Quick Start',
            url: 'https://www.wireguard.com/quickstart/',
            type: 'docs',
            description: 'Official WireGuard installation and configuration guide.',
          },
        ]}
      />
    </div>
  )
}
