import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function AgentsMd() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When a single agent is not enough, NemoClaw supports multi-agent configurations through the
        AGENTS.md file. This file defines multiple agents within a single workspace, each with distinct
        roles, capabilities, and policies. Think of it as an org chart for your AI team -- each agent
        has a job description, a set of tools, and clear boundaries.
      </p>

      <DefinitionBlock
        term="AGENTS.md"
        definition="A structured Markdown file that defines multiple AI agents within a NemoClaw workspace. Each agent entry specifies the agent's name, role, model, policy, tools, and communication channels. NemoClaw reads this file to spin up and coordinate multiple agent instances."
        example="An AGENTS.md that defines a code-reviewer agent using Claude Opus with read-only GitHub access, a test-writer agent using Claude Sonnet with filesystem write access, and a docs-writer agent with access to the documentation directory only."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        AGENTS.md File Format
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The file uses a structured Markdown format with YAML frontmatter blocks for each agent definition.
        This keeps it human-readable while providing the structure NemoClaw needs to parse agent configurations.
      </p>

      <CodeBlock
        title="Complete AGENTS.md example"
        language="bash"
        code={`# AGENTS.md

## Agent Definitions

Each agent below runs as an independent NemoClaw instance with its
own sandbox, policy, and model configuration.

---

### reviewer

\`\`\`yaml
name: reviewer
description: Senior code reviewer for all PRs
model: claude-opus-4-20250514
policy: policies/reviewer.yaml
soul: souls/reviewer-soul.md

capabilities:
  - read_github_prs
  - post_review_comments
  - read_codebase

tools:
  allowed: [git, grep, find, cat]
  denied: [bash, curl, make]

triggers:
  - event: github.pull_request.opened
  - event: github.pull_request.synchronize
  - event: manual

communication:
  listens_to: [orchestrator]
  reports_to: [orchestrator]
  channels: [github_comments]

resources:
  max_tokens_per_session: 100000
  max_concurrent_sessions: 3
  timeout: 300s
\`\`\`

---

### test-writer

\`\`\`yaml
name: test-writer
description: Writes and maintains unit and integration tests
model: claude-sonnet-4-20250514
policy: policies/test-writer.yaml
soul: souls/test-writer-soul.md

capabilities:
  - read_codebase
  - write_test_files
  - run_tests
  - create_branches

tools:
  allowed: [git, go, make, bash, grep, find]
  denied: [curl, ssh, docker]

triggers:
  - event: reviewer.request_tests
  - event: manual
  - event: cron
    schedule: "0 2 * * *"  # Nightly test gap analysis

communication:
  listens_to: [orchestrator, reviewer]
  reports_to: [orchestrator]
  channels: [workspace_files, github_prs]

filesystem:
  writable:
    - "**/*_test.go"
    - "**/*_test.js"
    - "**/testdata/**"
  readable:
    - "**/*"

resources:
  max_tokens_per_session: 50000
  max_concurrent_sessions: 2
  timeout: 600s
\`\`\`

---

### docs-writer

\`\`\`yaml
name: docs-writer
description: Maintains API documentation and code comments
model: claude-sonnet-4-20250514
policy: policies/docs-writer.yaml
soul: souls/docs-writer-soul.md

capabilities:
  - read_codebase
  - write_documentation
  - read_github_issues

tools:
  allowed: [git, grep, find, cat]
  denied: [bash, curl, make, go]

triggers:
  - event: reviewer.request_docs
  - event: github.issue.labeled
    label: documentation
  - event: manual

communication:
  listens_to: [orchestrator, reviewer]
  reports_to: [orchestrator]
  channels: [workspace_files, github_prs]

filesystem:
  writable:
    - "docs/**"
    - "**/README.md"
    - "**/*.md"
  readable:
    - "**/*"

resources:
  max_tokens_per_session: 30000
  max_concurrent_sessions: 1
  timeout: 300s
\`\`\`

---

### orchestrator

\`\`\`yaml
name: orchestrator
description: Coordinates work between agents and handles user requests
model: claude-sonnet-4-20250514
policy: policies/orchestrator.yaml
soul: souls/orchestrator-soul.md

capabilities:
  - dispatch_tasks
  - monitor_agents
  - report_status

tools:
  allowed: [git, grep, find]
  denied: [bash, curl, make, go]

triggers:
  - event: telegram.message
  - event: github.issue.opened
  - event: manual

communication:
  listens_to: [reviewer, test-writer, docs-writer]
  reports_to: [user]
  channels: [telegram, github_issues]

resources:
  max_tokens_per_session: 20000
  max_concurrent_sessions: 5
  timeout: 120s
\`\`\``}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Key Configuration Fields
      </h2>

      <ComparisonTable
        title="AGENTS.md Field Reference"
        headers={['Field', 'Required', 'Description']}
        rows={[
          ['name', 'Yes', 'Unique identifier for the agent, used in inter-agent communication'],
          ['model', 'Yes', 'The inference model to use (determines quality/cost tradeoff)'],
          ['policy', 'Yes', 'Path to the agent-specific policy file'],
          ['soul', 'No', 'Path to the agent-specific SOUL.md personality file'],
          ['capabilities', 'No', 'Human-readable list of what the agent can do'],
          ['tools', 'Yes', 'Allowed and denied tools for the agent sandbox'],
          ['triggers', 'Yes', 'Events that activate the agent'],
          ['communication', 'Yes', 'Which agents it listens to and reports to'],
          ['filesystem', 'No', 'Override policy filesystem rules'],
          ['resources', 'No', 'Token limits, concurrency, and timeout settings'],
        ]}
      />

      <NoteBlock type="info" title="Policy Inheritance">
        <p>
          Each agent has its own policy file, but you can use YAML anchors or NemoClaw's policy
          inheritance feature to share common rules. For example, all agents might share a base
          policy that allows access to the inference provider, and each agent's policy extends
          that base with its specific permissions.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Validating AGENTS.md
      </h2>

      <CodeBlock
        title="Validation and status commands"
        language="bash"
        code={`# Validate the AGENTS.md file
openclaw agents validate

# Output:
# Agents defined: 4 (reviewer, test-writer, docs-writer, orchestrator)
# Policies found: 4/4
# Soul files found: 4/4
# Communication graph: valid (no orphan agents)
# Trigger conflicts: none
# Resource totals:
#   Max concurrent sessions: 11
#   Max tokens/session (sum): 200,000

# Start all agents
openclaw agents start --all

# Check status
openclaw agents status
# NAME           STATUS   MODEL           SESSIONS  UPTIME
# reviewer       running  claude-opus     1/3       2h 15m
# test-writer    idle     claude-sonnet   0/2       2h 15m
# docs-writer    idle     claude-sonnet   0/1       2h 15m
# orchestrator   running  claude-sonnet   2/5       2h 15m`}
      />

      <StepBlock
        title="Creating Your First AGENTS.md"
        steps={[
          {
            title: 'Start with two agents',
            content: 'Do not build a complex multi-agent setup from scratch. Start with an orchestrator and one specialist agent.',
          },
          {
            title: 'Define clear boundaries',
            content: 'Each agent should have non-overlapping filesystem write permissions. If two agents can write to the same file, you risk conflicts.',
          },
          {
            title: 'Test agents individually first',
            content: 'Run each agent in isolation to verify its policy and behavior before enabling inter-agent communication.',
            code: `# Test a single agent
openclaw agents start reviewer --solo`,
            language: 'bash',
          },
          {
            title: 'Enable communication gradually',
            content: 'Start with one-way communication (orchestrator dispatches to specialists) before enabling peer-to-peer communication between agents.',
          },
        ]}
      />

      <ExerciseBlock
        question="In an AGENTS.md file, the test-writer agent has 'writable: [**/*_test.go]' in its filesystem config, and the docs-writer has 'writable: [**/*.md]'. A file named 'testing_guide.md' exists in the docs directory. Which agent can modify it?"
        options={[
          'test-writer, because it has the word testing in the filename',
          'docs-writer, because *.md matches the file extension',
          'Both agents can modify it',
          'Neither agent can modify it because the filename is ambiguous',
        ]}
        correctIndex={1}
        explanation="Filesystem permissions match on glob patterns, not semantic content. The pattern **/*.md matches any file ending in .md, so docs-writer can write to testing_guide.md. The pattern **/*_test.go only matches files ending in _test.go, so test-writer cannot modify it. Glob matching is purely structural."
      />

      <ReferenceList
        references={[
          {
            title: 'AGENTS.md Specification',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/agents-md.md',
            type: 'docs',
            description: 'Complete specification for the AGENTS.md file format.',
          },
          {
            title: 'Multi-Agent Architecture Guide',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/multi-agent.md',
            type: 'github',
            description: 'Design patterns and best practices for multi-agent NemoClaw deployments.',
          },
        ]}
      />
    </div>
  )
}
