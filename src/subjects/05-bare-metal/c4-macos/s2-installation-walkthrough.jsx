import { CodeBlock, NoteBlock, StepBlock, WarningBlock } from '../../../components/content'

export default function MacInstallationWalkthrough() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        macOS Installation Walkthrough
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This section provides a complete, step-by-step guide to installing NemoClaw on macOS
        using Homebrew and Colima. By the end of this walkthrough, you will have a running
        NemoClaw sandbox on your Mac. The process takes approximately 15-20 minutes, with most
        of the time spent downloading the Colima VM image and NemoClaw blueprint.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        These instructions assume a clean macOS setup. If you already have some of these tools
        installed, verify the versions match and skip the corresponding steps.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Prerequisites
      </h2>

      <StepBlock
        title="Install Homebrew and base tools"
        steps={[
          {
            title: 'Install Homebrew (if not already installed)',
            content: 'Homebrew is the standard package manager for macOS. It is required for installing Colima, Docker CLI, and Node.js.',
            code: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# After installation, follow the instructions to add Homebrew to your PATH
# For Apple Silicon Macs:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"`,
          },
          {
            title: 'Verify Homebrew',
            content: 'Confirm Homebrew is working correctly.',
            code: `brew --version
# Expected: Homebrew 4.x.x`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Install Dependencies
      </h2>

      <StepBlock
        title="Install Node.js, Docker CLI, and Colima"
        steps={[
          {
            title: 'Install Node.js 20',
            content: 'Install the latest Node.js 20 LTS release via Homebrew.',
            code: `brew install node@20

# Add to PATH if not automatically linked:
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify:
node --version   # v20.x.x
npm --version    # 10.x.x`,
          },
          {
            title: 'Install the Docker CLI and Compose plugin',
            content: 'Install the Docker command-line tools (not Docker Desktop).',
            code: `brew install docker docker-compose docker-credential-helper`,
          },
          {
            title: 'Install Colima',
            content: 'Install the Colima container runtime.',
            code: `brew install colima`,
          },
          {
            title: 'Install Git (if not present)',
            content: 'macOS includes Git with Xcode Command Line Tools, but verify it is available.',
            code: `git --version
# If not installed, it will prompt to install Xcode CLT
# Or: brew install git`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Configure and Start Colima
      </h2>

      <StepBlock
        title="Start the Colima VM"
        steps={[
          {
            title: 'Start Colima with NemoClaw-appropriate resources',
            content: 'Allocate enough CPU, memory, and disk for Docker and at least one NemoClaw sandbox.',
            code: `colima start \\
  --cpu 4 \\
  --memory 12 \\
  --disk 40 \\
  --vm-type vz \\
  --mount-type virtiofs

# --vm-type vz: Uses Apple Virtualization.framework (faster on Apple Silicon)
# --mount-type virtiofs: Uses VirtioFS for better file sharing performance`,
          },
          {
            title: 'Verify Colima is running',
            content: 'Confirm the VM started successfully and Docker is accessible.',
            code: `colima status
# Should show: colima is running

docker ps
# Should show an empty container list (no errors)

docker run --rm hello-world
# Should print "Hello from Docker!"`,
          },
        ]}
      />

      <WarningBlock title="First Start Takes Time">
        <p>
          The first time you run <code>colima start</code>, it downloads the Linux VM image
          (approximately 500 MB). This is a one-time download. Subsequent starts use the cached
          image and take only a few seconds.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Install NemoClaw
      </h2>

      <StepBlock
        title="Install and onboard NemoClaw"
        steps={[
          {
            title: 'Run the NemoClaw install script',
            content: 'Download and install the NemoClaw CLI.',
            code: `curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash

# Verify:
nemoclaw --version`,
          },
          {
            title: 'Run the onboard process',
            content: 'Create your first NemoClaw sandbox. This downloads the ~2.4 GB blueprint image.',
            code: `nemoclaw onboard --name my-mac-sandbox

# Wait for the blueprint download and sandbox creation...
# This takes 3-10 minutes depending on internet speed.`,
          },
          {
            title: 'Verify the sandbox',
            content: 'Check that the sandbox is running and healthy.',
            code: `nemoclaw list
# NAME              STATUS    BLUEPRINT              CREATED
# my-mac-sandbox    running   nemoclaw-base:latest   1 minute ago

nemoclaw my-mac-sandbox status
# Should show all components healthy`,
          },
          {
            title: 'Connect to the sandbox',
            content: 'Open an interactive session to verify everything works.',
            code: `nemoclaw my-mac-sandbox connect

# Inside the sandbox:
whoami          # agent
uname -a        # Linux (running inside the Colima VM)
openshell --version

# Exit:
exit`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Auto-Starting Colima
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        By default, Colima does not start automatically when your Mac boots. If you want NemoClaw
        sandboxes available immediately after login, configure Colima as a launch agent.
      </p>

      <CodeBlock
        title="Configure Colima auto-start"
        language="bash"
        code={`# Create a launch agent plist
mkdir -p ~/Library/LaunchAgents

cat > ~/Library/LaunchAgents/com.colima.start.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.colima.start</string>
  <key>ProgramArguments</key>
  <array>
    <string>/opt/homebrew/bin/colima</string>
    <string>start</string>
    <string>--cpu</string>
    <string>4</string>
    <string>--memory</string>
    <string>12</string>
    <string>--disk</string>
    <string>40</string>
    <string>--vm-type</string>
    <string>vz</string>
    <string>--mount-type</string>
    <string>virtiofs</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/colima-start.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/colima-start.err</string>
</dict>
</plist>
EOF

# Load the launch agent
launchctl load ~/Library/LaunchAgents/com.colima.start.plist`}
      />

      <NoteBlock type="tip" title="Stopping Colima Saves Resources">
        <p>
          When you are not using NemoClaw, stopping Colima reclaims the CPU and memory allocated
          to the VM. Run <code>colima stop</code> when done. Your sandboxes will be preserved
          and resume when you run <code>colima start</code> again.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Your macOS NemoClaw installation is now complete. The next sections cover macOS-specific
        limitations and Apple Silicon considerations that affect how NemoClaw operates on your Mac.
      </p>
    </div>
  )
}
