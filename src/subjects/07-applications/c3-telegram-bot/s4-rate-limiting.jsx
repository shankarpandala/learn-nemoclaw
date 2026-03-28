import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function RateLimiting() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A publicly accessible Telegram bot backed by AI inference is a potential cost bomb. Without
        proper controls, a single malicious user (or even an enthusiastic teammate) can generate
        thousands of dollars in API costs in minutes. This section covers the three layers of abuse
        prevention: rate limits to control throughput, user allowlists to control access, and cost
        caps to set hard spending boundaries.
      </p>

      <DefinitionBlock
        term="Inference Cost Cap"
        definition="A hard spending limit on the total cost of AI inference calls made by the agent over a defined period. When the cap is reached, the agent stops processing new requests until the period resets. Unlike rate limits which control throughput, cost caps control total spending."
        example="A cost cap of $50/day means the agent will stop responding after approximately 500 Claude Sonnet interactions, regardless of how many users are sending messages."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Rate Limiting Configuration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Rate limits control how frequently users can interact with the bot. They prevent both abuse
        and accidental cost overruns from rapid-fire messaging.
      </p>

      <CodeBlock
        title="Rate limiting configuration"
        language="yaml"
        code={`# /opt/nemoclaw-agent/integrations/telegram.yaml
telegram:
  rate_limiting:
    # Global limits (across all users)
    global:
      messages_per_minute: 60
      messages_per_hour: 500
      concurrent_requests: 5  # Max simultaneous inference calls

    # Per-user limits
    per_user:
      messages_per_minute: 10
      messages_per_hour: 100
      messages_per_day: 500
      cooldown_after_limit: 60s  # User must wait this long after hitting limit

    # Per-command limits (some commands are more expensive)
    per_command:
      /review:
        per_user_per_hour: 10
        cost_weight: 3  # Counts as 3 messages for rate limiting
      /run:
        per_user_per_hour: 20
        cost_weight: 2
      default:
        per_user_per_hour: 50
        cost_weight: 1

    # Response when rate limited
    limit_response: |
      You've reached the rate limit. Please wait {cooldown} before
      sending another message. Current limits:
      - {remaining_minute} messages remaining this minute
      - {remaining_hour} messages remaining this hour`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        User Allowlisting
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Rate limits slow down abuse, but allowlisting prevents it entirely. By restricting bot
        access to a known set of Telegram users, you eliminate the risk of unknown users
        consuming your inference budget.
      </p>

      <CodeBlock
        title="User allowlist configuration"
        language="yaml"
        code={`# /opt/nemoclaw-agent/integrations/telegram.yaml
telegram:
  access_control:
    # Default: deny all users not in the allowlist
    default: deny

    # Allowlisted users (by Telegram user ID, not username)
    # Use /whoami command or check message.from.id in logs
    allowlist:
      - id: 123456789
        name: "Alex Chen"
        role: admin  # Can manage bot, change config
        rate_override:
          messages_per_hour: 200  # Higher limit for admins

      - id: 234567890
        name: "Sarah Kim"
        role: user
        # Uses default rate limits

      - id: 345678901
        name: "Mike Rodriguez"
        role: user
        commands:  # Restrict to specific commands
          - /review
          - /status
          - /help
        # Cannot use /run

    # Group access (for group chat deployments)
    groups:
      - chat_id: -1001234567890
        name: "Backend Team"
        allowed: true
        allowed_members: all  # All group members can use bot
        # Or restrict to specific IDs:
        # allowed_members: [123456789, 234567890]

    # Response for unauthorized users
    deny_response: |
      This bot is restricted to authorized team members.
      Contact your admin to request access.`}
      />

      <NoteBlock type="warning" title="Use User IDs, Not Usernames">
        <p>
          Always identify users by their numeric Telegram user ID, not their username. Usernames
          can be changed, making them unreliable for access control. You can find a user's ID
          by having them send a message to the bot and checking the logs, or by using the
          <code>/whoami</code> command if configured.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Cost Caps on Inference
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Even with rate limits and allowlists, costs can add up. Cost caps provide a hard budget
        boundary that cannot be exceeded regardless of usage patterns.
      </p>

      <CodeBlock
        title="Cost cap configuration"
        language="yaml"
        code={`# /opt/nemoclaw-agent/cost.yaml
cost_management:
  # Inference provider pricing (updated as prices change)
  pricing:
    anthropic:
      claude-sonnet-4-20250514:
        input_per_1k_tokens: 0.003
        output_per_1k_tokens: 0.015
      claude-opus-4-20250514:
        input_per_1k_tokens: 0.015
        output_per_1k_tokens: 0.075

  # Cost caps
  caps:
    # Hard daily limit
    daily:
      limit_usd: 50.00
      warning_threshold: 0.8  # Warn at 80% ($40)
      action_at_limit: reject  # reject, queue, or degrade

    # Weekly limit
    weekly:
      limit_usd: 250.00
      warning_threshold: 0.7
      action_at_limit: reject

    # Monthly limit
    monthly:
      limit_usd: 800.00
      warning_threshold: 0.6
      action_at_limit: reject

    # Per-user daily limit
    per_user_daily:
      limit_usd: 10.00
      warning_threshold: 0.8
      action_at_limit: reject

  # What happens when a cap is hit
  actions:
    reject:
      message: "Daily cost limit reached. The bot will resume tomorrow."
    queue:
      message: "Cost limit approaching. Your request has been queued."
      max_queue_size: 10
    degrade:
      message: "Switching to a more economical model to stay within budget."
      fallback_model: claude-sonnet-4-20250514

  # Notifications
  notifications:
    - trigger: warning_threshold
      notify: [admin_telegram_id]
      message: "Cost warning: {current_cost}/{limit} ({percentage}%)"
    - trigger: limit_reached
      notify: [admin_telegram_id]
      message: "Cost limit reached: {cap_type} at {current_cost}/{limit}"`}
      />

      <ComparisonTable
        title="Defense Layers Against Cost Overrun"
        headers={['Layer', 'Controls', 'Protects Against']}
        rows={[
          ['Rate limiting', 'Messages per minute/hour/day', 'Rapid-fire messaging, automated abuse'],
          ['User allowlist', 'Only known users can interact', 'Unknown users, unauthorized access'],
          ['Cost caps', 'Hard spending limits per period', 'Sustained usage exceeding budget'],
          ['Command restrictions', 'Per-user command allowlists', 'Expensive operations by limited users'],
          ['Model degradation', 'Fall back to cheaper models', 'Graceful budget management'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Monitoring Costs in Real Time
      </h2>

      <CodeBlock
        title="Cost monitoring commands"
        language="bash"
        code={`# Check current cost status
openclaw cost status

# Output:
# === Cost Status ===
# Today: $12.34 / $50.00 (24.7%)
# This week: $67.89 / $250.00 (27.2%)
# This month: $234.56 / $800.00 (29.3%)
#
# Top users today:
#   Alex Chen: $5.67 (12 interactions)
#   Sarah Kim: $4.12 (8 interactions)
#   Mike Rodriguez: $2.55 (15 interactions)
#
# Top commands today:
#   /review: $8.90 (10 invocations, avg $0.89 each)
#   general chat: $2.44 (25 messages, avg $0.10 each)
#   /run: $1.00 (5 invocations, avg $0.20 each)

# Telegram command for admins
# /cost
# Agent responds:
# Daily: $12.34/$50.00 (24.7%)
# Weekly: $67.89/$250.00 (27.2%)
# Your usage today: $5.67 (12 interactions)`}
      />

      <WarningBlock title="Cost Monitoring Lag">
        <p>
          Token counts from inference providers may have a slight delay. The cost tracker uses
          estimated token counts based on message length for real-time limiting and reconciles
          with actual provider billing daily. Set your caps slightly below your real budget to
          account for this estimation error (typically under 5%).
        </p>
      </WarningBlock>

      <StepBlock
        title="Complete Anti-Abuse Setup"
        steps={[
          {
            title: 'Enable user allowlisting',
            content: 'Start with access restricted to only your team. Add users as needed.',
          },
          {
            title: 'Set conservative rate limits',
            content: 'Begin with low limits (5 messages/minute, 50/hour per user) and increase based on actual usage patterns.',
          },
          {
            title: 'Configure cost caps',
            content: 'Set daily, weekly, and monthly limits based on your inference budget. Start low and adjust upward.',
          },
          {
            title: 'Set up cost alerts',
            content: 'Configure notifications at 60%, 80%, and 100% of each cap so you have time to react.',
          },
          {
            title: 'Review weekly',
            content: 'Check the cost dashboard weekly. Look for users or commands that consume disproportionate budget and adjust limits accordingly.',
            code: `# Weekly cost report
openclaw cost report --period weekly --output cost-report.csv`,
            language: 'bash',
          },
        ]}
      />

      <ExerciseBlock
        question="Your daily cost cap is $50. At 2 PM, costs are at $42 (84%). One user has used $35 of that. What combination of actions best addresses this?"
        options={[
          'Increase the daily cap to $100 to avoid disruption',
          'Reduce that user\'s per-user daily limit and consider degrading to a cheaper model for the rest of the day',
          'Block the user entirely and wait for the daily reset',
          'Do nothing since the cap will prevent overspending',
        ]}
        correctIndex={1}
        explanation="The per-user limit should have caught this earlier. Adjusting the per-user cap (e.g., to $15/day) prevents one user from consuming 70% of the budget. Degrading to a cheaper model for remaining requests keeps the bot functional while managing costs. Simply waiting for the cap to hit would leave no budget for other users."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Cost Management',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/cost-management.md',
            type: 'docs',
            description: 'Complete guide to cost caps, tracking, and budget management.',
          },
          {
            title: 'Telegram Bot Rate Limiting Best Practices',
            url: 'https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this',
            type: 'docs',
            description: 'Telegram\'s own rate limits that your bot must also respect.',
          },
        ]}
      />
    </div>
  )
}
