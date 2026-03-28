import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function InstallationGCP() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Installing NemoClaw on GCE
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With your GCE VM running and firewall rules configured, this section walks through the
        complete NemoClaw installation process on Google Cloud. The steps are largely the same as
        any Ubuntu 22.04 installation, with a few GCP-specific considerations around SSH access,
        metadata, and integration with Google Cloud services.
      </p>

      <StepBlock
        title="Complete Installation on GCE"
        steps={[
          {
            title: 'SSH into the instance',
            content: 'Use the gcloud CLI for the most secure connection:\n\ngcloud compute ssh nemoclaw-prod --zone=us-central1-a --tunnel-through-iap\n\nThe --tunnel-through-iap flag routes the connection through Identity-Aware Proxy, so no public SSH port is needed.',
          },
          {
            title: 'Update the system',
            content: 'Run a full system update:\n\nsudo apt update && sudo apt upgrade -y\n\nGCE Ubuntu images are generally up to date, but always run this on a fresh instance.',
          },
          {
            title: 'Install Node.js 20+',
            content: 'Install Node.js from the NodeSource repository:\n\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs git build-essential\n\nVerify:\nnode --version && npm --version',
          },
          {
            title: 'Install NemoClaw',
            content: 'Run the official install script:\n\ncurl -fsSL https://install.nemoclaw.dev | bash\n\nThis downloads and installs both the OpenClaw Gateway and the NemoClaw policy engine to ~/nemoclaw.',
          },
          {
            title: 'Run onboarding',
            content: 'Start the interactive onboarding wizard:\n\ncd ~/nemoclaw\nnpx nemoclaw onboard\n\nConfigure your LLM provider, platform integration (Slack/Discord), and default policy mode. For GCP deployments, you might want to store API keys in Secret Manager instead of .env files (covered below).',
          },
          {
            title: 'Configure as a systemd service',
            content: 'Create the service file for automatic startup:\n\nsudo tee /etc/systemd/system/nemoclaw.service > /dev/null << \'EOF\'\n[Unit]\nDescription=NemoClaw Agent Security Platform\nAfter=network-online.target\nWants=network-online.target\n\n[Service]\nType=simple\nUser=ubuntu\nWorkingDirectory=/home/ubuntu/nemoclaw\nEnvironmentFile=/home/ubuntu/nemoclaw/.env\nExecStart=/usr/bin/npx nemoclaw start\nRestart=on-failure\nRestartSec=10\nStandardOutput=journal\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target\nEOF\n\nsudo systemctl daemon-reload\nsudo systemctl enable nemoclaw\nsudo systemctl start nemoclaw',
          },
          {
            title: 'Verify the installation',
            content: 'Check that NemoClaw is running:\n\nsudo systemctl status nemoclaw\nnpx nemoclaw status\n\nBoth should show the service as active and all components as healthy.',
          },
          {
            title: 'Access the Control UI',
            content: 'From your local machine, forward the Control UI port through IAP:\n\ngcloud compute ssh nemoclaw-prod --zone=us-central1-a --tunnel-through-iap -- -L 18789:localhost:18789\n\nThen open http://localhost:18789 in your browser.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GCP-Specific: Secret Manager Integration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Rather than storing API keys in a .env file on disk, you can use Google Cloud Secret
        Manager for a more secure approach. This requires the NemoClaw service account to have
        the Secret Manager Secret Accessor role.
      </p>

      <CodeBlock
        language="bash"
        title="Store and Retrieve Secrets from Secret Manager"
        code={`# Create secrets
echo -n "sk-ant-your-anthropic-key" | \\
  gcloud secrets create nemoclaw-anthropic-key --data-file=-

echo -n "xoxb-your-slack-token" | \\
  gcloud secrets create nemoclaw-slack-token --data-file=-

# Grant access to the service account
gcloud secrets add-iam-policy-binding nemoclaw-anthropic-key \\
  --member="serviceAccount:nemoclaw-sa@YOUR_PROJECT.iam.gserviceaccount.com" \\
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding nemoclaw-slack-token \\
  --member="serviceAccount:nemoclaw-sa@YOUR_PROJECT.iam.gserviceaccount.com" \\
  --role="roles/secretmanager.secretAccessor"

# Retrieve secrets on the instance (for the .env file or startup script)
ANTHROPIC_KEY=$(gcloud secrets versions access latest \\
  --secret=nemoclaw-anthropic-key)
SLACK_TOKEN=$(gcloud secrets versions access latest \\
  --secret=nemoclaw-slack-token)

# Create .env from secrets
cat > ~/nemoclaw/.env << EOF
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
SLACK_BOT_TOKEN=$SLACK_TOKEN
NODE_ENV=production
EOF`}
      />

      <NoteBlock type="tip" title="Startup Script Approach">
        <p>
          You can use GCE startup scripts to automatically pull secrets from Secret Manager each
          time the instance boots. Add a metadata startup script that retrieves secrets and writes
          the .env file before NemoClaw starts. This ensures secrets are never persisted on disk
          longer than necessary.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GCP-Specific: Cloud Logging Integration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GCE instances can send logs to Cloud Logging (formerly Stackdriver) using the Ops Agent.
        This centralizes NemoClaw logs alongside other GCP resource logs, enabling advanced
        querying, alerting, and long-term retention.
      </p>

      <CodeBlock
        language="bash"
        title="Install the Ops Agent for Cloud Logging"
        code={`# Install the Google Cloud Ops Agent
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

# The agent automatically collects syslog and journald output.
# Since NemoClaw runs as a systemd service logging to journald,
# its logs will appear in Cloud Logging automatically.

# View logs in the console:
# Cloud Logging > Log Explorer > Resource: VM Instance

# Or via CLI:
gcloud logging read 'resource.type="gce_instance" AND resource.labels.instance_id="YOUR_INSTANCE_ID"' \\
  --limit=20 \\
  --format="table(timestamp,textPayload)"`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Troubleshooting GCP-Specific Issues
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Cannot SSH via IAP:</span> Ensure the firewall rule
          for 35.235.240.0/20 on port 22 exists and targets your instance's network tag. Also
          verify your user has the "IAP-secured Tunnel User" IAM role.
        </li>
        <li>
          <span className="font-semibold">Instance cannot reach external APIs:</span> If using a
          custom VPC without a public IP, ensure Cloud NAT is configured. Without NAT or a public
          IP, the instance has no outbound internet access.
        </li>
        <li>
          <span className="font-semibold">Permission denied on Secret Manager:</span> Verify
          the service account has the secretmanager.secretAccessor role for the specific secrets.
          Check with: <code>gcloud secrets get-iam-policy SECRET_NAME</code>.
        </li>
        <li>
          <span className="font-semibold">Slow disk performance:</span> If using pd-standard
          (HDD), switch to pd-balanced or pd-ssd. Performance scales with disk size on GCP --
          larger disks get more IOPS.
        </li>
      </ul>

      <WarningBlock title="GCE Metadata Server">
        <p>
          GCE instances can access instance metadata at <code>http://metadata.google.internal</code>.
          This endpoint exposes the service account token and other sensitive information. NemoClaw's
          policy engine should include rules to prevent agents from accessing this endpoint, as a
          compromised agent could use the metadata server to escalate privileges within your GCP
          project.
        </p>
      </WarningBlock>

      <ExerciseBlock
        question="What is the advantage of using GCP Secret Manager for NemoClaw API keys instead of a .env file?"
        options={[
          'Secret Manager is faster than reading .env files',
          'Secrets are encrypted at rest, access is audited, and keys are not stored as plaintext on the VM disk',
          'Secret Manager allows API keys to be shared across all GCP projects',
          '.env files are not supported on GCE instances',
        ]}
        correctIndex={1}
        explanation="Secret Manager encrypts secrets at rest and in transit, provides an audit log of every access, supports automatic rotation, and means API keys do not need to be stored as plaintext files on the VM. If the VM is compromised, the attacker only has access while the instance's service account token is valid."
      />

      <ReferenceList
        references={[
          {
            title: 'GCP Secret Manager',
            url: 'https://cloud.google.com/secret-manager/docs',
            type: 'docs',
            description: 'Store and manage sensitive data on Google Cloud.',
          },
          {
            title: 'Cloud Logging for Compute Engine',
            url: 'https://cloud.google.com/logging/docs/agent/logging',
            type: 'docs',
            description: 'Set up centralized logging for GCE instances.',
          },
        ]}
      />
    </div>
  )
}
