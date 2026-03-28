import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function BotConfig() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With the Telegram policy in place and your bot token ready, the next step is configuring how
        OpenClaw connects to Telegram: setting up the bot token, choosing between webhook and polling
        delivery, and defining how incoming messages are routed to your agent. This configuration bridges
        the gap between Telegram's messaging infrastructure and your NemoClaw agent.
      </p>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Bot Token Configuration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The bot token is configured through environment variables, never hardcoded in configuration
        files. OpenClaw's Telegram integration reads the token at startup and uses it for all
        API interactions.
      </p>

      <CodeBlock
        title="Environment configuration"
        language="bash"
        code={`# /opt/nemoclaw-agent/.env

# Required: Telegram bot token from BotFather
TELEGRAM_BOT_TOKEN=7123456789:AAF1234567890abcdefghijklmnopqrstuv

# Optional: Override the Telegram API base URL (useful for testing)
# TELEGRAM_API_BASE=https://api.telegram.org

# Optional: Proxy for Telegram API (if behind a firewall)
# TELEGRAM_PROXY=socks5://proxy.internal:1080`}
      />

      <CodeBlock
        title="Bot integration configuration (telegram.yaml)"
        language="yaml"
        code={`# /opt/nemoclaw-agent/integrations/telegram.yaml
telegram:
  enabled: true
  token_env: TELEGRAM_BOT_TOKEN  # Reference to env var

  # Bot identity (verified against getMe on startup)
  expected_username: nemoclaw_dev_bot

  # Message handling
  parse_mode: Markdown  # or HTML, MarkdownV2
  max_message_length: 4096
  split_long_messages: true  # Auto-split messages exceeding limit

  # Timeouts
  connect_timeout: 10s
  read_timeout: 30s
  write_timeout: 30s`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Webhook Setup
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Webhooks are the preferred method for receiving messages in production. When configured,
        Telegram sends incoming messages directly to your server as HTTP POST requests, eliminating
        the need for polling and providing near-instant delivery.
      </p>

      <StepBlock
        title="Configuring Webhook Delivery"
        steps={[
          {
            title: 'Ensure your server is publicly accessible via HTTPS',
            content: 'Telegram requires a valid TLS certificate. If you are behind a load balancer or reverse proxy, the certificate on the public endpoint is what matters.',
            code: `# Verify your endpoint is reachable
curl -I https://agent.acme.com/webhook/telegram
# HTTP/2 200 OK`,
            language: 'bash',
          },
          {
            title: 'Configure the webhook in telegram.yaml',
            content: 'Specify the webhook URL and optional security settings.',
            code: `# /opt/nemoclaw-agent/integrations/telegram.yaml
telegram:
  delivery:
    mode: webhook

    webhook:
      # Public URL where Telegram will send updates
      url: https://agent.acme.com/webhook/telegram

      # Secret token for webhook verification
      # Telegram sends this in X-Telegram-Bot-Api-Secret-Token header
      secret_token_env: TELEGRAM_WEBHOOK_SECRET

      # Which update types to receive
      allowed_updates:
        - message
        - callback_query
        - edited_message

      # IP whitelist (Telegram's server IPs)
      # These are Telegram's documented IP ranges
      allowed_ips:
        - 149.154.160.0/20
        - 91.108.4.0/22

      # Maximum concurrent webhook connections
      max_connections: 10

      # Local server configuration
      listen_address: 127.0.0.1  # Bind to localhost if behind reverse proxy
      listen_port: 7321`,
            language: 'yaml',
          },
          {
            title: 'Set the webhook with Telegram',
            content: 'OpenClaw registers the webhook automatically on startup, but you can also do it manually.',
            code: `# Automatic (on agent startup)
openclaw run --workspace /opt/nemoclaw-agent/workspace
# [INFO] Telegram webhook set: https://agent.acme.com/webhook/telegram
# [INFO] Allowed updates: message, callback_query, edited_message

# Manual registration
openclaw telegram set-webhook \\
  --url https://agent.acme.com/webhook/telegram \\
  --secret-env TELEGRAM_WEBHOOK_SECRET

# Verify webhook status
openclaw telegram webhook-info
# URL: https://agent.acme.com/webhook/telegram
# Pending updates: 0
# Last error: none
# Max connections: 10`,
            language: 'bash',
          },
        ]}
      />

      <NoteBlock type="tip" title="Development with ngrok">
        <p>
          During development, you likely do not have a public HTTPS endpoint. Use ngrok or
          a similar tunneling service to expose your local agent:
          <code className="block mt-2">ngrok http 7321</code>
          Then use the generated ngrok URL as your webhook URL. Remember to update the webhook
          each time ngrok restarts since the URL changes.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Polling as an Alternative
      </h2>

      <CodeBlock
        title="Polling configuration for development"
        language="yaml"
        code={`# Use polling instead of webhooks (simpler but higher latency)
telegram:
  delivery:
    mode: polling

    polling:
      interval: 1s      # How often to check for new messages
      timeout: 30s       # Long polling timeout
      limit: 100         # Max updates per poll
      allowed_updates:
        - message
        - callback_query`}
      />

      <ComparisonTable
        title="Webhook vs. Polling"
        headers={['Aspect', 'Webhook', 'Polling']}
        rows={[
          ['Latency', 'Near instant (<100ms)', '0-1s (depends on interval)'],
          ['Server requirement', 'Public HTTPS endpoint', 'None (outbound only)'],
          ['Resource usage', 'Idle until message arrives', 'Constant API calls'],
          ['Reliability', 'Telegram retries on failure', 'Client-side retry needed'],
          ['Setup complexity', 'TLS cert + DNS + firewall', 'Zero config'],
          ['Best for', 'Production deployments', 'Development and testing'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Message Routing
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Not every Telegram message should be handled the same way. Message routing lets you direct
        different types of messages to different handlers or agent behaviors based on the message
        content, sender, or chat type.
      </p>

      <CodeBlock
        title="Message routing configuration"
        language="yaml"
        code={`# /opt/nemoclaw-agent/integrations/telegram.yaml
telegram:
  routing:
    # Command routing -- specific handlers for /commands
    commands:
      /review:
        handler: code_review
        description: "Review a PR (usage: /review 42)"
        require_args: true
      /status:
        handler: agent_status
        description: "Show agent status and uptime"
      /run:
        handler: execute_task
        description: "Run a development task"
        require_args: true
      /help:
        handler: show_help
        description: "List available commands"

    # Message type routing
    types:
      text:
        handler: general_chat
        max_length: 4096
      document:
        handler: file_analysis
        allowed_extensions: [.go, .py, .js, .ts, .yaml, .json, .md]
        max_file_size: 1MB
      photo:
        handler: screenshot_analysis

    # Chat type routing
    chats:
      private:
        # Direct messages go to the general agent
        handler: general_chat
        allowed: true
      group:
        # In groups, only respond to commands and @mentions
        handler: group_chat
        respond_to:
          - commands
          - mentions
          - replies_to_bot
      channel:
        allowed: false  # Do not interact with channels

    # Default for unmatched messages
    default:
      handler: general_chat
      fallback_message: "I'm not sure how to handle that. Try /help for available commands."`}
      />

      <WarningBlock title="Group Chat Security">
        <p>
          Be cautious when enabling your bot in group chats. Any group member can interact with the
          bot, potentially triggering actions or accessing information through the agent. In group
          settings, restrict the bot to commands only and require an allowlist of authorized users
          (covered in the rate limiting section).
        </p>
      </WarningBlock>

      <CodeBlock
        title="Testing the complete configuration"
        language="bash"
        code={`# Validate all Telegram configuration
openclaw telegram validate

# Output:
# Bot token: valid (bot: @nemoclaw_dev_bot)
# Delivery mode: webhook
# Webhook URL: https://agent.acme.com/webhook/telegram
# Webhook status: active, no pending updates
# Commands registered: 4 (/review, /status, /run, /help)
# Routing rules: 3 command routes, 3 type routes, 3 chat routes
# Policy: telegram preset loaded, 8 endpoints allowed

# Send a test message to verify end-to-end
openclaw telegram test --message "Hello from CLI"
# Message sent successfully (message_id: 1234)`}
      />

      <ExerciseBlock
        question="Your Telegram bot is deployed in production behind an nginx reverse proxy. Messages arrive but the bot cannot respond. What is the most likely cause?"
        options={[
          'The bot token is invalid',
          'The webhook secret token does not match between Telegram and your config',
          'Nginx is not forwarding the X-Telegram-Bot-Api-Secret-Token header to the backend',
          'The NemoClaw policy is blocking outbound POST requests to api.telegram.org',
        ]}
        correctIndex={3}
        explanation="If messages arrive (meaning the webhook is working inbound), but the bot cannot respond, the issue is likely with outbound requests. The NemoClaw policy must explicitly allow POST requests to api.telegram.org/bot.../sendMessage. Verify the telegram preset is loaded and the sendMessage endpoint is in the allow list."
      />

      <ReferenceList
        references={[
          {
            title: 'OpenClaw Telegram Integration Guide',
            url: 'https://github.com/openclaw-org/openclaw/blob/main/docs/integrations/telegram.md',
            type: 'docs',
            description: 'Complete guide for configuring Telegram bot integration with OpenClaw.',
          },
          {
            title: 'Telegram Webhook Guide',
            url: 'https://core.telegram.org/bots/webhooks',
            type: 'docs',
            description: 'Official Telegram documentation for webhook setup and troubleshooting.',
          },
        ]}
      />
    </div>
  )
}
