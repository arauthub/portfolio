import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import confetti from 'canvas-confetti';
import { LearnerProfile, Badge, Quest, SkillNode, LeaderboardEntry } from '../models';
import { SoundFxService } from './sound-fx.service';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private http = inject(HttpClient);
  private sound = inject(SoundFxService);
  private baseUrl = 'http://localhost:8000/api/v1/gamification/';

  // Initial Demo Profile
  private defaultProfile: LearnerProfile = {
    callsign: 'Cyber-Adept-01',
    avatar_url: 'cyber-avatar-1',
    role: 'LEARNER',
    current_xp: 1450,
    level: 3,
    streak_days: 6,
    badges: [
      {
        code: 'terminal-operative',
        title: 'Terminal Operative',
        description: 'Executed 50 hands-on cybernetic terminal commands',
        icon_name: 'terminal',
        rarity: 'COMMON',
        xp_bonus: 150
      },
      {
        code: 'synapse-master',
        title: 'Synapse Master',
        description: 'Constructed a 4-layer neuromorphic spiking neural network',
        icon_name: 'cpu',
        rarity: 'RARE',
        xp_bonus: 250
      }
    ],
    unlocked_skills: ['quantum-basics', 'qubit-gates', 'zero-trust-foundations', 'spiking-networks'],
    completed_lessons: [1, 2],
    active_quests_progress: {
      'daily-hack-1': 1,
      'daily-hack-2': 0,
      'weekly-bounty-1': 3
    },
    organization_name: 'Nexus Cybernetics',
    organization_slug: 'nexus-cybernetics',
    next_level_xp: 2000,
    progress_to_next_level: 70
  };

  public profile = signal<LearnerProfile>(this.defaultProfile);
  public quests = signal<Quest[]>([]);
  public skillTreeNodes = signal<SkillNode[]>([]);
  public allBadges = signal<Badge[]>([]);
  public leaderboard = signal<LeaderboardEntry[]>([]);

  constructor() {
    this.loadProfile();
    this.loadQuests();
    this.loadSkillTree();
    this.loadBadges();
    this.loadLeaderboard();
  }

  public loadLeaderboard() {
    this.http.get<LeaderboardEntry[]>(`${this.baseUrl}leaderboard/`).subscribe({
      next: (res) => this.leaderboard.set(res),
      error: () => {
        this.leaderboard.set([
          { rank: 1, callsign: 'Singularity-X', level: 14, xp: 7200, badges: 12, streak: 28, status: 'ONLINE' },
          { rank: 2, callsign: 'Valkyrie-7', level: 11, xp: 5600, badges: 9, streak: 19, status: 'IN MISSION' },
          { rank: 3, callsign: 'Cyber-Adept-01', level: 3, xp: 1450, badges: 3, streak: 6, status: 'ONLINE' },
          { rank: 4, callsign: 'GlitchHunter', level: 2, xp: 950, badges: 2, streak: 3, status: 'OFFLINE' },
          { rank: 5, callsign: 'QuantumPhantom', level: 2, xp: 800, badges: 1, streak: 2, status: 'ONLINE' }
        ]);
      }
    });
  }

  public loadProfile() {
    this.http.get<LearnerProfile>(`${this.baseUrl}profile/`).subscribe({
      next: (res) => this.profile.set(res),
      error: () => {
        // Keep default initialized profile
      }
    });
  }

  public loadQuests() {
    this.http.get<Quest[]>(`${this.baseUrl}quests/`).subscribe({
      next: (res) => {
        const enriched = res.map(q => ({
          ...q,
          current_progress: this.profile().active_quests_progress[q.code] || 0,
          is_claimed: false
        }));
        this.quests.set(enriched);
      },
      error: () => {
        // Fallback default quests
        this.quests.set([
          {
            code: 'daily-hack-1',
            title: 'Neural Synchronization',
            description: 'Complete at least 2 interactive cyber lessons today',
            quest_type: 'DAILY',
            target_metric: 'lessons_completed',
            target_count: 2,
            xp_reward: 250,
            icon: 'zap',
            is_active: true,
            current_progress: 1,
            is_claimed: false
          },
          {
            code: 'daily-hack-2',
            title: 'Flawless Execution',
            description: 'Achieve 100% on any quantum or cyber security quiz',
            quest_type: 'DAILY',
            target_metric: 'quiz_perfect',
            target_count: 1,
            xp_reward: 350,
            icon: 'check-circle',
            is_active: true,
            current_progress: 0,
            is_claimed: false
          },
          {
            code: 'weekly-bounty-1',
            title: 'Overclock Streak',
            description: 'Maintain a continuous 5-day active hack streak',
            quest_type: 'WEEKLY',
            target_metric: 'streak_days',
            target_count: 5,
            xp_reward: 600,
            icon: 'flame',
            is_active: true,
            current_progress: 5,
            is_claimed: false
          },
          {
            code: 'special-ops-1',
            title: 'Matrix Expansion',
            description: 'Unlock 2 new nodes in the neural skill tree',
            quest_type: 'SPECIAL',
            target_metric: 'skills_unlocked',
            target_count: 2,
            xp_reward: 800,
            icon: 'network',
            is_active: true,
            current_progress: 2,
            is_claimed: false
          }
        ]);
      }
    });
  }

  public loadSkillTree() {
    this.http.get<SkillNode[]>(`${this.baseUrl}skill-tree/`).subscribe({
      next: (res) => this.skillTreeNodes.set(res),
      error: () => {
        // Fallback skill nodes
        this.skillTreeNodes.set([
          { slug: 'quantum-basics', title: 'Quantum State Fundamentals', track: 'quantum', tier: 1, parent_slug: null, description: 'Understand qubits, Bloch sphere representation, and Dirac notation.', xp_cost: 200, icon: 'atom', is_unlocked_default: true, order: 1 },
          { slug: 'qubit-gates', title: 'Superposition & Entanglement Gates', track: 'quantum', tier: 2, parent_slug: 'quantum-basics', description: 'Configure Hadamard, CNOT, and Phase-shift unitary operators.', xp_cost: 350, icon: 'git-branch', is_unlocked_default: false, order: 2 },
          { slug: 'quantum-algorithms', title: "Shor's & Grover's Algorithms", track: 'quantum', tier: 3, parent_slug: 'qubit-gates', description: 'Implement quantum search and polynomial-time integer factorization.', xp_cost: 600, icon: 'binary', is_unlocked_default: false, order: 3 },
          { slug: 'topological-qubits', title: 'Topological Fault-Tolerant Systems', track: 'quantum', tier: 4, parent_slug: 'quantum-algorithms', description: 'Anyon braiding and decoherence suppression in Majorana wires.', xp_cost: 1000, icon: 'shield', is_unlocked_default: false, order: 4 },

          { slug: 'zero-trust-foundations', title: 'Zero-Trust Architecture', track: 'cybersec', tier: 1, parent_slug: null, description: 'Continuous authentication and dynamic microsegmentation principles.', xp_cost: 200, icon: 'lock', is_unlocked_default: true, order: 1 },
          { slug: 'post-quantum-crypto', title: 'Post-Quantum Lattice Cryptography', track: 'cybersec', tier: 2, parent_slug: 'zero-trust-foundations', description: 'Kyber and Dilithium NIST post-quantum cryptographic schemes.', xp_cost: 400, icon: 'key', is_unlocked_default: false, order: 2 },
          { slug: 'autonomous-defense', title: 'Autonomous Cyber-Mesh Daemons', track: 'cybersec', tier: 3, parent_slug: 'post-quantum-crypto', description: 'Deploy self-healing packet inspectors across zero-trust fabrics.', xp_cost: 700, icon: 'bot', is_unlocked_default: false, order: 3 },
          { slug: 'cognitive-neutralization', title: 'Cognitive Threat Neutralization', track: 'cybersec', tier: 4, parent_slug: 'autonomous-defense', description: 'AI-driven kinetic countermeasures for adversarial model attacks.', xp_cost: 1100, icon: 'crosshair', is_unlocked_default: false, order: 4 },

          { slug: 'spiking-networks', title: 'Spiking Neural Networks (SNN)', track: 'ai', tier: 1, parent_slug: null, description: 'Temporal spike encoding and event-driven neuromorphic computation.', xp_cost: 250, icon: 'activity', is_unlocked_default: true, order: 1 },
          { slug: 'synaptic-plasticity', title: 'STDP Synaptic Plasticity', track: 'ai', tier: 2, parent_slug: 'spiking-networks', description: 'Spike-timing-dependent plasticity for online edge learning.', xp_cost: 450, icon: 'git-merge', is_unlocked_default: false, order: 2 },
          { slug: 'neuromorphic-circuits', title: 'Neuromorphic Memristor Arrays', track: 'ai', tier: 3, parent_slug: 'synaptic-plasticity', description: 'Analog crossbar hardware acceleration with ultra-low watt draw.', xp_cost: 800, icon: 'cpu', is_unlocked_default: false, order: 3 },
          { slug: 'synthetic-cognition', title: 'Synthetic Cognition Matrix', track: 'ai', tier: 4, parent_slug: 'neuromorphic-circuits', description: 'Self-reflective neural graphs with multi-agent consensus protocols.', xp_cost: 1200, icon: 'brain', is_unlocked_default: false, order: 4 },
        ]);
      }
    });
  }

  public loadBadges() {
    this.http.get<Badge[]>(`${this.baseUrl}badges/`).subscribe({
      next: (res) => this.allBadges.set(res),
      error: () => {
        this.allBadges.set([
          { code: 'quantum-pioneer', title: 'Quantum Pioneer', description: 'Mastered superposition matrix algorithms & coherent qubits', icon_name: 'atom', rarity: 'LEGENDARY', xp_bonus: 500 },
          { code: 'mesh-ghost', title: 'Mesh Ghost', description: 'Successfully neutralised 10 automated cyber intrusions', icon_name: 'shield-check', rarity: 'EPIC', xp_bonus: 350 },
          { code: 'synapse-master', title: 'Synapse Master', description: 'Constructed a 4-layer neuromorphic spiking neural network', icon_name: 'cpu', rarity: 'RARE', xp_bonus: 250 },
          { code: 'terminal-operative', title: 'Terminal Operative', description: 'Executed 50 hands-on cybernetic terminal commands', icon_name: 'terminal', rarity: 'COMMON', xp_bonus: 150 },
          { code: 'singularity-architect', title: 'Singularity Architect', description: 'Unlocked highest-tier node in all knowledge webs', icon_name: 'sparkles', rarity: 'LEGENDARY', xp_bonus: 1000 },
        ]);
      }
    });
  }

  public awardXP(amount: number, reason: string): boolean {
    const current = this.profile();
    const oldLevel = current.level;
    const newXP = current.current_xp + amount;
    const newLevel = Math.max(1, Math.floor(newXP / 500) + 1);
    const nextLevelXP = newLevel * 500;
    const currentLevelBase = (newLevel - 1) * 500;
    const progress = Math.min(100, Math.max(0, Math.round(((newXP - currentLevelBase) / 500) * 100)));

    const leveledUp = newLevel > oldLevel;

    this.profile.update(p => ({
      ...p,
      current_xp: newXP,
      level: newLevel,
      next_level_xp: nextLevelXP,
      progress_to_next_level: progress
    }));

    if (leveledUp) {
      this.sound.playLevelUp();
      this.triggerCyberConfetti(['#00f3ff', '#a855f7', '#ff0055', '#fbbf24']);
    } else {
      this.sound.playSuccess();
    }

    return leveledUp;
  }

  public unlockSkill(slug: string): boolean {
    const profile = this.profile();
    if (profile.unlocked_skills.includes(slug)) return false;

    const node = this.skillTreeNodes().find(n => n.slug === slug);
    if (!node) return false;

    if (profile.current_xp < node.xp_cost) {
      this.sound.playError();
      return false;
    }

    // Deduct cost and unlock
    this.profile.update(p => ({
      ...p,
      unlocked_skills: [...p.unlocked_skills, slug]
    }));

    this.sound.playBounty();
    this.triggerCyberConfetti(['#00f3ff', '#10b981']);
    return true;
  }

  public claimQuest(code: string) {
    const quest = this.quests().find(q => q.code === code);
    if (!quest || quest.is_claimed) return;

    this.quests.update(list => list.map(q => q.code === code ? { ...q, is_claimed: true } : q));
    this.awardXP(quest.xp_reward, `Quest Claimed: ${quest.title}`);
  }

  public triggerCyberConfetti(colors: string[] = ['#00f3ff', '#a855f7', '#ff0055']) {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
        disableForReducedMotion: true
      });
    } catch {}
  }
}

