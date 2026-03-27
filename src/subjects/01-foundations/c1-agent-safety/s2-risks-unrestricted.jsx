import { WarningBlock, ExerciseBlock } from '../../../components/content'

export default function RisksUnrestricted() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Risks of Unrestricted Agents
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When an AI agent operates without security boundaries, every capability it possesses
        becomes a potential attack vector or failure mode. The very features that make agents
        useful -- network access, filesystem operations, shell execution, API calls -- become
        dangerous when there are no guardrails limiting their scope. This section catalogs the
        major risk categories that emerge when agents run unrestricted.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Network Risks
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        An unrestricted agent with network access can make arbitrary HTTP requests to any
        endpoint on the internet. This single capability opens up a cascade of risk scenarios
        that can compromise not just the agent's host system but the entire organization.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Data Exfiltration:</span> An agent that can read files
          and make network requests can transmit sensitive data -- source code, environment
          variables, API keys, database credentials, customer data -- to any external server.
          This can happen through direct HTTP POST requests, DNS exfiltration, or even by encoding
          data in URL parameters of GET requests. A prompt injection attack could instruct the
          agent to quietly send credentials to an attacker-controlled endpoint.
        </li>
        <li>
          <span className="font-semibold">API Abuse:</span> Agents often have access to API keys
          for various services. Without network restrictions, a compromised or malfunctioning
          agent could use these keys to make unauthorized API calls -- sending emails, modifying
          DNS records, provisioning cloud resources, or accessing third-party services in ways
          the operator never intended.
        </li>
        <li>
          <span className="font-semibold">Server-Side Request Forgery (SSRF):</span> An agent
          running inside a cloud environment can access internal metadata endpoints
          (such as the AWS instance metadata service at 169.254.169.254), internal APIs, and
          other services on the private network. This allows privilege escalation from the agent's
          context to broader infrastructure access.
        </li>
        <li>
          <span className="font-semibold">Command and Control:</span> A compromised agent could
          establish persistent connections to external command-and-control servers, effectively
          turning the host machine into a bot in a larger attack infrastructure.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Filesystem Risks
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Filesystem access is essential for coding agents -- they need to read and write code files,
        configuration files, and build artifacts. But unrestricted filesystem access extends far
        beyond the project directory.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Reading Secrets:</span> Agents with unrestricted read
          access can traverse the filesystem to find credentials stored in <code
          className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">~/.ssh/</code>,
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">~/.aws/credentials</code>,
          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.env</code> files,
          Docker configs, Kubernetes secrets mounted as volumes, and browser cookie stores. These
          credentials can then be used for lateral movement or exfiltrated via network access.
        </li>
        <li>
          <span className="font-semibold">Modifying System Files:</span> Write access to system
          directories enables an agent to modify shell profiles (<code
          className="text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">~/.bashrc</code>),
          cron jobs, SSH authorized keys, systemd services, and other system configuration.
          These modifications can establish persistence, escalate privileges, or disrupt system
          operation.
        </li>
        <li>
          <span className="font-semibold">Writing Malware:</span> An agent that can write
          executable files and modify system configuration could write and install malware,
          cryptocurrency miners, backdoors, or other malicious software. Combined with shell
          execution capabilities, the agent could compile and run arbitrary binaries.
        </li>
        <li>
          <span className="font-semibold">Data Destruction:</span> Accidental or malicious
          deletion of files, including source code, databases, logs, and backups. A simple
          miscalculation in a cleanup script could result in catastrophic data loss.
        </li>
      </ul>

      <WarningBlock title="Real-World Incident Scenarios">
        <div className="space-y-3">
          <p>
            These are not theoretical risks. The following scenarios have been observed or
            demonstrated in production environments:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="font-semibold">Prompt Injection via Repository Files:</span> An
              attacker places a specially crafted comment in a code file or README. When a coding
              agent processes the file, the injected prompt instructs the agent to read SSH keys
              and send them to an external URL. Without network restrictions, the exfiltration
              succeeds silently.
            </li>
            <li>
              <span className="font-semibold">Runaway Inference Loop:</span> A coding agent
              encounters an error it cannot resolve. Without cost controls, it enters a retry
              loop, making hundreds of inference API calls per minute. The operator discovers a
              bill exceeding $10,000 the following morning.
            </li>
            <li>
              <span className="font-semibold">Credential Theft via Environment Variables:</span> An
              agent with unrestricted shell access runs <code
              className="text-sm bg-red-100 dark:bg-red-900/50 px-1 rounded">env</code> or
              reads <code
              className="text-sm bg-red-100 dark:bg-red-900/50 px-1 rounded">/proc/self/environ</code>,
              capturing all environment variables including database passwords, API keys, and
              service tokens.
            </li>
            <li>
              <span className="font-semibold">Supply Chain Compromise:</span> An agent
              automatically installs npm packages suggested in a pull request. A malicious package
              executes a postinstall script that opens a reverse shell to an attacker's server.
            </li>
          </ul>
        </div>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Cost Risks
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Always-on agents consume resources continuously, and without proper controls, costs can
        escalate rapidly and unpredictably.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Uncontrolled Inference API Usage:</span> Each agent
          action typically involves one or more calls to an LLM inference API. Complex reasoning
          tasks, long contexts, and tool-use loops can generate thousands of API calls per hour.
          At rates of $10-60 per million tokens for frontier models, costs can reach hundreds or
          thousands of dollars per day for a single agent.
        </li>
        <li>
          <span className="font-semibold">Runaway Loops:</span> A bug in the agent's logic or an
          unexpected error can cause infinite retry loops. Without circuit breakers, the agent
          will continue consuming inference tokens, network bandwidth, and compute resources
          indefinitely.
        </li>
        <li>
          <span className="font-semibold">Resource Exhaustion:</span> Agents that spawn
          subprocesses, download large files, or perform intensive computations can exhaust CPU,
          memory, and disk resources on the host machine, affecting other services and potentially
          causing system instability.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Compliance Risks
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For organizations operating under regulatory frameworks, unrestricted agents introduce
        significant compliance exposure.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">GDPR and Data Protection:</span> An agent that
          processes personal data without proper controls may violate data minimization
          principles, transfer data across jurisdictional boundaries, or fail to honor data
          subject access requests. If an agent reads a database containing EU citizen data and
          sends it to a US-based inference API, this could constitute an unauthorized cross-border
          data transfer.
        </li>
        <li>
          <span className="font-semibold">Data Residency Requirements:</span> Many regulations
          require that certain data remain within specific geographic boundaries. An unrestricted
          agent making API calls to global endpoints may inadvertently move regulated data out of
          its required jurisdiction.
        </li>
        <li>
          <span className="font-semibold">Audit Trail Requirements:</span> Regulations like SOX,
          HIPAA, and PCI-DSS require comprehensive audit trails of data access and system changes.
          Unrestricted agents that operate without logging and monitoring make it impossible to
          maintain the audit trails required for compliance.
        </li>
        <li>
          <span className="font-semibold">Principle of Least Privilege:</span> Most security
          frameworks mandate that systems operate with the minimum privileges necessary. An
          unrestricted agent, by definition, violates this fundamental principle.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The cumulative effect of these risks is clear: deploying AI agents without security
        boundaries is not just irresponsible -- it is operationally dangerous and potentially
        illegal. The question is not whether to restrict agents, but how to restrict them
        without destroying their utility. This is the challenge of sandboxing and policy
        enforcement, which we explore in the next section.
      </p>

      <ExerciseBlock
        question="Which of the following is the MOST dangerous combination of unrestricted agent capabilities?"
        options={[
          'Shell execution combined with internet access',
          'File reading combined with network egress',
          'Inference API access combined with large context windows',
          'File writing combined with cron job access',
        ]}
        correctIndex={1}
        explanation="File reading combined with network egress is the most dangerous combination because it enables data exfiltration -- the agent can read any secret or sensitive data on the filesystem and transmit it to any external endpoint. While shell execution with internet access is also dangerous, file reading plus network egress is the minimal set of capabilities needed for the highest-impact attack (credential and data theft)."
      />
    </div>
  )
}
