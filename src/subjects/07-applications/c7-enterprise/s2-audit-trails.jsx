import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function AuditTrails() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        An audit trail is the forensic record of everything an AI agent does. In enterprise
        deployments, this trail serves multiple purposes: compliance evidence for auditors,
        debugging data for engineers, security investigation material for incident responders,
        and behavioral analysis data for improving agent configurations. NemoClaw captures
        this trail at the sandbox boundary, making it comprehensive and tamper-proof.
      </p>

      <DefinitionBlock
        term="Audit Trail"
        definition="A chronological, immutable record of all observable agent actions including API calls, file operations, tool invocations, policy decisions, and session metadata. The trail is captured at the sandbox enforcement layer, meaning the agent cannot modify, suppress, or falsify its own audit records."
        example="An audit entry showing that at 14:23:01 UTC, agent 'reviewer' made a GET request to api.github.com/repos/acme/api/pulls/42/files, the request was allowed by policy rule 'github-read', and the response was 200 OK with 342ms latency."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        What Gets Logged
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's audit logging captures every action at multiple levels of detail. The base
        level (always on) captures the action type, target, and outcome. Extended logging adds
        request/response bodies and context.
      </p>

      <ComparisonTable
        title="Audit Log Levels"
        headers={['Level', 'What Is Captured', 'Storage Impact', 'Use Case']}
        rows={[
          ['Base', 'Action type, target, timestamp, outcome, policy rule', '~1KB/action', 'Compliance, access auditing'],
          ['Extended', 'Base + request headers, response status, duration', '~5KB/action', 'Security investigation'],
          ['Full', 'Extended + request/response bodies, file diffs', '~50KB/action', 'Forensic analysis, debugging'],
        ]}
      />

      <CodeBlock
        title="Audit log entry examples"
        language="json"
        code={`// Base level audit entry
{
  "timestamp": "2025-12-15T14:23:01.234Z",
  "agent": "reviewer",
  "session_id": "sess-abc123",
  "action": {
    "type": "network_request",
    "method": "GET",
    "url": "https://api.github.com/repos/acme-corp/backend-api/pulls/42/files",
    "outcome": "success",
    "status_code": 200,
    "duration_ms": 342
  },
  "policy": {
    "decision": "allow",
    "rule": "github-read",
    "rule_id": "net-allow-003"
  },
  "context": {
    "user_request": "Review PR #42",
    "step": "fetch_changed_files"
  }
}

// Full level audit entry (adds bodies)
{
  "timestamp": "2025-12-15T14:23:08.567Z",
  "agent": "reviewer",
  "session_id": "sess-abc123",
  "action": {
    "type": "network_request",
    "method": "POST",
    "url": "https://api.github.com/repos/acme-corp/backend-api/pulls/42/reviews",
    "outcome": "success",
    "status_code": 201,
    "duration_ms": 567,
    "request_body": {
      "event": "COMMENT",
      "body": "## AI Review Summary\\n...",
      "comments": [
        {
          "path": "src/handlers/order.go",
          "line": 45,
          "body": "[BUG] Error not returned..."
        }
      ]
    }
  },
  "policy": {
    "decision": "allow",
    "rule": "github-review-write",
    "rule_id": "net-allow-007"
  },
  "tokens": {
    "input": 4521,
    "output": 892,
    "cost_usd": 0.023
  }
}`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Where Logs Are Stored
      </h2>

      <CodeBlock
        title="Audit storage configuration"
        language="yaml"
        code={`# audit/config.yaml
audit:
  # Log level (base, extended, full)
  level: extended

  # Primary storage: local files (always enabled)
  local:
    path: /var/log/nemoclaw/audit/
    rotation:
      max_size: 500MB
      max_age: 90d
      compress: true
      compress_after: 7d
    format: jsonl  # One JSON object per line

  # Secondary storage: remote (for durability and compliance)
  remote:
    - type: s3
      bucket: acme-audit-logs
      region: us-east-1
      prefix: nemoclaw/
      encryption: AES256
      lifecycle:
        transition_to_glacier: 90d
        expire: 2555d  # 7 years for SOC 2

    - type: elasticsearch
      url: https://es.internal.acme.com:9200
      index_pattern: nemoclaw-audit-{date}
      retention: 365d  # 1 year in hot storage

  # Integrity protection
  integrity:
    # Hash chain: each entry includes hash of previous entry
    hash_chain: true
    algorithm: sha256
    # Sign daily log bundles for tamper detection
    daily_signing: true
    signing_key_env: AUDIT_SIGNING_KEY`}
      />

      <WarningBlock title="Audit Log Tamper Protection">
        <p>
          Audit logs are only useful if they are trustworthy. NemoClaw's hash chain ensures
          that any modification or deletion of log entries is detectable. The daily signing
          creates cryptographic proof that the log bundle has not been altered since creation.
          Store signing keys in a separate system (HSM or KMS) from the logs themselves.
        </p>
      </WarningBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Retention Policies
      </h2>

      <ComparisonTable
        title="Retention Requirements by Compliance Framework"
        headers={['Framework', 'Minimum Retention', 'Recommended Retention', 'Storage Tier']}
        rows={[
          ['SOC 2', '1 year', '3 years', 'Hot: 90d, Warm: 1y, Cold: 3y'],
          ['HIPAA', '6 years', '7 years', 'Hot: 90d, Warm: 1y, Cold: 7y'],
          ['GDPR', 'As needed + right to erasure', 'Minimize, with anonymization', 'Hot: 30d, then anonymize'],
          ['PCI DSS', '1 year', '1 year', 'Hot: 90d, Warm: 1y'],
          ['Internal audit', '90 days', '1 year', 'Hot: 30d, Warm: 90d, Archive: 1y'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Querying Audit Trails
      </h2>

      <CodeBlock
        title="Audit trail queries"
        language="bash"
        code={`# Find all actions by a specific agent in a time range
openclaw audit query \\
  --agent reviewer \\
  --from "2025-12-15T00:00:00Z" \\
  --to "2025-12-15T23:59:59Z" \\
  --format table

# Find all policy denials
openclaw audit query \\
  --filter "policy.decision=deny" \\
  --since 30d \\
  --format csv > denials-report.csv

# Find all write operations to GitHub
openclaw audit query \\
  --filter "action.method=POST AND action.url=*github*" \\
  --since 7d

# Reconstruct a complete session
openclaw audit session sess-abc123

# Output: Full chronological record of every action in the session
# 14:23:01 GET  api.github.com/.../pulls/42         -> 200 (342ms)
# 14:23:01 GET  api.github.com/.../pulls/42/files   -> 200 (287ms)
# 14:23:02 READ /workspace/src/handlers/order.go     (4.2KB)
# 14:23:03 READ /workspace/src/handlers/order_test.go (2.1KB)
# 14:23:05 TOOL git log --oneline -10               -> exit 0
# 14:23:08 POST api.github.com/.../pulls/42/reviews -> 201 (567ms)
# Session duration: 7.3s | Tokens: 5413 | Cost: $0.023

# Generate compliance report
openclaw audit report \\
  --period "2025-Q4" \\
  --format pdf \\
  --output audit-report-Q4-2025.pdf`}
      />

      <NoteBlock type="tip" title="Proactive Audit Reviews">
        <p>
          Do not wait for an audit to review your logs. Schedule monthly reviews of policy
          denials, unusual activity patterns, and permission changes. Proactive reviews catch
          configuration drift, unauthorized access attempts, and agent behavioral changes
          before they become compliance findings.
        </p>
      </NoteBlock>

      <StepBlock
        title="Setting Up Enterprise Audit Logging"
        steps={[
          {
            title: 'Choose your log level based on compliance requirements',
            content: 'Base level for general compliance, extended for security-sensitive deployments, full for forensic-capable environments.',
          },
          {
            title: 'Configure dual storage (local + remote)',
            content: 'Local logs provide fast access for debugging. Remote logs (S3, Elasticsearch) provide durability and long-term retention.',
          },
          {
            title: 'Enable integrity protection',
            content: 'Hash chains and daily signing ensure logs cannot be tampered with after creation.',
          },
          {
            title: 'Set up automated compliance reports',
            content: 'Schedule monthly reports that summarize agent activity, policy violations, and control effectiveness.',
            code: `# Cron job for monthly compliance report
0 0 1 * * openclaw audit report --period "last-month" --format pdf --email compliance@acme.com`,
            language: 'bash',
          },
        ]}
      />

      <ExerciseBlock
        question="An incident investigation requires you to determine exactly what data an agent accessed during a specific session two months ago. Your audit logging is set to 'base' level. Can you answer the question?"
        options={[
          'Yes, base level logs capture the complete request/response bodies',
          'Partially: you can see which API endpoints were called and which files were read, but not the actual data contents',
          'No, base level logs only capture action types without targets',
          'Yes, but only if the session was flagged as suspicious at the time',
        ]}
        correctIndex={1}
        explanation="Base level logging captures action types, target URLs/paths, timestamps, and outcomes. You can determine which API endpoints were called (e.g., GET /repos/acme/api/pulls/42/files) and which files were read, but not the actual response data or file contents. For forensic investigations requiring actual data contents, extended or full logging is needed."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Audit Logging Reference',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/audit-logging.md',
            type: 'docs',
            description: 'Complete configuration reference for audit trail setup.',
          },
          {
            title: 'NIST SP 800-92: Guide to Computer Security Log Management',
            url: 'https://csrc.nist.gov/publications/detail/sp/800-92/final',
            type: 'docs',
            description: 'NIST guidelines for security log management and retention.',
          },
        ]}
      />
    </div>
  )
}
