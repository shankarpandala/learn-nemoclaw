import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content';

export default function GoogleGemini() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Google Gemini Integration
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw supports Google's Gemini models as an inference provider. Gemini
        brings a distinctive set of strengths to the table: a massive 1-million-token
        context window (Gemini 1.5 Pro), strong multimodal capabilities, and
        competitive pricing. This section covers setup, configuration, and use cases
        where Gemini excels.
      </p>

      <DefinitionBlock
        term="Google Gemini"
        definition="A family of multimodal large language models developed by Google DeepMind. Available in multiple sizes: Gemini 2.5 Pro (most capable), Gemini 2.0 Flash (fast and efficient), and others. Accessed through the Google AI Studio API or Vertex AI. Known for very large context windows and strong reasoning capabilities."
        example="Gemini 2.5 Pro can process an entire codebase (up to 1M tokens) in a single prompt, making it well-suited for agents that need broad codebase awareness."
        seeAlso={['Google AI Studio', 'Vertex AI', 'Multimodal', 'Context Window']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Setup and Configuration
      </h2>

      <StepBlock
        title="Configuring Gemini as Inference Provider"
        steps={[
          {
            title: 'Get a Google AI API key',
            content: 'Go to Google AI Studio (aistudio.google.com) and generate an API key. Alternatively, use a Vertex AI service account for enterprise deployments.',
            code: `# Google AI Studio API key
# Looks like: AIzaSyA-aBcDeFgHiJkLmNoPqRsTuVwXyZ01234

# For Vertex AI, use a service account JSON key file instead`,
            language: 'bash',
          },
          {
            title: 'Store the credential',
            content: 'Add the API key to NemoClaw\'s credential store.',
            code: `# For Google AI Studio
$ nemoclaw credentials set google_api_key
Enter value: AIzaSyA-aBcDeFgHiJkLmNoPqRsTuVwXyZ...
Credential stored (encrypted at rest).

# For Vertex AI (service account)
$ nemoclaw credentials set-file google_service_account \\
    /path/to/service-account.json
Credential file stored (encrypted at rest).`,
            language: 'bash',
          },
          {
            title: 'Configure the inference policy',
            content: 'Update the inference policy to use Gemini.',
            code: `# .nemoclaw/policies/inference.yaml
inference:
  provider: google
  model: gemini-2.5-pro

  parameters:
    temperature: 0.7
    max_tokens: 8192
    # top_k: 40            # Google-specific parameter
    # top_p: 0.95

  credential: google_api_key

  # For Vertex AI instead of AI Studio:
  # provider: google-vertex
  # project: "my-gcp-project"
  # location: "us-central1"
  # credential: google_service_account`,
            language: 'yaml',
          },
          {
            title: 'Apply and verify',
            content: 'Apply the configuration and test connectivity.',
            code: `$ nemoclaw apply
Planning... provider changed: nvidia -> google
Applying... inference gateway reconfigured
Done.

$ nemoclaw test-inference
Testing inference provider: google/gemini-2.5-pro
  Endpoint:     generativelanguage.googleapis.com
  Auth:         API key ****...4567
  Test prompt:  "Say hello"
  Response:     "Hello! How can I help you today?"
  Latency:      245ms
  Status:       OK`,
            language: 'bash',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Available Gemini Models
      </h2>

      <ComparisonTable
        title="Gemini Models for NemoClaw"
        headers={['Model', 'Context Window', 'Best For', 'Speed']}
        rows={[
          ['gemini-2.5-pro', '1M tokens', 'Complex reasoning, large codebase analysis', 'Moderate'],
          ['gemini-2.5-flash', '1M tokens', 'Fast coding tasks, high throughput', 'Fast'],
          ['gemini-2.0-flash', '1M tokens', 'Budget-friendly, quick iterations', 'Very fast'],
          ['gemini-2.0-flash-lite', '128K tokens', 'Simple tasks, lowest cost', 'Fastest'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Use Cases for Choosing Gemini
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Gemini is particularly well-suited for certain agent workloads where its
        strengths align with the task requirements:
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Large Codebase Analysis
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With a 1-million-token context window, Gemini 2.5 Pro can ingest an entire
        medium-sized codebase in a single prompt. This is valuable for agents that need
        to understand cross-file dependencies, perform large-scale refactoring, or
        analyze architectural patterns across many files. Other providers with 128K
        context windows would need to work with the codebase in chunks.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Cost-Sensitive Workloads
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Gemini Flash models offer competitive pricing for high-throughput agent
        workloads. If your agent makes many inference calls (for example, iterating on
        code with rapid feedback loops), the Flash models can significantly reduce
        costs compared to larger models from other providers while maintaining good
        code quality.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Multimodal Tasks
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Gemini models natively support image, audio, and video input. If your agent
        needs to analyze screenshots (UI testing), interpret diagrams (architecture
        review), or process documentation that includes images, Gemini's multimodal
        capabilities are a strong fit.
      </p>

      <NoteBlock type="info" title="API Translation">
        Google's Gemini API uses a different format than OpenAI's. NemoClaw's blueprint
        handles the translation automatically. The agent in the sandbox always sends
        OpenAI-compatible requests to <code>inference.local</code>, and the blueprint
        converts them to Gemini's format before forwarding. Response translation
        (Gemini format to OpenAI format) is also handled transparently.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Vertex AI vs. AI Studio
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw supports both Google AI Studio (simpler, API key auth) and Vertex AI
        (enterprise, service account auth). Choose based on your needs:
      </p>

      <ComparisonTable
        title="AI Studio vs. Vertex AI"
        headers={['Aspect', 'Google AI Studio', 'Vertex AI']}
        rows={[
          ['Authentication', 'API key', 'Service account / OAuth'],
          ['Setup complexity', 'Simple', 'Requires GCP project setup'],
          ['Rate limits', 'Per-key limits', 'Project-level, higher limits'],
          ['Data residency', 'Google-managed', 'Configurable region'],
          ['Enterprise features', 'Limited', 'VPC-SC, CMEK, audit logging'],
          ['Best for', 'Development, small teams', 'Production, enterprise'],
        ]}
        highlightDiffs
      />

      <CodeBlock
        title="Vertex AI configuration"
        language="yaml"
        code={`# .nemoclaw/policies/inference.yaml (Vertex AI)
inference:
  provider: google-vertex
  model: gemini-2.5-pro

  # GCP project configuration
  project: "my-company-ai-project"
  location: "us-central1"   # Choose region closest to you

  parameters:
    temperature: 0.7
    max_tokens: 8192

  # Service account credential
  credential: google_service_account`}
      />

      <ExerciseBlock
        question="When would you choose Gemini 2.5 Pro over GPT-4o for a NemoClaw agent?"
        options={[
          'When you need the fastest possible response time',
          'When the agent needs to analyze a large codebase (500K+ tokens) in a single context window',
          'When you need the cheapest possible inference',
          'When you need tool/function calling support',
        ]}
        correctIndex={1}
        explanation="Gemini 2.5 Pro's 1-million-token context window is its key differentiator. GPT-4o supports 128K tokens, which may not be enough to include an entire medium-to-large codebase. If your agent needs whole-codebase awareness (for architectural analysis, large refactors, or cross-file dependency tracking), Gemini's larger context window is the deciding factor."
      />

      <ReferenceList
        references={[
          {
            title: 'Google AI for Developers',
            url: 'https://ai.google.dev/',
            type: 'docs',
            description: 'Google AI Studio documentation and API reference.',
          },
          {
            title: 'Vertex AI Gemini API',
            url: 'https://cloud.google.com/vertex-ai/generative-ai/docs',
            type: 'docs',
            description: 'Enterprise Gemini access through Vertex AI.',
          },
          {
            title: 'NemoClaw Google Provider Guide',
            url: 'https://docs.nvidia.com/nemoclaw/providers/google',
            type: 'docs',
            description: 'Configuring Google Gemini in NemoClaw.',
          },
        ]}
      />
    </div>
  );
}
