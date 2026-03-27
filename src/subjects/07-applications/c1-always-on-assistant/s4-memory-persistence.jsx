import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function MemoryPersistence() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        One of the biggest frustrations with AI assistants is context loss. You explain your project architecture,
        your team's conventions, and the bug you have been debugging for two days -- then the session ends and
        it is all gone. NemoClaw solves this with a layered memory system that preserves context across sessions
        through workspace files, structured memory, and intelligent context restoration.
      </p>

      <DefinitionBlock
        term="Agent Memory Persistence"
        definition="The ability of an AI agent to retain and recall information across separate sessions. In NemoClaw, this is achieved through workspace files (MEMORY.md), session logs, and context injection at startup, allowing the agent to maintain continuity without relying on unbounded conversation history."
        example="An agent that remembers you decided to use sqlc over GORM three weeks ago, that the CI pipeline broke on Tuesday due to a flaky test, and that you prefer table-driven tests."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        How Memory Works Across Sessions
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's memory system operates at three layers: workspace files that persist indefinitely,
        session state that survives restarts, and conversation context that exists within a single
        interaction. Understanding these layers helps you design an effective memory strategy.
      </p>

      <ComparisonTable
        title="Memory Layers in NemoClaw"
        headers={['Layer', 'Lifetime', 'Size Limit', 'Use Case']}
        rows={[
          ['MEMORY.md', 'Permanent (until manually pruned)', '~500 lines recommended', 'Project decisions, learned preferences, ongoing work'],
          ['Session state', 'Survives restarts, expires after idle timeout', '~50KB', 'Current task context, in-progress work, temp notes'],
          ['Conversation context', 'Single interaction', 'Model context window', 'Immediate back-and-forth, code being discussed'],
          ['Session logs', 'Configurable retention (default 30 days)', 'Disk-limited', 'Audit trail, replaying past interactions'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Workspace Files as Durable Memory
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The primary mechanism for cross-session memory is the workspace filesystem. When the agent
        learns something important, it writes it to MEMORY.md or other workspace files. On the next
        session start, these files are loaded into the agent's context, effectively "restoring" its memory.
      </p>

      <CodeBlock
        title="Agent auto-updating MEMORY.md"
        language="bash"
        code={`# The agent appends to MEMORY.md during a session:

## Project Decisions
- [2025-12-01] Chose sqlc over GORM for database access (performance + type safety)
- [2025-12-08] API versioning: URL path (v1, v2) not headers
+ [2025-12-15] Switched from jwt-go to golang-jwt/jwt/v5 (security advisory CVE-2025-1234)

## Known Issues
- The user service has a N+1 query on /users/search (ticket BE-442)
+ - Redis connection pool exhaustion under load > 500 req/s (investigating)

## Active Work
- [COMPLETED] Refactoring auth middleware for JWT + API key support
+ - Adding rate limiting middleware with Redis token bucket`}
      />

      <NoteBlock type="tip" title="Let the Agent Manage Its Own Memory">
        <p>
          You can instruct the agent in SOUL.md to proactively update MEMORY.md when it learns
          something significant. Add a directive like: "After completing a task or learning a new
          project fact, append it to MEMORY.md with today's date. Mark completed items."
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Context Preservation Strategies
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond MEMORY.md, there are several strategies for maximizing context preservation.
        The right approach depends on your workflow and how frequently you interact with the agent.
      </p>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
        Strategy 1: Structured Memory Files
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Instead of dumping everything into a single MEMORY.md, organize memory across purpose-specific files.
        This helps the agent quickly find relevant context and keeps individual files within token limits.
      </p>

      <CodeBlock
        title="Organized memory file structure"
        language="bash"
        code={`workspace/
  MEMORY.md              # High-level decisions and current state
  .memory/
    architecture.md      # System architecture notes
    conventions.md       # Code conventions and patterns
    incidents.md         # Past incidents and resolutions
    dependencies.md      # Key dependency decisions and versions
    team.md              # Team members, roles, preferences`}
      />

      <CodeBlock
        title="Configuring multi-file memory loading"
        language="yaml"
        code={`# workspace.yaml -- memory configuration
memory:
  # Primary memory file (always loaded)
  primary: MEMORY.md

  # Additional memory files (loaded based on relevance)
  supplementary:
    - path: .memory/architecture.md
      load: always
    - path: .memory/conventions.md
      load: always
    - path: .memory/incidents.md
      load: on-demand  # Loaded when agent detects relevant context
    - path: .memory/dependencies.md
      load: on-demand

  # Auto-archive settings
  archive:
    max_lines: 500
    archive_to: .memory/archive/
    archive_older_than: 30d`}
      />

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
        Strategy 2: Session Summaries
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Configure the agent to write a summary at the end of each session. This creates a chronological
        record of work that can be quickly scanned when resuming.
      </p>

      <CodeBlock
        title="Session summary directive in SOUL.md"
        language="bash"
        code={`## Session Management
When a session is ending (user says goodbye, signs off, or
session timeout approaching):

1. Write a session summary to .memory/sessions/YYYY-MM-DD.md
2. Include: what was worked on, decisions made, open questions
3. Update MEMORY.md with any new persistent facts
4. Update Active Work section with current status

Format for session summary:
---
# Session: YYYY-MM-DD HH:MM
## Worked On
- [brief description of each task]
## Decisions
- [any decisions made]
## Open Questions
- [unresolved items for next session]
## Next Steps
- [what to pick up next time]
---`}
      />

      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6">
        Strategy 3: Context Snapshots
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For long-running tasks that span multiple sessions, create explicit context snapshots that
        capture the full state of an investigation or debugging session.
      </p>

      <CodeBlock
        title="Context snapshot command"
        language="bash"
        code={`# Ask the agent to create a snapshot
> Save a context snapshot for the rate limiter investigation

# Agent creates: .memory/snapshots/rate-limiter-investigation.md
# ---
# # Rate Limiter Investigation
# Created: 2025-12-15
# Status: In Progress
#
# ## Problem
# Redis connection pool exhaustion under load > 500 req/s
#
# ## What We Know
# - Pool size is 10 connections (default)
# - Each rate limit check takes ~2ms
# - At 500 req/s, that's 1000ms of connection time per second
# - Pool can handle ~5000 ops/s (10 conns * 500 ops/conn/s)
# - But we're also using Redis for sessions and caching
#
# ## What We've Tried
# - Increased pool to 25 (helped but didn't solve)
# - Measured: session reads account for 60% of pool usage
#
# ## Next Steps
# - Try connection multiplexing with pipeline mode
# - Consider dedicated Redis instance for rate limiting
# - Benchmark with redis-benchmark to establish baseline
# ---`}
      />

      <WarningBlock title="Token Budget Awareness">
        <p>
          Every memory file loaded at session start consumes tokens from the model's context window.
          If you load too many memory files, the agent has less room for the actual conversation.
          Monitor your total memory footprint with <code>openclaw memory stats</code> and aim to
          keep it under 20% of the model's context window.
        </p>
      </WarningBlock>

      <StepBlock
        title="Setting Up Effective Memory Persistence"
        steps={[
          {
            title: 'Initialize the memory structure',
            content: 'Create the memory directory and seed files with your project context.',
            code: `mkdir -p workspace/.memory/sessions workspace/.memory/snapshots
touch workspace/MEMORY.md
touch workspace/.memory/architecture.md
touch workspace/.memory/conventions.md`,
            language: 'bash',
          },
          {
            title: 'Add memory directives to SOUL.md',
            content: 'Tell the agent how and when to update memory files.',
          },
          {
            title: 'Seed MEMORY.md with existing context',
            content: 'Bootstrap the agent with what it needs to know about your project. Include recent decisions, active work, and known issues.',
          },
          {
            title: 'Review and prune after two weeks',
            content: 'Check how the agent is using memory. Remove redundant entries, archive old items, and adjust the loading strategy.',
            code: `# Check memory usage statistics
openclaw memory stats --workspace /opt/nemoclaw-agent/workspace

# Output:
# MEMORY.md:           142 lines (2.1 KB) -- always loaded
# .memory/architecture.md: 87 lines (1.4 KB) -- always loaded
# .memory/conventions.md:  45 lines (0.7 KB) -- always loaded
# Total loaded at startup: 274 lines (4.2 KB, ~1200 tokens)
# Session files: 14 files (12.3 KB) -- on-demand`,
            language: 'bash',
          },
        ]}
      />

      <ExerciseBlock
        question="An agent's MEMORY.md has grown to 800 lines and the agent is starting to lose context during conversations. What is the best remediation?"
        options={[
          'Delete MEMORY.md and start fresh',
          'Switch to a model with a larger context window',
          'Archive entries older than 30 days and split remaining content into topic-specific files with on-demand loading',
          'Compress the text to use fewer words per entry',
        ]}
        correctIndex={2}
        explanation="Archiving old entries reduces the always-loaded token count, and splitting into topic-specific files with on-demand loading means only relevant context is loaded for each interaction. This preserves the knowledge while freeing up context window space for the actual conversation."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Memory System',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/memory.md',
            type: 'docs',
            description: 'Official documentation for the multi-layer memory system.',
          },
          {
            title: 'Context Window Management Strategies',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/context-management.md',
            type: 'docs',
            description: 'Techniques for optimizing token usage across memory, tools, and conversation.',
          },
        ]}
      />
    </div>
  )
}
