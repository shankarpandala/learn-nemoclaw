import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function GraduatedPermissions() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The principle of graduated permissions is simple: start with the minimum access possible and
        expand only as the agent proves trustworthy. This mirrors how you onboard a new team member --
        you do not give them production database access on day one. With NemoClaw, you can formalize
        this trust-building process into a repeatable permission escalation workflow.
      </p>

      <DefinitionBlock
        term="Graduated Permission Escalation"
        definition="A structured approach to granting an AI agent increasing levels of access over time, based on demonstrated trustworthy behavior at each level. Each escalation step requires passing specific criteria before the agent receives additional capabilities."
        example="An agent starting with read-only GitHub access, graduating to comment posting after a week, then to PR creation after a month, and finally to merge approval after sustained quality performance."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        The Permission Ladder
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Think of permissions as rungs on a ladder. Each rung represents a trust level with specific
        capabilities and specific criteria for advancement. The agent must demonstrate competence at
        each level before climbing to the next.
      </p>

      <ComparisonTable
        title="Permission Levels"
        headers={['Level', 'Capabilities', 'Criteria to Advance', 'Duration']}
        rows={[
          ['L0: Observer', 'Read files, read APIs, no writes', 'No policy violations in 50+ interactions', '1 week minimum'],
          ['L1: Commenter', 'L0 + post comments, create issues', 'Comments rated helpful >80% by humans', '2 weeks minimum'],
          ['L2: Contributor', 'L1 + create branches, open PRs', 'PRs require <2 revision rounds on average', '1 month minimum'],
          ['L3: Reviewer', 'L2 + approve/request changes on PRs', 'Review quality matches senior dev baseline', '2 months minimum'],
          ['L4: Operator', 'L3 + merge PRs, trigger deployments', 'Zero incidents, team consensus required', 'Ongoing evaluation'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Policy Files for Each Level
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Each permission level corresponds to a policy file. Advancing the agent means swapping its
        active policy. Keep all level policies in version control so you can quickly roll back.
      </p>

      <CodeBlock
        title="L0: Observer policy"
        language="yaml"
        code={`# policies/L0-observer.yaml
name: agent-L0-observer
version: 1
description: Read-only access for initial trust building

network:
  default: deny
  allow:
    - domain: api.github.com
      methods: [GET]
      paths:
        - /repos/acme-corp/backend-api/**

    - domain: api.anthropic.com
      methods: [POST]

filesystem:
  readable:
    - /workspace/**
  writable:
    - /workspace/MEMORY.md
    - /workspace/.memory/**

tools:
  allowed: [bash, git, grep, find, cat]
  denied: [curl, wget, ssh, docker]`}
      />

      <CodeBlock
        title="L2: Contributor policy"
        language="yaml"
        code={`# policies/L2-contributor.yaml
name: agent-L2-contributor
version: 1
description: Can create branches and PRs after proven comment quality

network:
  default: deny
  allow:
    - domain: api.github.com
      methods: [GET, POST, PATCH]
      paths:
        - /repos/acme-corp/backend-api/**
      # Still no DELETE allowed

    - domain: api.anthropic.com
      methods: [POST]

    # Package registry for dependency checks
    - domain: proxy.golang.org
      methods: [GET]

filesystem:
  readable:
    - /workspace/**
  writable:
    - /workspace/**
  denied:
    - /workspace/.env
    - /workspace/secrets/**

tools:
  allowed: [bash, git, go, make, grep, find, cat, curl]
  denied: [ssh, docker]

git:
  allowed_operations:
    - checkout
    - branch
    - add
    - commit
    - push
  denied_operations:
    - force-push
    - rebase  # No history rewriting
  branch_patterns:
    - "agent/*"  # Can only create branches with this prefix`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        The Escalation Workflow
      </h2>

      <StepBlock
        title="Permission Escalation Process"
        steps={[
          {
            title: 'Deploy at L0 and collect baseline metrics',
            content: 'Run the agent with observer-level access. Track how many interactions it handles, what it attempts to do beyond its permissions, and how useful its read-only responses are.',
            code: `openclaw run --policy policies/L0-observer.yaml \\
  --workspace ./workspace \\
  --metrics-output ./metrics/L0/`,
            language: 'bash',
          },
          {
            title: 'Review L0 metrics and blocked actions',
            content: 'After the minimum period, analyze what the agent tried to do that was blocked. This tells you what capabilities it needs and whether those requests were appropriate.',
            code: `openclaw metrics summary ./metrics/L0/

# === L0 Observer Summary ===
# Period: 7 days
# Interactions: 89
# Blocked write attempts: 23
#   - 15x POST comment (agent wanted to explain findings)
#   - 5x POST issue (agent wanted to file bugs it found)
#   - 3x PATCH file (agent wanted to fix typos)
# Policy violations: 0
# Blocked domains: 0 (no attempts to reach unauthorized APIs)
# Recommendation: Ready for L1 escalation`,
            language: 'bash',
          },
          {
            title: 'Escalate to L1 with approval',
            content: 'Switch the active policy. In team environments, escalation should require approval from a team lead or security reviewer.',
            code: `# Create escalation record
openclaw permissions escalate \\
  --agent backend-assistant \\
  --from L0-observer \\
  --to L1-commenter \\
  --approved-by alex@acme.com \\
  --reason "Clean L0 period, 89 interactions, 0 violations"

# Apply new policy
openclaw config set policy policies/L1-commenter.yaml \\
  --workspace ./workspace

# Restart agent with new policy
sudo systemctl restart nemoclaw-agent`,
            language: 'bash',
          },
          {
            title: 'Monitor at each new level',
            content: 'Each escalation introduces new capabilities to monitor. Set up alerts for quality issues at each level.',
            code: `# Configure quality monitoring for L1
openclaw monitor create \\
  --name "comment-quality" \\
  --trigger "agent posts comment" \\
  --sample-rate 0.3 \\
  --notify alex@acme.com \\
  --alert-if "human rates comment unhelpful"`,
            language: 'bash',
          },
        ]}
      />

      <NoteBlock type="warning" title="Automatic Demotion">
        <p>
          Build in automatic demotion triggers. If the agent causes an incident, accumulates too many
          unhelpful responses, or violates a policy at a higher level, it should automatically revert
          to a lower permission level. This is your safety net. Configure thresholds in your monitoring
          and have the rollback scripted so it can happen immediately.
        </p>
      </NoteBlock>

      <CodeBlock
        title="Automatic demotion configuration"
        language="yaml"
        code={`# monitoring/demotion-rules.yaml
demotion_rules:
  - name: policy-violation-demotion
    trigger:
      event: policy_violation
      count: 1  # Any single violation
    action:
      demote_to: L0-observer
      notify: [security@acme.com, team-lead@acme.com]
      cooldown: 7d  # Stay at L0 for at least 7 days

  - name: quality-demotion
    trigger:
      event: comment_rated_unhelpful
      count: 5
      window: 7d  # 5 unhelpful comments in a week
    action:
      demote_to: L0-observer
      notify: [team-lead@acme.com]
      cooldown: 14d

  - name: error-rate-demotion
    trigger:
      event: action_error_rate
      threshold: 0.2  # 20% error rate
      window: 24h
    action:
      demote_to: L0-observer
      notify: [team-lead@acme.com]`}
      />

      <ExerciseBlock
        question="Your agent has been at L2 (Contributor) for three weeks with good metrics, but last week it created a PR that accidentally included a test file with hardcoded credentials. What is the appropriate response?"
        options={[
          'Promote to L3 since overall metrics are good and this was a one-time mistake',
          'Stay at L2 and add a pre-commit hook to scan for credentials',
          'Demote to L1, add credential scanning to the policy, and restart the escalation timer',
          'Demote to L0 and reconsider whether the agent should have write access at all',
        ]}
        correctIndex={2}
        explanation="A credential leak is a security event that warrants demotion. Demoting to L1 (not L0, since read access was never the issue), adding a mitigation (credential scanning), and restarting the timer is proportional. The agent keeps comment access but loses the ability to create PRs until it re-earns that trust."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Permission Levels',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/permission-levels.md',
            type: 'docs',
            description: 'Official guide to configuring and managing graduated permission levels.',
          },
          {
            title: 'Principle of Least Privilege',
            url: 'https://csrc.nist.gov/glossary/term/least_privilege',
            type: 'docs',
            description: 'NIST definition and guidelines for least-privilege access control.',
          },
        ]}
      />
    </div>
  )
}
