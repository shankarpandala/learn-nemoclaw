import { CodeBlock, NoteBlock, StepBlock, WarningBlock, DefinitionBlock } from '../../../components/content'

export default function NemoclawOnboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Installing NemoClaw and Onboarding
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With all dependencies in place -- Node.js 20+, npm 10+, Docker running without sudo, and
        Git installed -- you are ready to install NemoClaw and create your first sandbox. The
        installation process has two phases: installing the NemoClaw CLI, and running the onboard
        command that downloads the blueprint image and creates a sandbox.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Phase 1: Install the NemoClaw CLI
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw provides a one-line install script that downloads the CLI, verifies its integrity,
        and installs it globally on your system. This script handles architecture detection (x86_64
        vs ARM64) automatically.
      </p>

      <StepBlock
        title="Install the NemoClaw CLI"
        steps={[
          {
            title: 'Run the install script',
            content: 'This downloads and installs the NemoClaw CLI binary and its Node.js dependencies.',
            code: 'curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash',
          },
          {
            title: 'Verify the installation',
            content: 'Check that the nemoclaw command is available and displays its version.',
            code: `nemoclaw --version
# Expected: nemoclaw vX.Y.Z

# If "command not found", add to PATH:
export PATH="$HOME/.nemoclaw/bin:$PATH"
# Add this line to your ~/.bashrc or ~/.zshrc for persistence`,
          },
          {
            title: 'Check the CLI help',
            content: 'View the available commands to confirm the CLI is working.',
            code: `nemoclaw --help
# Should display a list of available commands including:
#   onboard    - Create a new sandbox from a blueprint
#   list       - List all sandboxes
#   connect    - Connect to a sandbox
#   status     - Check sandbox status
#   logs       - View sandbox logs`,
          },
        ]}
      />

      <NoteBlock type="info" title="What the Install Script Does">
        <p>
          The install script performs the following steps: (1) detects your OS and architecture,
          (2) downloads the appropriate NemoClaw binary and Node.js dependencies, (3) verifies
          the download checksum against the published manifest, (4) installs the CLI
          to <code>~/.nemoclaw/bin/nemoclaw</code>, and (5) adds the binary path to your shell
          profile if not already present. The script does not require root privileges.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Phase 2: Run the Onboard Command
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw onboard</code> command
        is the primary setup command. It downloads a sandbox blueprint, verifies it, and creates
        your first NemoClaw sandbox. This process takes several minutes depending on your internet
        connection speed, as it downloads the ~2.4 GB compressed blueprint image.
      </p>

      <StepBlock
        title="Run the onboarding process"
        steps={[
          {
            title: 'Start the onboard process',
            content: 'This interactive command walks you through creating your first sandbox.',
            code: 'nemoclaw onboard',
          },
          {
            title: 'Provide a sandbox name',
            content: 'You will be prompted to name your sandbox. Choose a descriptive name.',
            code: `# The CLI will prompt:
# ? Sandbox name: my-dev-sandbox
# Use lowercase letters, numbers, and hyphens only`,
          },
          {
            title: 'Wait for the blueprint download',
            content: 'The CLI downloads and verifies the sandbox blueprint image. This is the longest step.',
            code: `# You will see progress output like:
# Downloading blueprint nemoclaw-base:latest...
# [=============>              ] 1.2 GB / 2.4 GB  50%
# Verifying image integrity... OK
# Extracting layers... done`,
          },
          {
            title: 'Sandbox creation completes',
            content: 'Once the blueprint is downloaded and extracted, the sandbox is created and started.',
            code: `# Final output:
# Creating sandbox "my-dev-sandbox"...
# Applying default security policy...
# Starting OpenShell runtime...
# Sandbox "my-dev-sandbox" is ready.
#
# Connect with: nemoclaw my-dev-sandbox connect`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What Happens During Onboarding
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Understanding what happens behind the scenes during onboarding helps with troubleshooting
        and gives you a clearer mental model of the NemoClaw architecture. The onboard process
        performs these operations in sequence:
      </p>

      <DefinitionBlock
        term="Blueprint"
        definition="A versioned, immutable container image that serves as the base for NemoClaw sandboxes. A blueprint contains a minimal Linux userland, the OpenShell runtime, default security policies, and standard tooling. Blueprints are published and signed by the NemoClaw team."
        example="The nemoclaw-base:latest blueprint includes Ubuntu 22.04 userland, OpenShell v3.x, Node.js 20, Python 3.11, and a default read-only security policy."
        seeAlso={['Sandbox', 'OpenShell', 'Security Policy']}
      />

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Blueprint Download:</span> The CLI pulls the latest
          blueprint image from the NemoClaw registry. The image is ~2.4 GB compressed and is
          stored in the local Docker image cache.
        </li>
        <li>
          <span className="font-semibold">Integrity Verification:</span> The downloaded image's
          SHA-256 digest is compared against the signed manifest published by the NemoClaw team.
          If the digest does not match, the onboard process aborts with an error.
        </li>
        <li>
          <span className="font-semibold">Sandbox Container Creation:</span> A Docker container
          is created from the blueprint image with the appropriate volume mounts, network
          configuration, and resource limits.
        </li>
        <li>
          <span className="font-semibold">Policy Application:</span> The default security policy
          is written to the sandbox's configuration directory. This policy defines the initial
          set of filesystem, network, and command restrictions.
        </li>
        <li>
          <span className="font-semibold">OpenShell Initialization:</span> The OpenShell runtime
          starts inside the sandbox, reads the security policy, and begins listening for
          connections. OpenShell is the secure shell that agents use to interact with the sandbox.
        </li>
        <li>
          <span className="font-semibold">Health Check:</span> The CLI performs a health check
          to confirm the sandbox is running, OpenShell is responsive, and the security policy
          is active.
        </li>
      </ul>

      <CodeBlock
        title="Inspect the created sandbox"
        language="bash"
        code={`# List all NemoClaw sandboxes
nemoclaw list
# Output:
# NAME              STATUS    CREATED          BLUEPRINT
# my-dev-sandbox    running   2 minutes ago    nemoclaw-base:latest

# View the underlying Docker container
docker ps --filter "label=nemoclaw.sandbox"
# Shows the Docker container backing the sandbox`}
      />

      <WarningBlock title="Do Not Modify the Docker Container Directly">
        <p>
          The Docker container backing a NemoClaw sandbox should only be managed through the
          NemoClaw CLI. Do not use <code>docker stop</code>, <code>docker rm</code>, or
          <code>docker exec</code> directly on the container. Doing so can corrupt the sandbox
          state and bypass security policies. Always use <code>nemoclaw</code> commands instead.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Onboard Options
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The onboard command accepts several optional flags for advanced use cases:
      </p>

      <CodeBlock
        title="Onboard command options"
        language="bash"
        code={`# Specify a custom sandbox name
nemoclaw onboard --name my-project

# Use a specific blueprint version instead of latest
nemoclaw onboard --blueprint nemoclaw-base:v2.1.0

# Set custom resource limits
nemoclaw onboard --cpus 4 --memory 8g

# Skip the interactive prompts (use defaults)
nemoclaw onboard --name my-sandbox --yes

# Specify a custom policy file
nemoclaw onboard --policy ./my-custom-policy.yaml`}
      />

      <NoteBlock type="tip" title="Multiple Sandboxes">
        <p>
          You can run <code>nemoclaw onboard</code> multiple times to create multiple sandboxes.
          Each sandbox is independent with its own security policy, filesystem state, and OpenShell
          instance. The second onboard is much faster because the blueprint image is already cached
          locally -- only the container creation and initialization steps are needed.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With onboarding complete, your sandbox is running and ready to accept connections. The next
        section covers how to verify the installation and check the health of your sandbox.
      </p>
    </div>
  )
}
