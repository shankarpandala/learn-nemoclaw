import { useState } from 'react'
import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function IsolatedExperiments() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Machine learning research demands reproducibility: the ability to re-run an experiment
        months later and get the same results. NemoClaw's sandboxed environments provide
        exactly the isolation needed for this. Each experiment runs in a controlled sandbox
        with fixed dependencies, deterministic configurations, and complete audit trails of
        every action taken. No more "it worked on my machine."
      </p>

      <DefinitionBlock
        term="Isolated Experiment Environment"
        definition="A NemoClaw sandbox configured specifically for running ML experiments. It provides a frozen dependency tree, controlled random seeds, deterministic CUDA behavior, isolated filesystem and network, and automatic capture of all experiment parameters and results."
        example="A sandbox running a fine-tuning experiment with pinned versions of PyTorch, transformers, and datasets libraries, a fixed random seed, and automatic logging of hyperparameters, training curves, and final metrics."
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Why Sandboxing Improves Research
      </h2>

      <ComparisonTable
        title="Research Without vs. With NemoClaw Sandboxing"
        headers={['Aspect', 'Without Sandboxing', 'With NemoClaw Sandbox']}
        rows={[
          ['Dependencies', 'System-wide packages, version drift', 'Frozen per-experiment, reproducible'],
          ['Random seeds', 'Often forgotten or partially set', 'Enforced at sandbox level'],
          ['GPU state', 'Shared with other processes', 'Exclusive access, deterministic mode'],
          ['Data access', 'Shared filesystem, may change', 'Snapshot at experiment start'],
          ['Network', 'Can accidentally download during training', 'Blocked except explicit allow'],
          ['Logging', 'Manual, often incomplete', 'Automatic capture of all actions'],
        ]}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Setting Up a Research Sandbox
      </h2>

      <CodeBlock
        title="Research experiment sandbox configuration"
        language="yaml"
        code={`# sandboxes/ml-experiment.yaml
name: ml-experiment
description: Isolated environment for ML experiments

# Reproducibility settings
reproducibility:
  random_seed: 42
  deterministic_cuda: true
  hash_check_data: true  # Verify dataset checksums at start

# Environment
environment:
  python_version: "3.11.7"
  cuda_version: "12.2"
  requirements: requirements-frozen.txt  # Pinned versions

# Resources
resources:
  gpu:
    count: 1
    type: required  # Fail if no GPU available
    exclusive: true  # No sharing with other sandboxes
  cpu_limit: 8
  memory_limit: 32GB
  disk_limit: 100GB
  shm_size: 8GB  # Shared memory for DataLoader workers

# Filesystem
filesystem:
  writable:
    - /experiment/**        # Experiment outputs
    - /tmp/**               # Temporary files
  readable:
    - /data/**              # Training data (read-only)
    - /models/**            # Pretrained models (read-only)
    - /workspace/**         # Source code

# Network (restricted during training)
network:
  default: deny
  allow:
    # Allow downloads only during setup phase
    - domain: pypi.org
      phase: setup
    - domain: files.pythonhosted.org
      phase: setup
    - domain: huggingface.co
      phase: setup
    # Experiment tracking (always allowed)
    - domain: api.wandb.ai
      methods: [POST]
    # Inference for evaluation
    - domain: api.anthropic.com
      methods: [POST]

# Phases
phases:
  setup:
    timeout: 600s
    network: permissive  # Allow downloads
  training:
    timeout: 86400s  # 24 hours max
    network: restricted  # No downloads during training
  evaluation:
    timeout: 3600s
    network: restricted`}
      />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Running Experiments
      </h2>

      <StepBlock
        title="Experiment Lifecycle"
        steps={[
          {
            title: 'Define the experiment',
            content: 'Create an experiment configuration that specifies hyperparameters, data, and evaluation criteria.',
            code: `# experiments/fine-tune-v3.yaml
experiment:
  name: fine-tune-v3
  description: "Fine-tune with LoRA r=16, lr=2e-4"
  sandbox: sandboxes/ml-experiment.yaml

  hyperparameters:
    learning_rate: 2e-4
    batch_size: 8
    epochs: 3
    lora_r: 16
    lora_alpha: 32
    warmup_steps: 100

  data:
    train: /data/train.jsonl
    eval: /data/eval.jsonl
    checksum:
      train: sha256:abc123...
      eval: sha256:def456...

  model:
    base: meta-llama/Llama-3.1-8B
    checkpoint: /models/llama-3.1-8b/

  output:
    directory: /experiment/fine-tune-v3/
    save_checkpoints: true
    save_every_n_steps: 500`,
            language: 'yaml',
          },
          {
            title: 'Launch the sandbox and start training',
            content: 'NemoClaw creates an isolated environment and runs the experiment.',
            code: `openclaw experiment run experiments/fine-tune-v3.yaml

# Output:
# [SETUP] Creating sandbox "ml-experiment"...
# [SETUP] Python 3.11.7 + CUDA 12.2
# [SETUP] Installing requirements (247 packages, all pinned)
# [SETUP] Verifying data checksums... OK
# [SETUP] GPU: NVIDIA A100 80GB (exclusive mode)
# [SETUP] Random seed: 42, deterministic CUDA: enabled
# [TRAIN] Starting fine-tuning: LoRA r=16, lr=2e-4, epochs=3
# [TRAIN] Epoch 1/3: loss=2.34, lr=1.5e-4 (warmup)
# [TRAIN] Epoch 2/3: loss=1.87, lr=2e-4
# [TRAIN] Epoch 3/3: loss=1.62, lr=1.8e-4 (decay)
# [EVAL]  Eval loss: 1.71, accuracy: 0.834
# [DONE]  Experiment complete. Results: /experiment/fine-tune-v3/`,
            language: 'bash',
          },
          {
            title: 'Review results and experiment manifest',
            content: 'NemoClaw automatically generates a manifest capturing everything about the experiment.',
            code: `cat /experiment/fine-tune-v3/manifest.json
# {
#   "experiment_id": "ft-v3-20251215-142301",
#   "sandbox_hash": "sha256:...",
#   "config_hash": "sha256:...",
#   "data_checksums": { "train": "sha256:abc...", "eval": "sha256:def..." },
#   "environment": {
#     "python": "3.11.7",
#     "torch": "2.2.1",
#     "transformers": "4.37.2",
#     "cuda": "12.2",
#     "gpu": "NVIDIA A100 80GB"
#   },
#   "results": {
#     "final_loss": 1.62,
#     "eval_loss": 1.71,
#     "eval_accuracy": 0.834,
#     "training_time_seconds": 3847
#   },
#   "reproducibility": {
#     "random_seed": 42,
#     "deterministic_cuda": true,
#     "fully_reproducible": true
#   }
# }`,
            language: 'bash',
          },
        ]}
      />

      <NoteBlock type="tip" title="Reproducibility Verification">
        <p>
          Run the same experiment twice with the same configuration. If the results are
          identical (within floating-point tolerance), your isolation is working correctly.
          NemoClaw can automate this with <code>openclaw experiment verify</code>, which
          re-runs the experiment and compares the manifest.
        </p>
      </NoteBlock>

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8">
        Comparing Experiment Runs
      </h2>

      <CodeBlock
        title="Comparing experiments"
        language="bash"
        code={`# Compare two experiment runs
openclaw experiment compare fine-tune-v2 fine-tune-v3

# === Experiment Comparison ===
# | Parameter      | fine-tune-v2 | fine-tune-v3 | Delta   |
# |----------------|-------------|-------------|---------|
# | lora_r         | 8           | 16          | +8      |
# | learning_rate  | 1e-4        | 2e-4        | +1e-4   |
# | eval_accuracy  | 0.812       | 0.834       | +0.022  |
# | eval_loss      | 1.89        | 1.71        | -0.18   |
# | training_time  | 2841s       | 3847s       | +1006s  |
# | gpu_memory_peak| 42GB        | 58GB        | +16GB   |
#
# Summary: v3 improved accuracy by 2.2% with 35% longer training time.
# The higher LoRA rank captured more task-specific patterns.`}
      />

      <ExerciseBlock
        question="During a training run, the agent's experiment script tries to download a new version of the tokenizer from Hugging Face. The sandbox is in the 'training' phase. What happens?"
        options={[
          'The download succeeds because Hugging Face was allowed during setup',
          'The download fails because network access to huggingface.co is only allowed during the setup phase',
          'The download is cached from the setup phase and served from local cache',
          'The sandbox pauses and asks for permission to download',
        ]}
        correctIndex={1}
        explanation="Network permissions are phase-dependent. Hugging Face access is explicitly allowed during the setup phase for downloading dependencies and model weights, but blocked during training. This prevents accidental non-determinism from downloading different versions mid-experiment. All needed resources must be fetched during setup."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Research Environments',
            url: 'https://github.com/openclaw-org/nemoclaw/blob/main/docs/research-environments.md',
            type: 'docs',
            description: 'Guide to configuring sandboxes for ML research and experimentation.',
          },
          {
            title: 'Reproducible ML Experiments',
            url: 'https://mlops.community/reproducible-ml-experiments/',
            type: 'article',
            description: 'Community guide to achieving reproducibility in machine learning.',
          },
        ]}
      />
    </div>
  )
}
