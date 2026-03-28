import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock } from '../../../components/content'

export default function ContributingCode() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Contributing Code to NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Contributing code to NemoClaw follows the standard open-source fork-and-pull-request
        workflow, with some project-specific conventions around code style, testing requirements,
        and review criteria. This section walks through the complete contribution lifecycle:
        from forking the repository to getting your pull request merged.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Fork, Clone, and Branch
      </h2>

      <StepBlock number={1} title="Fork and clone the repository">
        <CodeBlock language="bash">{`# Fork on GitHub (click the "Fork" button), then clone your fork
git clone https://github.com/YOUR-USERNAME/nemoclaw.git
cd nemoclaw

# Add the upstream remote for syncing
git remote add upstream https://github.com/nemoclaw/nemoclaw.git

# Verify remotes
git remote -v
# origin    https://github.com/YOUR-USERNAME/nemoclaw.git (fetch)
# origin    https://github.com/YOUR-USERNAME/nemoclaw.git (push)
# upstream  https://github.com/nemoclaw/nemoclaw.git (fetch)
# upstream  https://github.com/nemoclaw/nemoclaw.git (push)`}</CodeBlock>
      </StepBlock>

      <StepBlock number={2} title="Create a feature branch">
        <p>
          Always create a branch from the latest main. Branch names should be descriptive and
          follow the convention: type/short-description.
        </p>
        <CodeBlock language="bash">{`# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b fix/landlock-symlink-resolution

# Branch naming conventions:
# fix/description     - Bug fixes
# feat/description    - New features
# docs/description    - Documentation changes
# refactor/description - Code refactoring
# test/description    - Test additions or fixes`}</CodeBlock>
      </StepBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Code Style and Conventions
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw follows standard Go conventions with some project-specific additions. Adhering
        to these conventions makes your PR easier to review and more likely to be accepted
        without extensive revision requests.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Formatting:</span> All Go code must pass gofmt and
          goimports. Run make fmt before committing. The CI pipeline will reject PRs with
          formatting issues.
        </li>
        <li>
          <span className="font-semibold">Linting:</span> NemoClaw uses golangci-lint with a
          project-specific configuration (.golangci.yml). Run make lint locally before pushing
          to catch issues early.
        </li>
        <li>
          <span className="font-semibold">Error handling:</span> Use Go's standard error
          wrapping with fmt.Errorf("context: %w", err). Do not discard errors silently. Every
          error path should either be handled or propagated with context.
        </li>
        <li>
          <span className="font-semibold">Logging:</span> Use the project's structured logger
          (based on slog). Do not use fmt.Println for logging. Log levels should match their
          content: Debug for verbose diagnostic info, Info for normal operational events, Warn
          for recoverable issues, Error for failures.
        </li>
        <li>
          <span className="font-semibold">Comments:</span> All exported functions, types, and
          constants must have Go doc comments. Complex internal logic should have comments
          explaining the "why", not the "what".
        </li>
        <li>
          <span className="font-semibold">Security-critical code:</span> Code in the sandbox
          package (Landlock, seccomp, namespace setup) requires extra scrutiny. Changes here
          must include a security rationale in the PR description and will require review from
          a security-focused maintainer.
        </li>
      </ul>

      <CodeBlock
        language="go"
        title="Code style example"
      >{`// ResolveBlueprint finds and loads a blueprint by name or path.
// It searches the resolution chain: explicit path, local directory,
// project directory, then built-in blueprints.
func ResolveBlueprint(nameOrPath string) (*Blueprint, error) {
	// Try explicit path first -- if it looks like a filesystem path,
	// load it directly without searching the resolution chain.
	if isFilesystemPath(nameOrPath) {
		bp, err := loadFromPath(nameOrPath)
		if err != nil {
			return nil, fmt.Errorf("loading blueprint from path %q: %w", nameOrPath, err)
		}
		return bp, nil
	}

	// Search the resolution chain for a matching blueprint name.
	for _, dir := range resolutionDirs() {
		candidate := filepath.Join(dir, nameOrPath, "blueprint.yaml")
		if _, err := os.Stat(candidate); err == nil {
			slog.Debug("found blueprint", "name", nameOrPath, "path", candidate)
			return loadFromPath(filepath.Dir(candidate))
		}
	}

	return nil, fmt.Errorf("blueprint %q not found in resolution chain", nameOrPath)
}`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Writing Tests
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        All code changes must include tests. The type of test depends on what you are changing:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Unit tests:</span> For pure logic (policy parsing,
          configuration validation, type conversions). These run without root privileges and
          without network access. Place them next to the code: foo_test.go alongside foo.go.
        </li>
        <li>
          <span className="font-semibold">Integration tests:</span> For code that interacts
          with the kernel (Landlock, seccomp, namespaces). These require root and a Linux kernel
          with appropriate features. Place them in tests/integration/.
        </li>
        <li>
          <span className="font-semibold">End-to-end tests:</span> For testing the full
          NemoClaw workflow (start sandbox, run agent, verify behavior). These are slower and
          require a running LLM endpoint. Place them in tests/e2e/.
        </li>
      </ul>

      <CodeBlock
        language="go"
        title="Example test"
      >{`func TestResolveBlueprintByName(t *testing.T) {
	// Set up a temporary blueprints directory
	tmpDir := t.TempDir()
	bpDir := filepath.Join(tmpDir, "test-bp")
	os.MkdirAll(bpDir, 0755)
	os.WriteFile(
		filepath.Join(bpDir, "blueprint.yaml"),
		[]byte("name: test-bp\nversion: 1.0.0\n"),
		0644,
	)

	// Override the resolution chain to use our temp directory
	t.Setenv("NEMOCLAW_BLUEPRINTS_DIR", tmpDir)

	// Test resolution by name
	bp, err := ResolveBlueprint("test-bp")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if bp.Name != "test-bp" {
		t.Errorf("expected name 'test-bp', got %q", bp.Name)
	}
}

func TestResolveBlueprintNotFound(t *testing.T) {
	t.Setenv("NEMOCLAW_BLUEPRINTS_DIR", t.TempDir())

	_, err := ResolveBlueprint("nonexistent")
	if err == nil {
		t.Fatal("expected error for nonexistent blueprint")
	}
	if !strings.Contains(err.Error(), "not found") {
		t.Errorf("expected 'not found' error, got: %v", err)
	}
}`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Submitting a Pull Request
      </h2>

      <StepBlock number={3} title="Commit, push, and open a PR">
        <CodeBlock language="bash">{`# Stage your changes
git add internal/blueprint/resolver.go internal/blueprint/resolver_test.go

# Commit with a descriptive message
git commit -m "fix: resolve symlinks in blueprint path lookup

When a blueprint path contains symlinks, the resolver now follows
them to the real path before checking for blueprint.yaml. This
fixes #1234 where blueprints in symlinked directories were not
found.

Also adds test cases for symlink resolution."

# Push to your fork
git push origin fix/landlock-symlink-resolution

# Open a pull request on GitHub
# The PR description should include:
# - What the change does
# - Why it is needed (link to issue)
# - How it was tested
# - Any security implications`}</CodeBlock>
      </StepBlock>

      <CodeBlock
        language="markdown"
        title="Pull request description template"
      >{`## What

Fix symlink resolution in blueprint path lookup.

## Why

Resolves #1234. When blueprints are stored in directories accessed
via symlinks (common in NixOS and some container setups), the
resolver failed to find them because it checked the symlink path
rather than the resolved real path.

## How

Changed \`ResolveBlueprint\` to call \`filepath.EvalSymlinks\` on
the candidate path before checking for \`blueprint.yaml\`.

## Testing

- Added unit tests for symlink resolution (both single and chained symlinks)
- Tested manually on NixOS with a symlinked blueprints directory
- All existing tests pass

## Security implications

None. This change affects blueprint resolution only, not sandbox
security boundaries. The resolved path is still validated against
the same directory constraints.`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        CI Requirements and Review Process
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When you open a PR, the CI pipeline runs automatically. All checks must pass before
        the PR can be merged. The pipeline includes:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Build:</span> Compiles the binary for Linux amd64
          and arm64.
        </li>
        <li>
          <span className="font-semibold">Lint:</span> Runs golangci-lint with the project
          configuration.
        </li>
        <li>
          <span className="font-semibold">Unit tests:</span> Runs all unit tests with race
          detector enabled.
        </li>
        <li>
          <span className="font-semibold">Integration tests:</span> Runs sandbox integration
          tests in a privileged CI environment.
        </li>
        <li>
          <span className="font-semibold">Security scan:</span> Runs gosec and checks for
          known vulnerabilities in dependencies.
        </li>
        <li>
          <span className="font-semibold">Coverage:</span> Reports test coverage. Coverage
          must not decrease from the base branch.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        After CI passes, one or two maintainers will review your code. They may request changes,
        ask questions, or suggest improvements. The review process is collaborative, not
        adversarial -- reviewers want your contribution to succeed. Address review comments by
        pushing additional commits to your branch (do not force-push or squash during review,
        as it makes it harder for reviewers to see what changed). The maintainers will squash
        the commits when merging.
      </p>

      <WarningBlock title="DCO Sign-Off Required">
        <p>
          NemoClaw requires a Developer Certificate of Origin (DCO) sign-off on all commits.
          This certifies that you have the right to submit the code under the project's license.
          Add -s to your git commit command to include the sign-off line automatically:
          git commit -s -m "your message". The CI pipeline checks for the sign-off and will
          fail if it is missing.
        </p>
      </WarningBlock>

      <ExerciseBlock
        title="Make Your First Contribution"
        difficulty="intermediate"
      >
        <ol className="list-decimal list-inside space-y-2 mt-2">
          <li>Fork and clone the NemoClaw repository.</li>
          <li>Set up the development environment and verify make build succeeds.</li>
          <li>Find an issue labeled "good-first-issue" on the GitHub issue tracker.</li>
          <li>Create a feature branch, implement the fix, and write tests.</li>
          <li>Run make lint and make test-unit to verify your changes pass.</li>
          <li>Open a pull request with a clear description following the template above.</li>
        </ol>
      </ExerciseBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Contributing code is the most direct way to shape the future of NemoClaw. Every merged
        pull request -- whether it fixes a typo in a comment or redesigns a core subsystem --
        makes the project better for everyone who uses it. The final section covers the NemoClaw
        community beyond code: the Discord server where contributors and users connect, discuss,
        and collaborate.
      </p>
    </div>
  )
}
