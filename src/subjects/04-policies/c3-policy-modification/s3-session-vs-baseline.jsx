import { NoteBlock, ComparisonTable, CodeBlock } from '../../../components/content'

export default function SessionVsBaseline() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Session vs. Baseline Policies
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw operates with two layers of network policy that combine to form the active
        policy at any given moment: the baseline policy and the session policy. Understanding
        the distinction between these layers -- and how they interact -- is essential for
        managing your sandbox's security posture effectively.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Baseline Policy
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The baseline policy is the persistent security configuration defined in your YAML files
        under{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          nemoclaw-blueprint/policies/
        </code>
        . It represents your deliberately chosen, version-controlled, reviewed-and-approved
        security posture. The baseline policy:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Is defined in YAML files on disk</li>
        <li>Persists across sandbox restarts</li>
        <li>Is version-controlled alongside your project</li>
        <li>Changes require editing files and running{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            nemoclaw onboard
          </code>
        </li>
        <li>Represents the minimum set of endpoints the agent always needs</li>
        <li>Should be reviewed and approved through your team's standard change process</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Session Policy
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The session policy is a temporary overlay that adds endpoints to the active policy for
        the duration of the current sandbox session. Session policy changes come from two
        sources:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Dynamic policy files:</span> Applied via{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            openshell policy set &lt;file&gt;
          </code>
          . These are deliberate additions by the operator.
        </li>
        <li>
          <span className="font-semibold">Operator approvals:</span> When the agent tries to
          access a non-whitelisted endpoint, the operator can approve it through the OpenShell
          TUI. These approvals are session-only -- they are not added to the baseline policy.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Session policy changes exist only in memory. They are not written to disk. When the
        sandbox restarts, all session changes are discarded and the sandbox reverts to the
        baseline policy.
      </p>

      <ComparisonTable
        title="Baseline vs. Session Policy"
        headers={['Characteristic', 'Baseline Policy', 'Session Policy']}
        rows={[
          ['Storage', 'YAML files on disk', 'In-memory only'],
          ['Persistence', 'Survives restarts', 'Lost on restart'],
          ['How applied', 'nemoclaw onboard', 'openshell policy set or operator approval'],
          ['Version controlled', 'Yes', 'No'],
          ['Can remove access', 'Yes (edit YAML)', 'No (additive only)'],
          ['Typical use', 'Permanent integrations', 'Testing, temporary access, one-off tasks'],
          ['Review process', 'Code review, PR approval', 'Real-time operator decision'],
        ]}
        highlightDiffs
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        How They Interact
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The active policy at any moment is the union of the baseline policy and the session
        policy. An endpoint is accessible if it appears in either the baseline or the session
        policy. This means:
      </p>

      <CodeBlock
        language="bash"
        title="Active policy = Baseline + Session"
        code={`# Baseline policy allows:
#   api.github.com
#   registry.npmjs.org
#   api.anthropic.com

# Session policy (from operator approval) adds:
#   api.slack.com

# Active policy allows ALL of:
#   api.github.com        (from baseline)
#   registry.npmjs.org    (from baseline)
#   api.anthropic.com     (from baseline)
#   api.slack.com         (from session)

# After restart, active policy reverts to baseline only:
#   api.github.com
#   registry.npmjs.org
#   api.anthropic.com
#   (api.slack.com is no longer accessible)`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Operator Approvals Are Session-Only
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This is a critical design decision that is worth emphasizing: when an operator approves
        a blocked request through the OpenShell TUI, that approval lasts only for the current
        session. The approved endpoint is NOT automatically added to the baseline policy YAML.
        This is intentional for several reasons:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Security review:</span> A quick approval in the TUI
          should not bypass the security review process. Adding an endpoint to the permanent
          baseline deserves the same scrutiny as any other code change.
        </li>
        <li>
          <span className="font-semibold">Clean baseline:</span> The baseline policy reflects
          only deliberately planned integrations. It is not cluttered with one-off endpoints
          that were approved during debugging sessions.
        </li>
        <li>
          <span className="font-semibold">Audit clarity:</span> The baseline YAML is the
          definitive record of what the agent is supposed to access. Session approvals are
          operational exceptions, not architectural decisions.
        </li>
      </ul>

      <NoteBlock type="tip" title="Promoting Session Approvals to Baseline">
        <p>
          If you repeatedly find yourself approving the same endpoint across sessions, it is a
          signal that the endpoint should be added to the baseline policy. Review the endpoint,
          add it to the YAML file, get it code-reviewed, and run{' '}
          <code className="px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-sm font-mono">
            nemoclaw onboard
          </code>
          . This turns a repeated operational burden into a one-time configuration change.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Policy Precedence
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Since session policies can only add access (never remove it), there is no conflict
        between layers. The precedence model is simple:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>If the baseline allows it, it is allowed (session cannot override).</li>
        <li>If the session allows it, it is allowed (for this session only).</li>
        <li>If neither allows it, it is blocked.</li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        There is no "deny" rule in either layer. Both layers are purely additive whitelists.
        The deny-by-default behavior comes from the underlying enforcement: anything not
        explicitly allowed by either layer is blocked.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Inspecting the Active Policy
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        You can inspect the current state of both layers using the OpenShell CLI:
      </p>

      <CodeBlock
        language="bash"
        title="Inspecting policy layers"
        code={`# Show the full active policy (baseline + session combined)
openshell policy show

# Show only the baseline policy
openshell policy show --baseline

# Show only session overrides
openshell policy show --session

# Show the diff between baseline and active
openshell policy diff`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          openshell policy diff
        </code>{' '}
        command is particularly useful for understanding what session changes are currently
        active. It shows exactly which endpoints have been added by dynamic policies or operator
        approvals. At the end of a session, reviewing this diff helps you decide which
        temporary changes should be promoted to the baseline.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will explore policy presets -- pre-built policy packages for
        common services that simplify adding new integrations.
      </p>
    </div>
  )
}
