import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function MonitoringLogging() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Trusting an AI agent without monitoring is like driving without a dashboard. You need real-time
        visibility into what the agent is doing: every network request it makes, every file it touches,
        every tool it invokes. NemoClaw provides comprehensive logging at the sandbox level, capturing
        all agent actions regardless of whether the agent itself reports them.
      </p>

      <DefinitionBlock
        term="Agent Action Logging"
        definition="The practice of recording every observable action taken by an AI agent, including network requests, file system operations, tool invocations, and policy decisions. Logs are captured at the sandbox boundary, making them tamper-proof -- the agent cannot modify or suppress its own audit trail."
        example="A log entry showing the agent made a POST request to api.github.com to create a PR review, including the full request body, response status, and the policy rule that allowed it."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        What Gets Logged
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's logging system captures three categories of agent activity. Each category provides
        a different lens for understanding agent behavior.
      </p>

      <ComparisonTable
        title="Log Categories"
        headers={['Category', 'What Is Captured', 'Volume', 'Primary Use']}
        rows={[
          ['Network', 'All HTTP/S requests: URL, method, headers, body, response status', 'High', 'API usage audit, policy compliance'],
          ['Filesystem', 'All file reads, writes, deletes, permission changes', 'Medium', 'Code modification tracking, data access audit'],
          ['Tools', 'Every tool invocation: command, arguments, output, exit code', 'Medium', 'Behavior analysis, debugging agent issues'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Configuring Logging
      </h2>

      <CodeBlock
        title="Comprehensive logging configuration"
        language="yaml"
        code={`# logging.yaml
logging:
  # Global settings
  level: info  # debug, info, warn, error
  format: json  # json or text
  output:
    - type: file
      path: /var/log/nemoclaw/agent.log
      rotation:
        max_size: 100MB
        max_age: 30d
        compress: true
    - type: stdout
      level: warn  # Only warnings and errors to stdout

  # Network request logging
  network:
    enabled: true
    log_request_body: true
    log_response_body: false  # Can be very large
    log_response_status: true
    log_headers: true
    redact_headers:
      - Authorization
      - X-API-Key
      - Cookie
    max_body_size: 10KB  # Truncate bodies larger than this

  # Filesystem operation logging
  filesystem:
    enabled: true
    log_reads: true
    log_writes: true
    log_content_diff: true  # Log what changed in files
    exclude_paths:
      - "*.log"
      - ".git/objects/**"

  # Tool invocation logging
  tools:
    enabled: true
    log_command: true
    log_output: true
    max_output_size: 5KB
    redact_patterns:
      - "sk-ant-[a-zA-Z0-9]+"
      - "ghp_[a-zA-Z0-9]+"

  # Policy decision logging
  policy:
    enabled: true
    log_allows: false  # Only log denials by default
    log_denials: true
    include_rule: true  # Which policy rule matched`}
      />

      <WarningBlock title="Sensitive Data in Logs">
        <p>
          Agent logs can contain sensitive information: API keys in headers, credentials in command
          output, PII in file contents. Always configure redaction patterns and treat log files
          with the same security controls as your secrets. Restrict log file permissions to the
          service user and operations team.
        </p>
      </WarningBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Real-Time Monitoring
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Logs are useful for post-hoc analysis, but you also need real-time visibility while the agent
        is operating. NemoClaw provides a live monitoring interface and integrations with common
        observability platforms.
      </p>

      <CodeBlock
        title="Live agent monitoring"
        language="bash"
        code={`# Stream agent actions in real time
openclaw monitor live --workspace /opt/nemoclaw-agent/workspace

# Output (real-time):
# 14:23:01 [NET] GET api.github.com/repos/acme/api/pulls/42/files -> 200 (342ms)
# 14:23:02 [FS]  READ /workspace/src/handlers/order.go (4.2KB)
# 14:23:03 [FS]  READ /workspace/src/handlers/order_test.go (2.1KB)
# 14:23:05 [TOOL] bash: go vet ./src/handlers/ -> exit 0 (1.2s)
# 14:23:08 [NET] POST api.github.com/repos/acme/api/pulls/42/reviews -> 201 (567ms)
# 14:23:08 [POLICY] ALLOW: rule "github-write" matched POST api.github.com

# Filter by category
openclaw monitor live --filter network --filter policy

# Alert on specific patterns
openclaw monitor live --alert-on "POLICY.*DENY" --alert-cmd "notify-send 'Policy Violation'""`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Log Analysis
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Raw logs become valuable when you analyze them for patterns. Regular log analysis helps you
        tune policies, identify behavioral drift, and catch issues before they become problems.
      </p>

      <CodeBlock
        title="Log analysis queries"
        language="bash"
        code={`# Daily action summary
openclaw logs summary --since 24h

# Output:
# === Agent Activity Summary (last 24h) ===
# Total actions: 234
# Network requests: 156 (67%)
#   GET:  112 (72%)
#   POST:  38 (24%)
#   PATCH:  6 (4%)
# File operations: 54 (23%)
#   Reads:  45 (83%)
#   Writes:  9 (17%)
# Tool invocations: 24 (10%)
# Policy denials: 2
# Errors: 3 (all 429 rate limits from GitHub)

# Find all file modifications
openclaw logs query --filter 'category=filesystem AND action=write' --since 7d

# Find policy denials
openclaw logs query --filter 'category=policy AND decision=deny' --since 24h

# Find slow API calls
openclaw logs query --filter 'category=network AND duration_ms>1000' --since 24h

# Export for external analysis
openclaw logs export --format csv --since 30d --output agent-logs.csv`}
      />

      <NoteBlock type="tip" title="Weekly Log Review Ritual">
        <p>
          Set up a weekly ritual of reviewing agent logs. Look for: policy denials (do they indicate
          a gap in permissions or an agent misbehavior?), error patterns (is the agent retrying
          failed requests excessively?), and behavioral drift (is the agent doing different things
          this week compared to last?).
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Integration with Observability Platforms
      </h2>

      <CodeBlock
        title="Forwarding logs to external platforms"
        language="yaml"
        code={`# logging.yaml -- external integrations
logging:
  output:
    # Local file (always keep a local copy)
    - type: file
      path: /var/log/nemoclaw/agent.log

    # Forward to Datadog
    - type: datadog
      api_key_env: DD_API_KEY
      service: nemoclaw-agent
      tags:
        - env:staging
        - team:platform

    # Forward to Elasticsearch
    - type: elasticsearch
      url: https://es.internal.acme.com:9200
      index: nemoclaw-logs
      auth_env: ES_AUTH_TOKEN

    # Forward to syslog
    - type: syslog
      address: syslog.internal.acme.com:514
      facility: local0`}
      />

      <StepBlock
        title="Setting Up a Monitoring Dashboard"
        steps={[
          {
            title: 'Define key metrics',
            content: 'Track actions per hour, policy denial rate, error rate, average API latency, and file modification count.',
          },
          {
            title: 'Create alert thresholds',
            content: 'Set alerts for anomalies: sudden spike in actions, any policy denial, error rate above 5%, or agent becoming unresponsive.',
            code: `# alerts.yaml
alerts:
  - name: policy-denial
    condition: "count(policy.deny) > 0 in 5m"
    severity: critical
    notify: [security@acme.com]

  - name: high-error-rate
    condition: "rate(errors) > 0.05 in 15m"
    severity: warning
    notify: [platform@acme.com]

  - name: agent-unresponsive
    condition: "count(actions) == 0 in 10m during business_hours"
    severity: warning
    notify: [platform@acme.com]`,
            language: 'yaml',
          },
          {
            title: 'Set up log retention',
            content: 'Configure how long logs are kept based on compliance requirements and storage budget.',
          },
        ]}
      />

      <ExerciseBlock
        question="You notice the agent's logs show 15 policy denials in the last hour, all for the same API endpoint. What is the most likely cause and correct response?"
        options={[
          'The agent is being attacked -- shut it down immediately',
          'The agent legitimately needs access to that endpoint -- update the policy immediately',
          'Investigate the denials first to determine if the requests are legitimate, then decide whether to update the policy or adjust the agent behavior',
          'Ignore it since the policy correctly blocked the requests',
        ]}
        correctIndex={2}
        explanation="Policy denials should always be investigated before taking action. Repeated denials to the same endpoint could indicate a legitimate need (requiring a policy update), a misconfigured agent (requiring a behavior fix), or an attempt to access something it should not (requiring monitoring escalation). Never update policy without understanding the cause."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Logging Reference',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/logging.md',
            type: 'docs',
            description: 'Complete configuration reference for all logging options.',
          },
          {
            title: 'Agent Observability Patterns',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/observability.md',
            type: 'docs',
            description: 'Best practices for monitoring AI agent behavior in production.',
          },
        ]}
      />
    </div>
  )
}
