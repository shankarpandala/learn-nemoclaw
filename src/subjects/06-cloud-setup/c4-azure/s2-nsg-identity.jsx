import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function NSGIdentity() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Network Security Groups and Managed Identity
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Azure provides two complementary security mechanisms for NemoClaw: Network Security Groups
        (NSGs) control network traffic at the subnet or NIC level, while Managed Identities
        provide secure access to Azure services without storing credentials. Together, they
        implement defense in depth -- network isolation combined with identity-based access control.
      </p>

      <DefinitionBlock
        term="Network Security Group (NSG)"
        definition="An Azure resource containing security rules that filter network traffic to and from Azure resources in a virtual network. Each rule specifies source, destination, port, protocol, and action (Allow or Deny). NSGs can be associated with subnets or individual network interfaces. Rules are evaluated by priority (lower number = higher priority)."
        example="An NSG named 'nemoclaw-nsg' with a single inbound rule: Allow TCP port 22 from your office IP (priority 100), and an implicit deny-all for everything else."
        seeAlso={['Virtual Network', 'Managed Identity', 'Azure Bastion']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Configuring the NSG
      </h2>

      <StepBlock
        title="Create and Configure an NSG for NemoClaw"
        steps={[
          {
            title: 'Create the NSG',
            content: 'az network nsg create \\\n  --resource-group nemoclaw-rg \\\n  --name nemoclaw-nsg',
          },
          {
            title: 'Add SSH inbound rule',
            content: 'az network nsg rule create \\\n  --resource-group nemoclaw-rg \\\n  --nsg-name nemoclaw-nsg \\\n  --name AllowSSH \\\n  --priority 100 \\\n  --direction Inbound \\\n  --access Allow \\\n  --protocol Tcp \\\n  --destination-port-ranges 22 \\\n  --source-address-prefixes YOUR_IP/32\n\nReplace YOUR_IP with your actual public IP address.',
          },
          {
            title: 'Verify no other inbound rules exist',
            content: 'az network nsg rule list \\\n  --resource-group nemoclaw-rg \\\n  --nsg-name nemoclaw-nsg \\\n  --output table\n\nEnsure only the SSH rule appears. Azure includes default rules (priority 65000+) that allow internal VNet traffic and deny all other inbound -- these are correct.',
          },
          {
            title: 'Associate with your VM NIC',
            content: 'If not already associated during VM creation:\n\naz network nic update \\\n  --resource-group nemoclaw-rg \\\n  --name nemoclaw-prodVMNic \\\n  --network-security-group nemoclaw-nsg',
          },
        ]}
      />

      <CodeBlock
        language="bash"
        title="Complete NSG Configuration"
        code={`# View current rules including defaults
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
  --source-address-prefixes 203.0.113.10/32 198.51.100.20/32`}
      />

      <NoteBlock type="tip" title="Azure Bastion Alternative">
        <p>
          Azure Bastion provides browser-based SSH access to VMs without any public IP or open
          SSH port. It is similar to GCP's IAP tunneling. Bastion costs ~$140/month for the Basic
          tier, which is significant for a single NemoClaw VM, but worthwhile for enterprise
          environments with strict no-public-IP policies. Enable it in the virtual network settings.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Managed Identity
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Azure Managed Identity is the equivalent of AWS IAM roles and GCP service accounts. It
        provides your VM with an automatically managed identity that can authenticate to Azure
        services without storing credentials. There are two types: system-assigned (tied to the
        VM lifecycle) and user-assigned (independent, reusable across resources).
      </p>

      <CodeBlock
        language="bash"
        title="Enable System-Assigned Managed Identity"
        code={`# Enable system-assigned identity on the VM
az vm identity assign \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prod

# Get the principal ID
PRINCIPAL_ID=$(az vm identity show \\
  --resource-group nemoclaw-rg \\
  --name nemoclaw-prod \\
  --query 'principalId' \\
  --output tsv)

echo "Principal ID: $PRINCIPAL_ID"`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Common Azure Service Integrations
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        With Managed Identity enabled, you can grant the NemoClaw VM access to specific Azure
        services using role-based access control (RBAC):
      </p>

      <CodeBlock
        language="bash"
        title="Grant Access to Azure Services"
        code={`# Key Vault access for storing API keys and secrets
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
  --output table`}
      />

      <CodeBlock
        language="bash"
        title="Retrieve Secrets from Key Vault"
        code={`# Create Key Vault
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
  --output tsv`}
      />

      <WarningBlock title="Scope Role Assignments Narrowly">
        <p>
          Always assign roles at the most specific scope possible. Assigning "Storage Blob Data
          Contributor" at the subscription level grants NemoClaw access to every storage account
          in your entire subscription. Instead, scope it to the specific storage account or even
          a specific container. The principle of least privilege applies equally to Managed Identity
          role assignments.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When You Do Not Need Managed Identity
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If your NemoClaw deployment only communicates with external services (LLM APIs, Slack,
        Discord) and stores all data locally, you do not need Managed Identity at all. Do not
        enable it "just in case" -- unused identity assignments expand the attack surface. Enable
        it only when you have a concrete need for Azure service access from the VM.
      </p>

      <ExerciseBlock
        question="What is the primary advantage of Azure Managed Identity over storing API credentials in environment variables?"
        options={[
          'Managed Identity is faster than reading environment variables',
          'Managed Identity automatically rotates credentials and provides audit logging',
          'Environment variables cannot be read by Node.js applications',
          'Managed Identity works without an internet connection',
        ]}
        correctIndex={1}
        explanation="Managed Identity provides temporary tokens that rotate automatically, eliminating the risk of long-lived credentials being stolen. Azure also logs every token issuance and service access through Azure AD audit logs, giving full visibility into what the VM accessed and when."
      />

      <ReferenceList
        references={[
          {
            title: 'Azure NSG Documentation',
            url: 'https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview',
            type: 'docs',
            description: 'Complete guide to Network Security Groups in Azure.',
          },
          {
            title: 'Managed Identities for Azure Resources',
            url: 'https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview',
            type: 'docs',
            description: 'Understanding and using Managed Identity for Azure VM authentication.',
          },
        ]}
      />
    </div>
  )
}
