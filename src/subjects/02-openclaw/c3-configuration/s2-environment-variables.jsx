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

export default function EnvironmentVariables() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Hardcoding secrets like API keys and database passwords directly in
        configuration files is a well-known security anti-pattern. OpenClaw
        addresses this through environment variable substitution and a flexible
        secret reference system. These mechanisms allow operators to keep
        sensitive values out of configuration files while still making them
        available to the Gateway at runtime. Understanding how secrets flow
        through OpenClaw's configuration is critical for building secure
        deployments.
      </p>

      <DefinitionBlock
        term="Environment Variable Substitution"
        definition="A configuration feature where placeholders in the form ${VAR_NAME} are replaced with the value of the corresponding environment variable at Gateway startup. Substitution occurs during config parsing, before any settings are applied."
        example='Setting "apiKey": "${ANTHROPIC_API_KEY}" in openclaw.json causes the Gateway to read the ANTHROPIC_API_KEY environment variable and use its value as the API key. If the variable is not set, the Gateway logs a warning and the value remains as the literal string.'
        seeAlso={['Secret Reference', 'Credential Management', 'Settings Hierarchy']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Basic Environment Variable Substitution
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Any string value in an OpenClaw configuration file can contain
        <code> {'${VAR_NAME}'}</code> placeholders. The Gateway resolves these
        at startup by reading the corresponding environment variables from the
        process environment. Multiple substitutions can appear in a single
        string, and substitutions can be combined with literal text.
      </p>

      <CodeBlock
        language="json"
        title="Environment variable substitution examples"
        code={`{
  // Simple substitution
  "apiKey": "\${ANTHROPIC_API_KEY}",

  // Multiple substitutions in one value
  "database": "postgres://\${DB_USER}:\${DB_PASS}@\${DB_HOST}:5432/openclaw",

  // Mixed literal and variable
  "webhook": "https://hooks.slack.com/services/\${SLACK_WEBHOOK_PATH}",

  // Default values with fallback syntax
  "model": "\${OPENCLAW_MODEL:-claude-sonnet-4-20250514}",

  // Nested in objects
  "platforms": {
    "slack": {
      "botToken": "\${SLACK_BOT_TOKEN}",
      "appToken": "\${SLACK_APP_TOKEN}"
    }
  }
}`}
      />

      <NoteBlock type="info" title="Default Values">
        <p>
          The <code>{'${VAR_NAME:-default}'}</code> syntax provides a fallback
          value when the environment variable is not set. This is borrowed from
          Bash parameter expansion. For example,
          <code> {'${OPENCLAW_MODEL:-claude-sonnet-4-20250514}'}</code> uses
          <code> claude-sonnet-4-20250514</code> if <code>OPENCLAW_MODEL</code> is
          undefined.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Secret Reference Sources
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond simple environment variable substitution, OpenClaw supports a
        richer secret reference system with three source types:
        <code> env</code>, <code>file</code>, and <code>exec</code>. Secret
        references use a structured object format instead of the string
        placeholder syntax, giving operators more control over how secrets
        are loaded.
      </p>

      <ComparisonTable
        title="Secret Reference Sources"
        headers={['Source', 'How It Works', 'Use Case']}
        highlightDiffs
        rows={[
          [
            'env',
            'Reads value from an environment variable (same as ${} but with structured syntax)',
            'Standard secrets passed through environment',
          ],
          [
            'file',
            'Reads the entire contents of a file path as the secret value (trimming whitespace)',
            'Docker secrets, Kubernetes mounted secrets, key files',
          ],
          [
            'exec',
            'Runs a command and uses its stdout as the secret value',
            'Vault CLI, AWS SSM, 1Password CLI, dynamic tokens',
          ],
        ]}
      />

      <CodeBlock
        language="json"
        title="Secret reference syntax"
        code={`{
  "secrets": {
    // Source: environment variable
    "anthropicKey": {
      "source": "env",
      "name": "ANTHROPIC_API_KEY"
    },

    // Source: file (e.g., Docker secret or Kubernetes mount)
    "slackBotToken": {
      "source": "file",
      "path": "/run/secrets/slack_bot_token"
    },

    // Source: exec (e.g., HashiCorp Vault)
    "databasePassword": {
      "source": "exec",
      "command": "vault kv get -field=password secret/openclaw/db",
      "cache": "5m"
    },

    // Source: exec (e.g., AWS SSM Parameter Store)
    "awsApiKey": {
      "source": "exec",
      "command": "aws ssm get-parameter --name /openclaw/aws-key --with-decryption --query Parameter.Value --output text",
      "cache": "15m"
    }
  },

  // Reference secrets by name in other config values
  "apiKey": { "$ref": "#/secrets/anthropicKey" },
  "platforms": {
    "slack": {
      "botToken": { "$ref": "#/secrets/slackBotToken" }
    }
  }
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Exec Source Security
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code>exec</code> source is the most flexible but also the most
        dangerous. It runs an arbitrary command on the host system during
        configuration resolution. OpenClaw applies several safeguards: exec
        commands run with a 10-second timeout by default, they inherit only
        a restricted set of environment variables, and their output is
        limited to 4KB to prevent accidental data leaks.
      </p>

      <WarningBlock title="Exec Source Risks">
        <p>
          If an attacker can modify the configuration file, an exec source
          becomes an arbitrary code execution vector. Always protect
          configuration files with strict filesystem permissions. In
          containerized environments, mount config files as read-only volumes.
          Never allow agent tools to write to the <code>.openclaw/</code>
          configuration directory.
        </p>
      </WarningBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Credential Management Patterns
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Different deployment environments call for different credential
        management strategies. Here are the recommended patterns for common
        scenarios.
      </p>

      <StepBlock
        title="Credential Management by Environment"
        steps={[
          {
            title: 'Local Development',
            content:
              'Use a .env file loaded by dotenv or direnv. Reference variables with ${} syntax in openclaw.json. Add .env to .gitignore.',
            code: '# .env (not committed)\nANTHROPIC_API_KEY=sk-ant-...\nSLACK_BOT_TOKEN=xoxb-...',
          },
          {
            title: 'Docker / Docker Compose',
            content:
              'Use Docker secrets or environment variables passed through the compose file. For secrets, use the file source to read from /run/secrets/.',
            code: '# docker-compose.yml\nservices:\n  openclaw:\n    secrets:\n      - anthropic_key\n      - slack_token\nsecrets:\n  anthropic_key:\n    file: ./secrets/anthropic_key.txt\n  slack_token:\n    file: ./secrets/slack_token.txt',
          },
          {
            title: 'Kubernetes',
            content:
              'Mount Kubernetes secrets as files in the pod and use file source references. For tighter integration, use the exec source with a vault sidecar.',
            code: '# k8s secret mount in pod spec\nvolumeMounts:\n  - name: openclaw-secrets\n    mountPath: /run/secrets\n    readOnly: true',
          },
          {
            title: 'HashiCorp Vault / Cloud KMS',
            content:
              'Use the exec source to call the vault CLI or cloud provider CLI. Enable caching to avoid excessive API calls during config hot-reload.',
            code: '{\n  "source": "exec",\n  "command": "vault kv get -field=value secret/openclaw/api-key",\n  "cache": "10m"\n}',
          },
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Secure Configuration Checklist
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Follow these guidelines to keep your OpenClaw configuration secure
        across all environments.
      </p>

      <NoteBlock type="tip" title="Configuration Security Best Practices">
        <ul className="list-disc list-inside space-y-1">
          <li>Never commit secrets directly in configuration files.</li>
          <li>Use <code>{'${}'}</code> substitution or secret references for all sensitive values.</li>
          <li>Add <code>.env</code> and any secret files to <code>.gitignore</code>.</li>
          <li>Set <code>chmod 600</code> on <code>~/.openclaw/openclaw.json</code> to restrict access.</li>
          <li>In production, prefer <code>file</code> or <code>exec</code> sources over <code>env</code> for better audit trails.</li>
          <li>Enable caching on <code>exec</code> sources to reduce secret manager API calls.</li>
          <li>Rotate credentials regularly and verify that hot-reload picks up the new values.</li>
        </ul>
      </NoteBlock>

      <ExerciseBlock
        question="Which secret reference source would you use to load an API key from AWS Systems Manager Parameter Store in a production Kubernetes deployment?"
        options={[
          'env source with the AWS parameter name',
          'file source pointing to /run/secrets/aws-key',
          'exec source running the AWS CLI with caching enabled',
          'Direct ${} substitution in the config file',
        ]}
        correctIndex={2}
        explanation="The exec source is ideal for integrating with cloud secret managers like AWS SSM. It runs the AWS CLI to fetch the parameter value dynamically, and caching prevents excessive API calls. While file source works if the secret is already mounted, exec source provides tighter integration with rotation and dynamic secrets."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Secrets Reference',
            url: 'https://docs.openclaw.ai/secrets',
            type: 'docs',
            description: 'Full reference for environment variable substitution and secret sources.',
          },
          {
            title: 'OpenClaw Security Hardening Guide',
            url: 'https://docs.openclaw.ai/security-hardening',
            type: 'docs',
            description: 'Production security recommendations for credential management.',
          },
        ]}
      />
    </div>
  );
}
