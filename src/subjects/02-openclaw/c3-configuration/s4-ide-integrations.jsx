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

export default function IdeIntegrations() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While OpenClaw's primary interface is through team communication
        platforms like Slack and Discord, many developers prefer to interact
        with AI agents directly from their development environment. OpenClaw
        supports several IDE integrations that bring agent capabilities into
        the editor, terminal, and even mobile devices. These integrations
        connect to the same Gateway instance, share the same configuration,
        and benefit from the same hooks, permissions, and agent definitions.
      </p>

      <DefinitionBlock
        term="IDE Integration"
        definition="A plugin or extension that connects a development environment (code editor, terminal, mobile app) to the OpenClaw Gateway, allowing developers to interact with agents without switching to a messaging platform. Integrations communicate over the Gateway's WebSocket or HTTP API."
        example="The VS Code extension adds a sidebar panel where developers can chat with the agent, ask it to explain highlighted code, or trigger slash commands -- all while the agent has full access to the open workspace via the Gateway's tool system."
        seeAlso={['Gateway API', 'Control UI', 'WebSocket']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        VS Code Extension
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The VS Code extension is the most feature-rich IDE integration. It
        provides a dedicated chat panel in the sidebar, inline code actions,
        and deep integration with VS Code's editor features. The extension
        connects to a running OpenClaw Gateway and creates a session tied
        to the current workspace.
      </p>

      <StepBlock
        title="Installing the VS Code Extension"
        steps={[
          {
            title: 'Install from Marketplace',
            content:
              'Search for "OpenClaw" in the VS Code Extensions marketplace, or install from the command line.',
            code: 'code --install-extension openclaw.openclaw-vscode',
          },
          {
            title: 'Configure Gateway Connection',
            content:
              'Open VS Code settings and set the Gateway URL. If the Gateway is running locally with default settings, the extension auto-discovers it.',
            code: '// .vscode/settings.json\n{\n  "openclaw.gatewayUrl": "ws://localhost:18789",\n  "openclaw.autoConnect": true,\n  "openclaw.agent": "@coder"\n}',
          },
          {
            title: 'Authenticate',
            content:
              'If the Gateway uses pairing mode, the extension prompts for a pairing code on first connection. In allowlist mode, the extension sends the user\'s configured identity.',
          },
          {
            title: 'Start Using',
            content:
              'Open the OpenClaw panel from the Activity Bar. The chat interface appears in the sidebar with full access to slash commands, workflows, and agent tools.',
          },
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The VS Code extension offers several features beyond basic chat. It
        supports inline code actions (right-click a selection and choose
        "Ask OpenClaw"), automatic context injection (the agent sees the
        currently open file and cursor position), diff previews for file
        modifications, and integration with VS Code's source control panel
        for reviewing agent-generated changes.
      </p>

      <CodeBlock
        language="json"
        title="VS Code extension settings"
        code={`{
  "openclaw.gatewayUrl": "ws://localhost:18789",
  "openclaw.autoConnect": true,
  "openclaw.agent": "@coder",
  "openclaw.inlineActions": true,
  "openclaw.contextInjection": {
    "activeFile": true,
    "selection": true,
    "diagnostics": true,
    "gitDiff": true
  },
  "openclaw.diffPreview": true,
  "openclaw.statusBar": {
    "show": true,
    "showModel": true,
    "showSessionId": false
  }
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        JetBrains Plugin
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The JetBrains plugin supports IntelliJ IDEA, WebStorm, PyCharm,
        GoLand, and other JetBrains IDEs. It provides functionality similar
        to the VS Code extension: a tool window for chat, intention actions
        for code assistance, and integration with the IDE's built-in
        diff viewer.
      </p>

      <CodeBlock
        language="bash"
        title="Installing the JetBrains plugin"
        code={`# From JetBrains Marketplace (inside the IDE):
# Settings > Plugins > Marketplace > Search "OpenClaw"

# Or install from CLI:
# Download the plugin ZIP from the OpenClaw releases page
# Settings > Plugins > Install Plugin from Disk > select ZIP`}
      />

      <ComparisonTable
        title="VS Code vs JetBrains Feature Comparison"
        headers={['Feature', 'VS Code Extension', 'JetBrains Plugin']}
        rows={[
          ['Chat panel', 'Sidebar panel', 'Tool window'],
          ['Inline actions', 'Right-click context menu', 'Alt+Enter intention actions'],
          ['Context injection', 'Active file, selection, diagnostics, git diff', 'Active file, selection, inspections'],
          ['Diff preview', 'VS Code diff editor', 'JetBrains diff viewer'],
          ['Multi-agent routing', 'Agent selector dropdown', 'Agent selector in tool window'],
          ['Remote development', 'Full support (Remote SSH, Codespaces)', 'Gateway mode (beta)'],
          ['Streaming responses', 'Full streaming', 'Full streaming'],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Terminal Mode
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For developers who prefer the command line, OpenClaw provides a
        terminal-based interface. The <code>openclaw</code> CLI can operate in
        interactive mode (a REPL-like chat session) or single-shot mode (send
        a prompt and get a response). Terminal mode is especially useful for
        scripting, CI/CD pipelines, and SSH sessions where a GUI is not
        available.
      </p>

      <CodeBlock
        language="bash"
        title="Terminal mode usage"
        code={`# Interactive chat mode
openclaw chat
# Opens a REPL with streaming responses, slash commands, and tool output

# Single-shot mode (useful in scripts)
openclaw ask "Explain the error in src/auth.ts line 42"

# Pipe input from files
cat error.log | openclaw ask "What caused this error?"

# Use a specific agent
openclaw chat --agent @reviewer

# Connect to a remote Gateway
openclaw chat --gateway ws://server.internal:18789

# Headless mode (no TUI, plain text output)
openclaw ask --headless "Generate a migration for adding a users table"`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Mobile Nodes (iOS and Android)
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw mobile nodes allow developers to interact with their agents
        from iOS and Android devices. Mobile nodes are lightweight clients
        that connect to the Gateway over HTTPS/WSS and provide a chat-focused
        interface optimized for touch. They support text messaging, slash
        commands, and viewing tool execution results, but do not include
        code editing features.
      </p>

      <CodeBlock
        language="json"
        title="Mobile node connection configuration"
        code={`{
  "mobileNodes": {
    "enabled": true,
    "authentication": "pairing",
    "tls": {
      "required": true,
      "certPath": "/etc/ssl/openclaw/cert.pem",
      "keyPath": "/etc/ssl/openclaw/key.pem"
    },
    "pushNotifications": {
      "enabled": true,
      "provider": "firebase",
      "events": ["toolComplete", "mentionResponse", "errorAlert"]
    }
  }
}`}
      />

      <NoteBlock type="info" title="Mobile Security">
        <p>
          Mobile nodes require TLS for all connections. The Gateway refuses
          unencrypted WebSocket connections from mobile clients. This is
          enforced regardless of the <code>tls.required</code> setting to
          prevent accidental exposure of conversation data over public networks.
          Mobile authentication uses the same permission mode as other clients.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Remote Development with VS Code Remote SSH
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The VS Code extension fully supports remote development scenarios.
        When using VS Code Remote SSH, the extension runs on the remote host
        alongside the code, while the UI renders locally. This means the
        extension connects to the Gateway from the remote machine, and the
        agent's tool execution (file reads, command execution) happens on
        the remote host where the code lives.
      </p>

      <CodeBlock
        language="json"
        title="Remote SSH configuration for OpenClaw"
        code={`// Remote machine's .vscode/settings.json
{
  "openclaw.gatewayUrl": "ws://localhost:18789",
  "openclaw.autoConnect": true,
  "openclaw.workspace": "/home/dev/project",

  // If Gateway runs on a different host in the network:
  // "openclaw.gatewayUrl": "ws://gateway.internal:18789",

  // For SSH tunneled Gateway:
  // Forward port 18789 in your SSH config:
  // Host devbox
  //   LocalForward 18789 localhost:18789
}`}
      />

      <NoteBlock type="tip" title="Codespaces and Gitpod">
        <p>
          OpenClaw works seamlessly in GitHub Codespaces and Gitpod environments.
          Install the extension in the devcontainer configuration, and it
          auto-connects to a Gateway running inside the container. The
          <code> .devcontainer/devcontainer.json</code> can include the OpenClaw
          extension ID in the <code>extensions</code> array for automatic
          installation.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="A developer wants to use OpenClaw while SSH'd into a remote server with no desktop environment. Which integration should they use?"
        options={[
          'The VS Code extension with Remote SSH',
          'The JetBrains plugin with Gateway mode',
          'The OpenClaw CLI in terminal mode',
          'A mobile node from their phone',
        ]}
        correctIndex={2}
        explanation="Terminal mode (openclaw chat) is the best choice for SSH sessions without a GUI. It provides a full REPL-like chat interface in the terminal with streaming responses, slash commands, and tool output. VS Code Remote SSH is also viable but requires VS Code running locally, which the question implies is not the case."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw VS Code Extension',
            url: 'https://marketplace.visualstudio.com/items?itemName=openclaw.openclaw-vscode',
            type: 'docs',
            description: 'VS Code Marketplace listing with installation and configuration details.',
          },
          {
            title: 'OpenClaw CLI Reference',
            url: 'https://docs.openclaw.ai/cli',
            type: 'docs',
            description: 'Complete reference for the openclaw command-line tool.',
          },
          {
            title: 'OpenClaw Mobile Setup Guide',
            url: 'https://docs.openclaw.ai/mobile',
            type: 'docs',
            description: 'Instructions for configuring and securing mobile node connections.',
          },
        ]}
      />
    </div>
  );
}
