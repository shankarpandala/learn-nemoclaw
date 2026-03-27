import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ReferenceList } from '../../../components/content';

export default function BlueprintVersioning() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Blueprint Versioning
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw blueprints follow semantic versioning (semver) and have an independent
        release cadence from the TypeScript plugin. This means the complex orchestration
        logic can be updated -- with new features, security patches, and provider
        support -- without requiring users to update their OpenClaw extension, restart
        their editor, or wait for marketplace approval.
      </p>

      <DefinitionBlock
        term="Semantic Versioning (semver)"
        definition="A versioning scheme in the format MAJOR.MINOR.PATCH where: MAJOR indicates breaking changes to policy format or behavior, MINOR adds new features in a backwards-compatible way, and PATCH contains backwards-compatible bug fixes and security patches."
        example="Blueprint 0.8.2 -> 0.8.3 (patch: security fix), 0.8.2 -> 0.9.0 (minor: new provider support), 0.8.2 -> 1.0.0 (major: policy format v2)."
        seeAlso={['Immutable Release', 'Version Pinning', 'Digest Verification']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Independent Release Cadence
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The plugin and blueprint are released independently. In practice, the plugin
        changes rarely (a few times per year when OpenClaw's extension API changes),
        while the blueprint may release weekly or even more frequently.
      </p>

      <ComparisonTable
        title="Release Cadence Comparison"
        headers={['Component', 'Typical Release Frequency', 'Triggers for Release']}
        rows={[
          ['TypeScript Plugin', 'Quarterly', 'OpenClaw API changes, major UX improvements'],
          ['Python Blueprint', 'Weekly to biweekly', 'New provider support, security patches, policy features, bug fixes'],
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This independence is possible because the IPC interface between plugin and
        blueprint is stable and versioned separately. The blueprint can add new
        features (new IPC methods, new policy types) without changing the plugin,
        as long as it remains backwards-compatible with the existing IPC methods the
        plugin uses.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Version Pinning
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        By default, NemoClaw uses the latest compatible blueprint version. For
        production environments and teams that need reproducibility, you can pin to an
        exact version or a version range in your project configuration.
      </p>

      <CodeBlock
        title="Version pinning strategies"
        language="yaml"
        code={`# .nemoclaw/config.yaml

# Strategy 1: Exact pin (most predictable)
blueprint:
  version: "0.8.2"
  # Always uses exactly 0.8.2, even if 0.8.3 is available

# Strategy 2: Patch range (recommended for most teams)
blueprint:
  version: "~0.8.2"
  # Allows 0.8.2, 0.8.3, 0.8.4, etc. but NOT 0.9.0
  # Equivalent to: >=0.8.2 <0.9.0

# Strategy 3: Minor range (for teams that want new features quickly)
blueprint:
  version: "^0.8.2"
  # Allows 0.8.x and 0.9.x, but NOT 1.0.0
  # Equivalent to: >=0.8.2 <1.0.0

# Strategy 4: Latest (default, not recommended for production)
blueprint:
  version: "latest"
  # Always uses the newest published version`}
      />

      <NoteBlock type="tip" title="Recommendation: Use Patch Pinning">
        For most teams, the tilde (<code>~</code>) version constraint is the sweet
        spot. You get security patches automatically, but you do not get new features
        until you deliberately upgrade. New features (minor versions) occasionally
        change behavior in subtle ways, and you want to test those changes before
        deploying them across your team.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Upgrade Strategy
      </h2>

      <StepBlock
        title="Upgrading the Blueprint"
        steps={[
          {
            title: 'Check available versions',
            content: 'List available blueprint versions and their changelogs to understand what has changed.',
            code: `$ nemoclaw blueprint list
Available blueprints:
  0.8.4  (2025-12-01)  Security: fix seccomp filter for io_uring
  0.8.3  (2025-11-20)  Fix: Landlock rule ordering for nested paths
  0.8.2  (2025-11-15)  Current (pinned)
  0.8.1  (2025-11-01)  Fix: inference timeout handling
  0.8.0  (2025-10-15)  Feature: Google Gemini provider support`,
            language: 'bash',
          },
          {
            title: 'Review the changelog',
            content: 'Read the changelog for the versions between your current and target version. Pay special attention to breaking changes and policy format changes.',
            code: `$ nemoclaw blueprint changelog 0.8.2..0.8.4
## 0.8.4 (2025-12-01)
- SECURITY: Block io_uring syscalls in default seccomp profile
- Fix: Improve error messages for Landlock ABI version mismatch

## 0.8.3 (2025-11-20)
- Fix: Landlock rules for nested paths now apply in correct order
- Fix: DNS resolver handles CNAME chains properly`,
            language: 'bash',
          },
          {
            title: 'Test with plan (dry run)',
            content: 'Run a plan with the new version without applying it. This shows what would change in your sandbox configuration.',
            code: `$ nemoclaw plan --blueprint-version 0.8.4
Planning with blueprint v0.8.4 (current: v0.8.2)...
Changes:
  + seccomp: block io_uring_setup, io_uring_enter, io_uring_register
  ~ landlock: reorder rules for /sandbox/node_modules (nested path fix)
  No policy format changes required.`,
            language: 'bash',
          },
          {
            title: 'Update the pin and apply',
            content: 'Update your config file with the new version and apply the change.',
            code: `# Update .nemoclaw/config.yaml
blueprint:
  version: "~0.8.4"

# Apply the update
$ nemoclaw apply
Resolving blueprint... v0.8.4 (new)
Fetching from registry... done
Verifying integrity... PASS
Applying changes... done
Blueprint upgraded: 0.8.2 -> 0.8.4`,
            language: 'bash',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Version Pinning with Digest
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For maximum security, you can pin both the version number and the expected
        digest. This provides two independent checks: the version must match and the
        content must match. Even if the registry were compromised and a malicious
        package uploaded under the correct version number, the digest check would catch
        it.
      </p>

      <CodeBlock
        title="Version + digest pinning"
        language="yaml"
        code={`# .nemoclaw/config.yaml -- maximum security configuration
blueprint:
  version: "0.8.4"
  digest: "sha256:b4c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6"
  registry: "https://registry.nvidia.com/nemoclaw"

  # If either version or digest does not match, apply fails
  # This is recommended for:
  #   - Production CI/CD pipelines
  #   - Regulated environments (SOC2, HIPAA)
  #   - Multi-team organizations where consistency is critical`}
      />

      <WarningBlock title="Commit Your Config File">
        The <code>.nemoclaw/config.yaml</code> file, including the version pin,
        should be committed to your project's version control. This ensures that
        every team member and CI runner uses the same blueprint version. A common
        source of "works on my machine" issues is different team members running
        different blueprint versions.
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Automatic Security Updates
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw can optionally notify you when a security patch is available for your
        pinned version. This uses the blueprint registry's advisory feed:
      </p>

      <CodeBlock
        title="Security advisory notifications"
        language="yaml"
        code={`# .nemoclaw/config.yaml
blueprint:
  version: "~0.8.2"
  security:
    # Notify when a security patch is available
    notify_on_advisory: true
    # Automatically upgrade for critical security patches
    auto_upgrade_critical: false  # default: false (opt-in)`}
      />

      <NoteBlock type="info" title="Auto-Upgrade Is Opt-In">
        Automatic security upgrades are disabled by default because even a patch
        version change should be tested in your environment. Enable{' '}
        <code>auto_upgrade_critical</code> only if you have confidence in your testing
        pipeline and want critical security patches applied without manual
        intervention.
      </NoteBlock>

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Blueprint Versioning',
            url: 'https://docs.nvidia.com/nemoclaw/versioning',
            type: 'docs',
            description: 'Official guide to blueprint version pinning, ranges, and upgrade strategies.',
          },
          {
            title: 'Semantic Versioning Specification',
            url: 'https://semver.org/',
            type: 'docs',
            description: 'The semver specification that NemoClaw blueprints follow.',
          },
        ]}
      />
    </div>
  );
}
