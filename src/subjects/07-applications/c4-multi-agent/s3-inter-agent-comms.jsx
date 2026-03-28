import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function InterAgentComms() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Individual agents are useful, but the real power of multi-agent systems emerges when agents
        communicate. A code reviewer identifies missing tests and asks the test-writer to generate them.
        A deployment agent checks with the reviewer before promoting a release. NemoClaw provides
        structured communication channels that enable this coordination while maintaining security
        boundaries between agents.
      </p>

      <DefinitionBlock
        term="Inter-Agent Communication"
        definition="The mechanism by which NemoClaw agents exchange messages, delegate tasks, and share results. Communication happens through defined channels (shared files, message queues, or direct dispatch) and is governed by the communication graph defined in AGENTS.md."
        example="The orchestrator agent sends a task message to the reviewer agent: 'Review PR #42'. The reviewer processes the PR, posts comments, and sends a completion message back: 'Review complete, 3 issues found, 1 critical'."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Communication Channels
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw supports three communication patterns, each suited to different coordination needs.
        The right choice depends on the urgency, complexity, and coupling between agents.
      </p>

      <ComparisonTable
        title="Communication Channel Types"
        headers={['Channel', 'Mechanism', 'Latency', 'Best For']}
        rows={[
          ['Message Queue', 'Async messages via internal queue', 'Seconds', 'Task delegation, status updates'],
          ['Shared Workspace', 'Files in a shared directory', 'Near instant', 'Large data exchange, artifacts'],
          ['Direct Dispatch', 'Synchronous agent-to-agent call', 'Real-time', 'Blocking requests needing immediate response'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Message Queue Communication
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The message queue is the most common communication pattern. Agents post messages to named
        channels, and other agents subscribed to those channels receive them asynchronously.
      </p>

      <CodeBlock
        title="Message queue configuration in AGENTS.md"
        language="yaml"
        code={`# Communication graph for the orchestrator
communication:
  listens_to:
    - channel: review-results
      from: [reviewer]
    - channel: test-results
      from: [test-writer]
    - channel: docs-updates
      from: [docs-writer]
  publishes_to:
    - channel: review-requests
      to: [reviewer]
    - channel: test-requests
      to: [test-writer]
    - channel: docs-requests
      to: [docs-writer]`}
      />

      <CodeBlock
        title="Message format between agents"
        language="json"
        code={`{
  "id": "msg-20251215-001",
  "from": "orchestrator",
  "to": "reviewer",
  "channel": "review-requests",
  "timestamp": "2025-12-15T14:23:01Z",
  "type": "task",
  "payload": {
    "action": "review_pr",
    "pr_number": 42,
    "repo": "acme-corp/backend-api",
    "priority": "normal",
    "context": "Triggered by Telegram message from Alex"
  },
  "reply_to": "orchestrator/review-results",
  "timeout": "300s"
}`}
      />

      <CodeBlock
        title="Agent responding to a task"
        language="json"
        code={`{
  "id": "msg-20251215-002",
  "from": "reviewer",
  "to": "orchestrator",
  "channel": "review-results",
  "timestamp": "2025-12-15T14:26:45Z",
  "type": "result",
  "in_reply_to": "msg-20251215-001",
  "payload": {
    "status": "completed",
    "pr_number": 42,
    "findings": 3,
    "critical_findings": 1,
    "review_posted": true,
    "recommendation": "request_changes",
    "summary": "Found race condition in rate limiter, missing error check in handler, and a style issue.",
    "follow_up_needed": ["test-writer"]
  }
}`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Shared Workspace Communication
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For exchanging large artifacts (code files, test results, documentation), agents use a shared
        workspace directory. This avoids stuffing large content into messages and provides a natural
        file-based interface.
      </p>

      <CodeBlock
        title="Shared workspace structure"
        language="bash"
        code={`workspace/
  .agent-comm/
    # Shared handoff directory
    handoffs/
      reviewer-to-test-writer/
        pr-42-findings.json     # Reviewer's findings for test-writer
        pr-42-untested-paths.md # Functions needing tests
      test-writer-to-orchestrator/
        pr-42-test-results.json # Test execution results
        coverage-report.html    # Generated coverage report

    # Status files (each agent updates its own)
    status/
      reviewer.json
      test-writer.json
      docs-writer.json
      orchestrator.json

    # Shared context (readable by all agents)
    context/
      active-prs.json        # Currently open PRs being worked on
      recent-deployments.json
      team-preferences.yaml`}
      />

      <CodeBlock
        title="Shared workspace policy"
        language="yaml"
        code={`# Each agent gets specific read/write access to shared directories
# Reviewer policy:
filesystem:
  writable:
    - .agent-comm/handoffs/reviewer-to-*/**
    - .agent-comm/status/reviewer.json
  readable:
    - .agent-comm/context/**
    - .agent-comm/status/**
    - "**/*"

# Test-writer policy:
filesystem:
  writable:
    - .agent-comm/handoffs/test-writer-to-*/**
    - .agent-comm/status/test-writer.json
    - "**/*_test.go"
  readable:
    - .agent-comm/handoffs/reviewer-to-test-writer/**
    - .agent-comm/context/**
    - "**/*"`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Direct Dispatch
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Direct dispatch is a synchronous call from one agent to another. The calling agent blocks
        until the target agent responds. Use this sparingly -- it creates tight coupling and can
        cause cascading timeouts.
      </p>

      <CodeBlock
        title="Direct dispatch configuration"
        language="yaml"
        code={`# Orchestrator can directly dispatch to any agent
communication:
  direct_dispatch:
    enabled: true
    allowed_targets: [reviewer, test-writer, docs-writer]
    timeout: 60s
    max_retries: 2

# Example: orchestrator asks reviewer a quick question
# (handled internally by NemoClaw runtime)
#
# orchestrator -> dispatch(reviewer, {
#   action: "quick_check",
#   question: "Is PR #42 safe to merge based on your last review?"
# })
#
# reviewer -> response({
#   answer: "No, the critical race condition in ratelimit.go is unresolved."
# })`}
      />

      <NoteBlock type="warning" title="Avoid Circular Dispatch">
        <p>
          Direct dispatch can deadlock if agent A dispatches to agent B while B is dispatching
          to A. NemoClaw detects simple circular dependencies and rejects them, but complex
          cycles (A to B to C to A) may not be caught. Design your dispatch graph as a DAG
          (directed acyclic graph) to avoid this entirely.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Message Routing Between Agents
      </h2>

      <CodeBlock
        title="Complete routing configuration"
        language="yaml"
        code={`# routing.yaml -- how messages flow between agents
routing:
  # When a PR is opened, start the review pipeline
  pipelines:
    - name: pr-review-pipeline
      trigger:
        event: github.pull_request.opened
      steps:
        - agent: reviewer
          action: review_pr
          on_complete:
            - condition: "findings.critical > 0"
              next: test-writer
              action: write_tests_for_findings
            - condition: "findings.critical == 0"
              next: orchestrator
              action: report_clean_review

    - name: test-gap-pipeline
      trigger:
        event: cron
        schedule: "0 2 * * 1"  # Weekly on Monday at 2 AM
      steps:
        - agent: test-writer
          action: analyze_coverage
          on_complete:
            - next: orchestrator
              action: report_test_gaps

  # Message routing rules
  rules:
    - from: reviewer
      message_type: request_tests
      route_to: test-writer

    - from: reviewer
      message_type: request_docs
      route_to: docs-writer

    - from: "*"
      message_type: status_update
      route_to: orchestrator`}
      />

      <ExerciseBlock
        question="The reviewer agent finds a critical bug and wants the test-writer to create a regression test. Which communication channel is most appropriate?"
        options={[
          'Direct dispatch, because the test needs to be written immediately',
          'Message queue with a task message, because the test-writer should process it when ready',
          'Shared workspace file with the bug details, plus a message queue notification',
          'Telegram message to the human, asking them to tell the test-writer',
        ]}
        correctIndex={2}
        explanation="The bug details (affected code, reproduction steps, expected behavior) are best shared as a structured file in the shared workspace, since they may be too large for a message. The message queue notification tells the test-writer that new work is available. This decoupled approach avoids blocking the reviewer and gives the test-writer all the context it needs."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Inter-Agent Communication',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/agent-communication.md',
            type: 'docs',
            description: 'Complete guide to message queues, shared workspaces, and direct dispatch.',
          },
          {
            title: 'Multi-Agent Design Patterns',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/multi-agent-patterns.md',
            type: 'docs',
            description: 'Common patterns for coordinating multiple agents effectively.',
          },
        ]}
      />
    </div>
  )
}
