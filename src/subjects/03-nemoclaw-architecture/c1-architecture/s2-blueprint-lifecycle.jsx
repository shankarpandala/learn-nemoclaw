import { StepBlock, CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, ReferenceList } from '../../../components/content';

export default function BlueprintLifecycle() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Blueprint Lifecycle
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Every time NemoClaw starts or applies a configuration change, the Python blueprint
        goes through a well-defined lifecycle of five stages. Each stage has a clear
        responsibility, clear failure modes, and clear outputs. Understanding this lifecycle
        is essential for debugging, for writing custom policies, and for understanding
        why NemoClaw behaves the way it does.
      </p>

      <StepBlock
        title="The Five Lifecycle Stages"
        steps={[
          {
            title: 'Stage 1: Resolve',
            content:
              'Find the correct blueprint version. NemoClaw reads the user\'s configuration to determine which blueprint version is requested (e.g., "0.8.2" or "latest"). It checks the local cache first, then pulls from the configured registry if needed. Resolution also considers version pinning and constraints specified in the project\'s .nemoclaw/config.yaml file.',
            code: `# Resolution reads from .nemoclaw/config.yaml
blueprint:
  version: "0.8.2"          # Exact pin
  # version: ">=0.8,<0.9"   # Range constraint
  registry: "https://registry.nvidia.com/nemoclaw"`,
            language: 'yaml',
          },
          {
            title: 'Stage 2: Verify',
            content:
              'Check the integrity of the resolved blueprint. NemoClaw computes the SHA-256 digest of the blueprint package and compares it against the expected digest published in the registry manifest. If the digest does not match, the lifecycle halts immediately with an error. This prevents execution of tampered or corrupted blueprints.',
            code: `$ nemoclaw blueprint verify
Verifying blueprint v0.8.2...
  Expected digest: sha256:a3f8c1d...e9b7
  Computed digest: sha256:a3f8c1d...e9b7
  Status: VERIFIED`,
            language: 'bash',
          },
          {
            title: 'Stage 3: Plan',
            content:
              'Compute the desired state. The blueprint reads all policy files (.nemoclaw/policies/*.yaml), the project configuration, and the current system state. It produces a plan -- a declarative description of what the sandbox should look like: which filesystem paths are accessible, which syscalls are allowed, which network endpoints are reachable, and which inference provider is configured.',
            code: `$ nemoclaw plan
Planning sandbox configuration...
  Filesystem: /sandbox (rw), /tmp (rw), /usr (ro), /lib (ro)
  Seccomp: 58 syscalls allowed, 284 blocked
  Network: inference.local:443, pypi.org:443 (via proxy)
  Inference: nvidia/nemotron-3-super-120b
  Changes from current state: 2 new network rules, 1 updated fs rule`,
            language: 'bash',
          },
          {
            title: 'Stage 4: Apply',
            content:
              'Create (or reconfigure) the sandbox to match the plan. This is where OpenShell is invoked. The blueprint passes the computed Landlock rules, seccomp filters, and network namespace configuration to OpenShell, which creates the isolated environment. If a sandbox already exists, Apply performs a minimal diff-based update rather than a full teardown and rebuild.',
            code: `$ nemoclaw apply
Applying plan...
  Creating OpenShell sandbox... done
  Applying Landlock rules (12 paths)... done
  Loading seccomp filter (58 allowed syscalls)... done
  Configuring network namespace... done
  Starting inference.local gateway... done
  Sandbox ready in 1.2s`,
            language: 'bash',
          },
          {
            title: 'Stage 5: Status',
            content:
              'Report the health of the running sandbox. After Apply completes (and periodically thereafter), the blueprint checks that the sandbox is healthy: the agent process is running, the Landlock rules are in effect, the seccomp filter is loaded, and the inference gateway is responding. Status is exposed via the plugin to the OpenClaw UI and via the openshell term TUI.',
            code: `$ nemoclaw status
NemoClaw Status:
  Blueprint: v0.8.2 (verified)
  Sandbox:   running (pid 4821, uptime 14m)
  Landlock:  enforcing (12 rules)
  Seccomp:   enforcing (58/342 syscalls allowed)
  Network:   2 endpoints reachable
  Inference: nvidia/nemotron-3-super-120b (latency: 142ms)
  Health:    OK`,
            language: 'bash',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Lifecycle as a Loop
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The lifecycle is not just a one-time startup sequence. It operates as a
        reconciliation loop, similar to a Kubernetes controller. When policies change on
        disk, the blueprint detects the change through filesystem watching and re-runs
        the Plan and Apply stages. This means you can edit a policy file, save it, and
        see the sandbox reconfigure itself within seconds -- without restarting anything.
      </p>

      <CodeBlock
        title="Reconciliation loop (conceptual)"
        language="python"
        code={`class BlueprintController:
    async def reconcile(self):
        """Main reconciliation loop."""
        while True:
            version = await self.resolve()      # Stage 1
            self.verify(version)                 # Stage 2
            plan = self.plan(version)            # Stage 3
            if plan.has_changes():
                await self.apply(plan)           # Stage 4
            self.report_status()                 # Stage 5
            await self.wait_for_change()         # Watch for policy/config changes`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Failure Handling at Each Stage
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Each stage has distinct failure modes, and NemoClaw is designed to fail loudly
        and early rather than silently degrading security:
      </p>

      <DefinitionBlock
        term="Resolve Failure"
        definition="Occurs when the requested blueprint version cannot be found in the local cache or the remote registry. Common causes: version typo, network issue, or registry downtime."
        example="Error: Blueprint version 0.8.3 not found. Available versions: 0.8.0, 0.8.1, 0.8.2."
      />

      <DefinitionBlock
        term="Verify Failure"
        definition="Occurs when the computed digest does not match the expected digest. This is a hard stop -- NemoClaw will not proceed. This could indicate a corrupted download, a cache poisoning attack, or a registry compromise."
        example="FATAL: Digest mismatch for blueprint v0.8.2. Expected sha256:a3f8c1d...e9b7, got sha256:7b2e4f9...c3a1. Refusing to execute."
      />

      <WarningBlock title="Never Ignore Verify Failures">
        A digest mismatch is a security event. Do not work around it by disabling
        verification. Investigate the cause: re-download the blueprint, check your
        registry configuration, and if the mismatch persists, report it to your
        security team. Tampered blueprints could weaken every sandbox policy.
      </WarningBlock>

      <DefinitionBlock
        term="Plan Failure"
        definition="Occurs when policy files contain syntax errors, reference unsupported features, or produce contradictory rules. The plan stage validates the entire configuration before any changes are applied."
        example="Error in policies/network.yaml line 12: endpoint 'evil.example.com' does not match any allowlist pattern."
      />

      <DefinitionBlock
        term="Apply Failure"
        definition="Occurs when the host system cannot satisfy the plan. Common causes: missing kernel features (Landlock not available), insufficient permissions, or resource exhaustion."
        example="Error: Landlock ABI v3 required but host kernel only supports ABI v1. Upgrade to kernel 6.2+ or adjust policies."
      />

      <DefinitionBlock
        term="Status Failure"
        definition="Occurs when the sandbox is running but unhealthy. The agent process may have crashed, the inference gateway may be unreachable, or a Landlock rule may have been unexpectedly removed (which should not happen under normal operation)."
        example="Warning: Inference gateway not responding. Last successful health check: 2m ago."
      />

      <NoteBlock type="tip" title="Debugging Tip">
        Run <code>nemoclaw status --verbose</code> to see which lifecycle stage last
        ran, how long each stage took, and whether any warnings were produced. This is
        the single most useful command when something is not working as expected.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Idempotency
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Every stage is designed to be idempotent. Running <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw apply</code> twice
        with the same configuration produces the same result. The Plan stage computes a
        diff against the current state, and if there are no changes, Apply is a no-op.
        This is important both for reliability (re-running after a partial failure is
        safe) and for the reconciliation loop (spurious filesystem events do not cause
        unnecessary sandbox churn).
      </p>

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Blueprint Lifecycle',
            url: 'https://docs.nvidia.com/nemoclaw/lifecycle',
            type: 'docs',
            description: 'Detailed documentation on each lifecycle stage, including error codes and recovery procedures.',
          },
          {
            title: 'Kubernetes Controller Pattern',
            url: 'https://kubernetes.io/docs/concepts/architecture/controller/',
            type: 'docs',
            description: 'The reconciliation loop pattern that inspired NemoClaw\'s lifecycle design.',
          },
        ]}
      />
    </div>
  );
}
