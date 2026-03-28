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

export default function ExtensionSystem() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        One of OpenClaw's most powerful features is its extension system. Extensions
        are the mechanism by which agents gain capabilities beyond simple text
        generation. Through extensions, an agent can execute shell commands, read and
        write files, browse the web, interact with APIs, and perform virtually any
        action that a developer might do manually. Understanding how extensions work
        is critical for appreciating the security surface that NemoClaw is designed
        to protect.
      </p>

      <DefinitionBlock
        term="Extension"
        definition="A discrete capability that can be granted to an OpenClaw agent. Extensions expose one or more tools that the LLM can invoke during a conversation. Each tool has a name, description, input schema, and an execution handler."
        example='The built-in "exec" extension provides a tool called "execute_command" that runs shell commands on the host system and returns stdout/stderr to the agent.'
        seeAlso={['Tool', 'MCP Server', 'Allow List']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        How Agents Get Capabilities
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When the Gateway starts, it loads the agent configuration which specifies
        which extensions are enabled. Each extension registers its tools with the
        Gateway's tool registry. When a conversation begins, the Gateway constructs
        a tool manifest, a list of all available tools with their descriptions
        and schemas, and includes it in the system prompt sent to the LLM.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The LLM then knows what tools are available and can choose to invoke them
        by emitting structured tool-use blocks in its response. The Gateway intercepts
        these blocks, dispatches them to the appropriate extension handler, collects
        the results, and feeds them back into the conversation.
      </p>

      <CodeBlock
        language="json"
        title="Agent configuration with extensions (openclaw.json)"
        code={`{
  "agents": {
    "default": {
      "model": "claude-sonnet-4-20250514",
      "extensions": {
        "exec": { "enabled": true },
        "file_io": { "enabled": true },
        "browser": {
          "enabled": true,
          "options": {
            "headless": true,
            "timeout": 30000
          }
        },
        "git": { "enabled": true },
        "custom_api": {
          "enabled": true,
          "module": "./extensions/custom-api.js"
        }
      }
    }
  }
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Built-in Extensions
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw ships with several built-in extensions that cover the most common
        development tasks. These are available out of the box and can be enabled or
        disabled per agent.
      </p>

      <ComparisonTable
        title="Built-in Extensions Overview"
        headers={['Extension', 'Tools Provided', 'Description']}
        rows={[
          ['exec', 'execute_command', 'Runs arbitrary shell commands on the host. Returns stdout, stderr, and exit code.'],
          ['file_io', 'read_file, write_file, list_directory, search_files', 'Full filesystem access for reading, writing, and searching files.'],
          ['browser', 'navigate, screenshot, click, type, evaluate', 'Headless Chromium browser for web interactions, testing, and scraping.'],
          ['git', 'git_status, git_diff, git_commit, git_log, git_branch', 'Git operations for version control within the workspace.'],
          ['fetch', 'http_request', 'Makes HTTP requests to arbitrary URLs. Supports GET, POST, PUT, DELETE.'],
          ['search', 'web_search', 'Performs web searches using configured search providers.'],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Tool Allow and Deny Lists
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw provides a basic mechanism for controlling which tools an agent
        can use through allow and deny lists. These are configured at the agent level
        and act as a coarse-grained filter on the tool manifest. When an allow list
        is specified, only tools explicitly listed are included. When a deny list is
        specified, all tools except those listed are included.
      </p>

      <CodeBlock
        language="json"
        title="Tool allow/deny list configuration"
        code={`{
  "agents": {
    "safe-agent": {
      "model": "claude-sonnet-4-20250514",
      "extensions": {
        "exec": { "enabled": true },
        "file_io": { "enabled": true },
        "browser": { "enabled": true }
      },
      "toolPolicy": {
        "mode": "allowlist",
        "allow": [
          "read_file",
          "list_directory",
          "search_files",
          "execute_command"
        ]
      }
    },
    "restricted-agent": {
      "model": "claude-sonnet-4-20250514",
      "extensions": {
        "exec": { "enabled": true },
        "file_io": { "enabled": true }
      },
      "toolPolicy": {
        "mode": "denylist",
        "deny": [
          "write_file",
          "execute_command"
        ]
      }
    }
  }
}`}
      />

      <NoteBlock type="warning" title="Allow/Deny Lists Are Not Security Boundaries">
        <p>
          Tool allow/deny lists in OpenClaw are a convenience feature, not a security
          mechanism. They control which tools appear in the LLM's tool manifest, but
          they do not prevent the agent from achieving the same effect through other
          means. For example, denying <code>write_file</code> does not prevent the
          agent from writing files via <code>execute_command</code> using
          shell redirects. True security boundaries require NemoClaw's policy
          enforcement layer.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The exec Extension in Detail
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code>exec</code> extension is the most powerful and most dangerous
        built-in extension. It provides a single tool, <code>execute_command</code>,
        which runs an arbitrary shell command on the host system with the same
        privileges as the OpenClaw Gateway process. This means the agent can install
        packages, modify system files, start services, make network requests via
        <code> curl</code>, and perform any other action the host user can perform.
      </p>

      <CodeBlock
        language="json"
        title="Example tool call from the LLM"
        code={`{
  "type": "tool_use",
  "id": "toolu_01ABC",
  "name": "execute_command",
  "input": {
    "command": "npm install express && node server.js",
    "timeout": 60000,
    "workingDirectory": "/home/user/project"
  }
}`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The extension executes this command by spawning a child process, captures
        stdout and stderr, and returns the result to the LLM. There are no built-in
        restrictions on what commands can be run, no sandboxing, and no approval
        workflow. The agent operates with full trust.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The file_io Extension
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code>file_io</code> extension provides granular file operations without
        going through the shell. It exposes tools for reading files (with optional
        line ranges), writing files (full replacement or patch-based edits), listing
        directories, and searching file contents with regex patterns. While these
        operations could also be accomplished through <code>exec</code>, the dedicated
        file tools give the LLM more structured interfaces and produce more predictable
        results.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The browser Extension
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code>browser</code> extension launches a headless Chromium instance
        and provides tools for web navigation, DOM interaction, screenshots, and
        JavaScript evaluation. Agents use this for tasks like testing web applications,
        scraping documentation, filling out forms, and verifying UI changes. The
        browser runs on the host with full network access, meaning the agent can
        visit any URL, including internal network resources.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Custom Extensions
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond built-in extensions, OpenClaw supports custom extensions written as
        JavaScript modules. A custom extension exports a function that receives the
        Gateway context and returns an array of tool definitions. This is how teams
        integrate proprietary APIs, internal tooling, and domain-specific capabilities.
      </p>

      <CodeBlock
        language="javascript"
        title="Custom extension example (extensions/jira-tools.js)"
        code={`export default function jiraExtension(context) {
  return [
    {
      name: 'create_jira_ticket',
      description: 'Creates a new Jira ticket in the specified project',
      inputSchema: {
        type: 'object',
        properties: {
          project: { type: 'string', description: 'Project key (e.g., ENG)' },
          title: { type: 'string', description: 'Ticket title' },
          description: { type: 'string', description: 'Ticket description' },
          type: { type: 'string', enum: ['bug', 'task', 'story'] },
        },
        required: ['project', 'title'],
      },
      async execute({ project, title, description, type = 'task' }) {
        const response = await fetch(process.env.JIRA_URL + '/rest/api/2/issue', {
          method: 'POST',
          headers: {
            'Authorization': \`Basic \${Buffer.from(
              process.env.JIRA_USER + ':' + process.env.JIRA_TOKEN
            ).toString('base64')}\`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: { project: { key: project }, summary: title, description, issuetype: { name: type } }
          }),
        });
        return await response.json();
      },
    },
  ];
}`}
      />

      <NoteBlock type="info" title="Extension Hot-Reload">
        <p>
          Custom extensions support hot-reload in development mode. When the Gateway
          detects changes to an extension file, it re-registers the tools without
          restarting the entire process. This is controlled by the
          <code> hotReload</code> flag in the extension configuration.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="Why are OpenClaw's tool allow/deny lists insufficient as a security boundary?"
        options={[
          'They only work with built-in extensions, not custom ones',
          'They can be bypassed because agents can use exec to achieve the same effects',
          'They require a restart to take effect',
          'They are not supported in production mode',
        ]}
        correctIndex={1}
        explanation="Allow/deny lists control which tools appear in the LLM's manifest, but an agent with access to execute_command can achieve the effect of any denied tool through shell commands. For example, denying write_file does not prevent writing files via shell redirects."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Extensions Guide',
            url: 'https://docs.openclaw.ai/extensions',
            type: 'docs',
            description: 'Complete guide to built-in and custom extensions.',
          },
          {
            title: 'OpenClaw Tool Schema Reference',
            url: 'https://docs.openclaw.ai/tool-schema',
            type: 'docs',
            description: 'JSON Schema format for defining extension tools.',
          },
        ]}
      />
    </div>
  );
}
