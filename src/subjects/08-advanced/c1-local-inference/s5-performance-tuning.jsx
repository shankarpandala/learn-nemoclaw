import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock } from '../../../components/content'

export default function PerformanceTuning() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Performance Tuning for Local Inference
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Running a local inference engine is only the first step. Getting optimal performance from
        your hardware requires understanding how GPU memory is allocated, how batching affects
        throughput, how quantization trades quality for speed, and how the KV cache determines
        your concurrency limits. This section covers the key tuning parameters and techniques
        that apply across all local inference engines -- NIM, vLLM, and Ollama -- and provides
        a framework for benchmarking local inference against cloud endpoints.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GPU Memory Management
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GPU memory (VRAM) is the primary bottleneck in local inference. Understanding how it is
        consumed helps you make informed decisions about model selection, quantization, and
        concurrency settings. GPU memory during inference is consumed by three main components:
        model weights, the KV cache, and temporary activation buffers.
      </p>

      <DefinitionBlock
        term="KV Cache"
        definition="The key-value cache stores the computed attention keys and values for all previously processed tokens in a sequence. During autoregressive generation, the KV cache allows the model to avoid recomputing attention over the entire sequence for each new token. The KV cache grows linearly with sequence length and is the primary consumer of GPU memory beyond the model weights themselves."
        example="A Llama 3.1 8B model at float16 uses approximately 16 GB for weights. With a 4096-token sequence, the KV cache adds roughly 1 GB per concurrent request. With 10 concurrent requests, the KV cache alone consumes 10 GB."
        seeAlso={['PagedAttention', 'Sequence Length', 'Batch Size']}
      />

      <CodeBlock
        language="text"
        title="GPU memory breakdown (approximate)"
      >{`Model Weights (Llama 3.1 8B at float16):     ~16 GB
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
  Max concurrent:   ~18 requests at 4096 tokens`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Quantization
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Quantization reduces the precision of model weights from their native format (typically
        float16 or bfloat16, using 2 bytes per parameter) to lower-precision representations
        (4-bit or 8-bit, using 0.5 or 1 byte per parameter). This directly reduces the memory
        footprint of the model weights, freeing GPU memory for the KV cache and enabling either
        larger models or more concurrent requests on the same hardware.
      </p>

      <ComparisonTable
        title="Quantization Methods and Tradeoffs"
        headers={['Method', 'Bits', 'Memory Savings', 'Quality Impact', 'Supported By']}
        rows={[
          ['None (float16)', '16', 'Baseline', 'Full quality', 'All engines'],
          ['GPTQ', '4', '~75%', 'Minimal for 7-13B, noticeable for 70B+', 'vLLM, NIM'],
          ['AWQ', '4', '~75%', 'Slightly better than GPTQ on most benchmarks', 'vLLM, NIM'],
          ['GGUF Q4_K_M', '4', '~75%', 'Good quality, optimized for CPU+GPU hybrid', 'Ollama, llama.cpp'],
          ['GGUF Q8_0', '8', '~50%', 'Near-lossless', 'Ollama, llama.cpp'],
          ['SqueezeLLM', '4', '~75%', 'Good for sparse models', 'vLLM'],
          ['FP8', '8', '~50%', 'Near-lossless, hardware-accelerated on H100', 'NIM, vLLM'],
        ]}
      />

      <NoteBlock type="info" title="Choosing a Quantization Level">
        <p>
          For NemoClaw agent workloads, Q4 quantization (GPTQ, AWQ, or Q4_K_M) is generally
          the sweet spot. Agent tasks like code analysis, tool selection, and structured output
          generation are less sensitive to minor quality degradation than creative writing or
          nuanced reasoning. The 75% memory savings from Q4 quantization often matters more than
          the marginal quality difference, because it enables either running a larger model or
          handling more concurrent agent sessions.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Batch Sizing and Concurrency
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Batch size determines how many requests are processed simultaneously on the GPU.
        Increasing batch size improves throughput (total tokens per second across all requests)
        but increases per-request latency. For NemoClaw agents, the right balance depends on
        your deployment pattern.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Single Agent, Interactive:</span> Use a small batch
          size (1-4). Latency matters more than throughput because the human operator is
          watching the agent work in real time through the TUI.
        </li>
        <li>
          <span className="font-semibold">Multiple Agents, Background:</span> Use a larger
          batch size (8-32). Throughput matters more because agents are running autonomously
          and total task completion time depends on aggregate throughput.
        </li>
        <li>
          <span className="font-semibold">CI/CD Testing:</span> Maximize batch size to complete
          test suites quickly. Latency per request is irrelevant; total test time matters.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Configuring batch size in vLLM"
      >{`# vLLM continuous batching -- set max concurrent sequences
python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --max-num-seqs 16 \\          # max concurrent requests in a batch
  --max-num-batched-tokens 8192  # max total tokens across all batched requests`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        KV Cache Optimization
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The KV cache is the largest variable memory consumer during inference. Optimizing it
        has a direct impact on how many concurrent requests you can serve and how long sequences
        can be.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Reduce max sequence length:</span> If your agent
          tasks consistently use fewer than 4096 tokens, set the maximum sequence length to
          4096 instead of the model's native 128K. This caps the maximum KV cache size per
          request and prevents a single long request from consuming all available memory.
        </li>
        <li>
          <span className="font-semibold">Use PagedAttention (vLLM):</span> vLLM's PagedAttention
          allocates KV cache in small pages rather than contiguous blocks, reducing
          fragmentation and enabling higher effective utilization of GPU memory.
        </li>
        <li>
          <span className="font-semibold">KV cache quantization:</span> Some engines support
          quantizing the KV cache to FP8 or INT8, halving its memory footprint with minimal
          quality impact. In vLLM, use --kv-cache-dtype fp8 on supported hardware.
        </li>
        <li>
          <span className="font-semibold">Prefix caching:</span> When multiple agent requests
          share a common system prompt, prefix caching avoids recomputing and re-storing the
          KV cache for the shared prefix. vLLM supports this with --enable-prefix-caching.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Benchmarking Local vs. Cloud
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        To make an informed decision about local vs. cloud inference, you need to benchmark both
        options with realistic NemoClaw agent workloads. The key metrics to measure are
        time-to-first-token (TTFT), tokens per second (TPS), end-to-end task completion time,
        and cost per task.
      </p>

      <CodeBlock
        language="bash"
        title="Simple benchmarking script"
      >{`#!/bin/bash
# Benchmark local inference endpoint
# Measures TTFT and throughput for a typical agent prompt

ENDPOINT="http://localhost:8000/v1/chat/completions"
MODEL="meta-llama/Llama-3.1-8B-Instruct"

# Warm up
curl -s -o /dev/null "$ENDPOINT" -H "Content-Type: application/json" \\
  -d "{\"model\": \"$MODEL\", \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}], \"max_tokens\": 16}"

# Time a realistic agent prompt
echo "=== Single Request Latency ==="
time curl -s -o /dev/null -w "TTFT: %{time_starttransfer}s, Total: %{time_total}s\\n" \\
  "$ENDPOINT" -H "Content-Type: application/json" \\
  -d "{
    \"model\": \"$MODEL\",
    \"messages\": [{\"role\": \"system\", \"content\": \"You are an agent...\"}, {\"role\": \"user\", \"content\": \"Analyze the following Python code for security issues and suggest fixes: $(cat sample_code.py)\"}],
    \"max_tokens\": 1024
  }"

# Concurrent request test (requires GNU parallel)
echo "=== Concurrent Throughput (10 requests) ==="
time seq 10 | parallel -j 10 curl -s -o /dev/null "$ENDPOINT" \\
  -H "Content-Type: application/json" \\
  -d "'{}'" ::: $(for i in $(seq 10); do echo "{\"model\": \"$MODEL\", \"messages\": [{\"role\": \"user\", \"content\": \"Task $i\"}], \"max_tokens\": 256}"; done)`}</CodeBlock>

      <ComparisonTable
        title="Typical Benchmark Results (Llama 3.1 8B)"
        headers={['Metric', 'Cloud API', 'NIM (A6000)', 'vLLM (RTX 4090)', 'Ollama (RTX 4090)']}
        rows={[
          ['TTFT', '200-500 ms', '50-100 ms', '60-120 ms', '80-150 ms'],
          ['Tokens/sec (single)', '80-120', '40-60', '35-55', '30-45'],
          ['Tokens/sec (10 concurrent)', '800-1200', '300-500', '250-400', '30-45 (no batching)'],
          ['Cost per 1M tokens', '$0.10-0.50', '$0 (hardware amortized)', '$0 (hardware amortized)', '$0 (hardware amortized)'],
        ]}
      />

      <WarningBlock title="Benchmark Fairly">
        <p>
          When comparing local to cloud inference, ensure you are comparing equivalent model
          quality. A cloud-hosted GPT-4 class model versus a local Llama 3.1 8B is not an
          apples-to-apples comparison. Compare the same model (or same parameter class) in
          both environments. Also factor in hardware costs: a single A6000 GPU costs roughly
          $4,000-5,000, which represents a significant upfront investment compared to pay-per-token
          cloud pricing. The breakeven point depends on your inference volume.
        </p>
      </WarningBlock>

      <ExerciseBlock
        title="Benchmark Your Local Setup"
        difficulty="advanced"
      >
        <ol className="list-decimal list-inside space-y-2 mt-2">
          <li>Set up a local inference engine (Ollama for simplicity, vLLM for production benchmarks).</li>
          <li>Create a benchmark script that sends 10 sequential requests typical of your agent workload.</li>
          <li>Measure TTFT and total latency for each request.</li>
          <li>Run the same 10 requests against a cloud endpoint and record the same metrics.</li>
          <li>Calculate the total cost for 10,000 such requests on the cloud endpoint.</li>
          <li>Estimate how long it would take to recoup your GPU hardware cost at that usage rate.</li>
        </ol>
      </ExerciseBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Performance tuning is an iterative process. Start with default configurations, measure
        your baseline, adjust one parameter at a time, and re-measure. The parameters that
        matter most depend on your specific workload -- agent concurrency, typical prompt length,
        required response length, and acceptable latency. With the techniques in this section,
        you have the tools to find the optimal configuration for your NemoClaw deployment.
      </p>
    </div>
  )
}
