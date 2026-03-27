import { CodeBlock, NoteBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function EC2Setup() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Launching an EC2 Instance for NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Amazon EC2 is the most widely used cloud compute service and an excellent platform for
        hosting NemoClaw. This section walks you through launching a properly configured EC2
        instance from scratch, including selecting the right AMI, configuring storage, setting
        up the security group, and verifying connectivity. By the end, you will have a running
        Ubuntu 22.04 instance ready for NemoClaw installation.
      </p>

      <NoteBlock type="info" title="Prerequisites">
        <p>
          You need an AWS account with permissions to create EC2 instances, security groups, and
          key pairs. The AWS CLI should be installed and configured on your local machine, though
          you can also complete these steps through the AWS Console web interface.
        </p>
      </NoteBlock>

      <StepBlock
        title="Launch an EC2 Instance via AWS Console"
        steps={[
          {
            title: 'Navigate to EC2 Dashboard',
            content: 'Log into the AWS Console, select your preferred region (choose one close to your team for lower latency), and navigate to EC2 > Instances > Launch Instances.',
          },
          {
            title: 'Name your instance',
            content: 'Enter a descriptive name like "nemoclaw-prod" or "nemoclaw-staging". Tags help you identify resources later and are essential for cost tracking.',
          },
          {
            title: 'Select the AMI',
            content: 'Choose Ubuntu Server 22.04 LTS (HVM), SSD Volume Type. Use the 64-bit (x86) architecture unless you specifically need ARM (Graviton). The AMI ID varies by region but is always listed under "Quick Start" AMIs.',
          },
          {
            title: 'Choose instance type',
            content: 'Select t3.xlarge (4 vCPU, 16 GB RAM) as the recommended starting point for small to medium teams. For budget testing, t3.large (2 vCPU, 8 GB) works but may exhibit performance constraints under load. For larger teams, consider c6i.2xlarge (8 vCPU, 16 GB) for CPU-optimized performance.',
          },
          {
            title: 'Create or select a key pair',
            content: 'Create a new ED25519 key pair named "nemoclaw-key". Download the .pem file and store it securely. Set permissions with: chmod 400 nemoclaw-key.pem. You will need this file for SSH access.',
          },
          {
            title: 'Configure network settings',
            content: 'Select your VPC (default VPC is fine for most cases). Enable "Auto-assign public IP" so you can SSH in initially. Create a new security group with SSH (port 22) access restricted to your IP address only. Do NOT add HTTP or HTTPS rules.',
          },
          {
            title: 'Configure storage',
            content: 'Change the root volume from the default 8 GB to 30 GB. Select gp3 (General Purpose SSD) for the volume type -- it offers better price/performance than gp2. If you plan to store extensive logs or workspace data, increase to 50 GB.',
          },
          {
            title: 'Launch the instance',
            content: 'Review your configuration and click Launch Instance. Note the instance ID for reference.',
          },
          {
            title: 'Wait for initialization',
            content: 'The instance will transition from "pending" to "running" within 30-60 seconds. Wait for both status checks (system and instance) to show "2/2 checks passed" before connecting.',
          },
          {
            title: 'Connect via SSH',
            content: 'Copy the public IPv4 address from the instance details. Connect with: ssh -i nemoclaw-key.pem ubuntu@<public-ip>. Accept the host key fingerprint on first connection.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        CLI Alternative
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If you prefer the command line, the following AWS CLI commands accomplish the same setup.
        This approach is also useful for automation and repeatable deployments.
      </p>

      <CodeBlock
        language="bash"
        title="Launch EC2 via AWS CLI"
        code={`# Create key pair
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

echo "Connect with: ssh -i nemoclaw-key.pem ubuntu@$PUBLIC_IP"`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Storage Considerations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The default 8 GB root volume on most AMIs is insufficient for NemoClaw. Here is a
        breakdown of typical storage usage:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Ubuntu base system:</span> approximately 4-5 GB
        </li>
        <li>
          <span className="font-semibold">Node.js runtime and dependencies:</span> approximately 500 MB
        </li>
        <li>
          <span className="font-semibold">NemoClaw binaries and policy engine:</span> approximately 200 MB
        </li>
        <li>
          <span className="font-semibold">Workspace data and session logs:</span> varies, 1-10 GB over time
        </li>
        <li>
          <span className="font-semibold">System logs and package cache:</span> approximately 1-2 GB
        </li>
        <li>
          <span className="font-semibold">Safety margin:</span> always keep at least 5 GB free
        </li>
      </ul>

      <WarningBlock title="Running Out of Disk Space">
        <p>
          If the root volume fills up, NemoClaw's session store will fail to persist data, log
          rotation will stop, and the system may become unresponsive. Set up a disk usage alert
          using CloudWatch or a simple cron job that checks <code>df -h</code> and sends a
          notification when usage exceeds 80%.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Elastic IP (Optional but Recommended)
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        By default, EC2 instances receive a new public IP address each time they are stopped and
        started. For a production NemoClaw deployment, associate an Elastic IP to get a static
        public address that persists across instance restarts. This is especially important if
        you are using IP-restricted SSH access in your security group.
      </p>

      <CodeBlock
        language="bash"
        title="Associate an Elastic IP"
        code={`# Allocate an Elastic IP
EIP_ALLOC=$(aws ec2 allocate-address \\
  --domain vpc \\
  --query 'AllocationId' \\
  --output text)

# Associate it with your instance
aws ec2 associate-address \\
  --instance-id $INSTANCE_ID \\
  --allocation-id $EIP_ALLOC

# Note: Elastic IPs are free while associated with a running instance.
# You are charged ~$3.65/month if the IP is allocated but not associated.`}
      />

      <ExerciseBlock
        question="What is the recommended minimum root volume size when launching an EC2 instance for NemoClaw?"
        options={[
          '8 GB (AMI default)',
          '15 GB',
          '30 GB',
          '100 GB',
        ]}
        correctIndex={2}
        explanation="30 GB is the recommended minimum, accounting for the Ubuntu base system (~5 GB), NemoClaw and its dependencies (~1 GB), workspace data and logs (1-10 GB), and a safety margin. The default 8 GB is insufficient and will quickly fill up."
      />

      <ReferenceList
        references={[
          {
            title: 'AWS EC2 Getting Started',
            url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html',
            type: 'docs',
            description: 'Official AWS guide to launching your first EC2 instance.',
          },
          {
            title: 'EC2 Instance Types',
            url: 'https://aws.amazon.com/ec2/instance-types/',
            type: 'docs',
            description: 'Complete reference for all EC2 instance families and their specifications.',
          },
          {
            title: 'EBS Volume Types',
            url: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html',
            type: 'docs',
            description: 'Comparison of gp2, gp3, io1, io2, and other EBS volume types.',
          },
        ]}
      />
    </div>
  )
}
