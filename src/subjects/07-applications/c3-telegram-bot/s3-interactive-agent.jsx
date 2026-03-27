import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function InteractiveAgent() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With the Telegram integration configured, your NemoClaw agent becomes an interactive coding
        assistant accessible from your phone, tablet, or any device with Telegram. This section covers
        practical usage patterns: sending commands, sharing files for analysis, executing code through
        the bot, and building conversational workflows for common development tasks.
      </p>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Command-Based Interactions
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Commands are the primary way to trigger structured actions through the Telegram bot. Each
        command maps to a specific agent capability, making it easy to perform common tasks with
        a single message.
      </p>

      <CodeBlock
        title="Built-in commands and usage examples"
        language="bash"
        code={`# Review a specific PR
/review 42
# Agent responds:
# PR #42: "Add rate limiting middleware"
# Author: @sarah | Files changed: 4 | +187 -23
#
# Summary: Adds Redis-backed token bucket rate limiting...
#
# Issues found:
# 1. middleware.go:45 - Race condition in bucket refill logic
# 2. middleware_test.go - Missing test for concurrent requests
# 3. config.go:12 - Hardcoded Redis URL, should use env var
#
# Overall: Request changes (2 blocking issues)

# Check project status
/status
# Agent responds:
# Project: backend-api
# Branch: main (up to date)
# Open PRs: 3 (1 approved, 1 changes requested, 1 new)
# CI: All green
# Last deploy: 2h ago (v2.14.1)
# Active issues: 12 (3 critical)

# Run a development task
/run make test
# Agent responds:
# Running: make test
# ...
# ok  acme/backend-api/handlers    1.234s
# ok  acme/backend-api/middleware   0.892s
# FAIL acme/backend-api/models     2.341s
#
# 1 failure: TestUserSearch/empty_query
# Expected: empty result set
# Got: error "query cannot be empty"

# Quick question (no command prefix needed in DMs)
What's the signature of the ProcessOrder function?
# Agent responds:
# func ProcessOrder(ctx context.Context, order *Order, opts ...ProcessOption) (*Receipt, error)
# Defined in: src/handlers/order.go:42`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        File Sharing and Analysis
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Telegram supports file sharing, which means you can send code files, log excerpts, screenshots,
        and configuration files directly to the bot for analysis. This is particularly useful when you
        are away from your development machine and need to review something quickly.
      </p>

      <CodeBlock
        title="File sharing workflows"
        language="bash"
        code={`# Send a Go file with a message
[Attached: handler.go]
"Can you review this handler? I'm worried about error handling."

# Agent responds:
# Review of handler.go:
#
# Issues found:
# 1. Line 23: db.Query() error is checked but the rows object
#    is not closed on the error path. Add defer rows.Close()
#    AFTER the error check, not before.
#
# 2. Line 45: json.NewDecoder(r.Body) - the body is never closed.
#    Add: defer r.Body.Close()
#
# 3. Line 67: Returning raw error to client. Wrap with a generic
#    message for production: http.Error(w, "internal error", 500)
#
# Here's the corrected version:
# [Attached: handler_fixed.go]

# Send a screenshot of an error
[Attached: error_screenshot.png]
"What does this error mean?"

# Agent analyzes the screenshot and responds:
# This is a PostgreSQL "deadlock detected" error. Two transactions
# are waiting for locks held by each other.
# ...
# Likely cause in your codebase: the UpdateInventory and
# ProcessPayment functions acquire locks in different orders.`}
      />

      <NoteBlock type="tip" title="Supported File Types">
        <p>
          The bot can analyze any text-based file (source code, configs, logs) and images
          (screenshots, diagrams, error messages). Configure allowed file types in the routing
          section to prevent accidental processing of binary files or extremely large files
          that would consume excessive tokens.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Code Execution Through the Bot
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The bot can execute commands in the NemoClaw sandbox, giving you remote access to your
        development environment. This is powerful but must be carefully controlled through policies.
      </p>

      <CodeBlock
        title="Remote code execution examples"
        language="bash"
        code={`# Run tests for a specific package
/run go test ./handlers/... -v -count=1

# Check git status
/run git status
# Agent responds:
# On branch feature/rate-limiter
# Changes not staged:
#   modified: src/middleware/ratelimit.go
#   modified: src/middleware/ratelimit_test.go

# Run linters
/run make lint
# Agent responds:
# golangci-lint run ./...
# src/middleware/ratelimit.go:67:2: unnecessary assignment (S1034)
# 1 issue found

# Generate a test
Write a table-driven test for the TokenBucket.Allow method
# Agent responds with a complete test file:
# [Attached: tokenbucket_test.go]
# Test covers:
# - Allow when bucket has tokens
# - Deny when bucket is empty
# - Refill after interval
# - Concurrent access safety
# - Zero-rate configuration`}
      />

      <WarningBlock title="Execution Security">
        <p>
          Remote code execution through Telegram is a powerful capability that requires strong
          safeguards. Ensure your policy restricts which commands the agent can run, the sandbox
          prevents access to production systems, and only authorized users can trigger execution.
          Never enable <code>/run</code> without user allowlisting (covered in the rate limiting section).
        </p>
      </WarningBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Conversational Workflows
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond single-command interactions, the bot supports multi-turn conversations that maintain
        context. This enables complex workflows like guided debugging sessions, iterative code
        reviews, and collaborative design discussions.
      </p>

      <CodeBlock
        title="Multi-turn debugging session"
        language="bash"
        code={`You: The /users/search endpoint is returning 500 errors in staging

Agent: Let me check the logs.
Running: grep "users/search" /var/log/app/staging.log | tail -20
Found the error: "pq: too many connections"

The connection pool is exhausted. Let me check the current config.
Running: cat config/staging.yaml | grep -A5 database

Current pool size: max_connections=10
Staging traffic: ~200 req/s to this endpoint

The N+1 query issue on this endpoint (ticket BE-442) is
creating 10+ connections per request. With 200 req/s, that's
2000 connections needed but only 10 available.

Immediate fix: increase pool to 50 connections.
Long-term fix: resolve the N+1 query.

Want me to:
1. Create a PR to increase the pool size?
2. Create a PR to fix the N+1 query?
3. Both?

You: 1 for now, we'll tackle the N+1 next sprint

Agent: Creating PR to increase connection pool...
Running: git checkout -b fix/increase-db-pool
Running: [modifying config/staging.yaml]
Running: git commit -m "fix: increase staging DB pool to 50 connections"
Running: git push origin fix/increase-db-pool

PR #67 created: "fix: increase staging DB pool to 50 connections"
URL: https://github.com/acme-corp/backend-api/pull/67

I've also added a note to MEMORY.md about the N+1 query for
next sprint planning.`}
      />

      <ComparisonTable
        title="Interaction Patterns"
        headers={['Pattern', 'Trigger', 'Best For']}
        rows={[
          ['Single command', '/review 42', 'Quick, self-contained tasks'],
          ['Question', 'Free-form text message', 'Code questions, architecture advice'],
          ['File analysis', 'Attach a file with optional message', 'Code review, log analysis'],
          ['Multi-turn conversation', 'Follow-up messages', 'Debugging, design discussions'],
          ['Remote execution', '/run <command>', 'Running tests, builds, deployments'],
        ]}
      />

      <NoteBlock type="info" title="Context Window in Telegram">
        <p>
          Telegram conversations can get long. The agent maintains context within a session,
          but Telegram's message display makes it hard to track long threads. For extended
          debugging sessions, the agent can summarize the conversation so far on request.
          Send "summarize" to get a bullet-point summary of the current session.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="A team member sends a file called 'production-secrets.env' to the Telegram bot asking 'what services do we use?'. What should happen?"
        options={[
          'The bot should analyze the file and list the services',
          'The bot should refuse to process the file and warn the user about sharing secrets in chat',
          'The bot should process the file but redact any values that look like secrets',
          'The bot should silently ignore the file',
        ]}
        correctIndex={1}
        explanation="Files matching patterns like *.env, *secret*, *credential* should be rejected by the routing configuration. The bot should explicitly warn the user about the security risk of sharing secrets through a messaging platform, even if the channel is private. Telegram messages are stored on Telegram's servers and may be compromised."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Bot Commands Reference',
            url: 'https://github.com/openclaw-org/openclaw/blob/main/docs/integrations/telegram-commands.md',
            type: 'docs',
            description: 'Complete reference for building custom bot commands and handlers.',
          },
          {
            title: 'Telegram Bot Features',
            url: 'https://core.telegram.org/bots/features',
            type: 'docs',
            description: 'Official guide to Telegram bot capabilities and interaction patterns.',
          },
        ]}
      />
    </div>
  )
}
