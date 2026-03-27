import { useState } from 'react';
import {
  CodeBlock,
  NoteBlock,
  DefinitionBlock,
  ComparisonTable,
  ArchitectureDiagram,
  StepBlock,
  ExerciseBlock,
  ReferenceList,
} from '../../../components/content';

export default function MCPServers() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The Model Context Protocol (MCP) is an open standard that defines how AI
        agents communicate with external tool providers. OpenClaw has first-class
        support for MCP servers, enabling agents to connect to a vast ecosystem of
        third-party capabilities without writing custom extension code. MCP servers
        run as separate processes and communicate with the Gateway over stdio or
        HTTP-based transports.
      </p>

      <DefinitionBlock
        term="Model Context Protocol (MCP)"
        definition="An open protocol, originally proposed by Anthropic, that standardizes how AI models discover and invoke tools provided by external servers. MCP defines a JSON-RPC-based communication format for tool listing, invocation, and result delivery."
        example="An MCP server for GitHub exposes tools like create_pull_request, list_issues, and merge_branch. The agent discovers these tools at startup and can call them during conversations."
        seeAlso={['Extension', 'Tool', 'JSON-RPC']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        How MCP Works in OpenClaw
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When the Gateway starts, it reads the MCP server configuration and launches
        each configured server as a child process (for stdio transport) or connects
        to it over HTTP (for SSE/streamable HTTP transport). The Gateway then sends an
        <code> initialize</code> request followed by a <code>tools/list</code> request
        to discover available tools. These tools are merged into the agent's tool
        manifest alongside any built-in extension tools.
      </p>

      <ArchitectureDiagram
        title="MCP Integration Architecture"
        components={[
          { name: 'OpenClaw Gateway', description: 'MCP Client', color: 'blue' },
          { name: 'GitHub MCP Server', description: 'stdio transport', color: 'green' },
          { name: 'Database MCP Server', description: 'SSE transport', color: 'green' },
          { name: 'Filesystem MCP Server', description: 'stdio transport', color: 'green' },
          { name: 'Custom MCP Server', description: 'HTTP transport', color: 'purple' },
        ]}
        connections={[
          { from: 'OpenClaw Gateway', to: 'GitHub MCP Server', label: 'JSON-RPC over stdio' },
          { from: 'OpenClaw Gateway', to: 'Database MCP Server', label: 'JSON-RPC over SSE' },
          { from: 'OpenClaw Gateway', to: 'Filesystem MCP Server', label: 'JSON-RPC over stdio' },
          { from: 'OpenClaw Gateway', to: 'Custom MCP Server', label: 'JSON-RPC over HTTP' },
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Configuring MCP Servers
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        MCP servers are configured in the <code>mcpServers</code> section of the
        OpenClaw configuration. Each entry specifies the server command (for stdio
        transport) or URL (for HTTP transport), along with any environment variables
        or arguments the server needs.
      </p>

      <CodeBlock
        language="json"
        title="MCP server configuration (openclaw.json)"
        code={`{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "\${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "\${DATABASE_URL}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y", "@modelcontextprotocol/server-filesystem",
        "/home/user/projects",
        "/home/user/docs"
      ]
    },
    "custom-api": {
      "url": "http://localhost:3001/mcp",
      "transport": "sse"
    }
  }
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        MCP Communication Flow
      </h3>

      <StepBlock
        title="MCP Tool Invocation Lifecycle"
        steps={[
          {
            title: 'Server Initialization',
            content:
              'At startup, the Gateway spawns the MCP server process and sends an "initialize" request with the client capabilities. The server responds with its capabilities and protocol version.',
            code: `// Gateway -> MCP Server
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "clientInfo": { "name": "openclaw", "version": "1.2.0" },
    "capabilities": {}
  }
}`,
            language: 'json',
          },
          {
            title: 'Tool Discovery',
            content:
              'The Gateway requests the list of available tools. Each tool includes a name, description, and JSON Schema for its input parameters.',
            code: `// Gateway -> MCP Server
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }

// MCP Server -> Gateway
{
  "jsonrpc": "2.0", "id": 2,
  "result": {
    "tools": [
      {
        "name": "create_issue",
        "description": "Create a GitHub issue",
        "inputSchema": {
          "type": "object",
          "properties": {
            "repo": { "type": "string" },
            "title": { "type": "string" },
            "body": { "type": "string" }
          },
          "required": ["repo", "title"]
        }
      }
    ]
  }
}`,
            language: 'json',
          },
          {
            title: 'Tool Invocation',
            content:
              'When the LLM decides to use an MCP tool, the Gateway forwards the call to the appropriate MCP server using the tools/call method.',
            code: `// Gateway -> MCP Server
{
  "jsonrpc": "2.0", "id": 3,
  "method": "tools/call",
  "params": {
    "name": "create_issue",
    "arguments": {
      "repo": "myorg/myrepo",
      "title": "Fix login bug",
      "body": "Users report 500 errors on /login"
    }
  }
}`,
            language: 'json',
          },
          {
            title: 'Result Returned',
            content:
              'The MCP server executes the action and returns the result. The Gateway feeds this back into the LLM conversation as a tool result.',
          },
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Common MCP Integrations
      </h3>

      <ComparisonTable
        title="Popular MCP Servers for OpenClaw"
        headers={['MCP Server', 'Capabilities', 'Use Cases']}
        rows={[
          ['server-github', 'Issues, PRs, repos, branches, code search', 'Code review workflows, issue triage, automated PR creation'],
          ['server-postgres', 'SQL queries, schema inspection, data export', 'Database exploration, report generation, migrations'],
          ['server-filesystem', 'Scoped file read/write, directory listing', 'Project navigation with controlled filesystem access'],
          ['server-slack', 'Channel management, message search, posting', 'Cross-referencing Slack discussions, posting updates'],
          ['server-puppeteer', 'Browser automation, screenshots, PDF generation', 'Web testing, documentation capture, form automation'],
          ['server-memory', 'Knowledge graph storage and retrieval', 'Persistent agent memory across sessions'],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        MCP Resources and Prompts
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond tools, MCP servers can also expose <strong>resources</strong> and
        <strong> prompts</strong>. Resources are read-only data sources that the agent
        can reference, such as documentation, configuration files, or database schemas.
        Prompts are pre-built prompt templates that the server provides for common
        tasks. OpenClaw supports both of these MCP capabilities.
      </p>

      <CodeBlock
        language="json"
        title="MCP resource example"
        code={`// Requesting a resource
{
  "jsonrpc": "2.0", "id": 4,
  "method": "resources/read",
  "params": {
    "uri": "postgres://localhost/mydb/schema"
  }
}

// Response with resource contents
{
  "jsonrpc": "2.0", "id": 4,
  "result": {
    "contents": [
      {
        "uri": "postgres://localhost/mydb/schema",
        "mimeType": "application/json",
        "text": "{ \\"tables\\": [\\"users\\", \\"orders\\", \\"products\\"] }"
      }
    ]
  }
}`}
      />

      <NoteBlock type="warning" title="MCP Security Considerations">
        <p>
          MCP servers run with the same privileges as the OpenClaw Gateway process.
          A malicious or poorly configured MCP server can expose sensitive data,
          make unauthorized network requests, or modify the filesystem. OpenClaw
          does not sandbox MCP servers. The environment variables passed to MCP
          servers often contain credentials (API tokens, database URLs), which
          introduces additional attack surface. NemoClaw addresses these risks
          through its policy layer.
        </p>
      </NoteBlock>

      <NoteBlock type="tip" title="Testing MCP Servers Locally">
        <p>
          You can test MCP servers independently before connecting them to OpenClaw
          using the <code>mcp-inspector</code> tool or by sending JSON-RPC messages
          directly over stdio. This helps verify tool schemas and behavior before
          enabling them for agents.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="What transport protocols does OpenClaw support for MCP server communication?"
        options={[
          'Only HTTP REST',
          'stdio and HTTP-based transports (SSE, streamable HTTP)',
          'gRPC and WebSocket only',
          'Only stdio pipes',
        ]}
        correctIndex={1}
        explanation="OpenClaw supports both stdio transport (launching the MCP server as a child process) and HTTP-based transports (SSE and streamable HTTP for remote MCP servers). This flexibility allows both local and remote MCP server deployments."
      />

      <ReferenceList
        references={[
          {
            title: 'Model Context Protocol Specification',
            url: 'https://spec.modelcontextprotocol.io',
            type: 'docs',
            description: 'The official MCP specification with protocol details and transport options.',
          },
          {
            title: 'MCP Servers Repository',
            url: 'https://github.com/modelcontextprotocol/servers',
            type: 'github',
            description: 'Collection of official and community MCP server implementations.',
          },
          {
            title: 'Building Custom MCP Servers',
            url: 'https://modelcontextprotocol.io/quickstart/server',
            type: 'docs',
            description: 'Guide to building your own MCP server for custom integrations.',
          },
        ]}
      />
    </div>
  );
}
