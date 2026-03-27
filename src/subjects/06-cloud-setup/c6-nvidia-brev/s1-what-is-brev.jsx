import { NoteBlock, DefinitionBlock, ComparisonTable, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function WhatIsBrev() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        NVIDIA Brev: Managed GPU Instances
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NVIDIA Brev is a managed GPU cloud platform designed to simplify the deployment and
        management of GPU-accelerated workloads. Unlike traditional cloud providers where you
        provision a raw VM and install everything yourself, Brev provides pre-configured GPU
        environments with NVIDIA drivers, CUDA, and popular ML frameworks ready to go. For
        NemoClaw, Brev offers one-command deployment to GPU instances, making it the fastest
        path from zero to a running NemoClaw instance with local inference.
      </p>

      <DefinitionBlock
        term="NVIDIA Brev"
        definition="A managed GPU cloud platform that abstracts away infrastructure complexity for GPU workloads. Brev provides instant access to NVIDIA GPUs (T4, A10G, A100, H100) with pre-installed drivers and development environments. Users interact through a CLI or web console, deploying instances with a single command rather than manually configuring VMs, drivers, and CUDA."
        example="Running 'nemoclaw deploy my-instance' on Brev provisions an A100-equipped instance with NVIDIA drivers, CUDA, Node.js, and NemoClaw pre-configured -- ready to use in under 5 minutes."
        seeAlso={['GPU Instance', 'CUDA', 'Local Inference']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why Brev for NemoClaw?
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Setting up a GPU instance on AWS, GCP, or Azure requires multiple steps: requesting
        GPU quota, launching the VM, installing NVIDIA drivers, installing CUDA, configuring
        the inference framework, and finally installing NemoClaw. This process takes 30-60
        minutes even for experienced users. Brev reduces this to a single command that completes
        in under 5 minutes.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">No driver installation:</span> NVIDIA drivers and CUDA
          come pre-installed and tested on every Brev instance. No more debugging driver version
          mismatches or failed installations.
        </li>
        <li>
          <span className="font-semibold">No quota requests:</span> Unlike AWS/GCP/Azure where
          new accounts start with zero GPU quota and must request increases (1-3 business day wait),
          Brev provides immediate GPU access.
        </li>
        <li>
          <span className="font-semibold">One-command deployment:</span> NemoClaw integrates with
          Brev's CLI to deploy a fully configured instance with a single command. The deployment
          includes the Gateway, policy engine, and your chosen local LLM.
        </li>
        <li>
          <span className="font-semibold">Cost-efficient billing:</span> Brev supports per-second
          billing, so you only pay for the time your GPU instance is actually running. Easily
          stop instances when not in use.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Available GPU Configurations
      </h2>

      <ComparisonTable
        title="Brev GPU Instance Options"
        headers={['GPU', 'VRAM', 'vCPUs', 'RAM', 'Approx. $/hr', 'Best For']}
        rows={[
          ['NVIDIA T4', '16 GB', '4', '16 GB', '~$0.50', '7B parameter models, budget option'],
          ['NVIDIA A10G', '24 GB', '8', '32 GB', '~$1.10', '13B parameter models, balanced choice'],
          ['NVIDIA A100 40GB', '40 GB', '12', '48 GB', '~$2.50', '30B models, high throughput'],
          ['NVIDIA A100 80GB', '80 GB', '12', '96 GB', '~$3.50', '70B quantized models'],
          ['NVIDIA H100', '80 GB', '16', '128 GB', '~$4.50', 'Maximum performance, latest architecture'],
        ]}
      />

      <NoteBlock type="info" title="Pricing Comparison">
        <p>
          Brev's pricing is competitive with major cloud providers and often cheaper for
          short-duration workloads due to per-second billing. For always-on deployments running
          24/7, the monthly cost is comparable to AWS/GCP on-demand pricing. The primary value
          proposition is speed and simplicity, not raw cost savings. You trade infrastructure
          management time for slightly higher per-hour costs.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Brev vs. Traditional Cloud Providers
      </h2>

      <ComparisonTable
        title="Brev vs. AWS/GCP for NemoClaw GPU Deployment"
        headers={['Factor', 'Brev', 'AWS/GCP/Azure']}
        rows={[
          ['Time to running NemoClaw', '~5 minutes', '30-60 minutes'],
          ['GPU quota', 'Instant access', 'Request required (1-3 days)'],
          ['Driver installation', 'Pre-installed', 'Manual or extension-based'],
          ['CUDA setup', 'Pre-installed', 'Manual installation'],
          ['Pricing flexibility', 'Per-second billing', 'Per-second (varies by provider)'],
          ['Instance variety', 'GPU-focused selection', 'Hundreds of instance types'],
          ['Managed services (S3, RDS, etc.)', 'Not available', 'Full ecosystem'],
          ['Custom networking (VPC, VPN)', 'Limited', 'Full control'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When to Use Brev
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Brev is ideal when you want GPU-accelerated NemoClaw without infrastructure overhead.
        It is particularly well-suited for:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Rapid prototyping:</span> Testing NemoClaw with local
          inference before committing to a long-term cloud setup.
        </li>
        <li>
          <span className="font-semibold">Teams without cloud expertise:</span> If your team
          does not have AWS/GCP/Azure experience, Brev eliminates the learning curve.
        </li>
        <li>
          <span className="font-semibold">Ephemeral GPU needs:</span> Running local inference
          during business hours and shutting down overnight to save costs.
        </li>
        <li>
          <span className="font-semibold">Demos and evaluations:</span> Spinning up a fully
          functional NemoClaw environment in minutes for stakeholder demonstrations.
        </li>
      </ul>

      <ExerciseBlock
        question="What is the primary advantage of using Brev over AWS for a NemoClaw GPU deployment?"
        options={[
          'Brev is always cheaper than AWS',
          'Brev eliminates driver installation, quota requests, and manual setup -- reducing deployment time from 30-60 minutes to ~5 minutes',
          'Brev provides more GPU types than AWS',
          'Brev includes free LLM API access',
        ]}
        correctIndex={1}
        explanation="Brev's main advantage is operational simplicity, not cost. It eliminates the multi-step process of requesting GPU quota, provisioning a VM, installing NVIDIA drivers, configuring CUDA, and setting up the inference stack. This reduces NemoClaw GPU deployment from 30-60 minutes of manual work to a single command completing in about 5 minutes."
      />

      <ReferenceList
        references={[
          {
            title: 'NVIDIA Brev Documentation',
            url: 'https://docs.brev.dev/',
            type: 'docs',
            description: 'Official Brev documentation for GPU instance management.',
          },
          {
            title: 'Brev CLI Reference',
            url: 'https://docs.brev.dev/cli',
            type: 'docs',
            description: 'Command reference for the Brev CLI tool.',
          },
        ]}
      />
    </div>
  )
}
