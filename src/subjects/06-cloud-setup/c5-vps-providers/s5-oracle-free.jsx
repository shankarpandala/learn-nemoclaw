import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function OracleFree() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        NemoClaw on Oracle Cloud Always Free Tier
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Oracle Cloud's Always Free tier is one of the cloud industry's best-kept secrets. It
        includes up to 4 ARM Ampere A1 OCPUs (equivalent to vCPUs) and 24 GB of RAM -- permanently
        free, not a time-limited trial. This is more than enough to run a production NemoClaw
        deployment at zero cost. The catch? Availability can be limited, and the ARM architecture
        requires attention during setup.
      </p>

      <NoteBlock type="info" title="Always Free vs. Free Trial">
        <p>
          Oracle Cloud offers two free programs. The "Free Trial" gives $300 in credits for 30
          days. The "Always Free" tier provides permanent access to specific resources that never
          expire, even after the trial ends. NemoClaw runs on Always Free resources, meaning you
          can run it indefinitely at no cost.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Always Free ARM Resources
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Compute:</span> Up to 4 Ampere A1 OCPUs (ARM-based)
          and 24 GB RAM. You can allocate this as one large VM (4 OCPU, 24 GB) or multiple smaller
          VMs (e.g., 2x 2 OCPU with 12 GB each).
        </li>
        <li>
          <span className="font-semibold">Storage:</span> 200 GB of block volume storage total.
          You can create up to 2 block volumes. The boot volume uses part of this allocation.
        </li>
        <li>
          <span className="font-semibold">Networking:</span> 10 TB outbound data transfer per month.
          More than sufficient for any NemoClaw deployment.
        </li>
        <li>
          <span className="font-semibold">Load Balancer:</span> One Always Free load balancer (10
          Mbps bandwidth). Useful if you split NemoClaw across multiple smaller VMs.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With 4 OCPUs and 24 GB of RAM, the Always Free ARM VM exceeds the recommended NemoClaw
        requirements. The 24 GB RAM is particularly generous -- more than the 16 GB recommended
        for production, allowing headroom for large session stores and concurrent operations.
      </p>

      <StepBlock
        title="Deploy NemoClaw on Oracle Cloud Always Free"
        steps={[
          {
            title: 'Create an Oracle Cloud account',
            content: 'Sign up at cloud.oracle.com. You will need a credit card for verification (it will not be charged for Always Free resources). Select your home region carefully -- it cannot be changed later, and Always Free ARM availability varies by region.',
          },
          {
            title: 'Navigate to Compute Instances',
            content: 'In the OCI Console, go to Compute > Instances > Create Instance.',
          },
          {
            title: 'Configure the instance',
            content: 'Name: nemoclaw-prod\nImage: Ubuntu 22.04 (Canonical-Ubuntu-22.04-aarch64)\nShape: Click "Change Shape" > "Ampere" > VM.Standard.A1.Flex\n\nConfigure OCPU and memory:\n- OCPUs: 4 (maximum for Always Free)\n- Memory: 24 GB (maximum for Always Free)',
          },
          {
            title: 'Configure boot volume',
            content: 'Set the boot volume size to 100 GB (up to 200 GB is within Always Free limits). Select "Balanced" performance tier.',
          },
          {
            title: 'Add SSH key',
            content: 'Under "Add SSH Keys", paste your public key or upload the .pub file. OCI does not support password-based SSH access by default.',
          },
          {
            title: 'Create the instance',
            content: 'Click Create. Note: ARM instances are in high demand. If you see "Out of capacity", try again later (early morning UTC is often best) or select a different availability domain. Some users report needing to try repeatedly over several days.',
          },
          {
            title: 'Configure security list',
            content: 'Go to Networking > Virtual Cloud Networks > your VCN > Security Lists > Default Security List. By default, SSH (port 22) is allowed from 0.0.0.0/0. Restrict this to your IP:\n\nEdit the SSH rule and change the Source CIDR to YOUR_IP/32.',
          },
          {
            title: 'SSH into the instance',
            content: 'ssh -i your-key ubuntu@<public-ip>\n\nNote the username is "ubuntu" on Oracle Cloud Ubuntu images.',
          },
          {
            title: 'Install Node.js for ARM',
            content: 'The standard NodeSource install works on ARM:\n\nsudo apt update && sudo apt upgrade -y\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs git build-essential\n\nVerify: node --version && uname -m\n# Should show aarch64 for ARM',
          },
          {
            title: 'Install NemoClaw',
            content: 'curl -fsSL https://install.nemoclaw.dev | bash\n\nThe installer detects the ARM architecture and downloads the correct binaries. The policy engine has native ARM (aarch64) builds.\n\ncd ~/nemoclaw && npx nemoclaw onboard',
          },
          {
            title: 'Set up systemd service',
            content: 'Create the nemoclaw.service file (same as previous sections, with User=ubuntu and WorkingDirectory=/home/ubuntu/nemoclaw).\n\nsudo systemctl daemon-reload\nsudo systemctl enable nemoclaw\nsudo systemctl start nemoclaw',
          },
          {
            title: 'Verify',
            content: 'npx nemoclaw status\nsudo systemctl status nemoclaw\n\nAccess the Control UI via SSH tunnel:\nssh -L 18789:localhost:18789 ubuntu@<public-ip>',
          },
        ]}
      />

      <WarningBlock title="ARM Instance Availability">
        <p>
          The biggest challenge with Oracle Cloud's Always Free ARM instances is availability.
          Due to high demand, the "Create Instance" operation frequently fails with an "Out of
          host capacity" error. Strategies to work around this: try different availability domains
          within your region, attempt creation during off-peak hours (UTC mornings), reduce the
          OCPU/memory request (try 2 OCPU/12 GB first, then resize later), or use OCI CLI with a
          retry script that attempts creation every few minutes.
        </p>
      </WarningBlock>

      <CodeBlock
        language="bash"
        title="OCI CLI with Retry Script"
        code={`# Install OCI CLI
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

  if grep -q "PROVISIONING\|RUNNING" /tmp/oci-create.log; then
    echo "Instance created successfully!"
    break
  fi

  echo "Failed. Retrying in 60 seconds..."
  sleep 60
done`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        ARM-Specific Considerations
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Architecture compatibility:</span> NemoClaw's policy
          engine ships native ARM (aarch64) binaries. Node.js also runs natively on ARM.
          You should not encounter architecture-related issues.
        </li>
        <li>
          <span className="font-semibold">npm native modules:</span> Some npm packages with
          native C/C++ addons may not have pre-built ARM binaries and will compile from source.
          The <code>build-essential</code> package installed earlier provides the necessary compilers.
        </li>
        <li>
          <span className="font-semibold">Performance:</span> Ampere A1 cores deliver roughly
          equivalent performance to x86 cores at the same count. Four A1 OCPUs provide performance
          comparable to a 4-vCPU x86 instance.
        </li>
      </ul>

      <ExerciseBlock
        question="What are the maximum Always Free ARM resources available on Oracle Cloud?"
        options={[
          '1 OCPU, 4 GB RAM',
          '2 OCPUs, 12 GB RAM',
          '4 OCPUs, 24 GB RAM',
          '8 OCPUs, 32 GB RAM',
        ]}
        correctIndex={2}
        explanation="Oracle Cloud's Always Free tier includes up to 4 Ampere A1 OCPUs and 24 GB of RAM. This can be allocated as a single VM or split across multiple VMs. These resources are permanently free, not a time-limited trial, making them exceptional value for NemoClaw deployments."
      />

      <ReferenceList
        references={[
          {
            title: 'Oracle Cloud Always Free Resources',
            url: 'https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm',
            type: 'docs',
            description: 'Complete list of Oracle Cloud Always Free tier resources.',
          },
          {
            title: 'OCI Compute Instances',
            url: 'https://docs.oracle.com/en-us/iaas/Content/Compute/Concepts/computeoverview.htm',
            type: 'docs',
            description: 'Oracle Cloud compute instance documentation.',
          },
        ]}
      />
    </div>
  )
}
