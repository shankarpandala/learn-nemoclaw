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

export default function PermissionModes() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw agents are accessible through shared team communication channels,
        which raises an immediate question: who is allowed to talk to the agent?
        Permission modes control which users can interact with an OpenClaw agent
        and under what conditions. Choosing the right permission mode is one of the
        most important security decisions an operator makes when deploying an agent.
        The wrong choice can either leave the agent wide open to abuse or make it
        so locked down that adoption stalls.
      </p>

      <DefinitionBlock
        term="Permission Mode"
        definition="A gateway-level policy that determines how users authenticate and gain access to interact with an OpenClaw agent. Permission modes operate at the platform adapter layer, evaluating each incoming message before it reaches the LLM."
        example="In 'pairing' mode (the default), a new user must enter a one-time pairing code displayed in the Control UI before the agent will respond to their messages. Once paired, the user's platform ID is persisted and they can interact freely."
        seeAlso={['DM Access Policy', 'Allowlist', 'Control UI']}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        The Four Permission Modes
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw provides four distinct permission modes, each designed for
        different deployment scenarios. The mode is set globally in the
        configuration and applies to all platform adapters uniformly. Only one
        mode can be active at a time.
      </p>

      <ComparisonTable
        title="Permission Modes Overview"
        headers={['Mode', 'Access Control', 'Setup Effort', 'Security Level', 'Best For']}
        highlightDiffs
        rows={[
          [
            'allowlist',
            'Only explicitly listed platform user IDs can interact',
            'High (must maintain ID list)',
            'Highest',
            'Production deployments with known teams',
          ],
          [
            'pairing',
            'Users enter a one-time code to pair their account (default)',
            'Medium (codes generated automatically)',
            'High',
            'Teams onboarding new members gradually',
          ],
          [
            'open',
            'Any user in the workspace can interact immediately',
            'None',
            'Low',
            'Internal demos, hackathons, evaluation',
          ],
          [
            'disabled',
            'No one can interact; agent is fully offline',
            'None',
            'N/A',
            'Maintenance windows, incident response',
          ],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Allowlist Mode
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Allowlist mode is the most restrictive option. The operator provides an
        explicit list of platform user IDs (Slack member IDs, Discord user IDs,
        etc.) that are authorized to interact with the agent. Any message from
        an ID not on the list is silently ignored. This mode is ideal for
        production environments where only a known set of developers should
        have access to the agent's capabilities.
      </p>

      <CodeBlock
        language="json"
        title="Allowlist mode configuration (openclaw.json)"
        code={`{
  "permissions": {
    "mode": "allowlist",
    "allowlist": [
      "U04A1B2C3D4",
      "U05E6F7G8H9",
      "U06I0J1K2L3"
    ],
    "allowlistSync": {
      "enabled": true,
      "source": "slack-usergroup",
      "groupHandle": "engineering-team",
      "refreshInterval": "1h"
    }
  }
}`}
      />

      <NoteBlock type="tip" title="Dynamic Allowlists">
        <p>
          Rather than manually maintaining a list of user IDs, you can sync the
          allowlist with a Slack user group, a GitHub team, or an external API.
          The <code>allowlistSync</code> option polls the source on a configurable
          interval and updates the in-memory allowlist automatically.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Pairing Mode (Default)
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Pairing mode strikes a balance between security and convenience. When
        a new user sends their first message to the agent, the Gateway responds
        with a prompt asking them to enter a pairing code. The code is a
        short alphanumeric string displayed in the Control UI. Once the user
        enters the correct code, their platform ID is added to a persistent
        paired-users list, and all future interactions proceed without
        additional authentication.
      </p>

      <CodeBlock
        language="json"
        title="Pairing mode configuration (openclaw.json)"
        code={`{
  "permissions": {
    "mode": "pairing",
    "pairing": {
      "codeLength": 6,
      "codeExpiry": "15m",
      "maxAttempts": 3,
      "cooldown": "5m",
      "welcomeMessage": "Welcome! To pair with this agent, please enter the pairing code shown in the admin dashboard."
    }
  }
}`}
      />

      <StepBlock
        title="Pairing Flow"
        steps={[
          {
            title: 'User Sends First Message',
            content:
              'A new user sends a message to the agent in Slack or Discord. The Gateway does not recognize their platform ID in the paired-users store.',
          },
          {
            title: 'Gateway Requests Pairing Code',
            content:
              'The Gateway replies with the configured welcome message, prompting the user to enter a pairing code. The code is visible in the Control UI under the "Pairing" section.',
          },
          {
            title: 'User Enters Code',
            content:
              'The user types the pairing code in the chat. The Gateway validates it against the active code, checking expiry and attempt limits.',
          },
          {
            title: 'Pairing Confirmed',
            content:
              'On successful validation, the user\'s platform ID is added to the paired-users list. The Gateway sends a confirmation message and processes the original message.',
          },
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Open Mode
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Open mode removes all access restrictions. Any user in the Slack
        workspace or Discord server can interact with the agent immediately
        without pairing or allowlist membership. This mode is useful for
        demos, hackathons, or internal evaluation periods where friction-free
        access matters more than access control. However, it should never
        be used in production environments where the agent has access to
        sensitive codebases, credentials, or infrastructure.
      </p>

      <CodeBlock
        language="json"
        title="Open mode configuration"
        code={`{
  "permissions": {
    "mode": "open",
    "open": {
      "rateLimiting": {
        "messagesPerMinute": 10,
        "messagesPerHour": 100
      },
      "excludeUsers": ["U_BOT_ACCOUNT"]
    }
  }
}`}
      />

      <WarningBlock title="Open Mode Security Risk">
        <p>
          Open mode means any workspace member can instruct the agent to read
          files, execute commands, and interact with external APIs. In a Slack
          workspace with hundreds of members, this dramatically increases the
          attack surface. A disgruntled or compromised user account could use
          the agent to exfiltrate source code, modify infrastructure, or abuse
          API quotas.
        </p>
      </WarningBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        DM Access Policies
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Independent of the permission mode, OpenClaw allows operators to set
        a separate policy for direct messages (DMs). By default, agents only
        respond in channels where they are explicitly invited. DM access can
        be enabled, disabled, or restricted to paired/allowlisted users only.
        This is configured through the <code>dmAccess</code> setting.
      </p>

      <CodeBlock
        language="json"
        title="DM access policy configuration"
        code={`{
  "permissions": {
    "mode": "pairing",
    "dmAccess": "paired-only",
    // Options:
    // "enabled"     - Anyone can DM the agent
    // "disabled"    - DMs are completely blocked
    // "paired-only" - Only paired/allowlisted users can DM
    // "channel-only" - Agent only responds in channels, never DMs
  }
}`}
      />

      <NoteBlock type="info" title="Channel vs. DM Context">
        <p>
          DM conversations are isolated sessions where only the user and agent
          interact. Channel conversations are visible to all channel members.
          Some teams prefer to restrict DMs because channel conversations
          provide natural audit trails and peer visibility into what the agent
          is doing.
        </p>
      </NoteBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Security Tradeoffs
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Each permission mode represents a different point on the
        security-convenience spectrum. Allowlist mode provides the strongest
        access control but requires manual maintenance. Pairing mode is a
        reasonable middle ground for most teams but relies on the secrecy of
        the pairing code, which is visible to anyone with Control UI access.
        Open mode maximizes accessibility but effectively delegates security
        to the Slack or Discord workspace boundary, which may not be
        sufficient for sensitive operations.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        It is worth noting that permission modes only control <em>who</em> can
        talk to the agent. They do not control <em>what</em> the agent can do
        once a user is authorized. An allowlisted user still has access to all
        tools and capabilities configured for the agent. For controlling what
        the agent can do, operators need additional mechanisms such as tool
        restrictions, hooks, or the NemoClaw security layer.
      </p>

      <ExerciseBlock
        question="A startup is running a week-long internal hackathon and wants all 50 employees to try the OpenClaw agent without any setup friction. Which permission mode should they use, and what additional safeguard should they consider?"
        options={[
          'Allowlist mode with all 50 user IDs pre-loaded',
          'Open mode with rate limiting configured',
          'Pairing mode with the code posted in a shared channel',
          'Disabled mode with temporary overrides per user',
        ]}
        correctIndex={1}
        explanation="Open mode with rate limiting is the best choice for a friction-free hackathon. Rate limiting prevents any single user from monopolizing the agent. While open mode has security tradeoffs, a short-lived internal hackathon with known employees is an acceptable use case. The team should switch to pairing or allowlist mode after the event."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Permission Modes Guide',
            url: 'https://docs.openclaw.ai/permissions',
            type: 'docs',
            description: 'Complete reference for configuring permission modes and DM access policies.',
          },
          {
            title: 'OpenClaw Security Best Practices',
            url: 'https://docs.openclaw.ai/security',
            type: 'docs',
            description: 'Recommended security configurations for production deployments.',
          },
        ]}
      />
    </div>
  );
}
