import { NoteBlock, ComparisonTable, CodeBlock, WarningBlock } from '../../../components/content'

export default function SessionVsPersistent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Session Approvals vs. Persistent Changes
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Every time you approve a blocked request in the OpenShell TUI, you are making a
        session-level change. The approved endpoint is accessible for the remainder of the
        current sandbox session, but it is NOT added to the baseline policy YAML. When the
        sandbox restarts, the approval is gone. This distinction is fundamental to NemoClaw's
        security model and understanding it is crucial for effective policy management.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why Approvals Are Session-Only
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Making operator approvals session-only is a deliberate design choice, not a limitation.
        There are several important reasons for this:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Preventing policy drift:</span> If every approval
          automatically became permanent, the baseline policy would grow unbounded over time.
          Endpoints approved during debugging sessions, one-off tasks, and testing would
          accumulate, expanding the attack surface without anyone making a conscious decision
          to permanently allow them.
        </li>
        <li>
          <span className="font-semibold">Separation of concerns:</span> Real-time approval
          is an operational decision ("the agent needs this right now"). Adding to the baseline
          is an architectural decision ("the agent permanently needs this"). These decisions
          should be made through different processes with different levels of scrutiny.
        </li>
        <li>
          <span className="font-semibold">Reversibility:</span> Session approvals automatically
          revert. If you approve something you should not have, the damage is limited to the
          current session. A permanent change requires explicit action to undo.
        </li>
        <li>
          <span className="font-semibold">Audit clarity:</span> The baseline YAML represents
          the official, reviewed policy. Session approvals are operational exceptions. Keeping
          them separate makes both easier to audit.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When to Keep It Temporary
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Keep an approval as session-only (take no further action) when:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>The agent needed the endpoint for a one-time task that will not recur.</li>
        <li>You are debugging and testing connectivity, not setting up a permanent integration.</li>
        <li>You are not sure whether the endpoint will be needed in future sessions.</li>
        <li>The endpoint was requested unexpectedly and you want to monitor whether it recurs.</li>
        <li>The access was granted as an emergency measure during an incident.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When to Make It Permanent
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Promote a session approval to a permanent baseline change when:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>You find yourself approving the same endpoint every session.</li>
        <li>The endpoint is part of a planned, permanent service integration.</li>
        <li>The agent's core functionality depends on this endpoint.</li>
        <li>You have reviewed the endpoint and are confident it should always be accessible.</li>
        <li>Your team has agreed that this integration is part of the standard configuration.</li>
      </ul>

      <ComparisonTable
        title="Session Approval vs. Baseline Change"
        headers={['Factor', 'Session Approval', 'Baseline Change']}
        rows={[
          ['Speed', 'Instant (one keypress)', 'Requires YAML edit + onboard'],
          ['Persistence', 'Lost on restart', 'Survives restarts'],
          ['Review process', 'Operator real-time decision', 'Code review, PR, approval'],
          ['Audit trail', 'Session logs only', 'Git history + session logs'],
          ['Risk', 'Low (auto-reverts)', 'Higher (permanent expansion)'],
          ['Use case', 'One-off, testing, debugging', 'Permanent integrations'],
        ]}
        highlightDiffs
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The Promotion Workflow
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When you decide a session approval should become permanent, follow this workflow:
      </p>

      <CodeBlock
        language="bash"
        title="Promoting a session approval to baseline"
        code={`# 1. Review current session approvals
openshell policy show --session
# Session overrides:
#   pypi.org:443 (approved 14:33:22)
#   files.pythonhosted.org:443 (approved 14:33:25)

# 2. Add the endpoints to the baseline YAML
# Edit nemoclaw-blueprint/policies/openclaw-sandbox.yaml
# Add a new group:
#   pypi:
#     endpoints:
#       - domain: "pypi.org"
#         port: 443
#         tls: required
#       - domain: "files.pythonhosted.org"
#         port: 443
#         tls: required

# OR use a preset if one exists:
nemoclaw my-sandbox policy-add pypi

# 3. Commit the change
cd nemoclaw-blueprint
git add policies/openclaw-sandbox.yaml
git commit -m "Add PyPI endpoints to baseline network policy"

# 4. Apply the baseline
nemoclaw onboard`}
      />

      <WarningBlock title="Do Not Blindly Promote All Session Approvals">
        <p>
          At the end of a session, review each session approval individually before deciding
          whether to promote it. Some approvals may have been made hastily during debugging.
          Others may have been for endpoints the agent requested due to a bug or unexpected
          behavior. Only promote endpoints that represent genuine, recurring needs of the agent.
        </p>
      </WarningBlock>

      <NoteBlock type="tip" title="End-of-Session Review">
        <p>
          Make it a habit to run{' '}
          <code className="px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-sm font-mono">
            openshell policy diff
          </code>{' '}
          at the end of each session. This shows all session overrides that were active. Review
          each one and decide: promote to baseline, or let it expire? This regular review
          prevents policy drift and ensures your baseline stays clean and intentional.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will look at the audit logging system that records all blocked
        requests, approvals, and denials, providing a complete record for compliance and
        post-incident analysis.
      </p>
    </div>
  )
}
