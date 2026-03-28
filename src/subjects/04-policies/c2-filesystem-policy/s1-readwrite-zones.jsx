import { NoteBlock, CodeBlock, DefinitionBlock, ComparisonTable } from '../../../components/content'

export default function ReadWriteZones() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Read-Write Zones: /sandbox, /tmp, and /dev/null
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A sandboxed agent needs to write files to do its work. It generates code, creates
        configuration files, writes build artifacts, and manages temporary data. NemoClaw's
        filesystem policy carefully restricts where an agent can write, granting read-write
        access to exactly three locations:{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/sandbox</code>,{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/tmp</code>, and{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/dev/null</code>.
        Everything else on the filesystem is either read-only or entirely inaccessible.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        /sandbox -- The Agent's Home Directory
      </h2>

      <DefinitionBlock
        term="/sandbox"
        definition="The primary working directory for the sandboxed agent. This is the agent's home directory where all project files, cloned repositories, generated code, and build outputs reside. It maps to the user's designated project directory on the host system."
        example="When an agent runs 'git clone', the repository is placed under /sandbox. When it creates files, they appear in /sandbox. The agent's working directory defaults to /sandbox."
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/sandbox</code>{' '}
        directory is the agent's workspace. It is the only location where the agent is expected to
        perform meaningful work. When NemoClaw initializes a sandbox, the operator's project
        directory is mounted at{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/sandbox</code>,
        making the project files available to the agent. Any modifications the agent makes to
        files under{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/sandbox</code>{' '}
        are reflected back to the host filesystem.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This mapping is bidirectional. Files created by the agent under{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/sandbox</code>{' '}
        are visible on the host. Files added to the project directory on the host become visible
        to the agent. This allows operators to stage files for the agent and review the agent's
        output without entering the sandbox.
      </p>

      <CodeBlock
        language="bash"
        title="How /sandbox maps to the host"
        code={`# On the host system:
ls ~/my-project/
# src/  package.json  README.md

# Inside the sandbox, the same files appear at /sandbox:
ls /sandbox/
# src/  package.json  README.md

# The agent's HOME is set to /sandbox:
echo $HOME
# /sandbox`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        /tmp -- Temporary File Storage
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/tmp</code>{' '}
        directory is a standard Unix temporary file location. Many tools, build systems, and
        programming language runtimes expect to be able to write temporary files here. Package
        managers download archives to{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/tmp</code>{' '}
        before extracting them. Compilers write intermediate objects here. Test runners create
        temporary fixtures. Without write access to{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/tmp</code>,
        many common development tools would fail.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Unlike{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/sandbox</code>,
        the{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/tmp</code>{' '}
        directory is not mapped to the host filesystem. Files written here exist only inside the
        sandbox and are discarded when the sandbox session ends. This makes{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/tmp</code>{' '}
        appropriate for ephemeral data that should not persist beyond the current session.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        /dev/null -- The Bit Bucket
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/dev/null</code>{' '}
        device is a standard Unix special file that discards all data written to it. It is
        writable because many shell commands and programs redirect unwanted output to{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/dev/null</code>{' '}
        as a standard practice. Without write access, common patterns like{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          command 2&gt;/dev/null
        </code>{' '}
        would fail, breaking many scripts and tools the agent relies on.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why These Specific Paths
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The choice of read-write paths follows a careful balancing act between functionality
        and security. The agent needs enough write access to perform useful work, but every
        writable path is a potential vector for persistence, privilege escalation, or data
        staging.
      </p>

      <ComparisonTable
        title="Read-Write Zone Justifications"
        headers={['Path', 'Purpose', 'Security Consideration']}
        rows={[
          [
            '/sandbox',
            'Primary workspace for project files and agent output',
            'Mapped to host -- changes are visible and auditable by operator'
          ],
          [
            '/tmp',
            'Temporary files for build tools, compilers, package managers',
            'Ephemeral -- deleted when session ends, not mapped to host'
          ],
          [
            '/dev/null',
            'Standard output discard device for shell operations',
            'No data is actually stored -- writes are discarded by the kernel'
          ],
        ]}
      />

      <NoteBlock type="tip" title="Why Not /home?">
        <p>
          Traditional Unix systems use /home for user directories. NemoClaw uses /sandbox instead
          for several reasons. First, it makes the sandboxed nature of the environment immediately
          obvious -- the agent and the operator both know they are working in a constrained
          environment. Second, it avoids confusion with the host system's /home directory. Third,
          it provides a clean, predictable path that does not depend on username conventions.
          The HOME environment variable inside the sandbox points to /sandbox.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What Happens When an Agent Tries to Write Elsewhere
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If an agent attempts to write to any path outside the three designated read-write zones,
        the operation fails with a permission denied error. The agent receives an{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">EACCES</code>{' '}
        error (or equivalent) from the kernel. This enforcement happens at the kernel level
        through Landlock, which we will discuss in detail in a later section.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This means the agent cannot modify system binaries in{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/usr</code>,
        cannot alter library files in{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/lib</code>,
        cannot modify configuration in{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/etc</code>,
        and cannot tamper with application code in{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">/app</code>.
        The filesystem policy creates a clear boundary: the agent can modify its workspace and
        temporary files, but the rest of the system is immutable from the agent's perspective.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will examine the read-only zones in detail, explaining why each
        path is granted read access and what would break without it.
      </p>
    </div>
  )
}
