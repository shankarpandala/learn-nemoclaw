import { CodeBlock, NoteBlock, DefinitionBlock, StepBlock, ComparisonTable, ExerciseBlock, ReferenceList } from '../../../components/content';

export default function NvidiaNemotron() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        NVIDIA Nemotron: Default Inference Provider
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw ships with NVIDIA Nemotron as its default inference provider. Specifically,
        it uses the <strong>Nemotron 3 Super 120B</strong> model hosted on NVIDIA's
        build.nvidia.com inference platform. This section covers what Nemotron is, how
        to configure it, and what to expect in terms of performance.
      </p>

      <DefinitionBlock
        term="NVIDIA Nemotron 3 Super 120B"
        definition="A large language model developed by NVIDIA, optimized for code generation, analysis, and agentic workflows. The '120B' refers to its 120 billion parameters. 'Super' denotes a variant specifically tuned for instruction following, tool use, and multi-step reasoning. It is hosted on NVIDIA's build.nvidia.com inference API."
        example="The agent uses Nemotron to generate code, analyze errors, plan multi-step tasks, and reason about sandbox policies."
        seeAlso={['build.nvidia.com', 'NIM (NVIDIA Inference Microservice)', 'Inference Provider']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Why Nemotron as Default?
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw is part of the NVIDIA ecosystem, so Nemotron is the natural default.
        But there are also technical reasons:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Optimized for agentic tasks</strong> -- Nemotron Super is tuned for
          the kind of multi-step reasoning and tool use that coding agents require
        </li>
        <li>
          <strong>Large context window</strong> -- supports long conversations with
          extensive code context, critical for agents working on large codebases
        </li>
        <li>
          <strong>Integrated billing</strong> -- uses the same NVIDIA API key as other
          NVIDIA developer services, simplifying credential management
        </li>
        <li>
          <strong>Low latency</strong> -- build.nvidia.com provides optimized inference
          with TensorRT-LLM, resulting in fast token generation
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Getting an API Key
      </h2>

      <StepBlock
        title="Setting Up NVIDIA API Access"
        steps={[
          {
            title: 'Create an NVIDIA Developer account',
            content: 'Go to developer.nvidia.com and create a free developer account if you do not already have one.',
            code: 'https://developer.nvidia.com/developer-program',
            language: 'bash',
          },
          {
            title: 'Navigate to build.nvidia.com',
            content: 'Go to build.nvidia.com and sign in with your developer account. Navigate to the API keys section.',
            code: 'https://build.nvidia.com/settings/api-keys',
            language: 'bash',
          },
          {
            title: 'Generate an API key',
            content: 'Click "Generate API Key" and save the key securely. This key will be used by NemoClaw to authenticate inference requests. The key starts with "nvapi-".',
            code: `# Your API key will look like this:
# nvapi-aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789...
# Store it securely -- do NOT commit it to version control`,
            language: 'bash',
          },
          {
            title: 'Configure NemoClaw',
            content: 'Add the API key to NemoClaw\'s host-side credential store. The key is stored on the host and never enters the sandbox.',
            code: `# Add the API key to NemoClaw's credential store
$ nemoclaw credentials set nvidia_api_key
Enter value: nvapi-aBcDeFgHiJkLmNoPqRsTuVwXyZ...
Credential stored (encrypted at rest).

# Alternatively, set via environment variable (host-side only)
$ export NVIDIA_API_KEY="nvapi-aBcDeFgHiJkLmNoPqRsTuVwXyZ..."`,
            language: 'bash',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Configuration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Nemotron is the default provider, so minimal configuration is needed. The
        inference policy file lets you customize model parameters:
      </p>

      <CodeBlock
        title="Inference policy for Nemotron"
        language="yaml"
        code={`# .nemoclaw/policies/inference.yaml
inference:
  provider: nvidia
  model: nvidia/nemotron-3-super-120b

  # Optional: customize model parameters
  parameters:
    temperature: 0.7          # Lower = more deterministic
    top_p: 0.95               # Nucleus sampling threshold
    max_tokens: 4096          # Maximum response length
    # frequency_penalty: 0.0  # Uncomment to adjust repetition

  # Optional: endpoint override (default: build.nvidia.com)
  # endpoint: "https://custom-nvidia-endpoint.example.com"

  # Credential reference (uses nemoclaw credentials store)
  credential: nvidia_api_key`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Performance Characteristics
      </h2>

      <ComparisonTable
        title="Nemotron 3 Super 120B Performance"
        headers={['Metric', 'Typical Value', 'Notes']}
        rows={[
          ['Time to first token', '200-400ms', 'Depends on prompt length and server load'],
          ['Token generation speed', '40-80 tokens/sec', 'With TensorRT-LLM optimization'],
          ['Max context length', '128K tokens', 'Supports very long conversations and large codebases'],
          ['Max output tokens', '8K tokens', 'Per response (configurable up to model limit)'],
          ['Coding benchmark (HumanEval)', '~85%', 'Strong code generation capability'],
          ['API rate limit (free tier)', '100 req/min', 'Higher limits available with paid plan'],
        ]}
      />

      <NoteBlock type="info" title="Pricing">
        NVIDIA provides a free tier for build.nvidia.com with generous rate limits
        for development. For production use, pricing is based on token consumption.
        Check the current pricing at{' '}
        <code>build.nvidia.com/pricing</code>. NemoClaw itself is free and
        open-source; you only pay for the inference API usage.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Verifying the Setup
      </h2>

      <CodeBlock
        title="Testing the Nemotron configuration"
        language="bash"
        code={`# Check that credentials are configured
$ nemoclaw credentials check nvidia_api_key
nvidia_api_key: configured (set 2025-11-15)

# Test inference connectivity
$ nemoclaw test-inference
Testing inference provider: nvidia/nemotron-3-super-120b
  Endpoint:     build.nvidia.com
  Auth:         Bearer nvapi-****...7890
  Test prompt:  "Say hello"
  Response:     "Hello! How can I help you today?"
  Latency:      287ms (time to first token)
  Status:       OK

# Check from inside the sandbox
$ nemoclaw exec -- curl -s https://inference.local/v1/models
{
  "data": [
    {
      "id": "nvidia/nemotron-3-super-120b",
      "object": "model",
      "owned_by": "nvidia"
    }
  ]
}`}
      />

      <ExerciseBlock
        question="Where is the NVIDIA API key stored in a NemoClaw setup?"
        options={[
          'In the .nemoclaw/policies/inference.yaml file',
          'In the sandbox environment as NVIDIA_API_KEY',
          'In the host-side credential store, accessible only to the blueprint process',
          'In the OpenClaw extension settings',
        ]}
        correctIndex={2}
        explanation="The API key is stored in NemoClaw's host-side credential store, which is encrypted at rest and accessible only to the blueprint process. It never appears in policy files (which are committed to git), in the sandbox environment, or in the editor. The blueprint attaches the key to outbound requests when forwarding inference calls from the sandbox."
      />

      <ReferenceList
        references={[
          {
            title: 'NVIDIA Nemotron',
            url: 'https://build.nvidia.com/nvidia/nemotron-3-super-120b',
            type: 'docs',
            description: 'Model card and API documentation for Nemotron 3 Super 120B.',
          },
          {
            title: 'build.nvidia.com API Reference',
            url: 'https://docs.nvidia.com/nim/api-reference',
            type: 'docs',
            description: 'API reference for NVIDIA inference endpoints.',
          },
        ]}
      />
    </div>
  );
}
