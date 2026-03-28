import { useState } from 'react';
import {
  CodeBlock,
  NoteBlock,
  DefinitionBlock,
  ComparisonTable,
  WarningBlock,
  StepBlock,
  ExerciseBlock,
  ReferenceList,
} from '../../../components/content';

export default function WhyNemoClaw() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The previous sections examined three fundamental security gaps in
        vanilla OpenClaw deployments: unrestricted network access, full
        filesystem exposure, and pervasive credential leakage risks. These
        are not bugs or configuration mistakes -- they are inherent
        architectural limitations of running AI agents with direct access to
        a host system. OpenClaw was designed for developer productivity, not
        adversarial security. NemoClaw was built specifically to close these
        gaps by adding an OS-level security layer that enforces isolation
        constraints the application layer cannot provide.
      </p>

      <DefinitionBlock
        term="NemoClaw"
        definition="A security overlay for OpenClaw that sandboxes agent tool execution using OS-level isolation mechanisms. NemoClaw intercepts tool calls from the Gateway, executes them inside a restricted environment with explicit network, filesystem, and credential policies, and returns sanitized results. It operates transparently -- agents and users interact normally while NemoClaw enforces security boundaries."
        example="When an agent calls execute_command to run 'npm test', NemoClaw intercepts the call, executes it inside a sandboxed environment that can only access the project directory and npm registry, and returns the test results. If the command tries to read ~/.ssh/id_rsa or curl an unauthorized URL, the sandbox blocks it."
        seeAlso={['Sandbox', 'Network Policy', 'Credential Isolation']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The Security Gap Summary
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before diving into how NemoClaw works, let us consolidate the three
        categories of risk that make it necessary. Each row in the following
        table represents a real, exploitable vulnerability in standard
        OpenClaw deployments.
      </p>

      <ComparisonTable
        title="Before NemoClaw vs. After NemoClaw"
        headers={['Concern', 'Before NemoClaw', 'After NemoClaw']}
        highlightDiffs
        rows={[
          [
            'Network Access',
            'Agent can reach any IP/hostname. Data exfiltration via HTTP, DNS, or raw sockets. Cloud metadata endpoints accessible.',
            'Agent restricted to an explicit allowlist of hosts and ports. All other outbound traffic blocked at the kernel level. Metadata endpoints blocked by default.',
          ],
          [
            'Filesystem Access',
            'Agent reads/writes any file the Gateway user can access. SSH keys, cloud credentials, other projects all exposed.',
            'Agent sees only the project directory and a minimal set of read-only system paths. All other filesystem paths are invisible to the sandbox.',
          ],
          [
            'Credential Isolation',
            'All environment variables (including Gateway secrets) visible to agent. No scoping. Credentials leak through tool output, logs, and generated code.',
            'Agent receives only explicitly declared environment variables. Gateway operational secrets are never injected. Tool outputs are scanned and sanitized before returning to the LLM.',
          ],
          [
            'LLM Inference Security',
            'Prompts and tool outputs sent to LLM API without filtering. Credential values in context sent to third-party servers.',
            'Outbound context filtering detects and redacts credential patterns before they reach the LLM. Sensitive tool outputs are summarized rather than sent verbatim.',
          ],
          [
            'Operator Oversight',
            'Control UI shows activity but cannot enforce policies. Hooks provide advisory filtering that can be bypassed.',
            'Policy engine enforces mandatory rules. Violations are blocked, logged, and alerted. Operators define declarative policies that cannot be circumvented by the agent.',
          ],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Why Application-Level Security Is Insufficient
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A recurring theme across the limitations sections is that application-level
        mitigations (hooks, path filters, command blocklists) are fundamentally
        insufficient for securing AI agent execution. This is not because
        hooks are poorly implemented -- it is because the threat model requires
        OS-level enforcement.
      </p>

      <StepBlock
        title="Why Hooks Cannot Replace Sandboxing"
        steps={[
          {
            title: 'Blocklists vs. Allowlists',
            content:
              'Hooks typically operate as blocklists: they try to identify and block dangerous patterns. Security best practice dictates allowlists: only permit explicitly approved actions. There are infinitely many dangerous commands but a finite set of safe ones. NemoClaw uses allowlists at the OS level.',
          },
          {
            title: 'Enforcement Level',
            content:
              'Hooks run in the same process as the agent\'s tool execution. A sufficiently clever command can bypass in-process filtering. NemoClaw enforces restrictions at the kernel level (namespaces, seccomp, network policies), which cannot be bypassed from userspace.',
          },
          {
            title: 'Timing and Atomicity',
            content:
              'A beforeToolUse hook can inspect a command string, but the actual command may behave differently than the string suggests (shell expansion, aliases, scripts). NemoClaw intercepts at the system call level, where the actual behavior occurs.',
          },
          {
            title: 'Credential Visibility',
            content:
              'Hooks can scan for credential patterns in output, but they cannot prevent credentials from existing in the execution environment. NemoClaw ensures credentials are never present in the sandbox in the first place.',
          },
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        NemoClaw's Architecture Overview
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw sits between the OpenClaw Gateway and the actual tool
        execution layer. It intercepts every tool call, evaluates it against
        the configured security policy, and either executes it inside a
        sandboxed environment or blocks it with an explanation. The agent
        and the user experience is unchanged -- NemoClaw operates transparently.
      </p>

      <CodeBlock
        language="text"
        title="NemoClaw in the execution flow"
        code={`Without NemoClaw:
  User Message → Gateway → LLM → Tool Call → Host System → Tool Result → LLM → Response

With NemoClaw:
  User Message → Gateway → LLM → Tool Call → [NemoClaw Policy Check]
                                                    ↓ (allowed)
                                              [Sandbox Execution]
                                                    ↓
                                              [Output Sanitization]
                                                    ↓
                                              Tool Result → LLM → Response

                                                    ↓ (blocked)
                                              Block Reason → LLM → Response`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        What NemoClaw Provides
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw addresses each limitation category with a dedicated
        subsystem. These subsystems work together to create a comprehensive
        security perimeter around agent tool execution.
      </p>

      <ComparisonTable
        title="NemoClaw Security Subsystems"
        headers={['Subsystem', 'What It Does', 'Enforcement Mechanism']}
        rows={[
          [
            'Network Sandbox',
            'Restricts outbound connections to an explicit allowlist of hosts, ports, and protocols',
            'Linux network namespaces + nftables firewall rules',
          ],
          [
            'Filesystem Sandbox',
            'Restricts file access to the project directory and declared paths only',
            'Mount namespaces with bind mounts, read-only overlays',
          ],
          [
            'Credential Vault',
            'Provides scoped credential injection with automatic rotation and auditing',
            'Isolated environment variables, no host env inheritance',
          ],
          [
            'Context Filter',
            'Scans and redacts sensitive data from tool outputs before they reach the LLM',
            'Pattern matching + entropy analysis on tool result payloads',
          ],
          [
            'Policy Engine',
            'Evaluates tool calls against declarative security policies and blocks violations',
            'Rego/OPA-style policy language with mandatory enforcement',
          ],
          [
            'Audit Logger',
            'Records all tool executions, policy decisions, and security events for compliance',
            'Append-only log with cryptographic integrity verification',
          ],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Deployment Model
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw can be deployed in two modes. In <strong>sidecar mode</strong>,
        it runs alongside the OpenClaw Gateway on the same machine, intercepting
        tool calls through a local API. In <strong>proxy mode</strong>, it runs
        as a separate service that the Gateway routes all tool calls through.
        Sidecar mode is simpler to set up, while proxy mode is better for
        centralized policy management across multiple Gateway instances.
      </p>

      <CodeBlock
        language="json"
        title="NemoClaw sidecar configuration (openclaw.json)"
        code={`{
  "nemoclaw": {
    "enabled": true,
    "mode": "sidecar",
    "policyFile": ".openclaw/security-policy.yaml",
    "sandbox": {
      "network": {
        "allowlist": [
          "registry.npmjs.org:443",
          "api.github.com:443",
          "api.anthropic.com:443"
        ],
        "blockMetadata": true,
        "blockPrivateRanges": true
      },
      "filesystem": {
        "projectRoot": "./",
        "readOnlyPaths": ["/usr/lib", "/usr/share"],
        "blockedPaths": ["~/.ssh", "~/.aws", "~/.gnupg"]
      },
      "credentials": {
        "inherit": false,
        "allowed": ["NODE_ENV", "npm_config_registry"],
        "secrets": {
          "GITHUB_TOKEN": { "source": "vault", "path": "secret/ci/github-token" }
        }
      }
    }
  }
}`}
      />

      <NoteBlock type="tip" title="Gradual Adoption">
        <p>
          NemoClaw can be deployed in <code>audit</code> mode first, where it
          logs all policy violations without blocking them. This allows teams
          to understand what their agents actually do before enforcing
          restrictions. Once the allowlists are tuned, switching to
          <code> enforce</code> mode activates blocking. This gradual rollout
          minimizes disruption while building an accurate security profile.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The Path Forward
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw provides the platform for connecting AI agents to team
        workflows. NemoClaw provides the security guardrails that make it safe
        to do so in production. Together, they represent a complete solution:
        OpenClaw handles the complexity of multi-agent orchestration, platform
        integration, and developer experience, while NemoClaw ensures that
        powerful agent capabilities do not become powerful attack vectors.
        The remainder of this course dives deep into NemoClaw's architecture,
        configuration, and operational patterns.
      </p>

      <ExerciseBlock
        question="What is the fundamental reason that OpenClaw hooks cannot provide the same level of security as NemoClaw's sandboxing?"
        options={[
          'Hooks are slower to execute than sandbox rules',
          'Hooks run at the application level and can be bypassed, while NemoClaw enforces restrictions at the OS/kernel level',
          'Hooks can only inspect tool arguments, not tool outputs',
          'Hooks require manual maintenance while NemoClaw is fully automated',
        ]}
        correctIndex={1}
        explanation="The fundamental difference is enforcement level. Hooks run in the same process as tool execution and operate on command strings, which can be bypassed through shell tricks, alternative tools, or encoding. NemoClaw enforces restrictions at the OS kernel level using namespaces and firewall rules, which cannot be circumvented from userspace regardless of how the agent constructs its commands."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Documentation',
            url: 'https://docs.nemoclaw.dev',
            type: 'docs',
            description: 'Official NemoClaw documentation covering architecture, configuration, and operations.',
          },
          {
            title: 'OpenClaw + NemoClaw Integration Guide',
            url: 'https://docs.openclaw.ai/nemoclaw-integration',
            type: 'docs',
            description: 'Step-by-step guide for adding NemoClaw to an existing OpenClaw deployment.',
          },
          {
            title: 'Linux Kernel Namespaces',
            url: 'https://man7.org/linux/man-pages/man7/namespaces.7.html',
            type: 'docs',
            description: 'Background on the OS-level isolation primitives that NemoClaw uses for sandboxing.',
          },
        ]}
      />
    </div>
  );
}
