import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock } from '../../../components/content'

export default function SupportedDistros() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Supported Distributions and Platforms
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw is designed to run on a range of Linux distributions, macOS, and Windows (via WSL2).
        However, not all platforms are equal in terms of support and capability. Some distributions
        offer full feature parity -- including kernel-level sandboxing via Landlock -- while others
        rely on Docker-based isolation as a fallback. Understanding these differences is important
        for choosing the right platform for your deployment.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Tier 1: Fully Supported
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Tier 1 platforms receive primary testing and are the recommended environments for NemoClaw
        deployment. These platforms support all NemoClaw features, including Landlock-based
        filesystem sandboxing.
      </p>

      <ComparisonTable
        title="Tier 1 Platforms"
        headers={['Distribution', 'Versions', 'Kernel', 'Landlock Support']}
        rows={[
          ['Ubuntu', '22.04 LTS, 24.04 LTS', '5.15+ / 6.5+', 'Full support'],
          ['NVIDIA DGX OS', '6.x (based on Ubuntu 24.04)', '6.5+', 'Full support'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Tier 2: Supported with Notes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Tier 2 platforms work with NemoClaw but may require additional configuration steps or have
        minor limitations compared to Tier 1.
      </p>

      <ComparisonTable
        title="Tier 2 Platforms"
        headers={['Platform', 'Notes', 'Landlock']}
        rows={[
          ['Debian 12 (Bookworm)', 'Kernel 6.1; full Landlock support', 'Yes'],
          ['Linux Mint 21.x+', 'Based on Ubuntu 22.04; works out of the box', 'Yes'],
          ['Pop!_OS 22.04+', 'Based on Ubuntu; works out of the box', 'Yes'],
          ['Fedora 38+', 'Kernel 6.x; requires manual Docker CE install', 'Yes'],
          ['macOS 13+ (Ventura)', 'Uses Colima/Docker; no Landlock', 'No (Docker isolation)'],
          ['Windows 11 + WSL2', 'Runs inside WSL2 Ubuntu instance', 'Yes (WSL2 kernel)'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Tier 3: Community / Experimental
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        These platforms may work but are not regularly tested. Use at your own risk and expect to
        troubleshoot issues independently.
      </p>

      <ComparisonTable
        title="Tier 3 Platforms"
        headers={['Platform', 'Status', 'Notes']}
        rows={[
          ['Arch Linux', 'Community tested', 'Rolling release; kernel usually new enough'],
          ['openSUSE Tumbleweed', 'Community tested', 'Rolling release; Docker from official repos'],
          ['RHEL 9 / Rocky 9 / Alma 9', 'Experimental', 'Kernel 5.14; Landlock v1 only'],
          ['Alpine Linux', 'Not recommended', 'musl libc may cause compatibility issues'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Kernel Requirements: Landlock
      </h2>

      <DefinitionBlock
        term="Landlock"
        definition="A Linux Security Module (LSM) introduced in kernel 5.13 that allows unprivileged processes to restrict their own access to the filesystem, network, and other resources. NemoClaw uses Landlock to enforce fine-grained security policies on agent operations without requiring root privileges."
        example="A Landlock policy can restrict an agent to only read files in /home/agent/workspace and write to /tmp, even if the process runs as a user with broader filesystem permissions."
        seeAlso={['Linux Security Module', 'Sandbox Policy', 'seccomp']}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Landlock is a critical component of NemoClaw's security model on Linux. It provides
        kernel-enforced filesystem and network restrictions that cannot be bypassed by the sandboxed
        agent, even if the agent gains code execution. Different kernel versions provide different
        levels of Landlock functionality:
      </p>

      <ComparisonTable
        title="Landlock Versions by Kernel"
        headers={['Kernel Version', 'Landlock ABI', 'Capabilities']}
        rows={[
          ['< 5.13', 'None', 'No Landlock; must rely on Docker isolation only'],
          ['5.13 - 5.18', 'ABI v1', 'Filesystem read/write/execute restrictions'],
          ['5.19 - 6.1', 'ABI v2', 'Adds file rename/link restrictions'],
          ['6.2+', 'ABI v3', 'Adds file truncate restrictions'],
          ['6.7+', 'ABI v4', 'Adds network (TCP bind/connect) restrictions'],
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw requires at minimum Landlock ABI v1 (kernel 5.13+) for host-level sandboxing.
        For full network policy enforcement at the kernel level, kernel 6.7+ with ABI v4 is
        recommended. On systems without Landlock support, NemoClaw falls back to Docker-only
        isolation, which is still secure but provides a different (coarser) level of restriction.
      </p>

      <CodeBlock
        title="Check kernel version and Landlock support"
        language="bash"
        code={`# Check kernel version
uname -r
# Example output: 6.5.0-44-generic

# Check if Landlock is enabled in the kernel
cat /sys/kernel/security/lsm
# Should include "landlock" in the comma-separated list
# Example: lockdown,capability,landlock,yama,apparmor

# Check the Landlock ABI version
cat /sys/fs/landlock/abi_version 2>/dev/null || echo "Landlock not available"
# Example output: 4`}
      />

      <WarningBlock title="Kernel Too Old for Landlock">
        <p>
          If your kernel is older than 5.13, Landlock is not available. NemoClaw will still work
          using Docker-based isolation, but you will see a warning during onboarding:
          <code className="block mt-2 text-xs">
            WARNING: Landlock not detected. Falling back to container-only isolation.
          </code>
          To get full Landlock support on an older distribution, you can upgrade your kernel or
          switch to a distribution with a newer default kernel (Ubuntu 22.04+ is recommended).
        </p>
      </WarningBlock>

      <NoteBlock type="info" title="macOS and Windows Do Not Use Landlock">
        <p>
          Landlock is a Linux-specific kernel feature. On macOS, NemoClaw runs sandboxes inside
          a Docker-managed Linux VM (via Colima or Docker Desktop), so Landlock is available
          inside the VM's kernel. On Windows WSL2, the WSL2 kernel (based on Linux 5.15+) supports
          Landlock natively. In both cases, NemoClaw handles the abstraction automatically.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Architecture Support
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw supports both x86_64 (Intel/AMD) and ARM64 (Apple Silicon, Ampere, Graviton)
        architectures. The sandbox blueprint images are published for both architectures, and the
        correct image is selected automatically during onboarding.
      </p>

      <CodeBlock
        title="Check system architecture"
        language="bash"
        code={`# Check architecture
uname -m
# x86_64 = Intel/AMD 64-bit
# aarch64 = ARM 64-bit (Apple Silicon, Graviton, etc.)

# On macOS:
arch
# arm64 = Apple Silicon
# x86_64 = Intel Mac`}
      />

      <ExerciseBlock
        question="Which Linux kernel version first introduced Landlock with network (TCP) restriction capabilities?"
        options={[
          'Kernel 5.13',
          'Kernel 5.19',
          'Kernel 6.2',
          'Kernel 6.7',
        ]}
        correctIndex={3}
        explanation="Landlock ABI v4, introduced in kernel 6.7, added TCP bind and connect network restrictions. Earlier versions only provided filesystem-level controls."
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Now that you understand the supported platforms and their capabilities, the following
        chapters provide step-by-step installation guides for each major platform: Ubuntu 22.04,
        Ubuntu 24.04 / DGX, macOS, and Windows WSL2.
      </p>
    </div>
  )
}
