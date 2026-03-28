import { CodeBlock, NoteBlock, StepBlock, WarningBlock } from '../../../components/content'

export default function WindowsTroubleshooting() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Windows WSL2 Troubleshooting
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        WSL2 introduces a unique set of challenges compared to native Linux or macOS. The
        interaction between Windows, the WSL2 Linux kernel, and Docker can produce issues that
        do not occur on other platforms. This section covers the most common WSL2-specific problems
        and their solutions.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: Networking Problems
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        WSL2 uses a virtual network adapter with NAT. This means the WSL2 instance has a different
        IP address than the Windows host, and network traffic between them goes through a virtual
        bridge. This can cause issues with port forwarding, VPN connectivity, and service discovery.
      </p>

      <WarningBlock title="WSL2 IP Address Changes on Restart">
        <p>
          WSL2 gets a new IP address every time it restarts. Do not hard-code the WSL2 IP address
          in configurations. Use <code>localhost</code> for accessing WSL2 services from Windows
          (localhostforwarding must be enabled), or use hostname resolution.
        </p>
      </WarningBlock>

      <CodeBlock
        title="Diagnose networking issues"
        language="bash"
        code={`# Check WSL2 IP address
ip addr show eth0 | grep "inet "
# Example: inet 172.28.xxx.xxx/20

# Check Windows host IP from WSL2
cat /etc/resolv.conf | grep nameserver
# The nameserver IP is your Windows host

# Test internet connectivity
ping -c 3 8.8.8.8
curl -s https://httpbin.org/ip

# Test localhost forwarding (from WSL2)
# Start a test server:
python3 -m http.server 9999 &
# From Windows browser: http://localhost:9999 should work

# If localhost forwarding is broken, check .wslconfig:
# localhostforwarding=true`}
      />

      <StepBlock
        title="Fix: WSL2 cannot reach the internet"
        steps={[
          {
            title: 'Check DNS resolution',
            content: 'DNS issues are the most common networking problem in WSL2.',
            code: `# Test DNS
nslookup google.com
# If this fails, DNS is the problem

# Check resolv.conf
cat /etc/resolv.conf`,
          },
          {
            title: 'Fix DNS by setting a manual nameserver',
            content: 'If auto-generated DNS is not working, override it.',
            code: `# Prevent WSL from auto-generating resolv.conf
sudo tee /etc/wsl.conf << 'EOF'
[boot]
systemd=true

[network]
generateResolvConf=false
EOF

# Set Google DNS manually
sudo rm /etc/resolv.conf
sudo tee /etc/resolv.conf << 'EOF'
nameserver 8.8.8.8
nameserver 8.8.4.4
EOF

# Make it immutable so it doesn't get overwritten
sudo chattr +i /etc/resolv.conf`,
          },
          {
            title: 'Restart WSL2',
            content: 'Apply changes by restarting.',
            code: `# In PowerShell:
wsl --shutdown
# Then reopen Ubuntu`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: DNS Resolution Inside Sandboxes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Even if DNS works in WSL2, sandboxes may have their own DNS issues because they run inside
        Docker containers within WSL2 -- two layers of network indirection.
      </p>

      <CodeBlock
        title="Fix sandbox DNS"
        language="bash"
        code={`# Test DNS inside a sandbox
nemoclaw my-sandbox exec -- nslookup google.com

# If DNS fails inside the sandbox but works in WSL2:
# Configure Docker's DNS settings
sudo tee /etc/docker/daemon.json << 'EOF'
{
  "dns": ["8.8.8.8", "8.8.4.4"],
  "storage-driver": "overlay2"
}
EOF

sudo systemctl restart docker

# Restart the sandbox
nemoclaw my-sandbox stop
nemoclaw my-sandbox start

# Test again
nemoclaw my-sandbox exec -- curl -s https://httpbin.org/ip`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: Docker Integration Not Working
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Docker Desktop's WSL2 integration can sometimes fail, causing the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">docker</code> command
        to not be found or return errors inside WSL2.
      </p>

      <StepBlock
        title="Fix Docker Desktop WSL2 integration"
        steps={[
          {
            title: 'Verify Docker Desktop is running',
            content: 'Docker Desktop must be running on the Windows side.',
            code: `# Check if Docker Desktop is running
# Look for the Docker whale icon in the Windows system tray
# Or check from WSL2:
docker version 2>&1 | head -5`,
          },
          {
            title: 'Re-enable WSL2 integration',
            content: 'Toggle the integration setting in Docker Desktop.',
            code: `# In Docker Desktop:
# Settings > Resources > WSL Integration
# 1. Disable integration for Ubuntu-22.04
# 2. Click "Apply & Restart"
# 3. Re-enable integration for Ubuntu-22.04
# 4. Click "Apply & Restart"`,
          },
          {
            title: 'Restart WSL2 and Docker Desktop',
            content: 'A clean restart often fixes integration issues.',
            code: `# In PowerShell (as admin):
wsl --shutdown
# Close Docker Desktop
# Reopen Docker Desktop
# Wait for it to fully start
# Open WSL2 Ubuntu
docker ps`,
          },
          {
            title: 'Check the Docker socket',
            content: 'Verify the Docker socket exists and is accessible.',
            code: `# Inside WSL2:
ls -la /var/run/docker.sock
# Should show a socket file owned by root:docker

# If missing, Docker Desktop integration is not connected
# Check Docker context:
docker context ls
# The active context should point to the Docker Desktop socket`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: File System Performance
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        WSL2 has two filesystem regions: the native Linux ext4 filesystem and the Windows NTFS
        filesystem (accessible via /mnt/c/). Accessing files across the boundary incurs significant
        performance penalties.
      </p>

      <WarningBlock title="Cross-Filesystem Access Is Very Slow">
        <p>
          Accessing Windows files from WSL2 (anything under <code>/mnt/c/</code>) is 5-10x slower
          than accessing native WSL2 files (under <code>/home/</code>). NemoClaw sandboxes and
          Docker should always store their data on the native WSL2 filesystem. Never configure
          Docker's data-root or NemoClaw's data directory to point to a <code>/mnt/</code> path.
        </p>
      </WarningBlock>

      <CodeBlock
        title="Ensure NemoClaw data is on the native filesystem"
        language="bash"
        code={`# Check where NemoClaw stores its data
nemoclaw config get data_dir
# Should be under /home/... not /mnt/c/...

# Check where Docker stores its data
docker info | grep "Docker Root Dir"
# Should be /var/lib/docker (native ext4), not under /mnt/

# If your project files are on Windows:
# Bad (slow): Working directly in /mnt/c/Users/me/projects/
# Good (fast): Copy to WSL2 native filesystem
cp -r /mnt/c/Users/me/projects/my-agent ~/my-agent
# Work from ~/my-agent inside WSL2 and sandboxes`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: VPN Interference
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Corporate VPNs (Cisco AnyConnect, GlobalProtect, etc.) frequently conflict with WSL2
        networking because they modify the Windows network routing table in ways that break WSL2's
        virtual network adapter.
      </p>

      <CodeBlock
        title="Fix VPN-related network issues"
        language="bash"
        code={`# Symptom: WSL2 loses internet when VPN connects

# Fix 1: Configure VPN to use split tunneling
# This is VPN-specific and may require IT support

# Fix 2: Manually fix the network route (in PowerShell as admin)
# Get WSL2's IP and interface:
wsl hostname -I
# Get the VPN interface index:
Get-NetAdapter | Where-Object {$_.InterfaceDescription -like "*Cisco*" -or $_.InterfaceDescription -like "*VPN*"} | Select-Object Name,ifIndex

# Fix 3: Use a WSL2 network mirror mode (Windows 11 22H2+)
# In .wslconfig:
# [wsl2]
# networkingMode=mirrored
# This makes WSL2 share the Windows network stack directly`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Issue: WSL2 Memory Not Released
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        WSL2 is known for not releasing memory back to Windows after it is no longer needed. The
        Vmmem process on Windows may consume large amounts of RAM even after you stop sandboxes.
      </p>

      <CodeBlock
        title="Reclaim WSL2 memory"
        language="bash"
        code={`# Check memory usage inside WSL2
free -h

# Drop filesystem caches to free memory
sudo sh -c "echo 3 > /proc/sys/vm/drop_caches"

# If memory is still not released to Windows:
# Stop all NemoClaw sandboxes
nemoclaw list | tail -n +2 | awk '{print $1}' | xargs -I {} nemoclaw {} stop

# Compact the WSL2 memory (PowerShell as admin):
wsl --shutdown
# Wait 10 seconds, then restart WSL2

# To prevent runaway memory, set a limit in .wslconfig:
# [wsl2]
# memory=12GB`}
      />

      <NoteBlock type="tip" title="General WSL2 Debugging">
        <p>
          For any WSL2 issue not covered here, check the WSL2
          logs: <code>wsl --debug-console</code> (Windows 11) or view the Windows Event Viewer
          under "Applications and Services Logs &gt; Microsoft &gt; Windows &gt; WSL". The NemoClaw
          diagnostic bundle (<code>nemoclaw diagnostics</code>) also captures WSL2-specific
          information when run from inside WSL2.
        </p>
      </NoteBlock>
    </div>
  )
}
