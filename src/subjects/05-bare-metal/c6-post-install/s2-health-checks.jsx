import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock, ExerciseBlock } from '../../../components/content'

export default function HealthChecks() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Health Checks and Status Monitoring
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Monitoring the health of your NemoClaw sandboxes is essential for reliable operation. A
        sandbox consists of multiple components -- the Docker container, the OpenShell runtime,
        the security policy engine, the network stack, and the filesystem layer. Each component
        can independently succeed or fail. NemoClaw provides several commands for checking sandbox
        health at different levels of detail.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Quick Health Check
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The fastest way to check if a sandbox is healthy is the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">health</code> command.
        It returns a single word: healthy, degraded, or unhealthy.
      </p>

      <CodeBlock
        title="Quick health check"
        language="bash"
        code={`# Single sandbox health
nemoclaw my-sandbox health
# healthy

# Health check with exit code (useful for scripting)
nemoclaw my-sandbox health --quiet
echo $?
# 0 = healthy, 1 = degraded, 2 = unhealthy

# Check all sandboxes
nemoclaw list --health
# NAME              STATUS    HEALTH      UPTIME
# my-sandbox        running   healthy     2h 15m
# test-sandbox      running   degraded    45m
# old-sandbox       stopped   --          --`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Detailed Status
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">status</code> command
        provides a detailed breakdown of every sandbox component.
      </p>

      <CodeBlock
        title="Detailed status output"
        language="bash"
        code={`nemoclaw my-sandbox status

# Sandbox: my-sandbox
# Status:  running
# Health:  healthy
# Uptime:  2h 15m 32s
# Created: 2026-03-27 10:30:00 UTC
#
# Components:
#   Container    running    Docker: abc123def456
#   OpenShell    healthy    PID: 1842, port: 8022, sessions: 0
#   Policy       applied    default (12 rules, 0 violations last hour)
#   Network      up         172.17.0.2, bridge, egress: filtered
#   Filesystem   ok         overlay2, 342 MB writable, 5.8 GB total
#   Landlock     active     ABI v3, 8 filesystem rules, 2 network rules
#
# Resources:
#   CPU:         2/2 cores, 1.2% current, 3.4% avg (1h)
#   Memory:      412 MB / 4 GB (10.3%), peak: 1.1 GB
#   Disk:        342 MB writable / 10 GB limit
#   Network I/O: 12 MB in, 4 MB out (lifetime)
#   Processes:   8 running`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Understanding Health States
      </h2>

      <ComparisonTable
        title="Sandbox Health States"
        headers={['State', 'Meaning', 'Action Required']}
        rows={[
          ['healthy', 'All components running normally', 'None'],
          ['degraded', 'Running but one or more components have warnings', 'Investigate; may self-resolve'],
          ['unhealthy', 'One or more critical components have failed', 'Immediate attention required'],
          ['starting', 'Sandbox is in the process of starting up', 'Wait 30-60 seconds'],
          ['stopped', 'Sandbox is intentionally stopped', 'Start with: nemoclaw <name> start'],
          ['error', 'Sandbox failed to start or crashed', 'Check logs; may need recreation'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        OpenShell Health
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenShell is the most critical component for agent operations. If OpenShell is unhealthy,
        agents cannot connect or execute commands. You can check OpenShell specifically.
      </p>

      <CodeBlock
        title="Check OpenShell health"
        language="bash"
        code={`# Check OpenShell from outside the sandbox
nemoclaw my-sandbox exec -- openshell status

# Expected output:
# OpenShell v3.2.1
# Status: running
# PID: 1842
# Listening: 0.0.0.0:8022
# Active sessions: 0
# Policy loaded: yes (default, 12 rules)
# Uptime: 2h 15m 32s
# Commands processed: 847
# Policy violations: 3

# Check OpenShell's internal health endpoint
nemoclaw my-sandbox exec -- curl -s http://localhost:8023/health
# {"status":"healthy","version":"3.2.1","policy":"loaded","sessions":0}`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Verifying Policy Application
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A sandbox can be running but have its security policy incorrectly applied or missing. This
        is a dangerous state because the agent would operate without restrictions. Always verify
        that the policy is active.
      </p>

      <CodeBlock
        title="Verify security policy"
        language="bash"
        code={`# Check policy status from outside
nemoclaw my-sandbox policy show
# Displays the full active policy

nemoclaw my-sandbox policy verify
# Runs a verification check:
# [OK] Policy file exists: /etc/nemoclaw/policy.yaml
# [OK] Policy loaded by OpenShell: 12 rules
# [OK] Landlock restrictions active: 8 filesystem, 2 network
# [OK] Policy hash matches expected: sha256:abc123...

# Test policy enforcement with a probe command
nemoclaw my-sandbox exec -- cat /etc/shadow
# Should return: Permission denied (policy: filesystem.read.deny)
# If this succeeds, the policy is NOT working!`}
      />

      <WarningBlock title="Always Verify Policy After Changes">
        <p>
          After modifying a sandbox's security policy, always run <code>nemoclaw {'<name>'} policy verify</code> to
          confirm the new policy was loaded correctly. A syntax error in the policy file can cause
          OpenShell to fall back to a permissive mode, which defeats the purpose of sandboxing.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Automated Health Monitoring
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For production deployments, you may want to monitor sandbox health continuously. NemoClaw
        provides a watch mode and also supports integration with standard monitoring tools.
      </p>

      <CodeBlock
        title="Continuous health monitoring"
        language="bash"
        code={`# Watch sandbox status in real-time (refreshes every 5 seconds)
nemoclaw my-sandbox status --watch

# Check all sandboxes in a loop (for cron or monitoring scripts)
nemoclaw list --health --format json | jq '.[] | select(.health != "healthy")'

# Example monitoring script
#!/usr/bin/env bash
SANDBOXES=$(nemoclaw list --format json | jq -r '.[].name')
for sb in $SANDBOXES; do
  HEALTH=$(nemoclaw "$sb" health --quiet; echo $?)
  if [ "$HEALTH" != "0" ]; then
    echo "ALERT: Sandbox $sb is not healthy (exit code: $HEALTH)"
    nemoclaw "$sb" status
  fi
done`}
      />

      <NoteBlock type="tip" title="JSON Output for Automation">
        <p>
          Most NemoClaw commands support <code>--format json</code> for machine-readable output.
          This makes it easy to integrate NemoClaw health checks with monitoring systems like
          Prometheus, Datadog, or simple cron-based alerting scripts.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="A sandbox shows status 'running' but health 'degraded'. What should you do first?"
        options={[
          'Immediately destroy and recreate the sandbox',
          'Run `nemoclaw <name> status` to identify which component has a warning',
          'Ignore it -- degraded means everything is fine',
          'Run `nemoclaw <name> stop` to prevent further issues',
        ]}
        correctIndex={1}
        explanation="A 'degraded' state means the sandbox is running but one or more components have warnings. The first step is to check the detailed status to identify which component is degraded. Many degraded states self-resolve (e.g., temporary high memory usage). Destroying or stopping the sandbox is premature without first understanding the issue."
      />
    </div>
  )
}
