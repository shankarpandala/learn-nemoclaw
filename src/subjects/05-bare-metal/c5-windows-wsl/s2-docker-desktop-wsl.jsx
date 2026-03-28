import { CodeBlock, NoteBlock, StepBlock, WarningBlock, ComparisonTable } from '../../../components/content'

export default function DockerDesktopWsl() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Docker Desktop WSL2 Backend
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        On Windows, the recommended approach for running Docker with NemoClaw is Docker Desktop
        with the WSL2 backend. This configuration runs the Docker daemon inside the WSL2 Linux
        kernel, providing near-native container performance while integrating cleanly with your
        WSL2 Ubuntu instance. Unlike macOS where we recommend Colima, on Windows Docker Desktop
        is the preferred choice because it handles the WSL2 integration automatically.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why Docker Desktop on Windows
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While it is technically possible to install Docker Engine directly inside WSL2 Ubuntu
        (just as you would on a native Linux system), Docker Desktop's WSL2 backend provides
        several advantages:
      </p>

      <ComparisonTable
        title="Docker Desktop WSL2 vs Docker Engine in WSL2"
        headers={['Feature', 'Docker Desktop (WSL2 backend)', 'Docker Engine (manual in WSL2)']}
        highlightDiffs
        rows={[
          ['Installation', 'Windows installer, automatic setup', 'Manual apt install inside WSL2'],
          ['WSL2 integration', 'Automatic, shares daemon across distros', 'Manual, per-distro daemon'],
          ['Windows path access', 'Transparent via /mnt/c/', 'Requires manual mount configuration'],
          ['Auto-start with Windows', 'Built-in option', 'Requires custom systemd service'],
          ['Resource management', 'GUI settings panel', 'Manual .wslconfig + daemon.json'],
          ['NemoClaw compatible', 'Yes', 'Yes (but more manual setup)'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Install and Configure Docker Desktop
      </h2>

      <StepBlock
        title="Install Docker Desktop with WSL2 backend"
        steps={[
          {
            title: 'Download Docker Desktop',
            content: 'Download the Docker Desktop installer from the official Docker website.',
            code: `# Download from: https://www.docker.com/products/docker-desktop/
# Or via winget (in PowerShell):
winget install Docker.DockerDesktop`,
          },
          {
            title: 'Run the installer',
            content: 'Run the downloaded installer. During installation, ensure "Use WSL 2 instead of Hyper-V" is checked.',
            code: `# The installer runs on Windows.
# Check the box: "Use WSL 2 instead of Hyper-V (recommended)"
# Complete the installation and restart if prompted.`,
          },
          {
            title: 'Open Docker Desktop and configure WSL2 integration',
            content: 'After installation, open Docker Desktop and navigate to Settings.',
            code: `# In Docker Desktop:
# 1. Go to Settings > General
#    - Ensure "Use the WSL 2 based engine" is checked
#
# 2. Go to Settings > Resources > WSL Integration
#    - Enable integration with your Ubuntu-22.04 distro
#    - Click "Apply & Restart"`,
          },
          {
            title: 'Verify Docker in WSL2',
            content: 'Open your WSL2 Ubuntu terminal and verify Docker is accessible.',
            code: `# Inside WSL2 Ubuntu:
docker --version
# Expected: Docker version 24.x.x or higher

docker ps
# Should show an empty container list

docker run --rm hello-world
# Should print "Hello from Docker!"`,
          },
        ]}
      />

      <WarningBlock title="Docker Desktop Licensing">
        <p>
          Docker Desktop requires a paid subscription for commercial use in organizations with
          more than 250 employees or $10M+ in annual revenue. If this applies to your organization,
          ensure you have the appropriate license. Alternatively, you can install Docker Engine
          directly inside WSL2 Ubuntu (same process as native Linux installation) to avoid Docker
          Desktop licensing entirely.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Resource Configuration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Docker Desktop's WSL2 backend shares resources with the WSL2 VM. The resource limits
        you set in <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">.wslconfig</code> apply
        to the entire WSL2 VM, which includes Docker. Docker Desktop no longer has separate
        CPU/memory settings when using the WSL2 backend -- it uses whatever WSL2 has available.
      </p>

      <NoteBlock type="info" title="Resources Are Shared with WSL2">
        <p>
          When using the WSL2 backend, Docker Desktop does not have its own resource limits. The
          memory and CPU allocated to WSL2 via <code>.wslconfig</code> are shared between your
          Ubuntu userspace and Docker. If you allocated 12 GB to WSL2, Docker and your NemoClaw
          sandboxes share that 12 GB with the Ubuntu base system.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Docker Data Location
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Docker Desktop stores its data (images, containers, volumes) inside the WSL2 virtual
        disk. By default, this VHDX file grows dynamically and is located in your Windows user
        profile directory. For NemoClaw, the blueprint image (~6 GB uncompressed) and sandbox
        writable layers are stored here.
      </p>

      <CodeBlock
        title="Check Docker data location and size"
        language="bash"
        code={`# From PowerShell, check the VHDX file:
# Default location:
# %LOCALAPPDATA%\\Docker\\wsl\\disk\\docker_data.vhdx

# Inside WSL2, check Docker disk usage:
docker system df
# Shows image, container, and volume usage

# Check available disk space inside WSL2:
df -h /
# The root filesystem is the WSL2 virtual disk`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Verify Docker Desktop WSL2 Integration
      </h2>

      <CodeBlock
        title="Integration verification"
        language="bash"
        code={`# Run all checks from inside WSL2 Ubuntu:

echo "=== Docker Desktop WSL2 Integration Check ==="

# Check Docker is accessible
docker ps > /dev/null 2>&1 && \\
  echo "[OK] Docker accessible from WSL2" || \\
  echo "[FAIL] Docker not accessible (check WSL Integration in Docker Desktop settings)"

# Check Docker version
echo "[INFO] Docker: $(docker --version)"

# Check Docker daemon info
DRIVER=$(docker info 2>/dev/null | grep "Storage Driver" | awk '{print $3}')
echo "[INFO] Storage driver: $DRIVER"

CGROUP=$(docker info 2>/dev/null | grep "Cgroup Version" | awk '{print $3}')
echo "[INFO] Cgroup version: $CGROUP"

# Check Docker is using WSL2 backend
docker info 2>/dev/null | grep -q "Operating System: Docker Desktop" && \\
  echo "[OK] Docker Desktop WSL2 backend detected" || \\
  echo "[INFO] Docker Engine (not Docker Desktop)"

# Test container execution
docker run --rm alpine echo "Container test passed" 2>/dev/null && \\
  echo "[OK] Container execution works" || \\
  echo "[FAIL] Cannot run containers"

echo "=== Check Complete ==="`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Alternative: Docker Engine Directly in WSL2
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If you prefer to avoid Docker Desktop entirely, you can install Docker Engine directly
        inside your WSL2 Ubuntu instance. The installation process is identical to native Ubuntu
        (covered in the Ubuntu 22.04 chapter). The key difference is that you need systemd enabled
        in WSL2 for Docker to start via systemctl.
      </p>

      <CodeBlock
        title="Install Docker Engine directly in WSL2"
        language="bash"
        code={`# Ensure systemd is enabled (check /etc/wsl.conf has [boot] systemd=true)

# Then follow the standard Docker CE installation:
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \\
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \\
  https://download.docker.com/linux/ubuntu \\
  $(lsb_release -cs) stable" | \\
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker run --rm hello-world`}
      />

      <NoteBlock type="tip" title="Choose One Approach">
        <p>
          Use either Docker Desktop or Docker Engine inside WSL2, not both. Having both installed
          can cause socket conflicts and confusing behavior. If you install Docker Desktop first
          and later want to switch to Docker Engine, uninstall Docker Desktop from Windows before
          installing Docker Engine in WSL2.
        </p>
      </NoteBlock>
    </div>
  )
}
