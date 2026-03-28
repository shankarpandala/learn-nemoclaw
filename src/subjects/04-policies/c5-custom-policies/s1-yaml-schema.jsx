import { NoteBlock, PolicyViewer, DefinitionBlock, CodeBlock } from '../../../components/content'

const fullSchemaExample = `# Complete NemoClaw Network Policy Schema Reference
# All supported fields and their valid values

version: "1.0"                    # Required. Only "1.0" supported.
kind: network-policy              # Required. Must be "network-policy".

metadata:                         # Required object.
  name: my-custom-policy          # Required. Alphanumeric, hyphens, underscores.
  description: >                  # Optional. Human-readable description.
    Custom network policy for
    my agent deployment.

groups:                           # Required. At least one group.
  my_service:                     # Group name. Alphanumeric and underscores.
    endpoints:                    # Required list. At least one endpoint.
      - domain: "api.example.com" # Required. Exact FQDN, no wildcards.
        port: 443                 # Required. Must be 443.
        tls: required             # Required. Must be "required".
      - domain: "cdn.example.com"
        port: 443
        tls: required

  another_service:
    endpoints:
      - domain: "api.another.com"
        port: 443
        tls: required`

const schemaAnnotations = [
  { line: 4, text: 'The version field is required and must be "1.0". This enables future schema evolution while maintaining backward compatibility.' },
  { line: 5, text: 'The kind field distinguishes network policies from other policy types (filesystem-policy, resource-policy).' },
  { line: 7, text: 'The metadata section provides identification and documentation for the policy.' },
  { line: 8, text: 'The name must be unique across all policies in the blueprint. Used in CLI commands to reference this policy.' },
  { line: 9, text: 'Descriptions can use YAML multi-line syntax for longer text. This field is for human consumption only.' },
  { line: 13, text: 'The groups section is the core of the policy. Each key is a group name, each value contains an endpoints list.' },
  { line: 14, text: 'Group names must use only alphanumeric characters and underscores. They are case-sensitive.' },
  { line: 15, text: 'Each group must have at least one endpoint. Empty groups are rejected during validation.' },
  { line: 16, text: 'Domain must be an exact FQDN. No wildcards, no IP addresses, no ports in the domain string.' },
  { line: 17, text: 'Port 443 is the only supported value. This enforces HTTPS-only communication.' },
  { line: 18, text: 'TLS "required" is the only accepted value. This field makes the encryption requirement explicit.' },
]

export default function YamlSchema() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        YAML Schema Reference
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This section provides a comprehensive reference for the NemoClaw network policy YAML
        schema. Understanding the schema in detail is essential for writing correct, valid
        policies and for troubleshooting validation errors when they occur.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Complete Schema with Annotations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Click on highlighted lines in the policy viewer below to see detailed explanations
        of each field.
      </p>

      <PolicyViewer
        title="Full Network Policy Schema"
        policy={fullSchemaExample}
        annotations={schemaAnnotations}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Field Reference
      </h2>

      <DefinitionBlock
        term="version (required)"
        definition="Schema version string. Currently the only valid value is '1.0'. Future NemoClaw releases may introduce new schema versions with additional fields or capabilities. Policies written against version 1.0 will continue to work with newer NemoClaw versions."
      />

      <DefinitionBlock
        term="kind (required)"
        definition="Policy type identifier. Must be 'network-policy' for network access control policies. Other valid kinds include 'filesystem-policy' for filesystem access rules. Using the wrong kind will cause the policy to be routed to the wrong enforcement engine."
      />

      <DefinitionBlock
        term="metadata.name (required)"
        definition="A unique identifier for the policy. Must contain only alphanumeric characters, hyphens, and underscores. Maximum length is 64 characters. This name is used in CLI commands (e.g., 'openshell policy set my-policy') and in audit logs to identify which policy was active."
      />

      <DefinitionBlock
        term="metadata.description (optional)"
        definition="A human-readable description of the policy's purpose. Can be a single line or multi-line using YAML folded (>) or literal (|) block syntax. Used for documentation only -- not processed by the enforcement engine."
      />

      <DefinitionBlock
        term="groups (required)"
        definition="A mapping of group names to endpoint lists. At least one group must be defined. Group names must be alphanumeric with underscores (no hyphens, no spaces). Groups organize endpoints into logical categories for readability, management, and preset compatibility."
      />

      <DefinitionBlock
        term="endpoints[].domain (required)"
        definition="The exact fully-qualified domain name (FQDN) to whitelist. Must be a valid DNS hostname. No wildcards (* or ?), no IP addresses, no URL paths, no port numbers in the string. The domain is matched exactly -- 'api.github.com' does not match 'github.com' or 'www.api.github.com'."
      />

      <DefinitionBlock
        term="endpoints[].port (required)"
        definition="The TCP port number for the allowed connection. Must be 443 (HTTPS). No other port values are accepted. This restriction ensures all agent communication is encrypted via TLS."
      />

      <DefinitionBlock
        term="endpoints[].tls (required)"
        definition="TLS enforcement setting. Must be 'required'. No other values (like 'optional' or 'disabled') are accepted. While this field currently has only one valid value, it exists to make the security requirement explicit in the policy document and to support potential future TLS configuration options."
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Validation Rules
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw validates policy files strictly. Understanding the validation rules helps you
        avoid errors during onboard:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">No unknown fields:</span> Any field not part of the
          schema causes a validation error. This catches typos (e.g., "domian" instead of
          "domain") and prevents confusion about unsupported features.
        </li>
        <li>
          <span className="font-semibold">No duplicate domains within a group:</span> The same
          domain cannot appear twice in the same group's endpoint list. Duplicates across
          different groups are allowed (though unusual).
        </li>
        <li>
          <span className="font-semibold">Valid DNS hostnames:</span> Domain values must
          conform to DNS hostname rules. Labels must be 1-63 characters, total length must
          be under 253 characters, and only alphanumeric characters, hyphens, and dots are
          allowed.
        </li>
        <li>
          <span className="font-semibold">No empty groups:</span> Every group must have at
          least one endpoint. Empty groups are rejected.
        </li>
        <li>
          <span className="font-semibold">Valid YAML syntax:</span> The file must be
          well-formed YAML. Common syntax errors include incorrect indentation, missing
          colons, and unquoted strings with special characters.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Common validation errors"
        code={`# Error: Unknown field
# nemoclaw-blueprint/policies/my-policy.yaml:14
#   Unknown field 'wildcard' in endpoint definition

# Error: Invalid port
# nemoclaw-blueprint/policies/my-policy.yaml:17
#   Field 'port' must be 443, got 8080

# Error: Invalid TLS value
# nemoclaw-blueprint/policies/my-policy.yaml:18
#   Field 'tls' must be 'required', got 'optional'

# Error: Duplicate domain in group
# nemoclaw-blueprint/policies/my-policy.yaml:20
#   Duplicate domain 'api.example.com' in group 'my_service'

# Error: Invalid domain format
# nemoclaw-blueprint/policies/my-policy.yaml:16
#   Invalid domain '*.example.com' - wildcards are not supported`}
      />

      <NoteBlock type="tip" title="YAML Linting">
        <p>
          Consider using a YAML linter or schema validator in your CI pipeline to catch policy
          errors before they reach the onboard step. Tools like yamllint and custom JSON Schema
          validators can be configured to check NemoClaw policy files automatically on every
          commit. This prevents broken policies from being merged into your main branch.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Schema Evolution
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The version field exists to support schema evolution. When NemoClaw introduces new
        features (such as additional port support, IP-based rules, or time-based access
        controls), they will be introduced under a new schema version. Policies using the
        "1.0" schema will continue to work without modification. This ensures that upgrading
        NemoClaw never breaks existing policy configurations.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will walk through the practical process of whitelisting a new
        endpoint step by step.
      </p>
    </div>
  )
}
