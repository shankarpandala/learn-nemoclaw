import{j as e}from"./vendor-ui-D7_WPSYG.js";import"./vendor-react-DsRxi-pb.js";import{D as l,N as a,a as r,W as i,E as n,R as s,C as t,S as o}from"./subject-01-5wdxj4WZ.js";const E={id:"06-cloud-setup",title:"Setup on Public Clouds & VPS",icon:"☁️",colorHex:"#00897B",description:"Deploy NemoClaw on AWS, GCP, Azure, popular VPS providers, NVIDIA Brev, and self-hosted infrastructure.",difficulty:"intermediate",estimatedHours:8,prerequisites:["05-bare-metal"],chapters:[{id:"c1-fundamentals",title:"Cloud Deployment Fundamentals",description:"Instance selection, security groups, and remote access.",estimatedMinutes:30,sections:[{id:"s1-choosing-instances",title:"Choosing Instance Types",difficulty:"beginner",readingMinutes:10,description:"CPU, RAM, and disk sizing for NemoClaw workloads."},{id:"s2-security-groups",title:"Security Groups & Networking",difficulty:"intermediate",readingMinutes:10,description:"Firewall rules and port configuration for NemoClaw."},{id:"s3-remote-access",title:"Remote Access Patterns",difficulty:"intermediate",readingMinutes:10,description:"SSH tunneling, VS Code Remote, and Tailscale."}]},{id:"c2-aws",title:"AWS Deployment",description:"EC2 setup, IAM, GPU instances, and cost optimization.",estimatedMinutes:55,sections:[{id:"s1-ec2-setup",title:"EC2 Instance Setup",difficulty:"intermediate",readingMinutes:10,description:"Launching t3.large+ instances for NemoClaw."},{id:"s2-security-iam",title:"Security Groups & IAM",difficulty:"intermediate",readingMinutes:12,description:"AWS security configuration and role-based access."},{id:"s3-installation-aws",title:"NemoClaw on AWS",difficulty:"intermediate",readingMinutes:12,description:"Installation on Amazon Linux and Ubuntu AMI."},{id:"s4-gpu-instances",title:"GPU Instances",difficulty:"advanced",readingMinutes:10,description:"p3 and g4dn instances for local inference."},{id:"s5-cost-optimization",title:"Cost Optimization",difficulty:"intermediate",readingMinutes:10,description:"Spot instances, reserved pricing, and right-sizing."}]},{id:"c3-gcp",title:"Google Cloud Deployment",description:"Compute Engine, firewall rules, GPU VMs, and GKE.",estimatedMinutes:55,sections:[{id:"s1-compute-engine",title:"Compute Engine Setup",difficulty:"intermediate",readingMinutes:10,description:"Creating and configuring GCP VMs for NemoClaw."},{id:"s2-firewall-rules",title:"Firewall & Service Accounts",difficulty:"intermediate",readingMinutes:12,description:"GCP firewall rules and IAM service accounts."},{id:"s3-installation-gcp",title:"NemoClaw on GCP",difficulty:"intermediate",readingMinutes:12,description:"Installation walkthrough on GCP."},{id:"s4-gpu-vms",title:"GPU VMs (A100/T4)",difficulty:"advanced",readingMinutes:10,description:"Attaching GPUs for local inference workloads."},{id:"s5-gke-integration",title:"GKE Integration",difficulty:"advanced",readingMinutes:10,description:"Experimental Kubernetes deployment on GKE."}]},{id:"c4-azure",title:"Microsoft Azure Deployment",description:"Azure VMs, NSG, managed identity, and GPU instances.",estimatedMinutes:55,sections:[{id:"s1-azure-vm",title:"Azure VM Setup",difficulty:"intermediate",readingMinutes:10,description:"Creating Azure VMs for NemoClaw."},{id:"s2-nsg-identity",title:"NSG & Managed Identity",difficulty:"intermediate",readingMinutes:12,description:"Network security groups and Azure identity."},{id:"s3-installation-azure",title:"NemoClaw on Azure",difficulty:"intermediate",readingMinutes:12,description:"Installation walkthrough on Azure."},{id:"s4-gpu-vms-azure",title:"GPU VMs (NC-series)",difficulty:"advanced",readingMinutes:10,description:"NC-series VMs for local GPU inference."},{id:"s5-azure-config",title:"Azure-Specific Configuration",difficulty:"intermediate",readingMinutes:10,description:"Performance tuning and Azure-specific settings."}]},{id:"c5-vps-providers",title:"Popular VPS Providers",description:"DigitalOcean, Hetzner, Vultr, Linode, and Oracle Cloud.",estimatedMinutes:50,sections:[{id:"s1-digitalocean",title:"DigitalOcean Droplets",difficulty:"beginner",readingMinutes:10,description:"NemoClaw on DigitalOcean droplets."},{id:"s2-hetzner",title:"Hetzner Cloud",difficulty:"beginner",readingMinutes:10,description:"Cost-effective European cloud deployment."},{id:"s3-vultr",title:"Vultr",difficulty:"beginner",readingMinutes:10,description:"NemoClaw on Vultr cloud compute."},{id:"s4-linode",title:"Linode / Akamai",difficulty:"beginner",readingMinutes:10,description:"Deployment on Linode/Akamai cloud."},{id:"s5-oracle-free",title:"Oracle Cloud Free Tier",difficulty:"beginner",readingMinutes:10,description:"Running NemoClaw on Oracle always-free instances."}]},{id:"c6-nvidia-brev",title:"NVIDIA Brev (Remote GPU)",description:"Deploy to remote GPU instances via NVIDIA Brev.",estimatedMinutes:40,sections:[{id:"s1-what-is-brev",title:"What is Brev?",difficulty:"beginner",readingMinutes:8,description:"NVIDIA's remote GPU deployment platform."},{id:"s2-deploy-walkthrough",title:"Deploy Walkthrough",difficulty:"intermediate",readingMinutes:12,description:"nemoclaw deploy step-by-step."},{id:"s3-a100-config",title:"Tesla A100 Configuration",difficulty:"advanced",readingMinutes:10,description:"Configuring A100 GPUs for inference."},{id:"s4-persistent-ephemeral",title:"Persistent vs Ephemeral",difficulty:"intermediate",readingMinutes:8,description:"Choosing between persistent and ephemeral deployments."}]},{id:"c7-self-hosted",title:"Self-Hosted & Hybrid",description:"Proxmox, Tailscale, and multi-node deployments.",estimatedMinutes:30,sections:[{id:"s1-proxmox-homelab",title:"Proxmox / Homelab",difficulty:"intermediate",readingMinutes:10,description:"Running NemoClaw on Proxmox and homelab setups."},{id:"s2-tailscale-wireguard",title:"Tailscale & WireGuard",difficulty:"intermediate",readingMinutes:10,description:"Secure remote access with mesh VPNs."},{id:"s3-multi-node",title:"Multi-Node Deployments",difficulty:"advanced",readingMinutes:10,description:"Scaling NemoClaw across multiple nodes."}]}]};function c(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Choosing Instance Types for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Selecting the right cloud instance type is one of the most consequential decisions you will make when deploying NemoClaw. An undersized instance leads to sluggish policy evaluation, dropped WebSocket connections, and frustrated users. An oversized instance burns through your cloud budget without meaningful performance gains. This section walks you through the hardware requirements, the tradeoffs between cost and performance, and the special considerations for GPU-accelerated local inference."}),e.jsx(l,{term:"Instance Type",definition:"A cloud provider's predefined combination of virtual CPU cores, memory, storage, and optionally GPU accelerators. Each provider uses its own naming convention (e.g., AWS t3.large, GCP e2-standard-4, Azure Standard_D4s_v3), but they all describe a specific hardware configuration available for rent.",example:"An AWS t3.large provides 2 vCPUs and 8 GB of RAM -- suitable for lightweight testing but below the recommended minimum for production NemoClaw deployments.",seeAlso:["vCPU","GPU Instance","Right-Sizing"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Minimum Hardware Requirements"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw consists of two primary processes: the OpenClaw Gateway (Node.js) and the NemoClaw policy engine (Rust-based sidecar). Together they require a baseline of compute resources to operate reliably under typical workloads -- a small team of five to ten developers interacting with agents through Slack or Discord."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"vCPUs: 4 or more."})," The Gateway is largely single-threaded for message processing but spawns worker threads for tool execution. The policy engine evaluates rules concurrently and benefits significantly from multiple cores. With fewer than 4 vCPUs, policy evaluation latency increases noticeably under concurrent agent sessions."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"RAM: 8-16 GB."})," The Gateway maintains in-memory session state including conversation histories. Each active session can consume 10-50 MB depending on context length. The policy engine loads compiled rule sets into memory for fast evaluation. 8 GB is the absolute minimum for a small team; 16 GB is recommended for production use with ten or more concurrent sessions."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Storage: 30 GB+ SSD."})," The operating system, Node.js runtime, NemoClaw binaries, log files, and workspace data all require disk space. SSD storage is strongly recommended because the policy engine performs frequent small reads when loading rule definitions. HDD-backed instances will exhibit noticeably higher startup times and policy reload latency."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Network: Low-latency outbound."})," NemoClaw makes API calls to LLM providers (Anthropic, OpenAI) and receives webhook events from Slack or Discord. A minimum of 1 Gbps network bandwidth is typical for cloud instances and sufficient for NemoClaw."]})]}),e.jsx(a,{type:"info",title:"These Are Minimums, Not Recommendations",children:e.jsx("p",{children:"The 4 vCPU / 8 GB configuration will run NemoClaw, but you may experience increased policy evaluation latency under load. For teams larger than ten people or deployments with many concurrent agent sessions, start with 8 vCPU / 16 GB and scale from there. Monitoring resource utilization during the first week of deployment is critical for right-sizing."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Cost vs. Performance Tradeoffs"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Cloud pricing is complex, but the fundamental tradeoff is straightforward: more compute costs more money. The question is where to invest those dollars for maximum impact on NemoClaw performance. Here is a rough breakdown of how each resource dimension affects NemoClaw."}),e.jsx(r,{title:"Resource Impact on NemoClaw Performance",headers:["Resource","Impact on Performance","Cost Sensitivity"],rows:[["Additional vCPUs (4 to 8)","High: concurrent policy evaluations run faster, tool execution parallelism improves","Moderate: roughly doubles instance cost"],["Additional RAM (8 to 16 GB)","Moderate: more sessions can be held in memory, reduces risk of OOM under load","Low-Moderate: RAM is relatively cheap per GB"],["SSD vs HDD storage","Moderate at startup, low at runtime: faster policy loading, faster log writes","Low: SSD is standard on most modern instances"],["GPU accelerator","Very High for local inference: enables running LLMs locally instead of API calls","Very High: GPU instances cost 3-10x more than CPU-only"],["Premium network (e.g., enhanced)","Low: NemoClaw is not bandwidth-intensive","Low: usually included or minimal cost"]]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For most teams, the best value is a mid-range CPU-optimized instance with 4-8 vCPUs and 16 GB RAM. This handles the Gateway and policy engine comfortably while keeping monthly costs in the $50-150 range depending on provider and region. GPU instances only make sense if you plan to run local LLM inference -- otherwise, you are paying a significant premium for hardware that sits idle."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Instance Type Recommendations by Provider"}),e.jsx(r,{title:"Recommended Instance Types",headers:["Provider","Budget / Testing","Production (Small Team)","Production (Large Team)"],rows:[["AWS","t3.large (2 vCPU, 8 GB)","t3.xlarge (4 vCPU, 16 GB)","c6i.2xlarge (8 vCPU, 16 GB)"],["GCP","e2-standard-2 (2 vCPU, 8 GB)","e2-standard-4 (4 vCPU, 16 GB)","c2-standard-8 (8 vCPU, 32 GB)"],["Azure","Standard_B2s (2 vCPU, 4 GB)","Standard_D4s_v3 (4 vCPU, 16 GB)","Standard_D8s_v3 (8 vCPU, 32 GB)"],["DigitalOcean","Basic 4GB ($24/mo)","CPU-Optimized 8GB ($80/mo)","CPU-Optimized 16GB ($160/mo)"],["Hetzner","CX22 (2 vCPU, 4 GB)","CX31 (4 vCPU, 8 GB)","CX41 (8 vCPU, 16 GB)"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GPU Instances for Local Inference"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If your deployment requires running language models locally -- for data privacy, latency reduction, or cost control on high-volume workloads -- you will need a GPU-equipped instance. Local inference with models like Llama 3, Mistral, or Code Llama requires significant GPU memory (VRAM). The minimum practical VRAM for useful coding models is 16 GB, which rules out consumer-grade GPUs in cloud contexts."}),e.jsx(r,{title:"GPU Instance Options for Local Inference",headers:["Provider","Instance Type","GPU","VRAM","Approx. Monthly Cost"],rows:[["AWS","g4dn.xlarge","NVIDIA T4","16 GB","~$380"],["AWS","g5.xlarge","NVIDIA A10G","24 GB","~$730"],["AWS","p3.2xlarge","NVIDIA V100","16 GB","~$2,200"],["GCP","n1-standard-4 + T4","NVIDIA T4","16 GB","~$350"],["GCP","a2-highgpu-1g","NVIDIA A100","40 GB","~$2,900"],["Azure","Standard_NC4as_T4_v3","NVIDIA T4","16 GB","~$400"]]}),e.jsx(i,{title:"GPU Instances Are Expensive",children:e.jsx("p",{children:"A single GPU instance can cost more per month than an entire small team's CPU-based deployment. Before committing to GPU instances, verify that local inference is genuinely required for your use case. Most NemoClaw deployments work excellently with API-based LLM providers, where you pay per token rather than per hour of GPU rental. GPU instances make economic sense only at high volumes (thousands of requests per day) or when data must not leave your infrastructure."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Right-Sizing Over Time"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The best approach is to start with a moderately sized instance and monitor actual resource utilization. NemoClaw exposes metrics through its Control UI and optionally through Prometheus-compatible endpoints. Watch CPU utilization, memory usage, and policy evaluation latency (the p95 response time for rule checks) during the first one to two weeks. If CPU consistently stays below 30%, you can safely downsize. If memory usage approaches 80% of available RAM, scale up before sessions start getting evicted."}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Cloud providers make it straightforward to resize instances. On AWS you can stop an EC2 instance, change its type, and start it again in under five minutes. GCP and Azure offer similar workflows. There is no penalty for starting small and scaling up -- but there can be a significant cost penalty for starting large and never scaling down."}),e.jsx(n,{question:"A team of 15 developers plans to deploy NemoClaw on AWS for production use with API-based LLM inference (no local models). Which instance type is the most appropriate starting point?",options:["t3.micro (1 vCPU, 1 GB) -- minimal cost","t3.large (2 vCPU, 8 GB) -- budget option","t3.xlarge (4 vCPU, 16 GB) -- balanced","p3.2xlarge (8 vCPU, 61 GB, V100 GPU) -- maximum performance"],correctIndex:2,explanation:"For a 15-person team without local inference needs, t3.xlarge provides the recommended 4 vCPU and 16 GB RAM at a reasonable cost. The t3.large is below minimum for this team size, and the p3.2xlarge includes an expensive GPU that would sit unused since inference is API-based."}),e.jsx(s,{references:[{title:"AWS EC2 Instance Types",url:"https://aws.amazon.com/ec2/instance-types/",type:"docs",description:"Complete list of EC2 instance families with specs and pricing."},{title:"GCP Machine Type Comparison",url:"https://cloud.google.com/compute/docs/machine-types",type:"docs",description:"GCP machine families and their intended workloads."},{title:"Azure VM Sizes",url:"https://learn.microsoft.com/en-us/azure/virtual-machines/sizes",type:"docs",description:"Azure virtual machine size categories and specifications."}]})]})}const H=Object.freeze(Object.defineProperty({__proto__:null,default:c},Symbol.toStringTag,{value:"Module"}));function d(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Firewall and Security Group Configuration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"A properly configured firewall is the first line of defense for any cloud-hosted NemoClaw deployment. Unlike a typical web application that needs to expose HTTP ports to the internet, NemoClaw requires no public-facing ports at all. The Gateway communicates outbound to LLM APIs and messaging platforms -- it does not need to accept inbound connections from the public internet. This makes the firewall configuration remarkably simple: allow SSH for administration, block everything else inbound, and use a VPN or tunnel for remote access to the Control UI."}),e.jsx(l,{term:"Security Group",definition:"A virtual firewall provided by cloud platforms (AWS, GCP, Azure) that controls inbound and outbound network traffic to cloud instances. Security groups operate at the instance level and evaluate rules statelessly for inbound and statefully for return traffic. They are the cloud equivalent of iptables or nftables rules.",example:"An AWS security group with a single inbound rule allowing TCP port 22 from your office IP address, and a default outbound rule allowing all traffic. This permits SSH access while blocking all other inbound connections.",seeAlso:["Firewall Rule","Network ACL","VPC"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Why NemoClaw Needs No Public Ports"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Understanding why NemoClaw does not need inbound ports requires understanding its communication model. The OpenClaw Gateway initiates all external connections outbound:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Slack integration"})," uses Socket Mode, which establishes an outbound WebSocket connection to Slack's servers. Slack pushes events through this connection. No inbound webhook port is needed."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Discord integration"})," connects outbound to Discord's gateway via WebSocket. Again, no inbound port is required."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"LLM API calls"})," (Anthropic, OpenAI) are outbound HTTPS requests. The LLM provider never initiates connections to your server."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"The Control UI"})," listens on port 18789 but should only be accessible to administrators, not the public internet. Access should be through SSH tunneling, VPN, or Tailscale."]})]}),e.jsx(i,{title:"Never Expose the Control UI to the Public Internet",children:e.jsx("p",{children:"The Control UI has no built-in authentication. Anyone who can reach port 18789 can view all conversations, modify agent configurations, and change policy rules. Exposing this port publicly is equivalent to giving anonymous users full administrative access to your NemoClaw deployment. Always access it through a tunnel or VPN."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"The Minimal Security Group"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The ideal security group for a NemoClaw instance has exactly one inbound rule and permissive outbound rules. Here is the configuration expressed in a provider-agnostic format:"}),e.jsx(t,{language:"text",title:"Recommended Security Group Rules",code:`INBOUND RULES:
  Rule 1: SSH
    Protocol: TCP
    Port:     22
    Source:   <your-ip>/32    (or your office CIDR block)
    Action:   ALLOW

  Rule 2 (implicit):
    All other inbound traffic: DENY

OUTBOUND RULES:
  Rule 1: All traffic
    Protocol: All
    Port:     All
    Destination: 0.0.0.0/0
    Action:   ALLOW`}),e.jsx(a,{type:"tip",title:"Restricting SSH Source IP",children:e.jsxs("p",{children:["Always restrict the SSH source to your specific IP address or a narrow CIDR range. Using ",e.jsx("code",{children:"0.0.0.0/0"})," (anywhere) for SSH access exposes your instance to brute-force attacks from the entire internet. If your IP changes frequently, consider using a VPN with a static IP as your SSH bastion, or use Tailscale to eliminate the need for public SSH entirely."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Provider-Specific Configuration"}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"AWS Security Groups"}),e.jsx(t,{language:"bash",title:"Create AWS Security Group via CLI",code:`# Create the security group
aws ec2 create-security-group \\
  --group-name nemoclaw-sg \\
  --description "NemoClaw - SSH only inbound" \\
  --vpc-id vpc-0123456789abcdef0

# Add SSH rule (replace YOUR_IP with your actual IP)
aws ec2 authorize-security-group-ingress \\
  --group-name nemoclaw-sg \\
  --protocol tcp \\
  --port 22 \\
  --cidr YOUR_IP/32

# Verify the rules
aws ec2 describe-security-groups \\
  --group-names nemoclaw-sg \\
  --query 'SecurityGroups[0].IpPermissions'`}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"GCP Firewall Rules"}),e.jsx(t,{language:"bash",title:"Create GCP Firewall Rule via gcloud",code:`# Create firewall rule for SSH
gcloud compute firewall-rules create nemoclaw-allow-ssh \\
  --direction=INGRESS \\
  --priority=1000 \\
  --network=default \\
  --action=ALLOW \\
  --rules=tcp:22 \\
  --source-ranges=YOUR_IP/32 \\
  --target-tags=nemoclaw

# Verify
gcloud compute firewall-rules describe nemoclaw-allow-ssh`}),e.jsx("h3",{className:"text-xl font-semibold text-gray-800 dark:text-gray-200",children:"Azure Network Security Group"}),e.jsx(t,{language:"bash",title:"Create Azure NSG via az CLI",code:`# Create NSG
az network nsg create \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-nsg

# Add SSH rule
az network nsg rule create \\
  --resource-group nemoclaw-rg \\
  --nsg-name nemoclaw-nsg \\
  --name AllowSSH \\
  --priority 100 \\
  --direction Inbound \\
  --access Allow \\
  --protocol Tcp \\
  --destination-port-ranges 22 \\
  --source-address-prefixes YOUR_IP/32`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"VPN and Tailscale for Remote Access"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The most secure approach eliminates public SSH entirely. Instead of exposing port 22 to the internet, install Tailscale on both your local machine and the cloud instance. Tailscale creates a WireGuard-based mesh VPN that assigns each device a stable private IP. You can then access SSH and the Control UI over the Tailscale network without any public inbound rules at all."}),e.jsx(t,{language:"bash",title:"Zero-Public-Port Setup with Tailscale",code:`# On your cloud instance (after initial SSH setup):
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Once Tailscale is running, remove the SSH inbound rule entirely:
# AWS:
aws ec2 revoke-security-group-ingress \\
  --group-name nemoclaw-sg \\
  --protocol tcp \\
  --port 22 \\
  --cidr YOUR_IP/32

# Now SSH via Tailscale IP:
ssh user@100.x.y.z    # Tailscale-assigned IP

# Access Control UI via Tailscale:
# http://100.x.y.z:18789`}),e.jsx(a,{type:"info",title:"Tailscale Free Tier",children:e.jsx("p",{children:"Tailscale offers a generous free tier for personal use (up to 100 devices, 3 users). For team deployments, their paid plans include ACL management, audit logs, and SSO integration. This makes it an excellent choice for securing NemoClaw access without the complexity of a traditional VPN setup."})}),e.jsx(o,{title:"Security Group Audit Checklist",steps:[{title:"Verify inbound rules",content:"Confirm that the only inbound rule is SSH (port 22) from a restricted source IP. No other ports should be open inbound."},{title:"Check for 0.0.0.0/0 on SSH",content:"If SSH is open to all IPs, immediately restrict it to your specific IP or CIDR range. Open SSH is a common misconfiguration."},{title:"Confirm Control UI is not exposed",content:"Verify that port 18789 is not listed in any inbound rule. Access should only be through SSH tunnel or VPN."},{title:"Review outbound rules",content:"Outbound should allow all traffic so NemoClaw can reach LLM APIs and messaging platforms. If you have strict outbound policies, ensure ports 443 (HTTPS) and 53 (DNS) are allowed."},{title:"Test from outside",content:"Use an external tool like nmap or a port scanner to verify that only SSH is reachable from the internet. Test from a different network than your allowed IP."}]}),e.jsx(n,{question:"Why does NemoClaw not require any inbound HTTP/HTTPS ports to function with Slack?",options:["Slack sends messages via email, not HTTP","NemoClaw uses Slack Socket Mode which establishes an outbound WebSocket connection","Slack messages are stored in a shared database that NemoClaw polls","NemoClaw uses a CDN to receive Slack events"],correctIndex:1,explanation:"Slack Socket Mode works by having the application (NemoClaw's Gateway) establish an outbound WebSocket connection to Slack's servers. Slack then pushes events through this persistent connection. Since the connection is initiated outbound, no inbound port needs to be open."}),e.jsx(s,{references:[{title:"AWS Security Groups Documentation",url:"https://docs.aws.amazon.com/vpc/latest/userguide/security-groups.html",type:"docs",description:"Official AWS guide to security group rules and best practices."},{title:"Tailscale Documentation",url:"https://tailscale.com/kb/",type:"docs",description:"Tailscale knowledge base covering setup, ACLs, and integration guides."}]})]})}const q=Object.freeze(Object.defineProperty({__proto__:null,default:d},Symbol.toStringTag,{value:"Module"}));function u(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Secure Remote Access to Cloud NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Once your NemoClaw instance is running in the cloud, you need reliable and secure methods to access it for administration, monitoring, and debugging. This section covers four primary approaches: SSH tunneling, VS Code Remote SSH, Tailscale, and WireGuard. Each has distinct advantages depending on your workflow and security requirements."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"SSH Tunneling"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"SSH tunneling (also called SSH port forwarding) is the simplest method for accessing NemoClaw's Control UI without exposing it publicly. You create an encrypted tunnel from your local machine to the remote instance, forwarding a local port to the remote port where the Control UI listens."}),e.jsx(t,{language:"bash",title:"SSH Local Port Forwarding",code:`# Forward local port 18789 to remote port 18789
ssh -L 18789:localhost:18789 ubuntu@your-instance-ip

# Now open in your browser:
# http://localhost:18789

# To run the tunnel in the background without an interactive shell:
ssh -fNL 18789:localhost:18789 ubuntu@your-instance-ip

# -f  Run in background
# -N  No remote command (tunnel only)
# -L  Local port forwarding

# Forward multiple ports at once (Control UI + custom metrics):
ssh -L 18789:localhost:18789 -L 9090:localhost:9090 ubuntu@your-instance-ip`}),e.jsx(a,{type:"tip",title:"SSH Config for Convenience",children:e.jsxs("p",{children:["Add your NemoClaw instance to ",e.jsx("code",{children:"~/.ssh/config"})," to avoid typing long commands every time:"]})}),e.jsx(t,{language:"text",title:"~/.ssh/config",code:`Host nemoclaw
  HostName 54.123.45.67
  User ubuntu
  IdentityFile ~/.ssh/nemoclaw-key.pem
  LocalForward 18789 localhost:18789
  ServerAliveInterval 60
  ServerAliveCountMax 3`}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["With this configuration, you simply run ",e.jsx("code",{children:"ssh nemoclaw"})," and the tunnel is established automatically. The ",e.jsx("code",{children:"ServerAliveInterval"})," setting sends keepalive packets every 60 seconds to prevent the connection from being dropped by intermediate firewalls or NAT devices."]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"VS Code Remote SSH"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"VS Code's Remote SSH extension provides a seamless development experience on your cloud instance. It installs a lightweight VS Code server on the remote machine, giving you full editor capabilities including file browsing, integrated terminal, and extension support -- all running on the remote instance's hardware."}),e.jsx(o,{title:"Setting Up VS Code Remote SSH",steps:[{title:"Install the Remote SSH extension",content:'In VS Code, open the Extensions panel (Ctrl+Shift+X) and search for "Remote - SSH" by Microsoft. Install it.'},{title:"Configure SSH host",content:'Press Ctrl+Shift+P, type "Remote-SSH: Open Configuration File", and add your NemoClaw instance details (same format as ~/.ssh/config shown above).'},{title:"Connect to the instance",content:'Press Ctrl+Shift+P, type "Remote-SSH: Connect to Host", and select your NemoClaw instance. VS Code will install its server component on the remote machine (first connection only).'},{title:"Open the NemoClaw directory",content:"Once connected, use File > Open Folder to navigate to your NemoClaw installation directory, typically /opt/nemoclaw or ~/nemoclaw."},{title:"Access the Control UI",content:'VS Code automatically detects port forwarding. When NemoClaw is running, VS Code will offer to forward port 18789. You can also manually forward ports in the "Ports" panel at the bottom of the VS Code window.'}]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The advantage of VS Code Remote SSH over plain SSH is the ability to edit NemoClaw configuration files, policy rules, and SOUL.md documents with full editor features including syntax highlighting, IntelliSense, and integrated git. For teams that frequently modify NemoClaw policies, this workflow is significantly more productive than command-line editing."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Tailscale"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Tailscale is a zero-configuration mesh VPN built on WireGuard. It assigns each device a stable IP address in the 100.x.y.z range and handles NAT traversal, key management, and access control automatically. For NemoClaw deployments, Tailscale is the recommended approach because it eliminates the need for any public inbound ports."}),e.jsx(t,{language:"bash",title:"Installing Tailscale on Your NemoClaw Instance",code:`# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start Tailscale and authenticate
sudo tailscale up

# Check your Tailscale IP
tailscale ip -4
# Output: 100.64.0.2 (example)

# From your local machine (also running Tailscale):
ssh ubuntu@100.64.0.2

# Access Control UI directly:
# http://100.64.0.2:18789

# No SSH tunneling needed -- Tailscale creates a direct encrypted path`}),e.jsx(a,{type:"info",title:"Tailscale SSH",children:e.jsxs("p",{children:["Tailscale can replace OpenSSH entirely with its built-in SSH server. Enable it with ",e.jsx("code",{children:"tailscale up --ssh"})," on the remote instance. This allows SSH access using Tailscale identity without managing SSH keys -- authentication is handled through your Tailscale identity provider (Google, GitHub, Microsoft, etc.)."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"WireGuard (Manual Setup)"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"WireGuard is the underlying protocol that Tailscale uses, but you can also configure it directly for full control over your VPN topology. Manual WireGuard setup is more complex than Tailscale but gives you complete control over routing, DNS, and network configuration. It is best suited for teams with existing WireGuard infrastructure or specific compliance requirements."}),e.jsx(t,{language:"bash",title:"WireGuard Setup on the NemoClaw Instance (Server Side)",code:`# Install WireGuard
sudo apt update && sudo apt install -y wireguard

# Generate server keys
wg genkey | sudo tee /etc/wireguard/server_private.key | wg pubkey | sudo tee /etc/wireguard/server_public.key
sudo chmod 600 /etc/wireguard/server_private.key

# Create server config
sudo cat > /etc/wireguard/wg0.conf << 'EOF'
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <server-private-key>

[Peer]
# Your local machine
PublicKey = <client-public-key>
AllowedIPs = 10.0.0.2/32
EOF

# Start WireGuard
sudo wg-quick up wg0
sudo systemctl enable wg-quick@wg0`}),e.jsx(i,{title:"WireGuard Requires an Inbound Port",children:e.jsx("p",{children:"Unlike Tailscale which uses NAT traversal, a manual WireGuard server requires UDP port 51820 to be open in your security group. This is still more secure than exposing SSH or HTTP ports, since WireGuard uses cryptographic authentication and silently drops all packets from unknown peers. However, it does increase your attack surface compared to a zero-inbound-port Tailscale setup."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Comparison of Access Methods"}),e.jsx(r,{title:"Remote Access Methods Compared",headers:["Method","Setup Complexity","Public Ports Needed","Best For"],rows:[["SSH Tunneling","Low","SSH (22)","Quick access, single user, simple setups"],["VS Code Remote SSH","Low","SSH (22)","Active development on NemoClaw config/policies"],["Tailscale","Very Low","None","Team access, zero-trust, recommended default"],["WireGuard (manual)","High","UDP 51820","Existing WireGuard infra, compliance requirements"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Best Practices"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Use key-based SSH authentication only."})," Disable password authentication in ",e.jsx("code",{children:"/etc/ssh/sshd_config"})," by setting",e.jsx("code",{children:" PasswordAuthentication no"}),". This eliminates brute-force password attacks."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Disable root SSH login."})," Set",e.jsx("code",{children:" PermitRootLogin no"})," in sshd_config. Use a regular user and",e.jsx("code",{children:" sudo"})," when elevated privileges are needed."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Keep SSH keys secure."})," Use Ed25519 keys (",e.jsx("code",{children:"ssh-keygen -t ed25519"}),") and protect private keys with a passphrase. Never share private keys across team members -- each person should have their own key pair."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Rotate access regularly."})," Remove SSH keys and Tailscale devices for team members who no longer need access. Audit authorized_keys files monthly."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Log all access."})," SSH logs to",e.jsx("code",{children:" /var/log/auth.log"})," by default. Tailscale provides audit logs in its admin console. Review these logs periodically for unexpected access patterns."]})]}),e.jsx(n,{question:"Which remote access method allows you to run a NemoClaw cloud instance with zero public inbound ports?",options:["SSH tunneling with key-based auth","VS Code Remote SSH","Tailscale","Manual WireGuard VPN"],correctIndex:2,explanation:"Tailscale uses NAT traversal to establish connections without any inbound ports. SSH tunneling and VS Code Remote SSH both require port 22 open, and manual WireGuard requires UDP port 51820."}),e.jsx(s,{references:[{title:"VS Code Remote SSH Documentation",url:"https://code.visualstudio.com/docs/remote/ssh",type:"docs",description:"Official guide for setting up and using VS Code Remote SSH."},{title:"Tailscale Getting Started",url:"https://tailscale.com/kb/1017/install/",type:"docs",description:"Installation and initial setup guide for Tailscale."},{title:"WireGuard Quick Start",url:"https://www.wireguard.com/quickstart/",type:"docs",description:"Official WireGuard installation and configuration guide."}]})]})}const W=Object.freeze(Object.defineProperty({__proto__:null,default:u},Symbol.toStringTag,{value:"Module"}));function m(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Launching an EC2 Instance for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Amazon EC2 is the most widely used cloud compute service and an excellent platform for hosting NemoClaw. This section walks you through launching a properly configured EC2 instance from scratch, including selecting the right AMI, configuring storage, setting up the security group, and verifying connectivity. By the end, you will have a running Ubuntu 22.04 instance ready for NemoClaw installation."}),e.jsx(a,{type:"info",title:"Prerequisites",children:e.jsx("p",{children:"You need an AWS account with permissions to create EC2 instances, security groups, and key pairs. The AWS CLI should be installed and configured on your local machine, though you can also complete these steps through the AWS Console web interface."})}),e.jsx(o,{title:"Launch an EC2 Instance via AWS Console",steps:[{title:"Navigate to EC2 Dashboard",content:"Log into the AWS Console, select your preferred region (choose one close to your team for lower latency), and navigate to EC2 > Instances > Launch Instances."},{title:"Name your instance",content:'Enter a descriptive name like "nemoclaw-prod" or "nemoclaw-staging". Tags help you identify resources later and are essential for cost tracking.'},{title:"Select the AMI",content:'Choose Ubuntu Server 22.04 LTS (HVM), SSD Volume Type. Use the 64-bit (x86) architecture unless you specifically need ARM (Graviton). The AMI ID varies by region but is always listed under "Quick Start" AMIs.'},{title:"Choose instance type",content:"Select t3.xlarge (4 vCPU, 16 GB RAM) as the recommended starting point for small to medium teams. For budget testing, t3.large (2 vCPU, 8 GB) works but may exhibit performance constraints under load. For larger teams, consider c6i.2xlarge (8 vCPU, 16 GB) for CPU-optimized performance."},{title:"Create or select a key pair",content:'Create a new ED25519 key pair named "nemoclaw-key". Download the .pem file and store it securely. Set permissions with: chmod 400 nemoclaw-key.pem. You will need this file for SSH access.'},{title:"Configure network settings",content:'Select your VPC (default VPC is fine for most cases). Enable "Auto-assign public IP" so you can SSH in initially. Create a new security group with SSH (port 22) access restricted to your IP address only. Do NOT add HTTP or HTTPS rules.'},{title:"Configure storage",content:"Change the root volume from the default 8 GB to 30 GB. Select gp3 (General Purpose SSD) for the volume type -- it offers better price/performance than gp2. If you plan to store extensive logs or workspace data, increase to 50 GB."},{title:"Launch the instance",content:"Review your configuration and click Launch Instance. Note the instance ID for reference."},{title:"Wait for initialization",content:'The instance will transition from "pending" to "running" within 30-60 seconds. Wait for both status checks (system and instance) to show "2/2 checks passed" before connecting.'},{title:"Connect via SSH",content:"Copy the public IPv4 address from the instance details. Connect with: ssh -i nemoclaw-key.pem ubuntu@<public-ip>. Accept the host key fingerprint on first connection."}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"CLI Alternative"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If you prefer the command line, the following AWS CLI commands accomplish the same setup. This approach is also useful for automation and repeatable deployments."}),e.jsx(t,{language:"bash",title:"Launch EC2 via AWS CLI",code:`# Create key pair
aws ec2 create-key-pair \\
  --key-name nemoclaw-key \\
  --key-type ed25519 \\
  --query 'KeyMaterial' \\
  --output text > nemoclaw-key.pem
chmod 400 nemoclaw-key.pem

# Create security group
SG_ID=$(aws ec2 create-security-group \\
  --group-name nemoclaw-sg \\
  --description "NemoClaw SSH only" \\
  --query 'GroupId' \\
  --output text)

# Add SSH rule (replace YOUR_IP)
aws ec2 authorize-security-group-ingress \\
  --group-id $SG_ID \\
  --protocol tcp \\
  --port 22 \\
  --cidr YOUR_IP/32

# Find the latest Ubuntu 22.04 AMI
AMI_ID=$(aws ec2 describe-images \\
  --owners 099720109477 \\
  --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \\
  --query 'sort_by(Images, &CreationDate)[-1].ImageId' \\
  --output text)

# Launch the instance
INSTANCE_ID=$(aws ec2 run-instances \\
  --image-id $AMI_ID \\
  --instance-type t3.xlarge \\
  --key-name nemoclaw-key \\
  --security-group-ids $SG_ID \\
  --block-device-mappings '[{
    "DeviceName": "/dev/sda1",
    "Ebs": {
      "VolumeSize": 30,
      "VolumeType": "gp3",
      "DeleteOnTermination": true
    }
  }]' \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=nemoclaw-prod}]' \\
  --query 'Instances[0].InstanceId' \\
  --output text)

echo "Instance launched: $INSTANCE_ID"

# Wait for the instance to be running
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

# Get the public IP
PUBLIC_IP=$(aws ec2 describe-instances \\
  --instance-ids $INSTANCE_ID \\
  --query 'Reservations[0].Instances[0].PublicIpAddress' \\
  --output text)

echo "Connect with: ssh -i nemoclaw-key.pem ubuntu@$PUBLIC_IP"`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Storage Considerations"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The default 8 GB root volume on most AMIs is insufficient for NemoClaw. Here is a breakdown of typical storage usage:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Ubuntu base system:"})," approximately 4-5 GB"]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Node.js runtime and dependencies:"})," approximately 500 MB"]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"NemoClaw binaries and policy engine:"})," approximately 200 MB"]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Workspace data and session logs:"})," varies, 1-10 GB over time"]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"System logs and package cache:"})," approximately 1-2 GB"]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Safety margin:"})," always keep at least 5 GB free"]})]}),e.jsx(i,{title:"Running Out of Disk Space",children:e.jsxs("p",{children:["If the root volume fills up, NemoClaw's session store will fail to persist data, log rotation will stop, and the system may become unresponsive. Set up a disk usage alert using CloudWatch or a simple cron job that checks ",e.jsx("code",{children:"df -h"})," and sends a notification when usage exceeds 80%."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Elastic IP (Optional but Recommended)"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"By default, EC2 instances receive a new public IP address each time they are stopped and started. For a production NemoClaw deployment, associate an Elastic IP to get a static public address that persists across instance restarts. This is especially important if you are using IP-restricted SSH access in your security group."}),e.jsx(t,{language:"bash",title:"Associate an Elastic IP",code:`# Allocate an Elastic IP
EIP_ALLOC=$(aws ec2 allocate-address \\
  --domain vpc \\
  --query 'AllocationId' \\
  --output text)

# Associate it with your instance
aws ec2 associate-address \\
  --instance-id $INSTANCE_ID \\
  --allocation-id $EIP_ALLOC

# Note: Elastic IPs are free while associated with a running instance.
# You are charged ~$3.65/month if the IP is allocated but not associated.`}),e.jsx(n,{question:"What is the recommended minimum root volume size when launching an EC2 instance for NemoClaw?",options:["8 GB (AMI default)","15 GB","30 GB","100 GB"],correctIndex:2,explanation:"30 GB is the recommended minimum, accounting for the Ubuntu base system (~5 GB), NemoClaw and its dependencies (~1 GB), workspace data and logs (1-10 GB), and a safety margin. The default 8 GB is insufficient and will quickly fill up."}),e.jsx(s,{references:[{title:"AWS EC2 Getting Started",url:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html",type:"docs",description:"Official AWS guide to launching your first EC2 instance."},{title:"EC2 Instance Types",url:"https://aws.amazon.com/ec2/instance-types/",type:"docs",description:"Complete reference for all EC2 instance families and their specifications."},{title:"EBS Volume Types",url:"https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html",type:"docs",description:"Comparison of gp2, gp3, io1, io2, and other EBS volume types."}]})]})}const F=Object.freeze(Object.defineProperty({__proto__:null,default:m},Symbol.toStringTag,{value:"Module"}));function h(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"AWS Security Groups and IAM for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Securing a NemoClaw deployment on AWS involves two layers: network-level controls via security groups and identity-level controls via IAM (Identity and Access Management). The security group ensures that only authorized network traffic reaches your instance, while IAM roles control what AWS services the instance can access. Together, they implement the principle of least privilege -- granting only the minimum access required for NemoClaw to function."}),e.jsx(l,{term:"Principle of Least Privilege",definition:"A security concept that dictates every identity (user, role, service) should have only the minimum permissions necessary to perform its intended function. In the context of NemoClaw on AWS, this means the EC2 instance should only be able to access specific S3 buckets or other services it genuinely needs, not all AWS resources in the account.",example:"An IAM role attached to a NemoClaw EC2 instance that grants read/write access to a single S3 bucket for backup storage, but no access to any other S3 buckets, DynamoDB tables, or other services.",seeAlso:["IAM Role","Security Group","Instance Profile"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Security Group: SSH Only"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"As covered in the fundamentals chapter, NemoClaw requires no inbound ports beyond SSH. Here is the detailed AWS security group configuration with explanations for each rule."}),e.jsx(o,{title:"Create a Hardened Security Group",steps:[{title:"Create the security group",content:'In the EC2 Console, go to Security Groups > Create Security Group. Name it "nemoclaw-sg", provide a description like "NemoClaw instance - SSH only inbound", and select your VPC.'},{title:"Add SSH inbound rule",content:'Add a single inbound rule: Type = SSH, Protocol = TCP, Port = 22, Source = "My IP" (or enter your specific CIDR). The "My IP" option automatically detects your current public IP address.'},{title:"Verify no other inbound rules exist",content:"Ensure there are no other inbound rules. Remove any default HTTP (80) or HTTPS (443) rules if they were auto-added. The implicit deny-all handles everything else."},{title:"Leave outbound rules as default",content:"The default outbound rule allows all traffic to all destinations. NemoClaw needs outbound HTTPS (443) to reach Anthropic/OpenAI APIs, Slack, Discord, and package repositories. Allowing all outbound is the simplest approach."},{title:"Apply to your instance",content:"Select your NemoClaw EC2 instance, go to Actions > Security > Change Security Groups, and attach the nemoclaw-sg group. Remove any other security groups."}]}),e.jsx(a,{type:"tip",title:"Strict Outbound Rules (Optional)",children:e.jsxs("p",{children:["For high-security environments, you can restrict outbound rules to only necessary destinations: HTTPS (443) to ",e.jsx("code",{children:"api.anthropic.com"}),", ",e.jsx("code",{children:"api.openai.com"}),",",e.jsx("code",{children:"wss-primary.slack.com"}),", ",e.jsx("code",{children:"gateway.discord.gg"}),", and your package repositories. This limits the blast radius if the instance is compromised, but requires maintenance as API endpoints change."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"IAM Roles for EC2"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If your NemoClaw deployment needs to interact with AWS services -- for example, storing backups in S3, reading secrets from Secrets Manager, or publishing metrics to CloudWatch -- the correct approach is to attach an IAM role to the EC2 instance. Never store AWS access keys on the instance; IAM roles provide temporary credentials that rotate automatically."}),e.jsx(i,{title:"Never Use Long-Lived Access Keys",children:e.jsx("p",{children:"Storing AWS access key IDs and secret access keys in environment variables or configuration files on the instance is a serious security risk. If the instance is compromised, the attacker gains persistent access to your AWS account. IAM roles provide temporary credentials that expire and rotate automatically, limiting the blast radius of a compromise."})}),e.jsx(t,{language:"json",title:"IAM Policy: NemoClaw S3 Backup Access",code:`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "NemoClawBackupBucket",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::nemoclaw-backups-ACCOUNT_ID",
        "arn:aws:s3:::nemoclaw-backups-ACCOUNT_ID/*"
      ]
    }
  ]
}`}),e.jsx(t,{language:"json",title:"IAM Policy: NemoClaw Secrets Manager Access",code:`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "NemoClawSecrets",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:nemoclaw/*"
      ]
    }
  ]
}`}),e.jsx(o,{title:"Create and Attach an IAM Role",steps:[{title:"Create the IAM policy",content:'In the IAM Console, go to Policies > Create Policy. Paste the JSON policy above (modify resource ARNs for your account). Name it "NemoClawEC2Policy".'},{title:"Create the IAM role",content:'Go to Roles > Create Role. Select "AWS service" as the trusted entity, then select "EC2" as the use case. Attach the "NemoClawEC2Policy" you just created. Name the role "NemoClawEC2Role".'},{title:"Attach the role to your instance",content:'In the EC2 Console, select your NemoClaw instance. Go to Actions > Security > Modify IAM Role. Select "NemoClawEC2Role" and save. The instance can now use AWS services without explicit credentials.'},{title:"Verify from the instance",content:"SSH into the instance and run: aws sts get-caller-identity. It should show the NemoClawEC2Role as the assumed identity. Run: aws s3 ls s3://nemoclaw-backups-ACCOUNT_ID/ to verify S3 access works."}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Common IAM Scenarios for NemoClaw"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"No AWS service integration:"})," No IAM role needed. This is the simplest case -- NemoClaw only communicates with external APIs (Anthropic, Slack) and does not touch any AWS services."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"S3 for backups:"})," Grant PutObject, GetObject, ListBucket, and DeleteObject on a single dedicated bucket. Create the bucket with server-side encryption enabled."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Secrets Manager for API keys:"})," Store your Anthropic API key, Slack tokens, and other secrets in Secrets Manager instead of environment variables. Grant GetSecretValue on the specific secret ARN only."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"CloudWatch for monitoring:"})," Grant PutMetricData and CreateLogGroup/PutLogEvents to publish NemoClaw metrics and logs to CloudWatch for centralized monitoring."]})]}),e.jsx(a,{type:"info",title:"When You Do Not Need IAM",children:e.jsx("p",{children:"If your NemoClaw deployment only communicates with external services (LLM APIs, Slack, Discord) and uses local file storage for session data, you do not need any IAM role at all. The principle of least privilege means granting zero AWS permissions when none are required. You can always add an IAM role later if your needs change."})}),e.jsx(n,{question:"Why should you use an IAM role instead of storing AWS access keys in environment variables on the NemoClaw instance?",options:["IAM roles are faster than access keys","IAM roles provide temporary, automatically-rotating credentials that limit blast radius if compromised","Access keys do not work on EC2 instances","IAM roles are required by AWS for all EC2 instances"],correctIndex:1,explanation:"IAM roles issue temporary credentials (via the instance metadata service) that automatically rotate. If the instance is compromised, the attacker only has access until the current credentials expire. Long-lived access keys, by contrast, remain valid until explicitly revoked, giving attackers persistent access."}),e.jsx(s,{references:[{title:"IAM Roles for EC2",url:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html",type:"docs",description:"How to create and attach IAM roles to EC2 instances."},{title:"IAM Best Practices",url:"https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",type:"docs",description:"AWS security best practices for IAM configuration."}]})]})}const $=Object.freeze(Object.defineProperty({__proto__:null,default:h},Symbol.toStringTag,{value:"Module"}));function p(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Installing NemoClaw on EC2"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With your EC2 instance launched and security configured, it is time to install NemoClaw. This section provides a complete step-by-step walkthrough covering system preparation, the NemoClaw install script, onboarding configuration, and verification. The entire process takes approximately 10-15 minutes on a fresh Ubuntu 22.04 instance."}),e.jsx(a,{type:"info",title:"Prerequisites",children:e.jsx("p",{children:"You should have a running EC2 instance (t3.xlarge or larger) with Ubuntu 22.04, SSH access configured, and 30 GB or more of gp3 storage. You will also need your Anthropic API key (or other LLM provider credentials) and your Slack or Discord bot tokens ready."})}),e.jsx(o,{title:"Full Installation Walkthrough",steps:[{title:"SSH into your instance",content:"Connect to your EC2 instance using: ssh -i nemoclaw-key.pem ubuntu@<public-ip>. If you configured SSH in ~/.ssh/config, simply run: ssh nemoclaw."},{title:"Update the system",content:`Run a full system update to ensure all packages are current. This is critical on a fresh instance where security patches may be pending.

sudo apt update && sudo apt upgrade -y`},{title:"Install system dependencies",content:`NemoClaw requires Node.js 20+, git, and a few system libraries. Install them with:

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential`},{title:"Verify Node.js installation",content:`Confirm the correct versions are installed:

node --version    # Should show v20.x or later
npm --version     # Should show 10.x or later`},{title:"Run the NemoClaw install script",content:`NemoClaw provides a single install script that downloads and sets up both the OpenClaw Gateway and the NemoClaw policy engine:

curl -fsSL https://install.nemoclaw.dev | bash

The script installs to ~/nemoclaw by default. It downloads the Gateway, the policy engine binary, and all Node.js dependencies.`},{title:"Run the onboarding wizard",content:`After installation completes, start the onboarding process:

cd ~/nemoclaw
npx nemoclaw onboard

The wizard prompts you for:
- LLM provider selection (Anthropic recommended)
- API key
- Platform integration (Slack, Discord, or CLI-only)
- Platform tokens/credentials
- Default policy mode (audit or enforce)`},{title:"Configure environment variables",content:`The onboarding wizard creates a .env file. Verify its contents:

cat ~/nemoclaw/.env

Ensure ANTHROPIC_API_KEY, SLACK_BOT_TOKEN (if using Slack), and other credentials are set correctly. These should be the only place credentials are stored.`},{title:"Start NemoClaw",content:`Launch NemoClaw with:

cd ~/nemoclaw
npx nemoclaw start

You should see log output indicating the Gateway is starting, the policy engine is loading rules, and platform connections are being established.`},{title:"Verify the deployment",content:`Check that all components are running:

npx nemoclaw status

This should report the Gateway as "running", the policy engine as "active", and any platform integrations as "connected".`},{title:"Access the Control UI",content:`From your local machine, set up an SSH tunnel:

ssh -L 18789:localhost:18789 -i nemoclaw-key.pem ubuntu@<public-ip>

Then open http://localhost:18789 in your browser to access the NemoClaw Control UI.`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Setting Up as a Systemd Service"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For production deployments, NemoClaw should run as a systemd service so it starts automatically on boot and restarts on failure. Create a service file:"}),e.jsx(t,{language:"bash",title:"Create systemd service",code:`sudo cat > /etc/systemd/system/nemoclaw.service << 'EOF'
[Unit]
Description=NemoClaw Agent Security Platform
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/nemoclaw
ExecStart=/usr/bin/npx nemoclaw start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd, enable, and start
sudo systemctl daemon-reload
sudo systemctl enable nemoclaw
sudo systemctl start nemoclaw

# Check status
sudo systemctl status nemoclaw

# View logs
sudo journalctl -u nemoclaw -f`}),e.jsx(i,{title:"Environment Variables with Systemd",children:e.jsxs("p",{children:["Systemd services do not automatically load ",e.jsx("code",{children:".env"})," files. You have two options: add each variable as an ",e.jsx("code",{children:"Environment="})," line in the service file, or use",e.jsx("code",{children:"EnvironmentFile=/home/ubuntu/nemoclaw/.env"})," in the ",e.jsx("code",{children:"[Service]"}),"section. The EnvironmentFile approach is recommended because it keeps credentials out of systemd unit files, which are readable by any user on the system."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Verifying Everything Works"}),e.jsx(t,{language:"bash",title:"Post-Installation Verification",code:`# Check NemoClaw processes
ps aux | grep nemoclaw

# Verify the policy engine is loaded
npx nemoclaw policy status

# Test a policy evaluation (dry run)
npx nemoclaw policy test --action "shell.execute" --command "rm -rf /"
# Expected: DENIED by default safety policy

# Check platform connectivity
npx nemoclaw status --verbose

# Send a test message via Slack/Discord and verify
# the agent responds and policies are evaluated`}),e.jsx(a,{type:"tip",title:"Troubleshooting",children:e.jsxs("p",{children:["If NemoClaw fails to start, check the following common issues: (1) Node.js version too old -- verify with ",e.jsx("code",{children:"node --version"}),", must be 20+. (2) Missing API key -- check ",e.jsx("code",{children:".env"})," file. (3) Slack token invalid -- regenerate in the Slack API dashboard. (4) Port conflict -- ensure nothing else is using port 18789. Check logs with ",e.jsx("code",{children:"journalctl -u nemoclaw --no-pager -n 50"})," for specific error messages."]})}),e.jsx(n,{question:"After installing NemoClaw on EC2, what is the recommended way to run it in production?",options:["Run npx nemoclaw start in a tmux session","Use nohup to run it in the background","Configure it as a systemd service with auto-restart","Run it in a Docker container with --restart=always"],correctIndex:2,explanation:"A systemd service is the recommended approach for production. It ensures NemoClaw starts on boot, automatically restarts on failure, integrates with the system journal for logging, and provides standard management commands (start, stop, status). Tmux and nohup are fragile alternatives that do not survive reboots."}),e.jsx(s,{references:[{title:"NemoClaw Installation Guide",url:"https://docs.nemoclaw.dev/installation",type:"docs",description:"Official NemoClaw installation documentation with platform-specific instructions."},{title:"Systemd Service Files",url:"https://www.freedesktop.org/software/systemd/man/systemd.service.html",type:"docs",description:"Complete reference for systemd service unit file options."}]})]})}const K=Object.freeze(Object.defineProperty({__proto__:null,default:p},Symbol.toStringTag,{value:"Module"}));function g(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"GPU Instances for Local Inference on AWS"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Running large language models locally on your NemoClaw instance eliminates API call costs, reduces latency, and keeps all data within your infrastructure. AWS offers several GPU instance families suitable for LLM inference. This section covers the key options, NVIDIA driver setup, and practical considerations for choosing the right GPU instance."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GPU Instance Families"}),e.jsx(r,{title:"AWS GPU Instances for Inference",headers:["Instance","GPU","VRAM","vCPUs","RAM","On-Demand $/hr","Best For"],rows:[["g4dn.xlarge","NVIDIA T4","16 GB","4","16 GB","~$0.526","Small models (7B params), budget inference"],["g4dn.2xlarge","NVIDIA T4","16 GB","8","32 GB","~$0.752","Small models with more CPU headroom"],["g5.xlarge","NVIDIA A10G","24 GB","4","16 GB","~$1.006","Medium models (13B params), good price/performance"],["g5.2xlarge","NVIDIA A10G","24 GB","8","32 GB","~$1.212","Medium models with concurrent workloads"],["p3.2xlarge","NVIDIA V100","16 GB","8","61 GB","~$3.06","Older but powerful, high RAM for Gateway"],["p4d.24xlarge","8x NVIDIA A100","8x 40 GB","96","1152 GB","~$32.77","Large models (70B+), multi-GPU inference"]]}),e.jsx(a,{type:"info",title:"Recommended Starting Point",children:e.jsxs("p",{children:["For most NemoClaw deployments with local inference, the ",e.jsx("strong",{children:"g5.xlarge"})," offers the best balance of price and performance. Its 24 GB VRAM can run quantized 13B parameter models comfortably, and its A10G GPU delivers strong inference throughput. The g4dn.xlarge is a solid budget option for 7B models."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"NVIDIA Driver Setup"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"GPU instances require NVIDIA drivers and the CUDA toolkit to be installed before the GPU can be used for inference. AWS provides a Deep Learning AMI with drivers pre-installed, but if you are using a standard Ubuntu AMI, you will need to install drivers manually."}),e.jsx(o,{title:"Install NVIDIA Drivers on Ubuntu 22.04",steps:[{title:"Update and install prerequisites",content:`sudo apt update && sudo apt upgrade -y
sudo apt install -y linux-headers-$(uname -r) build-essential`},{title:"Add the NVIDIA driver repository",content:`sudo apt install -y ubuntu-drivers-common
sudo ubuntu-drivers devices

This shows the recommended driver version for your GPU. Typically you want the latest "server" driver.`},{title:"Install the recommended driver",content:`sudo ubuntu-drivers autoinstall

Alternatively, install a specific version:
sudo apt install -y nvidia-driver-535-server`},{title:"Reboot the instance",content:`sudo reboot

Wait 1-2 minutes, then SSH back in.`},{title:"Verify the driver installation",content:`nvidia-smi

This should display the GPU model, driver version, CUDA version, temperature, and memory usage. If you see an error, the driver did not install correctly.`},{title:"Install CUDA toolkit (optional but recommended)",content:`wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update
sudo apt install -y cuda-toolkit-12-4

Add to PATH:
export PATH=/usr/local/cuda-12.4/bin:$PATH
echo 'export PATH=/usr/local/cuda-12.4/bin:$PATH' >> ~/.bashrc`}]}),e.jsx(t,{language:"bash",title:"Quick Alternative: AWS Deep Learning AMI",code:`# Instead of manual driver setup, launch with the DL AMI:
# AMI Name: "Deep Learning AMI (Ubuntu 22.04)"
# This comes with NVIDIA drivers, CUDA, cuDNN, and
# popular ML frameworks pre-installed.

# Find the latest DL AMI:
aws ec2 describe-images \\
  --owners amazon \\
  --filters "Name=name,Values=Deep Learning AMI (Ubuntu 22.04)*" \\
  --query 'sort_by(Images, &CreationDate)[-1].[ImageId,Name]' \\
  --output text`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Running Local Models with NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Once drivers are installed, you can configure NemoClaw to use a local LLM backend instead of (or in addition to) cloud API providers. NemoClaw supports local inference through compatible backends like Ollama, vLLM, or llama.cpp server."}),e.jsx(t,{language:"bash",title:"Setting Up Ollama for Local Inference",code:`# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (adjust based on your VRAM)
# 16 GB VRAM (T4/V100): Use 7B quantized models
ollama pull codellama:7b-instruct-q4_K_M

# 24 GB VRAM (A10G): Use 13B quantized models
ollama pull codellama:13b-instruct-q4_K_M

# Verify the model runs
ollama run codellama:7b-instruct-q4_K_M "Write a hello world in Python"

# Ollama serves on http://localhost:11434 by default
# Configure NemoClaw to use it in openclaw.json:
# {
#   "llm": {
#     "provider": "ollama",
#     "baseUrl": "http://localhost:11434",
#     "model": "codellama:13b-instruct-q4_K_M"
#   }
# }`}),e.jsx(i,{title:"VRAM Limitations",children:e.jsxs("p",{children:["If you attempt to load a model that exceeds available VRAM, inference will fall back to CPU processing (if the backend supports it), resulting in dramatically slower response times -- often 10-50x slower. Always verify that your chosen model fits within GPU memory. Run ",e.jsx("code",{children:"nvidia-smi"})," while the model is loaded to confirm VRAM usage is within bounds."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GPU Instance Availability"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"GPU instances are in high demand and frequently unavailable in popular regions. If you cannot launch a GPU instance in your preferred region, try these strategies:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Try alternate regions"})," -- us-west-2 (Oregon) and us-east-1 (Virginia) typically have the most capacity."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Request a quota increase"})," -- new AWS accounts have a GPU instance quota of zero. Go to Service Quotas in the AWS Console and request an increase for your desired instance type."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Use Spot instances"})," -- GPU Spot instances can be 60-90% cheaper than On-Demand and are often available when On-Demand capacity is exhausted."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Consider capacity reservations"})," -- for guaranteed availability, reserve capacity in advance (comes with a cost commitment)."]})]}),e.jsx(n,{question:"You want to run a quantized 13B parameter model for local inference with NemoClaw on AWS. Which instance type offers the best price/performance?",options:["g4dn.xlarge (T4, 16 GB VRAM) -- cheapest GPU option","g5.xlarge (A10G, 24 GB VRAM) -- balanced price/performance","p3.2xlarge (V100, 16 GB VRAM) -- powerful GPU","p4d.24xlarge (8x A100, 320 GB VRAM) -- maximum performance"],correctIndex:1,explanation:"The g5.xlarge with its A10G GPU (24 GB VRAM) is the best choice. 13B quantized models typically require 18-22 GB of VRAM, which fits comfortably in the A10G's 24 GB but exceeds the T4/V100's 16 GB. The p4d is massive overkill and costs 30x more."}),e.jsx(s,{references:[{title:"AWS GPU Instance Types",url:"https://aws.amazon.com/ec2/instance-types/#Accelerated_Computing",type:"docs",description:"Complete specifications for all GPU-accelerated EC2 instance families."},{title:"NVIDIA Driver Installation on Linux",url:"https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/",type:"docs",description:"Official NVIDIA guide for installing datacenter GPU drivers."},{title:"Ollama Documentation",url:"https://ollama.ai/",type:"docs",description:"Getting started with Ollama for local LLM inference."}]})]})}const Y=Object.freeze(Object.defineProperty({__proto__:null,default:g},Symbol.toStringTag,{value:"Module"}));function y(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"AWS Cost Optimization for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Cloud costs can escalate quickly, especially with GPU instances. A NemoClaw deployment that costs $50/month on a well-optimized t3.xlarge can balloon to $500+/month with an always-on GPU instance or a forgotten oversized reservation. This section covers practical strategies for minimizing AWS costs without sacrificing NemoClaw's reliability or performance."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Cost Estimates by Configuration"}),e.jsx(r,{title:"Monthly Cost Estimates (us-east-1, On-Demand)",headers:["Configuration","Instance","Storage","Data Transfer","Total/Month"],rows:[["Budget / Testing","t3.large ($60)","30GB gp3 ($2.40)","~$5","~$67"],["Small Team Production","t3.xlarge ($121)","30GB gp3 ($2.40)","~$5","~$128"],["Large Team Production","c6i.2xlarge ($245)","50GB gp3 ($4)","~$10","~$259"],["GPU (T4)","g4dn.xlarge ($383)","50GB gp3 ($4)","~$5","~$392"],["GPU (A10G)","g5.xlarge ($733)","50GB gp3 ($4)","~$5","~$742"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Spot Instances"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Spot instances use AWS's spare compute capacity at discounts of 60-90% compared to On-Demand pricing. The tradeoff is that AWS can reclaim the instance with a two-minute warning when capacity is needed. For NemoClaw, Spot works well in specific scenarios."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Good for:"})," Development and testing environments, batch policy testing, non-critical NemoClaw deployments where brief downtime is acceptable."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Not ideal for:"})," Production NemoClaw deployments that require 24/7 availability. A Spot interruption terminates active agent sessions and disconnects platform integrations until the instance is replaced."]})]}),e.jsx(t,{language:"bash",title:"Launch a Spot Instance",code:`# Check current Spot pricing
aws ec2 describe-spot-price-history \\
  --instance-types t3.xlarge \\
  --product-descriptions "Linux/UNIX" \\
  --start-time $(date -u +%Y-%m-%dT%H:%M:%S) \\
  --query 'SpotPriceHistory[0].SpotPrice'

# Launch a Spot instance
aws ec2 run-instances \\
  --image-id ami-0abcdef1234567890 \\
  --instance-type t3.xlarge \\
  --key-name nemoclaw-key \\
  --security-group-ids sg-0123456789abcdef0 \\
  --instance-market-options '{
    "MarketType": "spot",
    "SpotOptions": {
      "SpotInstanceType": "persistent",
      "InstanceInterruptionBehavior": "stop"
    }
  }' \\
  --block-device-mappings '[{
    "DeviceName": "/dev/sda1",
    "Ebs": {"VolumeSize": 30, "VolumeType": "gp3"}
  }]'`}),e.jsx(a,{type:"tip",title:"Spot with Persistent Behavior",children:e.jsxs("p",{children:["Setting ",e.jsx("code",{children:"InstanceInterruptionBehavior"}),' to "stop" instead of "terminate" means AWS will stop (not destroy) your instance during a Spot reclamation. Your EBS volume and data are preserved. When Spot capacity returns, AWS automatically restarts your instance. Combined with a systemd service, NemoClaw resumes automatically after the restart.']})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Reserved Instances and Savings Plans"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If you plan to run NemoClaw continuously for a year or more, Reserved Instances (RIs) or Compute Savings Plans offer significant discounts (30-60%) over On-Demand pricing in exchange for a commitment."}),e.jsx(r,{title:"Savings Plans vs On-Demand (t3.xlarge)",headers:["Pricing Model","Monthly Cost","Savings","Commitment"],rows:[["On-Demand","~$121/mo","0%","None"],["1-Year No Upfront RI","~$87/mo","28%","1 year"],["1-Year All Upfront RI","~$77/mo","36%","1 year, pay upfront"],["3-Year All Upfront RI","~$50/mo","59%","3 years, pay upfront"],["Compute Savings Plan (1yr)","~$84/mo","30%","1 year, flexible instance types"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Auto-Stop Scripts"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For development and staging NemoClaw instances that are only needed during business hours, auto-stop scripts can cut costs by 65-75%. The idea is simple: automatically stop the instance outside working hours and start it when needed."}),e.jsx(t,{language:"bash",title:"CloudWatch Auto-Stop Schedule",code:`# Create an IAM role for Lambda (one-time setup)
# Then create a Lambda function to stop/start instances

# Simpler approach: Use AWS Instance Scheduler
# Or use a cron-based approach with the AWS CLI:

# stop-nemoclaw.sh (run via cron at 7 PM)
#!/bin/bash
INSTANCE_ID="i-0123456789abcdef0"
aws ec2 stop-instances --instance-ids $INSTANCE_ID
echo "$(date): Stopped $INSTANCE_ID" >> /var/log/nemoclaw-scheduler.log

# start-nemoclaw.sh (run via cron at 8 AM)
#!/bin/bash
INSTANCE_ID="i-0123456789abcdef0"
aws ec2 start-instances --instance-ids $INSTANCE_ID
echo "$(date): Started $INSTANCE_ID" >> /var/log/nemoclaw-scheduler.log

# Add to crontab on a separate always-on instance (e.g., t3.nano):
# 0 8 * * 1-5 /home/ubuntu/start-nemoclaw.sh    # Start Mon-Fri 8 AM
# 0 19 * * 1-5 /home/ubuntu/stop-nemoclaw.sh     # Stop Mon-Fri 7 PM`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Right-Sizing"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Many NemoClaw deployments are over-provisioned. After the first week of operation, review actual resource utilization to determine if you can downsize."}),e.jsx(o,{title:"Right-Sizing Your NemoClaw Instance",steps:[{title:"Enable detailed CloudWatch monitoring",content:"By default, EC2 reports metrics every 5 minutes. Enable detailed monitoring ($3.50/month) for 1-minute granularity: aws ec2 monitor-instances --instance-ids i-0123456789abcdef0"},{title:"Monitor for one week",content:"Let the instance run through a full business week to capture typical usage patterns. Check CPU, memory, and disk I/O in CloudWatch."},{title:"Analyze CPU utilization",content:"If average CPU utilization is below 20% and p95 is below 50%, you are likely over-provisioned on compute. Consider moving down one instance size."},{title:"Check memory usage",content:"Install the CloudWatch agent to report memory metrics (not included by default). If memory usage stays below 60%, you may be able to use a smaller instance."},{title:"Resize the instance",content:"Stop the instance, change the instance type (Actions > Instance Settings > Change Instance Type), and start it again. Monitor for another week to confirm the smaller instance handles the workload."}]}),e.jsx(i,{title:"Do Not Downsize Too Aggressively",children:e.jsx("p",{children:"NemoClaw's resource usage can spike during policy reloads, concurrent agent sessions, and tool execution bursts. A week of monitoring at average load may not capture peak usage. Leave at least 30% headroom on both CPU and memory to handle traffic spikes without degraded performance."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Additional Cost Tips"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Delete unused Elastic IPs."})," Unattached Elastic IPs cost ~$3.65/month. Release them when no longer needed."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Use gp3 instead of gp2 storage."})," gp3 offers the same performance at 20% lower cost with configurable IOPS."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Set up billing alerts."})," In the AWS Billing Dashboard, create a budget with alerts at 50%, 80%, and 100% of your expected monthly spend."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Review with AWS Cost Explorer."})," Check monthly where your NemoClaw costs are concentrated and identify optimization opportunities."]})]}),e.jsx(n,{question:"A development team runs a NemoClaw staging instance (t3.xlarge) 24/7 but only uses it during business hours (8 AM - 7 PM, Monday-Friday). How much could they save with an auto-stop schedule?",options:["About 10% -- minimal savings","About 35% -- stopping overnight saves some","About 67% -- the instance is off for roughly two-thirds of total hours","About 90% -- almost free"],correctIndex:2,explanation:"A business-hours schedule runs the instance 11 hours/day, 5 days/week = 55 hours/week out of 168 total hours. That means the instance is off for 113/168 = 67% of the time, saving approximately 67% of the compute cost. Storage costs remain constant."}),e.jsx(s,{references:[{title:"AWS Pricing Calculator",url:"https://calculator.aws/",type:"docs",description:"Estimate costs for your specific NemoClaw configuration."},{title:"EC2 Spot Instances",url:"https://aws.amazon.com/ec2/spot/",type:"docs",description:"Spot instance pricing, best practices, and interruption handling."},{title:"AWS Savings Plans",url:"https://aws.amazon.com/savingsplans/",type:"docs",description:"Flexible pricing model for sustained compute usage."}]})]})}const X=Object.freeze(Object.defineProperty({__proto__:null,default:y},Symbol.toStringTag,{value:"Module"}));function f(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Creating a GCE VM for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Google Cloud Platform's Compute Engine (GCE) provides virtual machines with predictable performance and tight integration with Google's global network. For NemoClaw, GCE offers competitive pricing, a wide range of machine types, and excellent network performance. This section walks through creating a properly configured GCE VM from scratch."}),e.jsx(a,{type:"info",title:"Prerequisites",children:e.jsxs("p",{children:["You need a GCP account with a billing-enabled project. Install the",e.jsx("code",{children:" gcloud"})," CLI locally and authenticate with ",e.jsx("code",{children:"gcloud auth login"}),". Alternatively, use the GCP Console web interface for all steps."]})}),e.jsx(o,{title:"Create a GCE VM via Console",steps:[{title:"Navigate to Compute Engine",content:"In the GCP Console, go to Compute Engine > VM Instances > Create Instance. If this is your first time using Compute Engine, you may need to wait a moment for the API to be enabled."},{title:"Name and region",content:'Name the instance "nemoclaw-prod" or similar. Select a region close to your team. For US-based teams, us-central1 (Iowa) typically offers the best pricing and availability. Select any available zone within the region.'},{title:"Choose machine type",content:"Under Machine Configuration, select the E2 series for cost-effective general purpose. Choose e2-standard-4 (4 vCPU, 16 GB RAM) as the recommended starting point. For budget testing, e2-standard-2 (2 vCPU, 8 GB) works. For larger teams, c2-standard-8 (8 vCPU, 32 GB) provides CPU-optimized performance."},{title:"Select boot disk",content:'Click "Change" on the Boot Disk section. Select Ubuntu 22.04 LTS as the operating system. Change the disk size from the default 10 GB to 30 GB. Select "Balanced persistent disk" (pd-balanced) for the disk type -- it offers good performance at reasonable cost.'},{title:"Configure firewall",content:`Under Firewall, do NOT check "Allow HTTP traffic" or "Allow HTTPS traffic". NemoClaw does not need any public web ports. SSH access is allowed by default through GCP's IAP (Identity-Aware Proxy) or the OS Login feature.`},{title:"Configure SSH access",content:"Under Security > SSH Keys, add your public SSH key. Alternatively, leave this empty and use GCP's browser-based SSH or gcloud compute ssh which handles key management automatically."},{title:"Network tags",content:'Under Networking > Network Tags, add the tag "nemoclaw". This tag will be used to apply firewall rules specifically to this instance.'},{title:"Create the VM",content:'Click "Create" and wait for the instance to start. This typically takes 30-60 seconds.'},{title:"Connect via SSH",content:`Use the gcloud CLI:

gcloud compute ssh nemoclaw-prod --zone=us-central1-a

Or click the "SSH" button in the Console to open a browser-based terminal.`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"CLI Alternative"}),e.jsx(t,{language:"bash",title:"Create GCE VM via gcloud CLI",code:`# Create the VM
gcloud compute instances create nemoclaw-prod \\
  --zone=us-central1-a \\
  --machine-type=e2-standard-4 \\
  --image-family=ubuntu-2204-lts \\
  --image-project=ubuntu-os-cloud \\
  --boot-disk-size=30GB \\
  --boot-disk-type=pd-balanced \\
  --tags=nemoclaw \\
  --metadata=enable-oslogin=TRUE

# The --metadata=enable-oslogin=TRUE flag enables OS Login,
# which uses your Google identity for SSH access instead of
# manually managing SSH keys.

# SSH into the instance
gcloud compute ssh nemoclaw-prod --zone=us-central1-a

# Get the external IP
gcloud compute instances describe nemoclaw-prod \\
  --zone=us-central1-a \\
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GCP SSH Access Methods"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"GCP offers several SSH access methods, each with different security characteristics:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"gcloud compute ssh:"})," The recommended method. Automatically manages SSH keys, supports OS Login, and works through IAP tunneling which does not require a public IP or open SSH port."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"IAP TCP Forwarding:"})," Routes SSH through Google's Identity-Aware Proxy. The VM does not need a public IP address at all. Enable with:",e.jsx("code",{children:" gcloud compute ssh nemoclaw-prod --tunnel-through-iap"}),"."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Browser SSH:"}),' Click the "SSH" button in the Console. Opens a terminal in your browser. Convenient but lacks the ability to set up port forwarding for the Control UI.']}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Direct SSH:"})," Traditional SSH with your own key pair. Requires port 22 open in the firewall. Use this if you prefer standard SSH workflows."]})]}),e.jsx(a,{type:"tip",title:"IAP Tunneling: No Public IP Needed",children:e.jsxs("p",{children:["Using IAP TCP forwarding, you can SSH into your NemoClaw instance without assigning it a public IP address at all. This is the most secure option because the instance is completely unreachable from the public internet. Outbound connections (to LLM APIs, Slack, etc.) still work through Cloud NAT. Forward the Control UI through IAP:",e.jsx("code",{children:" gcloud compute ssh nemoclaw-prod --tunnel-through-iap -- -L 18789:localhost:18789"})]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Static External IP (Optional)"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Like AWS Elastic IPs, GCP ephemeral external IPs change when the instance is stopped and restarted. Reserve a static IP if you need a consistent address:"}),e.jsx(t,{language:"bash",title:"Reserve and Assign a Static IP",code:`# Reserve a static IP
gcloud compute addresses create nemoclaw-ip \\
  --region=us-central1

# Get the reserved IP
gcloud compute addresses describe nemoclaw-ip \\
  --region=us-central1 \\
  --format='get(address)'

# Assign to your instance (requires instance restart)
gcloud compute instances delete-access-config nemoclaw-prod \\
  --zone=us-central1-a \\
  --access-config-name="External NAT"

gcloud compute instances add-access-config nemoclaw-prod \\
  --zone=us-central1-a \\
  --address=STATIC_IP_ADDRESS`}),e.jsx(i,{title:"Static IP Charges",children:e.jsx("p",{children:"GCP charges ~$7.30/month for a static IP that is reserved but not attached to a running instance. If you stop your NemoClaw instance for extended periods, consider releasing the static IP to avoid charges. Unlike AWS, GCP also charges a small fee for static IPs even when attached and in use (~$1.46/month)."})}),e.jsx(n,{question:"What is the most secure SSH access method for a NemoClaw GCE instance?",options:["Direct SSH with port 22 open to 0.0.0.0/0","Browser-based SSH from the GCP Console","IAP TCP Forwarding with no public IP assigned","VNC remote desktop connection"],correctIndex:2,explanation:"IAP (Identity-Aware Proxy) TCP forwarding routes SSH through Google's proxy infrastructure, meaning the VM does not need a public IP address or an open SSH port. Authentication is handled through your Google identity. This eliminates the entire attack surface of a public-facing SSH port."}),e.jsx(s,{references:[{title:"GCE Quickstart",url:"https://cloud.google.com/compute/docs/quickstart-linux",type:"docs",description:"Official quickstart for creating a Linux VM on Google Compute Engine."},{title:"IAP TCP Forwarding",url:"https://cloud.google.com/iap/docs/using-tcp-forwarding",type:"docs",description:"How to use Identity-Aware Proxy for secure SSH access without public IPs."}]})]})}const Q=Object.freeze(Object.defineProperty({__proto__:null,default:f},Symbol.toStringTag,{value:"Module"}));function x(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"GCP Firewall Rules and VPC Configuration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Google Cloud's firewall system operates at the VPC (Virtual Private Cloud) network level, applying rules to all instances within the network that match specified target tags or service accounts. Unlike AWS security groups which are attached directly to instances, GCP firewall rules are defined at the network level and associated with instances through tags. This section covers creating a minimal firewall configuration for NemoClaw, configuring service accounts, and understanding VPC best practices."}),e.jsx(l,{term:"VPC Network",definition:"A Virtual Private Cloud network in GCP is a global, software-defined network that spans all GCP regions. Firewall rules, routes, and subnets are all resources within a VPC. The default VPC comes with pre-configured firewall rules that allow SSH, ICMP, and internal communication.",example:"A custom VPC named 'nemoclaw-vpc' with a single subnet in us-central1, firewall rules allowing only IAP-based SSH, and all other inbound traffic denied.",seeAlso:["Firewall Rule","Network Tag","Service Account"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Default VPC Firewall Rules"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The GCP default VPC includes several pre-created firewall rules that you should review and potentially modify for a NemoClaw deployment:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"default-allow-ssh:"})," Allows TCP port 22 from all sources (0.0.0.0/0). This is too permissive for production -- restrict it or replace it with IAP-based access."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"default-allow-icmp:"})," Allows ICMP (ping) from all sources. Generally harmless but unnecessary for NemoClaw. Can be deleted or restricted."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"default-allow-internal:"})," Allows all protocols and ports between instances in the VPC. This is fine for most deployments as it enables internal communication."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"default-allow-rdp:"})," Allows TCP port 3389 (Remote Desktop) from all sources. Not needed for Linux instances. Delete this rule."]})]}),e.jsx(i,{title:"Review Default Rules Before Production",children:e.jsx("p",{children:"Many GCP users deploy NemoClaw on the default VPC without reviewing the pre-existing firewall rules. The default-allow-ssh rule with source 0.0.0.0/0 means SSH is open to the entire internet. Either restrict this rule to your IP, delete it and use IAP tunneling, or create a custom VPC with explicit rules."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Creating NemoClaw Firewall Rules"}),e.jsx(o,{title:"Configure Firewall Rules for NemoClaw",steps:[{title:"Delete or restrict the default SSH rule",content:`Either delete default-allow-ssh entirely (if using IAP) or restrict its source range:

gcloud compute firewall-rules update default-allow-ssh --source-ranges=YOUR_IP/32`},{title:"Create IAP SSH rule (recommended)",content:`Allow SSH only through Google Identity-Aware Proxy. The IAP IP range is 35.235.240.0/20:

gcloud compute firewall-rules create nemoclaw-allow-iap-ssh \\
  --direction=INGRESS \\
  --action=ALLOW \\
  --rules=tcp:22 \\
  --source-ranges=35.235.240.0/20 \\
  --target-tags=nemoclaw \\
  --priority=900`},{title:"Delete the RDP rule",content:`Not needed for Linux NemoClaw instances:

gcloud compute firewall-rules delete default-allow-rdp`},{title:"Create a deny-all ingress rule (optional)",content:`For explicit security, create a low-priority deny-all rule:

gcloud compute firewall-rules create nemoclaw-deny-all-ingress \\
  --direction=INGRESS \\
  --action=DENY \\
  --rules=all \\
  --source-ranges=0.0.0.0/0 \\
  --target-tags=nemoclaw \\
  --priority=65534`},{title:"Verify rules",content:`List all firewall rules affecting your NemoClaw instance:

gcloud compute firewall-rules list --filter="targetTags=nemoclaw"

Ensure only the IAP SSH rule (or IP-restricted SSH rule) allows inbound traffic.`}]}),e.jsx(t,{language:"bash",title:"Complete Firewall Configuration Script",code:`#!/bin/bash
# Firewall setup for NemoClaw on GCP

# Allow SSH only via IAP
gcloud compute firewall-rules create nemoclaw-allow-iap \\
  --direction=INGRESS \\
  --action=ALLOW \\
  --rules=tcp:22 \\
  --source-ranges=35.235.240.0/20 \\
  --target-tags=nemoclaw \\
  --description="Allow SSH via IAP for NemoClaw"

# Allow internal communication (if running multiple instances)
gcloud compute firewall-rules create nemoclaw-allow-internal \\
  --direction=INGRESS \\
  --action=ALLOW \\
  --rules=all \\
  --source-tags=nemoclaw \\
  --target-tags=nemoclaw \\
  --description="Allow internal traffic between NemoClaw instances"

# Verify
gcloud compute firewall-rules list \\
  --filter="targetTags=nemoclaw" \\
  --format="table(name,direction,allowed,sourceRanges)"`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Service Accounts"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:'GCP service accounts are the equivalent of AWS IAM roles. Every GCE instance runs under a service account that determines which GCP APIs and services it can access. By default, instances use the Compute Engine default service account with broad "Editor" permissions -- this violates the principle of least privilege.'}),e.jsx(t,{language:"bash",title:"Create a Dedicated Service Account",code:`# Create service account
gcloud iam service-accounts create nemoclaw-sa \\
  --display-name="NemoClaw Service Account" \\
  --description="Minimal permissions for NemoClaw VM"

# Get the email
SA_EMAIL="nemoclaw-sa@YOUR_PROJECT.iam.gserviceaccount.com"

# Grant only necessary roles (example: Cloud Storage for backups)
gcloud projects add-iam-policy-binding YOUR_PROJECT \\
  --member="serviceAccount:$SA_EMAIL" \\
  --role="roles/storage.objectUser" \\
  --condition="expression=resource.name.startsWith('projects/_/buckets/nemoclaw-backups'),title=nemoclaw-bucket-only"

# Create instance with custom service account
gcloud compute instances create nemoclaw-prod \\
  --service-account=$SA_EMAIL \\
  --scopes=cloud-platform \\
  --zone=us-central1-a \\
  --machine-type=e2-standard-4 \\
  --image-family=ubuntu-2204-lts \\
  --image-project=ubuntu-os-cloud \\
  --boot-disk-size=30GB \\
  --tags=nemoclaw`}),e.jsx(a,{type:"info",title:"When No GCP Services Are Needed",children:e.jsx("p",{children:"If your NemoClaw deployment does not interact with any GCP services (no Cloud Storage backups, no Secret Manager, no Cloud Logging), create the service account with no IAM role bindings at all. The instance will have no GCP API access, which is the most secure configuration. You can always add roles later as needs arise."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Custom VPC (Advanced)"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For production environments with strict network isolation requirements, create a custom VPC instead of using the default network. A custom VPC gives you full control over subnets, IP ranges, and firewall rules without the default rules that may be too permissive."}),e.jsx(t,{language:"bash",title:"Create a Custom VPC for NemoClaw",code:`# Create custom VPC (no auto-created subnets)
gcloud compute networks create nemoclaw-vpc \\
  --subnet-mode=custom

# Create a subnet
gcloud compute networks subnets create nemoclaw-subnet \\
  --network=nemoclaw-vpc \\
  --region=us-central1 \\
  --range=10.10.0.0/24

# Create Cloud NAT for outbound internet access
# (needed since custom VPC has no default internet route)
gcloud compute routers create nemoclaw-router \\
  --network=nemoclaw-vpc \\
  --region=us-central1

gcloud compute routers nats create nemoclaw-nat \\
  --router=nemoclaw-router \\
  --region=us-central1 \\
  --auto-allocate-nat-external-ips \\
  --nat-all-subnet-ip-ranges

# Create the VM in the custom VPC (no external IP)
gcloud compute instances create nemoclaw-prod \\
  --zone=us-central1-a \\
  --machine-type=e2-standard-4 \\
  --subnet=nemoclaw-subnet \\
  --no-address \\
  --tags=nemoclaw \\
  --image-family=ubuntu-2204-lts \\
  --image-project=ubuntu-os-cloud \\
  --boot-disk-size=30GB`}),e.jsx(n,{question:"What is the recommended source IP range for allowing SSH to a NemoClaw GCE instance via IAP?",options:["0.0.0.0/0 (anywhere)","10.0.0.0/8 (internal only)","35.235.240.0/20 (Google IAP range)","Your personal IP address"],correctIndex:2,explanation:"The IP range 35.235.240.0/20 is Google's Identity-Aware Proxy range. When you use IAP TCP forwarding, SSH traffic enters through this range after Google authenticates your identity. This is more secure than opening SSH to your personal IP (which may change) or the entire internet."}),e.jsx(s,{references:[{title:"GCP Firewall Rules Overview",url:"https://cloud.google.com/firewall/docs/firewalls",type:"docs",description:"Comprehensive guide to GCP VPC firewall rules."},{title:"GCP Service Accounts",url:"https://cloud.google.com/iam/docs/service-accounts",type:"docs",description:"Understanding and managing GCP service accounts."}]})]})}const J=Object.freeze(Object.defineProperty({__proto__:null,default:x},Symbol.toStringTag,{value:"Module"}));function w(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Installing NemoClaw on GCE"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With your GCE VM running and firewall rules configured, this section walks through the complete NemoClaw installation process on Google Cloud. The steps are largely the same as any Ubuntu 22.04 installation, with a few GCP-specific considerations around SSH access, metadata, and integration with Google Cloud services."}),e.jsx(o,{title:"Complete Installation on GCE",steps:[{title:"SSH into the instance",content:`Use the gcloud CLI for the most secure connection:

gcloud compute ssh nemoclaw-prod --zone=us-central1-a --tunnel-through-iap

The --tunnel-through-iap flag routes the connection through Identity-Aware Proxy, so no public SSH port is needed.`},{title:"Update the system",content:`Run a full system update:

sudo apt update && sudo apt upgrade -y

GCE Ubuntu images are generally up to date, but always run this on a fresh instance.`},{title:"Install Node.js 20+",content:`Install Node.js from the NodeSource repository:

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

Verify:
node --version && npm --version`},{title:"Install NemoClaw",content:`Run the official install script:

curl -fsSL https://install.nemoclaw.dev | bash

This downloads and installs both the OpenClaw Gateway and the NemoClaw policy engine to ~/nemoclaw.`},{title:"Run onboarding",content:`Start the interactive onboarding wizard:

cd ~/nemoclaw
npx nemoclaw onboard

Configure your LLM provider, platform integration (Slack/Discord), and default policy mode. For GCP deployments, you might want to store API keys in Secret Manager instead of .env files (covered below).`},{title:"Configure as a systemd service",content:`Create the service file for automatic startup:

sudo tee /etc/systemd/system/nemoclaw.service > /dev/null << 'EOF'
[Unit]
Description=NemoClaw Agent Security Platform
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/nemoclaw
EnvironmentFile=/home/ubuntu/nemoclaw/.env
ExecStart=/usr/bin/npx nemoclaw start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable nemoclaw
sudo systemctl start nemoclaw`},{title:"Verify the installation",content:`Check that NemoClaw is running:

sudo systemctl status nemoclaw
npx nemoclaw status

Both should show the service as active and all components as healthy.`},{title:"Access the Control UI",content:`From your local machine, forward the Control UI port through IAP:

gcloud compute ssh nemoclaw-prod --zone=us-central1-a --tunnel-through-iap -- -L 18789:localhost:18789

Then open http://localhost:18789 in your browser.`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GCP-Specific: Secret Manager Integration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Rather than storing API keys in a .env file on disk, you can use Google Cloud Secret Manager for a more secure approach. This requires the NemoClaw service account to have the Secret Manager Secret Accessor role."}),e.jsx(t,{language:"bash",title:"Store and Retrieve Secrets from Secret Manager",code:`# Create secrets
echo -n "sk-ant-your-anthropic-key" | \\
  gcloud secrets create nemoclaw-anthropic-key --data-file=-

echo -n "xoxb-your-slack-token" | \\
  gcloud secrets create nemoclaw-slack-token --data-file=-

# Grant access to the service account
gcloud secrets add-iam-policy-binding nemoclaw-anthropic-key \\
  --member="serviceAccount:nemoclaw-sa@YOUR_PROJECT.iam.gserviceaccount.com" \\
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding nemoclaw-slack-token \\
  --member="serviceAccount:nemoclaw-sa@YOUR_PROJECT.iam.gserviceaccount.com" \\
  --role="roles/secretmanager.secretAccessor"

# Retrieve secrets on the instance (for the .env file or startup script)
ANTHROPIC_KEY=$(gcloud secrets versions access latest \\
  --secret=nemoclaw-anthropic-key)
SLACK_TOKEN=$(gcloud secrets versions access latest \\
  --secret=nemoclaw-slack-token)

# Create .env from secrets
cat > ~/nemoclaw/.env << EOF
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
SLACK_BOT_TOKEN=$SLACK_TOKEN
NODE_ENV=production
EOF`}),e.jsx(a,{type:"tip",title:"Startup Script Approach",children:e.jsx("p",{children:"You can use GCE startup scripts to automatically pull secrets from Secret Manager each time the instance boots. Add a metadata startup script that retrieves secrets and writes the .env file before NemoClaw starts. This ensures secrets are never persisted on disk longer than necessary."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GCP-Specific: Cloud Logging Integration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"GCE instances can send logs to Cloud Logging (formerly Stackdriver) using the Ops Agent. This centralizes NemoClaw logs alongside other GCP resource logs, enabling advanced querying, alerting, and long-term retention."}),e.jsx(t,{language:"bash",title:"Install the Ops Agent for Cloud Logging",code:`# Install the Google Cloud Ops Agent
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

# The agent automatically collects syslog and journald output.
# Since NemoClaw runs as a systemd service logging to journald,
# its logs will appear in Cloud Logging automatically.

# View logs in the console:
# Cloud Logging > Log Explorer > Resource: VM Instance

# Or via CLI:
gcloud logging read 'resource.type="gce_instance" AND resource.labels.instance_id="YOUR_INSTANCE_ID"' \\
  --limit=20 \\
  --format="table(timestamp,textPayload)"`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Troubleshooting GCP-Specific Issues"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Cannot SSH via IAP:"}),` Ensure the firewall rule for 35.235.240.0/20 on port 22 exists and targets your instance's network tag. Also verify your user has the "IAP-secured Tunnel User" IAM role.`]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Instance cannot reach external APIs:"})," If using a custom VPC without a public IP, ensure Cloud NAT is configured. Without NAT or a public IP, the instance has no outbound internet access."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Permission denied on Secret Manager:"})," Verify the service account has the secretmanager.secretAccessor role for the specific secrets. Check with: ",e.jsx("code",{children:"gcloud secrets get-iam-policy SECRET_NAME"}),"."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Slow disk performance:"})," If using pd-standard (HDD), switch to pd-balanced or pd-ssd. Performance scales with disk size on GCP -- larger disks get more IOPS."]})]}),e.jsx(i,{title:"GCE Metadata Server",children:e.jsxs("p",{children:["GCE instances can access instance metadata at ",e.jsx("code",{children:"http://metadata.google.internal"}),". This endpoint exposes the service account token and other sensitive information. NemoClaw's policy engine should include rules to prevent agents from accessing this endpoint, as a compromised agent could use the metadata server to escalate privileges within your GCP project."]})}),e.jsx(n,{question:"What is the advantage of using GCP Secret Manager for NemoClaw API keys instead of a .env file?",options:["Secret Manager is faster than reading .env files","Secrets are encrypted at rest, access is audited, and keys are not stored as plaintext on the VM disk","Secret Manager allows API keys to be shared across all GCP projects",".env files are not supported on GCE instances"],correctIndex:1,explanation:"Secret Manager encrypts secrets at rest and in transit, provides an audit log of every access, supports automatic rotation, and means API keys do not need to be stored as plaintext files on the VM. If the VM is compromised, the attacker only has access while the instance's service account token is valid."}),e.jsx(s,{references:[{title:"GCP Secret Manager",url:"https://cloud.google.com/secret-manager/docs",type:"docs",description:"Store and manage sensitive data on Google Cloud."},{title:"Cloud Logging for Compute Engine",url:"https://cloud.google.com/logging/docs/agent/logging",type:"docs",description:"Set up centralized logging for GCE instances."}]})]})}const Z=Object.freeze(Object.defineProperty({__proto__:null,default:w},Symbol.toStringTag,{value:"Module"}));function b(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"GPU VMs on Google Cloud for Local Inference"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Google Cloud offers a compelling GPU lineup for local LLM inference, including NVIDIA T4, L4, A100, and H100 GPUs. GCP's flexible machine type system lets you attach GPUs to custom machine configurations, giving you precise control over vCPU and memory alongside your GPU allocation. This section covers GPU options, zone availability, driver setup, and practical recommendations for NemoClaw inference workloads."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Available GPU Types"}),e.jsx(r,{title:"GCP GPU Options for Inference",headers:["GPU","VRAM","Machine Type","On-Demand $/hr","Best For"],rows:[["NVIDIA T4","16 GB","n1-standard-4 + 1x T4","~$0.52","Budget inference, 7B models"],["NVIDIA L4","24 GB","g2-standard-4 (1x L4)","~$0.70","Efficient inference, 13B models"],["NVIDIA A100 40GB","40 GB","a2-highgpu-1g","~$3.67","Large models, 30B+ params"],["NVIDIA A100 80GB","80 GB","a2-ultragpu-1g","~$5.07","Very large models, 70B quantized"],["NVIDIA H100","80 GB","a3-highgpu-1g","~$7.24","Maximum throughput, latest architecture"]]}),e.jsx(a,{type:"info",title:"The L4 Sweet Spot",children:e.jsx("p",{children:"The NVIDIA L4 on the g2-standard machine type is GCP's best option for NemoClaw inference. At 24 GB VRAM with the Ada Lovelace architecture, it handles quantized 13B models efficiently at roughly $500/month -- nearly 40% less than the T4's monthly cost when factoring in the L4's superior inference throughput. It is available in more zones than A100 or H100."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Zone Availability"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"GPU availability varies significantly by zone. Not all GPU types are available in all regions, and popular zones frequently run out of capacity. Here are the most reliable zones for each GPU type:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"T4:"})," Widely available. Best in us-central1-a, us-east1-c, europe-west1-b, asia-east1-c."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"L4:"})," Available in us-central1-a, us-east4-c, europe-west1-b, asia-northeast1-b."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"A100:"})," Limited availability. Check us-central1-a, us-east1-c, europe-west4-a. Often requires quota increase requests."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"H100:"})," Most limited. Available in us-central1, us-east4. Requires explicit quota approval."]})]}),e.jsx(t,{language:"bash",title:"Check GPU Availability in a Zone",code:`# List available accelerator types in a zone
gcloud compute accelerator-types list \\
  --filter="zone:us-central1-a" \\
  --format="table(name,zone,description)"

# Check your GPU quota
gcloud compute project-info describe \\
  --format="table(quotas.metric,quotas.limit,quotas.usage)" \\
  | grep -i gpu

# Request a quota increase if needed
# Go to: IAM & Admin > Quotas > Filter for "GPUS_ALL_REGIONS"
# or specific GPU type quotas`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Creating a GPU VM"}),e.jsx(o,{title:"Launch a GPU VM for NemoClaw",steps:[{title:"Request GPU quota (if needed)",content:'New GCP projects have a GPU quota of 0. Go to IAM & Admin > Quotas, filter for the GPU type you want (e.g., "NVIDIA_L4_GPUS"), and request an increase. Approval typically takes 1-2 business days.'},{title:"Create the GPU VM (L4 example)",content:`gcloud compute instances create nemoclaw-gpu \\
  --zone=us-central1-a \\
  --machine-type=g2-standard-4 \\
  --accelerator=type=nvidia-l4,count=1 \\
  --maintenance-policy=TERMINATE \\
  --image-family=ubuntu-2204-lts \\
  --image-project=ubuntu-os-cloud \\
  --boot-disk-size=50GB \\
  --boot-disk-type=pd-balanced \\
  --tags=nemoclaw \\
  --metadata=enable-oslogin=TRUE

Note: --maintenance-policy=TERMINATE is required for GPU instances. GCP cannot live-migrate GPU VMs.`},{title:"SSH into the GPU VM",content:"gcloud compute ssh nemoclaw-gpu --zone=us-central1-a"},{title:"Install NVIDIA drivers",content:`GCP provides a convenient driver install script:

curl -fsSL https://raw.githubusercontent.com/GoogleCloudPlatform/compute-gpu-installation/main/linux/install_gpu_driver.py -o install_gpu_driver.py
sudo python3 install_gpu_driver.py

This detects your GPU model and installs the appropriate driver version. Reboot after installation:
sudo reboot`},{title:"Verify GPU access",content:`After reboot, verify the driver:

nvidia-smi

You should see the L4 (or your chosen GPU) listed with driver and CUDA versions.`},{title:"Install NemoClaw and configure local inference",content:`Follow the standard NemoClaw installation, then configure the local LLM backend:

curl -fsSL https://install.nemoclaw.dev | bash
cd ~/nemoclaw
npx nemoclaw onboard

During onboarding, select "local" as the LLM provider and configure the Ollama or vLLM endpoint.`}]}),e.jsx(i,{title:"GPU VM Maintenance Policy",children:e.jsx("p",{children:"GPU instances on GCP must have their maintenance policy set to TERMINATE because live migration is not supported for GPU VMs. This means during scheduled maintenance events, GCP will stop your instance, perform maintenance on the host, and then restart it. Ensure your NemoClaw systemd service is configured to start on boot so it recovers automatically after maintenance events."})}),e.jsx(t,{language:"bash",title:"Alternative: Deep Learning VM Image",code:`# GCP offers pre-configured Deep Learning VM images
# with NVIDIA drivers, CUDA, and ML frameworks installed

gcloud compute instances create nemoclaw-gpu \\
  --zone=us-central1-a \\
  --machine-type=g2-standard-4 \\
  --accelerator=type=nvidia-l4,count=1 \\
  --maintenance-policy=TERMINATE \\
  --image-family=common-cu124-ubuntu-2204 \\
  --image-project=deeplearning-platform-release \\
  --boot-disk-size=50GB \\
  --boot-disk-type=pd-balanced \\
  --tags=nemoclaw \\
  --metadata="install-nvidia-driver=True"

# This image comes with CUDA 12.4 pre-installed
# Saves 15-20 minutes of driver installation`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Multi-GPU Configurations"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For running larger models (30B+ parameters), you may need multiple GPUs. GCP supports multi-GPU VMs with up to 8 GPUs per instance for A100 and H100 types. Inference frameworks like vLLM automatically shard models across multiple GPUs using tensor parallelism."}),e.jsx(t,{language:"bash",title:"Multi-GPU VM Example",code:`# 4x A100 for running 70B parameter models
gcloud compute instances create nemoclaw-multi-gpu \\
  --zone=us-central1-a \\
  --machine-type=a2-highgpu-4g \\
  --maintenance-policy=TERMINATE \\
  --image-family=common-cu124-ubuntu-2204 \\
  --image-project=deeplearning-platform-release \\
  --boot-disk-size=200GB \\
  --boot-disk-type=pd-ssd \\
  --tags=nemoclaw

# Verify all GPUs are visible
nvidia-smi
# Should show 4x A100 GPUs`}),e.jsx(n,{question:"Why must GPU instances on GCP have their maintenance policy set to TERMINATE?",options:["GPU instances cost more and need to be terminated to save money","GCP cannot live-migrate VMs with attached GPUs, so they must be stopped for host maintenance","GPU drivers are incompatible with live migration","It is a billing requirement for GPU instances"],correctIndex:1,explanation:"Live migration moves a running VM from one physical host to another without downtime. This process is not supported for VMs with attached GPUs because GPU state (VRAM contents, running computations) cannot be transferred between physical GPUs. Instead, GCP stops the VM, performs host maintenance, and restarts it."}),e.jsx(s,{references:[{title:"GCP GPU Documentation",url:"https://cloud.google.com/compute/docs/gpus",type:"docs",description:"Complete guide to GPU VMs on Google Cloud including types, zones, and quotas."},{title:"GCP Deep Learning VM Images",url:"https://cloud.google.com/deep-learning-vm/docs/introduction",type:"docs",description:"Pre-configured VM images with GPU drivers and ML frameworks."}]})]})}const ee=Object.freeze(Object.defineProperty({__proto__:null,default:b},Symbol.toStringTag,{value:"Module"}));function v(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Running NemoClaw in GKE (Experimental)"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Google Kubernetes Engine (GKE) is a managed Kubernetes service that automates deployment, scaling, and operations of containerized applications. Running NemoClaw in GKE is considered experimental -- it works, but introduces complexity that is unnecessary for most deployments. This section covers when GKE makes sense, the container architecture, key limitations, and a basic deployment manifest."}),e.jsx(i,{title:"Experimental: VM Deployment Is Recommended",children:e.jsx("p",{children:"For the vast majority of NemoClaw deployments, a single VM (GCE, EC2, or VPS) is the recommended approach. GKE adds significant operational complexity -- Kubernetes knowledge, container networking, persistent storage management, and RBAC configuration -- without proportional benefit for a single-instance deployment. Consider GKE only if you already run a Kubernetes cluster and want to consolidate, or if you need horizontal scaling across multiple NemoClaw instances."})}),e.jsx(l,{term:"GKE (Google Kubernetes Engine)",definition:"A managed Kubernetes service that runs containerized applications across a cluster of virtual machines. GKE handles the Kubernetes control plane, node provisioning, automatic upgrades, and integration with GCP services like Cloud Logging, IAM, and Load Balancing.",example:"A GKE cluster with 3 nodes running the NemoClaw Gateway as a Deployment with 2 replicas, using a PersistentVolumeClaim for session storage and a Kubernetes Secret for API keys.",seeAlso:["Kubernetes","Container","Pod"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"When GKE Makes Sense"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Existing Kubernetes infrastructure:"})," Your team already runs applications on GKE and wants to manage NemoClaw alongside them with consistent tooling and observability."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Multi-instance scaling:"})," You need to run multiple NemoClaw instances with shared policy management, which Kubernetes makes easier to orchestrate."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Automated failover:"})," Kubernetes automatically restarts failed pods and reschedules them to healthy nodes, providing higher availability than a single VM."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"GitOps workflows:"})," You manage all infrastructure declaratively through YAML manifests and want NemoClaw to follow the same pattern."]})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Container Architecture"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NemoClaw runs as two processes: the OpenClaw Gateway (Node.js) and the policy engine (Rust binary). In a Kubernetes deployment, these can run as two containers in a single pod (sidecar pattern) or as separate deployments communicating over the pod network. The sidecar approach is simpler and recommended."}),e.jsx(t,{language:"yaml",title:"NemoClaw Kubernetes Deployment",code:`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nemoclaw
  labels:
    app: nemoclaw
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nemoclaw
  template:
    metadata:
      labels:
        app: nemoclaw
    spec:
      containers:
        - name: gateway
          image: nemoclaw/gateway:latest
          ports:
            - containerPort: 18789
              name: control-ui
          envFrom:
            - secretRef:
                name: nemoclaw-secrets
          volumeMounts:
            - name: workspace
              mountPath: /data/nemoclaw
          resources:
            requests:
              cpu: "2"
              memory: "4Gi"
            limits:
              cpu: "4"
              memory: "8Gi"

        - name: policy-engine
          image: nemoclaw/policy-engine:latest
          volumeMounts:
            - name: workspace
              mountPath: /data/nemoclaw
          resources:
            requests:
              cpu: "1"
              memory: "2Gi"
            limits:
              cpu: "2"
              memory: "4Gi"

      volumes:
        - name: workspace
          persistentVolumeClaim:
            claimName: nemoclaw-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nemoclaw-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  storageClassName: standard-rwo
---
apiVersion: v1
kind: Secret
metadata:
  name: nemoclaw-secrets
type: Opaque
stringData:
  ANTHROPIC_API_KEY: "sk-ant-your-key-here"
  SLACK_BOT_TOKEN: "xoxb-your-token-here"
  NODE_ENV: "production"`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Key Limitations"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Session persistence:"})," If the pod is rescheduled to a different node, in-memory sessions are lost. The PersistentVolumeClaim preserves workspace data on disk, but active session state requires the pod to remain running. This makes rolling updates disruptive."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Tool execution isolation:"})," NemoClaw's tool executor runs commands in the container's filesystem. In a Kubernetes context, this filesystem is ephemeral and limited. Agents cannot interact with the host system or other containers without explicit volume mounts and security contexts."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Networking complexity:"})," The Control UI is only accessible through a Kubernetes Service (ClusterIP) and requires port-forwarding or an Ingress for access. Do not expose it through a public LoadBalancer."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Single replica recommended:"})," The OpenClaw Gateway does not currently support multi-replica horizontal scaling with shared session state. Running multiple replicas requires external session storage and a load balancer with session affinity, adding significant complexity."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"GPU pods:"})," If using local inference, you need a GPU node pool with NVIDIA device plugins. This adds cost (GPU nodes must always be running) and scheduling complexity."]})]}),e.jsx(t,{language:"bash",title:"Accessing the Control UI via kubectl",code:`# Port-forward to access the Control UI locally
kubectl port-forward deployment/nemoclaw 18789:18789

# Then open http://localhost:18789

# View logs
kubectl logs deployment/nemoclaw -c gateway -f
kubectl logs deployment/nemoclaw -c policy-engine -f

# Check pod status
kubectl get pods -l app=nemoclaw`}),e.jsx(a,{type:"info",title:"Workload Identity for GCP Integration",children:e.jsxs("p",{children:["Instead of storing GCP credentials in Kubernetes secrets, use GKE Workload Identity to bind a Kubernetes service account to a GCP service account. This provides your NemoClaw pod with automatic access to GCP services (Secret Manager, Cloud Storage) without managing credentials. Configure it with:",e.jsx("code",{children:" gcloud iam service-accounts add-iam-policy-binding"})," to link the accounts."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Recommendation"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Unless you have a specific reason to run NemoClaw on Kubernetes, a standalone GCE VM provides a simpler, more reliable, and easier-to-debug deployment. The single-binary nature of NemoClaw -- one Gateway process, one policy engine process -- does not benefit meaningfully from container orchestration. Save GKE for when you genuinely need multi-instance deployments or want to integrate NemoClaw into an existing Kubernetes-based platform."}),e.jsx(n,{question:"What is the primary limitation of running multiple NemoClaw replicas in GKE?",options:["Kubernetes cannot run Node.js applications","The Gateway does not support shared session state across replicas","GKE does not support persistent volumes","GPU nodes cannot run in GKE"],correctIndex:1,explanation:"The OpenClaw Gateway stores session state in memory. Without external shared storage for sessions, multiple replicas would each have their own isolated session state, meaning a user could be routed to different replicas and lose conversation context. This requires session affinity or external session storage to work correctly."}),e.jsx(s,{references:[{title:"GKE Documentation",url:"https://cloud.google.com/kubernetes-engine/docs",type:"docs",description:"Official Google Kubernetes Engine documentation."},{title:"GKE Workload Identity",url:"https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity",type:"docs",description:"Securely connect Kubernetes workloads to GCP services."}]})]})}const te=Object.freeze(Object.defineProperty({__proto__:null,default:v},Symbol.toStringTag,{value:"Module"}));function C(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Creating an Azure VM for NemoClaw"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Microsoft Azure provides a comprehensive cloud computing platform with global data center coverage and strong enterprise integration. For NemoClaw, Azure Virtual Machines offer reliable compute with predictable performance and deep integration with Azure Active Directory for identity management. This section walks through creating an Azure VM configured for NemoClaw."}),e.jsx(a,{type:"info",title:"Prerequisites",children:e.jsxs("p",{children:["You need an Azure subscription with permissions to create Virtual Machines, Network Security Groups, and Resource Groups. Install the Azure CLI (",e.jsx("code",{children:"az"}),") locally and authenticate with ",e.jsx("code",{children:"az login"}),". Alternatively, use the Azure Portal web interface."]})}),e.jsx(o,{title:"Create an Azure VM via Portal",steps:[{title:"Create a Resource Group",content:'In the Azure Portal, search for "Resource Groups" and click Create. Name it "nemoclaw-rg" and select a region close to your team (e.g., East US, West Europe). Resource Groups are logical containers that hold related Azure resources.'},{title:"Navigate to Virtual Machines",content:'Search for "Virtual Machines" in the portal and click Create > Azure Virtual Machine.'},{title:"Configure basics",content:'Select your resource group (nemoclaw-rg), name the VM "nemoclaw-prod", select your region, and choose "No infrastructure redundancy required" for availability. Select Ubuntu Server 22.04 LTS as the image.'},{title:"Select VM size",content:'Click "See all sizes" and select Standard_D4s_v3 (4 vCPU, 16 GB RAM) as the recommended starting point. This D-series VM provides a good balance of compute and memory for NemoClaw. For larger teams, choose Standard_D8s_v3 (8 vCPU, 32 GB).'},{title:"Configure authentication",content:'Select "SSH public key" as the authentication type. Generate a new key pair or provide your existing public key. Azure will create a .pem file for download if generating a new pair. Save this file securely.'},{title:"Configure disks",content:'Under the Disks tab, change the OS disk size from the default 30 GB to 32 GB (or more). Select "Premium SSD" (P4 or higher) for the disk type. Premium SSD provides consistent low-latency IO which benefits NemoClaw policy engine operations.'},{title:"Configure networking",content:'Under the Networking tab, Azure creates a virtual network, subnet, and public IP automatically. For the Network Security Group, select "Basic" and ensure SSH (port 22) is the only inbound port allowed. Uncheck HTTP (80) and HTTPS (443) if they are auto-selected.'},{title:"Review and create",content:"Review your configuration on the Review + Create tab. Azure validates the configuration and shows the estimated hourly cost. Click Create and wait for deployment to complete (1-3 minutes)."},{title:"Connect via SSH",content:`Once deployment completes, go to the VM overview page to find the public IP address. Connect with:

ssh -i nemoclaw-key.pem azureuser@<public-ip>

The default username on Azure Ubuntu VMs is "azureuser" unless you specified otherwise.`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"CLI Alternative"}),e.jsx(t,{language:"bash",title:"Create Azure VM via az CLI",code:`# Create resource group
az group create \\
  --name nemoclaw-rg \\
  --location eastus

# Create the VM
az vm create \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prod \\
  --image Ubuntu2204 \\
  --size Standard_D4s_v3 \\
  --admin-username azureuser \\
  --generate-ssh-keys \\
  --os-disk-size-gb 32 \\
  --storage-sku Premium_LRS \\
  --public-ip-sku Standard \\
  --nsg nemoclaw-nsg \\
  --output json

# The command outputs the public IP address.
# SSH keys are stored in ~/.ssh/ by default.

# Get the public IP
az vm show \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prod \\
  --show-details \\
  --query 'publicIps' \\
  --output tsv

# SSH into the VM
ssh azureuser@<public-ip>`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"VM Size Recommendations"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Standard_B2s (2 vCPU, 4 GB):"})," Budget testing only. The B-series is burstable, meaning CPU performance is limited to a baseline with occasional bursts. Not suitable for production NemoClaw."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Standard_D4s_v3 (4 vCPU, 16 GB):"}),' Recommended starting point. The D-series provides balanced compute and memory with consistent performance. The "s" suffix indicates Premium Storage support.']}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Standard_D8s_v3 (8 vCPU, 32 GB):"})," For larger teams or heavy concurrent agent usage. Double the resources at roughly double the cost."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Standard_F4s_v2 (4 vCPU, 8 GB):"})," CPU-optimized alternative. Higher clock speeds than D-series but less memory. Good if your workload is CPU-bound rather than memory-bound."]})]}),e.jsx(i,{title:"Azure Burstable VMs (B-series)",children:e.jsx("p",{children:"Azure B-series VMs (B2s, B2ms, etc.) are temptingly cheap but use a CPU credit system. When credits are exhausted, CPU performance drops to a baseline of 20-40% of the vCPU capacity. Under sustained NemoClaw workloads, credits deplete quickly, leading to severe performance degradation. Use D-series or F-series for consistent performance."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Static Public IP"}),e.jsxs("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:["By default, Azure assigns a dynamic public IP that changes on VM deallocation. For production use, the ",e.jsx("code",{children:"--public-ip-sku Standard"})," flag creates a static IP. You can also assign a static IP separately:"]}),e.jsx(t,{language:"bash",title:"Assign a Static Public IP",code:`# Create a static public IP
az network public-ip create \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-ip \\
  --sku Standard \\
  --allocation-method Static

# Associate with your VM's NIC
NIC_ID=$(az vm show \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prod \\
  --query 'networkProfile.networkInterfaces[0].id' \\
  --output tsv)

az network nic ip-config update \\
  --resource-group nemoclaw-rg \\
  --nic-name $(basename $NIC_ID) \\
  --name ipconfig1 \\
  --public-ip-address nemoclaw-ip`}),e.jsx(n,{question:"Why should you avoid Azure B-series VMs for production NemoClaw deployments?",options:["B-series VMs do not support Ubuntu","B-series VMs use CPU credits and throttle to baseline when credits are depleted","B-series VMs cannot have Premium SSD storage","B-series VMs do not support SSH access"],correctIndex:1,explanation:"B-series VMs use a credit-based CPU system. They accrue CPU credits during idle periods and spend them during bursts. Under sustained NemoClaw workloads, credits deplete and CPU performance drops to 20-40% of the vCPU capacity, causing unacceptable latency for policy evaluation and agent sessions."}),e.jsx(s,{references:[{title:"Azure VM Sizes",url:"https://learn.microsoft.com/en-us/azure/virtual-machines/sizes",type:"docs",description:"Complete reference for Azure VM size families and specifications."},{title:"Create a Linux VM in Azure",url:"https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-cli",type:"docs",description:"Quickstart guide for creating a Linux VM with the Azure CLI."}]})]})}const ae=Object.freeze(Object.defineProperty({__proto__:null,default:C},Symbol.toStringTag,{value:"Module"}));function S(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Network Security Groups and Managed Identity"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Azure provides two complementary security mechanisms for NemoClaw: Network Security Groups (NSGs) control network traffic at the subnet or NIC level, while Managed Identities provide secure access to Azure services without storing credentials. Together, they implement defense in depth -- network isolation combined with identity-based access control."}),e.jsx(l,{term:"Network Security Group (NSG)",definition:"An Azure resource containing security rules that filter network traffic to and from Azure resources in a virtual network. Each rule specifies source, destination, port, protocol, and action (Allow or Deny). NSGs can be associated with subnets or individual network interfaces. Rules are evaluated by priority (lower number = higher priority).",example:"An NSG named 'nemoclaw-nsg' with a single inbound rule: Allow TCP port 22 from your office IP (priority 100), and an implicit deny-all for everything else.",seeAlso:["Virtual Network","Managed Identity","Azure Bastion"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Configuring the NSG"}),e.jsx(o,{title:"Create and Configure an NSG for NemoClaw",steps:[{title:"Create the NSG",content:`az network nsg create \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-nsg`},{title:"Add SSH inbound rule",content:`az network nsg rule create \\
  --resource-group nemoclaw-rg \\
  --nsg-name nemoclaw-nsg \\
  --name AllowSSH \\
  --priority 100 \\
  --direction Inbound \\
  --access Allow \\
  --protocol Tcp \\
  --destination-port-ranges 22 \\
  --source-address-prefixes YOUR_IP/32

Replace YOUR_IP with your actual public IP address.`},{title:"Verify no other inbound rules exist",content:`az network nsg rule list \\
  --resource-group nemoclaw-rg \\
  --nsg-name nemoclaw-nsg \\
  --output table

Ensure only the SSH rule appears. Azure includes default rules (priority 65000+) that allow internal VNet traffic and deny all other inbound -- these are correct.`},{title:"Associate with your VM NIC",content:`If not already associated during VM creation:

az network nic update \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prodVMNic \\
  --network-security-group nemoclaw-nsg`}]}),e.jsx(t,{language:"bash",title:"Complete NSG Configuration",code:`# View current rules including defaults
az network nsg rule list \\
  --resource-group nemoclaw-rg \\
  --nsg-name nemoclaw-nsg \\
  --include-default \\
  --output table

# If you need to remove an overly permissive rule:
az network nsg rule delete \\
  --resource-group nemoclaw-rg \\
  --nsg-name nemoclaw-nsg \\
  --name AllowAnyHTTPInbound

# To restrict SSH to multiple IPs (e.g., team members):
az network nsg rule update \\
  --resource-group nemoclaw-rg \\
  --nsg-name nemoclaw-nsg \\
  --name AllowSSH \\
  --source-address-prefixes 203.0.113.10/32 198.51.100.20/32`}),e.jsx(a,{type:"tip",title:"Azure Bastion Alternative",children:e.jsx("p",{children:"Azure Bastion provides browser-based SSH access to VMs without any public IP or open SSH port. It is similar to GCP's IAP tunneling. Bastion costs ~$140/month for the Basic tier, which is significant for a single NemoClaw VM, but worthwhile for enterprise environments with strict no-public-IP policies. Enable it in the virtual network settings."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Managed Identity"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Azure Managed Identity is the equivalent of AWS IAM roles and GCP service accounts. It provides your VM with an automatically managed identity that can authenticate to Azure services without storing credentials. There are two types: system-assigned (tied to the VM lifecycle) and user-assigned (independent, reusable across resources)."}),e.jsx(t,{language:"bash",title:"Enable System-Assigned Managed Identity",code:`# Enable system-assigned identity on the VM
az vm identity assign \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prod

# Get the principal ID
PRINCIPAL_ID=$(az vm identity show \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prod \\
  --query 'principalId' \\
  --output tsv)

echo "Principal ID: $PRINCIPAL_ID"`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Common Azure Service Integrations"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With Managed Identity enabled, you can grant the NemoClaw VM access to specific Azure services using role-based access control (RBAC):"}),e.jsx(t,{language:"bash",title:"Grant Access to Azure Services",code:`# Key Vault access for storing API keys and secrets
az role assignment create \\
  --assignee $PRINCIPAL_ID \\
  --role "Key Vault Secrets User" \\
  --scope /subscriptions/SUB_ID/resourceGroups/nemoclaw-rg/providers/Microsoft.KeyVault/vaults/nemoclaw-vault

# Blob Storage access for backups
az role assignment create \\
  --assignee $PRINCIPAL_ID \\
  --role "Storage Blob Data Contributor" \\
  --scope /subscriptions/SUB_ID/resourceGroups/nemoclaw-rg/providers/Microsoft.Storage/storageAccounts/nemoclawbackups

# Verify role assignments
az role assignment list \\
  --assignee $PRINCIPAL_ID \\
  --output table`}),e.jsx(t,{language:"bash",title:"Retrieve Secrets from Key Vault",code:`# Create Key Vault
az keyvault create \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-vault \\
  --location eastus

# Store secrets
az keyvault secret set \\
  --vault-name nemoclaw-vault \\
  --name anthropic-api-key \\
  --value "sk-ant-your-key-here"

az keyvault secret set \\
  --vault-name nemoclaw-vault \\
  --name slack-bot-token \\
  --value "xoxb-your-token-here"

# Retrieve secrets from the VM (using managed identity)
# The az CLI automatically uses the managed identity when run on the VM
az keyvault secret show \\
  --vault-name nemoclaw-vault \\
  --name anthropic-api-key \\
  --query 'value' \\
  --output tsv`}),e.jsx(i,{title:"Scope Role Assignments Narrowly",children:e.jsx("p",{children:'Always assign roles at the most specific scope possible. Assigning "Storage Blob Data Contributor" at the subscription level grants NemoClaw access to every storage account in your entire subscription. Instead, scope it to the specific storage account or even a specific container. The principle of least privilege applies equally to Managed Identity role assignments.'})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"When You Do Not Need Managed Identity"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:'If your NemoClaw deployment only communicates with external services (LLM APIs, Slack, Discord) and stores all data locally, you do not need Managed Identity at all. Do not enable it "just in case" -- unused identity assignments expand the attack surface. Enable it only when you have a concrete need for Azure service access from the VM.'}),e.jsx(n,{question:"What is the primary advantage of Azure Managed Identity over storing API credentials in environment variables?",options:["Managed Identity is faster than reading environment variables","Managed Identity automatically rotates credentials and provides audit logging","Environment variables cannot be read by Node.js applications","Managed Identity works without an internet connection"],correctIndex:1,explanation:"Managed Identity provides temporary tokens that rotate automatically, eliminating the risk of long-lived credentials being stolen. Azure also logs every token issuance and service access through Azure AD audit logs, giving full visibility into what the VM accessed and when."}),e.jsx(s,{references:[{title:"Azure NSG Documentation",url:"https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview",type:"docs",description:"Complete guide to Network Security Groups in Azure."},{title:"Managed Identities for Azure Resources",url:"https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview",type:"docs",description:"Understanding and using Managed Identity for Azure VM authentication."}]})]})}const ne=Object.freeze(Object.defineProperty({__proto__:null,default:S},Symbol.toStringTag,{value:"Module"}));function N(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Installing NemoClaw on Azure VM"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This section provides a complete walkthrough for installing and configuring NemoClaw on an Azure Virtual Machine. The installation process is similar to other Ubuntu-based cloud deployments, with Azure-specific considerations for networking, identity, and monitoring integration."}),e.jsx(o,{title:"Full Installation Walkthrough",steps:[{title:"SSH into the VM",content:`Connect using the SSH key created during VM provisioning:

ssh -i ~/.ssh/nemoclaw-key.pem azureuser@<public-ip>

Or use the Azure CLI:
az ssh vm --resource-group nemoclaw-rg --name nemoclaw-prod`},{title:"Update the system",content:`sudo apt update && sudo apt upgrade -y

Azure Ubuntu images receive regular updates, but always run this on a fresh instance to ensure all security patches are applied.`},{title:"Install Node.js and dependencies",content:`curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

Verify:
node --version    # v20.x+
npm --version     # 10.x+`},{title:"Install NemoClaw",content:`curl -fsSL https://install.nemoclaw.dev | bash

The installer downloads the Gateway and policy engine to ~/nemoclaw. On Azure VMs with Premium SSD, the installation completes in 2-3 minutes.`},{title:"Configure secrets (Key Vault approach)",content:`If using Azure Key Vault (recommended), retrieve secrets and create the .env file:

ANTHROPIC_KEY=$(az keyvault secret show --vault-name nemoclaw-vault --name anthropic-api-key --query value -o tsv)
SLACK_TOKEN=$(az keyvault secret show --vault-name nemoclaw-vault --name slack-bot-token --query value -o tsv)

cat > ~/nemoclaw/.env << EOF
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
SLACK_BOT_TOKEN=$SLACK_TOKEN
NODE_ENV=production
EOF

Alternatively, run the onboarding wizard:
cd ~/nemoclaw && npx nemoclaw onboard`},{title:"Run onboarding (if not using Key Vault)",content:`cd ~/nemoclaw
npx nemoclaw onboard

Follow the prompts to configure your LLM provider, platform integration, and default policy mode.`},{title:"Create systemd service",content:`sudo tee /etc/systemd/system/nemoclaw.service > /dev/null << 'EOF'
[Unit]
Description=NemoClaw Agent Security Platform
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=azureuser
WorkingDirectory=/home/azureuser/nemoclaw
EnvironmentFile=/home/azureuser/nemoclaw/.env
ExecStart=/usr/bin/npx nemoclaw start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable nemoclaw
sudo systemctl start nemoclaw`},{title:"Verify the deployment",content:`sudo systemctl status nemoclaw
npx nemoclaw status

Both should show healthy status. Check logs for any errors:
sudo journalctl -u nemoclaw --no-pager -n 30`},{title:"Access the Control UI",content:`From your local machine, create an SSH tunnel:

ssh -L 18789:localhost:18789 azureuser@<public-ip>

Open http://localhost:18789 in your browser.`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Azure-Specific: Startup Script for Secret Retrieval"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For production deployments, create a startup script that retrieves secrets from Key Vault each time the VM boots. This ensures secrets are refreshed automatically and minimizes the window during which plaintext credentials exist on disk."}),e.jsx(t,{language:"bash",title:"Startup Script: /opt/nemoclaw-init.sh",code:`#!/bin/bash
# /opt/nemoclaw-init.sh
# Runs before NemoClaw starts, retrieves secrets from Key Vault

set -euo pipefail

VAULT_NAME="nemoclaw-vault"
ENV_FILE="/home/azureuser/nemoclaw/.env"

echo "Retrieving secrets from Key Vault..."

ANTHROPIC_KEY=$(az keyvault secret show \\
  --vault-name $VAULT_NAME \\
  --name anthropic-api-key \\
  --query value -o tsv)

SLACK_TOKEN=$(az keyvault secret show \\
  --vault-name $VAULT_NAME \\
  --name slack-bot-token \\
  --query value -o tsv)

cat > $ENV_FILE << EOF
ANTHROPIC_API_KEY=$ANTHROPIC_KEY
SLACK_BOT_TOKEN=$SLACK_TOKEN
NODE_ENV=production
EOF

chown azureuser:azureuser $ENV_FILE
chmod 600 $ENV_FILE

echo "Secrets retrieved successfully."`}),e.jsx(t,{language:"ini",title:"Updated systemd service with pre-start",code:`[Unit]
Description=NemoClaw Agent Security Platform
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=azureuser
WorkingDirectory=/home/azureuser/nemoclaw
EnvironmentFile=/home/azureuser/nemoclaw/.env
ExecStartPre=/bin/bash /opt/nemoclaw-init.sh
ExecStart=/usr/bin/npx nemoclaw start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Azure Monitor Integration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Azure Monitor can collect logs and metrics from your NemoClaw VM for centralized observability. Install the Azure Monitor Agent to forward syslog and journald output to a Log Analytics workspace."}),e.jsx(t,{language:"bash",title:"Install Azure Monitor Agent",code:`# Install the Azure Monitor Agent extension
az vm extension set \\
  --resource-group nemoclaw-rg \\
  --vm-name nemoclaw-prod \\
  --name AzureMonitorLinuxAgent \\
  --publisher Microsoft.Azure.Monitor \\
  --version 1.0

# Create a Data Collection Rule to forward syslog
# (Configure in Azure Portal: Monitor > Data Collection Rules > Create)
# Select your VM, choose Syslog as a data source,
# and send to your Log Analytics workspace.

# Query NemoClaw logs in Log Analytics:
# Syslog | where ProcessName == "nemoclaw" | order by TimeGenerated desc`}),e.jsx(a,{type:"tip",title:"Azure Serial Console",children:e.jsx("p",{children:"If you lose SSH access to your VM (due to a firewall misconfiguration, network issue, or SSH daemon crash), Azure Serial Console provides emergency access directly through the Azure Portal. Enable it in the VM's Boot Diagnostics settings. It works even when the network stack is broken, as it uses the VM's serial port."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Troubleshooting Azure-Specific Issues"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"az CLI not found on the VM:"})," Install it with ",e.jsx("code",{children:"curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"}),". It is not pre-installed on standard Ubuntu images."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Key Vault access denied:"}),' Ensure Managed Identity is enabled and the "Key Vault Secrets User" role is assigned at the vault scope.']}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Slow disk IO:"})," Standard HDD is the default on some VM sizes. Switch to Premium SSD by stopping the VM, changing the disk SKU, and restarting."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"DNS resolution failures:"})," Azure VMs use Azure DNS by default (168.63.129.16). If NemoClaw cannot resolve external hostnames, verify the VM's network interface has the correct DNS settings."]})]}),e.jsx(i,{title:"Azure Instance Metadata Service",children:e.jsxs("p",{children:["Similar to AWS and GCP, Azure VMs have a metadata service at",e.jsx("code",{children:" http://169.254.169.254"})," that exposes the Managed Identity token and instance details. Configure NemoClaw policies to block agents from accessing this endpoint, as a compromised agent could use the metadata service to authenticate to Azure services using the VM's identity."]})}),e.jsx(n,{question:"What is the purpose of the ExecStartPre directive in the NemoClaw systemd service file?",options:["It starts a backup process before NemoClaw launches","It retrieves secrets from Key Vault and writes them to the .env file before NemoClaw starts","It runs system updates before starting the service","It checks if NemoClaw is already running"],correctIndex:1,explanation:"ExecStartPre runs the secret retrieval script before the main NemoClaw process starts. This ensures that fresh secrets are pulled from Key Vault on every service start (including after reboots), minimizing the risk of stale or compromised credentials."}),e.jsx(s,{references:[{title:"Azure Key Vault Quickstart",url:"https://learn.microsoft.com/en-us/azure/key-vault/secrets/quick-create-cli",type:"docs",description:"Store and retrieve secrets using Azure Key Vault."},{title:"Azure Monitor Agent",url:"https://learn.microsoft.com/en-us/azure/azure-monitor/agents/agents-overview",type:"docs",description:"Collect logs and metrics from Azure VMs."}]})]})}const se=Object.freeze(Object.defineProperty({__proto__:null,default:N},Symbol.toStringTag,{value:"Module"}));function A(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Azure GPU VMs for Local Inference"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Azure offers GPU-accelerated virtual machines through the N-series family, spanning training-focused NC-series with NVIDIA A100 and H100 GPUs to inference-optimized NV-series with T4 and A10 GPUs. This section covers the available options, driver installation, and practical recommendations for running local LLM inference alongside NemoClaw."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GPU VM Families"}),e.jsx(r,{title:"Azure GPU VMs for Inference",headers:["VM Size","GPU","VRAM","vCPUs","RAM","Approx. $/hr"],rows:[["Standard_NC4as_T4_v3","NVIDIA T4","16 GB","4","28 GB","~$0.53"],["Standard_NC8as_T4_v3","NVIDIA T4","16 GB","8","56 GB","~$0.75"],["Standard_NV36ads_A10_v5","NVIDIA A10","24 GB","36","440 GB","~$2.07"],["Standard_NC24ads_A100_v4","NVIDIA A100","80 GB","24","220 GB","~$3.67"],["Standard_ND96asr_v4","8x NVIDIA A100","8x 40 GB","96","900 GB","~$27.20"]]}),e.jsx(a,{type:"info",title:"Inference Recommendation",children:e.jsxs("p",{children:["For NemoClaw local inference, the ",e.jsx("strong",{children:"Standard_NC4as_T4_v3"})," is the budget choice for 7B parameter models, while the ",e.jsx("strong",{children:"Standard_NV36ads_A10_v5"}),"handles 13B models with its 24 GB VRAM. The T4-based NC-series offers the best price for entry-level GPU inference on Azure. The A100-based NC-series is for large models (30B+) where the additional VRAM and memory bandwidth justify the cost premium."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Driver Installation"}),e.jsx(o,{title:"Install NVIDIA Drivers on Azure GPU VMs",steps:[{title:"Use the NVIDIA GPU Driver Extension (recommended)",content:`Azure provides a VM extension that automatically installs the correct NVIDIA driver:

az vm extension set \\
  --resource-group nemoclaw-rg \\
  --vm-name nemoclaw-gpu \\
  --name NvidiaGpuDriverLinux \\
  --publisher Microsoft.HpcCompute \\
  --version 1.9

This installs the GRID or Tesla driver appropriate for your GPU type and reboots the VM.`},{title:"Wait for the extension to complete",content:`The extension takes 5-10 minutes to install. Check status:

az vm extension show \\
  --resource-group nemoclaw-rg \\
  --vm-name nemoclaw-gpu \\
  --name NvidiaGpuDriverLinux \\
  --query provisioningState`},{title:"SSH in and verify",content:`After the extension completes and the VM reboots:

ssh azureuser@<public-ip>
nvidia-smi

You should see the GPU model, driver version, and CUDA version listed.`},{title:"Install CUDA toolkit (optional)",content:`If your inference framework requires the CUDA toolkit (not just the driver):

wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update && sudo apt install -y cuda-toolkit-12-4`}]}),e.jsx(t,{language:"bash",title:"Manual Driver Installation Alternative",code:`# If the extension fails, install manually:
sudo apt update
sudo apt install -y ubuntu-drivers-common
sudo ubuntu-drivers devices
sudo ubuntu-drivers autoinstall
sudo reboot

# After reboot, verify:
nvidia-smi`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Setting Up Local Inference"}),e.jsx(t,{language:"bash",title:"Configure Ollama on Azure GPU VM",code:`# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model based on your VRAM
# T4 (16 GB): 7B quantized models
ollama pull llama3:8b-instruct-q4_K_M

# A10 (24 GB): 13B quantized models
ollama pull llama3:13b-instruct-q4_K_M

# A100 (80 GB): 70B quantized models
ollama pull llama3:70b-instruct-q4_K_M

# Test inference
ollama run llama3:8b-instruct-q4_K_M "Explain what NemoClaw does"

# Configure NemoClaw to use local Ollama
# Edit ~/nemoclaw/openclaw.json:
# {
#   "llm": {
#     "provider": "ollama",
#     "baseUrl": "http://localhost:11434",
#     "model": "llama3:8b-instruct-q4_K_M"
#   }
# }`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Azure-Specific GPU Considerations"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Quota requests:"}),' New Azure subscriptions have zero GPU quota. Request quota through the Azure Portal: Subscription > Usage + Quotas > search for "NC" or "NV" series. Approval typically takes 1-3 business days.']}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Region availability:"})," GPU VMs are available in limited regions. East US, West US 2, and West Europe typically have the best availability. Check region availability in the Azure Pricing Calculator."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Spot pricing:"})," Azure Spot VMs offer up to 90% discount on GPU instances. Set a maximum price to limit your spend and handle eviction gracefully."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Low-priority VMs:"})," Similar to Spot but available through Azure Batch. Good for batch inference workloads but not recommended for always-on NemoClaw deployments."]})]}),e.jsx(i,{title:"NVv3 vs NVads A10 Series",children:e.jsx("p",{children:'Azure has older NV-series VMs (NVv3) with NVIDIA M60 GPUs. These are designed for visualization workloads, not ML inference. The M60 has 8 GB VRAM per GPU partition and lacks the Tensor Cores needed for efficient LLM inference. Always choose the newer NCas T4 or NVads A10 series for inference workloads. The "v3" in the name can be confusing -- check the actual GPU model, not just the series version.'})}),e.jsx(n,{question:"Which Azure VM extension simplifies NVIDIA driver installation on GPU VMs?",options:["AzureMonitorLinuxAgent","CustomScriptExtension","NvidiaGpuDriverLinux","DockerExtension"],correctIndex:2,explanation:"The NvidiaGpuDriverLinux extension (publisher: Microsoft.HpcCompute) automatically detects the GPU type, downloads the appropriate NVIDIA driver, installs it, and reboots the VM. This is the recommended approach over manual driver installation."}),e.jsx(s,{references:[{title:"Azure N-series GPU VMs",url:"https://learn.microsoft.com/en-us/azure/virtual-machines/sizes-gpu",type:"docs",description:"Complete reference for Azure GPU-accelerated VM sizes."},{title:"NVIDIA GPU Driver Extension for Azure",url:"https://learn.microsoft.com/en-us/azure/virtual-machines/extensions/hpccompute-gpu-linux",type:"docs",description:"How to install NVIDIA drivers using the Azure VM extension."}]})]})}const oe=Object.freeze(Object.defineProperty({__proto__:null,default:A},Symbol.toStringTag,{value:"Module"}));function P(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Azure-Specific Performance Configuration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Azure offers several platform-specific features that can improve NemoClaw performance and reliability. This section covers Accelerated Networking for lower latency, Premium SSD storage for consistent IO, and proximity placement groups for minimizing inter-service latency. These optimizations are optional but recommended for production deployments."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Accelerated Networking"}),e.jsx(l,{term:"Accelerated Networking",definition:"An Azure feature that uses SR-IOV (Single Root I/O Virtualization) to bypass the hypervisor's virtual network stack and connect the VM directly to the physical NIC. This reduces latency, jitter, and CPU utilization for network traffic. It is available on most D-series, F-series, and N-series VMs at no additional cost.",example:"With Accelerated Networking enabled, NemoClaw's API calls to Anthropic see reduced round-trip times (typically 0.1-0.5ms improvement per call) and the CPU spends less time processing network packets, leaving more resources for policy evaluation.",seeAlso:["SR-IOV","Network Latency","vCPU"]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Accelerated Networking is automatically enabled on supported VM sizes when you create a new VM. If you are running an older VM or want to verify it is enabled:"}),e.jsx(t,{language:"bash",title:"Enable and Verify Accelerated Networking",code:`# Check if Accelerated Networking is enabled
az network nic show \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prodVMNic \\
  --query enableAcceleratedNetworking

# Enable it (requires VM to be stopped)
az vm deallocate --resource-group nemoclaw-rg --name nemoclaw-prod

az network nic update \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prodVMNic \\
  --accelerated-networking true

az vm start --resource-group nemoclaw-rg --name nemoclaw-prod

# Verify from inside the VM
lspci | grep -i mellanox
# Should show a Mellanox ConnectX virtual function`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Premium SSD Storage"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Azure offers four managed disk tiers, each with different performance characteristics. For NemoClaw, disk performance primarily affects startup time (loading policy rules), log write throughput, and session persistence speed."}),e.jsx(r,{title:"Azure Managed Disk Types",headers:["Disk Type","IOPS (32 GB)","Throughput","Latency","Cost (32 GB/mo)"],rows:[["Standard HDD (S4)","500","60 MB/s","~10ms","~$1.54"],["Standard SSD (E4)","500","60 MB/s","~5ms","~$2.40"],["Premium SSD (P4)","120","25 MB/s","~1ms","~$4.82"],["Premium SSD v2","Configurable","Configurable","~1ms","~$4.10+"],["Ultra Disk","Configurable","Configurable","<1ms","~$15+"]]}),e.jsx(a,{type:"tip",title:"Premium SSD P6 or Higher",children:e.jsx("p",{children:"The smallest Premium SSD size (P4, 32 GB) has limited IOPS (120) due to its small size. Azure scales disk IOPS with disk size. A P6 (64 GB) provides 240 IOPS, and a P10 (128 GB) provides 500 IOPS. If NemoClaw experiences disk bottlenecks, provisioning a larger disk (even if the extra space is unused) can improve IO performance. Alternatively, use Premium SSD v2 which allows independent IOPS configuration."})}),e.jsx(t,{language:"bash",title:"Upgrade to Premium SSD",code:`# Check current disk SKU
az vm show \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prod \\
  --query 'storageProfile.osDisk.managedDisk' \\
  --output json

# Change disk SKU (requires VM to be stopped)
az vm deallocate --resource-group nemoclaw-rg --name nemoclaw-prod

DISK_NAME=$(az vm show \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prod \\
  --query 'storageProfile.osDisk.name' \\
  --output tsv)

az disk update \\
  --resource-group nemoclaw-rg \\
  --name $DISK_NAME \\
  --sku Premium_LRS

az vm start --resource-group nemoclaw-rg --name nemoclaw-prod`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Proximity Placement Groups"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"A Proximity Placement Group (PPG) is an Azure resource that ensures VMs are placed physically close to each other within a datacenter. This is primarily useful when running NemoClaw alongside other services (a separate database, a local LLM inference server, or a monitoring stack) where inter-VM network latency matters."}),e.jsx(t,{language:"bash",title:"Create a Proximity Placement Group",code:`# Create a proximity placement group
az ppg create \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-ppg \\
  --location eastus \\
  --type Standard

# Create VMs in the same PPG
az vm create \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prod \\
  --image Ubuntu2204 \\
  --size Standard_D4s_v3 \\
  --ppg nemoclaw-ppg \\
  --admin-username azureuser \\
  --generate-ssh-keys

# If running a separate inference server:
az vm create \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-inference \\
  --image Ubuntu2204 \\
  --size Standard_NC4as_T4_v3 \\
  --ppg nemoclaw-ppg \\
  --admin-username azureuser \\
  --generate-ssh-keys`}),e.jsx(a,{type:"info",title:"When PPGs Matter",children:e.jsx("p",{children:"For a single NemoClaw VM, proximity placement groups provide no benefit. They only matter when you have multiple VMs that communicate with each other frequently. If NemoClaw and your local inference server run on separate VMs, a PPG can reduce inter-VM round-trip time from 1-2ms to under 0.5ms. This adds up when the Gateway makes dozens of inference calls per agent interaction."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Additional Azure Optimizations"}),e.jsx(o,{title:"Azure Performance Tuning Checklist",steps:[{title:"Enable Accelerated Networking",content:"Verify it is enabled on your VM's NIC. Free performance improvement for all network-bound operations."},{title:"Use Premium SSD storage",content:"Upgrade from Standard HDD/SSD to Premium SSD for consistent low-latency disk IO. Consider a larger disk size for higher IOPS."},{title:"Enable host caching on OS disk",content:`Set the OS disk caching to ReadWrite (default for Premium SSD). This caches frequently accessed data in the host memory, improving read performance for NemoClaw's policy engine:

az vm update --resource-group nemoclaw-rg --name nemoclaw-prod --set storageProfile.osDisk.caching=ReadWrite`},{title:"Configure swap space",content:`Azure Ubuntu VMs have a resource disk (temporary SSD) at /mnt. Configure swap on this disk to handle memory pressure gracefully:

sudo fallocate -l 4G /mnt/swapfile
sudo chmod 600 /mnt/swapfile
sudo mkswap /mnt/swapfile
sudo swapon /mnt/swapfile`},{title:"Set up Azure Update Management",content:"Enable automatic OS updates to keep security patches current without manual intervention. Configure in the VM's Update Management settings to apply updates during a maintenance window that minimizes NemoClaw downtime."}]}),e.jsx(n,{question:"What is the primary benefit of Azure Accelerated Networking for a NemoClaw deployment?",options:["It increases the VM's disk throughput","It provides a faster GPU interconnect","It reduces network latency and CPU utilization by bypassing the hypervisor's virtual network stack","It enables the VM to have multiple public IP addresses"],correctIndex:2,explanation:"Accelerated Networking uses SR-IOV to give the VM direct access to the physical NIC, bypassing the hypervisor's virtual network processing. This reduces network latency (important for LLM API calls) and frees up CPU cycles that would otherwise be spent on network packet processing."}),e.jsx(s,{references:[{title:"Azure Accelerated Networking",url:"https://learn.microsoft.com/en-us/azure/virtual-network/accelerated-networking-overview",type:"docs",description:"How Accelerated Networking works and which VM sizes support it."},{title:"Azure Managed Disks",url:"https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview",type:"docs",description:"Overview of Azure managed disk types and performance tiers."},{title:"Proximity Placement Groups",url:"https://learn.microsoft.com/en-us/azure/virtual-machines/co-location",type:"docs",description:"Reduce inter-VM latency with proximity placement groups."}]})]})}const ie=Object.freeze(Object.defineProperty({__proto__:null,default:P},Symbol.toStringTag,{value:"Module"}));function k(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"NemoClaw on DigitalOcean"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"DigitalOcean is known for its simplicity and developer-friendly interface. For NemoClaw, it offers a straightforward deployment experience with predictable pricing and no hidden costs. Droplets (DigitalOcean's VMs) are ideal for small to medium NemoClaw deployments where you want a clean, simple infrastructure without the complexity of AWS, GCP, or Azure."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Recommended Droplet Sizes"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Basic 4 GB ($24/mo):"})," 2 vCPUs, 4 GB RAM, 80 GB SSD. Bare minimum for testing. Will run NemoClaw but may struggle under concurrent sessions."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Basic 8 GB ($48/mo):"})," 4 vCPUs, 8 GB RAM, 160 GB SSD. Good for small teams (up to 5 users). The minimum recommended for reliable operation."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"CPU-Optimized 8 GB ($80/mo):"})," 4 dedicated vCPUs, 8 GB RAM, 100 GB NVMe SSD. Recommended for production. Dedicated CPUs ensure consistent performance unlike shared basic Droplets."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"CPU-Optimized 16 GB ($160/mo):"})," 8 dedicated vCPUs, 16 GB RAM, 200 GB NVMe SSD. For larger teams or heavy usage patterns."]})]}),e.jsx(a,{type:"tip",title:"Dedicated CPU Droplets",children:e.jsx("p",{children:"DigitalOcean's Basic Droplets use shared vCPUs, meaning your performance can be affected by neighboring VMs. CPU-Optimized Droplets provide dedicated cores with guaranteed performance. For production NemoClaw deployments, the extra cost of dedicated CPUs is worth the consistency -- especially for policy evaluation latency which directly impacts agent responsiveness."})}),e.jsx(o,{title:"Deploy NemoClaw on DigitalOcean",steps:[{title:"Create a Droplet",content:"Log into the DigitalOcean dashboard and click Create > Droplets. Select Ubuntu 22.04 (LTS) x64 as the image. Choose a datacenter region close to your team."},{title:"Select the Droplet size",content:'Under "CPU options", select "Dedicated CPU" for production use. Choose the 4 vCPU / 8 GB plan ($80/mo) as a recommended starting point.'},{title:"Configure authentication",content:'Select "SSH keys" and add your public key. DigitalOcean also supports password authentication, but SSH keys are strongly recommended.'},{title:"Enable monitoring and backups",content:'Check "Monitoring" (free) for CPU, memory, and disk metrics in the dashboard. Optionally enable "Backups" ($16/mo for the 8 GB plan) for weekly automated snapshots.'},{title:"Set the hostname",content:'Name it something descriptive like "nemoclaw-prod". Add a tag like "nemoclaw" for organization.'},{title:"Create the Droplet",content:"Click Create Droplet. It provisions in about 30 seconds. Copy the IP address from the dashboard."},{title:"Configure the firewall",content:'Go to Networking > Firewalls > Create Firewall. Add an inbound rule for SSH (port 22) from your IP only. Apply it to the "nemoclaw" tag. This is equivalent to a cloud security group.'},{title:"SSH and install NemoClaw",content:`ssh root@<droplet-ip>

# Create a non-root user first
adduser nemoclaw
usermod -aG sudo nemoclaw
rsync --archive --chown=nemoclaw:nemoclaw ~/.ssh /home/nemoclaw

# Switch to the new user
su - nemoclaw

# Update and install dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

# Install NemoClaw
curl -fsSL https://install.nemoclaw.dev | bash
cd ~/nemoclaw && npx nemoclaw onboard`},{title:"Set up systemd service",content:"Create the service file as described in previous sections, using User=nemoclaw and WorkingDirectory=/home/nemoclaw/nemoclaw. Enable and start the service."}]}),e.jsx(i,{title:"Do Not Run NemoClaw as Root",children:e.jsx("p",{children:'DigitalOcean Droplets default to root SSH access. Always create a dedicated non-root user for running NemoClaw. Running the Gateway and policy engine as root means any vulnerability could lead to full system compromise. Create a "nemoclaw" user with sudo privileges and run all NemoClaw processes under that account.'})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"DigitalOcean CLI Alternative"}),e.jsx(t,{language:"bash",title:"Create Droplet via doctl",code:`# Install doctl and authenticate
# brew install doctl (macOS) or snap install doctl (Linux)
doctl auth init

# Create the Droplet
doctl compute droplet create nemoclaw-prod \\
  --image ubuntu-22-04-x64 \\
  --size c-4-8gib \\
  --region nyc1 \\
  --ssh-keys YOUR_SSH_KEY_FINGERPRINT \\
  --enable-monitoring \\
  --tag-names nemoclaw \\
  --wait

# Get the IP
doctl compute droplet get nemoclaw-prod --format PublicIPv4

# Create firewall
doctl compute firewall create \\
  --name nemoclaw-fw \\
  --inbound-rules "protocol:tcp,ports:22,address:YOUR_IP/32" \\
  --outbound-rules "protocol:tcp,ports:all,address:0.0.0.0/0 protocol:udp,ports:all,address:0.0.0.0/0" \\
  --tag-names nemoclaw`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"DigitalOcean Advantages for NemoClaw"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Predictable pricing:"})," No hidden data transfer charges, no per-request API fees. The monthly price includes a generous data transfer allowance (4-8 TB depending on plan)."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Simple firewall:"})," DigitalOcean Cloud Firewalls are free and apply by tag, making it easy to manage access for multiple Droplets."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Snapshots:"})," Manual snapshots cost $0.06/GB/month and provide point-in-time backups of your entire Droplet. Take a snapshot before major NemoClaw updates."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Monitoring built-in:"})," Free monitoring provides CPU, memory, disk, and network graphs directly in the dashboard without installing agents."]})]}),e.jsx(n,{question:"Why is the CPU-Optimized Droplet recommended over the Basic Droplet for production NemoClaw?",options:["CPU-Optimized Droplets have more storage","CPU-Optimized Droplets use dedicated cores ensuring consistent performance","Basic Droplets do not support Ubuntu 22.04","CPU-Optimized Droplets include free backups"],correctIndex:1,explanation:"Basic Droplets use shared vCPUs where performance can fluctuate based on other tenants on the same physical host. CPU-Optimized Droplets provide dedicated CPU cores with guaranteed clock speed, ensuring consistent policy evaluation latency and agent responsiveness -- critical for production NemoClaw."}),e.jsx(s,{references:[{title:"DigitalOcean Droplet Documentation",url:"https://docs.digitalocean.com/products/droplets/",type:"docs",description:"Complete guide to creating and managing DigitalOcean Droplets."},{title:"DigitalOcean Cloud Firewalls",url:"https://docs.digitalocean.com/products/networking/firewalls/",type:"docs",description:"How to configure network firewalls for Droplets."}]})]})}const re=Object.freeze(Object.defineProperty({__proto__:null,default:k},Symbol.toStringTag,{value:"Module"}));function I(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"NemoClaw on Hetzner Cloud"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Hetzner Cloud has earned a strong reputation among developers for offering exceptional price-to-performance ratios, particularly in European regions. Based in Germany, Hetzner provides cloud servers at roughly half the cost of equivalent DigitalOcean or AWS instances, making it an excellent choice for NemoClaw deployments -- especially for EU-based teams or those with budget constraints."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Recommended Server Types"}),e.jsx(r,{title:"Hetzner Cloud Server Options",headers:["Type","vCPUs","RAM","Storage","Monthly Cost","Use Case"],rows:[["CX22","2 shared","4 GB","40 GB NVMe","~$4.50","Testing only"],["CX32","4 shared","8 GB","80 GB NVMe","~$8.50","Small team, budget option"],["CX42","8 shared","16 GB","160 GB NVMe","~$16.50","Medium team production"],["CPX31","4 dedicated","8 GB","160 GB NVMe","~$14","Small team, dedicated CPUs"],["CPX41","8 dedicated","16 GB","240 GB NVMe","~$26","Recommended production"],["CCX23","4 dedicated","16 GB","80 GB NVMe","~$19","CPU-optimized, AMD EPYC"]]}),e.jsx(a,{type:"info",title:"Unbeatable Price-Performance",children:e.jsx("p",{children:"Hetzner's CPX41 (8 dedicated vCPUs, 16 GB RAM) costs approximately $26/month. An equivalent AWS instance (c6i.2xlarge) costs roughly $245/month -- nearly 10x more. Even accounting for differences in network and managed services, Hetzner delivers outstanding value for compute-focused workloads like NemoClaw."})}),e.jsx(o,{title:"Deploy NemoClaw on Hetzner Cloud",steps:[{title:"Create a Hetzner Cloud account",content:'Sign up at cloud.hetzner.com. Create a new project named "nemoclaw". Hetzner requires identity verification which typically takes 1-2 business days for new accounts.'},{title:"Add your SSH key",content:"In the project, go to Security > SSH Keys > Add SSH Key. Paste your public key and give it a name."},{title:"Create a server",content:"Click Servers > Create Server. Select a location (Falkenstein, Nuremberg, or Helsinki for EU; Ashburn or Hillsboro for US). Choose Ubuntu 22.04 as the image. Select CPX31 or CPX41 for production."},{title:"Configure firewall",content:"Go to Firewalls > Create Firewall. Add an inbound rule: Protocol TCP, Port 22, Source YOUR_IP/32. Apply the firewall to your server."},{title:"SSH and create a user",content:`ssh root@<server-ip>

adduser nemoclaw
usermod -aG sudo nemoclaw
rsync --archive --chown=nemoclaw:nemoclaw ~/.ssh /home/nemoclaw

# Disable root SSH login
sed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config
systemctl restart sshd

# Reconnect as the new user
exit
ssh nemoclaw@<server-ip>`},{title:"Install NemoClaw",content:`sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

curl -fsSL https://install.nemoclaw.dev | bash
cd ~/nemoclaw && npx nemoclaw onboard`},{title:"Configure systemd service",content:`Create the nemoclaw.service file (same pattern as previous sections) and enable it:

sudo systemctl daemon-reload
sudo systemctl enable nemoclaw
sudo systemctl start nemoclaw`},{title:"Verify and access",content:`npx nemoclaw status

Access Control UI via SSH tunnel:
ssh -L 18789:localhost:18789 nemoclaw@<server-ip>`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Hetzner CLI (hcloud)"}),e.jsx(t,{language:"bash",title:"Deploy via hcloud CLI",code:`# Install hcloud CLI
# macOS: brew install hcloud
# Linux: snap install hcloud

# Configure with your API token
hcloud context create nemoclaw
# Enter your API token from the Hetzner Cloud Console

# Create a server
hcloud server create \\
  --name nemoclaw-prod \\
  --type cpx41 \\
  --image ubuntu-22.04 \\
  --location nbg1 \\
  --ssh-key your-key-name

# Create and apply firewall
hcloud firewall create --name nemoclaw-fw
hcloud firewall add-rule nemoclaw-fw \\
  --direction in \\
  --protocol tcp \\
  --port 22 \\
  --source-ips YOUR_IP/32

hcloud firewall apply-to-resource nemoclaw-fw \\
  --type server \\
  --server nemoclaw-prod

# Get server IP
hcloud server ip nemoclaw-prod`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Hetzner-Specific Considerations"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Data transfer:"})," Hetzner includes 20 TB of outbound traffic per month on all cloud servers. This is exceptionally generous and more than enough for any NemoClaw deployment."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Snapshots:"})," Snapshots are priced at EUR 0.0119/GB/month. A 30 GB snapshot costs about EUR 0.36/month -- extremely affordable for regular backups."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Volumes:"})," Attach additional block storage volumes starting at EUR 0.0440/GB/month if you need more disk space for logs or workspace data."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"No GPU instances:"})," Hetzner Cloud does not currently offer GPU instances. If you need local LLM inference, you will need to use Hetzner's dedicated servers (bare metal) or choose a different provider for the GPU component."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"GDPR compliance:"})," Hetzner's EU datacenters (Germany, Finland) keep all data within the European Union, which can be advantageous for teams with GDPR requirements."]})]}),e.jsx(n,{question:"What makes Hetzner Cloud particularly attractive for budget-conscious NemoClaw deployments?",options:["Hetzner offers free GPU instances","Hetzner provides dedicated CPU servers at roughly 1/10th the cost of equivalent AWS instances","Hetzner includes free managed Kubernetes","Hetzner does not require a credit card"],correctIndex:1,explanation:"Hetzner's primary advantage is exceptional price-to-performance. A CPX41 with 8 dedicated vCPUs and 16 GB RAM costs ~$26/month, compared to ~$245/month for an equivalent c6i.2xlarge on AWS. This makes Hetzner ideal for teams that need production-grade compute without enterprise cloud budgets."}),e.jsx(s,{references:[{title:"Hetzner Cloud Documentation",url:"https://docs.hetzner.com/cloud/",type:"docs",description:"Official Hetzner Cloud documentation including server types and pricing."},{title:"hcloud CLI Reference",url:"https://github.com/hetznercloud/cli",type:"github",description:"Hetzner Cloud command-line tool for server management."}]})]})}const le=Object.freeze(Object.defineProperty({__proto__:null,default:I},Symbol.toStringTag,{value:"Module"}));function j(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"NemoClaw on Vultr"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Vultr is a cloud provider with 32 datacenter locations worldwide, offering a mix of cloud compute, bare metal, and GPU instances. For NemoClaw, Vultr provides competitive pricing with the added advantage of GPU instance availability -- a rarity among smaller cloud providers. This section covers Vultr's compute options, GPU instances, and the deployment process."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Compute Options"}),e.jsx(r,{title:"Vultr Instance Types for NemoClaw",headers:["Plan","vCPUs","RAM","Storage","Monthly Cost","Notes"],rows:[["Cloud Compute (Regular)","2","4 GB","80 GB SSD","$24","Testing only, shared CPUs"],["Cloud Compute (Regular)","4","8 GB","160 GB SSD","$48","Small team, shared CPUs"],["Cloud Compute (High Freq.)","4","8 GB","128 GB NVMe","$48","Better single-thread performance"],["Optimized Cloud","4","16 GB","240 GB NVMe","$90","Dedicated CPUs, production recommended"],["Optimized Cloud","8","32 GB","480 GB NVMe","$180","Large team production"],["Cloud GPU (A100)","12","120 GB","1400 GB NVMe","$~2,500","Local inference with A100 GPU"]]}),e.jsx(a,{type:"info",title:"High Frequency Compute",children:e.jsx("p",{children:"Vultr's High Frequency instances run on 3+ GHz processors with NVMe storage, offering better single-thread performance than regular instances. Since NemoClaw's Gateway is largely single-threaded for message processing, High Frequency instances can provide noticeably better response times at the same price point."})}),e.jsx(o,{title:"Deploy NemoClaw on Vultr",steps:[{title:"Create a Vultr account",content:"Sign up at vultr.com. Add a payment method and optionally add your SSH public key under Account > SSH Keys."},{title:"Deploy a server",content:'Click Deploy > Cloud Compute. Select "Optimized Cloud Compute" for production. Choose a location near your team. Select Ubuntu 22.04 x64 as the server image.'},{title:"Select the plan",content:"Choose the 4 vCPU / 16 GB plan ($90/mo) for production use. Select your SSH key for authentication."},{title:"Configure firewall group",content:'Go to Products > Firewall. Create a new group named "nemoclaw". Add a rule: Protocol TCP, Port 22, Source YOUR_IP/32, Action Accept. Link the firewall group to your server.'},{title:"SSH and initial setup",content:`ssh root@<server-ip>

# Create a non-root user
adduser nemoclaw && usermod -aG sudo nemoclaw
rsync --archive --chown=nemoclaw:nemoclaw ~/.ssh /home/nemoclaw

# Harden SSH
sed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config
echo "PasswordAuthentication no" >> /etc/ssh/sshd_config
systemctl restart sshd`},{title:"Install NemoClaw",content:`su - nemoclaw
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

curl -fsSL https://install.nemoclaw.dev | bash
cd ~/nemoclaw && npx nemoclaw onboard`},{title:"Set up systemd and verify",content:`Create the nemoclaw.service systemd unit, enable, and start it. Verify with:
npx nemoclaw status`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Vultr GPU Instances"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Vultr is one of the few independent cloud providers offering GPU instances. Their Cloud GPU product provides NVIDIA A100 GPUs suitable for local LLM inference. This is particularly useful if you want GPU capability without committing to AWS, GCP, or Azure."}),e.jsx(t,{language:"bash",title:"Deploying a Vultr GPU Instance",code:`# Vultr GPU instances are deployed through the web interface
# or API. The CLI (vultr-cli) also supports GPU deployment.

# Install vultr-cli
# macOS: brew install vultr/vultr-cli/vultr-cli
# Linux: snap install vultr-cli

# List available GPU plans
vultr-cli plans list --type vgpu

# Create a GPU instance
vultr-cli instance create \\
  --plan vgpu-a100-1c-12g-120ram \\
  --region ewr \\
  --os 387 \\
  --ssh-keys YOUR_KEY_ID \\
  --label nemoclaw-gpu

# NVIDIA drivers come pre-installed on Vultr GPU instances
# Verify after SSH:
nvidia-smi`}),e.jsx(a,{type:"tip",title:"GPU Driver Pre-Installation",children:e.jsxs("p",{children:["Vultr GPU instances come with NVIDIA drivers pre-installed when you select a compatible OS image. This saves the 15-20 minutes of manual driver installation. After provisioning, simply SSH in, verify with ",e.jsx("code",{children:"nvidia-smi"}),", and proceed directly to installing Ollama or your preferred inference framework."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Vultr-Specific Features"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Snapshots:"})," Free automatic snapshots available. Manual snapshots are also free (limited by account storage quota). Take advantage of this for zero-cost NemoClaw backups."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Startup scripts:"})," Vultr supports boot scripts that run on first launch. Use this to automate NemoClaw installation on new instances."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Reserved IPs:"})," Static IPv4 addresses at $3/month. Useful if you need a consistent IP for SSH access."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"DDoS protection:"})," Included at no extra cost in select locations. Not critical for NemoClaw (no public ports) but a nice safety net."]})]}),e.jsx(n,{question:"What advantage does Vultr offer over most independent VPS providers for NemoClaw deployments requiring local inference?",options:["Vultr is the cheapest VPS provider","Vultr offers managed Kubernetes clusters","Vultr provides GPU instances (A100) for local LLM inference","Vultr includes free domain registration"],correctIndex:2,explanation:"Vultr is one of the few independent cloud providers (outside AWS/GCP/Azure) that offers GPU instances. Their Cloud GPU product with NVIDIA A100 GPUs enables local LLM inference, which is a capability typically only available on the major cloud platforms."}),e.jsx(s,{references:[{title:"Vultr Cloud Compute",url:"https://www.vultr.com/products/cloud-compute/",type:"docs",description:"Vultr cloud compute plans and pricing."},{title:"Vultr Cloud GPU",url:"https://www.vultr.com/products/cloud-gpu/",type:"docs",description:"GPU-accelerated instances on Vultr."}]})]})}const ce=Object.freeze(Object.defineProperty({__proto__:null,default:j},Symbol.toStringTag,{value:"Module"}));function G(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"NemoClaw on Linode (Akamai Cloud)"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Linode, now part of Akamai Connected Cloud, is a veteran cloud provider with a focus on simplicity and developer experience. With datacenters across the globe and a straightforward pricing model, Linode is a solid choice for NemoClaw deployments. The Dedicated CPU plans are particularly well-suited for the consistent performance NemoClaw requires."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Recommended Plans"}),e.jsx(r,{title:"Linode Plans for NemoClaw",headers:["Plan Type","vCPUs","RAM","Storage","Monthly Cost","Recommendation"],rows:[["Shared 4 GB","2 shared","4 GB","80 GB","$24","Testing only"],["Shared 8 GB","4 shared","8 GB","160 GB","$48","Budget small team"],["Dedicated 8 GB","4 dedicated","8 GB","160 GB","$72","Production (small team)"],["Dedicated 16 GB","8 dedicated","16 GB","320 GB","$144","Production (recommended)"],["Dedicated 32 GB","16 dedicated","32 GB","640 GB","$288","Large team, heavy usage"]]}),e.jsx(a,{type:"tip",title:"Dedicated CPU Plans",children:e.jsx("p",{children:"Linode's Dedicated CPU plans guarantee consistent CPU performance by allocating physical cores exclusively to your instance. For NemoClaw, this means policy evaluation latency remains stable even when neighboring instances on the same host are under heavy load. The difference between shared and dedicated CPU is often noticeable in p99 latency metrics."})}),e.jsx(o,{title:"Deploy NemoClaw on Linode",steps:[{title:"Create a Linode",content:"Log into cloud.linode.com and click Create Linode. Select Ubuntu 22.04 LTS as the distribution. Choose a region close to your team."},{title:"Select a plan",content:'Under "Linode Plan", select the "Dedicated CPU" tab. Choose the 4 vCPU / 8 GB plan ($72/mo) for small teams or 8 vCPU / 16 GB ($144/mo) for production.'},{title:"Set root password and SSH key",content:'Enter a root password (required by Linode even with SSH keys). Add your SSH public key under "SSH Keys". The SSH key provides the actual access method -- the root password is for emergency console access.'},{title:"Create the Linode",content:"Click Create Linode. Provisioning takes 1-2 minutes. Copy the IP address from the Linode dashboard."},{title:"Configure firewall",content:"Linode offers Cloud Firewall. Go to Firewalls > Create Firewall. Add an inbound rule for SSH (TCP 22) from your IP. Assign the firewall to your Linode. Note: Linode Cloud Firewalls default to allowing all outbound traffic."},{title:"Initial server hardening",content:`ssh root@<linode-ip>

# Create non-root user
adduser nemoclaw
usermod -aG sudo nemoclaw
rsync --archive --chown=nemoclaw:nemoclaw ~/.ssh /home/nemoclaw

# Harden SSH
sed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config
sed -i "s/#PasswordAuthentication yes/PasswordAuthentication no/" /etc/ssh/sshd_config
systemctl restart sshd`},{title:"Install NemoClaw",content:`su - nemoclaw
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

curl -fsSL https://install.nemoclaw.dev | bash
cd ~/nemoclaw && npx nemoclaw onboard`},{title:"Configure systemd and verify",content:`Create the nemoclaw.service systemd unit file, enable, and start:

sudo systemctl enable nemoclaw
sudo systemctl start nemoclaw
npx nemoclaw status`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Linode CLI Alternative"}),e.jsx(t,{language:"bash",title:"Deploy via Linode CLI",code:`# Install Linode CLI
pip3 install linode-cli

# Configure with your API token
linode-cli configure

# Create the Linode
linode-cli linodes create \\
  --type g6-dedicated-4 \\
  --region us-east \\
  --image linode/ubuntu22.04 \\
  --root_pass "$(openssl rand -base64 32)" \\
  --authorized_keys "$(cat ~/.ssh/id_ed25519.pub)" \\
  --label nemoclaw-prod \\
  --tags nemoclaw

# Get the IP
linode-cli linodes list --label nemoclaw-prod --format ipv4

# Create firewall
linode-cli firewalls create \\
  --label nemoclaw-fw \\
  --rules.inbound_policy DROP \\
  --rules.outbound_policy ACCEPT

# Add SSH rule (done via API call)
# linode-cli firewalls rules-update <firewall-id> ...`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Linode-Specific Features"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"LISH (Linode Shell):"})," Emergency out-of-band console access through the Linode Manager. If you lock yourself out of SSH due to a firewall misconfiguration, LISH provides direct console access. Access it through the Linode dashboard or via SSH to lish-us-east.linode.com."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Backups:"})," Automated backups at $5-20/month depending on plan size. Includes daily, weekly, and bi-weekly snapshots with one manual slot."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"NodeBalancers:"})," If you run multiple NemoClaw instances, Linode's NodeBalancers ($10/mo) provide load balancing. Useful for multi-instance deployments with shared policy management."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Block Storage Volumes:"})," Attach additional NVMe storage at $0.10/GB/month if the built-in storage is insufficient for your workspace data and logs."]})]}),e.jsx(n,{question:"What is LISH and when would you use it with a NemoClaw Linode?",options:["A load balancer for distributing traffic across Linodes","An out-of-band console that provides access even when SSH is broken","A log shipping service for centralized logging","A managed database service for session storage"],correctIndex:1,explanation:"LISH (Linode Shell) is an out-of-band serial console that provides direct access to your Linode regardless of its network state. If a firewall misconfiguration, SSH daemon crash, or network issue prevents SSH access, LISH lets you log in directly to fix the problem -- similar to Azure Serial Console."}),e.jsx(s,{references:[{title:"Linode Getting Started",url:"https://www.linode.com/docs/products/compute/compute-instances/get-started/",type:"docs",description:"Official Linode quickstart guide for creating compute instances."},{title:"Linode Cloud Firewall",url:"https://www.linode.com/docs/products/networking/cloud-firewall/",type:"docs",description:"How to configure Linode Cloud Firewalls."}]})]})}const de=Object.freeze(Object.defineProperty({__proto__:null,default:G},Symbol.toStringTag,{value:"Module"}));function M(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"NemoClaw on Oracle Cloud Always Free Tier"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Oracle Cloud's Always Free tier is one of the cloud industry's best-kept secrets. It includes up to 4 ARM Ampere A1 OCPUs (equivalent to vCPUs) and 24 GB of RAM -- permanently free, not a time-limited trial. This is more than enough to run a production NemoClaw deployment at zero cost. The catch? Availability can be limited, and the ARM architecture requires attention during setup."}),e.jsx(a,{type:"info",title:"Always Free vs. Free Trial",children:e.jsx("p",{children:'Oracle Cloud offers two free programs. The "Free Trial" gives $300 in credits for 30 days. The "Always Free" tier provides permanent access to specific resources that never expire, even after the trial ends. NemoClaw runs on Always Free resources, meaning you can run it indefinitely at no cost.'})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Always Free ARM Resources"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Compute:"})," Up to 4 Ampere A1 OCPUs (ARM-based) and 24 GB RAM. You can allocate this as one large VM (4 OCPU, 24 GB) or multiple smaller VMs (e.g., 2x 2 OCPU with 12 GB each)."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Storage:"})," 200 GB of block volume storage total. You can create up to 2 block volumes. The boot volume uses part of this allocation."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Networking:"})," 10 TB outbound data transfer per month. More than sufficient for any NemoClaw deployment."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Load Balancer:"})," One Always Free load balancer (10 Mbps bandwidth). Useful if you split NemoClaw across multiple smaller VMs."]})]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"With 4 OCPUs and 24 GB of RAM, the Always Free ARM VM exceeds the recommended NemoClaw requirements. The 24 GB RAM is particularly generous -- more than the 16 GB recommended for production, allowing headroom for large session stores and concurrent operations."}),e.jsx(o,{title:"Deploy NemoClaw on Oracle Cloud Always Free",steps:[{title:"Create an Oracle Cloud account",content:"Sign up at cloud.oracle.com. You will need a credit card for verification (it will not be charged for Always Free resources). Select your home region carefully -- it cannot be changed later, and Always Free ARM availability varies by region."},{title:"Navigate to Compute Instances",content:"In the OCI Console, go to Compute > Instances > Create Instance."},{title:"Configure the instance",content:`Name: nemoclaw-prod
Image: Ubuntu 22.04 (Canonical-Ubuntu-22.04-aarch64)
Shape: Click "Change Shape" > "Ampere" > VM.Standard.A1.Flex

Configure OCPU and memory:
- OCPUs: 4 (maximum for Always Free)
- Memory: 24 GB (maximum for Always Free)`},{title:"Configure boot volume",content:'Set the boot volume size to 100 GB (up to 200 GB is within Always Free limits). Select "Balanced" performance tier.'},{title:"Add SSH key",content:'Under "Add SSH Keys", paste your public key or upload the .pub file. OCI does not support password-based SSH access by default.'},{title:"Create the instance",content:'Click Create. Note: ARM instances are in high demand. If you see "Out of capacity", try again later (early morning UTC is often best) or select a different availability domain. Some users report needing to try repeatedly over several days.'},{title:"Configure security list",content:`Go to Networking > Virtual Cloud Networks > your VCN > Security Lists > Default Security List. By default, SSH (port 22) is allowed from 0.0.0.0/0. Restrict this to your IP:

Edit the SSH rule and change the Source CIDR to YOUR_IP/32.`},{title:"SSH into the instance",content:`ssh -i your-key ubuntu@<public-ip>

Note the username is "ubuntu" on Oracle Cloud Ubuntu images.`},{title:"Install Node.js for ARM",content:`The standard NodeSource install works on ARM:

sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

Verify: node --version && uname -m
# Should show aarch64 for ARM`},{title:"Install NemoClaw",content:`curl -fsSL https://install.nemoclaw.dev | bash

The installer detects the ARM architecture and downloads the correct binaries. The policy engine has native ARM (aarch64) builds.

cd ~/nemoclaw && npx nemoclaw onboard`},{title:"Set up systemd service",content:`Create the nemoclaw.service file (same as previous sections, with User=ubuntu and WorkingDirectory=/home/ubuntu/nemoclaw).

sudo systemctl daemon-reload
sudo systemctl enable nemoclaw
sudo systemctl start nemoclaw`},{title:"Verify",content:`npx nemoclaw status
sudo systemctl status nemoclaw

Access the Control UI via SSH tunnel:
ssh -L 18789:localhost:18789 ubuntu@<public-ip>`}]}),e.jsx(i,{title:"ARM Instance Availability",children:e.jsx("p",{children:`The biggest challenge with Oracle Cloud's Always Free ARM instances is availability. Due to high demand, the "Create Instance" operation frequently fails with an "Out of host capacity" error. Strategies to work around this: try different availability domains within your region, attempt creation during off-peak hours (UTC mornings), reduce the OCPU/memory request (try 2 OCPU/12 GB first, then resize later), or use OCI CLI with a retry script that attempts creation every few minutes.`})}),e.jsx(t,{language:"bash",title:"OCI CLI with Retry Script",code:`# Install OCI CLI
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"

# Configure with your tenancy details
oci setup config

# Retry script for instance creation
#!/bin/bash
while true; do
  echo "$(date): Attempting to create instance..."
  oci compute instance launch \\
    --availability-domain "AD-1" \\
    --compartment-id "ocid1.compartment.oc1..YOUR_COMPARTMENT" \\
    --shape "VM.Standard.A1.Flex" \\
    --shape-config '{"ocpus": 4, "memoryInGBs": 24}' \\
    --image-id "ocid1.image.oc1..YOUR_ARM_UBUNTU_IMAGE" \\
    --subnet-id "ocid1.subnet.oc1..YOUR_SUBNET" \\
    --ssh-authorized-keys-file ~/.ssh/id_ed25519.pub \\
    --display-name "nemoclaw-prod" \\
    --boot-volume-size-in-gbs 100 \\
    2>&1 | tee /tmp/oci-create.log

  if grep -q "PROVISIONING|RUNNING" /tmp/oci-create.log; then
    echo "Instance created successfully!"
    break
  fi

  echo "Failed. Retrying in 60 seconds..."
  sleep 60
done`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"ARM-Specific Considerations"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Architecture compatibility:"})," NemoClaw's policy engine ships native ARM (aarch64) binaries. Node.js also runs natively on ARM. You should not encounter architecture-related issues."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"npm native modules:"})," Some npm packages with native C/C++ addons may not have pre-built ARM binaries and will compile from source. The ",e.jsx("code",{children:"build-essential"})," package installed earlier provides the necessary compilers."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Performance:"})," Ampere A1 cores deliver roughly equivalent performance to x86 cores at the same count. Four A1 OCPUs provide performance comparable to a 4-vCPU x86 instance."]})]}),e.jsx(n,{question:"What are the maximum Always Free ARM resources available on Oracle Cloud?",options:["1 OCPU, 4 GB RAM","2 OCPUs, 12 GB RAM","4 OCPUs, 24 GB RAM","8 OCPUs, 32 GB RAM"],correctIndex:2,explanation:"Oracle Cloud's Always Free tier includes up to 4 Ampere A1 OCPUs and 24 GB of RAM. This can be allocated as a single VM or split across multiple VMs. These resources are permanently free, not a time-limited trial, making them exceptional value for NemoClaw deployments."}),e.jsx(s,{references:[{title:"Oracle Cloud Always Free Resources",url:"https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm",type:"docs",description:"Complete list of Oracle Cloud Always Free tier resources."},{title:"OCI Compute Instances",url:"https://docs.oracle.com/en-us/iaas/Content/Compute/Concepts/computeoverview.htm",type:"docs",description:"Oracle Cloud compute instance documentation."}]})]})}const ue=Object.freeze(Object.defineProperty({__proto__:null,default:M},Symbol.toStringTag,{value:"Module"}));function U(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"NVIDIA Brev: Managed GPU Instances"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"NVIDIA Brev is a managed GPU cloud platform designed to simplify the deployment and management of GPU-accelerated workloads. Unlike traditional cloud providers where you provision a raw VM and install everything yourself, Brev provides pre-configured GPU environments with NVIDIA drivers, CUDA, and popular ML frameworks ready to go. For NemoClaw, Brev offers one-command deployment to GPU instances, making it the fastest path from zero to a running NemoClaw instance with local inference."}),e.jsx(l,{term:"NVIDIA Brev",definition:"A managed GPU cloud platform that abstracts away infrastructure complexity for GPU workloads. Brev provides instant access to NVIDIA GPUs (T4, A10G, A100, H100) with pre-installed drivers and development environments. Users interact through a CLI or web console, deploying instances with a single command rather than manually configuring VMs, drivers, and CUDA.",example:"Running 'nemoclaw deploy my-instance' on Brev provisions an A100-equipped instance with NVIDIA drivers, CUDA, Node.js, and NemoClaw pre-configured -- ready to use in under 5 minutes.",seeAlso:["GPU Instance","CUDA","Local Inference"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Why Brev for NemoClaw?"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Setting up a GPU instance on AWS, GCP, or Azure requires multiple steps: requesting GPU quota, launching the VM, installing NVIDIA drivers, installing CUDA, configuring the inference framework, and finally installing NemoClaw. This process takes 30-60 minutes even for experienced users. Brev reduces this to a single command that completes in under 5 minutes."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"No driver installation:"})," NVIDIA drivers and CUDA come pre-installed and tested on every Brev instance. No more debugging driver version mismatches or failed installations."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"No quota requests:"})," Unlike AWS/GCP/Azure where new accounts start with zero GPU quota and must request increases (1-3 business day wait), Brev provides immediate GPU access."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"One-command deployment:"})," NemoClaw integrates with Brev's CLI to deploy a fully configured instance with a single command. The deployment includes the Gateway, policy engine, and your chosen local LLM."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Cost-efficient billing:"})," Brev supports per-second billing, so you only pay for the time your GPU instance is actually running. Easily stop instances when not in use."]})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Available GPU Configurations"}),e.jsx(r,{title:"Brev GPU Instance Options",headers:["GPU","VRAM","vCPUs","RAM","Approx. $/hr","Best For"],rows:[["NVIDIA T4","16 GB","4","16 GB","~$0.50","7B parameter models, budget option"],["NVIDIA A10G","24 GB","8","32 GB","~$1.10","13B parameter models, balanced choice"],["NVIDIA A100 40GB","40 GB","12","48 GB","~$2.50","30B models, high throughput"],["NVIDIA A100 80GB","80 GB","12","96 GB","~$3.50","70B quantized models"],["NVIDIA H100","80 GB","16","128 GB","~$4.50","Maximum performance, latest architecture"]]}),e.jsx(a,{type:"info",title:"Pricing Comparison",children:e.jsx("p",{children:"Brev's pricing is competitive with major cloud providers and often cheaper for short-duration workloads due to per-second billing. For always-on deployments running 24/7, the monthly cost is comparable to AWS/GCP on-demand pricing. The primary value proposition is speed and simplicity, not raw cost savings. You trade infrastructure management time for slightly higher per-hour costs."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Brev vs. Traditional Cloud Providers"}),e.jsx(r,{title:"Brev vs. AWS/GCP for NemoClaw GPU Deployment",headers:["Factor","Brev","AWS/GCP/Azure"],rows:[["Time to running NemoClaw","~5 minutes","30-60 minutes"],["GPU quota","Instant access","Request required (1-3 days)"],["Driver installation","Pre-installed","Manual or extension-based"],["CUDA setup","Pre-installed","Manual installation"],["Pricing flexibility","Per-second billing","Per-second (varies by provider)"],["Instance variety","GPU-focused selection","Hundreds of instance types"],["Managed services (S3, RDS, etc.)","Not available","Full ecosystem"],["Custom networking (VPC, VPN)","Limited","Full control"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"When to Use Brev"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Brev is ideal when you want GPU-accelerated NemoClaw without infrastructure overhead. It is particularly well-suited for:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Rapid prototyping:"})," Testing NemoClaw with local inference before committing to a long-term cloud setup."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Teams without cloud expertise:"})," If your team does not have AWS/GCP/Azure experience, Brev eliminates the learning curve."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Ephemeral GPU needs:"})," Running local inference during business hours and shutting down overnight to save costs."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Demos and evaluations:"})," Spinning up a fully functional NemoClaw environment in minutes for stakeholder demonstrations."]})]}),e.jsx(n,{question:"What is the primary advantage of using Brev over AWS for a NemoClaw GPU deployment?",options:["Brev is always cheaper than AWS","Brev eliminates driver installation, quota requests, and manual setup -- reducing deployment time from 30-60 minutes to ~5 minutes","Brev provides more GPU types than AWS","Brev includes free LLM API access"],correctIndex:1,explanation:"Brev's main advantage is operational simplicity, not cost. It eliminates the multi-step process of requesting GPU quota, provisioning a VM, installing NVIDIA drivers, configuring CUDA, and setting up the inference stack. This reduces NemoClaw GPU deployment from 30-60 minutes of manual work to a single command completing in about 5 minutes."}),e.jsx(s,{references:[{title:"NVIDIA Brev Documentation",url:"https://docs.brev.dev/",type:"docs",description:"Official Brev documentation for GPU instance management."},{title:"Brev CLI Reference",url:"https://docs.brev.dev/cli",type:"docs",description:"Command reference for the Brev CLI tool."}]})]})}const me=Object.freeze(Object.defineProperty({__proto__:null,default:U},Symbol.toStringTag,{value:"Module"}));function T(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Deploying NemoClaw on Brev"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"This section provides a complete walkthrough for deploying NemoClaw on NVIDIA Brev using the integrated deployment command. The entire process -- from installing the CLI to having a running NemoClaw instance with local inference -- takes approximately five minutes."}),e.jsx(o,{title:"Full Brev Deployment Walkthrough",steps:[{title:"Install the Brev CLI",content:`Install the Brev command-line tool on your local machine:

# macOS
brew install brevdev/homebrew-brev/brev

# Linux
curl -fsSL https://raw.githubusercontent.com/brevdev/brev-cli/main/bin/install.sh | bash

Verify:
brev version`},{title:"Authenticate",content:`Log in to your Brev account:

brev login

This opens a browser window for authentication. If you do not have a Brev account, create one at brev.dev.`},{title:"Deploy NemoClaw",content:`Use the NemoClaw deploy command to create a fully configured instance:

nemoclaw deploy my-nemoclaw --gpu a100 --region us-east

This command:
1. Provisions an A100 GPU instance on Brev
2. Installs Node.js and system dependencies
3. Downloads and installs NemoClaw (Gateway + policy engine)
4. Installs Ollama and pulls a default LLM model
5. Starts all services

The entire process takes 3-5 minutes.`},{title:"Monitor deployment progress",content:`The CLI shows real-time deployment logs. You will see each phase:

[1/5] Provisioning A100 instance... done (45s)
[2/5] Installing system dependencies... done (30s)
[3/5] Installing NemoClaw... done (60s)
[4/5] Pulling LLM model... done (120s)
[5/5] Starting services... done (15s)

Deployment complete! Instance: my-nemoclaw`},{title:"Connect to the instance",content:`SSH into your Brev instance:

brev shell my-nemoclaw

This opens an SSH session to your instance. Brev handles key management and network routing automatically.`},{title:"Run onboarding",content:`Complete the NemoClaw onboarding to configure platform integration:

cd ~/nemoclaw
npx nemoclaw onboard

Select your LLM provider (choose "local/Ollama" to use the GPU), configure Slack/Discord tokens, and set the default policy mode.`},{title:"Verify the deployment",content:`npx nemoclaw status
nvidia-smi    # Verify GPU is being used

The status should show the Gateway, policy engine, and local LLM all running.`},{title:"Access the Control UI",content:`Forward the Control UI port through Brev:

brev port-forward my-nemoclaw --port 18789

Then open http://localhost:18789 in your browser.`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Deployment Options"}),e.jsx(t,{language:"bash",title:"NemoClaw Deploy Command Options",code:`# Basic deployment with A100
nemoclaw deploy my-instance --gpu a100

# Deploy with specific GPU type
nemoclaw deploy my-instance --gpu t4          # Budget: 7B models
nemoclaw deploy my-instance --gpu a10g        # Mid-range: 13B models
nemoclaw deploy my-instance --gpu a100        # High-end: 30B+ models
nemoclaw deploy my-instance --gpu a100-80gb   # Maximum: 70B models
nemoclaw deploy my-instance --gpu h100        # Latest gen: maximum throughput

# Deploy with a specific LLM model pre-loaded
nemoclaw deploy my-instance --gpu a10g --model codellama:13b

# Deploy without local inference (API-only, cheaper GPU-less instance)
nemoclaw deploy my-instance --no-gpu

# Deploy in a specific region
nemoclaw deploy my-instance --gpu a100 --region eu-west

# List available configurations
nemoclaw deploy --list-options`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Managing Your Deployment"}),e.jsx(t,{language:"bash",title:"Instance Management Commands",code:`# List your instances
brev ls

# Check instance status
brev status my-nemoclaw

# Stop the instance (stops billing)
brev stop my-nemoclaw

# Start a stopped instance
brev start my-nemoclaw

# SSH into the instance
brev shell my-nemoclaw

# Delete the instance permanently
brev delete my-nemoclaw

# View instance logs
brev logs my-nemoclaw`}),e.jsx(a,{type:"tip",title:"Stop When Not in Use",children:e.jsx("p",{children:"Brev bills per second of runtime. If you are using NemoClaw during business hours only, stop the instance overnight and on weekends. A stopped instance retains all data (your NemoClaw configuration, policies, and workspace) but incurs no compute charges. Only a small storage fee applies for the disk volume."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Customizing the Environment"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"After initial deployment, you can customize the NemoClaw environment just as you would on any Linux server. The Brev instance runs Ubuntu with full root access."}),e.jsx(t,{language:"bash",title:"Post-Deployment Customization",code:`# SSH into the instance
brev shell my-nemoclaw

# Pull additional LLM models
ollama pull mistral:7b-instruct
ollama pull codellama:34b-instruct-q4_K_M  # If using A100

# Edit NemoClaw configuration
nano ~/nemoclaw/openclaw.json

# Install additional tools
sudo apt install -y htop tmux

# Set up Tailscale for persistent access
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Configure custom policy rules
npx nemoclaw policy edit`}),e.jsx(i,{title:"Data Persistence on Delete",children:e.jsxs("p",{children:["When you delete a Brev instance with ",e.jsx("code",{children:"brev delete"}),", all data is permanently destroyed. Before deleting, export your NemoClaw configuration, policy rules, and any important workspace data. Use ",e.jsx("code",{children:"npx nemoclaw export"})," to create a portable backup of your configuration that can be imported into a new deployment."]})}),e.jsx(n,{question:"What happens to your NemoClaw data when you stop (not delete) a Brev instance?",options:["All data is deleted and must be reconfigured on restart","Data is preserved on the disk volume; compute billing stops","The instance continues running but stops accepting new sessions","Data is automatically backed up to cloud storage"],correctIndex:1,explanation:"Stopping a Brev instance halts compute billing while preserving all data on the disk volume. Your NemoClaw configuration, policies, workspace data, and installed LLM models remain intact. When you start the instance again, NemoClaw resumes exactly where it left off (assuming a systemd service is configured for auto-start)."}),e.jsx(s,{references:[{title:"Brev CLI Documentation",url:"https://docs.brev.dev/cli",type:"docs",description:"Complete reference for Brev CLI commands."},{title:"NemoClaw Deployment Guide",url:"https://docs.nemoclaw.dev/deployment/brev",type:"docs",description:"NemoClaw-specific Brev deployment documentation."}]})]})}const he=Object.freeze(Object.defineProperty({__proto__:null,default:T},Symbol.toStringTag,{value:"Module"}));function V(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Tesla A100 Configuration on Brev"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The NVIDIA A100 is the workhorse GPU for serious LLM inference. Available in 40 GB and 80 GB VRAM configurations on Brev, the A100 can run models from 7B to 70B parameters depending on quantization. This section covers optimal memory allocation, model selection for different VRAM sizes, and multi-GPU configuration for the largest models."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"A100 Variants"}),e.jsx(r,{title:"A100 Configurations on Brev",headers:["Variant","VRAM","Memory Bandwidth","FP16 TFLOPS","Best For"],rows:[["A100 40GB (PCIe)","40 GB HBM2e","1,555 GB/s","312","Medium models up to 30B quantized"],["A100 80GB (SXM)","80 GB HBM2e","2,039 GB/s","312","Large models up to 70B quantized"],["2x A100 80GB","160 GB total","2x 2,039 GB/s","624 combined","Unquantized 70B models, very large context"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Memory Allocation Strategy"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"VRAM must be shared between the model weights, the KV cache (which grows with context length), and inference computation overhead. Proper memory allocation ensures the model runs entirely in VRAM without falling back to CPU memory, which would dramatically reduce inference speed."}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Model weights:"})," The largest consumer. A 7B model in Q4 quantization uses about 4 GB. A 13B model uses about 8 GB. A 70B model in Q4 uses about 40 GB."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"KV cache:"})," Grows with context length and batch size. For a single user with 8K context, expect 1-4 GB depending on model architecture. For multiple concurrent sessions with 32K context, this can reach 8-16 GB."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Overhead:"})," CUDA runtime, inference engine buffers, and OS GPU memory reservation. Budget 2-4 GB for overhead."]})]}),e.jsx(r,{title:"Model Size vs. A100 VRAM",headers:["Model","Quantization","Weight Size","KV Cache (8K)","Total","Fits A100 40GB?","Fits A100 80GB?"],rows:[["Llama 3 8B","Q4_K_M","~5 GB","~2 GB","~9 GB","Yes","Yes"],["Llama 3 8B","FP16","~16 GB","~2 GB","~20 GB","Yes","Yes"],["CodeLlama 13B","Q4_K_M","~8 GB","~3 GB","~13 GB","Yes","Yes"],["Llama 3 70B","Q4_K_M","~40 GB","~6 GB","~48 GB","No","Yes"],["Llama 3 70B","FP16","~140 GB","~6 GB","~148 GB","No","No (need 2x)"]]}),e.jsx(t,{language:"bash",title:"Configuring Ollama for Optimal A100 Usage",code:`# On your Brev A100 instance:
brev shell my-nemoclaw

# Set Ollama to use maximum GPU memory
# By default, Ollama reserves some VRAM headroom
export OLLAMA_GPU_MEMORY_FRACTION=0.9

# For A100 80GB: run a 70B quantized model
ollama pull llama3:70b-instruct-q4_K_M

# Verify model is loaded entirely in VRAM
ollama run llama3:70b-instruct-q4_K_M "Hello"
# Then check nvidia-smi in another terminal:
nvidia-smi
# Memory-Usage should show ~48 GB / 80 GB

# For A100 40GB: 13B unquantized or 30B quantized
ollama pull codellama:34b-instruct-q4_K_M

# Configure NemoClaw to use the local model
cat > ~/nemoclaw/llm-config.json << 'EOF'
{
  "provider": "ollama",
  "baseUrl": "http://localhost:11434",
  "model": "llama3:70b-instruct-q4_K_M",
  "options": {
    "num_ctx": 8192,
    "num_gpu": 99
  }
}
EOF`}),e.jsx(a,{type:"tip",title:"Context Length vs. VRAM",children:e.jsxs("p",{children:["Increasing the context window (",e.jsx("code",{children:"num_ctx"}),") consumes additional VRAM for the KV cache. On an A100 80GB with a 70B Q4 model, you can comfortably use 8192 tokens of context. Pushing to 16384 tokens may cause VRAM pressure, requiring a smaller model or lower quantization. Monitor ",e.jsx("code",{children:"nvidia-smi"})," during peak usage to ensure the model stays fully in VRAM."]})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Multi-GPU Configuration"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"For models that exceed a single GPU's VRAM (like unquantized 70B models), Brev supports multi-GPU instances. Inference frameworks like vLLM use tensor parallelism to shard the model across GPUs, where each GPU holds a portion of the model weights and they communicate over NVLink."}),e.jsx(t,{language:"bash",title:"Multi-GPU Inference with vLLM",code:`# Deploy a multi-GPU instance on Brev
nemoclaw deploy my-multi-gpu --gpu a100-80gb --gpu-count 2

# vLLM automatically uses tensor parallelism
pip install vllm

# Start vLLM with tensor parallelism across 2 GPUs
python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3-70B-Instruct \\
  --tensor-parallel-size 2 \\
  --host 0.0.0.0 \\
  --port 8000 \\
  --max-model-len 8192

# Configure NemoClaw to use vLLM (OpenAI-compatible API)
# In openclaw.json:
# {
#   "llm": {
#     "provider": "openai-compatible",
#     "baseUrl": "http://localhost:8000/v1",
#     "model": "meta-llama/Llama-3-70B-Instruct",
#     "apiKey": "not-needed"
#   }
# }`}),e.jsx(i,{title:"Multi-GPU Cost",children:e.jsx("p",{children:"Multi-GPU instances double (or more) the per-hour cost. Two A100 80GB GPUs on Brev costs approximately $7/hour or $5,000+/month if run continuously. Use multi-GPU only when your model genuinely requires it. In most cases, a well-quantized model on a single A100 80GB provides better cost-efficiency than an unquantized model on multiple GPUs with marginally better output quality."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Performance Tuning"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Use Q4_K_M quantization:"})," Offers the best balance of quality and memory efficiency. Quality degradation compared to FP16 is minimal for coding tasks."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Set appropriate context length:"})," Do not default to the model's maximum context. If your NemoClaw sessions rarely exceed 4K tokens, set",e.jsx("code",{children:"num_ctx: 4096"})," to save VRAM for the KV cache."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Monitor GPU utilization:"})," Use",e.jsx("code",{children:" watch -n 1 nvidia-smi"})," during active sessions. GPU utilization should stay above 50% during inference. Low utilization may indicate a CPU bottleneck in the Gateway or network latency in the inference pipeline."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Consider vLLM for high throughput:"})," If NemoClaw serves many concurrent sessions, vLLM's continuous batching delivers significantly higher throughput than Ollama. The tradeoff is more complex setup."]})]}),e.jsx(n,{question:"You have an A100 40GB on Brev and want to run a coding-focused LLM for NemoClaw. Which model configuration fits within the VRAM budget while maximizing capability?",options:["Llama 3 70B FP16 (~140 GB) -- highest quality","Llama 3 70B Q4_K_M (~40 GB weights + KV cache) -- too tight","CodeLlama 34B Q4_K_M (~20 GB) -- fits well with room for KV cache","Llama 3 8B FP16 (~16 GB) -- too small to be useful"],correctIndex:2,explanation:"CodeLlama 34B in Q4_K_M quantization uses approximately 20 GB of VRAM for weights, leaving ~16 GB for KV cache, overhead, and computation on the 40 GB A100. The 70B model at Q4 uses ~40 GB for weights alone, leaving almost no room for the KV cache. The 34B model provides strong coding capabilities while fitting comfortably."}),e.jsx(s,{references:[{title:"NVIDIA A100 Specifications",url:"https://www.nvidia.com/en-us/data-center/a100/",type:"docs",description:"Official A100 product page with detailed specifications."},{title:"vLLM Documentation",url:"https://docs.vllm.ai/",type:"docs",description:"High-throughput LLM inference engine with tensor parallelism support."}]})]})}const pe=Object.freeze(Object.defineProperty({__proto__:null,default:V},Symbol.toStringTag,{value:"Module"}));function B(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Persistent vs. Ephemeral Deployments"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When deploying NemoClaw on Brev (or any GPU cloud platform), you face a fundamental deployment strategy decision: should the instance run continuously (persistent) or spin up and down on demand (ephemeral)? This choice has significant implications for cost, availability, and operational complexity. Understanding the tradeoffs helps you optimize for your team's specific requirements and budget."}),e.jsx(l,{term:"Persistent Deployment",definition:"An always-running instance that stays powered on 24/7, providing continuous availability for NemoClaw agent sessions. The instance maintains all state, including active sessions, loaded LLM models, and conversation histories. It is the simplest operational model but the most expensive.",example:"A Brev A100 instance running NemoClaw 24/7, responding to Slack messages at any time of day. Monthly cost: ~$2,500 for an A100 or ~$360 for a T4.",seeAlso:["Ephemeral Deployment","Auto-Scaling","Cost Optimization"]}),e.jsx(l,{term:"Ephemeral Deployment",definition:"An on-demand instance that is started when needed and stopped when idle. The instance preserves its disk data (configuration, policies, models) when stopped but loses in-memory state (active sessions, loaded models). It requires a startup period each time it is activated.",example:"A Brev A100 instance that runs from 8 AM to 7 PM on weekdays only. NemoClaw is unavailable outside these hours, but monthly cost drops from ~$2,500 to ~$800.",seeAlso:["Persistent Deployment","Cold Start","Auto-Stop"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Cost Comparison"}),e.jsx(r,{title:"Monthly Cost: Persistent vs. Ephemeral (A100 80GB)",headers:["Schedule","Hours/Month","Monthly Cost","Savings vs. 24/7"],rows:[["24/7 (persistent)","730 hrs","~$2,555","0%"],["Business hours (Mon-Fri, 8AM-7PM)","~240 hrs","~$840","67%"],["Extended hours (Mon-Fri, 7AM-11PM)","~352 hrs","~$1,232","52%"],["On-demand (manual start/stop, ~4 hrs/day)","~120 hrs","~$420","84%"],["Weekday only 24/5","~520 hrs","~$1,820","29%"]]}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The savings are dramatic. A business-hours-only schedule reduces A100 costs by 67%, from $2,555 to $840 per month. For a T4 instance, the same schedule reduces costs from $365 to $120 per month. The question is whether the startup delay and offline periods are acceptable for your team."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Startup Time (Cold Start)"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When an ephemeral instance starts, several things must happen before NemoClaw is available to users:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Instance boot:"})," 30-60 seconds for the OS to start and systemd services to initialize."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"NemoClaw startup:"})," 5-15 seconds for the Gateway and policy engine to load and establish platform connections."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"LLM model loading:"})," 30 seconds to 5 minutes depending on model size. A 7B model loads in ~30 seconds. A 70B model can take 3-5 minutes to load into VRAM. This is the biggest bottleneck."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Total cold start:"})," 1-6 minutes depending on configuration. During this time, NemoClaw is unavailable."]})]}),e.jsx(a,{type:"tip",title:"Reducing Cold Start Time",children:e.jsx("p",{children:"To minimize cold start delays: (1) Use a smaller, faster-loading model -- 7B models load in 30 seconds vs. 3-5 minutes for 70B. (2) Configure NemoClaw to start responding with API-based inference immediately while the local model loads in the background. (3) Use Brev's instance warm pool feature (if available) to keep instances in a pre-warmed state ready for rapid activation."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Implementing an Ephemeral Schedule"}),e.jsx(t,{language:"bash",title:"Automated Start/Stop Schedule",code:`# Option 1: Brev scheduled actions (if supported)
brev schedule my-nemoclaw --start "0 8 * * 1-5" --stop "0 19 * * 1-5"

# Option 2: Cron-based schedule from a separate always-on machine
# (e.g., a free-tier Oracle Cloud ARM instance)

# start-nemoclaw.sh
#!/bin/bash
brev start my-nemoclaw
echo "$(date): Started NemoClaw instance" >> /var/log/nemoclaw-schedule.log

# stop-nemoclaw.sh
#!/bin/bash
brev stop my-nemoclaw
echo "$(date): Stopped NemoClaw instance" >> /var/log/nemoclaw-schedule.log

# Crontab entries:
# 0 8 * * 1-5 /home/user/start-nemoclaw.sh    # Mon-Fri 8 AM
# 0 19 * * 1-5 /home/user/stop-nemoclaw.sh     # Mon-Fri 7 PM

# Option 3: API-based triggering
# Start NemoClaw when the first Slack message of the day arrives
# Requires a lightweight always-on proxy that forwards the message
# and triggers instance startup`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Hybrid Approach: API Fallback"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The most sophisticated approach combines ephemeral GPU instances with API-based fallback. NemoClaw runs on a cheap always-on CPU instance (or Oracle Cloud free tier) using API-based inference. When heavy workloads are detected or during business hours, a GPU instance spins up and NemoClaw switches to local inference for better performance and cost efficiency at high volumes."}),e.jsx(t,{language:"json",title:"Hybrid LLM Configuration (openclaw.json)",code:`{
  "llm": {
    "primary": {
      "provider": "ollama",
      "baseUrl": "http://localhost:11434",
      "model": "llama3:70b-instruct-q4_K_M"
    },
    "fallback": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-20250514",
      "apiKey": "env:ANTHROPIC_API_KEY"
    },
    "strategy": "prefer-local-with-api-fallback"
  }
}`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Decision Framework"}),e.jsx(r,{title:"When to Use Each Deployment Model",headers:["Factor","Persistent","Ephemeral"],rows:[["Team needs 24/7 agent access","Required","Not suitable"],["Budget is the primary concern","Expensive","Recommended (67%+ savings)"],["Cold start delay is acceptable","N/A","Must be OK with 1-6 min startup"],["Agent monitoring/incident response","Required","Not suitable"],["Development/testing only","Overkill","Recommended"],["High-volume production","Recommended","Possible with schedule"],["Compliance requires audit trail","Simpler to maintain","Gaps during offline periods"]]}),e.jsx(i,{title:"Session Loss on Stop",children:e.jsx("p",{children:"When an ephemeral instance is stopped, all in-memory session state is lost. Active conversations in Slack or Discord will lose their context. When the instance restarts, NemoClaw starts fresh sessions. If your team relies on long-running agent conversations that span hours or days, ephemeral deployments will cause disruptive context loss at each stop/start cycle."})}),e.jsx(n,{question:"A team uses NemoClaw with an A100 on Brev during business hours (Mon-Fri, 8 AM to 7 PM). Approximately how much do they save per month compared to running 24/7?",options:["About $200/month (10% savings)","About $850/month (33% savings)","About $1,715/month (67% savings)","About $2,300/month (90% savings)"],correctIndex:2,explanation:"Business hours (11 hours/day, 5 days/week) is about 240 hours/month out of 730 total hours. At ~$3.50/hr for an A100 80GB, 24/7 costs ~$2,555 and business hours costs ~$840, saving approximately $1,715 per month -- a 67% reduction."}),e.jsx(s,{references:[{title:"Brev Instance Management",url:"https://docs.brev.dev/instances",type:"docs",description:"Managing Brev instances including start, stop, and scheduling."},{title:"GPU Cost Optimization Strategies",url:"https://docs.brev.dev/cost-optimization",type:"docs",description:"Best practices for minimizing GPU cloud costs."}]})]})}const ge=Object.freeze(Object.defineProperty({__proto__:null,default:B},Symbol.toStringTag,{value:"Module"}));function D(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"NemoClaw on Proxmox VE Homelab"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Running NemoClaw on a self-hosted homelab gives you complete control over your infrastructure, eliminates recurring cloud costs, and keeps all data within your physical premises. Proxmox Virtual Environment (VE) is an open-source virtualization platform that makes it straightforward to create and manage VMs on commodity hardware. This section covers Proxmox setup, VM creation, and GPU passthrough for local inference on your own hardware."}),e.jsx(l,{term:"Proxmox VE",definition:"An open-source server virtualization platform based on Debian Linux. It combines KVM for virtual machine management and LXC for lightweight containers into a single web-based management interface. Proxmox VE supports live migration, storage clustering, software-defined networking, and PCI passthrough for GPU devices.",example:"A refurbished Dell PowerEdge server running Proxmox VE, hosting a Ubuntu 22.04 VM with 8 vCPUs, 32 GB RAM, and a passed-through NVIDIA RTX 4090 for local LLM inference with NemoClaw.",seeAlso:["KVM","GPU Passthrough","Homelab"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Hardware Requirements"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"CPU:"})," Modern x86 CPU with VT-x/VT-d (Intel) or AMD-V/IOMMU (AMD) support. At least 4 physical cores recommended. AMD Ryzen 5/7 or Intel i5/i7 (12th gen+) are excellent choices."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"RAM:"})," 32 GB minimum (16 GB for the NemoClaw VM, 16 GB for Proxmox host and other VMs). 64 GB recommended if running multiple VMs."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Storage:"})," 500 GB NVMe SSD for VM storage. Proxmox uses local storage by default, and NVMe provides the IO performance needed for responsive VMs."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"GPU (optional):"})," NVIDIA RTX 3090 (24 GB VRAM), RTX 4090 (24 GB VRAM), or used Tesla P40 (24 GB VRAM) for local inference. Consumer GPUs work well for inference despite being marketed for gaming."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Network:"})," Gigabit Ethernet minimum. The NemoClaw VM needs reliable outbound internet for API calls and platform integration."]})]}),e.jsx(a,{type:"tip",title:"Budget Homelab Hardware",children:e.jsx("p",{children:"A refurbished Dell OptiPlex or HP EliteDesk mini PC with an AMD Ryzen 5, 32 GB RAM, and 500 GB NVMe can be found for $300-500 and runs NemoClaw without GPU inference perfectly. For GPU inference, adding a used NVIDIA Tesla P40 ($150-200 on eBay) provides 24 GB VRAM at a fraction of cloud GPU costs. The P40 lacks display output but is excellent for headless inference in a server."})}),e.jsx(o,{title:"Set Up Proxmox and Create a NemoClaw VM",steps:[{title:"Install Proxmox VE",content:"Download the Proxmox VE ISO from proxmox.com/downloads. Write it to a USB drive with balenaEtcher or dd. Boot from the USB and follow the installer. Proxmox installs Debian Linux with the Proxmox management layer automatically."},{title:"Access the Proxmox web interface",content:"After installation, access the management interface at https://<proxmox-ip>:8006 in your browser. Log in with the root credentials set during installation."},{title:"Upload the Ubuntu ISO",content:"In the Proxmox UI, go to your storage (local) > ISO Images > Upload. Upload the Ubuntu 22.04 server ISO."},{title:"Create a VM",content:`Click Create VM in the top right. Configure:

- General: VM ID (e.g., 100), Name: nemoclaw-prod
- OS: Select the Ubuntu 22.04 ISO
- System: BIOS: OVMF (UEFI), Machine: q35 (required for GPU passthrough)
- Disks: 50 GB on local-lvm, VirtIO SCSI
- CPU: 8 cores, Type: host (exposes real CPU features to the VM)
- Memory: 16384 MB (16 GB)
- Network: VirtIO, Bridge: vmbr0`},{title:"Install Ubuntu in the VM",content:"Start the VM and open the console. Follow the standard Ubuntu Server 22.04 installation. Select OpenSSH server when prompted for software. After installation, reboot and remove the ISO from the VM settings."},{title:"Install NemoClaw",content:`SSH into the VM and follow the standard NemoClaw installation:

ssh ubuntu@<vm-ip>
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential
curl -fsSL https://install.nemoclaw.dev | bash
cd ~/nemoclaw && npx nemoclaw onboard`}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"GPU Passthrough"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"GPU passthrough allows a VM to have direct, exclusive access to a physical GPU installed in the Proxmox host. The GPU is fully dedicated to the VM, providing near-native performance for LLM inference. Setting up passthrough requires IOMMU support in the CPU and BIOS, plus some Proxmox configuration."}),e.jsx(o,{title:"Configure GPU Passthrough",steps:[{title:"Enable IOMMU in BIOS",content:"Enter your server's BIOS/UEFI settings. For Intel: enable VT-d. For AMD: enable IOMMU/AMD-Vi. Save and reboot into Proxmox."},{title:"Enable IOMMU in Proxmox",content:`Edit the GRUB configuration:

nano /etc/default/grub

For Intel, add to GRUB_CMDLINE_LINUX_DEFAULT:
intel_iommu=on iommu=pt

For AMD:
amd_iommu=on iommu=pt

Update GRUB:
update-grub
reboot`},{title:"Load VFIO modules",content:`Add VFIO modules to load on boot:

echo -e "vfio\\nvfio_iommu_type1\\nvfio_pci\\nvfio_virqfd" >> /etc/modules

Blacklist the host NVIDIA driver to prevent the host from claiming the GPU:

echo -e "blacklist nouveau\\nblacklist nvidia\\nblacklist nvidia_drm\\nblacklist nvidia_modeset" > /etc/modprobe.d/blacklist-nvidia.conf

update-initramfs -u
reboot`},{title:"Find the GPU PCI address",content:`lspci -nn | grep NVIDIA

Note the PCI address (e.g., 01:00.0) and device IDs.`},{title:"Add GPU to the VM",content:'In the Proxmox UI, select your NemoClaw VM > Hardware > Add > PCI Device. Select your NVIDIA GPU. Check "All Functions" and "Primary GPU" if it is the only GPU in the VM. Also check "PCI-Express" for best performance.'},{title:"Install NVIDIA drivers in the VM",content:`Start the VM and SSH in:

sudo apt install -y ubuntu-drivers-common
sudo ubuntu-drivers autoinstall
sudo reboot

Verify:
nvidia-smi`}]}),e.jsx(i,{title:"GPU Passthrough Complexity",children:e.jsx("p",{children:"GPU passthrough can be finicky. Common issues include IOMMU group conflicts (where the GPU shares a group with other devices), ACS override patches being needed, and NVIDIA drivers detecting they are running in a VM and refusing to load (Code 43 error, mostly a Windows issue). On Linux VMs with recent NVIDIA drivers, passthrough generally works smoothly. Consult the Proxmox Wiki if you encounter issues."})}),e.jsx(t,{language:"bash",title:"Verify GPU Passthrough in the VM",code:`# Inside the NemoClaw VM:
nvidia-smi

# Expected output:
# +-------------------------------+
# | NVIDIA-SMI 535.xx.xx          |
# | Driver Version: 535.xx.xx     |
# | CUDA Version: 12.x            |
# |-------------------------------+
# | GPU  Name       | Memory-Usage |
# | 0    RTX 4090   | 0MiB / 24GB  |
# +-------------------------------+

# Install Ollama and test inference
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull codellama:13b-instruct-q4_K_M
ollama run codellama:13b-instruct-q4_K_M "Write a Python hello world"

# Configure NemoClaw to use local inference
# Edit openclaw.json with the Ollama endpoint`}),e.jsx(n,{question:"What BIOS/UEFI feature must be enabled for GPU passthrough to work in Proxmox?",options:["Secure Boot","TPM 2.0","IOMMU (VT-d for Intel, AMD-Vi for AMD)","Hyper-Threading"],correctIndex:2,explanation:"IOMMU (Input-Output Memory Management Unit) is required for PCI passthrough. It allows the hypervisor to securely assign physical PCI devices (like GPUs) to individual VMs. Intel calls this VT-d and AMD calls it AMD-Vi. Without IOMMU, the VM cannot have direct, isolated access to the GPU hardware."}),e.jsx(s,{references:[{title:"Proxmox VE Documentation",url:"https://pve.proxmox.com/wiki/Main_Page",type:"docs",description:"Official Proxmox VE wiki with installation and configuration guides."},{title:"Proxmox PCI Passthrough",url:"https://pve.proxmox.com/wiki/PCI_Passthrough",type:"docs",description:"Detailed guide for GPU and PCI device passthrough in Proxmox VE."}]})]})}const ye=Object.freeze(Object.defineProperty({__proto__:null,default:D},Symbol.toStringTag,{value:"Module"}));function z(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Tailscale and WireGuard for Home NemoClaw Access"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"A self-hosted NemoClaw instance behind a home router or office firewall needs a secure way for remote team members to access it. Opening ports on your home router is dangerous and unreliable. Instead, VPN solutions like Tailscale and WireGuard create encrypted tunnels that let you access your NemoClaw instance from anywhere -- as if you were on the same local network -- without exposing any ports to the public internet."}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Tailscale: The Easy Path"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"Tailscale is the recommended solution for most self-hosted NemoClaw deployments. It uses WireGuard under the hood but handles all the complexity of key management, NAT traversal, and peer discovery automatically. Setup takes less than five minutes and requires no network configuration changes on your router."}),e.jsx(o,{title:"Set Up Tailscale for Home NemoClaw",steps:[{title:"Install Tailscale on the NemoClaw machine",content:`On the Proxmox VM (or bare metal machine) running NemoClaw:

curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

A URL will be printed. Open it in a browser to authenticate with your identity provider (Google, GitHub, Microsoft, etc.).`},{title:"Note the Tailscale IP",content:`After authentication:

tailscale ip -4
# Output: 100.64.x.y

This is the stable Tailscale IP for your NemoClaw instance.`},{title:"Install Tailscale on your devices",content:`Install Tailscale on every device that needs to access NemoClaw:
- macOS/Windows/Linux: Download from tailscale.com/download
- iOS/Android: Install from App Store / Play Store

Sign in with the same identity provider.`},{title:"Access NemoClaw remotely",content:`From any device on your Tailscale network:

# SSH access
ssh ubuntu@100.64.x.y

# Control UI access
# Open http://100.64.x.y:18789 in your browser

This works from anywhere -- home, office, coffee shop, phone tethering.`},{title:"Enable Tailscale SSH (optional)",content:`Tailscale can replace OpenSSH entirely, using your identity provider for authentication:

sudo tailscale up --ssh

Now team members can SSH in using their Tailscale identity without managing SSH keys.`},{title:"Share with team members",content:`Add team members to your Tailscale network (Tailnet). On the free plan, up to 3 users and 100 devices. For teams, Tailscale Teams plan provides user management and ACLs.

Each team member installs Tailscale, joins your Tailnet, and can immediately access the NemoClaw instance via its Tailscale IP.`}]}),e.jsx(a,{type:"tip",title:"Tailscale ACLs for NemoClaw",children:e.jsx("p",{children:"On Tailscale's paid plans, you can define ACLs (Access Control Lists) that restrict which team members can access which devices and ports. For example, you could allow all team members to reach the NemoClaw Control UI (port 18789) but restrict SSH access (port 22) to administrators only. ACLs are defined as JSON in the Tailscale admin console."})}),e.jsx(t,{language:"json",title:"Example Tailscale ACL for NemoClaw",code:`{
  "acls": [
    {
      "action": "accept",
      "src": ["group:admins"],
      "dst": ["tag:nemoclaw:*"]
    },
    {
      "action": "accept",
      "src": ["group:developers"],
      "dst": ["tag:nemoclaw:18789"]
    }
  ],
  "tagOwners": {
    "tag:nemoclaw": ["group:admins"]
  },
  "groups": {
    "group:admins": ["admin@example.com"],
    "group:developers": ["dev1@example.com", "dev2@example.com"]
  }
}`}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"WireGuard: The Manual Path"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"If you prefer full control over your VPN configuration, or if your organization requires self-hosted VPN infrastructure, WireGuard can be configured manually. WireGuard is a modern, fast, and cryptographically sound VPN protocol built into the Linux kernel."}),e.jsx(o,{title:"Manual WireGuard Setup",steps:[{title:"Install WireGuard on the NemoClaw server",content:`sudo apt update && sudo apt install -y wireguard

Generate server keys:
wg genkey | sudo tee /etc/wireguard/server_private.key | wg pubkey | sudo tee /etc/wireguard/server_public.key
sudo chmod 600 /etc/wireguard/server_private.key`},{title:"Configure the server",content:`Create /etc/wireguard/wg0.conf:

[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <server-private-key>
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT

[Peer]
# Client 1 (your laptop)
PublicKey = <client-public-key>
AllowedIPs = 10.0.0.2/32`},{title:"Forward a port on your router",content:"WireGuard requires one UDP port to be forwarded from your router to the NemoClaw server. Forward UDP port 51820 to the server's local IP address. This is the only port exposure required."},{title:"Start WireGuard",content:`sudo wg-quick up wg0
sudo systemctl enable wg-quick@wg0

Verify:
sudo wg show`},{title:"Configure the client",content:`On your laptop/device, install WireGuard and create a config:

[Interface]
Address = 10.0.0.2/32
PrivateKey = <client-private-key>
DNS = 1.1.1.1

[Peer]
PublicKey = <server-public-key>
Endpoint = <your-home-public-ip>:51820
AllowedIPs = 10.0.0.0/24
PersistentKeepalive = 25`},{title:"Connect and test",content:`Activate the WireGuard tunnel on your client:

sudo wg-quick up wg0
ping 10.0.0.1
ssh ubuntu@10.0.0.1

Access the Control UI at http://10.0.0.1:18789`}]}),e.jsx(i,{title:"Dynamic Home IP Addresses",children:e.jsx("p",{children:"Most residential internet connections have dynamic public IP addresses that change periodically. If your home IP changes, your WireGuard clients will lose connectivity until updated. Use a dynamic DNS service (like duckdns.org or afraid.org) to maintain a stable hostname that always resolves to your current IP. Configure the WireGuard client Endpoint to use the hostname instead of a raw IP. Tailscale avoids this problem entirely through its coordination server."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Comparison"}),e.jsx(r,{title:"Tailscale vs. Manual WireGuard",headers:["Factor","Tailscale","WireGuard (Manual)"],rows:[["Setup time","5 minutes","30-60 minutes"],["Router port forwarding","Not required (NAT traversal)","Required (UDP 51820)"],["Key management","Automatic","Manual per peer"],["Dynamic IP handling","Automatic","Requires DDNS setup"],["Adding team members","Install and sign in","Generate keys, update server config, distribute"],["ACL management","Web-based admin console","Manual iptables/nftables rules"],["Self-hosted option","Headscale (OSS control server)","Fully self-hosted by design"],["Cost","Free for 3 users / paid for teams","Free (open source)"],["Data sovereignty","Metadata through Tailscale servers","Fully self-contained"]]}),e.jsx(a,{type:"info",title:"Headscale: Self-Hosted Tailscale",children:e.jsx("p",{children:"If you want Tailscale's ease of use but need full self-hosting (no external coordination server), consider Headscale -- an open-source, self-hosted implementation of the Tailscale coordination server. It provides the same client experience but runs entirely on your infrastructure. This satisfies data sovereignty requirements while retaining Tailscale's NAT traversal and key management benefits."})}),e.jsx(n,{question:"What is the main advantage of Tailscale over manual WireGuard for accessing a home-hosted NemoClaw?",options:["Tailscale is faster than WireGuard","Tailscale handles NAT traversal automatically, eliminating the need for router port forwarding","Tailscale provides stronger encryption","Tailscale works without internet access"],correctIndex:1,explanation:"Tailscale's biggest practical advantage is automatic NAT traversal. It establishes direct peer-to-peer connections without requiring any port forwarding on your home router. Manual WireGuard requires you to forward UDP port 51820, which can be complex on some routers and fails entirely if you cannot modify router settings (e.g., double NAT situations)."}),e.jsx(s,{references:[{title:"Tailscale Documentation",url:"https://tailscale.com/kb/",type:"docs",description:"Comprehensive Tailscale knowledge base."},{title:"WireGuard Documentation",url:"https://www.wireguard.com/",type:"docs",description:"Official WireGuard protocol documentation and configuration guide."},{title:"Headscale",url:"https://github.com/juanfont/headscale",type:"github",description:"Self-hosted, open-source Tailscale control server."}]})]})}const fe=Object.freeze(Object.defineProperty({__proto__:null,default:z},Symbol.toStringTag,{value:"Module"}));function L(){return e.jsxs("div",{className:"space-y-6",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 dark:text-white",children:"Multi-Node NemoClaw Deployments"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"As your organization grows, a single NemoClaw instance may not be sufficient. You might need separate instances for different teams, projects, or security boundaries. You may also want redundancy so that a single machine failure does not take down agent access for the entire organization. This section covers running multiple NemoClaw instances, load balancing strategies, and shared policy management across nodes."}),e.jsx(l,{term:"Multi-Node Deployment",definition:"A NemoClaw architecture where multiple independent instances run on separate machines (physical or virtual), each handling a subset of agent sessions. Unlike horizontal scaling of a single service, each NemoClaw node is a complete, self-contained deployment with its own Gateway, policy engine, and optional local LLM.",example:"An organization with three NemoClaw nodes: one for the backend engineering team, one for the frontend team, and one for the DevOps team. Each has its own policies and agent configurations, but they share a common base policy set managed through a central git repository.",seeAlso:["Load Balancing","Policy Management","High Availability"]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"When You Need Multiple Instances"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Team isolation:"})," Different teams need different agent configurations, policy rules, or LLM providers. A security team might require stricter policies than a documentation team."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Scale limits:"})," A single NemoClaw instance comfortably handles 20-50 concurrent agent sessions. Beyond that, policy evaluation latency may increase, and the Gateway's event loop can become a bottleneck."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Geographic distribution:"})," Teams in different regions may benefit from NemoClaw instances closer to their location, reducing latency for the Control UI and SSH access."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Redundancy:"})," If one instance goes down (hardware failure, host maintenance), other instances continue serving their assigned teams."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Mixed LLM backends:"})," One instance uses Anthropic Claude for general development, another uses a local LLM for sensitive codebases, and a third uses OpenAI for teams that prefer it."]})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Architecture Patterns"}),e.jsx(r,{title:"Multi-Node Architecture Options",headers:["Pattern","Description","Complexity","Best For"],rows:[["Independent instances","Each node fully isolated with its own config and policies","Low","Team isolation, different requirements"],["Shared policy repo","Independent instances pulling policies from a shared git repo","Medium","Consistent policies across teams"],["Load-balanced cluster","Multiple nodes behind a load balancer serving the same team","High","Scale and redundancy"]]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Shared Policy Management"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"The most common multi-node pattern is independent instances with shared policies. Each NemoClaw instance runs autonomously, but they all pull their policy definitions from a central git repository. This ensures consistent security rules across the organization while allowing per-instance customization through policy layering."}),e.jsx(t,{language:"bash",title:"Shared Policy Repository Setup",code:`# Create a central policy repository
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
}`}),e.jsx(o,{title:"Deploy Multiple NemoClaw Instances",steps:[{title:"Plan your topology",content:"Decide how many instances you need and how they map to teams. A common starting point is one instance per 10-20 developers or one per team with distinct security requirements."},{title:"Provision the infrastructure",content:"Create VMs for each instance. They can be on different cloud providers, different Proxmox hosts, or a mix. Each needs the standard NemoClaw requirements (4+ vCPU, 8-16 GB RAM, 30 GB storage)."},{title:"Create the shared policy repository",content:"Set up a git repository with base policies and per-team overrides. The base policies define organization-wide safety rules. Each team's override directory can relax or tighten specific rules."},{title:"Install NemoClaw on each instance",content:"Follow the standard installation on each VM. During onboarding, configure the policy source to point at the shared repository."},{title:"Configure Slack/Discord channel routing",content:"Each NemoClaw instance connects to specific Slack channels or Discord channels. Configure each instance's platform integration to respond only in its assigned channels, preventing conflicts."},{title:"Set up monitoring",content:"Deploy a centralized monitoring solution (Prometheus + Grafana, or a cloud monitoring service) that collects metrics from all instances. This gives you a single dashboard for the health of your entire NemoClaw fleet."}]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Load Balancing Considerations"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"True load balancing across NemoClaw instances is complex because the Gateway maintains session state in memory. A naive round-robin load balancer would route messages from the same Slack conversation to different instances, breaking session continuity. If you need load-balanced redundancy, you have two options:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300",children:[e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"Sticky sessions (session affinity):"})," Configure the load balancer to route all messages from the same user/channel to the same NemoClaw instance. This preserves session state but means a failed instance loses all its sessions."]}),e.jsxs("li",{children:[e.jsx("span",{className:"font-semibold",children:"External session store:"})," Move session state out of the Gateway's memory into Redis or a similar external store. All instances share the same session data, allowing any instance to handle any message. This is the most robust approach but requires additional infrastructure and NemoClaw configuration."]})]}),e.jsx(t,{language:"yaml",title:"NGINX Configuration for Sticky Sessions",code:`# /etc/nginx/conf.d/nemoclaw-lb.conf
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
}`}),e.jsx(i,{title:"Load Balancing Is Often Unnecessary",children:e.jsx("p",{children:"Before implementing a load-balanced cluster, verify that you actually need one. A single NemoClaw instance on an 8 vCPU machine handles 20-50 concurrent sessions comfortably. Most organizations can serve their entire engineering team from a single instance. Multi-node deployments for team isolation are simpler and more practical than load-balanced clusters for most use cases."})}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8",children:"Policy Synchronization"}),e.jsx("p",{className:"text-gray-700 dark:text-gray-300 leading-relaxed",children:"When managing policies across multiple instances, consistency is critical. A change to a base safety rule should propagate to all instances promptly. NemoClaw supports automatic policy synchronization from a git repository with configurable intervals."}),e.jsx(t,{language:"bash",title:"Policy Sync Workflow",code:`# Developer pushes a policy change to the shared repo:
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

# Compare across instances to ensure consistency`}),e.jsx(a,{type:"info",title:"Policy Testing Before Deployment",children:e.jsxs("p",{children:["When multiple instances share a policy repository, a broken policy update affects all instances simultaneously. Always test policy changes in audit mode on a single staging instance before merging to the main branch. Use the NemoClaw policy test command to dry-run rules against sample actions: ",e.jsx("code",{children:'npx nemoclaw policy test --file new-rule.yaml --action "shell.execute" --command "rm -rf /"'})]})}),e.jsx(n,{question:"What is the primary challenge when load-balancing multiple NemoClaw instances behind a reverse proxy?",options:["NemoClaw cannot run on multiple machines simultaneously","The Gateway stores session state in memory, so requests from the same session must go to the same instance","NGINX cannot proxy WebSocket connections","NemoClaw instances cannot share the same Slack workspace"],correctIndex:1,explanation:"The OpenClaw Gateway maintains session state (conversation history, active tool calls) in memory. If a load balancer routes messages from the same conversation to different instances, each instance has an incomplete view of the session. This requires either sticky sessions (routing all messages from a user to the same instance) or an external session store shared across instances."}),e.jsx(s,{references:[{title:"NGINX Load Balancing Guide",url:"https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/",type:"docs",description:"Configuring NGINX as an HTTP/WebSocket load balancer."},{title:"NemoClaw Policy Management",url:"https://docs.nemoclaw.dev/policies",type:"docs",description:"Managing and synchronizing NemoClaw policy rules across deployments."}]})]})}const xe=Object.freeze(Object.defineProperty({__proto__:null,default:L},Symbol.toStringTag,{value:"Module"}));export{pe as A,ge as B,ye as C,fe as D,xe as E,q as a,W as b,E as c,F as d,$ as e,K as f,Y as g,X as h,Q as i,J as j,Z as k,ee as l,te as m,ae as n,ne as o,se as p,oe as q,ie as r,H as s,re as t,le as u,ce as v,de as w,ue as x,me as y,he as z};
