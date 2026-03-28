import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock } from '../../../components/content'

export default function DebuggingIsolation() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Debugging Sandbox Isolation Issues
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When a sandboxed NemoClaw agent fails to perform an expected operation, the cause is
        often one of the sandbox isolation mechanisms -- Landlock denying a filesystem operation,
        seccomp blocking a syscall, or the network namespace preventing a connection. These
        failures are by design, but when the denied operation is something the agent legitimately
        needs, you have a debugging problem. The error messages from the agent's perspective are
        typically generic ("Permission denied", "Connection refused", "Operation not permitted")
        and do not indicate which isolation layer caused the denial. This section covers the
        tools and techniques for diagnosing exactly what is being blocked and why.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The Debugging Mindset for Sandboxes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Sandbox debugging is different from regular application debugging because the denial
        happens at the kernel level, below the application. The application sees a generic error
        code (EACCES, EPERM, ECONNREFUSED) but has no visibility into which security mechanism
        produced it. Your debugging workflow should work through the isolation layers
        systematically:
      </p>

      <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>Identify the failed operation (file access, network connection, syscall).</li>
        <li>Check the NemoClaw TUI logs for blocked operations.</li>
        <li>Check kernel audit logs for Landlock and seccomp denials.</li>
        <li>Use strace to observe the exact syscall and its return code.</li>
        <li>Use nsenter to inspect the namespace configuration.</li>
        <li>Verify the policy configuration matches your intent.</li>
      </ol>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Using strace Inside the Sandbox
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        strace is the most powerful tool for diagnosing sandbox issues because it shows you
        exactly which system call failed and what error code was returned. However, using strace
        inside a sandbox requires that the seccomp profile allows the ptrace syscall (which is
        blocked by default). NemoClaw provides a debug mode that relaxes the seccomp profile
        to permit strace.
      </p>

      <CodeBlock
        language="bash"
        title="Running strace inside a NemoClaw sandbox"
      >{`# Start the sandbox in debug mode (allows ptrace for strace)
nemoclaw run --blueprint my-agent --debug \\
  --prompt "Perform the failing task"

# The --debug flag:
# 1. Enables ptrace in the seccomp profile
# 2. Increases log verbosity
# 3. Logs all blocked operations with their source layer

# Alternatively, attach strace to a running sandbox
# First, find the sandbox PID
nemoclaw ps
# PID     BLUEPRINT       STATUS    UPTIME
# 12345   my-agent        running   5m

# Then use nemoclaw's built-in strace wrapper
nemoclaw debug strace 12345 --follow-forks
# This enters the sandbox's namespaces and runs strace on the agent process

# Filter strace output for relevant syscalls
nemoclaw debug strace 12345 -e trace=open,openat,access,connect,bind 2>&1 | grep EACCES`}</CodeBlock>

      <StepBlock number={1} title="Diagnosing a filesystem access denial">
        <CodeBlock language="bash">{`# The agent reports "Permission denied" when trying to read a file

# Step 1: Check what the agent is trying to access
nemoclaw debug strace 12345 -e trace=openat,access 2>&1 | grep -i deny

# Example output:
# openat(AT_FDCWD, "/workspace/config/.env", O_RDONLY) = -1 EACCES (Permission denied)

# Step 2: Check if Landlock is the cause
# Look in kernel audit log
dmesg | grep -i landlock
# Or check journald
journalctl -k --since "5 minutes ago" | grep -i landlock

# Step 3: Check the filesystem policy
nemoclaw blueprint inspect my-agent --show-policies | grep -A5 filesystem
# Reveals that /workspace/config is not in the allowed paths

# Step 4: Fix by adding the path to the filesystem policy
# Edit policies/filesystem.yaml to add:
#   - path: "/workspace/config"
#     access: read
#     recursive: true`}</CodeBlock>
      </StepBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Using nsenter to Inspect Namespaces
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        nsenter allows you to enter a running sandbox's namespaces from the host, giving you
        a shell that sees the same network configuration, mount points, and process list as
        the sandboxed agent. This is invaluable for debugging network issues because you can
        run standard networking tools from within the sandbox's namespace.
      </p>

      <CodeBlock
        language="bash"
        title="Entering a sandbox namespace for debugging"
      >{`# Find the sandbox's init PID
SANDBOX_PID=$(nemoclaw ps --format json | jq -r '.[] | select(.blueprint=="my-agent") | .pid')

# Enter all namespaces of the sandbox
sudo nsenter --target $SANDBOX_PID --all

# Now you are inside the sandbox's namespaces.
# Check network configuration:
ip addr show         # See the sandbox's network interfaces
ip route show        # See the routing table
cat /etc/resolv.conf # See DNS configuration

# Test connectivity to an endpoint
curl -v https://api.github.com/status
# If this fails, the network policy is blocking it

# Check iptables rules (from the host side, not inside nsenter)
# Exit nsenter first, then:
sudo iptables -L -v -n --line-numbers | grep $SANDBOX_PID

# Or use NemoClaw's network debug command
nemoclaw debug network 12345
# Shows: interfaces, routes, iptables rules, DNS config, active connections`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Checking Landlock Status
      </h2>

      <CodeBlock
        language="bash"
        title="Inspecting Landlock restrictions on a process"
      >{`# Check if Landlock is active for a process
cat /proc/$SANDBOX_PID/attr/current 2>/dev/null

# Check the Landlock ABI version available
cat /sys/kernel/security/landlock/abi-version

# NemoClaw provides a detailed Landlock report
nemoclaw debug landlock 12345
# Output:
# Landlock status: ACTIVE
# Ruleset layers: 2
# Layer 1 (base):
#   Handled access: READ_FILE, WRITE_FILE, READ_DIR, MAKE_REG, ...
#   Rules: 12 paths
# Layer 2 (blueprint):
#   Handled access: READ_FILE, READ_DIR
#   Rules: 3 paths
#
# Effective readable paths:
#   /workspace/src (recursive)
#   /usr/lib (recursive)
#   /tmp (recursive)
#
# Effective writable paths:
#   /workspace/output (recursive)
#   /tmp (recursive)

# Test a specific path access
nemoclaw debug landlock 12345 --test-path /workspace/config/.env --access read
# Output: DENIED (not covered by any Landlock rule)`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Diagnosing Seccomp Violations
      </h2>

      <CodeBlock
        language="bash"
        title="Finding seccomp-blocked syscalls"
      >{`# Seccomp violations are logged to the kernel audit log
# when the profile uses SCMP_ACT_LOG or SCMP_ACT_ERRNO with audit

# Check for recent seccomp events
dmesg | grep -i seccomp
# Example output:
# audit: type=1326 audit(1234567890.123:456): auid=1000 uid=1000
#   gid=1000 ses=1 pid=12345 comm="python3" exe="/usr/bin/python3"
#   sig=0 arch=c000003e syscall=101 compat=0 ip=0x7f... code=0x50000

# Decode the syscall number
# syscall=101 on x86_64 is ptrace
python3 -c "import os; print(os.strerror(1))"  # EPERM

# Use ausearch for structured audit log queries
sudo ausearch -m SECCOMP --start recent
# Shows structured seccomp audit events with process, syscall, and result

# NemoClaw's seccomp debug command decodes everything for you
nemoclaw debug seccomp 12345
# Output:
# Seccomp profile: custom (policies/seccomp-profile.json)
# Recent denials:
#   2026-03-27 14:30:15  ptrace (syscall 101)  by python3  -> ERRNO
#   2026-03-27 14:30:16  clone3 (syscall 435)  by bash     -> ERRNO
#
# Suggestion: If these syscalls are needed, add them to your
# custom seccomp profile in the SCMP_ACT_ALLOW list.`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Network Connectivity Troubleshooting
      </h2>

      <StepBlock number={2} title="Systematic network debugging">
        <CodeBlock language="bash">{`# Step 1: Check if DNS resolution works inside the sandbox
nemoclaw debug exec 12345 -- nslookup api.github.com
# If this fails: DNS is not configured or blocked

# Step 2: Check if the destination IP is reachable
nemoclaw debug exec 12345 -- ping -c 1 -W 2 140.82.121.6
# If this fails: routing or iptables is blocking

# Step 3: Check if the specific port is reachable
nemoclaw debug exec 12345 -- nc -zv api.github.com 443
# If this fails: iptables is blocking the port

# Step 4: Check the actual iptables rules for this sandbox
nemoclaw debug network 12345 --show-rules
# Shows the iptables chain specific to this sandbox

# Step 5: Check if TLS works
nemoclaw debug exec 12345 -- openssl s_client -connect api.github.com:443 -brief
# If connection succeeds but agent fails: likely a certificate or
# proxy issue rather than a network policy issue

# Common issues:
# - DNS resolution blocked (add DNS server to network config)
# - Wrong port in policy (443 vs 8443)
# - TLS required but endpoint is HTTP
# - Domain resolves to a different IP than expected (CDN/load balancer)
# - Timeout too short for slow connections`}</CodeBlock>
      </StepBlock>

      <WarningBlock title="Debug Mode Weakens Security">
        <p>
          The --debug flag relaxes seccomp restrictions to allow debugging tools like strace
          and gdb. Never use debug mode in production. It should only be used during development
          and testing to diagnose sandbox configuration issues. Once you have identified the
          problem, fix the policy configuration and test again without debug mode to confirm
          the fix works with full security enforced.
        </p>
      </WarningBlock>

      <NoteBlock type="info" title="The NemoClaw Debug Dashboard">
        <p>
          NemoClaw's TUI includes a debug panel (toggle with Ctrl+D) that shows real-time
          information about blocked operations across all isolation layers. When an operation
          is denied, the debug panel shows which layer (Landlock, seccomp, or network) blocked
          it, the specific rule that triggered the denial, and a suggestion for how to modify
          the policy if the operation should be allowed. This is often the fastest path to
          diagnosis without needing to drop to command-line tools.
        </p>
      </NoteBlock>

      <ExerciseBlock
        title="Debug a Broken Sandbox Configuration"
        difficulty="advanced"
      >
        <ol className="list-decimal list-inside space-y-2 mt-2">
          <li>Create a blueprint with intentionally restrictive policies (deny all network, minimal filesystem).</li>
          <li>Run an agent with a task that requires network and filesystem access.</li>
          <li>Observe the failures in the TUI debug panel.</li>
          <li>Use strace (via --debug mode) to identify the exact blocked operations.</li>
          <li>Use nsenter to inspect the namespace configuration.</li>
          <li>Iteratively fix the policies until the agent can complete its task.</li>
          <li>Remove --debug and confirm everything works with full security enforced.</li>
        </ol>
      </ExerciseBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Effective debugging of sandbox isolation requires understanding all three security
        layers (Landlock, seccomp, network namespaces) and knowing which tools to use for each.
        With the techniques in this section, you can diagnose any sandbox issue and determine
        whether to fix the policy (if the agent legitimately needs the access) or fix the
        agent (if it is requesting access it should not need).
      </p>
    </div>
  )
}
