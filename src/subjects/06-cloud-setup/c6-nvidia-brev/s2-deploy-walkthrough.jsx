import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function DeployWalkthrough() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Deploying NemoClaw on Brev
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This section provides a complete walkthrough for deploying NemoClaw on NVIDIA Brev using
        the integrated deployment command. The entire process -- from installing the CLI to having
        a running NemoClaw instance with local inference -- takes approximately five minutes.
      </p>

      <StepBlock
        title="Full Brev Deployment Walkthrough"
        steps={[
          {
            title: 'Install the Brev CLI',
            content: 'Install the Brev command-line tool on your local machine:\n\n# macOS\nbrew install brevdev/homebrew-brev/brev\n\n# Linux\ncurl -fsSL https://raw.githubusercontent.com/brevdev/brev-cli/main/bin/install.sh | bash\n\nVerify:\nbrev version',
          },
          {
            title: 'Authenticate',
            content: 'Log in to your Brev account:\n\nbrev login\n\nThis opens a browser window for authentication. If you do not have a Brev account, create one at brev.dev.',
          },
          {
            title: 'Deploy NemoClaw',
            content: 'Use the NemoClaw deploy command to create a fully configured instance:\n\nnemoclaw deploy my-nemoclaw --gpu a100 --region us-east\n\nThis command:\n1. Provisions an A100 GPU instance on Brev\n2. Installs Node.js and system dependencies\n3. Downloads and installs NemoClaw (Gateway + policy engine)\n4. Installs Ollama and pulls a default LLM model\n5. Starts all services\n\nThe entire process takes 3-5 minutes.',
          },
          {
            title: 'Monitor deployment progress',
            content: 'The CLI shows real-time deployment logs. You will see each phase:\n\n[1/5] Provisioning A100 instance... done (45s)\n[2/5] Installing system dependencies... done (30s)\n[3/5] Installing NemoClaw... done (60s)\n[4/5] Pulling LLM model... done (120s)\n[5/5] Starting services... done (15s)\n\nDeployment complete! Instance: my-nemoclaw',
          },
          {
            title: 'Connect to the instance',
            content: 'SSH into your Brev instance:\n\nbrev shell my-nemoclaw\n\nThis opens an SSH session to your instance. Brev handles key management and network routing automatically.',
          },
          {
            title: 'Run onboarding',
            content: 'Complete the NemoClaw onboarding to configure platform integration:\n\ncd ~/nemoclaw\nnpx nemoclaw onboard\n\nSelect your LLM provider (choose "local/Ollama" to use the GPU), configure Slack/Discord tokens, and set the default policy mode.',
          },
          {
            title: 'Verify the deployment',
            content: 'npx nemoclaw status\nnvidia-smi    # Verify GPU is being used\n\nThe status should show the Gateway, policy engine, and local LLM all running.',
          },
          {
            title: 'Access the Control UI',
            content: 'Forward the Control UI port through Brev:\n\nbrev port-forward my-nemoclaw --port 18789\n\nThen open http://localhost:18789 in your browser.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Deployment Options
      </h2>

      <CodeBlock
        language="bash"
        title="NemoClaw Deploy Command Options"
        code={`# Basic deployment with A100
nemoclaw deploy my-instance --gpu a100

# Deploy with specific GPU type
nemoclaw deploy my-instance --gpu t4          # Budget: 7B models
nemoclaw deploy my-instance --gpu a10g        # Mid-range: 13B models
nemoclaw deploy my-instance --gpu a100        # High-end: 30B+ models
nemoclaw deploy my-instance --gpu a100-80gb   # Maximum: 70B models
nemoclaw deploy my-instance --gpu h100        # Latest gen: maximum throughput

# Deploy with a specific LLM model pre-loaded
nemoclaw deploy my-instance --gpu a10g --model codellama:13b

# Deploy without local inference (API-only, cheaper GPU-less instance)
nemoclaw deploy my-instance --no-gpu

# Deploy in a specific region
nemoclaw deploy my-instance --gpu a100 --region eu-west

# List available configurations
nemoclaw deploy --list-options`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Managing Your Deployment
      </h2>

      <CodeBlock
        language="bash"
        title="Instance Management Commands"
        code={`# List your instances
brev ls

# Check instance status
brev status my-nemoclaw

# Stop the instance (stops billing)
brev stop my-nemoclaw

# Start a stopped instance
brev start my-nemoclaw

# SSH into the instance
brev shell my-nemoclaw

# Delete the instance permanently
brev delete my-nemoclaw

# View instance logs
brev logs my-nemoclaw`}
      />

      <NoteBlock type="tip" title="Stop When Not in Use">
        <p>
          Brev bills per second of runtime. If you are using NemoClaw during business hours only,
          stop the instance overnight and on weekends. A stopped instance retains all data (your
          NemoClaw configuration, policies, and workspace) but incurs no compute charges. Only
          a small storage fee applies for the disk volume.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Customizing the Environment
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        After initial deployment, you can customize the NemoClaw environment just as you would
        on any Linux server. The Brev instance runs Ubuntu with full root access.
      </p>

      <CodeBlock
        language="bash"
        title="Post-Deployment Customization"
        code={`# SSH into the instance
brev shell my-nemoclaw

# Pull additional LLM models
ollama pull mistral:7b-instruct
ollama pull codellama:34b-instruct-q4_K_M  # If using A100

# Edit NemoClaw configuration
nano ~/nemoclaw/openclaw.json

# Install additional tools
sudo apt install -y htop tmux

# Set up Tailscale for persistent access
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Configure custom policy rules
npx nemoclaw policy edit`}
      />

      <WarningBlock title="Data Persistence on Delete">
        <p>
          When you delete a Brev instance with <code>brev delete</code>, all data is permanently
          destroyed. Before deleting, export your NemoClaw configuration, policy rules, and any
          important workspace data. Use <code>npx nemoclaw export</code> to create a portable
          backup of your configuration that can be imported into a new deployment.
        </p>
      </WarningBlock>

      <ExerciseBlock
        question="What happens to your NemoClaw data when you stop (not delete) a Brev instance?"
        options={[
          'All data is deleted and must be reconfigured on restart',
          'Data is preserved on the disk volume; compute billing stops',
          'The instance continues running but stops accepting new sessions',
          'Data is automatically backed up to cloud storage',
        ]}
        correctIndex={1}
        explanation="Stopping a Brev instance halts compute billing while preserving all data on the disk volume. Your NemoClaw configuration, policies, workspace data, and installed LLM models remain intact. When you start the instance again, NemoClaw resumes exactly where it left off (assuming a systemd service is configured for auto-start)."
      />

      <ReferenceList
        references={[
          {
            title: 'Brev CLI Documentation',
            url: 'https://docs.brev.dev/cli',
            type: 'docs',
            description: 'Complete reference for Brev CLI commands.',
          },
          {
            title: 'NemoClaw Deployment Guide',
            url: 'https://docs.nemoclaw.dev/deployment/brev',
            type: 'docs',
            description: 'NemoClaw-specific Brev deployment documentation.',
          },
        ]}
      />
    </div>
  )
}
