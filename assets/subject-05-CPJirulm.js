import{j as e}from"./vendor-ui-CPWosGLJ.js";import{D as i,a as s,C as t,N as a,W as n,E as r,S as o,R as l}from"./subject-01-t2p6vKcb.js";import"./vendor-react-DsRxi-pb.js";const M={id:"05-bare-metal",title:"Setup on Bare Metal & Linux",icon:"🖥️",colorHex:"#7B1FA2",description:"Step-by-step installation guides for Ubuntu, macOS, Windows WSL, and DGX Spark.",difficulty:"intermediate",estimatedHours:6,prerequisites:["03-nemoclaw-architecture"],chapters:[{id:"c1-prerequisites",title:"Prerequisites & System Requirements",description:"Hardware, software, and platform requirements.",estimatedMinutes:30,sections:[{id:"s1-hardware-requirements",title:"Hardware Requirements",difficulty:"beginner",readingMinutes:8,description:"4+ vCPU, 8-16 GB RAM, 20-40 GB disk requirements."},{id:"s2-software-requirements",title:"Software Requirements",difficulty:"beginner",readingMinutes:10,description:"Node.js 20+, npm 10+, Docker, and Git."},{id:"s3-supported-distros",title:"Supported Distributions",difficulty:"beginner",readingMinutes:8,description:"Platform support tiers and kernel version matrix."}]},{id:"c2-ubuntu-22",title:"Ubuntu 22.04 Setup",description:"Complete installation walkthrough on Ubuntu 22.04 LTS.",estimatedMinutes:55,sections:[{id:"s1-installing-deps",title:"Installing Dependencies",difficulty:"beginner",readingMinutes:10,description:"apt, NodeSource, and Docker CE installation."},{id:"s2-docker-config",title:"Docker Configuration",difficulty:"beginner",readingMinutes:10,description:"Docker group, daemon.json, and storage driver setup."},{id:"s3-nemoclaw-onboard",title:"Running nemoclaw onboard",difficulty:"beginner",readingMinutes:12,description:"Install script, blueprint download, and sandbox creation."},{id:"s4-verifying-install",title:"Verifying Installation",difficulty:"beginner",readingMinutes:10,description:"Status checks, connection test, and verification script."},{id:"s5-troubleshooting",title:"Troubleshooting",difficulty:"intermediate",readingMinutes:12,description:"Docker issues, port conflicts, RAM, and disk space."}]},{id:"c3-ubuntu-24-dgx",title:"Ubuntu 24.04 & DGX Spark",description:"cgroup v2 fixes and DGX-specific optimizations.",estimatedMinutes:45,sections:[{id:"s1-cgroup-v2",title:"cgroup v2 Considerations",difficulty:"intermediate",readingMinutes:10,description:"cgroup v1 vs v2 and container runtime compatibility."},{id:"s2-setup-spark",title:"Running setup-spark",difficulty:"intermediate",readingMinutes:10,description:"The nemoclaw setup-spark command explained."},{id:"s3-dgx-optimizations",title:"DGX Optimizations",difficulty:"advanced",readingMinutes:12,description:"Unified memory, GPU allocation, and MPS configuration."},{id:"s4-gpu-passthrough",title:"GPU Passthrough",difficulty:"advanced",readingMinutes:12,description:"nvidia-container-toolkit and device mapping."}]},{id:"c4-macos",title:"macOS Setup",description:"Installation via Colima or Docker Desktop on macOS.",estimatedMinutes:40,sections:[{id:"s1-colima-vs-docker",title:"Colima vs Docker Desktop",difficulty:"beginner",readingMinutes:10,description:"Comparing the two container runtimes for macOS."},{id:"s2-installation-walkthrough",title:"Installation Walkthrough",difficulty:"beginner",readingMinutes:12,description:"Homebrew, Colima, Node.js, and NemoClaw setup."},{id:"s3-macos-limitations",title:"macOS Limitations",difficulty:"intermediate",readingMinutes:10,description:"No host Landlock, network namespace differences, no GPU."},{id:"s4-apple-silicon",title:"Apple Silicon Considerations",difficulty:"intermediate",readingMinutes:8,description:"ARM64 support, Rosetta, and VZ vs QEMU."}]},{id:"c5-windows-wsl",title:"Windows (WSL2) Setup",description:"Running NemoClaw inside Windows Subsystem for Linux.",estimatedMinutes:45,sections:[{id:"s1-wsl2-config",title:"WSL2 Configuration",difficulty:"beginner",readingMinutes:10,description:"Enable WSL2, install Ubuntu, and configure .wslconfig."},{id:"s2-docker-desktop-wsl",title:"Docker Desktop with WSL",difficulty:"beginner",readingMinutes:10,description:"Docker Desktop WSL2 backend setup."},{id:"s3-installation-walkthrough",title:"Installation Walkthrough",difficulty:"beginner",readingMinutes:12,description:"Full NemoClaw install inside WSL2."},{id:"s4-windows-troubleshooting",title:"Windows Troubleshooting",difficulty:"intermediate",readingMinutes:12,description:"Networking, DNS, VPN interference, and memory issues."}]},{id:"c6-post-install",title:"Post-Installation",description:"First connection, health checks, logs, and updates.",estimatedMinutes:40,sections:[{id:"s1-first-connection",title:"First Connection",difficulty:"beginner",readingMinutes:10,description:"nemoclaw connect and initial sandbox exploration."},{id:"s2-health-checks",title:"Health Checks",difficulty:"beginner",readingMinutes:10,description:"Status commands and component health states."},{id:"s3-logs-diagnostics",title:"Logs & Diagnostics",difficulty:"intermediate",readingMinutes:10,description:"Log locations, audit logs, debug mode, and diagnostic bundles."},{id:"s4-updating",title:"Updating & Upgrading",difficulty:"beginner",readingMinutes:8,description:"CLI updates, blueprint upgrades, and rollback."}]}]};function d(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Hardware Requirements"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Before installing NemoClaw on bare metal or a Linux workstation, it is essential to understand the hardware requirements. NemoClaw runs sandboxed environments that package an entire operating system image, an OpenShell runtime, and your agent workloads inside isolated containers. This means your host machine must have enough CPU, memory, and disk to support both the host operating system and at least one running sandbox."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The requirements vary depending on what you plan to do. A developer running a single sandbox for experimentation needs far less than an operator running multiple concurrent sandboxes with GPU workloads. This section covers the minimum, recommended, and production-grade hardware specifications."}),e.jsx(i,{term:"NemoClaw Sandbox",definition:"A lightweight, isolated container environment created by NemoClaw that encapsulates an OpenShell runtime, a set of security policies, and the agent workload. Each sandbox consumes its own CPU, memory, and disk resources on the host machine.",example:"Running `nemoclaw onboard` creates a sandbox from a blueprint image (~2.4 GB compressed, ~6 GB uncompressed on disk).",seeAlso:["Blueprint","OpenShell","Container Isolation"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Minimum Requirements"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"These are the absolute minimum specifications needed to run a single NemoClaw sandbox. Running at these minimums is suitable only for initial testing and is not recommended for sustained development work."}),e.jsx(s,{title:"Minimum Hardware Specifications",headers:["Resource","Minimum","Notes"],rows:[["CPU","4 vCPUs","x86_64 or ARM64 architecture"],["RAM","8 GB","Host OS + 1 sandbox; expect swapping under load"],["Disk","20 GB free","Sandbox image ~2.4 GB compressed, ~6 GB uncompressed"],["Network","Broadband internet","Required for initial image download and updates"]]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"You can check your current hardware resources using standard Linux commands. Run these to verify that your machine meets the minimum thresholds before proceeding with installation."}),e.jsx(t,{title:"Check CPU count",language:"bash",code:`# Check number of CPU cores
nproc
# Or for more detail:
lscpu | grep -E "^CPU\\(s\\)|^Model name|^Architecture"`}),e.jsx(t,{title:"Check available RAM",language:"bash",code:`# Check total and available memory
free -h
# Look at the "total" and "available" columns`}),e.jsx(t,{title:"Check available disk space",language:"bash",code:`# Check disk space on the root partition
df -h /
# Docker images typically live under /var/lib/docker
df -h /var/lib/docker 2>/dev/null || echo "Docker not yet installed"`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Recommended Specifications"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For a comfortable development experience -- running one or two sandboxes simultaneously, with room for the agent to execute build processes, run tests, and perform file operations without constant resource pressure -- the following specifications are recommended."}),e.jsx(s,{title:"Recommended Hardware by Use Case",headers:["Use Case","CPU","RAM","Disk"],rows:[["Single sandbox (development)","4-6 vCPUs","16 GB","40 GB free"],["Two concurrent sandboxes","8 vCPUs","16-32 GB","60 GB free"],["GPU workloads (ML/AI)","8+ vCPUs","32 GB+","100 GB+ free"],["Production (multi-sandbox)","16+ vCPUs","64 GB+","200 GB+ SSD"]]}),e.jsx(a,{type:"tip",title:"SSD vs HDD Makes a Significant Difference",children:e.jsx("p",{children:"NemoClaw sandboxes perform frequent filesystem operations -- reading policies, writing logs, and executing agent workloads that may involve compiling code or installing packages. An SSD (especially NVMe) dramatically improves sandbox startup time and overall responsiveness. On a spinning HDD, sandbox creation can take 3-5x longer, and agent operations that touch the filesystem will feel noticeably sluggish."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Understanding the Sandbox Image Size"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["When you first run ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw onboard"}),", the CLI downloads a compressed sandbox blueprint image. This image is approximately 2.4 GB compressed and expands to roughly 6 GB on disk. The image contains a minimal Linux userland, the OpenShell runtime, default security policies, and the tooling necessary for agent operations."]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Each sandbox you create shares the base image layers (thanks to Docker's copy-on-write filesystem), so running two sandboxes does not double the disk usage. However, each sandbox creates its own writable layer for any modifications the agent makes -- installed packages, generated files, logs, and so on. Plan for an additional 2-5 GB per sandbox for this writable layer, depending on workload."}),e.jsx(t,{title:"Estimate Docker disk usage",language:"bash",code:`# After installation, check how much space Docker is consuming
docker system df

# For detailed breakdown:
docker system df -v`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Virtualization and Cloud Instances"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw works inside virtual machines and cloud instances, not just on physical hardware. If you are provisioning a cloud VM for NemoClaw development, the same resource guidelines apply. When selecting an instance type, keep the following in mind:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"AWS:"})," A ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"t3.xlarge"})," (4 vCPUs, 16 GB RAM) is a good starting point. For GPU work, use a ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"g4dn.xlarge"})," or better."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"GCP:"})," An ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"e2-standard-4"})," or ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"n2-standard-4"})," instance works well."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Azure:"})," A ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"Standard_D4s_v5"})," provides 4 vCPUs and 16 GB RAM."]})]}),e.jsx(n,{title:"Nested Virtualization",children:e.jsx("p",{children:"NemoClaw uses Docker containers, which rely on Linux kernel features. If you are running inside a VM, ensure that the VM supports nested containerization. Most modern cloud providers support this by default, but some on-premises hypervisors (especially older versions of VMware or Hyper-V) may require explicit configuration to enable it. Without proper container support, sandbox creation will fail."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GPU Considerations"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If your agent workloads involve machine learning inference, model fine-tuning, or any CUDA-based computation, you will need an NVIDIA GPU. NemoClaw supports GPU passthrough to sandboxes via the nvidia-container-toolkit. The GPU requirements depend on your specific workload, but as a general guideline:"}),e.jsx(s,{title:"GPU Requirements by Workload",headers:["Workload","Minimum GPU","VRAM"],rows:[["No GPU workloads","Not required","N/A"],["Small model inference","NVIDIA T4 or GTX 1080","8 GB"],["Medium model inference","NVIDIA A10G or RTX 3090","24 GB"],["Large model / fine-tuning","NVIDIA A100 or H100","40-80 GB"]]}),e.jsx(a,{type:"info",title:"GPU Setup is Covered Later",children:e.jsx("p",{children:"Detailed GPU passthrough configuration is covered in the Ubuntu 24.04 / DGX chapter. For now, just ensure your hardware meets the baseline CPU, RAM, and disk requirements. GPU setup is an optional, additive step."})}),e.jsx(r,{question:"A developer wants to run two NemoClaw sandboxes simultaneously for testing. Which of the following is the recommended minimum RAM?",options:["4 GB","8 GB","16 GB","64 GB"],correctIndex:2,explanation:"For two concurrent sandboxes, 16-32 GB of RAM is recommended. 8 GB is the absolute minimum for a single sandbox, and 4 GB is insufficient. 64 GB is recommended for production multi-sandbox deployments."})]})}const W=Object.freeze(Object.defineProperty({__proto__:null,default:d},Symbol.toStringTag,{value:"Module"}));function c(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Software Requirements"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw depends on a small but specific set of software tools to function correctly. The CLI itself is a Node.js application distributed via npm, and it orchestrates sandboxes through a container runtime (Docker). Before installing NemoClaw, you must ensure that each dependency is present and meets the minimum version requirements."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This section covers the required software, the minimum version for each, how to verify that your system meets the requirements, and platform-specific notes for the container runtime."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Required Software Overview"}),e.jsx(s,{title:"Software Dependencies",headers:["Software","Minimum Version","Purpose"],rows:[["Node.js","20.0+","Runs the NemoClaw CLI and OpenShell runtime"],["npm","10.0+","Installs NemoClaw and manages packages"],["Docker Engine","24.0+","Provides container runtime for sandboxes"],["Git","2.30+","Used for blueprint versioning and updates"],["OpenShell","Latest (installed by NemoClaw)","The agent execution shell inside sandboxes"]]}),e.jsx(a,{type:"info",title:"OpenShell is Installed Automatically",children:e.jsx("p",{children:"You do not need to install OpenShell manually. The NemoClaw onboard process downloads and configures OpenShell inside the sandbox as part of the blueprint. You only need to ensure the other four dependencies (Node.js, npm, Docker, Git) are installed on the host."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Node.js 20+"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw requires Node.js version 20 or later. This is because the CLI uses modern JavaScript features including native fetch, structured clone, and the updated module resolution algorithm introduced in Node.js 20. Earlier versions will fail with syntax errors or missing API calls."}),e.jsx(t,{title:"Check Node.js version",language:"bash",code:`node --version
# Expected output: v20.x.x or higher (e.g., v20.11.0, v22.3.0)

# If Node.js is not installed or the version is too old:
# On Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using nvm (recommended for managing multiple versions):
nvm install 20
nvm use 20`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"npm 10+"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"npm version 10 or later is required. Node.js 20 ships with npm 10 by default, so if you install Node.js 20+, you typically already have the correct npm version. However, if you have upgraded Node.js in place or are using a version manager, your npm version may be outdated."}),e.jsx(t,{title:"Check and update npm",language:"bash",code:`# Check npm version
npm --version
# Expected: 10.x.x or higher

# If npm is too old, update it:
npm install -g npm@latest

# Verify after update:
npm --version`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Docker (Container Runtime)"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw uses Docker to create and manage sandbox containers. The specific Docker setup varies by platform:"}),e.jsx(s,{title:"Container Runtime by Platform",headers:["Platform","Recommended Runtime","Notes"],rows:[["Ubuntu / Debian Linux","Docker Engine (CE)","Install from Docker official repo"],["macOS","Colima","Lightweight CLI-based; avoids Docker Desktop licensing"],["Windows","Docker Desktop with WSL2 backend","Must run inside WSL2 Ubuntu instance"],["Other Linux","Docker Engine (CE)","May need manual kernel module configuration"]]}),e.jsx(t,{title:"Check Docker version",language:"bash",code:`# Check Docker is installed and accessible
docker --version
# Expected: Docker version 24.x.x or higher

# Verify Docker daemon is running
docker info > /dev/null 2>&1 && echo "Docker is running" || echo "Docker is NOT running"

# Test that you can run containers
docker run --rm hello-world`}),e.jsx(n,{title:"Docker Must Be Accessible Without sudo",children:e.jsxs("p",{children:["NemoClaw invokes Docker commands without sudo. If running ",e.jsx("code",{children:"docker ps"})," requires sudo on your system, the NemoClaw CLI will fail. You must add your user to the docker group (covered in the Docker configuration section) or use a rootless Docker setup."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Git"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Git is used by NemoClaw for blueprint versioning, updates, and certain internal operations. Most Linux distributions include Git by default, but you should verify the version."}),e.jsx(t,{title:"Check Git version",language:"bash",code:`git --version
# Expected: git version 2.30.x or higher

# Install if missing (Ubuntu/Debian):
sudo apt-get install -y git`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"All-in-One Version Check Script"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Use this script to quickly verify that all required software is installed and meets the minimum version requirements. Save it and run it before proceeding with NemoClaw installation."}),e.jsx(t,{title:"check-prerequisites.sh",language:"bash",code:`#!/usr/bin/env bash
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
echo "=== Check Complete ==="`}),e.jsx(a,{type:"tip",title:"Save and Run the Check Script",children:e.jsxs("p",{children:["Copy this script to a file, make it executable with ",e.jsx("code",{children:"chmod +x check-prerequisites.sh"}),", and run it with ",e.jsx("code",{children:"./check-prerequisites.sh"}),". Fix any [FAIL] items before proceeding to the NemoClaw installation steps."]})}),e.jsx(i,{term:"OpenShell",definition:"The secure shell environment that runs inside NemoClaw sandboxes. OpenShell provides the execution context for AI agents, implementing command filtering, filesystem restrictions, and network policies. It is the interface between the agent and the sandboxed operating system.",example:"When an agent executes `ls /home`, OpenShell intercepts the command, checks it against the active policy, and either permits or denies execution.",seeAlso:["Sandbox","Security Policy","Agent Runtime"]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With all prerequisites verified, you are ready to move on to the next section, where we cover which Linux distributions and operating systems are officially supported by NemoClaw."})]})}const E=Object.freeze(Object.defineProperty({__proto__:null,default:c},Symbol.toStringTag,{value:"Module"}));function m(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Supported Distributions and Platforms"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw is designed to run on a range of Linux distributions, macOS, and Windows (via WSL2). However, not all platforms are equal in terms of support and capability. Some distributions offer full feature parity -- including kernel-level sandboxing via Landlock -- while others rely on Docker-based isolation as a fallback. Understanding these differences is important for choosing the right platform for your deployment."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Tier 1: Fully Supported"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Tier 1 platforms receive primary testing and are the recommended environments for NemoClaw deployment. These platforms support all NemoClaw features, including Landlock-based filesystem sandboxing."}),e.jsx(s,{title:"Tier 1 Platforms",headers:["Distribution","Versions","Kernel","Landlock Support"],rows:[["Ubuntu","22.04 LTS, 24.04 LTS","5.15+ / 6.5+","Full support"],["NVIDIA DGX OS","6.x (based on Ubuntu 24.04)","6.5+","Full support"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Tier 2: Supported with Notes"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Tier 2 platforms work with NemoClaw but may require additional configuration steps or have minor limitations compared to Tier 1."}),e.jsx(s,{title:"Tier 2 Platforms",headers:["Platform","Notes","Landlock"],rows:[["Debian 12 (Bookworm)","Kernel 6.1; full Landlock support","Yes"],["Linux Mint 21.x+","Based on Ubuntu 22.04; works out of the box","Yes"],["Pop!_OS 22.04+","Based on Ubuntu; works out of the box","Yes"],["Fedora 38+","Kernel 6.x; requires manual Docker CE install","Yes"],["macOS 13+ (Ventura)","Uses Colima/Docker; no Landlock","No (Docker isolation)"],["Windows 11 + WSL2","Runs inside WSL2 Ubuntu instance","Yes (WSL2 kernel)"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Tier 3: Community / Experimental"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"These platforms may work but are not regularly tested. Use at your own risk and expect to troubleshoot issues independently."}),e.jsx(s,{title:"Tier 3 Platforms",headers:["Platform","Status","Notes"],rows:[["Arch Linux","Community tested","Rolling release; kernel usually new enough"],["openSUSE Tumbleweed","Community tested","Rolling release; Docker from official repos"],["RHEL 9 / Rocky 9 / Alma 9","Experimental","Kernel 5.14; Landlock v1 only"],["Alpine Linux","Not recommended","musl libc may cause compatibility issues"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Kernel Requirements: Landlock"}),e.jsx(i,{term:"Landlock",definition:"A Linux Security Module (LSM) introduced in kernel 5.13 that allows unprivileged processes to restrict their own access to the filesystem, network, and other resources. NemoClaw uses Landlock to enforce fine-grained security policies on agent operations without requiring root privileges.",example:"A Landlock policy can restrict an agent to only read files in /home/agent/workspace and write to /tmp, even if the process runs as a user with broader filesystem permissions.",seeAlso:["Linux Security Module","Sandbox Policy","seccomp"]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Landlock is a critical component of NemoClaw's security model on Linux. It provides kernel-enforced filesystem and network restrictions that cannot be bypassed by the sandboxed agent, even if the agent gains code execution. Different kernel versions provide different levels of Landlock functionality:"}),e.jsx(s,{title:"Landlock Versions by Kernel",headers:["Kernel Version","Landlock ABI","Capabilities"],rows:[["< 5.13","None","No Landlock; must rely on Docker isolation only"],["5.13 - 5.18","ABI v1","Filesystem read/write/execute restrictions"],["5.19 - 6.1","ABI v2","Adds file rename/link restrictions"],["6.2+","ABI v3","Adds file truncate restrictions"],["6.7+","ABI v4","Adds network (TCP bind/connect) restrictions"]]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw requires at minimum Landlock ABI v1 (kernel 5.13+) for host-level sandboxing. For full network policy enforcement at the kernel level, kernel 6.7+ with ABI v4 is recommended. On systems without Landlock support, NemoClaw falls back to Docker-only isolation, which is still secure but provides a different (coarser) level of restriction."}),e.jsx(t,{title:"Check kernel version and Landlock support",language:"bash",code:`# Check kernel version
uname -r
# Example output: 6.5.0-44-generic

# Check if Landlock is enabled in the kernel
cat /sys/kernel/security/lsm
# Should include "landlock" in the comma-separated list
# Example: lockdown,capability,landlock,yama,apparmor

# Check the Landlock ABI version
cat /sys/fs/landlock/abi_version 2>/dev/null || echo "Landlock not available"
# Example output: 4`}),e.jsx(n,{title:"Kernel Too Old for Landlock",children:e.jsxs("p",{children:["If your kernel is older than 5.13, Landlock is not available. NemoClaw will still work using Docker-based isolation, but you will see a warning during onboarding:",e.jsx("code",{className:"block mt-2 text-xs",children:"WARNING: Landlock not detected. Falling back to container-only isolation."}),"To get full Landlock support on an older distribution, you can upgrade your kernel or switch to a distribution with a newer default kernel (Ubuntu 22.04+ is recommended)."]})}),e.jsx(a,{type:"info",title:"macOS and Windows Do Not Use Landlock",children:e.jsx("p",{children:"Landlock is a Linux-specific kernel feature. On macOS, NemoClaw runs sandboxes inside a Docker-managed Linux VM (via Colima or Docker Desktop), so Landlock is available inside the VM's kernel. On Windows WSL2, the WSL2 kernel (based on Linux 5.15+) supports Landlock natively. In both cases, NemoClaw handles the abstraction automatically."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Architecture Support"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw supports both x86_64 (Intel/AMD) and ARM64 (Apple Silicon, Ampere, Graviton) architectures. The sandbox blueprint images are published for both architectures, and the correct image is selected automatically during onboarding."}),e.jsx(t,{title:"Check system architecture",language:"bash",code:`# Check architecture
uname -m
# x86_64 = Intel/AMD 64-bit
# aarch64 = ARM 64-bit (Apple Silicon, Graviton, etc.)

# On macOS:
arch
# arm64 = Apple Silicon
# x86_64 = Intel Mac`}),e.jsx(r,{question:"Which Linux kernel version first introduced Landlock with network (TCP) restriction capabilities?",options:["Kernel 5.13","Kernel 5.19","Kernel 6.2","Kernel 6.7"],correctIndex:3,explanation:"Landlock ABI v4, introduced in kernel 6.7, added TCP bind and connect network restrictions. Earlier versions only provided filesystem-level controls."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Now that you understand the supported platforms and their capabilities, the following chapters provide step-by-step installation guides for each major platform: Ubuntu 22.04, Ubuntu 24.04 / DGX, macOS, and Windows WSL2."})]})}const R=Object.freeze(Object.defineProperty({__proto__:null,default:m},Symbol.toStringTag,{value:"Module"}));function u(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Installing Dependencies on Ubuntu 22.04"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Ubuntu 22.04 LTS (Jammy Jellyfish) is the primary recommended platform for NemoClaw. It ships with kernel 5.15 (Landlock ABI v1 supported) and has a straightforward package management system. This section walks through installing every dependency NemoClaw needs from a fresh Ubuntu 22.04 installation."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Follow each step in order. If you already have some of these packages installed, you can skip ahead, but it is worth running the version checks at each step to confirm compatibility."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 1: Update the System"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Before installing anything, ensure your package index and installed packages are up to date. This avoids dependency conflicts and ensures you get the latest security patches."}),e.jsx(o,{title:"Update and upgrade system packages",steps:[{title:"Update the package index",content:"Refresh the list of available packages from all configured repositories.",code:"sudo apt update"},{title:"Upgrade installed packages",content:"Apply any pending upgrades to existing packages.",code:"sudo apt upgrade -y"},{title:"Install essential build tools",content:"These are needed by some npm packages that compile native addons.",code:"sudo apt install -y build-essential curl wget ca-certificates gnupg lsb-release"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 2: Install Node.js 20"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Ubuntu 22.04's default repositories ship Node.js 12, which is far too old for NemoClaw. You need to add the NodeSource repository to get Node.js 20. This is the officially recommended method for installing modern Node.js on Ubuntu."}),e.jsx(o,{title:"Install Node.js 20 from NodeSource",steps:[{title:"Add the NodeSource GPG key and repository",content:"This script configures your system to pull Node.js 20 from the NodeSource APT repository.",code:"curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"},{title:"Install Node.js",content:"This installs both the Node.js runtime and npm.",code:"sudo apt-get install -y nodejs"},{title:"Verify Node.js and npm versions",content:"Confirm that both are at the required minimum versions.",code:`node --version
# Expected: v20.x.x

npm --version
# Expected: 10.x.x`}]}),e.jsx(a,{type:"tip",title:"Alternative: Using nvm",children:e.jsxs("p",{children:["If you prefer to manage multiple Node.js versions, you can use nvm (Node Version Manager) instead. Install nvm from ",e.jsx("code",{children:"https://github.com/nvm-sh/nvm"}),", then run ",e.jsx("code",{children:"nvm install 20"})," and ",e.jsx("code",{children:"nvm use 20"}),". This is especially useful if you work on other projects that require different Node.js versions."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 3: Install Docker Engine"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Docker Engine (Community Edition) provides the container runtime that NemoClaw uses to create and manage sandboxes. Do not install Docker from the default Ubuntu repository (",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"docker.io"}),"), as it is often outdated. Use the official Docker repository instead."]}),e.jsx(o,{title:"Install Docker Engine from the official repository",steps:[{title:"Remove any old Docker packages",content:"Uninstall conflicting packages that may be present from previous installations.",code:"sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true"},{title:"Add Docker official GPG key",content:"Download and install the GPG key used to verify Docker packages.",code:`sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \\
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg`},{title:"Add the Docker repository",content:"Configure APT to pull Docker packages from the official repository.",code:`echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \\
  https://download.docker.com/linux/ubuntu \\
  $(lsb_release -cs) stable" | \\
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`},{title:"Install Docker Engine and plugins",content:"Update the package index and install Docker along with its CLI plugins.",code:`sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \\
  docker-buildx-plugin docker-compose-plugin`},{title:"Verify Docker installation",content:"Check that Docker is installed and the daemon is running.",code:`docker --version
# Expected: Docker version 24.x.x or higher

sudo docker run --rm hello-world
# Should print "Hello from Docker!"`}]}),e.jsx(n,{title:"Do Not Use snap Docker",children:e.jsx("p",{children:"Ubuntu sometimes offers Docker as a snap package. Do not install Docker via snap for NemoClaw. The snap version has different filesystem permissions and volume mount behavior that causes sandbox creation to fail. Always use the APT-based installation from the official Docker repository as shown above."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 4: Install Git"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Git is typically already installed on Ubuntu 22.04, but verify it is present and up to date."}),e.jsx(t,{title:"Install and verify Git",language:"bash",code:`sudo apt-get install -y git
git --version
# Expected: git version 2.34.x or higher`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 5: Final Verification"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Run a final check to confirm all dependencies are installed and at the correct versions."}),e.jsx(t,{title:"Final dependency check",language:"bash",code:`echo "Node.js: $(node --version)"
echo "npm:     $(npm --version)"
echo "Docker:  $(docker --version)"
echo "Git:     $(git --version)"
echo "Kernel:  $(uname -r)"
echo ""
echo "Landlock: $(cat /sys/fs/landlock/abi_version 2>/dev/null || echo 'not available')"
echo "Arch:     $(uname -m)"`}),e.jsx(a,{type:"info",title:"Expected Output",children:e.jsx("p",{children:"You should see Node.js v20+, npm 10+, Docker 24+, Git 2.30+, and a kernel version of 5.15 or higher. The Landlock ABI version should be 1 or higher on Ubuntu 22.04. If any of these are missing or below the minimum version, revisit the corresponding step above."})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With all dependencies installed, the next step is to configure Docker so that your user account can run containers without sudo -- a requirement for NemoClaw to function correctly."})]})}const V=Object.freeze(Object.defineProperty({__proto__:null,default:u},Symbol.toStringTag,{value:"Module"}));function h(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Docker Post-Install Configuration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"After installing Docker Engine, several post-installation steps are required before NemoClaw can use it effectively. The most critical step is allowing your user account to run Docker commands without sudo. NemoClaw's CLI invokes Docker directly, and it does not prepend sudo to any Docker commands. If Docker requires root privileges, every NemoClaw operation will fail."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This section covers user group configuration, daemon settings, storage driver considerations, and verification that Docker is fully ready for NemoClaw."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Add Your User to the Docker Group"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["When Docker is installed, it creates a Unix group called ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"docker"}),". Members of this group can communicate with the Docker daemon socket without root privileges. Adding your user to this group is the standard way to enable rootless Docker access."]}),e.jsx(o,{title:"Configure non-root Docker access",steps:[{title:"Create the docker group (if it does not exist)",content:"On most installations this group already exists, but running the command is harmless if it does.",code:"sudo groupadd docker 2>/dev/null || true"},{title:"Add your user to the docker group",content:"Replace $USER with your username if needed. This grants Docker socket access.",code:"sudo usermod -aG docker $USER"},{title:"Activate the group change",content:"You must log out and log back in for the group change to take effect. Alternatively, use newgrp for the current session.",code:`# Option A: Log out and back in (recommended)
# Option B: Activate in current shell session
newgrp docker`},{title:"Verify non-root access",content:"Run a Docker command without sudo to confirm it works.",code:`docker ps
# Should show an empty container list (no "permission denied" error)

docker run --rm hello-world
# Should print "Hello from Docker!" without sudo`}]}),e.jsx(n,{title:"Security Implications of the Docker Group",children:e.jsx("p",{children:"Adding a user to the docker group effectively grants them root-equivalent privileges on the host, because Docker containers can mount host filesystems and run as root inside containers. This is acceptable for development workstations, but on shared servers or production systems, consider using rootless Docker mode instead. NemoClaw supports both approaches."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Configure the Docker Daemon"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The Docker daemon can be configured via the ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"/etc/docker/daemon.json"})," file. While the defaults work for most NemoClaw setups, there are several settings worth configuring for optimal performance and reliability."]}),e.jsx(t,{title:"/etc/docker/daemon.json - Recommended configuration",language:"json",code:`{
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
}`}),e.jsx(o,{title:"Apply the daemon configuration",steps:[{title:"Create or edit the daemon configuration file",content:"Write the recommended configuration to daemon.json.",code:`sudo mkdir -p /etc/docker
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
EOF`},{title:"Restart the Docker daemon",content:"Apply the new configuration by restarting the service.",code:`sudo systemctl restart docker
sudo systemctl status docker
# Should show "active (running)"`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Storage Driver Considerations"}),e.jsx(i,{term:"overlay2",definition:"The recommended Docker storage driver for modern Linux kernels. overlay2 uses the OverlayFS filesystem to efficiently layer container images, sharing common base layers between containers and using copy-on-write for per-container modifications. This is critical for NemoClaw because multiple sandboxes share the same base blueprint image.",example:"Two NemoClaw sandboxes created from the same blueprint share the ~6 GB base image layer. Each sandbox only stores its own modifications (agent-created files, installed packages) in a separate writable layer, typically 1-3 GB.",seeAlso:["Copy-on-Write","Container Layer","Blueprint Image"]}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"overlay2"})," storage driver is the default on modern Ubuntu systems and is the only driver recommended for NemoClaw. Older drivers like ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"aufs"})," or",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"devicemapper"})," are deprecated and may cause performance issues or outright failures."]}),e.jsx(t,{title:"Verify storage driver",language:"bash",code:`docker info | grep "Storage Driver"
# Expected: Storage Driver: overlay2

# Check the Docker root directory and disk usage
docker info | grep "Docker Root Dir"
# Default: /var/lib/docker

# Check current disk usage
docker system df`}),e.jsx(a,{type:"tip",title:"Moving Docker Data to a Larger Disk",children:e.jsxs("p",{children:["If your root partition is small but you have a large secondary disk, you can move Docker's data directory. Add ",e.jsx("code",{children:'"data-root": "/mnt/large-disk/docker"'})," to your daemon.json, stop Docker, move the existing data, and restart. This is common on cloud instances where the root volume is 20 GB but an attached volume provides hundreds of GB."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Enable Docker to Start on Boot"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Ensure Docker starts automatically when the system boots. This is important for production deployments and convenient for development machines."}),e.jsx(t,{title:"Enable Docker auto-start",language:"bash",code:`sudo systemctl enable docker
sudo systemctl enable containerd

# Verify both are enabled
systemctl is-enabled docker
# Expected: enabled

systemctl is-enabled containerd
# Expected: enabled`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Full Verification"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Run this comprehensive verification to confirm Docker is fully configured and ready for NemoClaw."}),e.jsx(t,{title:"Docker readiness check",language:"bash",code:`echo "=== Docker Configuration Check ==="

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

echo "=== Check Complete ==="`}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If all checks pass, Docker is ready for NemoClaw. The next step is to install NemoClaw itself and run the onboarding process, which downloads the sandbox blueprint and creates your first sandbox."})]})}const B=Object.freeze(Object.defineProperty({__proto__:null,default:h},Symbol.toStringTag,{value:"Module"}));function p(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Installing NemoClaw and Onboarding"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With all dependencies in place -- Node.js 20+, npm 10+, Docker running without sudo, and Git installed -- you are ready to install NemoClaw and create your first sandbox. The installation process has two phases: installing the NemoClaw CLI, and running the onboard command that downloads the blueprint image and creates a sandbox."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Phase 1: Install the NemoClaw CLI"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw provides a one-line install script that downloads the CLI, verifies its integrity, and installs it globally on your system. This script handles architecture detection (x86_64 vs ARM64) automatically."}),e.jsx(o,{title:"Install the NemoClaw CLI",steps:[{title:"Run the install script",content:"This downloads and installs the NemoClaw CLI binary and its Node.js dependencies.",code:"curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash"},{title:"Verify the installation",content:"Check that the nemoclaw command is available and displays its version.",code:`nemoclaw --version
# Expected: nemoclaw vX.Y.Z

# If "command not found", add to PATH:
export PATH="$HOME/.nemoclaw/bin:$PATH"
# Add this line to your ~/.bashrc or ~/.zshrc for persistence`},{title:"Check the CLI help",content:"View the available commands to confirm the CLI is working.",code:`nemoclaw --help
# Should display a list of available commands including:
#   onboard    - Create a new sandbox from a blueprint
#   list       - List all sandboxes
#   connect    - Connect to a sandbox
#   status     - Check sandbox status
#   logs       - View sandbox logs`}]}),e.jsx(a,{type:"info",title:"What the Install Script Does",children:e.jsxs("p",{children:["The install script performs the following steps: (1) detects your OS and architecture, (2) downloads the appropriate NemoClaw binary and Node.js dependencies, (3) verifies the download checksum against the published manifest, (4) installs the CLI to ",e.jsx("code",{children:"~/.nemoclaw/bin/nemoclaw"}),", and (5) adds the binary path to your shell profile if not already present. The script does not require root privileges."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Phase 2: Run the Onboard Command"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw onboard"})," command is the primary setup command. It downloads a sandbox blueprint, verifies it, and creates your first NemoClaw sandbox. This process takes several minutes depending on your internet connection speed, as it downloads the ~2.4 GB compressed blueprint image."]}),e.jsx(o,{title:"Run the onboarding process",steps:[{title:"Start the onboard process",content:"This interactive command walks you through creating your first sandbox.",code:"nemoclaw onboard"},{title:"Provide a sandbox name",content:"You will be prompted to name your sandbox. Choose a descriptive name.",code:`# The CLI will prompt:
# ? Sandbox name: my-dev-sandbox
# Use lowercase letters, numbers, and hyphens only`},{title:"Wait for the blueprint download",content:"The CLI downloads and verifies the sandbox blueprint image. This is the longest step.",code:`# You will see progress output like:
# Downloading blueprint nemoclaw-base:latest...
# [=============>              ] 1.2 GB / 2.4 GB  50%
# Verifying image integrity... OK
# Extracting layers... done`},{title:"Sandbox creation completes",content:"Once the blueprint is downloaded and extracted, the sandbox is created and started.",code:`# Final output:
# Creating sandbox "my-dev-sandbox"...
# Applying default security policy...
# Starting OpenShell runtime...
# Sandbox "my-dev-sandbox" is ready.
#
# Connect with: nemoclaw my-dev-sandbox connect`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"What Happens During Onboarding"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Understanding what happens behind the scenes during onboarding helps with troubleshooting and gives you a clearer mental model of the NemoClaw architecture. The onboard process performs these operations in sequence:"}),e.jsx(i,{term:"Blueprint",definition:"A versioned, immutable container image that serves as the base for NemoClaw sandboxes. A blueprint contains a minimal Linux userland, the OpenShell runtime, default security policies, and standard tooling. Blueprints are published and signed by the NemoClaw team.",example:"The nemoclaw-base:latest blueprint includes Ubuntu 22.04 userland, OpenShell v3.x, Node.js 20, Python 3.11, and a default read-only security policy.",seeAlso:["Sandbox","OpenShell","Security Policy"]}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Blueprint Download:"})," The CLI pulls the latest blueprint image from the NemoClaw registry. The image is ~2.4 GB compressed and is stored in the local Docker image cache."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Integrity Verification:"})," The downloaded image's SHA-256 digest is compared against the signed manifest published by the NemoClaw team. If the digest does not match, the onboard process aborts with an error."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Sandbox Container Creation:"})," A Docker container is created from the blueprint image with the appropriate volume mounts, network configuration, and resource limits."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Policy Application:"})," The default security policy is written to the sandbox's configuration directory. This policy defines the initial set of filesystem, network, and command restrictions."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"OpenShell Initialization:"})," The OpenShell runtime starts inside the sandbox, reads the security policy, and begins listening for connections. OpenShell is the secure shell that agents use to interact with the sandbox."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Health Check:"})," The CLI performs a health check to confirm the sandbox is running, OpenShell is responsive, and the security policy is active."]})]}),e.jsx(t,{title:"Inspect the created sandbox",language:"bash",code:`# List all NemoClaw sandboxes
nemoclaw list
# Output:
# NAME              STATUS    CREATED          BLUEPRINT
# my-dev-sandbox    running   2 minutes ago    nemoclaw-base:latest

# View the underlying Docker container
docker ps --filter "label=nemoclaw.sandbox"
# Shows the Docker container backing the sandbox`}),e.jsx(n,{title:"Do Not Modify the Docker Container Directly",children:e.jsxs("p",{children:["The Docker container backing a NemoClaw sandbox should only be managed through the NemoClaw CLI. Do not use ",e.jsx("code",{children:"docker stop"}),", ",e.jsx("code",{children:"docker rm"}),", or",e.jsx("code",{children:"docker exec"})," directly on the container. Doing so can corrupt the sandbox state and bypass security policies. Always use ",e.jsx("code",{children:"nemoclaw"})," commands instead."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Onboard Options"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The onboard command accepts several optional flags for advanced use cases:"}),e.jsx(t,{title:"Onboard command options",language:"bash",code:`# Specify a custom sandbox name
nemoclaw onboard --name my-project

# Use a specific blueprint version instead of latest
nemoclaw onboard --blueprint nemoclaw-base:v2.1.0

# Set custom resource limits
nemoclaw onboard --cpus 4 --memory 8g

# Skip the interactive prompts (use defaults)
nemoclaw onboard --name my-sandbox --yes

# Specify a custom policy file
nemoclaw onboard --policy ./my-custom-policy.yaml`}),e.jsx(a,{type:"tip",title:"Multiple Sandboxes",children:e.jsxs("p",{children:["You can run ",e.jsx("code",{children:"nemoclaw onboard"})," multiple times to create multiple sandboxes. Each sandbox is independent with its own security policy, filesystem state, and OpenShell instance. The second onboard is much faster because the blueprint image is already cached locally -- only the container creation and initialization steps are needed."]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With onboarding complete, your sandbox is running and ready to accept connections. The next section covers how to verify the installation and check the health of your sandbox."})]})}const _=Object.freeze(Object.defineProperty({__proto__:null,default:p},Symbol.toStringTag,{value:"Module"}));function g(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Verifying the Installation"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["After running ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw onboard"}),", you should have a running sandbox. Before using it for real work, it is important to verify that everything is functioning correctly: the sandbox is in a healthy state, OpenShell is responding, security policies are applied, and you can connect successfully."]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This section covers the essential verification commands and what their output should look like when everything is working correctly."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"List All Sandboxes"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw list"})," command shows all sandboxes on the system, their current status, and key metadata."]}),e.jsx(t,{title:"List sandboxes",language:"bash",code:`nemoclaw list

# Expected output:
# NAME              STATUS    BLUEPRINT              CREATED           UPTIME
# my-dev-sandbox    running   nemoclaw-base:latest   5 minutes ago     5m 12s

# For more detail, use the verbose flag:
nemoclaw list -v

# Output includes additional columns:
# NAME              STATUS    BLUEPRINT              CPUS   MEMORY   PORTS          POLICY
# my-dev-sandbox    running   nemoclaw-base:latest   2      4 GB     8080->8080     default`}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The STATUS column should show ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"running"}),". Other possible states include ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"stopped"}),",",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"starting"}),",",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"error"}),", and",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"degraded"}),". If the status is anything other than ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"running"}),", consult the troubleshooting section."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Check Sandbox Status"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The ",e.jsxs("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:["nemoclaw ","<name>"," status"]})," command provides detailed health information for a specific sandbox, including the state of each internal component."]}),e.jsx(t,{title:"Detailed sandbox status",language:"bash",code:`nemoclaw my-dev-sandbox status

# Expected output:
# Sandbox: my-dev-sandbox
# Status:  running
# Uptime:  7m 34s
#
# Components:
#   Container    running    (Docker: abc123def456)
#   OpenShell    healthy    (PID: 1842, listening on :8022)
#   Policy       applied    (default, 12 rules active)
#   Network      up         (172.17.0.2, bridge mode)
#   Filesystem   ok         (overlay2, 234 MB used)
#
# Resources:
#   CPU:    2 cores allocated, 0.3% current usage
#   Memory: 4 GB allocated, 412 MB current usage
#   Disk:   234 MB writable layer used`}),e.jsx(a,{type:"info",title:"Understanding the Components",children:e.jsx("p",{children:"Each component in the status output represents a critical piece of the sandbox. The Container is the Docker container itself. OpenShell is the secure shell runtime that agents connect to. Policy shows whether security rules are loaded and active. Network shows the sandbox's IP address and networking mode. Filesystem shows the storage driver and disk usage."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Test the Connection"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The ultimate verification is connecting to the sandbox and confirming you can interact with it."}),e.jsx(o,{title:"Connect to the sandbox for the first time",steps:[{title:"Connect using the NemoClaw CLI",content:"This opens an interactive OpenShell session inside the sandbox.",code:"nemoclaw my-dev-sandbox connect"},{title:"Verify you are inside the sandbox",content:"Run basic commands to confirm the sandbox environment is working.",code:`# Inside the sandbox shell:
whoami
# Expected: agent

hostname
# Expected: my-dev-sandbox

cat /etc/nemoclaw/sandbox.conf | head -5
# Shows sandbox configuration

echo "Hello from inside the sandbox!"`},{title:"Check OpenShell version",content:"Verify the OpenShell runtime is the expected version.",code:`openshell --version
# Expected: OpenShell vX.Y.Z`},{title:"Test policy enforcement",content:"Try an operation that should be blocked by the default policy.",code:`# The default policy blocks access to /etc/shadow:
cat /etc/shadow
# Expected: Permission denied (policy: filesystem.read.deny)

# The default policy allows reading files in the workspace:
ls /home/agent/
# Expected: workspace/`},{title:"Disconnect from the sandbox",content:"Exit the OpenShell session to return to your host shell.",code:`exit
# Returns you to the host shell`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Verify from the Host Side"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"You can also verify the sandbox from the host without connecting to it. These commands are useful for scripting and monitoring."}),e.jsx(t,{title:"Host-side verification commands",language:"bash",code:`# Ping the sandbox health endpoint
nemoclaw my-dev-sandbox health
# Expected: healthy

# Run a single command inside the sandbox (non-interactive)
nemoclaw my-dev-sandbox exec -- echo "Sandbox is working"
# Expected: Sandbox is working

# Check the sandbox's IP address
nemoclaw my-dev-sandbox inspect --format '{{.NetworkSettings.IPAddress}}'
# Expected: 172.17.0.2 (or similar)

# View the active policy summary
nemoclaw my-dev-sandbox policy show
# Shows the current security policy rules`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Comprehensive Verification Script"}),e.jsx(t,{title:"verify-installation.sh",language:"bash",code:`#!/usr/bin/env bash
SANDBOX="my-dev-sandbox"

echo "=== NemoClaw Installation Verification ==="

# Check CLI
nemoclaw --version > /dev/null 2>&1 && \\
  echo "[OK] NemoClaw CLI: $(nemoclaw --version)" || \\
  echo "[FAIL] NemoClaw CLI not found"

# Check sandbox exists
nemoclaw list 2>/dev/null | grep -q "$SANDBOX" && \\
  echo "[OK] Sandbox '$SANDBOX' exists" || \\
  echo "[FAIL] Sandbox '$SANDBOX' not found"

# Check sandbox status
STATUS=$(nemoclaw "$SANDBOX" status 2>/dev/null | grep "^Status:" | awk '{print $2}')
[ "$STATUS" = "running" ] && \\
  echo "[OK] Sandbox status: running" || \\
  echo "[FAIL] Sandbox status: $STATUS"

# Check health
HEALTH=$(nemoclaw "$SANDBOX" health 2>/dev/null)
[ "$HEALTH" = "healthy" ] && \\
  echo "[OK] Sandbox health: healthy" || \\
  echo "[FAIL] Sandbox health: $HEALTH"

# Check exec
EXEC_OUT=$(nemoclaw "$SANDBOX" exec -- echo "test" 2>/dev/null)
[ "$EXEC_OUT" = "test" ] && \\
  echo "[OK] Command execution works" || \\
  echo "[FAIL] Command execution failed"

echo "=== Verification Complete ==="`}),e.jsx(r,{question:"After running `nemoclaw onboard`, which command should you use to check if all sandbox components (container, OpenShell, policy, network, filesystem) are healthy?",options:["nemoclaw list","nemoclaw <name> status","nemoclaw <name> connect","docker inspect <container-id>"],correctIndex:1,explanation:"The `nemoclaw <name> status` command shows the detailed health of each sandbox component. `nemoclaw list` shows a summary, `connect` opens an interactive session, and `docker inspect` bypasses NemoClaw's abstraction layer."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If all checks pass, your NemoClaw installation is verified and ready for use. If any check fails, the next section covers common issues and their solutions."})]})}const F=Object.freeze(Object.defineProperty({__proto__:null,default:g},Symbol.toStringTag,{value:"Module"}));function x(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Troubleshooting Ubuntu 22.04 Installation"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Even with careful preparation, issues can arise during NemoClaw installation and onboarding. This section catalogs the most common problems encountered on Ubuntu 22.04, explains their root causes, and provides step-by-step solutions. If you encounter an issue not covered here, the ",e.jsxs("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:["nemoclaw ","<name>"," logs"]})," command is your best starting point for diagnosis."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: Docker Daemon Not Running"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This is the most common issue. NemoClaw reports that it cannot connect to Docker, or sandbox creation fails immediately."}),e.jsx(n,{title:"Error: Cannot connect to the Docker daemon",children:e.jsxs("p",{children:["If you see ",e.jsx("code",{children:"Error: Cannot connect to the Docker daemon at unix:///var/run/docker.sock"}),", the Docker service is not running or your user cannot access the Docker socket."]})}),e.jsx(o,{title:"Fix: Start Docker and verify access",steps:[{title:"Check if Docker is running",content:"Use systemctl to check the Docker service status.",code:`sudo systemctl status docker
# If "inactive (dead)" or "failed":
sudo systemctl start docker`},{title:"Enable Docker to start on boot",content:"Prevent this issue from recurring after reboot.",code:"sudo systemctl enable docker"},{title:"Verify your user is in the docker group",content:"NemoClaw requires Docker access without sudo.",code:`groups | grep docker
# If "docker" is not listed:
sudo usermod -aG docker $USER
newgrp docker`},{title:"Test Docker access",content:"Confirm Docker works without sudo.",code:"docker ps"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: Port Conflicts"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw sandboxes expose ports for OpenShell communication and any services the agent runs. If another process is already using a required port, sandbox creation or startup will fail."}),e.jsx(n,{title:"Error: Port 8022 is already in use",children:e.jsx("p",{children:"This error means another process (possibly another sandbox or a local SSH server) is already bound to port 8022."})}),e.jsx(t,{title:"Find and resolve port conflicts",language:"bash",code:`# Find what is using port 8022
sudo lsof -i :8022
# Or:
sudo ss -tlnp | grep 8022

# If it is another NemoClaw sandbox, stop it first:
nemoclaw other-sandbox stop

# If it is an unrelated process, either stop that process or
# onboard with a different port:
nemoclaw onboard --name my-sandbox --port 8023

# To see all ports used by NemoClaw sandboxes:
nemoclaw list -v | grep -E "PORTS|->"`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: Insufficient RAM"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If the system does not have enough available memory, sandbox creation may succeed but the sandbox will immediately enter an error or degraded state as the OOM killer terminates processes."}),e.jsx(n,{title:"Sandbox enters 'error' state immediately after creation",children:e.jsxs("p",{children:["If ",e.jsxs("code",{children:["nemoclaw ","<name>"," status"]}),' shows "error" and the logs mention "Out of memory" or "OOM killed", your system does not have enough RAM for the sandbox.']})}),e.jsx(t,{title:"Diagnose and fix memory issues",language:"bash",code:`# Check available memory
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
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: Kernel Too Old for Landlock"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If your kernel is older than 5.13, NemoClaw cannot use Landlock for host-level sandboxing. This does not prevent NemoClaw from working -- it falls back to Docker-only isolation -- but you will see a warning."}),e.jsx(t,{title:"Check and upgrade kernel",language:"bash",code:`# Check current kernel version
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
# Should show 3 or higher`}),e.jsx(a,{type:"tip",title:"HWE Kernel on Ubuntu 22.04",children:e.jsx("p",{children:"Ubuntu 22.04 ships with kernel 5.15 by default, which supports Landlock ABI v1. Installing the HWE (Hardware Enablement) kernel upgrades you to kernel 6.5, which provides Landlock ABI v3 with file truncate restrictions. This is the recommended approach if you want enhanced Landlock capabilities without upgrading to Ubuntu 24.04."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: Blueprint Download Fails"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The blueprint image is ~2.4 GB and is downloaded from the NemoClaw registry. Network issues can cause the download to fail or time out."}),e.jsx(t,{title:"Fix blueprint download issues",language:"bash",code:`# Check connectivity to the NemoClaw registry
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
nemoclaw onboard --local-image nemoclaw-base:latest`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: Disk Space Exhaustion"}),e.jsx(n,{title:"Error: No space left on device",children:e.jsxs("p",{children:["Docker images and containers are stored under ",e.jsx("code",{children:"/var/lib/docker"})," by default. If this partition runs out of space, sandbox creation and operation will fail."]})}),e.jsx(t,{title:"Reclaim disk space",language:"bash",code:`# Check disk usage
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
sudo systemctl start docker`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"General Debugging Commands"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When you encounter an issue not listed above, these commands help gather diagnostic information."}),e.jsx(t,{title:"Diagnostic information gathering",language:"bash",code:`# View sandbox logs
nemoclaw my-dev-sandbox logs

# View sandbox logs with timestamps and follow mode
nemoclaw my-dev-sandbox logs --timestamps --follow

# View Docker container logs directly
docker logs $(docker ps -q --filter "label=nemoclaw.name=my-dev-sandbox")

# Check Docker daemon logs
sudo journalctl -u docker --since "1 hour ago" --no-pager

# Generate a diagnostic bundle for support
nemoclaw diagnostics --output /tmp/nemoclaw-diag.tar.gz
# This collects system info, Docker config, sandbox logs, and policy state`}),e.jsx(a,{type:"info",title:"Getting Help",children:e.jsxs("p",{children:["If the troubleshooting steps above do not resolve your issue, the diagnostic bundle generated by ",e.jsx("code",{children:"nemoclaw diagnostics"})," contains all the information needed to file a support request. Include the bundle and a description of the problem when reaching out to the NemoClaw community or support channels."]})})]})}const q=Object.freeze(Object.defineProperty({__proto__:null,default:x},Symbol.toStringTag,{value:"Module"}));function y(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Understanding cgroup v2 on Ubuntu 24.04"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Ubuntu 24.04 LTS (Noble Numbat) introduces a significant change from Ubuntu 22.04: it uses cgroup v2 (also called the unified cgroup hierarchy) as the default and only cgroup implementation. Ubuntu 22.04 used cgroup v1 by default with cgroup v2 available as an opt-in. This change affects how container runtimes manage resource limits and process isolation, and it has direct implications for NemoClaw sandbox management."}),e.jsx(i,{term:"Control Groups (cgroups)",definition:"A Linux kernel feature that organizes processes into hierarchical groups and applies resource limits (CPU, memory, I/O, network) to those groups. Container runtimes like Docker rely heavily on cgroups to enforce resource isolation between containers. cgroup v2 is the modern unified hierarchy that replaces the fragmented v1 implementation.",example:"When NemoClaw creates a sandbox with --memory 4g, Docker uses cgroups to ensure the sandbox container cannot consume more than 4 GB of RAM. If it exceeds this limit, the kernel's OOM killer terminates processes inside the container.",seeAlso:["Container Isolation","Resource Limits","OOM Killer"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"cgroup v1 vs cgroup v2"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The transition from cgroup v1 to v2 is not merely a version bump -- it is a fundamental redesign of how the kernel organizes and controls process resources. Understanding the differences helps explain why some tools and configurations that worked on Ubuntu 22.04 may need adjustment on Ubuntu 24.04."}),e.jsx(s,{title:"cgroup v1 vs cgroup v2",headers:["Feature","cgroup v1","cgroup v2"],highlightDiffs:!0,rows:[["Hierarchy","Multiple hierarchies (one per controller)","Single unified hierarchy"],["Controllers","Each mounted separately (cpu, memory, etc.)","All controllers in one tree"],["Delegation","Complex, error-prone","Clean delegation to unprivileged users"],["Memory accounting","Approximate","Accurate, includes kernel memory"],["PSI (Pressure Stall Info)","Not available","Built-in resource pressure monitoring"],["Default on Ubuntu 22.04","Yes","No (opt-in)"],["Default on Ubuntu 24.04","No (removed)","Yes (only option)"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Impact on Container Runtimes"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Docker Engine 24+ fully supports cgroup v2, so NemoClaw sandboxes work correctly on Ubuntu 24.04 with modern Docker. However, some older tools and container runtimes may have compatibility issues:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Docker Engine 24+:"})," Full cgroup v2 support. No issues. This is what NemoClaw requires."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Docker Engine 20-23:"})," Partial cgroup v2 support. Some resource limit features may not work correctly. Upgrade recommended."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"containerd 1.6+:"})," Full cgroup v2 support."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Older runc versions:"})," Versions before 1.1 may fail to create containers on cgroup v2 systems. Docker 24+ includes a compatible runc."]})]}),e.jsx(t,{title:"Verify cgroup version on your system",language:"bash",code:`# Check which cgroup version is active
stat -fc %T /sys/fs/cgroup/
# "cgroup2fs" = cgroup v2 (Ubuntu 24.04)
# "tmpfs"     = cgroup v1 (Ubuntu 22.04)

# Alternative check:
mount | grep cgroup
# cgroup v2 shows: cgroup2 on /sys/fs/cgroup type cgroup2
# cgroup v1 shows: multiple cgroup mounts (cpu, memory, etc.)

# Check Docker's cgroup driver
docker info | grep "Cgroup"
# Expected on Ubuntu 24.04:
#  Cgroup Driver: systemd
#  Cgroup Version: 2`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Compatibility Issues and Solutions"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The most common cgroup v2 compatibility issue with NemoClaw is the cgroup driver mismatch. Docker can use either the ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"cgroupfs"})," driver or the ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"systemd"})," driver. On Ubuntu 24.04, the systemd driver is required because systemd manages the cgroup hierarchy."]}),e.jsx(n,{title:"Cgroup Driver Mismatch",children:e.jsxs("p",{children:["If Docker is configured to use the ",e.jsx("code",{children:"cgroupfs"})," driver on a cgroup v2 system, containers may fail to start or exhibit resource limit issues. Ensure your daemon.json specifies ",e.jsx("code",{children:'"exec-opts": ["native.cgroupdriver=systemd"]'})," or omit the setting entirely (systemd is the default on Ubuntu 24.04)."]})}),e.jsx(t,{title:"Ensure correct cgroup driver in daemon.json",language:"json",code:`{
  "storage-driver": "overlay2",
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"cgroup v2 Benefits for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Despite the migration complexity, cgroup v2 provides real benefits for NemoClaw sandboxes:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Accurate Memory Accounting:"})," cgroup v2 tracks kernel memory usage per container, giving NemoClaw more precise resource reporting."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Pressure Stall Information (PSI):"})," NemoClaw can monitor resource pressure inside sandboxes, detecting when a sandbox is CPU-starved or memory-constrained before it hits hard limits."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Better Delegation:"})," cgroup v2's delegation model allows NemoClaw to safely grant sandboxes the ability to manage their own sub-cgroups, enabling finer-grained resource control within the sandbox."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Unified Hierarchy:"})," Simpler debugging and monitoring because all resource controllers are in a single tree rather than scattered across multiple mount points."]})]}),e.jsx(a,{type:"info",title:"DGX OS Uses cgroup v2",children:e.jsxs("p",{children:["NVIDIA DGX OS 6.x is based on Ubuntu 24.04 and uses cgroup v2 exclusively. All the cgroup v2 considerations in this section apply to DGX systems. The next section covers the ",e.jsx("code",{children:"nemoclaw setup-spark"})," command, which automates the cgroup v2 configuration specifically for DGX Spark hardware."]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"In summary, cgroup v2 on Ubuntu 24.04 is fully compatible with NemoClaw when using Docker Engine 24+ with the systemd cgroup driver. The transition requires awareness but not major changes to the NemoClaw workflow. The next section covers the automated setup for DGX Spark systems."})]})}const H=Object.freeze(Object.defineProperty({__proto__:null,default:y},Symbol.toStringTag,{value:"Module"}));function b(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"DGX Spark Setup with setup-spark"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The NVIDIA DGX Spark is a compact desktop AI system designed for developers, researchers, and data scientists. Running NemoClaw on DGX Spark requires specific configuration for cgroup v2, GPU access, and the DGX-optimized Docker runtime. Rather than performing these steps manually, NemoClaw provides the ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"sudo nemoclaw setup-spark"})," command that automates the entire process."]}),e.jsx(i,{term:"DGX Spark",definition:"An NVIDIA desktop-class AI workstation powered by the Grace Blackwell platform. It runs DGX OS (based on Ubuntu 24.04) and includes an integrated NVIDIA GPU with unified memory architecture. DGX Spark is designed for local AI development, inference, and fine-tuning workloads.",example:"A developer uses DGX Spark to run NemoClaw sandboxes with GPU passthrough, allowing AI agents to perform local model inference inside a secure, policy-controlled environment.",seeAlso:["DGX OS","GPU Passthrough","Grace Blackwell"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"What setup-spark Does"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"setup-spark"})," command performs a series of configuration steps that are specific to the DGX Spark hardware and DGX OS environment. Running this command is a prerequisite before using ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw onboard"})," on a DGX Spark system."]}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"cgroup v2 Driver Configuration:"})," Ensures Docker is using the systemd cgroup driver, which is required on DGX OS's cgroup v2 hierarchy."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"NVIDIA Container Runtime:"})," Configures Docker to use the NVIDIA container runtime as the default, enabling GPU access from within sandboxes without per-container flags."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"GPU Device Permissions:"})," Sets up the correct device permissions and cgroup device rules so that sandboxes can access GPU hardware."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Memory and Swap Configuration:"})," Adjusts cgroup memory controller settings for optimal GPU-compute workloads, including enabling memory swap accounting."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"NemoClaw Blueprint Optimization:"})," Configures NemoClaw to use a DGX-optimized blueprint that includes CUDA libraries, cuDNN, and GPU-aware tooling pre-installed in the sandbox."]})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Running setup-spark"}),e.jsx(n,{title:"Requires sudo",children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"setup-spark"})," command modifies system-level Docker configuration, kernel parameters, and device permissions. It must be run with sudo. This is the only NemoClaw command that requires elevated privileges -- all subsequent operations (onboard, connect, etc.) run as your normal user."]})}),e.jsx(o,{title:"Run the DGX Spark setup",steps:[{title:"Ensure NemoClaw CLI is installed",content:"The CLI must be installed before running setup-spark.",code:`nemoclaw --version
# If not installed, run the install script first:
# curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash`},{title:"Run the setup-spark command",content:"This command takes 1-3 minutes depending on what needs to be configured.",code:`sudo nemoclaw setup-spark

# Expected output:
# [1/6] Detecting DGX Spark hardware... OK (Grace Blackwell, 128 GB unified memory)
# [2/6] Configuring Docker cgroup v2 driver... OK
# [3/6] Installing NVIDIA container runtime... OK (already installed)
# [4/6] Setting GPU device permissions... OK
# [5/6] Configuring memory controller... OK
# [6/6] Setting DGX-optimized blueprint... OK
#
# DGX Spark setup complete.
# Run 'nemoclaw onboard' to create your first GPU-enabled sandbox.`},{title:"Verify the configuration",content:"Check that Docker is correctly configured for DGX Spark.",code:`# Verify NVIDIA runtime is configured
docker info | grep -i runtime
# Should include: nvidia

# Verify GPU is accessible from Docker
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu24.04 nvidia-smi
# Should display GPU info

# Verify cgroup configuration
docker info | grep "Cgroup"
# Cgroup Driver: systemd
# Cgroup Version: 2`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Configuration Files Modified"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["For transparency, here are the files that ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"setup-spark"})," modifies. Backups are created automatically before any changes (with a ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:".nemoclaw-backup"})," suffix)."]}),e.jsx(t,{title:"Files modified by setup-spark",language:"bash",code:`# Docker daemon configuration
/etc/docker/daemon.json
# Adds NVIDIA runtime, systemd cgroup driver, GPU device access

# The resulting daemon.json looks like:
cat /etc/docker/daemon.json`}),e.jsx(t,{title:"daemon.json after setup-spark",language:"json",code:`{
  "default-runtime": "nvidia",
  "runtimes": {
    "nvidia": {
      "path": "nvidia-container-runtime",
      "runtimeArgs": []
    }
  },
  "exec-opts": ["native.cgroupdriver=systemd"],
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}`}),e.jsx(t,{title:"Additional files modified",language:"bash",code:`# NemoClaw configuration (per-user)
~/.nemoclaw/config.yaml
# Sets default blueprint to "nemoclaw-dgx:latest"

# View the change:
cat ~/.nemoclaw/config.yaml
# default_blueprint: nemoclaw-dgx:latest
# gpu_enabled: true
# gpu_count: all`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Onboarding After setup-spark"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"After running setup-spark, the onboard process is identical to other platforms but automatically uses the DGX-optimized blueprint and enables GPU passthrough."}),e.jsx(t,{title:"Onboard a GPU-enabled sandbox",language:"bash",code:`# Onboard uses DGX blueprint by default after setup-spark
nemoclaw onboard --name gpu-sandbox

# The sandbox automatically has GPU access:
nemoclaw gpu-sandbox exec -- nvidia-smi
# Should display GPU information from inside the sandbox

# You can also explicitly specify GPU options:
nemoclaw onboard --name gpu-sandbox --gpus all
nemoclaw onboard --name gpu-sandbox --gpus 0  # specific GPU index`}),e.jsx(a,{type:"tip",title:"Non-GPU Sandboxes on DGX",children:e.jsxs("p",{children:["Even on DGX Spark, you can create sandboxes without GPU access. This is useful for agent workloads that do not need GPU compute. Use ",e.jsx("code",{children:"nemoclaw onboard --gpus none"})," to create a CPU-only sandbox. This also reduces the attack surface of the sandbox since GPU device access is a potential vector for sandbox escape."]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The next section covers additional DGX-specific hardware optimizations, including GPU memory allocation strategies and NVIDIA driver configuration for maximum performance inside sandboxes."})]})}const $=Object.freeze(Object.defineProperty({__proto__:null,default:b},Symbol.toStringTag,{value:"Module"}));function f(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"DGX Hardware Optimizations"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Running NemoClaw on NVIDIA DGX hardware offers performance advantages that are not available on commodity systems. The DGX platform provides tight integration between CPU and GPU, high-bandwidth memory, and optimized drivers that NemoClaw can leverage for agent workloads involving AI inference, data processing, and model fine-tuning. This section covers how to configure NemoClaw sandboxes to take full advantage of DGX hardware capabilities."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GPU Memory Allocation Strategies"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"DGX Spark uses the Grace Blackwell architecture with unified memory, meaning the CPU and GPU share the same physical memory pool. This is fundamentally different from discrete GPU systems where GPU VRAM is separate from system RAM. NemoClaw must be configured to account for this unified memory model."}),e.jsx(i,{term:"Unified Memory Architecture",definition:"A hardware design where the CPU and GPU share the same physical memory, eliminating the need to copy data between separate memory pools. On DGX Spark, the Grace CPU and Blackwell GPU access the same 128 GB of LPDDR5X memory. This simplifies programming but requires careful memory budgeting since both CPU and GPU workloads compete for the same resource.",example:"An agent running a 20 GB language model inside a NemoClaw sandbox uses unified memory directly -- no PCIe transfer overhead. But the same 128 GB pool must also serve the host OS, Docker, and any other sandboxes.",seeAlso:["Grace Blackwell","VRAM","Memory Oversubscription"]}),e.jsx(t,{title:"Configure GPU memory limits for sandboxes",language:"bash",code:`# View total available GPU memory
nvidia-smi --query-gpu=memory.total,memory.free --format=csv
# Example: 128000 MiB, 120000 MiB

# Create a sandbox with a specific GPU memory limit
nemoclaw onboard --name ml-sandbox --gpu-memory 32g

# Alternatively, set memory limits in the sandbox config:
nemoclaw ml-sandbox config set gpu.memory_limit 32g

# View current GPU memory allocation across sandboxes
nemoclaw gpu-status
# NAME           GPU     MEMORY LIMIT    MEMORY USED
# ml-sandbox     GPU 0   32 GB           2.1 GB
# dev-sandbox    GPU 0   16 GB           0.4 GB`}),e.jsx(n,{title:"Memory Oversubscription on Unified Memory",children:e.jsx("p",{children:"On DGX Spark's unified memory architecture, allocating too much GPU memory to sandboxes can starve the host OS and Docker of memory, causing system instability. A safe rule of thumb is to reserve at least 16 GB for the host system and Docker overhead, allocating the remainder across sandboxes. For example, on a 128 GB system, allocate no more than 112 GB total across all sandboxes."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"NVIDIA Driver Configuration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"DGX OS ships with optimized NVIDIA drivers pre-installed. For NemoClaw sandboxes to access the GPU, the driver version on the host must be compatible with the CUDA version inside the sandbox blueprint. The DGX-optimized blueprint is tested against the driver versions shipped with DGX OS."}),e.jsx(t,{title:"Verify driver and CUDA compatibility",language:"bash",code:`# Check host driver version
nvidia-smi | head -3
# Driver Version: 550.xx.xx   CUDA Version: 12.4

# Check CUDA version inside a sandbox
nemoclaw ml-sandbox exec -- nvcc --version
# Should show CUDA 12.4.x (matching the driver capability)

# Check driver compatibility matrix
nvidia-smi --query-gpu=driver_version,compute_cap --format=csv
# Compute capability 9.0 = Blackwell architecture`}),e.jsx(s,{title:"NVIDIA Driver Compatibility",headers:["DGX OS Version","Driver Version","CUDA Version","Blueprint"],rows:[["DGX OS 6.0","550.54+","CUDA 12.4","nemoclaw-dgx:latest"],["DGX OS 6.1","555.42+","CUDA 12.5","nemoclaw-dgx:latest"],["DGX OS 6.2","560.28+","CUDA 12.6","nemoclaw-dgx:latest"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Compute Mode and MPS"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When running multiple sandboxes that share the same GPU, NVIDIA Multi-Process Service (MPS) can improve GPU utilization by allowing concurrent kernel execution from multiple processes. Without MPS, GPU access is time-sliced, meaning only one sandbox's GPU operations run at a time."}),e.jsx(t,{title:"Enable MPS for multi-sandbox GPU sharing",language:"bash",code:`# Check current compute mode
nvidia-smi --query-gpu=compute_mode --format=csv
# Default: Default (multiple contexts allowed)

# Start the MPS daemon for better multi-sandbox GPU sharing
sudo nvidia-cuda-mps-control -d

# Verify MPS is running
echo "get_server_list" | nvidia-cuda-mps-control
# Should show the MPS server PID

# Configure NemoClaw to use MPS
nemoclaw config set gpu.mps_enabled true

# Now sandboxes share GPU more efficiently:
nemoclaw ml-sandbox exec -- python3 -c "import torch; print(torch.cuda.is_available())"
# True`}),e.jsx(a,{type:"tip",title:"When to Use MPS",children:e.jsx("p",{children:"MPS is most beneficial when running multiple sandboxes that make small, frequent GPU operations (such as inference with small batch sizes). For a single sandbox running large training jobs, MPS provides no benefit and can add slight overhead. Enable MPS only when you are running two or more GPU-enabled sandboxes concurrently."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Performance Tuning"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Several additional optimizations can improve NemoClaw sandbox performance on DGX hardware:"}),e.jsx(t,{title:"DGX performance tuning",language:"bash",code:`# Enable GPU persistence mode (prevents driver unload between operations)
sudo nvidia-smi -pm 1
# Persistence mode reduces GPU operation startup latency

# Set GPU clock speeds to maximum (for consistent performance)
sudo nvidia-smi -ac 2619,1980
# Memory clock, Graphics clock - values vary by GPU model

# Enable GPU performance governor
sudo nvidia-smi --power-limit=400
# Set to your GPU's TDP for sustained workloads

# Verify persistence mode
nvidia-smi --query-gpu=persistence_mode --format=csv
# Enabled

# Configure NemoClaw sandbox with optimized settings
nemoclaw onboard --name perf-sandbox \\
  --gpus all \\
  --gpu-memory 64g \\
  --cpus 8 \\
  --memory 32g \\
  --shm-size 8g`}),e.jsx(a,{type:"info",title:"Shared Memory (shm-size)",children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"--shm-size"})," flag sets the size of ",e.jsx("code",{children:"/dev/shm"})," inside the sandbox. PyTorch and other ML frameworks use shared memory for data loader workers. The default is 64 MB, which is often insufficient for ML workloads. Setting it to 8 GB or more is recommended for any sandbox that will run PyTorch training or inference."]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With these optimizations in place, your DGX system is configured for optimal NemoClaw performance. The next section covers the specifics of GPU passthrough -- how NemoClaw exposes GPU devices to sandboxes and how to verify that GPU access is working correctly."})]})}const z=Object.freeze(Object.defineProperty({__proto__:null,default:f},Symbol.toStringTag,{value:"Module"}));function k(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"GPU Passthrough to Sandboxes"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"GPU passthrough allows NemoClaw sandboxes to directly access NVIDIA GPU hardware for compute workloads. This is essential for AI agent tasks that involve model inference, fine-tuning, or any CUDA-based computation. NemoClaw uses the NVIDIA Container Toolkit (nvidia-container-toolkit) to expose GPU devices to sandbox containers securely and efficiently."}),e.jsx(i,{term:"NVIDIA Container Toolkit",definition:"A set of tools and libraries that enables NVIDIA GPU support within container runtimes like Docker. It includes the nvidia-container-runtime (a modified OCI runtime), libnvidia-container (which handles GPU device injection), and configuration utilities. The toolkit intercepts container creation and mounts the necessary GPU device nodes, driver libraries, and firmware into the container's filesystem.",example:"When NemoClaw creates a sandbox with --gpus all, the NVIDIA Container Toolkit injects /dev/nvidia0, /dev/nvidiactl, and the CUDA driver libraries into the container, making the GPU accessible to processes inside the sandbox.",seeAlso:["Container Runtime","CUDA","Device Mapping"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Installing the NVIDIA Container Toolkit"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["On DGX OS, the NVIDIA Container Toolkit is pre-installed. On other Ubuntu systems with NVIDIA GPUs, you must install it manually. If you ran ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"sudo nemoclaw setup-spark"}),", the toolkit is already configured. For non-DGX systems, follow these steps."]}),e.jsx(o,{title:"Install NVIDIA Container Toolkit on Ubuntu",steps:[{title:"Configure the NVIDIA package repository",content:"Add the NVIDIA Container Toolkit GPG key and repository.",code:`curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \\
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \\
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \\
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list`},{title:"Install the toolkit",content:"Update the package list and install the NVIDIA container toolkit.",code:`sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit`},{title:"Configure Docker to use the NVIDIA runtime",content:"Register the NVIDIA runtime with Docker.",code:"sudo nvidia-ctk runtime configure --runtime=docker"},{title:"Restart Docker",content:"Apply the runtime configuration changes.",code:"sudo systemctl restart docker"},{title:"Verify GPU access from Docker",content:"Test that containers can access the GPU.",code:`docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu24.04 nvidia-smi
# Should display your GPU information`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Device Mapping in NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw provides several options for controlling which GPUs are visible to a sandbox. This is important for multi-GPU systems where you want to isolate specific GPUs for specific sandboxes, or for security reasons where you want to limit GPU access."}),e.jsx(t,{title:"GPU device mapping options",language:"bash",code:`# Pass all GPUs to the sandbox
nemoclaw onboard --name full-gpu --gpus all

# Pass a specific GPU by index
nemoclaw onboard --name single-gpu --gpus 0

# Pass multiple specific GPUs
nemoclaw onboard --name multi-gpu --gpus 0,1

# Pass GPUs by UUID (useful for consistent mapping)
GPU_UUID=$(nvidia-smi --query-gpu=uuid --format=csv,noheader | head -1)
nemoclaw onboard --name uuid-gpu --gpus "device=$GPU_UUID"

# Create a sandbox with no GPU access
nemoclaw onboard --name cpu-only --gpus none`}),e.jsx(t,{title:"Verify GPU access inside a sandbox",language:"bash",code:`# Connect to the sandbox
nemoclaw full-gpu connect

# Inside the sandbox:
nvidia-smi
# Should display GPU info matching the host

# Check CUDA availability
python3 -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
python3 -c "import torch; print(f'GPU count: {torch.cuda.device_count()}')"
python3 -c "import torch; print(f'GPU name: {torch.cuda.get_device_name(0)}')"

# Run a simple CUDA operation
python3 -c "
import torch
x = torch.randn(1000, 1000, device='cuda')
y = torch.matmul(x, x)
print(f'CUDA computation successful. Result shape: {y.shape}')
"

# Exit the sandbox
exit`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GPU Security Considerations"}),e.jsx(n,{title:"GPU Access Expands the Attack Surface",children:e.jsxs("p",{children:["Granting GPU access to a sandbox gives the agent direct hardware access through the NVIDIA driver. While the NVIDIA Container Toolkit provides isolation, GPU device access has historically been a vector for container escape vulnerabilities. Only enable GPU passthrough for sandboxes that genuinely need it. Use ",e.jsx("code",{children:"--gpus none"})," for sandboxes that only need CPU compute."]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw's security policies can further restrict GPU usage within a sandbox. Even with GPU passthrough enabled, you can use policy rules to limit which CUDA operations are permitted."}),e.jsx(t,{title:"GPU-related policy restrictions",language:"yaml",code:`# Example policy snippet for GPU sandboxes
gpu:
  # Allow inference but block training-related operations
  allow_inference: true
  allow_training: false

  # Limit GPU memory per process
  max_memory_per_process: 8g

  # Block direct device file access (agent uses CUDA API only)
  block_device_files: true

  # Log all GPU operations for auditing
  audit_gpu_ops: true`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Troubleshooting GPU Passthrough"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Common GPU passthrough issues and their solutions:"}),e.jsx(t,{title:"GPU troubleshooting commands",language:"bash",code:`# Issue: "nvidia-smi: command not found" inside sandbox
# Fix: Verify NVIDIA runtime is configured
docker info | grep -i runtime
# Should include "nvidia"
# If not, run: sudo nvidia-ctk runtime configure --runtime=docker

# Issue: "Failed to initialize NVML: Driver/library version mismatch"
# Fix: Driver version on host doesn't match libraries in sandbox
nvidia-smi  # Check host driver version
nemoclaw my-sandbox exec -- cat /usr/local/cuda/version.json
# Update the sandbox blueprint or host driver to match

# Issue: "no CUDA-capable device is detected"
# Fix: Ensure --gpus flag was used during onboard
nemoclaw my-sandbox inspect | grep gpu
# If GPU is not configured, recreate with GPU:
nemoclaw my-sandbox destroy
nemoclaw onboard --name my-sandbox --gpus all

# Issue: GPU out of memory inside sandbox
# Fix: Check GPU memory usage across all sandboxes
nvidia-smi
nemoclaw gpu-status
# Free GPU memory by stopping unused sandboxes`}),e.jsx(a,{type:"info",title:"Hot-Adding GPUs Is Not Supported",children:e.jsx("p",{children:"GPU device mapping is set at sandbox creation time and cannot be changed while the sandbox is running. To change GPU allocation, you must destroy and recreate the sandbox. Plan your GPU allocation before creating sandboxes, especially in multi-user environments."})}),e.jsx(r,{question:"Why should you use --gpus none for sandboxes that do not need GPU compute?",options:["GPU passthrough slows down CPU operations","GPU access expands the attack surface and wastes GPU memory","NemoClaw does not support mixed GPU and CPU sandboxes","The NVIDIA driver is incompatible with non-GPU workloads"],correctIndex:1,explanation:"GPU device access gives the sandbox direct hardware access through the NVIDIA driver, which expands the potential attack surface. Additionally, even idle GPU contexts consume some GPU memory. Only enable GPU passthrough when the workload genuinely requires it."})]})}const X=Object.freeze(Object.defineProperty({__proto__:null,default:k},Symbol.toStringTag,{value:"Module"}));function w(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Colima vs Docker Desktop on macOS"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"macOS does not run containers natively. Unlike Linux, where Docker uses the host kernel's namespaces and cgroups directly, Docker on macOS must run a Linux virtual machine and execute containers inside that VM. There are two primary approaches to providing this Linux VM on macOS: Docker Desktop and Colima. Understanding the differences between these two options is important for choosing the right setup for NemoClaw."}),e.jsx(i,{term:"Colima",definition:"A lightweight, open-source command-line tool that creates and manages Linux virtual machines on macOS (and Linux) for running container runtimes. Colima uses Lima (Linux Machines) under the hood, which provisions a VM using the macOS Virtualization.framework (on Apple Silicon) or QEMU. It provides a Docker-compatible socket without the Docker Desktop GUI or licensing requirements.",example:"Running `colima start --cpu 4 --memory 8` creates a Linux VM with 4 CPUs and 8 GB RAM, then exposes a Docker socket at the default location so that `docker` CLI commands work transparently.",seeAlso:["Lima","Docker Desktop","Virtualization.framework"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Side-by-Side Comparison"}),e.jsx(s,{title:"Colima vs Docker Desktop",headers:["Feature","Colima","Docker Desktop"],highlightDiffs:!0,rows:[["Interface","CLI only","GUI + CLI"],["License","MIT (free for all use)","Free for personal/small business; paid for enterprise"],["Resource usage","Lightweight (~200 MB idle)","Heavier (~500+ MB idle)"],["VM backend (Apple Silicon)","Virtualization.framework","Virtualization.framework"],["VM backend (Intel Mac)","QEMU","HyperKit or QEMU"],["Docker Compose","Supported (via plugin)","Built-in"],["Kubernetes","Optional (k3s)","Built-in (single-node)"],["File sharing","VirtioFS or 9P","VirtioFS, gRPC FUSE, osxfs"],["Volume performance","Good with VirtioFS","Good with VirtioFS (macOS 12.5+)"],["NemoClaw compatible","Yes (recommended)","Yes"],["Update mechanism","brew upgrade colima","Auto-update in app"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Why Colima Is Recommended for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw recommends Colima on macOS for several reasons:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"No licensing concerns:"})," Colima is MIT-licensed and free for all users, including enterprise. Docker Desktop requires a paid subscription for organizations with more than 250 employees or $10M in annual revenue."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Lower resource overhead:"})," Colima's VM is lighter weight, leaving more resources available for NemoClaw sandboxes. This matters because both the VM and the sandboxes compete for CPU and memory."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Precise resource control:"})," Colima lets you specify exact CPU and memory allocations for the VM at startup. Docker Desktop also allows this but through a GUI settings panel."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Scriptability:"})," Colima is fully CLI-driven, making it easy to script and automate setup. This aligns with NemoClaw's CLI-first approach."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Transparency:"})," Colima uses well-known open-source components (Lima, QEMU, Virtualization.framework) with clear behavior. Docker Desktop is a proprietary application with complex internal behavior."]})]}),e.jsx(a,{type:"info",title:"Docker Desktop Works Too",children:e.jsx("p",{children:"If you already have Docker Desktop installed and configured, NemoClaw works with it perfectly well. You do not need to switch to Colima. The NemoClaw CLI communicates with Docker through the standard Docker socket, so it is agnostic to whether Colima or Docker Desktop provides that socket. The recommendation for Colima is about simplicity and licensing, not functionality."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Resource Allocation for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"On macOS, the Linux VM that runs containers must be given explicit CPU and memory allocations from the host. These resources are reserved -- they are not shared dynamically with macOS. You need to allocate enough to the VM for both Docker itself and at least one NemoClaw sandbox."}),e.jsx(s,{title:"Recommended VM Resources for NemoClaw",headers:["Use Case","VM CPUs","VM Memory","VM Disk"],rows:[["Single sandbox (light)","4","8 GB","30 GB"],["Single sandbox (development)","4-6","12 GB","40 GB"],["Two sandboxes","6-8","16 GB","60 GB"]]}),e.jsx(t,{title:"Configure Colima resources",language:"bash",code:`# Start Colima with recommended resources for NemoClaw
colima start --cpu 4 --memory 12 --disk 40

# Or modify an existing Colima instance:
colima stop
colima start --cpu 6 --memory 16 --disk 60

# Verify the VM resources:
colima status
# INFO[0000] colima is running using macOS Virtualization.Framework
# INFO[0000] runtime: docker
# INFO[0000] arch: aarch64
# INFO[0000] cpus: 4
# INFO[0000] memory: 12 GiB
# INFO[0000] disk: 40 GiB`}),e.jsx(t,{title:"Configure Docker Desktop resources",language:"bash",code:`# Docker Desktop resources are configured in the GUI:
# Docker Desktop > Settings > Resources > Advanced
#   CPUs: 4+
#   Memory: 12+ GB
#   Virtual disk limit: 40+ GB
#
# Or via the settings file:
cat ~/Library/Group\\ Containers/group.com.docker/settings.json | \\
  python3 -c "import sys,json; d=json.load(sys.stdin); print(f'CPUs: {d.get("cpus")}, Memory: {d.get("memoryMiB")} MB')"
`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Switching Between Colima and Docker Desktop"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"You should only run one container runtime at a time. Running both Colima and Docker Desktop simultaneously causes Docker socket conflicts. If switching, stop one before starting the other."}),e.jsx(t,{title:"Switch between runtimes",language:"bash",code:`# Stop Docker Desktop (from CLI):
osascript -e 'quit app "Docker Desktop"'

# Start Colima:
colima start --cpu 4 --memory 12

# OR stop Colima and use Docker Desktop:
colima stop
open -a "Docker Desktop"`}),e.jsx(a,{type:"tip",title:"Check Which Docker Socket Is Active",children:e.jsxs("p",{children:["Use ",e.jsx("code",{children:"docker context ls"})," to see which Docker context is active. If you see both Colima and Desktop contexts, ensure only the intended one is marked as current. Use ",e.jsx("code",{children:"docker context use colima"})," or ",e.jsx("code",{children:"docker context use default"})," to switch."]})})]})}const K=Object.freeze(Object.defineProperty({__proto__:null,default:w},Symbol.toStringTag,{value:"Module"}));function v(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"macOS Installation Walkthrough"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This section provides a complete, step-by-step guide to installing NemoClaw on macOS using Homebrew and Colima. By the end of this walkthrough, you will have a running NemoClaw sandbox on your Mac. The process takes approximately 15-20 minutes, with most of the time spent downloading the Colima VM image and NemoClaw blueprint."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"These instructions assume a clean macOS setup. If you already have some of these tools installed, verify the versions match and skip the corresponding steps."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Prerequisites"}),e.jsx(o,{title:"Install Homebrew and base tools",steps:[{title:"Install Homebrew (if not already installed)",content:"Homebrew is the standard package manager for macOS. It is required for installing Colima, Docker CLI, and Node.js.",code:`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# After installation, follow the instructions to add Homebrew to your PATH
# For Apple Silicon Macs:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"`},{title:"Verify Homebrew",content:"Confirm Homebrew is working correctly.",code:`brew --version
# Expected: Homebrew 4.x.x`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Install Dependencies"}),e.jsx(o,{title:"Install Node.js, Docker CLI, and Colima",steps:[{title:"Install Node.js 20",content:"Install the latest Node.js 20 LTS release via Homebrew.",code:`brew install node@20

# Add to PATH if not automatically linked:
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify:
node --version   # v20.x.x
npm --version    # 10.x.x`},{title:"Install the Docker CLI and Compose plugin",content:"Install the Docker command-line tools (not Docker Desktop).",code:"brew install docker docker-compose docker-credential-helper"},{title:"Install Colima",content:"Install the Colima container runtime.",code:"brew install colima"},{title:"Install Git (if not present)",content:"macOS includes Git with Xcode Command Line Tools, but verify it is available.",code:`git --version
# If not installed, it will prompt to install Xcode CLT
# Or: brew install git`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Configure and Start Colima"}),e.jsx(o,{title:"Start the Colima VM",steps:[{title:"Start Colima with NemoClaw-appropriate resources",content:"Allocate enough CPU, memory, and disk for Docker and at least one NemoClaw sandbox.",code:`colima start \\
  --cpu 4 \\
  --memory 12 \\
  --disk 40 \\
  --vm-type vz \\
  --mount-type virtiofs

# --vm-type vz: Uses Apple Virtualization.framework (faster on Apple Silicon)
# --mount-type virtiofs: Uses VirtioFS for better file sharing performance`},{title:"Verify Colima is running",content:"Confirm the VM started successfully and Docker is accessible.",code:`colima status
# Should show: colima is running

docker ps
# Should show an empty container list (no errors)

docker run --rm hello-world
# Should print "Hello from Docker!"`}]}),e.jsx(n,{title:"First Start Takes Time",children:e.jsxs("p",{children:["The first time you run ",e.jsx("code",{children:"colima start"}),", it downloads the Linux VM image (approximately 500 MB). This is a one-time download. Subsequent starts use the cached image and take only a few seconds."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Install NemoClaw"}),e.jsx(o,{title:"Install and onboard NemoClaw",steps:[{title:"Run the NemoClaw install script",content:"Download and install the NemoClaw CLI.",code:`curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash

# Verify:
nemoclaw --version`},{title:"Run the onboard process",content:"Create your first NemoClaw sandbox. This downloads the ~2.4 GB blueprint image.",code:`nemoclaw onboard --name my-mac-sandbox

# Wait for the blueprint download and sandbox creation...
# This takes 3-10 minutes depending on internet speed.`},{title:"Verify the sandbox",content:"Check that the sandbox is running and healthy.",code:`nemoclaw list
# NAME              STATUS    BLUEPRINT              CREATED
# my-mac-sandbox    running   nemoclaw-base:latest   1 minute ago

nemoclaw my-mac-sandbox status
# Should show all components healthy`},{title:"Connect to the sandbox",content:"Open an interactive session to verify everything works.",code:`nemoclaw my-mac-sandbox connect

# Inside the sandbox:
whoami          # agent
uname -a        # Linux (running inside the Colima VM)
openshell --version

# Exit:
exit`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Auto-Starting Colima"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"By default, Colima does not start automatically when your Mac boots. If you want NemoClaw sandboxes available immediately after login, configure Colima as a launch agent."}),e.jsx(t,{title:"Configure Colima auto-start",language:"bash",code:`# Create a launch agent plist
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
launchctl load ~/Library/LaunchAgents/com.colima.start.plist`}),e.jsx(a,{type:"tip",title:"Stopping Colima Saves Resources",children:e.jsxs("p",{children:["When you are not using NemoClaw, stopping Colima reclaims the CPU and memory allocated to the VM. Run ",e.jsx("code",{children:"colima stop"})," when done. Your sandboxes will be preserved and resume when you run ",e.jsx("code",{children:"colima start"})," again."]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Your macOS NemoClaw installation is now complete. The next sections cover macOS-specific limitations and Apple Silicon considerations that affect how NemoClaw operates on your Mac."})]})}const Y=Object.freeze(Object.defineProperty({__proto__:null,default:v},Symbol.toStringTag,{value:"Module"}));function N(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"macOS Limitations"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"While NemoClaw works well on macOS, there are important differences compared to running on native Linux. These differences stem from the fundamental architecture: on macOS, containers run inside a Linux virtual machine, adding a layer of indirection that affects security, performance, and feature availability. Understanding these limitations helps set appropriate expectations and avoid frustration."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"No Host-Level Landlock"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Landlock is a Linux kernel security module. Since macOS is not Linux, Landlock is not available on the macOS host. However, NemoClaw sandboxes run inside a Linux VM (Colima or Docker Desktop), and that VM does have a Linux kernel. The practical implications are:"}),e.jsx(s,{title:"Landlock Availability: Linux vs macOS",headers:["Layer","Native Linux","macOS (Colima/Docker Desktop)"],highlightDiffs:!0,rows:[["Host kernel Landlock","Available (5.13+)","Not available (macOS kernel)"],["VM kernel Landlock","N/A (no VM)","Available inside the Linux VM"],["Sandbox Landlock","Yes, kernel-enforced","Yes, but VM kernel-enforced"],["Escape to host via Landlock bypass","Reaches host OS","Reaches VM only (not macOS host)"]]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"In practice, sandboxes on macOS use Landlock within the Linux VM's kernel. If an agent were to bypass Landlock (which is extremely difficult), it would escape into the Linux VM, not into macOS itself. This means macOS actually provides an additional isolation layer (the VM boundary) that native Linux does not have. However, NemoClaw cannot enforce Landlock policies at the macOS host level for any operations outside the VM."}),e.jsx(a,{type:"info",title:"The VM Is an Extra Security Layer",children:e.jsx("p",{children:"Ironically, the VM layer that limits macOS functionality also provides additional security. A sandbox escape on native Linux reaches the host OS. A sandbox escape on macOS reaches the Colima/Docker Desktop VM, which itself is isolated from macOS by the hypervisor. This is defense in depth -- not by design, but by architecture."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Network Namespace Differences"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"On native Linux, NemoClaw can create network namespaces that provide fine-grained network isolation for sandboxes -- controlling exactly which IP ranges, ports, and DNS servers the sandbox can access. On macOS, the networking story is more complex because of the VM layer."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Port mapping:"})," Sandbox ports must be mapped through the VM to be accessible from macOS. On native Linux, port mapping goes directly from the container to the host. On macOS, it goes container to VM to macOS -- an extra hop that can cause subtle differences."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"DNS resolution:"})," Sandboxes on macOS resolve DNS through the VM's network stack, which forwards to macOS's resolver. This usually works transparently but can cause issues with corporate VPNs or split-DNS configurations."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Host network mode:"})," The ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"--network host"})," mode gives the sandbox access to the VM's network, not the macOS host's network. This is a common source of confusion."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"mDNS / Bonjour:"})," macOS local network services discovered via mDNS (Bonjour) are not directly accessible from inside sandboxes. The VM has its own network namespace that does not participate in mDNS."]})]}),e.jsx(t,{title:"Debugging network issues on macOS",language:"bash",code:`# Check sandbox network from inside
nemoclaw my-sandbox exec -- ip addr show
nemoclaw my-sandbox exec -- cat /etc/resolv.conf

# Test connectivity from sandbox to internet
nemoclaw my-sandbox exec -- curl -s https://httpbin.org/ip

# Test connectivity from macOS to sandbox exposed ports
# If sandbox exposes port 8080:
curl http://localhost:8080

# Check Colima VM's IP address
colima status | grep "address"
# Or:
colima ssh -- ip addr show`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Performance Considerations"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The VM layer introduces performance overhead. While modern hypervisors (especially Apple's Virtualization.framework) are efficient, there are measurable differences compared to running NemoClaw on native Linux."}),e.jsx(s,{title:"Performance: Native Linux vs macOS VM",headers:["Operation","Native Linux","macOS (Colima VZ + VirtioFS)"],highlightDiffs:!0,rows:[["Sandbox startup","2-3 seconds","5-8 seconds"],["CPU-bound tasks","Full native speed","~95-98% native speed"],["File I/O (inside sandbox)","Full native speed","~90-95% native speed"],["File I/O (mounted host dirs)","Full native speed","~60-80% native speed"],["Network throughput","Full native speed","~90% native speed"],["Memory overhead","~100 MB per sandbox","~100 MB + VM overhead (~300 MB)"]]}),e.jsx(n,{title:"Mounted Host Directories Are Slow",children:e.jsxs("p",{children:["Mounting macOS host directories into sandboxes (for accessing your code on the Mac filesystem from inside the sandbox) incurs significant I/O overhead because every file operation must cross the VM boundary. For performance-sensitive workloads, copy files into the sandbox rather than mounting them. VirtioFS (with Colima's ",e.jsx("code",{children:"--mount-type virtiofs"}),") provides the best performance, but it is still slower than native filesystem access."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"No GPU Passthrough"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"macOS does not support passing NVIDIA GPUs to the Linux VM. This is because macOS uses Apple's Metal graphics API, not NVIDIA CUDA, and Apple does not provide GPU passthrough to Linux VMs. If you need GPU-accelerated sandboxes, you must use a Linux machine with an NVIDIA GPU."}),e.jsx(a,{type:"info",title:"Apple Neural Engine and Metal",children:e.jsx("p",{children:"Apple Silicon chips include the Apple Neural Engine (ANE) and Metal-compatible GPU. These are not accessible from Linux VMs or Docker containers. Some ML frameworks (PyTorch, TensorFlow) support Metal via the MPS backend on the macOS host, but this acceleration is not available inside NemoClaw sandboxes, which run Linux."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Summary of Limitations"}),e.jsx(s,{title:"macOS Limitation Summary",headers:["Limitation","Impact","Workaround"],rows:[["No host Landlock","Low -- VM provides alternative isolation","VM boundary acts as extra layer"],["Network indirection","Medium -- port mapping and DNS differences","Use bridge networking, test connectivity"],["Slower file I/O for mounts","Medium -- affects mounted host directories","Use VirtioFS, or copy files into sandbox"],["No NVIDIA GPU passthrough","High for GPU workloads","Use Linux machine for GPU workloads"],["VM resource overhead","Low -- ~300 MB extra memory","Allocate sufficient VM resources"]]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Despite these limitations, macOS is a fully viable development platform for NemoClaw. The majority of agent development and testing workflows operate without any noticeable difference. The limitations primarily affect advanced use cases: GPU workloads, high-performance file I/O with mounted directories, and complex network configurations."})]})}const Z=Object.freeze(Object.defineProperty({__proto__:null,default:N},Symbol.toStringTag,{value:"Module"}));function j(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Apple Silicon Considerations"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Apple Silicon Macs (M1, M2, M3, M4 and their Pro/Max/Ultra variants) use the ARM64 (aarch64) architecture rather than x86_64 (Intel). This has direct implications for NemoClaw because container images, the Linux VM, and any binaries inside sandboxes must be compatible with the ARM64 architecture. NemoClaw supports Apple Silicon natively, but there are nuances worth understanding."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"ARM64 Native Support"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["NemoClaw publishes its blueprint images for both x86_64 and ARM64 architectures. When you run ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw onboard"})," on an Apple Silicon Mac, it automatically pulls the ARM64 version of the blueprint. The Linux VM created by Colima also runs an ARM64 Linux kernel. This means everything runs natively -- no emulation is involved for NemoClaw's core functionality."]}),e.jsx(t,{title:"Verify architecture",language:"bash",code:`# Check host architecture
arch
# Expected on Apple Silicon: arm64

# Check Colima VM architecture
colima ssh -- uname -m
# Expected: aarch64

# Check sandbox architecture
nemoclaw my-sandbox exec -- uname -m
# Expected: aarch64

# Verify the blueprint is ARM64
docker inspect nemoclaw-base:latest --format '{{.Architecture}}'
# Expected: arm64`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Rosetta for x86 Images"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Some agent workloads may depend on x86-only container images or binaries. Apple's Rosetta 2 translation layer can run x86_64 binaries on ARM64, and Colima can be configured to enable Rosetta translation inside the Linux VM. This allows x86_64 Docker images to run on Apple Silicon, albeit with a performance penalty."}),e.jsx(t,{title:"Enable Rosetta support in Colima",language:"bash",code:`# Start Colima with Rosetta enabled (requires macOS 13+)
colima start \\
  --cpu 4 \\
  --memory 12 \\
  --disk 40 \\
  --vm-type vz \\
  --mount-type virtiofs \\
  --rosetta

# Verify Rosetta is available inside the VM
colima ssh -- cat /proc/sys/fs/binfmt_misc/rosetta
# Should show: enabled

# Test running an x86_64 image
docker run --rm --platform linux/amd64 ubuntu:22.04 uname -m
# Output: x86_64 (running via Rosetta translation)`}),e.jsx(n,{title:"Rosetta Performance Overhead",children:e.jsx("p",{children:"Running x86_64 binaries via Rosetta incurs a 20-40% performance penalty compared to native ARM64 execution. For NemoClaw, always use the native ARM64 blueprint (the default). Only use Rosetta for specific agent workloads that require x86-only tools or libraries. If an agent primarily needs x86 execution, consider running NemoClaw on an Intel/AMD Linux machine instead."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Performance Across Apple Silicon Generations"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw performance varies across Apple Silicon generations based on CPU core count, memory bandwidth, and total available memory. The following table provides guidance on what to expect."}),e.jsx(s,{title:"NemoClaw Performance by Apple Silicon",headers:["Chip","Max RAM","Recommended Sandboxes","Notes"],rows:[["M1 (8 GB)","8 GB","1 sandbox (tight)","Minimum viable; expect memory pressure"],["M1 (16 GB)","16 GB","1-2 sandboxes","Comfortable for development"],["M1 Pro/Max","32-64 GB","2-4 sandboxes","Good performance; more CPU cores help"],["M2 (8 GB)","8 GB","1 sandbox (tight)","Similar to M1 8 GB"],["M2 Pro/Max","32-96 GB","2-4 sandboxes","Fast single-core boosts sandbox startup"],["M3 Pro/Max","36-128 GB","3-6 sandboxes","Best single-core performance"],["M4 Pro/Max","48-128 GB","3-6 sandboxes","Latest generation; excellent performance"],["M1/M2 Ultra","128-192 GB","6-10+ sandboxes","Mac Studio/Pro; production-viable"]]}),e.jsx(a,{type:"tip",title:"Memory Is the Primary Constraint",children:e.jsx("p",{children:"On Apple Silicon Macs, CPU is rarely the bottleneck for NemoClaw. Memory is the primary constraint because it is shared between macOS, the Colima VM, and all sandboxes. A Mac with 8 GB of RAM can run one sandbox but will frequently experience memory pressure. 16 GB is the recommended minimum, and 32 GB provides a comfortable multi-sandbox experience."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Colima VM Type: VZ vs QEMU"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"On Apple Silicon, Colima supports two VM backends: VZ (Apple Virtualization.framework) and QEMU. The choice significantly affects performance."}),e.jsx(s,{title:"VZ vs QEMU on Apple Silicon",headers:["Feature","VZ (Virtualization.framework)","QEMU"],highlightDiffs:!0,rows:[["Performance","Near-native","~70-80% of native"],["Startup time","2-3 seconds","5-10 seconds"],["VirtioFS support","Yes","Yes (9P also available)"],["Rosetta support","Yes (macOS 13+)","No"],["Stability","Excellent","Good"],["Recommended","Yes","Only if VZ is not available"]]}),e.jsx(t,{title:"Use VZ backend (recommended)",language:"bash",code:`# Start with VZ (recommended for Apple Silicon)
colima start --vm-type vz --mount-type virtiofs --cpu 4 --memory 12

# If VZ is not available (older macOS), fall back to QEMU:
colima start --vm-type qemu --cpu 4 --memory 12`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Multi-Architecture Agent Workloads"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If your agent needs to build or test software for both ARM64 and x86_64 targets (for example, building Docker images that will run on x86 servers), you can use Docker's buildx with multi-platform support inside a NemoClaw sandbox."}),e.jsx(t,{title:"Multi-architecture builds inside a sandbox",language:"bash",code:`# Inside a NemoClaw sandbox on Apple Silicon:

# Check available platforms
docker buildx ls
# Should show linux/arm64 (native) and linux/amd64 (via Rosetta or QEMU)

# Build a multi-platform image
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest .`}),e.jsx(r,{question:"When running NemoClaw on an Apple Silicon Mac with 16 GB of RAM, what is the primary resource constraint?",options:["CPU core count","GPU acceleration","Memory shared between macOS, VM, and sandboxes","Disk I/O speed"],correctIndex:2,explanation:"Memory is the primary constraint on Apple Silicon Macs because it is shared between macOS, the Colima VM, and all NemoClaw sandboxes. With 16 GB, you can comfortably run 1-2 sandboxes. CPU is rarely the bottleneck thanks to Apple Silicon's strong single-core performance."})]})}const Q=Object.freeze(Object.defineProperty({__proto__:null,default:j},Symbol.toStringTag,{value:"Module"}));function S(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"WSL2 Configuration for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Windows Subsystem for Linux 2 (WSL2) provides a real Linux kernel running inside a lightweight virtual machine on Windows. NemoClaw runs inside a WSL2 Ubuntu instance, giving you a near-native Linux experience on a Windows machine. This section covers enabling WSL2, installing Ubuntu, configuring memory limits, and enabling systemd -- all prerequisites for running NemoClaw on Windows."}),e.jsx(i,{term:"WSL2 (Windows Subsystem for Linux 2)",definition:"A feature of Windows 10 (version 2004+) and Windows 11 that runs a real Linux kernel in a lightweight Hyper-V virtual machine. Unlike WSL1 (which translated Linux syscalls to Windows syscalls), WSL2 provides full Linux kernel compatibility, including support for Docker containers, cgroups, namespaces, and Landlock.",example:"NemoClaw running inside WSL2 Ubuntu 22.04 has access to the same Linux kernel features (Landlock, cgroups, namespaces) as a native Ubuntu installation, making it functionally equivalent for sandbox management.",seeAlso:["Hyper-V","Linux Kernel","Container Runtime"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Enable WSL2"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"WSL2 must be enabled at the Windows level before you can install a Linux distribution. On modern Windows 11 systems, WSL is often pre-installed. On Windows 10, you may need to enable it manually."}),e.jsx(o,{title:"Enable and install WSL2",steps:[{title:"Open PowerShell as Administrator",content:'Right-click the Start menu and select "Terminal (Admin)" or "PowerShell (Admin)".',code:`# Run this in an elevated PowerShell window:
wsl --install`},{title:"Restart your computer",content:"The WSL installation requires a reboot to complete kernel installation.",code:"# After reboot, WSL2 will be ready"},{title:"Verify WSL2 is the default version",content:"Ensure WSL2 (not WSL1) is set as the default.",code:`wsl --set-default-version 2
wsl --status
# Default Version: 2
# WSL version: 2.x.x.x
# Kernel version: 5.15.xxx.x`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Install Ubuntu 22.04"}),e.jsx(o,{title:"Install Ubuntu 22.04 in WSL2",steps:[{title:"Install Ubuntu 22.04 from the command line",content:"Download and install the Ubuntu 22.04 distribution.",code:`wsl --install -d Ubuntu-22.04

# Or if you prefer Ubuntu 24.04:
# wsl --install -d Ubuntu-24.04`},{title:"Set up your Linux user account",content:"The first launch prompts you to create a username and password.",code:`# The Ubuntu terminal will open and prompt:
# Enter new UNIX username: myuser
# New password: ********
# Retype new password: ********`},{title:"Verify the installation",content:"Confirm Ubuntu is running under WSL2.",code:`# From PowerShell:
wsl --list --verbose
# NAME            STATE           VERSION
# Ubuntu-22.04    Running         2

# From inside Ubuntu:
uname -r
# Example: 5.15.153.1-microsoft-standard-WSL2
cat /etc/os-release | head -3`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Configure Memory Limits"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"By default, WSL2 can consume up to 50% of your system's total RAM (on Windows 11) or up to 80% (on Windows 10). For NemoClaw, you want to control this allocation to ensure enough memory for the WSL2 VM while leaving sufficient resources for Windows itself."}),e.jsx(t,{title:"Create or edit .wslconfig (in Windows)",language:"bash",code:`# Create/edit %USERPROFILE%\\.wslconfig
# In PowerShell:
notepad $env:USERPROFILE\\.wslconfig`}),e.jsx(t,{title:".wslconfig content",language:"bash",code:`# %USERPROFILE%\\.wslconfig
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
nestedVirtualization=true`}),e.jsx(o,{title:"Apply the configuration",steps:[{title:"Shut down WSL2",content:"The .wslconfig changes only take effect after restarting WSL2.",code:`# In PowerShell:
wsl --shutdown`},{title:"Restart your Ubuntu instance",content:"Open the Ubuntu terminal again or run wsl.",code:`# In PowerShell:
wsl -d Ubuntu-22.04`},{title:"Verify the memory limit",content:"Check that the memory limit is applied inside WSL2.",code:`# Inside Ubuntu:
free -h
# Total should match your .wslconfig memory setting`}]}),e.jsx(n,{title:"Insufficient Memory Causes Silent Failures",children:e.jsx("p",{children:"If you allocate too little memory to WSL2, Docker and NemoClaw will start but sandboxes may crash under load when the OOM killer activates. With 16 GB of total system RAM, allocating 10-12 GB to WSL2 is a good balance. With 32 GB total, allocating 16-20 GB provides a comfortable experience."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Enable systemd"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Modern NemoClaw and Docker require systemd to be enabled inside WSL2. As of WSL 0.67.6 (September 2022), systemd is supported but may not be enabled by default on older WSL installations."}),e.jsx(t,{title:"Enable systemd in WSL2",language:"bash",code:`# Inside Ubuntu WSL2, edit /etc/wsl.conf:
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
# Should show running services (not an error about systemd)`}),e.jsx(a,{type:"info",title:"Why systemd Matters",children:e.jsx("p",{children:"Docker Engine manages its lifecycle through systemd (systemctl start/stop/enable docker). Without systemd enabled in WSL2, Docker must be started manually each time you open a WSL2 session, and NemoClaw's ability to manage the Docker service is limited. Enabling systemd provides a consistent experience matching a real Linux installation."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Verify WSL2 Readiness"}),e.jsx(t,{title:"WSL2 readiness check",language:"bash",code:`echo "=== WSL2 Readiness Check ==="

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

echo "=== Check Complete ==="`}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With WSL2 configured, the next step is setting up Docker Desktop with its WSL2 backend, which provides the container runtime NemoClaw needs."})]})}const J=Object.freeze(Object.defineProperty({__proto__:null,default:S},Symbol.toStringTag,{value:"Module"}));function C(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Docker Desktop WSL2 Backend"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"On Windows, the recommended approach for running Docker with NemoClaw is Docker Desktop with the WSL2 backend. This configuration runs the Docker daemon inside the WSL2 Linux kernel, providing near-native container performance while integrating cleanly with your WSL2 Ubuntu instance. Unlike macOS where we recommend Colima, on Windows Docker Desktop is the preferred choice because it handles the WSL2 integration automatically."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Why Docker Desktop on Windows"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"While it is technically possible to install Docker Engine directly inside WSL2 Ubuntu (just as you would on a native Linux system), Docker Desktop's WSL2 backend provides several advantages:"}),e.jsx(s,{title:"Docker Desktop WSL2 vs Docker Engine in WSL2",headers:["Feature","Docker Desktop (WSL2 backend)","Docker Engine (manual in WSL2)"],highlightDiffs:!0,rows:[["Installation","Windows installer, automatic setup","Manual apt install inside WSL2"],["WSL2 integration","Automatic, shares daemon across distros","Manual, per-distro daemon"],["Windows path access","Transparent via /mnt/c/","Requires manual mount configuration"],["Auto-start with Windows","Built-in option","Requires custom systemd service"],["Resource management","GUI settings panel","Manual .wslconfig + daemon.json"],["NemoClaw compatible","Yes","Yes (but more manual setup)"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Install and Configure Docker Desktop"}),e.jsx(o,{title:"Install Docker Desktop with WSL2 backend",steps:[{title:"Download Docker Desktop",content:"Download the Docker Desktop installer from the official Docker website.",code:`# Download from: https://www.docker.com/products/docker-desktop/
# Or via winget (in PowerShell):
winget install Docker.DockerDesktop`},{title:"Run the installer",content:'Run the downloaded installer. During installation, ensure "Use WSL 2 instead of Hyper-V" is checked.',code:`# The installer runs on Windows.
# Check the box: "Use WSL 2 instead of Hyper-V (recommended)"
# Complete the installation and restart if prompted.`},{title:"Open Docker Desktop and configure WSL2 integration",content:"After installation, open Docker Desktop and navigate to Settings.",code:`# In Docker Desktop:
# 1. Go to Settings > General
#    - Ensure "Use the WSL 2 based engine" is checked
#
# 2. Go to Settings > Resources > WSL Integration
#    - Enable integration with your Ubuntu-22.04 distro
#    - Click "Apply & Restart"`},{title:"Verify Docker in WSL2",content:"Open your WSL2 Ubuntu terminal and verify Docker is accessible.",code:`# Inside WSL2 Ubuntu:
docker --version
# Expected: Docker version 24.x.x or higher

docker ps
# Should show an empty container list

docker run --rm hello-world
# Should print "Hello from Docker!"`}]}),e.jsx(n,{title:"Docker Desktop Licensing",children:e.jsx("p",{children:"Docker Desktop requires a paid subscription for commercial use in organizations with more than 250 employees or $10M+ in annual revenue. If this applies to your organization, ensure you have the appropriate license. Alternatively, you can install Docker Engine directly inside WSL2 Ubuntu (same process as native Linux installation) to avoid Docker Desktop licensing entirely."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Resource Configuration"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Docker Desktop's WSL2 backend shares resources with the WSL2 VM. The resource limits you set in ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:".wslconfig"})," apply to the entire WSL2 VM, which includes Docker. Docker Desktop no longer has separate CPU/memory settings when using the WSL2 backend -- it uses whatever WSL2 has available."]}),e.jsx(a,{type:"info",title:"Resources Are Shared with WSL2",children:e.jsxs("p",{children:["When using the WSL2 backend, Docker Desktop does not have its own resource limits. The memory and CPU allocated to WSL2 via ",e.jsx("code",{children:".wslconfig"})," are shared between your Ubuntu userspace and Docker. If you allocated 12 GB to WSL2, Docker and your NemoClaw sandboxes share that 12 GB with the Ubuntu base system."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Docker Data Location"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Docker Desktop stores its data (images, containers, volumes) inside the WSL2 virtual disk. By default, this VHDX file grows dynamically and is located in your Windows user profile directory. For NemoClaw, the blueprint image (~6 GB uncompressed) and sandbox writable layers are stored here."}),e.jsx(t,{title:"Check Docker data location and size",language:"bash",code:`# From PowerShell, check the VHDX file:
# Default location:
# %LOCALAPPDATA%\\Docker\\wsl\\disk\\docker_data.vhdx

# Inside WSL2, check Docker disk usage:
docker system df
# Shows image, container, and volume usage

# Check available disk space inside WSL2:
df -h /
# The root filesystem is the WSL2 virtual disk`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Verify Docker Desktop WSL2 Integration"}),e.jsx(t,{title:"Integration verification",language:"bash",code:`# Run all checks from inside WSL2 Ubuntu:

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

echo "=== Check Complete ==="`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Alternative: Docker Engine Directly in WSL2"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If you prefer to avoid Docker Desktop entirely, you can install Docker Engine directly inside your WSL2 Ubuntu instance. The installation process is identical to native Ubuntu (covered in the Ubuntu 22.04 chapter). The key difference is that you need systemd enabled in WSL2 for Docker to start via systemctl."}),e.jsx(t,{title:"Install Docker Engine directly in WSL2",language:"bash",code:`# Ensure systemd is enabled (check /etc/wsl.conf has [boot] systemd=true)

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
docker run --rm hello-world`}),e.jsx(a,{type:"tip",title:"Choose One Approach",children:e.jsx("p",{children:"Use either Docker Desktop or Docker Engine inside WSL2, not both. Having both installed can cause socket conflicts and confusing behavior. If you install Docker Desktop first and later want to switch to Docker Engine, uninstall Docker Desktop from Windows before installing Docker Engine in WSL2."})})]})}const ee=Object.freeze(Object.defineProperty({__proto__:null,default:C},Symbol.toStringTag,{value:"Module"}));function D(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"NemoClaw Installation on Windows WSL2"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This section provides a complete walkthrough for installing NemoClaw inside WSL2 on Windows. At this point, you should have WSL2 enabled with Ubuntu 22.04 installed, systemd enabled, and Docker accessible (either via Docker Desktop or Docker Engine). If any of these prerequisites are missing, return to the previous sections to complete them."}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["All commands in this walkthrough are run inside the WSL2 Ubuntu terminal, not in PowerShell or Command Prompt. Open your Ubuntu terminal from the Windows Start menu or by running ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"wsl -d Ubuntu-22.04"})," in PowerShell."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 1: Update System and Install Node.js"}),e.jsx(o,{title:"Prepare the WSL2 Ubuntu environment",steps:[{title:"Update the package index",content:"Ensure your WSL2 Ubuntu packages are up to date.",code:"sudo apt update && sudo apt upgrade -y"},{title:"Install essential build tools",content:"Install build dependencies needed by npm packages with native addons.",code:"sudo apt install -y build-essential curl wget ca-certificates gnupg"},{title:"Install Node.js 20",content:"Add the NodeSource repository and install Node.js 20.",code:`curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify:
node --version   # v20.x.x
npm --version    # 10.x.x`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 2: Verify Docker Access"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Before installing NemoClaw, confirm that Docker is accessible from your WSL2 session."}),e.jsx(t,{title:"Verify Docker",language:"bash",code:`# Check Docker is available
docker --version
docker ps

# Run a test container
docker run --rm hello-world

# If Docker is not found, either:
# 1. Enable WSL Integration in Docker Desktop settings
# 2. Install Docker Engine directly (see previous section)`}),e.jsx(n,{title:"Common Issue: Docker Not Found in WSL2",children:e.jsxs("p",{children:["If ",e.jsx("code",{children:"docker"}),' is not found after installing Docker Desktop, open Docker Desktop settings and go to Resources > WSL Integration. Ensure the toggle for your Ubuntu distribution is enabled, then click "Apply & Restart". Close and reopen your WSL2 terminal.']})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 3: Install the NemoClaw CLI"}),e.jsx(o,{title:"Install NemoClaw",steps:[{title:"Run the NemoClaw install script",content:"Download and install the NemoClaw CLI inside WSL2.",code:"curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash"},{title:"Add NemoClaw to your PATH",content:"The install script usually handles this, but verify.",code:`# If nemoclaw is not found after installation:
echo 'export PATH="$HOME/.nemoclaw/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify:
nemoclaw --version`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 4: Onboard Your First Sandbox"}),e.jsx(o,{title:"Create your first sandbox",steps:[{title:"Run the onboard command",content:"This downloads the blueprint image and creates a sandbox. The first run downloads ~2.4 GB.",code:"nemoclaw onboard --name my-wsl-sandbox"},{title:"Wait for the download and setup",content:"The blueprint download takes 3-10 minutes depending on your internet connection.",code:`# Progress output:
# Downloading blueprint nemoclaw-base:latest...
# [====================>       ] 1.8 GB / 2.4 GB  75%
# Verifying image integrity... OK
# Creating sandbox "my-wsl-sandbox"...
# Applying default security policy...
# Starting OpenShell runtime...
# Sandbox "my-wsl-sandbox" is ready.`},{title:"Verify the sandbox",content:"Check that the sandbox is running and all components are healthy.",code:`nemoclaw list
# NAME              STATUS    BLUEPRINT              CREATED
# my-wsl-sandbox    running   nemoclaw-base:latest   1 minute ago

nemoclaw my-wsl-sandbox status
# All components should show healthy/running`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 5: Connect and Test"}),e.jsx(o,{title:"Verify the sandbox works",steps:[{title:"Connect to the sandbox",content:"Open an interactive OpenShell session.",code:"nemoclaw my-wsl-sandbox connect"},{title:"Run verification commands inside the sandbox",content:"Confirm the sandbox environment is working correctly.",code:`# Inside the sandbox:
whoami              # agent
hostname            # my-wsl-sandbox
uname -r            # Linux kernel version
openshell --version # OpenShell version

# Test policy enforcement
ls /home/agent/workspace  # Should succeed (allowed)
cat /etc/shadow           # Should fail (blocked by policy)

# Exit the sandbox
exit`},{title:"Run a non-interactive command",content:"Test command execution from the host side.",code:`nemoclaw my-wsl-sandbox exec -- echo "Hello from WSL2 sandbox!"
# Expected: Hello from WSL2 sandbox!`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Complete Installation Verification"}),e.jsx(t,{title:"Full verification script",language:"bash",code:`#!/usr/bin/env bash
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

echo "=== Verification Complete ==="`}),e.jsx(a,{type:"tip",title:"WSL2 Terminal Tips",children:e.jsx("p",{children:"For the best experience developing with NemoClaw on Windows, use Windows Terminal (the modern terminal app from Microsoft) rather than the legacy console. Windows Terminal supports tabs, split panes, and better font rendering. You can install it from the Microsoft Store. Set your WSL2 Ubuntu as the default profile for quick access."})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Your NemoClaw installation on Windows WSL2 is complete. The next section covers WSL2-specific troubleshooting for common issues with networking, DNS, Docker integration, and file system performance."})]})}const te=Object.freeze(Object.defineProperty({__proto__:null,default:D},Symbol.toStringTag,{value:"Module"}));function L(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Windows WSL2 Troubleshooting"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"WSL2 introduces a unique set of challenges compared to native Linux or macOS. The interaction between Windows, the WSL2 Linux kernel, and Docker can produce issues that do not occur on other platforms. This section covers the most common WSL2-specific problems and their solutions."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: Networking Problems"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"WSL2 uses a virtual network adapter with NAT. This means the WSL2 instance has a different IP address than the Windows host, and network traffic between them goes through a virtual bridge. This can cause issues with port forwarding, VPN connectivity, and service discovery."}),e.jsx(n,{title:"WSL2 IP Address Changes on Restart",children:e.jsxs("p",{children:["WSL2 gets a new IP address every time it restarts. Do not hard-code the WSL2 IP address in configurations. Use ",e.jsx("code",{children:"localhost"})," for accessing WSL2 services from Windows (localhostforwarding must be enabled), or use hostname resolution."]})}),e.jsx(t,{title:"Diagnose networking issues",language:"bash",code:`# Check WSL2 IP address
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
# localhostforwarding=true`}),e.jsx(o,{title:"Fix: WSL2 cannot reach the internet",steps:[{title:"Check DNS resolution",content:"DNS issues are the most common networking problem in WSL2.",code:`# Test DNS
nslookup google.com
# If this fails, DNS is the problem

# Check resolv.conf
cat /etc/resolv.conf`},{title:"Fix DNS by setting a manual nameserver",content:"If auto-generated DNS is not working, override it.",code:`# Prevent WSL from auto-generating resolv.conf
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
sudo chattr +i /etc/resolv.conf`},{title:"Restart WSL2",content:"Apply changes by restarting.",code:`# In PowerShell:
wsl --shutdown
# Then reopen Ubuntu`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: DNS Resolution Inside Sandboxes"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Even if DNS works in WSL2, sandboxes may have their own DNS issues because they run inside Docker containers within WSL2 -- two layers of network indirection."}),e.jsx(t,{title:"Fix sandbox DNS",language:"bash",code:`# Test DNS inside a sandbox
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
nemoclaw my-sandbox exec -- curl -s https://httpbin.org/ip`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: Docker Integration Not Working"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Docker Desktop's WSL2 integration can sometimes fail, causing the ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"docker"})," command to not be found or return errors inside WSL2."]}),e.jsx(o,{title:"Fix Docker Desktop WSL2 integration",steps:[{title:"Verify Docker Desktop is running",content:"Docker Desktop must be running on the Windows side.",code:`# Check if Docker Desktop is running
# Look for the Docker whale icon in the Windows system tray
# Or check from WSL2:
docker version 2>&1 | head -5`},{title:"Re-enable WSL2 integration",content:"Toggle the integration setting in Docker Desktop.",code:`# In Docker Desktop:
# Settings > Resources > WSL Integration
# 1. Disable integration for Ubuntu-22.04
# 2. Click "Apply & Restart"
# 3. Re-enable integration for Ubuntu-22.04
# 4. Click "Apply & Restart"`},{title:"Restart WSL2 and Docker Desktop",content:"A clean restart often fixes integration issues.",code:`# In PowerShell (as admin):
wsl --shutdown
# Close Docker Desktop
# Reopen Docker Desktop
# Wait for it to fully start
# Open WSL2 Ubuntu
docker ps`},{title:"Check the Docker socket",content:"Verify the Docker socket exists and is accessible.",code:`# Inside WSL2:
ls -la /var/run/docker.sock
# Should show a socket file owned by root:docker

# If missing, Docker Desktop integration is not connected
# Check Docker context:
docker context ls
# The active context should point to the Docker Desktop socket`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: File System Performance"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"WSL2 has two filesystem regions: the native Linux ext4 filesystem and the Windows NTFS filesystem (accessible via /mnt/c/). Accessing files across the boundary incurs significant performance penalties."}),e.jsx(n,{title:"Cross-Filesystem Access Is Very Slow",children:e.jsxs("p",{children:["Accessing Windows files from WSL2 (anything under ",e.jsx("code",{children:"/mnt/c/"}),") is 5-10x slower than accessing native WSL2 files (under ",e.jsx("code",{children:"/home/"}),"). NemoClaw sandboxes and Docker should always store their data on the native WSL2 filesystem. Never configure Docker's data-root or NemoClaw's data directory to point to a ",e.jsx("code",{children:"/mnt/"})," path."]})}),e.jsx(t,{title:"Ensure NemoClaw data is on the native filesystem",language:"bash",code:`# Check where NemoClaw stores its data
nemoclaw config get data_dir
# Should be under /home/... not /mnt/c/...

# Check where Docker stores its data
docker info | grep "Docker Root Dir"
# Should be /var/lib/docker (native ext4), not under /mnt/

# If your project files are on Windows:
# Bad (slow): Working directly in /mnt/c/Users/me/projects/
# Good (fast): Copy to WSL2 native filesystem
cp -r /mnt/c/Users/me/projects/my-agent ~/my-agent
# Work from ~/my-agent inside WSL2 and sandboxes`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: VPN Interference"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Corporate VPNs (Cisco AnyConnect, GlobalProtect, etc.) frequently conflict with WSL2 networking because they modify the Windows network routing table in ways that break WSL2's virtual network adapter."}),e.jsx(t,{title:"Fix VPN-related network issues",language:"bash",code:`# Symptom: WSL2 loses internet when VPN connects

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
# This makes WSL2 share the Windows network stack directly`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Issue: WSL2 Memory Not Released"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"WSL2 is known for not releasing memory back to Windows after it is no longer needed. The Vmmem process on Windows may consume large amounts of RAM even after you stop sandboxes."}),e.jsx(t,{title:"Reclaim WSL2 memory",language:"bash",code:`# Check memory usage inside WSL2
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
# memory=12GB`}),e.jsx(a,{type:"tip",title:"General WSL2 Debugging",children:e.jsxs("p",{children:["For any WSL2 issue not covered here, check the WSL2 logs: ",e.jsx("code",{children:"wsl --debug-console"}),' (Windows 11) or view the Windows Event Viewer under "Applications and Services Logs > Microsoft > Windows > WSL". The NemoClaw diagnostic bundle (',e.jsx("code",{children:"nemoclaw diagnostics"}),") also captures WSL2-specific information when run from inside WSL2."]})})]})}const ae=Object.freeze(Object.defineProperty({__proto__:null,default:L},Symbol.toStringTag,{value:"Module"}));function I(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Your First Connection"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["With NemoClaw installed and a sandbox running, it is time to connect for the first time and explore the sandbox environment. The ",e.jsxs("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:["nemoclaw ","<name>"," connect"]})," command opens an interactive OpenShell session inside the sandbox. This section covers what to expect when you first connect, what the initial sandbox state looks like, and how to orient yourself inside the environment."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Connecting to the Sandbox"}),e.jsx(o,{title:"Open your first connection",steps:[{title:"Connect to the sandbox",content:"Use the connect command with your sandbox name.",code:"nemoclaw my-sandbox connect"},{title:"Observe the connection output",content:"OpenShell displays a welcome banner and session information when you connect.",code:`# Expected output:
# Connecting to sandbox "my-sandbox"...
#
# ╔══════════════════════════════════════════════════╗
# ║           NemoClaw Sandbox Shell                  ║
# ║  OpenShell v3.2.1 | Policy: default               ║
# ║  Sandbox: my-sandbox | Blueprint: nemoclaw-base    ║
# ╚══════════════════════════════════════════════════╝
#
# Type 'help' for available commands.
# Type 'policy' to view active security restrictions.
#
# agent@my-sandbox:~$`}]}),e.jsx(i,{term:"OpenShell Session",definition:"An interactive terminal session inside a NemoClaw sandbox, mediated by the OpenShell runtime. OpenShell intercepts every command before execution, evaluates it against the active security policy, and either permits or denies it. The session looks and feels like a normal Linux shell but has policy-enforced guardrails.",example:"When you type `rm -rf /`, OpenShell intercepts the command, checks the policy, and blocks it with an error message: 'Policy violation: destructive filesystem operation denied.'",seeAlso:["Security Policy","Command Filtering","Sandbox"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Initial Sandbox State"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"A freshly created sandbox has a clean, minimal environment. Understanding the initial layout helps you know where to put files, what tools are available, and what the default security boundaries look like."}),e.jsx(t,{title:"Explore the initial sandbox filesystem",language:"bash",code:`# Check your identity
whoami
# agent

id
# uid=1000(agent) gid=1000(agent) groups=1000(agent)

# Check your home directory
pwd
# /home/agent

ls -la /home/agent/
# drwxr-xr-x  agent agent  workspace/
# -rw-r--r--  agent agent  .bashrc
# -rw-r--r--  agent agent  .profile

# The workspace directory is your primary working area
ls /home/agent/workspace/
# (empty on first connection)`}),e.jsx(t,{title:"Check available tools",language:"bash",code:`# Pre-installed tools in the default blueprint
node --version      # v20.x.x
npm --version       # 10.x.x
python3 --version   # 3.11.x
pip3 --version      # pip 23.x.x
git --version       # 2.34.x
curl --version | head -1
jq --version

# OpenShell commands
openshell --version
openshell status
openshell policy`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Understanding the Security Context"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Every action you take inside the sandbox is filtered through the active security policy. On first connection with the default policy, the following rules are in effect:"}),e.jsx(t,{title:"View the active security policy",language:"bash",code:`# View the full policy
openshell policy

# Example output:
# === Active Security Policy: default ===
#
# Filesystem:
#   READ:   /home/agent/**        ALLOW
#   READ:   /usr/**               ALLOW
#   READ:   /etc/**               ALLOW (except /etc/shadow, /etc/sudoers)
#   WRITE:  /home/agent/**        ALLOW
#   WRITE:  /tmp/**               ALLOW
#   WRITE:  /var/tmp/**           ALLOW
#   WRITE:  (everything else)     DENY
#
# Network:
#   OUTBOUND: ports 80,443        ALLOW (HTTP/HTTPS)
#   OUTBOUND: (other ports)       DENY
#   INBOUND:  port 8080           ALLOW
#   INBOUND:  (other ports)       DENY
#
# Commands:
#   rm -rf /                      DENY (destructive pattern)
#   sudo *                        DENY (privilege escalation)
#   (all other commands)          ALLOW
#
# 12 rules active.`}),e.jsx(a,{type:"info",title:"Policy Enforcement Is Transparent",children:e.jsxs("p",{children:["When a command is allowed, it executes normally with no visible overhead. When a command is denied, OpenShell prints a clear error message explaining which rule was violated. You can also run ",e.jsx("code",{children:"openshell audit"})," to see a log of all policy evaluations for your session, including both allowed and denied actions."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Testing Policy Boundaries"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"It is valuable to test the policy boundaries on first connection to understand what is and is not allowed. Try these commands to see how the default policy responds."}),e.jsx(t,{title:"Test allowed and denied operations",language:"bash",code:`# ALLOWED: Read files in your workspace
echo "Hello NemoClaw" > /home/agent/workspace/test.txt
cat /home/agent/workspace/test.txt
# Hello NemoClaw

# ALLOWED: Write to /tmp
echo "temp data" > /tmp/test.txt
cat /tmp/test.txt

# DENIED: Write outside allowed directories
echo "test" > /etc/test.txt
# Error: Policy violation - filesystem.write.deny: /etc/test.txt

# DENIED: Read sensitive files
cat /etc/shadow
# Error: Policy violation - filesystem.read.deny: /etc/shadow

# DENIED: Privilege escalation
sudo apt install something
# Error: Policy violation - command.deny: sudo

# ALLOWED: Network access to HTTPS
curl -s https://httpbin.org/ip
# Returns your IP

# DENIED: Network access to non-standard ports
curl http://example.com:8888
# Error: Policy violation - network.outbound.deny: port 8888`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Multiple Connections"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"You can open multiple simultaneous connections to the same sandbox. Each connection gets its own OpenShell session but shares the same filesystem and policy. This is useful for running a process in one terminal while monitoring it in another."}),e.jsx(t,{title:"Multiple connections",language:"bash",code:`# Terminal 1: Connect and start a long-running process
nemoclaw my-sandbox connect
# Inside sandbox:
python3 -m http.server 8080

# Terminal 2: Connect and test the process
nemoclaw my-sandbox connect
# Inside sandbox:
curl http://localhost:8080

# You can also run non-interactive commands without connecting:
nemoclaw my-sandbox exec -- curl http://localhost:8080`}),e.jsx(o,{title:"Disconnect from the sandbox",steps:[{title:"Exit the OpenShell session",content:"Type exit or press Ctrl+D to disconnect. The sandbox continues running.",code:`exit
# Or press Ctrl+D

# The sandbox keeps running after you disconnect:
nemoclaw my-sandbox status
# Status: running`}]}),e.jsx(a,{type:"tip",title:"Sandbox Persists After Disconnect",children:e.jsxs("p",{children:["Disconnecting from a sandbox does not stop it. The sandbox continues running, and any processes you started remain active. To stop a sandbox, use ",e.jsx("code",{children:"nemoclaw my-sandbox stop"}),". To reconnect, use ",e.jsx("code",{children:"nemoclaw my-sandbox connect"})," again."]})})]})}const oe=Object.freeze(Object.defineProperty({__proto__:null,default:I},Symbol.toStringTag,{value:"Module"}));function A(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Health Checks and Status Monitoring"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Monitoring the health of your NemoClaw sandboxes is essential for reliable operation. A sandbox consists of multiple components -- the Docker container, the OpenShell runtime, the security policy engine, the network stack, and the filesystem layer. Each component can independently succeed or fail. NemoClaw provides several commands for checking sandbox health at different levels of detail."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Quick Health Check"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The fastest way to check if a sandbox is healthy is the ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"health"})," command. It returns a single word: healthy, degraded, or unhealthy."]}),e.jsx(t,{title:"Quick health check",language:"bash",code:`# Single sandbox health
nemoclaw my-sandbox health
# healthy

# Health check with exit code (useful for scripting)
nemoclaw my-sandbox health --quiet
echo $?
# 0 = healthy, 1 = degraded, 2 = unhealthy

# Check all sandboxes
nemoclaw list --health
# NAME              STATUS    HEALTH      UPTIME
# my-sandbox        running   healthy     2h 15m
# test-sandbox      running   degraded    45m
# old-sandbox       stopped   --          --`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Detailed Status"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"status"})," command provides a detailed breakdown of every sandbox component."]}),e.jsx(t,{title:"Detailed status output",language:"bash",code:`nemoclaw my-sandbox status

# Sandbox: my-sandbox
# Status:  running
# Health:  healthy
# Uptime:  2h 15m 32s
# Created: 2026-03-27 10:30:00 UTC
#
# Components:
#   Container    running    Docker: abc123def456
#   OpenShell    healthy    PID: 1842, port: 8022, sessions: 0
#   Policy       applied    default (12 rules, 0 violations last hour)
#   Network      up         172.17.0.2, bridge, egress: filtered
#   Filesystem   ok         overlay2, 342 MB writable, 5.8 GB total
#   Landlock     active     ABI v3, 8 filesystem rules, 2 network rules
#
# Resources:
#   CPU:         2/2 cores, 1.2% current, 3.4% avg (1h)
#   Memory:      412 MB / 4 GB (10.3%), peak: 1.1 GB
#   Disk:        342 MB writable / 10 GB limit
#   Network I/O: 12 MB in, 4 MB out (lifetime)
#   Processes:   8 running`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Understanding Health States"}),e.jsx(s,{title:"Sandbox Health States",headers:["State","Meaning","Action Required"],rows:[["healthy","All components running normally","None"],["degraded","Running but one or more components have warnings","Investigate; may self-resolve"],["unhealthy","One or more critical components have failed","Immediate attention required"],["starting","Sandbox is in the process of starting up","Wait 30-60 seconds"],["stopped","Sandbox is intentionally stopped","Start with: nemoclaw <name> start"],["error","Sandbox failed to start or crashed","Check logs; may need recreation"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"OpenShell Health"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"OpenShell is the most critical component for agent operations. If OpenShell is unhealthy, agents cannot connect or execute commands. You can check OpenShell specifically."}),e.jsx(t,{title:"Check OpenShell health",language:"bash",code:`# Check OpenShell from outside the sandbox
nemoclaw my-sandbox exec -- openshell status

# Expected output:
# OpenShell v3.2.1
# Status: running
# PID: 1842
# Listening: 0.0.0.0:8022
# Active sessions: 0
# Policy loaded: yes (default, 12 rules)
# Uptime: 2h 15m 32s
# Commands processed: 847
# Policy violations: 3

# Check OpenShell's internal health endpoint
nemoclaw my-sandbox exec -- curl -s http://localhost:8023/health
# {"status":"healthy","version":"3.2.1","policy":"loaded","sessions":0}`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Verifying Policy Application"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"A sandbox can be running but have its security policy incorrectly applied or missing. This is a dangerous state because the agent would operate without restrictions. Always verify that the policy is active."}),e.jsx(t,{title:"Verify security policy",language:"bash",code:`# Check policy status from outside
nemoclaw my-sandbox policy show
# Displays the full active policy

nemoclaw my-sandbox policy verify
# Runs a verification check:
# [OK] Policy file exists: /etc/nemoclaw/policy.yaml
# [OK] Policy loaded by OpenShell: 12 rules
# [OK] Landlock restrictions active: 8 filesystem, 2 network
# [OK] Policy hash matches expected: sha256:abc123...

# Test policy enforcement with a probe command
nemoclaw my-sandbox exec -- cat /etc/shadow
# Should return: Permission denied (policy: filesystem.read.deny)
# If this succeeds, the policy is NOT working!`}),e.jsx(n,{title:"Always Verify Policy After Changes",children:e.jsxs("p",{children:["After modifying a sandbox's security policy, always run ",e.jsxs("code",{children:["nemoclaw ","<name>"," policy verify"]})," to confirm the new policy was loaded correctly. A syntax error in the policy file can cause OpenShell to fall back to a permissive mode, which defeats the purpose of sandboxing."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Automated Health Monitoring"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For production deployments, you may want to monitor sandbox health continuously. NemoClaw provides a watch mode and also supports integration with standard monitoring tools."}),e.jsx(t,{title:"Continuous health monitoring",language:"bash",code:`# Watch sandbox status in real-time (refreshes every 5 seconds)
nemoclaw my-sandbox status --watch

# Check all sandboxes in a loop (for cron or monitoring scripts)
nemoclaw list --health --format json | jq '.[] | select(.health != "healthy")'

# Example monitoring script
#!/usr/bin/env bash
SANDBOXES=$(nemoclaw list --format json | jq -r '.[].name')
for sb in $SANDBOXES; do
  HEALTH=$(nemoclaw "$sb" health --quiet; echo $?)
  if [ "$HEALTH" != "0" ]; then
    echo "ALERT: Sandbox $sb is not healthy (exit code: $HEALTH)"
    nemoclaw "$sb" status
  fi
done`}),e.jsx(a,{type:"tip",title:"JSON Output for Automation",children:e.jsxs("p",{children:["Most NemoClaw commands support ",e.jsx("code",{children:"--format json"})," for machine-readable output. This makes it easy to integrate NemoClaw health checks with monitoring systems like Prometheus, Datadog, or simple cron-based alerting scripts."]})}),e.jsx(r,{question:"A sandbox shows status 'running' but health 'degraded'. What should you do first?",options:["Immediately destroy and recreate the sandbox","Run `nemoclaw <name> status` to identify which component has a warning","Ignore it -- degraded means everything is fine","Run `nemoclaw <name> stop` to prevent further issues"],correctIndex:1,explanation:"A 'degraded' state means the sandbox is running but one or more components have warnings. The first step is to check the detailed status to identify which component is degraded. Many degraded states self-resolve (e.g., temporary high memory usage). Destroying or stopping the sandbox is premature without first understanding the issue."})]})}const ne=Object.freeze(Object.defineProperty({__proto__:null,default:A},Symbol.toStringTag,{value:"Module"}));function O(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Logs and Diagnostics"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When a sandbox misbehaves, logs are your primary diagnostic tool. NemoClaw generates logs at multiple levels: the NemoClaw CLI itself, the Docker container, the OpenShell runtime, and the security policy engine. Understanding where each log lives and how to interpret its output is essential for effective troubleshooting."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Sandbox Logs"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The ",e.jsxs("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:["nemoclaw ","<name>"," logs"]})," command is the primary way to view sandbox logs. It aggregates output from the container, OpenShell, and policy engine into a single stream."]}),e.jsx(t,{title:"View sandbox logs",language:"bash",code:`# View recent logs (last 100 lines by default)
nemoclaw my-sandbox logs

# View more lines
nemoclaw my-sandbox logs --lines 500

# Follow logs in real-time (like tail -f)
nemoclaw my-sandbox logs --follow

# Show timestamps
nemoclaw my-sandbox logs --timestamps

# Combine: follow with timestamps
nemoclaw my-sandbox logs --follow --timestamps

# Filter by component
nemoclaw my-sandbox logs --component openshell
nemoclaw my-sandbox logs --component policy
nemoclaw my-sandbox logs --component container`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Log Locations"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["While the ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw logs"})," command is the preferred interface, it is useful to know where logs are physically stored for advanced debugging."]}),e.jsx(t,{title:"Log file locations",language:"bash",code:`# NemoClaw CLI logs (on the host)
ls ~/.nemoclaw/logs/
# cli.log          - NemoClaw CLI operations
# onboard.log      - Onboarding process output

# Container logs (managed by Docker)
docker logs $(docker ps -q --filter "label=nemoclaw.name=my-sandbox")

# Logs inside the sandbox
nemoclaw my-sandbox exec -- ls /var/log/nemoclaw/
# openshell.log    - OpenShell runtime events
# policy.log       - Policy evaluation decisions
# audit.log        - Complete audit trail of all actions

# Docker daemon logs (system-level)
sudo journalctl -u docker --since "1 hour ago" | tail -50`}),e.jsx(i,{term:"Audit Log",definition:"A comprehensive, append-only log of every action taken inside a NemoClaw sandbox. Each entry records the timestamp, the command or operation attempted, the policy rule that was evaluated, and the result (allow/deny). The audit log cannot be modified or deleted from inside the sandbox, ensuring a tamper-resistant record of all agent activity.",example:"An audit log entry: '2026-03-27T14:22:05Z CMD cat /etc/passwd POLICY filesystem.read.allow RESULT ALLOW USER agent'",seeAlso:["Security Policy","OpenShell","Policy Violations"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Interpreting Log Output"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw logs use a structured format with severity levels and component tags. Understanding this format helps you quickly identify the source and severity of issues."}),e.jsx(t,{title:"Log format and examples",language:"bash",code:`# Log format:
# TIMESTAMP [LEVEL] [COMPONENT] message

# INFO level - normal operations
# 2026-03-27T14:22:05Z [INFO] [openshell] Session opened: user=agent, remote=172.17.0.1
# 2026-03-27T14:22:06Z [INFO] [policy] Command evaluated: cmd="ls /home/agent", result=ALLOW

# WARN level - non-critical issues
# 2026-03-27T14:25:12Z [WARN] [container] Memory usage high: 3.6 GB / 4 GB (90%)
# 2026-03-27T14:26:00Z [WARN] [openshell] Session idle for 300s, sending keepalive

# ERROR level - failures requiring attention
# 2026-03-27T14:30:45Z [ERROR] [policy] Policy violation: cmd="sudo su", rule=command.deny.sudo
# 2026-03-27T14:31:00Z [ERROR] [openshell] Failed to execute command: exit code 137 (OOM killed)

# FATAL level - component failure
# 2026-03-27T14:35:00Z [FATAL] [openshell] OpenShell process crashed: signal 9
# 2026-03-27T14:35:01Z [FATAL] [container] Container exited unexpectedly: exit code 1`}),e.jsx(a,{type:"info",title:"Policy Violations Are Expected",children:e.jsxs("p",{children:["Seeing ",e.jsx("code",{children:"[ERROR] [policy] Policy violation"})," in the logs is normal and expected. It means the policy is working correctly by blocking disallowed operations. These entries are errors from the agent's perspective (the command failed) but successes from the security perspective (the policy was enforced). Only be concerned if you see violations for commands that should be allowed, which indicates a policy misconfiguration."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Debug Mode"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When standard logs are insufficient, NemoClaw supports a debug mode that produces verbose output including internal state transitions, detailed policy evaluation traces, and low-level container events."}),e.jsx(t,{title:"Enable debug mode",language:"bash",code:`# Run a command with debug logging
nemoclaw my-sandbox exec --debug -- ls /home/agent

# Debug output includes:
# [DEBUG] [cli] Resolving sandbox "my-sandbox"...
# [DEBUG] [cli] Container ID: abc123def456
# [DEBUG] [cli] Sending exec request to OpenShell at 172.17.0.2:8022
# [DEBUG] [openshell] Received command: "ls /home/agent"
# [DEBUG] [policy] Evaluating: type=filesystem.read, path=/home/agent
# [DEBUG] [policy] Rule match: filesystem.read.allow pattern="/home/agent/**"
# [DEBUG] [policy] Result: ALLOW
# [DEBUG] [openshell] Executing: /bin/ls /home/agent
# workspace
# [DEBUG] [openshell] Command exit code: 0

# Enable debug logging for an entire sandbox (persistent until disabled)
nemoclaw my-sandbox config set log_level debug

# Disable debug logging
nemoclaw my-sandbox config set log_level info`}),e.jsx(n,{title:"Debug Mode Generates High Volume Logs",children:e.jsx("p",{children:"Debug mode logs every internal operation, which can generate hundreds of megabytes of logs per hour under active use. Enable debug mode only for diagnosing specific issues, and disable it when done. Leaving debug mode enabled in production will fill disk space and degrade performance."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Generating a Diagnostic Bundle"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When you need to share diagnostic information with the NemoClaw team or community, the diagnostics command collects all relevant information into a single archive."}),e.jsx(o,{title:"Generate and review a diagnostic bundle",steps:[{title:"Generate the bundle",content:"This collects system info, Docker state, sandbox logs, and configuration.",code:`nemoclaw diagnostics --output /tmp/nemoclaw-diag.tar.gz

# Output:
# Collecting system information...
# Collecting Docker configuration...
# Collecting sandbox logs (my-sandbox)...
# Collecting policy state...
# Collecting NemoClaw configuration...
#
# Diagnostic bundle saved to: /tmp/nemoclaw-diag.tar.gz
# Size: 2.4 MB`},{title:"Review what is included",content:"Check the bundle contents before sharing.",code:`tar tzf /tmp/nemoclaw-diag.tar.gz
# nemoclaw-diag/system-info.txt
# nemoclaw-diag/docker-info.txt
# nemoclaw-diag/docker-daemon.json
# nemoclaw-diag/sandboxes/my-sandbox/status.txt
# nemoclaw-diag/sandboxes/my-sandbox/logs.txt
# nemoclaw-diag/sandboxes/my-sandbox/policy.yaml
# nemoclaw-diag/sandboxes/my-sandbox/config.yaml
# nemoclaw-diag/cli-config.yaml
# nemoclaw-diag/cli-logs.txt`},{title:"Verify no sensitive data is included",content:"The diagnostics command excludes secrets by default, but verify.",code:`# The bundle excludes:
# - Environment variables containing "KEY", "SECRET", "TOKEN", "PASSWORD"
# - Files in /home/agent/workspace (your code)
# - Docker registry credentials
# Review the system-info.txt if concerned about host information`}]}),e.jsx(a,{type:"tip",title:"Log Rotation",children:e.jsxs("p",{children:["NemoClaw automatically rotates sandbox logs to prevent disk exhaustion. The default retention is 7 days or 100 MB per sandbox, whichever comes first. You can adjust these limits with ",e.jsxs("code",{children:["nemoclaw ","<name>"," config set log_retention_days 14"]})," and",e.jsxs("code",{children:["nemoclaw ","<name>"," config set log_max_size 200m"]}),"."]})})]})}const se=Object.freeze(Object.defineProperty({__proto__:null,default:O},Symbol.toStringTag,{value:"Module"}));function U(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Updating NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw is actively developed, with regular updates that include security patches, new features, performance improvements, and updated blueprint images. Keeping NemoClaw up to date is important both for security (new policy capabilities, vulnerability fixes) and functionality (new CLI commands, improved OpenShell features). This section covers how to update each component, handle blueprint updates, manage breaking changes, and roll back if needed."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Update Components Overview"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw has three independently versioned components that can be updated separately:"}),e.jsx(s,{title:"NemoClaw Update Components",headers:["Component","What It Is","Update Command"],rows:[["CLI","The nemoclaw command-line tool on your host","curl install script or nemoclaw self-update"],["Blueprint","The base sandbox image (OS, OpenShell, tools)","nemoclaw blueprint update"],["Sandbox","A running sandbox instance","nemoclaw <name> rebuild (creates new from updated blueprint)"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Updating the CLI"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The NemoClaw CLI can update itself in place. This updates the CLI binary and its Node.js dependencies without affecting any running sandboxes."}),e.jsx(o,{title:"Update the NemoClaw CLI",steps:[{title:"Check your current version",content:"See what version you are running and what is available.",code:`nemoclaw --version
# nemoclaw v2.3.1

nemoclaw self-update --check
# Current: v2.3.1
# Latest:  v2.4.0
# Update available!`},{title:"Run the self-update",content:"Download and install the latest CLI version.",code:`nemoclaw self-update

# Output:
# Downloading nemoclaw v2.4.0...
# Verifying checksum... OK
# Installing... OK
# Updated: v2.3.1 -> v2.4.0
#
# Release notes: https://github.com/nvidia/nemoclaw/releases/v2.4.0`},{title:"Verify the update",content:"Confirm the new version is installed.",code:`nemoclaw --version
# nemoclaw v2.4.0`}]}),e.jsx(a,{type:"info",title:"Alternative: Re-run the Install Script",children:e.jsxs("p",{children:["If ",e.jsx("code",{children:"nemoclaw self-update"})," fails (e.g., due to permission issues), you can always re-run the original install script. It detects the existing installation and upgrades it: ",e.jsx("code",{children:"curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash"})]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Updating Blueprints"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Blueprint updates bring new versions of the sandbox base image, including updated OpenShell versions, security patches, and pre-installed tool updates. Blueprint updates do not automatically affect existing sandboxes -- they only affect newly created sandboxes."}),e.jsx(o,{title:"Update the blueprint",steps:[{title:"Check for blueprint updates",content:"See what blueprint versions are available.",code:`nemoclaw blueprint list

# BLUEPRINT              VERSION    SIZE       RELEASED
# nemoclaw-base:latest   v2.4.0     2.4 GB     2026-03-25
# nemoclaw-base:v2.3.0   v2.3.0     2.3 GB     2026-02-15
# nemoclaw-dgx:latest    v2.4.0     3.1 GB     2026-03-25`},{title:"Pull the latest blueprint",content:"Download the updated blueprint image.",code:`nemoclaw blueprint update

# Pulling nemoclaw-base:latest...
# [====================>       ] 1.8 GB / 2.4 GB
# Verifying integrity... OK
# Blueprint updated: v2.3.0 -> v2.4.0`},{title:"Verify the update",content:"Confirm the new blueprint is available locally.",code:`nemoclaw blueprint list --local
# Shows locally cached blueprints with their versions`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Updating Existing Sandboxes"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Existing sandboxes are not automatically updated when you pull a new blueprint. To update a sandbox, you must rebuild it from the new blueprint. The rebuild process preserves your sandbox name, configuration, and policy but replaces the base image."}),e.jsx(n,{title:"Rebuild Destroys Sandbox State",children:e.jsxs("p",{children:["Rebuilding a sandbox creates a new container from the updated blueprint. Any files the agent created inside the sandbox (installed packages, generated files, data) will be lost unless they are in a persisted volume. Before rebuilding, export any important data:",e.jsx("code",{className:"block mt-2",children:"nemoclaw my-sandbox exec -- tar czf /tmp/backup.tar.gz /home/agent/workspace"}),e.jsx("code",{className:"block mt-1",children:"nemoclaw my-sandbox cp /tmp/backup.tar.gz ./backup.tar.gz"})]})}),e.jsx(o,{title:"Rebuild a sandbox with the updated blueprint",steps:[{title:"Back up important data",content:"Export any files from the sandbox you want to preserve.",code:`# Copy workspace files out of the sandbox
nemoclaw my-sandbox cp /home/agent/workspace/ ./workspace-backup/`},{title:"Rebuild the sandbox",content:"This stops the sandbox, creates a new container from the updated blueprint, and starts it.",code:`nemoclaw my-sandbox rebuild

# Output:
# Stopping sandbox "my-sandbox"...
# Creating new container from nemoclaw-base:v2.4.0...
# Applying policy: default
# Starting OpenShell...
# Sandbox "my-sandbox" rebuilt successfully.
# Previous: nemoclaw-base:v2.3.0
# Current:  nemoclaw-base:v2.4.0`},{title:"Restore backed-up data",content:"Copy your workspace files back into the rebuilt sandbox.",code:"nemoclaw my-sandbox cp ./workspace-backup/ /home/agent/workspace/"},{title:"Verify the rebuild",content:"Confirm the sandbox is running with the new blueprint.",code:`nemoclaw my-sandbox status
# Blueprint should show the new version`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Handling Breaking Changes"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw follows semantic versioning. Major version updates (e.g., v2.x to v3.x) may include breaking changes to CLI commands, policy format, or blueprint structure. Minor and patch updates are backward compatible."}),e.jsx(t,{title:"Check for breaking changes before updating",language:"bash",code:`# View release notes for available updates
nemoclaw self-update --check --verbose

# Output includes breaking change warnings:
# Current: v2.4.0
# Latest:  v3.0.0
#
# !! BREAKING CHANGES in v3.0.0:
# - Policy format v2 is deprecated; migrate to v3 format
# - 'nemoclaw exec' renamed to 'nemoclaw run'
# - Blueprint image registry URL changed
#
# Migration guide: https://docs.nemoclaw.nvidia.com/migrate-v3

# For major updates, read the migration guide before updating
# You can pin to a specific minor version:
nemoclaw self-update --version 2.4.1`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Rollback Procedures"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If an update causes problems, you can roll back both the CLI and blueprints to previous versions."}),e.jsx(t,{title:"Roll back the CLI",language:"bash",code:`# Install a specific CLI version
nemoclaw self-update --version 2.3.1

# Or re-run the install script with a specific version:
curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash -s -- --version 2.3.1

# Verify
nemoclaw --version
# nemoclaw v2.3.1`}),e.jsx(t,{title:"Roll back a blueprint",language:"bash",code:`# Pull a specific blueprint version
nemoclaw blueprint pull nemoclaw-base:v2.3.0

# Rebuild sandbox with the older blueprint
nemoclaw my-sandbox rebuild --blueprint nemoclaw-base:v2.3.0

# Verify
nemoclaw my-sandbox status
# Blueprint: nemoclaw-base:v2.3.0`}),e.jsx(a,{type:"tip",title:"Version Pinning for Production",children:e.jsx("p",{children:'In production environments, pin both the CLI version and blueprint version rather than using "latest". This prevents unexpected changes when updates are released. Record the exact versions in your deployment documentation and update on your own schedule after testing in a development environment.'})}),e.jsx(r,{question:"After updating the NemoClaw blueprint to a new version, what must you do to apply the update to an existing sandbox?",options:["Nothing -- sandboxes auto-update when the blueprint is pulled","Run `nemoclaw <name> rebuild` to recreate the sandbox from the new blueprint","Run `nemoclaw <name> restart` to load the new blueprint","Delete the sandbox and run `nemoclaw onboard` again"],correctIndex:1,explanation:"Existing sandboxes are not automatically updated when a new blueprint is pulled. You must explicitly rebuild the sandbox with `nemoclaw <name> rebuild`, which creates a new container from the updated blueprint while preserving the sandbox name, configuration, and policy. Deleting and re-onboarding works but is unnecessary."}),e.jsx(l,{references:[{type:"docs",title:"NemoClaw Release Notes",url:"https://docs.nemoclaw.nvidia.com/releases",description:"Full release notes for all NemoClaw versions, including breaking changes and migration guides."},{type:"docs",title:"NemoClaw Blueprint Changelog",url:"https://docs.nemoclaw.nvidia.com/blueprints/changelog",description:"Detailed changelog for blueprint image updates, including OpenShell and tool version changes."},{type:"github",title:"NemoClaw GitHub Repository",url:"https://github.com/nvidia/nemoclaw",description:"Source code, issue tracker, and community discussions."}]})]})}const ie=Object.freeze(Object.defineProperty({__proto__:null,default:U},Symbol.toStringTag,{value:"Module"}));export{E as a,M as b,R as c,V as d,B as e,_ as f,F as g,q as h,H as i,$ as j,z as k,X as l,K as m,Y as n,Z as o,Q as p,J as q,ee as r,W as s,te as t,ae as u,oe as v,ne as w,se as x,ie as y};
