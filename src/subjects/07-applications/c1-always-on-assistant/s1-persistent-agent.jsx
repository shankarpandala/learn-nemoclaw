import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function PersistentAgent() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        One of the most compelling uses for NemoClaw is running an AI development assistant that operates continuously,
        ready to help with code reviews, answer questions, run tasks, and monitor your projects around the clock.
        Unlike a chat window you open and close, a persistent agent maintains context, stays connected to your
        tools, and can respond to events even while you sleep.
      </p>

      <DefinitionBlock
        term="Persistent Agent"
        definition="An AI agent running as a background service (daemon) that maintains long-lived sessions, preserves context across interactions, and can respond to triggers such as webhooks, scheduled events, or direct messages without manual startup."
        example="A NemoClaw agent running as a systemd service that monitors your GitHub repos, answers Telegram messages, and runs nightly code analysis."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Why Run a 24/7 Agent?
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A persistent agent fundamentally changes how you interact with AI tooling. Instead of context-switching
        to start a new session each time, the agent is always there, aware of your projects and preferences.
        It can handle asynchronous work: reviewing PRs that come in at 3 AM, running scheduled maintenance
        scripts, or alerting you when a deployment fails.
      </p>

      <ComparisonTable
        title="On-Demand vs. Persistent Agent"
        headers={['Aspect', 'On-Demand Sessions', 'Persistent Agent']}
        rows={[
          ['Startup time', 'Cold start each session', 'Always warm, instant response'],
          ['Context', 'Lost between sessions', 'Preserved across interactions'],
          ['Event handling', 'Manual trigger only', 'Webhooks, cron, message-driven'],
          ['Resource usage', 'Zero when idle', 'Small baseline footprint'],
          ['Use case', 'Ad-hoc questions', 'Continuous workflow integration'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        System Service Configuration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The recommended way to run a persistent NemoClaw agent on Linux is through a systemd service unit.
        This gives you automatic restarts on failure, logging integration with journald, and proper
        lifecycle management.
      </p>

      <StepBlock
        title="Setting Up the Systemd Service"
        steps={[
          {
            title: 'Create a dedicated system user',
            content: 'Run the agent under its own user account for security isolation. This user should have access to your workspace directories but nothing else.',
            code: `sudo useradd -r -m -d /opt/nemoclaw-agent -s /usr/sbin/nologin nemoclaw-agent
sudo mkdir -p /opt/nemoclaw-agent/workspace
sudo chown nemoclaw-agent:nemoclaw-agent /opt/nemoclaw-agent/workspace`,
            language: 'bash',
          },
          {
            title: 'Create the service unit file',
            content: 'Define the systemd service with appropriate restart policies and environment configuration.',
            code: `# /etc/systemd/system/nemoclaw-agent.service
[Unit]
Description=NemoClaw Persistent Dev Agent
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=nemoclaw-agent
Group=nemoclaw-agent
WorkingDirectory=/opt/nemoclaw-agent/workspace
ExecStart=/usr/local/bin/openclaw run \\
  --profile persistent \\
  --workspace /opt/nemoclaw-agent/workspace \\
  --policy /opt/nemoclaw-agent/policy.yaml \\
  --daemon
Restart=on-failure
RestartSec=10
StartLimitIntervalSec=300
StartLimitBurst=5

# Security hardening
NoNewPrivileges=yes
ProtectSystem=strict
ReadWritePaths=/opt/nemoclaw-agent/workspace
PrivateTmp=yes

# Environment
EnvironmentFile=/opt/nemoclaw-agent/.env

[Install]
WantedBy=multi-user.target`,
            language: 'bash',
          },
          {
            title: 'Configure environment variables',
            content: 'Set your API keys and configuration in the environment file. Never hardcode secrets in the service unit.',
            code: `# /opt/nemoclaw-agent/.env
ANTHROPIC_API_KEY=sk-ant-...
NEMOCLAW_WORKSPACE=/opt/nemoclaw-agent/workspace
NEMOCLAW_LOG_LEVEL=info
NEMOCLAW_MAX_SESSIONS=5
NEMOCLAW_IDLE_TIMEOUT=3600`,
            language: 'bash',
          },
          {
            title: 'Enable and start the service',
            content: 'Reload systemd, enable the service for boot persistence, and start it.',
            code: `sudo systemctl daemon-reload
sudo systemctl enable nemoclaw-agent.service
sudo systemctl start nemoclaw-agent.service
sudo systemctl status nemoclaw-agent.service`,
            language: 'bash',
          },
        ]}
      />

      <WarningBlock title="Protect Your API Keys">
        <p>
          The <code>.env</code> file contains sensitive credentials. Ensure it is readable only by the
          service user: <code>chmod 600 /opt/nemoclaw-agent/.env</code>. Consider using a secrets
          manager like HashiCorp Vault or AWS Secrets Manager for production deployments.
        </p>
      </WarningBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Monitoring Uptime
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A persistent agent is only useful if it stays up. You need visibility into whether the agent is
        running, how it is performing, and when issues arise. NemoClaw provides several monitoring hooks.
      </p>

      <CodeBlock
        title="Checking service status and logs"
        language="bash"
        code={`# Real-time log stream
sudo journalctl -u nemoclaw-agent -f

# Check if the agent is responsive
curl -s http://localhost:7320/health | jq .
# {
#   "status": "healthy",
#   "uptime_seconds": 86412,
#   "active_sessions": 2,
#   "memory_mb": 245,
#   "last_activity": "2025-12-15T03:22:11Z"
# }

# View service uptime and restart count
systemctl show nemoclaw-agent --property=ActiveEnterTimestamp,NRestarts`}
      />

      <NoteBlock type="tip" title="Health Check Integration">
        <p>
          Point your existing monitoring stack (Prometheus, Datadog, UptimeRobot) at the
          agent's <code>/health</code> endpoint. Set up alerts for when the agent goes
          unresponsive for more than 60 seconds. You can also expose custom metrics at
          the <code>/metrics</code> endpoint in Prometheus format.
        </p>
      </NoteBlock>

      <CodeBlock
        title="Prometheus-compatible monitoring configuration"
        language="yaml"
        code={`# prometheus.yml scrape config
scrape_configs:
  - job_name: 'nemoclaw-agent'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:7320']
    metrics_path: /metrics`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Automatic Recovery
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The systemd configuration above includes restart-on-failure with exponential backoff. But you
        should also consider what happens to in-flight work when the agent restarts. NemoClaw's workspace
        persistence means the agent can pick up where it left off after a restart, but active sessions
        will need to be re-established.
      </p>

      <CodeBlock
        title="Custom watchdog script for deeper health checks"
        language="bash"
        code={`#!/bin/bash
# /opt/nemoclaw-agent/watchdog.sh
# Run via cron every 5 minutes

HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:7320/health)

if [ "$HEALTH" != "200" ]; then
  echo "$(date): Agent unhealthy (HTTP $HEALTH), restarting..." >> /var/log/nemoclaw-watchdog.log
  sudo systemctl restart nemoclaw-agent.service
fi

# Check memory usage - restart if over 1GB
MEM=$(curl -s http://localhost:7320/health | jq '.memory_mb')
if [ "$MEM" -gt 1024 ] 2>/dev/null; then
  echo "$(date): Memory too high ($MEM MB), restarting..." >> /var/log/nemoclaw-watchdog.log
  sudo systemctl restart nemoclaw-agent.service
fi`}
      />

      <NoteBlock type="info" title="Graceful Shutdown">
        <p>
          NemoClaw handles SIGTERM gracefully by finishing active requests before shutting down.
          The systemd service sends SIGTERM first, then SIGKILL after a timeout (default 90 seconds).
          You can tune this with <code>TimeoutStopSec</code> in the service unit.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="What is the primary advantage of running a NemoClaw agent as a systemd service rather than in a tmux or screen session?"
        options={[
          'It runs faster because systemd is optimized for performance',
          'It provides automatic restart on failure, boot persistence, and integrated logging',
          'It allows multiple users to connect to the same agent simultaneously',
          'It reduces the agent\'s memory footprint by 50%',
        ]}
        correctIndex={1}
        explanation="Systemd provides process lifecycle management including automatic restarts, boot persistence via 'enable', and centralized logging through journald. While tmux keeps a process running, it lacks these operational features essential for production use."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Daemon Mode Documentation',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/daemon.md',
            type: 'docs',
            description: 'Official guide for running NemoClaw as a persistent background service.',
          },
          {
            title: 'systemd Service Management',
            url: 'https://www.freedesktop.org/software/systemd/man/systemd.service.html',
            type: 'docs',
            description: 'Complete reference for systemd service unit configuration.',
          },
          {
            title: 'OpenClaw GitHub Repository',
            url: 'https://github.com/openclaw-org/openclaw',
            type: 'github',
            description: 'Source code and issue tracker for the OpenClaw runtime.',
          },
        ]}
      />
    </div>
  )
}
