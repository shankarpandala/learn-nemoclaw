import { CodeBlock, NoteBlock, StepBlock, WarningBlock } from '../../../components/content'

export default function InstallingDeps() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Installing Dependencies on Ubuntu 22.04
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Ubuntu 22.04 LTS (Jammy Jellyfish) is the primary recommended platform for NemoClaw. It
        ships with kernel 5.15 (Landlock ABI v1 supported) and has a straightforward package
        management system. This section walks through installing every dependency NemoClaw needs
        from a fresh Ubuntu 22.04 installation.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Follow each step in order. If you already have some of these packages installed, you can
        skip ahead, but it is worth running the version checks at each step to confirm compatibility.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 1: Update the System
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before installing anything, ensure your package index and installed packages are up to date.
        This avoids dependency conflicts and ensures you get the latest security patches.
      </p>

      <StepBlock
        title="Update and upgrade system packages"
        steps={[
          {
            title: 'Update the package index',
            content: 'Refresh the list of available packages from all configured repositories.',
            code: 'sudo apt update',
          },
          {
            title: 'Upgrade installed packages',
            content: 'Apply any pending upgrades to existing packages.',
            code: 'sudo apt upgrade -y',
          },
          {
            title: 'Install essential build tools',
            content: 'These are needed by some npm packages that compile native addons.',
            code: 'sudo apt install -y build-essential curl wget ca-certificates gnupg lsb-release',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 2: Install Node.js 20
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Ubuntu 22.04's default repositories ship Node.js 12, which is far too old for NemoClaw. You
        need to add the NodeSource repository to get Node.js 20. This is the officially recommended
        method for installing modern Node.js on Ubuntu.
      </p>

      <StepBlock
        title="Install Node.js 20 from NodeSource"
        steps={[
          {
            title: 'Add the NodeSource GPG key and repository',
            content: 'This script configures your system to pull Node.js 20 from the NodeSource APT repository.',
            code: 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -',
          },
          {
            title: 'Install Node.js',
            content: 'This installs both the Node.js runtime and npm.',
            code: 'sudo apt-get install -y nodejs',
          },
          {
            title: 'Verify Node.js and npm versions',
            content: 'Confirm that both are at the required minimum versions.',
            code: `node --version
# Expected: v20.x.x

npm --version
# Expected: 10.x.x`,
          },
        ]}
      />

      <NoteBlock type="tip" title="Alternative: Using nvm">
        <p>
          If you prefer to manage multiple Node.js versions, you can use
          nvm (Node Version Manager) instead. Install nvm
          from <code>https://github.com/nvm-sh/nvm</code>, then
          run <code>nvm install 20</code> and <code>nvm use 20</code>. This is especially useful
          if you work on other projects that require different Node.js versions.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 3: Install Docker Engine
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Docker Engine (Community Edition) provides the container runtime that NemoClaw uses to
        create and manage sandboxes. Do not install Docker from the default Ubuntu repository
        (<code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">docker.io</code>),
        as it is often outdated. Use the official Docker repository instead.
      </p>

      <StepBlock
        title="Install Docker Engine from the official repository"
        steps={[
          {
            title: 'Remove any old Docker packages',
            content: 'Uninstall conflicting packages that may be present from previous installations.',
            code: `sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true`,
          },
          {
            title: 'Add Docker official GPG key',
            content: 'Download and install the GPG key used to verify Docker packages.',
            code: `sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \\
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg`,
          },
          {
            title: 'Add the Docker repository',
            content: 'Configure APT to pull Docker packages from the official repository.',
            code: `echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \\
  https://download.docker.com/linux/ubuntu \\
  $(lsb_release -cs) stable" | \\
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`,
          },
          {
            title: 'Install Docker Engine and plugins',
            content: 'Update the package index and install Docker along with its CLI plugins.',
            code: `sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \\
  docker-buildx-plugin docker-compose-plugin`,
          },
          {
            title: 'Verify Docker installation',
            content: 'Check that Docker is installed and the daemon is running.',
            code: `docker --version
# Expected: Docker version 24.x.x or higher

sudo docker run --rm hello-world
# Should print "Hello from Docker!"`,
          },
        ]}
      />

      <WarningBlock title="Do Not Use snap Docker">
        <p>
          Ubuntu sometimes offers Docker as a snap package. Do not install Docker via snap for
          NemoClaw. The snap version has different filesystem permissions and volume mount behavior
          that causes sandbox creation to fail. Always use the APT-based installation from the
          official Docker repository as shown above.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 4: Install Git
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Git is typically already installed on Ubuntu 22.04, but verify it is present and up to date.
      </p>

      <CodeBlock
        title="Install and verify Git"
        language="bash"
        code={`sudo apt-get install -y git
git --version
# Expected: git version 2.34.x or higher`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 5: Final Verification
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Run a final check to confirm all dependencies are installed and at the correct versions.
      </p>

      <CodeBlock
        title="Final dependency check"
        language="bash"
        code={`echo "Node.js: $(node --version)"
echo "npm:     $(npm --version)"
echo "Docker:  $(docker --version)"
echo "Git:     $(git --version)"
echo "Kernel:  $(uname -r)"
echo ""
echo "Landlock: $(cat /sys/fs/landlock/abi_version 2>/dev/null || echo 'not available')"
echo "Arch:     $(uname -m)"`}
      />

      <NoteBlock type="info" title="Expected Output">
        <p>
          You should see Node.js v20+, npm 10+, Docker 24+, Git 2.30+, and a kernel version
          of 5.15 or higher. The Landlock ABI version should be 1 or higher on Ubuntu 22.04.
          If any of these are missing or below the minimum version, revisit the corresponding
          step above.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With all dependencies installed, the next step is to configure Docker so that your user
        account can run containers without sudo -- a requirement for NemoClaw to function correctly.
      </p>
    </div>
  )
}
