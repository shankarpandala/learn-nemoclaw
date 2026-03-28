import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function ProjectApiRestrict() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A powerful agent with unrestricted API access is a liability. NemoClaw's policy system lets you
        lock down exactly which external services your agent can communicate with, ensuring it can only
        reach the APIs relevant to your project. This is not just a security measure -- it prevents
        accidental actions against wrong environments and reduces the blast radius of any misconfiguration.
      </p>

      <DefinitionBlock
        term="API Restriction Policy"
        definition="A NemoClaw policy configuration that explicitly whitelists which external API endpoints, domains, and services the agent is permitted to contact. All network traffic not matching the whitelist is blocked at the sandbox level."
        example="A policy allowing only api.github.com for a specific organization and us-east-1.amazonaws.com for S3 and Lambda, while blocking all other outbound connections."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Why Restrict API Access?
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Without restrictions, an agent that has credentials for GitHub, AWS, Slack, and your database could
        theoretically take any action across any of those services. Even well-prompted agents can hallucinate
        API calls or misinterpret instructions. API restriction provides a hard boundary that no amount of
        prompt injection can bypass because enforcement happens at the network layer.
      </p>

      <ComparisonTable
        title="Unrestricted vs. Restricted Agent Access"
        headers={['Scenario', 'Unrestricted', 'Restricted']}
        rows={[
          ['Agent told to "delete the old branch"', 'Could delete branches in any repo', 'Can only access specified repos'],
          ['Prompt injection via malicious PR', 'Could exfiltrate secrets to any URL', 'Outbound blocked except whitelist'],
          ['Misconfigured environment variable', 'Could hit production APIs', 'Only staging endpoints allowed'],
          ['Agent decides to "help" with infrastructure', 'Could modify cloud resources', 'Only permitted services reachable'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Restricting to Specific GitHub Repos
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GitHub access is typically the first API you grant an agent, and it is also where the most damage
        can occur. Rather than giving blanket GitHub access, restrict the agent to only the repositories
        it needs to work with.
      </p>

      <CodeBlock
        title="GitHub-restricted policy (policy.yaml)"
        language="yaml"
        code={`# policy.yaml -- GitHub access restricted to specific repos
name: backend-agent-policy
version: 1

network:
  default: deny

  allow:
    # GitHub API -- only specific repos
    - domain: api.github.com
      paths:
        - /repos/acme-corp/backend-api/**
        - /repos/acme-corp/shared-libs/**
        - /repos/acme-corp/proto-definitions/**
      methods: [GET, POST, PATCH, PUT]
      # Block DELETE on the API entirely

    # GitHub raw content (for reading files)
    - domain: raw.githubusercontent.com
      paths:
        - /acme-corp/backend-api/**
        - /acme-corp/shared-libs/**

    # GitHub OAuth (for token refresh)
    - domain: github.com
      paths:
        - /login/oauth/**
      methods: [POST]

  # Explicitly deny all other GitHub orgs
  deny:
    - domain: api.github.com
      paths:
        - /repos/acme-corp/infrastructure/**
        - /repos/acme-corp/secrets-vault/**
      log: true  # Log any attempts to access these`}
      />

      <WarningBlock title="Path Patterns Are Critical">
        <p>
          A missing path restriction on <code>api.github.com</code> means the agent can access any
          repo in your organization. Always use explicit path patterns. The <code>**</code> wildcard
          matches any sub-path but still constrains the base path.
        </p>
      </WarningBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Restricting Cloud Service Access
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Cloud providers expose many services through their APIs. An agent that needs to read S3 objects
        should not be able to modify IAM policies or spin up EC2 instances. NemoClaw policies can restrict
        access at both the domain and path level for cloud APIs.
      </p>

      <CodeBlock
        title="AWS-restricted policy section"
        language="yaml"
        code={`# Additional network rules for AWS access
network:
  allow:
    # S3 -- only the project bucket, read-only
    - domain: acme-backend-artifacts.s3.us-east-1.amazonaws.com
      methods: [GET, HEAD]

    # Lambda -- invoke specific functions only
    - domain: lambda.us-east-1.amazonaws.com
      paths:
        - /2015-03-31/functions/acme-backend-*/**
      methods: [POST]  # Invoke only

    # CloudWatch Logs -- read only
    - domain: logs.us-east-1.amazonaws.com
      methods: [POST]  # CloudWatch uses POST for reads
      headers:
        X-Amz-Target:
          - Logs_20140328.GetLogEvents
          - Logs_20140328.FilterLogEvents
          - Logs_20140328.DescribeLogGroups

    # STS for credential refresh
    - domain: sts.us-east-1.amazonaws.com
      methods: [POST]

  deny:
    # Explicitly block dangerous AWS services
    - domain: "*.iam.amazonaws.com"
      log: true
    - domain: "*.ec2.amazonaws.com"
      log: true
    - domain: "*.rds.amazonaws.com"
      log: true`}
      />

      <NoteBlock type="tip" title="Layer Your Defenses">
        <p>
          NemoClaw network policies work alongside IAM policies. Even if an agent somehow bypasses
          the network restriction, the IAM role attached to its credentials should also limit
          what it can do. Always use both: NemoClaw policies as the first gate and IAM as the
          second.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Combining Policies for a Complete Configuration
      </h2>

      <CodeBlock
        title="Complete project-scoped policy"
        language="yaml"
        code={`# /opt/nemoclaw-agent/policy.yaml
name: acme-backend-agent
version: 1
description: >
  Policy for the backend-api project assistant.
  Grants access to project repos, build artifacts, and monitoring.

network:
  default: deny

  allow:
    # GitHub -- project repos only
    - domain: api.github.com
      paths:
        - /repos/acme-corp/backend-api/**
        - /repos/acme-corp/shared-libs/**
      methods: [GET, POST, PATCH, PUT]

    # Package registries (read-only)
    - domain: proxy.golang.org
      methods: [GET]
    - domain: registry.npmjs.org
      methods: [GET]

    # AWS services (scoped)
    - domain: acme-backend-artifacts.s3.us-east-1.amazonaws.com
      methods: [GET, HEAD]
    - domain: logs.us-east-1.amazonaws.com
      methods: [POST]

    # Inference provider
    - domain: api.anthropic.com
      methods: [POST]

  deny:
    - domain: "*.amazonaws.com"
      log: true
    - domain: api.github.com
      paths: [/repos/acme-corp/infrastructure/**]
      log: true

filesystem:
  writable:
    - /opt/nemoclaw-agent/workspace/**
  readable:
    - /opt/nemoclaw-agent/workspace/**
    - /opt/nemoclaw-agent/config/**
  denied:
    - /opt/nemoclaw-agent/.env
    - "**/.git/credentials"

tools:
  allowed:
    - bash
    - git
    - go
    - make
    - curl  # Subject to network policy
  denied:
    - docker  # No container access
    - ssh     # No remote access`}
      />

      <StepBlock
        title="Validating Your Policy"
        steps={[
          {
            title: 'Dry-run the policy',
            content: 'NemoClaw can validate a policy file and report any issues before you deploy it.',
            code: `openclaw policy validate /opt/nemoclaw-agent/policy.yaml`,
            language: 'bash',
          },
          {
            title: 'Test with simulated requests',
            content: 'Simulate API calls to verify they are allowed or denied as expected.',
            code: `openclaw policy test /opt/nemoclaw-agent/policy.yaml \\
  --request "GET https://api.github.com/repos/acme-corp/backend-api/pulls" \\
  --expect allow

openclaw policy test /opt/nemoclaw-agent/policy.yaml \\
  --request "DELETE https://api.github.com/repos/acme-corp/backend-api" \\
  --expect deny`,
            language: 'bash',
          },
          {
            title: 'Monitor policy violations in production',
            content: 'Enable logging for denied requests to catch any gaps in your policy.',
            code: `# View recent policy violations
openclaw logs --filter policy-deny --since 24h`,
            language: 'bash',
          },
        ]}
      />

      <ExerciseBlock
        question="An agent needs to read CI logs from CloudWatch and push code review comments to a single GitHub repo. Which policy approach is most secure?"
        options={[
          'Allow all traffic to amazonaws.com and api.github.com',
          'Allow specific CloudWatch read actions and restrict GitHub to the single repo path with POST/GET methods',
          'Deny all traffic and rely on IAM policies for access control',
          'Allow all traffic but log every request for auditing',
        ]}
        correctIndex={1}
        explanation="The principle of least privilege requires granting only the specific access needed. Restricting CloudWatch to read actions (GetLogEvents, FilterLogEvents) and GitHub to the single repo path with only the needed HTTP methods provides the tightest security boundary."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Network Policy Reference',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/network-policy.md',
            type: 'docs',
            description: 'Complete reference for network allow/deny rules and path patterns.',
          },
          {
            title: 'AWS IAM Best Practices',
            url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html',
            type: 'docs',
            description: 'Complementary IAM policies to use alongside NemoClaw restrictions.',
          },
        ]}
      />
    </div>
  )
}
