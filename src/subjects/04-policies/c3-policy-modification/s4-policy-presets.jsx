import { NoteBlock, CodeBlock, ComparisonTable } from '../../../components/content'

export default function PolicyPresets() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Policy Presets
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Manually identifying every endpoint a service requires, looking up the exact domain
        names, and adding them to your YAML one by one is tedious and error-prone. Policy
        presets solve this problem by packaging all the endpoints needed for a specific service
        into a reusable, pre-built configuration that can be applied with a single command.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Built-In Presets
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw ships with built-in presets for common services that agents frequently need
        to integrate with. Each preset has been curated to include exactly the endpoints
        required for the service to function, without granting unnecessary access.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">discord:</span> Adds endpoints for Discord bot
          integration -- discord.com, discordapp.com, and the Discord API and CDN domains.
          Enables agents to send messages, read channels, and manage Discord communities.
        </li>
        <li>
          <span className="font-semibold">docker:</span> Adds Docker Hub registry endpoints
          for pulling and pushing container images. Includes registry-1.docker.io,
          auth.docker.io, and production.cloudflare.docker.com.
        </li>
        <li>
          <span className="font-semibold">huggingface:</span> Adds HuggingFace endpoints
          for model downloads, dataset access, and API inference. Includes huggingface.co
          and its CDN and API subdomains.
        </li>
        <li>
          <span className="font-semibold">jira:</span> Adds Atlassian Jira endpoints for
          issue tracking integration. Includes the Atlassian API domain and Jira cloud
          endpoints.
        </li>
        <li>
          <span className="font-semibold">npm:</span> Adds the npm registry endpoint. This
          is the same as the default npm_registry group but can be applied independently if
          you removed it from the baseline.
        </li>
        <li>
          <span className="font-semibold">outlook:</span> Adds Microsoft Outlook and Graph
          API endpoints for email integration. Includes graph.microsoft.com and
          login.microsoftonline.com for OAuth.
        </li>
        <li>
          <span className="font-semibold">pypi:</span> Adds the Python Package Index endpoints
          for pip install operations. Includes pypi.org and files.pythonhosted.org.
        </li>
        <li>
          <span className="font-semibold">slack:</span> Adds Slack API and CDN endpoints for
          workspace integration. Includes slack.com, api.slack.com, and files.slack.com.
        </li>
        <li>
          <span className="font-semibold">telegram:</span> Adds the Telegram Bot API endpoint.
          Similar to the default telegram group but available as an independent preset.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Applying Presets
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Presets are applied using the{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          nemoclaw &lt;name&gt; policy-add &lt;preset&gt;
        </code>{' '}
        command, where{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          &lt;name&gt;
        </code>{' '}
        is your sandbox name and{' '}
        <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
          &lt;preset&gt;
        </code>{' '}
        is the preset identifier.
      </p>

      <CodeBlock
        language="bash"
        title="Applying a policy preset"
        code={`# Add the Slack preset to your sandbox
nemoclaw my-sandbox policy-add slack

# Output:
# Adding preset 'slack' to sandbox 'my-sandbox'
# Added 3 endpoints:
#   slack.com:443
#   api.slack.com:443
#   files.slack.com:443
# Policy updated. Changes are persistent (added to baseline).

# Add multiple presets
nemoclaw my-sandbox policy-add pypi
nemoclaw my-sandbox policy-add docker`}
      />

      <NoteBlock type="info" title="Presets Modify the Baseline">
        <p>
          Unlike dynamic policies and operator approvals, applying a preset with{' '}
          <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-sm font-mono">
            policy-add
          </code>{' '}
          modifies the baseline policy. The preset's endpoints are added to your YAML file and
          persist across restarts. This is because presets represent deliberate, permanent
          integrations. If you want to test a preset temporarily, use{' '}
          <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-sm font-mono">
            openshell policy set
          </code>{' '}
          with the preset's YAML file instead.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Listing and Inspecting Presets
      </h2>

      <CodeBlock
        language="bash"
        title="Working with presets"
        code={`# List all available presets
nemoclaw presets list

# Output:
# Available presets:
#   discord      - Discord bot integration (4 endpoints)
#   docker       - Docker Hub registry (3 endpoints)
#   huggingface  - HuggingFace models and API (3 endpoints)
#   jira         - Atlassian Jira (2 endpoints)
#   npm          - npm package registry (1 endpoint)
#   outlook      - Microsoft Outlook/Graph API (2 endpoints)
#   pypi         - Python Package Index (2 endpoints)
#   slack        - Slack workspace integration (3 endpoints)
#   telegram     - Telegram Bot API (1 endpoint)

# Inspect a specific preset without applying it
nemoclaw presets show slack

# Output shows the full YAML that would be applied:
# groups:
#   slack:
#     endpoints:
#       - domain: "slack.com"
#         port: 443
#         tls: required
#       - domain: "api.slack.com"
#         port: 443
#         tls: required
#       - domain: "files.slack.com"
#         port: 443
#         tls: required`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Removing Presets
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If you no longer need a service integration, you can remove a preset's endpoints from
        your baseline policy:
      </p>

      <CodeBlock
        language="bash"
        title="Removing a preset"
        code={`# Remove the slack preset from your sandbox
nemoclaw my-sandbox policy-remove slack

# Output:
# Removing preset 'slack' from sandbox 'my-sandbox'
# Removed 3 endpoints. Policy updated.`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Preset Summary
      </h2>

      <ComparisonTable
        title="Built-In Policy Presets"
        headers={['Preset', 'Endpoints', 'Primary Use Case']}
        rows={[
          ['discord', '4 endpoints', 'Bot messaging, channel management'],
          ['docker', '3 endpoints', 'Container image pull/push'],
          ['huggingface', '3 endpoints', 'Model downloads, inference API'],
          ['jira', '2 endpoints', 'Issue tracking, project management'],
          ['npm', '1 endpoint', 'Node.js package installation'],
          ['outlook', '2 endpoints', 'Email sending, calendar integration'],
          ['pypi', '2 endpoints', 'Python package installation'],
          ['slack', '3 endpoints', 'Workspace messaging, file sharing'],
          ['telegram', '1 endpoint', 'Bot API messaging'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When Presets Are Not Enough
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Built-in presets cover common services, but your agent may need access to services that
        do not have a preset. In those cases, you have two options: add endpoints directly to
        the baseline YAML (covered in the static changes section) or create your own custom
        presets (covered in the Custom Policies chapter). Custom presets are especially useful
        in team environments where multiple sandboxes need the same set of custom endpoints.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next chapter, we will explore the operator approval flow -- what happens in
        real time when an agent tries to access an endpoint that is not in either the baseline
        or session policy.
      </p>
    </div>
  )
}
