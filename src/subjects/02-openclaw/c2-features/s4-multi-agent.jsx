import { useState } from 'react';
import {
  CodeBlock,
  NoteBlock,
  DefinitionBlock,
  ComparisonTable,
  WarningBlock,
  StepBlock,
  ExerciseBlock,
  ReferenceList,
} from '../../../components/content';

export default function MultiAgent() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        As teams scale their use of AI agents, a single agent with a single
        persona and toolset quickly becomes a bottleneck. Different tasks
        require different expertise: a code review agent needs deep knowledge
        of linting rules and style guides, while a DevOps agent needs access
        to infrastructure tools and deployment pipelines. OpenClaw's multi-agent
        system allows operators to define multiple specialized agents within a
        single Gateway deployment, each with its own identity, tools, and
        routing rules.
      </p>

      <DefinitionBlock
        term="Multi-Agent Coordination"
        definition="The ability to run multiple distinct AI agents within a single OpenClaw Gateway instance, each with its own system prompt, tool configuration, workspace, and routing rules. Agents are defined in AGENTS.md workspace files or in the central configuration."
        example="A team runs three agents: @coder for implementation tasks, @reviewer for code reviews, and @ops for deployment and infrastructure. Messages mentioning @reviewer in Slack are routed to the review agent, which has read-only filesystem access and a specialized review prompt."
        seeAlso={['AGENTS.md', 'Routing Rule', 'Workspace']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Defining Agents with AGENTS.md
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The primary way to define multiple agents is through the
        <code> AGENTS.md</code> workspace file. This Markdown file lives in
        the project root (or in the <code>.openclaw/</code> directory) and
        describes each agent using a structured format. The Gateway parses
        this file at startup and registers each agent with its configuration.
      </p>

      <CodeBlock
        language="markdown"
        title="AGENTS.md - Multi-agent definitions"
        code={`# Agents

## @coder

**Role:** Implementation Agent
**Model:** claude-sonnet-4-20250514
**Description:** Handles feature implementation, bug fixes, and refactoring tasks.

### System Prompt
You are a senior software engineer. Write clean, well-tested code following
the team's style guide. Always include unit tests for new functionality.

### Tools
- execute_command
- read_file
- write_file
- search_files
- list_directory

### Workspace
Path: ./workspaces/coder
Isolation: full

---

## @reviewer

**Role:** Code Review Agent
**Model:** claude-sonnet-4-20250514
**Description:** Reviews pull requests and provides detailed feedback.

### System Prompt
You are a meticulous code reviewer. Focus on security vulnerabilities,
performance issues, and maintainability. Never approve code with known issues.

### Tools
- read_file
- search_files
- execute_command (read-only: git diff, git log, npm test)

### Workspace
Path: ./workspaces/reviewer
Isolation: read-only

---

## @ops

**Role:** DevOps Agent
**Model:** claude-sonnet-4-20250514
**Description:** Manages deployments, monitors infrastructure, and handles incidents.

### System Prompt
You are a DevOps engineer. Prioritize safety in all operations. Always
confirm destructive actions with the user before executing.

### Tools
- execute_command
- read_file
- search_files

### Workspace
Path: ./workspaces/ops
Isolation: full`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Routing Rules
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When multiple agents are defined, the Gateway needs to know which agent
        should handle each incoming message. Routing rules determine how
        messages are dispatched to agents. OpenClaw supports several routing
        strategies that can be combined.
      </p>

      <ComparisonTable
        title="Routing Strategies"
        headers={['Strategy', 'How It Works', 'Configuration']}
        rows={[
          [
            'Mention-based',
            'Messages mentioning @agentname are routed to that agent. This is the default strategy.',
            '"routing": { "strategy": "mention" }',
          ],
          [
            'Channel-based',
            'Each agent is assigned to specific channels. All messages in #code-review go to @reviewer.',
            '"routing": { "strategy": "channel", "map": { "#code-review": "@reviewer" } }',
          ],
          [
            'Keyword-based',
            'Messages containing specific keywords are routed to the matching agent.',
            '"routing": { "strategy": "keyword", "rules": [{ "match": "deploy|release", "agent": "@ops" }] }',
          ],
          [
            'LLM-based',
            'A lightweight LLM call classifies the message intent and routes to the best agent.',
            '"routing": { "strategy": "llm", "classifier": "claude-haiku" }',
          ],
          [
            'Default fallback',
            'Messages that match no routing rule are sent to the designated default agent.',
            '"routing": { "default": "@coder" }',
          ],
        ]}
      />

      <CodeBlock
        language="json"
        title="Routing configuration (openclaw.json)"
        code={`{
  "agents": {
    "source": "./AGENTS.md",
    "routing": {
      "strategy": "mention",
      "fallback": "channel",
      "channelMap": {
        "C04REVIEW_CH": "@reviewer",
        "C05DEPLOY_CH": "@ops",
        "C06GENERAL":   "@coder"
      },
      "default": "@coder"
    }
  }
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Isolated Workspaces Per Agent
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Each agent can be assigned an isolated workspace directory. Workspace
        isolation ensures that one agent's file operations do not interfere
        with another. The isolation level can be configured as <code>full</code>
        (agent can only access its own workspace), <code>read-only</code>
        (agent can read the project root but only write to its workspace), or
        <code>shared</code> (agent shares the project root with all other agents).
      </p>

      <CodeBlock
        language="json"
        title="Workspace isolation settings"
        code={`{
  "agents": {
    "@coder": {
      "workspace": {
        "path": "./workspaces/coder",
        "isolation": "full",
        "syncFromRoot": ["package.json", "tsconfig.json", ".eslintrc"],
        "maxDiskUsage": "500MB"
      }
    },
    "@reviewer": {
      "workspace": {
        "path": "./workspaces/reviewer",
        "isolation": "read-only",
        "allowedReadPaths": ["./src/**", "./tests/**", "./package.json"],
        "blockedPaths": [".env", ".env.*", "secrets/**"]
      }
    }
  }
}`}
      />

      <NoteBlock type="info" title="Workspace Sync">
        <p>
          When using <code>full</code> isolation, agents work in a separate
          directory and cannot see the main project tree. The
          <code> syncFromRoot</code> option copies specified files from the project
          root into the agent's workspace at session start. This is useful for
          sharing configuration files without giving the agent access to the
          entire codebase.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Inter-Agent Message Routing
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Agents can communicate with each other through a built-in message
        passing system. This allows workflows where one agent delegates
        subtasks to another. For example, the <code>@coder</code> agent might
        implement a feature and then send the result to <code>@reviewer</code>
        for a code review before presenting the final output to the user.
      </p>

      <CodeBlock
        language="json"
        title="Inter-agent communication configuration"
        code={`{
  "agents": {
    "interAgentComm": {
      "enabled": true,
      "allowedRoutes": [
        { "from": "@coder",    "to": "@reviewer", "purpose": "code-review" },
        { "from": "@reviewer",  "to": "@coder",    "purpose": "revision-request" },
        { "from": "@ops",       "to": "@coder",    "purpose": "hotfix-request" }
      ],
      "maxDepth": 3,
      "timeout": "5m"
    }
  }
}`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code>maxDepth</code> setting prevents infinite delegation loops
        where agents continuously forward tasks to each other. The
        <code> allowedRoutes</code> list restricts which agents can talk to which,
        preventing unintended communication patterns. Each inter-agent message
        includes the originating agent, the purpose tag, and the conversation
        context, allowing the receiving agent to understand the request
        without additional prompting.
      </p>

      <NoteBlock type="tip" title="Agent Handoff in Chat">
        <p>
          Users can also trigger explicit handoffs by mentioning a different
          agent mid-conversation. For example, after discussing a feature with
          <code>@coder</code>, the user can say <em>"@reviewer please review
          what @coder just implemented"</em>. The Gateway transfers the
          relevant context to the review agent's session.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="In a multi-agent setup, what is the primary purpose of workspace isolation?"
        options={[
          'To reduce memory usage by limiting each agent\'s context window',
          'To prevent one agent\'s file operations from interfering with another agent\'s workspace',
          'To speed up tool execution by reducing the file tree each agent scans',
          'To ensure each agent uses a different LLM model',
        ]}
        correctIndex={1}
        explanation="Workspace isolation ensures that agents operate in separate directories so that one agent writing files does not corrupt or interfere with another agent's state. This is especially important when agents like @coder (full write access) and @reviewer (read-only) have different permission levels."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Multi-Agent Guide',
            url: 'https://docs.openclaw.ai/multi-agent',
            type: 'docs',
            description: 'Complete guide to configuring and managing multi-agent deployments.',
          },
          {
            title: 'AGENTS.md Specification',
            url: 'https://docs.openclaw.ai/agents-md',
            type: 'docs',
            description: 'Reference for the AGENTS.md file format and all supported fields.',
          },
        ]}
      />
    </div>
  );
}
