import { CodeBlock, NoteBlock, StepBlock, WarningBlock, DefinitionBlock } from '../../../components/content'

export default function DockerConfig() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Docker Post-Install Configuration
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        After installing Docker Engine, several post-installation steps are required before NemoClaw
        can use it effectively. The most critical step is allowing your user account to run Docker
        commands without sudo. NemoClaw's CLI invokes Docker directly, and it does not prepend sudo
        to any Docker commands. If Docker requires root privileges, every NemoClaw operation will fail.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This section covers user group configuration, daemon settings, storage driver considerations,
        and verification that Docker is fully ready for NemoClaw.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Add Your User to the Docker Group
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When Docker is installed, it creates a Unix group called <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">docker</code>.
        Members of this group can communicate with the Docker daemon socket without root privileges.
        Adding your user to this group is the standard way to enable rootless Docker access.
      </p>

      <StepBlock
        title="Configure non-root Docker access"
        steps={[
          {
            title: 'Create the docker group (if it does not exist)',
            content: 'On most installations this group already exists, but running the command is harmless if it does.',
            code: 'sudo groupadd docker 2>/dev/null || true',
          },
          {
            title: 'Add your user to the docker group',
            content: 'Replace $USER with your username if needed. This grants Docker socket access.',
            code: 'sudo usermod -aG docker $USER',
          },
          {
            title: 'Activate the group change',
            content: 'You must log out and log back in for the group change to take effect. Alternatively, use newgrp for the current session.',
            code: `# Option A: Log out and back in (recommended)
# Option B: Activate in current shell session
newgrp docker`,
          },
          {
            title: 'Verify non-root access',
            content: 'Run a Docker command without sudo to confirm it works.',
            code: `docker ps
# Should show an empty container list (no "permission denied" error)

docker run --rm hello-world
# Should print "Hello from Docker!" without sudo`,
          },
        ]}
      />

      <WarningBlock title="Security Implications of the Docker Group">
        <p>
          Adding a user to the docker group effectively grants them root-equivalent privileges on the
          host, because Docker containers can mount host filesystems and run as root inside
          containers. This is acceptable for development workstations, but on shared servers or
          production systems, consider using rootless Docker mode instead. NemoClaw supports both
          approaches.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Configure the Docker Daemon
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The Docker daemon can be configured via the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">/etc/docker/daemon.json</code> file.
        While the defaults work for most NemoClaw setups, there are several settings worth
        configuring for optimal performance and reliability.
      </p>

      <CodeBlock
        title="/etc/docker/daemon.json - Recommended configuration"
        language="json"
        code={`{
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "default-address-pools": [
    {
      "base": "172.17.0.0/16",
      "size": 24
    }
  ],
  "features": {
    "buildkit": true
  }
}`}
      />

      <StepBlock
        title="Apply the daemon configuration"
        steps={[
          {
            title: 'Create or edit the daemon configuration file',
            content: 'Write the recommended configuration to daemon.json.',
            code: `sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json << 'EOF'
{
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "features": {
    "buildkit": true
  }
}
EOF`,
          },
          {
            title: 'Restart the Docker daemon',
            content: 'Apply the new configuration by restarting the service.',
            code: `sudo systemctl restart docker
sudo systemctl status docker
# Should show "active (running)"`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Storage Driver Considerations
      </h2>

      <DefinitionBlock
        term="overlay2"
        definition="The recommended Docker storage driver for modern Linux kernels. overlay2 uses the OverlayFS filesystem to efficiently layer container images, sharing common base layers between containers and using copy-on-write for per-container modifications. This is critical for NemoClaw because multiple sandboxes share the same base blueprint image."
        example="Two NemoClaw sandboxes created from the same blueprint share the ~6 GB base image layer. Each sandbox only stores its own modifications (agent-created files, installed packages) in a separate writable layer, typically 1-3 GB."
        seeAlso={['Copy-on-Write', 'Container Layer', 'Blueprint Image']}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">overlay2</code> storage
        driver is the default on modern Ubuntu systems and is the only driver recommended for NemoClaw.
        Older drivers like <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">aufs</code> or
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">devicemapper</code> are
        deprecated and may cause performance issues or outright failures.
      </p>

      <CodeBlock
        title="Verify storage driver"
        language="bash"
        code={`docker info | grep "Storage Driver"
# Expected: Storage Driver: overlay2

# Check the Docker root directory and disk usage
docker info | grep "Docker Root Dir"
# Default: /var/lib/docker

# Check current disk usage
docker system df`}
      />

      <NoteBlock type="tip" title="Moving Docker Data to a Larger Disk">
        <p>
          If your root partition is small but you have a large secondary disk, you can move Docker's
          data directory. Add <code>{'"data-root": "/mnt/large-disk/docker"'}</code> to your
          daemon.json, stop Docker, move the existing data, and restart. This is common on cloud
          instances where the root volume is 20 GB but an attached volume provides hundreds of GB.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Enable Docker to Start on Boot
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Ensure Docker starts automatically when the system boots. This is important for production
        deployments and convenient for development machines.
      </p>

      <CodeBlock
        title="Enable Docker auto-start"
        language="bash"
        code={`sudo systemctl enable docker
sudo systemctl enable containerd

# Verify both are enabled
systemctl is-enabled docker
# Expected: enabled

systemctl is-enabled containerd
# Expected: enabled`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Full Verification
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Run this comprehensive verification to confirm Docker is fully configured and ready for
        NemoClaw.
      </p>

      <CodeBlock
        title="Docker readiness check"
        language="bash"
        code={`echo "=== Docker Configuration Check ==="

# 1. Docker runs without sudo
docker ps > /dev/null 2>&1 && echo "[OK] Docker accessible without sudo" || echo "[FAIL] Docker requires sudo"

# 2. Docker daemon is running
docker info > /dev/null 2>&1 && echo "[OK] Docker daemon is running" || echo "[FAIL] Docker daemon not running"

# 3. Storage driver is overlay2
DRIVER=$(docker info 2>/dev/null | grep "Storage Driver" | awk '{print $3}')
[ "$DRIVER" = "overlay2" ] && echo "[OK] Storage driver: overlay2" || echo "[WARN] Storage driver: $DRIVER (overlay2 recommended)"

# 4. Can pull and run images
docker run --rm alpine echo "Container test passed" 2>/dev/null && echo "[OK] Container execution works" || echo "[FAIL] Cannot run containers"

# 5. Docker starts on boot
systemctl is-enabled docker > /dev/null 2>&1 && echo "[OK] Docker enabled on boot" || echo "[WARN] Docker not enabled on boot"

echo "=== Check Complete ==="`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If all checks pass, Docker is ready for NemoClaw. The next step is to install NemoClaw
        itself and run the onboarding process, which downloads the sandbox blueprint and creates
        your first sandbox.
      </p>
    </div>
  )
}
