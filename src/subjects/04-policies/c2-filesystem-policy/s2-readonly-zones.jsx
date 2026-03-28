import { NoteBlock, ComparisonTable, CodeBlock } from '../../../components/content'

export default function ReadOnlyZones() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Read-Only Zones
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond the three read-write zones (/sandbox, /tmp, and /dev/null), the agent has read-only
        access to several system directories. These paths contain the binaries, libraries,
        configuration files, and runtime data that the agent's tools and processes need to
        function. The agent can read from these locations but cannot modify, create, or delete
        files within them.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        /usr -- System Binaries and Shared Resources
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/usr</code>{' '}
        directory contains the majority of user-space programs, libraries, and shared data
        installed in the sandbox environment. This includes essential tools like{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">git</code>,{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">node</code>,{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">python</code>,{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">npm</code>,
        and other development utilities. The agent needs to execute these binaries to perform
        its work. Read-only access ensures the agent can run these tools but cannot replace
        them with modified versions -- a critical protection against supply-chain attacks and
        binary tampering.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        /lib -- Shared Libraries
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/lib</code>{' '}
        directory (and its 64-bit counterpart{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/lib64</code>{' '}
        on some systems) contains shared libraries (.so files) that programs link against at
        runtime. Every dynamically linked program in the sandbox depends on libraries here --
        the C standard library (libc), the dynamic linker, SSL/TLS libraries, and many others.
        Without read access, no dynamically linked program could start. Without write protection,
        an attacker could replace a shared library and compromise every program that loads it.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        /proc -- Process Information Filesystem
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/proc</code>{' '}
        filesystem is a virtual filesystem provided by the Linux kernel that exposes process
        and system information. Many tools rely on{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/proc</code>{' '}
        for basic operations: checking the number of CPUs, reading memory information, examining
        process status, and querying kernel parameters. Language runtimes like Node.js and Python
        read from{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/proc</code>{' '}
        during startup to configure thread pools, memory limits, and other runtime behavior.
      </p>

      <NoteBlock type="info" title="Filtered /proc Access">
        <p>
          While /proc is readable, the sandbox environment may filter certain sensitive entries.
          Not all /proc data is necessarily exposed. The specific filtering depends on the
          container runtime and namespace configuration. For example, /proc/kcore and other
          kernel memory interfaces may be blocked even for read access. The goal is to provide
          enough /proc visibility for standard tools to function while limiting information
          disclosure about the host system.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        /app -- Application Code
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/app</code>{' '}
        directory contains the OpenClaw sandbox application code and its dependencies. This is
        the runtime environment that manages the agent's session, handles communication with the
        control plane, and orchestrates tool execution. The agent can read this code (which may
        be useful for debugging or understanding the runtime environment) but cannot modify it.
        This prevents the agent from tampering with its own containment infrastructure.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        /etc -- System Configuration
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/etc</code>{' '}
        directory contains system configuration files. The agent needs to read files like{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/etc/resolv.conf</code>{' '}
        (DNS configuration),{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/etc/hosts</code>{' '}
        (hostname mappings),{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/etc/ssl/certs</code>{' '}
        (CA certificates for TLS validation), and{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/etc/passwd</code>{' '}
        (user information, read by many standard library functions). Write access is denied to
        prevent the agent from modifying DNS resolution, injecting CA certificates, or altering
        system behavior.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        /var/log -- System Logs
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/var/log</code>{' '}
        directory provides read-only access to system logs. This is useful for debugging --
        if a process within the sandbox fails, the agent can read log files to diagnose the
        issue. Read-only access ensures the agent cannot tamper with logs, which is important
        for maintaining audit integrity. The agent cannot delete or modify log entries to
        cover its tracks.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What Is Blocked Entirely
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Paths not explicitly granted read or read-write access are entirely inaccessible. The
        agent cannot read or write to them. Notable blocked paths include:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">/root:</span> The root user's home directory.
          Contains no useful data for the agent and is a common target for privilege
          escalation attacks.
        </li>
        <li>
          <span className="font-semibold">/sys:</span> The sysfs virtual filesystem that
          exposes kernel objects and hardware information. Provides too much system
          information and potential control interfaces.
        </li>
        <li>
          <span className="font-semibold">/boot:</span> Contains the kernel image and
          bootloader configuration. No agent operation requires access to boot files.
        </li>
        <li>
          <span className="font-semibold">/dev (except /dev/null):</span> Device files
          provide direct access to hardware and kernel interfaces. Blocking device access
          prevents the agent from interacting with raw disks, terminals, or other hardware.
        </li>
        <li>
          <span className="font-semibold">Other /var subdirectories:</span> Paths like
          /var/run, /var/spool, and /var/cache are blocked to prevent the agent from
          interfering with system services.
        </li>
      </ul>

      <ComparisonTable
        title="Filesystem Access Summary"
        headers={['Path', 'Access Level', 'Justification']}
        rows={[
          ['/sandbox', 'Read-Write', 'Agent workspace, mapped to host project directory'],
          ['/tmp', 'Read-Write', 'Temporary file storage for tools and build processes'],
          ['/dev/null', 'Write', 'Standard output discard device'],
          ['/usr', 'Read-Only', 'System binaries and development tools'],
          ['/lib', 'Read-Only', 'Shared libraries required by all programs'],
          ['/proc', 'Read-Only', 'Process and system info for runtime configuration'],
          ['/app', 'Read-Only', 'OpenClaw sandbox application code'],
          ['/etc', 'Read-Only', 'System configuration (DNS, certificates, etc.)'],
          ['/var/log', 'Read-Only', 'System logs for debugging'],
          ['/root, /sys, /boot', 'No Access', 'No legitimate agent need, high security risk'],
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This layered filesystem policy -- read-write for workspace, read-only for system
        resources, no access for sensitive paths -- creates a strong containment boundary
        while preserving the agent's ability to do productive work. In the next section,
        we will examine how this policy is enforced at the kernel level through Linux's
        Landlock security module.
      </p>
    </div>
  )
}
