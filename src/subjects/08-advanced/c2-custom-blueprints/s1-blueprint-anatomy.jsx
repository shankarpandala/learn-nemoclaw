import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock } from '../../../components/content'

export default function BlueprintAnatomy() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Anatomy of a NemoClaw Blueprint
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A NemoClaw blueprint is a self-contained package that defines everything needed to run
        a specific type of agent within a secure sandbox. It specifies the agent's system prompt,
        the tools it has access to, the LLM configuration, the sandbox policies (network,
        filesystem, resources), and any initialization scripts that should run when the sandbox
        starts. Blueprints are the primary unit of configuration and distribution in NemoClaw --
        when you share an agent configuration with someone, you share a blueprint.
      </p>

      <DefinitionBlock
        term="Blueprint"
        definition="A declarative configuration package for NemoClaw that defines an agent's complete runtime environment: its identity (system prompt, model), capabilities (tools, MCP servers), security boundaries (network policy, filesystem policy, resource limits), and initialization behavior. Blueprints are stored as a directory of files with a blueprint.yaml manifest at the root."
        example="A 'code-reviewer' blueprint that configures an agent with access to git tools, read-only filesystem access to /workspace, network access only to api.github.com, and a system prompt instructing it to review pull requests for security issues."
        seeAlso={['Policy', 'Sandbox Configuration', 'Agent Profile']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Blueprint Directory Structure
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A blueprint is a directory containing a set of files with defined roles. The only
        required file is blueprint.yaml -- all other files are optional and extend the
        blueprint's functionality.
      </p>

      <CodeBlock
        language="text"
        title="Blueprint directory structure"
      >{`my-agent-blueprint/
├── blueprint.yaml          # Required: main configuration manifest
├── system-prompt.md        # Optional: system prompt (can be inline in YAML)
├── policies/
│   ├── network.yaml        # Optional: network policy overrides
│   ├── filesystem.yaml     # Optional: filesystem policy overrides
│   └── resources.yaml      # Optional: resource limit overrides
├── tools/
│   ├── custom-tool.py      # Optional: custom tool definitions
│   └── tools.yaml          # Optional: tool configuration
├── scripts/
│   ├── init.sh             # Optional: runs when sandbox starts
│   └── healthcheck.sh      # Optional: periodic health checks
├── mcp/
│   └── servers.yaml        # Optional: MCP server configurations
├── tests/
│   ├── test-basic.yaml     # Optional: blueprint test cases
│   └── test-security.yaml  # Optional: security test cases
├── README.md               # Optional: human-readable documentation
└── .blueprint-lock         # Auto-generated: dependency lock file`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The blueprint.yaml Manifest
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The blueprint.yaml file is the heart of every blueprint. It contains the top-level
        configuration that NemoClaw reads when loading the blueprint. Every field has sensible
        defaults, so a minimal blueprint.yaml can be very short, while a fully specified one
        provides complete control over every aspect of the agent's environment.
      </p>

      <CodeBlock
        language="yaml"
        title="Complete blueprint.yaml reference"
      >{`# Blueprint metadata
name: "code-reviewer"
version: "1.2.0"
description: "An agent that reviews pull requests for security issues"
author: "your-org"
license: "Apache-2.0"

# LLM configuration
llm:
  provider: "openai-compatible"
  base_url: "https://integrate.api.nvidia.com/v1"
  model: "meta/llama-3.1-70b-instruct"
  api_key_env: "NVIDIA_API_KEY"    # Read API key from environment variable
  timeout: 30
  max_retries: 3

# Agent configuration
agent:
  system_prompt_file: "system-prompt.md"   # Reference to external file
  # Or inline:
  # system_prompt: "You are a code review agent..."
  max_turns: 50                    # Maximum conversation turns before stopping
  max_tool_calls_per_turn: 10     # Limit tool calls in a single turn

# Sandbox policies
policies:
  network:
    file: "policies/network.yaml"  # Reference to policy file
    # Or inline:
    # default: deny
    # allow:
    #   - host: "api.github.com"
    #     port: 443
  filesystem:
    file: "policies/filesystem.yaml"
  resources:
    file: "policies/resources.yaml"

# Tools available to the agent
tools:
  builtin:
    - shell           # Execute shell commands (within sandbox)
    - file_read       # Read files
    - file_write      # Write files
    - web_fetch       # Fetch URLs (subject to network policy)
  mcp_servers:
    - file: "mcp/servers.yaml"
  custom:
    - file: "tools/custom-tool.py"

# Initialization
init:
  scripts:
    - "scripts/init.sh"
  environment:
    REVIEW_MODE: "security"
    LOG_LEVEL: "info"

# Health checks
healthcheck:
  script: "scripts/healthcheck.sh"
  interval: 60          # seconds
  timeout: 10           # seconds

# Dependencies on other blueprints (composability)
extends: null           # Parent blueprint to inherit from
dependencies: []        # Other blueprints this one requires`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        How Blueprints Are Resolved
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When you run a NemoClaw agent with a blueprint, NemoClaw goes through a resolution
        process to find and load the blueprint. Understanding this process helps you debug
        issues when a blueprint is not loading as expected.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw searches for blueprints in the following order, stopping at the first match:
      </p>

      <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Explicit path:</span> If the blueprint argument is
          an absolute or relative filesystem path (e.g., ./my-blueprint/ or
          /home/user/blueprints/code-reviewer/), NemoClaw loads it directly from that location.
        </li>
        <li>
          <span className="font-semibold">Local blueprints directory:</span> NemoClaw checks
          ~/.nemoclaw/blueprints/{'{name}'}/blueprint.yaml for a locally installed blueprint
          matching the given name.
        </li>
        <li>
          <span className="font-semibold">Project-level blueprints:</span> If a .nemoclaw/
          directory exists in the current working directory or any parent directory, NemoClaw
          checks .nemoclaw/blueprints/{'{name}'}/blueprint.yaml.
        </li>
        <li>
          <span className="font-semibold">Built-in blueprints:</span> NemoClaw ships with a set
          of built-in blueprints (e.g., "default", "coding-agent", "research-agent"). These are
          embedded in the NemoClaw binary and used as a final fallback.
        </li>
      </ol>

      <CodeBlock
        language="bash"
        title="Blueprint resolution in practice"
      >{`# Use a blueprint by explicit path
nemoclaw run --blueprint ./my-blueprint/

# Use a blueprint by name (searches resolution chain)
nemoclaw run --blueprint code-reviewer

# List all available blueprints and their locations
nemoclaw blueprint list

# Show where a specific blueprint resolves to
nemoclaw blueprint resolve code-reviewer
# Output: /home/user/.nemoclaw/blueprints/code-reviewer/blueprint.yaml

# Show the fully resolved configuration (with all defaults applied)
nemoclaw blueprint inspect code-reviewer`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Configuration Format Details
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Blueprint configuration uses YAML with a few NemoClaw-specific conventions:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Environment variable references:</span> Any string
          value can reference an environment variable using the syntax {'"${ENV_VAR}"'} or
          by using the _env suffix on key names (e.g., api_key_env: "NVIDIA_API_KEY" reads
          the value from the NVIDIA_API_KEY environment variable).
        </li>
        <li>
          <span className="font-semibold">File references:</span> Configuration values that
          can be large (system prompts, policies) support a file: key that points to an
          external file within the blueprint directory. The file path is relative to the
          blueprint root.
        </li>
        <li>
          <span className="font-semibold">Inheritance:</span> The extends: key allows a
          blueprint to inherit from another blueprint. The child blueprint's values override
          the parent's, with deep merging for nested objects. This enables creating specialized
          variants of a base blueprint.
        </li>
        <li>
          <span className="font-semibold">Validation:</span> NemoClaw validates the blueprint
          against a JSON schema at load time. Invalid configurations produce clear error messages
          indicating which fields are incorrect. Use nemoclaw blueprint validate to check a
          blueprint without running it.
        </li>
      </ul>

      <NoteBlock type="info" title="Minimal vs. Full Blueprints">
        <p>
          A blueprint can be as simple as a single blueprint.yaml with just a name and an LLM
          configuration -- NemoClaw fills in all other values with secure defaults (deny-all
          network policy, read-only filesystem, conservative resource limits). Starting minimal
          and adding permissions as needed is the recommended approach. The default security
          posture is always restrictive; you explicitly open up only what the agent requires.
        </p>
      </NoteBlock>

      <WarningBlock title="Sensitive Data in Blueprints">
        <p>
          Never hardcode API keys, tokens, or credentials directly in blueprint files. Always
          use environment variable references (api_key_env) or external secret management.
          Blueprint files are often committed to version control or shared with others -- embedded
          secrets will be exposed. NemoClaw's blueprint validation will warn you if it detects
          values that look like hardcoded credentials.
        </p>
      </WarningBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Understanding the anatomy of a blueprint is the foundation for creating your own. In the
        next section, we walk through the process of creating a custom blueprint from scratch,
        testing it, and iterating on its configuration.
      </p>
    </div>
  )
}
