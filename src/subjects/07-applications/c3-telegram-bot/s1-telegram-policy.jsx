import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function TelegramPolicy() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw ships with a Telegram policy preset that enables your agent to communicate through
        Telegram's Bot API. This turns your development assistant into a mobile-friendly chatbot you
        can interact with from anywhere. The policy preset handles the specific API endpoints, webhook
        configuration, and security boundaries needed for safe Telegram integration.
      </p>

      <DefinitionBlock
        term="Telegram Policy Preset"
        definition="A pre-built NemoClaw policy template that whitelists the Telegram Bot API endpoints required for sending and receiving messages, managing webhooks, and handling media. It includes sensible defaults for rate limiting and data handling."
        example="Loading the telegram preset gives your agent access to api.telegram.org for your specific bot token, enabling message send/receive while blocking all other Telegram API actions."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        BotFather Setup
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before configuring NemoClaw, you need a Telegram bot. Telegram's BotFather is the official
        tool for creating and managing bots. The process takes about two minutes.
      </p>

      <StepBlock
        title="Creating Your Telegram Bot"
        steps={[
          {
            title: 'Open BotFather in Telegram',
            content: 'Search for @BotFather in Telegram and start a conversation. BotFather is Telegram\'s official bot management tool.',
          },
          {
            title: 'Create a new bot',
            content: 'Send the /newbot command. BotFather will ask for a display name and a username. The username must end in "bot".',
            code: `/newbot
# BotFather: Alright, a new bot. How are we going to call it?
NemoClaw Dev Assistant
# BotFather: Good. Now let's choose a username for your bot.
nemoclaw_dev_bot
# BotFather: Done! Congratulations on your new bot.
# Use this token to access the HTTP API:
# 7123456789:AAF1234567890abcdefghijklmnopqrstuv`,
            language: 'bash',
          },
          {
            title: 'Configure bot settings',
            content: 'Set a description and restrict commands to improve security.',
            code: `/setdescription
# Select @nemoclaw_dev_bot
AI-powered development assistant running on NemoClaw.

/setcommands
# Select @nemoclaw_dev_bot
help - Show available commands
review - Review a PR by number
status - Show agent status
config - View current configuration`,
            language: 'bash',
          },
          {
            title: 'Save your bot token securely',
            content: 'Add the token to your NemoClaw environment file. Never commit it to version control.',
            code: `# Add to /opt/nemoclaw-agent/.env
TELEGRAM_BOT_TOKEN=7123456789:AAF1234567890abcdefghijklmnopqrstuv`,
            language: 'bash',
          },
        ]}
      />

      <WarningBlock title="Bot Token Security">
        <p>
          Your bot token grants full control over the bot. Anyone with the token can send messages
          as your bot, read incoming messages, and change bot settings. Treat it like a password.
          If compromised, immediately revoke it with <code>/revoke</code> in BotFather and generate a new one.
        </p>
      </WarningBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Adding the Telegram Policy Preset
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's policy presets are composable templates you can include in your main policy file.
        The Telegram preset opens exactly the endpoints needed for bot operation.
      </p>

      <CodeBlock
        title="Loading the Telegram preset"
        language="yaml"
        code={`# policy.yaml
name: dev-assistant-with-telegram
version: 1

# Include the Telegram preset
presets:
  - telegram

# The preset expands to these network rules:
# network:
#   allow:
#     - domain: api.telegram.org
#       paths:
#         - /bot$TELEGRAM_BOT_TOKEN/getUpdates
#         - /bot$TELEGRAM_BOT_TOKEN/sendMessage
#         - /bot$TELEGRAM_BOT_TOKEN/sendDocument
#         - /bot$TELEGRAM_BOT_TOKEN/sendPhoto
#         - /bot$TELEGRAM_BOT_TOKEN/setWebhook
#         - /bot$TELEGRAM_BOT_TOKEN/deleteWebhook
#         - /bot$TELEGRAM_BOT_TOKEN/getWebhookInfo
#         - /bot$TELEGRAM_BOT_TOKEN/getMe
#         - /bot$TELEGRAM_BOT_TOKEN/answerCallbackQuery
#       methods: [GET, POST]

# Your additional project-specific rules
network:
  default: deny
  allow:
    - domain: api.github.com
      paths: [/repos/acme-corp/backend-api/**]
      methods: [GET, POST, PATCH]
    - domain: api.anthropic.com
      methods: [POST]`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        What Endpoints the Preset Enables
      </h2>

      <ComparisonTable
        title="Telegram API Endpoints by Category"
        headers={['Category', 'Endpoints', 'Purpose']}
        rows={[
          ['Messaging', 'sendMessage, editMessageText, deleteMessage', 'Core bot communication'],
          ['Media', 'sendDocument, sendPhoto, sendVideo', 'Sharing code files, screenshots, logs'],
          ['Webhooks', 'setWebhook, deleteWebhook, getWebhookInfo', 'Receiving messages in real time'],
          ['Polling', 'getUpdates', 'Alternative to webhooks for receiving messages'],
          ['Bot info', 'getMe, getMyCommands', 'Bot self-identification and command registration'],
          ['Interactive', 'answerCallbackQuery, editMessageReplyMarkup', 'Inline buttons and interactive menus'],
        ]}
      />

      <NoteBlock type="info" title="Webhook vs. Polling">
        <p>
          The Telegram preset enables both webhook and polling endpoints. Webhooks are preferred for
          production because they provide instant message delivery. Polling (getUpdates) is useful
          for development and testing when your agent is not publicly accessible. You can configure
          which mode to use in the bot configuration file covered in the next section.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Customizing the Preset
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The default preset enables a broad set of Telegram endpoints. If your bot only needs to send
        and receive text messages, you can override the preset to restrict it further.
      </p>

      <CodeBlock
        title="Minimal Telegram policy (text-only)"
        language="yaml"
        code={`# Override preset with minimal permissions
presets:
  - telegram:
      # Only enable specific endpoint groups
      messaging: true
      media: false       # No file/image sharing
      webhooks: true
      polling: false     # Use webhooks only
      interactive: false # No inline buttons

      # Additional restrictions
      max_message_length: 4096  # Telegram's limit
      rate_limit:
        messages_per_minute: 20
        messages_per_second: 1`}
      />

      <CodeBlock
        title="Verifying the policy loads correctly"
        language="bash"
        code={`# Validate the policy with the preset
openclaw policy validate ./policy.yaml

# Output:
# Policy "dev-assistant-with-telegram" validated successfully
# Presets loaded: telegram
# Network rules: 12 allow, 0 deny
# Telegram endpoints: 6 enabled, 4 disabled
# Bot token: configured (from TELEGRAM_BOT_TOKEN env)

# Test a specific Telegram API call
openclaw policy test ./policy.yaml \\
  --request "POST https://api.telegram.org/bot.../sendMessage" \\
  --expect allow

openclaw policy test ./policy.yaml \\
  --request "POST https://api.telegram.org/bot.../sendSticker" \\
  --expect deny`}
      />

      <ExerciseBlock
        question="You want your Telegram bot to receive messages via webhook and send text replies, but NOT share files or photos. Which preset configuration is correct?"
        options={[
          'Enable all preset defaults and add a deny rule for sendDocument',
          'Use the preset with messaging: true, webhooks: true, and media: false',
          'Skip the preset and manually whitelist every endpoint you need',
          'Use the preset defaults and restrict at the Telegram BotFather level instead',
        ]}
        correctIndex={1}
        explanation="The preset's granular configuration options let you enable exactly the endpoint groups you need. Setting media: false disables sendDocument, sendPhoto, and sendVideo while keeping the messaging and webhook endpoints active. This is cleaner than adding deny rules on top of allow rules."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Telegram Preset Documentation',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/presets/telegram.md',
            type: 'docs',
            description: 'Full reference for the Telegram policy preset and its configuration options.',
          },
          {
            title: 'Telegram Bot API Documentation',
            url: 'https://core.telegram.org/bots/api',
            type: 'docs',
            description: 'Official Telegram Bot API reference with all available methods.',
          },
          {
            title: 'BotFather Commands Reference',
            url: 'https://core.telegram.org/bots/features#botfather',
            type: 'docs',
            description: 'All BotFather commands for bot creation and management.',
          },
        ]}
      />
    </div>
  )
}
