import { CodeBlock, NoteBlock, StepBlock, WarningBlock } from '../../../components/content'

export default function WindowsInstallationWalkthrough() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        NemoClaw Installation on Windows WSL2
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This section provides a complete walkthrough for installing NemoClaw inside WSL2 on Windows.
        At this point, you should have WSL2 enabled with Ubuntu 22.04 installed, systemd enabled,
        and Docker accessible (either via Docker Desktop or Docker Engine). If any of these
        prerequisites are missing, return to the previous sections to complete them.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        All commands in this walkthrough are run inside the WSL2 Ubuntu terminal, not in
        PowerShell or Command Prompt. Open your Ubuntu terminal from the Windows Start menu
        or by running <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">wsl -d Ubuntu-22.04</code> in PowerShell.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 1: Update System and Install Node.js
      </h2>

      <StepBlock
        title="Prepare the WSL2 Ubuntu environment"
        steps={[
          {
            title: 'Update the package index',
            content: 'Ensure your WSL2 Ubuntu packages are up to date.',
            code: `sudo apt update && sudo apt upgrade -y`,
          },
          {
            title: 'Install essential build tools',
            content: 'Install build dependencies needed by npm packages with native addons.',
            code: `sudo apt install -y build-essential curl wget ca-certificates gnupg`,
          },
          {
            title: 'Install Node.js 20',
            content: 'Add the NodeSource repository and install Node.js 20.',
            code: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify:
node --version   # v20.x.x
npm --version    # 10.x.x`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 2: Verify Docker Access
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before installing NemoClaw, confirm that Docker is accessible from your WSL2 session.
      </p>

      <CodeBlock
        title="Verify Docker"
        language="bash"
        code={`# Check Docker is available
docker --version
docker ps

# Run a test container
docker run --rm hello-world

# If Docker is not found, either:
# 1. Enable WSL Integration in Docker Desktop settings
# 2. Install Docker Engine directly (see previous section)`}
      />

      <WarningBlock title="Common Issue: Docker Not Found in WSL2">
        <p>
          If <code>docker</code> is not found after installing Docker Desktop, open Docker Desktop
          settings and go to Resources &gt; WSL Integration. Ensure the toggle for your Ubuntu
          distribution is enabled, then click "Apply &amp; Restart". Close and reopen your WSL2
          terminal.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 3: Install the NemoClaw CLI
      </h2>

      <StepBlock
        title="Install NemoClaw"
        steps={[
          {
            title: 'Run the NemoClaw install script',
            content: 'Download and install the NemoClaw CLI inside WSL2.',
            code: `curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash`,
          },
          {
            title: 'Add NemoClaw to your PATH',
            content: 'The install script usually handles this, but verify.',
            code: `# If nemoclaw is not found after installation:
echo 'export PATH="$HOME/.nemoclaw/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify:
nemoclaw --version`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 4: Onboard Your First Sandbox
      </h2>

      <StepBlock
        title="Create your first sandbox"
        steps={[
          {
            title: 'Run the onboard command',
            content: 'This downloads the blueprint image and creates a sandbox. The first run downloads ~2.4 GB.',
            code: `nemoclaw onboard --name my-wsl-sandbox`,
          },
          {
            title: 'Wait for the download and setup',
            content: 'The blueprint download takes 3-10 minutes depending on your internet connection.',
            code: `# Progress output:
# Downloading blueprint nemoclaw-base:latest...
# [====================>       ] 1.8 GB / 2.4 GB  75%
# Verifying image integrity... OK
# Creating sandbox "my-wsl-sandbox"...
# Applying default security policy...
# Starting OpenShell runtime...
# Sandbox "my-wsl-sandbox" is ready.`,
          },
          {
            title: 'Verify the sandbox',
            content: 'Check that the sandbox is running and all components are healthy.',
            code: `nemoclaw list
# NAME              STATUS    BLUEPRINT              CREATED
# my-wsl-sandbox    running   nemoclaw-base:latest   1 minute ago

nemoclaw my-wsl-sandbox status
# All components should show healthy/running`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 5: Connect and Test
      </h2>

      <StepBlock
        title="Verify the sandbox works"
        steps={[
          {
            title: 'Connect to the sandbox',
            content: 'Open an interactive OpenShell session.',
            code: 'nemoclaw my-wsl-sandbox connect',
          },
          {
            title: 'Run verification commands inside the sandbox',
            content: 'Confirm the sandbox environment is working correctly.',
            code: `# Inside the sandbox:
whoami              # agent
hostname            # my-wsl-sandbox
uname -r            # Linux kernel version
openshell --version # OpenShell version

# Test policy enforcement
ls /home/agent/workspace  # Should succeed (allowed)
cat /etc/shadow           # Should fail (blocked by policy)

# Exit the sandbox
exit`,
          },
          {
            title: 'Run a non-interactive command',
            content: 'Test command execution from the host side.',
            code: `nemoclaw my-wsl-sandbox exec -- echo "Hello from WSL2 sandbox!"
# Expected: Hello from WSL2 sandbox!`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Complete Installation Verification
      </h2>

      <CodeBlock
        title="Full verification script"
        language="bash"
        code={`#!/usr/bin/env bash
echo "=== NemoClaw WSL2 Installation Verification ==="

# Check we're in WSL2
if grep -qi microsoft /proc/version; then
  echo "[OK] Running inside WSL2"
else
  echo "[WARN] Not running inside WSL2"
fi

# Check systemd
systemctl is-system-running > /dev/null 2>&1 && \\
  echo "[OK] systemd is running" || \\
  echo "[FAIL] systemd not running"

# Check Node.js
NODE_VER=$(node --version 2>/dev/null)
echo "[INFO] Node.js: $NODE_VER"

# Check Docker
docker ps > /dev/null 2>&1 && \\
  echo "[OK] Docker accessible" || \\
  echo "[FAIL] Docker not accessible"

# Check NemoClaw
NEMO_VER=$(nemoclaw --version 2>/dev/null)
echo "[INFO] NemoClaw: $NEMO_VER"

# Check sandbox
SANDBOX="my-wsl-sandbox"
STATUS=$(nemoclaw "$SANDBOX" status 2>/dev/null | grep "^Status:" | awk '{print $2}')
if [ "$STATUS" = "running" ]; then
  echo "[OK] Sandbox '$SANDBOX' is running"
else
  echo "[FAIL] Sandbox '$SANDBOX' status: $STATUS"
fi

# Check Landlock
ABI=$(cat /sys/fs/landlock/abi_version 2>/dev/null)
if [ -n "$ABI" ]; then
  echo "[OK] Landlock ABI v$ABI available"
else
  echo "[WARN] Landlock not available"
fi

echo "=== Verification Complete ==="`}
      />

      <NoteBlock type="tip" title="WSL2 Terminal Tips">
        <p>
          For the best experience developing with NemoClaw on Windows, use Windows Terminal (the
          modern terminal app from Microsoft) rather than the legacy console. Windows Terminal
          supports tabs, split panes, and better font rendering. You can install it from the
          Microsoft Store. Set your WSL2 Ubuntu as the default profile for quick access.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Your NemoClaw installation on Windows WSL2 is complete. The next section covers
        WSL2-specific troubleshooting for common issues with networking, DNS, Docker integration,
        and file system performance.
      </p>
    </div>
  )
}
