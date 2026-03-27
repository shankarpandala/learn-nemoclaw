import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function InstallationAWS() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Installing NemoClaw on EC2
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With your EC2 instance launched and security configured, it is time to install NemoClaw.
        This section provides a complete step-by-step walkthrough covering system preparation,
        the NemoClaw install script, onboarding configuration, and verification. The entire
        process takes approximately 10-15 minutes on a fresh Ubuntu 22.04 instance.
      </p>

      <NoteBlock type="info" title="Prerequisites">
        <p>
          You should have a running EC2 instance (t3.xlarge or larger) with Ubuntu 22.04, SSH
          access configured, and 30 GB or more of gp3 storage. You will also need your Anthropic
          API key (or other LLM provider credentials) and your Slack or Discord bot tokens ready.
        </p>
      </NoteBlock>

      <StepBlock
        title="Full Installation Walkthrough"
        steps={[
          {
            title: 'SSH into your instance',
            content: 'Connect to your EC2 instance using: ssh -i nemoclaw-key.pem ubuntu@<public-ip>. If you configured SSH in ~/.ssh/config, simply run: ssh nemoclaw.',
          },
          {
            title: 'Update the system',
            content: 'Run a full system update to ensure all packages are current. This is critical on a fresh instance where security patches may be pending.\n\nsudo apt update && sudo apt upgrade -y',
          },
          {
            title: 'Install system dependencies',
            content: 'NemoClaw requires Node.js 20+, git, and a few system libraries. Install them with:\n\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs git build-essential',
          },
          {
            title: 'Verify Node.js installation',
            content: 'Confirm the correct versions are installed:\n\nnode --version    # Should show v20.x or later\nnpm --version     # Should show 10.x or later',
          },
          {
            title: 'Run the NemoClaw install script',
            content: 'NemoClaw provides a single install script that downloads and sets up both the OpenClaw Gateway and the NemoClaw policy engine:\n\ncurl -fsSL https://install.nemoclaw.dev | bash\n\nThe script installs to ~/nemoclaw by default. It downloads the Gateway, the policy engine binary, and all Node.js dependencies.',
          },
          {
            title: 'Run the onboarding wizard',
            content: 'After installation completes, start the onboarding process:\n\ncd ~/nemoclaw\nnpx nemoclaw onboard\n\nThe wizard prompts you for:\n- LLM provider selection (Anthropic recommended)\n- API key\n- Platform integration (Slack, Discord, or CLI-only)\n- Platform tokens/credentials\n- Default policy mode (audit or enforce)',
          },
          {
            title: 'Configure environment variables',
            content: 'The onboarding wizard creates a .env file. Verify its contents:\n\ncat ~/nemoclaw/.env\n\nEnsure ANTHROPIC_API_KEY, SLACK_BOT_TOKEN (if using Slack), and other credentials are set correctly. These should be the only place credentials are stored.',
          },
          {
            title: 'Start NemoClaw',
            content: 'Launch NemoClaw with:\n\ncd ~/nemoclaw\nnpx nemoclaw start\n\nYou should see log output indicating the Gateway is starting, the policy engine is loading rules, and platform connections are being established.',
          },
          {
            title: 'Verify the deployment',
            content: 'Check that all components are running:\n\nnpx nemoclaw status\n\nThis should report the Gateway as "running", the policy engine as "active", and any platform integrations as "connected".',
          },
          {
            title: 'Access the Control UI',
            content: 'From your local machine, set up an SSH tunnel:\n\nssh -L 18789:localhost:18789 -i nemoclaw-key.pem ubuntu@<public-ip>\n\nThen open http://localhost:18789 in your browser to access the NemoClaw Control UI.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Setting Up as a Systemd Service
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For production deployments, NemoClaw should run as a systemd service so it starts
        automatically on boot and restarts on failure. Create a service file:
      </p>

      <CodeBlock
        language="bash"
        title="Create systemd service"
        code={`sudo cat > /etc/systemd/system/nemoclaw.service << 'EOF'
[Unit]
Description=NemoClaw Agent Security Platform
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/nemoclaw
ExecStart=/usr/bin/npx nemoclaw start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd, enable, and start
sudo systemctl daemon-reload
sudo systemctl enable nemoclaw
sudo systemctl start nemoclaw

# Check status
sudo systemctl status nemoclaw

# View logs
sudo journalctl -u nemoclaw -f`}
      />

      <WarningBlock title="Environment Variables with Systemd">
        <p>
          Systemd services do not automatically load <code>.env</code> files. You have two options:
          add each variable as an <code>Environment=</code> line in the service file, or use
          <code>EnvironmentFile=/home/ubuntu/nemoclaw/.env</code> in the <code>[Service]</code>
          section. The EnvironmentFile approach is recommended because it keeps credentials out
          of systemd unit files, which are readable by any user on the system.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Verifying Everything Works
      </h2>

      <CodeBlock
        language="bash"
        title="Post-Installation Verification"
        code={`# Check NemoClaw processes
ps aux | grep nemoclaw

# Verify the policy engine is loaded
npx nemoclaw policy status

# Test a policy evaluation (dry run)
npx nemoclaw policy test --action "shell.execute" --command "rm -rf /"
# Expected: DENIED by default safety policy

# Check platform connectivity
npx nemoclaw status --verbose

# Send a test message via Slack/Discord and verify
# the agent responds and policies are evaluated`}
      />

      <NoteBlock type="tip" title="Troubleshooting">
        <p>
          If NemoClaw fails to start, check the following common issues: (1) Node.js version too
          old -- verify with <code>node --version</code>, must be 20+. (2) Missing API key --
          check <code>.env</code> file. (3) Slack token invalid -- regenerate in the Slack API
          dashboard. (4) Port conflict -- ensure nothing else is using port 18789. Check logs
          with <code>journalctl -u nemoclaw --no-pager -n 50</code> for specific error messages.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="After installing NemoClaw on EC2, what is the recommended way to run it in production?"
        options={[
          'Run npx nemoclaw start in a tmux session',
          'Use nohup to run it in the background',
          'Configure it as a systemd service with auto-restart',
          'Run it in a Docker container with --restart=always',
        ]}
        correctIndex={2}
        explanation="A systemd service is the recommended approach for production. It ensures NemoClaw starts on boot, automatically restarts on failure, integrates with the system journal for logging, and provides standard management commands (start, stop, status). Tmux and nohup are fragile alternatives that do not survive reboots."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Installation Guide',
            url: 'https://docs.nemoclaw.dev/installation',
            type: 'docs',
            description: 'Official NemoClaw installation documentation with platform-specific instructions.',
          },
          {
            title: 'Systemd Service Files',
            url: 'https://www.freedesktop.org/software/systemd/man/systemd.service.html',
            type: 'docs',
            description: 'Complete reference for systemd service unit file options.',
          },
        ]}
      />
    </div>
  )
}
