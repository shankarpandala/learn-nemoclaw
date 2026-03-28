import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, ComparisonTable } from '../../../components/content'

export default function VllmIntegration() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        vLLM: High-Throughput Inference Engine
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        vLLM is an open-source, high-throughput inference engine for large language models that
        has rapidly become one of the most popular choices for self-hosted model serving. Its
        headline innovation is PagedAttention, a memory management technique inspired by
        operating system virtual memory that dramatically improves GPU memory utilization
        during inference. For NemoClaw deployments that need to serve multiple concurrent agent
        sessions against a local model, vLLM offers throughput that often exceeds what you get
        from other serving solutions by 2-4x.
      </p>

      <DefinitionBlock
        term="vLLM"
        definition="An open-source library for fast LLM inference and serving, developed at UC Berkeley. vLLM uses PagedAttention to manage the key-value (KV) cache efficiently, enabling near-optimal GPU memory utilization and high throughput for concurrent requests. It exposes an OpenAI-compatible API server out of the box."
        example="Running vLLM to serve Llama 3.1 8B on a single GPU, handling 20+ concurrent NemoClaw agent requests with continuous batching, achieving 3x the throughput of a naive HuggingFace inference setup."
        seeAlso={['PagedAttention', 'KV Cache', 'Continuous Batching']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why vLLM for NemoClaw
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw agents make frequent, sequential LLM calls during their operation. A single
        agent task might involve dozens of inference requests as the agent plans, executes,
        evaluates results, and iterates. In multi-agent deployments, multiple sandboxed agents
        may share a single inference endpoint. This pattern demands an inference engine that
        handles concurrent requests efficiently, minimizes latency for sequential calls, and
        makes maximum use of available GPU memory.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        vLLM excels at exactly this pattern. Its continuous batching mechanism groups incoming
        requests together dynamically, even if they arrive at different times and have different
        sequence lengths. PagedAttention eliminates the memory waste that occurs in naive
        implementations where each request reserves a contiguous block of GPU memory for its
        KV cache -- instead, memory is allocated in small pages and shared where possible.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Setting Up vLLM
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        vLLM can be installed either as a Python package or run as a Docker container. For
        NemoClaw integration, the Docker approach is recommended because it isolates the
        inference engine from the rest of your system and ensures consistent dependency
        management.
      </p>

      <CodeBlock
        language="bash"
        title="Running vLLM via Docker"
      >{`# Pull the official vLLM Docker image
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
# Model weights are cached at ~/.cache/huggingface on the host.`}</CodeBlock>

      <CodeBlock
        language="bash"
        title="Alternative: pip install for non-containerized setup"
      >{`# Create a virtual environment
python3 -m venv vllm-env
source vllm-env/bin/activate

# Install vLLM (requires CUDA 12.1+)
pip install vllm

# Start the OpenAI-compatible API server
python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --host 0.0.0.0 \\
  --port 8000 \\
  --max-model-len 8192`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Configuring NemoClaw to Use vLLM
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Because vLLM exposes an OpenAI-compatible API, configuring NemoClaw is straightforward.
        The configuration is identical to using any OpenAI-compatible endpoint -- only the
        base URL and model name change.
      </p>

      <CodeBlock
        language="yaml"
        title="NemoClaw blueprint configuration for vLLM"
      >{`# blueprint.yaml
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
  # guided_json: <schema>  # optional`}</CodeBlock>

      <CodeBlock
        language="bash"
        title="Verify vLLM is serving correctly"
      >{`# List available models
curl http://localhost:8000/v1/models | jq .

# Test a completion
curl http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "meta-llama/Llama-3.1-8B-Instruct",
    "messages": [{"role": "user", "content": "Respond with OK if you are working."}],
    "max_tokens": 16
  }'`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Key vLLM Configuration Options
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        vLLM offers numerous configuration parameters that affect performance, memory usage,
        and behavior. The most important ones for NemoClaw deployments are:
      </p>

      <ComparisonTable
        title="Essential vLLM Configuration Parameters"
        headers={['Parameter', 'Default', 'Description']}
        rows={[
          ['--gpu-memory-utilization', '0.90', 'Fraction of GPU memory to use for model and KV cache. Higher values serve more concurrent requests but risk OOM.'],
          ['--max-model-len', 'Model default', 'Maximum sequence length (input + output). Reducing this frees memory for more concurrent requests.'],
          ['--tensor-parallel-size', '1', 'Number of GPUs for tensor parallelism. Set to your GPU count for multi-GPU setups.'],
          ['--max-num-seqs', '256', 'Maximum number of sequences to process in parallel. Controls concurrency.'],
          ['--dtype', 'auto', 'Model precision. Use float16 or bfloat16 to halve memory vs float32. auto selects based on model config.'],
          ['--quantization', 'None', 'Quantization method: awq, gptq, squeezellm. Reduces memory at slight quality cost.'],
          ['--enforce-eager', 'false', 'Disable CUDA graph optimization. Use for debugging or when CUDA graphs cause issues.'],
        ]}
      />

      <WarningBlock title="Experimental Status in NemoClaw">
        <p>
          vLLM integration with NemoClaw is currently marked as experimental. While the
          OpenAI-compatible API ensures basic functionality works, some advanced NemoClaw features
          -- such as structured output parsing and certain tool-calling formats -- may not work
          identically with all vLLM-hosted models. The NemoClaw team tests primarily against
          NVIDIA NIM and the NVIDIA API Catalog. If you encounter issues with vLLM, check the
          NemoClaw GitHub issues for known compatibility notes and report any new ones.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Multi-GPU and Tensor Parallelism
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For models that do not fit on a single GPU, vLLM supports tensor parallelism -- splitting
        the model across multiple GPUs. This is configured with a single flag and vLLM handles
        the rest, including inter-GPU communication via NCCL.
      </p>

      <CodeBlock
        language="bash"
        title="Running a 70B model across 4 GPUs"
      >{`docker run -d \\
  --name vllm-70b \\
  --gpus all \\
  -v ~/.cache/huggingface:/root/.cache/huggingface \\
  -p 8000:8000 \\
  --ipc=host \\
  vllm/vllm-openai:latest \\
  --model meta-llama/Llama-3.1-70B-Instruct \\
  --tensor-parallel-size 4 \\
  --max-model-len 4096 \\
  --gpu-memory-utilization 0.92`}</CodeBlock>

      <NoteBlock type="info" title="Monitoring vLLM Performance">
        <p>
          vLLM exposes Prometheus-compatible metrics at /metrics. You can scrape these with
          Prometheus or Grafana to monitor request throughput, latency percentiles, GPU
          utilization, KV cache usage, and queue depth. For NemoClaw deployments, the most
          important metrics to watch are the KV cache utilization (high values mean you are
          nearing the concurrent request limit) and the time-to-first-token latency (which
          directly affects agent responsiveness).
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        vLLM provides the best throughput for multi-agent NemoClaw deployments where many
        sandboxed agents share a single inference endpoint. For simpler setups -- development
        machines, single-agent testing, or rapid prototyping -- Ollama offers a more lightweight
        alternative, which we cover next.
      </p>
    </div>
  )
}
