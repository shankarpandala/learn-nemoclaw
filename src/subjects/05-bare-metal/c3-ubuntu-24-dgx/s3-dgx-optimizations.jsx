import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock, DefinitionBlock } from '../../../components/content'

export default function DgxOptimizations() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        DGX Hardware Optimizations
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Running NemoClaw on NVIDIA DGX hardware offers performance advantages that are not available
        on commodity systems. The DGX platform provides tight integration between CPU and GPU,
        high-bandwidth memory, and optimized drivers that NemoClaw can leverage for agent workloads
        involving AI inference, data processing, and model fine-tuning. This section covers how to
        configure NemoClaw sandboxes to take full advantage of DGX hardware capabilities.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GPU Memory Allocation Strategies
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        DGX Spark uses the Grace Blackwell architecture with unified memory, meaning the CPU and
        GPU share the same physical memory pool. This is fundamentally different from discrete GPU
        systems where GPU VRAM is separate from system RAM. NemoClaw must be configured to account
        for this unified memory model.
      </p>

      <DefinitionBlock
        term="Unified Memory Architecture"
        definition="A hardware design where the CPU and GPU share the same physical memory, eliminating the need to copy data between separate memory pools. On DGX Spark, the Grace CPU and Blackwell GPU access the same 128 GB of LPDDR5X memory. This simplifies programming but requires careful memory budgeting since both CPU and GPU workloads compete for the same resource."
        example="An agent running a 20 GB language model inside a NemoClaw sandbox uses unified memory directly -- no PCIe transfer overhead. But the same 128 GB pool must also serve the host OS, Docker, and any other sandboxes."
        seeAlso={['Grace Blackwell', 'VRAM', 'Memory Oversubscription']}
      />

      <CodeBlock
        title="Configure GPU memory limits for sandboxes"
        language="bash"
        code={`# View total available GPU memory
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
# dev-sandbox    GPU 0   16 GB           0.4 GB`}
      />

      <WarningBlock title="Memory Oversubscription on Unified Memory">
        <p>
          On DGX Spark's unified memory architecture, allocating too much GPU memory to sandboxes
          can starve the host OS and Docker of memory, causing system instability. A safe rule of
          thumb is to reserve at least 16 GB for the host system and Docker overhead, allocating
          the remainder across sandboxes. For example, on a 128 GB system, allocate no more than
          112 GB total across all sandboxes.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        NVIDIA Driver Configuration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        DGX OS ships with optimized NVIDIA drivers pre-installed. For NemoClaw sandboxes to access
        the GPU, the driver version on the host must be compatible with the CUDA version inside the
        sandbox blueprint. The DGX-optimized blueprint is tested against the driver versions shipped
        with DGX OS.
      </p>

      <CodeBlock
        title="Verify driver and CUDA compatibility"
        language="bash"
        code={`# Check host driver version
nvidia-smi | head -3
# Driver Version: 550.xx.xx   CUDA Version: 12.4

# Check CUDA version inside a sandbox
nemoclaw ml-sandbox exec -- nvcc --version
# Should show CUDA 12.4.x (matching the driver capability)

# Check driver compatibility matrix
nvidia-smi --query-gpu=driver_version,compute_cap --format=csv
# Compute capability 9.0 = Blackwell architecture`}
      />

      <ComparisonTable
        title="NVIDIA Driver Compatibility"
        headers={['DGX OS Version', 'Driver Version', 'CUDA Version', 'Blueprint']}
        rows={[
          ['DGX OS 6.0', '550.54+', 'CUDA 12.4', 'nemoclaw-dgx:latest'],
          ['DGX OS 6.1', '555.42+', 'CUDA 12.5', 'nemoclaw-dgx:latest'],
          ['DGX OS 6.2', '560.28+', 'CUDA 12.6', 'nemoclaw-dgx:latest'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Compute Mode and MPS
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When running multiple sandboxes that share the same GPU, NVIDIA Multi-Process Service (MPS)
        can improve GPU utilization by allowing concurrent kernel execution from multiple processes.
        Without MPS, GPU access is time-sliced, meaning only one sandbox's GPU operations run at
        a time.
      </p>

      <CodeBlock
        title="Enable MPS for multi-sandbox GPU sharing"
        language="bash"
        code={`# Check current compute mode
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
# True`}
      />

      <NoteBlock type="tip" title="When to Use MPS">
        <p>
          MPS is most beneficial when running multiple sandboxes that make small, frequent GPU
          operations (such as inference with small batch sizes). For a single sandbox running
          large training jobs, MPS provides no benefit and can add slight overhead. Enable MPS
          only when you are running two or more GPU-enabled sandboxes concurrently.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Performance Tuning
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Several additional optimizations can improve NemoClaw sandbox performance on DGX hardware:
      </p>

      <CodeBlock
        title="DGX performance tuning"
        language="bash"
        code={`# Enable GPU persistence mode (prevents driver unload between operations)
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
  --shm-size 8g`}
      />

      <NoteBlock type="info" title="Shared Memory (shm-size)">
        <p>
          The <code>--shm-size</code> flag sets the size of <code>/dev/shm</code> inside the
          sandbox. PyTorch and other ML frameworks use shared memory for data loader workers.
          The default is 64 MB, which is often insufficient for ML workloads. Setting it to 8 GB
          or more is recommended for any sandbox that will run PyTorch training or inference.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With these optimizations in place, your DGX system is configured for optimal NemoClaw
        performance. The next section covers the specifics of GPU passthrough -- how NemoClaw
        exposes GPU devices to sandboxes and how to verify that GPU access is working correctly.
      </p>
    </div>
  )
}
