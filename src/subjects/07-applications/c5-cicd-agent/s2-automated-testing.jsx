import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function AutomatedTesting() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond reviewing existing code, a CI agent can actively write and execute tests for pull
        requests. This addresses one of the most common review findings: insufficient test coverage.
        The agent analyzes the PR's changes, identifies untested code paths, generates targeted tests,
        runs them in the sandbox, and reports the results. The sandbox is critical here -- it ensures
        test execution cannot affect anything outside the sandbox boundary.
      </p>

      <DefinitionBlock
        term="Automated Test Generation"
        definition="The process of an AI agent analyzing source code changes, identifying testable behaviors, writing test cases, and executing them within a sandboxed environment. The agent produces both the test code and the execution results, which are reported back to the PR."
        example="A PR adds a new PaymentProcessor.Refund() method. The agent generates tests covering successful refund, insufficient balance, expired transaction, and concurrent refund attempts, then runs them and reports 4/4 passing."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        How the Test Agent Works in CI
      </h2>

      <StepBlock
        title="Test Generation and Execution Pipeline"
        steps={[
          {
            title: 'Analyze the PR diff for testable changes',
            content: 'The agent identifies new or modified functions, especially public APIs, error handling paths, and complex logic.',
            code: `# Agent's analysis output (internal reasoning):
# PR #42 changes:
# - NEW: middleware/ratelimit.go:RateLimiter.Allow()
# - NEW: middleware/ratelimit.go:RateLimiter.refillTokens()
# - MOD: handlers/order.go:ProcessOrder() -- added retry logic
#
# Test coverage needed:
# - RateLimiter.Allow(): basic allow/deny, burst, expiry
# - refillTokens(): timing, overflow, concurrent access
# - ProcessOrder() retry: success on retry, max retries, backoff`,
            language: 'bash',
          },
          {
            title: 'Read existing tests and conventions',
            content: 'The agent examines existing test files to match the project\'s testing style, framework, and patterns.',
            code: `# Agent reads:
# - middleware/ratelimit_test.go (if it exists)
# - handlers/order_test.go (existing test patterns)
# - testutil/ (shared test helpers)
# - Makefile (test commands and flags)`,
            language: 'bash',
          },
          {
            title: 'Generate test files',
            content: 'The agent writes test files following the project\'s conventions.',
            code: `// Generated: middleware/ratelimit_test.go
package middleware

import (
    "sync"
    "testing"
    "time"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
)

func TestRateLimiter_Allow(t *testing.T) {
    tests := []struct {
        name       string
        rate       int
        burst      int
        requests   int
        wantAllow  int
        wantDeny   int
    }{
        {
            name:      "under rate limit",
            rate:      100,
            burst:     10,
            requests:  5,
            wantAllow: 5,
            wantDeny:  0,
        },
        {
            name:      "at burst limit",
            rate:      100,
            burst:     10,
            requests:  10,
            wantAllow: 10,
            wantDeny:  0,
        },
        {
            name:      "over burst limit",
            rate:      100,
            burst:     10,
            requests:  15,
            wantAllow: 10,
            wantDeny:  5,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            rl := NewRateLimiter(tt.rate, tt.burst)
            allowed, denied := 0, 0
            for i := 0; i < tt.requests; i++ {
                if rl.Allow("test-key") {
                    allowed++
                } else {
                    denied++
                }
            }
            assert.Equal(t, tt.wantAllow, allowed)
            assert.Equal(t, tt.wantDeny, denied)
        })
    }
}

func TestRateLimiter_ConcurrentAccess(t *testing.T) {
    rl := NewRateLimiter(1000, 100)
    var wg sync.WaitGroup
    results := make([]bool, 200)

    for i := 0; i < 200; i++ {
        wg.Add(1)
        go func(idx int) {
            defer wg.Done()
            results[idx] = rl.Allow("test-key")
        }(i)
    }

    wg.Wait()
    allowed := 0
    for _, r := range results {
        if r {
            allowed++
        }
    }
    // Should allow at most burst (100) requests
    require.LessOrEqual(t, allowed, 100)
}`,
            language: 'go',
          },
          {
            title: 'Execute tests in the sandbox',
            content: 'The agent runs the tests within the NemoClaw sandbox. The sandbox prevents test code from accessing the network, modifying files outside the workspace, or affecting other processes.',
            code: `# Agent runs tests inside the sandbox:
go test ./middleware/... -v -race -count=1 -timeout=60s

# Output:
# === RUN   TestRateLimiter_Allow
# === RUN   TestRateLimiter_Allow/under_rate_limit
# --- PASS: TestRateLimiter_Allow/under_rate_limit (0.00s)
# === RUN   TestRateLimiter_Allow/at_burst_limit
# --- PASS: TestRateLimiter_Allow/at_burst_limit (0.00s)
# === RUN   TestRateLimiter_Allow/over_burst_limit
# --- PASS: TestRateLimiter_Allow/over_burst_limit (0.00s)
# === RUN   TestRateLimiter_ConcurrentAccess
# --- PASS: TestRateLimiter_ConcurrentAccess (0.01s)
# PASS
# ok  acme/backend-api/middleware  0.234s`,
            language: 'bash',
          },
          {
            title: 'Report results on the PR',
            content: 'The agent posts the test results, generated test code, and coverage information as a PR comment.',
          },
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Sandbox Prevents Test Escape
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Running agent-generated tests is inherently risky. The tests are AI-generated code that gets
        executed -- effectively running untrusted code. The NemoClaw sandbox provides the isolation
        needed to do this safely.
      </p>

      <ComparisonTable
        title="What the Sandbox Blocks During Test Execution"
        headers={['Attack Vector', 'Without Sandbox', 'With Sandbox']}
        rows={[
          ['Test makes HTTP requests', 'Could contact external services', 'All network blocked except localhost'],
          ['Test reads /etc/passwd', 'Returns system user data', 'Blocked: file outside workspace'],
          ['Test spawns background process', 'Process persists after test', 'Process killed when sandbox exits'],
          ['Test writes to /tmp', 'Persists, visible to other processes', 'Isolated tmpfs, cleaned on exit'],
          ['Test forks a shell', 'Full shell access to system', 'Blocked by seccomp policy'],
        ]}
      />

      <CodeBlock
        title="Test execution sandbox policy"
        language="yaml"
        code={`# policies/test-runner.yaml
name: ci-test-runner
version: 1

network:
  default: deny
  allow:
    # Allow localhost only (for integration tests using local services)
    - domain: localhost
      ports: [5432, 6379, 8080]  # PostgreSQL, Redis, test server
    # Inference provider
    - domain: api.anthropic.com
      methods: [POST]
    # Post results to GitHub
    - domain: api.github.com
      methods: [POST]
      paths: [/repos/acme-corp/backend-api/issues/*/comments]

filesystem:
  writable:
    - /workspace/**
  denied:
    - /workspace/.env
    - /workspace/.git/credentials
  readable:
    - /workspace/**

tools:
  allowed: [go, make, git, grep, find, cat, bash]
  denied: [curl, wget, ssh, docker, nc]

process:
  max_processes: 100    # Tests may spawn subprocesses
  max_open_files: 256
  max_memory: 2GB
  max_cpu_time: 300s    # 5 minute hard limit

# Test-specific sandbox settings
sandbox:
  isolated_network: true
  isolated_pid: true
  read_only_root: true
  tmpfs_size: 500MB`}
      />

      <WarningBlock title="Test Execution Time Limits">
        <p>
          Always set hard time limits on test execution. An AI-generated test with an infinite
          loop or a test that accidentally creates exponential combinations could run indefinitely.
          The <code>max_cpu_time</code> setting kills the process after the specified duration,
          and the CI workflow should have its own step timeout as a second safety net.
        </p>
      </WarningBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Reporting Results
      </h2>

      <CodeBlock
        title="Test results posted to the PR"
        language="bash"
        code={`## AI-Generated Test Results - PR #42

### New Tests Written
| File | Tests | Pass | Fail | Coverage |
|------|-------|------|------|----------|
| middleware/ratelimit_test.go | 4 | 4 | 0 | 87% |
| handlers/order_retry_test.go | 3 | 2 | 1 | 72% |

### Failing Test
**TestProcessOrder_MaxRetries** (handlers/order_retry_test.go:45)
\`\`\`
Expected: error after 3 retries
Got: function retried 4 times before erroring
\`\`\`
This suggests the retry count check is off-by-one.
See line 89 of handlers/order.go: \`attempts <= maxRetries\`
should be \`attempts < maxRetries\`.

### Coverage Impact
- Before PR: 71.2%
- After PR (with new tests): 78.4% (+7.2%)
- Remaining untested: error handling in refillTokens()

---
*Generated by NemoClaw CI Test Agent | 7 tests in 2.3s*`}
      />

      <ExerciseBlock
        question="The CI test agent generates a test that imports 'net/http' and makes a request to an external API for test data. What happens?"
        options={[
          'The test passes because the sandbox allows all outbound traffic',
          'The test fails with a connection error because the sandbox blocks external network access',
          'The test is rejected before execution because the agent cannot generate network-dependent tests',
          'The test runs but the response is mocked automatically by the sandbox',
        ]}
        correctIndex={1}
        explanation="The sandbox isolates network access. When the test tries to connect to an external API, the connection is blocked at the network namespace level, causing a connection refused or timeout error. The test fails naturally with a network error. This is by design -- tests should not depend on external services."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw CI Test Runner',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/ci-test-runner.md',
            type: 'docs',
            description: 'Configuration guide for running AI-generated tests in CI pipelines.',
          },
          {
            title: 'Sandbox Security Model',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/sandbox-security.md',
            type: 'docs',
            description: 'Technical details of sandbox isolation for code execution.',
          },
        ]}
      />
    </div>
  )
}
