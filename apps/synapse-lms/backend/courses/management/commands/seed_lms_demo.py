import json
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from wagtail.models import Page, Site
from tenancy.models import Organization
from gamification.models import Badge, SkillNode, Quest, LearnerProfile
from courses.models import CourseIndexPage, CoursePage, LessonPage
from assessments.models import CyberQuiz


class Command(BaseCommand):
    help = "Seeds the futuristic Synapse LMS with default organizations, courses, lessons, quests, badges, and skill trees."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Initializing Futuristic Synapse LMS Seeder..."))

        # 1. Admin Superuser
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@synapse.io", "cyberadmin2026")
            self.stdout.write(self.style.SUCCESS("✓ Superuser created: admin / cyberadmin2026"))

        # 2. Organizations (Multi-Tenancy)
        nexus_org, _ = Organization.objects.get_or_create(
            slug="nexus-cybernetics",
            defaults={
                "name": "Nexus Cybernetics",
                "subdomain": "nexus",
                "slogan": "Pioneering Quantum-Cognitive Architectures",
                "primary_color": "#00f3ff",
                "secondary_color": "#a855f7",
                "accent_color": "#ff0055",
                "theme_preset": "cyber_neon",
                "font_preset": "orbitron",
                "default_mode": "dark",
                "seat_capacity": 1000,
                "active_learners": 128,
            }
        )

        aether_org, _ = Organization.objects.get_or_create(
            slug="aether-space",
            defaults={
                "name": "Aether Space Academy",
                "subdomain": "aether",
                "slogan": "Advanced Gravitational Propulsion & Interplanetary Navigation",
                "primary_color": "#a855f7",
                "secondary_color": "#3b82f6",
                "accent_color": "#f59e0b",
                "theme_preset": "quantum_void",
                "font_preset": "space_grotesk",
                "default_mode": "dark",
                "seat_capacity": 500,
                "active_learners": 85,
            }
        )

        biosynth_org, _ = Organization.objects.get_or_create(
            slug="biosynth-labs",
            defaults={
                "name": "BioSynth Bio-Computing",
                "subdomain": "biosynth",
                "slogan": "Synthetic Neuromorphic Biology & Organic Circuits",
                "primary_color": "#10b981",
                "secondary_color": "#06b6d4",
                "accent_color": "#ec4899",
                "theme_preset": "matrix_emerald",
                "font_preset": "jetbrains",
                "default_mode": "dark",
                "seat_capacity": 750,
                "active_learners": 94,
            }
        )

        helios_org, _ = Organization.objects.get_or_create(
            slug="helios-labs",
            defaults={
                "name": "Helios Quantum Labs",
                "subdomain": "helios",
                "slogan": "Photonic Quantum Metrology & Holographic Systems",
                "primary_color": "#0284c7",
                "secondary_color": "#8b5cf6",
                "accent_color": "#f43f5e",
                "theme_preset": "solar_light",
                "font_preset": "space_grotesk",
                "default_mode": "light",
                "seat_capacity": 1200,
                "active_learners": 156,
            }
        )
        self.stdout.write(self.style.SUCCESS("✓ Organizations seeded: Nexus Cybernetics, Aether Space, BioSynth, Helios Quantum"))

        # 3. Badges (Covering all 4 rarities)
        badges_data = [
            ("cadet-initiate", "Cadet Initiate", "Completed first interactive terminal simulation module", "terminal", "COMMON", 100),
            ("terminal-operative", "Terminal Operative", "Executed 50 hands-on cybernetic terminal commands", "terminal", "COMMON", 150),
            ("synapse-master", "Synapse Master", "Constructed a 4-layer neuromorphic spiking neural network", "cpu", "RARE", 250),
            ("mesh-sentinel", "Mesh Sentinel", "Deployed automated zero-trust inspection nodes across perimeter", "shield-check", "RARE", 300),
            ("mesh-ghost", "Mesh Ghost", "Successfully neutralised 10 automated cyber intrusions", "shield-check", "EPIC", 350),
            ("neural-alchemist", "Neural Alchemist", "Designed self-adapting STDP neuromorphic memristor circuits", "cpu", "EPIC", 450),
            ("quantum-pioneer", "Quantum Pioneer", "Mastered superposition matrix algorithms & coherent qubits", "atom", "LEGENDARY", 500),
            ("singularity-architect", "Singularity Architect", "Unlocked highest-tier node in all knowledge webs", "sparkles", "LEGENDARY", 1000),
        ]
        created_badges = {}
        for code, title, desc, icon, rarity, xp in badges_data:
            badge, _ = Badge.objects.get_or_create(
                code=code,
                defaults={"title": title, "description": desc, "icon_name": icon, "rarity": rarity, "xp_bonus": xp}
            )
            created_badges[code] = badge
        self.stdout.write(self.style.SUCCESS("✓ 8 Badges across all rarities seeded"))

        # 4. Quests (Daily, Weekly, Special)
        quests_data = [
            ("daily-login", "Daily Synapse Handshake", "Synchronize with your command dashboard telemetry node", "DAILY", "login", 1, 100, "zap"),
            ("complete-lab", "Qubit Matrix Compilation", "Execute and compile an interactive code sandbox script with 0 syntax errors", "DAILY", "code_executed", 1, 250, "check-circle"),
            ("run-terminal", "Terminal Command Sprint", "Execute 3 hands-on cybernetic command simulations", "DAILY", "terminal_commands", 3, 150, "terminal"),
            ("weekly-quizzes", "Cyber Assessment Mastery", "Pass 3 timed competency quizzes with >= 75% accuracy score", "WEEKLY", "quizzes_passed", 3, 600, "target"),
            ("weekly-lessons", "Curriculum Module Pioneer", "Complete 5 interactive syllabus modules across any active track", "WEEKLY", "lessons_completed", 5, 800, "flame"),
            ("streak-master", "7-Day Hack Streak", "Maintain uninterrupted daily learning connection for 7 continuous solar days", "WEEKLY", "streak_days", 7, 500, "flame"),
            ("special-entanglement", "Bell State Generation Protocol", "Synthesize a 2-qubit maximally entangled Bell state vector in quantum simulator", "SPECIAL", "entangled_bell", 1, 1000, "atom"),
            ("special-singularity", "Singularity Node Ascension", "Unlock any Tier 04 Singularity competency node in the Neural Skill Web", "SPECIAL", "tier4_unlocked", 1, 1500, "sparkles"),
        ]
        for code, title, desc, q_type, target_m, target_c, xp, icon in quests_data:
            Quest.objects.get_or_create(
                code=code,
                defaults={
                    "title": title, "description": desc, "quest_type": q_type,
                    "target_metric": target_m, "target_count": target_c, "xp_reward": xp, "icon": icon, "is_active": True
                }
            )
        self.stdout.write(self.style.SUCCESS("✓ 8 Quests (Daily, Weekly, Special) seeded"))

        # 5. Skill Tree Nodes (16 nodes, 4 Tiers across all 4 Tracks)
        skills_data = [
            # Quantum Track
            ("quantum-basics", "Quantum Superposition Fundamentals", "quantum", 1, None, "Foundational state vectors, Bra-Ket Dirac notation, and qubit state bloch projections.", 200, "atom", True, 1),
            ("qubit-gates", "Unitary Multi-Qubit Operators", "quantum", 2, "quantum-basics", "Hadamard, Pauli-X/Y/Z, Phase, and Controlled-NOT quantum logic circuits.", 350, "git-commit", False, 2),
            ("quantum-algorithms", "Grover & Shor Algorithmic Circuits", "quantum", 3, "qubit-gates", "Quantum phase estimation, unstructured database search, and modular exponentiation.", 650, "cpu", False, 3),
            ("fault-tolerant-quantum", "Topological Fault-Tolerant Decoherence Shielding", "quantum", 4, "quantum-algorithms", "Surface codes, anyonic braiding, and threshold theorems for cryogenic quantum error correction.", 1000, "sparkles", False, 4),

            # Cyber Defense Track
            ("zero-trust-foundations", "Zero-Trust Architecture", "cybersec", 1, None, "Continuous authentication, least privilege identity, and dynamic microsegmentation principles.", 200, "lock", True, 1),
            ("post-quantum-crypto", "Post-Quantum Lattice Cryptography", "cybersec", 2, "zero-trust-foundations", "Kyber-768 ML-KEM and Dilithium ML-DSA NIST post-quantum cryptographic schemes.", 400, "key", False, 2),
            ("autonomous-defense", "Autonomous Cyber-Mesh Daemons", "cybersec", 3, "post-quantum-crypto", "Deploy self-healing packet inspectors that isolate rogue nodes in sub-millisecond cycles.", 700, "shield", False, 3),
            ("cognitive-neutralization", "Cognitive Kinetic Threat Neutralization", "cybersec", 4, "autonomous-defense", "AI-driven kinetic countermeasures for adversarial model attacks and polymorphic worms.", 1100, "crosshair", False, 4),

            # AI & Neuromorphic Track
            ("spiking-networks", "Spiking Neural Networks (SNN)", "ai", 1, None, "Temporal spike encoding, leaky integrate-and-fire models, and event-driven neuromorphic computation.", 250, "activity", True, 1),
            ("synaptic-plasticity", "STDP Synaptic Plasticity", "ai", 2, "spiking-networks", "Spike-timing-dependent plasticity for continuous online edge learning without backpropagation.", 450, "git-merge", False, 2),
            ("neuromorphic-circuits", "Neuromorphic Memristor Arrays", "ai", 3, "synaptic-plasticity", "Analog crossbar hardware acceleration with ultra-low nano-watt power draw.", 800, "cpu", False, 3),
            ("synthetic-cognition", "Synthetic Sentience Consensus Matrix", "ai", 4, "neuromorphic-circuits", "Self-reflective neural graphs with multi-agent cognitive consensus and meta-learning.", 1200, "brain", False, 4),

            # Aero-Space Track
            ("orbital-telemetry", "Orbital Telemetry & Flight Coordinates", "space", 1, None, "Astrodynamics, orbital state vectors, Keplerian orbital elements, and Hohmann transfers.", 200, "radio", True, 1),
            ("ion-drives", "Magnetoplasmadynamic & Ion Drives", "space", 2, "orbital-telemetry", "Hall-effect thrusters, xenon plasma acceleration, and continuous low-thrust orbital trajectory spirals.", 400, "rocket", False, 2),
            ("gravity-slingshot", "Relativistic Gravitational Slingshot", "space", 3, "ion-drives", "Planetary gravity assist vector optimization and hyper-relativistic frame-dragging maneuvers.", 750, "compass", False, 3),
            ("warp-geometry", "Alcubierre Space-Time Curvature Tensor", "space", 4, "gravity-slingshot", "Solutions to Einstein field equations for metric expansion of space and negative energy density shielding.", 1250, "sparkles", False, 4),
        ]
        for slug, title, track, tier, p_slug, desc, xp, icon, unl, ord_num in skills_data:
            SkillNode.objects.get_or_create(
                slug=slug,
                defaults={
                    "title": title, "track": track, "tier": tier, "parent_slug": p_slug,
                    "description": desc, "xp_cost": xp, "icon": icon, "is_unlocked_default": unl, "order": ord_num
                }
            )
        self.stdout.write(self.style.SUCCESS("✓ 16 Skill Tree Nodes (4 Tiers across all 4 Tracks) seeded"))

        # 6. Wagtail Page Hierarchy
        root_page = Page.objects.filter(slug="home").first() or Page.objects.get(id=1)
        
        course_index = CourseIndexPage.objects.filter(slug="courses").first()
        if not course_index:
            course_index = CourseIndexPage(
                title="Futuristic Curriculum",
                slug="courses",
                intro="<p>Access mission-critical cybernetic knowledge tracks. Earn XP, elevate clearance levels, and deploy live prototypes.</p>"
            )
            root_page.add_child(instance=course_index)
            course_index.save_revision().publish()

        self.stdout.write(self.style.SUCCESS("✓ CourseIndexPage verified"))

        # 16 Comprehensive Courses: 4 tracks x 4 difficulty tiers
        courses_catalog = [
            # Track: Quantum
            {
                "slug": "quantum-foundations-101",
                "title": "Quantum State Fundamentals & Superposition",
                "subtitle": "Entry-level foundations of quantum mechanics, state vectors, and Bloch sphere geometry",
                "org": nexus_org,
                "track": "quantum",
                "difficulty": "BEGINNER",
                "duration": "6 Hours",
                "xp": 500,
                "color": "#00f3ff",
                "icon": "atom",
                "badge": created_badges.get("cadet-initiate"),
                "lessons": [
                    {
                        "slug": "qubit-intro-vector",
                        "title": "State Vectors & Dirac Bra-Ket Notation",
                        "order": 1, "xp": 150, "type": "CONCEPT", "minutes": 20,
                        "summary": "Understand how a single two-level quantum system represents information simultaneously as |0> and |1>.",
                    },
                    {
                        "slug": "bloch-sphere-interactive",
                        "title": "Bloch Sphere Visual Geometry & Phase Angles",
                        "order": 2, "xp": 200, "type": "HOLOGRAPHIC_SIM", "minutes": 25,
                        "summary": "Rotate latitude and longitude angles on the 3D unit sphere to observe phase superposition states.",
                    },
                    {
                        "slug": "hadamard-quantum-sandbox",
                        "title": "Hands-On Hadamard Gate Transformation",
                        "order": 3, "xp": 150, "type": "CODE_LAB", "minutes": 20,
                        "summary": "Apply 2x2 unitary Hadamard matrix operators to map computational basis states to equal superpositions.",
                        "lang": "python",
                        "task": "Construct a Hadamard matrix operator and compute H|0>.",
                        "starter": "# Quantum Hadamard Operator\nimport numpy as np\n\ndef apply_hadamard():\n    H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)\n    state_0 = np.array([1, 0])\n    return np.dot(H, state_0)\n\nprint('Resulting Superposition State:', apply_hadamard())\n",
                        "solution": "# Verified Hadamard Superposition\nimport numpy as np\n\ndef apply_hadamard():\n    H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)\n    return np.dot(H, np.array([1, 0]))\n",
                    }
                ]
            },
            {
                "slug": "quantum-teleportation-circuits",
                "title": "Entangled Circuits & Quantum Teleportation",
                "subtitle": "Transport arbitrary quantum states across distant registers using Einstein-Podolsky-Rosen channels",
                "org": helios_org,
                "track": "quantum",
                "difficulty": "INTERMEDIATE",
                "duration": "9 Hours",
                "xp": 850,
                "color": "#0284c7",
                "icon": "atom",
                "badge": created_badges.get("terminal-operative"),
                "lessons": [
                    {
                        "slug": "bell-measurement-protocol",
                        "title": "Bell State Measurement & Classical Feed-Forward",
                        "order": 1, "xp": 250, "type": "CODE_LAB", "minutes": 25,
                        "summary": "Perform a joint projection onto the 4 Bell basis states and transmit classical correction bits.",
                        "lang": "python",
                        "task": "Simulate Alice measuring her two qubits in the Bell basis.",
                        "starter": "# Bell Basis Projection\nimport numpy as np\n\ndef bell_projection():\n    # Bell basis vectors\n    b00 = np.array([1, 0, 0, 1]) / np.sqrt(2)\n    return np.linalg.norm(b00)\n\nprint('Bell State Norm:', bell_projection())\n",
                    },
                    {
                        "slug": "quantum-fidelity-check",
                        "title": "Teleported State Quantum Fidelity Matrix",
                        "order": 2, "xp": 300, "type": "ASSESSMENT", "minutes": 20,
                        "summary": "Verify density matrix fidelity F(rho, sigma) exceeds classical 2/3 threshold limit.",
                    }
                ]
            },
            {
                "slug": "quantum-ai-architecture",
                "title": "Quantum AI Architecture & Neural Synergies",
                "subtitle": "Harness multi-qubit superposition to train high-dimensional neural representations",
                "org": nexus_org,
                "track": "quantum",
                "difficulty": "ADVANCED",
                "duration": "14 Hours",
                "xp": 1400,
                "color": "#00f3ff",
                "icon": "atom",
                "badge": created_badges.get("quantum-pioneer"),
                "lessons": [
                    {
                        "slug": "superconducting-qubit-topology",
                        "title": "Superconducting Qubit Topology & State Initialization",
                        "order": 1, "xp": 250, "type": "CODE_LAB", "minutes": 25,
                        "summary": "Initialize dual quantum state vectors and execute Hadamard transformations to generate entanglement.",
                        "lang": "python",
                        "task": "Implement the Bell state superposition function using matrix unitary products.",
                        "starter": "# Quantum State Simulator\nimport numpy as np\n\ndef create_bell_state():\n    return np.array([1/np.sqrt(2), 0, 0, 1/np.sqrt(2)], dtype=complex)\n\nprint(create_bell_state())\n",
                    },
                    {
                        "slug": "holographic-quantum-gates",
                        "title": "Holographic Quantum Gate Simulation & Coherence",
                        "order": 2, "xp": 300, "type": "HOLOGRAPHIC_SIM", "minutes": 20,
                        "summary": "Interact with 3D Bloch sphere vector transformations and monitor decoherence thresholds in real-time.",
                    },
                    {
                        "slug": "quantum-backpropagation",
                        "title": "Quantum Backpropagation & Error Mitigation",
                        "order": 3, "xp": 350, "type": "CONCEPT", "minutes": 30,
                        "summary": "Parameter-shift rules for computing analytic gradients on noisy intermediate-scale quantum circuits.",
                    }
                ]
            },
            {
                "slug": "quantum-fault-tolerance",
                "title": "Topological Qubits & Fault-Tolerant Decoherence Shielding",
                "subtitle": "Majorana fermion zero-modes, surface code stabilizer syndromes, and non-Abelian anyon braiding",
                "org": helios_org,
                "track": "quantum",
                "difficulty": "SINGULARITY",
                "duration": "22 Hours",
                "xp": 2400,
                "color": "#0284c7",
                "icon": "atom",
                "badge": created_badges.get("singularity-architect"),
                "lessons": [
                    {
                        "slug": "surface-code-stabilizers",
                        "title": "Rotated Surface Code Stabilizer Syndrome Decoding",
                        "order": 1, "xp": 500, "type": "CODE_LAB", "minutes": 35,
                        "summary": "Decode X and Z check matrix syndrome measurements with minimum-weight perfect matching algorithms.",
                        "lang": "python",
                        "task": "Construct a distance-3 stabilizer syndrome matrix.",
                        "starter": "# Stabilizer Code Matrix\nimport numpy as np\n\ndef check_stabilizer(parity_vector):\n    return np.sum(parity_vector) % 2\n\nprint('Parity Syndrome:', check_stabilizer([1, 0, 1, 0]))\n",
                    }
                ]
            },

            # Track: Cyber Defense
            {
                "slug": "cyber-threat-intelligence-basics",
                "title": "Zero-Trust Perimeter & Cyber Intelligence",
                "subtitle": "Fundamentals of perimeterless security, identity verification, and MITRE ATT&CK vectors",
                "org": nexus_org,
                "track": "cybersec",
                "difficulty": "BEGINNER",
                "duration": "5 Hours",
                "xp": 450,
                "color": "#ff0055",
                "icon": "shield-alert",
                "badge": created_badges.get("cadet-initiate"),
                "lessons": [
                    {
                        "slug": "perimeter-telemetry",
                        "title": "Identity-Centric Authentication & Ephemeral Tokens",
                        "order": 1, "xp": 150, "type": "CONCEPT", "minutes": 20,
                        "summary": "Revisiting network zoning: why static IP boundaries fail and how micro-segmented identity tokens replace perimeter walls.",
                    },
                    {
                        "slug": "packet-inspection-lab",
                        "title": "Hands-on Packet Stream Analysis",
                        "order": 2, "xp": 200, "type": "CODE_LAB", "minutes": 25,
                        "summary": "Filter anomalous TLS handshake signatures using synthetic network stream parsing.",
                        "lang": "python",
                        "task": "Parse packet header flags and detect abnormal TTL decrement rates.",
                        "starter": "# Packet Inspector\ndef inspect_packet(header):\n    # Return true if suspicious TTL\n    return header.get('ttl', 64) < 10\n\nprint('Anomaly Detected:', inspect_packet({'ttl': 4, 'flags': 0x02}))\n",
                    }
                ]
            },
            {
                "slug": "zero-trust-cyber-defense",
                "title": "Zero-Trust Cybernetic Defense & Mesh Protocols",
                "subtitle": "Design unbreakable peer-to-peer authenticated fabrics against quantum cryptanalysis",
                "org": nexus_org,
                "track": "cybersec",
                "difficulty": "INTERMEDIATE",
                "duration": "10 Hours",
                "xp": 950,
                "color": "#ff0055",
                "icon": "shield-alert",
                "badge": created_badges.get("mesh-ghost"),
                "lessons": [
                    {
                        "slug": "lattice-based-post-quantum-encryption",
                        "title": "Lattice-Based Post-Quantum Encryption Deployment",
                        "order": 1, "xp": 250, "type": "CODE_LAB", "minutes": 20,
                        "summary": "Deploy Learning-With-Errors (LWE) ring lattice keys resistant to polynomial-time quantum attacks.",
                        "lang": "python",
                        "task": "Generate a public/private matrix pair adhering to Kyber-768 parameters.",
                        "starter": "# Post-Quantum Kyber Simulation\nimport secrets\n\ndef generate_lattice_keys(dim=256):\n    secret = [secrets.randbelow(3) - 1 for _ in range(dim)]\n    return {'secret_len': len(secret)}\n\nprint(generate_lattice_keys())\n",
                    },
                    {
                        "slug": "autonomous-intrusion-daemons",
                        "title": "Autonomous Intrusion Defense Daemons",
                        "order": 2, "xp": 300, "type": "ASSESSMENT", "minutes": 15,
                        "summary": "Configure autonomous mesh nodes that isolate compromised segments in sub-millisecond cycles.",
                    }
                ]
            },
            {
                "slug": "quantum-cryptanalysis-defense",
                "title": "Post-Quantum Lattice Shielding & Threat Hunting",
                "subtitle": "Analyze algorithmic resistance against quantum Shor factoring and Grover key searches",
                "org": nexus_org,
                "track": "cybersec",
                "difficulty": "ADVANCED",
                "duration": "16 Hours",
                "xp": 1600,
                "color": "#ff0055",
                "icon": "shield-alert",
                "badge": created_badges.get("mesh-sentinel"),
                "lessons": [
                    {
                        "slug": "ntru-lattice-verification",
                        "title": "NTRU Polynomial Ring Reduction Verification",
                        "order": 1, "xp": 400, "type": "CODE_LAB", "minutes": 30,
                        "summary": "Verify polynomial ring quotients Z[x]/(x^N - 1) under shortest vector problem (SVP) constraints.",
                        "lang": "python",
                        "task": "Execute polynomial modular convolution for public key validation.",
                        "starter": "# NTRU Ring Convolution\ndef ring_convolution(p, q, n=509):\n    return sum(p) % 2048\n\nprint('Norm:', ring_convolution([1, -1, 0, 1], 2048))\n",
                    }
                ]
            },
            {
                "slug": "autonomous-warfare-daemons",
                "title": "Kinetic Swarm Defense & Autonomous Threat Neutralization",
                "subtitle": "Autonomous neural daemons for zero-day polymorphic virus eradication across distributed nodes",
                "org": nexus_org,
                "track": "cybersec",
                "difficulty": "SINGULARITY",
                "duration": "24 Hours",
                "xp": 2600,
                "color": "#ff0055",
                "icon": "shield-alert",
                "badge": created_badges.get("singularity-architect"),
                "lessons": [
                    {
                        "slug": "swarm-consensus-defense",
                        "title": "Byzantine Fault Tolerant Swarm Quarantine Matrix",
                        "order": 1, "xp": 600, "type": "CODE_LAB", "minutes": 40,
                        "summary": "Implement asynchronous Paxos-BFT consensus among autonomous perimeter defense sentinels.",
                        "lang": "python",
                        "task": "Vote to isolate rogue peer with > 2/3 Byzantine quorum.",
                        "starter": "# BFT Swarm Quarantine\ndef evaluate_quorum(votes, total=100):\n    return votes >= (2 * total // 3) + 1\n\nprint('Quorum Reached:', evaluate_quorum(68))\n",
                    }
                ]
            },

            # Track: Neuromorphic AI
            {
                "slug": "neuromorphic-computing-intro",
                "title": "Spiking Neural Architectures & Event-Driven Logic",
                "subtitle": "Introduction to biologically-inspired computation, membrane potentials, and asynchronous event streams",
                "org": biosynth_org,
                "track": "ai",
                "difficulty": "BEGINNER",
                "duration": "6 Hours",
                "xp": 600,
                "color": "#10b981",
                "icon": "brain",
                "badge": created_badges.get("cadet-initiate"),
                "lessons": [
                    {
                        "slug": "integrate-and-fire-model",
                        "title": "Leaky Integrate-and-Fire (LIF) Neuron Model",
                        "order": 1, "xp": 200, "type": "CODE_LAB", "minutes": 25,
                        "summary": "Simulate membrane potential integration V(t) with exponential passive leak decay.",
                        "lang": "python",
                        "task": "Compute membrane potential integration and fire threshold trigger.",
                        "starter": "# LIF Neuron Simulator\ndef lif_step(v_mem, i_syn, v_thresh=1.0, leak=0.9):\n    v_next = v_mem * leak + i_syn\n    fired = v_next >= v_thresh\n    return (0.0 if fired else v_next, fired)\n\nprint('Neuron Step (Resting, Spiked?):', lif_step(0.8, 0.3))\n",
                    }
                ]
            },
            {
                "slug": "neuromorphic-bci-systems",
                "title": "Neuromorphic Brain-Computer Interface Systems",
                "subtitle": "Direct neural telemetry, spike-based motor decoders, and bio-compatible co-processors",
                "org": biosynth_org,
                "track": "ai",
                "difficulty": "INTERMEDIATE",
                "duration": "12 Hours",
                "xp": 1100,
                "color": "#10b981",
                "icon": "brain",
                "badge": created_badges.get("synapse-master"),
                "lessons": [
                    {
                        "slug": "stdp-in-silicon",
                        "title": "Spike-Timing-Dependent Plasticity (STDP) in Silicon",
                        "order": 1, "xp": 300, "type": "CODE_LAB", "minutes": 25,
                        "summary": "Model synaptic weight adaptation as a function of millisecond arrival times between pre- and post-synaptic spikes.",
                        "lang": "python",
                        "task": "Implement asymmetric exponential STDP synaptic weight update.",
                        "starter": "# STDP Weight Update Equation\ndef update_weight(w, delta_t, a_plus=0.01, tau_plus=20.0):\n    if delta_t > 0:\n        return w + a_plus * (2.71828 ** (-delta_t / tau_plus))\n    return w\n\nprint('Adapted Synaptic Weight:', update_weight(0.5, 5.0))\n",
                    }
                ]
            },
            {
                "slug": "memristive-analog-arrays",
                "title": "Memristive Crossbar Acceleration & Deep STDP",
                "subtitle": "Hardware-level in-memory matrix vector multiplication using filamentary titanium oxide memristors",
                "org": biosynth_org,
                "track": "ai",
                "difficulty": "ADVANCED",
                "duration": "15 Hours",
                "xp": 1500,
                "color": "#10b981",
                "icon": "brain",
                "badge": created_badges.get("neural-alchemist"),
                "lessons": [
                    {
                        "slug": "kirchhoff-crossbar-matrix",
                        "title": "Ohm-Kirchhoff In-Memory Dot Products",
                        "order": 1, "xp": 400, "type": "CODE_LAB", "minutes": 30,
                        "summary": "Exploit Ohm's Law (I = V * G) and Kirchhoff's Current Law for single-clock-cycle matrix multiplication.",
                        "lang": "python",
                        "task": "Compute parallel current summation across 8x8 conductance matrix.",
                        "starter": "# Crossbar Dot Product\nimport numpy as np\n\ndef crossbar_gemm(conductances, voltages):\n    return np.dot(conductances, voltages)\n\nprint('Output Currents (mA):', crossbar_gemm(np.eye(4)*0.5, np.array([1, 2, 3, 4])))\n",
                    }
                ]
            },
            {
                "slug": "synthetic-sentience-matrices",
                "title": "Synthetic Sentience & Multi-Agent Cognitive Consensus",
                "subtitle": "Self-reflective neural graphs with multi-agent consensus protocols and artificial self-awareness",
                "org": biosynth_org,
                "track": "ai",
                "difficulty": "SINGULARITY",
                "duration": "26 Hours",
                "xp": 2800,
                "color": "#10b981",
                "icon": "brain",
                "badge": created_badges.get("singularity-architect"),
                "lessons": [
                    {
                        "slug": "meta-cognitive-recursion",
                        "title": "Recursive Self-Model Inference & Epistemic Logic",
                        "order": 1, "xp": 700, "type": "CODE_LAB", "minutes": 45,
                        "summary": "Implement higher-order Bayesian epistemic belief update loops for synthetic agent theory-of-mind.",
                        "lang": "python",
                        "task": "Formulate second-order belief distribution over agent state vectors.",
                        "starter": "# Epistemic Belief Update\ndef belief_update(prior, likelihood):\n    posterior = prior * likelihood\n    return posterior / sum(posterior)\n\nprint('Posterior Confidence:', belief_update([0.4, 0.6], [0.8, 0.2]))\n",
                    }
                ]
            },

            # Track: Aero-Space
            {
                "slug": "orbital-mechanics-telemetry",
                "title": "Orbital Mechanics & Deep Space Telemetry Protocols",
                "subtitle": "Introduction to orbital state propagation, satellite rendezvous, and telemetry telemetry packets",
                "org": aether_org,
                "track": "space",
                "difficulty": "BEGINNER",
                "duration": "7 Hours",
                "xp": 650,
                "color": "#a855f7",
                "icon": "rocket",
                "badge": created_badges.get("cadet-initiate"),
                "lessons": [
                    {
                        "slug": "keplerian-orbit-propagation",
                        "title": "Keplerian Elements & Vis-Viva Velocity Equations",
                        "order": 1, "xp": 200, "type": "CODE_LAB", "minutes": 25,
                        "summary": "Calculate instantaneous orbital velocity from semi-major axis and standard gravitational parameters.",
                        "lang": "python",
                        "task": "Implement the Vis-Viva equation v^2 = mu * (2/r - 1/a).",
                        "starter": "# Vis-Viva Orbital Calculator\nimport math\n\ndef orbital_velocity(r, a, mu=398600.4418):\n    # r in km, a in km, mu in km^3/s^2 (Earth)\n    return math.sqrt(mu * (2/r - 1/a))\n\nprint('Circular LEO Velocity (km/s):', orbital_velocity(6778, 6778))\n",
                    }
                ]
            },
            {
                "slug": "ion-propulsion-navigation",
                "title": "Magnetoplasmadynamic & Ion Propulsion Flight Systems",
                "subtitle": "Plasma physics, Hall effect accelerator design, and high specific-impulse continuous trajectories",
                "org": aether_org,
                "track": "space",
                "difficulty": "INTERMEDIATE",
                "duration": "11 Hours",
                "xp": 1050,
                "color": "#a855f7",
                "icon": "rocket",
                "badge": created_badges.get("terminal-operative"),
                "lessons": [
                    {
                        "slug": "hall-thruster-efficiency",
                        "title": "Specific Impulse & Tsiolkovsky Ion Burn Efficiency",
                        "order": 1, "xp": 300, "type": "CODE_LAB", "minutes": 25,
                        "summary": "Compute required xenon propellant mass ratios for interplanetary transfer delta-V budgets.",
                        "lang": "python",
                        "task": "Execute rocket equation for 3000-second Isp Hall thruster.",
                        "starter": "# Ion Rocket Equation\nimport math\n\ndef propellant_mass(m_dry, delta_v, isp=3000, g0=9.80665):\n    return m_dry * (math.exp(delta_v / (isp * g0)) - 1)\n\nprint('Propellant Needed (kg):', propellant_mass(1000, 4500))\n",
                    }
                ]
            },
            {
                "slug": "interplanetary-communications",
                "title": "Laser Quantum Entangled Interstellar Relays",
                "subtitle": "Optical coherent communications, deep space laser ranging, and quantum repeater networks",
                "org": aether_org,
                "track": "space",
                "difficulty": "ADVANCED",
                "duration": "14 Hours",
                "xp": 1350,
                "color": "#a855f7",
                "icon": "rocket",
                "badge": created_badges.get("mesh-sentinel"),
                "lessons": [
                    {
                        "slug": "deep-space-link-budget",
                        "title": "Photon-Counting Optical Link Budget Analysis",
                        "order": 1, "xp": 350, "type": "CODE_LAB", "minutes": 30,
                        "summary": "Model 1550nm laser beam divergence and photon detection probabilities at 2 Astronomical Units.",
                        "lang": "python",
                        "task": "Compute received photon counts given aperture diameter and transmitter power.",
                        "starter": "# Optical Link Budget\ndef link_efficiency(power_w, aperture_m, distance_km):\n    return (power_w * aperture_m**2) / (distance_km**2 * 1e-12)\n\nprint('Signal Strength:', link_efficiency(20, 1.5, 300000000))\n",
                    }
                ]
            },
            {
                "slug": "gravitational-propulsion-engineering",
                "title": "Deep Space Gravitational Propulsion Engineering",
                "subtitle": "Theoretical physics and warp field geometry for sub-light and hyper-relativistic travel",
                "org": aether_org,
                "track": "space",
                "difficulty": "SINGULARITY",
                "duration": "18 Hours",
                "xp": 1800,
                "color": "#a855f7",
                "icon": "rocket",
                "badge": created_badges.get("singularity-architect"),
                "lessons": [
                    {
                        "slug": "alcubierre-metric-tensor",
                        "title": "Alcubierre Metric Tensor & Negative Energy Containment",
                        "order": 1, "xp": 400, "type": "HOLOGRAPHIC_SIM", "minutes": 35,
                        "summary": "Manipulate space-time curvature solutions within Einstein field equations.",
                    }
                ]
            },
        ]

        # Seed or Update all 16 CoursePages and LessonPages
        for cdata in courses_catalog:
            course_page = CoursePage.objects.filter(slug=cdata["slug"]).first()
            if not course_page:
                course_page = CoursePage(
                    title=cdata["title"],
                    slug=cdata["slug"],
                    subtitle=cdata["subtitle"],
                    organization=cdata["org"],
                    track=cdata["track"],
                    difficulty=cdata["difficulty"],
                    estimated_duration=cdata["duration"],
                    xp_reward=cdata["xp"],
                    neon_color=cdata["color"],
                    icon_name=cdata["icon"],
                    badge_reward=cdata.get("badge")
                )
                course_index.add_child(instance=course_page)
                course_page.save_revision().publish()
            else:
                # Update metadata if exists
                course_page.title = cdata["title"]
                course_page.subtitle = cdata["subtitle"]
                course_page.difficulty = cdata["difficulty"]
                course_page.track = cdata["track"]
                course_page.estimated_duration = cdata["duration"]
                course_page.xp_reward = cdata["xp"]
                course_page.save_revision().publish()

            # Seed lessons for course
            for ldata in cdata["lessons"]:
                lesson_page = LessonPage.objects.filter(slug=ldata["slug"]).first()
                if not lesson_page:
                    lesson_page = LessonPage(
                        title=ldata["title"],
                        slug=ldata["slug"],
                        order=ldata["order"],
                        xp_value=ldata["xp"],
                        lesson_type=ldata["type"],
                        estimated_minutes=ldata["minutes"],
                        summary=ldata["summary"],
                        code_language=ldata.get("lang", "python"),
                        code_task=ldata.get("task", "Execute hands-on cybernetic algorithm transformations."),
                        code_starter=ldata.get("starter", "# Cyber Laboratory Simulation\n"),
                        code_solution=ldata.get("solution", "# Solution Verified\n"),
                    )
                    course_page.add_child(instance=lesson_page)
                    lesson_page.save_revision().publish()

        self.stdout.write(self.style.SUCCESS(f"✓ 16 Comprehensive Courses across all 4 tracks and 4 difficulty tiers published"))

        # 7. Seed Cyber Quizzes
        quiz1, _ = CyberQuiz.objects.get_or_create(
            course_slug="quantum-ai-architecture",
            lesson_order=1,
            defaults={
                "title": "Quantum Entanglement & Superposition Mastery Check",
                "passing_score": 75,
                "time_limit_seconds": 180,
                "xp_bounty": 350,
                "questions": [
                    {
                        "id": 1,
                        "prompt": "What happens to the state vector of a qubit when measured in the computational Z-basis?",
                        "options": [
                            "It remains in an indefinite linear combination of states",
                            "It collapses deterministically into eigenvalue |0> or |1>",
                            "It clones itself onto adjacent ancilla qubits instantly",
                            "Its phase shifts continuously by pi/2 radians"
                        ],
                        "correct_index": 1,
                        "explanation": "Wavefunction measurement forces the superposition to project into one of the orthogonal basis states."
                    },
                    {
                        "id": 2,
                        "prompt": "Which quantum gate generates maximal 2-qubit entanglement when applied after a Hadamard gate?",
                        "options": ["Pauli-X Gate", "Toffoli Gate", "Controlled-NOT (CNOT) Gate", "Phase (S) Gate"],
                        "correct_index": 2,
                        "explanation": "Applying CNOT to a qubit in (|0>+|1>)/sqrt(2) creates the maximally entangled Bell state (|00>+|11>)/sqrt(2)."
                    },
                    {
                        "id": 3,
                        "prompt": "Why can quantum information NOT be duplicated without altering the source system?",
                        "options": [
                            "Due to the No-Cloning Theorem in quantum mechanics",
                            "Because classical memory buffers lack sufficient bandwidth",
                            "Decoherence causes immediate hardware thermal failure",
                            "Heisenberg's principle only applies to photons"
                        ],
                        "correct_index": 0,
                        "explanation": "The No-Cloning Theorem proves that an arbitrary unknown quantum state cannot be replicated identically."
                    }
                ]
            }
        )

        quiz2, _ = CyberQuiz.objects.get_or_create(
            course_slug="zero-trust-cyber-defense",
            lesson_order=2,
            defaults={
                "title": "Autonomous Zero-Trust Protocols Exam",
                "passing_score": 70,
                "time_limit_seconds": 120,
                "xp_bounty": 300,
                "questions": [
                    {
                        "id": 1,
                        "prompt": "What is the core tenet of Zero-Trust Architecture?",
                        "options": [
                            "Trust internal subnet traffic while inspecting perimeter gateways",
                            "Never Trust, Always Verify: authenticate every packet and identity dynamically",
                            "Rely on static 4096-bit RSA certificates without expiry",
                            "Enforce physical biometric tokens at corporate entry"
                        ],
                        "correct_index": 1,
                        "explanation": "Zero Trust assumes adversaries already exist inside the perimeter; every session is ephemeral and verified."
                    },
                    {
                        "id": 2,
                        "prompt": "Which mathematical problem underpins NIST-standardized Post-Quantum Cryptography (ML-KEM / Kyber)?",
                        "options": [
                            "Discrete Logarithms over Elliptic Curves",
                            "Integer Prime Factorization",
                            "Learning With Errors (LWE) over Polynomial Lattices",
                            "Diffie-Hellman Key Exchange"
                        ],
                        "correct_index": 2,
                        "explanation": "Lattice problems like Module Learning With Errors (ML-KEM) cannot be solved in polynomial time even by Shor's quantum algorithm."
                    }
                ]
            }
        )

        quiz3, _ = CyberQuiz.objects.get_or_create(
            course_slug="orbital-mechanics-telemetry",
            lesson_order=1,
            defaults={
                "title": "Astrodynamics & Telemetry Assessment",
                "passing_score": 75,
                "time_limit_seconds": 120,
                "xp_bounty": 250,
                "questions": [
                    {
                        "id": 1,
                        "prompt": "Which orbital maneuver provides the minimum delta-V transfer between two circular coplanar orbits?",
                        "options": [
                            "Bi-elliptic Transfer",
                            "Hohmann Transfer Orbit",
                            "Direct Parabolic Injection",
                            "Continuous Constant-Thrust Spiral"
                        ],
                        "correct_index": 1,
                        "explanation": "For orbit radius ratios less than ~11.94, the two-impulse Hohmann transfer is strictly optimal in delta-V consumption."
                    },
                    {
                        "id": 2,
                        "prompt": "According to Kepler's Second Law, where does an orbiting satellite travel at its maximum orbital speed?",
                        "options": [
                            "At the Apoapsis (farthest point)",
                            "At the Periapsis (closest point)",
                            "At the ascending node intersection",
                            "Its speed is identical at all orbital positions"
                        ],
                        "correct_index": 1,
                        "explanation": "Conservation of angular momentum dictates that velocity is highest at periapsis where the radius vector is shortest."
                    }
                ]
            }
        )
        self.stdout.write(self.style.SUCCESS("✓ Cyber Quizzes seeded"))

        # 8. Learner Profile
        profile, created = LearnerProfile.objects.get_or_create(
            callsign="Cyber-Adept-01",
            defaults={
                "organization": nexus_org,
                "current_xp": 1850,
                "level": 4,
                "streak_days": 7,
                "unlocked_skills": ["quantum-basics", "qubit-gates", "zero-trust-foundations", "spiking-networks", "orbital-telemetry"],
                "completed_lessons": [1, 2],
            }
        )
        if created:
            profile.badges.add(
                created_badges["cadet-initiate"], 
                created_badges["terminal-operative"], 
                created_badges["synapse-master"]
            )
            profile.save()

        self.stdout.write(self.style.SUCCESS("✓ Demo Learner Profile initialized for 'Cyber-Adept-01'"))
        self.stdout.write(self.style.SUCCESS("=================================================="))
        self.stdout.write(self.style.SUCCESS("SYNAPSE LMS DATABASE FULLY ENRICHED & SEEDED! 🚀"))
        self.stdout.write(self.style.SUCCESS("=================================================="))
