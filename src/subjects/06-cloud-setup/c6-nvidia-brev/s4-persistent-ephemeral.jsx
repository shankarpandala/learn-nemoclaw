import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function PersistentEphemeral() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Persistent vs. Ephemeral Deployments
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When deploying NemoClaw on Brev (or any GPU cloud platform), you face a fundamental
        deployment strategy decision: should the instance run continuously (persistent) or spin
        up and down on demand (ephemeral)? This choice has significant implications for cost,
        availability, and operational complexity. Understanding the tradeoffs helps you optimize
        for your team's specific requirements and budget.
      </p>

      <DefinitionBlock
        term="Persistent Deployment"
        definition="An always-running instance that stays powered on 24/7, providing continuous availability for NemoClaw agent sessions. The instance maintains all state, including active sessions, loaded LLM models, and conversation histories. It is the simplest operational model but the most expensive."
        example="A Brev A100 instance running NemoClaw 24/7, responding to Slack messages at any time of day. Monthly cost: ~$2,500 for an A100 or ~$360 for a T4."
        seeAlso={['Ephemeral Deployment', 'Auto-Scaling', 'Cost Optimization']}
      />

      <DefinitionBlock
        term="Ephemeral Deployment"
        definition="An on-demand instance that is started when needed and stopped when idle. The instance preserves its disk data (configuration, policies, models) when stopped but loses in-memory state (active sessions, loaded models). It requires a startup period each time it is activated."
        example="A Brev A100 instance that runs from 8 AM to 7 PM on weekdays only. NemoClaw is unavailable outside these hours, but monthly cost drops from ~$2,500 to ~$800."
        seeAlso={['Persistent Deployment', 'Cold Start', 'Auto-Stop']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Cost Comparison
      </h2>

      <ComparisonTable
        title="Monthly Cost: Persistent vs. Ephemeral (A100 80GB)"
        headers={['Schedule', 'Hours/Month', 'Monthly Cost', 'Savings vs. 24/7']}
        rows={[
          ['24/7 (persistent)', '730 hrs', '~$2,555', '0%'],
          ['Business hours (Mon-Fri, 8AM-7PM)', '~240 hrs', '~$840', '67%'],
          ['Extended hours (Mon-Fri, 7AM-11PM)', '~352 hrs', '~$1,232', '52%'],
          ['On-demand (manual start/stop, ~4 hrs/day)', '~120 hrs', '~$420', '84%'],
          ['Weekday only 24/5', '~520 hrs', '~$1,820', '29%'],
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The savings are dramatic. A business-hours-only schedule reduces A100 costs by 67%,
        from $2,555 to $840 per month. For a T4 instance, the same schedule reduces costs from
        $365 to $120 per month. The question is whether the startup delay and offline periods
        are acceptable for your team.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Startup Time (Cold Start)
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When an ephemeral instance starts, several things must happen before NemoClaw is
        available to users:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Instance boot:</span> 30-60 seconds for the OS to start
          and systemd services to initialize.
        </li>
        <li>
          <span className="font-semibold">NemoClaw startup:</span> 5-15 seconds for the Gateway
          and policy engine to load and establish platform connections.
        </li>
        <li>
          <span className="font-semibold">LLM model loading:</span> 30 seconds to 5 minutes
          depending on model size. A 7B model loads in ~30 seconds. A 70B model can take 3-5
          minutes to load into VRAM. This is the biggest bottleneck.
        </li>
        <li>
          <span className="font-semibold">Total cold start:</span> 1-6 minutes depending on
          configuration. During this time, NemoClaw is unavailable.
        </li>
      </ul>

      <NoteBlock type="tip" title="Reducing Cold Start Time">
        <p>
          To minimize cold start delays: (1) Use a smaller, faster-loading model -- 7B models
          load in 30 seconds vs. 3-5 minutes for 70B. (2) Configure NemoClaw to start responding
          with API-based inference immediately while the local model loads in the background.
          (3) Use Brev's instance warm pool feature (if available) to keep instances in a
          pre-warmed state ready for rapid activation.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Implementing an Ephemeral Schedule
      </h2>

      <CodeBlock
        language="bash"
        title="Automated Start/Stop Schedule"
        code={`# Option 1: Brev scheduled actions (if supported)
brev schedule my-nemoclaw --start "0 8 * * 1-5" --stop "0 19 * * 1-5"

# Option 2: Cron-based schedule from a separate always-on machine
# (e.g., a free-tier Oracle Cloud ARM instance)

# start-nemoclaw.sh
#!/bin/bash
brev start my-nemoclaw
echo "$(date): Started NemoClaw instance" >> /var/log/nemoclaw-schedule.log

# stop-nemoclaw.sh
#!/bin/bash
brev stop my-nemoclaw
echo "$(date): Stopped NemoClaw instance" >> /var/log/nemoclaw-schedule.log

# Crontab entries:
# 0 8 * * 1-5 /home/user/start-nemoclaw.sh    # Mon-Fri 8 AM
# 0 19 * * 1-5 /home/user/stop-nemoclaw.sh     # Mon-Fri 7 PM

# Option 3: API-based triggering
# Start NemoClaw when the first Slack message of the day arrives
# Requires a lightweight always-on proxy that forwards the message
# and triggers instance startup`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Hybrid Approach: API Fallback
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The most sophisticated approach combines ephemeral GPU instances with API-based fallback.
        NemoClaw runs on a cheap always-on CPU instance (or Oracle Cloud free tier) using
        API-based inference. When heavy workloads are detected or during business hours, a GPU
        instance spins up and NemoClaw switches to local inference for better performance and
        cost efficiency at high volumes.
      </p>

      <CodeBlock
        language="json"
        title="Hybrid LLM Configuration (openclaw.json)"
        code={`{
  "llm": {
    "primary": {
      "provider": "ollama",
      "baseUrl": "http://localhost:11434",
      "model": "llama3:70b-instruct-q4_K_M"
    },
    "fallback": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-20250514",
      "apiKey": "env:ANTHROPIC_API_KEY"
    },
    "strategy": "prefer-local-with-api-fallback"
  }
}`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Decision Framework
      </h2>

      <ComparisonTable
        title="When to Use Each Deployment Model"
        headers={['Factor', 'Persistent', 'Ephemeral']}
        rows={[
          ['Team needs 24/7 agent access', 'Required', 'Not suitable'],
          ['Budget is the primary concern', 'Expensive', 'Recommended (67%+ savings)'],
          ['Cold start delay is acceptable', 'N/A', 'Must be OK with 1-6 min startup'],
          ['Agent monitoring/incident response', 'Required', 'Not suitable'],
          ['Development/testing only', 'Overkill', 'Recommended'],
          ['High-volume production', 'Recommended', 'Possible with schedule'],
          ['Compliance requires audit trail', 'Simpler to maintain', 'Gaps during offline periods'],
        ]}
      />

      <WarningBlock title="Session Loss on Stop">
        <p>
          When an ephemeral instance is stopped, all in-memory session state is lost. Active
          conversations in Slack or Discord will lose their context. When the instance restarts,
          NemoClaw starts fresh sessions. If your team relies on long-running agent conversations
          that span hours or days, ephemeral deployments will cause disruptive context loss at
          each stop/start cycle.
        </p>
      </WarningBlock>

      <ExerciseBlock
        question="A team uses NemoClaw with an A100 on Brev during business hours (Mon-Fri, 8 AM to 7 PM). Approximately how much do they save per month compared to running 24/7?"
        options={[
          'About $200/month (10% savings)',
          'About $850/month (33% savings)',
          'About $1,715/month (67% savings)',
          'About $2,300/month (90% savings)',
        ]}
        correctIndex={2}
        explanation="Business hours (11 hours/day, 5 days/week) is about 240 hours/month out of 730 total hours. At ~$3.50/hr for an A100 80GB, 24/7 costs ~$2,555 and business hours costs ~$840, saving approximately $1,715 per month -- a 67% reduction."
      />

      <ReferenceList
        references={[
          {
            title: 'Brev Instance Management',
            url: 'https://docs.brev.dev/instances',
            type: 'docs',
            description: 'Managing Brev instances including start, stop, and scheduling.',
          },
          {
            title: 'GPU Cost Optimization Strategies',
            url: 'https://docs.brev.dev/cost-optimization',
            type: 'docs',
            description: 'Best practices for minimizing GPU cloud costs.',
          },
        ]}
      />
    </div>
  )
}
