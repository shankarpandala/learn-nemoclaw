import { CodeBlock, NoteBlock, WarningBlock, StepBlock } from '../../../components/content'

export default function Troubleshooting() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Troubleshooting Ubuntu 22.04 Installation
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Even with careful preparation, issues can arise during NemoClaw installation and onboarding.
        This section catalogs the most common problems encountered on Ubuntu 22.04, explains their
        root causes, and provides step-by-step solutions. If you encounter an issue not covered
        here, the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw {'<name>'} logs</code> command
        is your best starting point for diagnosis.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: Docker Daemon Not Running
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This is the most common issue. NemoClaw reports that it cannot connect to Docker, or
        sandbox creation fails immediately.
      </p>

      <WarningBlock title="Error: Cannot connect to the Docker daemon">
        <p>
          If you see <code>Error: Cannot connect to the Docker daemon at unix:///var/run/docker.sock</code>,
          the Docker service is not running or your user cannot access the Docker socket.
        </p>
      </WarningBlock>

      <StepBlock
        title="Fix: Start Docker and verify access"
        steps={[
          {
            title: 'Check if Docker is running',
            content: 'Use systemctl to check the Docker service status.',
            code: `sudo systemctl status docker
# If "inactive (dead)" or "failed":
sudo systemctl start docker`,
          },
          {
            title: 'Enable Docker to start on boot',
            content: 'Prevent this issue from recurring after reboot.',
            code: 'sudo systemctl enable docker',
          },
          {
            title: 'Verify your user is in the docker group',
            content: 'NemoClaw requires Docker access without sudo.',
            code: `groups | grep docker
# If "docker" is not listed:
sudo usermod -aG docker $USER
newgrp docker`,
          },
          {
            title: 'Test Docker access',
            content: 'Confirm Docker works without sudo.',
            code: 'docker ps',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: Port Conflicts
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw sandboxes expose ports for OpenShell communication and any services the agent runs.
        If another process is already using a required port, sandbox creation or startup will fail.
      </p>

      <WarningBlock title="Error: Port 8022 is already in use">
        <p>
          This error means another process (possibly another sandbox or a local SSH server) is
          already bound to port 8022.
        </p>
      </WarningBlock>

      <CodeBlock
        title="Find and resolve port conflicts"
        language="bash"
        code={`# Find what is using port 8022
sudo lsof -i :8022
# Or:
sudo ss -tlnp | grep 8022

# If it is another NemoClaw sandbox, stop it first:
nemoclaw other-sandbox stop

# If it is an unrelated process, either stop that process or
# onboard with a different port:
nemoclaw onboard --name my-sandbox --port 8023

# To see all ports used by NemoClaw sandboxes:
nemoclaw list -v | grep -E "PORTS|->"`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: Insufficient RAM
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If the system does not have enough available memory, sandbox creation may succeed but
        the sandbox will immediately enter an error or degraded state as the OOM killer terminates
        processes.
      </p>

      <WarningBlock title="Sandbox enters 'error' state immediately after creation">
        <p>
          If <code>nemoclaw {'<name>'} status</code> shows "error" and the logs mention "Out of memory"
          or "OOM killed", your system does not have enough RAM for the sandbox.
        </p>
      </WarningBlock>

      <CodeBlock
        title="Diagnose and fix memory issues"
        language="bash"
        code={`# Check available memory
free -h
# Look at the "available" column -- need at least 4 GB free

# Check if the OOM killer was invoked
dmesg | grep -i "oom" | tail -5

# Check Docker's memory usage
docker stats --no-stream

# Solution 1: Reduce sandbox memory allocation
nemoclaw my-dev-sandbox stop
nemoclaw my-dev-sandbox config set memory 2g
nemoclaw my-dev-sandbox start

# Solution 2: Stop other containers consuming memory
docker ps
docker stop <other-container-id>

# Solution 3: Add swap space (temporary measure)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
# Add to /etc/fstab for persistence:
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: Kernel Too Old for Landlock
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If your kernel is older than 5.13, NemoClaw cannot use Landlock for host-level sandboxing.
        This does not prevent NemoClaw from working -- it falls back to Docker-only isolation --
        but you will see a warning.
      </p>

      <CodeBlock
        title="Check and upgrade kernel"
        language="bash"
        code={`# Check current kernel version
uname -r

# Check if Landlock is available
cat /sys/fs/landlock/abi_version 2>/dev/null || echo "Landlock not available"

# On Ubuntu 22.04, install the HWE (Hardware Enablement) kernel
# for a newer kernel version:
sudo apt install -y linux-generic-hwe-22.04

# Reboot to use the new kernel
sudo reboot

# After reboot, verify:
uname -r
# Should now show 6.5.x or higher
cat /sys/fs/landlock/abi_version
# Should show 3 or higher`}
      />

      <NoteBlock type="tip" title="HWE Kernel on Ubuntu 22.04">
        <p>
          Ubuntu 22.04 ships with kernel 5.15 by default, which supports Landlock ABI v1. Installing
          the HWE (Hardware Enablement) kernel upgrades you to kernel 6.5, which provides Landlock
          ABI v3 with file truncate restrictions. This is the recommended approach if you want
          enhanced Landlock capabilities without upgrading to Ubuntu 24.04.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: Blueprint Download Fails
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The blueprint image is ~2.4 GB and is downloaded from the NemoClaw registry. Network issues
        can cause the download to fail or time out.
      </p>

      <CodeBlock
        title="Fix blueprint download issues"
        language="bash"
        code={`# Check connectivity to the NemoClaw registry
curl -fsSL https://registry.nemoclaw.nvidia.com/v2/ && echo "Registry reachable" || echo "Registry unreachable"

# If behind a corporate proxy, configure Docker:
sudo mkdir -p /etc/systemd/system/docker.service.d
sudo tee /etc/systemd/system/docker.service.d/proxy.conf << 'EOF'
[Service]
Environment="HTTP_PROXY=http://proxy.example.com:8080"
Environment="HTTPS_PROXY=http://proxy.example.com:8080"
Environment="NO_PROXY=localhost,127.0.0.1"
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker

# Retry the onboard with increased timeout:
nemoclaw onboard --timeout 600

# If the download keeps failing, manually pull the image:
docker pull registry.nemoclaw.nvidia.com/nemoclaw-base:latest
nemoclaw onboard --local-image nemoclaw-base:latest`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: Disk Space Exhaustion
      </h2>

      <WarningBlock title="Error: No space left on device">
        <p>
          Docker images and containers are stored under <code>/var/lib/docker</code> by default.
          If this partition runs out of space, sandbox creation and operation will fail.
        </p>
      </WarningBlock>

      <CodeBlock
        title="Reclaim disk space"
        language="bash"
        code={`# Check disk usage
df -h /var/lib/docker

# See what Docker is consuming
docker system df

# Remove unused Docker resources (dangling images, stopped containers, unused networks)
docker system prune -f

# For more aggressive cleanup (removes all unused images, not just dangling):
docker system prune -a -f

# If /var/lib/docker is on a small partition, move Docker data:
# 1. Stop Docker
sudo systemctl stop docker
# 2. Move the data
sudo mv /var/lib/docker /mnt/large-disk/docker
# 3. Update daemon.json
sudo jq '. + {"data-root": "/mnt/large-disk/docker"}' /etc/docker/daemon.json > /tmp/daemon.json
sudo mv /tmp/daemon.json /etc/docker/daemon.json
# 4. Restart Docker
sudo systemctl start docker`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        General Debugging Commands
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When you encounter an issue not listed above, these commands help gather diagnostic
        information.
      </p>

      <CodeBlock
        title="Diagnostic information gathering"
        language="bash"
        code={`# View sandbox logs
nemoclaw my-dev-sandbox logs

# View sandbox logs with timestamps and follow mode
nemoclaw my-dev-sandbox logs --timestamps --follow

# View Docker container logs directly
docker logs $(docker ps -q --filter "label=nemoclaw.name=my-dev-sandbox")

# Check Docker daemon logs
sudo journalctl -u docker --since "1 hour ago" --no-pager

# Generate a diagnostic bundle for support
nemoclaw diagnostics --output /tmp/nemoclaw-diag.tar.gz
# This collects system info, Docker config, sandbox logs, and policy state`}
      />

      <NoteBlock type="info" title="Getting Help">
        <p>
          If the troubleshooting steps above do not resolve your issue, the diagnostic bundle
          generated by <code>nemoclaw diagnostics</code> contains all the information needed
          to file a support request. Include the bundle and a description of the problem when
          reaching out to the NemoClaw community or support channels.
        </p>
      </NoteBlock>
    </div>
  )
}
