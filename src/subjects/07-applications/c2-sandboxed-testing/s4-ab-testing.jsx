import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function ABTesting() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        How do you know if one agent configuration is better than another? Intuition is unreliable when
        comparing AI models, system prompts, and policy configurations. A/B testing provides a data-driven
        framework for comparing agent setups side by side, measuring concrete outcomes rather than guessing.
      </p>

      <DefinitionBlock
        term="Agent A/B Testing"
        definition="Running two or more agent configurations simultaneously on equivalent workloads and comparing their outputs against defined quality metrics. Each configuration variant is a 'treatment' and the comparison reveals which performs better for specific tasks."
        example="Running the same code review task through Claude Sonnet with a terse prompt vs. Claude Opus with a detailed prompt, then comparing review quality, latency, and cost."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        What to A/B Test
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Not everything needs A/B testing. Focus on decisions that meaningfully affect agent quality, cost,
        or reliability. The following dimensions are the most impactful to test.
      </p>

      <ComparisonTable
        title="Common A/B Test Dimensions"
        headers={['Dimension', 'Variant A (example)', 'Variant B (example)', 'Key Metric']}
        rows={[
          ['Model', 'Claude Sonnet', 'Claude Opus', 'Quality vs. cost'],
          ['System prompt', 'Terse, 200 tokens', 'Detailed, 1500 tokens', 'Task accuracy'],
          ['Temperature', '0.0 (deterministic)', '0.3 (creative)', 'Code correctness rate'],
          ['Policy strictness', 'Read-only + comment', 'Full contributor access', 'Workflow efficiency'],
          ['Memory strategy', 'Full MEMORY.md always', 'On-demand memory loading', 'Context relevance'],
          ['Tool availability', 'Bash + git only', 'Bash + git + language tools', 'Task completion rate'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Setting Up an A/B Test
      </h2>

      <CodeBlock
        title="A/B test configuration"
        language="yaml"
        code={`# ab-test-config.yaml
name: code-review-model-comparison
description: Compare Claude Sonnet vs Opus for code review quality

variants:
  - name: sonnet-terse
    model: claude-sonnet-4-20250514
    policy: policies/L2-contributor.yaml
    soul: souls/terse-reviewer.md
    temperature: 0.0
    weight: 50  # 50% of traffic

  - name: opus-detailed
    model: claude-opus-4-20250514
    policy: policies/L2-contributor.yaml
    soul: souls/detailed-reviewer.md
    temperature: 0.1
    weight: 50

# How to assign tasks to variants
assignment:
  strategy: round-robin  # or: random, hash-based
  # hash-based uses PR number to ensure same PR always goes to same variant
  hash_key: pr_number

# What to measure
metrics:
  - name: review_quality
    type: human_rating  # 1-5 scale, rated by PR author
    required: true
  - name: latency_seconds
    type: automatic
  - name: tokens_used
    type: automatic
  - name: cost_usd
    type: automatic
  - name: issues_found
    type: count
    description: Number of genuine issues identified
  - name: false_positives
    type: count
    description: Number of comments that were not useful

# Experiment parameters
experiment:
  min_samples: 50  # per variant
  max_duration: 30d
  confidence_level: 0.95
  early_stopping: true  # Stop early if one variant clearly wins`}
      />

      <StepBlock
        title="Running the A/B Test"
        steps={[
          {
            title: 'Create variant workspaces',
            content: 'Each variant gets its own isolated workspace with its specific configuration.',
            code: `openclaw ab-test create --config ab-test-config.yaml

# Creates:
# /opt/nemoclaw/ab-tests/code-review-model-comparison/
#   variant-sonnet-terse/
#     workspace/
#     policy.yaml
#     soul.md
#   variant-opus-detailed/
#     workspace/
#     policy.yaml
#     soul.md
#   results/
#   config.yaml`,
            language: 'bash',
          },
          {
            title: 'Start the test',
            content: 'Launch both variants and begin routing tasks according to the assignment strategy.',
            code: `openclaw ab-test start code-review-model-comparison

# Output:
# A/B test "code-review-model-comparison" started
# Variants: sonnet-terse (50%), opus-detailed (50%)
# Assignment: round-robin
# Min samples: 50 per variant
# Max duration: 30 days
# Dashboard: http://localhost:7320/ab-tests/code-review-model-comparison`,
            language: 'bash',
          },
          {
            title: 'Collect human ratings',
            content: 'For quality metrics that require human judgment, set up a lightweight rating workflow.',
            code: `# The agent adds a rating request to each review:
# ---
# Rate this review: [Helpful](rating-url/5) [Somewhat](rating-url/3) [Not useful](rating-url/1)
# (This helps us improve the AI reviewer)
# ---

# Or use the CLI to rate reviews after the fact
openclaw ab-test rate code-review-model-comparison \\
  --sample PR-42 \\
  --metric review_quality \\
  --score 4`,
            language: 'bash',
          },
          {
            title: 'Monitor progress and analyze results',
            content: 'Check the test dashboard regularly. NemoClaw computes statistical significance as samples accumulate.',
            code: `openclaw ab-test results code-review-model-comparison

# === A/B Test Results ===
# Name: code-review-model-comparison
# Status: Running (day 18 of 30)
# Samples: sonnet-terse=34, opus-detailed=33
#
# | Metric          | sonnet-terse | opus-detailed | p-value |
# |-----------------|-------------|---------------|---------|
# | review_quality  | 3.8 +/- 0.4 | 4.2 +/- 0.3  | 0.042*  |
# | latency_seconds | 8.2 +/- 2.1 | 14.5 +/- 3.2 | 0.001** |
# | cost_usd        | $0.012      | $0.087        | 0.001** |
# | issues_found    | 2.1/PR      | 2.8/PR        | 0.15    |
# | false_positives | 0.8/PR      | 0.3/PR        | 0.031*  |
#
# * = significant at p<0.05, ** = significant at p<0.01
# Early stopping: Not triggered (no clear winner across all metrics)`,
            language: 'bash',
          },
        ]}
      />

      <NoteBlock type="info" title="Interpreting Mixed Results">
        <p>
          A/B tests rarely produce a clear winner across all metrics. In the example above, Opus
          produces higher quality reviews with fewer false positives, but at 7x the cost and nearly
          double the latency. The "right" choice depends on your priorities. For high-stakes reviews
          (security-sensitive code), Opus might be worth the cost. For routine reviews, Sonnet may
          be the better tradeoff.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Testing Different Policies
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A/B testing is not limited to model comparisons. You can also compare different permission
        levels, tool configurations, and workflow designs.
      </p>

      <CodeBlock
        title="Policy comparison test"
        language="yaml"
        code={`# Does giving the agent access to the test runner improve code quality?
name: tool-access-comparison
variants:
  - name: no-test-runner
    tools:
      allowed: [bash, git, grep]
    description: Agent reviews code without running tests

  - name: with-test-runner
    tools:
      allowed: [bash, git, grep, go, make]
    description: Agent can run tests as part of review

metrics:
  - name: bugs_caught
    type: count
    description: Real bugs identified that tests would catch
  - name: test_suggestions
    type: count
    description: Useful test case suggestions
  - name: review_time
    type: automatic
  - name: sandbox_resource_usage
    type: automatic`}
      />

      <WarningBlock title="Isolate Your Variants">
        <p>
          Each A/B test variant must run in its own sandbox. Variants should never share state,
          memory, or API credentials. If variant A modifies a file that variant B then reads,
          your results are contaminated. Use separate workspace directories and separate
          agent instances.
        </p>
      </WarningBlock>

      <ExerciseBlock
        question="An A/B test comparing two models shows that Model A has a higher quality score but also a higher false positive rate. After 40 samples per variant, the quality difference has p=0.08 and the false positive difference has p=0.03. What should you do?"
        options={[
          'Declare Model A the winner since quality is the most important metric',
          'Declare Model B the winner since the false positive difference is statistically significant',
          'Continue the test until you reach the minimum 50 samples, as the quality metric has not reached significance yet',
          'Stop the test and use whichever model is cheaper',
        ]}
        correctIndex={2}
        explanation="With p=0.08, the quality difference has not reached the significance threshold of 0.05. Stopping early would mean making a decision based on noise. Continue collecting samples until the minimum is reached, at which point you can evaluate all metrics together with adequate statistical power."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw A/B Testing Framework',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/ab-testing.md',
            type: 'docs',
            description: 'Guide to setting up and running controlled experiments with agent configurations.',
          },
          {
            title: 'Statistical Methods for A/B Testing',
            url: 'https://www.evanmiller.org/ab-testing/',
            type: 'article',
            description: 'Practical guide to statistical significance in A/B tests.',
          },
        ]}
      />
    </div>
  )
}
