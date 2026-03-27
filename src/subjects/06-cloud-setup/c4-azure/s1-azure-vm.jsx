import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function AzureVM() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Creating an Azure VM for NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Microsoft Azure provides a comprehensive cloud computing platform with global data center
        coverage and strong enterprise integration. For NemoClaw, Azure Virtual Machines offer
        reliable compute with predictable performance and deep integration with Azure Active
        Directory for identity management. This section walks through creating an Azure VM
        configured for NemoClaw.
      </p>

      <NoteBlock type="info" title="Prerequisites">
        <p>
          You need an Azure subscription with permissions to create Virtual Machines, Network
          Security Groups, and Resource Groups. Install the Azure CLI (<code>az</code>) locally
          and authenticate with <code>az login</code>. Alternatively, use the Azure Portal web
          interface.
        </p>
      </NoteBlock>

      <StepBlock
        title="Create an Azure VM via Portal"
        steps={[
          {
            title: 'Create a Resource Group',
            content: 'In the Azure Portal, search for "Resource Groups" and click Create. Name it "nemoclaw-rg" and select a region close to your team (e.g., East US, West Europe). Resource Groups are logical containers that hold related Azure resources.',
          },
          {
            title: 'Navigate to Virtual Machines',
            content: 'Search for "Virtual Machines" in the portal and click Create > Azure Virtual Machine.',
          },
          {
            title: 'Configure basics',
            content: 'Select your resource group (nemoclaw-rg), name the VM "nemoclaw-prod", select your region, and choose "No infrastructure redundancy required" for availability. Select Ubuntu Server 22.04 LTS as the image.',
          },
          {
            title: 'Select VM size',
            content: 'Click "See all sizes" and select Standard_D4s_v3 (4 vCPU, 16 GB RAM) as the recommended starting point. This D-series VM provides a good balance of compute and memory for NemoClaw. For larger teams, choose Standard_D8s_v3 (8 vCPU, 32 GB).',
          },
          {
            title: 'Configure authentication',
            content: 'Select "SSH public key" as the authentication type. Generate a new key pair or provide your existing public key. Azure will create a .pem file for download if generating a new pair. Save this file securely.',
          },
          {
            title: 'Configure disks',
            content: 'Under the Disks tab, change the OS disk size from the default 30 GB to 32 GB (or more). Select "Premium SSD" (P4 or higher) for the disk type. Premium SSD provides consistent low-latency IO which benefits NemoClaw policy engine operations.',
          },
          {
            title: 'Configure networking',
            content: 'Under the Networking tab, Azure creates a virtual network, subnet, and public IP automatically. For the Network Security Group, select "Basic" and ensure SSH (port 22) is the only inbound port allowed. Uncheck HTTP (80) and HTTPS (443) if they are auto-selected.',
          },
          {
            title: 'Review and create',
            content: 'Review your configuration on the Review + Create tab. Azure validates the configuration and shows the estimated hourly cost. Click Create and wait for deployment to complete (1-3 minutes).',
          },
          {
            title: 'Connect via SSH',
            content: 'Once deployment completes, go to the VM overview page to find the public IP address. Connect with:\n\nssh -i nemoclaw-key.pem azureuser@<public-ip>\n\nThe default username on Azure Ubuntu VMs is "azureuser" unless you specified otherwise.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        CLI Alternative
      </h2>

      <CodeBlock
        language="bash"
        title="Create Azure VM via az CLI"
        code={`# Create resource group
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
ssh azureuser@<public-ip>`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        VM Size Recommendations
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Standard_B2s (2 vCPU, 4 GB):</span> Budget testing only.
          The B-series is burstable, meaning CPU performance is limited to a baseline with
          occasional bursts. Not suitable for production NemoClaw.
        </li>
        <li>
          <span className="font-semibold">Standard_D4s_v3 (4 vCPU, 16 GB):</span> Recommended
          starting point. The D-series provides balanced compute and memory with consistent
          performance. The "s" suffix indicates Premium Storage support.
        </li>
        <li>
          <span className="font-semibold">Standard_D8s_v3 (8 vCPU, 32 GB):</span> For larger
          teams or heavy concurrent agent usage. Double the resources at roughly double the cost.
        </li>
        <li>
          <span className="font-semibold">Standard_F4s_v2 (4 vCPU, 8 GB):</span> CPU-optimized
          alternative. Higher clock speeds than D-series but less memory. Good if your workload
          is CPU-bound rather than memory-bound.
        </li>
      </ul>

      <WarningBlock title="Azure Burstable VMs (B-series)">
        <p>
          Azure B-series VMs (B2s, B2ms, etc.) are temptingly cheap but use a CPU credit system.
          When credits are exhausted, CPU performance drops to a baseline of 20-40% of the vCPU
          capacity. Under sustained NemoClaw workloads, credits deplete quickly, leading to severe
          performance degradation. Use D-series or F-series for consistent performance.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Static Public IP
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        By default, Azure assigns a dynamic public IP that changes on VM deallocation. For
        production use, the <code>--public-ip-sku Standard</code> flag creates a static IP. You
        can also assign a static IP separately:
      </p>

      <CodeBlock
        language="bash"
        title="Assign a Static Public IP"
        code={`# Create a static public IP
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
  --public-ip-address nemoclaw-ip`}
      />

      <ExerciseBlock
        question="Why should you avoid Azure B-series VMs for production NemoClaw deployments?"
        options={[
          'B-series VMs do not support Ubuntu',
          'B-series VMs use CPU credits and throttle to baseline when credits are depleted',
          'B-series VMs cannot have Premium SSD storage',
          'B-series VMs do not support SSH access',
        ]}
        correctIndex={1}
        explanation="B-series VMs use a credit-based CPU system. They accrue CPU credits during idle periods and spend them during bursts. Under sustained NemoClaw workloads, credits deplete and CPU performance drops to 20-40% of the vCPU capacity, causing unacceptable latency for policy evaluation and agent sessions."
      />

      <ReferenceList
        references={[
          {
            title: 'Azure VM Sizes',
            url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/sizes',
            type: 'docs',
            description: 'Complete reference for Azure VM size families and specifications.',
          },
          {
            title: 'Create a Linux VM in Azure',
            url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-cli',
            type: 'docs',
            description: 'Quickstart guide for creating a Linux VM with the Azure CLI.',
          },
        ]}
      />
    </div>
  )
}
