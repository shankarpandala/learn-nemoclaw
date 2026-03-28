import { useState } from 'react';
import {
  CodeBlock,
  NoteBlock,
  DefinitionBlock,
  ArchitectureDiagram,
  StepBlock,
  ExerciseBlock,
  ReferenceList,
} from '../../../components/content';

export default function CoreComponents() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw is a platform that connects AI coding agents to team communication
        tools such as Slack and Discord. Rather than running a single monolithic process,
        OpenClaw is built around a <strong>Gateway</strong> that acts as the central
        nervous system of the entire deployment. Understanding the Gateway's architecture
        is the first step toward appreciating where NemoClaw adds its security layer.
      </p>

      <DefinitionBlock
        term="OpenClaw Gateway"
        definition="The core process that brokers every interaction between messaging platforms, the LLM provider, and any connected tools or extensions. It manages session state, routes messages to the correct agent, and exposes the Control UI for administration."
        example="When a Slack user sends a message in a channel where OpenClaw is installed, the Gateway receives the Slack event, resolves the correct session and agent, forwards the prompt to the LLM, streams the response back, and persists the conversation."
        seeAlso={['Control UI', 'WebSocket', 'Session']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        High-Level Architecture
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        At its core, the OpenClaw Gateway is a Node.js server that coordinates several
        subsystems. Incoming messages arrive from platform adapters (Slack, Discord, CLI,
        or the built-in web UI). The Gateway normalizes these into a common internal
        message format, resolves the target session, and dispatches the request to the
        configured LLM backend, most commonly the Anthropic Claude API. Responses stream
        back through the same path in reverse.
      </p>

      <ArchitectureDiagram
        title="OpenClaw Gateway Architecture"
        components={[
          { name: 'Slack Adapter', description: 'Socket Mode / Events API', color: 'purple' },
          { name: 'Discord Adapter', description: 'Bot gateway connection', color: 'purple' },
          { name: 'Web UI Adapter', description: 'Built-in chat interface', color: 'purple' },
          { name: 'Gateway Core', description: 'Message routing, session mgmt', color: 'blue' },
          { name: 'Session Store', description: 'Conversation history & state', color: 'green' },
          { name: 'LLM Backend', description: 'Claude API / OpenAI / local', color: 'orange' },
          { name: 'Tool Executor', description: 'Extensions, MCP, built-ins', color: 'red' },
          { name: 'Control UI', description: 'Admin dashboard on :18789', color: 'gray' },
        ]}
        connections={[
          { from: 'Slack Adapter', to: 'Gateway Core', label: 'events' },
          { from: 'Discord Adapter', to: 'Gateway Core', label: 'events' },
          { from: 'Web UI Adapter', to: 'Gateway Core', label: 'WebSocket' },
          { from: 'Gateway Core', to: 'Session Store', label: 'read/write' },
          { from: 'Gateway Core', to: 'LLM Backend', label: 'prompt/stream' },
          { from: 'Gateway Core', to: 'Tool Executor', label: 'tool calls' },
          { from: 'Gateway Core', to: 'Control UI', label: 'HTTP/WS' },
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Message Routing
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Every inbound message passes through a well-defined routing pipeline. The
        Gateway first identifies the <em>platform</em> and <em>peer</em> (user) from
        the incoming event. It then resolves the <em>session</em> using the configured
        scoping strategy (per-peer, per-channel-peer, or shared main). Once a session
        is identified, the Gateway checks whether the user has permission to interact
        with the agent, applies any pre-processing hooks, and finally dispatches the
        message to the LLM.
      </p>

      <StepBlock
        title="Message Lifecycle"
        steps={[
          {
            title: 'Platform Event Received',
            content:
              'A Slack message, Discord message, or WebSocket frame arrives at the appropriate adapter. The adapter normalizes it into an internal ChatMessage object with fields like peerId, channelId, text, and attachments.',
          },
          {
            title: 'Session Resolution',
            content:
              'The Gateway looks up or creates a session based on the scoping rules. For per-peer scoping, the session key is derived from the user ID alone. For per-channel-peer, it combines channel and user. Shared main sessions use a single key for the entire workspace.',
          },
          {
            title: 'Permission Check',
            content:
              'The Gateway evaluates whether the peer is allowed to interact. This checks DM access policies, channel allowlists, and the active permission mode (allowlist, pairing, open, or disabled).',
          },
          {
            title: 'Hook Execution (Pre)',
            content:
              'Any registered pre-message hooks fire. These can modify the message, inject context, or abort processing entirely.',
          },
          {
            title: 'LLM Dispatch',
            content:
              'The message, along with conversation history from the session store, is sent to the configured LLM backend. The response streams back token by token.',
          },
          {
            title: 'Tool Execution (if needed)',
            content:
              'If the LLM response includes tool-use blocks, the Gateway dispatches each tool call to the Tool Executor, collects results, and sends them back to the LLM for a follow-up response.',
          },
          {
            title: 'Response Delivery',
            content:
              'The final response is routed back through the originating adapter and delivered to the user in Slack, Discord, or the web UI. The session store is updated with both the user message and the assistant response.',
          },
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The Control UI (Port 18789)
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The Gateway ships with a built-in administrative interface called the
        <strong> Control UI</strong>. By default, it listens on port <code>18789</code>.
        The Control UI provides a real-time dashboard where administrators can monitor
        active sessions, view conversation histories, manage agent configurations,
        and trigger manual actions. It communicates with the Gateway over WebSocket
        connections, giving it live-updating views of agent activity.
      </p>

      <CodeBlock
        language="bash"
        title="Accessing the Control UI"
        code={`# The Control UI starts automatically with the Gateway
# Default address:
http://localhost:18789

# To change the port, set in openclaw.json:
{
  "controlUI": {
    "port": 18790,
    "host": "0.0.0.0"    // bind to all interfaces
  }
}`}
      />

      <NoteBlock type="tip" title="Control UI in Production">
        <p>
          In production deployments, the Control UI should be placed behind a reverse
          proxy with authentication. OpenClaw does not provide built-in authentication
          for the Control UI. Anyone who can reach port 18789 has full visibility into
          all sessions and can modify agent settings.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        WebSocket Connections
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        WebSocket connections play two distinct roles in OpenClaw. First, the
        Gateway uses WebSockets to communicate with platform adapters that support
        real-time streaming, such as the built-in web chat UI. Second, the Control
        UI itself connects to the Gateway via WebSocket to receive live session
        updates, log streams, and tool execution events.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When the LLM streams a response, the Gateway forwards each token through
        the WebSocket to the connected client, enabling a smooth typing-indicator
        experience in chat. For Slack, which uses HTTP-based APIs, the Gateway
        accumulates tokens and periodically updates the message using the Slack
        <code> chat.update</code> endpoint.
      </p>

      <CodeBlock
        language="javascript"
        title="WebSocket message frame (simplified)"
        code={`// Inbound frame from client
{
  "type": "chat.message",
  "sessionId": "sess_abc123",
  "peerId": "U04EXAMPLE",
  "text": "Explain the OpenClaw architecture",
  "attachments": []
}

// Outbound streaming frame from Gateway
{
  "type": "chat.stream",
  "sessionId": "sess_abc123",
  "delta": "The Gateway is the central...",
  "done": false
}

// Final frame
{
  "type": "chat.stream",
  "sessionId": "sess_abc123",
  "delta": "",
  "done": true,
  "toolCalls": []
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Session Management
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The Gateway maintains an in-memory session store that tracks conversation
        history, active tool executions, and metadata for each session. Sessions
        can optionally be persisted to disk using the workspace model, which stores
        conversation files alongside project-specific context files like
        <code> SOUL.md</code> and <code> MEMORY.md</code>. Session persistence
        allows conversations to survive Gateway restarts and enables agents to
        maintain long-running context across interactions.
      </p>

      <NoteBlock type="info" title="Session Limits">
        <p>
          Each session maintains a sliding context window. When conversation history
          exceeds the configured token limit, the Gateway automatically summarizes
          older messages and compacts the history. This behavior is configurable via
          the <code>maxSessionTokens</code> and <code>compactionStrategy</code> settings
          in <code>openclaw.json</code>.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="Which component is responsible for normalizing platform-specific events into a common format before routing?"
        options={[
          'The LLM Backend',
          'The Platform Adapter',
          'The Session Store',
          'The Control UI',
        ]}
        correctIndex={1}
        explanation="Platform adapters (Slack, Discord, Web UI) are responsible for converting platform-specific events into the internal ChatMessage format that the Gateway Core can process uniformly."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Gateway Documentation',
            url: 'https://github.com/openclawai/openclaw',
            type: 'github',
            description: 'Official repository with architecture details and configuration reference.',
          },
          {
            title: 'OpenClaw Control UI Guide',
            url: 'https://docs.openclaw.ai/control-ui',
            type: 'docs',
            description: 'How to configure and secure the administrative dashboard.',
          },
        ]}
      />
    </div>
  );
}
