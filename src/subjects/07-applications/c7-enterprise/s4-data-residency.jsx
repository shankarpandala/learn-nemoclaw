import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function DataResidency() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Data residency requirements dictate where data can be processed and stored geographically.
        For AI agents, this adds a layer of complexity: when your agent sends code to an inference
        provider, where does that processing happen? When logs are written, where are they stored?
        NemoClaw provides controls to ensure that all data -- including inference requests, logs,
        and agent state -- stays within required geographic boundaries.
      </p>

      <DefinitionBlock
        term="Data Residency"
        definition="Legal and regulatory requirements that specify the geographic locations where data may be stored, processed, and transmitted. In the context of AI agents, this covers where inference requests are processed, where agent logs are stored, where model weights reside, and what network paths data traverses."
        example="A European company subject to GDPR requires that all inference requests containing employee data are processed within the EU, logs are stored in eu-west-1, and no data transits through US data centers."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Data Residency Challenges with AI Agents
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        AI agents create data flows that traditional applications do not have. Understanding where
        data goes is the first step to controlling it.
      </p>

      <ComparisonTable
        title="Data Flows in an AI Agent System"
        headers={['Data Type', 'Where It Flows', 'Residency Concern']}
        rows={[
          ['Source code (input)', 'Agent sandbox to inference API', 'Code may contain trade secrets or PII'],
          ['Inference request', 'Sandbox to provider data center', 'Provider may process in any region'],
          ['Inference response', 'Provider to sandbox', 'Response may be cached by provider'],
          ['Agent logs', 'Sandbox to log storage', 'Logs contain summaries of all data accessed'],
          ['Memory files', 'Agent workspace on disk', 'May contain project decisions and user info'],
          ['Audit trail', 'Sandbox to audit storage', 'Complete record of all data interactions'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Controlling Where Inference Happens
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The most critical data residency control for AI agents is the inference endpoint. When your
        agent sends code to be analyzed, you need to know which data center processes that request.
        NemoClaw supports regional endpoint routing to enforce this.
      </p>

      <CodeBlock
        title="Regional inference endpoint configuration"
        language="yaml"
        code={`# data-residency/inference.yaml
inference:
  # Default provider with regional endpoint
  provider: anthropic
  region: eu-west-1

  # Regional endpoint routing
  endpoints:
    # EU data processing
    eu:
      url: https://eu.api.anthropic.com/v1/messages
      regions: [eu-west-1, eu-central-1]
      compliance: [gdpr, eu-data-act]

    # US data processing
    us:
      url: https://api.anthropic.com/v1/messages
      regions: [us-east-1, us-west-2]
      compliance: [soc2, hipaa]

    # Asia-Pacific
    apac:
      url: https://apac.api.anthropic.com/v1/messages
      regions: [ap-southeast-1, ap-northeast-1]
      compliance: [pdpa, appi]

  # Routing rules
  routing:
    # Route based on agent location
    default: eu  # Default to EU processing

    # Override for specific agents
    overrides:
      - agent: us-only-reviewer
        endpoint: us
      - agent: apac-assistant
        endpoint: apac

  # Verify the endpoint actually resolves to the expected region
  verification:
    enabled: true
    check_interval: 1h
    method: dns_resolution  # Verify IP is in expected range
    action_on_violation: block_and_alert`}
      />

      <NoteBlock type="info" title="Provider Support for Regional Endpoints">
        <p>
          Not all inference providers offer regional endpoints. Check your provider's documentation
          for data processing locations. Anthropic offers regional endpoints for enterprise
          customers. If your provider does not support regional routing, consider using a
          self-hosted model or a provider that does for residency-sensitive workloads.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Controlling Log and Data Storage
      </h2>

      <CodeBlock
        title="Regional storage configuration"
        language="yaml"
        code={`# data-residency/storage.yaml
storage:
  # Agent logs -- must stay in EU
  audit_logs:
    primary:
      type: s3
      bucket: acme-nemoclaw-audit-eu
      region: eu-west-1
      encryption: aws:kms
      kms_key: arn:aws:kms:eu-west-1:123456:key/audit-key
    # No cross-region replication for audit logs
    replicate: false

  # Agent workspace files
  workspace:
    type: ebs
    region: eu-west-1
    encryption: aws:kms
    backup:
      type: s3
      bucket: acme-nemoclaw-backups-eu
      region: eu-west-1  # Backups stay in same region

  # Memory files (may contain sensitive context)
  memory:
    type: local  # Keep on the same machine as the agent
    encryption: luks
    backup:
      type: s3
      bucket: acme-nemoclaw-backups-eu
      region: eu-west-1

  # Residency verification
  verification:
    # Check that all storage resources are in allowed regions
    check_interval: 24h
    allowed_regions: [eu-west-1, eu-central-1]
    action_on_violation: alert_and_block`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Network Path Control
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Data residency is not just about where data is stored -- it is also about what network paths
        it traverses. A request from an EU agent to a US inference endpoint transits through
        international network links, which may violate data sovereignty requirements.
      </p>

      <CodeBlock
        title="Network path policy"
        language="yaml"
        code={`# data-residency/network.yaml
network:
  # Only allow connections to endpoints in approved regions
  geo_restrictions:
    enabled: true
    allowed_regions: [EU]

    # Enforce at the DNS level
    dns:
      # Use regional DNS resolvers
      servers:
        - 10.0.1.53  # Internal EU resolver
      # Block resolution of non-EU endpoints
      block_non_regional: true

    # Verify endpoint location before sending data
    pre_flight_check:
      enabled: true
      method: geoip  # Resolve IP and check GeoIP database
      action_on_violation: block

  # Specific endpoint restrictions
  endpoints:
    # Inference must go to EU endpoint
    - domain: "*.api.anthropic.com"
      allowed_ips:
        - 52.56.0.0/16     # EU-West-1 range (example)
        - 3.8.0.0/16       # EU-West-2 range (example)
      deny_ips:
        - 54.0.0.0/8       # US ranges (example)

    # GitHub API (github.com does not offer regional routing)
    - domain: api.github.com
      residency_exception: true
      justification: >
        GitHub API is US-based. Only non-sensitive metadata
        (PR numbers, file paths) is sent. Source code is read
        from local workspace, not fetched via API.
      data_classification: public`}
      />

      <WarningBlock title="Data Classification Is Essential">
        <p>
          Not all data needs the same residency controls. Classify your data: public metadata
          (PR numbers, branch names) may not need residency controls, while source code,
          customer data, and secrets absolutely do. NemoClaw policies should be strictest for
          the highest classification level present in the data the agent accesses.
        </p>
      </WarningBlock>

      <StepBlock
        title="Implementing Data Residency Controls"
        steps={[
          {
            title: 'Identify your residency requirements',
            content: 'Work with legal and compliance to determine which regulations apply (GDPR, CCPA, data sovereignty laws) and what regions are approved.',
          },
          {
            title: 'Map all data flows',
            content: 'Document every place agent data goes: inference endpoints, log storage, backup locations, monitoring platforms, and third-party integrations.',
          },
          {
            title: 'Configure regional endpoints',
            content: 'Route inference requests to regional endpoints. Store logs and backups in approved regions only.',
          },
          {
            title: 'Add verification checks',
            content: 'Enable NemoClaw\'s geo-verification to continuously validate that data is staying within approved boundaries.',
            code: `# Run a residency audit
openclaw compliance data-residency audit

# === Data Residency Audit ===
# Inference endpoint: eu.api.anthropic.com -> 52.56.x.x (EU-West-1) OK
# Audit log storage: s3://acme-audit-eu (eu-west-1) OK
# Workspace storage: EBS vol-abc (eu-west-1) OK
# Backup storage: s3://acme-backups-eu (eu-west-1) OK
# GitHub API: api.github.com (US) EXCEPTION (documented)
# Monitoring: Datadog EU (eu-west-1) OK
#
# Result: COMPLIANT (1 documented exception)`,
            language: 'bash',
          },
          {
            title: 'Document exceptions',
            content: 'Some services (like GitHub) do not offer regional endpoints. Document these exceptions with justification and data classification analysis.',
          },
        ]}
      />

      <ComparisonTable
        title="Regional Deployment Patterns"
        headers={['Pattern', 'Description', 'Complexity', 'Best For']}
        rows={[
          ['Single region', 'All components in one approved region', 'Low', 'Small teams, single jurisdiction'],
          ['Multi-region, routed', 'Agents route to nearest approved endpoint', 'Medium', 'Global teams, single regulation'],
          ['Isolated regions', 'Fully separate deployments per region', 'High', 'Multiple regulations, data sovereignty'],
          ['Hybrid', 'Non-sensitive data global, sensitive data regional', 'Medium-High', 'Complex compliance landscape'],
        ]}
      />

      <ExerciseBlock
        question="Your EU-based agent reviews code for a project that includes US customer PII in test fixtures. The inference provider processes requests in the EU. Is this compliant with GDPR?"
        options={[
          'Yes, because the inference happens in the EU',
          'No, because the test fixtures contain US customer data which should not exist in the EU',
          'It depends on whether data processing agreements are in place with the inference provider and whether the PII in test fixtures is real or synthetic',
          'Yes, because GDPR does not apply to AI inference',
        ]}
        correctIndex={2}
        explanation="GDPR compliance depends on several factors: whether the PII is real or synthetic (synthetic data is not personal data), whether a Data Processing Agreement (DPA) exists with the inference provider, and whether the processing has a lawful basis. The geographic location of processing is one factor but not the only one. Real PII in test fixtures is a separate concern that should be addressed by using synthetic test data."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Data Residency Guide',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/data-residency.md',
            type: 'docs',
            description: 'Complete guide to configuring data residency controls.',
          },
          {
            title: 'GDPR Data Processing Requirements',
            url: 'https://gdpr.eu/article-28-processor/',
            type: 'docs',
            description: 'GDPR Article 28 requirements for data processors.',
          },
          {
            title: 'Anthropic Enterprise Data Processing',
            url: 'https://www.anthropic.com/policies/privacy',
            type: 'docs',
            description: 'Anthropic data processing practices and regional availability.',
          },
        ]}
      />
    </div>
  )
}
