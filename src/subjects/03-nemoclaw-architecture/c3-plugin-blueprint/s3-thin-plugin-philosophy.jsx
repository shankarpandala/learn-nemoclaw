import { NoteBlock, DefinitionBlock, ComparisonTable, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content';

export default function ThinPluginPhilosophy() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        The Thin Plugin Philosophy
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw's architecture makes a deliberate and opinionated choice: keep the
        plugin as thin as possible and push all complexity into the blueprint. This is
        not a consequence of laziness or time pressure -- it is a design philosophy with
        deep implications for security, maintainability, and operability. Understanding
        this philosophy helps you understand why NemoClaw is structured the way it is
        and how to work with it rather than against it.
      </p>

      <DefinitionBlock
        term="Thin Plugin"
        definition="An integration layer that contains the minimum code necessary to bridge two systems (in this case, OpenClaw and the NemoClaw blueprint). A thin plugin registers capabilities, forwards messages, and handles errors -- but contains no business logic, no policy parsing, no credential management, and no orchestration."
        example="The NemoClaw plugin is approximately 200 lines of TypeScript. It registers an inference provider, adds a slash command, and maintains an IPC connection. That is all."
        seeAlso={['Thick Blueprint', 'Separation of Concerns', 'Attack Surface']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Why Thin?
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        There are four interconnected reasons for the thin plugin design:
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        1. Fewer Updates Needed
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw extensions go through a publication and review process. Each update
        requires building, packaging, publishing to the marketplace, and waiting for
        users to update. If the plugin contained inference routing logic, every new LLM
        provider would require a plugin update. If it contained policy parsing, every
        policy format change would require a plugin update. By keeping the plugin thin,
        it only needs to change when OpenClaw's extension API changes -- which happens
        a few times per year at most.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The blueprint, by contrast, is resolved and verified at runtime. A new blueprint
        version takes effect immediately (on the next{' '}
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">nemoclaw apply</code>)
        without any editor restart or extension update. This means security patches
        can ship in hours, not days.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        2. Complex Logic Is Versioned and Verified
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The blueprint contains the complex logic: policy parsing, Landlock rule
        generation, seccomp filter compilation, network namespace configuration,
        inference routing. This is the code that, if compromised, could undermine
        the entire security model. By putting it in the blueprint, this code is:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Independently versioned</strong> -- each version is an immutable
          artifact with a known identity
        </li>
        <li>
          <strong>Digest-verified</strong> -- checked for tampering before every
          execution
        </li>
        <li>
          <strong>Pinnable</strong> -- teams can lock to a specific version for
          reproducibility
        </li>
        <li>
          <strong>Auditable</strong> -- a specific version can be reviewed, and you can
          be certain that the reviewed version is what is running
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        None of these properties apply to editor extensions in the same way. Extension
        signing exists but is less rigorous than the blueprint's digest verification.
        Extension versions are harder to pin (they auto-update by default). Extension
        code is harder to audit because it runs inside the editor's process.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        3. Easier to Audit
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A 200-line TypeScript file can be reviewed in minutes. A security auditor can
        verify that the plugin does not handle credentials, does not parse untrusted
        input, and does not make network requests. This fast auditability means the
        plugin can be trusted with less scrutiny, freeing audit resources to focus on
        the blueprint where the real security-sensitive logic lives.
      </p>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        4. Reduced Attack Surface
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The plugin runs inside OpenClaw's extension host -- a process with access to
        the user's editor state, open files, and potentially other extensions. Keeping
        the plugin thin minimizes the amount of NemoClaw code running in this
        relatively exposed environment. Credentials, policy logic, and sandbox
        management all run in the separate blueprint process, which has no access to
        the editor.
      </p>

      <ComparisonTable
        title="Thin Plugin vs. Thick Plugin (Hypothetical)"
        headers={['Aspect', 'Thin Plugin (NemoClaw)', 'Thick Plugin (Hypothetical)']}
        rows={[
          ['Lines of code in editor', '~200', '~5,000+'],
          ['Update frequency', 'Quarterly', 'Weekly (every new feature)'],
          ['Credential exposure', 'None (IPC only)', 'API keys in extension process'],
          ['Audit time', 'Minutes', 'Days'],
          ['Editor restart needed for updates', 'Rarely', 'Frequently'],
          ['Failure blast radius', 'IPC error message', 'Credential leak, policy bypass'],
          ['Dependencies', '0 (just OpenClaw API)', '10+ (HTTP clients, YAML parsers, etc.)'],
        ]}
        highlightDiffs
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        The Thick Blueprint Counterpart
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The thin plugin philosophy only works because its counterpart -- the thick
        blueprint -- absorbs all the complexity. The blueprint is approximately 15,000+
        lines of Python, with dependencies on YAML parsing, cryptographic libraries,
        HTTP clients, and OpenShell's API. It is "thick" in the sense that it contains
        all the logic and makes all the decisions.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This thickness is not a problem because the blueprint runs in its own process
        with its own security boundary. It is digest-verified before execution. It does
        not have access to the editor's state. It is versioned and pinnable. The
        complexity is contained and controlled.
      </p>

      <NoteBlock type="info" title="Analogy: Microservice Architecture">
        The thin plugin / thick blueprint pattern is analogous to the API gateway /
        microservice pattern in web architecture. The API gateway (plugin) is thin:
        it routes requests, handles authentication at the edge, and forwards to
        backend services. The backend service (blueprint) is thick: it contains all
        the business logic. The thin gateway can be deployed infrequently; the thick
        backend can be deployed independently and frequently.
      </NoteBlock>

      <WarningBlock title="Do Not Add Logic to the Plugin">
        If you are extending NemoClaw (for example, adding a custom command), add the
        logic to the blueprint side, not the plugin side. The plugin should only
        forward the command over IPC. Adding logic to the plugin means that logic
        cannot be versioned, digest-verified, or audited independently. It also means
        every change requires an extension update and editor restart.
      </WarningBlock>

      <ExerciseBlock
        question="A developer wants to add support for a new LLM provider (Mistral) to NemoClaw. Where should the implementation go?"
        options={[
          'In the TypeScript plugin, since it registers the inference provider',
          'In the Python blueprint, since it handles inference routing and credential management',
          'Split between both -- the plugin handles Mistral-specific formatting, the blueprint handles credentials',
          'In a separate extension that communicates with both the plugin and blueprint',
        ]}
        correctIndex={1}
        explanation="New provider support belongs entirely in the blueprint. The plugin does not know or care which provider is configured -- it forwards all inference requests identically over IPC. The blueprint determines the provider, attaches the correct credentials, and routes to the correct endpoint. This is exactly why the thin plugin design exists: adding Mistral support requires zero changes to the plugin and zero editor restarts."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Architecture Decision Records',
            url: 'https://github.com/NVIDIA/NemoClaw/tree/main/docs/adr',
            type: 'github',
            description: 'ADR-001: Thin plugin / thick blueprint separation of concerns.',
          },
          {
            title: 'The Twelve-Factor App: Admin Processes',
            url: 'https://12factor.net/admin-processes',
            type: 'article',
            description: 'Relevant background on separating integration code from business logic.',
          },
        ]}
      />
    </div>
  );
}
