import { NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function ChoosingInstances() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Choosing Instance Types for NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Selecting the right cloud instance type is one of the most consequential decisions you will
        make when deploying NemoClaw. An undersized instance leads to sluggish policy evaluation,
        dropped WebSocket connections, and frustrated users. An oversized instance burns through your
        cloud budget without meaningful performance gains. This section walks you through the hardware
        requirements, the tradeoffs between cost and performance, and the special considerations for
        GPU-accelerated local inference.
      </p>

      <DefinitionBlock
        term="Instance Type"
        definition="A cloud provider's predefined combination of virtual CPU cores, memory, storage, and optionally GPU accelerators. Each provider uses its own naming convention (e.g., AWS t3.large, GCP e2-standard-4, Azure Standard_D4s_v3), but they all describe a specific hardware configuration available for rent."
        example="An AWS t3.large provides 2 vCPUs and 8 GB of RAM -- suitable for lightweight testing but below the recommended minimum for production NemoClaw deployments."
        seeAlso={['vCPU', 'GPU Instance', 'Right-Sizing']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Minimum Hardware Requirements
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw consists of two primary processes: the OpenClaw Gateway (Node.js) and the NemoClaw
        policy engine (Rust-based sidecar). Together they require a baseline of compute resources to
        operate reliably under typical workloads -- a small team of five to ten developers interacting
        with agents through Slack or Discord.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">vCPUs: 4 or more.</span> The Gateway is largely single-threaded
          for message processing but spawns worker threads for tool execution. The policy engine evaluates
          rules concurrently and benefits significantly from multiple cores. With fewer than 4 vCPUs, policy
          evaluation latency increases noticeably under concurrent agent sessions.
        </li>
        <li>
          <span className="font-semibold">RAM: 8-16 GB.</span> The Gateway maintains in-memory session
          state including conversation histories. Each active session can consume 10-50 MB depending on
          context length. The policy engine loads compiled rule sets into memory for fast evaluation.
          8 GB is the absolute minimum for a small team; 16 GB is recommended for production use with
          ten or more concurrent sessions.
        </li>
        <li>
          <span className="font-semibold">Storage: 30 GB+ SSD.</span> The operating system, Node.js runtime,
          NemoClaw binaries, log files, and workspace data all require disk space. SSD storage is strongly
          recommended because the policy engine performs frequent small reads when loading rule definitions.
          HDD-backed instances will exhibit noticeably higher startup times and policy reload latency.
        </li>
        <li>
          <span className="font-semibold">Network: Low-latency outbound.</span> NemoClaw makes API calls to
          LLM providers (Anthropic, OpenAI) and receives webhook events from Slack or Discord. A minimum
          of 1 Gbps network bandwidth is typical for cloud instances and sufficient for NemoClaw.
        </li>
      </ul>

      <NoteBlock type="info" title="These Are Minimums, Not Recommendations">
        <p>
          The 4 vCPU / 8 GB configuration will run NemoClaw, but you may experience increased policy
          evaluation latency under load. For teams larger than ten people or deployments with many
          concurrent agent sessions, start with 8 vCPU / 16 GB and scale from there. Monitoring
          resource utilization during the first week of deployment is critical for right-sizing.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Cost vs. Performance Tradeoffs
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Cloud pricing is complex, but the fundamental tradeoff is straightforward: more compute costs
        more money. The question is where to invest those dollars for maximum impact on NemoClaw
        performance. Here is a rough breakdown of how each resource dimension affects NemoClaw.
      </p>

      <ComparisonTable
        title="Resource Impact on NemoClaw Performance"
        headers={['Resource', 'Impact on Performance', 'Cost Sensitivity']}
        rows={[
          ['Additional vCPUs (4 to 8)', 'High: concurrent policy evaluations run faster, tool execution parallelism improves', 'Moderate: roughly doubles instance cost'],
          ['Additional RAM (8 to 16 GB)', 'Moderate: more sessions can be held in memory, reduces risk of OOM under load', 'Low-Moderate: RAM is relatively cheap per GB'],
          ['SSD vs HDD storage', 'Moderate at startup, low at runtime: faster policy loading, faster log writes', 'Low: SSD is standard on most modern instances'],
          ['GPU accelerator', 'Very High for local inference: enables running LLMs locally instead of API calls', 'Very High: GPU instances cost 3-10x more than CPU-only'],
          ['Premium network (e.g., enhanced)', 'Low: NemoClaw is not bandwidth-intensive', 'Low: usually included or minimal cost'],
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For most teams, the best value is a mid-range CPU-optimized instance with 4-8 vCPUs and
        16 GB RAM. This handles the Gateway and policy engine comfortably while keeping monthly costs
        in the $50-150 range depending on provider and region. GPU instances only make sense if you
        plan to run local LLM inference -- otherwise, you are paying a significant premium for
        hardware that sits idle.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Instance Type Recommendations by Provider
      </h2>

      <ComparisonTable
        title="Recommended Instance Types"
        headers={['Provider', 'Budget / Testing', 'Production (Small Team)', 'Production (Large Team)']}
        rows={[
          ['AWS', 't3.large (2 vCPU, 8 GB)', 't3.xlarge (4 vCPU, 16 GB)', 'c6i.2xlarge (8 vCPU, 16 GB)'],
          ['GCP', 'e2-standard-2 (2 vCPU, 8 GB)', 'e2-standard-4 (4 vCPU, 16 GB)', 'c2-standard-8 (8 vCPU, 32 GB)'],
          ['Azure', 'Standard_B2s (2 vCPU, 4 GB)', 'Standard_D4s_v3 (4 vCPU, 16 GB)', 'Standard_D8s_v3 (8 vCPU, 32 GB)'],
          ['DigitalOcean', 'Basic 4GB ($24/mo)', 'CPU-Optimized 8GB ($80/mo)', 'CPU-Optimized 16GB ($160/mo)'],
          ['Hetzner', 'CX22 (2 vCPU, 4 GB)', 'CX31 (4 vCPU, 8 GB)', 'CX41 (8 vCPU, 16 GB)'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GPU Instances for Local Inference
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If your deployment requires running language models locally -- for data privacy, latency
        reduction, or cost control on high-volume workloads -- you will need a GPU-equipped instance.
        Local inference with models like Llama 3, Mistral, or Code Llama requires significant GPU
        memory (VRAM). The minimum practical VRAM for useful coding models is 16 GB, which rules out
        consumer-grade GPUs in cloud contexts.
      </p>

      <ComparisonTable
        title="GPU Instance Options for Local Inference"
        headers={['Provider', 'Instance Type', 'GPU', 'VRAM', 'Approx. Monthly Cost']}
        rows={[
          ['AWS', 'g4dn.xlarge', 'NVIDIA T4', '16 GB', '~$380'],
          ['AWS', 'g5.xlarge', 'NVIDIA A10G', '24 GB', '~$730'],
          ['AWS', 'p3.2xlarge', 'NVIDIA V100', '16 GB', '~$2,200'],
          ['GCP', 'n1-standard-4 + T4', 'NVIDIA T4', '16 GB', '~$350'],
          ['GCP', 'a2-highgpu-1g', 'NVIDIA A100', '40 GB', '~$2,900'],
          ['Azure', 'Standard_NC4as_T4_v3', 'NVIDIA T4', '16 GB', '~$400'],
        ]}
      />

      <WarningBlock title="GPU Instances Are Expensive">
        <p>
          A single GPU instance can cost more per month than an entire small team's CPU-based
          deployment. Before committing to GPU instances, verify that local inference is genuinely
          required for your use case. Most NemoClaw deployments work excellently with API-based LLM
          providers, where you pay per token rather than per hour of GPU rental. GPU instances make
          economic sense only at high volumes (thousands of requests per day) or when data must not
          leave your infrastructure.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Right-Sizing Over Time
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The best approach is to start with a moderately sized instance and monitor actual resource
        utilization. NemoClaw exposes metrics through its Control UI and optionally through
        Prometheus-compatible endpoints. Watch CPU utilization, memory usage, and policy evaluation
        latency (the p95 response time for rule checks) during the first one to two weeks. If CPU
        consistently stays below 30%, you can safely downsize. If memory usage approaches 80% of
        available RAM, scale up before sessions start getting evicted.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Cloud providers make it straightforward to resize instances. On AWS you can stop an EC2
        instance, change its type, and start it again in under five minutes. GCP and Azure offer
        similar workflows. There is no penalty for starting small and scaling up -- but there can
        be a significant cost penalty for starting large and never scaling down.
      </p>

      <ExerciseBlock
        question="A team of 15 developers plans to deploy NemoClaw on AWS for production use with API-based LLM inference (no local models). Which instance type is the most appropriate starting point?"
        options={[
          't3.micro (1 vCPU, 1 GB) -- minimal cost',
          't3.large (2 vCPU, 8 GB) -- budget option',
          't3.xlarge (4 vCPU, 16 GB) -- balanced',
          'p3.2xlarge (8 vCPU, 61 GB, V100 GPU) -- maximum performance',
        ]}
        correctIndex={2}
        explanation="For a 15-person team without local inference needs, t3.xlarge provides the recommended 4 vCPU and 16 GB RAM at a reasonable cost. The t3.large is below minimum for this team size, and the p3.2xlarge includes an expensive GPU that would sit unused since inference is API-based."
      />

      <ReferenceList
        references={[
          {
            title: 'AWS EC2 Instance Types',
            url: 'https://aws.amazon.com/ec2/instance-types/',
            type: 'docs',
            description: 'Complete list of EC2 instance families with specs and pricing.',
          },
          {
            title: 'GCP Machine Type Comparison',
            url: 'https://cloud.google.com/compute/docs/machine-types',
            type: 'docs',
            description: 'GCP machine families and their intended workloads.',
          },
          {
            title: 'Azure VM Sizes',
            url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/sizes',
            type: 'docs',
            description: 'Azure virtual machine size categories and specifications.',
          },
        ]}
      />
    </div>
  )
}
