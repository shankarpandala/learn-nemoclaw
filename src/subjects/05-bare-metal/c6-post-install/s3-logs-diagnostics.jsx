import { CodeBlock, NoteBlock, StepBlock, WarningBlock, DefinitionBlock } from '../../../components/content'

export default function LogsDiagnostics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Logs and Diagnostics
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When a sandbox misbehaves, logs are your primary diagnostic tool. NemoClaw generates logs
        at multiple levels: the NemoClaw CLI itself, the Docker container, the OpenShell runtime,
        and the security policy engine. Understanding where each log lives and how to interpret
        its output is essential for effective troubleshooting.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Sandbox Logs
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw {'<name>'} logs</code> command
        is the primary way to view sandbox logs. It aggregates output from the container, OpenShell,
        and policy engine into a single stream.
      </p>

      <CodeBlock
        title="View sandbox logs"
        language="bash"
        code={`# View recent logs (last 100 lines by default)
nemoclaw my-sandbox logs

# View more lines
nemoclaw my-sandbox logs --lines 500

# Follow logs in real-time (like tail -f)
nemoclaw my-sandbox logs --follow

# Show timestamps
nemoclaw my-sandbox logs --timestamps

# Combine: follow with timestamps
nemoclaw my-sandbox logs --follow --timestamps

# Filter by component
nemoclaw my-sandbox logs --component openshell
nemoclaw my-sandbox logs --component policy
nemoclaw my-sandbox logs --component container`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Log Locations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw logs</code> command
        is the preferred interface, it is useful to know where logs are physically stored for
        advanced debugging.
      </p>

      <CodeBlock
        title="Log file locations"
        language="bash"
        code={`# NemoClaw CLI logs (on the host)
ls ~/.nemoclaw/logs/
# cli.log          - NemoClaw CLI operations
# onboard.log      - Onboarding process output

# Container logs (managed by Docker)
docker logs $(docker ps -q --filter "label=nemoclaw.name=my-sandbox")

# Logs inside the sandbox
nemoclaw my-sandbox exec -- ls /var/log/nemoclaw/
# openshell.log    - OpenShell runtime events
# policy.log       - Policy evaluation decisions
# audit.log        - Complete audit trail of all actions

# Docker daemon logs (system-level)
sudo journalctl -u docker --since "1 hour ago" | tail -50`}
      />

      <DefinitionBlock
        term="Audit Log"
        definition="A comprehensive, append-only log of every action taken inside a NemoClaw sandbox. Each entry records the timestamp, the command or operation attempted, the policy rule that was evaluated, and the result (allow/deny). The audit log cannot be modified or deleted from inside the sandbox, ensuring a tamper-resistant record of all agent activity."
        example="An audit log entry: '2026-03-27T14:22:05Z CMD cat /etc/passwd POLICY filesystem.read.allow RESULT ALLOW USER agent'"
        seeAlso={['Security Policy', 'OpenShell', 'Policy Violations']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Interpreting Log Output
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw logs use a structured format with severity levels and component tags. Understanding
        this format helps you quickly identify the source and severity of issues.
      </p>

      <CodeBlock
        title="Log format and examples"
        language="bash"
        code={`# Log format:
# TIMESTAMP [LEVEL] [COMPONENT] message

# INFO level - normal operations
# 2026-03-27T14:22:05Z [INFO] [openshell] Session opened: user=agent, remote=172.17.0.1
# 2026-03-27T14:22:06Z [INFO] [policy] Command evaluated: cmd="ls /home/agent", result=ALLOW

# WARN level - non-critical issues
# 2026-03-27T14:25:12Z [WARN] [container] Memory usage high: 3.6 GB / 4 GB (90%)
# 2026-03-27T14:26:00Z [WARN] [openshell] Session idle for 300s, sending keepalive

# ERROR level - failures requiring attention
# 2026-03-27T14:30:45Z [ERROR] [policy] Policy violation: cmd="sudo su", rule=command.deny.sudo
# 2026-03-27T14:31:00Z [ERROR] [openshell] Failed to execute command: exit code 137 (OOM killed)

# FATAL level - component failure
# 2026-03-27T14:35:00Z [FATAL] [openshell] OpenShell process crashed: signal 9
# 2026-03-27T14:35:01Z [FATAL] [container] Container exited unexpectedly: exit code 1`}
      />

      <NoteBlock type="info" title="Policy Violations Are Expected">
        <p>
          Seeing <code>[ERROR] [policy] Policy violation</code> in the logs is normal and expected.
          It means the policy is working correctly by blocking disallowed operations. These entries
          are errors from the agent's perspective (the command failed) but successes from the
          security perspective (the policy was enforced). Only be concerned if you see violations
          for commands that should be allowed, which indicates a policy misconfiguration.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Debug Mode
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When standard logs are insufficient, NemoClaw supports a debug mode that produces verbose
        output including internal state transitions, detailed policy evaluation traces, and
        low-level container events.
      </p>

      <CodeBlock
        title="Enable debug mode"
        language="bash"
        code={`# Run a command with debug logging
nemoclaw my-sandbox exec --debug -- ls /home/agent

# Debug output includes:
# [DEBUG] [cli] Resolving sandbox "my-sandbox"...
# [DEBUG] [cli] Container ID: abc123def456
# [DEBUG] [cli] Sending exec request to OpenShell at 172.17.0.2:8022
# [DEBUG] [openshell] Received command: "ls /home/agent"
# [DEBUG] [policy] Evaluating: type=filesystem.read, path=/home/agent
# [DEBUG] [policy] Rule match: filesystem.read.allow pattern="/home/agent/**"
# [DEBUG] [policy] Result: ALLOW
# [DEBUG] [openshell] Executing: /bin/ls /home/agent
# workspace
# [DEBUG] [openshell] Command exit code: 0

# Enable debug logging for an entire sandbox (persistent until disabled)
nemoclaw my-sandbox config set log_level debug

# Disable debug logging
nemoclaw my-sandbox config set log_level info`}
      />

      <WarningBlock title="Debug Mode Generates High Volume Logs">
        <p>
          Debug mode logs every internal operation, which can generate hundreds of megabytes of
          logs per hour under active use. Enable debug mode only for diagnosing specific issues,
          and disable it when done. Leaving debug mode enabled in production will fill disk space
          and degrade performance.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Generating a Diagnostic Bundle
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When you need to share diagnostic information with the NemoClaw team or community, the
        diagnostics command collects all relevant information into a single archive.
      </p>

      <StepBlock
        title="Generate and review a diagnostic bundle"
        steps={[
          {
            title: 'Generate the bundle',
            content: 'This collects system info, Docker state, sandbox logs, and configuration.',
            code: `nemoclaw diagnostics --output /tmp/nemoclaw-diag.tar.gz

# Output:
# Collecting system information...
# Collecting Docker configuration...
# Collecting sandbox logs (my-sandbox)...
# Collecting policy state...
# Collecting NemoClaw configuration...
#
# Diagnostic bundle saved to: /tmp/nemoclaw-diag.tar.gz
# Size: 2.4 MB`,
          },
          {
            title: 'Review what is included',
            content: 'Check the bundle contents before sharing.',
            code: `tar tzf /tmp/nemoclaw-diag.tar.gz
# nemoclaw-diag/system-info.txt
# nemoclaw-diag/docker-info.txt
# nemoclaw-diag/docker-daemon.json
# nemoclaw-diag/sandboxes/my-sandbox/status.txt
# nemoclaw-diag/sandboxes/my-sandbox/logs.txt
# nemoclaw-diag/sandboxes/my-sandbox/policy.yaml
# nemoclaw-diag/sandboxes/my-sandbox/config.yaml
# nemoclaw-diag/cli-config.yaml
# nemoclaw-diag/cli-logs.txt`,
          },
          {
            title: 'Verify no sensitive data is included',
            content: 'The diagnostics command excludes secrets by default, but verify.',
            code: `# The bundle excludes:
# - Environment variables containing "KEY", "SECRET", "TOKEN", "PASSWORD"
# - Files in /home/agent/workspace (your code)
# - Docker registry credentials
# Review the system-info.txt if concerned about host information`,
          },
        ]}
      />

      <NoteBlock type="tip" title="Log Rotation">
        <p>
          NemoClaw automatically rotates sandbox logs to prevent disk exhaustion. The default
          retention is 7 days or 100 MB per sandbox, whichever comes first. You can adjust
          these limits with <code>nemoclaw {'<name>'} config set log_retention_days 14</code> and
          <code>nemoclaw {'<name>'} config set log_max_size 200m</code>.
        </p>
      </NoteBlock>
    </div>
  )
}
