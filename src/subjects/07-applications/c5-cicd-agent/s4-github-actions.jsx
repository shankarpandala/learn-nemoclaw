import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function GithubActions() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GitHub Actions provides the ideal platform for running NemoClaw-powered code reviews on every
        pull request. The workflow spins up a NemoClaw sandbox, runs the review agent against the PR,
        posts results, and tears everything down. This section provides a complete, production-ready
        workflow configuration you can adapt for your projects.
      </p>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Complete GitHub Actions Workflow
      </h2>

      <CodeBlock
        title=".github/workflows/ai-review.yml"
        language="yaml"
        code={`name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]
    # Only review PRs targeting main
    branches: [main]

# Cancel in-progress reviews when new commits are pushed
concurrency:
  group: ai-review-\${{ github.event.pull_request.number }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  ai-review:
    name: NemoClaw Code Review
    runs-on: ubuntu-latest
    timeout-minutes: 10

    # Skip if PR is a draft or from a bot
    if: |
      !github.event.pull_request.draft &&
      github.actor != 'dependabot[bot]' &&
      github.actor != 'renovate[bot]'

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for context

      - name: Install NemoClaw
        run: |
          curl -fsSL https://get.nemoclaw.dev | bash
          nemoclaw --version

      - name: Configure review policy
        run: |
          # Write the CI-specific policy
          cat > /tmp/ci-review-policy.yaml << 'POLICY'
          name: ci-reviewer
          version: 1
          network:
            default: deny
            allow:
              - domain: api.github.com
                methods: [GET]
                paths:
                  - /repos/\${{ github.repository }}/pulls/**
                  - /repos/\${{ github.repository }}/contents/**
                  - /repos/\${{ github.repository }}/commits/**
              - domain: api.github.com
                methods: [POST]
                paths:
                  - /repos/\${{ github.repository }}/pulls/*/reviews
              - domain: api.anthropic.com
                methods: [POST]
          filesystem:
            readable: ["**/*"]
            writable: ["/tmp/agent-output/**"]
            denied: ["**/.env*", "**/*.key", "**/*.pem"]
          tools:
            allowed: [git, grep, find, cat, wc, diff]
            denied: [bash, curl, make, go, ssh, docker]
          session:
            max_duration: 300s
            max_tokens: 100000
          POLICY

      - name: Configure agent personality
        run: |
          cat > /tmp/ci-soul.md << 'SOUL'
          # CI Review Agent

          ## Role
          You review pull requests for code quality, bugs, and security.

          ## Guidelines
          - Focus on the diff, but read full files for context
          - Categorize findings: [CRITICAL], [BUG], [PERF], [STYLE]
          - Limit to 7 most important findings
          - Be specific: reference exact lines, suggest exact fixes
          - Post COMMENT reviews only, never APPROVE or REQUEST_CHANGES
          - If the code is clean, post a brief positive review

          ## Skip
          - Auto-generated files (*.pb.go, *_gen.go, *.lock)
          - Formatting issues (assume formatter is configured)
          - Test files (unless they have obvious bugs)
          SOUL

      - name: Run AI review
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          openclaw run \\
            --policy /tmp/ci-review-policy.yaml \\
            --soul /tmp/ci-soul.md \\
            --task "Review PR #\${{ github.event.pull_request.number }} in \${{ github.repository }}" \\
            --model claude-sonnet-4-20250514 \\
            --timeout 300 \\
            --output /tmp/agent-output/review.json

      - name: Post review results
        if: always()
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          # Check if the agent produced output
          if [ -f /tmp/agent-output/review.json ]; then
            echo "Review completed successfully"
          else
            # Post a fallback comment if the agent failed
            gh pr comment \${{ github.event.pull_request.number }} \\
              --body "AI review was unable to complete. Check the [workflow run](\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}) for details."
          fi`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Workflow Configuration Details
      </h2>

      <ComparisonTable
        title="Key Workflow Settings Explained"
        headers={['Setting', 'Value', 'Why']}
        rows={[
          ['concurrency.cancel-in-progress', 'true', 'Cancels stale reviews when new commits are pushed'],
          ['timeout-minutes', '10', 'Hard limit prevents runaway jobs from burning Actions minutes'],
          ['fetch-depth', '0', 'Full git history gives the agent context for the codebase'],
          ['permissions', 'Minimal', 'Only read content and write PR comments'],
          ['if: !draft', 'Skip drafts', 'No point reviewing unfinished PRs'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Secrets Configuration
      </h2>

      <StepBlock
        title="Setting Up Required Secrets"
        steps={[
          {
            title: 'Add the Anthropic API key',
            content: 'Go to your repo Settings > Secrets and variables > Actions > New repository secret.',
            code: `# Secret name: ANTHROPIC_API_KEY
# Secret value: sk-ant-api03-...

# The GITHUB_TOKEN is automatically provided by GitHub Actions
# with the permissions specified in the workflow`,
            language: 'bash',
          },
          {
            title: 'Restrict secret access (optional but recommended)',
            content: 'For organizations, use environment-level secrets to restrict which workflows can access the API key.',
            code: `# Create a "ci-review" environment in repo settings
# Add ANTHROPIC_API_KEY as an environment secret
# In the workflow:
# jobs:
#   ai-review:
#     environment: ci-review`,
            language: 'yaml',
          },
          {
            title: 'Verify secrets are not exposed',
            content: 'GitHub Actions automatically masks secrets in logs, but verify the NemoClaw policy also blocks environment variable access.',
          },
        ]}
      />

      <WarningBlock title="Fork PR Security">
        <p>
          By default, GitHub Actions does not expose secrets to workflows triggered by PRs from
          forks. This is an important security feature. Do not use <code>pull_request_target</code>
          with the fork's code, as this can expose your secrets to the fork's code. If you need
          to review fork PRs, use a separate workflow with <code>pull_request</code> (without
          _target) that does not require secrets, or use a two-step workflow where the first
          step runs untrusted code and the second step posts results.
        </p>
      </WarningBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Advanced: Conditional Reviews
      </h2>

      <CodeBlock
        title="Only review significant PRs"
        language="yaml"
        code={`jobs:
  # First job: check if review is needed
  check-pr:
    runs-on: ubuntu-latest
    outputs:
      should-review: \${{ steps.check.outputs.review }}
    steps:
      - name: Check PR size and type
        id: check
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          # Get number of changed files
          FILES=$(gh pr view ${{ github.event.pull_request.number }} \\
            --json files --jq '.files | length')

          # Skip tiny PRs (1-2 files, likely config changes)
          if [ "$FILES" -le 2 ]; then
            echo "review=false" >> $GITHUB_OUTPUT
            echo "Skipping: only $FILES files changed"
            exit 0
          fi

          # Check if only docs changed
          DOCS_ONLY=$(gh pr view ${{ github.event.pull_request.number }} \\
            --json files --jq '[.files[].path | test("^docs/|README|\\.md$")] | all')

          if [ "$DOCS_ONLY" = "true" ]; then
            echo "review=false" >> $GITHUB_OUTPUT
            echo "Skipping: documentation-only PR"
            exit 0
          fi

          echo "review=true" >> $GITHUB_OUTPUT

  ai-review:
    needs: check-pr
    if: needs.check-pr.outputs.should-review == 'true'
    runs-on: ubuntu-latest
    # ... rest of the review job`}
      />

      <NoteBlock type="tip" title="Cost Control in Actions">
        <p>
          Each workflow run costs both GitHub Actions minutes and Anthropic API credits. To control
          costs: skip draft PRs, skip bot-generated PRs (Dependabot, Renovate), skip documentation-only
          PRs, and use concurrency groups to cancel stale reviews. A typical code review uses about
          $0.02-0.10 in API credits depending on PR size and model choice.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="Your AI review workflow uses pull_request_target to access secrets for fork PRs. A contributor opens a PR that modifies the workflow file to echo $ANTHROPIC_API_KEY. What happens?"
        options={[
          'The secret is masked in logs so it is safe',
          'The modified workflow runs with access to your secrets, potentially exposing them',
          'GitHub prevents workflow modifications in fork PRs',
          'The NemoClaw policy blocks access to the secret',
        ]}
        correctIndex={1}
        explanation="pull_request_target runs the workflow from the BASE branch but checks out the HEAD (fork) code. If the workflow has a checkout step that checks out the PR branch, the fork's modified workflow code runs with access to the base repo's secrets. This is why pull_request_target should never checkout and run untrusted fork code. Use pull_request (without _target) for fork PRs, which does not expose secrets."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw GitHub Actions Integration',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/github-actions.md',
            type: 'github',
            description: 'Official guide for using NemoClaw in GitHub Actions workflows.',
          },
          {
            title: 'GitHub Actions Security Hardening',
            url: 'https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments',
            type: 'docs',
            description: 'GitHub official guide to securing Actions workflows.',
          },
          {
            title: 'Keeping your GitHub Actions and workflows secure',
            url: 'https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/',
            type: 'article',
            description: 'Security lab article on preventing pull_request_target attacks.',
          },
        ]}
      />
    </div>
  )
}
