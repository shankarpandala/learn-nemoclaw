import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function Benchmarking() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Performance benchmarking goes beyond comparing providers. It measures how your entire
        NemoClaw setup performs under different conditions: varying load, different configurations,
        network conditions, and model parameters. Understanding these performance characteristics
        helps you size your infrastructure, set realistic SLAs, and identify bottlenecks before
        they affect users.
      </p>

      <DefinitionBlock
        term="Performance Benchmarking"
        definition="Systematic measurement of an agent system's operational characteristics: response latency, throughput (tasks per unit time), resource utilization, error rates, and quality metrics under controlled conditions. Benchmarks establish baselines and reveal how performance degrades under load."
        example="Measuring that your NemoClaw code review agent handles 20 concurrent reviews with a P95 latency of 12 seconds, using 4GB RAM and 2 CPU cores, with a 98% success rate."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Key Performance Metrics
      </h2>

      <ComparisonTable
        title="Metrics to Benchmark"
        headers={['Metric', 'What It Measures', 'Target (Example)', 'How to Measure']}
        rows={[
          ['P50 latency', 'Median response time', '<5s for reviews', 'End-to-end task timer'],
          ['P95 latency', '95th percentile response time', '<15s for reviews', 'Percentile calculation over N runs'],
          ['P99 latency', 'Worst-case (near) response time', '<30s for reviews', 'Percentile calculation over N runs'],
          ['Throughput', 'Tasks completed per minute', '>10 reviews/min', 'Count tasks in fixed time window'],
          ['Error rate', 'Percentage of failed tasks', '<2%', 'Failed tasks / total tasks'],
          ['Token efficiency', 'Tokens used per useful output', '<5:1 input:output ratio', 'Track token counts'],
          ['Resource usage', 'CPU, memory, disk I/O', '<4GB RAM, <2 cores', 'System monitoring during test'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Running Latency Benchmarks
      </h2>

      <CodeBlock
        title="Latency benchmark configuration"
        language="yaml"
        code={`# benchmark/latency-test.yaml
name: review-latency-benchmark
description: Measure code review latency under various conditions

test_cases:
  # Small PR (1-3 files, <100 lines changed)
  - name: small-pr
    input: fixtures/small-pr.diff
    runs: 50
    warmup: 5  # Discard first 5 runs

  # Medium PR (5-15 files, 100-500 lines)
  - name: medium-pr
    input: fixtures/medium-pr.diff
    runs: 50
    warmup: 5

  # Large PR (20+ files, 500+ lines)
  - name: large-pr
    input: fixtures/large-pr.diff
    runs: 30
    warmup: 3

  # Worst case (100+ files, refactoring)
  - name: massive-pr
    input: fixtures/massive-pr.diff
    runs: 10
    warmup: 2

model: claude-sonnet-4-20250514
temperature: 0.0  # Deterministic for fair comparison

metrics:
  - total_latency     # End-to-end time
  - inference_latency  # Time waiting for model
  - network_latency    # Time in API calls
  - processing_latency # Time in local processing
  - tokens_input
  - tokens_output`}
      />

      <CodeBlock
        title="Running the benchmark"
        language="bash"
        code={`openclaw benchmark latency benchmark/latency-test.yaml

# === Latency Benchmark Results ===
#
# Test Case    | P50    | P95    | P99    | Mean   | Std Dev
# -------------|--------|--------|--------|--------|--------
# small-pr     | 3.2s   | 4.8s   | 6.1s   | 3.4s   | 0.9s
# medium-pr    | 6.7s   | 9.3s   | 12.4s  | 7.1s   | 1.8s
# large-pr     | 14.2s  | 19.8s  | 24.1s  | 15.1s  | 3.4s
# massive-pr   | 28.4s  | 42.1s  | 51.3s  | 30.2s  | 7.8s
#
# Latency Breakdown (medium-pr, P50):
# - Inference:  4.8s (72%)
# - Network:    1.2s (18%)
# - Processing: 0.7s (10%)
#
# Bottleneck: Inference latency dominates. Consider:
# 1. Prompt optimization to reduce input tokens
# 2. Splitting large reviews into parallel sub-tasks
# 3. Using streaming for faster time-to-first-token`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Throughput Benchmarks
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Throughput measures how many tasks your setup can handle concurrently. This is critical
        for CI pipelines where multiple PRs may need review simultaneously.
      </p>

      <CodeBlock
        title="Throughput benchmark"
        language="bash"
        code={`openclaw benchmark throughput \\
  --task-file benchmark/medium-pr-task.yaml \\
  --concurrency 1,2,4,8,16 \\
  --duration 300s \\
  --model claude-sonnet-4-20250514

# === Throughput Benchmark Results ===
#
# Concurrency | Tasks/min | Avg Latency | Error Rate | CPU  | Memory
# ------------|-----------|-------------|------------|------|-------
# 1           | 8.5       | 7.1s        | 0%         | 12%  | 1.2GB
# 2           | 16.2      | 7.4s        | 0%         | 22%  | 1.8GB
# 4           | 28.7      | 8.3s        | 0%         | 38%  | 2.9GB
# 8           | 41.2      | 11.6s       | 2%         | 65%  | 4.8GB
# 16          | 44.8      | 21.4s       | 8%         | 92%  | 7.2GB
#
# Observations:
# - Linear scaling up to concurrency=4
# - Diminishing returns at concurrency=8 (rate limits starting)
# - Significant degradation at concurrency=16 (errors + high latency)
# - Sweet spot: concurrency=4 (best throughput/latency tradeoff)
# - Bottleneck at 16: inference API rate limits, not local resources`}
      />

      <NoteBlock type="tip" title="Identify Your Bottleneck">
        <p>
          Performance bottlenecks typically fall into three categories: inference API (rate limits,
          server load), local resources (CPU, memory, disk), or network (latency to API endpoints).
          The latency breakdown in the benchmark output tells you which category dominates.
          Optimize the bottleneck first; optimizing elsewhere has no effect.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Quality Metrics Under Load
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        An often-overlooked aspect of benchmarking is whether quality degrades under load.
        If your agent uses a timeout to manage latency, it may produce lower-quality reviews
        when overloaded because it has less time to analyze the code.
      </p>

      <CodeBlock
        title="Quality-under-load benchmark"
        language="yaml"
        code={`# benchmark/quality-load-test.yaml
name: quality-under-load
description: Does review quality degrade at higher concurrency?

# Use tasks with known correct answers
tasks:
  - fixtures/known-bugs/*.diff  # 20 diffs with known bugs

# Run at different concurrency levels
concurrency_levels: [1, 4, 8, 16]

# Quality metrics
evaluation:
  # What percentage of known bugs does the agent find?
  bug_detection_rate:
    expected_bugs_file: fixtures/known-bugs/expected.yaml

  # Does the agent produce false positives under pressure?
  false_positive_rate:
    max_acceptable: 0.15

  # Is the review complete or truncated?
  completeness:
    min_findings_per_task: 1`}
      />

      <CodeBlock
        title="Quality-under-load results"
        language="bash"
        code={`openclaw benchmark quality-load benchmark/quality-load-test.yaml

# === Quality Under Load ===
#
# Concurrency | Bug Detection | False Positives | Completeness | Avg Tokens
# ------------|--------------|-----------------|--------------|----------
# 1           | 88%          | 10%             | 100%         | 2847
# 4           | 86%          | 11%             | 100%         | 2791
# 8           | 82%          | 14%             | 95%          | 2234
# 16          | 71%          | 19%             | 78%          | 1687
#
# Analysis: Quality degrades significantly at concurrency=16.
# The agent produces shorter reviews (fewer tokens) and misses more bugs.
# Root cause: session timeout (300s) is hit more frequently at high load,
# causing the agent to truncate its analysis.
#
# Recommendation: Cap concurrency at 8, or increase timeout for high load.`}
      />

      <WarningBlock title="Benchmarks Must Use Production-Like Conditions">
        <p>
          Run benchmarks with the same model, policy, system prompt, and network conditions as
          production. Benchmarks on a fast local network with a toy prompt will not reflect
          real-world performance. If your production agent processes real GitHub PRs with a
          1500-token system prompt, your benchmark should do the same.
        </p>
      </WarningBlock>

      <ExerciseBlock
        question="Your throughput benchmark shows linear scaling from 1 to 4 concurrent tasks, but tasks/minute barely increases from 4 to 8 concurrent while latency doubles. What is the most likely bottleneck?"
        options={[
          'Local CPU is saturated at 4 concurrent tasks',
          'The inference API rate limit is being hit at 4+ concurrent requests',
          'Disk I/O is the bottleneck for reading code files',
          'The NemoClaw sandbox overhead increases exponentially with concurrency',
        ]}
        correctIndex={1}
        explanation="When throughput stops scaling but latency increases, the bottleneck is typically an external rate limit. Local resource bottlenecks (CPU, memory, disk) would show in the system metrics. The inference API rate limit causes requests to queue, increasing latency without increasing throughput. Check the API provider's rate limit headers (X-RateLimit-Remaining) to confirm."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Performance Tuning',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/performance-tuning.md',
            type: 'docs',
            description: 'Guide to optimizing NemoClaw performance for production workloads.',
          },
          {
            title: 'Benchmark Suite',
            url: 'https://github.com/openclaw-org/nemoclaw/tree/main/benchmarks',
            type: 'github',
            description: 'Ready-to-run benchmark configurations and test datasets.',
          },
        ]}
      />
    </div>
  )
}
