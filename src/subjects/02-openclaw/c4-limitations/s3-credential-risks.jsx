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

export default function CredentialRisks() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        AI coding agents need access to external services: LLM APIs, version
        control platforms, package registries, cloud providers, and more.
        In OpenClaw, these credentials are typically passed to the agent
        through environment variables, configuration files, or the host
        system's credential stores. The problem is that once a credential
        enters the agent's execution environment, there is no mechanism to
        prevent it from leaking through tool outputs, generated code, logs,
        or conversation history. This section examines how credential leakage
        happens and why it is so difficult to prevent at the application level.
      </p>

      <DefinitionBlock
        term="Credential Leakage"
        definition="The unintended exposure of authentication secrets (API keys, tokens, passwords) through agent outputs, tool execution results, logs, or generated code. Leakage can be direct (the agent prints the key) or indirect (the key appears in a tool output that gets logged or sent to the LLM)."
        example="An agent runs 'env | grep API' to check configuration, and the output includes ANTHROPIC_API_KEY=sk-ant-... This value is now in the conversation history, potentially visible to other users in the channel, and stored in the session log."
        seeAlso={['Environment Variable', 'Secret Reference', 'Session Store']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        How Credentials Enter the Agent Environment
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In a typical OpenClaw deployment, credentials are available to the
        agent through several channels. Understanding these entry points is
        the first step toward recognizing the breadth of the exposure.
      </p>

      <ComparisonTable
        title="Credential Entry Points"
        headers={['Source', 'What It Exposes', 'How Agent Accesses It']}
        rows={[
          [
            'Environment variables',
            'API keys, tokens, database URLs, webhook secrets',
            'execute_command: env, printenv, echo $VAR',
          ],
          [
            'Configuration files',
            'openclaw.json secrets, .env files, service configs',
            'read_file on config paths',
          ],
          [
            'Credential stores',
            'SSH keys, GPG keys, keychain entries, AWS profiles',
            'read_file on ~/.ssh/, ~/.aws/, etc.',
          ],
          [
            'Git configuration',
            'Repository tokens, GPG signing keys, credentials cache',
            'read_file on ~/.gitconfig, ~/.git-credentials',
          ],
          [
            'Process memory',
            'Decrypted secrets held in Gateway memory',
            'Not directly, but /proc/self/environ on Linux',
          ],
          [
            'Tool output',
            'Credentials returned by tool execution',
            'Tool results fed back to LLM context',
          ],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Leakage Through Tool Outputs
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The most common credential leakage path is through tool execution
        results. When the agent runs a command whose output contains
        credentials, those credentials become part of the conversation
        context. They are sent to the LLM, stored in session history, and
        may appear in the agent's response to the user.
      </p>

      <CodeBlock
        language="bash"
        title="Commands that leak credentials through output"
        code={`# List all environment variables (includes secrets)
env
printenv

# Show process environment on Linux
cat /proc/self/environ | tr '\\0' '\\n'

# Docker inspect reveals container environment
docker inspect my-container | grep -A5 "Env"

# Kubernetes secret (if decoded)
kubectl get secret my-secret -o jsonpath='{.data.password}' | base64 -d

# Git remote URLs with embedded tokens
git remote -v
# origin  https://ghp_ABCsecretToken123@github.com/org/repo.git

# npm config shows registry tokens
npm config list
# //registry.npmjs.org/:_authToken = "npm_ABCsecretToken456"`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Leakage Through Generated Code
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A subtler form of credential leakage occurs when the agent
        inadvertently includes credentials in code it generates. This happens
        when the agent reads a configuration file, encounters a credential,
        and then uses that value as an example or default in generated code.
        The credential may end up committed to version control.
      </p>

      <CodeBlock
        language="javascript"
        title="Agent accidentally hardcodes a credential"
        code={`// Agent was asked to "create a config file for the payment service"
// It read .env to understand the current configuration and then wrote:

const paymentConfig = {
  apiUrl: 'https://api.stripe.com/v1',
  // BUG: Agent used the actual key from .env instead of a placeholder!
  apiKey: 'sk_live_51ABC...actual_production_key_here',
  webhookSecret: 'whsec_actual_secret_here',
};

// This file gets committed, pushed, and the keys are now in Git history`}
      />

      <WarningBlock title="Credentials in LLM Context">
        <p>
          When a credential appears in the LLM's context window, it is sent
          to the LLM provider's API. Even if the provider does not log or
          train on this data, the credential has now traversed the network
          and been processed by a third-party service. For compliance-sensitive
          environments (SOC 2, HIPAA, PCI-DSS), this may constitute a
          credential exposure event that requires rotation and reporting.
        </p>
      </WarningBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Leakage Through Logs
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw logs tool executions, including command arguments and output
        summaries, for debugging and audit purposes. If a tool execution
        involves credentials, those credentials may appear in log files
        stored on disk, streamed to the Control UI, or forwarded to external
        logging services like Datadog or Elasticsearch.
      </p>

      <CodeBlock
        language="json"
        title="Log entry with leaked credential"
        code={`{
  "timestamp": "2025-03-15T14:32:01Z",
  "level": "info",
  "event": "tool_execution",
  "tool": "execute_command",
  "args": {
    "command": "curl -H 'Authorization: Bearer sk-ant-api03-REAL_KEY_HERE' https://api.anthropic.com/v1/messages"
  },
  "result": {
    "exitCode": 0,
    "stdout": "{\"id\":\"msg_...\",\"content\":[...]}"
  },
  "duration": 1234,
  "sessionId": "sess_abc123",
  "peerId": "U04EXAMPLE"
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The Shared Environment Problem
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In OpenClaw, the agent's tool execution environment shares the same
        process environment as the Gateway itself. This means the LLM API
        key used by the Gateway to call Claude is accessible to the agent
        through environment variables. There is no credential isolation
        between the Gateway's operational secrets and the agent's execution
        context.
      </p>

      <CodeBlock
        language="bash"
        title="Agent can access the Gateway's own credentials"
        code={`# The agent can read the very API key that powers it:
echo $ANTHROPIC_API_KEY
# sk-ant-api03-...

# And the platform tokens:
echo $SLACK_BOT_TOKEN
# xoxb-...

# These are the Gateway's operational secrets,
# not credentials the agent should ever need.`}
      />

      <NoteBlock type="info" title="No Credential Scoping">
        <p>
          OpenClaw does not support credential scoping -- the ability to give
          an agent access to specific credentials for specific purposes while
          hiding others. Every environment variable, every readable file, and
          every credential store on the host is equally accessible. NemoClaw
          addresses this by running tool execution in an isolated environment
          with a minimal, explicitly defined set of environment variables.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Mitigation Attempts and Their Limits
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Operators sometimes attempt to mitigate credential risks with
        hooks that scan tool outputs for patterns matching known secret
        formats (e.g., <code>sk-ant-</code>, <code>xoxb-</code>). While
        this catches obvious cases, it fails against obfuscated credentials,
        base64-encoded values, credentials in non-standard formats, and
        novel API key patterns.
      </p>

      <StepBlock
        title="Why Application-Level Credential Protection Fails"
        steps={[
          {
            title: 'Pattern Matching Is Incomplete',
            content:
              'Secret scanning relies on known patterns. New services, custom tokens, and non-standard credential formats are missed. Base64-encoded or hex-encoded credentials bypass string-based detection.',
          },
          {
            title: 'Timing Is Wrong',
            content:
              'By the time an afterToolUse hook detects a credential in output, the data has already been sent to the LLM. The hook can redact it from the response to the user but cannot un-send it from the LLM context.',
          },
          {
            title: 'Multiple Exfiltration Paths',
            content:
              'Even if tool output scanning catches credentials, they can still leak through generated code, file writes, network requests, or the agent\'s natural language response before any hook fires.',
          },
          {
            title: 'False Sense of Security',
            content:
              'Pattern-based scanning creates confidence that credentials are protected, discouraging operators from implementing proper credential isolation. This is more dangerous than no protection at all.',
          },
        ]}
      />

      <ExerciseBlock
        question="An OpenClaw agent executes 'env | grep KEY' and the output includes the Anthropic API key. At what point has the credential already leaked beyond recovery through application-level hooks?"
        options={[
          'When the command output is displayed in Slack',
          'When the afterToolUse hook processes the result',
          'When the command output is sent to the LLM as tool result context',
          'When the agent includes the key in its response to the user',
        ]}
        correctIndex={2}
        explanation="The credential leaks as soon as the tool result (containing the API key) is sent to the LLM provider's API as part of the conversation context. This happens before any afterToolUse hook or response filtering can act. Even if the hook redacts the key from the visible response, it has already been transmitted to the LLM provider's servers."
      />

      <ReferenceList
        references={[
          {
            title: 'GitHub Secret Scanning Patterns',
            url: 'https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns',
            type: 'docs',
            description: 'Reference for known secret patterns, illustrating the breadth of credentials that can leak.',
          },
          {
            title: 'CWE-522: Insufficiently Protected Credentials',
            url: 'https://cwe.mitre.org/data/definitions/522.html',
            type: 'docs',
            description: 'Background on credential protection weaknesses relevant to AI agent deployments.',
          },
        ]}
      />
    </div>
  );
}
