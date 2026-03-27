import { useState } from 'react';
import {
  CodeBlock,
  NoteBlock,
  DefinitionBlock,
  ComparisonTable,
  StepBlock,
  ExerciseBlock,
  ReferenceList,
} from '../../../components/content';

export default function SlashCommands() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Slash commands are one of the primary ways users interact with OpenClaw agents
        beyond natural language conversation. Inspired by the familiar slash command
        pattern in Slack and Discord, OpenClaw extends this concept with a rich system
        of built-in commands, custom commands, workflows, and skills. Slash commands
        give users deterministic control over agent behavior when precise actions are
        needed rather than freeform prompting.
      </p>

      <DefinitionBlock
        term="Slash Command"
        definition="A user-initiated directive that begins with a forward slash (/) and triggers a specific, predefined behavior in the agent. Unlike natural language messages that are interpreted by the LLM, slash commands are intercepted by the Gateway and executed directly."
        example="Typing /status in a channel sends a status command to the agent, which responds with a summary of active sessions, running tools, and recent activity."
        seeAlso={['Workflow', 'Skill', 'Hook']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Built-in Slash Commands
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw ships with a set of built-in slash commands that provide essential
        administrative and conversational controls. These commands are always available
        and cannot be overridden by custom commands.
      </p>

      <ComparisonTable
        title="Built-in Slash Commands"
        headers={['Command', 'Arguments', 'Description']}
        rows={[
          ['/help', '[command]', 'Shows help text for all commands or a specific command.'],
          ['/status', '', 'Displays agent status, active sessions, and system health.'],
          ['/clear', '', 'Clears the current session history and starts fresh.'],
          ['/compact', '', 'Manually triggers context compaction on the current session.'],
          ['/model', '[model-name]', 'Shows or changes the active LLM model for the session.'],
          ['/system', '[prompt]', 'Appends additional system prompt instructions for the session.'],
          ['/undo', '', 'Removes the last user message and agent response from the session.'],
          ['/export', '[format]', 'Exports the current session as markdown, JSON, or HTML.'],
          ['/memory', '[view|add|clear]', 'Manages the agent\'s MEMORY.md entries.'],
          ['/config', '[key] [value]', 'Views or modifies runtime configuration.'],
        ]}
      />

      <CodeBlock
        language="bash"
        title="Built-in command usage examples"
        code={`# View current model
/model

# Switch model for this session
/model claude-sonnet-4-20250514

# Add to agent memory
/memory add "Team uses Vitest, not Jest"

# Export conversation
/export markdown

# Inject temporary system instructions
/system "Focus on security implications in all code reviews"`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Custom Slash Commands
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond built-in commands, OpenClaw allows teams to define custom slash commands
        that encapsulate frequently used prompts, multi-step workflows, or specialized
        agent behaviors. Custom commands are defined in the configuration and can
        include template variables, argument parsing, and conditional logic.
      </p>

      <CodeBlock
        language="json"
        title="Custom command definitions (openclaw.json)"
        code={`{
  "commands": {
    "review": {
      "description": "Start a code review for a PR",
      "args": [
        { "name": "pr", "type": "string", "required": true, "description": "PR number or URL" }
      ],
      "prompt": "Please review pull request {{pr}}. Focus on:\\n1. Security issues\\n2. Performance concerns\\n3. Code style violations\\n4. Missing tests\\n\\nProvide a summary with severity ratings.",
      "tools": ["execute_command", "read_file", "search_files"]
    },
    "deploy-check": {
      "description": "Run pre-deployment checks",
      "prompt": "Run the following checks and report results:\\n1. npm test\\n2. npm run lint\\n3. npm run build\\n4. Check for .env files that shouldn't be committed\\n\\nReport pass/fail for each.",
      "tools": ["execute_command", "read_file", "list_directory"]
    },
    "standup": {
      "description": "Generate standup update from recent git activity",
      "prompt": "Generate a standup update based on:\\n1. Git commits from the last 24 hours\\n2. Currently open PRs by me\\n3. Any failing CI checks\\n\\nFormat as Yesterday/Today/Blockers.",
      "tools": ["execute_command"]
    }
  }
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Workflows
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Workflows extend custom commands by chaining multiple steps together with
        conditional branching. A workflow is essentially a sequence of prompts where
        each step can depend on the output of the previous step. Workflows are
        triggered via slash commands but execute as multi-turn agent interactions.
      </p>

      <CodeBlock
        language="json"
        title="Workflow definition"
        code={`{
  "workflows": {
    "new-feature": {
      "description": "Scaffold a new feature from specification",
      "args": [
        { "name": "name", "type": "string", "required": true },
        { "name": "type", "type": "string", "default": "component" }
      ],
      "steps": [
        {
          "id": "plan",
          "prompt": "Create a detailed implementation plan for a new {{type}} called '{{name}}'. List all files to create/modify.",
          "waitForApproval": true
        },
        {
          "id": "implement",
          "prompt": "Implement the plan from the previous step. Create all files and write the code.",
          "tools": ["write_file", "read_file", "execute_command"]
        },
        {
          "id": "test",
          "prompt": "Write unit tests for the {{type}} '{{name}}' you just created. Run them to verify they pass.",
          "tools": ["write_file", "execute_command"]
        },
        {
          "id": "document",
          "prompt": "Add JSDoc comments and update the README if necessary.",
          "tools": ["write_file", "read_file"]
        }
      ]
    }
  }
}`}
      />

      <NoteBlock type="info" title="Approval Gates">
        <p>
          Workflow steps can include a <code>waitForApproval</code> flag. When set,
          the agent pauses after completing the step and asks the user to confirm
          before proceeding. This is useful for destructive or irreversible operations
          like database migrations, deployments, or large-scale refactors.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The Skills System
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Skills are the most advanced form of slash command in OpenClaw. A skill is a
        reusable, shareable package that bundles a command definition, prompt templates,
        required tools, and optional supporting files (scripts, schemas, examples).
        Skills can be installed from a registry, shared across teams, and versioned
        independently of the main OpenClaw configuration.
      </p>

      <CodeBlock
        language="json"
        title="Skill manifest (skills/code-review/skill.json)"
        code={`{
  "name": "code-review",
  "version": "1.2.0",
  "description": "Comprehensive code review with security analysis",
  "author": "acme-team",
  "command": "/review",
  "args": [
    { "name": "target", "type": "string", "required": true },
    { "name": "focus", "type": "string", "default": "all" }
  ],
  "requiredTools": ["execute_command", "read_file", "search_files"],
  "promptFile": "./prompts/review.md",
  "supportFiles": ["./rules/security.yaml", "./rules/style.yaml"],
  "hooks": {
    "pre": "./hooks/fetch-diff.js",
    "post": "./hooks/post-review.js"
  }
}`}
      />

      <StepBlock
        title="Installing and Using a Skill"
        steps={[
          {
            title: 'Install the Skill',
            content:
              'Skills can be installed from a registry, a Git repository, or a local directory. The Gateway downloads the skill package and registers its command.',
            code: '# From registry\nopenclaw skill install @acme/code-review\n\n# From Git\nopenclaw skill install https://github.com/acme/openclaw-skills#code-review\n\n# From local directory\nopenclaw skill install ./skills/code-review',
          },
          {
            title: 'Verify Installation',
            content:
              'Check that the skill is registered and its command is available.',
            code: 'openclaw skill list\n# Output:\n# @acme/code-review  v1.2.0  /review  Comprehensive code review with security analysis',
          },
          {
            title: 'Use the Skill',
            content:
              'Invoke the skill command from any conversation. The Gateway loads the skill prompt, injects supporting files, and routes the interaction.',
            code: '# In Slack or the web UI:\n/review PR-1234 --focus security',
          },
        ]}
      />

      <NoteBlock type="tip" title="Skill Sharing">
        <p>
          Skills are designed to be shared across teams and organizations. A well-crafted
          skill encapsulates domain expertise into a reusable package. Teams can maintain
          private skill registries or contribute to the public OpenClaw skill ecosystem.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="What is the key difference between a custom slash command and a workflow in OpenClaw?"
        options={[
          'Custom commands are faster to execute',
          'Workflows chain multiple steps with conditional branching and approval gates',
          'Custom commands can use tools but workflows cannot',
          'Workflows are only available in Discord, not Slack',
        ]}
        correctIndex={1}
        explanation="Workflows extend custom commands by chaining multiple steps together. Each step can depend on previous step output, and steps can include approval gates where the agent pauses for user confirmation before proceeding."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Commands Reference',
            url: 'https://docs.openclaw.ai/commands',
            type: 'docs',
            description: 'Complete reference for built-in and custom slash commands.',
          },
          {
            title: 'OpenClaw Skills Guide',
            url: 'https://docs.openclaw.ai/skills',
            type: 'docs',
            description: 'How to create, share, and install skill packages.',
          },
        ]}
      />
    </div>
  );
}
