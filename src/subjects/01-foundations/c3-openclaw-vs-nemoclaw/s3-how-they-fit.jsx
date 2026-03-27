import { NoteBlock } from '../../../components/content'

export default function HowTheyFit() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        How They Fit Together
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw and NemoClaw are separate projects with complementary purposes. Understanding how
        they fit together -- and where one ends and the other begins -- is essential for making
        informed deployment decisions. This section clarifies their relationship, describes the
        architecture of a combined deployment, and explains what NemoClaw adds on top of OpenClaw.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The Relationship: Platform and Security Layer
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The simplest way to understand the relationship is through roles:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">OpenClaw</span> is the AI assistant platform. It handles
          messaging platform integrations, model provider routing, agent session management, tool
          execution, and the operator control interface. OpenClaw is responsible for making the
          agent work.
        </li>
        <li>
          <span className="font-semibold">NemoClaw</span> is the security orchestration layer. It
          wraps OpenClaw's agent execution with kernel-level sandboxing, enforces deny-by-default
          network and filesystem policies, isolates credentials, and provides operator approval
          workflows. NemoClaw is responsible for making the agent safe.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        These two responsibilities -- functionality and security -- are deliberately separated.
        OpenClaw can run without NemoClaw (and does, in many deployments). NemoClaw requires
        OpenClaw (it has no agent functionality of its own). When combined, they provide a complete
        solution: a powerful AI agent platform with enterprise-grade security controls.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        The Analogy: Car and Garage
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Consider this analogy: OpenClaw is the car, and NemoClaw is the garage with locks, cameras,
        and a security system.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The car (OpenClaw) is what gets you places. It has an engine (AI models), steering
        (multi-agent routing), wheels (messaging platform integrations), and controls (the operator
        UI). You can drive the car without a garage -- park it in an open lot, leave the keys in
        the ignition, and hope for the best. It works, and for many situations (a private
        driveway, a controlled parking structure) it is perfectly fine.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The garage (NemoClaw) does not make the car go faster or add new destinations. What it does
        is protect the car and control access. The garage has a locked door (deny-by-default
        policies), security cameras (audit logging), a keycard system (credential isolation), and
        a gate attendant who checks with you before letting anyone in or out (operator approval).
        The car still drives the same way inside the garage -- the agent's functionality is
        unchanged -- but the security boundary ensures that misuse, theft, and accidents are
        contained.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        You do not need the garage for every situation. But when your car contains valuable cargo
        (production access, sensitive data, customer information), when the parking lot is
        dangerous (public-facing agents, untrusted inputs), or when regulations require it
        (compliance, audit requirements), the garage is not optional -- it is essential.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Architecture of a Combined Deployment
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In a combined OpenClaw + NemoClaw deployment, the data flow and execution architecture
        looks like this:
      </p>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 my-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Architecture Flow
        </h3>
        <div className="font-mono text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <p className="font-semibold text-indigo-700 dark:text-indigo-400">Incoming Message Flow:</p>
          <p className="pl-4">User (WhatsApp/Telegram/Discord/...)</p>
          <p className="pl-8">-&gt; OpenClaw Gateway (message normalization, routing)</p>
          <p className="pl-12">-&gt; OpenClaw Node (agent session management)</p>
          <p className="pl-16">-&gt; NemoClaw Plugin (intercepts tool calls)</p>
          <p className="pl-20">-&gt; OpenShell Runtime (sandboxed execution)</p>
          <p className="pl-24">-&gt; [Landlock + seccomp + network namespace]</p>
          <p className="pl-28">-&gt; Agent tool execution (within sandbox)</p>

          <p className="font-semibold text-indigo-700 dark:text-indigo-400 mt-4">Outgoing Response Flow:</p>
          <p className="pl-4">Agent tool result (from sandbox)</p>
          <p className="pl-8">-&gt; OpenShell Runtime (result capture)</p>
          <p className="pl-12">-&gt; NemoClaw Plugin (policy verification)</p>
          <p className="pl-16">-&gt; OpenClaw Node (LLM processing)</p>
          <p className="pl-20">-&gt; OpenClaw Gateway (response routing)</p>
          <p className="pl-24">-&gt; User (platform-specific formatting)</p>

          <p className="font-semibold text-indigo-700 dark:text-indigo-400 mt-4">Operator Approval Flow (when policy exceeded):</p>
          <p className="pl-4">Agent requests action outside policy</p>
          <p className="pl-8">-&gt; NemoClaw Plugin (detects policy violation)</p>
          <p className="pl-12">-&gt; Operator notification (via messaging platform)</p>
          <p className="pl-16">-&gt; Operator approves/denies</p>
          <p className="pl-20">-&gt; NemoClaw Plugin (enforces decision)</p>
          <p className="pl-24">-&gt; Agent execution continues or is blocked</p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The key architectural insight is that NemoClaw operates as an interception layer within
        OpenClaw's execution pipeline. The agent is unaware that it is running inside a sandbox.
        From the agent's perspective, it makes tool calls and receives results. The NemoClaw
        plugin and OpenShell runtime sit between the agent's tool calls and the operating system,
        enforcing policies transparently.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What NemoClaw Adds
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Specifically, NemoClaw adds the following capabilities on top of a base OpenClaw deployment:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Kernel-Level Sandbox:</span> Every agent session runs
          inside an OpenShell sandbox with Landlock filesystem restrictions, seccomp system call
          filters, and a dedicated network namespace. These restrictions are enforced at the Linux
          kernel level and cannot be bypassed by the agent process.
        </li>
        <li>
          <span className="font-semibold">Declarative Security Policies:</span> Operators define
          network and filesystem policies in configuration files. These policies specify exactly
          which domains the agent can reach, which filesystem paths it can access, and with what
          permissions. Policies follow the deny-by-default principle -- everything not explicitly
          allowed is blocked.
        </li>
        <li>
          <span className="font-semibold">Credential Isolation:</span> API keys and tokens are
          injected into the agent environment through a secure mechanism that makes them usable
          but not readable. The agent can authenticate to external services but cannot extract or
          exfiltrate the credential values themselves.
        </li>
        <li>
          <span className="font-semibold">Operator Approval Workflows:</span> When an agent
          attempts an action that exceeds its configured policy, NemoClaw can pause execution and
          request operator approval through the same messaging platform the agent uses. The
          operator receives a clear description of the requested action and can approve, deny,
          or modify the request.
        </li>
        <li>
          <span className="font-semibold">Security Audit Logging:</span> All policy decisions,
          blocked actions, approval requests, and security events are logged. This provides the
          audit trail needed for compliance requirements and incident investigation.
        </li>
      </ul>

      <NoteBlock type="tip" title="Transparent Security">
        <p>
          One of NemoClaw's most important design decisions is transparency to the agent. The agent
          does not need to be modified, reconfigured, or even aware that it is running inside a
          NemoClaw sandbox. This means that any OpenClaw agent -- whether it uses Claude, GPT,
          Gemini, or any other model -- can be secured with NemoClaw without any changes to the
          agent's prompts, tools, or behavior. The security layer is purely additive.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        In the next section, we will compare OpenClaw and NemoClaw feature by feature, providing a
        comprehensive reference table that clarifies exactly what each project provides and when
        you need one, the other, or both.
      </p>
    </div>
  )
}
