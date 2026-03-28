import { NoteBlock, CodeBlock, DefinitionBlock } from '../../../components/content'

export default function BlockedRequestsTui() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Blocked Requests in the TUI
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When an agent running inside a NemoClaw sandbox attempts to access a network endpoint
        that is not in the active policy (neither baseline nor session), the connection is
        blocked at the network level. The agent receives a connection error. But the story does
        not end there -- the blocked request is captured, logged, and displayed in the OpenShell
        Terminal User Interface (TUI), giving the operator a real-time view of what the agent
        is trying to do and the opportunity to respond.
      </p>

      <DefinitionBlock
        term="OpenShell TUI"
        definition="The Terminal User Interface provided by OpenShell for monitoring and managing sandbox sessions. The TUI displays real-time information about the agent's activity, including blocked network requests, approved endpoints, resource usage, and session status. Operators use the TUI to approve or deny access requests as they occur."
        seeAlso={['OpenShell', 'Operator Approval', 'Session Policy']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What Happens When a Request Is Blocked
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The blocking and notification flow follows a well-defined sequence:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Connection attempt:</span> The agent (or a
          subprocess) initiates a network connection to a domain not in the active policy.
          For example, the agent might try to{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            curl https://api.openai.com/v1/chat/completions
          </code>
          .
        </li>
        <li>
          <span className="font-semibold">Network interception:</span> The sandbox's network
          enforcement layer intercepts the outbound connection before it leaves the sandbox.
          DNS resolution may succeed (the domain resolves to an IP), but the actual TCP
          connection is blocked.
        </li>
        <li>
          <span className="font-semibold">Error returned to agent:</span> The agent receives
          a connection refused or timeout error. From the agent's perspective, the network
          request simply failed.
        </li>
        <li>
          <span className="font-semibold">Event logged:</span> The blocked request is recorded
          with its timestamp, the target domain, port, and the process that initiated the
          connection.
        </li>
        <li>
          <span className="font-semibold">TUI notification:</span> The OpenShell TUI displays
          the blocked request in its pending requests panel, alerting the operator.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        How the TUI Displays Pending Requests
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The OpenShell TUI dedicates a panel to network activity. Blocked requests appear in
        this panel with all the information an operator needs to make an informed approval
        decision.
      </p>

      <CodeBlock
        language="bash"
        title="TUI blocked requests panel (simplified representation)"
        code={`┌─ Network Activity ────────────────────────────────────┐
│                                                       │
│  BLOCKED REQUESTS (2 pending)                         │
│                                                       │
│  [1] 14:32:07  api.openai.com:443                     │
│      Process: curl (PID 4521)                         │
│      Status: BLOCKED - awaiting operator decision     │
│      [A]pprove  [D]eny  [I]nspect                     │
│                                                       │
│  [2] 14:32:09  pypi.org:443                           │
│      Process: pip3 (PID 4523)                         │
│      Status: BLOCKED - awaiting operator decision     │
│      [A]pprove  [D]eny  [I]nspect                     │
│                                                       │
│  APPROVED THIS SESSION                                │
│  ✓ api.slack.com:443  (approved 14:28:11)             │
│                                                       │
│  RECENT DENIALS                                       │
│  ✗ malicious-site.com:443  (denied 14:25:03)          │
│                                                       │
└───────────────────────────────────────────────────────┘`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Each blocked request entry includes:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Timestamp:</span> When the request was made, so the
          operator can correlate it with agent activity.
        </li>
        <li>
          <span className="font-semibold">Domain and port:</span> The exact endpoint the agent
          tried to reach.
        </li>
        <li>
          <span className="font-semibold">Process information:</span> Which process inside the
          sandbox initiated the connection. This helps the operator understand the context --
          was it the agent itself, a build tool, a package manager, or something unexpected?
        </li>
        <li>
          <span className="font-semibold">Status:</span> Whether the request is pending,
          approved, or denied.
        </li>
        <li>
          <span className="font-semibold">Action buttons:</span> Keyboard shortcuts to approve,
          deny, or inspect the request in more detail.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The Inspect View
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Pressing "I" on a blocked request opens the inspect view, which provides additional
        context to help the operator make a decision:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Full process tree:</span> The complete chain of
          processes that led to the connection attempt, from the sandbox init process down
          to the specific command.
        </li>
        <li>
          <span className="font-semibold">Request history:</span> How many times this specific
          domain has been requested during the session, indicating whether it is a one-off
          or recurring need.
        </li>
        <li>
          <span className="font-semibold">Domain information:</span> Basic WHOIS-style
          information about the domain, when available, to help the operator assess
          legitimacy.
        </li>
      </ul>

      <NoteBlock type="info" title="Agent Behavior During Blocking">
        <p>
          While a request is blocked and pending operator review, the agent is not suspended.
          It continues running and may handle the connection error by retrying, falling back
          to an alternative approach, or reporting the failure. The agent does not know that
          an operator is reviewing the request. If the operator later approves the endpoint,
          the agent would need to retry the request to take advantage of the new permission.
          Some agents are designed to retry failed network requests, making this flow
          relatively seamless.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Notification Channels
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In addition to the TUI display, NemoClaw can be configured to send notifications
        through external channels when requests are blocked. If you have configured Telegram
        integration, blocked requests can trigger a Telegram message to the operator, allowing
        them to be aware of pending requests even when they are not actively watching the TUI.
        This is particularly valuable for long-running agent sessions where the operator may
        not be constantly monitoring.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will walk through the operator's approval and denial workflow
        in detail, covering how approvals propagate to the sandbox and what happens after a
        decision is made.
      </p>
    </div>
  )
}
