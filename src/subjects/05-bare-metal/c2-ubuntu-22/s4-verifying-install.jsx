import { CodeBlock, NoteBlock, StepBlock, WarningBlock, ExerciseBlock } from '../../../components/content'

export default function VerifyingInstall() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Verifying the Installation
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        After running <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw onboard</code>,
        you should have a running sandbox. Before using it for real work, it is important to verify
        that everything is functioning correctly: the sandbox is in a healthy state, OpenShell is
        responding, security policies are applied, and you can connect successfully.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This section covers the essential verification commands and what their output should look
        like when everything is working correctly.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        List All Sandboxes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw list</code> command
        shows all sandboxes on the system, their current status, and key metadata.
      </p>

      <CodeBlock
        title="List sandboxes"
        language="bash"
        code={`nemoclaw list

# Expected output:
# NAME              STATUS    BLUEPRINT              CREATED           UPTIME
# my-dev-sandbox    running   nemoclaw-base:latest   5 minutes ago     5m 12s

# For more detail, use the verbose flag:
nemoclaw list -v

# Output includes additional columns:
# NAME              STATUS    BLUEPRINT              CPUS   MEMORY   PORTS          POLICY
# my-dev-sandbox    running   nemoclaw-base:latest   2      4 GB     8080->8080     default`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The STATUS column should show <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">running</code>.
        Other possible states include <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">stopped</code>,
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">starting</code>,
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">error</code>, and
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">degraded</code>.
        If the status is anything other than <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">running</code>,
        consult the troubleshooting section.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Check Sandbox Status
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw {'<name>'} status</code> command
        provides detailed health information for a specific sandbox, including the state of each
        internal component.
      </p>

      <CodeBlock
        title="Detailed sandbox status"
        language="bash"
        code={`nemoclaw my-dev-sandbox status

# Expected output:
# Sandbox: my-dev-sandbox
# Status:  running
# Uptime:  7m 34s
#
# Components:
#   Container    running    (Docker: abc123def456)
#   OpenShell    healthy    (PID: 1842, listening on :8022)
#   Policy       applied    (default, 12 rules active)
#   Network      up         (172.17.0.2, bridge mode)
#   Filesystem   ok         (overlay2, 234 MB used)
#
# Resources:
#   CPU:    2 cores allocated, 0.3% current usage
#   Memory: 4 GB allocated, 412 MB current usage
#   Disk:   234 MB writable layer used`}
      />

      <NoteBlock type="info" title="Understanding the Components">
        <p>
          Each component in the status output represents a critical piece of the sandbox. The
          Container is the Docker container itself. OpenShell is the secure shell runtime that
          agents connect to. Policy shows whether security rules are loaded and active. Network
          shows the sandbox's IP address and networking mode. Filesystem shows the storage
          driver and disk usage.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Test the Connection
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The ultimate verification is connecting to the sandbox and confirming you can interact
        with it.
      </p>

      <StepBlock
        title="Connect to the sandbox for the first time"
        steps={[
          {
            title: 'Connect using the NemoClaw CLI',
            content: 'This opens an interactive OpenShell session inside the sandbox.',
            code: 'nemoclaw my-dev-sandbox connect',
          },
          {
            title: 'Verify you are inside the sandbox',
            content: 'Run basic commands to confirm the sandbox environment is working.',
            code: `# Inside the sandbox shell:
whoami
# Expected: agent

hostname
# Expected: my-dev-sandbox

cat /etc/nemoclaw/sandbox.conf | head -5
# Shows sandbox configuration

echo "Hello from inside the sandbox!"`,
          },
          {
            title: 'Check OpenShell version',
            content: 'Verify the OpenShell runtime is the expected version.',
            code: `openshell --version
# Expected: OpenShell vX.Y.Z`,
          },
          {
            title: 'Test policy enforcement',
            content: 'Try an operation that should be blocked by the default policy.',
            code: `# The default policy blocks access to /etc/shadow:
cat /etc/shadow
# Expected: Permission denied (policy: filesystem.read.deny)

# The default policy allows reading files in the workspace:
ls /home/agent/
# Expected: workspace/`,
          },
          {
            title: 'Disconnect from the sandbox',
            content: 'Exit the OpenShell session to return to your host shell.',
            code: `exit
# Returns you to the host shell`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Verify from the Host Side
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        You can also verify the sandbox from the host without connecting to it. These commands
        are useful for scripting and monitoring.
      </p>

      <CodeBlock
        title="Host-side verification commands"
        language="bash"
        code={`# Ping the sandbox health endpoint
nemoclaw my-dev-sandbox health
# Expected: healthy

# Run a single command inside the sandbox (non-interactive)
nemoclaw my-dev-sandbox exec -- echo "Sandbox is working"
# Expected: Sandbox is working

# Check the sandbox's IP address
nemoclaw my-dev-sandbox inspect --format '{{.NetworkSettings.IPAddress}}'
# Expected: 172.17.0.2 (or similar)

# View the active policy summary
nemoclaw my-dev-sandbox policy show
# Shows the current security policy rules`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Comprehensive Verification Script
      </h2>

      <CodeBlock
        title="verify-installation.sh"
        language="bash"
        code={`#!/usr/bin/env bash
SANDBOX="my-dev-sandbox"

echo "=== NemoClaw Installation Verification ==="

# Check CLI
nemoclaw --version > /dev/null 2>&1 && \\
  echo "[OK] NemoClaw CLI: $(nemoclaw --version)" || \\
  echo "[FAIL] NemoClaw CLI not found"

# Check sandbox exists
nemoclaw list 2>/dev/null | grep -q "$SANDBOX" && \\
  echo "[OK] Sandbox '$SANDBOX' exists" || \\
  echo "[FAIL] Sandbox '$SANDBOX' not found"

# Check sandbox status
STATUS=$(nemoclaw "$SANDBOX" status 2>/dev/null | grep "^Status:" | awk '{print $2}')
[ "$STATUS" = "running" ] && \\
  echo "[OK] Sandbox status: running" || \\
  echo "[FAIL] Sandbox status: $STATUS"

# Check health
HEALTH=$(nemoclaw "$SANDBOX" health 2>/dev/null)
[ "$HEALTH" = "healthy" ] && \\
  echo "[OK] Sandbox health: healthy" || \\
  echo "[FAIL] Sandbox health: $HEALTH"

# Check exec
EXEC_OUT=$(nemoclaw "$SANDBOX" exec -- echo "test" 2>/dev/null)
[ "$EXEC_OUT" = "test" ] && \\
  echo "[OK] Command execution works" || \\
  echo "[FAIL] Command execution failed"

echo "=== Verification Complete ==="`}
      />

      <ExerciseBlock
        question="After running `nemoclaw onboard`, which command should you use to check if all sandbox components (container, OpenShell, policy, network, filesystem) are healthy?"
        options={[
          'nemoclaw list',
          'nemoclaw <name> status',
          'nemoclaw <name> connect',
          'docker inspect <container-id>',
        ]}
        correctIndex={1}
        explanation="The `nemoclaw <name> status` command shows the detailed health of each sandbox component. `nemoclaw list` shows a summary, `connect` opens an interactive session, and `docker inspect` bypasses NemoClaw's abstraction layer."
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If all checks pass, your NemoClaw installation is verified and ready for use. If any check
        fails, the next section covers common issues and their solutions.
      </p>
    </div>
  )
}
