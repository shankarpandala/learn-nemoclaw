import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, ArchitectureDiagram, ReferenceList } from '../../../components/content';

export default function TwoComponentDesign() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        The Two-Component Design
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw is not a single monolithic binary. It is deliberately split into two
        independent components that communicate over IPC: a <strong>TypeScript Plugin</strong> that
        lives inside OpenClaw, and a <strong>Python Blueprint</strong> that manages everything
        outside the editor. Understanding why this separation exists -- and what each half
        is responsible for -- is fundamental to working with NemoClaw effectively.
      </p>

      <ArchitectureDiagram
        title="NemoClaw Two-Component Architecture"
        components={[
          { name: 'OpenClaw Editor', description: 'IDE / code editor', color: 'blue' },
          { name: 'TypeScript Plugin', description: 'Thin integration layer', color: 'green' },
          { name: 'Python Blueprint', description: 'Versioned orchestration engine', color: 'purple' },
          { name: 'OpenShell Sandbox', description: 'Isolated execution environment', color: 'orange' },
          { name: 'Inference Provider', description: 'LLM endpoint (NVIDIA, OpenAI, etc.)', color: 'red' },
        ]}
        connections={[
          { from: 'OpenClaw Editor', to: 'TypeScript Plugin', label: 'extension host' },
          { from: 'TypeScript Plugin', to: 'Python Blueprint', label: 'IPC (JSON-RPC)' },
          { from: 'Python Blueprint', to: 'OpenShell Sandbox', label: 'lifecycle mgmt' },
          { from: 'Python Blueprint', to: 'Inference Provider', label: 'credential-bearing requests' },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        The TypeScript Plugin
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The TypeScript plugin is intentionally <em>thin</em>. It runs inside the OpenClaw
        extension host process and does exactly two things:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Registers an inference provider</strong> -- this is how OpenClaw learns that
          NemoClaw can route LLM requests. When a user or agent asks for a completion,
          OpenClaw calls the registered provider, and the plugin forwards the request to the
          blueprint over IPC.
        </li>
        <li>
          <strong>Adds the <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">/nemoclaw</code> slash command</strong> -- this gives users a direct way
          to interact with NemoClaw from the editor command palette. Commands like
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">/nemoclaw status</code> and
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">/nemoclaw apply</code> are
          dispatched through the plugin to the blueprint.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The plugin does <em>not</em> manage sandboxes, parse policies, verify blueprint
        digests, or hold API credentials. It is a pass-through layer. This deliberate
        thinness is a design philosophy covered in depth in a later section.
      </p>

      <CodeBlock
        title="Plugin registration (simplified)"
        language="javascript"
        code={`// Inside the OpenClaw extension host
export function activate(context) {
  // 1. Register the inference provider
  const provider = new NemoClawInferenceProvider();
  context.subscriptions.push(
    openclaw.lm.registerChatModelProvider('nemoclaw', provider)
  );

  // 2. Register the /nemoclaw slash command
  context.subscriptions.push(
    openclaw.commands.registerCommand('nemoclaw.slash', handleSlashCommand)
  );
}`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        The Python Blueprint
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The Python blueprint is the brain of NemoClaw. It is a versioned, independently
        released package that handles all of the heavy lifting:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Sandbox orchestration</strong> -- creating, configuring, and tearing down
          OpenShell sandboxes according to the user's policy files.
        </li>
        <li>
          <strong>Policy enforcement</strong> -- reading YAML policy definitions, computing
          the desired state, and applying Landlock, seccomp, and network namespace rules.
        </li>
        <li>
          <strong>Inference routing</strong> -- receiving inference requests from the plugin,
          attaching the appropriate host-side credentials, and forwarding them to the
          configured LLM endpoint (NVIDIA, OpenAI, Anthropic, local, etc.).
        </li>
        <li>
          <strong>Digest verification</strong> -- ensuring its own integrity by checking
          cryptographic digests before execution, preventing supply-chain tampering.
        </li>
        <li>
          <strong>Health reporting</strong> -- exposing status information about sandbox
          health, policy compliance, and inference connectivity.
        </li>
      </ul>

      <DefinitionBlock
        term="Blueprint"
        definition="In NemoClaw, a blueprint is the versioned Python package that contains all orchestration logic. It is the authoritative source of truth for how sandboxes are configured and how policies are enforced. Blueprints are immutable once released and are verified by cryptographic digest before use."
        example="nemoclaw-blueprint v0.8.2 -- contains the logic for Landlock rule generation, seccomp filter compilation, and inference routing for all supported providers."
        seeAlso={['Digest Verification', 'Immutable Release', 'Supply Chain Safety']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Why This Split?
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The two-component split is not an accident of implementation -- it is a deliberate
        architectural decision driven by two requirements: <strong>independent evolution</strong> and
        <strong>supply chain safety</strong>.
      </p>

      <ComparisonTable
        title="Plugin vs. Blueprint Responsibilities"
        headers={['Concern', 'TypeScript Plugin', 'Python Blueprint']}
        rows={[
          ['Release cadence', 'Rare (editor API changes only)', 'Frequent (new features, providers, policies)'],
          ['Language', 'TypeScript', 'Python'],
          ['Runs inside', 'OpenClaw extension host', 'Standalone process on host'],
          ['Has credentials', 'No', 'Yes (host-side only)'],
          ['Manages sandbox', 'No', 'Yes'],
          ['Verified by digest', 'No (standard extension signing)', 'Yes (cryptographic digest)'],
          ['Size', '~200 lines', '~15,000+ lines'],
        ]}
        highlightDiffs
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Independent Evolution
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw's extension API changes infrequently. When it does, only the thin plugin
        needs to be updated. Meanwhile, the blueprint -- which contains all the complex
        orchestration logic -- can release new versions on its own cadence without requiring
        a new extension release, an OpenClaw restart, or marketplace review. This means
        security patches, new inference provider support, and policy improvements can ship
        in hours rather than days.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Supply Chain Safety
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When an autonomous agent is running inside a sandbox, the integrity of the
        orchestration layer is critical. If an attacker could tamper with the blueprint,
        they could weaken sandbox policies, exfiltrate credentials, or redirect inference
        requests. By keeping the blueprint as a standalone, digest-verified artifact, NemoClaw
        ensures that the orchestration logic can be independently audited and cryptographically
        verified before every use.
      </p>

      <NoteBlock type="important" title="Security Boundary">
        The plugin runs inside OpenClaw's extension host, which is a relatively
        trusted environment. The blueprint runs on the host but manages an untrusted
        sandbox. This boundary is critical: credentials live on the host side (in the
        blueprint), never inside the sandbox. The two-component design enforces this
        boundary at the architecture level, not just by convention.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Communication: IPC via JSON-RPC
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The plugin and blueprint communicate over a local IPC channel using JSON-RPC.
        The plugin sends structured requests (inference completions, status queries,
        apply commands) and receives structured responses. This protocol is intentionally
        simple and stateless from the plugin's perspective -- all state lives in the
        blueprint process.
      </p>

      <CodeBlock
        title="Example JSON-RPC message flow"
        language="json"
        code={`// Plugin -> Blueprint (request)
{
  "jsonrpc": "2.0",
  "method": "inference.complete",
  "params": {
    "model": "nvidia/nemotron-3-super-120b",
    "messages": [
      { "role": "user", "content": "Explain Landlock LSM" }
    ]
  },
  "id": 42
}

// Blueprint -> Plugin (response)
{
  "jsonrpc": "2.0",
  "result": {
    "content": "Landlock is a Linux Security Module...",
    "usage": { "prompt_tokens": 12, "completion_tokens": 87 }
  },
  "id": 42
}`}
      />

      <NoteBlock type="tip" title="Mental Model">
        Think of the TypeScript plugin as a remote control and the Python blueprint as
        the appliance. The remote control has buttons (slash commands, provider
        registration) but no logic of its own. The appliance does all the real work and
        can be upgraded independently of the remote.
      </NoteBlock>

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Architecture Overview',
            url: 'https://docs.nvidia.com/nemoclaw/architecture',
            type: 'docs',
            description: 'Official documentation on the two-component design and IPC protocol.',
          },
          {
            title: 'NemoClaw GitHub Repository',
            url: 'https://github.com/NVIDIA/NemoClaw',
            type: 'github',
            description: 'Source code for both the TypeScript plugin and Python blueprint.',
          },
        ]}
      />
    </div>
  );
}
