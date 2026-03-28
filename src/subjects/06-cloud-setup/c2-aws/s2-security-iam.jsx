import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function SecurityIAM() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        AWS Security Groups and IAM for NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Securing a NemoClaw deployment on AWS involves two layers: network-level controls via
        security groups and identity-level controls via IAM (Identity and Access Management).
        The security group ensures that only authorized network traffic reaches your instance,
        while IAM roles control what AWS services the instance can access. Together, they
        implement the principle of least privilege -- granting only the minimum access required
        for NemoClaw to function.
      </p>

      <DefinitionBlock
        term="Principle of Least Privilege"
        definition="A security concept that dictates every identity (user, role, service) should have only the minimum permissions necessary to perform its intended function. In the context of NemoClaw on AWS, this means the EC2 instance should only be able to access specific S3 buckets or other services it genuinely needs, not all AWS resources in the account."
        example="An IAM role attached to a NemoClaw EC2 instance that grants read/write access to a single S3 bucket for backup storage, but no access to any other S3 buckets, DynamoDB tables, or other services."
        seeAlso={['IAM Role', 'Security Group', 'Instance Profile']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Security Group: SSH Only
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        As covered in the fundamentals chapter, NemoClaw requires no inbound ports beyond SSH.
        Here is the detailed AWS security group configuration with explanations for each rule.
      </p>

      <StepBlock
        title="Create a Hardened Security Group"
        steps={[
          {
            title: 'Create the security group',
            content: 'In the EC2 Console, go to Security Groups > Create Security Group. Name it "nemoclaw-sg", provide a description like "NemoClaw instance - SSH only inbound", and select your VPC.',
          },
          {
            title: 'Add SSH inbound rule',
            content: 'Add a single inbound rule: Type = SSH, Protocol = TCP, Port = 22, Source = "My IP" (or enter your specific CIDR). The "My IP" option automatically detects your current public IP address.',
          },
          {
            title: 'Verify no other inbound rules exist',
            content: 'Ensure there are no other inbound rules. Remove any default HTTP (80) or HTTPS (443) rules if they were auto-added. The implicit deny-all handles everything else.',
          },
          {
            title: 'Leave outbound rules as default',
            content: 'The default outbound rule allows all traffic to all destinations. NemoClaw needs outbound HTTPS (443) to reach Anthropic/OpenAI APIs, Slack, Discord, and package repositories. Allowing all outbound is the simplest approach.',
          },
          {
            title: 'Apply to your instance',
            content: 'Select your NemoClaw EC2 instance, go to Actions > Security > Change Security Groups, and attach the nemoclaw-sg group. Remove any other security groups.',
          },
        ]}
      />

      <NoteBlock type="tip" title="Strict Outbound Rules (Optional)">
        <p>
          For high-security environments, you can restrict outbound rules to only necessary
          destinations: HTTPS (443) to <code>api.anthropic.com</code>, <code>api.openai.com</code>,
          <code>wss-primary.slack.com</code>, <code>gateway.discord.gg</code>, and your package
          repositories. This limits the blast radius if the instance is compromised, but requires
          maintenance as API endpoints change.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        IAM Roles for EC2
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If your NemoClaw deployment needs to interact with AWS services -- for example, storing
        backups in S3, reading secrets from Secrets Manager, or publishing metrics to CloudWatch --
        the correct approach is to attach an IAM role to the EC2 instance. Never store AWS access
        keys on the instance; IAM roles provide temporary credentials that rotate automatically.
      </p>

      <WarningBlock title="Never Use Long-Lived Access Keys">
        <p>
          Storing AWS access key IDs and secret access keys in environment variables or configuration
          files on the instance is a serious security risk. If the instance is compromised, the
          attacker gains persistent access to your AWS account. IAM roles provide temporary
          credentials that expire and rotate automatically, limiting the blast radius of a compromise.
        </p>
      </WarningBlock>

      <CodeBlock
        language="json"
        title="IAM Policy: NemoClaw S3 Backup Access"
        code={`{
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
}`}
      />

      <CodeBlock
        language="json"
        title="IAM Policy: NemoClaw Secrets Manager Access"
        code={`{
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
}`}
      />

      <StepBlock
        title="Create and Attach an IAM Role"
        steps={[
          {
            title: 'Create the IAM policy',
            content: 'In the IAM Console, go to Policies > Create Policy. Paste the JSON policy above (modify resource ARNs for your account). Name it "NemoClawEC2Policy".',
          },
          {
            title: 'Create the IAM role',
            content: 'Go to Roles > Create Role. Select "AWS service" as the trusted entity, then select "EC2" as the use case. Attach the "NemoClawEC2Policy" you just created. Name the role "NemoClawEC2Role".',
          },
          {
            title: 'Attach the role to your instance',
            content: 'In the EC2 Console, select your NemoClaw instance. Go to Actions > Security > Modify IAM Role. Select "NemoClawEC2Role" and save. The instance can now use AWS services without explicit credentials.',
          },
          {
            title: 'Verify from the instance',
            content: 'SSH into the instance and run: aws sts get-caller-identity. It should show the NemoClawEC2Role as the assumed identity. Run: aws s3 ls s3://nemoclaw-backups-ACCOUNT_ID/ to verify S3 access works.',
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Common IAM Scenarios for NemoClaw
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">No AWS service integration:</span> No IAM role needed.
          This is the simplest case -- NemoClaw only communicates with external APIs (Anthropic,
          Slack) and does not touch any AWS services.
        </li>
        <li>
          <span className="font-semibold">S3 for backups:</span> Grant PutObject, GetObject,
          ListBucket, and DeleteObject on a single dedicated bucket. Create the bucket with
          server-side encryption enabled.
        </li>
        <li>
          <span className="font-semibold">Secrets Manager for API keys:</span> Store your Anthropic
          API key, Slack tokens, and other secrets in Secrets Manager instead of environment
          variables. Grant GetSecretValue on the specific secret ARN only.
        </li>
        <li>
          <span className="font-semibold">CloudWatch for monitoring:</span> Grant PutMetricData and
          CreateLogGroup/PutLogEvents to publish NemoClaw metrics and logs to CloudWatch for
          centralized monitoring.
        </li>
      </ul>

      <NoteBlock type="info" title="When You Do Not Need IAM">
        <p>
          If your NemoClaw deployment only communicates with external services (LLM APIs, Slack,
          Discord) and uses local file storage for session data, you do not need any IAM role at
          all. The principle of least privilege means granting zero AWS permissions when none are
          required. You can always add an IAM role later if your needs change.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="Why should you use an IAM role instead of storing AWS access keys in environment variables on the NemoClaw instance?"
        options={[
          'IAM roles are faster than access keys',
          'IAM roles provide temporary, automatically-rotating credentials that limit blast radius if compromised',
          'Access keys do not work on EC2 instances',
          'IAM roles are required by AWS for all EC2 instances',
        ]}
        correctIndex={1}
        explanation="IAM roles issue temporary credentials (via the instance metadata service) that automatically rotate. If the instance is compromised, the attacker only has access until the current credentials expire. Long-lived access keys, by contrast, remain valid until explicitly revoked, giving attackers persistent access."
      />

      <ReferenceList
        references={[
          {
            title: 'IAM Roles for EC2',
            url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html',
            type: 'docs',
            description: 'How to create and attach IAM roles to EC2 instances.',
          },
          {
            title: 'IAM Best Practices',
            url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html',
            type: 'docs',
            description: 'AWS security best practices for IAM configuration.',
          },
        ]}
      />
    </div>
  )
}
