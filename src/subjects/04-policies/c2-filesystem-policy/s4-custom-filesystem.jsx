import { NoteBlock, CodeBlock, StepBlock, WarningBlock } from '../../../components/content'

export default function CustomFilesystem() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Custom Filesystem Rules
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The default filesystem policy provides read-write access to /sandbox and /tmp, read-only
        access to essential system directories, and blocks everything else. For many agent
        deployments, this is sufficient. But there are legitimate use cases where an agent needs
        access to additional paths -- a project directory mounted at a non-standard location, a
        shared data volume, or a specific log directory where the agent needs to write output.
        NemoClaw allows operators to define custom filesystem rules to accommodate these needs.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When You Need Additional Paths
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Before adding custom filesystem rules, carefully evaluate whether the additional access
        is truly necessary. Common scenarios that require custom rules include:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Multiple project directories:</span> If your agent
          needs to work across multiple codebases simultaneously, you may need to mount
          additional directories beyond /sandbox.
        </li>
        <li>
          <span className="font-semibold">Shared data volumes:</span> Agents that process
          datasets or read from shared storage may need read access to mounted data volumes.
        </li>
        <li>
          <span className="font-semibold">Custom log destinations:</span> Some monitoring or
          logging configurations write to paths outside /sandbox and /tmp.
        </li>
        <li>
          <span className="font-semibold">Language-specific caches:</span> Some package
          managers or build tools use cache directories outside /tmp (for example, a custom
          pip cache or a cargo registry cache).
        </li>
        <li>
          <span className="font-semibold">Mounted secrets:</span> In some deployments,
          credentials or configuration files are mounted at specific paths that the agent
          needs to read.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Defining Custom Rules in the Blueprint
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Custom filesystem rules are defined in the NemoClaw blueprint configuration. The
        filesystem policy section allows you to specify additional paths with their access
        levels.
      </p>

      <CodeBlock
        language="yaml"
        title="nemoclaw-blueprint/policies/filesystem.yaml"
        code={`version: "1.0"
kind: filesystem-policy
metadata:
  name: custom-filesystem
  description: Extended filesystem policy with custom paths

# Default zones (always applied)
defaults:
  readwrite:
    - /sandbox
    - /tmp
  readonly:
    - /usr
    - /lib
    - /proc
    - /app
    - /etc
    - /var/log
  write_only:
    - /dev/null

# Custom additional rules
custom:
  readwrite:
    - /data/project-alpha
    - /data/project-beta
    - /var/cache/pip
  readonly:
    - /mnt/shared-datasets
    - /opt/models`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The custom section follows the same structure as the defaults. You specify paths under
        either{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">readwrite</code>{' '}
        or{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">readonly</code>{' '}
        depending on the access level needed. Custom rules are merged with the default rules
        during sandbox initialization.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Step-by-Step: Adding a Custom Path
      </h2>

      <StepBlock
        title="Adding a shared data directory"
        steps={[
          {
            title: 'Identify the path needed',
            content: 'Determine the exact path the agent needs to access and the required access level (read-only or read-write). Be as specific as possible -- grant access to the narrowest path that satisfies the need.',
          },
          {
            title: 'Edit the filesystem policy YAML',
            content: 'Add the path to the appropriate section in your filesystem policy file.',
            code: `# Add to nemoclaw-blueprint/policies/filesystem.yaml
custom:
  readonly:
    - /mnt/datasets/training-data`,
            language: 'yaml',
          },
          {
            title: 'Ensure the path exists and is mounted',
            content: 'If the path refers to a volume that needs to be mounted into the sandbox container, configure the mount in your blueprint. The path must exist inside the sandbox at initialization time.',
            code: `# In your blueprint configuration, add the mount:
mounts:
  - source: /host/path/to/datasets
    target: /mnt/datasets/training-data
    readonly: true`,
            language: 'yaml',
          },
          {
            title: 'Run nemoclaw onboard to apply changes',
            content: 'Reinitialize the sandbox to pick up the new filesystem rules. The Landlock ruleset will be regenerated with your custom paths included.',
            code: 'nemoclaw onboard',
          },
          {
            title: 'Verify access from inside the sandbox',
            content: 'Test that the agent can access the new path as expected.',
            code: `# Inside the sandbox, verify read access:
ls /mnt/datasets/training-data/

# Verify write is blocked (for readonly paths):
touch /mnt/datasets/training-data/test.txt
# Should return: Permission denied`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Example: Mounting Project Directories
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A common use case is giving the agent access to multiple project directories. By default,
        only /sandbox is available. If your agent needs to reference code from another project
        (for example, to check shared library versions or copy configuration patterns), you can
        mount additional directories as read-only.
      </p>

      <CodeBlock
        language="yaml"
        title="Multiple project directories"
        code={`# Mount a reference project as read-only
mounts:
  - source: ~/shared-libs
    target: /reference/shared-libs
    readonly: true

# Grant filesystem access
custom:
  readonly:
    - /reference/shared-libs`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Example: Granting Write Access to Specific Logs
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If your agent runs a process that writes logs to a specific directory, you may need
        to grant write access to that path. Be precise -- grant access only to the exact
        log directory, not to a broader parent path.
      </p>

      <CodeBlock
        language="yaml"
        title="Writable log directory"
        code={`custom:
  readwrite:
    - /var/log/agent-output

# NOT this -- too broad:
# readwrite:
#   - /var/log    # Would allow writing to ALL system logs`}
      />

      <WarningBlock title="Be Specific with Custom Paths">
        <p>
          Every additional writable path increases the agent's ability to persist data and
          potentially cause harm. Never grant write access to broad system directories. Use
          the narrowest path possible. Instead of making /var/log writable, make
          /var/log/agent-output writable. Instead of making /data writable, make
          /data/project-alpha writable. The principle of least privilege applies doubly to
          filesystem write access.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Validation and Error Handling
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw validates custom filesystem rules during the onboard process. Several checks
        are performed:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          Paths must be absolute (starting with /). Relative paths are rejected.
        </li>
        <li>
          Paths must not overlap with blocked system paths. You cannot grant access to
          /root, /sys, or /boot through custom rules.
        </li>
        <li>
          Paths must exist at sandbox initialization time. If a path does not exist,
          NemoClaw warns you but does not necessarily fail -- the rule simply has no effect.
        </li>
        <li>
          Custom rules cannot weaken default protections. You cannot make /etc writable
          by adding it to a custom readwrite list.
        </li>
      </ul>

      <NoteBlock type="tip" title="Document Your Custom Rules">
        <p>
          Whenever you add custom filesystem rules, document why each path is needed and
          what access level is granted. This documentation is invaluable during security
          reviews and when onboarding new team members. Consider adding comments directly
          in the YAML file explaining the justification for each custom path.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Custom filesystem rules give you the flexibility to adapt NemoClaw's default policy
        to your specific deployment needs while maintaining the fundamental principle of
        least privilege. In the next chapter, we will move from filesystem policy to the
        mechanisms for modifying and managing policies over time -- both statically through
        YAML changes and dynamically through runtime commands.
      </p>
    </div>
  )
}
