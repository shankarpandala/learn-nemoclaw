import { NoteBlock, CodeBlock, ComparisonTable } from '../../../components/content'

export default function AuditLogging() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Audit Logging
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Every network access decision in a NemoClaw sandbox is logged. Every blocked request,
        every operator approval, every denial, and every successful connection to a whitelisted
        endpoint generates an audit record. This comprehensive logging provides the foundation
        for compliance reporting, security incident investigation, and ongoing policy refinement.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What Gets Logged
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's audit system captures four categories of events:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Blocked requests:</span> Every connection attempt
          to a non-whitelisted endpoint. Includes the target domain, port, timestamp, and
          the process that initiated the request.
        </li>
        <li>
          <span className="font-semibold">Operator approvals:</span> When an operator approves
          a blocked request, the approval is logged with the operator's identity, the approved
          endpoint, and the timestamp.
        </li>
        <li>
          <span className="font-semibold">Operator denials:</span> Explicit denials are logged
          separately from automatic blocks, distinguishing between "never reviewed" and
          "reviewed and rejected."
        </li>
        <li>
          <span className="font-semibold">Policy changes:</span> Any modification to the
          active policy -- dynamic policy applications, policy resets, and preset additions --
          is logged as a policy change event.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Log Format
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Audit logs are written in structured JSON format, making them easy to parse, search,
        and feed into log aggregation systems. Each log entry contains a consistent set of
        fields.
      </p>

      <CodeBlock
        language="json"
        title="Example audit log entries"
        code={`{
  "timestamp": "2026-03-27T14:32:07.123Z",
  "event": "network.blocked",
  "sandbox": "my-sandbox",
  "session_id": "sess_abc123",
  "domain": "api.openai.com",
  "port": 443,
  "process": {
    "name": "curl",
    "pid": 4521,
    "parent": "bash"
  },
  "policy_state": "not_whitelisted"
}

{
  "timestamp": "2026-03-27T14:33:22.456Z",
  "event": "network.approved",
  "sandbox": "my-sandbox",
  "session_id": "sess_abc123",
  "domain": "pypi.org",
  "port": 443,
  "approved_by": "operator",
  "approval_type": "session",
  "previous_state": "blocked"
}

{
  "timestamp": "2026-03-27T14:32:15.789Z",
  "event": "network.denied",
  "sandbox": "my-sandbox",
  "session_id": "sess_abc123",
  "domain": "api.openai.com",
  "port": 443,
  "denied_by": "operator",
  "reason": "Not needed for current task"
}`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Where Logs Are Stored
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Audit logs are stored in multiple locations to ensure availability and durability:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Local filesystem:</span> Logs are written to the
          host filesystem at{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            nemoclaw-blueprint/logs/audit/
          </code>
          . Each session gets its own log file named with the session ID and date. These files
          are outside the sandbox, so the agent cannot tamper with them.
        </li>
        <li>
          <span className="font-semibold">OpenShell session history:</span> Logs are also
          available through the OpenShell API and can be queried for the current or past
          sessions.
        </li>
        <li>
          <span className="font-semibold">External log forwarding:</span> NemoClaw supports
          forwarding audit logs to external systems via standard log shipping mechanisms.
          You can route logs to your SIEM, ELK stack, Datadog, or any other log aggregation
          platform.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Viewing and querying audit logs"
        code={`# View audit logs for the current session
openshell logs audit

# View logs for a specific session
openshell logs audit --session sess_abc123

# Filter by event type
openshell logs audit --filter event=network.blocked

# Filter by domain
openshell logs audit --filter domain=api.openai.com

# Export logs as JSON for external analysis
openshell logs audit --format json > audit-export.json

# View summary statistics
openshell logs audit --summary
# Output:
# Session sess_abc123 (2h 15m):
#   Total network events: 147
#   Blocked requests: 12
#   Operator approvals: 5
#   Operator denials: 2
#   Policy changes: 1`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Using Logs for Compliance
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For organizations with compliance requirements (SOC 2, ISO 27001, HIPAA, etc.),
        NemoClaw's audit logs provide evidence that autonomous agents are operating under
        controlled, monitored conditions. The logs demonstrate:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Access control:</span> All network access is
          governed by explicit policy. Unauthorized access attempts are blocked and logged.
        </li>
        <li>
          <span className="font-semibold">Operator oversight:</span> Human operators review
          and approve access exceptions. Every approval is attributed to a specific operator.
        </li>
        <li>
          <span className="font-semibold">Least privilege:</span> The deny-by-default policy
          and the audit trail together demonstrate that agents have only the minimum required
          access.
        </li>
        <li>
          <span className="font-semibold">Incident traceability:</span> If a security incident
          occurs, the audit trail provides a complete record of what the agent accessed, when,
          and who approved it.
        </li>
      </ul>

      <NoteBlock type="info" title="Log Retention">
        <p>
          By default, NemoClaw retains local audit logs for 90 days. This can be configured
          in the blueprint settings. For compliance purposes, you should forward logs to a
          long-term storage system with retention policies that meet your organization's
          requirements. Logs stored on the local filesystem are subject to the host's disk
          space constraints.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Post-Incident Review
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When investigating a security incident involving an agent, the audit logs are your
        primary forensic tool. They allow you to reconstruct the agent's network activity
        timeline:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>What endpoints did the agent attempt to reach?</li>
        <li>Which requests were blocked and which were allowed?</li>
        <li>Were any unusual endpoints approved during the session?</li>
        <li>When did suspicious activity begin relative to the agent's task timeline?</li>
        <li>What process inside the sandbox initiated suspicious requests?</li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This information is invaluable for determining the scope and impact of an incident,
        identifying root causes, and improving policies to prevent recurrence.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Using Logs for Policy Refinement
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond security and compliance, audit logs are a practical tool for refining your
        network policy over time. By analyzing patterns in blocked requests and approvals,
        you can identify:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Endpoints that are repeatedly approved and should be added to the baseline.</li>
        <li>Endpoints in the baseline that are never used and could be removed.</li>
        <li>Unexpected access patterns that may indicate agent misconfiguration.</li>
        <li>Time-based patterns that could inform more granular access scheduling.</li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next chapter, we will move to custom policies -- creating your own policy
        presets, writing comprehensive YAML schemas, and establishing testing and best
        practice workflows for policy management.
      </p>
    </div>
  )
}
