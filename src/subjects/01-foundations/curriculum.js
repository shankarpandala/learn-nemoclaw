export default {
  id: '01-foundations',
  title: 'Foundations - AI Agent Security',
  icon: '\u{1F6E1}\u{FE0F}',
  colorHex: '#76B900',
  description: 'Understand why AI agent security matters, explore isolation strategies, and learn how OpenClaw and NemoClaw work together.',
  difficulty: 'beginner',
  estimatedHours: 4,
  prerequisites: [],
  chapters: [
    {
      id: 'c1-agent-safety',
      title: 'Why Agent Safety Matters',
      description: 'The rise of always-on AI agents and the risks they introduce.',
      estimatedMinutes: 45,
      sections: [
        { id: 's1-rise-of-agents', title: 'The Rise of Always-On AI Agents', difficulty: 'beginner', readingMinutes: 10, description: 'How autonomous AI agents differ from chatbots and why they need special security.' },
        { id: 's2-risks-unrestricted', title: 'Risks of Unrestricted Agents', difficulty: 'beginner', readingMinutes: 12, description: 'Network, filesystem, cost, and compliance risks of unsandboxed agents.' },
        { id: 's3-need-for-sandboxing', title: 'The Need for Sandboxing', difficulty: 'beginner', readingMinutes: 10, description: 'Why traditional security fails for agents and how sandboxing helps.' },
      ],
    },
    {
      id: 'c2-security-landscape',
      title: 'The Agent Security Landscape',
      description: 'Threat models, isolation strategies, and Linux security primitives.',
      estimatedMinutes: 50,
      sections: [
        { id: 's1-threat-models', title: 'Threat Models for AI Agents', difficulty: 'beginner', readingMinutes: 12, description: 'Applying STRIDE to autonomous agents and mapping attack surfaces.' },
        { id: 's2-isolation-strategies', title: 'Isolation Strategies', difficulty: 'intermediate', readingMinutes: 15, description: 'Containers, VMs, LSMs, and network namespaces compared.' },
        { id: 's3-landlock-seccomp-namespaces', title: 'Landlock, Seccomp & Namespaces', difficulty: 'intermediate', readingMinutes: 15, description: 'Technical primer on the three Linux primitives NemoClaw uses.' },
      ],
    },
    {
      id: 'c3-openclaw-vs-nemoclaw',
      title: 'OpenClaw vs NemoClaw',
      description: 'Understanding the relationship between the AI platform and its security layer.',
      estimatedMinutes: 55,
      sections: [
        { id: 's1-what-is-openclaw', title: 'What is OpenClaw?', difficulty: 'beginner', readingMinutes: 10, description: 'Open-source gateway connecting messaging apps to AI coding agents.' },
        { id: 's2-what-is-nemoclaw', title: 'What is NemoClaw?', difficulty: 'beginner', readingMinutes: 10, description: 'NVIDIA\'s open-source reference stack for running OpenClaw safely.' },
        { id: 's3-how-they-fit', title: 'How They Fit Together', difficulty: 'beginner', readingMinutes: 12, description: 'The platform-plus-security-layer architecture explained.' },
        { id: 's4-comparison-table', title: 'Feature Comparison', difficulty: 'beginner', readingMinutes: 10, description: 'Side-by-side comparison across 15 dimensions.' },
      ],
    },
  ],
}
