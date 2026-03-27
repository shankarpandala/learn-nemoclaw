import { CodeBlock, NoteBlock, WarningBlock, ComparisonTable, ReferenceList } from '../../../components/content'

export default function CommunityDiscord() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        The NemoClaw Community and Discord
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Open-source projects thrive on their communities, and NemoClaw is no exception. While
        GitHub is the home for code, issues, and pull requests, the NemoClaw Discord server is
        where the community gathers for real-time discussion, mutual help, design conversations,
        and the kind of informal knowledge sharing that does not fit neatly into a GitHub issue.
        Whether you are just getting started with NemoClaw, building a complex multi-agent
        deployment, or contributing to the codebase, the Discord community is a valuable
        resource.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Discord Server Structure
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NemoClaw Discord server is organized into channels that cover different aspects of
        the project. Understanding the channel structure helps you find the right place for your
        questions and conversations.
      </p>

      <ComparisonTable
        title="Discord Channel Guide"
        headers={['Channel', 'Purpose', 'Who Should Use It']}
        rows={[
          ['#general', 'General discussion about NemoClaw, AI agents, and sandbox security', 'Everyone'],
          ['#help', 'Ask questions about using NemoClaw. Installation issues, configuration help, debugging', 'Users seeking help; experienced users who want to help others'],
          ['#blueprints', 'Share, discuss, and get feedback on custom blueprints', 'Blueprint creators and users'],
          ['#local-inference', 'NIM, vLLM, Ollama setup and optimization discussion', 'Users running local models'],
          ['#sandbox-internals', 'Deep technical discussion about Landlock, seccomp, namespaces', 'Contributors and advanced users'],
          ['#showcase', 'Show off what you have built with NemoClaw', 'Anyone with a cool project to share'],
          ['#dev', 'Contributor coordination, design discussions, PR reviews', 'Active contributors'],
          ['#announcements', 'Official announcements: releases, security advisories, events', 'Read-only for most; maintainers post'],
          ['#off-topic', 'Non-NemoClaw conversation', 'Everyone (keep it friendly)'],
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Getting Help Effectively
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The #help channel is the most active channel on the server. To get the fastest and most
        useful responses, follow these guidelines when asking for help:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Ask in the channel, not in DMs:</span> Public
          questions benefit everyone. Someone else likely has the same problem, and the answer
          becomes searchable for future visitors. Do not DM maintainers directly unless they
          invite you to.
        </li>
        <li>
          <span className="font-semibold">Include context upfront:</span> State your NemoClaw
          version, what you are trying to do, what you have tried, and what the error is. Do
          not start with "Is anyone here?" or "Can someone help?" -- just post your question
          with full context.
        </li>
        <li>
          <span className="font-semibold">Use code blocks:</span> Discord supports Markdown
          code blocks. Wrap configuration, logs, and commands in triple backticks with a
          language identifier for readability.
        </li>
        <li>
          <span className="font-semibold">Include nemoclaw system info output:</span> This
          single command provides all the environment context that helpers need.
        </li>
        <li>
          <span className="font-semibold">Follow up with the solution:</span> If you figure
          out the answer to your own question, post it. This helps others and shows respect
          for people who spent time thinking about your problem.
        </li>
      </ul>

      <NoteBlock type="info" title="Response Expectations">
        <p>
          NemoClaw is an open-source project maintained by volunteers and a small core team.
          Response times in Discord vary -- during active hours (US and European business hours),
          you might get a response within minutes. During off hours, it might take several hours.
          Complex questions that require investigation may take longer. If your question goes
          unanswered for more than 24 hours, it is fine to bump it once with additional context
          or a rephrased question. Persistent questions without new information come across as
          demanding and are less likely to get help.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Contributing to Discussions
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond asking for help, there are many ways to participate in the community that make
        NemoClaw better for everyone:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Answer questions in #help:</span> If you have figured
          something out that others are struggling with, share your knowledge. You do not need
          to be an expert to help -- even pointing someone to the right documentation section
          is valuable.
        </li>
        <li>
          <span className="font-semibold">Share your experience in #showcase:</span> Deployment
          stories, benchmark results, interesting agent configurations, and lessons learned are
          all welcome. These real-world experiences help others understand what is possible and
          what pitfalls to avoid.
        </li>
        <li>
          <span className="font-semibold">Participate in design discussions in #dev:</span> When
          maintainers propose new features or architectural changes, community input is important.
          Even if you are not writing the code, your perspective as a user helps shape decisions.
        </li>
        <li>
          <span className="font-semibold">Review blueprints in #blueprints:</span> When someone
          shares a blueprint for feedback, review it using the security evaluation techniques
          from this course. Constructive feedback on policy configurations improves the quality
          of shared blueprints.
        </li>
        <li>
          <span className="font-semibold">Report issues you discover:</span> If you find a bug
          during a Discord conversation, encourage the reporter (or do it yourself) to file a
          proper GitHub issue so it gets tracked.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Community Events
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NemoClaw community hosts regular events that provide opportunities for deeper
        engagement:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Monthly Community Calls:</span> A video call (usually
          on the last Thursday of each month) where maintainers share project updates, demo new
          features, and answer questions from the community. The call is recorded and posted in
          #announcements for those who cannot attend live.
        </li>
        <li>
          <span className="font-semibold">Contributor Sprints:</span> Periodic coordinated
          efforts where community members tackle a batch of issues together. Sprint events are
          announced in #dev with a curated list of issues appropriate for different skill levels.
          These are excellent opportunities for first-time contributors.
        </li>
        <li>
          <span className="font-semibold">Security Review Days:</span> Focused sessions where
          the community collectively reviews security-sensitive code or blueprints. These events
          help train new security reviewers and improve the project's security posture.
        </li>
        <li>
          <span className="font-semibold">Blueprint Showcases:</span> Events where community
          members present their custom blueprints, explaining the use case, design decisions,
          and security considerations. A great way to learn from others' approaches.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Community Guidelines and Code of Conduct
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NemoClaw community operates under a code of conduct that prioritizes respectful,
        inclusive, and constructive interaction. The key principles are:
      </p>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Be respectful:</span> Disagree with ideas, not
          people. Technical discussions can be passionate, but personal attacks, dismissiveness,
          and condescension are not tolerated.
        </li>
        <li>
          <span className="font-semibold">Be inclusive:</span> NemoClaw users and contributors
          come from diverse backgrounds and experience levels. A question that seems basic to
          you was once a challenge for everyone. Welcome newcomers.
        </li>
        <li>
          <span className="font-semibold">Be constructive:</span> When providing feedback --
          on code, blueprints, or ideas -- focus on specific, actionable suggestions. "This
          policy is too permissive because X, consider restricting Y" is more useful than
          "This is insecure."
        </li>
        <li>
          <span className="font-semibold">Respect maintainer decisions:</span> Maintainers
          make judgment calls about project direction, feature priorities, and code quality
          standards. You can disagree respectfully and make your case, but ultimately the
          maintainers have final say.
        </li>
      </ul>

      <WarningBlock title="Reporting Code of Conduct Violations">
        <p>
          If you experience or witness behavior that violates the code of conduct, report it
          to the moderation team via the Discord reporting mechanism or by emailing
          conduct@nemoclaw.dev. Reports are handled confidentially. The moderation team will
          investigate and take appropriate action, which may range from a warning to a permanent
          ban depending on severity.
        </p>
      </WarningBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Beyond Discord
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The NemoClaw community extends beyond Discord. The project maintains a presence across
        several platforms, each serving a different purpose in the ecosystem.
      </p>

      <ReferenceList
        references={[
          {
            title: "NemoClaw GitHub Repository",
            url: "https://github.com/nemoclaw/nemoclaw",
            description: "Source code, issues, pull requests, and releases. The authoritative source for the project."
          },
          {
            title: "NemoClaw Discord Server",
            url: "https://discord.gg/nemoclaw",
            description: "Real-time community discussion, help, and events."
          },
          {
            title: "NemoClaw Documentation",
            url: "https://docs.nemoclaw.dev",
            description: "Official documentation including API reference, guides, and tutorials."
          },
          {
            title: "NemoClaw Blueprint Registry",
            url: "https://blueprints.nemoclaw.dev",
            description: "Community-contributed blueprints with search and security audit reports."
          },
          {
            title: "NemoClaw Blog",
            url: "https://blog.nemoclaw.dev",
            description: "Technical blog posts about NemoClaw development, security research, and best practices."
          },
          {
            title: "@nemoclaw on X/Twitter",
            url: "https://x.com/nemoclaw",
            description: "Release announcements, community highlights, and project updates."
          },
        ]}
      />

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        This concludes the Advanced Topics and Ecosystem subject. You now have the knowledge to
        run models locally, create and distribute custom blueprints, work with advanced sandbox
        configurations, debug isolation issues at the kernel level, and contribute to the
        NemoClaw project itself. The security of AI agents is a rapidly evolving field, and the
        NemoClaw community is at the forefront of building the tools and practices that make
        autonomous agents safe to deploy. Your participation -- whether as a user, a blueprint
        author, a bug reporter, or a code contributor -- makes the ecosystem stronger for
        everyone.
      </p>
    </div>
  )
}
