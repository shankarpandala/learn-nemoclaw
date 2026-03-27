import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function RoleBasedAccess() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In a multi-team enterprise, not everyone should have the same level of control over AI agents.
        The developer who uses the code review agent daily does not need the ability to change its
        policy. The security team that audits agent behavior should not need to restart agents. NemoClaw's
        operator role system provides granular access control for the humans who manage, use, and
        oversee AI agents.
      </p>

      <DefinitionBlock
        term="Operator Roles"
        definition="Predefined permission sets that control what human users can do with the NemoClaw management plane. Roles determine who can configure agents, who can view logs, who can approve policy changes, and who can interact with agents directly. Roles are distinct from agent permissions -- they control the humans, not the agents."
        example="An admin can create and modify agents and policies. A reviewer can view agent logs and approve policy changes. A viewer can only see agent status and dashboards."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Built-In Roles
      </h2>

      <ComparisonTable
        title="Operator Role Permissions"
        headers={['Permission', 'Admin', 'Operator', 'Reviewer', 'Viewer']}
        rows={[
          ['Create/delete agents', 'Yes', 'No', 'No', 'No'],
          ['Modify agent policies', 'Yes', 'No', 'No', 'No'],
          ['Start/stop agents', 'Yes', 'Yes', 'No', 'No'],
          ['Configure integrations', 'Yes', 'Yes', 'No', 'No'],
          ['Approve policy changes', 'Yes', 'Yes', 'Yes', 'No'],
          ['View agent logs', 'Yes', 'Yes', 'Yes', 'Yes'],
          ['View audit trails', 'Yes', 'Yes', 'Yes', 'Yes'],
          ['Query agent status', 'Yes', 'Yes', 'Yes', 'Yes'],
          ['Interact with agents (chat)', 'Yes', 'Yes', 'No', 'No'],
          ['Export compliance reports', 'Yes', 'Yes', 'Yes', 'No'],
          ['Manage operator accounts', 'Yes', 'No', 'No', 'No'],
          ['Modify RBAC configuration', 'Yes', 'No', 'No', 'No'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Configuring Roles
      </h2>

      <CodeBlock
        title="RBAC configuration"
        language="yaml"
        code={`# rbac/config.yaml
rbac:
  enabled: true

  # Authentication backend
  authentication:
    # SSO via OIDC (recommended for enterprise)
    provider: oidc
    issuer: https://auth.acme.com
    client_id_env: NEMOCLAW_OIDC_CLIENT_ID
    client_secret_env: NEMOCLAW_OIDC_CLIENT_SECRET
    scopes: [openid, profile, email, groups]

    # Map OIDC groups to NemoClaw roles
    group_mapping:
      "platform-admins": admin
      "platform-operators": operator
      "security-team": reviewer
      "engineering": viewer

  # Role definitions
  roles:
    admin:
      description: Full control over all NemoClaw resources
      permissions:
        - agents:*
        - policies:*
        - integrations:*
        - audit:*
        - rbac:*
        - system:*

    operator:
      description: Day-to-day agent operations
      permissions:
        - agents:start
        - agents:stop
        - agents:status
        - agents:interact
        - integrations:configure
        - policies:approve
        - audit:read
        - audit:export

    reviewer:
      description: Audit and compliance oversight
      permissions:
        - agents:status
        - policies:approve
        - policies:read
        - audit:read
        - audit:export
        - compliance:*

    viewer:
      description: Read-only visibility
      permissions:
        - agents:status
        - audit:read

  # Individual user overrides (supplement group-based roles)
  users:
    - email: alex@acme.com
      roles: [admin]
      note: "Platform team lead"

    - email: sarah@acme.com
      roles: [operator, reviewer]
      note: "Senior engineer + security reviewer"

    - email: compliance-bot@acme.com
      roles: [reviewer]
      note: "Automated compliance system"
      type: service_account`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Multi-Team Access Patterns
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In organizations with multiple engineering teams, each team typically manages its own agents
        but shares common infrastructure. NemoClaw supports team-scoped permissions that limit
        operators to their own team's agents.
      </p>

      <CodeBlock
        title="Team-scoped access control"
        language="yaml"
        code={`# rbac/teams.yaml
teams:
  - name: backend
    description: Backend engineering team
    agents:
      - backend-reviewer
      - backend-test-writer
    operators:
      - group: backend-team
        role: operator
      - group: backend-leads
        role: admin  # Team leads can manage their own agents

  - name: frontend
    description: Frontend engineering team
    agents:
      - frontend-reviewer
      - frontend-linter
    operators:
      - group: frontend-team
        role: operator
      - group: frontend-leads
        role: admin

  - name: platform
    description: Platform / infrastructure team
    agents: ["*"]  # Access to all agents
    operators:
      - group: platform-admins
        role: admin

  - name: security
    description: Security and compliance
    agents: ["*"]  # Can review all agents
    operators:
      - group: security-team
        role: reviewer  # Read-only + approval rights

# Cross-team visibility rules
cross_team:
  # All teams can see the status of all agents
  global_status_visibility: true
  # Only security team can see audit logs across all teams
  global_audit_visibility:
    roles: [reviewer]
    teams: [security, platform]`}
      />

      <NoteBlock type="info" title="SSO Integration">
        <p>
          Enterprise deployments should always use SSO (Single Sign-On) via OIDC or SAML rather
          than local accounts. This ensures that when an employee leaves the organization, their
          NemoClaw access is automatically revoked when their SSO account is deactivated. It
          also provides centralized audit of who accessed what.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Approval Workflows
      </h2>

      <CodeBlock
        title="Policy change approval workflow"
        language="yaml"
        code={`# rbac/approval-workflows.yaml
approvals:
  # Policy changes require approval
  policy_change:
    required_approvals: 2
    eligible_roles: [admin, reviewer]
    require_different_people: true  # Cannot self-approve
    timeout: 72h
    escalation:
      after: 48h
      notify: platform-admins

  # Permission escalation requires approval
  permission_escalation:
    required_approvals: 1
    eligible_roles: [admin]
    timeout: 24h

  # New agent deployment requires approval
  agent_deployment:
    required_approvals: 1
    eligible_roles: [admin]
    require_security_review: true
    security_review_role: reviewer`}
      />

      <CodeBlock
        title="Managing roles via CLI"
        language="bash"
        code={`# List current role assignments
openclaw rbac list-users

# NAME              ROLE(S)            TEAM(S)
# alex@acme.com     admin              platform
# sarah@acme.com    operator,reviewer  backend, security
# mike@acme.com     operator           frontend
# viewer@acme.com   viewer             -

# Add a user to a role
openclaw rbac assign mike@acme.com --role reviewer --team backend

# Check what a specific user can do
openclaw rbac check mike@acme.com

# Permissions for mike@acme.com:
# [ALLOW] agents:start (frontend-*)
# [ALLOW] agents:stop (frontend-*)
# [ALLOW] agents:status (*)
# [ALLOW] agents:interact (frontend-*)
# [ALLOW] policies:approve (backend-*)
# [ALLOW] audit:read (*)
# [DENY]  agents:create
# [DENY]  policies:modify
# [DENY]  rbac:*

# Audit role changes
openclaw rbac audit --since 90d
# 2025-10-01: admin assigned alex@acme.com to admin (by: system-init)
# 2025-10-15: admin assigned sarah@acme.com to operator (by: alex@acme.com)
# 2025-11-20: admin added reviewer role to sarah@acme.com (by: alex@acme.com)
# 2025-12-10: admin assigned mike@acme.com to reviewer/backend (by: alex@acme.com)`}
      />

      <WarningBlock title="Break-Glass Access">
        <p>
          Always configure a break-glass procedure for emergencies. If all admins are
          unavailable and an agent needs to be stopped immediately, there should be a
          documented process (such as a shared emergency key stored in a physical safe
          or a hardware security module) that allows emergency shutdown. Log all break-glass
          usage and require a post-incident review.
        </p>
      </WarningBlock>

      <ExerciseBlock
        question="The security team discovers a vulnerability in an agent's policy. They have the 'reviewer' role. What can they do?"
        options={[
          'Directly modify the policy to fix the vulnerability',
          'Stop the agent immediately and modify its policy',
          'Approve a policy change submitted by an admin, and escalate to an admin to make the change',
          'Only view the vulnerability in the logs and submit a ticket',
        ]}
        correctIndex={2}
        explanation="The reviewer role can approve policy changes and read audit logs, but cannot modify policies or stop agents directly. The correct workflow is: the reviewer identifies the issue, escalates to an admin who creates the policy change, and the reviewer approves it. For critical vulnerabilities, the break-glass procedure or escalation to an admin for immediate agent shutdown may be needed."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw RBAC Configuration',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/rbac.md',
            type: 'docs',
            description: 'Complete guide to role-based access control configuration.',
          },
          {
            title: 'NIST RBAC Model',
            url: 'https://csrc.nist.gov/projects/role-based-access-control',
            type: 'docs',
            description: 'NIST reference model for role-based access control.',
          },
        ]}
      />
    </div>
  )
}
