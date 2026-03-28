import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, ExerciseBlock, StepBlock, ReferenceList } from '../../../components/content';

export default function SupplyChainSafety() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Supply Chain Safety
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Autonomous agents amplify supply chain risk. A human developer who installs a
        compromised package might notice something odd. An agent executing autonomously
        inside a sandbox cannot exercise that judgment. If the orchestration layer itself
        is compromised -- if the blueprint that configures the sandbox has been tampered
        with -- the entire security model collapses. NemoClaw addresses this with
        immutable blueprints and cryptographic digest verification.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        The Threat Model
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Consider what an attacker could achieve by tampering with a NemoClaw blueprint:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Weaken sandbox policies</strong> -- open additional filesystem paths,
          allow dangerous syscalls, or add network endpoints to the allowlist
        </li>
        <li>
          <strong>Exfiltrate credentials</strong> -- modify the inference routing to send
          API keys to an attacker-controlled endpoint
        </li>
        <li>
          <strong>Inject code</strong> -- add malicious logic that runs during sandbox setup,
          with host-level privileges
        </li>
        <li>
          <strong>Redirect inference</strong> -- route inference requests to a malicious
          endpoint that returns poisoned completions
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        These attacks are particularly dangerous because they are <em>invisible</em> to
        the agent and to the user. The sandbox appears to be working normally, but its
        security guarantees have been silently removed.
      </p>

      <WarningBlock title="Why This Matters More for Agents">
        A human developer who SSH-es into a server can notice if something feels wrong.
        An autonomous agent running a multi-hour task inside a sandbox has no such
        intuition. It will faithfully execute whatever the orchestration layer tells it
        to do. If that orchestration layer has been compromised, the agent becomes a
        tool for the attacker.
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Immutable Blueprints
      </h2>

      <DefinitionBlock
        term="Immutable Blueprint"
        definition="Once a blueprint version is published to the registry, its contents cannot be changed. There is no mechanism for overwriting a version. If a bug is found, a new version must be published. This is enforced at the registry level -- the registry rejects uploads to existing version numbers."
        example="Blueprint v0.8.2 was published on 2025-11-15. To fix a bug in v0.8.2, the team must publish v0.8.3. Version 0.8.2 will always contain exactly the same bytes, forever."
        seeAlso={['Semantic Versioning', 'Digest Verification', 'Registry']}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Immutability alone does not prevent attacks -- it just prevents <em>silent
        modification</em> of already-released versions. An attacker who compromises the
        registry could still publish a malicious version with a new number. That is
        where digest verification comes in.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Digest Verification
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Every published blueprint has an associated SHA-256 digest that is computed from
        the entirety of the package contents. This digest is stored in multiple places:
        the registry manifest, the NemoClaw documentation, and (for critical versions)
        signed by NVIDIA's release key. Before NemoClaw executes a blueprint, it
        recomputes the digest and compares it to the expected value.
      </p>

      <StepBlock
        title="Digest Verification Process"
        steps={[
          {
            title: 'Fetch the expected digest',
            content: 'NemoClaw retrieves the expected digest from the registry manifest. For pinned versions, the digest can also be specified directly in the project configuration.',
            code: `# .nemoclaw/config.yaml -- optional digest pinning
blueprint:
  version: "0.8.2"
  digest: "sha256:a3f8c1d4e5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1"`,
            language: 'yaml',
          },
          {
            title: 'Compute the actual digest',
            content: 'NemoClaw reads the entire blueprint package from disk and computes its SHA-256 hash. This includes all Python source files, configuration templates, and metadata.',
            code: `# Equivalent to what NemoClaw does internally
sha256sum /var/lib/nemoclaw/blueprints/0.8.2.tar.gz
# a3f8c1d4e5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1`,
            language: 'bash',
          },
          {
            title: 'Compare and decide',
            content: 'If the digests match, execution proceeds normally. If they do not match, NemoClaw refuses to execute and reports a verification failure. There is no override flag, no --force, no way to skip this check.',
          },
        ]}
      />

      <CodeBlock
        title="Verification in action"
        language="bash"
        code={`$ nemoclaw apply
Resolving blueprint... v0.8.2 (cached)
Verifying blueprint integrity...
  Expected: sha256:a3f8c1d4e5b6...
  Computed: sha256:a3f8c1d4e5b6...
  Result:   PASS

Planning sandbox configuration...
# ... continues normally

$ # Now simulate a tampered blueprint
$ nemoclaw apply
Resolving blueprint... v0.8.2 (cached)
Verifying blueprint integrity...
  Expected: sha256:a3f8c1d4e5b6...
  Computed: sha256:7b2e4f9a1c3d...
  Result:   FAIL

FATAL: Blueprint integrity check failed.
The cached blueprint does not match the expected digest.
This may indicate a corrupted download or a supply chain attack.

Actions:
  1. Run 'nemoclaw blueprint purge 0.8.2' to clear the cache
  2. Run 'nemoclaw blueprint fetch 0.8.2' to re-download
  3. If the mismatch persists, report to your security team`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        No Override by Design
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A deliberate design choice in NemoClaw is that there is no flag to skip digest
        verification. Other tools sometimes provide <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">--skip-verify</code> or
        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">--no-check</code> flags
        for convenience during development. NemoClaw does not. The reasoning is
        straightforward: if you can skip verification during development, you can
        accidentally ship a CI pipeline that skips verification in production. The
        inconvenience of always verifying is the point.
      </p>

      <NoteBlock type="tip" title="Local Development Workflow">
        For local development of custom blueprints, use{' '}
        <code>nemoclaw blueprint dev ./my-blueprint</code> which loads a blueprint from
        a local directory instead of the registry. In dev mode, the digest is computed
        fresh on every apply (since the files are changing), but the verification
        mechanism is still active -- it just verifies against a locally computed
        manifest rather than a registry manifest.
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        Defense in Depth
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Digest verification is one layer of defense. NemoClaw also employs:
      </p>

      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
        <li>
          <strong>TLS pinning</strong> for registry communication -- prevents
          man-in-the-middle attacks during blueprint download
        </li>
        <li>
          <strong>Minimal dependency surface</strong> -- the blueprint has few external
          Python dependencies, reducing the attack surface
        </li>
        <li>
          <strong>Signed releases</strong> -- major versions are signed with NVIDIA's
          GPG key, providing an additional verification path independent of the registry
        </li>
        <li>
          <strong>Audit logging</strong> -- every blueprint resolution, verification,
          and application is logged with timestamps and digests, creating a forensic
          trail
        </li>
      </ul>

      <ExerciseBlock
        question="Why does NemoClaw refuse to provide a --skip-verify flag for digest verification?"
        options={[
          'It would make the codebase more complex to maintain',
          'If skipping is possible during development, it can accidentally be left on in production, undermining the entire security model',
          'The verification is so fast that skipping it would not save any time',
          'NVIDIA licensing requires verification to be mandatory',
        ]}
        correctIndex={1}
        explanation="The core design principle is that security mechanisms should not have convenience bypasses. If a --skip-verify flag existed, it would inevitably appear in CI scripts, developer dotfiles, and deployment configurations. The small inconvenience of always-on verification prevents a large class of accidental security regressions."
      />

      <ReferenceList
        references={[
          {
            title: 'NemoClaw Supply Chain Security',
            url: 'https://docs.nvidia.com/nemoclaw/security/supply-chain',
            type: 'docs',
            description: 'Official documentation on immutable blueprints, digest verification, and signed releases.',
          },
          {
            title: 'SLSA Framework',
            url: 'https://slsa.dev/',
            type: 'docs',
            description: 'Supply chain Levels for Software Artifacts -- the industry framework that influenced NemoClaw\'s design.',
          },
        ]}
      />
    </div>
  );
}
