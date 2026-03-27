import { NoteBlock, ReferenceList } from '../../../components/content'

export default function WhatIsOpenClaw() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        What is OpenClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw is an open-source gateway platform that connects messaging applications to AI
        coding agents. It serves as the bridge between the communication channels where users
        interact (WhatsApp, Telegram, Discord, Slack, and many more) and the AI models and tools
        that perform work. OpenClaw is self-hosted, MIT-licensed, and designed from the ground up
        for flexibility, extensibility, and multi-platform support.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        At its core, OpenClaw solves a fundamental integration problem: there are dozens of
        messaging platforms, dozens of AI model providers, and countless ways to configure agent
        behavior. Without a gateway like OpenClaw, building an AI assistant that works across
        multiple channels requires writing and maintaining separate integrations for each platform,
        each model, and each tool. OpenClaw provides a unified abstraction layer that handles all
        of these integrations, allowing operators to focus on configuring agent behavior rather
        than writing platform-specific code.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Key Capabilities
      </h2>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4">
        25+ Messaging Platform Support
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw supports integration with over 25 messaging and communication platforms. This
        includes consumer messaging apps (WhatsApp, Telegram, Facebook Messenger, iMessage via
        bridges), team collaboration tools (Slack, Microsoft Teams, Discord), developer platforms
        (GitHub, GitLab), social media (Twitter/X, Reddit), and web-based interfaces (custom
        widgets, REST APIs). Each integration handles platform-specific authentication, message
        formatting, rate limiting, and media handling, exposing a unified interface to the agent
        layer.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4">
        35+ Model Provider Support
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw can route agent requests to over 35 AI model providers and inference backends.
        This includes major commercial providers (Anthropic Claude, OpenAI GPT, Google Gemini,
        Mistral), cloud-hosted inference (AWS Bedrock, Azure OpenAI, Google Vertex AI), and
        self-hosted solutions (Ollama, vLLM, llama.cpp, NVIDIA NIM). Operators can configure
        model routing policies that select different models based on task complexity, cost
        constraints, or data residency requirements.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4">
        Multi-Agent Routing
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw supports deploying and routing between multiple AI agents within a single
        installation. Different agents can be specialized for different tasks -- one for code
        review, another for documentation, a third for infrastructure management -- with the
        gateway routing incoming messages to the appropriate agent based on context, channel,
        user identity, or message content. This multi-agent architecture enables sophisticated
        workflows where agents collaborate and hand off tasks.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4">
        Persistent Sessions and Tool Use
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw maintains persistent conversation sessions across messages, allowing agents to
        build context over extended interactions. It also provides a tool-use framework that enables
        agents to execute shell commands, read and write files, make HTTP requests, and interact
        with external APIs. The combination of persistent sessions and tool use transforms
        OpenClaw from a simple message relay into a full agent execution platform.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Architecture: Key Components
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw's architecture is organized around three primary components:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Gateway:</span> The central message routing engine.
          The Gateway receives messages from all connected messaging platforms, normalizes them
          into a common format, routes them to the appropriate agent, and sends agent responses
          back to the originating platform. It handles authentication, rate limiting, session
          management, and message queuing.
        </li>
        <li>
          <span className="font-semibold">Nodes:</span> Worker processes that execute agent logic.
          Each Node runs one or more agent instances, managing their LLM interactions, tool
          execution, and state. Nodes can be scaled horizontally to handle increased load. They
          communicate with the Gateway via an internal protocol and can run on the same machine
          or on separate hosts.
        </li>
        <li>
          <span className="font-semibold">Control UI:</span> A web-based management interface for
          configuring and monitoring the OpenClaw installation. The Control UI allows operators to
          manage messaging platform connections, configure agent behavior and model routing, view
          active sessions, monitor system health, and review logs. It provides a visual interface
          for tasks that would otherwise require editing configuration files.
        </li>
      </ul>

      <NoteBlock type="info" title="Self-Hosted and MIT-Licensed">
        <p>
          OpenClaw is fully self-hosted -- there is no SaaS dependency or external service
          requirement. All data (messages, sessions, credentials) stays on your infrastructure.
          The MIT license means you can use, modify, and distribute OpenClaw freely, including in
          commercial products. This combination of self-hosting and permissive licensing makes
          OpenClaw suitable for organizations with strict data sovereignty requirements and those
          building commercial products on top of the platform.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What OpenClaw Does Not Provide
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While OpenClaw is a powerful platform for deploying AI agents, it is important to understand
        its boundaries. OpenClaw focuses on connectivity, routing, and agent execution -- it does
        not, by itself, provide security sandboxing. An OpenClaw agent runs with the full
        permissions of its host process. It can access any file, make any network request, and
        execute any command that the host user can.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This is not a criticism of OpenClaw -- it is a deliberate architectural decision. OpenClaw
        aims to be a flexible platform that works across many deployment scenarios. Security
        requirements vary enormously between a developer running OpenClaw on their laptop for
        personal use and an enterprise deploying it to serve thousands of users. Rather than
        building opinionated security controls into the core platform, OpenClaw provides the hooks
        and extension points that allow external security layers -- like NemoClaw -- to be added.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This separation of concerns -- OpenClaw for agent functionality, NemoClaw for agent
        security -- is a clean architectural pattern that allows each project to evolve
        independently and be adopted independently based on the operator's needs.
      </p>

      <ReferenceList
        references={[
          {
            type: 'github',
            title: 'OpenClaw GitHub Repository',
            url: 'https://github.com/open-claw/open-claw',
            description: 'Source code, issues, and development activity for the OpenClaw project.',
          },
          {
            type: 'docs',
            title: 'OpenClaw Documentation',
            url: 'https://docs.open-claw.com',
            description: 'Official documentation covering installation, configuration, and API reference.',
          },
          {
            type: 'docs',
            title: 'OpenClaw Messaging Platform Integrations',
            url: 'https://docs.open-claw.com/integrations',
            description: 'Complete list of supported messaging platforms with setup guides for each.',
          },
          {
            type: 'docs',
            title: 'OpenClaw Model Provider Configuration',
            url: 'https://docs.open-claw.com/models',
            description: 'Guide to configuring AI model providers, routing policies, and fallback chains.',
          },
        ]}
      />
    </div>
  )
}
