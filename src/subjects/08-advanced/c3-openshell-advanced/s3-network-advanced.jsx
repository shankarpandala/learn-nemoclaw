import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, ComparisonTable } from '../../../components/content'

export default function NetworkAdvanced() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Advanced Network Namespace Configuration
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's network isolation is built on Linux network namespaces -- each sandbox
        gets its own isolated network stack with its own interfaces, routing table, and
        iptables rules. In the standard configuration, this is transparent: NemoClaw creates a
        namespace, sets up a veth pair to connect the sandbox to the host, and configures
        iptables rules to enforce the network policy. For most use cases, this default
        configuration works without modification. However, advanced deployments sometimes
        require more complex network topologies: multiple namespaces for multi-agent
        orchestration, custom routing tables for traffic segmentation, or traffic shaping for
        rate limiting and bandwidth control.
      </p>

      <DefinitionBlock
        term="Network Namespace"
        definition="A Linux kernel feature that provides an isolated copy of the network stack. Each network namespace has its own network interfaces, IP addresses, routing tables, iptables rules, and socket listings. Processes in different namespaces cannot communicate through the network unless explicitly connected (e.g., via a veth pair or bridge). Network namespaces are the foundation of container networking."
        example="A NemoClaw sandbox runs in its own network namespace with a single veth interface (eth0 inside the namespace, vethXXX on the host). The host-side iptables rules filter traffic based on the blueprint's network policy, allowing only whitelisted destinations."
        seeAlso={['veth pair', 'iptables', 'Network Policy', 'Linux Namespaces']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Default Network Topology
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Understanding the default topology is necessary before extending it. When NemoClaw
        creates a sandbox, the following network setup is established:
      </p>

      <CodeBlock
        language="text"
        title="Default NemoClaw network topology"
      >{`Host Network Namespace                    Sandbox Network Namespace
┌─────────────────────────┐              ┌─────────────────────────┐
│                         │              │                         │
│   eth0 (host NIC)       │              │   eth0 (sandbox NIC)    │
│   192.168.1.100         │              │   10.0.100.2/24         │
│                         │              │                         │
│   vethXXXX ─────────────┼──────────────┼── eth0 (veth peer)      │
│   10.0.100.1/24         │   veth pair  │   10.0.100.2/24         │
│                         │              │                         │
│   iptables rules:       │              │   default route:        │
│   - FORWARD chain       │              │   via 10.0.100.1        │
│   - per-sandbox rules   │              │                         │
│   - NAT for allowed     │              │   DNS: 10.0.100.1       │
│     destinations        │              │   (resolved by host)    │
│                         │              │                         │
└─────────────────────────┘              └─────────────────────────┘`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Multiple Namespaces for Multi-Agent Deployments
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When running multiple NemoClaw agents that need to communicate with each other -- for
        example, in a multi-agent orchestration pattern where a coordinator agent delegates
        subtasks to specialist agents -- you need network connectivity between sandboxes. By
        default, each sandbox is completely isolated; there is no network path between them.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw supports interconnecting sandboxes through a shared bridge network. This
        creates a virtual network switch that connects multiple sandbox namespaces while
        maintaining isolation from the host network and the internet.
      </p>

      <CodeBlock
        language="yaml"
        title="Multi-agent network configuration"
      >{`# In the orchestrator blueprint's network policy
network:
  mode: "bridge"
  bridge_name: "nemoclaw-agents"
  subnet: "10.0.200.0/24"
  ip: "10.0.200.1"

  # Allow communication with other agents on the same bridge
  allow:
    - group: "inter-agent"
      rules:
        - host: "10.0.200.0/24"
          port: 8080
          description: "Communication with peer agents"

    - group: "llm"
      rules:
        - host: "integrate.api.nvidia.com"
          port: 443
          tls: required`}</CodeBlock>

      <CodeBlock
        language="bash"
        title="Inspecting multi-agent network topology"
      >{`# List all NemoClaw bridge networks
nemoclaw network list

# Show the topology of a specific bridge
nemoclaw network inspect nemoclaw-agents
# Output:
# Bridge: nemoclaw-agents (10.0.200.0/24)
# Connected sandboxes:
#   - orchestrator (10.0.200.1)
#   - code-reviewer (10.0.200.2)
#   - test-runner (10.0.200.3)

# From the host, inspect the network namespace
ip netns list
# nemoclaw-sandbox-abc123
# nemoclaw-sandbox-def456
# nemoclaw-sandbox-ghi789

# Inspect interfaces inside a namespace
ip netns exec nemoclaw-sandbox-abc123 ip addr show`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Veth Pairs and Custom Routing
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A veth (virtual Ethernet) pair is a pair of network interfaces connected like a pipe:
        packets sent on one end appear on the other. NemoClaw creates one veth pair per sandbox,
        with one end in the sandbox namespace and the other on the host (or on a bridge). For
        advanced topologies, you can configure additional veth pairs to create direct connections
        between specific sandboxes or to segment traffic.
      </p>

      <CodeBlock
        language="yaml"
        title="Custom routing table configuration"
      >{`# Advanced network configuration with custom routing
network:
  mode: "custom"
  interfaces:
    - name: "eth0"
      type: "veth"
      peer: "host"
      ip: "10.0.100.2/24"
      routes:
        # Default route through the host for allowed internet traffic
        - destination: "0.0.0.0/0"
          gateway: "10.0.100.1"
          table: "main"

    - name: "eth1"
      type: "veth"
      peer: "bridge:nemoclaw-agents"
      ip: "10.0.200.5/24"
      routes:
        # Route inter-agent traffic through the bridge
        - destination: "10.0.200.0/24"
          gateway: "direct"
          table: "main"

  # Policy-based routing: route LLM traffic through a specific interface
  rules:
    - match:
        destination: "integrate.api.nvidia.com"
      action:
        table: "main"
        interface: "eth0"`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Traffic Shaping and Rate Limiting
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Traffic shaping controls the rate at which a sandbox can send and receive network
        traffic. This is useful for preventing a single agent from consuming all available
        bandwidth, for simulating bandwidth-constrained environments during testing, or for
        implementing rate limits that complement the API-level rate limits of external services.
      </p>

      <CodeBlock
        language="yaml"
        title="Traffic shaping configuration"
      >{`# Network policy with traffic shaping
network:
  traffic_shaping:
    # Limit total bandwidth
    egress:
      rate: "10mbit"          # Maximum outbound bandwidth
      burst: "1mbit"          # Burst allowance
    ingress:
      rate: "50mbit"          # Maximum inbound bandwidth
      burst: "5mbit"

    # Per-destination rate limiting
    per_host_limits:
      - host: "api.github.com"
        rate: "5mbit"
        connections_per_second: 10   # Max new connections per second

      - host: "integrate.api.nvidia.com"
        rate: "10mbit"
        connections_per_second: 50`}</CodeBlock>

      <NoteBlock type="info" title="Traffic Shaping Implementation">
        <p>
          NemoClaw implements traffic shaping using Linux tc (traffic control) with the HTB
          (Hierarchical Token Bucket) queuing discipline. The configuration in the blueprint
          is translated into tc commands applied to the veth interface on the host side of the
          connection. This means traffic shaping is enforced by the host, not by the sandbox --
          the sandboxed process cannot bypass or modify the shaping rules.
        </p>
      </NoteBlock>

      <WarningBlock title="Performance Impact of Complex Network Topologies">
        <p>
          Each additional veth pair, bridge, and iptables rule adds a small amount of latency
          and CPU overhead to network operations. For most NemoClaw deployments, this overhead
          is negligible (microseconds per packet). However, in high-throughput multi-agent
          deployments with heavy inter-agent communication, the cumulative overhead can become
          measurable. Profile your network performance if you are building complex topologies
          with many interconnected sandboxes.
        </p>
      </WarningBlock>

      <ComparisonTable
        title="Network Configuration Modes"
        headers={['Mode', 'Topology', 'Use Case', 'Complexity']}
        rows={[
          ['default', 'Single veth to host', 'Standard single-agent sandbox', 'None -- automatic'],
          ['bridge', 'Veth pairs connected via bridge', 'Multi-agent communication', 'Low -- YAML config'],
          ['custom', 'Multiple interfaces, custom routes', 'Complex multi-tier architectures', 'High -- requires networking knowledge'],
          ['none', 'No network access at all', 'Fully offline agents', 'None -- automatic'],
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Advanced network configuration gives you the flexibility to build sophisticated
        multi-agent deployments with controlled communication channels, traffic isolation, and
        bandwidth management. In the next section, we cover how to debug issues when sandbox
        isolation does not behave as expected -- using strace, nsenter, and other tools to
        diagnose Landlock, seccomp, and network problems from within and outside the sandbox.
      </p>
    </div>
  )
}
