import { CodeBlock, NoteBlock, DefinitionBlock, ArchitectureDiagram, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content';

export default function InferenceFlow() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Inference Flow
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When an agent running inside a NemoClaw sandbox needs to call an LLM, the request
        does not go directly to the internet. Instead, it follows a carefully designed path
        that keeps API credentials outside the sandbox while still giving the agent seamless
        access to inference. This section traces the full journey of an inference request
        from the agent to the LLM endpoint and back.
      </p>

      <ArchitectureDiagram
        title="Inference Request Flow"
        components={[
          { name: 'Agent (in Sandbox)', description: 'Makes inference request', color: 'orange' },
          { name: 'OpenShell Gateway', description: 'Intercepts & routes traffic', color: 'blue' },
          { name: 'inference.local', description: 'Virtual host inside sandbox', color: 'green' },
          { name: 'Blueprint (Host)', description: 'Attaches credentials', color: 'purple' },
          { name: 'build.nvidia.com', description: 'NVIDIA inference endpoint', color: 'red' },
        ]}
        connections={[
          { from: 'Agent (in Sandbox)', to: 'inference.local', label: 'HTTP request (no creds)' },
          { from: 'inference.local', to: 'OpenShell Gateway', label: 'network namespace bridge' },
          { from: 'OpenShell Gateway', to: 'Blueprint (Host)', label: 'IPC' },
          { from: 'Blueprint (Host)', to: 'build.nvidia.com', label: 'HTTPS + API key' },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Step-by-Step: The Request Journey
      </h2>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        1. Agent Makes a Request
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Inside the sandbox, the agent (or any tool it invokes) sends an HTTP POST
        request to <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">https://inference.local/v1/chat/completions</code>.
        This looks like a standard OpenAI-compatible API call. The agent does not need
        to know which provider is actually configured -- it always talks to the same
        local endpoint.
      </p>

      <CodeBlock
        title="Agent-side inference request"
        language="python"
        code={`import httpx

# Inside the sandbox, the agent talks to inference.local
response = httpx.post(
    "https://inference.local/v1/chat/completions",
    json={
        "model": "nvidia/nemotron-3-super-120b",
        "messages": [
            {"role": "system", "content": "You are a helpful coding assistant."},
            {"role": "user", "content": "Write a Python function to parse YAML."}
        ],
        "temperature": 0.7
    }
    # Note: NO Authorization header, NO API key
)`}
      />

      <DefinitionBlock
        term="inference.local"
        definition="A virtual hostname that resolves only inside a NemoClaw sandbox. It points to the OpenShell gateway's listening socket within the sandbox's network namespace. The agent treats it as a regular HTTPS endpoint, but the traffic never leaves the host machine unencrypted."
        example="curl https://inference.local/v1/models -- lists available models from inside the sandbox."
        seeAlso={['OpenShell Gateway', 'Network Namespace', 'Credential Isolation']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        2. OpenShell Gateway Intercepts
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The sandbox runs inside its own network namespace. The only way traffic can
        leave the sandbox is through the OpenShell gateway, which listens on the
        sandbox-side network interface. When the gateway receives the request to
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">inference.local</code>,
        it does not forward it blindly. Instead, it:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Validates that the request matches the expected inference API schema</li>
        <li>Checks that the requested model is in the allowlist defined by the active policy</li>
        <li>Strips any headers that might have been injected by the agent</li>
        <li>Forwards the sanitized request body to the blueprint process via IPC</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        3. Blueprint Attaches Credentials
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The blueprint process runs on the host, outside the sandbox. It receives the
        sanitized inference request from the gateway and performs the critical
        credential injection step:
      </p>

      <CodeBlock
        title="Blueprint credential injection (conceptual)"
        language="python"
        code={`class InferenceRouter:
    async def handle_request(self, sanitized_request: dict) -> dict:
        # Load credentials from host-side secure storage
        api_key = self.credential_store.get("nvidia_api_key")
        endpoint = self.config.inference_endpoint  # e.g., build.nvidia.com

        # Forward with credentials attached
        response = await self.http_client.post(
            f"https://{endpoint}/v1/chat/completions",
            json=sanitized_request,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
        )

        # Strip any sensitive headers from the response
        return self.sanitize_response(response.json())`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        4. Response Returns
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The LLM endpoint returns its response to the blueprint. The blueprint sanitizes
        the response (removing any headers that might leak information about the host-side
        configuration), then sends it back through the gateway into the sandbox. The agent
        receives a standard OpenAI-compatible response as if it had called the API directly.
      </p>

      <CodeBlock
        title="Response as seen by the agent"
        language="json"
        code={`{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "nvidia/nemotron-3-super-120b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Here's a YAML parsing function:\\n\\nimport yaml\\n..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 31,
    "completion_tokens": 142,
    "total_tokens": 173
  }
}`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Why Credentials Never Enter the Sandbox
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This architecture ensures that even if the agent is compromised -- if it executes
        malicious code, if a prompt injection succeeds, if a dependency is backdoored --
        the API credentials remain safe. The agent has no way to extract them because they
        simply do not exist inside the sandbox's filesystem, environment variables, or
        memory space. The credentials only exist in the blueprint process, which runs in a
        separate process on the host with its own memory space.
      </p>

      <WarningBlock title="Common Misconception">
        Some developers assume that environment variables set on the host are
        available inside the sandbox. They are not. OpenShell creates a clean
        environment. The only way data enters the sandbox is through explicitly
        configured mount points and the network namespace bridge. API keys in your
        shell's <code>~/.bashrc</code> are invisible to sandboxed processes.
      </WarningBlock>

      <NoteBlock type="info" title="Latency Considerations">
        The extra hop through the gateway and blueprint adds approximately 2-5ms of
        latency per request on a typical system. This is negligible compared to the
        100-500ms typical LLM inference time. The security benefit far outweighs this
        cost. If you are using local inference (Ollama, vLLM), the added latency is
        even less significant since the total round-trip is shorter.
      </NoteBlock>

      <ExerciseBlock
        question="Why does the agent send requests to inference.local instead of directly to build.nvidia.com?"
        options={[
          'inference.local is faster because it caches responses',
          'The sandbox network namespace blocks direct internet access, and inference.local routes through the credential-injecting gateway',
          'inference.local is just an alias for build.nvidia.com in /etc/hosts',
          'The agent does not have DNS resolution capability',
        ]}
        correctIndex={1}
        explanation="The sandbox runs in an isolated network namespace with no direct internet access. inference.local is a virtual endpoint that routes through the OpenShell gateway, which forwards requests to the blueprint for credential injection. This ensures API keys never exist inside the sandbox."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Inference Architecture',
            url: 'https://docs.nvidia.com/nemoclaw/inference',
            type: 'docs',
            description: 'Official documentation on inference routing, credential isolation, and supported providers.',
          },
          {
            title: 'OpenShell Network Namespace Design',
            url: 'https://docs.nvidia.com/openshell/networking',
            type: 'docs',
            description: 'How OpenShell implements network isolation and the gateway bridge.',
          },
        ]}
      />
    </div>
  );
}
