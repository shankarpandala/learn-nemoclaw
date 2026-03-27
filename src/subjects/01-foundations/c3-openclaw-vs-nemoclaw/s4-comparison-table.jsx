import { ComparisonTable, ExerciseBlock, NoteBlock } from '../../../components/content'

export default function ComparisonTableSection() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Feature Comparison
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This section provides a comprehensive side-by-side comparison of OpenClaw and NemoClaw.
        While the previous sections described each project narratively, this comparison table
        serves as a quick reference for understanding what each project provides, where they
        overlap, and where they are distinct.
      </p>

      <ComparisonTable
        title="OpenClaw vs NemoClaw: Comprehensive Feature Comparison"
        headers={['Aspect', 'OpenClaw', 'NemoClaw']}
        rows={[
          [
            'Role',
            'AI assistant platform -- connects messaging apps to AI agents and manages agent execution',
            'Security orchestration layer -- wraps OpenClaw with sandboxing, policies, and oversight',
          ],
          [
            'Security Model',
            'No built-in sandboxing; agents run with host process permissions; relies on external security controls',
            'Kernel-level sandboxing via Landlock, seccomp, and network namespaces; deny-by-default posture',
          ],
          [
            'Network Control',
            'No network restrictions; agents can reach any endpoint on the internet',
            'Deny-by-default; only explicitly whitelisted domains/ports are reachable from the sandbox',
          ],
          [
            'Filesystem Control',
            'No filesystem restrictions; agents can read/write any path accessible to the host user',
            'Deny-by-default; only explicitly allowed directories are accessible; enforced by Landlock at kernel level',
          ],
          [
            'Inference / Model Support',
            '35+ model providers (Anthropic, OpenAI, Google, Mistral, Ollama, vLLM, NVIDIA NIM, and more)',
            'Inherits OpenClaw model support; adds no model providers of its own',
          ],
          [
            'Messaging Platforms',
            '25+ platforms (WhatsApp, Telegram, Discord, Slack, GitHub, Teams, and more)',
            'Inherits OpenClaw platform support; uses messaging for operator approval notifications',
          ],
          [
            'Deployment Model',
            'Self-hosted; runs on bare metal, VMs, containers, or cloud instances',
            'Self-hosted; runs alongside OpenClaw on Linux systems with kernel 5.13+ (Landlock support)',
          ],
          [
            'Credential Management',
            'Credentials stored in configuration files or environment variables; accessible to agent processes',
            'Credential isolation -- keys injected into sandbox environment but not readable from filesystem',
          ],
          [
            'Operator Oversight',
            'Control UI for configuration and monitoring; no approval workflows for agent actions',
            'Operator approval workflows -- agents can request policy exceptions with human-in-the-loop review',
          ],
          [
            'Audit Logging',
            'Standard application logs for message routing and agent sessions',
            'Security-focused audit logs covering policy decisions, blocked actions, approval events, and sandbox lifecycle',
          ],
          [
            'License',
            'MIT License -- permissive, suitable for commercial use',
            'Open source -- see repository for current license terms',
          ],
          [
            'Status',
            'Production-ready; actively maintained with regular releases',
            'Alpha release (March 2026); core security mechanisms stable but APIs may change',
          ],
          [
            'Dependencies',
            'Node.js runtime; no special kernel requirements',
            'Requires OpenClaw; requires Linux kernel 5.13+ for Landlock; Python runtime for Blueprint',
          ],
          [
            'Multi-Agent Support',
            'Built-in multi-agent routing and coordination',
            'Each agent session gets its own isolated sandbox; policies can differ per agent',
          ],
          [
            'Configuration',
            'YAML/JSON config files and Control UI',
            'Declarative policy files (YAML); version-controllable; policy templates for common workloads',
          ],
        ]}
        highlightDiffs
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When You Need Just OpenClaw
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw alone is sufficient for many deployment scenarios, particularly those where the
        security risk is low and the priority is rapid deployment and maximum flexibility:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Personal development assistants:</span> A developer
          running an AI agent on their own laptop for personal coding assistance. The trust
          boundary is the developer themselves, and the risk of the agent accessing sensitive
          files is accepted as part of the workflow.
        </li>
        <li>
          <span className="font-semibold">Controlled internal tools:</span> An AI assistant
          deployed on an internal network behind a VPN, serving a small team of trusted users.
          Network-level controls at the infrastructure level provide sufficient isolation.
        </li>
        <li>
          <span className="font-semibold">Non-sensitive workloads:</span> Agents that operate on
          public data, open-source code, or non-sensitive content where the impact of a security
          breach is minimal.
        </li>
        <li>
          <span className="font-semibold">Rapid prototyping:</span> Teams exploring AI agent
          capabilities who need to iterate quickly without the overhead of security policy
          configuration. NemoClaw can be added later when the deployment matures.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When You Need NemoClaw
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw becomes essential when any of the following conditions apply:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Agents handle sensitive data:</span> If the agent has
          access to proprietary source code, customer data, credentials, or any information whose
          exposure would cause harm, NemoClaw's filesystem and network restrictions prevent
          unauthorized data access and exfiltration.
        </li>
        <li>
          <span className="font-semibold">Agents are exposed to untrusted input:</span> Public-facing
          agents, agents that process user-submitted content, or agents that read untrusted files
          (pull requests from external contributors, for example) are vulnerable to prompt
          injection. NemoClaw's sandbox limits the blast radius of successful injection attacks.
        </li>
        <li>
          <span className="font-semibold">Compliance requirements apply:</span> Organizations
          subject to GDPR, HIPAA, SOX, PCI-DSS, or other regulatory frameworks need the audit
          logging, access controls, and data boundary enforcement that NemoClaw provides.
        </li>
        <li>
          <span className="font-semibold">Multi-user or multi-tenant deployments:</span> When
          multiple users or teams share an OpenClaw installation, NemoClaw ensures that each
          agent session is isolated from others and cannot access resources belonging to different
          users.
        </li>
        <li>
          <span className="font-semibold">Agents operate autonomously:</span> Always-on agents
          that run without continuous human oversight need the safety net of a sandbox. If no
          human is watching, the sandbox ensures that mistakes and compromises are contained.
        </li>
        <li>
          <span className="font-semibold">Production deployments:</span> Any agent deployment that
          handles real workloads with real consequences should have security controls proportional
          to the risk. NemoClaw provides those controls without requiring heavy infrastructure
          like containers or VMs.
        </li>
      </ul>

      <NoteBlock type="info" title="Incremental Adoption">
        <p>
          A common deployment pattern is to start with OpenClaw alone for development and
          prototyping, then add NemoClaw when moving toward production. Because NemoClaw is
          transparent to the agent (the agent does not know it is sandboxed), adding NemoClaw
          to an existing OpenClaw deployment requires no changes to agent configuration, prompts,
          or behavior. You install the plugin, define your policies, and the security layer
          activates. This incremental adoption path reduces the barrier to entry and allows teams
          to add security controls at their own pace.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Summary
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw and NemoClaw are designed to work together as a complete AI agent deployment stack.
        OpenClaw provides the platform capabilities -- messaging integration, model routing, agent
        execution -- while NemoClaw provides the security envelope -- sandboxing, policies,
        credential isolation, and operator oversight. Neither project tries to do the other's job,
        and both can be adopted independently based on the operator's requirements.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With this foundational understanding of what OpenClaw and NemoClaw are, how they relate,
        and when each is needed, you are ready to move deeper into the technical details. The
        following subjects will explore OpenClaw's architecture, NemoClaw's security mechanisms,
        policy configuration, and deployment guides for various environments.
      </p>

      <ExerciseBlock
        question="A startup is deploying an AI coding agent on a shared development server. The agent processes pull requests from external open-source contributors and has access to the company's private codebase. Which deployment configuration is most appropriate?"
        options={[
          'OpenClaw only -- the agent needs maximum flexibility to review diverse pull requests',
          'NemoClaw only -- the security layer is sufficient without the messaging platform',
          'OpenClaw + NemoClaw -- the agent needs both platform capabilities and security controls',
          'Neither -- a simple script calling the LLM API is sufficient for this use case',
        ]}
        correctIndex={2}
        explanation="The agent processes untrusted external input (pull requests from external contributors) and has access to sensitive data (private codebase). This combination requires both OpenClaw's platform capabilities (messaging integration, agent execution) and NemoClaw's security controls (filesystem isolation to protect the private codebase, network restrictions to prevent exfiltration, and sandboxing to contain prompt injection attacks from malicious pull request content)."
      />
    </div>
  )
}
