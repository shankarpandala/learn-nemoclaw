import { NoteBlock, ComparisonTable, DefinitionBlock } from '../../../components/content'

export default function DenyByDefault() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Deny by Default: The Foundation of Agent Network Security
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The single most important design decision in NemoClaw's network policy is also the simplest
        to state: every outbound network connection from a sandboxed agent is blocked unless it has
        been explicitly whitelisted. There are no exceptions. There is no default set of "safe"
        destinations. When an agent starts inside an OpenClaw sandbox governed by NemoClaw, it
        cannot reach anything on the internet until the operator has deliberately granted access
        to specific endpoints.
      </p>

      <DefinitionBlock
        term="Deny-by-Default Network Policy"
        definition="A security posture in which all outbound network connections from a sandboxed process are blocked by default. Access to specific endpoints must be explicitly granted through a policy configuration. Any destination not listed in the whitelist is unreachable."
        example="An agent running inside a NemoClaw sandbox cannot connect to api.example.com unless that exact domain appears in the policy YAML. Even common destinations like google.com or pypi.org are blocked until whitelisted."
        seeAlso={['Network Policy', 'Whitelist', 'Egress Filtering']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why Deny-by-Default Is the Right Approach
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When you deploy an autonomous AI agent, you are giving it the ability to generate and
        execute arbitrary network requests. The agent can construct HTTP calls, open TCP connections,
        and interact with any API it has knowledge of. In a world where prompt injection attacks can
        manipulate agent behavior, and where agents routinely process untrusted content from the
        internet, the question is not whether an agent might try to reach an unintended destination
        -- it is when.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Consider the alternative: an allow-by-default policy where everything is permitted unless
        specifically blocked. This approach requires the operator to anticipate every possible
        malicious or unintended destination and block it proactively. This is a losing game.
        New domains are registered constantly. Attackers can spin up infrastructure on any cloud
        provider in seconds. An agent compromised through prompt injection could exfiltrate data
        to any of billions of possible endpoints. A blocklist can never be comprehensive enough.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Deny-by-default inverts the burden. Instead of trying to enumerate everything dangerous,
        the operator enumerates only what is necessary. If the agent needs to access the GitHub API,
        the policy grants access to api.github.com. If it needs npm packages, the policy grants
        access to registry.npmjs.org. Everything else is simply unreachable. The attack surface is
        reduced from the entire internet to a small, auditable list of endpoints.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Comparison to Traditional Firewalls
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Network administrators have long used firewalls to control traffic flow. However, the
        security model for AI agents differs from traditional firewall use cases in several
        important ways. Understanding these differences helps explain why NemoClaw's approach
        is specifically tailored for the agent threat model.
      </p>

      <ComparisonTable
        title="Agent Network Policy vs. Traditional Firewalls"
        headers={['Aspect', 'Traditional Firewall', 'NemoClaw Agent Policy']}
        rows={[
          [
            'Default posture',
            'Often allow-by-default for outbound traffic',
            'Strict deny-by-default for all outbound'
          ],
          [
            'Granularity',
            'IP ranges, port ranges, protocols',
            'Exact domain names, specific ports, TLS required'
          ],
          [
            'Threat model',
            'External attackers trying to get in',
            'Internal process (agent) that may try to reach out'
          ],
          [
            'Rule management',
            'Network team manages centralized rules',
            'Operator defines per-sandbox YAML policy'
          ],
          [
            'Dynamic approval',
            'Requires firewall rule change and propagation',
            'Real-time operator approval via TUI'
          ],
          [
            'Scope',
            'Applies to entire network segments or hosts',
            'Applies to a single sandbox container'
          ],
        ]}
        highlightDiffs
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Traditional enterprise firewalls typically allow all outbound connections. The assumption
        is that internal processes are trusted and need unrestricted internet access to function.
        Inbound rules are strict, but outbound rules are permissive. This made sense when the
        software running inside the network was deterministic and well-understood. It does not
        make sense for AI agents, whose behavior is probabilistic, whose actions depend on
        unpredictable inputs, and whose decision-making can be influenced by adversarial content.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The Principle of Least Privilege Applied to Networking
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Deny-by-default is an expression of the principle of least privilege: grant only the minimum
        access required for the agent to perform its intended function. If the agent's job is to
        review pull requests on GitHub, it needs access to GitHub's API and perhaps a package
        registry. It does not need access to arbitrary web servers, cryptocurrency exchanges,
        social media platforms, or file-sharing services.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This principle protects against multiple threat vectors simultaneously. A prompt injection
        attack that tries to make the agent exfiltrate code to an attacker-controlled server will
        fail because that server is not whitelisted. An agent that hallucinates a URL and tries to
        fetch content from a nonexistent or malicious site will be blocked. An agent that attempts
        to install a package from an unauthorized registry will find the connection refused.
      </p>

      <NoteBlock type="info" title="Deny-by-Default in Practice">
        <p>
          When an agent inside a NemoClaw sandbox attempts to connect to a non-whitelisted
          endpoint, the connection is blocked at the network level. The agent receives a connection
          error. Simultaneously, the blocked request is logged and displayed in the OpenShell TUI,
          where the operator can review it. If the endpoint is legitimate and needed, the operator
          can approve it for the current session or add it to the baseline policy. This creates a
          natural feedback loop: the agent's actual needs drive policy refinement, but security is
          never compromised in the process.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What This Means for Agent Developers
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If you are building or deploying agents on NemoClaw, the deny-by-default policy means you
        need to think carefully about your agent's network dependencies before deployment. Which
        APIs does it call? Which package registries does it need? Which external services does it
        integrate with? These questions must be answered and encoded into the policy YAML before
        the agent can function.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This upfront cost is intentional. It forces operators to have a clear understanding of
        their agent's external dependencies, which is valuable not just for security but for
        operational awareness and debugging. An agent whose network dependencies are explicitly
        documented in a policy file is an agent whose behavior is more predictable, more auditable,
        and more trustworthy.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will examine the YAML structure that defines these network policies,
        showing exactly how endpoints are whitelisted and how groups organize access rules into
        logical categories.
      </p>
    </div>
  )
}
