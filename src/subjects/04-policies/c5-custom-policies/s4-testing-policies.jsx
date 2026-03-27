import { NoteBlock, CodeBlock, StepBlock, WarningBlock } from '../../../components/content'

export default function TestingPolicies() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Testing Policies
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A misconfigured network policy can either block legitimate traffic (causing the agent
        to fail) or grant excessive access (creating security vulnerabilities). Testing
        policies before deploying them to production is essential. NemoClaw provides several
        mechanisms for validating policy correctness, from schema validation to dry-run
        mode to iterative monitoring.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Level 1: Schema Validation
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The first level of testing is schema validation, which catches structural errors in
        the YAML file. This is automatically performed during{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          nemoclaw onboard
        </code>
        , but you can also run it independently:
      </p>

      <CodeBlock
        language="bash"
        title="Running schema validation"
        code={`# Validate without applying
nemoclaw policy validate nemoclaw-blueprint/policies/openclaw-sandbox.yaml

# Output for a valid policy:
# Policy 'openclaw-sandbox' validated successfully
# Version: 1.0
# Groups: 10
# Endpoints: 18
# All domains resolve: yes

# Output for an invalid policy:
# Validation FAILED:
#   Line 14: Unknown field 'protocol'
#   Line 22: Port must be 443, got 8080
#   Line 30: Domain '*.example.com' contains invalid characters`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Schema validation catches typos, incorrect field values, and structural problems. It
        does not verify that the endpoints are actually reachable or that the policy meets
        your agent's functional requirements.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Level 2: DNS Resolution Check
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        After schema validation, NemoClaw can check whether each whitelisted domain resolves
        in DNS. A domain that does not resolve may indicate a typo or a decommissioned service.
      </p>

      <CodeBlock
        language="bash"
        title="DNS resolution check"
        code={`# Validate with DNS resolution check
nemoclaw policy validate --check-dns nemoclaw-blueprint/policies/openclaw-sandbox.yaml

# Output:
# Checking DNS resolution for 18 endpoints...
#   api.anthropic.com          -> 104.18.x.x  OK
#   statsig.anthropic.com      -> 104.18.x.x  OK
#   api.github.com             -> 140.82.x.x  OK
#   api.typo-service.com       -> NXDOMAIN     WARNING: domain does not resolve
#
# 17/18 endpoints resolve. 1 warning.`}
      />

      <NoteBlock type="info" title="DNS Warnings Are Not Failures">
        <p>
          A domain that does not resolve is flagged as a warning, not an error. There are
          legitimate reasons a domain might not resolve from the validation host -- it could
          be an internal domain that only resolves inside a VPN, or a domain that uses split
          DNS. However, for public services, a DNS resolution failure usually indicates a
          typo or a decommissioned endpoint that should be removed.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Level 3: Dry-Run Mode
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Dry-run mode applies the policy to a sandbox but operates in monitoring mode rather
        than enforcement mode. In dry-run mode, connections to non-whitelisted endpoints are
        allowed but logged as "would-be-blocked." This lets you see what the policy would
        block without actually breaking the agent's functionality.
      </p>

      <CodeBlock
        language="bash"
        title="Running in dry-run mode"
        code={`# Start a sandbox in dry-run mode
nemoclaw onboard --dry-run

# Output:
# Policy applied in DRY-RUN mode
# All connections are allowed but non-whitelisted requests will be logged
# Monitor with: openshell logs audit --filter dry_run=true

# Run your agent normally...
# After the agent completes its task, check what would have been blocked:

openshell logs audit --filter dry_run=true --format table

# Output:
# TIMESTAMP            DOMAIN                  STATUS
# 14:32:07             api.stripe.com          WOULD-BE-BLOCKED
# 14:32:08             files.stripe.com        WOULD-BE-BLOCKED
# 14:33:12             cdn.jsdelivr.net        WOULD-BE-BLOCKED
# 14:33:15             registry.yarnpkg.com    WOULD-BE-BLOCKED`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Dry-run mode is invaluable when migrating from a permissive environment to NemoClaw's
        deny-by-default model. It shows you exactly what the agent needs without disrupting
        its operation. Run the agent through its typical workload in dry-run mode, collect
        the list of would-be-blocked endpoints, evaluate each one, and build your whitelist
        from real data.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Level 4: Staged Rollout with Monitoring
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For production deployments, use a staged approach that combines enforcement with
        active monitoring:
      </p>

      <StepBlock
        title="Staged policy rollout"
        steps={[
          {
            title: 'Run in dry-run mode first',
            content: 'Apply the policy in dry-run mode and run the agent through a complete task cycle. Collect all would-be-blocked requests.',
            code: 'nemoclaw onboard --dry-run',
          },
          {
            title: 'Analyze dry-run results',
            content: 'Review every would-be-blocked endpoint. Classify each as "needed" or "not needed." Add needed endpoints to the policy.',
            code: 'openshell logs audit --filter dry_run=true --summary',
          },
          {
            title: 'Switch to enforcement mode',
            content: 'Apply the updated policy in enforcement mode. The agent is now constrained.',
            code: 'nemoclaw onboard',
          },
          {
            title: 'Monitor blocked requests actively',
            content: 'Watch the TUI or audit logs for the first few sessions. If the agent hits blocked endpoints that should be allowed, approve them in the session and add them to the baseline.',
            code: `# Monitor in real-time
openshell logs audit --follow --filter event=network.blocked`,
          },
          {
            title: 'Iterate until stable',
            content: 'After a few sessions with no unexpected blocks, the policy is stable. Continue monitoring periodically to catch new dependencies from agent or service updates.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Automated Policy Testing
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For teams that deploy multiple sandboxes, automated testing can catch policy regressions
        before they reach production. Consider integrating policy tests into your CI pipeline:
      </p>

      <CodeBlock
        language="bash"
        title="CI pipeline policy testing"
        code={`# In your CI pipeline:

# 1. Validate schema
nemoclaw policy validate nemoclaw-blueprint/policies/openclaw-sandbox.yaml
if [ $? -ne 0 ]; then
  echo "Policy validation failed"
  exit 1
fi

# 2. Check that required groups exist
REQUIRED_GROUPS="claude_code github npm_registry"
for group in $REQUIRED_GROUPS; do
  if ! grep -q "^  $group:" nemoclaw-blueprint/policies/openclaw-sandbox.yaml; then
    echo "ERROR: Required group '$group' missing from policy"
    exit 1
  fi
done

# 3. Verify no accidental endpoint removals
# Compare against a known-good baseline
diff <(nemoclaw policy list-endpoints --baseline) \\
     <(nemoclaw policy list-endpoints --file nemoclaw-blueprint/policies/openclaw-sandbox.yaml) \\
     || echo "WARNING: Endpoint changes detected -- review before merging"`}
      />

      <WarningBlock title="Test with Realistic Workloads">
        <p>
          Schema validation and DNS checks verify the policy file is correct, but they do not
          verify it is complete. The only way to know if a policy covers all the agent's needs
          is to run the agent through a realistic workload. Ensure your test scenarios cover
          the full range of the agent's operations, including edge cases like package
          installation, authentication flows, and error recovery paths.
        </p>
      </WarningBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the final section of this chapter, we will cover best practices for long-term
        policy management, including the principle of least privilege, regular audits, and
        documentation strategies.
      </p>
    </div>
  )
}
