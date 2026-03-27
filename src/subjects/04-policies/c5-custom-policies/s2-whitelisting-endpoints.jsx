import { NoteBlock, CodeBlock, StepBlock, WarningBlock } from '../../../components/content'

export default function WhitelistingEndpoints() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Whitelisting Endpoints
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Adding a new endpoint to your NemoClaw network policy is a straightforward but
        deliberate process. Each step is designed to ensure you are making an informed
        decision about expanding your agent's network access. This section walks through
        the complete workflow from identifying the need to verifying the result.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step-by-Step Whitelisting Process
      </h2>

      <StepBlock
        title="Adding a new endpoint to the network policy"
        steps={[
          {
            title: 'Identify the needed endpoint',
            content: 'Determine exactly which domain(s) the agent needs to access. Check the service\'s documentation for API endpoints. Many services use multiple domains -- an API domain, a CDN domain, an authentication domain. You need to identify all of them.',
            code: `# Common ways to discover required endpoints:

# 1. Check the service's API documentation
# Example: Stripe API uses api.stripe.com

# 2. Look at the agent's error logs for blocked requests
openshell logs audit --filter event=network.blocked

# 3. Run the agent with monitoring to see what it requests
# 4. Check the service's SDK source code for hardcoded URLs`,
          },
          {
            title: 'Verify the domain is legitimate',
            content: 'Before whitelisting any domain, verify it is genuinely owned by the service you expect. Check DNS records, WHOIS information, and the service\'s official documentation.',
            code: `# Check DNS resolution
dig api.stripe.com

# Verify the domain matches what the service documents
# Official Stripe docs: https://stripe.com/docs/api
# Confirms API endpoint is api.stripe.com`,
          },
          {
            title: 'Add the endpoint to your policy YAML',
            content: 'Edit the policy file and add the new endpoint. If the service fits into an existing group, add it there. Otherwise, create a new group.',
            code: `# nemoclaw-blueprint/policies/openclaw-sandbox.yaml

groups:
  # ... existing groups ...

  stripe:
    endpoints:
      - domain: "api.stripe.com"
        port: 443
        tls: required
      - domain: "files.stripe.com"
        port: 443
        tls: required`,
            language: 'yaml',
          },
          {
            title: 'Validate the policy file',
            content: 'Run a syntax check to catch errors before applying the policy.',
            code: `# Quick YAML syntax check
python3 -c "
import yaml, sys
with open('nemoclaw-blueprint/policies/openclaw-sandbox.yaml') as f:
    try:
        yaml.safe_load(f)
        print('YAML syntax OK')
    except yaml.YAMLError as e:
        print(f'YAML error: {e}')
        sys.exit(1)
"`,
          },
          {
            title: 'Apply the updated policy',
            content: 'Run nemoclaw onboard to reinitialize the sandbox with the new policy. This validates the schema and applies the rules.',
            code: `nemoclaw onboard

# Expected output:
# Validating network policy schema... OK
# Applying network policy (11 groups, 20 endpoints)... OK
# Sandbox reinitialized successfully`,
          },
          {
            title: 'Test connectivity',
            content: 'Verify that the agent can now reach the newly whitelisted endpoint. Test from inside the sandbox.',
            code: `# Test connectivity from inside the sandbox
curl -s -o /dev/null -w "HTTP Status: %{http_code}\\n" \\
  https://api.stripe.com/v1/charges \\
  -H "Authorization: Bearer sk_test_xxx"
# Expected: HTTP Status: 401 (auth error, but connection succeeded)

# Verify the endpoint appears in the active policy
openshell policy show | grep stripe`,
          },
          {
            title: 'Commit and document the change',
            content: 'Commit the policy change to version control with a descriptive message explaining why the endpoint was added.',
            code: `cd nemoclaw-blueprint
git add policies/openclaw-sandbox.yaml
git commit -m "Add Stripe API endpoints for payment processing integration"`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Handling Multi-Domain Services
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Most modern services use multiple domains. An API domain handles requests, a CDN
        domain serves assets, an authentication domain handles OAuth flows, and a webhook
        domain receives callbacks. When whitelisting a service, you need to identify all
        domains the agent will interact with.
      </p>

      <CodeBlock
        language="yaml"
        title="Example: Multi-domain service (AWS S3)"
        code={`# AWS S3 requires multiple domains depending on usage:
aws_s3:
  endpoints:
    # S3 API endpoint
    - domain: "s3.amazonaws.com"
      port: 443
      tls: required
    # Regional endpoint (if using specific regions)
    - domain: "s3.us-east-1.amazonaws.com"
      port: 443
      tls: required
    # Bucket-specific virtual-hosted style
    - domain: "my-bucket.s3.amazonaws.com"
      port: 443
      tls: required
    # STS for authentication (if using IAM roles)
    - domain: "sts.amazonaws.com"
      port: 443
      tls: required`}
      />

      <WarningBlock title="Watch for Authentication Domains">
        <p>
          Many services require separate OAuth or authentication endpoints. If you whitelist
          only the API domain but not the auth domain, the agent will be able to reach the
          API but fail during authentication. Common auth domains include
          login.microsoftonline.com (Microsoft), accounts.google.com (Google), and
          auth0.com-based domains. Check the service's authentication documentation carefully.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Discovering Endpoints from Blocked Requests
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A practical approach to discovering all required endpoints is to let the agent run
        with its current policy, observe which requests are blocked, and then whitelist the
        legitimate ones. This iterative approach ensures you do not over-provision access.
      </p>

      <CodeBlock
        language="bash"
        title="Iterative endpoint discovery"
        code={`# 1. Run the agent and let it attempt its task
# 2. Review blocked requests
openshell logs audit --filter event=network.blocked --format table

# Output:
# TIMESTAMP            DOMAIN                    PROCESS
# 2026-03-27 14:32:07  api.stripe.com           node (PID 4521)
# 2026-03-27 14:32:08  files.stripe.com         node (PID 4521)
# 2026-03-27 14:32:09  js.stripe.com            node (PID 4522)

# 3. Review each domain -- all three are legitimate Stripe domains
# 4. Add all three to the policy
# 5. Re-run the agent to confirm no more blocks`}
      />

      <NoteBlock type="tip" title="Start Restrictive, Add as Needed">
        <p>
          When setting up a new agent integration, resist the urge to whitelist every domain
          you think might be needed upfront. Instead, start with the minimum (perhaps just
          the API endpoint), run the agent, observe what gets blocked, and add endpoints
          iteratively. This approach ensures your policy contains only what is actually
          needed, not what you speculated might be needed.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Quick Test with Dynamic Policy
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If you want to test a new endpoint before committing it to the baseline, use a
        dynamic policy for a quick trial:
      </p>

      <CodeBlock
        language="bash"
        title="Test before committing to baseline"
        code={`# Create a temporary policy file
cat > /sandbox/test-stripe.yaml << 'EOF'
version: "1.0"
kind: network-policy
metadata:
  name: test-stripe
  description: Testing Stripe integration

groups:
  stripe:
    endpoints:
      - domain: "api.stripe.com"
        port: 443
        tls: required
EOF

# Apply as session-only
openshell policy set /sandbox/test-stripe.yaml

# Test the integration
# ... run your agent or test commands ...

# If it works, promote to baseline
# If it doesn't, the session policy expires on restart`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will cover how to create reusable policy presets that
        encapsulate endpoint configurations for sharing across teams and projects.
      </p>
    </div>
  )
}
