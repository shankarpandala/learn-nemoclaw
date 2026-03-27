import { NoteBlock, CodeBlock, StepBlock } from '../../../components/content'

export default function StaticChanges() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Static Policy Changes
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Static policy changes are the most common and most permanent way to modify NemoClaw's
        security configuration. The workflow is straightforward: edit the YAML policy file in
        your nemoclaw-blueprint directory, then run{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          nemoclaw onboard
        </code>{' '}
        to reinitialize the sandbox with the updated policy. These changes persist across
        sandbox restarts and represent your baseline security posture.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When to Use Static Changes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Static changes are appropriate when you are making deliberate, permanent adjustments
        to your security policy. Common scenarios include:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Adding a new service integration:</span> Your agent
          permanently needs access to a new API (for example, adding Jira integration). The
          endpoint should be in the baseline policy.
        </li>
        <li>
          <span className="font-semibold">Removing unnecessary access:</span> After auditing
          your policy, you determine the agent does not need access to a particular endpoint
          group. Remove it from the baseline.
        </li>
        <li>
          <span className="font-semibold">Initial setup:</span> When first deploying NemoClaw,
          you configure the policy to match your agent's known dependencies.
        </li>
        <li>
          <span className="font-semibold">Post-testing promotion:</span> After testing a new
          endpoint via dynamic policy (session-only), you decide to make it permanent.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The Full Workflow
      </h2>

      <StepBlock
        title="Making a static policy change"
        steps={[
          {
            title: 'Locate the policy file',
            content: 'The network policy lives in your nemoclaw-blueprint directory. Navigate to the policies subdirectory.',
            code: 'ls nemoclaw-blueprint/policies/\n# openclaw-sandbox.yaml  filesystem.yaml',
          },
          {
            title: 'Edit the YAML file',
            content: 'Open the policy file in your editor and make the desired changes. For example, adding a new endpoint group for a Slack integration.',
            code: `# Add a new group to nemoclaw-blueprint/policies/openclaw-sandbox.yaml
groups:
  # ... existing groups ...

  slack:
    endpoints:
      - domain: "slack.com"
        port: 443
        tls: required
      - domain: "api.slack.com"
        port: 443
        tls: required
      - domain: "files.slack.com"
        port: 443
        tls: required`,
            language: 'yaml',
          },
          {
            title: 'Validate the YAML syntax',
            content: 'Before applying, check that your YAML is well-formed. A simple syntax check can catch common errors like incorrect indentation or missing fields.',
            code: `# Quick validation using Python's YAML parser
python3 -c "import yaml; yaml.safe_load(open('nemoclaw-blueprint/policies/openclaw-sandbox.yaml'))"`,
          },
          {
            title: 'Run nemoclaw onboard',
            content: 'This command reinitializes the sandbox with the updated policy. It reads the YAML file, validates the schema, and applies the new rules.',
            code: `nemoclaw onboard

# Expected output:
# Reading policy from nemoclaw-blueprint/policies/openclaw-sandbox.yaml
# Validating network policy schema... OK
# Applying network policy (10 groups, 18 endpoints)... OK
# Sandbox reinitialized successfully`,
          },
          {
            title: 'Verify the changes',
            content: 'Confirm the new policy is active by checking the current policy state or testing connectivity to the newly whitelisted endpoint.',
            code: `# Check current policy
openshell policy show

# Test connectivity from inside the sandbox
curl -s -o /dev/null -w "%{http_code}" https://api.slack.com/api/test
# Should return 200 if the endpoint is now accessible`,
          },
          {
            title: 'Commit the policy change',
            content: 'Since the policy file is part of your nemoclaw-blueprint directory, commit the change to version control. This ensures the policy is tracked, reviewable, and reproducible.',
            code: `cd nemoclaw-blueprint
git add policies/openclaw-sandbox.yaml
git commit -m "Add Slack integration endpoints to network policy"`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What Happens During Onboard
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          nemoclaw onboard
        </code>{' '}
        command performs several actions in sequence:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Schema validation:</span> Verifies that the YAML
          conforms to the expected policy schema. Unknown fields, invalid port numbers, and
          missing required fields are caught here.
        </li>
        <li>
          <span className="font-semibold">Endpoint resolution:</span> For each whitelisted
          domain, the system verifies DNS resolution is possible. Unreachable domains trigger
          a warning (but not a failure).
        </li>
        <li>
          <span className="font-semibold">Policy application:</span> The validated policy is
          applied to the sandbox's network namespace. Existing session-only overrides are
          cleared -- the baseline policy becomes the sole active policy.
        </li>
        <li>
          <span className="font-semibold">Filesystem policy refresh:</span> If filesystem
          policy changes were also made, Landlock rules are regenerated. Note that because
          Landlock rules are irreversible for a running process, filesystem changes may
          require a full sandbox restart.
        </li>
      </ul>

      <NoteBlock type="warning" title="Onboard Clears Session Overrides">
        <p>
          Running{' '}
          <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-sm font-mono">
            nemoclaw onboard
          </code>{' '}
          resets the sandbox to the baseline policy defined in the YAML files. Any session-only
          policy changes (dynamic policies, operator approvals) are lost. If you have approved
          endpoints during a session that you want to keep, add them to the YAML file before
          running onboard.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Error Handling
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If the YAML file contains errors, the onboard command fails and no changes are applied.
        This fail-closed behavior ensures that a typo in the policy file never results in a
        permissive sandbox. The error output indicates the specific line and field that caused
        the failure.
      </p>

      <CodeBlock
        language="bash"
        title="Example error output"
        code={`nemoclaw onboard

# Error output for a malformed policy:
# ERROR: Policy validation failed
#   nemoclaw-blueprint/policies/openclaw-sandbox.yaml:45
#   Field 'port' must be 443, got 80
#
# No changes applied. Fix the errors and try again.`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Version Control Best Practices
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Policy files should be version-controlled just like application code. This enables:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Audit trail:</span> Every policy change has a
          commit author, timestamp, and message explaining why the change was made.
        </li>
        <li>
          <span className="font-semibold">Code review:</span> Policy changes can go through
          the same pull request and review process as code changes.
        </li>
        <li>
          <span className="font-semibold">Rollback:</span> If a policy change causes problems,
          revert to a previous commit and run onboard again.
        </li>
        <li>
          <span className="font-semibold">Reproducibility:</span> Any team member can
          recreate the exact same sandbox configuration by checking out the same commit.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Static policy changes are the foundation of NemoClaw's security configuration. They
        define your persistent security posture. In the next section, we will look at dynamic
        policies -- temporary changes that take effect immediately without modifying the
        baseline YAML.
      </p>
    </div>
  )
}
