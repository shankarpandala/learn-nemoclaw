import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, ArchitectureDiagram, ExerciseBlock, ReferenceList } from '../../../components/content';

export default function PluginInternals() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Plugin Internals
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NemoClaw TypeScript plugin is the thinnest possible integration between
        OpenClaw and the NemoClaw blueprint. It lives inside OpenClaw's extension host
        and exists to do exactly three things: register an inference provider, add the
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">/nemoclaw</code> slash
        command, and relay messages over IPC. This section examines how each of these
        pieces works internally.
      </p>

      <ArchitectureDiagram
        title="Plugin Internal Architecture"
        components={[
          { name: 'OpenClaw Extension Host', description: 'Runs all extensions', color: 'blue' },
          { name: 'NemoClaw Plugin', description: '~200 lines TypeScript', color: 'green' },
          { name: 'Inference Provider', description: 'Registered LM provider', color: 'purple' },
          { name: 'Slash Command', description: '/nemoclaw command handler', color: 'orange' },
          { name: 'IPC Channel', description: 'JSON-RPC to blueprint', color: 'gray' },
        ]}
        connections={[
          { from: 'OpenClaw Extension Host', to: 'NemoClaw Plugin', label: 'activate()' },
          { from: 'NemoClaw Plugin', to: 'Inference Provider', label: 'registers' },
          { from: 'NemoClaw Plugin', to: 'Slash Command', label: 'registers' },
          { from: 'Inference Provider', to: 'IPC Channel', label: 'forwards requests' },
          { from: 'Slash Command', to: 'IPC Channel', label: 'forwards commands' },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Inference Provider Registration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When OpenClaw loads the NemoClaw plugin, the plugin's{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">activate()</code> function
        runs. The first thing it does is register a chat model provider with OpenClaw's
        language model API. This tells OpenClaw that NemoClaw can handle inference
        requests.
      </p>

      <CodeBlock
        title="Inference provider registration"
        language="javascript"
        code={`// src/extension.ts (simplified)
import * as openclaw from 'openclaw';
import { BlueprintIPC } from './ipc';

class NemoClawProvider implements openclaw.ChatModelProvider {
  private ipc: BlueprintIPC;

  constructor(ipc: BlueprintIPC) {
    this.ipc = ipc;
  }

  // Called by OpenClaw when a completion is requested
  async provideChatResponse(
    messages: openclaw.ChatMessage[],
    options: openclaw.ChatModelOptions,
    token: openclaw.CancellationToken
  ): Promise<openclaw.ChatModelResponse> {
    // Forward the entire request to the blueprint over IPC
    const result = await this.ipc.call('inference.complete', {
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      model: options.model,
      temperature: options.temperature,
    });

    return {
      content: result.content,
      usage: result.usage,
    };
  }
}

export function activate(context: openclaw.ExtensionContext) {
  const ipc = new BlueprintIPC();

  // Register inference provider
  const provider = new NemoClawProvider(ipc);
  context.subscriptions.push(
    openclaw.lm.registerChatModelProvider('nemoclaw', provider)
  );
}`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Notice that the provider class contains zero inference logic. It does not know
        which LLM is configured, does not hold API credentials, and does not parse the
        response. It is a pure pass-through. The blueprint handles all of those concerns.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Slash Command Handler
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The second registration is the{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">/nemoclaw</code> slash
        command. This gives users a way to interact with NemoClaw directly from the
        OpenClaw command input. The slash command supports subcommands like{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">status</code>,{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">apply</code>,{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">plan</code>, and{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">config</code>.
      </p>

      <CodeBlock
        title="Slash command registration"
        language="javascript"
        code={`// Continuing from activate()

function handleSlashCommand(args: string): string {
  const [subcommand, ...rest] = args.trim().split(/\\s+/);

  switch (subcommand) {
    case 'status':
      return ipc.call('status', {});
    case 'apply':
      return ipc.call('apply', { args: rest });
    case 'plan':
      return ipc.call('plan', { args: rest });
    case 'config':
      return ipc.call('config', { args: rest });
    default:
      return \`Unknown subcommand: \${subcommand}. \\
Try: status, apply, plan, config\`;
  }
}

// Register the slash command
context.subscriptions.push(
  openclaw.commands.registerCommand(
    'nemoclaw.slash',
    handleSlashCommand
  )
);`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        IPC Communication
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The plugin communicates with the blueprint over a Unix domain socket using
        JSON-RPC 2.0. The IPC layer is the most complex part of the plugin, but even
        so it is under 80 lines of code. It handles connection management, request/
        response correlation, and timeout handling.
      </p>

      <CodeBlock
        title="IPC client (simplified)"
        language="javascript"
        code={`// src/ipc.ts (simplified)
import { connect } from 'net';

export class BlueprintIPC {
  private socket: net.Socket;
  private pending = new Map<number, { resolve, reject }>();
  private nextId = 1;

  constructor() {
    const socketPath = process.env.NEMOCLAW_SOCKET
      ?? '/run/nemoclaw/blueprint.sock';
    this.socket = connect(socketPath);
    this.socket.on('data', (data) => this.handleResponse(data));
  }

  async call(method: string, params: any): Promise<any> {
    const id = this.nextId++;
    const request = {
      jsonrpc: '2.0',
      method,
      params,
      id,
    };

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.write(JSON.stringify(request) + '\\n');

      // Timeout after 30s
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(\`IPC timeout for \${method}\`));
        }
      }, 30000);
    });
  }

  private handleResponse(data: Buffer) {
    const response = JSON.parse(data.toString());
    const pending = this.pending.get(response.id);
    if (pending) {
      this.pending.delete(response.id);
      if (response.error) {
        pending.reject(new Error(response.error.message));
      } else {
        pending.resolve(response.result);
      }
    }
  }
}`}
      />

      <NoteBlock type="info" title="Why Unix Domain Sockets?">
        The IPC uses Unix domain sockets rather than TCP because they are local-only
        by nature (no network exposure), support file-based permissions (the socket
        file is readable only by the current user), and have lower overhead than TCP
        for local communication. The socket file is created by the blueprint process
        when it starts.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        What the Plugin Does NOT Do
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Understanding the plugin's boundaries is as important as understanding its
        functions. The plugin explicitly does not:
      </p>

      <ComparisonTable
        title="Plugin Boundaries"
        headers={['Concern', 'Plugin Does This?', 'Who Does?']}
        rows={[
          ['Hold API credentials', 'No', 'Blueprint (host-side)'],
          ['Parse policy files', 'No', 'Blueprint'],
          ['Manage sandbox lifecycle', 'No', 'Blueprint + OpenShell'],
          ['Verify blueprint digests', 'No', 'Blueprint self-verification'],
          ['Route inference requests', 'No (just forwards)', 'Blueprint'],
          ['Handle errors from LLM', 'No (just relays)', 'Blueprint'],
          ['Cache completions', 'No', 'Blueprint (optional)'],
          ['Show UI elements', 'Minimal (status bar)', 'TUI / OpenClaw native'],
        ]}
      />

      <ExerciseBlock
        question="What would happen if the blueprint process is not running when the plugin tries to send an IPC message?"
        options={[
          'The plugin crashes and takes down OpenClaw',
          'The IPC connection fails, and the plugin returns a user-friendly error indicating the blueprint is not running',
          'The message is queued and delivered when the blueprint starts',
          'The plugin automatically starts the blueprint process',
        ]}
        correctIndex={1}
        explanation="The plugin handles IPC failures gracefully. If the blueprint is not running, the Unix domain socket connection will fail, and the plugin will return an error message to OpenClaw suggesting the user run 'nemoclaw apply' or check the blueprint status. The plugin does not attempt to start the blueprint -- that is the user's or system's responsibility."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Plugin Source',
            url: 'https://github.com/NVIDIA/NemoClaw/tree/main/plugin',
            type: 'github',
            description: 'TypeScript source code for the NemoClaw OpenClaw plugin.',
          },
          {
            title: 'OpenClaw Extension API',
            url: 'https://docs.openclaw.dev/api/extensions',
            type: 'docs',
            description: 'API reference for OpenClaw extension development.',
          },
        ]}
      />
    </div>
  );
}
