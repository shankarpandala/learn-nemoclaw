import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function FirewallRules() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        GCP Firewall Rules and VPC Configuration
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Google Cloud's firewall system operates at the VPC (Virtual Private Cloud) network level,
        applying rules to all instances within the network that match specified target tags or
        service accounts. Unlike AWS security groups which are attached directly to instances, GCP
        firewall rules are defined at the network level and associated with instances through tags.
        This section covers creating a minimal firewall configuration for NemoClaw, configuring
        service accounts, and understanding VPC best practices.
      </p>

      <DefinitionBlock
        term="VPC Network"
        definition="A Virtual Private Cloud network in GCP is a global, software-defined network that spans all GCP regions. Firewall rules, routes, and subnets are all resources within a VPC. The default VPC comes with pre-configured firewall rules that allow SSH, ICMP, and internal communication."
        example="A custom VPC named 'nemoclaw-vpc' with a single subnet in us-central1, firewall rules allowing only IAP-based SSH, and all other inbound traffic denied."
        seeAlso={['Firewall Rule', 'Network Tag', 'Service Account']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Default VPC Firewall Rules
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The GCP default VPC includes several pre-created firewall rules that you should review
        and potentially modify for a NemoClaw deployment:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">default-allow-ssh:</span> Allows TCP port 22 from
          all sources (0.0.0.0/0). This is too permissive for production -- restrict it or
          replace it with IAP-based access.
        </li>
        <li>
          <span className="font-semibold">default-allow-icmp:</span> Allows ICMP (ping) from all
          sources. Generally harmless but unnecessary for NemoClaw. Can be deleted or restricted.
        </li>
        <li>
          <span className="font-semibold">default-allow-internal:</span> Allows all protocols and
          ports between instances in the VPC. This is fine for most deployments as it enables
          internal communication.
        </li>
        <li>
          <span className="font-semibold">default-allow-rdp:</span> Allows TCP port 3389 (Remote
          Desktop) from all sources. Not needed for Linux instances. Delete this rule.
        </li>
      </ul>

      <WarningBlock title="Review Default Rules Before Production">
        <p>
          Many GCP users deploy NemoClaw on the default VPC without reviewing the pre-existing
          firewall rules. The default-allow-ssh rule with source 0.0.0.0/0 means SSH is open to
          the entire internet. Either restrict this rule to your IP, delete it and use IAP tunneling,
          or create a custom VPC with explicit rules.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Creating NemoClaw Firewall Rules
      </h2>

      <StepBlock
        title="Configure Firewall Rules for NemoClaw"
        steps={[
          {
            title: 'Delete or restrict the default SSH rule',
            content: 'Either delete default-allow-ssh entirely (if using IAP) or restrict its source range:\n\ngcloud compute firewall-rules update default-allow-ssh --source-ranges=YOUR_IP/32',
          },
          {
            title: 'Create IAP SSH rule (recommended)',
            content: 'Allow SSH only through Google Identity-Aware Proxy. The IAP IP range is 35.235.240.0/20:\n\ngcloud compute firewall-rules create nemoclaw-allow-iap-ssh \\\n  --direction=INGRESS \\\n  --action=ALLOW \\\n  --rules=tcp:22 \\\n  --source-ranges=35.235.240.0/20 \\\n  --target-tags=nemoclaw \\\n  --priority=900',
          },
          {
            title: 'Delete the RDP rule',
            content: 'Not needed for Linux NemoClaw instances:\n\ngcloud compute firewall-rules delete default-allow-rdp',
          },
          {
            title: 'Create a deny-all ingress rule (optional)',
            content: 'For explicit security, create a low-priority deny-all rule:\n\ngcloud compute firewall-rules create nemoclaw-deny-all-ingress \\\n  --direction=INGRESS \\\n  --action=DENY \\\n  --rules=all \\\n  --source-ranges=0.0.0.0/0 \\\n  --target-tags=nemoclaw \\\n  --priority=65534',
          },
          {
            title: 'Verify rules',
            content: 'List all firewall rules affecting your NemoClaw instance:\n\ngcloud compute firewall-rules list --filter="targetTags=nemoclaw"\n\nEnsure only the IAP SSH rule (or IP-restricted SSH rule) allows inbound traffic.',
          },
        ]}
      />

      <CodeBlock
        language="bash"
        title="Complete Firewall Configuration Script"
        code={`#!/bin/bash
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
  --format="table(name,direction,allowed,sourceRanges)"`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Service Accounts
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        GCP service accounts are the equivalent of AWS IAM roles. Every GCE instance runs under
        a service account that determines which GCP APIs and services it can access. By default,
        instances use the Compute Engine default service account with broad "Editor" permissions --
        this violates the principle of least privilege.
      </p>

      <CodeBlock
        language="bash"
        title="Create a Dedicated Service Account"
        code={`# Create service account
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
  --tags=nemoclaw`}
      />

      <NoteBlock type="info" title="When No GCP Services Are Needed">
        <p>
          If your NemoClaw deployment does not interact with any GCP services (no Cloud Storage
          backups, no Secret Manager, no Cloud Logging), create the service account with no IAM
          role bindings at all. The instance will have no GCP API access, which is the most
          secure configuration. You can always add roles later as needs arise.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Custom VPC (Advanced)
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For production environments with strict network isolation requirements, create a custom
        VPC instead of using the default network. A custom VPC gives you full control over subnets,
        IP ranges, and firewall rules without the default rules that may be too permissive.
      </p>

      <CodeBlock
        language="bash"
        title="Create a Custom VPC for NemoClaw"
        code={`# Create custom VPC (no auto-created subnets)
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
  --boot-disk-size=30GB`}
      />

      <ExerciseBlock
        question="What is the recommended source IP range for allowing SSH to a NemoClaw GCE instance via IAP?"
        options={[
          '0.0.0.0/0 (anywhere)',
          '10.0.0.0/8 (internal only)',
          '35.235.240.0/20 (Google IAP range)',
          'Your personal IP address',
        ]}
        correctIndex={2}
        explanation="The IP range 35.235.240.0/20 is Google's Identity-Aware Proxy range. When you use IAP TCP forwarding, SSH traffic enters through this range after Google authenticates your identity. This is more secure than opening SSH to your personal IP (which may change) or the entire internet."
      />

      <ReferenceList
        references={[
          {
            title: 'GCP Firewall Rules Overview',
            url: 'https://cloud.google.com/firewall/docs/firewalls',
            type: 'docs',
            description: 'Comprehensive guide to GCP VPC firewall rules.',
          },
          {
            title: 'GCP Service Accounts',
            url: 'https://cloud.google.com/iam/docs/service-accounts',
            type: 'docs',
            description: 'Understanding and managing GCP service accounts.',
          },
        ]}
      />
    </div>
  )
}
