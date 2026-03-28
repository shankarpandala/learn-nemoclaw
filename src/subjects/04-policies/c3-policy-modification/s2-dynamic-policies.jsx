import { NoteBlock, CodeBlock, WarningBlock } from '../../../components/content'

export default function DynamicPolicies() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dynamic Policies
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        While static policy changes require editing YAML files and running{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          nemoclaw onboard
        </code>
        , dynamic policies provide a faster mechanism for applying policy changes in real time.
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          openshell policy set
        </code>{' '}
        command loads a policy file and applies it to the running sandbox session immediately.
        These changes are session-only -- they take effect instantly but revert when the sandbox
        restarts.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The openshell policy set Command
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The primary command for dynamic policy changes is{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          openshell policy set &lt;file&gt;
        </code>
        . It accepts a YAML policy file in the same format as the baseline policy. The file is
        validated, and if valid, its rules are merged with the current active policy for the
        duration of the session.
      </p>

      <CodeBlock
        language="bash"
        title="Applying a dynamic policy"
        code={`# Apply a temporary policy override
openshell policy set /sandbox/temp-policy.yaml

# Output:
# Validating policy... OK
# Applying session override (2 groups, 4 endpoints added)
# Session policy active. Changes will revert on restart.

# View the combined active policy
openshell policy show

# Remove session overrides and revert to baseline
openshell policy reset`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Use Cases for Dynamic Policies
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Dynamic policies are designed for situations where you need temporary, quick-turnaround
        policy changes without going through the full edit-onboard cycle. Common use cases include:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Testing new rules:</span> Before committing a new
          endpoint to the baseline policy, test it with a dynamic policy to verify the agent
          can reach the endpoint and that the integration works correctly.
        </li>
        <li>
          <span className="font-semibold">Temporary access grants:</span> The agent needs
          one-time access to a service for a specific task. For example, downloading a dataset
          from a cloud storage endpoint that will not be needed again.
        </li>
        <li>
          <span className="font-semibold">Debugging connectivity:</span> When diagnosing why
          an agent cannot reach a service, temporarily grant access to isolate whether the
          issue is policy-related or a genuine network problem.
        </li>
        <li>
          <span className="font-semibold">Demo and evaluation:</span> When evaluating a new
          service integration, grant temporary access without modifying the production baseline.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Creating a Dynamic Policy File
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Dynamic policy files use the same YAML format as baseline policies. You can create them
        as standalone files that contain only the additional groups you want to add.
      </p>

      <CodeBlock
        language="yaml"
        title="Example dynamic policy: temp-huggingface.yaml"
        code={`version: "1.0"
kind: network-policy
metadata:
  name: temp-huggingface
  description: Temporary access to HuggingFace for model download

groups:
  huggingface:
    endpoints:
      - domain: "huggingface.co"
        port: 443
        tls: required
      - domain: "cdn-lfs.huggingface.co"
        port: 443
        tls: required
      - domain: "api-inference.huggingface.co"
        port: 443
        tls: required`}
      />

      <CodeBlock
        language="bash"
        title="Applying and using the dynamic policy"
        code={`# Apply the temporary policy
openshell policy set /sandbox/temp-huggingface.yaml

# Now the agent can access HuggingFace
# ... agent downloads the model ...

# When done, revert to baseline
openshell policy reset

# Or simply restart the sandbox -- session policies are cleared automatically`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        How Dynamic Policies Merge
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When you apply a dynamic policy, its groups and endpoints are merged with the currently
        active policy. The merge is additive -- dynamic policies can only add access, never
        remove it. If the baseline policy grants access to GitHub, a dynamic policy cannot
        revoke that access. This ensures that dynamic policies cannot be used to weaken the
        security posture.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If a dynamic policy defines a group name that already exists in the baseline, the
        endpoints are merged. Duplicate endpoints (same domain and port) are deduplicated.
        New endpoints within the existing group are added.
      </p>

      <NoteBlock type="info" title="Dynamic Policies Are Additive Only">
        <p>
          You cannot use a dynamic policy to remove access that was granted by the baseline
          policy. Dynamic policies can only expand the set of allowed endpoints. To restrict
          access, you must modify the baseline YAML file and run{' '}
          <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-sm font-mono">
            nemoclaw onboard
          </code>
          . This design ensures that temporary overrides never make the sandbox less secure
          than the baseline configuration.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Reverting Dynamic Policies
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Dynamic policies revert automatically when the sandbox restarts. You can also manually
        revert them during a session using the{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          openshell policy reset
        </code>{' '}
        command. After a reset, only the baseline policy (from the YAML file) remains active.
      </p>

      <CodeBlock
        language="bash"
        title="Policy management commands"
        code={`# Show the current active policy (baseline + session overrides)
openshell policy show

# Show only session overrides
openshell policy show --session

# Reset to baseline (remove all session overrides)
openshell policy reset

# Apply a new dynamic policy (replaces previous session overrides)
openshell policy set /sandbox/new-policy.yaml`}
      />

      <WarningBlock title="Session Policies Are Not Persisted">
        <p>
          Dynamic policies exist only in memory for the current session. They are not saved to
          disk. If the sandbox restarts (due to a crash, manual restart, or system reboot),
          all session policies are lost. If you find yourself repeatedly applying the same
          dynamic policy, consider adding those endpoints to the baseline YAML instead.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Promoting Dynamic Policies to Baseline
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A common workflow is to test a policy change dynamically, verify it works, and then
        promote it to the baseline. This is done manually: copy the groups and endpoints from
        your dynamic policy file into the baseline YAML, then run{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          nemoclaw onboard
        </code>
        . There is no automatic promotion command -- this is intentional, as promoting a
        temporary change to a permanent baseline should always be a deliberate decision.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will examine how session policies and baseline policies
        interact, including how operator approvals fit into this model.
      </p>
    </div>
  )
}
