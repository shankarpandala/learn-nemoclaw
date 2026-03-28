import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock } from '../../../components/content'

export default function SoftwareRequirements() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Software Requirements
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw depends on a small but specific set of software tools to function correctly. The
        CLI itself is a Node.js application distributed via npm, and it orchestrates sandboxes
        through a container runtime (Docker). Before installing NemoClaw, you must ensure that
        each dependency is present and meets the minimum version requirements.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This section covers the required software, the minimum version for each, how to verify
        that your system meets the requirements, and platform-specific notes for the container
        runtime.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Required Software Overview
      </h2>

      <ComparisonTable
        title="Software Dependencies"
        headers={['Software', 'Minimum Version', 'Purpose']}
        rows={[
          ['Node.js', '20.0+', 'Runs the NemoClaw CLI and OpenShell runtime'],
          ['npm', '10.0+', 'Installs NemoClaw and manages packages'],
          ['Docker Engine', '24.0+', 'Provides container runtime for sandboxes'],
          ['Git', '2.30+', 'Used for blueprint versioning and updates'],
          ['OpenShell', 'Latest (installed by NemoClaw)', 'The agent execution shell inside sandboxes'],
        ]}
      />

      <NoteBlock type="info" title="OpenShell is Installed Automatically">
        <p>
          You do not need to install OpenShell manually. The NemoClaw onboard process downloads
          and configures OpenShell inside the sandbox as part of the blueprint. You only need to
          ensure the other four dependencies (Node.js, npm, Docker, Git) are installed on the host.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Node.js 20+
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw requires Node.js version 20 or later. This is because the CLI uses modern
        JavaScript features including native fetch, structured clone, and the updated module
        resolution algorithm introduced in Node.js 20. Earlier versions will fail with syntax
        errors or missing API calls.
      </p>

      <CodeBlock
        title="Check Node.js version"
        language="bash"
        code={`node --version
# Expected output: v20.x.x or higher (e.g., v20.11.0, v22.3.0)

# If Node.js is not installed or the version is too old:
# On Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using nvm (recommended for managing multiple versions):
nvm install 20
nvm use 20`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        npm 10+
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        npm version 10 or later is required. Node.js 20 ships with npm 10 by default, so if
        you install Node.js 20+, you typically already have the correct npm version. However,
        if you have upgraded Node.js in place or are using a version manager, your npm version
        may be outdated.
      </p>

      <CodeBlock
        title="Check and update npm"
        language="bash"
        code={`# Check npm version
npm --version
# Expected: 10.x.x or higher

# If npm is too old, update it:
npm install -g npm@latest

# Verify after update:
npm --version`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Docker (Container Runtime)
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw uses Docker to create and manage sandbox containers. The specific Docker setup
        varies by platform:
      </p>

      <ComparisonTable
        title="Container Runtime by Platform"
        headers={['Platform', 'Recommended Runtime', 'Notes']}
        rows={[
          ['Ubuntu / Debian Linux', 'Docker Engine (CE)', 'Install from Docker official repo'],
          ['macOS', 'Colima', 'Lightweight CLI-based; avoids Docker Desktop licensing'],
          ['Windows', 'Docker Desktop with WSL2 backend', 'Must run inside WSL2 Ubuntu instance'],
          ['Other Linux', 'Docker Engine (CE)', 'May need manual kernel module configuration'],
        ]}
      />

      <CodeBlock
        title="Check Docker version"
        language="bash"
        code={`# Check Docker is installed and accessible
docker --version
# Expected: Docker version 24.x.x or higher

# Verify Docker daemon is running
docker info > /dev/null 2>&1 && echo "Docker is running" || echo "Docker is NOT running"

# Test that you can run containers
docker run --rm hello-world`}
      />

      <WarningBlock title="Docker Must Be Accessible Without sudo">
        <p>
          NemoClaw invokes Docker commands without sudo. If running <code>docker ps</code> requires
          sudo on your system, the NemoClaw CLI will fail. You must add your user to the docker
          group (covered in the Docker configuration section) or use a rootless Docker setup.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Git
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Git is used by NemoClaw for blueprint versioning, updates, and certain internal operations.
        Most Linux distributions include Git by default, but you should verify the version.
      </p>

      <CodeBlock
        title="Check Git version"
        language="bash"
        code={`git --version
# Expected: git version 2.30.x or higher

# Install if missing (Ubuntu/Debian):
sudo apt-get install -y git`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        All-in-One Version Check Script
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Use this script to quickly verify that all required software is installed and meets the
        minimum version requirements. Save it and run it before proceeding with NemoClaw installation.
      </p>

      <CodeBlock
        title="check-prerequisites.sh"
        language="bash"
        code={`#!/usr/bin/env bash
set -euo pipefail

echo "=== NemoClaw Prerequisites Check ==="
echo ""

# Check Node.js
if command -v node &> /dev/null; then
  NODE_VER=$(node --version | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VER" | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 20 ]; then
    echo "[OK]  Node.js $NODE_VER (>= 20 required)"
  else
    echo "[FAIL] Node.js $NODE_VER (>= 20 required)"
  fi
else
  echo "[FAIL] Node.js not found"
fi

# Check npm
if command -v npm &> /dev/null; then
  NPM_VER=$(npm --version)
  NPM_MAJOR=$(echo "$NPM_VER" | cut -d. -f1)
  if [ "$NPM_MAJOR" -ge 10 ]; then
    echo "[OK]  npm $NPM_VER (>= 10 required)"
  else
    echo "[FAIL] npm $NPM_VER (>= 10 required)"
  fi
else
  echo "[FAIL] npm not found"
fi

# Check Docker
if command -v docker &> /dev/null; then
  DOCKER_VER=$(docker --version | grep -oP '\\d+\\.\\d+\\.\\d+')
  DOCKER_MAJOR=$(echo "$DOCKER_VER" | cut -d. -f1)
  if [ "$DOCKER_MAJOR" -ge 24 ]; then
    echo "[OK]  Docker $DOCKER_VER (>= 24 required)"
  else
    echo "[FAIL] Docker $DOCKER_VER (>= 24 required)"
  fi
  # Check if Docker runs without sudo
  if docker ps &> /dev/null; then
    echo "[OK]  Docker accessible without sudo"
  else
    echo "[FAIL] Docker requires sudo (add user to docker group)"
  fi
else
  echo "[FAIL] Docker not found"
fi

# Check Git
if command -v git &> /dev/null; then
  GIT_VER=$(git --version | grep -oP '\\d+\\.\\d+\\.\\d+')
  echo "[OK]  Git $GIT_VER"
else
  echo "[FAIL] Git not found"
fi

echo ""
echo "=== Check Complete ==="`}
      />

      <NoteBlock type="tip" title="Save and Run the Check Script">
        <p>
          Copy this script to a file, make it executable with <code>chmod +x check-prerequisites.sh</code>,
          and run it with <code>./check-prerequisites.sh</code>. Fix any [FAIL] items before
          proceeding to the NemoClaw installation steps.
        </p>
      </NoteBlock>

      <DefinitionBlock
        term="OpenShell"
        definition="The secure shell environment that runs inside NemoClaw sandboxes. OpenShell provides the execution context for AI agents, implementing command filtering, filesystem restrictions, and network policies. It is the interface between the agent and the sandboxed operating system."
        example="When an agent executes `ls /home`, OpenShell intercepts the command, checks it against the active policy, and either permits or denies execution."
        seeAlso={['Sandbox', 'Security Policy', 'Agent Runtime']}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With all prerequisites verified, you are ready to move on to the next section, where we
        cover which Linux distributions and operating systems are officially supported by NemoClaw.
      </p>
    </div>
  )
}
