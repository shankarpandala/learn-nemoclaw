import { CodeBlock, NoteBlock, PolicyViewer, DefinitionBlock } from '../../../components/content'

const examplePolicy = `# NemoClaw Network Policy
# Location: nemoclaw-blueprint/policies/openclaw-sandbox.yaml

version: "1.0"
kind: network-policy
metadata:
  name: openclaw-sandbox
  description: Default network policy for OpenClaw sandbox environments

groups:
  claude_code:
    endpoints:
      - domain: "api.anthropic.com"
        port: 443
        tls: required
      - domain: "statsig.anthropic.com"
        port: 443
        tls: required
      - domain: "sentry.io"
        port: 443
        tls: required

  nvidia:
    endpoints:
      - domain: "api.nvcf.nvidia.com"
        port: 443
        tls: required

  github:
    endpoints:
      - domain: "github.com"
        port: 443
        tls: required
      - domain: "objects.githubusercontent.com"
        port: 443
        tls: required

  github_rest_api:
    endpoints:
      - domain: "api.github.com"
        port: 443
        tls: required
      - domain: "uploads.github.com"
        port: 443
        tls: required

  clawhub:
    endpoints:
      - domain: "clawhub.dev"
        port: 443
        tls: required
      - domain: "api.clawhub.dev"
        port: 443
        tls: required

  openclaw_api:
    endpoints:
      - domain: "api.openclaw.ai"
        port: 443
        tls: required

  openclaw_docs:
    endpoints:
      - domain: "docs.openclaw.ai"
        port: 443
        tls: required

  npm_registry:
    endpoints:
      - domain: "registry.npmjs.org"
        port: 443
        tls: required

  telegram:
    endpoints:
      - domain: "api.telegram.org"
        port: 443
        tls: required`

const policyAnnotations = [
  { line: 4, text: 'The version field identifies the policy schema version. Currently "1.0" is the only supported version.' },
  { line: 5, text: 'The kind field must be "network-policy" to distinguish from other policy types (filesystem, resource).' },
  { line: 7, text: 'Metadata provides a human-readable name and description. The name is used when referencing this policy in commands.' },
  { line: 11, text: 'Groups organize endpoints by logical function. Each group can be independently enabled or disabled.' },
  { line: 12, text: 'The claude_code group contains Anthropic infrastructure endpoints needed for Claude Code to function.' },
  { line: 14, text: 'Each endpoint specifies an exact domain name. Wildcards are not supported -- this is intentional for security.' },
  { line: 15, text: 'Port 443 is the only supported port, enforcing TLS for all connections.' },
  { line: 16, text: 'The tls: required field mandates TLS encryption. This is the only accepted value.' },
  { line: 30, text: 'The github group handles Git operations (clone, push, pull) via HTTPS.' },
  { line: 37, text: 'The github_rest_api group is separate from github because API access has different security implications than Git operations.' },
  { line: 44, text: 'ClawHub is the package registry for OpenClaw extensions and blueprints.' },
  { line: 57, text: 'The npm_registry group enables Node.js package installation. Only the official registry is whitelisted.' },
]

export default function YamlStructure() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Policy YAML Structure
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw network policies are defined in YAML files stored in the nemoclaw-blueprint
        directory. The primary policy file lives at{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          nemoclaw-blueprint/policies/openclaw-sandbox.yaml
        </code>
        . This file is the single source of truth for what network endpoints a sandboxed agent
        can access. Understanding its structure is essential for configuring and customizing
        NemoClaw deployments.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Top-Level Fields
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Every network policy YAML file begins with three top-level fields that identify and
        describe the policy, followed by the groups section that contains the actual access rules.
      </p>

      <DefinitionBlock
        term="version"
        definition="Specifies the schema version of the policy file. Currently the only supported value is '1.0'. This field enables forward compatibility -- future versions of NemoClaw may introduce new policy features under a new schema version while continuing to support older formats."
      />

      <DefinitionBlock
        term="kind"
        definition="Identifies the type of policy defined in the file. For network policies, this must be 'network-policy'. NemoClaw uses this field to route the policy to the correct enforcement engine."
      />

      <DefinitionBlock
        term="metadata"
        definition="Contains the policy name and description. The name field is used to reference this policy in CLI commands (e.g., 'openshell policy set openclaw-sandbox'). The description provides human-readable context for documentation and audit purposes."
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The Groups Section
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The heart of the network policy is the{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          groups
        </code>{' '}
        section. Groups are logical collections of related endpoints. Each group has a descriptive
        name (like{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          github
        </code>{' '}
        or{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          npm_registry
        </code>
        ) and contains a list of endpoints that the agent is permitted to reach.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Organizing endpoints into groups serves several purposes. First, it makes policies
        human-readable -- you can quickly see that your agent has access to GitHub, npm, and
        Anthropic's API by scanning group names rather than parsing a flat list of domains.
        Second, groups map naturally to policy presets, which allow you to add or remove entire
        sets of endpoints with a single command. Third, groups provide a natural unit for access
        reviews and audits.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Endpoint Fields
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Each endpoint within a group is defined by three fields:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">domain:</span> The exact fully-qualified domain name
          that the agent is allowed to connect to. Wildcards are not supported. If the agent
          needs to access both{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            api.github.com
          </code>{' '}
          and{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            github.com
          </code>
          , both must be listed separately.
        </li>
        <li>
          <span className="font-semibold">port:</span> The port number for the connection.
          Currently, only port 443 (HTTPS) is supported. This ensures all agent communication
          is encrypted.
        </li>
        <li>
          <span className="font-semibold">tls:</span> The TLS requirement for the connection.
          The only accepted value is{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            required
          </code>
          . This field exists to make the security requirement explicit in the policy definition
          rather than implicit.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Full Policy Example with Annotations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Below is the complete default policy file. Click on highlighted lines to see annotations
        explaining each section.
      </p>

      <PolicyViewer
        title="nemoclaw-blueprint/policies/openclaw-sandbox.yaml"
        policy={examplePolicy}
        annotations={policyAnnotations}
      />

      <NoteBlock type="tip" title="No Wildcards by Design">
        <p>
          You might notice that NemoClaw does not support wildcard domains (like *.github.com).
          This is intentional. Wildcard rules are a common source of security vulnerabilities in
          network policies. An attacker could register a subdomain under a whitelisted parent
          domain and use it for data exfiltration. By requiring exact domain matches, NemoClaw
          ensures that every permitted endpoint has been explicitly reviewed and approved by the
          operator.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        File Location and Loading
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The policy file is read during sandbox initialization. When you run{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          nemoclaw onboard
        </code>
        , NemoClaw reads the YAML file, validates its structure, and configures the sandbox's
        network namespace accordingly. Changes to the YAML file do not take effect until the
        next onboard or until a dynamic policy update is applied via{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          openshell policy set
        </code>
        .
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The file must be valid YAML and conform to the network-policy schema. If the file contains
        syntax errors or unknown fields, NemoClaw will reject it during onboard and display a
        descriptive error message indicating the line and field that caused the failure. This
        fail-closed behavior ensures that a misconfigured policy never results in a permissive
        sandbox.
      </p>

      <CodeBlock
        language="bash"
        title="Validating a policy file"
        code={`# NemoClaw validates the policy during onboard
nemoclaw onboard

# If there are errors, you'll see output like:
# Error: policies/openclaw-sandbox.yaml:14 - unknown field "wildcard"
# Error: policies/openclaw-sandbox.yaml:22 - port must be 443`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will examine each of the nine default policy groups in detail,
        explaining what endpoints they expose and why each is included in the default policy.
      </p>
    </div>
  )
}
