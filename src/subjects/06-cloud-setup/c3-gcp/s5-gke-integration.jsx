import { CodeBlock, NoteBlock, DefinitionBlock, WarningBlock, ExerciseBlock, ReferenceList } from '../../../components/content'

export default function GKEIntegration() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Running NemoClaw in GKE (Experimental)
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Google Kubernetes Engine (GKE) is a managed Kubernetes service that automates deployment,
        scaling, and operations of containerized applications. Running NemoClaw in GKE is considered
        experimental -- it works, but introduces complexity that is unnecessary for most deployments.
        This section covers when GKE makes sense, the container architecture, key limitations, and
        a basic deployment manifest.
      </p>

      <WarningBlock title="Experimental: VM Deployment Is Recommended">
        <p>
          For the vast majority of NemoClaw deployments, a single VM (GCE, EC2, or VPS) is the
          recommended approach. GKE adds significant operational complexity -- Kubernetes knowledge,
          container networking, persistent storage management, and RBAC configuration -- without
          proportional benefit for a single-instance deployment. Consider GKE only if you already
          run a Kubernetes cluster and want to consolidate, or if you need horizontal scaling across
          multiple NemoClaw instances.
        </p>
      </WarningBlock>

      <DefinitionBlock
        term="GKE (Google Kubernetes Engine)"
        definition="A managed Kubernetes service that runs containerized applications across a cluster of virtual machines. GKE handles the Kubernetes control plane, node provisioning, automatic upgrades, and integration with GCP services like Cloud Logging, IAM, and Load Balancing."
        example="A GKE cluster with 3 nodes running the NemoClaw Gateway as a Deployment with 2 replicas, using a PersistentVolumeClaim for session storage and a Kubernetes Secret for API keys."
        seeAlso={['Kubernetes', 'Container', 'Pod']}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        When GKE Makes Sense
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Existing Kubernetes infrastructure:</span> Your team
          already runs applications on GKE and wants to manage NemoClaw alongside them with
          consistent tooling and observability.
        </li>
        <li>
          <span className="font-semibold">Multi-instance scaling:</span> You need to run multiple
          NemoClaw instances with shared policy management, which Kubernetes makes easier to
          orchestrate.
        </li>
        <li>
          <span className="font-semibold">Automated failover:</span> Kubernetes automatically
          restarts failed pods and reschedules them to healthy nodes, providing higher availability
          than a single VM.
        </li>
        <li>
          <span className="font-semibold">GitOps workflows:</span> You manage all infrastructure
          declaratively through YAML manifests and want NemoClaw to follow the same pattern.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Container Architecture
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        NemoClaw runs as two processes: the OpenClaw Gateway (Node.js) and the policy engine
        (Rust binary). In a Kubernetes deployment, these can run as two containers in a single
        pod (sidecar pattern) or as separate deployments communicating over the pod network.
        The sidecar approach is simpler and recommended.
      </p>

      <CodeBlock
        language="yaml"
        title="NemoClaw Kubernetes Deployment"
        code={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nemoclaw
  labels:
    app: nemoclaw
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nemoclaw
  template:
    metadata:
      labels:
        app: nemoclaw
    spec:
      containers:
        - name: gateway
          image: nemoclaw/gateway:latest
          ports:
            - containerPort: 18789
              name: control-ui
          envFrom:
            - secretRef:
                name: nemoclaw-secrets
          volumeMounts:
            - name: workspace
              mountPath: /data/nemoclaw
          resources:
            requests:
              cpu: "2"
              memory: "4Gi"
            limits:
              cpu: "4"
              memory: "8Gi"

        - name: policy-engine
          image: nemoclaw/policy-engine:latest
          volumeMounts:
            - name: workspace
              mountPath: /data/nemoclaw
          resources:
            requests:
              cpu: "1"
              memory: "2Gi"
            limits:
              cpu: "2"
              memory: "4Gi"

      volumes:
        - name: workspace
          persistentVolumeClaim:
            claimName: nemoclaw-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nemoclaw-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  storageClassName: standard-rwo
---
apiVersion: v1
kind: Secret
metadata:
  name: nemoclaw-secrets
type: Opaque
stringData:
  ANTHROPIC_API_KEY: "sk-ant-your-key-here"
  SLACK_BOT_TOKEN: "xoxb-your-token-here"
  NODE_ENV: "production"`}
      />

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Key Limitations
      </h2>

      <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
        <li>
          <span className="font-semibold">Session persistence:</span> If the pod is rescheduled to
          a different node, in-memory sessions are lost. The PersistentVolumeClaim preserves workspace
          data on disk, but active session state requires the pod to remain running. This makes
          rolling updates disruptive.
        </li>
        <li>
          <span className="font-semibold">Tool execution isolation:</span> NemoClaw's tool executor
          runs commands in the container's filesystem. In a Kubernetes context, this filesystem is
          ephemeral and limited. Agents cannot interact with the host system or other containers
          without explicit volume mounts and security contexts.
        </li>
        <li>
          <span className="font-semibold">Networking complexity:</span> The Control UI is only
          accessible through a Kubernetes Service (ClusterIP) and requires port-forwarding or an
          Ingress for access. Do not expose it through a public LoadBalancer.
        </li>
        <li>
          <span className="font-semibold">Single replica recommended:</span> The OpenClaw Gateway
          does not currently support multi-replica horizontal scaling with shared session state.
          Running multiple replicas requires external session storage and a load balancer with
          session affinity, adding significant complexity.
        </li>
        <li>
          <span className="font-semibold">GPU pods:</span> If using local inference, you need
          a GPU node pool with NVIDIA device plugins. This adds cost (GPU nodes must always be
          running) and scheduling complexity.
        </li>
      </ul>

      <CodeBlock
        language="bash"
        title="Accessing the Control UI via kubectl"
        code={`# Port-forward to access the Control UI locally
kubectl port-forward deployment/nemoclaw 18789:18789

# Then open http://localhost:18789

# View logs
kubectl logs deployment/nemoclaw -c gateway -f
kubectl logs deployment/nemoclaw -c policy-engine -f

# Check pod status
kubectl get pods -l app=nemoclaw`}
      />

      <NoteBlock type="info" title="Workload Identity for GCP Integration">
        <p>
          Instead of storing GCP credentials in Kubernetes secrets, use GKE Workload Identity
          to bind a Kubernetes service account to a GCP service account. This provides your
          NemoClaw pod with automatic access to GCP services (Secret Manager, Cloud Storage)
          without managing credentials. Configure it with:
          <code> gcloud iam service-accounts add-iam-policy-binding</code> to link the accounts.
        </p>
      </NoteBlock>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8">
        Recommendation
      </h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Unless you have a specific reason to run NemoClaw on Kubernetes, a standalone GCE VM
        provides a simpler, more reliable, and easier-to-debug deployment. The single-binary
        nature of NemoClaw -- one Gateway process, one policy engine process -- does not benefit
        meaningfully from container orchestration. Save GKE for when you genuinely need
        multi-instance deployments or want to integrate NemoClaw into an existing Kubernetes-based
        platform.
      </p>

      <ExerciseBlock
        question="What is the primary limitation of running multiple NemoClaw replicas in GKE?"
        options={[
          'Kubernetes cannot run Node.js applications',
          'The Gateway does not support shared session state across replicas',
          'GKE does not support persistent volumes',
          'GPU nodes cannot run in GKE',
        ]}
        correctIndex={1}
        explanation="The OpenClaw Gateway stores session state in memory. Without external shared storage for sessions, multiple replicas would each have their own isolated session state, meaning a user could be routed to different replicas and lose conversation context. This requires session affinity or external session storage to work correctly."
      />

      <ReferenceList
        references={[
          {
            title: 'GKE Documentation',
            url: 'https://cloud.google.com/kubernetes-engine/docs',
            type: 'docs',
            description: 'Official Google Kubernetes Engine documentation.',
          },
          {
            title: 'GKE Workload Identity',
            url: 'https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity',
            type: 'docs',
            description: 'Securely connect Kubernetes workloads to GCP services.',
          },
        ]}
      />
    </div>
  )
}
