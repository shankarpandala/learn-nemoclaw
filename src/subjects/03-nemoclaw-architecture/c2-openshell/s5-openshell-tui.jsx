import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, StepBlock, ReferenceList } from '../../../components/content';

export default function OpenShellTUI() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        The OpenShell TUI
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenShell includes a terminal user interface (TUI) that provides real-time
        visibility into sandbox activity. Accessed via the{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">openshell term</code> command,
        the TUI is your window into what the agent is doing, what it is being blocked
        from doing, and whether the sandbox is healthy. For operators who need to
        monitor autonomous agents, the TUI is an essential tool.
      </p>

      <DefinitionBlock
        term="openshell term"
        definition="The terminal-based monitoring interface for OpenShell sandboxes. It displays real-time information about sandbox health, network activity, blocked requests, filesystem access attempts, and the operator approval queue. It runs in any terminal emulator and uses a curses-based layout."
        example="openshell term --sandbox my-agent-sandbox"
        seeAlso={['Operator Approval', 'Network Allowlist', 'Sandbox Health']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Launching the TUI
      </h2>

      <CodeBlock
        title="Starting the TUI"
        language="bash"
        code={`# Open the TUI for the current/default sandbox
$ openshell term

# Open for a specific named sandbox
$ openshell term --sandbox my-project-sandbox

# Open with a specific view focused
$ openshell term --view=network

# Open in read-only mode (no approval actions)
$ openshell term --readonly`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        TUI Layout and Views
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The TUI is organized into several views that you can switch between using
        keyboard shortcuts. Each view focuses on a different aspect of sandbox
        monitoring:
      </p>

      <ComparisonTable
        title="TUI Views"
        headers={['View', 'Shortcut', 'Shows']}
        rows={[
          ['Overview', '1', 'Sandbox health summary, uptime, resource usage, policy status'],
          ['Network', '2', 'Real-time network activity log, blocked requests, allowlist status'],
          ['Filesystem', '3', 'Filesystem access attempts, Landlock denials, path access patterns'],
          ['Syscalls', '4', 'Seccomp filter activity, denied syscalls, kill events'],
          ['Approval Queue', '5', 'Pending operator approval requests for blocked actions'],
          ['Inference', '6', 'Inference request log, latency, token usage, provider status'],
        ]}
      />

      <CodeBlock
        title="TUI Overview screen (text representation)"
        language="bash"
        code={`┌─ OpenShell TUI ──────────────────────────────────────────────┐
│ Sandbox: my-project-sandbox          Status: RUNNING        │
│ Blueprint: v0.8.2 (verified)         Uptime: 1h 23m        │
├──────────────────────────────────────────────────────────────┤
│ SECURITY STATUS                                              │
│   Landlock:  Enforcing (12 rules)             [OK]          │
│   Seccomp:   Enforcing (58/342 allowed)       [OK]          │
│   Network:   Isolated (5 endpoints allowed)   [OK]          │
│   Inference:  Connected (142ms latency)        [OK]          │
├──────────────────────────────────────────────────────────────┤
│ ACTIVITY (last 5 minutes)                                    │
│   Network requests:   47 allowed, 3 blocked                 │
│   Filesystem ops:     1,284 allowed, 12 denied              │
│   Inference calls:    8 (avg 312ms, 4.2k tokens)            │
│   Seccomp denials:    0                                      │
├──────────────────────────────────────────────────────────────┤
│ APPROVAL QUEUE: 2 pending                                    │
│   [!] python3 wants to reach api.openai.com:443             │
│   [!] npm wants to reach registry.yarnpkg.com:443           │
├──────────────────────────────────────────────────────────────┤
│ [1]Overview [2]Network [3]FS [4]Syscalls [5]Queue [6]Infer  │
│ [a]Approve  [d]Deny    [r]Refresh       [q]Quit             │
└──────────────────────────────────────────────────────────────┘`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Monitoring Blocked Requests
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The Network view shows a real-time log of all network activity, with blocked
        requests highlighted. This is invaluable when an agent is not working as
        expected -- often the problem is a missing endpoint in the network allowlist.
      </p>

      <CodeBlock
        title="Network view detail"
        language="bash"
        code={`┌─ Network Activity ───────────────────────────────────────────┐
│ Filter: [all ▾]   Sort: [time ▾]   Auto-scroll: [on]       │
├──────────────────────────────────────────────────────────────┤
│ 14:23:01  ALLOW  python3    -> pypi.org:443          [pip]  │
│ 14:23:02  ALLOW  python3    -> files.pythonhosted.org:443   │
│ 14:23:08  ALLOW  git        -> github.com:443        [git]  │
│ 14:23:15  BLOCK  python3    -> api.openai.com:443    [!!!]  │
│ 14:23:22  ALLOW  python3    -> inference.local:443   [llm]  │
│ 14:23:30  BLOCK  curl       -> 203.0.113.50:8080    [!!!]  │
│ 14:23:45  ALLOW  python3    -> registry.npmjs.org:443       │
├──────────────────────────────────────────────────────────────┤
│ Totals: 47 allowed, 3 blocked (since sandbox start)         │
│ Press [Enter] on a blocked request to see details           │
└──────────────────────────────────────────────────────────────┘`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        The Operator Approval Queue
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When the agent attempts an action that is blocked by policy, the request can
        optionally be added to an approval queue instead of being silently dropped. The
        operator can then review the request in the TUI and decide whether to approve
        (temporarily allow) or deny it.
      </p>

      <StepBlock
        title="Approving a Blocked Request"
        steps={[
          {
            title: 'Navigate to the Approval Queue',
            content: 'Press [5] or navigate to the Approval Queue view. You will see a list of pending requests with details about what was blocked and why.',
          },
          {
            title: 'Review the request',
            content: 'Select a request with arrow keys and press [Enter] to see full details: the requesting process, the destination, the policy rule that blocked it, and the agent\'s stated reason (if available).',
          },
          {
            title: 'Approve or deny',
            content: 'Press [a] to approve (adds a temporary allowlist entry for this session) or [d] to deny (the request stays blocked). You can also press [p] to add the endpoint permanently to the policy file.',
          },
          {
            title: 'Agent retries automatically',
            content: 'If approved, the agent\'s next attempt to reach the endpoint will succeed. Most agents retry blocked requests automatically, so the approval takes effect without manual intervention.',
          },
        ]}
      />

      <CodeBlock
        title="Approval queue detail view"
        language="bash"
        code={`┌─ Approval Request Detail ────────────────────────────────────┐
│                                                              │
│ Request #1                        Status: PENDING            │
│                                                              │
│ Process:     python3 (pid 4832)                              │
│ Destination: api.openai.com:443                              │
│ Protocol:    HTTPS                                           │
│ Blocked by:  network.allowlist (no matching rule)            │
│ First seen:  14:23:15                                        │
│ Attempts:    3                                               │
│                                                              │
│ Agent context (if available):                                │
│   "Attempting to call OpenAI API for code completion"        │
│                                                              │
│ [a] Approve (session)  [p] Approve (permanent)  [d] Deny    │
│ [b] Back to queue                                            │
└──────────────────────────────────────────────────────────────┘`}
      />

      <NoteBlock type="tip" title="Session vs. Permanent Approval">
        A session approval lasts only until the sandbox is destroyed. It is useful for
        one-off needs. A permanent approval modifies the policy YAML file on disk,
        making the change persist across sandbox restarts. Use permanent approval when
        you know the endpoint will be needed regularly.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Keyboard Shortcuts
      </h2>

      <ComparisonTable
        title="TUI Keyboard Shortcuts"
        headers={['Key', 'Action']}
        rows={[
          ['1-6', 'Switch to numbered view'],
          ['Tab', 'Cycle through views'],
          ['Arrow keys', 'Navigate within a view'],
          ['Enter', 'Show detail for selected item'],
          ['a', 'Approve selected item in queue'],
          ['d', 'Deny selected item in queue'],
          ['p', 'Permanently approve (adds to policy file)'],
          ['r', 'Refresh current view'],
          ['/', 'Filter/search within current view'],
          ['f', 'Toggle auto-follow (auto-scroll to newest)'],
          ['q', 'Quit TUI'],
        ]}
      />

      <NoteBlock type="info" title="Running Alongside the Editor">
        The TUI runs in a separate terminal window alongside OpenClaw. A common setup
        is to have OpenClaw in one terminal (or GUI window) and{' '}
        <code>openshell term</code> in a side panel or second monitor. This gives you
        full visibility into sandbox activity while the agent works. For tmux or screen
        users, a vertical split works well.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Sandbox Status Monitoring
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The Overview screen continuously monitors sandbox health. If any security
        enforcement degrades (which should not happen under normal operation), the
        status indicator changes from OK to WARN or FAIL. The TUI can also be
        configured to send notifications (desktop notifications or webhook) when
        the status changes.
      </p>

      <CodeBlock
        title="Configuring TUI notifications"
        language="yaml"
        code={`# .nemoclaw/config.yaml
tui:
  notifications:
    # Desktop notification on status change
    desktop: true

    # Webhook on critical events
    webhook:
      url: "https://hooks.slack.com/services/T.../B.../xxx"
      events:
        - sandbox.status.degraded
        - sandbox.status.failed
        - approval.queue.new`}
      />

      <ReferenceList
        references={[
          {
            title: 'OpenShell TUI Guide',
            url: 'https://docs.nvidia.com/openshell/tui',
            type: 'docs',
            description: 'Complete guide to the OpenShell terminal user interface.',
          },
          {
            title: 'Operator Approval Workflow',
            url: 'https://docs.nvidia.com/nemoclaw/operator-approval',
            type: 'docs',
            description: 'How operator approval works for blocked agent actions.',
          },
        ]}
      />
    </div>
  );
}
