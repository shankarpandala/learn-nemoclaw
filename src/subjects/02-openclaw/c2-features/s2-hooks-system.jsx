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

export default function HooksSystem() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Hooks are one of OpenClaw's most powerful automation primitives. They allow
        operators and developers to inject custom logic at specific points in the
        agent lifecycle without modifying core Gateway code. A hook is a user-defined
        function or script that fires in response to a specific event, such as a tool
        being executed, a message being received, or a session being created. Hooks
        enable teams to enforce policies, integrate with external systems, and build
        sophisticated automation pipelines around their AI agents.
      </p>

      <DefinitionBlock
        term="Hook"
        definition="A user-defined callback that executes at a specific lifecycle point in the OpenClaw Gateway. Hooks can inspect, modify, or block the event they are attached to. They run synchronously in the Gateway process (inline hooks) or asynchronously as external scripts (exec hooks)."
        example="A beforeToolUse hook intercepts every tool call before execution. A team uses this to block any exec tool call that contains 'rm -rf' by returning { abort: true, reason: 'Destructive command blocked by policy' }."
        seeAlso={['Slash Command', 'Workflow', 'Extension']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Hook Types
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw provides a set of well-defined hook points that cover the full
        lifecycle of message processing and tool execution. Each hook type receives
        a context object with relevant data and can return a result that influences
        subsequent processing.
      </p>

      <ComparisonTable
        title="Available Hook Types"
        headers={['Hook', 'Fires When', 'Can Modify']}
        rows={[
          [
            'beforeToolUse',
            'Before any tool call is executed. Receives the tool name, arguments, and session context.',
            'Can modify arguments, abort the call, or substitute a different tool.',
          ],
          [
            'afterToolUse',
            'After a tool call completes. Receives the tool name, arguments, result, and execution duration.',
            'Can modify the result before it is returned to the LLM, or trigger side effects.',
          ],
          [
            'onMessage',
            'When a new user message arrives, before it is sent to the LLM.',
            'Can modify the message text, inject additional context, or block the message entirely.',
          ],
          [
            'onResponse',
            'After the LLM generates a response, before it is delivered to the user.',
            'Can modify the response, append disclaimers, or trigger follow-up actions.',
          ],
          [
            'onSessionCreate',
            'When a new session is initialized for a user.',
            'Can inject initial context, set session variables, or configure per-session settings.',
          ],
          [
            'onError',
            'When an unhandled error occurs during message processing or tool execution.',
            'Can log the error, notify administrators, or provide a fallback response.',
          ],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Configuring Hooks in settings.json
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Hooks are defined in the OpenClaw configuration file, typically
        <code> openclaw.json</code> or the project-level <code>.openclaw/config.json</code>.
        Each hook entry specifies the event type, execution mode (inline JavaScript
        or external script), and any filtering criteria. Hooks can be scoped globally
        or per-agent.
      </p>

      <CodeBlock
        language="json"
        title="Hook configuration in openclaw.json"
        code={`{
  "hooks": {
    "beforeToolUse": [
      {
        "name": "block-destructive-commands",
        "type": "inline",
        "filter": { "tool": "execute_command" },
        "handler": "if (args.command.match(/rm\\\\s+-rf|mkfs|dd\\\\s+if/)) { return { abort: true, reason: 'Destructive command blocked' }; }"
      },
      {
        "name": "lint-before-commit",
        "type": "exec",
        "filter": { "tool": "execute_command", "argsMatch": "git commit" },
        "command": "npm run lint",
        "workdir": "{{workspace}}",
        "abortOnFailure": true
      }
    ],
    "afterToolUse": [
      {
        "name": "notify-file-changes",
        "type": "exec",
        "filter": { "tool": "write_file" },
        "command": "node ./hooks/notify-change.js '{{tool.args.path}}'",
        "async": true
      }
    ],
    "onMessage": [
      {
        "name": "inject-project-context",
        "type": "inline",
        "handler": "message.context = { branch: execSync('git branch --show-current').toString().trim() }; return message;"
      }
    ]
  }
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Inline vs. Exec Hooks
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw supports two hook execution modes. <strong>Inline hooks</strong> are
        small JavaScript expressions evaluated directly in the Gateway process. They
        have access to the hook context object and can return modified values
        synchronously. <strong>Exec hooks</strong> run external commands or scripts as
        child processes. They receive context through environment variables and
        communicate results through exit codes and stdout.
      </p>

      <ComparisonTable
        title="Inline vs. Exec Hooks"
        headers={['Aspect', 'Inline Hooks', 'Exec Hooks']}
        highlightDiffs
        rows={[
          ['Execution', 'In-process JavaScript eval', 'Spawned child process'],
          ['Latency', 'Microseconds', 'Milliseconds to seconds'],
          ['Language', 'JavaScript only', 'Any language (Node, Python, Bash, etc.)'],
          ['Access', 'Direct access to hook context object', 'Context via env vars and stdin'],
          ['Safety', 'Runs in Gateway process (risky if poorly written)', 'Isolated process with timeout'],
          ['Best For', 'Simple filtering, arg modification', 'Complex logic, external API calls, linting'],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Common Use Cases
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Hooks unlock a wide range of automation patterns. Here are some of the most
        common use cases teams implement with hooks.
      </p>

      <StepBlock
        title="Popular Hook Patterns"
        steps={[
          {
            title: 'Linting Before Commits',
            content:
              'Use a beforeToolUse hook filtered on git commit commands. The hook runs the project linter and aborts the commit if there are violations. This ensures the agent never commits code that fails lint checks.',
            code: '// beforeToolUse hook config\n{\n  "filter": { "tool": "execute_command", "argsMatch": "git commit" },\n  "command": "npm run lint && npm run typecheck",\n  "abortOnFailure": true\n}',
          },
          {
            title: 'Slack Notifications on File Changes',
            content:
              'Use an afterToolUse hook on write_file to send a Slack notification whenever the agent modifies a file. Useful for keeping teams informed about agent activity.',
            code: '// afterToolUse exec hook\n{\n  "filter": { "tool": "write_file" },\n  "command": "curl -X POST $SLACK_WEBHOOK -d \'{\\"text\\":\\"Agent modified: {{tool.args.path}}\\"}\'"  ,\n  "async": true\n}',
          },
          {
            title: 'Custom Audit Logging',
            content:
              'Use afterToolUse hooks to log every tool execution to an external system for compliance. The hook captures tool name, arguments, result summary, duration, and the requesting user.',
            code: '// afterToolUse exec hook\n{\n  "command": "node ./hooks/audit-log.js",\n  "async": true\n}',
          },
          {
            title: 'Injecting Dynamic Context',
            content:
              'Use an onMessage hook to inject the current Git branch, open PRs, or recent CI status into every message. The agent receives richer context without the user needing to provide it.',
          },
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Hook Execution Order and Error Handling
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When multiple hooks are registered for the same event, they execute in the
        order they are defined in the configuration array. Each hook receives the
        output of the previous hook, forming a pipeline. If any hook in the chain
        aborts or throws an error, subsequent hooks are skipped.
      </p>

      <CodeBlock
        language="javascript"
        title="Hook execution pipeline (internal Gateway logic)"
        code={`// Simplified hook pipeline execution
async function executeHookPipeline(hookType, context) {
  const hooks = config.hooks[hookType] || [];

  let currentContext = { ...context };

  for (const hook of hooks) {
    // Check if the hook's filter matches the current context
    if (!matchesFilter(hook.filter, currentContext)) continue;

    try {
      const result = hook.type === 'inline'
        ? evalInline(hook.handler, currentContext)
        : await execExternal(hook.command, currentContext, {
            timeout: hook.timeout || 30000,
            workdir: hook.workdir || config.workspace
          });

      if (result?.abort) {
        return { aborted: true, reason: result.reason, hook: hook.name };
      }

      // Merge hook result into context for next hook
      currentContext = { ...currentContext, ...result };
    } catch (error) {
      if (hook.abortOnFailure) {
        return { aborted: true, reason: error.message, hook: hook.name };
      }
      // Log and continue to next hook
      logger.warn(\`Hook \${hook.name} failed: \${error.message}\`);
    }
  }

  return currentContext;
}`}
      />

      <NoteBlock type="info" title="Hook Timeouts">
        <p>
          Exec hooks have a default timeout of 30 seconds. If a hook exceeds its
          timeout, it is killed and treated as a failure. The <code>timeout</code> field
          in the hook configuration allows overriding this default. Inline hooks do
          not have a separate timeout since they execute synchronously in the Gateway
          event loop.
        </p>
      </NoteBlock>

      <NoteBlock type="tip" title="Debugging Hooks">
        <p>
          Enable hook debug logging by setting <code>"hookDebug": true</code> in your
          configuration. This logs the input context, output result, and execution
          duration for every hook invocation. The Control UI also displays hook
          activity in the session detail view, making it easy to trace hook behavior
          during development.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="A team wants to ensure their agent always runs unit tests after writing any file. Which hook configuration would accomplish this?"
        options={[
          'A beforeToolUse hook filtered on write_file that runs npm test',
          'An afterToolUse hook filtered on write_file that runs npm test',
          'An onMessage hook that appends "run tests" to every message',
          'An onResponse hook that modifies the agent response to include test results',
        ]}
        correctIndex={1}
        explanation="An afterToolUse hook filtered on write_file is the correct choice. It fires after the agent writes a file, at which point the test runner can execute against the updated code. A beforeToolUse hook would run tests before the file is written, which would miss the new changes."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Hooks Reference',
            url: 'https://docs.openclaw.ai/hooks',
            type: 'docs',
            description: 'Complete reference for all hook types, context objects, and configuration options.',
          },
          {
            title: 'Hook Examples Repository',
            url: 'https://github.com/openclawai/hook-examples',
            type: 'github',
            description: 'Community-maintained collection of useful hook scripts and patterns.',
          },
        ]}
      />
    </div>
  );
}
