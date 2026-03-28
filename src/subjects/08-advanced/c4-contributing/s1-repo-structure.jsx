import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable } from '../../../components/content'

export default function RepoStructure() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        NemoClaw Repository Structure
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw is an open-source project hosted on GitHub. Understanding the repository
        structure is the first step toward contributing -- whether you are fixing a bug, adding
        a feature, improving documentation, or reviewing pull requests. This section maps out
        the key directories, explains the build system, and covers the development prerequisites
        you need to get a working development environment.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Repository Overview
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw is a monorepo containing multiple components. The main binary (the NemoClaw
        CLI), the sandbox runtime, the TUI interface, the policy engine, built-in blueprints,
        and the test suite all live in a single repository. This monorepo approach ensures
        that all components are versioned together and that cross-component changes can be
        made in a single pull request.
      </p>

      <CodeBlock
        language="text"
        title="Top-level directory structure"
      >{`nemoclaw/
├── .github/                    # GitHub Actions CI/CD workflows
│   ├── workflows/
│   │   ├── ci.yml              # Main CI pipeline (lint, test, build)
│   │   ├── release.yml         # Release automation
│   │   └── security-scan.yml   # Automated security scanning
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── cmd/                        # Entry points for CLI binaries
│   └── nemoclaw/
│       └── main.go             # Main entry point
│
├── internal/                   # Internal packages (not importable externally)
│   ├── agent/                  # Agent runtime and lifecycle management
│   │   ├── agent.go
│   │   ├── session.go
│   │   └── tools.go
│   ├── blueprint/              # Blueprint loading, validation, resolution
│   │   ├── loader.go
│   │   ├── resolver.go
│   │   ├── schema.go
│   │   └── validator.go
│   ├── llm/                    # LLM client abstraction layer
│   │   ├── client.go
│   │   ├── openai.go           # OpenAI-compatible API client
│   │   └── streaming.go
│   ├── policy/                 # Policy engine (network, filesystem, resources)
│   │   ├── engine.go
│   │   ├── network.go
│   │   ├── filesystem.go
│   │   ├── resources.go
│   │   └── parser.go
│   ├── sandbox/                # Sandbox creation and management
│   │   ├── sandbox.go
│   │   ├── landlock.go         # Landlock ruleset management
│   │   ├── seccomp.go          # Seccomp profile loading and application
│   │   ├── netns.go            # Network namespace setup
│   │   └── cgroup.go           # Cgroup resource limits
│   ├── tui/                    # Terminal user interface
│   │   ├── app.go
│   │   ├── views/
│   │   ├── components/
│   │   └── styles.go
│   └── mcp/                    # MCP (Model Context Protocol) integration
│       ├── server.go
│       ├── transport.go
│       └── tools.go
│
├── pkg/                        # Public packages (importable by other projects)
│   ├── config/                 # Configuration types and defaults
│   ├── types/                  # Shared type definitions
│   └── version/                # Version information
│
├── blueprints/                 # Built-in blueprints
│   ├── default/
│   │   └── blueprint.yaml
│   ├── coding-agent/
│   │   ├── blueprint.yaml
│   │   └── system-prompt.md
│   └── research-agent/
│       ├── blueprint.yaml
│       └── system-prompt.md
│
├── seccomp/                    # Seccomp profile definitions
│   ├── default.json
│   ├── strict.json
│   └── permissive.json
│
├── tests/                      # Integration and end-to-end tests
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
│
├── docs/                       # Developer documentation
│   ├── architecture.md
│   ├── contributing.md
│   └── security-model.md
│
├── scripts/                    # Build and development scripts
│   ├── build.sh
│   ├── test.sh
│   ├── lint.sh
│   └── release.sh
│
├── go.mod                      # Go module definition
├── go.sum                      # Go dependency checksums
├── Makefile                    # Build targets
├── Dockerfile                  # Container build
├── LICENSE                     # Apache 2.0
└── README.md`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Key Directories in Detail
      </h2>

      <ComparisonTable
        title="Key Directories and Their Purpose"
        headers={['Directory', 'Language', 'Purpose']}
        rows={[
          ['cmd/nemoclaw/', 'Go', 'CLI entry point. Parses flags, initializes components, dispatches commands.'],
          ['internal/agent/', 'Go', 'Agent lifecycle: creating sessions, managing tool calls, handling turns.'],
          ['internal/sandbox/', 'Go + C (CGO)', 'Core sandbox: Landlock, seccomp, network namespaces, cgroups. Most security-critical code lives here.'],
          ['internal/policy/', 'Go', 'Policy engine: parses YAML policies, resolves rules, generates sandbox configuration.'],
          ['internal/tui/', 'Go', 'Terminal UI built with Bubble Tea. Views for agent output, network monitor, debug panel.'],
          ['internal/llm/', 'Go', 'LLM client: handles API calls, streaming, retries, token counting.'],
          ['internal/mcp/', 'Go', 'MCP integration: manages MCP server lifecycle and tool routing.'],
          ['blueprints/', 'YAML', 'Built-in blueprints shipped with the binary.'],
          ['tests/', 'Go + Shell', 'Integration tests that run real sandboxes and verify security properties.'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Build System
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw is written primarily in Go, with some CGO code for the Landlock and seccomp
        interfaces that call into the Linux kernel. The build system uses a Makefile that wraps
        standard Go tooling with additional targets for linting, testing, and cross-compilation.
      </p>

      <CodeBlock
        language="bash"
        title="Key Makefile targets"
      >{`# Build the nemoclaw binary
make build
# Output: ./bin/nemoclaw

# Run all tests (unit + integration)
make test

# Run only unit tests (fast, no sandbox required)
make test-unit

# Run integration tests (requires Linux with Landlock support)
make test-integration

# Run the linter (golangci-lint)
make lint

# Format all code
make fmt

# Build for multiple platforms
make build-all
# Output: ./bin/nemoclaw-linux-amd64, ./bin/nemoclaw-linux-arm64

# Generate the seccomp profile schemas
make generate

# Build the Docker image
make docker

# Clean build artifacts
make clean`}</CodeBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Development Prerequisites
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        To build and test NemoClaw from source, you need the following tools and system
        requirements:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Go 1.22+:</span> NemoClaw uses modern Go features
          including generics, structured logging (slog), and the new range-over-func syntax.
          Install from go.dev or use your system package manager.
        </li>
        <li>
          <span className="font-semibold">Linux kernel 5.13+:</span> Required for Landlock
          support. Kernel 6.7+ is recommended for full feature support including Landlock
          network control. macOS and Windows are not supported for running sandboxes (the CLI
          can cross-compile but cannot execute sandboxes).
        </li>
        <li>
          <span className="font-semibold">GCC or Clang:</span> Required for CGO compilation of
          the Landlock and seccomp interfaces. Install via build-essential (Debian/Ubuntu) or
          gcc (RHEL/Fedora).
        </li>
        <li>
          <span className="font-semibold">libseccomp-dev:</span> Development headers for the
          seccomp library. Install via apt install libseccomp-dev or equivalent.
        </li>
        <li>
          <span className="font-semibold">golangci-lint:</span> For running the linter.
          Install from golangci-lint.run or via make install-tools.
        </li>
        <li>
          <span className="font-semibold">Docker (optional):</span> For building container
          images and running containerized integration tests.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Setting up the development environment"
      >{`# Clone the repository
git clone https://github.com/nemoclaw/nemoclaw.git
cd nemoclaw

# Install Go dependencies
go mod download

# Install development tools
make install-tools

# Verify the build works
make build

# Run the unit tests
make test-unit

# Run the full test suite (requires root for namespace operations)
sudo make test-integration`}</CodeBlock>

      <NoteBlock type="info" title="Running Tests Without Root">
        <p>
          Many integration tests require root privileges because they create network namespaces
          and apply Landlock/seccomp rules. However, the unit tests run without root and cover
          the policy parsing, blueprint validation, LLM client, and TUI logic. If you are
          working on non-sandbox code, you can iterate quickly with make test-unit. For sandbox
          changes, you will need to run the integration tests with sudo or in a VM/container
          where you have root access.
        </p>
      </NoteBlock>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With the repository cloned and the development environment set up, you are ready to
        explore the codebase, understand the architecture, and start making changes. The next
        sections cover how to file effective issues and contribute code through pull requests.
      </p>
    </div>
  )
}
