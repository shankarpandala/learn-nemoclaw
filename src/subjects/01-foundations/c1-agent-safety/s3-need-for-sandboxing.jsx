import { ComparisonTable, NoteBlock } from '../../../components/content'

export default function NeedForSandboxing() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        The Need for Sandboxing & Policy Enforcement
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The previous section cataloged the risks of unrestricted AI agents -- data exfiltration,
        credential theft, runaway costs, and compliance violations. The natural response is to apply
        existing security controls. But traditional security approaches, designed for human-operated
        software and predictable workloads, are fundamentally inadequate for the unique challenges
        posed by autonomous AI agents. Understanding why requires examining what makes agents
        different from the systems that traditional security was built to protect.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Why Traditional Security Does Not Work for Agents
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Traditional application security is built on assumptions that do not hold for AI agents.
        Consider the standard security model for a web application: the application has a fixed set
        of behaviors defined by its source code, it accesses a known set of resources (databases,
        APIs, files), and its interactions follow predictable patterns that can be expressed as
        firewall rules, IAM policies, and access control lists.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        AI agents violate every one of these assumptions:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Non-deterministic behavior:</span> An agent's actions
          are determined by its LLM reasoning, not by fixed code paths. The same agent given the
          same task may take entirely different actions on successive runs. It may decide to
          install a new package, access a different API, or read a file it has never read before.
          Static security rules cannot anticipate this variability.
        </li>
        <li>
          <span className="font-semibold">Dynamic resource access:</span> Unlike a web server that
          accesses a known database on a known port, an agent's resource access patterns are
          determined at runtime by its reasoning. A coding agent might need to access npm, PyPI,
          GitHub, Stack Overflow, or any number of other services depending on the task at hand.
          Hardcoding allowed endpoints is either too restrictive (blocking legitimate work) or too
          permissive (allowing dangerous access).
        </li>
        <li>
          <span className="font-semibold">Tool use as a first-class capability:</span> Agents are
          explicitly designed to execute arbitrary commands, make HTTP requests, and manipulate
          files. These are not bugs or vulnerabilities -- they are core features. Traditional
          security treats shell execution and arbitrary network access as threats to be prevented;
          agent security must treat them as capabilities to be governed.
        </li>
        <li>
          <span className="font-semibold">Vulnerability to prompt injection:</span> Agents process
          untrusted input (user messages, file contents, API responses) through their LLM, which
          can be manipulated to override intended behavior. No traditional security control
          addresses this attack vector because it does not exist in conventional software.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Sandboxing Principles
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Given that traditional security controls are insufficient, agent security requires a
        different approach: sandboxing with policy enforcement. Effective agent sandboxing is built
        on three foundational principles:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Least Privilege:</span> The agent should have the minimum
          set of capabilities required to perform its intended task, and no more. If an agent
          needs to read files in a project directory, it should not have access to the home
          directory's SSH keys. If it needs to make requests to a specific API, it should not be
          able to reach arbitrary internet endpoints.
        </li>
        <li>
          <span className="font-semibold">Deny-by-Default:</span> All capabilities should be
          blocked unless explicitly allowed. This is the inverse of traditional permissive
          configurations where everything is allowed unless explicitly blocked. A deny-by-default
          posture means that if a new attack vector emerges or the agent attempts an unanticipated
          action, it will be blocked rather than allowed.
        </li>
        <li>
          <span className="font-semibold">Explicit Allow Lists:</span> Permitted capabilities are
          defined through declarative policies. Rather than trying to enumerate everything that
          should be blocked (an impossible task given agent non-determinism), operators define
          what is allowed: specific filesystem paths, specific network endpoints, specific system
          calls. Everything else is denied by the sandbox.
        </li>
      </ul>

      <NoteBlock type="tip" title="Defense in Depth">
        <p>
          A robust sandbox does not rely on a single mechanism. The strongest agent sandboxes
          layer multiple independent security controls -- filesystem restrictions, network
          policies, system call filtering, credential isolation -- so that a bypass of any single
          layer does not compromise the overall security posture. This defense-in-depth approach
          is a core design principle of NemoClaw.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        What a Good Agent Sandbox Looks Like
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A well-designed agent sandbox provides several critical properties:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Filesystem Isolation:</span> The agent can only read and
          write files within explicitly permitted directories. Access to system files, credential
          stores, and other sensitive paths is blocked at the kernel level, not just by
          application-level checks that the agent could circumvent.
        </li>
        <li>
          <span className="font-semibold">Network Isolation:</span> Outbound network access is
          denied by default. Specific domains and ports are allowed through a policy whitelist.
          This prevents data exfiltration, SSRF attacks, and unauthorized API usage. The sandbox
          controls both DNS resolution and direct IP connections.
        </li>
        <li>
          <span className="font-semibold">System Call Filtering:</span> The sandbox restricts which
          kernel system calls the agent process can make. Dangerous syscalls like those that
          modify kernel parameters, load kernel modules, or change user identity are blocked.
          This prevents privilege escalation even if the agent gains code execution capabilities.
        </li>
        <li>
          <span className="font-semibold">Credential Isolation:</span> Credentials needed by the
          agent (API keys, tokens) are injected into the sandbox environment in a controlled way
          but are not accessible from within the sandbox's filesystem. The agent can use
          credentials for their intended purpose but cannot read, copy, or exfiltrate them.
        </li>
        <li>
          <span className="font-semibold">Operator Oversight:</span> The sandbox provides
          mechanisms for human operators to review and approve sensitive actions. An operator
          approval workflow allows the agent to request permissions it does not have, with a human
          making the final decision for high-risk operations.
        </li>
        <li>
          <span className="font-semibold">Auditability:</span> All agent actions, policy
          decisions, and security events are logged. This provides the audit trail needed for
          compliance and incident investigation.
        </li>
      </ul>

      <ComparisonTable
        title="No Sandbox vs Sandboxed Agent"
        headers={['Aspect', 'No Sandbox', 'Sandboxed Agent']}
        rows={[
          [
            'Filesystem Access',
            'Full read/write to entire filesystem including ~/.ssh, ~/.aws, /etc',
            'Restricted to project directory; sensitive paths blocked at kernel level',
          ],
          [
            'Network Access',
            'Unrestricted; can reach any IP/domain on any port',
            'Deny-by-default; only explicitly whitelisted domains/ports allowed',
          ],
          [
            'Credential Safety',
            'Agent can read env vars, credential files, and exfiltrate them',
            'Credentials injected but not readable; isolated from agent filesystem',
          ],
          [
            'Prompt Injection Impact',
            'Attacker gains full system access through the agent',
            'Attacker is constrained to sandbox boundaries; blast radius is limited',
          ],
          [
            'Cost Control',
            'No limits; runaway loops can generate unbounded API costs',
            'Rate limiting, circuit breakers, and budget caps enforced',
          ],
          [
            'Compliance',
            'Cannot guarantee data boundaries or generate audit trails',
            'Network policies enforce data residency; all actions logged',
          ],
          [
            'Operator Visibility',
            'Agent operates as a black box; no oversight mechanism',
            'Action logging, approval workflows, and real-time monitoring',
          ],
          [
            'Failure Mode',
            'Catastrophic: full system compromise, data breach, or resource exhaustion',
            'Contained: failures are limited to the sandbox scope',
          ],
        ]}
        highlightDiffs
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Preview of NemoClaw's Approach
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw implements all of the sandboxing principles described above using a combination of
        Linux kernel security primitives. Rather than relying on heavyweight containerization or
        virtualization, NemoClaw uses three lightweight, composable security mechanisms:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Landlock LSM</span> for filesystem access control --
          restricting which paths the agent can read, write, and execute.
        </li>
        <li>
          <span className="font-semibold">seccomp</span> for system call filtering -- blocking
          dangerous kernel system calls that could enable privilege escalation.
        </li>
        <li>
          <span className="font-semibold">Network namespaces</span> for network isolation --
          placing the agent in an isolated network environment where only explicitly allowed
          traffic is routed.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This combination provides defense-in-depth security without the overhead of running a full
        container or virtual machine. The policies are declared in simple configuration files,
        making them easy to audit, version control, and customize for different agent workloads.
        We will explore each of these mechanisms in detail in the Security Landscape chapter.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The key insight is that agent security is not about preventing agents from being useful --
        it is about ensuring that the scope of an agent's actions precisely matches the scope of
        its intended purpose. A well-sandboxed agent is not a restricted agent; it is a
        well-governed one.
      </p>
    </div>
  )
}
