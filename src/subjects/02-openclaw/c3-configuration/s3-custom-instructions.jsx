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

export default function CustomInstructions() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        One of OpenClaw's most distinctive features is its use of Markdown-based
        instruction files to shape agent behavior. Rather than burying system
        prompts in JSON configuration, OpenClaw encourages teams to maintain
        human-readable Markdown files that define the agent's personality,
        knowledge, and working guidelines. These files form the agent's
        "identity stack" and are injected into the system prompt at the start
        of every session.
      </p>

      <DefinitionBlock
        term="Custom Instruction Files"
        definition="Markdown files placed in the project root or .openclaw/ directory that are automatically loaded into the agent's system prompt. Each file type serves a specific purpose in shaping agent behavior, from core identity (SOUL.md) to project-specific instructions (CLAUDE.md)."
        example="A team creates a CLAUDE.md file that tells the agent: 'This is a TypeScript monorepo using pnpm workspaces. Always use Vitest for testing, never Jest. Import paths should use the @app/ alias.' Every conversation starts with this context."
        seeAlso={['System Prompt', 'AGENTS.md', 'Settings Hierarchy']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        CLAUDE.md: The Primary Instruction File
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <code>CLAUDE.md</code> is the primary custom instruction file and the
        one most teams start with. It lives in the project root and contains
        project-specific guidance for the agent. Think of it as an onboarding
        document for a new developer: it describes the tech stack, coding
        conventions, testing practices, deployment procedures, and any
        project-specific knowledge the agent needs.
      </p>

      <CodeBlock
        language="markdown"
        title="CLAUDE.md - Project instruction file"
        code={`# Project Instructions

## Tech Stack
- **Runtime:** Node.js 20 with TypeScript 5.4
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL with Drizzle ORM
- **Testing:** Vitest + React Testing Library
- **Package Manager:** pnpm

## Coding Conventions
- Use functional React components with hooks, never class components
- Prefer \`const\` over \`let\`; never use \`var\`
- All functions must have TypeScript return type annotations
- Use named exports, not default exports (except for pages)
- Error messages should be user-friendly, log technical details separately

## Testing Rules
- Every new component needs a corresponding .test.tsx file
- Use \`describe\` / \`it\` blocks, not standalone \`test\` calls
- Mock external APIs at the fetch level, not at the module level
- Aim for >80% branch coverage on business logic

## Important Notes
- The /api/v2/ routes are deprecated. Only use /api/v3/
- Never modify files in /src/legacy/ — that code is frozen
- Database migrations go in /drizzle/migrations/ using the drizzle-kit format`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The Identity Stack
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond CLAUDE.md, OpenClaw recognizes several other instruction files
        that form a layered identity stack. Each file has a designated role,
        and the Gateway loads them in a specific order to build the complete
        system prompt.
      </p>

      <ComparisonTable
        title="Instruction File Types"
        headers={['File', 'Purpose', 'Load Order', 'Typical Content']}
        rows={[
          [
            'SOUL.md',
            'Core agent identity and behavioral principles',
            '1 (first)',
            'Personality traits, communication style, ethical guidelines, response format preferences',
          ],
          [
            'IDENTITY.md',
            'Agent role and expertise definition',
            '2',
            'Professional role description, areas of expertise, things the agent should and should not do',
          ],
          [
            'CLAUDE.md',
            'Project-specific instructions and context',
            '3',
            'Tech stack, coding conventions, architecture decisions, project-specific rules',
          ],
          [
            'USER.md',
            'Per-user preferences and working style',
            '4',
            'Individual developer preferences, communication style, timezone, experience level',
          ],
          [
            'MEMORY.md',
            'Persistent agent memory across sessions',
            '5 (last)',
            'Learned facts, user corrections, project discoveries, accumulated context',
          ],
        ]}
      />

      <CodeBlock
        language="markdown"
        title="SOUL.md - Core agent identity"
        code={`# Soul

You are a thoughtful, precise software engineer who values clarity over
cleverness. You explain your reasoning before writing code. When uncertain,
you state your assumptions explicitly rather than guessing silently.

## Communication Style
- Be direct and concise. Avoid filler phrases like "Great question!"
- Use code examples to illustrate points rather than lengthy prose
- When delivering bad news (bugs, design flaws), be honest but constructive
- Default to professional tone, but match the user's energy level

## Principles
- Correctness over speed: never suggest code you haven't thought through
- Minimal changes: modify only what's necessary to solve the problem
- Explain trade-offs: when multiple approaches exist, present options
- Ask before large refactors: don't restructure code without permission`}
      />

      <CodeBlock
        language="markdown"
        title="IDENTITY.md - Role definition"
        code={`# Identity

You are a senior full-stack engineer specializing in TypeScript, React,
and Node.js. You have 10+ years of experience building production web
applications.

## Expertise
- React architecture (state management, performance optimization)
- API design (REST, GraphQL, tRPC)
- Database modeling and query optimization
- CI/CD pipelines and deployment automation

## Boundaries
- You do NOT provide advice on infrastructure pricing or vendor selection
- You do NOT write or review legal text (licenses, terms of service)
- You defer to the team's security engineer for penetration testing`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The $include Directive
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        As instruction files grow, they can become unwieldy. OpenClaw supports
        a <code>$include</code> directive that lets you split instructions
        across multiple files and compose them together. Includes support deep
        merging up to 10 levels, preventing infinite recursion while allowing
        rich composition patterns.
      </p>

      <CodeBlock
        language="markdown"
        title="Using $include for modular instructions"
        code={`# CLAUDE.md

$include ./instructions/tech-stack.md
$include ./instructions/coding-conventions.md
$include ./instructions/testing-rules.md
$include ./instructions/api-guidelines.md

## Project-Specific Notes
- The main branch is \`develop\`, not \`main\`
- PR reviews require at least 2 approvals`}
      />

      <CodeBlock
        language="markdown"
        title="instructions/tech-stack.md (included file)"
        code={`## Tech Stack

- **Runtime:** Node.js 20 with TypeScript 5.4
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL with Drizzle ORM

$include ./shared/typescript-rules.md`}
      />

      <NoteBlock type="info" title="Include Depth Limit">
        <p>
          The <code>$include</code> directive resolves recursively up to 10
          levels deep. If an include chain exceeds this depth, the Gateway logs
          a warning and stops resolving further includes. This prevents circular
          references (e.g., file A includes file B which includes file A) from
          causing infinite loops. The depth limit is configurable via the
          <code> maxIncludeDepth</code> setting.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Per-Agent Personas
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In multi-agent deployments, each agent can have its own set of
        instruction files. Agent-specific files are placed in a subdirectory
        matching the agent name, and the Gateway loads them instead of (or in
        addition to) the root-level files.
      </p>

      <CodeBlock
        language="bash"
        title="File structure for per-agent instructions"
        code={`project/
├── CLAUDE.md                    # Shared base instructions
├── SOUL.md                      # Shared soul (optional)
├── .openclaw/
│   ├── config.json
│   ├── agents/
│   │   ├── coder/
│   │   │   ├── CLAUDE.md        # @coder-specific instructions
│   │   │   ├── IDENTITY.md      # @coder identity
│   │   │   └── SOUL.md          # @coder personality
│   │   ├── reviewer/
│   │   │   ├── CLAUDE.md        # @reviewer-specific instructions
│   │   │   ├── IDENTITY.md      # @reviewer identity
│   │   │   └── SOUL.md          # @reviewer personality (stricter)
│   │   └── ops/
│   │       ├── CLAUDE.md        # @ops-specific instructions
│   │       └── IDENTITY.md      # @ops identity`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When agent-specific files exist, the Gateway merges them with the
        root-level files. The root <code>CLAUDE.md</code> provides shared
        instructions, and the agent-specific <code>CLAUDE.md</code> adds or
        overrides with specialized guidance. This follows the same precedence
        principle as the settings hierarchy: more specific overrides more general.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        MEMORY.md: Persistent Agent Memory
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        <code>MEMORY.md</code> is unique among instruction files because it is
        read-write. While all other files are authored by humans, MEMORY.md
        can be updated by the agent itself (or by users via the
        <code> /memory</code> slash command). It stores facts the agent has
        learned during conversations: user preferences, project discoveries,
        corrections to previous mistakes, and accumulated domain knowledge.
      </p>

      <CodeBlock
        language="markdown"
        title="MEMORY.md - Agent memory entries"
        code={`# Memory

## User Preferences
- @alice prefers verbose explanations with examples
- @bob wants minimal code comments, prefers self-documenting names
- Team standup is at 9:30 AM Pacific

## Project Knowledge
- The auth service rate-limits at 100 req/min per IP
- The staging database is on a smaller instance; queries timeout above 5s
- CSS modules are preferred over styled-components in new code

## Corrections
- Previously suggested using lodash.get, but team prefers optional chaining
- The deploy script is ./scripts/deploy.sh, not npm run deploy`}
      />

      <NoteBlock type="tip" title="Memory Management">
        <p>
          Use <code>/memory view</code> to see all stored entries,
          <code> /memory add "fact"</code> to manually add an entry, and
          <code> /memory clear</code> to reset the memory. The agent can also
          add memories automatically when it learns something important, though
          this behavior can be disabled with <code>"autoMemory": false</code>
          in the configuration.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="In what order does the OpenClaw Gateway load instruction files into the system prompt?"
        options={[
          'CLAUDE.md, SOUL.md, IDENTITY.md, USER.md, MEMORY.md',
          'MEMORY.md, USER.md, CLAUDE.md, IDENTITY.md, SOUL.md',
          'SOUL.md, IDENTITY.md, CLAUDE.md, USER.md, MEMORY.md',
          'USER.md, SOUL.md, CLAUDE.md, MEMORY.md, IDENTITY.md',
        ]}
        correctIndex={2}
        explanation="The identity stack loads in order from most fundamental to most specific: SOUL.md (core identity) first, then IDENTITY.md (role), CLAUDE.md (project), USER.md (individual), and MEMORY.md (learned facts) last. This ensures that later files can reference and build upon earlier context."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Custom Instructions Guide',
            url: 'https://docs.openclaw.ai/custom-instructions',
            type: 'docs',
            description: 'Complete guide to creating and managing instruction files.',
          },
          {
            title: 'CLAUDE.md Best Practices',
            url: 'https://docs.openclaw.ai/claude-md',
            type: 'docs',
            description: 'Tips and templates for writing effective CLAUDE.md files.',
          },
        ]}
      />
    </div>
  );
}
