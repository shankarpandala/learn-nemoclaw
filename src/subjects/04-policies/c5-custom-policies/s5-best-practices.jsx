import { NoteBlock, CodeBlock, ComparisonTable, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function BestPractices() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Policy Best Practices
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Writing a correct network policy is necessary but not sufficient. Maintaining a
        healthy security posture over time requires discipline, processes, and organizational
        habits. This section distills practical best practices for managing NemoClaw policies
        based on real-world deployment experience.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        1. Apply the Principle of Least Privilege
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The principle of least privilege states that every process should have only the minimum
        access required to perform its function. For NemoClaw policies, this means:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Whitelist only the endpoints the agent actually needs, not the endpoints it might need.</li>
        <li>If the agent has two different tasks that need different endpoints, consider using separate sandboxes with task-specific policies rather than one permissive policy.</li>
        <li>Remove endpoints the agent no longer needs. Services get deprecated, integrations get removed, and requirements change. The policy should evolve with them.</li>
        <li>Prefer narrow access (specific subdomains) over broad access. Whitelist api.service.com rather than adding every subdomain under service.com.</li>
      </ul>

      <NoteBlock type="info" title="The Cost of Over-Provisioning">
        <p>
          Every unnecessary endpoint in your policy is a potential avenue for data exfiltration
          if the agent is compromised through prompt injection. An attacker who can control
          the agent's behavior cannot reach endpoints outside the whitelist, but they can abuse
          any endpoint that IS whitelisted. A policy with 10 carefully chosen endpoints is
          vastly more secure than one with 50 "just in case" endpoints.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        2. Start Restrictive, Add as Needed
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When deploying a new agent, start with the most restrictive policy possible and expand
        it based on actual observed needs. This approach, sometimes called "default deny with
        progressive allowlisting," has several advantages:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>You discover your agent's actual dependencies, not its theoretical ones.</li>
        <li>Every endpoint in the policy has been proven necessary through real usage.</li>
        <li>You avoid the common mistake of copying a permissive policy template and never trimming it down.</li>
        <li>The operator approval flow provides a natural mechanism for discovering new needs without compromising security.</li>
      </ul>

      <CodeBlock
        language="yaml"
        title="Start minimal, expand from observations"
        code={`# Week 1: Start with absolute minimum
groups:
  claude_code:
    endpoints:
      - domain: "api.anthropic.com"
        port: 443
        tls: required

# Week 2: Agent needed GitHub access (observed from blocked requests)
  github:
    endpoints:
      - domain: "github.com"
        port: 443
        tls: required
      - domain: "api.github.com"
        port: 443
        tls: required

# Week 3: Agent needed npm for package installation
  npm_registry:
    endpoints:
      - domain: "registry.npmjs.org"
        port: 443
        tls: required

# Result: A policy with exactly what's needed, nothing more`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        3. Conduct Regular Policy Audits
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Policies drift over time. Endpoints are added during debugging and never removed.
        Service integrations are deprecated but their endpoints linger. New team members
        add endpoints without understanding the existing policy structure. Regular audits
        counteract this drift.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Schedule a quarterly policy review where you:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          Review every endpoint in the baseline policy. Can you justify each one?
        </li>
        <li>
          Cross-reference with audit logs. Are there endpoints that are whitelisted but never
          actually accessed? Consider removing them.
        </li>
        <li>
          Check for endpoints that are frequently approved in sessions but not in the baseline.
          Should they be promoted?
        </li>
        <li>
          Verify that all whitelisted domains still resolve and belong to the expected
          organizations. Domains can change ownership.
        </li>
        <li>
          Review the overall number of endpoints. If the count has grown significantly
          since the last audit, investigate why.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Audit helper commands"
        code={`# List all whitelisted endpoints
nemoclaw policy list-endpoints

# Check which endpoints were actually used in the last 30 days
openshell logs audit --since 30d --filter event=network.allowed --summary

# Find endpoints that are whitelisted but never used
# Compare the whitelist against actual usage
nemoclaw policy audit --unused --since 30d

# Output:
# Unused endpoints (whitelisted but no connections in 30 days):
#   sentry.io:443 (group: claude_code)
#   docs.openclaw.ai:443 (group: openclaw_docs)
# Consider removing these if they are no longer needed.`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        4. Document Policy Decisions
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Every endpoint in your policy should have a documented justification. The YAML
        description field and inline comments are good starting points, but for complex
        deployments, maintain a separate policy decision log.
      </p>

      <CodeBlock
        language="yaml"
        title="Well-documented policy"
        code={`groups:
  # Required for Claude Code to communicate with Anthropic's API.
  # Without this group, the agent cannot generate responses.
  # Last reviewed: 2026-03-15
  claude_code:
    endpoints:
      - domain: "api.anthropic.com"   # Primary API
        port: 443
        tls: required
      - domain: "statsig.anthropic.com"  # Feature flags
        port: 443
        tls: required

  # GitHub access for PR review automation.
  # Added 2026-02-01 by @alice (PR #42).
  # Agent uses gh CLI for issue management.
  github_rest_api:
    endpoints:
      - domain: "api.github.com"
        port: 443
        tls: required`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        5. Version Control Everything
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Policy files, preset files, and any related configuration should live in version
        control. This provides:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">History:</span> Every change is recorded with
          who made it, when, and why (via commit messages).
        </li>
        <li>
          <span className="font-semibold">Review:</span> Policy changes go through pull
          requests and code review, just like code.
        </li>
        <li>
          <span className="font-semibold">Rollback:</span> If a policy change causes
          problems, revert to the previous commit.
        </li>
        <li>
          <span className="font-semibold">Consistency:</span> All team members work from
          the same policy source of truth.
        </li>
        <li>
          <span className="font-semibold">Compliance:</span> Auditors can review the
          complete history of policy changes.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        6. Separate Policies by Environment
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Development, staging, and production environments should have separate policies.
        Development policies may be more permissive to facilitate experimentation. Production
        policies should be as restrictive as possible. Do not use a development policy in
        production.
      </p>

      <ComparisonTable
        title="Policy Strictness by Environment"
        headers={['Environment', 'Policy Approach', 'Operator Approval']}
        rows={[
          [
            'Development',
            'Moderately permissive -- include common dev tools',
            'Frequent, fast approvals for testing'
          ],
          [
            'Staging',
            'Mirrors production -- same endpoints',
            'Approved after review, tests against real services'
          ],
          [
            'Production',
            'Minimum required -- heavily audited',
            'Rare, with formal review process'
          ],
        ]}
        highlightDiffs
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        7. Treat Policy Changes Like Code Changes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A policy change that adds a new endpoint to production is as significant as a code
        change that adds a new external dependency. Apply the same rigor:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Create a branch for the policy change.</li>
        <li>Write a descriptive PR explaining what is being added and why.</li>
        <li>Have at least one reviewer approve the change.</li>
        <li>Test in a non-production environment first.</li>
        <li>Monitor the production deployment for unexpected behavior.</li>
      </ul>

      <ExerciseBlock
        question="An agent is deployed in production with a policy that includes 15 endpoint groups. During a quarterly audit, you discover 3 groups whose endpoints have not been accessed in over 60 days. What should you do?"
        options={[
          'Leave them in the policy -- they might be needed later.',
          'Remove them immediately without further investigation.',
          'Investigate why they are unused, then remove if no longer needed, documenting the removal.',
          'Move them to a session-only policy so they are available but not persistent.',
        ]}
        correctIndex={2}
        explanation="The correct approach is to investigate first. The endpoints might be unused because a feature was deprecated, or they might be needed for quarterly operations you have not observed yet. Once you understand why they are unused, remove them if no longer needed and document the decision. Leaving unused endpoints increases the attack surface unnecessarily."
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Summary
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Good policy management is an ongoing practice, not a one-time setup. The best policies
        are the result of starting restrictive, expanding based on observed needs, documenting
        every decision, reviewing regularly, and treating policy files with the same care as
        production code. NemoClaw provides the enforcement mechanisms; these best practices
        ensure you use them effectively.
      </p>

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Policy Documentation',
            url: 'https://docs.openclaw.ai/nemoclaw/policies',
            type: 'docs',
            description: 'Official reference for NemoClaw policy configuration and management.',
          },
          {
            title: 'OpenClaw Sandbox Security Model',
            url: 'https://docs.openclaw.ai/security-model',
            type: 'docs',
            description: 'Overview of the defense-in-depth security architecture.',
          },
          {
            title: 'NemoClaw Blueprint Repository',
            url: 'https://github.com/openclaw/nemoclaw-blueprint',
            type: 'github',
            description: 'Example blueprint with default policies and preset configurations.',
          },
          {
            title: 'Landlock Linux Security Module',
            url: 'https://docs.kernel.org/userspace-api/landlock.html',
            type: 'docs',
            description: 'Kernel documentation for the Landlock filesystem access control mechanism.',
          },
        ]}
      />
    </div>
  )
}
