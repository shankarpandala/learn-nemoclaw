import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content';

export default function ReproducibleEnvironments() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Reproducible Environments
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        One of the most powerful properties of NemoClaw's architecture is
        reproducibility: given the same blueprint version and the same policy files,
        you get the same sandbox environment. Every time, on every machine, for every
        team member. This property is not accidental -- it is a direct consequence of
        the declarative, versioned, digest-verified design.
      </p>

      <DefinitionBlock
        term="Reproducible Environment"
        definition="A computing environment that can be recreated identically from a specification. In NemoClaw, the specification is the combination of a blueprint version (with digest) and the policy files in .nemoclaw/policies/. Given these inputs, the resulting sandbox has identical filesystem permissions, seccomp filters, network allowlists, and inference configuration."
        example="Two developers on different machines, both running blueprint v0.8.4 with the same .nemoclaw/ directory, will get sandboxes with byte-for-byte identical Landlock rulesets, seccomp filters, and network configurations."
        seeAlso={['Deterministic Build', 'Version Pinning', 'Policy as Code']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        The Reproducibility Equation
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's reproducibility can be expressed as a simple equation:
      </p>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-lg font-mono text-gray-800 dark:text-gray-200">
          Blueprint Version + Policy Files = Sandbox Configuration
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          (pinned + committed) + (committed) = (identical everywhere)
        </p>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Both inputs -- the blueprint version and the policy files -- are committed to
        version control. The blueprint version is pinned in{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">.nemoclaw/config.yaml</code>.
        The policy files live in{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">.nemoclaw/policies/</code>.
        Both are checked into git alongside the project code. This means that checking
        out a specific git commit gives you not just the code, but also the exact
        sandbox environment specification for that code.
      </p>

      <CodeBlock
        title="A fully reproducible .nemoclaw/ directory"
        language="bash"
        code={`$ tree .nemoclaw/
.nemoclaw/
├── config.yaml                # Blueprint version + digest pin
└── policies/
    ├── filesystem.yaml        # Landlock rules
    ├── network.yaml           # Network allowlist
    ├── seccomp.yaml           # Seccomp customizations (if any)
    └── inference.yaml         # Inference provider configuration

$ cat .nemoclaw/config.yaml
blueprint:
  version: "0.8.4"
  digest: "sha256:b4c7d8e9f0a1b2c3..."

$ git log --oneline .nemoclaw/
a1b2c3d  Update network policy: allow registry.yarnpkg.com
e4f5a6b  Pin blueprint to 0.8.4 (security fix for io_uring)
c7d8e9f  Initial NemoClaw configuration`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Benefits for Testing
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Reproducible environments make testing deterministic. When a test passes in CI,
        you know it will pass on a developer's machine (and vice versa) because the
        sandbox configuration is identical. This eliminates an entire class of "works
        in CI but not locally" bugs related to environment differences.
      </p>

      <ComparisonTable
        title="Testing With vs. Without Reproducibility"
        headers={['Scenario', 'Without Reproducibility', 'With NemoClaw']}
        rows={[
          [
            'Developer A and B get different results',
            'Different provider versions, different network access, hard to debug',
            'Same blueprint + same policies = same sandbox. If results differ, the issue is in the code, not the environment.',
          ],
          [
            'Test passes locally, fails in CI',
            'CI has different network rules, different seccomp profile, different provider',
            'CI uses the same .nemoclaw/ directory from git. Sandbox is identical.',
          ],
          [
            'Debugging a production incident',
            'Hard to recreate the exact environment where the bug occurred',
            'Check out the commit, run nemoclaw apply, get the exact same sandbox.',
          ],
          [
            'Security audit',
            'Hard to verify what environment was running at a given time',
            'Git history shows exactly which policies and blueprint version were active for any commit.',
          ],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Benefits for Compliance
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Regulated environments (SOC 2, HIPAA, FedRAMP, etc.) require organizations to
        demonstrate that their security controls are consistent and auditable. NemoClaw's
        reproducibility provides this out of the box:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Policy as code</strong> -- security policies are YAML files in version
          control, with full change history, authorship, and review trail
        </li>
        <li>
          <strong>Immutable enforcement</strong> -- a specific blueprint version +
          digest always produces the same security controls
        </li>
        <li>
          <strong>Audit trail</strong> -- git log shows who changed what policy, when,
          and why (via commit messages and PR reviews)
        </li>
        <li>
          <strong>Drift detection</strong> -- if someone modifies policies outside of
          version control, the next{' '}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw plan</code> will
          show the difference
        </li>
      </ul>

      <NoteBlock type="tip" title="Compliance Tip">
        For compliance documentation, you can generate a report of the exact security
        controls in effect for any commit:{' '}
        <code>git checkout &lt;commit&gt; && nemoclaw plan --report</code>. This
        produces a human-readable document listing all Landlock rules, seccomp filters,
        network allowlist entries, and inference configuration -- suitable for attaching
        to audit evidence.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Multi-Team Coordination
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In organizations with multiple teams using NemoClaw, reproducibility enables
        centralized policy management. A security team can define a base policy that
        all projects must include, and individual teams can extend (but not weaken) it:
      </p>

      <CodeBlock
        title="Layered policy architecture"
        language="yaml"
        code={`# .nemoclaw/policies/base.yaml (maintained by security team)
# This file is pulled from a shared repository via git submodule
# or a policy registry.

extends: "org://security-team/base-policy@v2"

# Organization-wide requirements:
#   - No network access except inference and approved registries
#   - seccomp: block io_uring, ptrace, mount
#   - Landlock: deny /home, /root, /etc (except certs)

---
# .nemoclaw/policies/team-overrides.yaml (maintained by project team)
# Can ADD restrictions but cannot REMOVE base policy restrictions

network:
  allowlist:
    # Add project-specific endpoints
    - host: api.project-specific-service.com
      port: 443

filesystem:
  rules:
    # Add project-specific writable paths
    - path: /sandbox/build-output
      access: [read, write, create]`}
      />

      <WarningBlock title="Policy Weakening Is Detected">
        NemoClaw validates that team-level policy overrides do not weaken the base
        policy. If a team policy attempts to allow a syscall that the base policy
        blocks, or adds a network endpoint that the base policy explicitly denies,
        the plan stage will fail with a policy conflict error. This ensures that
        organizational security requirements cannot be circumvented by individual
        teams.
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        What Can Break Reproducibility
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While NemoClaw provides strong reproducibility guarantees, there are factors
        outside its control that can cause differences between environments:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Host kernel version</strong> -- Landlock ABI differences between
          kernel versions can change available enforcement features. Pin your minimum
          kernel version in documentation.
        </li>
        <li>
          <strong>Host-installed tools</strong> -- the sandbox uses the host's{' '}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">/usr</code> and{' '}
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">/lib</code> (read-only).
          Different host systems may have different tool versions.
        </li>
        <li>
          <strong>Inference provider behavior</strong> -- the same model may produce
          different outputs on different days (LLMs are not deterministic unless you
          pin temperature=0 and seed).
        </li>
      </ul>

      <ExerciseBlock
        question="A team member reports that their sandbox has different seccomp rules than yours. Both of you are on the same git commit. What is the most likely cause?"
        options={[
          'One of you has a different .nemoclaw/config.yaml (not committed)',
          'The blueprint registry returned different content for the same version',
          'NemoClaw randomizes seccomp rules for security',
          'One of you has a newer kernel that supports additional Landlock ABI features, causing the blueprint to generate different rules',
        ]}
        correctIndex={3}
        explanation="The most common cause of sandbox configuration differences between machines on the same commit is kernel version differences. If one machine has kernel 6.8 (Landlock ABI v4) and another has kernel 6.0 (ABI v2), the blueprint will generate different rulesets to match the available kernel features. The blueprint version and policies are the same, but the plan stage adapts to the host's capabilities."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Reproducibility Guide',
            url: 'https://docs.nvidia.com/nemoclaw/reproducibility',
            type: 'docs',
            description: 'Best practices for achieving fully reproducible sandbox environments.',
          },
          {
            title: 'Policy as Code',
            url: 'https://docs.nvidia.com/nemoclaw/policy-as-code',
            type: 'docs',
            description: 'How to manage NemoClaw policies in version control.',
          },
        ]}
      />
    </div>
  );
}
