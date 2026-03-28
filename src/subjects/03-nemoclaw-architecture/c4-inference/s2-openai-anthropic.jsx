import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ReferenceList } from '../../../components/content';

export default function OpenAIAnthropic() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        OpenAI and Anthropic Providers
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While Nemotron is the default, NemoClaw supports OpenAI (GPT-4o, GPT-4 Turbo,
        o1, o3, etc.) and Anthropic (Claude Opus, Sonnet, Haiku) as inference providers.
        Switching between providers is a configuration change -- no code modifications
        are needed. The agent inside the sandbox always talks to{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">inference.local</code> regardless
        of which provider is configured behind the scenes.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Configuring OpenAI
      </h2>

      <StepBlock
        title="Setting Up OpenAI"
        steps={[
          {
            title: 'Obtain an OpenAI API key',
            content: 'Go to platform.openai.com and create an API key. You need a funded account for API access.',
            code: '# Your key will look like: sk-proj-aBcDeFgHiJkLmNoPqRsT...',
            language: 'bash',
          },
          {
            title: 'Store the credential',
            content: 'Add the key to NemoClaw\'s credential store on the host side.',
            code: `$ nemoclaw credentials set openai_api_key
Enter value: sk-proj-aBcDeFgHiJkLmNoPqRsT...
Credential stored (encrypted at rest).`,
            language: 'bash',
          },
          {
            title: 'Update the inference policy',
            content: 'Point the inference configuration to OpenAI and select your preferred model.',
            code: `# .nemoclaw/policies/inference.yaml
inference:
  provider: openai
  model: gpt-4o

  parameters:
    temperature: 0.7
    max_tokens: 4096

  credential: openai_api_key

  # Optional: specify organization
  # organization: "org-aBcDeFgHiJkLmN"`,
            language: 'yaml',
          },
          {
            title: 'Apply and test',
            content: 'Apply the configuration change and verify connectivity.',
            code: `$ nemoclaw apply
Planning... provider changed: nvidia -> openai
Applying... inference gateway reconfigured
Done.

$ nemoclaw test-inference
Testing inference provider: openai/gpt-4o
  Endpoint:     api.openai.com
  Auth:         Bearer sk-proj-****...
  Test prompt:  "Say hello"
  Response:     "Hello! How can I assist you?"
  Latency:      312ms
  Status:       OK`,
            language: 'bash',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Configuring Anthropic
      </h2>

      <StepBlock
        title="Setting Up Anthropic"
        steps={[
          {
            title: 'Obtain an Anthropic API key',
            content: 'Go to console.anthropic.com and create an API key.',
            code: '# Your key will look like: sk-ant-api03-aBcDeFgHiJkLmNoPqRsT...',
            language: 'bash',
          },
          {
            title: 'Store the credential',
            content: 'Add the key to NemoClaw\'s credential store.',
            code: `$ nemoclaw credentials set anthropic_api_key
Enter value: sk-ant-api03-aBcDeFgHiJkLmNoPqRsT...
Credential stored (encrypted at rest).`,
            language: 'bash',
          },
          {
            title: 'Update the inference policy',
            content: 'Configure the Anthropic provider and model.',
            code: `# .nemoclaw/policies/inference.yaml
inference:
  provider: anthropic
  model: claude-sonnet-4-20250514

  parameters:
    temperature: 0.7
    max_tokens: 4096

  credential: anthropic_api_key`,
            language: 'yaml',
          },
          {
            title: 'Apply and test',
            content: 'Apply and verify the Anthropic provider.',
            code: `$ nemoclaw apply
Planning... provider changed: nvidia -> anthropic
Applying... inference gateway reconfigured
Done.

$ nemoclaw test-inference
Testing inference provider: anthropic/claude-sonnet-4-20250514
  Endpoint:     api.anthropic.com
  Auth:         x-api-key sk-ant-****...
  Test prompt:  "Say hello"
  Response:     "Hello! I'm ready to help."
  Latency:      275ms
  Status:       OK`,
            language: 'bash',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Provider Comparison
      </h2>

      <ComparisonTable
        title="Provider Feature Comparison"
        headers={['Feature', 'NVIDIA Nemotron', 'OpenAI', 'Anthropic']}
        rows={[
          ['Default model', 'nemotron-3-super-120b', 'gpt-4o', 'claude-sonnet-4-20250514'],
          ['API format', 'OpenAI-compatible', 'OpenAI native', 'Anthropic Messages API'],
          ['Max context', '128K tokens', '128K tokens', '200K tokens'],
          ['Tool/function calling', 'Yes', 'Yes', 'Yes'],
          ['Streaming', 'Yes', 'Yes', 'Yes'],
          ['Credential header', 'Authorization: Bearer', 'Authorization: Bearer', 'x-api-key'],
        ]}
        highlightDiffs
      />

      <NoteBlock type="info" title="API Translation Is Automatic">
        The blueprint handles all API format differences. When Anthropic is configured,
        the blueprint translates the OpenAI-compatible request from the sandbox into
        Anthropic's Messages API format, and translates the response back. The agent
        inside the sandbox always uses the same OpenAI-compatible format regardless
        of provider. This is one of the key benefits of the gateway architecture.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Switching Between Providers
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Switching providers is as simple as changing the{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">provider</code> and{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">model</code> fields
        in your inference policy and running{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw apply</code>.
        The sandbox does not need to be restarted. The gateway reconfigures on the fly,
        and the next inference request from the agent goes to the new provider.
      </p>

      <CodeBlock
        title="Quick provider switching"
        language="bash"
        code={`# Switch from OpenAI to Anthropic
$ sed -i 's/provider: openai/provider: anthropic/' .nemoclaw/policies/inference.yaml
$ sed -i 's/model: gpt-4o/model: claude-sonnet-4-20250514/' .nemoclaw/policies/inference.yaml
$ sed -i 's/credential: openai_api_key/credential: anthropic_api_key/' .nemoclaw/policies/inference.yaml
$ nemoclaw apply
Planning... provider changed: openai -> anthropic
Applying... inference gateway reconfigured (0.1s)
Done.

# The agent's next inference request will automatically use Anthropic
# No agent restart needed`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Credential Security
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Regardless of which provider you configure, the credential management works
        the same way:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>Credentials are stored in the host-side credential store (encrypted at rest)</li>
        <li>The policy file references credentials by name, not by value</li>
        <li>Credentials never enter the sandbox or appear in policy files</li>
        <li>The blueprint attaches credentials to outbound requests at the gateway level</li>
      </ul>

      <WarningBlock title="Never Put API Keys in Policy Files">
        The <code>credential</code> field in the inference policy is a <em>reference
        name</em>, not the actual key value. Writing{' '}
        <code>credential: "sk-proj-aBcDeFg..."</code> is wrong and will be rejected
        by NemoClaw. Always use{' '}
        <code>nemoclaw credentials set &lt;name&gt;</code> to store keys securely,
        then reference the name in the policy file.
      </WarningBlock>

      <NoteBlock type="tip" title="Multiple Credentials for Different Environments">
        You can store multiple credentials and reference different ones in different
        policy configurations. For example, use a development API key for local work
        and a production key in CI. Use environment-specific policy overlays to
        switch between them.
      </NoteBlock>

      <ReferenceList
        references={[
          {
            title: 'OpenAI API Reference',
            url: 'https://platform.openai.com/docs/api-reference',
            type: 'docs',
            description: 'Official OpenAI API documentation.',
          },
          {
            title: 'Anthropic API Reference',
            url: 'https://docs.anthropic.com/en/api',
            type: 'docs',
            description: 'Official Anthropic API documentation.',
          },
          {
            title: 'NemoClaw Provider Configuration',
            url: 'https://docs.nvidia.com/nemoclaw/providers',
            type: 'docs',
            description: 'Configuring inference providers in NemoClaw.',
          },
        ]}
      />
    </div>
  );
}
