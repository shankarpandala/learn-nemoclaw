import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock } from '../../../components/content'

export default function VersioningDistribution() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Versioning and Distributing Blueprints
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Once you have created a blueprint that works well for your use case, you will likely
        want to share it -- with your team, your organization, or the broader NemoClaw
        community. Distribution introduces challenges that do not exist when blueprints live
        only on your local machine: how do consumers know when a blueprint has changed? How do
        they know the blueprint they downloaded has not been tampered with? How do you manage
        breaking changes without disrupting existing users? This section covers NemoClaw's
        approach to blueprint versioning, distribution, integrity verification, and publishing.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Semantic Versioning for Blueprints
      </h2>

      <DefinitionBlock
        term="Blueprint Semantic Versioning"
        definition="NemoClaw blueprints follow semantic versioning (semver): MAJOR.MINOR.PATCH. A MAJOR bump indicates breaking changes (removed permissions, changed tool interfaces, incompatible policy changes). A MINOR bump adds functionality in a backward-compatible way (new optional tools, additional allowed endpoints). A PATCH bump fixes bugs without changing behavior (corrected system prompt typos, documentation updates)."
        example="Updating a blueprint from 1.2.0 to 1.3.0 because a new MCP server was added. Updating from 1.3.0 to 2.0.0 because the filesystem policy was restructured and the workspace mount point changed from /workspace to /project."
        seeAlso={['Semantic Versioning', 'Backward Compatibility', 'Breaking Changes']}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The version field in blueprint.yaml is not merely informational -- NemoClaw uses it
        to manage blueprint updates, check compatibility, and resolve dependencies. When a
        blueprint specifies a dependency on another blueprint, it can use semver ranges (e.g.,
        "^1.2.0" means any version compatible with 1.2.0) just like package managers in the
        software development world.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Determining what constitutes a breaking change in a blueprint context requires careful
        consideration. Because blueprints define security boundaries, changes to policies are
        particularly sensitive:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Removing a network endpoint:</span> Breaking change.
          An agent workflow that depends on accessing that endpoint will fail.
        </li>
        <li>
          <span className="font-semibold">Adding a network endpoint:</span> Minor change. Existing
          workflows continue to work; the agent simply has access to an additional endpoint.
        </li>
        <li>
          <span className="font-semibold">Tightening filesystem permissions:</span> Breaking change.
          Agent operations that previously succeeded may now be blocked.
        </li>
        <li>
          <span className="font-semibold">Loosening filesystem permissions:</span> Minor change,
          but with security implications. Existing functionality is unaffected, but the attack
          surface increases. This should be documented clearly.
        </li>
        <li>
          <span className="font-semibold">Changing the system prompt:</span> Typically a minor
          or patch change, unless it fundamentally alters the agent's behavior or output format.
        </li>
        <li>
          <span className="font-semibold">Changing resource limits:</span> Reducing limits is
          breaking (agent may OOM or timeout); increasing limits is minor.
        </li>
      </ul>

      <CodeBlock
        language="yaml"
        title="Version bumping in blueprint.yaml"
      >{`# Before (v1.2.0): allows api.github.com
name: "code-reviewer"
version: "1.2.0"
# ...

# After (v1.3.0): adds api.gitlab.com -- backward-compatible addition
name: "code-reviewer"
version: "1.3.0"
# ...

# After (v2.0.0): removes api.github.com, only allows api.gitlab.com -- breaking
name: "code-reviewer"
version: "2.0.0"
# ...`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Distribution Channels
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw supports several channels for distributing blueprints, each suited to different
        use cases and trust levels.
      </p>

      <ComparisonTable
        title="Blueprint Distribution Channels"
        headers={['Channel', 'Trust Level', 'Best For', 'Setup Effort']}
        rows={[
          ['NemoClaw Registry', 'High (signed, reviewed)', 'Public sharing with the community', 'Requires account, review process'],
          ['Git Repository', 'Varies (depends on repo trust)', 'Team sharing, version control integration', 'Low -- any git host works'],
          ['OCI Registry', 'Medium (signed containers)', 'Enterprise distribution, air-gapped environments', 'Moderate -- requires OCI registry'],
          ['Direct File Transfer', 'Low (no verification)', 'Quick sharing between individuals', 'None'],
          ['Organization Registry', 'High (internal PKI)', 'Enterprise-wide standardization', 'High -- requires internal registry setup'],
        ]}
      />

      <CodeBlock
        language="bash"
        title="Distributing blueprints via different channels"
      >{`# Publish to the NemoClaw community registry
nemoclaw blueprint publish ./my-blueprint/
# Requires authentication and passes automated review checks

# Share via Git repository
cd my-blueprint
git init
git add .
git commit -m "Initial blueprint release v1.0.0"
git remote add origin git@github.com:your-org/my-agent-blueprint.git
git push -u origin main

# Install a blueprint from a Git repository
nemoclaw blueprint install git@github.com:your-org/my-agent-blueprint.git

# Package as an OCI artifact
nemoclaw blueprint package ./my-blueprint/ --output my-blueprint-1.0.0.tar.gz
# Push to an OCI registry
nemoclaw blueprint push my-blueprint-1.0.0.tar.gz oci://registry.example.com/blueprints/my-blueprint:1.0.0

# Install from an OCI registry
nemoclaw blueprint install oci://registry.example.com/blueprints/my-blueprint:1.0.0`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Digest Signing and Integrity Verification
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Because blueprints define security boundaries, trusting a blueprint means trusting
        that it has not been tampered with. NemoClaw uses cryptographic signing to establish
        this trust. When a blueprint is published, its contents are hashed and the hash is
        signed with the author's private key. When a consumer installs the blueprint, NemoClaw
        verifies the signature against the author's public key.
      </p>

      <CodeBlock
        language="bash"
        title="Signing and verifying blueprints"
      >{`# Generate a signing key pair (first time only)
nemoclaw blueprint keygen
# Creates ~/.nemoclaw/keys/blueprint-signing.key (private)
# and ~/.nemoclaw/keys/blueprint-signing.pub (public)

# Sign a blueprint
nemoclaw blueprint sign ./my-blueprint/
# Generates .blueprint-signature file containing:
# - SHA-256 digest of all blueprint files
# - Ed25519 signature of the digest
# - Author's public key fingerprint

# Verify a blueprint's signature
nemoclaw blueprint verify ./my-blueprint/
# Checks the signature against known public keys
# Output: "Signature valid. Signed by: your-name (fingerprint: abc123...)"

# Import a trusted author's public key
nemoclaw blueprint trust-key ./their-public-key.pub

# List trusted keys
nemoclaw blueprint list-keys`}</CodeBlock>

      <NoteBlock type="info" title="Signature Verification on Install">
        <p>
          When installing blueprints from the NemoClaw registry, signature verification is
          automatic -- the registry enforces that all published blueprints are signed, and the
          registry's own key is pre-trusted. For blueprints from other sources (Git, OCI,
          direct transfer), NemoClaw will warn if the blueprint is unsigned or if the signing
          key is not trusted. You can configure NemoClaw to reject unsigned blueprints entirely
          with the setting require_signed_blueprints: true in your NemoClaw configuration.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Publishing to the NemoClaw Registry
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NemoClaw blueprint registry is the official distribution channel for community
        blueprints. Publishing involves several steps designed to ensure quality and security.
      </p>

      <CodeBlock
        language="bash"
        title="Publishing workflow"
      >{`# 1. Authenticate with the registry
nemoclaw auth login

# 2. Validate and sign your blueprint
nemoclaw blueprint validate ./my-blueprint/
nemoclaw blueprint sign ./my-blueprint/

# 3. Run the automated review checks
nemoclaw blueprint check ./my-blueprint/
# Checks include:
# - Schema validation
# - No hardcoded secrets
# - Policies are not overly permissive (e.g., allow-all network)
# - System prompt does not contain known prompt injection patterns
# - All referenced files exist
# - Version follows semver
# - README.md exists and is non-empty

# 4. Publish
nemoclaw blueprint publish ./my-blueprint/
# The blueprint enters a review queue. Automated checks run first,
# then community reviewers may inspect it before it becomes publicly listed.

# 5. Check publication status
nemoclaw blueprint status my-blueprint`}</CodeBlock>

      <WarningBlock title="Security Review for Published Blueprints">
        <p>
          Blueprints published to the NemoClaw registry undergo automated security analysis.
          Blueprints that request overly broad permissions -- such as allow-all network policies,
          writable access to sensitive system paths, or uncapped resource limits -- will be
          flagged for manual review and may be rejected or require justification. This is
          intentional: the registry aims to be a trusted source of secure configurations, not
          a repository of convenience shortcuts that undermine sandbox security.
        </p>
      </WarningBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Versioning and distribution transform a blueprint from a local configuration file into a
        shareable, trustworthy artifact. In the next section, we explore the community ecosystem
        around blueprints -- where to find community-contributed blueprints, how to evaluate
        their safety, and how to contribute your own.
      </p>
    </div>
  )
}
