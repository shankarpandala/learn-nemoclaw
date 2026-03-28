import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ReferenceList } from '../../../components/content';

export default function LocalInference() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Local Inference: Ollama and vLLM
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Not every workload requires -- or can use -- a cloud inference provider. Air-gapped
        environments, data sovereignty requirements, cost optimization, and privacy
        concerns all drive demand for local inference. NemoClaw supports two local
        inference backends: <strong>Ollama</strong> for lightweight development and
        experimentation, and <strong>vLLM</strong> for production-grade local inference
        with full GPU optimization.
      </p>

      <ComparisonTable
        title="Ollama vs. vLLM"
        headers={['Aspect', 'Ollama', 'vLLM']}
        rows={[
          ['Use case', 'Development, lightweight tasks', 'Production, high throughput'],
          ['Setup complexity', 'Very simple (one binary)', 'Moderate (Python, CUDA)'],
          ['Model management', 'Built-in (ollama pull)', 'Manual or HuggingFace Hub'],
          ['GPU support', 'Optional (CPU fallback)', 'Required (CUDA)'],
          ['Quantization', 'GGUF (4-bit, 8-bit)', 'AWQ, GPTQ, FP16, BF16'],
          ['Throughput', 'Single user', 'High concurrency, batching'],
          ['API format', 'OpenAI-compatible', 'OpenAI-compatible'],
          ['Min GPU VRAM', '4GB (small models)', '16GB+ (recommended)'],
        ]}
        highlightDiffs
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Setting Up Ollama
      </h2>

      <DefinitionBlock
        term="Ollama"
        definition="A lightweight tool for running large language models locally. It provides a simple CLI for downloading, running, and managing models, with an OpenAI-compatible API endpoint. Ollama handles model quantization and can run on CPU (slowly) or GPU (fast). It is ideal for development and experimentation."
        example="ollama run codellama:13b -- starts a 13-billion parameter coding model locally."
        seeAlso={['GGUF', 'Quantization', 'llama.cpp']}
      />

      <StepBlock
        title="Configuring NemoClaw with Ollama"
        steps={[
          {
            title: 'Install Ollama',
            content: 'Download and install Ollama on the host machine (not inside the sandbox).',
            code: `# Install Ollama
$ curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
$ ollama --version
ollama version 0.6.2`,
            language: 'bash',
          },
          {
            title: 'Pull a model',
            content: 'Download a coding model. Choose based on your available VRAM and desired quality.',
            code: `# Recommended coding models (choose based on VRAM):

# 8GB VRAM: good for basic coding tasks
$ ollama pull codellama:7b

# 16GB VRAM: better quality
$ ollama pull codellama:34b

# 24GB+ VRAM: best local quality
$ ollama pull deepseek-coder-v2:latest

# CPU-only (slow but works): small model
$ ollama pull codellama:7b-code-q4_0`,
            language: 'bash',
          },
          {
            title: 'Start the Ollama server',
            content: 'Ollama runs as a background service. It starts automatically on most systems after installation.',
            code: `# Check if Ollama is running
$ ollama list
NAME                    SIZE
codellama:34b           19 GB
deepseek-coder-v2       8.9 GB

# If not running, start it
$ ollama serve &

# Verify the API is accessible
$ curl http://localhost:11434/v1/models
{"data":[{"id":"codellama:34b",...}]}`,
            language: 'bash',
          },
          {
            title: 'Configure NemoClaw inference policy',
            content: 'Point NemoClaw to the local Ollama endpoint.',
            code: `# .nemoclaw/policies/inference.yaml
inference:
  provider: ollama
  model: codellama:34b

  # Ollama runs on the host, no API key needed
  endpoint: "http://localhost:11434"
  credential: none   # Local inference, no auth required

  parameters:
    temperature: 0.7
    max_tokens: 4096
    # num_ctx: 8192   # Ollama-specific: context window size`,
            language: 'yaml',
          },
          {
            title: 'Apply and test',
            content: 'Apply the configuration. NemoClaw will route inference through the gateway to the local Ollama server.',
            code: `$ nemoclaw apply
Planning... provider changed: nvidia -> ollama (local)
Applying... inference gateway reconfigured
Note: Local inference -- no cloud credentials needed.
Done.

$ nemoclaw test-inference
Testing inference provider: ollama/codellama:34b
  Endpoint:     localhost:11434 (local)
  Auth:         none
  Test prompt:  "Say hello"
  Response:     "Hello! I'm here to help with coding."
  Latency:      89ms (time to first token)
  Status:       OK`,
            language: 'bash',
          },
        ]}
      />

      <NoteBlock type="info" title="How Local Inference Routing Works">
        Even with local inference, the sandbox agent still talks to{' '}
        <code>inference.local</code>. The OpenShell gateway forwards the request to
        the blueprint, which routes it to <code>localhost:11434</code> (Ollama) on
        the host. The agent never communicates directly with Ollama -- the gateway
        architecture is maintained for consistency and so that switching between
        local and cloud inference requires only a config change.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Setting Up vLLM
      </h2>

      <DefinitionBlock
        term="vLLM"
        definition="A high-throughput, memory-efficient inference engine for large language models. It uses PagedAttention for efficient GPU memory management and supports continuous batching for high concurrency. vLLM provides an OpenAI-compatible API and is the recommended choice for production local inference."
        example="vllm serve codellama/CodeLlama-34b-Instruct-hf --tensor-parallel-size 2"
        seeAlso={['PagedAttention', 'Tensor Parallelism', 'HuggingFace']}
      />

      <StepBlock
        title="Configuring NemoClaw with vLLM"
        steps={[
          {
            title: 'Install vLLM',
            content: 'Install vLLM in a Python environment on the host. Requires CUDA and a compatible GPU.',
            code: `# Create a virtual environment (recommended)
$ python3 -m venv ~/.vllm-env
$ source ~/.vllm-env/bin/activate

# Install vLLM
$ pip install vllm

# Verify GPU access
$ python3 -c "import torch; print(torch.cuda.is_available())"
True`,
            language: 'bash',
          },
          {
            title: 'Start the vLLM server',
            content: 'Launch vLLM with your chosen model. It will download the model from HuggingFace on first run.',
            code: `# Single GPU (24GB+ VRAM)
$ vllm serve codellama/CodeLlama-34b-Instruct-hf \\
    --host 0.0.0.0 \\
    --port 8000 \\
    --max-model-len 8192

# Multi-GPU (tensor parallelism)
$ vllm serve codellama/CodeLlama-70b-Instruct-hf \\
    --host 0.0.0.0 \\
    --port 8000 \\
    --tensor-parallel-size 2 \\
    --max-model-len 8192

# With quantization (less VRAM needed)
$ vllm serve TheBloke/CodeLlama-34B-Instruct-AWQ \\
    --host 0.0.0.0 \\
    --port 8000 \\
    --quantization awq`,
            language: 'bash',
          },
          {
            title: 'Configure NemoClaw inference policy',
            content: 'Point NemoClaw to the vLLM endpoint.',
            code: `# .nemoclaw/policies/inference.yaml
inference:
  provider: vllm
  model: codellama/CodeLlama-34b-Instruct-hf

  endpoint: "http://localhost:8000"
  credential: none

  parameters:
    temperature: 0.7
    max_tokens: 4096`,
            language: 'yaml',
          },
          {
            title: 'Apply and test',
            content: 'Apply the configuration and verify connectivity.',
            code: `$ nemoclaw apply
Planning... provider: vllm (local)
Applying... inference gateway reconfigured
Done.

$ nemoclaw test-inference
Testing inference provider: vllm/codellama-34b-instruct
  Endpoint:     localhost:8000 (local)
  Auth:         none
  Test prompt:  "Say hello"
  Response:     "Hello! How can I assist you with coding?"
  Latency:      45ms (time to first token)
  Throughput:   ~120 tokens/sec
  Status:       OK`,
            language: 'bash',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        GPU Requirements
      </h2>

      <ComparisonTable
        title="GPU VRAM Requirements by Model Size"
        headers={['Model Size', 'FP16 VRAM', 'Quantized (4-bit) VRAM', 'Recommended GPU']}
        rows={[
          ['7B parameters', '14 GB', '4 GB', 'RTX 3060 12GB (quantized)'],
          ['13B parameters', '26 GB', '8 GB', 'RTX 4070 Ti 16GB (quantized)'],
          ['34B parameters', '68 GB', '20 GB', 'RTX 4090 24GB (quantized)'],
          ['70B parameters', '140 GB', '40 GB', '2x RTX 4090 or A100 80GB'],
        ]}
      />

      <WarningBlock title="GPU Memory Is the Bottleneck">
        Local inference performance is almost entirely determined by GPU VRAM. If the
        model does not fit in VRAM, it will be partially offloaded to system RAM (with
        Ollama) or fail to load (with vLLM). Quantized models (4-bit) use roughly 4x
        less VRAM than full-precision models, with modest quality loss. For coding
        tasks, 4-bit quantization is generally acceptable.
      </WarningBlock>

      <NoteBlock type="tip" title="When to Use Local vs. Cloud">
        <p>Use <strong>local inference</strong> when you need:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Air-gapped or offline environments</li>
          <li>Data that must not leave your premises</li>
          <li>Zero inference cost (after hardware investment)</li>
          <li>Lowest possible latency (no network round-trip)</li>
        </ul>
        <p className="mt-2">Use <strong>cloud inference</strong> when you need:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>State-of-the-art model quality (GPT-4o, Claude, Nemotron 120B)</li>
          <li>No GPU hardware investment</li>
          <li>Scalability beyond a single machine</li>
        </ul>
      </NoteBlock>

      <ReferenceList
        references={[
          {
            title: 'Ollama',
            url: 'https://ollama.com/',
            type: 'docs',
            description: 'Official Ollama documentation and model library.',
          },
          {
            title: 'vLLM Documentation',
            url: 'https://docs.vllm.ai/',
            type: 'docs',
            description: 'Official vLLM documentation for high-performance local inference.',
          },
          {
            title: 'NemoClaw Local Inference Guide',
            url: 'https://docs.nvidia.com/nemoclaw/providers/local',
            type: 'docs',
            description: 'Configuring Ollama and vLLM with NemoClaw.',
          },
        ]}
      />
    </div>
  );
}
