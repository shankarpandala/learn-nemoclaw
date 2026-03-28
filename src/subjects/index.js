/**
 * NemoClaw Curriculum Data
 *
 * Each subject represents a major component of the NVIDIA NemoClaw AI agent
 * security stack. Subjects contain chapters, and chapters contain sections.
 *
 * Structure:
 *   subject.id / chapter.id / section.id  ->  unique path used for routing,
 *   progress tracking, and bookmarks.
 */

export const curriculum = [
  {
    id: 'nemo-guardrails',
    title: 'NeMo Guardrails',
    icon: '\u{1F6E1}\u{FE0F}',
    colorHex: '#76B900',
    description:
      'Programmable guardrails for LLM-powered applications. Define conversation boundaries, prevent harmful outputs, and enforce enterprise policies.',
    chapters: [
      {
        id: 'introduction',
        title: 'Introduction to Guardrails',
        description: 'Why guardrails matter for production AI systems.',
        sections: [
          {
            id: 's01-what-are-guardrails',
            title: 'What Are Guardrails?',
            description:
              'Understanding the concept of programmable safety boundaries for LLMs.',
          },
          {
            id: 's02-architecture-overview',
            title: 'Architecture Overview',
            description:
              'How NeMo Guardrails intercepts, evaluates, and controls LLM interactions.',
          },
          {
            id: 's03-installation-setup',
            title: 'Installation & Setup',
            description:
              'Getting NeMo Guardrails running in your environment.',
          },
        ],
      },
      {
        id: 'colang-basics',
        title: 'Colang Basics',
        description: 'Learn the Colang modeling language for defining guardrails.',
        sections: [
          {
            id: 's01-colang-syntax',
            title: 'Colang Syntax',
            description: 'Core syntax of the Colang guardrail language.',
          },
          {
            id: 's02-defining-flows',
            title: 'Defining Flows',
            description: 'Building conversation flows with Colang.',
          },
          {
            id: 's03-input-output-rails',
            title: 'Input & Output Rails',
            description:
              'Filtering and validating both user inputs and LLM outputs.',
          },
        ],
      },
      {
        id: 'advanced-guardrails',
        title: 'Advanced Guardrails',
        description: 'Enterprise-grade guardrail patterns and customization.',
        sections: [
          {
            id: 's01-custom-actions',
            title: 'Custom Actions',
            description: 'Extending guardrails with Python-based custom actions.',
          },
          {
            id: 's02-fact-checking',
            title: 'Fact-Checking Rails',
            description: 'Preventing hallucinations with automated fact verification.',
          },
          {
            id: 's03-topical-rails',
            title: 'Topical Rails',
            description:
              'Keeping conversations on-topic for enterprise use cases.',
          },
        ],
      },
    ],
  },
  {
    id: 'nemo-retriever',
    title: 'NeMo Retriever',
    icon: '\u{1F50D}',
    colorHex: '#0078D4',
    description:
      'Secure and efficient retrieval-augmented generation (RAG) for grounding LLMs in enterprise knowledge bases.',
    chapters: [
      {
        id: 'rag-fundamentals',
        title: 'RAG Fundamentals',
        description: 'Core concepts of retrieval-augmented generation.',
        sections: [
          {
            id: 's01-what-is-rag',
            title: 'What Is RAG?',
            description:
              'How retrieval-augmented generation grounds LLM responses in real data.',
          },
          {
            id: 's02-embedding-models',
            title: 'Embedding Models',
            description: 'Using NVIDIA embedding models for semantic search.',
          },
          {
            id: 's03-vector-databases',
            title: 'Vector Databases',
            description:
              'Storing and querying embeddings with Milvus and other vector stores.',
          },
        ],
      },
      {
        id: 'secure-retrieval',
        title: 'Secure Retrieval',
        description: 'Security patterns for enterprise RAG pipelines.',
        sections: [
          {
            id: 's01-access-control',
            title: 'Access Control',
            description: 'Document-level permissions in retrieval pipelines.',
          },
          {
            id: 's02-data-privacy',
            title: 'Data Privacy',
            description:
              'Ensuring PII protection and data sovereignty in RAG.',
          },
          {
            id: 's03-pipeline-hardening',
            title: 'Pipeline Hardening',
            description:
              'Defending RAG pipelines against injection and poisoning attacks.',
          },
        ],
      },
    ],
  },
  {
    id: 'nim-security',
    title: 'NIM Security',
    icon: '\u{1F512}',
    colorHex: '#E53E3E',
    description:
      'Security features of NVIDIA Inference Microservices (NIMs), including model isolation, authentication, and runtime protection.',
    chapters: [
      {
        id: 'nim-overview',
        title: 'NIM Overview',
        description: 'Architecture and deployment of NVIDIA Inference Microservices.',
        sections: [
          {
            id: 's01-what-is-nim',
            title: 'What Is NIM?',
            description:
              'Understanding NVIDIA Inference Microservices and their role.',
          },
          {
            id: 's02-deployment-models',
            title: 'Deployment Models',
            description: 'On-prem, cloud, and hybrid NIM deployments.',
          },
          {
            id: 's03-authentication',
            title: 'Authentication & API Keys',
            description:
              'Securing NIM endpoints with authentication and rate limiting.',
          },
        ],
      },
      {
        id: 'runtime-security',
        title: 'Runtime Security',
        description: 'Protecting models during inference.',
        sections: [
          {
            id: 's01-model-isolation',
            title: 'Model Isolation',
            description: 'Container and GPU-level isolation for models.',
          },
          {
            id: 's02-input-validation',
            title: 'Input Validation',
            description:
              'Sanitizing and validating inputs before model inference.',
          },
          {
            id: 's03-audit-logging',
            title: 'Audit Logging',
            description:
              'Comprehensive logging and monitoring of inference requests.',
          },
        ],
      },
    ],
  },
  {
    id: 'agent-security',
    title: 'Agent Security',
    icon: '\u{1F916}',
    colorHex: '#9F7AEA',
    description:
      'End-to-end security patterns for autonomous AI agents, including tool-use safety, sandboxing, and chain-of-thought monitoring.',
    chapters: [
      {
        id: 'agent-fundamentals',
        title: 'Agent Fundamentals',
        description: 'Security considerations for autonomous AI agents.',
        sections: [
          {
            id: 's01-agent-threat-model',
            title: 'Agent Threat Model',
            description:
              'Understanding the attack surface of autonomous AI agents.',
          },
          {
            id: 's02-tool-use-safety',
            title: 'Tool-Use Safety',
            description:
              'Securing function calling and tool invocations in agents.',
          },
          {
            id: 's03-sandboxing',
            title: 'Sandboxing Agents',
            description: 'Isolating agent execution environments.',
          },
        ],
      },
      {
        id: 'monitoring-governance',
        title: 'Monitoring & Governance',
        description: 'Observability and governance for agent deployments.',
        sections: [
          {
            id: 's01-chain-of-thought',
            title: 'Chain-of-Thought Monitoring',
            description:
              'Inspecting and auditing agent reasoning traces.',
          },
          {
            id: 's02-policy-enforcement',
            title: 'Policy Enforcement',
            description: 'Enforcing organizational policies on agent behavior.',
          },
          {
            id: 's03-incident-response',
            title: 'Incident Response',
            description:
              'Handling security incidents in agent-based systems.',
          },
        ],
      },
    ],
  },
]

export default curriculum
