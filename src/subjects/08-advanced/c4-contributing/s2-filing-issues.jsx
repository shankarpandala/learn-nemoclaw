import { CodeBlock, NoteBlock, WarningBlock, ComparisonTable, StepBlock } from '../../../components/content'

export default function FilingIssues() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Filing Effective Issues
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Filing issues on the NemoClaw GitHub repository is one of the most valuable contributions
        you can make, even if you never write a line of code. A well-written bug report saves
        maintainers hours of debugging time. A thoughtful feature request can shape the direction
        of the project. A clearly documented usability issue can prevent other users from hitting
        the same problem. This section covers how to file issues that are actionable, complete,
        and useful to the maintainers and the community.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Bug Reports
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        An effective bug report answers five questions: What did you do? What did you expect to
        happen? What actually happened? What is your environment? Can you reproduce it? The
        NemoClaw issue template guides you through these, but understanding why each piece of
        information matters helps you provide the right level of detail.
      </p>

      <StepBlock number={1} title="Gather environment information">
        <p>
          Before filing a bug report, collect the system information that maintainers will need
          to reproduce the issue. NemoClaw provides a command that captures everything relevant.
        </p>
        <CodeBlock language="bash">{`# Generate a complete environment report
nemoclaw system info

# Example output:
# NemoClaw version: 0.8.3
# Go version: go1.22.4
# OS: Ubuntu 24.04.1 LTS
# Kernel: 6.8.0-45-generic
# Architecture: x86_64
# Landlock ABI: 4
# Seccomp: available
# Docker: 27.1.1
# GPU: NVIDIA RTX 4090 (driver 550.120)
# CUDA: 12.4

# Copy this output into your bug report`}</CodeBlock>
      </StepBlock>

      <StepBlock number={2} title="Write a clear reproduction case">
        <p>
          The most important part of a bug report is a reproduction case -- a minimal set of
          steps that reliably triggers the bug. The best reproduction cases are self-contained:
          someone should be able to copy-paste your commands and see the same problem.
        </p>
        <CodeBlock language="markdown">{`## Steps to reproduce

1. Create a minimal blueprint with the following \`blueprint.yaml\`:
   \`\`\`yaml
   name: "repro-test"
   version: "0.1.0"
   llm:
     provider: "openai-compatible"
     base_url: "http://localhost:11434/v1"
     model: "llama3.1:8b"
     api_key: "test"
   policies:
     network:
       default: deny
       allow:
         - host: "localhost"
           port: 11434
   \`\`\`

2. Start Ollama serving llama3.1:8b

3. Run: \`nemoclaw run --blueprint ./repro-test/ --prompt "Hello"\`

4. Observe the error output

## Expected behavior
The agent should connect to Ollama and respond.

## Actual behavior
Connection is refused with error:
\`\`\`
ERROR: dial tcp 127.0.0.1:11434: connect: connection refused
\`\`\`

The network policy allows localhost:11434, but the connection is
still blocked. This appears to be because "localhost" resolves to
127.0.0.1 but the sandbox's /etc/hosts does not contain this mapping.`}</CodeBlock>
      </StepBlock>

      <StepBlock number={3} title="Include relevant logs">
        <CodeBlock language="bash">{`# Run with verbose logging to capture detailed output
nemoclaw run --blueprint my-agent --log-level debug --prompt "trigger the bug" 2>&1 | tee /tmp/debug-output.txt

# Include the relevant portion of the log in your bug report
# Trim to the relevant section -- do not paste thousands of lines

# For sandbox-specific issues, also include:
dmesg | tail -50       # Kernel messages (Landlock/seccomp denials)
journalctl --since "10 minutes ago" | grep nemoclaw  # System journal`}</CodeBlock>
      </StepBlock>

      <NoteBlock type="info" title="Redact Sensitive Information">
        <p>
          Before posting logs or configuration in a bug report, check for sensitive information
          that should not be shared publicly. Remove or redact: API keys, authentication tokens,
          internal hostnames and IP addresses, file paths that reveal organizational structure,
          and any data from your agent's inputs or outputs that may be confidential. Replace
          them with placeholder values like [REDACTED] or example.com.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Feature Requests
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Feature requests are most effective when they describe the problem you are trying to
        solve, not just the solution you envision. Maintainers have broad context about the
        project's architecture and roadmap -- they may know a better way to achieve your goal,
        or they may recognize that your use case aligns with existing plans.
      </p>

      <CodeBlock
        language="markdown"
        title="Feature request template"
      >{`## Problem statement
Describe the problem or limitation you are facing. What are you
trying to accomplish that NemoClaw does not currently support?

Example: "When running multiple agents that share a workspace
directory, there is no way to enforce per-agent write isolation
within the shared directory. Agent A can overwrite files created
by Agent B."

## Proposed solution
Describe your ideal solution. Be specific about behavior, not
implementation details.

Example: "Each agent should be able to write to a dedicated
subdirectory (e.g., /workspace/.agent-<id>/) while having
read-only access to the shared parent. The sandbox should
automatically create the agent-specific directory on startup."

## Alternatives considered
What workarounds have you tried? Why are they insufficient?

Example: "I tried creating separate workspace mounts for each
agent, but this prevents them from reading each other's output,
which is required for the coordinator agent pattern."

## Use case
Describe the real-world scenario that motivates this request.

Example: "Multi-agent code review pipeline where a coordinator
agent delegates to specialist agents (security reviewer, style
reviewer, test coverage reviewer) that all need to read the
same codebase but write their findings independently."`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Labels and Triage Process
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NemoClaw project uses GitHub labels to categorize and prioritize issues. Understanding
        the label system helps you set appropriate expectations for response time and helps
        maintainers route your issue to the right reviewer.
      </p>

      <ComparisonTable
        title="Issue Labels"
        headers={['Label', 'Meaning', 'Response Time']}
        rows={[
          ['bug', 'Confirmed or suspected bug', '1-3 days for triage'],
          ['security', 'Security-related issue (may be handled privately)', 'Within 24 hours'],
          ['feature-request', 'Request for new functionality', '1-2 weeks for initial response'],
          ['enhancement', 'Improvement to existing functionality', '1-2 weeks for initial response'],
          ['documentation', 'Documentation issue or improvement', '3-7 days'],
          ['good-first-issue', 'Suitable for new contributors', 'Usually well-documented with hints'],
          ['help-wanted', 'Maintainers welcome community contributions', 'Guidance provided in comments'],
          ['sandbox', 'Related to Landlock/seccomp/namespace sandbox', 'Requires Linux-specific expertise'],
          ['policy', 'Related to the policy engine', 'May need design discussion'],
          ['tui', 'Related to the terminal UI', 'Bubble Tea framework knowledge helpful'],
          ['wontfix', 'Decided not to address (with explanation)', 'Closed with rationale'],
          ['duplicate', 'Duplicate of an existing issue', 'Linked to original issue'],
        ]}
      />

      <WarningBlock title="Security Vulnerabilities">
        <p>
          If you discover a security vulnerability in NemoClaw -- particularly one that could
          allow sandbox escape, policy bypass, or unauthorized access -- do not file a public
          GitHub issue. Instead, use GitHub's private security advisory feature or email
          security@nemoclaw.dev directly. The NemoClaw team follows responsible disclosure
          practices and will work with you to understand the vulnerability, develop a fix,
          and coordinate a public disclosure timeline. Security reports are acknowledged within
          24 hours.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        After Filing
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        After you file an issue, maintainers will triage it -- confirming the bug, asking
        clarifying questions, or adding labels. Be responsive to follow-up questions, especially
        for bug reports where additional information may be needed to reproduce the issue.
        If you are able to investigate further (using the debugging techniques from the previous
        chapter), updates that narrow down the cause are extremely valuable.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Respond to questions promptly:</span> Maintainer
          attention is a limited resource. When they ask a question, a quick response keeps
          the issue from going stale.
        </li>
        <li>
          <span className="font-semibold">Test proposed fixes:</span> If a maintainer posts
          a potential fix or asks you to test a branch, doing so accelerates the resolution.
        </li>
        <li>
          <span className="font-semibold">Close resolved issues:</span> If your issue is
          resolved (by a fix, a workaround, or realizing it was user error), close it with a
          comment explaining the resolution. This helps others who encounter the same issue.
        </li>
        <li>
          <span className="font-semibold">Consider contributing the fix:</span> If you
          identify the cause of a bug and know how to fix it, a pull request is even more
          valuable than an issue. The next section covers the contribution workflow.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Well-filed issues are the backbone of open-source project quality. Every issue represents
        someone caring enough about the project to document a problem or suggest an improvement.
        The NemoClaw maintainers treat every issue with respect, and the community benefits from
        the knowledge captured in the issue tracker's history.
      </p>
    </div>
  )
}
