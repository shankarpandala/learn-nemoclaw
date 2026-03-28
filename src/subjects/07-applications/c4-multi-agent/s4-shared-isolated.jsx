import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function SharedIsolated() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When running multiple agents, a fundamental architectural decision is whether they share a
        sandbox or run in isolated environments. This choice affects security, performance, coordination
        complexity, and resource usage. There is no one-size-fits-all answer -- the right choice depends
        on the trust relationship between agents and the nature of their work.
      </p>

      <DefinitionBlock
        term="Shared Sandbox"
        definition="Multiple agents running within the same NemoClaw sandbox environment, sharing filesystem, network namespace, and process space. Each agent still has its own policy, but enforcement happens at the policy layer rather than the infrastructure layer."
        example="A reviewer and test-writer agent sharing the same workspace directory and running in the same sandbox, coordinated by filesystem conventions."
      />

      <DefinitionBlock
        term="Isolated Sandbox"
        definition="Each agent running in its own completely separate sandbox with independent filesystem, network namespace, and process space. Communication between agents happens only through defined external channels (message queues, shared mounted directories)."
        example="A deployment agent running in a hardened sandbox with access to CI/CD systems, completely isolated from the code review sandbox."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        When to Share Sandboxes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Sharing a sandbox makes sense when agents need to work on the same codebase and the overhead
        of communicating through external channels would be prohibitive.
      </p>

      <ComparisonTable
        title="Shared vs. Isolated Sandboxes"
        headers={['Aspect', 'Shared Sandbox', 'Isolated Sandbox']}
        rows={[
          ['File access', 'Direct filesystem access', 'Requires explicit file sharing'],
          ['Coordination overhead', 'Low (files visible instantly)', 'Higher (need message passing)'],
          ['Security boundary', 'Policy-enforced only', 'Infrastructure-enforced'],
          ['Blast radius', 'Compromise affects all agents', 'Compromise contained to one agent'],
          ['Resource usage', 'Lower (shared OS, libs)', 'Higher (separate environments)'],
          ['Startup time', 'Fast (one sandbox)', 'Slower (multiple sandboxes)'],
          ['Debugging', 'Easier (everything in one place)', 'Harder (distributed across sandboxes)'],
        ]}
      />

      <CodeBlock
        title="Shared sandbox configuration"
        language="yaml"
        code={`# sandbox.yaml -- shared sandbox for cooperating agents
sandbox:
  mode: shared
  name: dev-team-sandbox

  agents:
    - name: reviewer
      policy: policies/reviewer.yaml
    - name: test-writer
      policy: policies/test-writer.yaml
    - name: docs-writer
      policy: policies/docs-writer.yaml

  # Shared resources
  filesystem:
    workspace: /workspace
    # Each agent's policy controls which paths it can read/write
    # within this shared filesystem

  network:
    # Shared network namespace -- each agent's policy controls
    # which endpoints it can reach
    shared: true

  resources:
    cpu_limit: 4
    memory_limit: 8GB
    disk_limit: 50GB`}
      />

      <NoteBlock type="tip" title="Use Shared for Tight Collaboration">
        <p>
          Shared sandboxes work well when agents have complementary roles on the same codebase
          (reviewer + test-writer + docs-writer). The reviewer reads code and posts comments, the
          test-writer reads the same code and writes tests, and the docs-writer reads the same
          code and writes documentation. They all benefit from seeing the same filesystem without
          synchronization delays.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        When to Isolate Sandboxes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Isolation is necessary when agents handle different trust levels, access different environments,
        or when a compromise of one agent should not affect others.
      </p>

      <CodeBlock
        title="Isolated sandbox configuration"
        language="yaml"
        code={`# sandbox.yaml -- isolated sandboxes for security separation
sandboxes:
  - name: code-review-sandbox
    mode: isolated
    agents: [reviewer, test-writer, docs-writer]
    resources:
      cpu_limit: 2
      memory_limit: 4GB
    network:
      # Only GitHub and inference provider
      allow: [api.github.com, api.anthropic.com]

  - name: deployment-sandbox
    mode: isolated
    agents: [deployer]
    resources:
      cpu_limit: 1
      memory_limit: 2GB
    network:
      # GitHub + CI + monitoring
      allow: [api.github.com, api.anthropic.com, api.datadoghq.com]
    security:
      seccomp_profile: strict
      no_new_privileges: true
      read_only_root: true

  - name: research-sandbox
    mode: isolated
    agents: [research-assistant]
    resources:
      cpu_limit: 4
      memory_limit: 16GB
    network:
      # Broader internet access for research
      allow: ["*"]
      deny: [internal.acme.com, "*.amazonaws.com"]

  # Cross-sandbox communication
  communication:
    channels:
      - name: review-to-deploy
        from_sandbox: code-review-sandbox
        to_sandbox: deployment-sandbox
        type: message_queue
        max_message_size: 10KB

      - name: shared-artifacts
        type: shared_volume
        sandboxes: [code-review-sandbox, deployment-sandbox]
        mount_path: /shared/artifacts
        permissions:
          code-review-sandbox: read-write
          deployment-sandbox: read-only`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Security Implications
      </h2>

      <WarningBlock title="Shared Sandbox Risks">
        <p>
          In a shared sandbox, policy enforcement is the only barrier between agents. If an agent
          finds a way to bypass its policy (through a tool vulnerability, for example), it could
          access files and network endpoints intended for other agents. For high-security
          deployments, always isolate agents that handle different trust levels.
        </p>
      </WarningBlock>

      <CodeBlock
        title="Security hardening for isolated sandboxes"
        language="yaml"
        code={`# Hardened isolation for the deployment agent
sandboxes:
  - name: deployment-sandbox
    mode: isolated
    security:
      # Linux security modules
      seccomp_profile: strict
      apparmor_profile: nemoclaw-deployer
      no_new_privileges: true

      # Filesystem hardening
      read_only_root: true
      tmpfs_size: 100MB
      writable_paths:
        - /tmp
        - /workspace/.agent-state

      # Network isolation
      network_namespace: dedicated
      dns_servers: [8.8.8.8]  # External DNS only
      no_internal_network: true

      # Process isolation
      pid_namespace: dedicated
      max_processes: 50
      max_open_files: 1024`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Performance Considerations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Isolation has a real cost. Each sandbox consumes memory for its own OS overhead, filesystem
        layer, and network stack. On resource-constrained machines, running four isolated sandboxes
        might not be feasible.
      </p>

      <ComparisonTable
        title="Resource Usage Comparison"
        headers={['Configuration', 'Memory Overhead', 'Startup Time', 'Disk Usage']}
        rows={[
          ['4 agents, shared sandbox', '~500MB total', '~5 seconds', '~2GB'],
          ['4 agents, 2 sandboxes (grouped)', '~1.2GB total', '~10 seconds', '~5GB'],
          ['4 agents, 4 isolated sandboxes', '~2.5GB total', '~20 seconds', '~10GB'],
        ]}
      />

      <StepBlock
        title="Decision Framework"
        steps={[
          {
            title: 'Map agent trust levels',
            content: 'Group agents by the sensitivity of resources they access. Agents that access only code can be in one group. Agents that access infrastructure or deployment systems need separate isolation.',
          },
          {
            title: 'Group cooperating agents',
            content: 'Agents that frequently exchange files or work on the same codebase should share a sandbox. Agents that rarely interact can be isolated without significant overhead.',
          },
          {
            title: 'Isolate high-privilege agents',
            content: 'Any agent that can deploy code, modify infrastructure, or access production data should be in its own isolated sandbox, regardless of cooperation needs.',
          },
          {
            title: 'Assess resource budget',
            content: 'Calculate the total resource overhead of your isolation plan. If it exceeds your hardware, consider grouping lower-risk agents while keeping high-risk agents isolated.',
          },
        ]}
      />

      <ExerciseBlock
        question="You have four agents: code-reviewer (read-only), test-writer (writes test files), docs-writer (writes docs), and deployer (triggers CI/CD). What is the optimal sandbox grouping?"
        options={[
          'All four in one shared sandbox with strict policies',
          'All four in separate isolated sandboxes',
          'Code-reviewer + test-writer + docs-writer in a shared sandbox, deployer in an isolated sandbox',
          'Code-reviewer + docs-writer shared, test-writer + deployer shared',
        ]}
        correctIndex={2}
        explanation="The first three agents all work on the same codebase with different but complementary permissions (read-only, write tests, write docs). Sharing a sandbox reduces coordination overhead. The deployer has fundamentally different access requirements (CI/CD, deployment APIs) and higher risk, so it should be isolated. Grouping the deployer with any code-focused agent would unnecessarily expand the blast radius."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Sandbox Architecture',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/sandbox-architecture.md',
            type: 'docs',
            description: 'Technical deep-dive into shared and isolated sandbox implementations.',
          },
          {
            title: 'Multi-Agent Security Model',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/multi-agent-security.md',
            type: 'docs',
            description: 'Security considerations for multi-agent deployments.',
          },
        ]}
      />
    </div>
  )
}
