import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function A100Config() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Tesla A100 Configuration on Brev
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NVIDIA A100 is the workhorse GPU for serious LLM inference. Available in 40 GB and
        80 GB VRAM configurations on Brev, the A100 can run models from 7B to 70B parameters
        depending on quantization. This section covers optimal memory allocation, model selection
        for different VRAM sizes, and multi-GPU configuration for the largest models.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        A100 Variants
      </h2>

      <ComparisonTable
        title="A100 Configurations on Brev"
        headers={['Variant', 'VRAM', 'Memory Bandwidth', 'FP16 TFLOPS', 'Best For']}
        rows={[
          ['A100 40GB (PCIe)', '40 GB HBM2e', '1,555 GB/s', '312', 'Medium models up to 30B quantized'],
          ['A100 80GB (SXM)', '80 GB HBM2e', '2,039 GB/s', '312', 'Large models up to 70B quantized'],
          ['2x A100 80GB', '160 GB total', '2x 2,039 GB/s', '624 combined', 'Unquantized 70B models, very large context'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Memory Allocation Strategy
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        VRAM must be shared between the model weights, the KV cache (which grows with context
        length), and inference computation overhead. Proper memory allocation ensures the model
        runs entirely in VRAM without falling back to CPU memory, which would dramatically
        reduce inference speed.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Model weights:</span> The largest consumer. A 7B model
          in Q4 quantization uses about 4 GB. A 13B model uses about 8 GB. A 70B model in Q4 uses
          about 40 GB.
        </li>
        <li>
          <span className="font-semibold">KV cache:</span> Grows with context length and batch
          size. For a single user with 8K context, expect 1-4 GB depending on model architecture.
          For multiple concurrent sessions with 32K context, this can reach 8-16 GB.
        </li>
        <li>
          <span className="font-semibold">Overhead:</span> CUDA runtime, inference engine buffers,
          and OS GPU memory reservation. Budget 2-4 GB for overhead.
        </li>
      </ul>

      <ComparisonTable
        title="Model Size vs. A100 VRAM"
        headers={['Model', 'Quantization', 'Weight Size', 'KV Cache (8K)', 'Total', 'Fits A100 40GB?', 'Fits A100 80GB?']}
        rows={[
          ['Llama 3 8B', 'Q4_K_M', '~5 GB', '~2 GB', '~9 GB', 'Yes', 'Yes'],
          ['Llama 3 8B', 'FP16', '~16 GB', '~2 GB', '~20 GB', 'Yes', 'Yes'],
          ['CodeLlama 13B', 'Q4_K_M', '~8 GB', '~3 GB', '~13 GB', 'Yes', 'Yes'],
          ['Llama 3 70B', 'Q4_K_M', '~40 GB', '~6 GB', '~48 GB', 'No', 'Yes'],
          ['Llama 3 70B', 'FP16', '~140 GB', '~6 GB', '~148 GB', 'No', 'No (need 2x)'],
        ]}
      />

      <CodeBlock
        language="bash"
        title="Configuring Ollama for Optimal A100 Usage"
        code={`# On your Brev A100 instance:
brev shell my-nemoclaw

# Set Ollama to use maximum GPU memory
# By default, Ollama reserves some VRAM headroom
export OLLAMA_GPU_MEMORY_FRACTION=0.9

# For A100 80GB: run a 70B quantized model
ollama pull llama3:70b-instruct-q4_K_M

# Verify model is loaded entirely in VRAM
ollama run llama3:70b-instruct-q4_K_M "Hello"
# Then check nvidia-smi in another terminal:
nvidia-smi
# Memory-Usage should show ~48 GB / 80 GB

# For A100 40GB: 13B unquantized or 30B quantized
ollama pull codellama:34b-instruct-q4_K_M

# Configure NemoClaw to use the local model
cat > ~/nemoclaw/llm-config.json << 'EOF'
{
  "provider": "ollama",
  "baseUrl": "http://localhost:11434",
  "model": "llama3:70b-instruct-q4_K_M",
  "options": {
    "num_ctx": 8192,
    "num_gpu": 99
  }
}
EOF`}
      />

      <NoteBlock type="tip" title="Context Length vs. VRAM">
        <p>
          Increasing the context window (<code>num_ctx</code>) consumes additional VRAM for the
          KV cache. On an A100 80GB with a 70B Q4 model, you can comfortably use 8192 tokens of
          context. Pushing to 16384 tokens may cause VRAM pressure, requiring a smaller model or
          lower quantization. Monitor <code>nvidia-smi</code> during peak usage to ensure the
          model stays fully in VRAM.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Multi-GPU Configuration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For models that exceed a single GPU's VRAM (like unquantized 70B models), Brev supports
        multi-GPU instances. Inference frameworks like vLLM use tensor parallelism to shard the
        model across GPUs, where each GPU holds a portion of the model weights and they communicate
        over NVLink.
      </p>

      <CodeBlock
        language="bash"
        title="Multi-GPU Inference with vLLM"
        code={`# Deploy a multi-GPU instance on Brev
nemoclaw deploy my-multi-gpu --gpu a100-80gb --gpu-count 2

# vLLM automatically uses tensor parallelism
pip install vllm

# Start vLLM with tensor parallelism across 2 GPUs
python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3-70B-Instruct \\
  --tensor-parallel-size 2 \\
  --host 0.0.0.0 \\
  --port 8000 \\
  --max-model-len 8192

# Configure NemoClaw to use vLLM (OpenAI-compatible API)
# In openclaw.json:
# {
#   "llm": {
#     "provider": "openai-compatible",
#     "baseUrl": "http://localhost:8000/v1",
#     "model": "meta-llama/Llama-3-70B-Instruct",
#     "apiKey": "not-needed"
#   }
# }`}
      />

      <WarningBlock title="Multi-GPU Cost">
        <p>
          Multi-GPU instances double (or more) the per-hour cost. Two A100 80GB GPUs on Brev
          costs approximately $7/hour or $5,000+/month if run continuously. Use multi-GPU only
          when your model genuinely requires it. In most cases, a well-quantized model on a
          single A100 80GB provides better cost-efficiency than an unquantized model on multiple
          GPUs with marginally better output quality.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Performance Tuning
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Use Q4_K_M quantization:</span> Offers the best balance
          of quality and memory efficiency. Quality degradation compared to FP16 is minimal for
          coding tasks.
        </li>
        <li>
          <span className="font-semibold">Set appropriate context length:</span> Do not default to
          the model's maximum context. If your NemoClaw sessions rarely exceed 4K tokens, set
          <code>num_ctx: 4096</code> to save VRAM for the KV cache.
        </li>
        <li>
          <span className="font-semibold">Monitor GPU utilization:</span> Use
          <code> watch -n 1 nvidia-smi</code> during active sessions. GPU utilization should stay
          above 50% during inference. Low utilization may indicate a CPU bottleneck in the
          Gateway or network latency in the inference pipeline.
        </li>
        <li>
          <span className="font-semibold">Consider vLLM for high throughput:</span> If NemoClaw
          serves many concurrent sessions, vLLM's continuous batching delivers significantly
          higher throughput than Ollama. The tradeoff is more complex setup.
        </li>
      </ul>

      <ExerciseBlock
        question="You have an A100 40GB on Brev and want to run a coding-focused LLM for NemoClaw. Which model configuration fits within the VRAM budget while maximizing capability?"
        options={[
          'Llama 3 70B FP16 (~140 GB) -- highest quality',
          'Llama 3 70B Q4_K_M (~40 GB weights + KV cache) -- too tight',
          'CodeLlama 34B Q4_K_M (~20 GB) -- fits well with room for KV cache',
          'Llama 3 8B FP16 (~16 GB) -- too small to be useful',
        ]}
        correctIndex={2}
        explanation="CodeLlama 34B in Q4_K_M quantization uses approximately 20 GB of VRAM for weights, leaving ~16 GB for KV cache, overhead, and computation on the 40 GB A100. The 70B model at Q4 uses ~40 GB for weights alone, leaving almost no room for the KV cache. The 34B model provides strong coding capabilities while fitting comfortably."
      />

      <ReferenceList
        references={[
          {
            title: 'NVIDIA A100 Specifications',
            url: 'https://www.nvidia.com/en-us/data-center/a100/',
            type: 'docs',
            description: 'Official A100 product page with detailed specifications.',
          },
          {
            title: 'vLLM Documentation',
            url: 'https://docs.vllm.ai/',
            type: 'docs',
            description: 'High-throughput LLM inference engine with tensor parallelism support.',
          },
        ]}
      />
    </div>
  )
}
