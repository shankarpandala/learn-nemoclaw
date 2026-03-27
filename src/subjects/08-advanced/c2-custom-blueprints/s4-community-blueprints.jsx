import { CodeBlock, NoteBlock, WarningBlock, ComparisonTable, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function CommunityBlueprints() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Community Blueprints
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        One of NemoClaw's strengths is its growing ecosystem of community-contributed blueprints.
        Instead of building every agent configuration from scratch, you can start with a
        community blueprint that addresses a similar use case and customize it for your needs.
        The community has produced blueprints for coding assistants, security auditors,
        documentation generators, infrastructure managers, data pipeline operators, and many
        other agent patterns. However, because blueprints define security boundaries, using a
        community blueprint requires understanding how to evaluate its safety and trustworthiness.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Where to Find Community Blueprints
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Community blueprints are available through several channels, each with different
        discovery mechanisms and trust levels.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">NemoClaw Blueprint Registry:</span> The official
          registry at blueprints.nemoclaw.dev is the primary source for community blueprints.
          All blueprints are signed, undergo automated security checks, and are searchable by
          category, use case, and popularity. This is the most trusted source.
        </li>
        <li>
          <span className="font-semibold">GitHub:</span> Many blueprint authors host their
          blueprints in public GitHub repositories. Search for repositories with the
          "nemoclaw-blueprint" topic tag, or browse the curated awesome-nemoclaw list maintained
          by the community.
        </li>
        <li>
          <span className="font-semibold">NemoClaw Discord:</span> The #blueprints channel
          on the NemoClaw Discord is where community members share work-in-progress blueprints,
          request feedback, and announce new releases.
        </li>
        <li>
          <span className="font-semibold">Organization Registries:</span> Some organizations
          maintain internal blueprint registries with configurations tailored to their specific
          infrastructure and compliance requirements. Check with your team if one exists.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Discovering and installing community blueprints"
      >{`# Search the NemoClaw registry
nemoclaw blueprint search "code review"
# Returns matching blueprints with name, version, author, description, rating

# Show detailed information about a blueprint
nemoclaw blueprint info community/code-reviewer
# Shows: description, permissions summary, version history,
# download count, community rating, security audit status

# Install a community blueprint
nemoclaw blueprint install community/code-reviewer
# Downloads to ~/.nemoclaw/blueprints/code-reviewer/
# Verifies signature and integrity automatically

# Install a specific version
nemoclaw blueprint install community/code-reviewer@2.1.0

# Install from a Git repository
nemoclaw blueprint install https://github.com/author/my-blueprint.git

# List installed blueprints
nemoclaw blueprint list --installed`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Evaluating Blueprint Safety
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A blueprint is a security configuration. Installing and running a community blueprint
        means you are trusting that its author has defined appropriate security boundaries. Before
        running any community blueprint, you should inspect it carefully. NemoClaw provides tools
        to help with this evaluation, but ultimately the responsibility lies with you as the
        operator.
      </p>

      <WarningBlock title="Always Inspect Before Running">
        <p>
          Never run a community blueprint without first reviewing its policies. A malicious or
          negligent blueprint could grant the agent unrestricted network access (enabling data
          exfiltration), writable access to sensitive directories (enabling system compromise),
          or excessive resource limits (enabling resource exhaustion attacks). The nemoclaw
          blueprint audit command provides an automated first-pass review, but you should also
          manually read the policy files.
        </p>
      </WarningBlock>

      <CodeBlock
        language="bash"
        title="Auditing a community blueprint"
      >{`# Run the automated security audit
nemoclaw blueprint audit community/code-reviewer

# Example output:
# === Security Audit: community/code-reviewer v2.1.0 ===
#
# Network Policy:
#   Allowed endpoints: 2
#     - api.github.com:443 (TLS required) ✓
#     - integrate.api.nvidia.com:443 (TLS required) ✓
#   Wildcard rules: 0 ✓
#   Allow-all: No ✓
#   Risk: LOW
#
# Filesystem Policy:
#   Writable paths: 2
#     - /workspace (recursive) ⚠ broad write access
#     - /tmp (recursive) ✓
#   Sensitive paths accessible: 0 ✓
#   Risk: MEDIUM (broad workspace write)
#
# Resource Limits:
#   Memory: 4096 MB ✓
#   CPU: 4 cores ✓
#   Runtime: 60 minutes ⚠ long runtime
#   Risk: LOW
#
# Tools:
#   shell: enabled ⚠ shell access enabled
#   file_read: enabled ✓
#   file_write: enabled ✓
#   web_fetch: enabled ✓
#
# Overall Risk Assessment: MEDIUM
# Recommendations:
#   - Consider restricting /workspace write access to a specific subdirectory
#   - Consider reducing maximum runtime if your use case allows

# View the raw policy files
nemoclaw blueprint inspect community/code-reviewer --show-policies`}</CodeBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When evaluating a blueprint, pay attention to these key risk indicators:
      </p>

      <ComparisonTable
        title="Blueprint Risk Indicators"
        headers={['Indicator', 'Low Risk', 'Medium Risk', 'High Risk']}
        rows={[
          ['Network endpoints', '1-3 specific hosts', '4-10 specific hosts', 'Wildcard domains or allow-all'],
          ['Filesystem write scope', 'Single directory', '/workspace recursive', '/ or /home recursive'],
          ['Shell access', 'Disabled', 'Enabled with restrictions', 'Enabled without restrictions'],
          ['Resource limits', 'Conservative (1-2 GB, 15 min)', 'Moderate (4 GB, 60 min)', 'Uncapped or very high'],
          ['Init scripts', 'None or simple mkdir', 'Package installation', 'Downloads from internet'],
          ['Signature', 'Signed by trusted key', 'Signed by unknown key', 'Unsigned'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Customizing Community Blueprints
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Community blueprints are starting points, not rigid configurations. The recommended
        workflow is to install a community blueprint, audit it, and then create a local fork
        with your customizations. This way you control the security boundaries while benefiting
        from the community's work on system prompts, tool configurations, and initialization
        scripts.
      </p>

      <CodeBlock
        language="bash"
        title="Forking and customizing a community blueprint"
      >{`# Fork a community blueprint into your local blueprints directory
nemoclaw blueprint fork community/code-reviewer my-code-reviewer

# Edit the fork to tighten security for your environment
# For example, restrict network access to your GitHub Enterprise instance
cd ~/.nemoclaw/blueprints/my-code-reviewer/

# Edit policies/network.yaml to replace api.github.com with your GHE host
# Edit policies/filesystem.yaml to restrict write paths
# Edit system-prompt.md to add organization-specific guidelines

# Validate your modifications
nemoclaw blueprint validate .

# Test the modified blueprint
nemoclaw run --blueprint my-code-reviewer --dry-run`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Contributing Your Own Blueprints
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Contributing blueprints back to the community strengthens the ecosystem. If you have
        built a blueprint for a use case that others would find valuable, publishing it helps
        others avoid reinventing the wheel and raises the overall quality of agent security
        configurations.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Follow the principle of least privilege:</span> Your
          blueprint should request only the minimum permissions necessary. Reviewers will
          scrutinize overly permissive configurations.
        </li>
        <li>
          <span className="font-semibold">Write clear documentation:</span> Include a README.md
          explaining the use case, required environment variables, mount points, and any
          assumptions about the host environment.
        </li>
        <li>
          <span className="font-semibold">Include tests:</span> Blueprint test cases demonstrate
          that the security boundaries work as intended and give consumers confidence.
        </li>
        <li>
          <span className="font-semibold">Use environment variables for secrets:</span> Never
          hardcode API keys or credentials. Use _env suffixed fields in your configuration.
        </li>
        <li>
          <span className="font-semibold">Test on multiple hardware configurations:</span> If
          your blueprint uses local inference, test it on different GPU configurations and
          document the requirements.
        </li>
      </ul>

      <NoteBlock type="info" title="Blueprint Quality Guidelines">
        <p>
          The NemoClaw community has established quality guidelines for published blueprints.
          High-quality blueprints include: a comprehensive README, at least five security test
          cases, a changelog for each version, explicit documentation of all required
          environment variables and mount points, and comments in the policy YAML files
          explaining why each rule exists. Blueprints that meet these criteria receive a
          "verified" badge on the registry.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Evaluate and Customize a Community Blueprint"
        difficulty="intermediate"
      >
        <ol className="list-decimal list-inside space-y-2 mt-2">
          <li>Browse the NemoClaw blueprint registry and find a blueprint related to your work.</li>
          <li>Run nemoclaw blueprint audit on it and note any medium or high risk indicators.</li>
          <li>Fork the blueprint and tighten at least one policy (network, filesystem, or resources).</li>
          <li>Add a security test case that verifies your tightened policy is enforced.</li>
          <li>Run the modified blueprint and confirm it still accomplishes its intended task.</li>
        </ol>
      </ExerciseBlock>

      <ReferenceList
        references={[
          {
            title: "NemoClaw Blueprint Registry",
            url: "https://blueprints.nemoclaw.dev",
            description: "Official registry for community blueprints with search, ratings, and security audit reports."
          },
          {
            title: "awesome-nemoclaw",
            url: "https://github.com/nemoclaw/awesome-nemoclaw",
            description: "Community-curated list of NemoClaw resources, blueprints, and tools."
          },
          {
            title: "Blueprint Contribution Guide",
            url: "https://docs.nemoclaw.dev/blueprints/contributing",
            description: "Official guide for contributing blueprints to the NemoClaw registry."
          },
        ]}
      />
    </div>
  )
}
