import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function AgentRoles() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The power of multi-agent systems comes from specialization. Rather than one agent that tries to
        do everything, you define focused agents that excel at specific tasks. Each specialized agent
        gets a tailored system prompt, a minimal policy, and domain-specific tools. This section
        covers four practical agent specializations and how to configure each one effectively.
      </p>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Code Reviewer Agent
      </h2>

      <DefinitionBlock
        term="Code Reviewer Agent"
        definition="A specialized agent focused exclusively on reviewing code changes. It reads diffs, analyzes code quality, checks for bugs and security issues, and posts structured review comments. It never modifies code directly."
        example="An agent triggered on every PR that checks for race conditions in Go code, validates error handling patterns, and ensures test coverage for new functions."
      />

      <CodeBlock
        title="Code reviewer SOUL.md"
        language="bash"
        code={`# souls/reviewer-soul.md

## Role
You are a meticulous code reviewer with 15 years of experience.
You focus on correctness, security, and maintainability.

## Review Priorities (in order)
1. Security vulnerabilities (SQL injection, XSS, auth bypass)
2. Correctness bugs (race conditions, nil derefs, off-by-one)
3. Error handling (unchecked errors, missing cleanup, panic recovery)
4. Performance (N+1 queries, unnecessary allocations, blocking calls)
5. Maintainability (naming, complexity, test coverage)

## Review Style
- Be specific: reference exact lines and suggest exact fixes
- Categorize findings: [CRITICAL], [BUG], [PERF], [STYLE]
- For each finding, explain WHY it's a problem, not just WHAT
- Limit to 5-7 comments per review. Prioritize the most impactful.
- If the code is good, say so briefly. Don't manufacture issues.

## What NOT to Review
- Do not comment on formatting if a formatter is configured
- Do not suggest architectural changes unless there's a clear bug
- Do not review auto-generated files (*.pb.go, *_gen.go)`}
      />

      <CodeBlock
        title="Code reviewer policy"
        language="yaml"
        code={`# policies/reviewer.yaml
name: code-reviewer
network:
  default: deny
  allow:
    - domain: api.github.com
      methods: [GET, POST]
      paths:
        - /repos/acme-corp/*/pulls/**
        - /repos/acme-corp/*/contents/**
        - /repos/acme-corp/*/commits/**
    - domain: api.anthropic.com
      methods: [POST]
filesystem:
  readable: ["**/*"]
  writable: []  # Cannot modify any files
tools:
  allowed: [git, grep, find, cat]
  denied: [bash, make, go, curl, ssh]`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Test Writer Agent
      </h2>

      <DefinitionBlock
        term="Test Writer Agent"
        definition="An agent specialized in writing, maintaining, and running tests. It analyzes source code to identify untested paths, generates test cases with high coverage, and can run test suites to verify correctness."
        example="An agent that receives a notification that a new function was added, analyzes its behavior, generates table-driven tests covering edge cases, and opens a PR with the tests."
      />

      <CodeBlock
        title="Test writer SOUL.md"
        language="bash"
        code={`# souls/test-writer-soul.md

## Role
You are a test engineering specialist. Your job is to ensure
comprehensive test coverage for all production code.

## Testing Approach
- Always write table-driven tests when there are multiple cases
- Test both success and failure paths
- Test edge cases: nil input, empty collections, max values, unicode
- Test concurrency safety when the code uses goroutines or shared state
- Use testify/assert for readable assertions

## Test Organization
- One test file per source file (*_test.go next to *.go)
- Group tests by function: TestFunctionName/scenario_description
- Use test fixtures in testdata/ directories
- Mock external dependencies, never make real API calls in tests

## Quality Standards
- Minimum 80% line coverage for new code
- 100% coverage for error handling paths
- Tests must be deterministic (no time.Sleep, no random without seed)
- Tests must be independent (no shared state between test cases)`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Documentation Agent
      </h2>

      <DefinitionBlock
        term="Documentation Agent"
        definition="An agent focused on keeping documentation in sync with code. It generates API docs, updates READMEs, writes inline code comments, and maintains architectural decision records (ADRs)."
        example="An agent that detects when a public function's signature changes and automatically updates the corresponding API documentation and usage examples."
      />

      <CodeBlock
        title="Documentation agent configuration"
        language="yaml"
        code={`# Agent definition in AGENTS.md
name: docs-writer
model: claude-sonnet-4-20250514
policy: policies/docs-writer.yaml
soul: souls/docs-writer-soul.md

triggers:
  - event: reviewer.request_docs
  - event: github.pull_request.merged
    conditions:
      files_changed: ["src/**/*.go"]  # Only when source code changes
  - event: github.issue.labeled
    label: documentation

filesystem:
  writable:
    - "docs/**"
    - "**/README.md"
    - "api/**/*.yaml"  # OpenAPI specs
  readable:
    - "**/*"`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Deployment Agent
      </h2>

      <DefinitionBlock
        term="Deployment Agent"
        definition="An agent that manages the deployment pipeline: preparing releases, running pre-deployment checks, triggering deployments, and monitoring rollout health. This is the highest-privilege agent and requires the most careful policy configuration."
        example="An agent that creates a release tag when the main branch is stable, triggers a staging deployment, runs smoke tests, and promotes to production after verification."
      />

      <CodeBlock
        title="Deployment agent with strict controls"
        language="yaml"
        code={`# policies/deployer.yaml
name: deployment-agent
network:
  default: deny
  allow:
    - domain: api.github.com
      methods: [GET, POST]
      paths:
        - /repos/acme-corp/backend-api/releases/**
        - /repos/acme-corp/backend-api/deployments/**
        - /repos/acme-corp/backend-api/git/refs/**

    # CI/CD system
    - domain: api.github.com
      methods: [POST]
      paths:
        - /repos/acme-corp/backend-api/actions/workflows/*/dispatches

    # Monitoring (read-only)
    - domain: api.datadoghq.com
      methods: [GET]
      paths:
        - /api/v1/monitor/**
        - /api/v1/metrics/query

    - domain: api.anthropic.com
      methods: [POST]

# Require human approval for production deployments
approval:
  required_for:
    - action: trigger_deployment
      environment: production
      approvers: [alex@acme.com, sarah@acme.com]
      min_approvals: 1
  auto_approve:
    - action: trigger_deployment
      environment: staging`}
      />

      <WarningBlock title="Deployment Agent Risk">
        <p>
          The deployment agent has the highest blast radius of any agent role. A misconfigured
          deployment agent could push broken code to production. Always require human approval for
          production deployments, implement automatic rollback triggers, and start with
          staging-only access before granting production permissions.
        </p>
      </WarningBlock>

      <ComparisonTable
        title="Agent Role Comparison"
        headers={['Role', 'Model Recommendation', 'Write Access', 'Risk Level']}
        rows={[
          ['Code Reviewer', 'Opus (quality matters most)', 'None (read + comment only)', 'Low'],
          ['Test Writer', 'Sonnet (good balance)', 'Test files only', 'Low-Medium'],
          ['Documentation', 'Sonnet (volume of output)', 'Docs directory only', 'Low'],
          ['Deployment', 'Opus (correctness critical)', 'CI/CD config only', 'High'],
        ]}
      />

      <NoteBlock type="tip" title="Start With One, Then Specialize">
        <p>
          Most teams should start with a single general-purpose agent and only split into
          specialized agents when they observe distinct task categories with different permission
          requirements. Premature specialization adds coordination overhead without proportional benefit.
          The clearest signal for specialization is when you find yourself wanting different
          policies for different types of work.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="You want an agent that reviews PRs AND writes tests for issues it finds. Should this be one agent or two?"
        options={[
          'One agent -- combining these roles is more efficient',
          'Two agents -- the reviewer should never have write access to source files',
          'One agent with dynamic permissions that change based on the current task',
          'Two agents, but they should share the same sandbox for efficiency',
        ]}
        correctIndex={1}
        explanation="The reviewer and test-writer require fundamentally different permissions. The reviewer needs read-only access to code plus write access to review comments. The test-writer needs write access to test files. Combining them would require granting both permission sets, violating least privilege. Keeping them separate means the reviewer cannot accidentally modify code, and the test-writer cannot post reviews."
      />

      <ReferenceList
        references={[
          {
            title: 'Agent Role Templates',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/agent-roles.md',
            type: 'docs',
            description: 'Pre-built role templates for common agent specializations.',
          },
          {
            title: 'SOUL.md Writing Guide',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/soul-guide.md',
            type: 'docs',
            description: 'Best practices for writing effective personality and behavior instructions.',
          },
        ]}
      />
    </div>
  )
}
