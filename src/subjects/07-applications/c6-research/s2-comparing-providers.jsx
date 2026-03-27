import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function ComparingProviders() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Choosing an inference provider is a multi-dimensional optimization problem. You are balancing
        quality, latency, cost, reliability, and feature support. NemoClaw makes it straightforward
        to run the same workload against multiple providers and compare them objectively, because
        each provider runs in the same sandboxed environment with identical inputs.
      </p>

      <DefinitionBlock
        term="Provider Benchmarking"
        definition="The systematic process of evaluating multiple inference providers by running identical workloads through each and comparing results on quality, performance, and cost metrics. NemoClaw ensures fair comparison by providing identical sandbox environments and inputs."
        example="Comparing Anthropic Claude, OpenAI GPT, and Google Gemini for code review quality by running each against the same 50 pull requests and scoring the reviews."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Benchmarking Methodology
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A valid comparison requires controlling every variable except the provider. Same prompts,
        same input data, same evaluation criteria. NemoClaw's benchmark framework handles this
        by running each provider through an identical test suite.
      </p>

      <StepBlock
        title="Provider Comparison Workflow"
        steps={[
          {
            title: 'Define the evaluation dataset',
            content: 'Create a set of representative tasks that reflect your actual workload. Include easy, medium, and hard examples.',
            code: `# benchmark/eval-dataset.yaml
tasks:
  - id: review-001
    type: code_review
    input:
      repo: acme-corp/backend-api
      pr_diff: fixtures/pr-simple-bugfix.diff
    expected:
      should_find: ["unchecked error on line 23"]
      should_not_find: ["style issues"]  # Clean code

  - id: review-002
    type: code_review
    input:
      repo: acme-corp/backend-api
      pr_diff: fixtures/pr-race-condition.diff
    expected:
      should_find: ["race condition", "mutex", "sync"]

  - id: test-gen-001
    type: test_generation
    input:
      source_file: fixtures/payment_processor.go
    expected:
      min_test_count: 5
      must_cover: ["success", "failure", "edge case"]

  # ... 47 more tasks`,
            language: 'yaml',
          },
          {
            title: 'Configure the providers to test',
            content: 'Define each provider with its specific endpoint, model, and authentication.',
            code: `# benchmark/providers.yaml
providers:
  - name: anthropic-opus
    type: anthropic
    model: claude-opus-4-20250514
    api_key_env: ANTHROPIC_API_KEY
    max_tokens: 4096
    temperature: 0.0

  - name: anthropic-sonnet
    type: anthropic
    model: claude-sonnet-4-20250514
    api_key_env: ANTHROPIC_API_KEY
    max_tokens: 4096
    temperature: 0.0

  - name: openai-gpt4o
    type: openai
    model: gpt-4o
    api_key_env: OPENAI_API_KEY
    max_tokens: 4096
    temperature: 0.0

  - name: google-gemini
    type: google
    model: gemini-2.0-pro
    api_key_env: GOOGLE_API_KEY
    max_tokens: 4096
    temperature: 0.0`,
            language: 'yaml',
          },
          {
            title: 'Run the benchmark',
            content: 'Execute all tasks against all providers and collect results.',
            code: `openclaw benchmark run \\
  --dataset benchmark/eval-dataset.yaml \\
  --providers benchmark/providers.yaml \\
  --output benchmark/results/ \\
  --parallel 4  # Run 4 tasks concurrently

# Progress:
# [anthropic-opus]   50/50 tasks complete (avg 8.2s/task)
# [anthropic-sonnet]  50/50 tasks complete (avg 4.1s/task)
# [openai-gpt4o]     50/50 tasks complete (avg 5.7s/task)
# [google-gemini]    50/50 tasks complete (avg 6.3s/task)`,
            language: 'bash',
          },
          {
            title: 'Analyze and compare results',
            content: 'Generate a comparison report with quality, performance, and cost metrics.',
            code: `openclaw benchmark report benchmark/results/

# Results are also saved as CSV and JSON for further analysis`,
            language: 'bash',
          },
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Cost/Quality Tradeoffs
      </h2>

      <ComparisonTable
        title="Provider Benchmark Results (Example)"
        headers={['Metric', 'Claude Opus', 'Claude Sonnet', 'GPT-4o', 'Gemini Pro']}
        rows={[
          ['Quality score (1-5)', '4.6', '4.1', '4.2', '3.8'],
          ['Bug detection rate', '92%', '84%', '86%', '78%'],
          ['False positive rate', '8%', '14%', '12%', '18%'],
          ['Avg latency', '8.2s', '4.1s', '5.7s', '6.3s'],
          ['P99 latency', '14.5s', '7.8s', '12.1s', '11.2s'],
          ['Cost per task', '$0.087', '$0.012', '$0.045', '$0.031'],
          ['Cost per month (500 tasks)', '$43.50', '$6.00', '$22.50', '$15.50'],
        ]}
      />

      <NoteBlock type="info" title="Quality Score Methodology">
        <p>
          Quality scores should be determined by human raters, not by another AI model. Have
          two or more team members independently rate a sample of outputs on a 1-5 scale.
          Compute inter-rater agreement (Cohen's kappa) to ensure consistency. Automated
          metrics like bug detection rate can supplement but not replace human evaluation.
        </p>
      </NoteBlock>

      <CodeBlock
        title="Detailed comparison report"
        language="bash"
        code={`openclaw benchmark report benchmark/results/ --detailed

# === Provider Benchmark Report ===
# Dataset: 50 tasks (30 code reviews, 10 test generation, 10 other)
# Date: 2025-12-15
#
# QUALITY ANALYSIS:
# - Claude Opus excels at finding subtle bugs (race conditions, memory leaks)
# - Claude Sonnet matches Opus on obvious bugs but misses some subtle issues
# - GPT-4o strong on security findings, weaker on Go-specific patterns
# - Gemini Pro good general feedback, highest false positive rate
#
# COST EFFICIENCY:
# - Best quality per dollar: Claude Sonnet ($0.012/task at 4.1 quality)
# - Best absolute quality: Claude Opus ($0.087/task at 4.6 quality)
# - Quality increase from Sonnet to Opus: +12% for +625% cost
#
# LATENCY ANALYSIS:
# - Fastest: Claude Sonnet (4.1s avg, 7.8s P99)
# - Most consistent: Claude Sonnet (lowest variance)
# - Highest variance: GPT-4o (5.7s avg but 12.1s P99)
#
# RECOMMENDATION:
# - Daily code reviews: Claude Sonnet (best cost/quality ratio)
# - Security-critical reviews: Claude Opus (highest detection rate)
# - Budget-constrained: Claude Sonnet with selective Opus escalation`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Building a Hybrid Strategy
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Benchmark results often suggest a hybrid approach: use a cheaper model for routine tasks
        and a premium model for high-stakes work. NemoClaw supports this through model routing.
      </p>

      <CodeBlock
        title="Model routing based on task type"
        language="yaml"
        code={`# model-routing.yaml
routing:
  rules:
    # Use Opus for security-sensitive code
    - condition:
        file_patterns: ["**/auth/**", "**/crypto/**", "**/security/**"]
      model: claude-opus-4-20250514
      reason: "Security-critical code requires highest quality review"

    # Use Opus for large PRs (more complex)
    - condition:
        files_changed: ">20"
      model: claude-opus-4-20250514
      reason: "Large PRs benefit from deeper analysis"

    # Use Sonnet for everything else
    - condition: default
      model: claude-sonnet-4-20250514
      reason: "Standard review, good quality at lower cost"

  # Estimated monthly costs with this routing:
  # 80% Sonnet (~400 tasks * $0.012) = $4.80
  # 20% Opus   (~100 tasks * $0.087) = $8.70
  # Total: ~$13.50/month vs $43.50 all-Opus or $6.00 all-Sonnet`}
      />

      <ExerciseBlock
        question="Your benchmark shows Provider A has 95% bug detection rate at $0.10/task, and Provider B has 85% detection at $0.02/task. You have a $20/month budget and process 500 tasks/month. What is the best strategy?"
        options={[
          'Use Provider A for all tasks ($50/month, over budget)',
          'Use Provider B for all tasks ($10/month, within budget)',
          'Use Provider A for 200 critical tasks and Provider B for 300 routine tasks ($26/month, slightly over budget)',
          'Use Provider A for 100 critical tasks and Provider B for 400 routine tasks ($18/month, within budget)',
        ]}
        correctIndex={3}
        explanation="Option D stays within the $20 budget ($10 for A + $8 for B = $18) while using the higher-quality provider for the most critical 20% of tasks. This hybrid approach maximizes quality where it matters most while staying within budget constraints. The 10% detection rate difference on the remaining 400 tasks is an acceptable tradeoff."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Benchmark Framework',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/benchmarking.md',
            type: 'docs',
            description: 'Guide to running provider benchmarks with NemoClaw.',
          },
          {
            title: 'LLM Evaluation Best Practices',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/llm-evaluation.md',
            type: 'docs',
            description: 'Methodology for fairly evaluating language model outputs.',
          },
        ]}
      />
    </div>
  )
}
