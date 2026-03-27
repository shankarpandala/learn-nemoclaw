import { NoteBlock, ReferenceList, DefinitionBlock } from '../../../components/content'

export default function WhatIsNemoClaw() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        What is NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NVIDIA NemoClaw is an open-source reference stack for running OpenClaw safely. It provides
        the security orchestration layer that wraps around OpenClaw's agent execution environment,
        enforcing deny-by-default network and filesystem policies, isolating credentials from the
        agent sandbox, and providing operator oversight mechanisms. NemoClaw transforms OpenClaw
        from a powerful but unrestricted agent platform into a safely governed one.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw was released in alpha in March 2026 as part of NVIDIA's broader AI safety
        initiative. It addresses the critical gap between the rapid deployment of AI agents in
        production environments and the security controls needed to operate them responsibly.
        While OpenClaw provides the connectivity and agent execution capabilities, NemoClaw
        provides the security boundary within which those agents operate.
      </p>

      <DefinitionBlock
        term="NemoClaw"
        definition="An open-source security orchestration stack developed by NVIDIA that wraps OpenClaw's agent execution environment with kernel-level sandboxing (Landlock, seccomp, network namespaces), deny-by-default policies, credential isolation, and operator approval workflows. NemoClaw consists of a TypeScript Plugin for OpenClaw integration and a Python Blueprint for policy management and sandbox configuration."
        example="An operator deploys OpenClaw with the NemoClaw plugin to run a coding agent. NemoClaw restricts the agent to only access project files, only reach GitHub and PyPI on the network, and prevents it from reading any credentials on disk -- all enforced at the Linux kernel level."
        seeAlso={['OpenClaw', 'OpenShell', 'Deny-by-Default']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Two Core Components
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's architecture is divided into two components that work together to provide
        end-to-end security for OpenClaw agents:
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4">
        TypeScript Plugin
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The TypeScript Plugin integrates directly with OpenClaw's Node runtime. It intercepts agent
        tool calls (shell execution, file operations, network requests) and routes them through the
        security sandbox rather than executing them directly on the host system. The plugin also
        manages the lifecycle of sandboxed sessions -- creating isolated environments when an agent
        session starts, enforcing policies during execution, and cleaning up resources when the
        session ends.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The plugin is designed as a drop-in addition to an existing OpenClaw installation. Operators
        install the plugin, configure their security policies, and OpenClaw's agent execution is
        automatically routed through NemoClaw's security layer. No changes to agent code or
        configuration are required -- the security boundary is transparent to the agent.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4">
        Python Blueprint
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The Python Blueprint provides the policy management and configuration layer for NemoClaw.
        It defines the schema for security policies (network allow lists, filesystem access rules,
        syscall filters), provides tools for validating and testing policies, and generates the
        runtime configurations consumed by OpenShell. The Blueprint also includes pre-built policy
        templates for common agent workloads -- coding agents, research agents, CI/CD agents --
        giving operators a secure starting point that can be customized for their specific needs.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The Blueprint follows an infrastructure-as-code approach: policies are defined in
        declarative configuration files that can be version-controlled, reviewed in pull requests,
        and deployed through standard CI/CD pipelines. This makes security policies auditable,
        reproducible, and subject to the same change management processes as application code.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        NVIDIA OpenShell Runtime
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        At the foundation of NemoClaw's security model is NVIDIA OpenShell, the sandboxed runtime
        that actually executes agent commands. When NemoClaw is installed, it deploys OpenShell as
        the execution backend. OpenShell is responsible for applying the three kernel-level security
        mechanisms -- Landlock for filesystem isolation, seccomp for system call filtering, and
        network namespaces for network isolation -- before any agent code runs.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenShell operates as a privilege-dropping runtime. It starts with sufficient permissions to
        set up the sandbox (creating network namespaces, configuring routing rules), then
        irrevocably drops its own privileges before handing control to the agent process. Once the
        sandbox is established, neither the agent nor OpenShell itself can escape the restrictions.
        This design ensures that even a complete compromise of the agent process -- through prompt
        injection, tool misuse, or any other vector -- is contained within the sandbox boundary.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Key Security Properties
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Deny-by-Default Network Policy:</span> All outbound
          network connections are blocked unless explicitly allowed. Operators define which domains
          and ports the agent can reach. DNS queries, HTTPS requests, and raw TCP connections to
          any destination not on the allow list are dropped at the kernel level.
        </li>
        <li>
          <span className="font-semibold">Deny-by-Default Filesystem Policy:</span> All filesystem
          access outside explicitly allowed paths is blocked. The agent can read and write files
          only in directories specified by the operator. System directories, credential files,
          and other sensitive paths are inaccessible.
        </li>
        <li>
          <span className="font-semibold">Credential Isolation:</span> API keys, tokens, and other
          credentials needed by the agent are injected into the sandbox environment (as environment
          variables or through a secure credential API) but are not stored in any file accessible
          from within the sandbox. The agent can use credentials for their intended purpose (making
          API calls) but cannot read their values from the filesystem or include them in tool
          outputs.
        </li>
        <li>
          <span className="font-semibold">Operator Approval Workflows:</span> For actions that
          exceed the agent's policy (accessing a new network endpoint, writing to a new directory),
          NemoClaw can pause execution and notify the operator through the messaging platform.
          The operator can approve or deny the request, and their decision is logged for audit
          purposes.
        </li>
      </ul>

      <NoteBlock type="warning" title="Alpha Release Status">
        <p>
          NemoClaw was released as an alpha in March 2026. While the core security mechanisms
          (Landlock, seccomp, network namespaces) are built on mature, battle-tested Linux kernel
          features, the NemoClaw orchestration layer itself is under active development. APIs,
          policy schemas, and configuration formats may change between releases. Production
          deployments should pin to specific versions and thoroughly test policy configurations
          before rolling out updates. Always refer to the official documentation for the latest
          guidance.
        </p>
      </NoteBlock>

      <ReferenceList
        references={[
          {
            type: 'github',
            title: 'NemoClaw GitHub Repository',
            url: 'https://github.com/NVIDIA/NemoClaw',
            description: 'Source code, issues, and development activity for the NemoClaw project.',
          },
          {
            type: 'docs',
            title: 'NemoClaw Documentation',
            url: 'https://docs.nemoclaw.nvidia.com',
            description: 'Official documentation covering installation, policy configuration, and architecture.',
          },
          {
            type: 'github',
            title: 'NVIDIA OpenShell',
            url: 'https://github.com/NVIDIA/OpenShell',
            description: 'The sandboxed runtime that provides kernel-level isolation for NemoClaw agents.',
          },
          {
            type: 'article',
            title: 'NVIDIA Blog: Introducing NemoClaw',
            url: 'https://developer.nvidia.com/blog/introducing-nemoclaw',
            description: 'Announcement blog post covering the motivation and design of NemoClaw.',
          },
        ]}
      />
    </div>
  )
}
