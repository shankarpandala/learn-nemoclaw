import { CodeBlock, NoteBlock, DefinitionBlock, ComparisonTable, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function AzureConfig() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Azure-Specific Performance Configuration
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Azure offers several platform-specific features that can improve NemoClaw performance
        and reliability. This section covers Accelerated Networking for lower latency, Premium
        SSD storage for consistent IO, and proximity placement groups for minimizing inter-service
        latency. These optimizations are optional but recommended for production deployments.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Accelerated Networking
      </h2>

      <DefinitionBlock
        term="Accelerated Networking"
        definition="An Azure feature that uses SR-IOV (Single Root I/O Virtualization) to bypass the hypervisor's virtual network stack and connect the VM directly to the physical NIC. This reduces latency, jitter, and CPU utilization for network traffic. It is available on most D-series, F-series, and N-series VMs at no additional cost."
        example="With Accelerated Networking enabled, NemoClaw's API calls to Anthropic see reduced round-trip times (typically 0.1-0.5ms improvement per call) and the CPU spends less time processing network packets, leaving more resources for policy evaluation."
        seeAlso={['SR-IOV', 'Network Latency', 'vCPU']}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Accelerated Networking is automatically enabled on supported VM sizes when you create a
        new VM. If you are running an older VM or want to verify it is enabled:
      </p>

      <CodeBlock
        language="bash"
        title="Enable and Verify Accelerated Networking"
        code={`# Check if Accelerated Networking is enabled
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
# Should show a Mellanox ConnectX virtual function`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Premium SSD Storage
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Azure offers four managed disk tiers, each with different performance characteristics.
        For NemoClaw, disk performance primarily affects startup time (loading policy rules),
        log write throughput, and session persistence speed.
      </p>

      <ComparisonTable
        title="Azure Managed Disk Types"
        headers={['Disk Type', 'IOPS (32 GB)', 'Throughput', 'Latency', 'Cost (32 GB/mo)']}
        rows={[
          ['Standard HDD (S4)', '500', '60 MB/s', '~10ms', '~$1.54'],
          ['Standard SSD (E4)', '500', '60 MB/s', '~5ms', '~$2.40'],
          ['Premium SSD (P4)', '120', '25 MB/s', '~1ms', '~$4.82'],
          ['Premium SSD v2', 'Configurable', 'Configurable', '~1ms', '~$4.10+'],
          ['Ultra Disk', 'Configurable', 'Configurable', '<1ms', '~$15+'],
        ]}
      />

      <NoteBlock type="tip" title="Premium SSD P6 or Higher">
        <p>
          The smallest Premium SSD size (P4, 32 GB) has limited IOPS (120) due to its small size.
          Azure scales disk IOPS with disk size. A P6 (64 GB) provides 240 IOPS, and a P10 (128 GB)
          provides 500 IOPS. If NemoClaw experiences disk bottlenecks, provisioning a larger disk
          (even if the extra space is unused) can improve IO performance. Alternatively, use
          Premium SSD v2 which allows independent IOPS configuration.
        </p>
      </NoteBlock>

      <CodeBlock
        language="bash"
        title="Upgrade to Premium SSD"
        code={`# Check current disk SKU
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

az vm start --resource-group nemoclaw-rg --name nemoclaw-prod`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Proximity Placement Groups
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        A Proximity Placement Group (PPG) is an Azure resource that ensures VMs are placed
        physically close to each other within a datacenter. This is primarily useful when running
        NemoClaw alongside other services (a separate database, a local LLM inference server, or
        a monitoring stack) where inter-VM network latency matters.
      </p>

      <CodeBlock
        language="bash"
        title="Create a Proximity Placement Group"
        code={`# Create a proximity placement group
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
  --generate-ssh-keys`}
      />

      <NoteBlock type="info" title="When PPGs Matter">
        <p>
          For a single NemoClaw VM, proximity placement groups provide no benefit. They only
          matter when you have multiple VMs that communicate with each other frequently. If
          NemoClaw and your local inference server run on separate VMs, a PPG can reduce
          inter-VM round-trip time from 1-2ms to under 0.5ms. This adds up when the Gateway
          makes dozens of inference calls per agent interaction.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Additional Azure Optimizations
      </h2>

      <StepBlock
        title="Azure Performance Tuning Checklist"
        steps={[
          {
            title: 'Enable Accelerated Networking',
            content: 'Verify it is enabled on your VM\'s NIC. Free performance improvement for all network-bound operations.',
          },
          {
            title: 'Use Premium SSD storage',
            content: 'Upgrade from Standard HDD/SSD to Premium SSD for consistent low-latency disk IO. Consider a larger disk size for higher IOPS.',
          },
          {
            title: 'Enable host caching on OS disk',
            content: 'Set the OS disk caching to ReadWrite (default for Premium SSD). This caches frequently accessed data in the host memory, improving read performance for NemoClaw\'s policy engine:\n\naz vm update --resource-group nemoclaw-rg --name nemoclaw-prod --set storageProfile.osDisk.caching=ReadWrite',
          },
          {
            title: 'Configure swap space',
            content: 'Azure Ubuntu VMs have a resource disk (temporary SSD) at /mnt. Configure swap on this disk to handle memory pressure gracefully:\n\nsudo fallocate -l 4G /mnt/swapfile\nsudo chmod 600 /mnt/swapfile\nsudo mkswap /mnt/swapfile\nsudo swapon /mnt/swapfile',
          },
          {
            title: 'Set up Azure Update Management',
            content: 'Enable automatic OS updates to keep security patches current without manual intervention. Configure in the VM\'s Update Management settings to apply updates during a maintenance window that minimizes NemoClaw downtime.',
          },
        ]}
      />

      <ExerciseBlock
        question="What is the primary benefit of Azure Accelerated Networking for a NemoClaw deployment?"
        options={[
          'It increases the VM\'s disk throughput',
          'It provides a faster GPU interconnect',
          'It reduces network latency and CPU utilization by bypassing the hypervisor\'s virtual network stack',
          'It enables the VM to have multiple public IP addresses',
        ]}
        correctIndex={2}
        explanation="Accelerated Networking uses SR-IOV to give the VM direct access to the physical NIC, bypassing the hypervisor's virtual network processing. This reduces network latency (important for LLM API calls) and frees up CPU cycles that would otherwise be spent on network packet processing."
      />

      <ReferenceList
        references={[
          {
            title: 'Azure Accelerated Networking',
            url: 'https://learn.microsoft.com/en-us/azure/virtual-network/accelerated-networking-overview',
            type: 'docs',
            description: 'How Accelerated Networking works and which VM sizes support it.',
          },
          {
            title: 'Azure Managed Disks',
            url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview',
            type: 'docs',
            description: 'Overview of Azure managed disk types and performance tiers.',
          },
          {
            title: 'Proximity Placement Groups',
            url: 'https://learn.microsoft.com/en-us/azure/virtual-machines/co-location',
            type: 'docs',
            description: 'Reduce inter-VM latency with proximity placement groups.',
          },
        ]}
      />
    </div>
  )
}
