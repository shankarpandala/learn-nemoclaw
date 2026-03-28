import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function MultiNode() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Multi-Node NemoClaw Deployments
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        As your organization grows, a single NemoClaw instance may not be sufficient. You might
        need separate instances for different teams, projects, or security boundaries. You may
        also want redundancy so that a single machine failure does not take down agent access
        for the entire organization. This section covers running multiple NemoClaw instances,
        load balancing strategies, and shared policy management across nodes.
      </p>

      <DefinitionBlock
        term="Multi-Node Deployment"
        definition="A NemoClaw architecture where multiple independent instances run on separate machines (physical or virtual), each handling a subset of agent sessions. Unlike horizontal scaling of a single service, each NemoClaw node is a complete, self-contained deployment with its own Gateway, policy engine, and optional local LLM."
        example="An organization with three NemoClaw nodes: one for the backend engineering team, one for the frontend team, and one for the DevOps team. Each has its own policies and agent configurations, but they share a common base policy set managed through a central git repository."
        seeAlso={['Load Balancing', 'Policy Management', 'High Availability']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When You Need Multiple Instances
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Team isolation:</span> Different teams need different
          agent configurations, policy rules, or LLM providers. A security team might require
          stricter policies than a documentation team.
        </li>
        <li>
          <span className="font-semibold">Scale limits:</span> A single NemoClaw instance
          comfortably handles 20-50 concurrent agent sessions. Beyond that, policy evaluation
          latency may increase, and the Gateway's event loop can become a bottleneck.
        </li>
        <li>
          <span className="font-semibold">Geographic distribution:</span> Teams in different
          regions may benefit from NemoClaw instances closer to their location, reducing latency
          for the Control UI and SSH access.
        </li>
        <li>
          <span className="font-semibold">Redundancy:</span> If one instance goes down (hardware
          failure, host maintenance), other instances continue serving their assigned teams.
        </li>
        <li>
          <span className="font-semibold">Mixed LLM backends:</span> One instance uses
          Anthropic Claude for general development, another uses a local LLM for sensitive
          codebases, and a third uses OpenAI for teams that prefer it.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Architecture Patterns
      </h2>

      <ComparisonTable
        title="Multi-Node Architecture Options"
        headers={['Pattern', 'Description', 'Complexity', 'Best For']}
        rows={[
          ['Independent instances', 'Each node fully isolated with its own config and policies', 'Low', 'Team isolation, different requirements'],
          ['Shared policy repo', 'Independent instances pulling policies from a shared git repo', 'Medium', 'Consistent policies across teams'],
          ['Load-balanced cluster', 'Multiple nodes behind a load balancer serving the same team', 'High', 'Scale and redundancy'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Shared Policy Management
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The most common multi-node pattern is independent instances with shared policies. Each
        NemoClaw instance runs autonomously, but they all pull their policy definitions from a
        central git repository. This ensures consistent security rules across the organization
        while allowing per-instance customization through policy layering.
      </p>

      <CodeBlock
        language="bash"
        title="Shared Policy Repository Setup"
        code={`# Create a central policy repository
# (on GitHub, GitLab, or a self-hosted git server)

nemoclaw-policies/
  base/
    safety.yaml        # Common safety rules for all instances
    network.yaml       # Network access restrictions
    filesystem.yaml    # Filesystem boundary rules
  overrides/
    backend-team/
      tools.yaml       # Backend-specific tool permissions
    frontend-team/
      tools.yaml       # Frontend-specific tool permissions
    devops-team/
      tools.yaml       # DevOps-specific (broader permissions)

# On each NemoClaw instance, configure policy sync:
# In openclaw.json:
{
  "policies": {
    "source": "git",
    "repository": "git@github.com:org/nemoclaw-policies.git",
    "branch": "main",
    "basePath": "base/",
    "overridePath": "overrides/backend-team/",
    "syncInterval": "5m"
  }
}`}
      />

      <StepBlock
        title="Deploy Multiple NemoClaw Instances"
        steps={[
          {
            title: 'Plan your topology',
            content: 'Decide how many instances you need and how they map to teams. A common starting point is one instance per 10-20 developers or one per team with distinct security requirements.',
          },
          {
            title: 'Provision the infrastructure',
            content: 'Create VMs for each instance. They can be on different cloud providers, different Proxmox hosts, or a mix. Each needs the standard NemoClaw requirements (4+ vCPU, 8-16 GB RAM, 30 GB storage).',
          },
          {
            title: 'Create the shared policy repository',
            content: 'Set up a git repository with base policies and per-team overrides. The base policies define organization-wide safety rules. Each team\'s override directory can relax or tighten specific rules.',
          },
          {
            title: 'Install NemoClaw on each instance',
            content: 'Follow the standard installation on each VM. During onboarding, configure the policy source to point at the shared repository.',
          },
          {
            title: 'Configure Slack/Discord channel routing',
            content: 'Each NemoClaw instance connects to specific Slack channels or Discord channels. Configure each instance\'s platform integration to respond only in its assigned channels, preventing conflicts.',
          },
          {
            title: 'Set up monitoring',
            content: 'Deploy a centralized monitoring solution (Prometheus + Grafana, or a cloud monitoring service) that collects metrics from all instances. This gives you a single dashboard for the health of your entire NemoClaw fleet.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Load Balancing Considerations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        True load balancing across NemoClaw instances is complex because the Gateway maintains
        session state in memory. A naive round-robin load balancer would route messages from the
        same Slack conversation to different instances, breaking session continuity. If you need
        load-balanced redundancy, you have two options:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Sticky sessions (session affinity):</span> Configure
          the load balancer to route all messages from the same user/channel to the same NemoClaw
          instance. This preserves session state but means a failed instance loses all its sessions.
        </li>
        <li>
          <span className="font-semibold">External session store:</span> Move session state out
          of the Gateway's memory into Redis or a similar external store. All instances share the
          same session data, allowing any instance to handle any message. This is the most robust
          approach but requires additional infrastructure and NemoClaw configuration.
        </li>
      </ul>

      <CodeBlock
        language="yaml"
        title="NGINX Configuration for Sticky Sessions"
        code={`# /etc/nginx/conf.d/nemoclaw-lb.conf
upstream nemoclaw_cluster {
    # Sticky sessions based on the Slack user ID cookie
    ip_hash;  # Simple: route by client IP

    server 10.0.0.10:18789;  # Instance 1
    server 10.0.0.11:18789;  # Instance 2
    server 10.0.0.12:18789;  # Instance 3
}

server {
    listen 18789;

    location / {
        proxy_pass http://nemoclaw_cluster;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`}
      />

      <WarningBlock title="Load Balancing Is Often Unnecessary">
        <p>
          Before implementing a load-balanced cluster, verify that you actually need one. A single
          NemoClaw instance on an 8 vCPU machine handles 20-50 concurrent sessions comfortably.
          Most organizations can serve their entire engineering team from a single instance.
          Multi-node deployments for team isolation are simpler and more practical than load-balanced
          clusters for most use cases.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Policy Synchronization
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When managing policies across multiple instances, consistency is critical. A change to
        a base safety rule should propagate to all instances promptly. NemoClaw supports automatic
        policy synchronization from a git repository with configurable intervals.
      </p>

      <CodeBlock
        language="bash"
        title="Policy Sync Workflow"
        code={`# Developer pushes a policy change to the shared repo:
git commit -m "Tighten filesystem access: deny /etc writes"
git push origin main

# Each NemoClaw instance polls the repo every 5 minutes
# and automatically reloads policies when changes are detected.

# To force an immediate sync on a specific instance:
npx nemoclaw policy sync --now

# To verify all instances have the latest policies:
# Check each instance's policy version:
npx nemoclaw policy version
# Output: Policy version: abc1234 (synced 2 minutes ago)

# Compare across instances to ensure consistency`}
      />

      <NoteBlock type="info" title="Policy Testing Before Deployment">
        <p>
          When multiple instances share a policy repository, a broken policy update affects all
          instances simultaneously. Always test policy changes in audit mode on a single staging
          instance before merging to the main branch. Use the NemoClaw policy test command to
          dry-run rules against sample actions: <code>npx nemoclaw policy test --file new-rule.yaml
          --action "shell.execute" --command "rm -rf /"</code>
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="What is the primary challenge when load-balancing multiple NemoClaw instances behind a reverse proxy?"
        options={[
          'NemoClaw cannot run on multiple machines simultaneously',
          'The Gateway stores session state in memory, so requests from the same session must go to the same instance',
          'NGINX cannot proxy WebSocket connections',
          'NemoClaw instances cannot share the same Slack workspace',
        ]}
        correctIndex={1}
        explanation="The OpenClaw Gateway maintains session state (conversation history, active tool calls) in memory. If a load balancer routes messages from the same conversation to different instances, each instance has an incomplete view of the session. This requires either sticky sessions (routing all messages from a user to the same instance) or an external session store shared across instances."
      />

      <ReferenceList
        references={[
          {
            title: 'NGINX Load Balancing Guide',
            url: 'https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/',
            type: 'docs',
            description: 'Configuring NGINX as an HTTP/WebSocket load balancer.',
          },
          {
            title: 'NemoClaw Policy Management',
            url: 'https://docs.nemoclaw.dev/policies',
            type: 'docs',
            description: 'Managing and synchronizing NemoClaw policy rules across deployments.',
          },
        ]}
      />
    </div>
  )
}
