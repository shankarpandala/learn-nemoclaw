import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function Soc2Deployment() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        SOC 2 compliance is a baseline requirement for enterprise software that handles customer data.
        Deploying AI agents introduces new audit concerns: how do you prove the agent only accesses
        authorized data? How do you demonstrate that agent actions are logged and reviewable? NemoClaw's
        architecture -- with its policy enforcement, sandboxing, and comprehensive logging -- maps
        directly onto SOC 2 trust service criteria, making compliance achievable without bolting
        on aftermarket controls.
      </p>

      <DefinitionBlock
        term="SOC 2 Compliance"
        definition="A framework developed by the AICPA (American Institute of Certified Public Accountants) that defines criteria for managing customer data based on five trust service principles: security, availability, processing integrity, confidentiality, and privacy. SOC 2 Type II requires demonstrating that controls are effective over time, not just at a point in time."
        example="A SOC 2 audit examines whether your NemoClaw deployment has access controls that prevent unauthorized data access, logs that prove those controls are enforced, and processes to detect and respond to violations."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Mapping NemoClaw to SOC 2 Criteria
      </h2>

      <ComparisonTable
        title="SOC 2 Trust Criteria and NemoClaw Controls"
        headers={['SOC 2 Criterion', 'Requirement', 'NemoClaw Control']}
        rows={[
          ['CC6.1 - Access Control', 'Restrict access to authorized users and systems', 'Network policies, API allowlists, user authentication'],
          ['CC6.2 - Authentication', 'Authenticate users before granting access', 'API key management, token-based auth, operator roles'],
          ['CC6.3 - Authorization', 'Enforce least privilege', 'Graduated permissions, role-based policies, deny-by-default'],
          ['CC7.1 - Monitoring', 'Monitor system components for anomalies', 'Real-time action logging, policy violation alerts'],
          ['CC7.2 - Incident Response', 'Respond to identified anomalies', 'Automatic demotion rules, kill switches, audit trails'],
          ['CC8.1 - Change Management', 'Track and approve changes', 'Policy versioning, approval workflows, git-backed configs'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Audit Controls Configuration
      </h2>

      <CodeBlock
        title="SOC 2 compliance configuration"
        language="yaml"
        code={`# compliance/soc2-controls.yaml
compliance:
  framework: soc2-type2
  version: 2024

  # CC6.1 - Logical access controls
  access_control:
    policy_enforcement: mandatory
    default_network: deny
    default_filesystem: deny
    require_explicit_allow: true

    # All policies must be reviewed and approved
    policy_change_control:
      require_approval: true
      approvers:
        - role: security-admin
        - role: compliance-officer
      approval_log: /var/log/nemoclaw/policy-changes.log

  # CC6.3 - Least privilege
  least_privilege:
    max_permission_level: L2  # Cap for production agents
    require_justification: true
    periodic_review:
      interval: 90d
      reviewer: security-admin

  # CC7.1 - System monitoring
  monitoring:
    # All agent actions are logged
    log_all_actions: true
    # Sensitive actions trigger alerts
    alert_on:
      - policy_violation
      - permission_escalation
      - unusual_activity_pattern
      - failed_authentication

    # Log retention for audit
    retention:
      action_logs: 365d      # 1 year
      policy_change_logs: 7y  # 7 years
      access_logs: 365d

  # CC7.2 - Incident management
  incident_response:
    auto_disable_on:
      - policy_violation_count: 3
        window: 1h
      - data_access_anomaly: true
    notification:
      channels: [email, pagerduty]
      recipients:
        - security@acme.com
        - compliance@acme.com

  # CC8.1 - Change management
  change_management:
    config_versioning: git
    require_pr_review: true
    require_ci_validation: true
    rollback_capability: true`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Documentation Requirements
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        SOC 2 auditors need documentation proving your controls exist and are effective. NemoClaw
        can auto-generate much of this documentation from its runtime configuration and logs.
      </p>

      <StepBlock
        title="Preparing for a SOC 2 Audit"
        steps={[
          {
            title: 'Generate the control inventory',
            content: 'NemoClaw can produce a document listing every active control, its configuration, and when it was last reviewed.',
            code: `openclaw compliance inventory --framework soc2

# Output: compliance-inventory.pdf
# Contains:
# - List of all active policies and their rules
# - Access control matrix (who can access what)
# - Monitoring configuration and alert thresholds
# - Change management process documentation
# - Data flow diagrams showing what the agent accesses`,
            language: 'bash',
          },
          {
            title: 'Export audit logs for the review period',
            content: 'Auditors will want to see evidence that controls were enforced over the audit period.',
            code: `# Export all logs for the audit period
openclaw compliance export-logs \\
  --from 2025-01-01 \\
  --to 2025-12-31 \\
  --format csv \\
  --output audit-evidence/

# Generates:
# audit-evidence/
#   action-logs.csv        # Every agent action
#   policy-violations.csv  # Every policy denial
#   access-changes.csv     # Every permission change
#   config-changes.csv     # Every configuration change
#   incident-log.csv       # Every security incident`,
            language: 'bash',
          },
          {
            title: 'Validate control effectiveness',
            content: 'Run automated tests to verify controls are working as documented.',
            code: `openclaw compliance validate --framework soc2

# === SOC 2 Control Validation ===
# CC6.1 Access Control:     PASS (deny-by-default enforced)
# CC6.2 Authentication:     PASS (all API calls authenticated)
# CC6.3 Authorization:      PASS (least privilege policies active)
# CC7.1 Monitoring:         PASS (all actions logged, alerts configured)
# CC7.2 Incident Response:  PASS (auto-disable rules active)
# CC8.1 Change Management:  PASS (all changes in git with PR review)
#
# Overall: 6/6 controls validated
# Report: compliance-validation-2025-12-15.pdf`,
            language: 'bash',
          },
          {
            title: 'Prepare the narrative',
            content: 'Write descriptions of how each control works in practice. NemoClaw generates templates you can customize.',
            code: `openclaw compliance narrative --framework soc2 > narratives-draft.md

# Edit the generated narratives to match your specific processes`,
            language: 'bash',
          },
        ]}
      />

      <WarningBlock title="SOC 2 Is About Process, Not Just Technology">
        <p>
          NemoClaw provides the technical controls, but SOC 2 compliance also requires
          organizational processes: regular access reviews, incident response procedures,
          employee training, and vendor management. The technology enforces the controls, but
          humans must manage the governance around it. Work with your compliance team to ensure
          processes are documented alongside the technical configuration.
        </p>
      </WarningBlock>

      <NoteBlock type="info" title="Type I vs. Type II">
        <p>
          SOC 2 Type I evaluates whether controls are designed appropriately at a point in time.
          Type II evaluates whether those controls operated effectively over a period (typically
          6-12 months). NemoClaw's continuous logging and monitoring supports Type II by providing
          evidence of control effectiveness over the entire review period.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="An auditor asks: 'How do you ensure the AI agent cannot access customer data beyond what is authorized?' What NemoClaw feature provides the strongest evidence?"
        options={[
          'The agent\'s system prompt instructs it not to access unauthorized data',
          'The NemoClaw network policy with deny-by-default and explicit path-level allow rules, plus logs showing every API call the agent made',
          'The agent runs in a container with limited memory',
          'Team members manually review agent actions weekly',
        ]}
        correctIndex={1}
        explanation="SOC 2 requires preventive controls (the deny-by-default network policy that blocks unauthorized access at the infrastructure level) and detective controls (comprehensive logs proving the control was enforced). The system prompt is not a reliable control because it can be bypassed. Manual reviews are valuable but insufficient as a primary control."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Compliance Guide',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/compliance.md',
            type: 'docs',
            description: 'Official guide for deploying NemoClaw in compliance-regulated environments.',
          },
          {
            title: 'AICPA SOC 2 Trust Service Criteria',
            url: 'https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services',
            type: 'docs',
            description: 'Official SOC 2 criteria from the AICPA.',
          },
        ]}
      />
    </div>
  )
}
