import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function WorkspaceConfig() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw workspace configuration files are the DNA of your agent. They define who the agent is,
        how it behaves, what it knows about you, and what it remembers between sessions. These Markdown
        files live in your workspace root and are loaded automatically when the agent starts.
        Understanding and customizing each one is key to building an assistant that truly fits your workflow.
      </p>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        SOUL.md -- Agent Personality
      </h2>

      <DefinitionBlock
        term="SOUL.md"
        definition="The personality and behavioral instruction file for your NemoClaw agent. It defines the agent's communication style, tone, values, and high-level behavioral guidelines. Think of it as the agent's character sheet."
        example="A SOUL.md that instructs the agent to be concise, prefer functional programming patterns, and always explain trade-offs when suggesting architectural decisions."
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The SOUL.md file is the most creative and impactful configuration file. It shapes every interaction
        you have with your agent. A well-crafted SOUL.md transforms a generic AI into a teammate that
        matches your working style.
      </p>

      <CodeBlock
        title="Example SOUL.md"
        language="bash"
        code={`# SOUL.md

## Identity
You are a senior backend engineer assistant specializing in Go and Rust.
You have deep experience with distributed systems, databases, and API design.

## Communication Style
- Be direct and concise. Skip pleasantries.
- When I ask a question, lead with the answer, then explain.
- Use bullet points for lists of options or steps.
- Default to showing code rather than describing it.

## Technical Preferences
- Prefer composition over inheritance.
- Favor explicit error handling over exceptions.
- Always consider performance implications.
- When suggesting libraries, prefer well-maintained options with few dependencies.

## Code Review Behavior
- Focus on correctness first, then performance, then style.
- Flag potential race conditions and memory leaks.
- Suggest tests for any non-trivial logic.
- Do not nitpick formatting if a formatter is configured.

## What NOT To Do
- Do not apologize for mistakes. Just correct them.
- Do not add comments that merely restate the code.
- Do not suggest changes purely for stylistic reasons unless asked.`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        IDENTITY.md -- Agent Role Definition
      </h2>

      <DefinitionBlock
        term="IDENTITY.md"
        definition="Defines the agent's role, capabilities, and boundaries within a specific project or organization. While SOUL.md is about personality, IDENTITY.md is about scope and authority -- what the agent is responsible for and what it should defer to humans."
        example="An IDENTITY.md that designates the agent as the CI/CD pipeline maintainer with authority to modify GitHub Actions workflows but not production infrastructure."
      />

      <CodeBlock
        title="Example IDENTITY.md"
        language="bash"
        code={`# IDENTITY.md

## Role
Primary development assistant for the backend-api project.

## Responsibilities
- Code review for all PRs targeting the main branch
- Writing and maintaining unit and integration tests
- Monitoring CI pipeline health and fixing flaky tests
- Documenting API endpoints and data models

## Boundaries
- Do NOT merge PRs without human approval
- Do NOT modify database migration files without explicit request
- Do NOT access production databases or services
- Escalate security-related findings to @security-team

## Project Context
- Repository: github.com/acme-corp/backend-api
- Language: Go 1.22
- Database: PostgreSQL 16
- Deployment: Kubernetes on AWS EKS
- CI: GitHub Actions`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        USER.md -- User Preferences
      </h2>

      <DefinitionBlock
        term="USER.md"
        definition="A file that tells the agent about you: your experience level, preferred tools, working hours, communication preferences, and any personal context that helps the agent tailor its responses."
        example="A USER.md specifying that you are an experienced developer who prefers Vim keybindings, works in PST timezone, and wants terse explanations."
      />

      <CodeBlock
        title="Example USER.md"
        language="bash"
        code={`# USER.md

## About Me
- Name: Alex Chen
- Role: Staff Engineer, Platform Team
- Experience: 12 years, mostly backend and infrastructure
- Timezone: US/Pacific (PST/PDT)
- Working hours: 9am-6pm PT, occasionally evenings

## Editor & Tools
- Editor: Neovim with LazyVim config
- Terminal: Kitty + tmux
- Shell: zsh with starship prompt
- Git workflow: trunk-based development, squash merges

## Communication Preferences
- I prefer terse, technical responses
- Skip explanations of basic concepts (I know what a mutex is)
- When I say "LGTM" on a review, proceed without further confirmation
- If I send a single word like "tests" or "lint", run the relevant command

## Context Shortcuts
- "ship it" = commit, push, and open a PR
- "nuke it" = discard all uncommitted changes
- "bench" = run the benchmark suite and compare with main`}
      />

      <NoteBlock type="tip" title="Context Shortcuts Save Time">
        <p>
          Defining personal shortcuts in USER.md is one of the most productivity-boosting
          customizations. The agent learns to interpret your shorthand, turning two-word
          commands into multi-step workflows.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        MEMORY.md -- Persistent Memory
      </h2>

      <DefinitionBlock
        term="MEMORY.md"
        definition="A structured file where the agent stores and retrieves persistent information across sessions. Unlike chat history which may be truncated, MEMORY.md provides durable storage for project decisions, learned preferences, and ongoing context."
        example="MEMORY.md tracking that a migration to gRPC was decided in sprint 14, the team uses Buf for protobuf management, and the CI flake rate spiked after upgrading to Go 1.22."
      />

      <CodeBlock
        title="Example MEMORY.md"
        language="bash"
        code={`# MEMORY.md

## Project Decisions
- [2025-11-20] Chose sqlc over GORM for database access (performance + type safety)
- [2025-11-28] API versioning: URL path (v1, v2) not headers
- [2025-12-05] Rate limiting: token bucket via Redis, 1000 req/min per API key

## Known Issues
- The user service has a N+1 query on the /users/search endpoint (ticket BE-442)
- Integration tests are flaky when run in parallel (race in test DB setup)
- The CI cache invalidation is broken for the protobuf generation step

## Learned Preferences
- Alex prefers table-driven tests in Go
- Always run \`make lint\` before suggesting a PR is ready
- When creating new endpoints, start with the OpenAPI spec first

## Active Work
- Currently refactoring the auth middleware to support JWT + API key
- Next up: adding OpenTelemetry traces to the gRPC gateway`}
      />

      <WarningBlock title="Memory File Size">
        <p>
          Keep MEMORY.md focused and pruned. If it grows beyond 500 lines, the agent may start
          losing important context due to token limits. Periodically archive old entries to
          a separate <code>MEMORY_ARCHIVE.md</code> file.
        </p>
      </WarningBlock>

      <ComparisonTable
        title="Workspace Files at a Glance"
        headers={['File', 'Purpose', 'Who Writes It', 'Update Frequency']}
        rows={[
          ['SOUL.md', 'Agent personality and style', 'You (human)', 'Rarely, once dialed in'],
          ['IDENTITY.md', 'Role, scope, boundaries', 'You (human)', 'Per project or role change'],
          ['USER.md', 'Your preferences and context', 'You (human)', 'As preferences evolve'],
          ['MEMORY.md', 'Persistent facts and decisions', 'Agent + You', 'Continuously, each session'],
        ]}
      />

      <NoteBlock type="info" title="File Loading Order">
        <p>
          NemoClaw loads these files in a specific order: IDENTITY.md first (establishes role),
          then SOUL.md (personality layer), then USER.md (user context), and finally MEMORY.md
          (accumulated knowledge). Later files can reference concepts defined in earlier ones.
          All four files are injected into the agent's system prompt at session start.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Customization Best Practices
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Getting these files right is an iterative process. Start with minimal versions and refine them
        as you work with the agent. Pay attention to moments where the agent does something you do not
        want, and add a directive to the appropriate file.
      </p>

      <StepBlock
        title="Iterative Refinement Workflow"
        steps={[
          {
            title: 'Start with a minimal SOUL.md',
            content: 'Begin with 5-10 lines covering your most important style preferences. You can always add more later.',
          },
          {
            title: 'Observe agent behavior for a week',
            content: 'Note patterns you like and dislike. Does it explain too much? Not enough? Wrong tone?',
          },
          {
            title: 'Add corrections to the appropriate file',
            content: 'If the issue is personality, update SOUL.md. If it is about project scope, update IDENTITY.md. If the agent forgets something session to session, add it to MEMORY.md.',
          },
          {
            title: 'Version control your config files',
            content: 'Commit your workspace config files to git. Track what changes improve agent behavior. You can even branch and A/B test different configurations.',
          },
        ]}
      />

      <ExerciseBlock
        question="Where should you document the decision that your team chose PostgreSQL over MySQL for the new microservice?"
        options={[
          'SOUL.md -- it affects the agent\'s personality',
          'IDENTITY.md -- it defines the agent\'s role',
          'USER.md -- it is a personal preference',
          'MEMORY.md -- it is a project decision that should persist across sessions',
        ]}
        correctIndex={3}
        explanation="Project decisions, technical choices, and accumulated knowledge belong in MEMORY.md. This file is designed for facts and context that the agent should remember across sessions. SOUL.md is for personality, IDENTITY.md is for role definition, and USER.md is for personal preferences."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Workspace Configuration Guide',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/workspace-config.md',
            type: 'docs',
            description: 'Official documentation for all workspace configuration files.',
          },
          {
            title: 'Prompt Engineering for Agent Personalities',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/soul-guide.md',
            type: 'docs',
            description: 'Best practices for writing effective SOUL.md files.',
          },
        ]}
      />
    </div>
  )
}
