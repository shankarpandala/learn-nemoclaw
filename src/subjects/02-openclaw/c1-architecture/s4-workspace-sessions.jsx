import { useState } from 'react';
import {
  CodeBlock,
  NoteBlock,
  DefinitionBlock,
  ComparisonTable,
  ArchitectureDiagram,
  StepBlock,
  ExerciseBlock,
  ReferenceList,
} from '../../../components/content';

export default function WorkspaceSessions() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw organizes agent interactions around two key concepts:
        <strong> workspaces</strong> and <strong>sessions</strong>. A workspace defines
        the environment in which an agent operates, including its working directory,
        configuration files, and persistent memory. A session represents a single
        conversation thread within that workspace. Together, they control how context
        is isolated, shared, and persisted across interactions.
      </p>

      <DefinitionBlock
        term="Workspace"
        definition="A directory on the host filesystem that serves as the root context for an agent. It contains project files, configuration, and special markdown files (SOUL.md, USER.md, IDENTITY.md, MEMORY.md) that shape the agent's behavior and memory."
        example="A workspace at /home/user/projects/webapp would give the agent access to the webapp source code, its SOUL.md persona file, and any accumulated MEMORY.md entries."
        seeAlso={['Session', 'SOUL.md', 'MEMORY.md']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The Workspace Model
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Each OpenClaw agent is bound to a workspace directory. This directory is the
        agent's home base: it determines the working directory for command execution,
        the scope of file operations, and the location of configuration files. When
        multiple agents are configured, each can have its own workspace, providing
        natural isolation between different projects or responsibilities.
      </p>

      <CodeBlock
        language="json"
        title="Workspace configuration in openclaw.json"
        code={`{
  "agents": {
    "frontend-dev": {
      "workspace": "/home/user/projects/webapp-frontend",
      "model": "claude-sonnet-4-20250514"
    },
    "backend-dev": {
      "workspace": "/home/user/projects/webapp-backend",
      "model": "claude-sonnet-4-20250514"
    },
    "docs-writer": {
      "workspace": "/home/user/projects/documentation",
      "model": "claude-sonnet-4-20250514"
    }
  }
}`}
      />

      <NoteBlock type="info" title="Workspace vs. Filesystem Access">
        <p>
          While the workspace defines the agent's primary working directory, it does
          <strong> not</strong> restrict filesystem access. An agent with the
          <code> exec</code> or <code>file_io</code> extension can still read and write
          files anywhere on the host filesystem. The workspace is an organizational
          concept, not a security boundary. True filesystem restrictions require
          NemoClaw's sandboxing.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Session Scoping Strategies
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Session scoping determines how conversations are isolated between users and
        channels. OpenClaw supports three scoping strategies, each serving different
        collaboration patterns.
      </p>

      <ComparisonTable
        title="Session Scoping Strategies"
        headers={['Strategy', 'Session Key', 'Best For']}
        highlightDiffs
        rows={[
          [
            'per-peer',
            'userId',
            'Each user gets their own private session regardless of which channel they use. Great for personal assistant use cases.',
          ],
          [
            'per-channel-peer',
            'channelId + userId',
            'Each user gets a separate session in each channel. Allows context to vary by project channel while keeping conversations private.',
          ],
          [
            'shared-main',
            'channelId (single session)',
            'All users in a channel share one session. The agent sees the full conversation history from all participants. Useful for team collaboration.',
          ],
        ]}
      />

      <CodeBlock
        language="json"
        title="Session scoping configuration"
        code={`{
  "agents": {
    "default": {
      "sessionScoping": "per-channel-peer",

      // Alternative: use shared sessions for specific channels
      "sessionOverrides": {
        "#team-standup": "shared-main",
        "#incident-response": "shared-main"
      }
    }
  }
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Session Persistence
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        By default, sessions are stored in memory and lost when the Gateway restarts.
        OpenClaw supports session persistence through file-based storage within the
        workspace directory. Persisted sessions are stored as JSON files in a
        <code> .openclaw/sessions/</code> directory within the workspace.
      </p>

      <CodeBlock
        language="bash"
        title="Session storage directory structure"
        code={`workspace/
  .openclaw/
    sessions/
      sess_U04ABC_C01XYZ.json     # per-channel-peer session
      sess_U04ABC.json             # per-peer session
      sess_main_C01XYZ.json        # shared-main session
    config.json                    # workspace-level overrides
  SOUL.md                          # agent persona
  USER.md                          # user-specific context
  IDENTITY.md                      # agent identity
  MEMORY.md                        # accumulated knowledge
  src/
    ...project files...`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Each session file contains the full conversation history, tool call records,
        metadata (creation time, last active time, message count), and any
        session-level variables. When the Gateway starts and a user sends a message,
        it loads the corresponding session file and resumes the conversation with
        full context.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Special Markdown Files
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw uses a set of conventional markdown files in the workspace root to
        provide persistent context to the agent. These files are read at the start
        of each conversation turn and injected into the system prompt, giving the
        agent awareness of its role, the project, the user, and accumulated knowledge.
      </p>

      <ComparisonTable
        title="Workspace Markdown Files"
        headers={['File', 'Purpose', 'Loaded When']}
        rows={[
          [
            'SOUL.md',
            'Defines the agent\'s core persona, communication style, expertise areas, and behavioral guidelines. This is the agent\'s "character sheet."',
            'Every conversation turn',
          ],
          [
            'IDENTITY.md',
            'Specifies the agent\'s name, role title, and team affiliation. Used for introduction messages and thread headers.',
            'Session initialization',
          ],
          [
            'USER.md',
            'Contains per-user preferences and context. Can be templated with user-specific variables. Helps the agent tailor responses.',
            'Every conversation turn',
          ],
          [
            'MEMORY.md',
            'Accumulated knowledge that the agent has learned over time. Can be updated by the agent itself or by hooks. Acts as long-term memory.',
            'Every conversation turn',
          ],
        ]}
      />

      <CodeBlock
        language="bash"
        title="Example SOUL.md"
        code={`# Agent Persona

You are a senior full-stack developer working on the Acme webapp project.

## Expertise
- React, TypeScript, Node.js
- PostgreSQL, Redis
- AWS infrastructure (CDK)

## Communication Style
- Be concise and technical
- Provide code examples when explaining concepts
- Always consider edge cases and error handling
- Suggest tests for any code changes

## Project Context
- Monorepo using Turborepo
- Frontend: Next.js 14 with App Router
- Backend: Express.js with TypeORM
- CI/CD: GitHub Actions -> AWS ECS

## Guardrails
- Never modify database migration files without explicit confirmation
- Always run tests before suggesting a PR
- Flag any changes to authentication or authorization code`}
      />

      <CodeBlock
        language="bash"
        title="Example MEMORY.md"
        code={`# Agent Memory

## Learned Conventions
- The team prefers named exports over default exports
- Error responses use the \`ApiError\` class from \`src/lib/errors.ts\`
- All API routes require the \`authMiddleware\` wrapper

## Recent Decisions
- 2024-03-15: Migrated from Jest to Vitest for faster test execution
- 2024-03-10: Adopted Zod for runtime schema validation
- 2024-03-08: Switched from REST to tRPC for internal APIs

## Known Issues
- The \`user.avatar\` field can be null for SSO users (handle gracefully)
- Rate limiter config is split between Redis and in-memory (tech debt)`}
      />

      <NoteBlock type="tip" title="MEMORY.md Auto-Updates">
        <p>
          OpenClaw can be configured to let the agent append to MEMORY.md
          automatically. When enabled, the agent uses the <code>write_file</code> tool
          to add new entries when it learns something important. You can also use
          post-conversation hooks to prompt the agent to update its memory after
          each session.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Session Lifecycle
      </h3>

      <StepBlock
        title="Session Lifecycle Stages"
        steps={[
          {
            title: 'Session Creation',
            content:
              'When a message arrives and no matching session exists, the Gateway creates a new one. It loads SOUL.md, IDENTITY.md, and USER.md from the workspace to construct the initial system prompt.',
          },
          {
            title: 'Active Conversation',
            content:
              'Messages accumulate in the session. Each turn includes the user message, any tool calls and results, and the assistant response. The session is periodically saved to disk if persistence is enabled.',
          },
          {
            title: 'Context Compaction',
            content:
              'When the session exceeds the configured token limit, the Gateway compacts older messages by summarizing them. The summary replaces the detailed history, freeing token budget for new messages.',
          },
          {
            title: 'Session Expiry',
            content:
              'Sessions that have been inactive beyond the configured TTL (time-to-live) are archived or deleted. The default TTL is 24 hours for active sessions and 7 days for persisted sessions.',
          },
        ]}
      />

      <ExerciseBlock
        question="In the per-channel-peer scoping strategy, what determines the session key?"
        options={[
          'Only the user ID',
          'Only the channel ID',
          'The combination of channel ID and user ID',
          'A randomly generated UUID',
        ]}
        correctIndex={2}
        explanation="Per-channel-peer scoping derives the session key from both the channel ID and the user ID, giving each user a separate session in each channel. This allows context to vary by project channel while keeping conversations private between users."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Workspace Configuration',
            url: 'https://docs.openclaw.ai/workspaces',
            type: 'docs',
            description: 'Complete guide to workspace setup and markdown file conventions.',
          },
          {
            title: 'Session Management Deep Dive',
            url: 'https://docs.openclaw.ai/sessions',
            type: 'docs',
            description: 'Scoping strategies, persistence, compaction, and session lifecycle.',
          },
        ]}
      />
    </div>
  );
}
