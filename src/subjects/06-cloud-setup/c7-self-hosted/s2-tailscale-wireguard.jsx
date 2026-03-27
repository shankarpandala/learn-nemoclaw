import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function TailscaleWireguard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Tailscale and WireGuard for Home NemoClaw Access
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A self-hosted NemoClaw instance behind a home router or office firewall needs a secure
        way for remote team members to access it. Opening ports on your home router is dangerous
        and unreliable. Instead, VPN solutions like Tailscale and WireGuard create encrypted
        tunnels that let you access your NemoClaw instance from anywhere -- as if you were on the
        same local network -- without exposing any ports to the public internet.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Tailscale: The Easy Path
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Tailscale is the recommended solution for most self-hosted NemoClaw deployments. It uses
        WireGuard under the hood but handles all the complexity of key management, NAT traversal,
        and peer discovery automatically. Setup takes less than five minutes and requires no
        network configuration changes on your router.
      </p>

      <StepBlock
        title="Set Up Tailscale for Home NemoClaw"
        steps={[
          {
            title: 'Install Tailscale on the NemoClaw machine',
            content: 'On the Proxmox VM (or bare metal machine) running NemoClaw:\n\ncurl -fsSL https://tailscale.com/install.sh | sh\nsudo tailscale up\n\nA URL will be printed. Open it in a browser to authenticate with your identity provider (Google, GitHub, Microsoft, etc.).',
          },
          {
            title: 'Note the Tailscale IP',
            content: 'After authentication:\n\ntailscale ip -4\n# Output: 100.64.x.y\n\nThis is the stable Tailscale IP for your NemoClaw instance.',
          },
          {
            title: 'Install Tailscale on your devices',
            content: 'Install Tailscale on every device that needs to access NemoClaw:\n- macOS/Windows/Linux: Download from tailscale.com/download\n- iOS/Android: Install from App Store / Play Store\n\nSign in with the same identity provider.',
          },
          {
            title: 'Access NemoClaw remotely',
            content: 'From any device on your Tailscale network:\n\n# SSH access\nssh ubuntu@100.64.x.y\n\n# Control UI access\n# Open http://100.64.x.y:18789 in your browser\n\nThis works from anywhere -- home, office, coffee shop, phone tethering.',
          },
          {
            title: 'Enable Tailscale SSH (optional)',
            content: 'Tailscale can replace OpenSSH entirely, using your identity provider for authentication:\n\nsudo tailscale up --ssh\n\nNow team members can SSH in using their Tailscale identity without managing SSH keys.',
          },
          {
            title: 'Share with team members',
            content: 'Add team members to your Tailscale network (Tailnet). On the free plan, up to 3 users and 100 devices. For teams, Tailscale Teams plan provides user management and ACLs.\n\nEach team member installs Tailscale, joins your Tailnet, and can immediately access the NemoClaw instance via its Tailscale IP.',
          },
        ]}
      />

      <NoteBlock type="tip" title="Tailscale ACLs for NemoClaw">
        <p>
          On Tailscale's paid plans, you can define ACLs (Access Control Lists) that restrict
          which team members can access which devices and ports. For example, you could allow
          all team members to reach the NemoClaw Control UI (port 18789) but restrict SSH access
          (port 22) to administrators only. ACLs are defined as JSON in the Tailscale admin console.
        </p>
      </NoteBlock>

      <CodeBlock
        language="json"
        title="Example Tailscale ACL for NemoClaw"
        code={`{
  "acls": [
    {
      "action": "accept",
      "src": ["group:admins"],
      "dst": ["tag:nemoclaw:*"]
    },
    {
      "action": "accept",
      "src": ["group:developers"],
      "dst": ["tag:nemoclaw:18789"]
    }
  ],
  "tagOwners": {
    "tag:nemoclaw": ["group:admins"]
  },
  "groups": {
    "group:admins": ["admin@example.com"],
    "group:developers": ["dev1@example.com", "dev2@example.com"]
  }
}`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        WireGuard: The Manual Path
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If you prefer full control over your VPN configuration, or if your organization requires
        self-hosted VPN infrastructure, WireGuard can be configured manually. WireGuard is a
        modern, fast, and cryptographically sound VPN protocol built into the Linux kernel.
      </p>

      <StepBlock
        title="Manual WireGuard Setup"
        steps={[
          {
            title: 'Install WireGuard on the NemoClaw server',
            content: 'sudo apt update && sudo apt install -y wireguard\n\nGenerate server keys:\nwg genkey | sudo tee /etc/wireguard/server_private.key | wg pubkey | sudo tee /etc/wireguard/server_public.key\nsudo chmod 600 /etc/wireguard/server_private.key',
          },
          {
            title: 'Configure the server',
            content: 'Create /etc/wireguard/wg0.conf:\n\n[Interface]\nAddress = 10.0.0.1/24\nListenPort = 51820\nPrivateKey = <server-private-key>\nPostUp = iptables -A FORWARD -i wg0 -j ACCEPT\nPostDown = iptables -D FORWARD -i wg0 -j ACCEPT\n\n[Peer]\n# Client 1 (your laptop)\nPublicKey = <client-public-key>\nAllowedIPs = 10.0.0.2/32',
          },
          {
            title: 'Forward a port on your router',
            content: 'WireGuard requires one UDP port to be forwarded from your router to the NemoClaw server. Forward UDP port 51820 to the server\'s local IP address. This is the only port exposure required.',
          },
          {
            title: 'Start WireGuard',
            content: 'sudo wg-quick up wg0\nsudo systemctl enable wg-quick@wg0\n\nVerify:\nsudo wg show',
          },
          {
            title: 'Configure the client',
            content: 'On your laptop/device, install WireGuard and create a config:\n\n[Interface]\nAddress = 10.0.0.2/32\nPrivateKey = <client-private-key>\nDNS = 1.1.1.1\n\n[Peer]\nPublicKey = <server-public-key>\nEndpoint = <your-home-public-ip>:51820\nAllowedIPs = 10.0.0.0/24\nPersistentKeepalive = 25',
          },
          {
            title: 'Connect and test',
            content: 'Activate the WireGuard tunnel on your client:\n\nsudo wg-quick up wg0\nping 10.0.0.1\nssh ubuntu@10.0.0.1\n\nAccess the Control UI at http://10.0.0.1:18789',
          },
        ]}
      />

      <WarningBlock title="Dynamic Home IP Addresses">
        <p>
          Most residential internet connections have dynamic public IP addresses that change
          periodically. If your home IP changes, your WireGuard clients will lose connectivity
          until updated. Use a dynamic DNS service (like duckdns.org or afraid.org) to maintain
          a stable hostname that always resolves to your current IP. Configure the WireGuard
          client Endpoint to use the hostname instead of a raw IP. Tailscale avoids this problem
          entirely through its coordination server.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Comparison
      </h2>

      <ComparisonTable
        title="Tailscale vs. Manual WireGuard"
        headers={['Factor', 'Tailscale', 'WireGuard (Manual)']}
        rows={[
          ['Setup time', '5 minutes', '30-60 minutes'],
          ['Router port forwarding', 'Not required (NAT traversal)', 'Required (UDP 51820)'],
          ['Key management', 'Automatic', 'Manual per peer'],
          ['Dynamic IP handling', 'Automatic', 'Requires DDNS setup'],
          ['Adding team members', 'Install and sign in', 'Generate keys, update server config, distribute'],
          ['ACL management', 'Web-based admin console', 'Manual iptables/nftables rules'],
          ['Self-hosted option', 'Headscale (OSS control server)', 'Fully self-hosted by design'],
          ['Cost', 'Free for 3 users / paid for teams', 'Free (open source)'],
          ['Data sovereignty', 'Metadata through Tailscale servers', 'Fully self-contained'],
        ]}
      />

      <NoteBlock type="info" title="Headscale: Self-Hosted Tailscale">
        <p>
          If you want Tailscale's ease of use but need full self-hosting (no external
          coordination server), consider Headscale -- an open-source, self-hosted implementation
          of the Tailscale coordination server. It provides the same client experience but runs
          entirely on your infrastructure. This satisfies data sovereignty requirements while
          retaining Tailscale's NAT traversal and key management benefits.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="What is the main advantage of Tailscale over manual WireGuard for accessing a home-hosted NemoClaw?"
        options={[
          'Tailscale is faster than WireGuard',
          'Tailscale handles NAT traversal automatically, eliminating the need for router port forwarding',
          'Tailscale provides stronger encryption',
          'Tailscale works without internet access',
        ]}
        correctIndex={1}
        explanation="Tailscale's biggest practical advantage is automatic NAT traversal. It establishes direct peer-to-peer connections without requiring any port forwarding on your home router. Manual WireGuard requires you to forward UDP port 51820, which can be complex on some routers and fails entirely if you cannot modify router settings (e.g., double NAT situations)."
      />

      <ReferenceList
        references={[
          {
            title: 'Tailscale Documentation',
            url: 'https://tailscale.com/kb/',
            type: 'docs',
            description: 'Comprehensive Tailscale knowledge base.',
          },
          {
            title: 'WireGuard Documentation',
            url: 'https://www.wireguard.com/',
            type: 'docs',
            description: 'Official WireGuard protocol documentation and configuration guide.',
          },
          {
            title: 'Headscale',
            url: 'https://github.com/juanfont/headscale',
            type: 'github',
            description: 'Self-hosted, open-source Tailscale control server.',
          },
        ]}
      />
    </div>
  )
}
