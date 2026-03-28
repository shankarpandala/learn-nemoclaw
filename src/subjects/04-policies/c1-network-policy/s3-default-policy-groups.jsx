import { NoteBlock, CodeBlock, DefinitionBlock } from '../../../components/content'

export default function DefaultPolicyGroups() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Default Policy Groups
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The default NemoClaw network policy includes nine groups, each granting access to a
        specific set of endpoints that an OpenClaw-based agent sandbox commonly needs. These
        groups represent the baseline connectivity required for a typical Claude Code agent
        operating within the OpenClaw ecosystem. Understanding what each group allows -- and
        why -- is essential for evaluating and customizing your security posture.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        1. claude_code
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This group enables connectivity to Anthropic's infrastructure, which is required for
        Claude Code to function. It includes three endpoints:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">api.anthropic.com</code>{' '}
          -- The primary Anthropic API endpoint. Claude Code sends prompts to and receives
          completions from this endpoint. Without it, the agent cannot generate responses.
        </li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">statsig.anthropic.com</code>{' '}
          -- Anthropic's feature flagging and analytics service. Used for telemetry and feature
          gating within the Claude Code client.
        </li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">sentry.io</code>{' '}
          -- Error reporting service. When Claude Code encounters runtime errors, crash reports
          are sent here for debugging by the Anthropic team.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        2. nvidia
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This group provides access to NVIDIA's cloud functions API:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">api.nvcf.nvidia.com</code>{' '}
          -- NVIDIA Cloud Functions endpoint. Used when the sandbox needs access to NVIDIA-hosted
          inference services or GPU-accelerated APIs. This is particularly relevant for agents
          that leverage NVIDIA's NIM microservices.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        3. github
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This group handles Git operations over HTTPS -- cloning repositories, pushing commits,
        and pulling updates:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">github.com</code>{' '}
          -- The main GitHub domain. Required for{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">git clone</code>,{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">git push</code>,
          and browsing repository content.
        </li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">objects.githubusercontent.com</code>{' '}
          -- GitHub's content delivery domain. Raw file content, release assets, and large
          objects are served from this domain.
        </li>
      </ul>

      <NoteBlock type="info" title="Why github and github_rest_api Are Separate Groups">
        <p>
          Git operations (clone, push, pull) and REST API calls (listing issues, creating PRs,
          reading comments) have different security implications. An agent that only needs to
          clone a repository does not need REST API access. Separating these groups allows
          operators to grant Git-level access without exposing the full GitHub API surface area.
          This follows the principle of least privilege: grant only what is needed.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        4. github_rest_api
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This group enables programmatic interaction with GitHub through its REST API:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">api.github.com</code>{' '}
          -- GitHub's REST and GraphQL API endpoint. Agents use this to create issues,
          submit pull request reviews, query repository metadata, manage labels, and perform
          other automated GitHub operations.
        </li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">uploads.github.com</code>{' '}
          -- GitHub's upload endpoint for release assets and large file uploads. Required
          when agents need to attach files to releases or upload artifacts.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        5. clawhub
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        ClawHub is the package registry and distribution platform for the OpenClaw ecosystem:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">clawhub.dev</code>{' '}
          -- The main ClawHub website. Used for browsing available blueprints, extensions,
          and documentation.
        </li>
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">api.clawhub.dev</code>{' '}
          -- ClawHub's API endpoint. Used by the OpenClaw CLI to download blueprints,
          publish extensions, and check for updates.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        6. openclaw_api
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This group provides access to the OpenClaw platform API:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">api.openclaw.ai</code>{' '}
          -- The OpenClaw API endpoint. Used for sandbox management operations, license
          validation, session coordination, and telemetry. This is essential for the sandbox
          runtime to communicate with the OpenClaw control plane.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        7. openclaw_docs
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This group grants access to OpenClaw's documentation:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">docs.openclaw.ai</code>{' '}
          -- The OpenClaw documentation site. Agents may reference documentation to answer
          questions about OpenClaw features, troubleshoot issues, or follow setup guides.
          This is a read-only informational endpoint.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        8. npm_registry
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This group enables Node.js package management:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">registry.npmjs.org</code>{' '}
          -- The official npm package registry. Required for{' '}
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">npm install</code>{' '}
          operations. Only the official registry is whitelisted by default -- private registries
          or mirrors must be added explicitly.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        9. telegram
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This group enables Telegram Bot API integration:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">api.telegram.org</code>{' '}
          -- The Telegram Bot API endpoint. Many OpenClaw deployments use Telegram as a
          communication channel for operator notifications, approval requests, and agent
          status updates. This endpoint allows agents to send and receive messages through
          Telegram bots.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Customizing the Default Groups
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        These nine groups represent a reasonable baseline for Claude Code agents operating within
        the OpenClaw ecosystem. However, your specific use case may require modifications. You
        might remove groups your agent does not need (for example, if your agent never interacts
        with Telegram, remove that group to reduce the attack surface). You might add new groups
        for services your agent depends on (like a database API or a custom internal service).
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The key principle is that every group in your policy should have a clear justification.
        If you cannot explain why an agent needs access to a particular set of endpoints, that
        group should not be in the policy. In later sections, we will cover how to add custom
        groups, use policy presets for common services, and test policy changes before deployment.
      </p>
    </div>
  )
}
