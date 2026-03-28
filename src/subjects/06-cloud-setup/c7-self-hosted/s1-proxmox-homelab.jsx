import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function ProxmoxHomelab() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        NemoClaw on Proxmox VE Homelab
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Running NemoClaw on a self-hosted homelab gives you complete control over your
        infrastructure, eliminates recurring cloud costs, and keeps all data within your physical
        premises. Proxmox Virtual Environment (VE) is an open-source virtualization platform that
        makes it straightforward to create and manage VMs on commodity hardware. This section
        covers Proxmox setup, VM creation, and GPU passthrough for local inference on your own
        hardware.
      </p>

      <DefinitionBlock
        term="Proxmox VE"
        definition="An open-source server virtualization platform based on Debian Linux. It combines KVM for virtual machine management and LXC for lightweight containers into a single web-based management interface. Proxmox VE supports live migration, storage clustering, software-defined networking, and PCI passthrough for GPU devices."
        example="A refurbished Dell PowerEdge server running Proxmox VE, hosting a Ubuntu 22.04 VM with 8 vCPUs, 32 GB RAM, and a passed-through NVIDIA RTX 4090 for local LLM inference with NemoClaw."
        seeAlso={['KVM', 'GPU Passthrough', 'Homelab']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Hardware Requirements
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">CPU:</span> Modern x86 CPU with VT-x/VT-d
          (Intel) or AMD-V/IOMMU (AMD) support. At least 4 physical cores recommended.
          AMD Ryzen 5/7 or Intel i5/i7 (12th gen+) are excellent choices.
        </li>
        <li>
          <span className="font-semibold">RAM:</span> 32 GB minimum (16 GB for the NemoClaw VM,
          16 GB for Proxmox host and other VMs). 64 GB recommended if running multiple VMs.
        </li>
        <li>
          <span className="font-semibold">Storage:</span> 500 GB NVMe SSD for VM storage. Proxmox
          uses local storage by default, and NVMe provides the IO performance needed for responsive
          VMs.
        </li>
        <li>
          <span className="font-semibold">GPU (optional):</span> NVIDIA RTX 3090 (24 GB VRAM),
          RTX 4090 (24 GB VRAM), or used Tesla P40 (24 GB VRAM) for local inference. Consumer
          GPUs work well for inference despite being marketed for gaming.
        </li>
        <li>
          <span className="font-semibold">Network:</span> Gigabit Ethernet minimum. The NemoClaw
          VM needs reliable outbound internet for API calls and platform integration.
        </li>
      </ul>

      <NoteBlock type="tip" title="Budget Homelab Hardware">
        <p>
          A refurbished Dell OptiPlex or HP EliteDesk mini PC with an AMD Ryzen 5, 32 GB RAM,
          and 500 GB NVMe can be found for $300-500 and runs NemoClaw without GPU inference
          perfectly. For GPU inference, adding a used NVIDIA Tesla P40 ($150-200 on eBay)
          provides 24 GB VRAM at a fraction of cloud GPU costs. The P40 lacks display output
          but is excellent for headless inference in a server.
        </p>
      </NoteBlock>

      <StepBlock
        title="Set Up Proxmox and Create a NemoClaw VM"
        steps={[
          {
            title: 'Install Proxmox VE',
            content: 'Download the Proxmox VE ISO from proxmox.com/downloads. Write it to a USB drive with balenaEtcher or dd. Boot from the USB and follow the installer. Proxmox installs Debian Linux with the Proxmox management layer automatically.',
          },
          {
            title: 'Access the Proxmox web interface',
            content: 'After installation, access the management interface at https://<proxmox-ip>:8006 in your browser. Log in with the root credentials set during installation.',
          },
          {
            title: 'Upload the Ubuntu ISO',
            content: 'In the Proxmox UI, go to your storage (local) > ISO Images > Upload. Upload the Ubuntu 22.04 server ISO.',
          },
          {
            title: 'Create a VM',
            content: 'Click Create VM in the top right. Configure:\n\n- General: VM ID (e.g., 100), Name: nemoclaw-prod\n- OS: Select the Ubuntu 22.04 ISO\n- System: BIOS: OVMF (UEFI), Machine: q35 (required for GPU passthrough)\n- Disks: 50 GB on local-lvm, VirtIO SCSI\n- CPU: 8 cores, Type: host (exposes real CPU features to the VM)\n- Memory: 16384 MB (16 GB)\n- Network: VirtIO, Bridge: vmbr0',
          },
          {
            title: 'Install Ubuntu in the VM',
            content: 'Start the VM and open the console. Follow the standard Ubuntu Server 22.04 installation. Select OpenSSH server when prompted for software. After installation, reboot and remove the ISO from the VM settings.',
          },
          {
            title: 'Install NemoClaw',
            content: 'SSH into the VM and follow the standard NemoClaw installation:\n\nssh ubuntu@<vm-ip>\nsudo apt update && sudo apt upgrade -y\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs git build-essential\ncurl -fsSL https://install.nemoclaw.dev | bash\ncd ~/nemoclaw && npx nemoclaw onboard',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        GPU Passthrough
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GPU passthrough allows a VM to have direct, exclusive access to a physical GPU installed
        in the Proxmox host. The GPU is fully dedicated to the VM, providing near-native
        performance for LLM inference. Setting up passthrough requires IOMMU support in the CPU
        and BIOS, plus some Proxmox configuration.
      </p>

      <StepBlock
        title="Configure GPU Passthrough"
        steps={[
          {
            title: 'Enable IOMMU in BIOS',
            content: 'Enter your server\'s BIOS/UEFI settings. For Intel: enable VT-d. For AMD: enable IOMMU/AMD-Vi. Save and reboot into Proxmox.',
          },
          {
            title: 'Enable IOMMU in Proxmox',
            content: 'Edit the GRUB configuration:\n\nnano /etc/default/grub\n\nFor Intel, add to GRUB_CMDLINE_LINUX_DEFAULT:\nintel_iommu=on iommu=pt\n\nFor AMD:\namd_iommu=on iommu=pt\n\nUpdate GRUB:\nupdate-grub\nreboot',
          },
          {
            title: 'Load VFIO modules',
            content: 'Add VFIO modules to load on boot:\n\necho -e "vfio\\nvfio_iommu_type1\\nvfio_pci\\nvfio_virqfd" >> /etc/modules\n\nBlacklist the host NVIDIA driver to prevent the host from claiming the GPU:\n\necho -e "blacklist nouveau\\nblacklist nvidia\\nblacklist nvidia_drm\\nblacklist nvidia_modeset" > /etc/modprobe.d/blacklist-nvidia.conf\n\nupdate-initramfs -u\nreboot',
          },
          {
            title: 'Find the GPU PCI address',
            content: 'lspci -nn | grep NVIDIA\n\nNote the PCI address (e.g., 01:00.0) and device IDs.',
          },
          {
            title: 'Add GPU to the VM',
            content: 'In the Proxmox UI, select your NemoClaw VM > Hardware > Add > PCI Device. Select your NVIDIA GPU. Check "All Functions" and "Primary GPU" if it is the only GPU in the VM. Also check "PCI-Express" for best performance.',
          },
          {
            title: 'Install NVIDIA drivers in the VM',
            content: 'Start the VM and SSH in:\n\nsudo apt install -y ubuntu-drivers-common\nsudo ubuntu-drivers autoinstall\nsudo reboot\n\nVerify:\nnvidia-smi',
          },
        ]}
      />

      <WarningBlock title="GPU Passthrough Complexity">
        <p>
          GPU passthrough can be finicky. Common issues include IOMMU group conflicts (where the
          GPU shares a group with other devices), ACS override patches being needed, and NVIDIA
          drivers detecting they are running in a VM and refusing to load (Code 43 error, mostly
          a Windows issue). On Linux VMs with recent NVIDIA drivers, passthrough generally works
          smoothly. Consult the Proxmox Wiki if you encounter issues.
        </p>
      </WarningBlock>

      <CodeBlock
        language="bash"
        title="Verify GPU Passthrough in the VM"
        code={`# Inside the NemoClaw VM:
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
# Edit openclaw.json with the Ollama endpoint`}
      />

      <ExerciseBlock
        question="What BIOS/UEFI feature must be enabled for GPU passthrough to work in Proxmox?"
        options={[
          'Secure Boot',
          'TPM 2.0',
          'IOMMU (VT-d for Intel, AMD-Vi for AMD)',
          'Hyper-Threading',
        ]}
        correctIndex={2}
        explanation="IOMMU (Input-Output Memory Management Unit) is required for PCI passthrough. It allows the hypervisor to securely assign physical PCI devices (like GPUs) to individual VMs. Intel calls this VT-d and AMD calls it AMD-Vi. Without IOMMU, the VM cannot have direct, isolated access to the GPU hardware."
      />

      <ReferenceList
        references={[
          {
            title: 'Proxmox VE Documentation',
            url: 'https://pve.proxmox.com/wiki/Main_Page',
            type: 'docs',
            description: 'Official Proxmox VE wiki with installation and configuration guides.',
          },
          {
            title: 'Proxmox PCI Passthrough',
            url: 'https://pve.proxmox.com/wiki/PCI_Passthrough',
            type: 'docs',
            description: 'Detailed guide for GPU and PCI device passthrough in Proxmox VE.',
          },
        ]}
      />
    </div>
  )
}
