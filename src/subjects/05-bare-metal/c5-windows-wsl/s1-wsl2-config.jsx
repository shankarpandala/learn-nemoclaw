import { CodeBlock, NoteBlock, StepBlock, WarningBlock, DefinitionBlock } from '../../../components/content'

export default function Wsl2Config() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        WSL2 Configuration for NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Windows Subsystem for Linux 2 (WSL2) provides a real Linux kernel running inside a
        lightweight virtual machine on Windows. NemoClaw runs inside a WSL2 Ubuntu instance,
        giving you a near-native Linux experience on a Windows machine. This section covers
        enabling WSL2, installing Ubuntu, configuring memory limits, and enabling systemd --
        all prerequisites for running NemoClaw on Windows.
      </p>

      <DefinitionBlock
        term="WSL2 (Windows Subsystem for Linux 2)"
        definition="A feature of Windows 10 (version 2004+) and Windows 11 that runs a real Linux kernel in a lightweight Hyper-V virtual machine. Unlike WSL1 (which translated Linux syscalls to Windows syscalls), WSL2 provides full Linux kernel compatibility, including support for Docker containers, cgroups, namespaces, and Landlock."
        example="NemoClaw running inside WSL2 Ubuntu 22.04 has access to the same Linux kernel features (Landlock, cgroups, namespaces) as a native Ubuntu installation, making it functionally equivalent for sandbox management."
        seeAlso={['Hyper-V', 'Linux Kernel', 'Container Runtime']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Enable WSL2
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        WSL2 must be enabled at the Windows level before you can install a Linux distribution.
        On modern Windows 11 systems, WSL is often pre-installed. On Windows 10, you may need
        to enable it manually.
      </p>

      <StepBlock
        title="Enable and install WSL2"
        steps={[
          {
            title: 'Open PowerShell as Administrator',
            content: 'Right-click the Start menu and select "Terminal (Admin)" or "PowerShell (Admin)".',
            code: `# Run this in an elevated PowerShell window:
wsl --install`,
          },
          {
            title: 'Restart your computer',
            content: 'The WSL installation requires a reboot to complete kernel installation.',
            code: '# After reboot, WSL2 will be ready',
          },
          {
            title: 'Verify WSL2 is the default version',
            content: 'Ensure WSL2 (not WSL1) is set as the default.',
            code: `wsl --set-default-version 2
wsl --status
# Default Version: 2
# WSL version: 2.x.x.x
# Kernel version: 5.15.xxx.x`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Install Ubuntu 22.04
      </h2>

      <StepBlock
        title="Install Ubuntu 22.04 in WSL2"
        steps={[
          {
            title: 'Install Ubuntu 22.04 from the command line',
            content: 'Download and install the Ubuntu 22.04 distribution.',
            code: `wsl --install -d Ubuntu-22.04

# Or if you prefer Ubuntu 24.04:
# wsl --install -d Ubuntu-24.04`,
          },
          {
            title: 'Set up your Linux user account',
            content: 'The first launch prompts you to create a username and password.',
            code: `# The Ubuntu terminal will open and prompt:
# Enter new UNIX username: myuser
# New password: ********
# Retype new password: ********`,
          },
          {
            title: 'Verify the installation',
            content: 'Confirm Ubuntu is running under WSL2.',
            code: `# From PowerShell:
wsl --list --verbose
# NAME            STATE           VERSION
# Ubuntu-22.04    Running         2

# From inside Ubuntu:
uname -r
# Example: 5.15.153.1-microsoft-standard-WSL2
cat /etc/os-release | head -3`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Configure Memory Limits
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        By default, WSL2 can consume up to 50% of your system's total RAM (on Windows 11) or up
        to 80% (on Windows 10). For NemoClaw, you want to control this allocation to ensure enough
        memory for the WSL2 VM while leaving sufficient resources for Windows itself.
      </p>

      <CodeBlock
        title="Create or edit .wslconfig (in Windows)"
        language="bash"
        code={`# Create/edit %USERPROFILE%\\.wslconfig
# In PowerShell:
notepad $env:USERPROFILE\\.wslconfig`}
      />

      <CodeBlock
        title=".wslconfig content"
        language="bash"
        code={`# %USERPROFILE%\\.wslconfig
[wsl2]
# Limit memory to 12 GB (adjust based on your total RAM)
memory=12GB

# Limit to 4 virtual CPUs
processors=4

# Set swap size (useful for memory-intensive agent workloads)
swap=8GB

# Localhostforwarding allows accessing WSL2 services from Windows
localhostforwarding=true

# Enable nested virtualization (needed for Docker)
nestedVirtualization=true`}
      />

      <StepBlock
        title="Apply the configuration"
        steps={[
          {
            title: 'Shut down WSL2',
            content: 'The .wslconfig changes only take effect after restarting WSL2.',
            code: `# In PowerShell:
wsl --shutdown`,
          },
          {
            title: 'Restart your Ubuntu instance',
            content: 'Open the Ubuntu terminal again or run wsl.',
            code: `# In PowerShell:
wsl -d Ubuntu-22.04`,
          },
          {
            title: 'Verify the memory limit',
            content: 'Check that the memory limit is applied inside WSL2.',
            code: `# Inside Ubuntu:
free -h
# Total should match your .wslconfig memory setting`,
          },
        ]}
      />

      <WarningBlock title="Insufficient Memory Causes Silent Failures">
        <p>
          If you allocate too little memory to WSL2, Docker and NemoClaw will start but sandboxes
          may crash under load when the OOM killer activates. With 16 GB of total system RAM,
          allocating 10-12 GB to WSL2 is a good balance. With 32 GB total, allocating 16-20 GB
          provides a comfortable experience.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Enable systemd
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Modern NemoClaw and Docker require systemd to be enabled inside WSL2. As of WSL 0.67.6
        (September 2022), systemd is supported but may not be enabled by default on older WSL
        installations.
      </p>

      <CodeBlock
        title="Enable systemd in WSL2"
        language="bash"
        code={`# Inside Ubuntu WSL2, edit /etc/wsl.conf:
sudo tee /etc/wsl.conf << 'EOF'
[boot]
systemd=true

[automount]
enabled=true
options="metadata,umask=22,fmask=11"

[network]
generateResolvConf=true
EOF

# Restart WSL2 to apply:
# In PowerShell: wsl --shutdown
# Then reopen Ubuntu

# Verify systemd is running:
systemctl --version
systemctl list-units --type=service | head -10
# Should show running services (not an error about systemd)`}
      />

      <NoteBlock type="info" title="Why systemd Matters">
        <p>
          Docker Engine manages its lifecycle through systemd (systemctl start/stop/enable docker).
          Without systemd enabled in WSL2, Docker must be started manually each time you open a
          WSL2 session, and NemoClaw's ability to manage the Docker service is limited. Enabling
          systemd provides a consistent experience matching a real Linux installation.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Verify WSL2 Readiness
      </h2>

      <CodeBlock
        title="WSL2 readiness check"
        language="bash"
        code={`echo "=== WSL2 Readiness Check ==="

# Check WSL version
echo "WSL kernel: $(uname -r)"

# Check systemd
systemctl is-system-running > /dev/null 2>&1 && \\
  echo "[OK] systemd is running" || \\
  echo "[FAIL] systemd is not running"

# Check memory
TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')
echo "[INFO] Total memory: ${TOTAL_MEM} GB"

# Check CPU count
echo "[INFO] CPUs: $(nproc)"

# Check Landlock
cat /sys/fs/landlock/abi_version 2>/dev/null && \\
  echo "[OK] Landlock available (ABI v$(cat /sys/fs/landlock/abi_version))" || \\
  echo "[WARN] Landlock not available"

echo "=== Check Complete ==="`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With WSL2 configured, the next step is setting up Docker Desktop with its WSL2 backend,
        which provides the container runtime NemoClaw needs.
      </p>
    </div>
  )
}
