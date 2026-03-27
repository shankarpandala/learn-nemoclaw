import { NoteBlock, CodeBlock, StepBlock, WarningBlock } from '../../../components/content'

export default function ApproveDenyRealtime() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Approve and Deny in Real Time
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When a blocked request appears in the OpenShell TUI, the operator has the power to
        approve or deny it immediately. This real-time approval mechanism is what makes
        NemoClaw's deny-by-default policy practical for production use -- the agent is secure
        by default, but the operator can unblock legitimate requests without restarting the
        sandbox or editing YAML files.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The Operator Workflow
      </h2>

      <StepBlock
        title="Reviewing and approving a blocked request"
        steps={[
          {
            title: 'Notice the blocked request',
            content: 'The TUI highlights new blocked requests with a visual indicator. If you have configured notification channels (Telegram, etc.), you may also receive an alert.',
          },
          {
            title: 'Review the request details',
            content: 'Examine the domain name, the process that made the request, and the timestamp. Ask yourself: does this endpoint make sense for what the agent is doing? Use the Inspect view for additional context.',
          },
          {
            title: 'Make the decision',
            content: 'Press "A" to approve or "D" to deny. Approval adds the endpoint to the session policy immediately. Denial logs the rejection and the agent continues to receive connection errors for that endpoint.',
          },
          {
            title: 'Observe the result',
            content: 'If approved, the endpoint moves to the "Approved This Session" section of the TUI. The agent can now successfully connect to that endpoint. If the agent retries the failed request, the retry will succeed.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        How Approval Propagates
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When the operator presses "A" to approve a request, the following happens within
        milliseconds:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Session policy updated:</span> The approved domain
          and port are added to the session policy layer. This is an in-memory operation
          that takes effect immediately.
        </li>
        <li>
          <span className="font-semibold">Network rules updated:</span> The sandbox's network
          enforcement layer is updated to allow connections to the newly approved endpoint.
          The update is atomic -- there is no window during which the endpoint is
          "partially approved."
        </li>
        <li>
          <span className="font-semibold">Approval logged:</span> The approval event is
          written to the audit log with the operator's action, the endpoint, and the timestamp.
        </li>
        <li>
          <span className="font-semibold">TUI updated:</span> The request moves from the
          "Blocked" section to the "Approved This Session" section. The pending request
          count decreases.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Critically, the approval applies to the domain, not to the specific request. Once
        api.example.com is approved, all subsequent connections to api.example.com:443 from
        the sandbox will succeed for the remainder of the session. The agent does not need
        separate approval for each individual request to the same endpoint.
      </p>

      <CodeBlock
        language="bash"
        title="TUI after approving an endpoint"
        code={`┌─ Network Activity ────────────────────────────────────┐
│                                                       │
│  BLOCKED REQUESTS (0 pending)                         │
│  No pending requests.                                 │
│                                                       │
│  APPROVED THIS SESSION                                │
│  ✓ pypi.org:443           (approved 14:33:22)         │
│  ✓ files.pythonhosted.org:443  (approved 14:33:25)    │
│  ✓ api.slack.com:443      (approved 14:28:11)         │
│                                                       │
│  RECENT DENIALS                                       │
│  ✗ api.openai.com:443     (denied 14:32:15)           │
│                                                       │
└───────────────────────────────────────────────────────┘`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Denying Requests
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Pressing "D" denies a blocked request. The denial is logged, and the endpoint remains
        blocked. Future connection attempts to the same endpoint will continue to fail. Denials
        are important because they create an audit record that the operator reviewed a request
        and consciously decided it should not be allowed.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A denial does not permanently block the endpoint. If the agent tries the same endpoint
        again, it will appear as a new blocked request in the TUI. The operator can then
        reconsider their decision if circumstances have changed. However, if the same endpoint
        is repeatedly requested and denied, it may indicate either a misconfigured agent or
        a prompt injection attempt that should be investigated.
      </p>

      <WarningBlock title="Investigate Unexpected Requests">
        <p>
          If your agent is requesting endpoints that have no relation to its assigned task,
          this could indicate a prompt injection attack. An attacker may have embedded
          instructions in content the agent processed, directing it to exfiltrate data to
          an external server. Always investigate unexpected endpoint requests before approving
          them. Check what task the agent was performing, what content it recently processed,
          and whether the requested endpoint makes sense in context.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Decision Guidelines
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When reviewing a blocked request, consider these factors:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Is the domain recognized?</span> Requests to
          well-known services (pypi.org, api.github.com, slack.com) are generally safe if
          they align with the agent's task.
        </li>
        <li>
          <span className="font-semibold">Does it match the current task?</span> If the
          agent is doing Python development, a request to pypi.org makes sense. If it is
          doing JavaScript development, a request to pypi.org is suspicious.
        </li>
        <li>
          <span className="font-semibold">What process initiated it?</span> A request from
          pip3 or npm is likely a legitimate package manager operation. A request from an
          unknown process or directly from the agent may warrant more scrutiny.
        </li>
        <li>
          <span className="font-semibold">Is this a one-time or recurring need?</span> If
          you expect the agent to need this endpoint regularly, consider adding it to the
          baseline policy after approving the session request.
        </li>
      </ul>

      <NoteBlock type="tip" title="Batch Approvals for Related Endpoints">
        <p>
          Services often use multiple domains (for example, pypi.org for metadata and
          files.pythonhosted.org for package downloads). When you approve one related domain,
          anticipate that the related domains will be requested shortly. You can proactively
          approve them or wait for the requests to appear.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        CLI Approval Alternative
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While the TUI provides the richest experience for reviewing requests, approvals can
        also be managed through the command line for automation or scripting scenarios:
      </p>

      <CodeBlock
        language="bash"
        title="CLI-based approval commands"
        code={`# List pending blocked requests
openshell requests list

# Approve a specific domain
openshell requests approve pypi.org

# Deny a specific domain
openshell requests deny suspicious-domain.com

# Approve all pending requests (use with caution)
openshell requests approve-all`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The next section covers the important distinction between session approvals and
        persistent policy changes, and when to choose one over the other.
      </p>
    </div>
  )
}
