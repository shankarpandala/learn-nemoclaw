import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content';

export default function CustomEndpoints() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Custom Endpoints
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Many organizations run their own inference infrastructure: private model
        deployments behind a corporate firewall, fine-tuned models hosted on internal
        servers, or third-party inference services that expose OpenAI-compatible or
        Anthropic-compatible APIs. NemoClaw supports custom endpoints for both API
        formats, making it easy to integrate with any private deployment.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        OpenAI-Compatible Endpoints
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Any service that implements the OpenAI Chat Completions API can be used as a
        NemoClaw inference provider. This includes a wide range of tools and platforms:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>vLLM, TGI (Text Generation Inference), and other self-hosted engines</li>
        <li>Azure OpenAI Service</li>
        <li>Together AI, Fireworks AI, Groq, and other cloud inference providers</li>
        <li>LiteLLM proxy (routes to any backend)</li>
        <li>Any custom server implementing <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">/v1/chat/completions</code></li>
      </ul>

      <CodeBlock
        title="OpenAI-compatible custom endpoint configuration"
        language="yaml"
        code={`# .nemoclaw/policies/inference.yaml

# Example 1: Corporate vLLM deployment
inference:
  provider: openai-compatible
  model: internal/codellama-70b-ft
  endpoint: "https://inference.internal.company.com"
  credential: internal_api_key

  parameters:
    temperature: 0.7
    max_tokens: 4096

---
# Example 2: Azure OpenAI
inference:
  provider: openai-compatible
  model: gpt-4o
  endpoint: "https://my-resource.openai.azure.com/openai/deployments/gpt-4o"
  credential: azure_openai_key

  # Azure requires an API version header
  headers:
    api-version: "2024-10-21"

---
# Example 3: Together AI
inference:
  provider: openai-compatible
  model: meta-llama/Llama-3.3-70B-Instruct-Turbo
  endpoint: "https://api.together.xyz"
  credential: together_api_key`}
      />

      <NoteBlock type="info" title="The OpenAI API Is a De Facto Standard">
        The OpenAI Chat Completions API format has become a de facto standard in the
        inference ecosystem. Most modern inference engines implement it, even for
        non-OpenAI models. NemoClaw leverages this by supporting any endpoint that
        speaks this protocol. The{' '}
        <code>openai-compatible</code> provider type sends standard OpenAI-format
        requests and expects standard OpenAI-format responses.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Anthropic-Compatible Endpoints
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For services that implement Anthropic's Messages API (rather than OpenAI's
        format), NemoClaw provides the{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">anthropic-compatible</code> provider type.
        This handles the API format translation between the agent's OpenAI-format
        requests and the Anthropic-format endpoint.
      </p>

      <CodeBlock
        title="Anthropic-compatible custom endpoint"
        language="yaml"
        code={`# .nemoclaw/policies/inference.yaml

# Example: AWS Bedrock with Claude models
inference:
  provider: anthropic-compatible
  model: anthropic.claude-sonnet-4-20250514-v1:0
  endpoint: "https://bedrock-runtime.us-east-1.amazonaws.com"
  credential: aws_bedrock_key

  # AWS-specific headers
  headers:
    x-amzn-bedrock-region: "us-east-1"

---
# Example: Self-hosted Anthropic-compatible proxy
inference:
  provider: anthropic-compatible
  model: claude-sonnet-4-20250514
  endpoint: "https://claude-proxy.internal.company.com"
  credential: internal_proxy_key`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Custom Headers and Authentication
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Custom endpoints often require non-standard authentication headers, API version
        headers, or other custom headers. NemoClaw supports these through the{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">headers</code> field
        and flexible authentication options:
      </p>

      <CodeBlock
        title="Custom authentication configurations"
        language="yaml"
        code={`# .nemoclaw/policies/inference.yaml

# Standard Bearer token (default for OpenAI-compatible)
inference:
  provider: openai-compatible
  endpoint: "https://api.example.com"
  credential: my_api_key
  auth_type: bearer   # Sends: Authorization: Bearer <key>

---
# API key in custom header
inference:
  provider: openai-compatible
  endpoint: "https://api.example.com"
  credential: my_api_key
  auth_type: custom
  auth_header: "X-API-Key"  # Sends: X-API-Key: <key>

---
# Multiple credentials (e.g., OAuth + API key)
inference:
  provider: openai-compatible
  endpoint: "https://api.example.com"
  credentials:
    - name: oauth_token
      header: "Authorization"
      prefix: "Bearer "
    - name: org_api_key
      header: "X-Organization-Key"

---
# Static headers (non-secret)
inference:
  provider: openai-compatible
  endpoint: "https://api.example.com"
  credential: my_api_key
  headers:
    X-Request-Source: "nemoclaw"
    X-Environment: "production"
    api-version: "2024-10-21"`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Testing Custom Endpoints
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before deploying a custom endpoint configuration to your team, test it
        thoroughly:
      </p>

      <CodeBlock
        title="Testing and debugging custom endpoints"
        language="bash"
        code={`# Basic connectivity test
$ nemoclaw test-inference
Testing inference provider: openai-compatible/internal-codellama-70b
  Endpoint:     inference.internal.company.com
  Auth:         Bearer ****...
  Test prompt:  "Say hello"
  Response:     "Hello! How can I assist you?"
  Latency:      156ms
  Status:       OK

# Verbose test (shows full request/response for debugging)
$ nemoclaw test-inference --verbose
Request:
  POST https://inference.internal.company.com/v1/chat/completions
  Headers:
    Authorization: Bearer ****...
    Content-Type: application/json
    X-Request-Source: nemoclaw
  Body:
    {"model":"internal/codellama-70b-ft","messages":[...],"temperature":0.7}

Response:
  Status: 200 OK
  Body:
    {"id":"chatcmpl-...","choices":[...],"usage":{...}}

# Test from inside the sandbox
$ nemoclaw exec -- python3 -c "
import httpx
r = httpx.post('https://inference.local/v1/chat/completions',
    json={'model': 'internal/codellama-70b-ft',
          'messages': [{'role': 'user', 'content': 'Hello'}]})
print(r.json()['choices'][0]['message']['content'])
"
Hello! How can I help you today?`}
      />

      <WarningBlock title="Endpoint URL Must Be Exact">
        Pay careful attention to the endpoint URL format. Some providers require a
        base URL (e.g., <code>https://api.example.com</code>), while others require
        the full path (e.g., <code>https://api.example.com/v1</code>). If you get
        404 errors, check whether the provider expects{' '}
        <code>/v1/chat/completions</code> to be appended to your endpoint URL or if
        it is already part of the URL.
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Network Policy for Custom Endpoints
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When using a custom endpoint, remember that the blueprint (not the sandbox)
        makes the outbound connection. The sandbox still only talks to{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">inference.local</code>.
        However, if your custom endpoint is behind a firewall, the host machine running
        the blueprint must have network access to it.
      </p>

      <ComparisonTable
        title="Network Access Requirements"
        headers={['Component', 'Needs Access To', 'Configured Via']}
        rows={[
          ['Sandbox (agent)', 'inference.local only', 'Network namespace (automatic)'],
          ['Blueprint (host)', 'Custom endpoint URL', 'Host network (no NemoClaw config needed)'],
          ['Host firewall', 'Custom endpoint IP/port', 'Your network infrastructure'],
        ]}
      />

      <ExerciseBlock
        question="Your company runs a fine-tuned LLaMA model on vLLM at https://llm.internal.corp:8000. What provider type should you use in NemoClaw?"
        options={[
          'provider: nvidia (since LLaMA is an NVIDIA model)',
          'provider: openai-compatible (since vLLM exposes an OpenAI-compatible API)',
          'provider: vllm (NemoClaw has a dedicated vLLM provider)',
          'provider: custom (for any non-standard endpoint)',
        ]}
        correctIndex={1}
        explanation="vLLM exposes an OpenAI-compatible API (/v1/chat/completions), so you should use the openai-compatible provider type. While NemoClaw does have a dedicated vllm provider shortcut for local vLLM instances, the openai-compatible provider works for any vLLM deployment, including remote ones behind a corporate firewall."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Custom Endpoints Guide',
            url: 'https://docs.nvidia.com/nemoclaw/providers/custom',
            type: 'docs',
            description: 'Complete guide to configuring custom inference endpoints.',
          },
          {
            title: 'OpenAI Chat Completions API Spec',
            url: 'https://platform.openai.com/docs/api-reference/chat',
            type: 'docs',
            description: 'The API specification that openai-compatible endpoints must implement.',
          },
        ]}
      />
    </div>
  );
}
