import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function InstallationAzure() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Installing NemoClaw on Azure VM
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This section provides a complete walkthrough for installing and configuring NemoClaw on
        an Azure Virtual Machine. The installation process is similar to other Ubuntu-based cloud
        deployments, with Azure-specific considerations for networking, identity, and monitoring
        integration.
      </p>

      <StepBlock
        title="Full Installation Walkthrough"
        steps={[
          {
            title: 'SSH into the VM',
            content: 'Connect using the SSH key created during VM provisioning:\n\nssh -i ~/.ssh/nemoclaw-key.pem azureuser@<public-ip>\n\nOr use the Azure CLI:\naz ssh vm --resource-group nemoclaw-rg --name nemoclaw-prod',
          },
          {
            title: 'Update the system',
            content: 'sudo apt update && sudo apt upgrade -y\n\nAzure Ubuntu images receive regular updates, but always run this on a fresh instance to ensure all security patches are applied.',
          },
          {
            title: 'Install Node.js and dependencies',
            content: 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs git build-essential\n\nVerify:\nnode --version    # v20.x+\nnpm --version     # 10.x+',
          },
          {
            title: 'Install NemoClaw',
            content: 'curl -fsSL https://install.nemoclaw.dev | bash\n\nThe installer downloads the Gateway and policy engine to ~/nemoclaw. On Azure VMs with Premium SSD, the installation completes in 2-3 minutes.',
          },
          {
            title: 'Configure secrets (Key Vault approach)',
            content: 'If using Azure Key Vault (recommended), retrieve secrets and create the .env file:\n\nANTHROPIC_KEY=$(az keyvault secret show --vault-name nemoclaw-vault --name anthropic-api-key --query value -o tsv)\nSLACK_TOKEN=$(az keyvault secret show --vault-name nemoclaw-vault --name slack-bot-token --query value -o tsv)\n\ncat > ~/nemoclaw/.env << EOF\nANTHROPIC_API_KEY=$ANTHROPIC_KEY\nSLACK_BOT_TOKEN=$SLACK_TOKEN\nNODE_ENV=production\nEOF\n\nAlternatively, run the onboarding wizard:\ncd ~/nemoclaw && npx nemoclaw onboard',
          },
          {
            title: 'Run onboarding (if not using Key Vault)',
            content: 'cd ~/nemoclaw\nnpx nemoclaw onboard\n\nFollow the prompts to configure your LLM provider, platform integration, and default policy mode.',
          },
          {
            title: 'Create systemd service',
            content: 'sudo tee /etc/systemd/system/nemoclaw.service > /dev/null << \'EOF\'\n[Unit]\nDescription=NemoClaw Agent Security Platform\nAfter=network-online.target\nWants=network-online.target\n\n[Service]\nType=simple\nUser=azureuser\nWorkingDirectory=/home/azureuser/nemoclaw\nEnvironmentFile=/home/azureuser/nemoclaw/.env\nExecStart=/usr/bin/npx nemoclaw start\nRestart=on-failure\nRestartSec=10\nStandardOutput=journal\nStandardError=journal\n\n[Install]\nWantedBy=multi-user.target\nEOF\n\nsudo systemctl daemon-reload\nsudo systemctl enable nemoclaw\nsudo systemctl start nemoclaw',
          },
          {
            title: 'Verify the deployment',
            content: 'sudo systemctl status nemoclaw\nnpx nemoclaw status\n\nBoth should show healthy status. Check logs for any errors:\nsudo journalctl -u nemoclaw --no-pager -n 30',
          },
          {
            title: 'Access the Control UI',
            content: 'From your local machine, create an SSH tunnel:\n\nssh -L 18789:localhost:18789 azureuser@<public-ip>\n\nOpen http://localhost:18789 in your browser.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Azure-Specific: Startup Script for Secret Retrieval
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For production deployments, create a startup script that retrieves secrets from Key Vault
        each time the VM boots. This ensures secrets are refreshed automatically and minimizes the
        window during which plaintext credentials exist on disk.
      </p>

      <CodeBlock
        language="bash"
        title="Startup Script: /opt/nemoclaw-init.sh"
        code={`#!/bin/bash
# /opt/nemoclaw-init.sh
# Runs before NemoClaw starts, retrieves secrets from Key Vault

set -euo pipefail

VAULT_NAME="nemoclaw-vault"
ENV_FILE="/home/azureuser/nemoclaw/.env"

echo "Retrieving secrets from Key Vault..."

ANTHROPIC_KEY=$(az keyvault secret show \\
  --vault-name $VAULT_NAME \\
  --name anthropic-api-key \\
  --query value -o tsv)

SLACK_TOKEN=$(az keyvault secret show \\
  --vault-name $VAULT_NAME \\
  --name slack-bot-token \\
  --query value -o tsv)

cat > $ENV_FILE << EOF
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
SLACK_BOT_TOKEN=$SLACK_TOKEN
NODE_ENV=production
EOF

chown azureuser:azureuser $ENV_FILE
chmod 600 $ENV_FILE

echo "Secrets retrieved successfully."`}
      />

      <CodeBlock
        language="ini"
        title="Updated systemd service with pre-start"
        code={`[Unit]
Description=NemoClaw Agent Security Platform
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=azureuser
WorkingDirectory=/home/azureuser/nemoclaw
EnvironmentFile=/home/azureuser/nemoclaw/.env
ExecStartPre=/bin/bash /opt/nemoclaw-init.sh
ExecStart=/usr/bin/npx nemoclaw start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Azure Monitor Integration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Azure Monitor can collect logs and metrics from your NemoClaw VM for centralized
        observability. Install the Azure Monitor Agent to forward syslog and journald output
        to a Log Analytics workspace.
      </p>

      <CodeBlock
        language="bash"
        title="Install Azure Monitor Agent"
        code={`# Install the Azure Monitor Agent extension
az vm extension set \\
  --resource-group nemoclaw-rg \\
  --vm-name nemoclaw-prod \\
  --name AzureMonitorLinuxAgent \\
  --publisher Microsoft.Azure.Monitor \\
  --version 1.0

# Create a Data Collection Rule to forward syslog
# (Configure in Azure Portal: Monitor > Data Collection Rules > Create)
# Select your VM, choose Syslog as a data source,
# and send to your Log Analytics workspace.

# Query NemoClaw logs in Log Analytics:
# Syslog | where ProcessName == "nemoclaw" | order by TimeGenerated desc`}
      />

      <NoteBlock type="tip" title="Azure Serial Console">
        <p>
          If you lose SSH access to your VM (due to a firewall misconfiguration, network issue,
          or SSH daemon crash), Azure Serial Console provides emergency access directly through
          the Azure Portal. Enable it in the VM's Boot Diagnostics settings. It works even when
          the network stack is broken, as it uses the VM's serial port.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Troubleshooting Azure-Specific Issues
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">az CLI not found on the VM:</span> Install it
          with <code>curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash</code>. It is
          not pre-installed on standard Ubuntu images.
        </li>
        <li>
          <span className="font-semibold">Key Vault access denied:</span> Ensure Managed
          Identity is enabled and the "Key Vault Secrets User" role is assigned at the vault scope.
        </li>
        <li>
          <span className="font-semibold">Slow disk IO:</span> Standard HDD is the default
          on some VM sizes. Switch to Premium SSD by stopping the VM, changing the disk SKU,
          and restarting.
        </li>
        <li>
          <span className="font-semibold">DNS resolution failures:</span> Azure VMs use Azure
          DNS by default (168.63.129.16). If NemoClaw cannot resolve external hostnames, verify
          the VM's network interface has the correct DNS settings.
        </li>
      </ul>

      <WarningBlock title="Azure Instance Metadata Service">
        <p>
          Similar to AWS and GCP, Azure VMs have a metadata service at
          <code> http://169.254.169.254</code> that exposes the Managed Identity token and
          instance details. Configure NemoClaw policies to block agents from accessing this
          endpoint, as a compromised agent could use the metadata service to authenticate to
          Azure services using the VM's identity.
        </p>
      </WarningBlock>

      <ExerciseBlock
        question="What is the purpose of the ExecStartPre directive in the NemoClaw systemd service file?"
        options={[
          'It starts a backup process before NemoClaw launches',
          'It retrieves secrets from Key Vault and writes them to the .env file before NemoClaw starts',
          'It runs system updates before starting the service',
          'It checks if NemoClaw is already running',
        ]}
        correctIndex={1}
        explanation="ExecStartPre runs the secret retrieval script before the main NemoClaw process starts. This ensures that fresh secrets are pulled from Key Vault on every service start (including after reboots), minimizing the risk of stale or compromised credentials."
      />

      <ReferenceList
        references={[
          {
            title: 'Azure Key Vault Quickstart',
            url: 'https://learn.microsoft.com/en-us/azure/key-vault/secrets/quick-create-cli',
            type: 'docs',
            description: 'Store and retrieve secrets using Azure Key Vault.',
          },
          {
            title: 'Azure Monitor Agent',
            url: 'https://learn.microsoft.com/en-us/azure/azure-monitor/agents/agents-overview',
            type: 'docs',
            description: 'Collect logs and metrics from Azure VMs.',
          },
        ]}
      />
    </div>
  )
}
