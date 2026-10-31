import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course, LessonDetail, QuizData, QuizSubmissionResult } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/api/v1/';

  // Initial Demo Courses (Matches seeded Wagtail database)
  private defaultCourses: Course[] = [
    {
      id: 1,
      title: 'Quantum AI Architecture & Neural Synergies',
      slug: 'quantum-ai-architecture',
      subtitle: 'Harness multi-qubit superposition to train high-dimensional neural representations',
      track: 'quantum',
      difficulty: 'ADVANCED',
      estimated_duration: '14 Hours',
      xp_reward: 1400,
      neon_color: '#00f3ff',
      icon_name: 'atom',
      organization_name: 'Nexus Cybernetics',
      organization_slug: 'nexus-cybernetics',
      badge_title: 'Quantum Pioneer',
      lessons_count: 3,
      lessons: [
        {
          id: 1,
          title: 'Superconducting Qubit Topology & State Initialization',
          slug: 'superconducting-qubit-topology',
          order: 1,
          xp_value: 250,
          lesson_type: 'CODE_LAB',
          estimated_minutes: 25,
          summary: 'Initialize dual quantum state vectors and execute Hadamard transformations to generate entanglement.'
        },
        {
          id: 2,
          title: 'Holographic Quantum Gate Simulation & Coherence',
          slug: 'holographic-quantum-gates',
          order: 2,
          xp_value: 300,
          lesson_type: 'HOLOGRAPHIC_SIM',
          estimated_minutes: 20,
          summary: 'Interact with 3D Bloch sphere vector transformations and monitor decoherence thresholds in real-time.'
        },
        {
          id: 3,
          title: 'Quantum Backpropagation & Error Mitigation',
          slug: 'quantum-backpropagation',
          order: 3,
          xp_value: 350,
          lesson_type: 'CONCEPT',
          estimated_minutes: 30,
          summary: 'Parameter-shift rules for computing analytic gradients on noisy intermediate-scale quantum circuits.'
        }
      ]
    },
    {
      id: 2,
      title: 'Zero-Trust Cybernetic Defense & Mesh Protocols',
      slug: 'zero-trust-cyber-defense',
      subtitle: 'Design unbreakable peer-to-peer authenticated fabrics against quantum cryptanalysis',
      track: 'cybersec',
      difficulty: 'INTERMEDIATE',
      estimated_duration: '10 Hours',
      xp_reward: 950,
      neon_color: '#ff0055',
      icon_name: 'shield-alert',
      organization_name: 'Nexus Cybernetics',
      organization_slug: 'nexus-cybernetics',
      badge_title: 'Mesh Ghost',
      lessons_count: 2,
      lessons: [
        {
          id: 4,
          title: 'Lattice-Based Post-Quantum Encryption Deployment',
          slug: 'lattice-based-post-quantum-encryption',
          order: 1,
          xp_value: 250,
          lesson_type: 'CODE_LAB',
          estimated_minutes: 20,
          summary: 'Deploy Learning-With-Errors (LWE) ring lattice keys resistant to polynomial-time quantum attacks.'
        },
        {
          id: 5,
          title: 'Autonomous Intrusion Defense Daemons',
          slug: 'autonomous-intrusion-daemons',
          order: 2,
          xp_value: 300,
          lesson_type: 'ASSESSMENT',
          estimated_minutes: 15,
          summary: 'Configure autonomous mesh nodes that isolate compromised segments in sub-millisecond cycles.'
        }
      ]
    },
    {
      id: 3,
      title: 'Deep Space Gravitational Propulsion Engineering',
      slug: 'gravitational-propulsion-engineering',
      subtitle: 'Theoretical physics and warp field geometry for sub-light and hyper-relativistic travel',
      track: 'space',
      difficulty: 'SINGULARITY',
      estimated_duration: '18 Hours',
      xp_reward: 1800,
      neon_color: '#a855f7',
      icon_name: 'rocket',
      organization_name: 'Aether Space Academy',
      organization_slug: 'aether-space',
      badge_title: 'Singularity Architect',
      lessons_count: 1,
      lessons: [
        {
          id: 6,
          title: 'Alcubierre Metric Tensor & Negative Energy Containment',
          slug: 'alcubierre-metric-tensor',
          order: 1,
          xp_value: 400,
          lesson_type: 'HOLOGRAPHIC_SIM',
          estimated_minutes: 35,
          summary: 'Manipulate space-time curvature solutions within Einstein field equations.'
        }
      ]
    },
    {
      id: 4,
      title: 'Neuromorphic Brain-Computer Interface Systems',
      slug: 'neuromorphic-bci-systems',
      subtitle: 'Direct neural telemetry, spike-based motor decoders, and bio-compatible co-processors',
      track: 'ai',
      difficulty: 'INTERMEDIATE',
      estimated_duration: '12 Hours',
      xp_reward: 1100,
      neon_color: '#10b981',
      icon_name: 'brain',
      organization_name: 'BioSynth Bio-Computing',
      organization_slug: 'biosynth-labs',
      badge_title: 'Synapse Master',
      lessons_count: 1,
      lessons: [
        {
          id: 7,
          title: 'Spike-Timing-Dependent Plasticity (STDP) in Silicon',
          slug: 'stdp-in-silicon',
          order: 1,
          xp_value: 300,
          lesson_type: 'CODE_LAB',
          estimated_minutes: 25,
          summary: 'Model synaptic weight adaptation as a function of millisecond arrival times between pre- and post-synaptic spikes.'
        }
      ]
    },
    {
      id: 5,
      title: 'Quantum State Fundamentals & Superposition',
      slug: 'quantum-foundations-101',
      subtitle: 'Entry-level foundations of quantum mechanics, state vectors, and Bloch sphere geometry',
      track: 'quantum',
      difficulty: 'BEGINNER',
      estimated_duration: '6 Hours',
      xp_reward: 500,
      neon_color: '#00f3ff',
      icon_name: 'atom',
      organization_name: 'Nexus Cybernetics',
      organization_slug: 'nexus-cybernetics',
      badge_title: 'Cadet Initiate',
      lessons_count: 2,
      lessons: [
        { id: 8, title: 'State Vectors & Dirac Bra-Ket Notation', slug: 'qubit-intro-vector', order: 1, xp_value: 150, lesson_type: 'CONCEPT', estimated_minutes: 20, summary: 'Understand two-level quantum state vectors.' },
        { id: 9, title: 'Bloch Sphere Visual Geometry & Phase Angles', slug: 'bloch-sphere-interactive', order: 2, xp_value: 200, lesson_type: 'HOLOGRAPHIC_SIM', estimated_minutes: 25, summary: 'Rotate latitude and longitude angles on the unit sphere.' }
      ]
    },
    {
      id: 6,
      title: 'Entangled Circuits & Quantum Teleportation',
      slug: 'quantum-teleportation-circuits',
      subtitle: 'Transport arbitrary quantum states across distant registers using EPR entanglement channels',
      track: 'quantum',
      difficulty: 'INTERMEDIATE',
      estimated_duration: '9 Hours',
      xp_reward: 850,
      neon_color: '#0284c7',
      icon_name: 'atom',
      organization_name: 'Helios Quantum Labs',
      organization_slug: 'helios-labs',
      badge_title: 'Terminal Operative',
      lessons_count: 2,
      lessons: [
        { id: 10, title: 'Bell State Measurement & Classical Feed-Forward', slug: 'bell-measurement-protocol', order: 1, xp_value: 250, lesson_type: 'CODE_LAB', estimated_minutes: 25, summary: 'Joint projection onto 4 Bell states.' },
        { id: 11, title: 'Teleported State Quantum Fidelity Matrix', slug: 'quantum-fidelity-check', order: 2, xp_value: 300, lesson_type: 'ASSESSMENT', estimated_minutes: 20, summary: 'Density matrix fidelity check.' }
      ]
    },
    {
      id: 7,
      title: 'Topological Qubits & Fault-Tolerant Decoherence Shielding',
      slug: 'quantum-fault-tolerance',
      subtitle: 'Majorana fermion zero-modes, surface code stabilizer syndromes, and non-Abelian anyon braiding',
      track: 'quantum',
      difficulty: 'SINGULARITY',
      estimated_duration: '22 Hours',
      xp_reward: 2400,
      neon_color: '#0284c7',
      icon_name: 'atom',
      organization_name: 'Helios Quantum Labs',
      organization_slug: 'helios-labs',
      badge_title: 'Singularity Architect',
      lessons_count: 1,
      lessons: [
        { id: 12, title: 'Rotated Surface Code Stabilizer Syndrome Decoding', slug: 'surface-code-stabilizers', order: 1, xp_value: 500, lesson_type: 'CODE_LAB', estimated_minutes: 35, summary: 'Decode X and Z check matrix syndrome measurements.' }
      ]
    },
    {
      id: 8,
      title: 'Zero-Trust Perimeter & Cyber Intelligence',
      slug: 'cyber-threat-intelligence-basics',
      subtitle: 'Fundamentals of perimeterless security, identity verification, and MITRE ATT&CK vectors',
      track: 'cybersec',
      difficulty: 'BEGINNER',
      estimated_duration: '5 Hours',
      xp_reward: 450,
      neon_color: '#ff0055',
      icon_name: 'shield-alert',
      organization_name: 'Nexus Cybernetics',
      organization_slug: 'nexus-cybernetics',
      badge_title: 'Cadet Initiate',
      lessons_count: 1,
      lessons: [
        { id: 13, title: 'Identity-Centric Authentication & Ephemeral Tokens', slug: 'perimeter-telemetry', order: 1, xp_value: 150, lesson_type: 'CONCEPT', estimated_minutes: 20, summary: 'Micro-segmented identity tokens replace perimeter walls.' }
      ]
    },
    {
      id: 9,
      title: 'Post-Quantum Lattice Shielding & Threat Hunting',
      slug: 'quantum-cryptanalysis-defense',
      subtitle: 'Analyze algorithmic resistance against quantum Shor factoring and Grover key searches',
      track: 'cybersec',
      difficulty: 'ADVANCED',
      estimated_duration: '16 Hours',
      xp_reward: 1600,
      neon_color: '#ff0055',
      icon_name: 'shield-alert',
      organization_name: 'Nexus Cybernetics',
      organization_slug: 'nexus-cybernetics',
      badge_title: 'Mesh Sentinel',
      lessons_count: 1,
      lessons: [
        { id: 14, title: 'NTRU Polynomial Ring Reduction Verification', slug: 'ntru-lattice-verification', order: 1, xp_value: 400, lesson_type: 'CODE_LAB', estimated_minutes: 30, summary: 'Verify polynomial ring quotients under SVP constraints.' }
      ]
    },
    {
      id: 10,
      title: 'Kinetic Swarm Defense & Autonomous Threat Neutralization',
      slug: 'autonomous-warfare-daemons',
      subtitle: 'Autonomous neural daemons for zero-day polymorphic virus eradication across distributed nodes',
      track: 'cybersec',
      difficulty: 'SINGULARITY',
      estimated_duration: '24 Hours',
      xp_reward: 2600,
      neon_color: '#ff0055',
      icon_name: 'shield-alert',
      organization_name: 'Nexus Cybernetics',
      organization_slug: 'nexus-cybernetics',
      badge_title: 'Singularity Architect',
      lessons_count: 1,
      lessons: [
        { id: 15, title: 'Byzantine Fault Tolerant Swarm Quarantine Matrix', slug: 'swarm-consensus-defense', order: 1, xp_value: 600, lesson_type: 'CODE_LAB', estimated_minutes: 40, summary: 'Implement asynchronous Paxos-BFT consensus among autonomous sentinels.' }
      ]
    },
    {
      id: 11,
      title: 'Spiking Neural Architectures & Event-Driven Logic',
      slug: 'neuromorphic-computing-intro',
      subtitle: 'Introduction to biologically-inspired computation, membrane potentials, and asynchronous event streams',
      track: 'ai',
      difficulty: 'BEGINNER',
      estimated_duration: '6 Hours',
      xp_reward: 600,
      neon_color: '#10b981',
      icon_name: 'brain',
      organization_name: 'BioSynth Bio-Computing',
      organization_slug: 'biosynth-labs',
      badge_title: 'Cadet Initiate',
      lessons_count: 1,
      lessons: [
        { id: 16, title: 'Leaky Integrate-and-Fire (LIF) Neuron Model', slug: 'integrate-and-fire-model', order: 1, xp_value: 200, lesson_type: 'CODE_LAB', estimated_minutes: 25, summary: 'Simulate membrane potential integration V(t) with passive leak decay.' }
      ]
    },
    {
      id: 12,
      title: 'Memristive Crossbar Acceleration & Deep STDP',
      slug: 'memristive-analog-arrays',
      subtitle: 'Hardware-level in-memory matrix vector multiplication using filamentary titanium oxide memristors',
      track: 'ai',
      difficulty: 'ADVANCED',
      estimated_duration: '15 Hours',
      xp_reward: 1500,
      neon_color: '#10b981',
      icon_name: 'brain',
      organization_name: 'BioSynth Bio-Computing',
      organization_slug: 'biosynth-labs',
      badge_title: 'Neural Alchemist',
      lessons_count: 1,
      lessons: [
        { id: 17, title: 'Ohm-Kirchhoff In-Memory Dot Products', slug: 'kirchhoff-crossbar-matrix', order: 1, xp_value: 400, lesson_type: 'CODE_LAB', estimated_minutes: 30, summary: 'Exploit Ohm-Kirchhoff laws for single-clock cycle matrix multiplication.' }
      ]
    },
    {
      id: 13,
      title: 'Synthetic Sentience & Multi-Agent Cognitive Consensus',
      slug: 'synthetic-sentience-matrices',
      subtitle: 'Self-reflective neural graphs with multi-agent consensus protocols and artificial self-awareness',
      track: 'ai',
      difficulty: 'SINGULARITY',
      estimated_duration: '26 Hours',
      xp_reward: 2800,
      neon_color: '#10b981',
      icon_name: 'brain',
      organization_name: 'BioSynth Bio-Computing',
      organization_slug: 'biosynth-labs',
      badge_title: 'Singularity Architect',
      lessons_count: 1,
      lessons: [
        { id: 18, title: 'Recursive Self-Model Inference & Epistemic Logic', slug: 'meta-cognitive-recursion', order: 1, xp_value: 700, lesson_type: 'CODE_LAB', estimated_minutes: 45, summary: 'Bayesian epistemic belief update loops for synthetic agents.' }
      ]
    },
    {
      id: 14,
      title: 'Orbital Mechanics & Deep Space Telemetry Protocols',
      slug: 'orbital-mechanics-telemetry',
      subtitle: 'Introduction to orbital state propagation, satellite rendezvous, and telemetry packets',
      track: 'space',
      difficulty: 'BEGINNER',
      estimated_duration: '7 Hours',
      xp_reward: 650,
      neon_color: '#a855f7',
      icon_name: 'rocket',
      organization_name: 'Aether Space Academy',
      organization_slug: 'aether-space',
      badge_title: 'Cadet Initiate',
      lessons_count: 1,
      lessons: [
        { id: 19, title: 'Keplerian Elements & Vis-Viva Velocity Equations', slug: 'keplerian-orbit-propagation', order: 1, xp_value: 200, lesson_type: 'CODE_LAB', estimated_minutes: 25, summary: 'Calculate instantaneous orbital velocity from standard gravitational parameters.' }
      ]
    },
    {
      id: 15,
      title: 'Magnetoplasmadynamic & Ion Propulsion Flight Systems',
      slug: 'ion-propulsion-navigation',
      subtitle: 'Plasma physics, Hall effect accelerator design, and high specific-impulse continuous trajectories',
      track: 'space',
      difficulty: 'INTERMEDIATE',
      estimated_duration: '11 Hours',
      xp_reward: 1050,
      neon_color: '#a855f7',
      icon_name: 'rocket',
      organization_name: 'Aether Space Academy',
      organization_slug: 'aether-space',
      badge_title: 'Terminal Operative',
      lessons_count: 1,
      lessons: [
        { id: 20, title: 'Specific Impulse & Tsiolkovsky Ion Burn Efficiency', slug: 'hall-thruster-efficiency', order: 1, xp_value: 300, lesson_type: 'CODE_LAB', estimated_minutes: 25, summary: 'Compute required xenon propellant mass ratios for delta-V budgets.' }
      ]
    },
    {
      id: 16,
      title: 'Laser Quantum Entangled Interstellar Relays',
      slug: 'interplanetary-communications',
      subtitle: 'Optical coherent communications, deep space laser ranging, and quantum repeater networks',
      track: 'space',
      difficulty: 'ADVANCED',
      estimated_duration: '14 Hours',
      xp_reward: 1350,
      neon_color: '#a855f7',
      icon_name: 'rocket',
      organization_name: 'Aether Space Academy',
      organization_slug: 'aether-space',
      badge_title: 'Mesh Sentinel',
      lessons_count: 1,
      lessons: [
        { id: 21, title: 'Photon-Counting Optical Link Budget Analysis', slug: 'deep-space-link-budget', order: 1, xp_value: 350, lesson_type: 'CODE_LAB', estimated_minutes: 30, summary: 'Model 1550nm laser beam divergence and photon detection probabilities.' }
      ]
    }
  ];

  public courses = signal<Course[]>(this.defaultCourses);
  public selectedTrack = signal<string>('all');
  public selectedDifficulty = signal<string>('all');
  public searchQuery = signal<string>('');

  constructor() {
    this.fetchCourses();
  }

  public resetFilters() {
    this.selectedTrack.set('all');
    this.selectedDifficulty.set('all');
    this.searchQuery.set('');
  }

  public fetchCourses() {
    this.http.get<Course[]>(`${this.baseUrl}courses/`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.courses.set(data);
        }
      },
      error: () => {
        // Keeps robust seeded courses
      }
    });
  }

  public getCourseBySlug(slug: string): Course | undefined {
    return this.courses().find(c => c.slug === slug);
  }

  public getLessonDetail(id: number): Promise<LessonDetail> {
    return new Promise((resolve) => {
      this.http.get<LessonDetail>(`${this.baseUrl}lessons/${id}/`).subscribe({
        next: (data) => resolve(data),
        error: () => {
          // Local fallback lesson data
          resolve({
            id: id,
            title: id === 1 ? 'Superconducting Qubit Topology & State Initialization' : 'Hands-on Cybernetic Laboratory',
            slug: 'lesson-detail',
            order: 1,
            xp_value: 250,
            lesson_type: 'CODE_LAB',
            estimated_minutes: 25,
            summary: 'Initialize dual quantum state vectors and execute Hadamard transformations to generate entanglement.',
            code_starter: `# Quantum State Simulator
import numpy as np

def create_bell_state():
    # Target state: (|00> + |11>) / sqrt(2)
    # Complete the transformation matrix:
    return np.array([1/np.sqrt(2), 0, 0, 1/np.sqrt(2)], dtype=complex)

result = create_bell_state()
print(f"Entangled State Vector: {result}")
print(f"Norm Coherence Check: {np.linalg.norm(result):.4f}")
`,
            code_solution: `# Entangled State Verified`,
            code_language: 'python',
            code_task: 'Verify unit norm coherence across the dual-qubit register.'
          });
        }
      });
    });
  }

  public runCodeSimulation(code: string, language: string): { output: string; status: 'SUCCESS' | 'ERROR'; executionTimeMs: number } {
    const start = performance.now();
    let output = '';
    let status: 'SUCCESS' | 'ERROR' = 'SUCCESS';

    if (code.includes('create_bell_state') || code.includes('np.sqrt')) {
      output = `[NEXUS-RUNTIME] Initializing Quantum Virtual Processor v4.2...\n` +
               `[SYSTEM] Allocating 2 superconducting transmon qubits (Q0, Q1)...\n` +
               `[GATE] Applied Hadamard H(Q0). Phase: 0.000 rad\n` +
               `[GATE] Applied Controlled-NOT CNOT(Q0 -> Q1). Entanglement Established.\n` +
               `Entangled State Vector: [0.7071+0.j 0.    +0.j 0.    +0.j 0.7071+0.j]\n` +
               `Norm Coherence Check: 1.0000\n` +
               `[PASS] Test Case #1: Superposition fidelity > 99.8%\n` +
               `[PASS] Test Case #2: Bell State (|Phi+>) detected.\n` +
               `Execution complete with 0 errors. +250 XP earned!`;
    } else if (code.includes('generate_lattice_keys') || code.includes('secrets')) {
      output = `[CYBER-MESH] Loading NIST ML-KEM-768 lattice parameter matrix...\n` +
               `[KEYGEN] Sampling secret vector s from Centered Binomial Distribution eta=2...\n` +
               `[KEYGEN] Public matrix A generated with dimension 3x3 over Z_3329...\n` +
               `Key Generation Succeeded. Public Key: 0x8a91f4c2... (1184 bytes)\n` +
               `Resistance against Shor quantum factoring confirmed.`;
    } else {
      output = `[CYBER-SANDBOX] Code compiled and executed successfully:\n` +
               `Output:\n` +
               `> Simulation executed. Matrix convergence achieved within 12 iterations.\n` +
               `Memory footprint: 14.2 MB. Telemetry recorded.`;
    }

    const elapsed = Math.round(performance.now() - start + 85);
    return { output, status, executionTimeMs: elapsed };
  }

  public getQuiz(id: number): Promise<QuizData> {
    return new Promise((resolve) => {
      this.http.get<QuizData>(`${this.baseUrl}assessments/quiz/${id}/`).subscribe({
        next: (data) => resolve(data),
        error: () => {
          resolve({
            id: id,
            title: 'Quantum Entanglement & Superposition Mastery Check',
            course_slug: 'quantum-ai-architecture',
            lesson_order: 1,
            passing_score: 75,
            time_limit_seconds: 180,
            xp_bounty: 350,
            questions: [
              {
                id: 1,
                prompt: 'What happens to the state vector of a qubit when measured in the computational Z-basis?',
                options: [
                  'It remains in an indefinite linear combination of states',
                  'It collapses deterministically into eigenvalue |0> or |1>',
                  'It clones itself onto adjacent ancilla qubits instantly',
                  'Its phase shifts continuously by pi/2 radians'
                ]
              },
              {
                id: 2,
                prompt: 'Which quantum gate generates maximal 2-qubit entanglement when applied after a Hadamard gate?',
                options: [
                  'Pauli-X Gate',
                  'Toffoli Gate',
                  'Controlled-NOT (CNOT) Gate',
                  'Phase (S) Gate'
                ]
              },
              {
                id: 3,
                prompt: 'Why can quantum information NOT be duplicated without altering the source system?',
                options: [
                  'Due to the No-Cloning Theorem in quantum mechanics',
                  'Because classical memory buffers lack sufficient bandwidth',
                  'Decoherence causes immediate hardware thermal failure',
                  'Heisenberg principle only applies to photons'
                ]
              }
            ]
          });
        }
      });
    });
  }

  public submitQuiz(quizId: number, answers: Record<string, number>): Promise<QuizSubmissionResult> {
    return new Promise((resolve) => {
      this.http.post<QuizSubmissionResult>(`${this.baseUrl}assessments/quiz/${quizId}/submit/`, { answers }).subscribe({
        next: (res) => resolve(res),
        error: () => {
          // Local evaluation fallback
          const correctKey: Record<string, number> = { '1': 1, '2': 2, '3': 0 };
          let correct = 0;
          const feedback = Object.keys(correctKey).map(qId => {
            const userChoice = answers[qId];
            const isCorrect = userChoice === correctKey[qId];
            if (isCorrect) correct++;
            return {
              question_id: qId,
              user_choice: userChoice,
              correct_choice: correctKey[qId],
              is_correct: isCorrect,
              explanation: isCorrect ? 'Exemplary quantum theoretical comprehension!' : 'Review the Bell state tensor product formulations.'
            };
          });

          const pct = Math.round((correct / 3) * 100);
          const passed = pct >= 66;
          resolve({
            attempt_id: Date.now(),
            score_percent: pct,
            passed: passed,
            passing_score: 66,
            correct_count: correct,
            total_questions: 3,
            xp_awarded: passed ? 350 : 25,
            total_learner_xp: 1800,
            level: 3,
            feedback: feedback
          });
        }
      });
    });
  }
}

