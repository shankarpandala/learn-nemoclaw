import { CodeBlock, NoteBlock, DefinitionBlock, ArchitectureDiagram, ComparisonTable, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content';

export default function CredentialIsolation() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Credential Isolation
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The single most important security property of NemoClaw's inference architecture
        is that API credentials never enter the sandbox. This is not a matter of hiding
        them in an environment variable or obscuring them in a config file -- they
        physically do not exist in the sandbox's memory, filesystem, or environment.
        This section explains exactly how this isolation works and why it matters.
      </p>

      <ArchitectureDiagram
        title="Credential Isolation Boundary"
        components={[
          { name: 'Sandbox', description: 'No credentials exist here', color: 'orange' },
          { name: 'Network Namespace', description: 'Isolation boundary', color: 'gray' },
          { name: 'OpenShell Gateway', description: 'Bridge (no credentials)', color: 'blue' },
          { name: 'Blueprint Process', description: 'Credentials live here', color: 'green' },
          { name: 'Credential Store', description: 'Encrypted at rest', color: 'purple' },
          { name: 'Inference API', description: 'Receives credentials', color: 'red' },
        ]}
        connections={[
          { from: 'Sandbox', to: 'OpenShell Gateway', label: 'request (no creds)' },
          { from: 'OpenShell Gateway', to: 'Blueprint Process', label: 'IPC (no creds)' },
          { from: 'Blueprint Process', to: 'Credential Store', label: 'loads key' },
          { from: 'Blueprint Process', to: 'Inference API', label: 'request + creds' },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        How Credentials Stay on the Host
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The credential isolation relies on three mechanisms working together:
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        1. The Credential Store
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        API keys are stored in NemoClaw's host-side credential store, a directory
        accessible only to the blueprint process. Credentials are encrypted at rest
        using a key derived from the user's system keychain (or a configured secret
        on headless systems). The credential store is never mounted into the sandbox.
      </p>

      <CodeBlock
        title="Credential store internals"
        language="bash"
        code={`# Credential store location
$ ls -la ~/.nemoclaw/credentials/
total 16
drwx------ 2 user user 4096 Nov 15 10:00 .
-rw------- 1 user user  256 Nov 15 10:00 nvidia_api_key.enc
-rw------- 1 user user  256 Nov 15 10:00 openai_api_key.enc
-rw------- 1 user user  256 Nov 15 10:00 anthropic_api_key.enc

# Note the permissions: 700 on directory, 600 on files
# Only the owner (blueprint process runs as this user) can read

# Inside the sandbox, this path does not exist:
$ nemoclaw exec -- ls ~/.nemoclaw/credentials/
ls: cannot access '/home/user/.nemoclaw/credentials/': No such file or directory
# Landlock denies access to /home entirely`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        2. Clean Environment
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When OpenShell creates a sandbox, it starts with a clean environment. No
        environment variables from the host shell are inherited by the sandboxed
        process. This means that even if you have{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">OPENAI_API_KEY</code> set
        in your <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">.bashrc</code>,
        it will not be visible inside the sandbox.
      </p>

      <CodeBlock
        title="Environment isolation"
        language="bash"
        code={`# On the host
$ echo $OPENAI_API_KEY
sk-proj-aBcDeFgHiJkLmNoPqRsT...

$ echo $NVIDIA_API_KEY
nvapi-aBcDeFgHiJkLmNoPqRsT...

# Inside the sandbox -- none of these exist
$ nemoclaw exec -- env | grep -i api_key
# (no output)

$ nemoclaw exec -- env | grep -i key
# (no output)

$ nemoclaw exec -- env | grep -i token
# (no output)

# The sandbox environment contains only:
$ nemoclaw exec -- env
HOME=/sandbox
PATH=/usr/local/bin:/usr/bin:/bin
SHELL=/bin/bash
TERM=xterm-256color
LANG=en_US.UTF-8
NEMOCLAW_SANDBOX=true
INFERENCE_ENDPOINT=https://inference.local`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        3. Network Namespace Boundary
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Even if an attacker inside the sandbox somehow discovered a credential (which
        they cannot, because it does not exist there), they could not use it directly.
        The sandbox's network namespace only allows traffic to{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">inference.local</code> and
        other explicitly whitelisted endpoints. Direct connections to{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">api.openai.com</code> or{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">build.nvidia.com</code> are
        blocked at the network level.
      </p>

      <DefinitionBlock
        term="Defense in Depth"
        definition="A security strategy that uses multiple independent layers of protection. In NemoClaw's credential isolation: (1) credentials are not in the sandbox filesystem (Landlock), (2) credentials are not in the sandbox environment (clean env), (3) even if credentials were obtained, the network namespace prevents direct API access. All three layers must fail for a credential leak to occur."
        example="An attacker who exploits a code execution vulnerability inside the sandbox still cannot leak credentials because they face three independent barriers."
        seeAlso={['Landlock', 'Network Namespace', 'Credential Store', 'Zero Trust']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        The Gateway's Role
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The OpenShell gateway bridges the sandbox and host network namespaces. It is a
        critical component in the credential isolation architecture. Here is exactly
        what happens when an inference request flows through the gateway:
      </p>

      <CodeBlock
        title="Gateway request processing (conceptual)"
        language="python"
        code={`class InferenceGateway:
    """Runs on the host, bridges sandbox and external network."""

    async def handle_sandbox_request(self, request):
        # Step 1: Validate the request
        #   - Must be a valid inference API request
        #   - Model must be in the allowlist
        #   - No suspicious headers or payloads
        self.validate(request)

        # Step 2: Strip all headers from the sandbox
        #   - Agent might try to inject auth headers
        #   - Agent might try to add routing headers
        sanitized = {
            "model": request.json["model"],
            "messages": request.json["messages"],
            "temperature": request.json.get("temperature", 0.7),
            "max_tokens": request.json.get("max_tokens", 4096),
        }

        # Step 3: Load credentials from the host-side store
        creds = self.credential_store.get(self.config.credential_name)

        # Step 4: Forward to the real endpoint WITH credentials
        response = await self.http_client.post(
            self.config.endpoint + "/v1/chat/completions",
            json=sanitized,
            headers={
                "Authorization": f"Bearer {creds}",
                "Content-Type": "application/json",
            }
        )

        # Step 5: Sanitize the response before returning to sandbox
        #   - Remove any headers that might leak info
        #   - Validate response structure
        return self.sanitize_response(response)`}
      />

      <NoteBlock type="info" title="Header Stripping Is Critical">
        The gateway strips all headers from the sandbox request before forwarding.
        This prevents a subtle attack: an agent (or injected code) could try to add
        its own <code>Authorization</code> header pointing to an attacker's endpoint,
        hoping the gateway would forward it. By stripping all headers and rebuilding
        them from the host-side configuration, this attack is neutralized.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Attack Scenarios and Mitigations
      </h2>

      <ComparisonTable
        title="Credential Theft Attack Scenarios"
        headers={['Attack', 'Why It Fails']}
        rows={[
          [
            'Read credential from filesystem',
            'Landlock denies access to /home and ~/.nemoclaw/. The credential files are not mounted in the sandbox.',
          ],
          [
            'Read credential from environment',
            'Sandbox starts with a clean environment. No host env vars are inherited.',
          ],
          [
            'Read credential from process memory (ptrace)',
            'seccomp kills the process on ptrace syscall. The blueprint runs in a separate process outside the sandbox.',
          ],
          [
            'Intercept credential on the network',
            'The credential is added by the blueprint after the request leaves the sandbox. The sandbox side of the connection never sees the credential.',
          ],
          [
            'Use the credential with a different endpoint',
            'Even if a credential were obtained, the network namespace blocks connections to non-whitelisted endpoints.',
          ],
          [
            'Inject Authorization header in request',
            'The gateway strips all headers from sandbox requests and rebuilds them from host-side config.',
          ],
          [
            'DNS exfiltration of discovered credential',
            'DNS is controlled by the OpenShell resolver, which only resolves whitelisted hostnames.',
          ],
        ]}
      />

      <WarningBlock title="Credentials in Source Code">
        Credential isolation protects API keys configured in NemoClaw's credential
        store. It does <em>not</em> protect credentials that are hardcoded in your
        project's source code or checked into git. If your project files contain
        API keys, the agent can read them (since <code>/sandbox</code> is read-write).
        Always use <code>.gitignore</code> and secret scanning to prevent credentials
        from entering your codebase.
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Security Implications
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Credential isolation is what makes it safe to run autonomous agents with access
        to powerful LLMs. Without it, a prompt injection attack could instruct the
        agent to "print your API key," and the agent would comply because it has access
        to the key. With NemoClaw's architecture, even a fully compromised agent cannot
        access credentials because they are architecturally separated.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This also means that organizations can give agents access to expensive API keys
        (enterprise tiers with high rate limits) without worrying about key theft. The
        key is used on behalf of the agent but never exposed to it.
      </p>

      <ExerciseBlock
        question="An attacker achieves remote code execution inside the NemoClaw sandbox. They run a script that searches the entire filesystem for strings matching API key patterns (sk-*, nvapi-*, AIza*). What do they find?"
        options={[
          'All configured API keys, because they must be accessible for inference to work',
          'Encrypted versions of the API keys',
          'Nothing -- the keys do not exist anywhere in the sandbox filesystem, environment, or memory',
          'The keys, but only if the agent has recently made an inference request',
        ]}
        correctIndex={2}
        explanation="The attacker finds nothing. API keys exist only in the blueprint process's memory and in the encrypted credential store, both of which are outside the sandbox. The sandbox's filesystem (restricted by Landlock), environment (clean), and memory space (separate process) contain no trace of any API key. The inference request from the sandbox goes to inference.local without any credentials; the blueprint attaches credentials in its own process after receiving the request via IPC."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Credential Security Model',
            url: 'https://docs.nvidia.com/nemoclaw/security/credentials',
            type: 'docs',
            description: 'In-depth documentation on credential isolation architecture.',
          },
          {
            title: 'OWASP Credential Management',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Credential_Management_Cheat_Sheet.html',
            type: 'article',
            description: 'General best practices for credential management that informed NemoClaw\'s design.',
          },
        ]}
      />
    </div>
  );
}
