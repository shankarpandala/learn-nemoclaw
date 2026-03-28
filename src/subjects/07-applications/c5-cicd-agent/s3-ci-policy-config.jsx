import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function CiPolicyConfig() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        CI pipelines are ephemeral environments that run untrusted code (every PR could contain
        anything). The agent operating in this environment needs an exceptionally tight policy:
        only the specific GitHub repo, only the specific API actions needed, and sessions that
        automatically expire after the job completes. This section covers building a
        production-grade CI policy from scratch.
      </p>

      <DefinitionBlock
        term="CI-Minimal Policy"
        definition="A NemoClaw policy designed specifically for CI/CD environments. It follows the principle of absolute minimum privilege: only the APIs needed for the specific CI task, scoped to the exact repository, with hard time limits. Nothing more."
        example="A policy that allows GET on PR files for one repo, POST on PR reviews for that same repo, POST to the inference provider, and nothing else. The session expires after 5 minutes."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Building the Policy Layer by Layer
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A CI policy should be built additively: start with deny-all and add only what is needed.
        Each rule should have a clear justification. If you cannot explain why a rule exists,
        remove it.
      </p>

      <CodeBlock
        title="Complete CI policy with annotations"
        language="yaml"
        code={`# policies/ci-agent.yaml
name: ci-agent-minimal
version: 1
description: >
  Minimal policy for CI code review and test generation.
  Scoped to a single repository with time-limited sessions.

# ============================================
# NETWORK: Only GitHub + inference provider
# ============================================
network:
  default: deny

  allow:
    # 1. Read PR metadata and files
    #    Justification: Agent needs to see what changed
    - domain: api.github.com
      methods: [GET]
      paths:
        - /repos/acme-corp/backend-api/pulls/*
        - /repos/acme-corp/backend-api/pulls/*/files
        - /repos/acme-corp/backend-api/pulls/*/commits
        - /repos/acme-corp/backend-api/contents/**
        - /repos/acme-corp/backend-api/compare/**
      rate_limit: 30/min

    # 2. Post review comments
    #    Justification: Agent posts its review findings
    - domain: api.github.com
      methods: [POST]
      paths:
        - /repos/acme-corp/backend-api/pulls/*/reviews
        - /repos/acme-corp/backend-api/issues/*/comments
      rate_limit: 5/min

    # 3. Inference API
    #    Justification: Agent needs to think
    - domain: api.anthropic.com
      methods: [POST]
      paths:
        - /v1/messages
      rate_limit: 20/min

  # Explicit deny rules (defense in depth)
  deny:
    # Block all GitHub write operations except reviews
    - domain: api.github.com
      methods: [PUT, DELETE, PATCH]
      log: true

    # Block access to other repos
    - domain: api.github.com
      paths:
        - /repos/acme-corp/infrastructure/**
        - /repos/acme-corp/secrets/**
        - /repos/acme-corp/*/actions/**
      log: true

    # Block access to any other domain
    - domain: "*"
      log: true

# ============================================
# FILESYSTEM: Workspace only, limited writes
# ============================================
filesystem:
  readable:
    - /workspace/**
  writable:
    - /workspace/.agent-output/**  # Agent's output directory
    - /tmp/**                       # Temporary files
  denied:
    - /workspace/.env*
    - /workspace/**/*.pem
    - /workspace/**/*.key
    - /workspace/.git/config        # Could contain credentials

# ============================================
# TOOLS: Minimal set for code analysis
# ============================================
tools:
  allowed:
    - git     # Read repo history
    - grep    # Search code
    - find    # Locate files
    - cat     # Read files
    - wc      # Count lines
    - diff    # Compare files
  denied:
    - bash    # No shell access
    - sh      # No shell access
    - curl    # Use policy-controlled network only
    - wget    # No downloads
    - make    # No build execution
    - go      # No code execution
    - python  # No code execution
    - node    # No code execution
    - ssh     # No remote access
    - docker  # No container access
    - apt     # No package installation
    - pip     # No package installation

# ============================================
# SESSION: Time-limited, resource-bounded
# ============================================
session:
  max_duration: 300s    # 5 minute absolute limit
  idle_timeout: 60s     # Kill if idle for 1 minute
  max_tokens: 100000    # Token budget
  max_api_calls: 100    # Total API calls allowed
  max_file_reads: 200   # Files the agent can read
  max_output_size: 50KB # Maximum output per response

# ============================================
# SECRETS: Block access to all secrets
# ============================================
secrets:
  block_env_vars:
    - "*_TOKEN"
    - "*_KEY"
    - "*_SECRET"
    - "*_PASSWORD"
  allow_env_vars:
    - GITHUB_TOKEN         # Needed for API access
    - ANTHROPIC_API_KEY    # Needed for inference
    - PR_NUMBER            # Which PR to review
    - REPO_NAME            # Which repo`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Scoping to Specific Repos
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        CI agents should never have access to repos beyond the one they are reviewing. This prevents
        a compromised agent from accessing sensitive repositories, even if the GitHub token has
        broader permissions.
      </p>

      <CodeBlock
        title="Dynamically scoping the policy to the current repo"
        language="yaml"
        code={`# Use environment variable substitution in the policy
# The CI workflow sets REPO_FULL_NAME=acme-corp/backend-api

network:
  allow:
    - domain: api.github.com
      methods: [GET]
      paths:
        - /repos/$REPO_FULL_NAME/pulls/**
        - /repos/$REPO_FULL_NAME/contents/**

    - domain: api.github.com
      methods: [POST]
      paths:
        - /repos/$REPO_FULL_NAME/pulls/*/reviews
        - /repos/$REPO_FULL_NAME/issues/*/comments`}
      />

      <NoteBlock type="info" title="Token Permissions vs. Policy">
        <p>
          The GitHub token used by the CI agent likely has broader permissions than the policy allows.
          For example, a fine-grained personal access token might have read/write access to all repos
          in the organization. The NemoClaw policy is an additional restriction layer that limits
          what the agent actually uses the token for. This defense-in-depth means even if the policy
          has a gap, the token's own permissions provide a second boundary.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Time-Limited Sessions
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        CI sessions must have hard time limits. Unlike a persistent agent that runs indefinitely,
        a CI agent should start, do its job, and terminate. NemoClaw enforces this through session
        configuration.
      </p>

      <ComparisonTable
        title="Session Limits for Different CI Tasks"
        headers={['Task', 'Max Duration', 'Max Tokens', 'Max API Calls']}
        rows={[
          ['Quick PR review (< 5 files)', '120s', '50,000', '30'],
          ['Full PR review (5-50 files)', '300s', '100,000', '100'],
          ['Large PR review (50+ files)', '600s', '200,000', '200'],
          ['Test generation + execution', '600s', '150,000', '150'],
          ['Documentation update', '300s', '80,000', '50'],
        ]}
      />

      <CodeBlock
        title="Session timeout handling"
        language="yaml"
        code={`session:
  max_duration: 300s
  idle_timeout: 60s

  # What happens when a limit is hit
  on_timeout:
    action: graceful_stop
    grace_period: 10s
    # Agent gets 10 seconds to post partial results
    fallback_message: |
      Review timed out after {elapsed}s.
      Partial findings have been posted above.
      Consider splitting this PR for more thorough review.

  on_token_limit:
    action: stop
    message: |
      Token budget exhausted. Reviewed {files_reviewed}/{total_files} files.
      Remaining files were not analyzed.`}
      />

      <WarningBlock title="CI Token Scope">
        <p>
          Use GitHub's fine-grained personal access tokens or GitHub App tokens with the minimum
          required permissions. A CI token should have <code>pull_requests: write</code> (for posting
          reviews) and <code>contents: read</code> (for reading files) on the specific repository only.
          Never use a token with organization-wide admin access.
        </p>
      </WarningBlock>

      <ExerciseBlock
        question="Your CI policy allows the agent to read files from the repo and post review comments. A new requirement asks the agent to also check if the PR branch is up to date with main. What is the minimum policy change needed?"
        options={[
          'Add GET access to /repos/{owner}/{repo}/branches/main',
          'Add GET access to /repos/{owner}/{repo}/compare/{base}...{head}',
          'Add PATCH access to /repos/{owner}/{repo}/pulls/{pr} to update the branch',
          'No policy change needed since the agent already has GET access to /repos/{owner}/{repo}/pulls/*',
        ]}
        correctIndex={3}
        explanation="The PR metadata (from GET /repos/{owner}/{repo}/pulls/*) already includes the mergeable_state field which indicates whether the branch is up to date with the base branch. No additional API access is needed. Always check if existing permissions cover new requirements before adding more."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw CI Policy Templates',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/ci-policy-templates.md',
            type: 'docs',
            description: 'Pre-built policy templates for common CI tasks.',
          },
          {
            title: 'GitHub Fine-Grained Tokens',
            url: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens',
            type: 'docs',
            description: 'Guide to creating least-privilege GitHub tokens.',
          },
        ]}
      />
    </div>
  )
}
