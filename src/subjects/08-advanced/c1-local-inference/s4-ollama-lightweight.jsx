import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock } from '../../../components/content'

export default function OllamaLightweight() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Ollama: Lightweight Local Model Running
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Not every local inference scenario demands the throughput of vLLM or the enterprise
        optimization of NVIDIA NIM. During development, testing, and prototyping, what you often
        need is the simplest possible way to get a model running locally so you can iterate
        quickly on your NemoClaw agent configurations without incurring cloud API costs or
        waiting for heavyweight inference servers to spin up. Ollama fills this niche perfectly.
      </p>

      <DefinitionBlock
        term="Ollama"
        definition="An open-source tool that simplifies running large language models locally. Ollama packages model weights, quantization configurations, and a lightweight inference server into a single binary with a Docker-like pull-and-run workflow. It supports NVIDIA GPUs, Apple Silicon, and CPU-only inference, making it accessible on virtually any development machine."
        example="Running 'ollama run llama3.1:8b' on a laptop to start an interactive session with Llama 3.1 8B, or using 'ollama serve' to expose an OpenAI-compatible API that NemoClaw can connect to."
        seeAlso={['Local Inference', 'Model Quantization', 'Development Environment']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why Ollama for Development and Testing
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Ollama's value proposition is simplicity. Where NIM requires NGC authentication and
        container orchestration, and vLLM requires Python environment management and careful
        CUDA configuration, Ollama requires a single binary installation and a one-line command
        to start serving. It manages model downloads, quantization, and GPU detection
        automatically. For the development workflow of building and testing NemoClaw blueprints
        and policies, this fast iteration cycle is invaluable.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Ollama also excels at running on hardware that would be insufficient for unquantized
        model serving. It defaults to quantized model variants (typically Q4_0 or Q4_K_M) that
        reduce memory requirements by 50-75% compared to full-precision weights. A model that
        requires 16 GB of VRAM at float16 might need only 4-5 GB in Q4 quantization. This means
        you can run meaningful models on consumer hardware -- an RTX 3060 with 12 GB, an M1
        MacBook with 16 GB unified memory, or even a machine with no GPU at all (though CPU
        inference is slow).
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Installing and Running Ollama
      </h2>

      <CodeBlock
        language="bash"
        title="Installing Ollama"
      >{`# One-line install on Linux
curl -fsSL https://ollama.com/install.sh | sh

# On macOS, download from https://ollama.com/download
# or use Homebrew:
brew install ollama

# Verify installation
ollama --version`}</CodeBlock>

      <CodeBlock
        language="bash"
        title="Pulling and running models"
      >{`# Pull a model (downloads and caches it locally)
ollama pull llama3.1:8b

# Run an interactive chat session
ollama run llama3.1:8b

# Start the API server (runs in the background by default)
ollama serve
# The server listens on http://localhost:11434

# List downloaded models
ollama list

# Show model details (parameters, quantization, size)
ollama show llama3.1:8b`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Supported Models
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Ollama maintains a library of pre-packaged models that can be pulled by name. The library
        includes most popular open-weight models in various size and quantization variants.
      </p>

      <ComparisonTable
        title="Popular Ollama Models for NemoClaw Development"
        headers={['Model', 'Size (Q4)', 'RAM/VRAM Needed', 'Best For']}
        rows={[
          ['llama3.1:8b', '~4.7 GB', '8 GB', 'General agent development, good quality-to-size ratio'],
          ['llama3.1:70b', '~40 GB', '48 GB+', 'High-quality agent responses, requires serious hardware'],
          ['mistral:7b', '~4.1 GB', '8 GB', 'Fast inference, strong coding capabilities'],
          ['codellama:13b', '~7.4 GB', '12 GB', 'Code-focused tasks, good for coding agents'],
          ['phi3:mini', '~2.2 GB', '4 GB', 'Minimal hardware, rapid prototyping'],
          ['qwen2.5:7b', '~4.4 GB', '8 GB', 'Strong multilingual and reasoning capabilities'],
          ['deepseek-coder-v2:16b', '~9 GB', '16 GB', 'Code generation and analysis tasks'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Configuring NemoClaw to Use Ollama
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Ollama exposes an OpenAI-compatible API at /v1 on port 11434. NemoClaw can connect to
        it just like any other OpenAI-compatible endpoint. The configuration is minimal.
      </p>

      <CodeBlock
        language="yaml"
        title="NemoClaw blueprint configuration for Ollama"
      >{`# blueprint.yaml
llm:
  provider: "openai-compatible"
  base_url: "http://localhost:11434/v1"
  model: "llama3.1:8b"
  api_key: "ollama"  # Ollama accepts any non-empty string
  timeout: 120  # Ollama may be slower than cloud/NIM, allow more time
  max_retries: 2

llm_options:
  temperature: 0.1
  max_tokens: 4096`}</CodeBlock>

      <CodeBlock
        language="bash"
        title="Testing the Ollama API endpoint"
      >{`# Ensure ollama is serving
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
curl http://localhost:11434/v1/models | jq .`}</CodeBlock>

      <NoteBlock type="info" title="Ollama with Docker">
        <p>
          Ollama can also run inside Docker, which may be preferable for consistency with other
          containerized services in your NemoClaw stack. The official Docker image supports
          GPU passthrough.
        </p>
        <CodeBlock language="bash">{`docker run -d --gpus all \\
  -v ollama:/root/.ollama \\
  -p 11434:11434 \\
  --name ollama \\
  ollama/ollama

# Pull a model into the containerized Ollama
docker exec -it ollama ollama pull llama3.1:8b`}</CodeBlock>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Ollama for NemoClaw Development Workflows
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The primary use case for Ollama in the NemoClaw ecosystem is rapid iteration during
        development. Here are the workflows where Ollama shines:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Policy Development:</span> When writing and testing
          network policies, filesystem policies, and resource limits, you need to run the agent
          repeatedly to verify that the sandbox behaves correctly. Ollama's low startup time
          and zero-cost inference make this iteration loop fast and cheap.
        </li>
        <li>
          <span className="font-semibold">Blueprint Prototyping:</span> When creating custom
          blueprints, you want to test the agent's behavior quickly without worrying about API
          rate limits or costs. Ollama lets you run hundreds of test iterations against a local
          model.
        </li>
        <li>
          <span className="font-semibold">Offline Development:</span> Ollama works without any
          internet connection (after the initial model download). This is useful for development
          on planes, in secure environments, or anywhere with unreliable connectivity.
        </li>
        <li>
          <span className="font-semibold">CI/CD Testing:</span> Automated test suites for
          NemoClaw configurations can use Ollama as a lightweight LLM backend, avoiding the
          need for cloud API keys in CI environments.
        </li>
      </ul>

      <WarningBlock title="Ollama Is Not for Production">
        <p>
          While Ollama is excellent for development, it is not optimized for production
          multi-agent workloads. It lacks the advanced batching, memory management, and
          throughput optimizations of vLLM and NIM. It typically serves one request at a time,
          meaning concurrent agent sessions will queue and experience increased latency. For
          production deployments, use NVIDIA NIM or vLLM. Treat Ollama as your development
          and testing tool.
        </p>
      </WarningBlock>

      <ExerciseBlock
        title="Set Up Ollama for Local NemoClaw Development"
        difficulty="intermediate"
      >
        <ol className="list-decimal list-inside space-y-2 mt-2">
          <li>Install Ollama on your development machine.</li>
          <li>Pull the llama3.1:8b model (or phi3:mini if you have limited VRAM).</li>
          <li>Start the Ollama server and verify the API endpoint responds.</li>
          <li>Modify a NemoClaw blueprint to point at your local Ollama instance.</li>
          <li>Run a NemoClaw agent with the local model and verify it completes a simple task.</li>
          <li>Compare the response quality with a cloud-hosted model for the same task.</li>
        </ol>
      </ExerciseBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With Ollama, NIM, and vLLM as your local inference options, you have a complete toolkit
        for running models locally at every stage of the development lifecycle. The final section
        of this chapter covers performance tuning techniques that apply across all local inference
        engines to help you get the most out of your hardware.
      </p>
    </div>
  )
}
