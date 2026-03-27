import { Suspense, lazy, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import curriculum from '../subjects/index.js'
import Breadcrumbs from '../components/navigation/Breadcrumbs'
import PrevNextNav from '../components/navigation/PrevNextNav'
import { getAdjacentSections } from '../utils/curriculum.js'
import useAppStore from '../store/appStore'
import NotFoundPage from './NotFoundPage'

// ---------------------------------------------------------------------------
// CONTENT_REGISTRY
// Maps "subjectDir/chapterDir/sectionId" to a lazy-loaded component.
// ---------------------------------------------------------------------------
const CONTENT_REGISTRY = {
  // ========================================================================
  // 01-foundations
  // ========================================================================
  // c1-agent-safety
  '01-foundations/c1-agent-safety/s1-rise-of-agents': lazy(() => import('../subjects/01-foundations/c1-agent-safety/s1-rise-of-agents')),
  '01-foundations/c1-agent-safety/s2-risks-unrestricted': lazy(() => import('../subjects/01-foundations/c1-agent-safety/s2-risks-unrestricted')),
  '01-foundations/c1-agent-safety/s3-need-for-sandboxing': lazy(() => import('../subjects/01-foundations/c1-agent-safety/s3-need-for-sandboxing')),
  // c2-security-landscape
  '01-foundations/c2-security-landscape/s1-threat-models': lazy(() => import('../subjects/01-foundations/c2-security-landscape/s1-threat-models')),
  '01-foundations/c2-security-landscape/s2-isolation-strategies': lazy(() => import('../subjects/01-foundations/c2-security-landscape/s2-isolation-strategies')),
  '01-foundations/c2-security-landscape/s3-landlock-seccomp-namespaces': lazy(() => import('../subjects/01-foundations/c2-security-landscape/s3-landlock-seccomp-namespaces')),
  // c3-openclaw-vs-nemoclaw
  '01-foundations/c3-openclaw-vs-nemoclaw/s1-what-is-openclaw': lazy(() => import('../subjects/01-foundations/c3-openclaw-vs-nemoclaw/s1-what-is-openclaw')),
  '01-foundations/c3-openclaw-vs-nemoclaw/s2-what-is-nemoclaw': lazy(() => import('../subjects/01-foundations/c3-openclaw-vs-nemoclaw/s2-what-is-nemoclaw')),
  '01-foundations/c3-openclaw-vs-nemoclaw/s3-how-they-fit': lazy(() => import('../subjects/01-foundations/c3-openclaw-vs-nemoclaw/s3-how-they-fit')),
  '01-foundations/c3-openclaw-vs-nemoclaw/s4-comparison-table': lazy(() => import('../subjects/01-foundations/c3-openclaw-vs-nemoclaw/s4-comparison-table')),

  // ========================================================================
  // 02-openclaw
  // ========================================================================
  // c1-architecture
  '02-openclaw/c1-architecture/s1-core-components': lazy(() => import('../subjects/02-openclaw/c1-architecture/s1-core-components')),
  '02-openclaw/c1-architecture/s2-extension-system': lazy(() => import('../subjects/02-openclaw/c1-architecture/s2-extension-system')),
  '02-openclaw/c1-architecture/s3-mcp-servers': lazy(() => import('../subjects/02-openclaw/c1-architecture/s3-mcp-servers')),
  '02-openclaw/c1-architecture/s4-workspace-sessions': lazy(() => import('../subjects/02-openclaw/c1-architecture/s4-workspace-sessions')),
  // c2-features
  '02-openclaw/c2-features/s1-slash-commands': lazy(() => import('../subjects/02-openclaw/c2-features/s1-slash-commands')),
  '02-openclaw/c2-features/s2-hooks-system': lazy(() => import('../subjects/02-openclaw/c2-features/s2-hooks-system')),
  '02-openclaw/c2-features/s3-permission-modes': lazy(() => import('../subjects/02-openclaw/c2-features/s3-permission-modes')),
  '02-openclaw/c2-features/s4-multi-agent': lazy(() => import('../subjects/02-openclaw/c2-features/s4-multi-agent')),
  // c3-configuration
  '02-openclaw/c3-configuration/s1-settings-hierarchy': lazy(() => import('../subjects/02-openclaw/c3-configuration/s1-settings-hierarchy')),
  '02-openclaw/c3-configuration/s2-environment-variables': lazy(() => import('../subjects/02-openclaw/c3-configuration/s2-environment-variables')),
  '02-openclaw/c3-configuration/s3-custom-instructions': lazy(() => import('../subjects/02-openclaw/c3-configuration/s3-custom-instructions')),
  '02-openclaw/c3-configuration/s4-ide-integrations': lazy(() => import('../subjects/02-openclaw/c3-configuration/s4-ide-integrations')),
  // c4-limitations
  '02-openclaw/c4-limitations/s1-unrestricted-network': lazy(() => import('../subjects/02-openclaw/c4-limitations/s1-unrestricted-network')),
  '02-openclaw/c4-limitations/s2-filesystem-exposure': lazy(() => import('../subjects/02-openclaw/c4-limitations/s2-filesystem-exposure')),
  '02-openclaw/c4-limitations/s3-credential-risks': lazy(() => import('../subjects/02-openclaw/c4-limitations/s3-credential-risks')),
  '02-openclaw/c4-limitations/s4-why-nemoclaw': lazy(() => import('../subjects/02-openclaw/c4-limitations/s4-why-nemoclaw')),

  // ========================================================================
  // 03-nemoclaw-architecture
  // ========================================================================
  // c1-architecture
  '03-nemoclaw-architecture/c1-architecture/s1-two-component-design': lazy(() => import('../subjects/03-nemoclaw-architecture/c1-architecture/s1-two-component-design')),
  '03-nemoclaw-architecture/c1-architecture/s2-blueprint-lifecycle': lazy(() => import('../subjects/03-nemoclaw-architecture/c1-architecture/s2-blueprint-lifecycle')),
  '03-nemoclaw-architecture/c1-architecture/s3-inference-flow': lazy(() => import('../subjects/03-nemoclaw-architecture/c1-architecture/s3-inference-flow')),
  '03-nemoclaw-architecture/c1-architecture/s4-supply-chain-safety': lazy(() => import('../subjects/03-nemoclaw-architecture/c1-architecture/s4-supply-chain-safety')),
  // c2-openshell
  '03-nemoclaw-architecture/c2-openshell/s1-what-is-openshell': lazy(() => import('../subjects/03-nemoclaw-architecture/c2-openshell/s1-what-is-openshell')),
  '03-nemoclaw-architecture/c2-openshell/s2-landlock-enforcement': lazy(() => import('../subjects/03-nemoclaw-architecture/c2-openshell/s2-landlock-enforcement')),
  '03-nemoclaw-architecture/c2-openshell/s3-seccomp-filters': lazy(() => import('../subjects/03-nemoclaw-architecture/c2-openshell/s3-seccomp-filters')),
  '03-nemoclaw-architecture/c2-openshell/s4-network-namespaces': lazy(() => import('../subjects/03-nemoclaw-architecture/c2-openshell/s4-network-namespaces')),
  '03-nemoclaw-architecture/c2-openshell/s5-openshell-tui': lazy(() => import('../subjects/03-nemoclaw-architecture/c2-openshell/s5-openshell-tui')),
  // c3-plugin-blueprint
  '03-nemoclaw-architecture/c3-plugin-blueprint/s1-plugin-internals': lazy(() => import('../subjects/03-nemoclaw-architecture/c3-plugin-blueprint/s1-plugin-internals')),
  '03-nemoclaw-architecture/c3-plugin-blueprint/s2-blueprint-versioning': lazy(() => import('../subjects/03-nemoclaw-architecture/c3-plugin-blueprint/s2-blueprint-versioning')),
  '03-nemoclaw-architecture/c3-plugin-blueprint/s3-thin-plugin-philosophy': lazy(() => import('../subjects/03-nemoclaw-architecture/c3-plugin-blueprint/s3-thin-plugin-philosophy')),
  '03-nemoclaw-architecture/c3-plugin-blueprint/s4-reproducible-environments': lazy(() => import('../subjects/03-nemoclaw-architecture/c3-plugin-blueprint/s4-reproducible-environments')),
  // c4-inference
  '03-nemoclaw-architecture/c4-inference/s1-nvidia-nemotron': lazy(() => import('../subjects/03-nemoclaw-architecture/c4-inference/s1-nvidia-nemotron')),
  '03-nemoclaw-architecture/c4-inference/s2-openai-anthropic': lazy(() => import('../subjects/03-nemoclaw-architecture/c4-inference/s2-openai-anthropic')),
  '03-nemoclaw-architecture/c4-inference/s3-google-gemini': lazy(() => import('../subjects/03-nemoclaw-architecture/c4-inference/s3-google-gemini')),
  '03-nemoclaw-architecture/c4-inference/s4-local-inference': lazy(() => import('../subjects/03-nemoclaw-architecture/c4-inference/s4-local-inference')),
  '03-nemoclaw-architecture/c4-inference/s5-custom-endpoints': lazy(() => import('../subjects/03-nemoclaw-architecture/c4-inference/s5-custom-endpoints')),
  '03-nemoclaw-architecture/c4-inference/s6-credential-isolation': lazy(() => import('../subjects/03-nemoclaw-architecture/c4-inference/s6-credential-isolation')),

  // ========================================================================
  // 04-policies
  // ========================================================================
  // c1-network-policy
  '04-policies/c1-network-policy/s1-deny-by-default': lazy(() => import('../subjects/04-policies/c1-network-policy/s1-deny-by-default')),
  '04-policies/c1-network-policy/s2-yaml-structure': lazy(() => import('../subjects/04-policies/c1-network-policy/s2-yaml-structure')),
  '04-policies/c1-network-policy/s3-default-policy-groups': lazy(() => import('../subjects/04-policies/c1-network-policy/s3-default-policy-groups')),
  '04-policies/c1-network-policy/s4-tls-enforcement': lazy(() => import('../subjects/04-policies/c1-network-policy/s4-tls-enforcement')),
  // c2-filesystem-policy
  '04-policies/c2-filesystem-policy/s1-readwrite-zones': lazy(() => import('../subjects/04-policies/c2-filesystem-policy/s1-readwrite-zones')),
  '04-policies/c2-filesystem-policy/s2-readonly-zones': lazy(() => import('../subjects/04-policies/c2-filesystem-policy/s2-readonly-zones')),
  '04-policies/c2-filesystem-policy/s3-landlock-internals': lazy(() => import('../subjects/04-policies/c2-filesystem-policy/s3-landlock-internals')),
  '04-policies/c2-filesystem-policy/s4-custom-filesystem': lazy(() => import('../subjects/04-policies/c2-filesystem-policy/s4-custom-filesystem')),
  // c3-policy-modification
  '04-policies/c3-policy-modification/s1-static-changes': lazy(() => import('../subjects/04-policies/c3-policy-modification/s1-static-changes')),
  '04-policies/c3-policy-modification/s2-dynamic-policies': lazy(() => import('../subjects/04-policies/c3-policy-modification/s2-dynamic-policies')),
  '04-policies/c3-policy-modification/s3-session-vs-baseline': lazy(() => import('../subjects/04-policies/c3-policy-modification/s3-session-vs-baseline')),
  '04-policies/c3-policy-modification/s4-policy-presets': lazy(() => import('../subjects/04-policies/c3-policy-modification/s4-policy-presets')),
  // c4-operator-approval
  '04-policies/c4-operator-approval/s1-blocked-requests-tui': lazy(() => import('../subjects/04-policies/c4-operator-approval/s1-blocked-requests-tui')),
  '04-policies/c4-operator-approval/s2-approve-deny-realtime': lazy(() => import('../subjects/04-policies/c4-operator-approval/s2-approve-deny-realtime')),
  '04-policies/c4-operator-approval/s3-session-vs-persistent': lazy(() => import('../subjects/04-policies/c4-operator-approval/s3-session-vs-persistent')),
  '04-policies/c4-operator-approval/s4-audit-logging': lazy(() => import('../subjects/04-policies/c4-operator-approval/s4-audit-logging')),
  // c5-custom-policies
  '04-policies/c5-custom-policies/s1-yaml-schema': lazy(() => import('../subjects/04-policies/c5-custom-policies/s1-yaml-schema')),
  '04-policies/c5-custom-policies/s2-whitelisting-endpoints': lazy(() => import('../subjects/04-policies/c5-custom-policies/s2-whitelisting-endpoints')),
  '04-policies/c5-custom-policies/s3-creating-presets': lazy(() => import('../subjects/04-policies/c5-custom-policies/s3-creating-presets')),
  '04-policies/c5-custom-policies/s4-testing-policies': lazy(() => import('../subjects/04-policies/c5-custom-policies/s4-testing-policies')),
  '04-policies/c5-custom-policies/s5-best-practices': lazy(() => import('../subjects/04-policies/c5-custom-policies/s5-best-practices')),

  // ========================================================================
  // 05-bare-metal
  // ========================================================================
  // c1-prerequisites
  '05-bare-metal/c1-prerequisites/s1-hardware-requirements': lazy(() => import('../subjects/05-bare-metal/c1-prerequisites/s1-hardware-requirements')),
  '05-bare-metal/c1-prerequisites/s2-software-requirements': lazy(() => import('../subjects/05-bare-metal/c1-prerequisites/s2-software-requirements')),
  '05-bare-metal/c1-prerequisites/s3-supported-distros': lazy(() => import('../subjects/05-bare-metal/c1-prerequisites/s3-supported-distros')),
  // c2-ubuntu-22
  '05-bare-metal/c2-ubuntu-22/s1-installing-deps': lazy(() => import('../subjects/05-bare-metal/c2-ubuntu-22/s1-installing-deps')),
  '05-bare-metal/c2-ubuntu-22/s2-docker-config': lazy(() => import('../subjects/05-bare-metal/c2-ubuntu-22/s2-docker-config')),
  '05-bare-metal/c2-ubuntu-22/s3-nemoclaw-onboard': lazy(() => import('../subjects/05-bare-metal/c2-ubuntu-22/s3-nemoclaw-onboard')),
  '05-bare-metal/c2-ubuntu-22/s4-verifying-install': lazy(() => import('../subjects/05-bare-metal/c2-ubuntu-22/s4-verifying-install')),
  '05-bare-metal/c2-ubuntu-22/s5-troubleshooting': lazy(() => import('../subjects/05-bare-metal/c2-ubuntu-22/s5-troubleshooting')),
  // c3-ubuntu-24-dgx
  '05-bare-metal/c3-ubuntu-24-dgx/s1-cgroup-v2': lazy(() => import('../subjects/05-bare-metal/c3-ubuntu-24-dgx/s1-cgroup-v2')),
  '05-bare-metal/c3-ubuntu-24-dgx/s2-setup-spark': lazy(() => import('../subjects/05-bare-metal/c3-ubuntu-24-dgx/s2-setup-spark')),
  '05-bare-metal/c3-ubuntu-24-dgx/s3-dgx-optimizations': lazy(() => import('../subjects/05-bare-metal/c3-ubuntu-24-dgx/s3-dgx-optimizations')),
  '05-bare-metal/c3-ubuntu-24-dgx/s4-gpu-passthrough': lazy(() => import('../subjects/05-bare-metal/c3-ubuntu-24-dgx/s4-gpu-passthrough')),
  // c4-macos
  '05-bare-metal/c4-macos/s1-colima-vs-docker': lazy(() => import('../subjects/05-bare-metal/c4-macos/s1-colima-vs-docker')),
  '05-bare-metal/c4-macos/s2-installation-walkthrough': lazy(() => import('../subjects/05-bare-metal/c4-macos/s2-installation-walkthrough')),
  '05-bare-metal/c4-macos/s3-macos-limitations': lazy(() => import('../subjects/05-bare-metal/c4-macos/s3-macos-limitations')),
  '05-bare-metal/c4-macos/s4-apple-silicon': lazy(() => import('../subjects/05-bare-metal/c4-macos/s4-apple-silicon')),
  // c5-windows-wsl
  '05-bare-metal/c5-windows-wsl/s1-wsl2-config': lazy(() => import('../subjects/05-bare-metal/c5-windows-wsl/s1-wsl2-config')),
  '05-bare-metal/c5-windows-wsl/s2-docker-desktop-wsl': lazy(() => import('../subjects/05-bare-metal/c5-windows-wsl/s2-docker-desktop-wsl')),
  '05-bare-metal/c5-windows-wsl/s3-installation-walkthrough': lazy(() => import('../subjects/05-bare-metal/c5-windows-wsl/s3-installation-walkthrough')),
  '05-bare-metal/c5-windows-wsl/s4-windows-troubleshooting': lazy(() => import('../subjects/05-bare-metal/c5-windows-wsl/s4-windows-troubleshooting')),
  // c6-post-install
  '05-bare-metal/c6-post-install/s1-first-connection': lazy(() => import('../subjects/05-bare-metal/c6-post-install/s1-first-connection')),
  '05-bare-metal/c6-post-install/s2-health-checks': lazy(() => import('../subjects/05-bare-metal/c6-post-install/s2-health-checks')),
  '05-bare-metal/c6-post-install/s3-logs-diagnostics': lazy(() => import('../subjects/05-bare-metal/c6-post-install/s3-logs-diagnostics')),
  '05-bare-metal/c6-post-install/s4-updating': lazy(() => import('../subjects/05-bare-metal/c6-post-install/s4-updating')),

  // ========================================================================
  // 06-cloud-setup
  // ========================================================================
  // c1-fundamentals
  '06-cloud-setup/c1-fundamentals/s1-choosing-instances': lazy(() => import('../subjects/06-cloud-setup/c1-fundamentals/s1-choosing-instances')),
  '06-cloud-setup/c1-fundamentals/s2-security-groups': lazy(() => import('../subjects/06-cloud-setup/c1-fundamentals/s2-security-groups')),
  '06-cloud-setup/c1-fundamentals/s3-remote-access': lazy(() => import('../subjects/06-cloud-setup/c1-fundamentals/s3-remote-access')),
  // c2-aws
  '06-cloud-setup/c2-aws/s1-ec2-setup': lazy(() => import('../subjects/06-cloud-setup/c2-aws/s1-ec2-setup')),
  '06-cloud-setup/c2-aws/s2-security-iam': lazy(() => import('../subjects/06-cloud-setup/c2-aws/s2-security-iam')),
  '06-cloud-setup/c2-aws/s3-installation-aws': lazy(() => import('../subjects/06-cloud-setup/c2-aws/s3-installation-aws')),
  '06-cloud-setup/c2-aws/s4-gpu-instances': lazy(() => import('../subjects/06-cloud-setup/c2-aws/s4-gpu-instances')),
  '06-cloud-setup/c2-aws/s5-cost-optimization': lazy(() => import('../subjects/06-cloud-setup/c2-aws/s5-cost-optimization')),
  // c3-gcp
  '06-cloud-setup/c3-gcp/s1-compute-engine': lazy(() => import('../subjects/06-cloud-setup/c3-gcp/s1-compute-engine')),
  '06-cloud-setup/c3-gcp/s2-firewall-rules': lazy(() => import('../subjects/06-cloud-setup/c3-gcp/s2-firewall-rules')),
  '06-cloud-setup/c3-gcp/s3-installation-gcp': lazy(() => import('../subjects/06-cloud-setup/c3-gcp/s3-installation-gcp')),
  '06-cloud-setup/c3-gcp/s4-gpu-vms': lazy(() => import('../subjects/06-cloud-setup/c3-gcp/s4-gpu-vms')),
  '06-cloud-setup/c3-gcp/s5-gke-integration': lazy(() => import('../subjects/06-cloud-setup/c3-gcp/s5-gke-integration')),
  // c4-azure
  '06-cloud-setup/c4-azure/s1-azure-vm': lazy(() => import('../subjects/06-cloud-setup/c4-azure/s1-azure-vm')),
  '06-cloud-setup/c4-azure/s2-nsg-identity': lazy(() => import('../subjects/06-cloud-setup/c4-azure/s2-nsg-identity')),
  '06-cloud-setup/c4-azure/s3-installation-azure': lazy(() => import('../subjects/06-cloud-setup/c4-azure/s3-installation-azure')),
  '06-cloud-setup/c4-azure/s4-gpu-vms-azure': lazy(() => import('../subjects/06-cloud-setup/c4-azure/s4-gpu-vms-azure')),
  '06-cloud-setup/c4-azure/s5-azure-config': lazy(() => import('../subjects/06-cloud-setup/c4-azure/s5-azure-config')),
  // c5-vps-providers
  '06-cloud-setup/c5-vps-providers/s1-digitalocean': lazy(() => import('../subjects/06-cloud-setup/c5-vps-providers/s1-digitalocean')),
  '06-cloud-setup/c5-vps-providers/s2-hetzner': lazy(() => import('../subjects/06-cloud-setup/c5-vps-providers/s2-hetzner')),
  '06-cloud-setup/c5-vps-providers/s3-vultr': lazy(() => import('../subjects/06-cloud-setup/c5-vps-providers/s3-vultr')),
  '06-cloud-setup/c5-vps-providers/s4-linode': lazy(() => import('../subjects/06-cloud-setup/c5-vps-providers/s4-linode')),
  '06-cloud-setup/c5-vps-providers/s5-oracle-free': lazy(() => import('../subjects/06-cloud-setup/c5-vps-providers/s5-oracle-free')),
  // c6-nvidia-brev
  '06-cloud-setup/c6-nvidia-brev/s1-what-is-brev': lazy(() => import('../subjects/06-cloud-setup/c6-nvidia-brev/s1-what-is-brev')),
  '06-cloud-setup/c6-nvidia-brev/s2-deploy-walkthrough': lazy(() => import('../subjects/06-cloud-setup/c6-nvidia-brev/s2-deploy-walkthrough')),
  '06-cloud-setup/c6-nvidia-brev/s3-a100-config': lazy(() => import('../subjects/06-cloud-setup/c6-nvidia-brev/s3-a100-config')),
  '06-cloud-setup/c6-nvidia-brev/s4-persistent-ephemeral': lazy(() => import('../subjects/06-cloud-setup/c6-nvidia-brev/s4-persistent-ephemeral')),
  // c7-self-hosted
  '06-cloud-setup/c7-self-hosted/s1-proxmox-homelab': lazy(() => import('../subjects/06-cloud-setup/c7-self-hosted/s1-proxmox-homelab')),
  '06-cloud-setup/c7-self-hosted/s2-tailscale-wireguard': lazy(() => import('../subjects/06-cloud-setup/c7-self-hosted/s2-tailscale-wireguard')),
  '06-cloud-setup/c7-self-hosted/s3-multi-node': lazy(() => import('../subjects/06-cloud-setup/c7-self-hosted/s3-multi-node')),

  // ========================================================================
  // 07-applications
  // ========================================================================
  // c1-always-on-assistant
  '07-applications/c1-always-on-assistant/s1-persistent-agent': lazy(() => import('../subjects/07-applications/c1-always-on-assistant/s1-persistent-agent')),
  '07-applications/c1-always-on-assistant/s2-workspace-config': lazy(() => import('../subjects/07-applications/c1-always-on-assistant/s2-workspace-config')),
  '07-applications/c1-always-on-assistant/s3-project-api-restrict': lazy(() => import('../subjects/07-applications/c1-always-on-assistant/s3-project-api-restrict')),
  '07-applications/c1-always-on-assistant/s4-memory-persistence': lazy(() => import('../subjects/07-applications/c1-always-on-assistant/s4-memory-persistence')),
  // c2-sandboxed-testing
  '07-applications/c2-sandboxed-testing/s1-testing-before-prod': lazy(() => import('../subjects/07-applications/c2-sandboxed-testing/s1-testing-before-prod')),
  '07-applications/c2-sandboxed-testing/s2-graduated-permissions': lazy(() => import('../subjects/07-applications/c2-sandboxed-testing/s2-graduated-permissions')),
  '07-applications/c2-sandboxed-testing/s3-monitoring-logging': lazy(() => import('../subjects/07-applications/c2-sandboxed-testing/s3-monitoring-logging')),
  '07-applications/c2-sandboxed-testing/s4-ab-testing': lazy(() => import('../subjects/07-applications/c2-sandboxed-testing/s4-ab-testing')),
  // c3-telegram-bot
  '07-applications/c3-telegram-bot/s1-telegram-policy': lazy(() => import('../subjects/07-applications/c3-telegram-bot/s1-telegram-policy')),
  '07-applications/c3-telegram-bot/s2-bot-config': lazy(() => import('../subjects/07-applications/c3-telegram-bot/s2-bot-config')),
  '07-applications/c3-telegram-bot/s3-interactive-agent': lazy(() => import('../subjects/07-applications/c3-telegram-bot/s3-interactive-agent')),
  '07-applications/c3-telegram-bot/s4-rate-limiting': lazy(() => import('../subjects/07-applications/c3-telegram-bot/s4-rate-limiting')),
  // c4-multi-agent
  '07-applications/c4-multi-agent/s1-agents-md': lazy(() => import('../subjects/07-applications/c4-multi-agent/s1-agents-md')),
  '07-applications/c4-multi-agent/s2-agent-roles': lazy(() => import('../subjects/07-applications/c4-multi-agent/s2-agent-roles')),
  '07-applications/c4-multi-agent/s3-inter-agent-comms': lazy(() => import('../subjects/07-applications/c4-multi-agent/s3-inter-agent-comms')),
  '07-applications/c4-multi-agent/s4-shared-isolated': lazy(() => import('../subjects/07-applications/c4-multi-agent/s4-shared-isolated')),
  // c5-cicd-agent
  '07-applications/c5-cicd-agent/s1-agent-code-review': lazy(() => import('../subjects/07-applications/c5-cicd-agent/s1-agent-code-review')),
  '07-applications/c5-cicd-agent/s2-automated-testing': lazy(() => import('../subjects/07-applications/c5-cicd-agent/s2-automated-testing')),
  '07-applications/c5-cicd-agent/s3-ci-policy-config': lazy(() => import('../subjects/07-applications/c5-cicd-agent/s3-ci-policy-config')),
  '07-applications/c5-cicd-agent/s4-github-actions': lazy(() => import('../subjects/07-applications/c5-cicd-agent/s4-github-actions')),
  // c6-research
  '07-applications/c6-research/s1-isolated-experiments': lazy(() => import('../subjects/07-applications/c6-research/s1-isolated-experiments')),
  '07-applications/c6-research/s2-comparing-providers': lazy(() => import('../subjects/07-applications/c6-research/s2-comparing-providers')),
  '07-applications/c6-research/s3-benchmarking': lazy(() => import('../subjects/07-applications/c6-research/s3-benchmarking')),
  '07-applications/c6-research/s4-custom-blueprints': lazy(() => import('../subjects/07-applications/c6-research/s4-custom-blueprints')),
  // c7-enterprise
  '07-applications/c7-enterprise/s1-soc2-deployment': lazy(() => import('../subjects/07-applications/c7-enterprise/s1-soc2-deployment')),
  '07-applications/c7-enterprise/s2-audit-trails': lazy(() => import('../subjects/07-applications/c7-enterprise/s2-audit-trails')),
  '07-applications/c7-enterprise/s3-role-based-access': lazy(() => import('../subjects/07-applications/c7-enterprise/s3-role-based-access')),
  '07-applications/c7-enterprise/s4-data-residency': lazy(() => import('../subjects/07-applications/c7-enterprise/s4-data-residency')),

  // ========================================================================
  // 08-advanced
  // ========================================================================
  // c1-local-inference
  '08-advanced/c1-local-inference/s1-nvidia-nim': lazy(() => import('../subjects/08-advanced/c1-local-inference/s1-nvidia-nim')),
  '08-advanced/c1-local-inference/s2-local-gpu-setup': lazy(() => import('../subjects/08-advanced/c1-local-inference/s2-local-gpu-setup')),
  '08-advanced/c1-local-inference/s3-vllm-integration': lazy(() => import('../subjects/08-advanced/c1-local-inference/s3-vllm-integration')),
  '08-advanced/c1-local-inference/s4-ollama-lightweight': lazy(() => import('../subjects/08-advanced/c1-local-inference/s4-ollama-lightweight')),
  '08-advanced/c1-local-inference/s5-performance-tuning': lazy(() => import('../subjects/08-advanced/c1-local-inference/s5-performance-tuning')),
  // c2-custom-blueprints
  '08-advanced/c2-custom-blueprints/s1-blueprint-anatomy': lazy(() => import('../subjects/08-advanced/c2-custom-blueprints/s1-blueprint-anatomy')),
  '08-advanced/c2-custom-blueprints/s2-creating-blueprints': lazy(() => import('../subjects/08-advanced/c2-custom-blueprints/s2-creating-blueprints')),
  '08-advanced/c2-custom-blueprints/s3-versioning-distribution': lazy(() => import('../subjects/08-advanced/c2-custom-blueprints/s3-versioning-distribution')),
  '08-advanced/c2-custom-blueprints/s4-community-blueprints': lazy(() => import('../subjects/08-advanced/c2-custom-blueprints/s4-community-blueprints')),
  // c3-openshell-advanced
  '08-advanced/c3-openshell-advanced/s1-landlock-deep-dive': lazy(() => import('../subjects/08-advanced/c3-openshell-advanced/s1-landlock-deep-dive')),
  '08-advanced/c3-openshell-advanced/s2-custom-seccomp': lazy(() => import('../subjects/08-advanced/c3-openshell-advanced/s2-custom-seccomp')),
  '08-advanced/c3-openshell-advanced/s3-network-advanced': lazy(() => import('../subjects/08-advanced/c3-openshell-advanced/s3-network-advanced')),
  '08-advanced/c3-openshell-advanced/s4-debugging-isolation': lazy(() => import('../subjects/08-advanced/c3-openshell-advanced/s4-debugging-isolation')),
  // c4-contributing
  '08-advanced/c4-contributing/s1-repo-structure': lazy(() => import('../subjects/08-advanced/c4-contributing/s1-repo-structure')),
  '08-advanced/c4-contributing/s2-filing-issues': lazy(() => import('../subjects/08-advanced/c4-contributing/s2-filing-issues')),
  '08-advanced/c4-contributing/s3-contributing-code': lazy(() => import('../subjects/08-advanced/c4-contributing/s3-contributing-code')),
  '08-advanced/c4-contributing/s4-community-discord': lazy(() => import('../subjects/08-advanced/c4-contributing/s4-community-discord')),
}

// ---------------------------------------------------------------------------
// Loading spinner
// ---------------------------------------------------------------------------
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="animate-spin text-[#76B900]" />
      <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
        Loading section content...
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Coming Soon placeholder
// ---------------------------------------------------------------------------
function ComingSoon({ title }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">🚧</div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Coming Soon
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        The content for <span className="font-medium">{title}</span> is currently
        being written. Check back soon!
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SectionPage
// ---------------------------------------------------------------------------
export default function SectionPage() {
  const { subjectId, chapterId, sectionId } = useParams()
  const completedSections = useAppStore((s) => s.completedSections)
  const markSectionComplete = useAppStore((s) => s.markSectionComplete)
  const unmarkSectionComplete = useAppStore((s) => s.unmarkSectionComplete)

  // Look up curriculum data
  const subject = curriculum.find((s) => s.id === subjectId)
  const chapter = subject?.chapters.find((c) => c.id === chapterId)
  const section = chapter?.sections.find((s) => s.id === sectionId)

  // Adjacent sections for prev/next nav
  const { prev, next } = useMemo(
    () => getAdjacentSections(subjectId, chapterId, sectionId),
    [subjectId, chapterId, sectionId],
  )

  if (!subject || !chapter || !section) return <NotFoundPage />

  const sectionPath = `${subjectId}/${chapterId}/${sectionId}`
  const isComplete = completedSections.includes(sectionPath)

  // Resolve lazy component from registry
  const registryKey = `${subjectId}/${chapterId}/${sectionId}`
  const SectionContent = CONTENT_REGISTRY[registryKey] || null

  const handleToggleComplete = () => {
    if (isComplete) {
      unmarkSectionComplete(sectionPath)
    } else {
      markSectionComplete(sectionPath)
    }
  }

  // Build prev/next nav props
  const prevNav = prev
    ? {
        title: prev.title,
        path: `/subjects/${prev.subjectId}/${prev.chapterId}/${prev.id}`,
      }
    : null
  const nextNav = next
    ? {
        title: next.title,
        path: `/subjects/${next.subjectId}/${next.chapterId}/${next.id}`,
      }
    : null

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: subject.title, path: `/subjects/${subjectId}` },
          { label: chapter.title, path: `/subjects/${subjectId}/${chapterId}` },
          { label: section.title },
        ]}
      />

      {/* Prerequisites banner */}
      {section.buildsOn && section.buildsOn.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                Prerequisites
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                This section builds on:{' '}
                {section.buildsOn.map((dep, i) => (
                  <span key={dep}>
                    {i > 0 && ', '}
                    <Link
                      to={`/subjects/${dep.replace(/\//g, '/')}`}
                      className="underline hover:no-underline"
                    >
                      {dep}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {section.title}
        </h1>
        {section.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
            {section.description}
          </p>
        )}
      </motion.div>

      {/* Section content */}
      <div className="prose prose-sm dark:prose-invert max-w-none mb-10">
        {SectionContent ? (
          <Suspense fallback={<LoadingSpinner />}>
            <SectionContent />
          </Suspense>
        ) : (
          <ComingSoon title={section.title} />
        )}
      </div>

      {/* Mark as complete */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleToggleComplete}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
            isComplete
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
              : 'bg-[#76B900] text-white hover:bg-[#5a9200]'
          }`}
        >
          <CheckCircle size={18} />
          {isComplete ? 'Completed' : 'Mark as Complete'}
        </button>
      </div>

      {/* Prev / Next navigation */}
      <PrevNextNav prev={prevNav} next={nextNav} />
    </div>
  )
}
