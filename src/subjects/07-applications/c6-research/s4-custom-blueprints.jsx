import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function CustomBlueprints() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Blueprints are reusable sandbox templates that bundle environment configuration, policies,
        tools, and dependencies into a single package. For research workflows, custom blueprints
        let you define a specialized environment once and instantiate it repeatedly for different
        experiments, ensuring consistency across runs while reducing setup time from hours to seconds.
      </p>

      <DefinitionBlock
        term="NemoClaw Blueprint"
        definition="A versioned, shareable template that defines a complete sandbox configuration including the base environment, installed packages, policy rules, tool availability, filesystem layout, and resource limits. Blueprints can be extended and parameterized."
        example="A 'ml-training-pytorch' blueprint that provides Python 3.11, PyTorch 2.2, CUDA 12.2, a GPU-enabled sandbox, and a policy that blocks internet access during training phases."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Blueprint Structure
      </h2>

      <CodeBlock
        title="Blueprint file layout"
        language="bash"
        code={`blueprints/
  ml-training-pytorch/
    blueprint.yaml          # Main blueprint definition
    Dockerfile              # Base environment (optional, for custom images)
    requirements.txt        # Python dependencies (frozen)
    policy.yaml             # Default policy
    setup.sh                # Post-creation setup script
    README.md               # Blueprint documentation

  nlp-evaluation/
    blueprint.yaml
    requirements.txt
    policy.yaml
    eval-scripts/           # Bundled evaluation tools
      compute_metrics.py
      generate_report.py`}
      />

      <CodeBlock
        title="Blueprint definition (blueprint.yaml)"
        language="yaml"
        code={`# blueprints/ml-training-pytorch/blueprint.yaml
name: ml-training-pytorch
version: 2.1.0
description: >
  GPU-enabled PyTorch environment for ML training experiments.
  Includes common ML libraries, deterministic CUDA support,
  and experiment tracking integration.

# Base environment
environment:
  base_image: nvidia/cuda:12.2.0-runtime-ubuntu22.04
  python: "3.11.7"
  system_packages:
    - git
    - build-essential
    - libffi-dev

# Python dependencies
python:
  requirements: requirements.txt
  extra_index_urls:
    - https://download.pytorch.org/whl/cu122

# Parameters (users can override these)
parameters:
  gpu_count:
    type: integer
    default: 1
    description: Number of GPUs to allocate
  memory_limit:
    type: string
    default: "32GB"
    description: Maximum memory
  experiment_tracker:
    type: string
    default: "wandb"
    enum: [wandb, mlflow, tensorboard, none]
  deterministic:
    type: boolean
    default: true
    description: Enable deterministic CUDA operations

# Resource defaults
resources:
  gpu:
    count: "\${{ parameters.gpu_count }}"
    type: required
    exclusive: true
  cpu_limit: 8
  memory_limit: "\${{ parameters.memory_limit }}"
  disk_limit: 100GB
  shm_size: 8GB

# Sandbox configuration
sandbox:
  reproducibility:
    deterministic_cuda: "\${{ parameters.deterministic }}"
    hash_check_data: true

  phases:
    setup:
      timeout: 600s
      network: permissive
    training:
      timeout: 86400s
      network: restricted
    evaluation:
      timeout: 7200s
      network: restricted

# Default policy
policy: policy.yaml

# Filesystem layout
filesystem:
  directories:
    - /experiment/checkpoints
    - /experiment/logs
    - /experiment/outputs
    - /data
    - /models
  writable:
    - /experiment/**
    - /tmp/**
  readable:
    - /data/**
    - /models/**
    - /workspace/**

# Post-creation setup
setup:
  script: setup.sh
  env:
    TRACKER: "\${{ parameters.experiment_tracker }}"`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Using Blueprints
      </h2>

      <StepBlock
        title="Creating and Using a Custom Blueprint"
        steps={[
          {
            title: 'Create the blueprint',
            content: 'Initialize a new blueprint from scratch or extend an existing one.',
            code: `# Create from scratch
openclaw blueprint create ml-training-pytorch

# Or extend an existing blueprint
openclaw blueprint create nlp-evaluation \\
  --extends ml-training-pytorch \\
  --add-packages "datasets transformers evaluate"`,
            language: 'bash',
          },
          {
            title: 'Customize the configuration',
            content: 'Edit the blueprint files to match your research needs. Pin all dependency versions for reproducibility.',
            code: `# Freeze current dependencies
pip freeze > blueprints/ml-training-pytorch/requirements.txt

# Verify all versions are pinned (no >= or ~= operators)
grep -E '[><=~]' blueprints/ml-training-pytorch/requirements.txt
# Should return nothing if all versions are exact`,
            language: 'bash',
          },
          {
            title: 'Build and validate the blueprint',
            content: 'Build the blueprint image and run validation tests.',
            code: `openclaw blueprint build ml-training-pytorch

# Validate:
# - All packages install correctly
# - GPU is accessible
# - CUDA deterministic mode works
# - Policy is valid
openclaw blueprint validate ml-training-pytorch

# Output:
# Blueprint: ml-training-pytorch v2.1.0
# Base image: nvidia/cuda:12.2.0-runtime-ubuntu22.04
# Python packages: 147 (all pinned)
# GPU support: CUDA 12.2 detected
# Policy: valid (12 rules)
# Parameters: 4 defined
# Validation: PASSED`,
            language: 'bash',
          },
          {
            title: 'Instantiate for an experiment',
            content: 'Create a sandbox from the blueprint, optionally overriding parameters.',
            code: `# Use defaults
openclaw experiment run \\
  --blueprint ml-training-pytorch \\
  --config experiments/fine-tune-v3.yaml

# Override parameters
openclaw experiment run \\
  --blueprint ml-training-pytorch \\
  --set gpu_count=2 \\
  --set memory_limit=64GB \\
  --set experiment_tracker=mlflow \\
  --config experiments/fine-tune-v3.yaml`,
            language: 'bash',
          },
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Blueprint Inheritance
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Blueprints can extend other blueprints, adding or overriding specific configurations.
        This enables a library of composable environment templates.
      </p>

      <CodeBlock
        title="Blueprint inheritance chain"
        language="yaml"
        code={`# blueprints/nlp-evaluation/blueprint.yaml
name: nlp-evaluation
version: 1.0.0
description: Environment for NLP model evaluation and benchmarking

# Extend the base ML training blueprint
extends: ml-training-pytorch

# Add NLP-specific packages
python:
  additional_requirements:
    - datasets==2.16.1
    - evaluate==0.4.1
    - rouge-score==0.1.2
    - sacrebleu==2.4.0
    - bert-score==0.3.13

# Override resource defaults (evaluation needs less GPU)
resources:
  gpu:
    count: 1
    exclusive: false  # Can share GPU during eval
  memory_limit: 16GB

# Add evaluation-specific tools
tools:
  additional:
    - eval-scripts/compute_metrics.py
    - eval-scripts/generate_report.py

# Override phase timeouts (evaluation is faster)
sandbox:
  phases:
    evaluation:
      timeout: 3600s  # 1 hour max for eval`}
      />

      <ComparisonTable
        title="Example Blueprint Library"
        headers={['Blueprint', 'Base', 'Use Case', 'Key Additions']}
        rows={[
          ['ml-training-pytorch', 'CUDA base', 'General ML training', 'PyTorch, GPU support, experiment tracking'],
          ['nlp-evaluation', 'ml-training-pytorch', 'NLP benchmarking', 'datasets, evaluate, metrics scripts'],
          ['rl-training', 'ml-training-pytorch', 'Reinforcement learning', 'gymnasium, stable-baselines3'],
          ['data-science', 'Python base', 'Data analysis', 'pandas, scikit-learn, matplotlib, Jupyter'],
          ['llm-fine-tune', 'ml-training-pytorch', 'LLM fine-tuning', 'transformers, peft, bitsandbytes, Flash Attention'],
        ]}
      />

      <NoteBlock type="info" title="Sharing Blueprints">
        <p>
          Blueprints can be published to a blueprint registry for team-wide or public use.
          Use <code>openclaw blueprint publish ml-training-pytorch</code> to share a blueprint.
          Others can use it with <code>--blueprint registry/ml-training-pytorch:2.1.0</code>.
          Version pinning ensures everyone uses the same environment.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Specialized Research Configurations
      </h2>

      <CodeBlock
        title="LLM fine-tuning blueprint with LoRA"
        language="yaml"
        code={`# blueprints/llm-fine-tune/blueprint.yaml
name: llm-fine-tune
version: 1.2.0
extends: ml-training-pytorch

python:
  additional_requirements:
    - transformers==4.37.2
    - peft==0.8.2
    - bitsandbytes==0.42.0
    - trl==0.7.10
    - flash-attn==2.5.2

parameters:
  quantization:
    type: string
    default: "4bit"
    enum: [none, 4bit, 8bit]
  lora_r:
    type: integer
    default: 16
  lora_alpha:
    type: integer
    default: 32
  max_seq_length:
    type: integer
    default: 2048

resources:
  gpu:
    count: 1
    min_memory: 40GB  # Require at least 40GB VRAM
  memory_limit: 64GB
  disk_limit: 200GB  # Large models need space`}
      />

      <ExerciseBlock
        question="You have a blueprint 'ml-training-pytorch' at version 2.1.0 that works for your experiments. A new version 2.2.0 updates PyTorch from 2.2.1 to 2.3.0. Should you upgrade?"
        options={[
          'Yes, always use the latest version for best performance',
          'No, never upgrade to preserve reproducibility',
          'Pin your experiments to 2.1.0 and test new experiments with 2.2.0 to verify results match before upgrading',
          'Upgrade immediately but keep a backup of 2.1.0',
        ]}
        correctIndex={2}
        explanation="Existing experiments should remain pinned to the version they were run with for reproducibility. New experiments can use the updated blueprint, but you should run validation tests to ensure the PyTorch update does not change results. Framework version changes can affect numerical behavior, especially with CUDA operations."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Blueprint Specification',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/blueprints.md',
            type: 'docs',
            description: 'Complete specification for blueprint definition and parameterization.',
          },
          {
            title: 'Blueprint Registry',
            url: 'https://github.com/openclaw-org/nemoclaw-blueprints',
            type: 'github',
            description: 'Community-maintained collection of blueprints for common research workflows.',
          },
        ]}
      />
    </div>
  )
}
