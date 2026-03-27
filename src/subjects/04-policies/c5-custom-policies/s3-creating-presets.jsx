import { NoteBlock, CodeBlock, StepBlock } from '../../../components/content'

export default function CreatingPresets() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Creating Custom Policy Presets
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's built-in presets cover common services like Slack, Docker, and PyPI. But
        your organization likely has its own set of internal services, third-party integrations,
        and custom APIs that agents need to access. Custom presets let you package these
        endpoint configurations into reusable, shareable units that any team member can
        apply with a single command.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What Is a Custom Preset
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A custom preset is simply a YAML file that follows the standard network policy schema,
        stored in a specific location where NemoClaw can discover it. Presets are designed to
        be self-contained -- each preset file contains all the endpoints needed for a
        particular service or integration, along with metadata that describes its purpose.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        File Format and Structure
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Custom presets use the same YAML format as regular network policies. The key difference
        is where they are stored and how they are named.
      </p>

      <CodeBlock
        language="yaml"
        title="Example custom preset: internal-api.yaml"
        code={`version: "1.0"
kind: network-policy
metadata:
  name: internal-api
  description: >
    Internal API gateway and authentication service.
    Required for agents that interact with company
    internal systems.

groups:
  internal_api:
    endpoints:
      - domain: "api.internal.mycompany.com"
        port: 443
        tls: required
      - domain: "auth.internal.mycompany.com"
        port: 443
        tls: required
      - domain: "gateway.internal.mycompany.com"
        port: 443
        tls: required`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Creating a Preset Step by Step
      </h2>

      <StepBlock
        title="Creating and registering a custom preset"
        steps={[
          {
            title: 'Create the presets directory',
            content: 'Custom presets are stored in the presets subdirectory of your nemoclaw-blueprint. Create it if it does not exist.',
            code: 'mkdir -p nemoclaw-blueprint/presets',
          },
          {
            title: 'Create the preset YAML file',
            content: 'Name the file after the preset identifier. The filename (without .yaml extension) becomes the preset name used in CLI commands.',
            code: `cat > nemoclaw-blueprint/presets/internal-api.yaml << 'EOF'
version: "1.0"
kind: network-policy
metadata:
  name: internal-api
  description: >
    Company internal API gateway and authentication.
    Includes the API gateway, auth service, and
    event bus endpoints.

groups:
  internal_api:
    endpoints:
      - domain: "api.internal.mycompany.com"
        port: 443
        tls: required
      - domain: "auth.internal.mycompany.com"
        port: 443
        tls: required
      - domain: "events.internal.mycompany.com"
        port: 443
        tls: required
EOF`,
          },
          {
            title: 'Validate the preset',
            content: 'Use NemoClaw\'s validation to check the preset before sharing it with the team.',
            code: `# Validate the preset
nemoclaw presets validate nemoclaw-blueprint/presets/internal-api.yaml

# Output:
# Preset 'internal-api' validated successfully
# Groups: 1
# Endpoints: 3`,
          },
          {
            title: 'Test the preset',
            content: 'Apply the preset to a test sandbox to verify all endpoints work correctly.',
            code: `# Apply to your sandbox
nemoclaw my-sandbox policy-add internal-api

# Test connectivity
curl -s https://api.internal.mycompany.com/health
# Should return a successful response`,
          },
          {
            title: 'Commit and share',
            content: 'Commit the preset to version control so other team members can use it.',
            code: `cd nemoclaw-blueprint
git add presets/internal-api.yaml
git commit -m "Add internal-api preset for company API gateway"`,
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Naming Conventions
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Good preset names are concise, descriptive, and consistent. Follow these conventions:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Use lowercase with hyphens:</span> For example,{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            internal-api
          </code>,{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            data-warehouse
          </code>,{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            monitoring-stack
          </code>. The filename should match the metadata.name.
        </li>
        <li>
          <span className="font-semibold">Name after the service, not the use case:</span> Use{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            datadog
          </code>{' '}
          rather than{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
            monitoring
          </code>. Service names are unambiguous; use cases may overlap.
        </li>
        <li>
          <span className="font-semibold">Avoid version numbers in names:</span> If the
          endpoint changes, update the preset file rather than creating a new preset.
        </li>
        <li>
          <span className="font-semibold">Keep group names consistent:</span> The group name
          inside the preset should match the preset name (with underscores instead of
          hyphens, since group names do not allow hyphens).
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Preset directory structure"
        code={`nemoclaw-blueprint/
  policies/
    openclaw-sandbox.yaml       # Baseline policy
    filesystem.yaml             # Filesystem policy
  presets/
    internal-api.yaml           # Custom: company API
    data-warehouse.yaml         # Custom: analytics DB
    ml-platform.yaml            # Custom: ML model serving
    # Built-in presets are bundled with NemoClaw
    # and do not appear here`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Sharing Presets Across Teams
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Since presets are plain YAML files in a Git repository, sharing them is natural.
        Several approaches work well:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Shared blueprint repository:</span> Maintain a
          central nemoclaw-blueprint repository that all teams fork or reference. Custom
          presets in the presets directory are available to everyone who uses the blueprint.
        </li>
        <li>
          <span className="font-semibold">ClawHub distribution:</span> Publish presets to
          ClawHub for broader distribution. This is appropriate for presets that are useful
          beyond your organization, such as presets for popular services.
        </li>
        <li>
          <span className="font-semibold">Copy-paste:</span> For small teams, simply copying
          a YAML file into another project's presets directory works fine. The file is
          self-contained with no external dependencies.
        </li>
      </ul>

      <NoteBlock type="info" title="Preset Versioning">
        <p>
          When a service adds or changes domains (which happens occasionally during
          infrastructure migrations), update the preset file and commit the change. Teams
          that pull the updated blueprint will get the new endpoints on their next{' '}
          <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-sm font-mono">
            nemoclaw onboard
          </code>
          . For critical endpoint changes, communicate the update through your team's normal
          change announcement channels.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Multi-Group Presets
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A single preset can contain multiple groups. This is useful for services that have
        logically distinct components that are always used together.
      </p>

      <CodeBlock
        language="yaml"
        title="Multi-group preset example"
        code={`version: "1.0"
kind: network-policy
metadata:
  name: ml-platform
  description: ML platform with model registry and inference endpoints

groups:
  ml_registry:
    endpoints:
      - domain: "models.internal.mycompany.com"
        port: 443
        tls: required
      - domain: "registry.ml.mycompany.com"
        port: 443
        tls: required

  ml_inference:
    endpoints:
      - domain: "inference.ml.mycompany.com"
        port: 443
        tls: required
      - domain: "gpu-cluster.ml.mycompany.com"
        port: 443
        tls: required`}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will cover how to test policies before deploying them,
        including dry-run mode and monitoring approaches that help you verify policy
        correctness without risking production workloads.
      </p>
    </div>
  )
}
