import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock } from '../../../components/content'

export default function NvidiaNim() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        NVIDIA NIM: Local Inference Microservices
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Throughout this course, we have primarily used cloud-hosted LLM endpoints -- services like
        the NVIDIA API Catalog or third-party providers -- to power the language models behind our
        NemoClaw-sandboxed agents. Cloud endpoints are convenient, but they introduce latency,
        ongoing costs, data residency concerns, and a dependency on external infrastructure. For
        production deployments where these factors matter, NVIDIA NIM (NVIDIA Inference
        Microservices) offers a compelling alternative: run the same models locally on your own
        GPU hardware, with the same API interface, but with full control over the infrastructure.
      </p>

      <DefinitionBlock
        term="NVIDIA NIM"
        definition="NVIDIA Inference Microservices (NIM) is a set of optimized, containerized inference runtimes that allow you to deploy NVIDIA-accelerated AI models on your own infrastructure. Each NIM container packages a model with its inference engine (typically TensorRT-LLM), an OpenAI-compatible API server, and all necessary dependencies into a single Docker container that can run on any NVIDIA GPU system."
        example="Deploying a Llama 3.1 70B NIM container on a local workstation with two NVIDIA A6000 GPUs, then pointing NemoClaw's LLM configuration at localhost:8000 instead of a cloud endpoint."
        seeAlso={['TensorRT-LLM', 'Local Inference', 'Model Deployment']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What NVIDIA NIM Actually Is
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        At its core, a NIM container is a self-contained inference server. When you pull a NIM
        container image from NVIDIA's NGC registry, you are getting a Docker image that bundles
        together several components: the model weights (or a mechanism to download them on first
        run), the TensorRT-LLM inference engine optimized for NVIDIA GPUs, an API server that
        exposes an OpenAI-compatible chat completions endpoint, health check endpoints for
        orchestration, and performance monitoring hooks. The container starts up, loads the model
        onto your GPU(s), and begins serving requests on a local port.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The key design principle of NIM is that it presents the same API interface as cloud-hosted
        models. If your application is currently calling an OpenAI-compatible endpoint at
        api.nvidia.com, switching to a local NIM deployment requires changing only the base URL
        and potentially the API key. No code changes, no schema differences, no new client
        libraries. This is critical for NemoClaw integration because NemoClaw's LLM configuration
        is already endpoint-based -- you simply point it at a different URL.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        How NIM Enables Local Model Deployment
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before NIM, deploying a model locally meant manually assembling an inference stack:
        downloading model weights, installing a serving framework, configuring GPU memory
        allocation, optimizing batch sizes, and troubleshooting CUDA compatibility issues. NIM
        abstracts all of this into a single docker run command. The container handles model
        loading, GPU memory management, request batching, and concurrent request handling
        internally.
      </p>

      <CodeBlock
        language="bash"
        title="Pulling and running a NIM container"
      >{`# Authenticate with NGC registry
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
# and start serving on port 8000.`}</CodeBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Once the NIM container is running, it exposes an OpenAI-compatible API at the configured
        port. You can test it with a simple curl command to confirm it is operational before
        wiring it into NemoClaw.
      </p>

      <CodeBlock
        language="bash"
        title="Testing the local NIM endpoint"
      >{`curl -s http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "meta/llama-3.1-8b-instruct",
    "messages": [{"role": "user", "content": "Hello, are you running locally?"}],
    "max_tokens": 64
  }' | jq .`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Integrating NIM with NemoClaw
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's configuration system supports specifying a custom LLM endpoint. When using NIM,
        you configure the endpoint to point at your local NIM container instead of a remote API.
        This is done through the blueprint's configuration or through environment variables at
        runtime.
      </p>

      <CodeBlock
        language="yaml"
        title="NemoClaw blueprint configuration for local NIM"
      >{`# blueprint.yaml
llm:
  provider: "openai-compatible"
  base_url: "http://localhost:8000/v1"
  model: "meta/llama-3.1-8b-instruct"
  api_key: "not-needed-for-local"  # NIM does not require an API key locally
  timeout: 30
  max_retries: 2

# When running NIM on a separate machine on your network:
# base_url: "http://192.168.1.100:8000/v1"`}</CodeBlock>

      <NoteBlock type="info" title="Network Policy Considerations for Local NIM">
        <p>
          When running NIM locally on the same machine as the NemoClaw sandbox, the agent needs
          network access to localhost:8000 (or whatever port NIM is configured on). Your network
          policy must whitelist this endpoint. If NIM runs on a separate machine, whitelist that
          machine's IP address and port. Remember that NemoClaw's deny-by-default policy applies
          even to local network addresses -- nothing is reachable unless explicitly allowed.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Available NIM Models
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NVIDIA offers NIM containers for a wide range of models. The available catalog includes
        models from Meta (Llama family), Mistral, Google (Gemma), Microsoft (Phi), and others.
        Each NIM container is optimized for specific GPU architectures and VRAM configurations.
        Not every model will run on every GPU -- larger models like Llama 3.1 70B require
        multiple high-VRAM GPUs, while smaller models like Llama 3.1 8B can run on a single
        consumer GPU with 24 GB of VRAM.
      </p>

      <ComparisonTable
        title="NIM Model Requirements (Approximate)"
        headers={['Model', 'Min VRAM', 'Recommended GPU', 'Typical Throughput']}
        rows={[
          ['Llama 3.1 8B', '16 GB', '1x RTX 4090 / A5000', '~40 tokens/sec'],
          ['Llama 3.1 70B', '2x 48 GB', '2x A6000 / H100', '~15 tokens/sec'],
          ['Mistral 7B', '16 GB', '1x RTX 4090 / A5000', '~50 tokens/sec'],
          ['Phi-3 Mini', '8 GB', '1x RTX 3080 / A4000', '~60 tokens/sec'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Advantages of Local NIM Deployment
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Data Privacy:</span> All inference happens on your
          hardware. No data leaves your network. This is critical for enterprises handling
          sensitive code, proprietary data, or regulated workloads where sending data to external
          APIs is prohibited by policy or regulation.
        </li>
        <li>
          <span className="font-semibold">Latency:</span> Local inference eliminates network
          round-trip time. For agents that make many sequential LLM calls, the cumulative latency
          savings can be substantial -- often reducing total task completion time by 30-50%.
        </li>
        <li>
          <span className="font-semibold">Cost Predictability:</span> After the initial GPU
          hardware investment, inference costs are fixed. There are no per-token charges, no rate
          limits, and no surprise bills. For high-volume deployments, this is often significantly
          cheaper than cloud API pricing.
        </li>
        <li>
          <span className="font-semibold">Availability:</span> No dependency on external service
          uptime. Your agents continue to function even during cloud provider outages. This is
          particularly valuable for critical infrastructure monitoring agents that must operate
          continuously.
        </li>
        <li>
          <span className="font-semibold">Customization:</span> NIM supports deploying fine-tuned
          model variants. If you have customized a model for your specific use case, you can
          serve it through NIM with the same optimized inference stack.
        </li>
      </ul>

      <WarningBlock title="GPU Hardware Requirements">
        <p>
          Running NIM locally requires NVIDIA GPUs with sufficient VRAM for your chosen model.
          Consumer GPUs like the RTX 4090 (24 GB VRAM) can handle 7-8B parameter models
          comfortably, but larger models require professional-grade GPUs (A6000, H100) or
          multi-GPU setups. Ensure your hardware meets the minimum requirements before attempting
          deployment, as insufficient VRAM will cause the container to fail during model loading
          with out-of-memory errors.
        </p>
      </WarningBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NVIDIA NIM provides the most performant path to local inference for NemoClaw deployments.
        In the next section, we will cover the prerequisite steps for setting up your local GPU
        environment -- installing drivers, CUDA, and the container toolkit -- before you can
        run NIM or any other local inference solution.
      </p>
    </div>
  )
}
