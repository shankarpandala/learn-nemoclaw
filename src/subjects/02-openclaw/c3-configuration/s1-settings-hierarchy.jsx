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

export default function SettingsHierarchy() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw uses a layered configuration system that allows settings to be
        defined at multiple levels, from broad global defaults down to
        project-specific overrides. Understanding the settings hierarchy is
        essential for managing OpenClaw deployments, especially when a single
        Gateway serves multiple projects or when team members need personalized
        agent behavior. The configuration system is designed so that more
        specific settings always override more general ones, following a clear
        precedence chain.
      </p>

      <DefinitionBlock
        term="Settings Hierarchy"
        definition="The ordered chain of configuration sources that OpenClaw evaluates when resolving a setting value. Each level can override settings from the level above it. From lowest to highest precedence: built-in defaults, global config, project config, user-level config, runtime overrides."
        example="The global config sets the model to claude-sonnet-4-20250514, but a project's .openclaw/config.json overrides it to claude-opus-4-20250514 for that specific codebase. A user then overrides it again to claude-haiku for faster iteration during development."
        seeAlso={['openclaw.json', 'JSON5', 'Hot Reload']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Configuration Levels
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw resolves settings through five levels, each with a specific
        scope and purpose. When the Gateway needs the value of a setting, it
        walks the hierarchy from highest precedence to lowest and uses the
        first value it finds.
      </p>

      <ComparisonTable
        title="Configuration Precedence (Highest to Lowest)"
        headers={['Level', 'Location', 'Scope', 'Precedence']}
        rows={[
          [
            'Runtime Override',
            '/config slash command or Control UI',
            'Current session only',
            'Highest (5)',
          ],
          [
            'User Config',
            '~/.openclaw/user.json',
            'Per-user preferences across all projects',
            '4',
          ],
          [
            'Project Config',
            '.openclaw/config.json in project root',
            'All users working on this project',
            '3',
          ],
          [
            'Global Config',
            '~/.openclaw/openclaw.json',
            'All projects on this machine',
            '2',
          ],
          [
            'Built-in Defaults',
            'Hardcoded in Gateway source',
            'Universal fallback',
            'Lowest (1)',
          ],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Global Configuration (~/.openclaw/)
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The global configuration lives in the user's home directory at
        <code> ~/.openclaw/openclaw.json</code>. This file uses JSON5 format,
        which allows comments, trailing commas, and unquoted keys for
        readability. The global config is the right place for settings that
        should apply to all projects: API keys, default model selection,
        Control UI preferences, and platform adapter credentials.
      </p>

      <CodeBlock
        language="json"
        title="~/.openclaw/openclaw.json (Global config, JSON5 format)"
        code={`{
  // Global OpenClaw configuration
  // JSON5 format: comments and trailing commas allowed

  "model": "claude-sonnet-4-20250514",
  "apiKey": "\${ANTHROPIC_API_KEY}",   // env var substitution

  "controlUI": {
    "port": 18789,
    "host": "127.0.0.1",
  },

  "platforms": {
    "slack": {
      "botToken": "\${SLACK_BOT_TOKEN}",
      "appToken": "\${SLACK_APP_TOKEN}",
      "socketMode": true,
    },
  },

  "defaults": {
    "maxSessionTokens": 100000,
    "compactionStrategy": "summary",
    "temperature": 0.3,
    "hookDebug": false,
  },
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Project Configuration (.openclaw/)
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Project-level configuration lives in a <code>.openclaw/</code> directory
        at the project root. The primary config file is
        <code> .openclaw/config.json</code>, but the directory can also contain
        workspace files like <code>CLAUDE.md</code>, <code>AGENTS.md</code>,
        and custom hook scripts. Project config is checked into version control
        and shared across the team.
      </p>

      <CodeBlock
        language="json"
        title=".openclaw/config.json (Project config)"
        code={`{
  // Project-specific overrides
  "model": "claude-opus-4-20250514",

  "tools": {
    "allowed": [
      "read_file",
      "write_file",
      "execute_command",
      "search_files",
      "list_directory"
    ],
    "blocked": ["browser_action"],
  },

  "workspace": {
    "sessionScoping": "per-channel-peer",
    "persistSessions": true,
    "contextFiles": [
      "CLAUDE.md",
      "AGENTS.md",
      "SOUL.md",
    ],
  },

  "hooks": {
    "beforeToolUse": [
      {
        "name": "lint-gate",
        "type": "exec",
        "filter": { "tool": "execute_command", "argsMatch": "git commit" },
        "command": "npm run lint",
        "abortOnFailure": true,
      },
    ],
  },
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        User-Level Configuration
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        User-level configuration allows individual team members to customize
        their agent experience without affecting others. The user config lives
        at <code>~/.openclaw/user.json</code> and supports a subset of settings
        focused on personal preferences: model selection, temperature, output
        format, and UI settings. User config has higher precedence than project
        config, allowing developers to experiment with different models or
        settings without modifying shared configuration.
      </p>

      <CodeBlock
        language="json"
        title="~/.openclaw/user.json (User preferences)"
        code={`{
  "model": "claude-haiku",
  "temperature": 0.5,
  "output": {
    "codeStyle": "verbose",
    "includeExplanations": true,
    "maxResponseLength": 4000,
  },
  "ui": {
    "theme": "dark",
    "showToolCalls": true,
    "streamingEnabled": true,
  },
}`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Hot Reload
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw supports hot-reloading of configuration files. When the Gateway
        detects a change to any configuration file (global, project, or user),
        it re-reads and merges the settings without requiring a restart. This
        applies to both the JSON config files and workspace files like
        <code> CLAUDE.md</code> and <code> AGENTS.md</code>. Hot reload uses
        filesystem watchers and debounces rapid changes with a configurable
        delay (default 500ms).
      </p>

      <CodeBlock
        language="json"
        title="Hot reload settings"
        code={`{
  "hotReload": {
    "enabled": true,
    "debounceMs": 500,
    "watchPaths": [
      "~/.openclaw/openclaw.json",
      "~/.openclaw/user.json",
      ".openclaw/**",
      "CLAUDE.md",
      "AGENTS.md"
    ],
    "onReload": "log"  // "log", "notify", or "silent"
  }
}`}
      />

      <NoteBlock type="info" title="Settings That Require Restart">
        <p>
          Most settings are hot-reloadable, but a few require a Gateway restart:
          platform adapter credentials (Slack bot token, Discord token), the
          Control UI port/host binding, and TLS certificate paths. The Gateway
          logs a warning when a non-reloadable setting changes, prompting the
          operator to restart.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Precedence Resolution Example
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        To illustrate how the hierarchy works in practice, consider how the
        <code> model</code> setting is resolved across the layers.
      </p>

      <StepBlock
        title="Model Resolution Walk-through"
        steps={[
          {
            title: 'Built-in Default',
            content:
              'The Gateway\'s hardcoded default model is claude-sonnet-4-20250514.',
          },
          {
            title: 'Global Config Override',
            content:
              'The operator\'s ~/.openclaw/openclaw.json also sets model to claude-sonnet-4-20250514. No change in resolved value.',
          },
          {
            title: 'Project Config Override',
            content:
              'The project\'s .openclaw/config.json sets model to claude-opus-4-20250514. The resolved value is now claude-opus-4-20250514.',
          },
          {
            title: 'User Config Override',
            content:
              'The developer\'s ~/.openclaw/user.json sets model to claude-haiku. The resolved value is now claude-haiku for this user only.',
          },
          {
            title: 'Runtime Override',
            content:
              'The user runs /model claude-sonnet-4-20250514 in a session. The model changes to claude-sonnet-4-20250514 for this session only, without affecting any config files.',
          },
        ]}
      />

      <ExerciseBlock
        question="A project's .openclaw/config.json sets temperature to 0.2 and the user's ~/.openclaw/user.json sets temperature to 0.8. What temperature will the agent use?"
        options={[
          '0.2 (project config takes precedence)',
          '0.8 (user config takes precedence)',
          '0.5 (average of both values)',
          'The built-in default (both are ignored due to conflict)',
        ]}
        correctIndex={1}
        explanation="User config (precedence level 4) overrides project config (precedence level 3). The temperature will be 0.8. Settings do not merge or average -- the highest-precedence value wins completely."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Configuration Reference',
            url: 'https://docs.openclaw.ai/configuration',
            type: 'docs',
            description: 'Complete reference for all configuration keys, types, and defaults.',
          },
          {
            title: 'JSON5 Specification',
            url: 'https://json5.org/',
            type: 'docs',
            description: 'The JSON5 format used by OpenClaw configuration files.',
          },
        ]}
      />
    </div>
  );
}
