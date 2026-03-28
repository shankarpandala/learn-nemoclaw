import { CodeBlock, NoteBlock, WarningBlock, StepBlock } from '../../../components/content'

export default function LocalGpuSetup() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Setting Up Local GPU for Inference
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before you can run any local inference engine -- whether NVIDIA NIM, vLLM, or Ollama --
        your system needs a properly configured GPU stack. This means installing the NVIDIA
        driver, the CUDA toolkit, and the NVIDIA Container Toolkit so that Docker containers
        can access your GPU hardware. This section walks through each layer of the stack,
        explains what it does, and provides verification steps to confirm everything is working
        correctly.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The GPU software stack is layered: the NVIDIA kernel driver at the bottom communicates
        directly with the hardware, CUDA provides the programming API that inference engines use,
        and the Container Toolkit bridges Docker's container runtime with the GPU driver so that
        containers can access GPU resources. Each layer depends on the one below it, and version
        compatibility between layers matters.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 1: Install the NVIDIA Driver
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NVIDIA driver is the kernel module that enables your operating system to communicate
        with the GPU. Without it, the GPU is invisible to software. For inference workloads, you
        need a relatively recent driver version -- generally 535 or newer for current model
        frameworks.
      </p>

      <StepBlock number={1} title="Check for existing NVIDIA driver">
        <p>
          Before installing, check whether a driver is already present. Many Linux distributions
          ship with the nouveau open-source driver, which does not support CUDA and must be
          replaced with NVIDIA's proprietary driver.
        </p>
        <CodeBlock language="bash">{`# Check if NVIDIA driver is installed
nvidia-smi

# If this command succeeds, note the driver version
# and CUDA version shown in the top-right corner.
# If it fails with "command not found", proceed with installation.`}</CodeBlock>
      </StepBlock>

      <StepBlock number={2} title="Install the NVIDIA driver on Ubuntu/Debian">
        <CodeBlock language="bash">{`# Update package lists
sudo apt update

# Install the recommended driver automatically
sudo ubuntu-drivers install

# Alternatively, install a specific version:
sudo apt install nvidia-driver-550

# Reboot is required after driver installation
sudo reboot`}</CodeBlock>
        <p>
          On RHEL/CentOS/Fedora systems, the process differs slightly -- you will typically
          use the NVIDIA CUDA repository or the RPM Fusion repository. On Arch Linux, the nvidia
          package from the official repositories is the standard path.
        </p>
      </StepBlock>

      <StepBlock number={3} title="Verify the driver installation">
        <CodeBlock language="bash">{`# After reboot, verify the driver is loaded
nvidia-smi

# Expected output includes:
# - Driver Version (e.g., 550.120)
# - CUDA Version (e.g., 12.4) -- this is the max CUDA version the driver supports
# - GPU name, temperature, memory usage, power consumption

# Check the driver module is loaded in the kernel
lsmod | grep nvidia`}</CodeBlock>
      </StepBlock>

      <NoteBlock type="info" title="Driver Version vs. CUDA Version">
        <p>
          The nvidia-smi output shows a "CUDA Version" in the top-right corner. This is the
          maximum CUDA version that the driver supports -- it does not mean CUDA is installed.
          You still need to install the CUDA toolkit separately. The driver and CUDA toolkit
          versions must be compatible: a driver that reports CUDA 12.4 support can run any
          CUDA toolkit version up to 12.4.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 2: Install the CUDA Toolkit
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The CUDA toolkit provides the libraries and tools that GPU-accelerated applications need.
        While many containerized inference engines bundle their own CUDA libraries inside the
        container, having CUDA installed on the host is useful for verification, debugging, and
        running non-containerized tools.
      </p>

      <StepBlock number={4} title="Install CUDA toolkit">
        <CodeBlock language="bash">{`# Add the NVIDIA CUDA repository (Ubuntu 22.04 example)
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update

# Install the CUDA toolkit (this installs libraries, not a new driver)
sudo apt install cuda-toolkit-12-4

# Add CUDA to your PATH
echo 'export PATH=/usr/local/cuda/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc`}</CodeBlock>
      </StepBlock>

      <StepBlock number={5} title="Verify CUDA installation">
        <CodeBlock language="bash">{`# Check CUDA compiler version
nvcc --version

# Expected output: release 12.4 (or your installed version)

# Run a simple CUDA sample to verify GPU compute works
# (if cuda-samples are installed)
cd /usr/local/cuda/samples/1_Utilities/deviceQuery
sudo make
./deviceQuery

# This should list your GPU(s) and report "Result = PASS"`}</CodeBlock>
      </StepBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step 3: Install Docker and the NVIDIA Container Toolkit
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NVIDIA Container Toolkit (formerly nvidia-docker2) enables Docker containers to
        access the host's GPU. Without it, running docker run --gpus all will fail because
        Docker has no native understanding of NVIDIA GPUs. The Container Toolkit installs a
        custom runtime hook that maps the GPU driver, device files, and CUDA libraries into
        containers at launch time.
      </p>

      <StepBlock number={6} title="Install Docker (if not already present)">
        <CodeBlock language="bash">{`# Install Docker using the official convenience script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to the docker group to avoid needing sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify Docker is working
docker run hello-world`}</CodeBlock>
      </StepBlock>

      <StepBlock number={7} title="Install the NVIDIA Container Toolkit">
        <CodeBlock language="bash">{`# Configure the repository
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey \\
  | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list \\
  | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' \\
  | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt update

# Install the toolkit
sudo apt install -y nvidia-container-toolkit

# Configure Docker to use the NVIDIA runtime
sudo nvidia-ctk runtime configure --runtime=docker

# Restart Docker to apply changes
sudo systemctl restart docker`}</CodeBlock>
      </StepBlock>

      <StepBlock number={8} title="Verify GPU access from Docker">
        <CodeBlock language="bash">{`# Run nvidia-smi inside a container
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi

# This should show the same nvidia-smi output as running on the host.
# If it works, your GPU stack is fully configured and ready for
# NIM, vLLM, Ollama, or any other containerized inference engine.`}</CodeBlock>
      </StepBlock>

      <WarningBlock title="Common Pitfall: Secure Boot">
        <p>
          If your system has Secure Boot enabled, the NVIDIA kernel module may fail to load
          because it is not signed with a trusted key. You will see nvidia-smi fail with
          "NVIDIA-SMI has failed" or the driver module will not appear in lsmod output.
          Solutions include: enrolling the NVIDIA module signing key in your system's MOK
          (Machine Owner Key) database using mokutil, or disabling Secure Boot in BIOS. The
          Ubuntu installer usually prompts for MOK enrollment during driver installation -- do
          not skip this step.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Complete Verification Checklist
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        After completing all installation steps, run through this checklist to confirm your
        system is ready for local inference:
      </p>

      <CodeBlock
        language="bash"
        title="Full verification script"
      >{`#!/bin/bash
echo "=== NVIDIA Driver ==="
nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv,noheader
echo ""

echo "=== CUDA Toolkit ==="
nvcc --version 2>/dev/null || echo "CUDA toolkit not installed (optional for containers)"
echo ""

echo "=== Docker ==="
docker --version
echo ""

echo "=== NVIDIA Container Toolkit ==="
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi > /dev/null 2>&1 \\
  && echo "GPU access from Docker: OK" \\
  || echo "GPU access from Docker: FAILED"
echo ""

echo "=== GPU Details ==="
nvidia-smi --query-gpu=name,memory.total,memory.free,temperature.gpu --format=csv`}</CodeBlock>

      <NoteBlock type="info" title="Headless Servers and SSH">
        <p>
          If you are setting up a headless server (no monitor attached), the NVIDIA driver
          installation is the same, but you should install the "server" driver variant which
          omits X11/display components. On Ubuntu, use nvidia-driver-550-server instead of
          nvidia-driver-550. Also ensure that the GPU is set to persistence mode with
          nvidia-smi -pm 1 to avoid the overhead of driver initialization on each inference
          request.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With the GPU stack fully configured and verified, you are ready to deploy inference
        engines. The next sections cover three options: vLLM for high-throughput production
        workloads, Ollama for lightweight development and testing, and performance tuning
        techniques that apply to all local inference setups.
      </p>
    </div>
  )
}
