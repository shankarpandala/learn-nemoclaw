import { CodeBlock, NoteBlock, StepBlock, DefinitionBlock } from '../../../components/content'

export default function FirstConnection() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Your First Connection
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With NemoClaw installed and a sandbox running, it is time to connect for the first time
        and explore the sandbox environment. The <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw {'<name>'} connect</code> command
        opens an interactive OpenShell session inside the sandbox. This section covers what to
        expect when you first connect, what the initial sandbox state looks like, and how to
        orient yourself inside the environment.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Connecting to the Sandbox
      </h2>

      <StepBlock
        title="Open your first connection"
        steps={[
          {
            title: 'Connect to the sandbox',
            content: 'Use the connect command with your sandbox name.',
            code: 'nemoclaw my-sandbox connect',
          },
          {
            title: 'Observe the connection output',
            content: 'OpenShell displays a welcome banner and session information when you connect.',
            code: `# Expected output:
# Connecting to sandbox "my-sandbox"...
#
# ╔══════════════════════════════════════════════════╗
# ║           NemoClaw Sandbox Shell                  ║
# ║  OpenShell v3.2.1 | Policy: default               ║
# ║  Sandbox: my-sandbox | Blueprint: nemoclaw-base    ║
# ╚══════════════════════════════════════════════════╝
#
# Type 'help' for available commands.
# Type 'policy' to view active security restrictions.
#
# agent@my-sandbox:~$`,
          },
        ]}
      />

      <DefinitionBlock
        term="OpenShell Session"
        definition="An interactive terminal session inside a NemoClaw sandbox, mediated by the OpenShell runtime. OpenShell intercepts every command before execution, evaluates it against the active security policy, and either permits or denies it. The session looks and feels like a normal Linux shell but has policy-enforced guardrails."
        example="When you type `rm -rf /`, OpenShell intercepts the command, checks the policy, and blocks it with an error message: 'Policy violation: destructive filesystem operation denied.'"
        seeAlso={['Security Policy', 'Command Filtering', 'Sandbox']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Initial Sandbox State
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A freshly created sandbox has a clean, minimal environment. Understanding the initial
        layout helps you know where to put files, what tools are available, and what the default
        security boundaries look like.
      </p>

      <CodeBlock
        title="Explore the initial sandbox filesystem"
        language="bash"
        code={`# Check your identity
whoami
# agent

id
# uid=1000(agent) gid=1000(agent) groups=1000(agent)

# Check your home directory
pwd
# /home/agent

ls -la /home/agent/
# drwxr-xr-x  agent agent  workspace/
# -rw-r--r--  agent agent  .bashrc
# -rw-r--r--  agent agent  .profile

# The workspace directory is your primary working area
ls /home/agent/workspace/
# (empty on first connection)`}
      />

      <CodeBlock
        title="Check available tools"
        language="bash"
        code={`# Pre-installed tools in the default blueprint
node --version      # v20.x.x
npm --version       # 10.x.x
python3 --version   # 3.11.x
pip3 --version      # pip 23.x.x
git --version       # 2.34.x
curl --version | head -1
jq --version

# OpenShell commands
openshell --version
openshell status
openshell policy`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Understanding the Security Context
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Every action you take inside the sandbox is filtered through the active security policy.
        On first connection with the default policy, the following rules are in effect:
      </p>

      <CodeBlock
        title="View the active security policy"
        language="bash"
        code={`# View the full policy
openshell policy

# Example output:
# === Active Security Policy: default ===
#
# Filesystem:
#   READ:   /home/agent/**        ALLOW
#   READ:   /usr/**               ALLOW
#   READ:   /etc/**               ALLOW (except /etc/shadow, /etc/sudoers)
#   WRITE:  /home/agent/**        ALLOW
#   WRITE:  /tmp/**               ALLOW
#   WRITE:  /var/tmp/**           ALLOW
#   WRITE:  (everything else)     DENY
#
# Network:
#   OUTBOUND: ports 80,443        ALLOW (HTTP/HTTPS)
#   OUTBOUND: (other ports)       DENY
#   INBOUND:  port 8080           ALLOW
#   INBOUND:  (other ports)       DENY
#
# Commands:
#   rm -rf /                      DENY (destructive pattern)
#   sudo *                        DENY (privilege escalation)
#   (all other commands)          ALLOW
#
# 12 rules active.`}
      />

      <NoteBlock type="info" title="Policy Enforcement Is Transparent">
        <p>
          When a command is allowed, it executes normally with no visible overhead. When a command
          is denied, OpenShell prints a clear error message explaining which rule was violated.
          You can also run <code>openshell audit</code> to see a log of all policy evaluations
          for your session, including both allowed and denied actions.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Testing Policy Boundaries
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        It is valuable to test the policy boundaries on first connection to understand what is
        and is not allowed. Try these commands to see how the default policy responds.
      </p>

      <CodeBlock
        title="Test allowed and denied operations"
        language="bash"
        code={`# ALLOWED: Read files in your workspace
echo "Hello NemoClaw" > /home/agent/workspace/test.txt
cat /home/agent/workspace/test.txt
# Hello NemoClaw

# ALLOWED: Write to /tmp
echo "temp data" > /tmp/test.txt
cat /tmp/test.txt

# DENIED: Write outside allowed directories
echo "test" > /etc/test.txt
# Error: Policy violation - filesystem.write.deny: /etc/test.txt

# DENIED: Read sensitive files
cat /etc/shadow
# Error: Policy violation - filesystem.read.deny: /etc/shadow

# DENIED: Privilege escalation
sudo apt install something
# Error: Policy violation - command.deny: sudo

# ALLOWED: Network access to HTTPS
curl -s https://httpbin.org/ip
# Returns your IP

# DENIED: Network access to non-standard ports
curl http://example.com:8888
# Error: Policy violation - network.outbound.deny: port 8888`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Multiple Connections
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        You can open multiple simultaneous connections to the same sandbox. Each connection gets
        its own OpenShell session but shares the same filesystem and policy. This is useful for
        running a process in one terminal while monitoring it in another.
      </p>

      <CodeBlock
        title="Multiple connections"
        language="bash"
        code={`# Terminal 1: Connect and start a long-running process
nemoclaw my-sandbox connect
# Inside sandbox:
python3 -m http.server 8080

# Terminal 2: Connect and test the process
nemoclaw my-sandbox connect
# Inside sandbox:
curl http://localhost:8080

# You can also run non-interactive commands without connecting:
nemoclaw my-sandbox exec -- curl http://localhost:8080`}
      />

      <StepBlock
        title="Disconnect from the sandbox"
        steps={[
          {
            title: 'Exit the OpenShell session',
            content: 'Type exit or press Ctrl+D to disconnect. The sandbox continues running.',
            code: `exit
# Or press Ctrl+D

# The sandbox keeps running after you disconnect:
nemoclaw my-sandbox status
# Status: running`,
          },
        ]}
      />

      <NoteBlock type="tip" title="Sandbox Persists After Disconnect">
        <p>
          Disconnecting from a sandbox does not stop it. The sandbox continues running, and any
          processes you started remain active. To stop a sandbox, use <code>nemoclaw my-sandbox stop</code>.
          To reconnect, use <code>nemoclaw my-sandbox connect</code> again.
        </p>
      </NoteBlock>
    </div>
  )
}
