import { CodeBlock, NoteBlock, ComparisonTable, WarningBlock, StepBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function CostOptimization() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        AWS Cost Optimization for NemoClaw
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Cloud costs can escalate quickly, especially with GPU instances. A NemoClaw deployment that
        costs $50/month on a well-optimized t3.xlarge can balloon to $500+/month with an always-on
        GPU instance or a forgotten oversized reservation. This section covers practical strategies
        for minimizing AWS costs without sacrificing NemoClaw's reliability or performance.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Cost Estimates by Configuration
      </h2>

      <ComparisonTable
        title="Monthly Cost Estimates (us-east-1, On-Demand)"
        headers={['Configuration', 'Instance', 'Storage', 'Data Transfer', 'Total/Month']}
        rows={[
          ['Budget / Testing', 't3.large ($60)', '30GB gp3 ($2.40)', '~$5', '~$67'],
          ['Small Team Production', 't3.xlarge ($121)', '30GB gp3 ($2.40)', '~$5', '~$128'],
          ['Large Team Production', 'c6i.2xlarge ($245)', '50GB gp3 ($4)', '~$10', '~$259'],
          ['GPU (T4)', 'g4dn.xlarge ($383)', '50GB gp3 ($4)', '~$5', '~$392'],
          ['GPU (A10G)', 'g5.xlarge ($733)', '50GB gp3 ($4)', '~$5', '~$742'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Spot Instances
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Spot instances use AWS's spare compute capacity at discounts of 60-90% compared to
        On-Demand pricing. The tradeoff is that AWS can reclaim the instance with a two-minute
        warning when capacity is needed. For NemoClaw, Spot works well in specific scenarios.
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Good for:</span> Development and testing environments,
          batch policy testing, non-critical NemoClaw deployments where brief downtime is acceptable.
        </li>
        <li>
          <span className="font-semibold">Not ideal for:</span> Production NemoClaw deployments
          that require 24/7 availability. A Spot interruption terminates active agent sessions
          and disconnects platform integrations until the instance is replaced.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Launch a Spot Instance"
        code={`# Check current Spot pricing
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
  }]'`}
      />

      <NoteBlock type="tip" title="Spot with Persistent Behavior">
        <p>
          Setting <code>InstanceInterruptionBehavior</code> to "stop" instead of "terminate" means
          AWS will stop (not destroy) your instance during a Spot reclamation. Your EBS volume and
          data are preserved. When Spot capacity returns, AWS automatically restarts your instance.
          Combined with a systemd service, NemoClaw resumes automatically after the restart.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Reserved Instances and Savings Plans
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        If you plan to run NemoClaw continuously for a year or more, Reserved Instances (RIs) or
        Compute Savings Plans offer significant discounts (30-60%) over On-Demand pricing in
        exchange for a commitment.
      </p>

      <ComparisonTable
        title="Savings Plans vs On-Demand (t3.xlarge)"
        headers={['Pricing Model', 'Monthly Cost', 'Savings', 'Commitment']}
        rows={[
          ['On-Demand', '~$121/mo', '0%', 'None'],
          ['1-Year No Upfront RI', '~$87/mo', '28%', '1 year'],
          ['1-Year All Upfront RI', '~$77/mo', '36%', '1 year, pay upfront'],
          ['3-Year All Upfront RI', '~$50/mo', '59%', '3 years, pay upfront'],
          ['Compute Savings Plan (1yr)', '~$84/mo', '30%', '1 year, flexible instance types'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Auto-Stop Scripts
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        For development and staging NemoClaw instances that are only needed during business hours,
        auto-stop scripts can cut costs by 65-75%. The idea is simple: automatically stop the
        instance outside working hours and start it when needed.
      </p>

      <CodeBlock
        language="bash"
        title="CloudWatch Auto-Stop Schedule"
        code={`# Create an IAM role for Lambda (one-time setup)
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
# 0 19 * * 1-5 /home/ubuntu/stop-nemoclaw.sh     # Stop Mon-Fri 7 PM`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Right-Sizing
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Many NemoClaw deployments are over-provisioned. After the first week of operation, review
        actual resource utilization to determine if you can downsize.
      </p>

      <StepBlock
        title="Right-Sizing Your NemoClaw Instance"
        steps={[
          {
            title: 'Enable detailed CloudWatch monitoring',
            content: 'By default, EC2 reports metrics every 5 minutes. Enable detailed monitoring ($3.50/month) for 1-minute granularity: aws ec2 monitor-instances --instance-ids i-0123456789abcdef0',
          },
          {
            title: 'Monitor for one week',
            content: 'Let the instance run through a full business week to capture typical usage patterns. Check CPU, memory, and disk I/O in CloudWatch.',
          },
          {
            title: 'Analyze CPU utilization',
            content: 'If average CPU utilization is below 20% and p95 is below 50%, you are likely over-provisioned on compute. Consider moving down one instance size.',
          },
          {
            title: 'Check memory usage',
            content: 'Install the CloudWatch agent to report memory metrics (not included by default). If memory usage stays below 60%, you may be able to use a smaller instance.',
          },
          {
            title: 'Resize the instance',
            content: 'Stop the instance, change the instance type (Actions > Instance Settings > Change Instance Type), and start it again. Monitor for another week to confirm the smaller instance handles the workload.',
          },
        ]}
      />

      <WarningBlock title="Do Not Downsize Too Aggressively">
        <p>
          NemoClaw's resource usage can spike during policy reloads, concurrent agent sessions,
          and tool execution bursts. A week of monitoring at average load may not capture peak usage.
          Leave at least 30% headroom on both CPU and memory to handle traffic spikes without
          degraded performance.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Additional Cost Tips
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Delete unused Elastic IPs.</span> Unattached Elastic IPs
          cost ~$3.65/month. Release them when no longer needed.
        </li>
        <li>
          <span className="font-semibold">Use gp3 instead of gp2 storage.</span> gp3 offers the
          same performance at 20% lower cost with configurable IOPS.
        </li>
        <li>
          <span className="font-semibold">Set up billing alerts.</span> In the AWS Billing
          Dashboard, create a budget with alerts at 50%, 80%, and 100% of your expected monthly spend.
        </li>
        <li>
          <span className="font-semibold">Review with AWS Cost Explorer.</span> Check monthly
          where your NemoClaw costs are concentrated and identify optimization opportunities.
        </li>
      </ul>

      <ExerciseBlock
        question="A development team runs a NemoClaw staging instance (t3.xlarge) 24/7 but only uses it during business hours (8 AM - 7 PM, Monday-Friday). How much could they save with an auto-stop schedule?"
        options={[
          'About 10% -- minimal savings',
          'About 35% -- stopping overnight saves some',
          'About 67% -- the instance is off for roughly two-thirds of total hours',
          'About 90% -- almost free',
        ]}
        correctIndex={2}
        explanation="A business-hours schedule runs the instance 11 hours/day, 5 days/week = 55 hours/week out of 168 total hours. That means the instance is off for 113/168 = 67% of the time, saving approximately 67% of the compute cost. Storage costs remain constant."
      />

      <ReferenceList
        references={[
          {
            title: 'AWS Pricing Calculator',
            url: 'https://calculator.aws/',
            type: 'docs',
            description: 'Estimate costs for your specific NemoClaw configuration.',
          },
          {
            title: 'EC2 Spot Instances',
            url: 'https://aws.amazon.com/ec2/spot/',
            type: 'docs',
            description: 'Spot instance pricing, best practices, and interruption handling.',
          },
          {
            title: 'AWS Savings Plans',
            url: 'https://aws.amazon.com/savingsplans/',
            type: 'docs',
            description: 'Flexible pricing model for sustained compute usage.',
          },
        ]}
      />
    </div>
  )
}
