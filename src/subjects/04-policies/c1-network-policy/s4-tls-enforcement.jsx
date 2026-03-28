import { NoteBlock, WarningBlock, ComparisonTable, CodeBlock } from '../../../components/content'

export default function TlsEnforcement() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        TLS Enforcement
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Every network connection from a NemoClaw sandbox must use TLS (Transport Layer Security)
        on port 443. There is no option to allow plaintext HTTP connections on port 80. There is
        no fallback mechanism. There is no "development mode" that relaxes this requirement. This
        is a deliberate, non-negotiable security constraint that protects agent communications
        from interception, tampering, and man-in-the-middle attacks.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why TLS-Only
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        AI agents routinely transmit sensitive data over the network. API keys are included in
        request headers. Source code is sent to language model APIs for analysis. Repository
        credentials authenticate Git operations. Customer data may flow through agent workflows.
        If any of these communications were sent over plaintext HTTP, anyone with network access
        between the sandbox and the destination could intercept and read the data.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The threat is not hypothetical. In shared hosting environments, cloud VPCs, and even
        corporate networks, traffic can be observed by other processes, network appliances, or
        compromised routers. TLS encryption ensures that even if network traffic is captured,
        the content remains unreadable without the encryption keys.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond confidentiality, TLS provides two other critical security properties:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Integrity:</span> TLS guarantees that data has not been
          modified in transit. A man-in-the-middle attacker cannot alter API responses, inject
          malicious code into npm package downloads, or modify Git objects without the
          tampering being detected.
        </li>
        <li>
          <span className="font-semibold">Authentication:</span> TLS certificate validation
          confirms that the sandbox is actually communicating with the intended server, not an
          impersonator. When the agent connects to api.github.com, certificate validation
          ensures it is genuinely GitHub's server, not an attacker's proxy.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        No HTTP Fallback
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Many networking libraries and tools implement automatic protocol fallback: if an HTTPS
        connection fails, they retry with HTTP. This "helpful" behavior is a security
        vulnerability in the agent context. An attacker who can block TLS connections (a
        trivial network attack) could force the agent to fall back to plaintext, exposing all
        subsequent communications.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw eliminates this risk entirely. Port 80 is not open. No HTTP connections can
        leave the sandbox. If a TLS connection fails, it simply fails -- the agent receives an
        error and must handle it accordingly. There is no degraded-security fallback path.
      </p>

      <WarningBlock title="Port 80 Is Not Available">
        <p>
          If your agent or its dependencies attempt to make HTTP connections on port 80, those
          connections will be blocked. This includes tools that default to HTTP, scripts that
          use hardcoded HTTP URLs, and libraries that attempt protocol downgrade. Ensure all
          URLs in your agent's configuration use the{' '}
          <code className="px-1 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-sm font-mono">
            https://
          </code>{' '}
          scheme. If a third-party service only supports HTTP without TLS, it cannot be accessed
          from a NemoClaw sandbox.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Certificate Validation
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw enforces standard TLS certificate validation for all outbound connections.
        This means:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Certificate chain verification:</span> The server's
          certificate must chain back to a trusted Certificate Authority (CA) in the sandbox's
          CA bundle. Self-signed certificates are rejected.
        </li>
        <li>
          <span className="font-semibold">Hostname matching:</span> The domain in the certificate
          must match the domain the agent is connecting to. A certificate for{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            example.com
          </code>{' '}
          cannot be used to authenticate a connection to{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            api.github.com
          </code>.
        </li>
        <li>
          <span className="font-semibold">Expiration checking:</span> Expired certificates are
          rejected. This prevents connections to servers whose operators have let their
          certificates lapse, which may indicate abandoned or compromised infrastructure.
        </li>
        <li>
          <span className="font-semibold">Revocation awareness:</span> While full CRL/OCSP
          checking depends on the TLS library in use, NemoClaw's sandbox environment is
          configured to honor certificate revocation information when available.
        </li>
      </ul>

      <NoteBlock type="info" title="The CA Bundle">
        <p>
          The sandbox includes a standard CA bundle (typically the Mozilla CA bundle) that
          contains root certificates for all major Certificate Authorities. This means
          connections to any properly configured HTTPS service with a certificate from a
          recognized CA will work without additional configuration. If you need to connect to
          an internal service that uses a private CA, you will need to add that CA's root
          certificate to the sandbox's trust store.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        TLS in the Policy YAML
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the policy YAML file, every endpoint includes{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          tls: required
        </code>{' '}
        and{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          port: 443
        </code>
        . You might wonder why these fields exist if they can only have one value. The answer
        is explicitness and forward compatibility.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Making TLS requirements explicit in the policy file means that anyone reading the policy
        can immediately see that encryption is enforced. There is no ambiguity, no need to check
        documentation to understand the default behavior. The policy file is fully self-describing.
      </p>

      <CodeBlock
        language="yaml"
        title="TLS enforcement in endpoint definitions"
        code={`# Every endpoint follows this pattern:
endpoints:
  - domain: "api.github.com"
    port: 443        # Only port 443 is supported
    tls: required    # Only 'required' is accepted

# These would be rejected during validation:
# - domain: "example.com"
#   port: 80           # Error: port must be 443
#   tls: optional      # Error: tls must be 'required'`}
      />

      <ComparisonTable
        title="TLS Enforcement vs. Common Alternatives"
        headers={['Approach', 'Security Level', 'Agent Suitability']}
        rows={[
          [
            'NemoClaw: TLS-only, port 443',
            'Highest -- all traffic encrypted, authenticated',
            'Ideal for agents handling sensitive data and credentials'
          ],
          [
            'HTTPS preferred, HTTP fallback',
            'Medium -- can be downgraded by network attacks',
            'Dangerous for agents that transmit API keys'
          ],
          [
            'HTTP allowed on port 80',
            'Lowest -- all traffic visible to network observers',
            'Unacceptable for any agent with network access'
          ],
        ]}
        highlightDiffs
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Troubleshooting TLS Issues
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Occasionally, you may encounter TLS-related connection failures. Common causes include:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          The target server has an expired or misconfigured certificate. Check the server's
          certificate status using external tools.
        </li>
        <li>
          The target server uses a private CA not in the standard CA bundle. You will need to
          add the CA certificate to the sandbox's trust store.
        </li>
        <li>
          A network proxy or firewall is intercepting TLS connections and presenting its own
          certificate. This is common in corporate environments and requires adding the
          proxy's CA to the trust store.
        </li>
        <li>
          DNS resolution issues cause the connection to reach the wrong server, leading to
          a hostname mismatch. Verify DNS resolution from within the sandbox.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        TLS enforcement is one of several layers in NemoClaw's defense-in-depth approach. Combined
        with deny-by-default network policy and exact domain matching, it ensures that agent
        communications are not only restricted to approved destinations but are also encrypted
        and authenticated end to end.
      </p>
    </div>
  )
}
