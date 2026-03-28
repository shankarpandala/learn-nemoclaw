import { CodeBlock, NoteBlock, StepBlock, WarningBlock, ComparisonTable, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function Updating() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Updating NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw is actively developed, with regular updates that include security patches, new
        features, performance improvements, and updated blueprint images. Keeping NemoClaw up to
        date is important both for security (new policy capabilities, vulnerability fixes) and
        functionality (new CLI commands, improved OpenShell features). This section covers how
        to update each component, handle blueprint updates, manage breaking changes, and roll
        back if needed.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Update Components Overview
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw has three independently versioned components that can be updated separately:
      </p>

      <ComparisonTable
        title="NemoClaw Update Components"
        headers={['Component', 'What It Is', 'Update Command']}
        rows={[
          ['CLI', 'The nemoclaw command-line tool on your host', 'curl install script or nemoclaw self-update'],
          ['Blueprint', 'The base sandbox image (OS, OpenShell, tools)', 'nemoclaw blueprint update'],
          ['Sandbox', 'A running sandbox instance', 'nemoclaw <name> rebuild (creates new from updated blueprint)'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Updating the CLI
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NemoClaw CLI can update itself in place. This updates the CLI binary and its Node.js
        dependencies without affecting any running sandboxes.
      </p>

      <StepBlock
        title="Update the NemoClaw CLI"
        steps={[
          {
            title: 'Check your current version',
            content: 'See what version you are running and what is available.',
            code: `nemoclaw --version
# nemoclaw v2.3.1

nemoclaw self-update --check
# Current: v2.3.1
# Latest:  v2.4.0
# Update available!`,
          },
          {
            title: 'Run the self-update',
            content: 'Download and install the latest CLI version.',
            code: `nemoclaw self-update

# Output:
# Downloading nemoclaw v2.4.0...
# Verifying checksum... OK
# Installing... OK
# Updated: v2.3.1 -> v2.4.0
#
# Release notes: https://github.com/nvidia/nemoclaw/releases/v2.4.0`,
          },
          {
            title: 'Verify the update',
            content: 'Confirm the new version is installed.',
            code: `nemoclaw --version
# nemoclaw v2.4.0`,
          },
        ]}
      />

      <NoteBlock type="info" title="Alternative: Re-run the Install Script">
        <p>
          If <code>nemoclaw self-update</code> fails (e.g., due to permission issues), you can
          always re-run the original install script. It detects the existing installation and
          upgrades it: <code>curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash</code>
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Updating Blueprints
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Blueprint updates bring new versions of the sandbox base image, including updated OpenShell
        versions, security patches, and pre-installed tool updates. Blueprint updates do not
        automatically affect existing sandboxes -- they only affect newly created sandboxes.
      </p>

      <StepBlock
        title="Update the blueprint"
        steps={[
          {
            title: 'Check for blueprint updates',
            content: 'See what blueprint versions are available.',
            code: `nemoclaw blueprint list

# BLUEPRINT              VERSION    SIZE       RELEASED
# nemoclaw-base:latest   v2.4.0     2.4 GB     2026-03-25
# nemoclaw-base:v2.3.0   v2.3.0     2.3 GB     2026-02-15
# nemoclaw-dgx:latest    v2.4.0     3.1 GB     2026-03-25`,
          },
          {
            title: 'Pull the latest blueprint',
            content: 'Download the updated blueprint image.',
            code: `nemoclaw blueprint update

# Pulling nemoclaw-base:latest...
# [====================>       ] 1.8 GB / 2.4 GB
# Verifying integrity... OK
# Blueprint updated: v2.3.0 -> v2.4.0`,
          },
          {
            title: 'Verify the update',
            content: 'Confirm the new blueprint is available locally.',
            code: `nemoclaw blueprint list --local
# Shows locally cached blueprints with their versions`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Updating Existing Sandboxes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Existing sandboxes are not automatically updated when you pull a new blueprint. To update
        a sandbox, you must rebuild it from the new blueprint. The rebuild process preserves your
        sandbox name, configuration, and policy but replaces the base image.
      </p>

      <WarningBlock title="Rebuild Destroys Sandbox State">
        <p>
          Rebuilding a sandbox creates a new container from the updated blueprint. Any files the
          agent created inside the sandbox (installed packages, generated files, data) will be
          lost unless they are in a persisted volume. Before rebuilding, export any important data:
          <code className="block mt-2">nemoclaw my-sandbox exec -- tar czf /tmp/backup.tar.gz /home/agent/workspace</code>
          <code className="block mt-1">nemoclaw my-sandbox cp /tmp/backup.tar.gz ./backup.tar.gz</code>
        </p>
      </WarningBlock>

      <StepBlock
        title="Rebuild a sandbox with the updated blueprint"
        steps={[
          {
            title: 'Back up important data',
            content: 'Export any files from the sandbox you want to preserve.',
            code: `# Copy workspace files out of the sandbox
nemoclaw my-sandbox cp /home/agent/workspace/ ./workspace-backup/`,
          },
          {
            title: 'Rebuild the sandbox',
            content: 'This stops the sandbox, creates a new container from the updated blueprint, and starts it.',
            code: `nemoclaw my-sandbox rebuild

# Output:
# Stopping sandbox "my-sandbox"...
# Creating new container from nemoclaw-base:v2.4.0...
# Applying policy: default
# Starting OpenShell...
# Sandbox "my-sandbox" rebuilt successfully.
# Previous: nemoclaw-base:v2.3.0
# Current:  nemoclaw-base:v2.4.0`,
          },
          {
            title: 'Restore backed-up data',
            content: 'Copy your workspace files back into the rebuilt sandbox.',
            code: `nemoclaw my-sandbox cp ./workspace-backup/ /home/agent/workspace/`,
          },
          {
            title: 'Verify the rebuild',
            content: 'Confirm the sandbox is running with the new blueprint.',
            code: `nemoclaw my-sandbox status
# Blueprint should show the new version`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Handling Breaking Changes
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw follows semantic versioning. Major version updates (e.g., v2.x to v3.x) may
        include breaking changes to CLI commands, policy format, or blueprint structure. Minor
        and patch updates are backward compatible.
      </p>

      <CodeBlock
        title="Check for breaking changes before updating"
        language="bash"
        code={`# View release notes for available updates
nemoclaw self-update --check --verbose

# Output includes breaking change warnings:
# Current: v2.4.0
# Latest:  v3.0.0
#
# !! BREAKING CHANGES in v3.0.0:
# - Policy format v2 is deprecated; migrate to v3 format
# - 'nemoclaw exec' renamed to 'nemoclaw run'
# - Blueprint image registry URL changed
#
# Migration guide: https://docs.nemoclaw.nvidia.com/migrate-v3

# For major updates, read the migration guide before updating
# You can pin to a specific minor version:
nemoclaw self-update --version 2.4.1`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Rollback Procedures
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If an update causes problems, you can roll back both the CLI and blueprints to previous
        versions.
      </p>

      <CodeBlock
        title="Roll back the CLI"
        language="bash"
        code={`# Install a specific CLI version
nemoclaw self-update --version 2.3.1

# Or re-run the install script with a specific version:
curl -fsSL https://www.nvidia.com/nemoclaw.sh | bash -s -- --version 2.3.1

# Verify
nemoclaw --version
# nemoclaw v2.3.1`}
      />

      <CodeBlock
        title="Roll back a blueprint"
        language="bash"
        code={`# Pull a specific blueprint version
nemoclaw blueprint pull nemoclaw-base:v2.3.0

# Rebuild sandbox with the older blueprint
nemoclaw my-sandbox rebuild --blueprint nemoclaw-base:v2.3.0

# Verify
nemoclaw my-sandbox status
# Blueprint: nemoclaw-base:v2.3.0`}
      />

      <NoteBlock type="tip" title="Version Pinning for Production">
        <p>
          In production environments, pin both the CLI version and blueprint version rather than
          using "latest". This prevents unexpected changes when updates are released. Record the
          exact versions in your deployment documentation and update on your own schedule after
          testing in a development environment.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="After updating the NemoClaw blueprint to a new version, what must you do to apply the update to an existing sandbox?"
        options={[
          'Nothing -- sandboxes auto-update when the blueprint is pulled',
          'Run `nemoclaw <name> rebuild` to recreate the sandbox from the new blueprint',
          'Run `nemoclaw <name> restart` to load the new blueprint',
          'Delete the sandbox and run `nemoclaw onboard` again',
        ]}
        correctIndex={1}
        explanation="Existing sandboxes are not automatically updated when a new blueprint is pulled. You must explicitly rebuild the sandbox with `nemoclaw <name> rebuild`, which creates a new container from the updated blueprint while preserving the sandbox name, configuration, and policy. Deleting and re-onboarding works but is unnecessary."
      />

      <ReferenceList
        references={[
          {
            type: 'docs',
            title: 'NemoClaw Release Notes',
            url: 'https://docs.nemoclaw.nvidia.com/releases',
            description: 'Full release notes for all NemoClaw versions, including breaking changes and migration guides.',
          },
          {
            type: 'docs',
            title: 'NemoClaw Blueprint Changelog',
            url: 'https://docs.nemoclaw.nvidia.com/blueprints/changelog',
            description: 'Detailed changelog for blueprint image updates, including OpenShell and tool version changes.',
          },
          {
            type: 'github',
            title: 'NemoClaw GitHub Repository',
            url: 'https://github.com/nvidia/nemoclaw',
            description: 'Source code, issue tracker, and community discussions.',
          },
        ]}
      />
    </div>
  )
}
