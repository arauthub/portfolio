export interface Organization {
  id?: number;
  name: string;
  slug: string;
  subdomain: string;
  slogan: string;
  logo_url?: string;
  contact_email?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  theme_preset: 'cyber_neon' | 'quantum_void' | 'matrix_emerald' | 'solar_amber' | 'solar_light' | 'quantum_aurora' | 'google_standard';
  font_preset: 'orbitron' | 'space_grotesk' | 'jetbrains' | 'google_sans';
  default_mode?: 'dark' | 'light';
  enable_gamification: boolean;
  enable_quests: boolean;
  enable_skill_tree: boolean;
  enable_sound_fx: boolean;
  enable_certificates: boolean;
  seat_capacity: number;
  active_learners: number;
  is_active?: boolean;
}

export interface LessonSummary {
  id: number;
  title: string;
  slug: string;
  order: number;
  xp_value: number;
  lesson_type: 'CONCEPT' | 'CODE_LAB' | 'HOLOGRAPHIC_SIM' | 'ASSESSMENT';
  estimated_minutes: number;
  summary: string;
}

export interface LessonDetail extends LessonSummary {
  code_starter: string;
  code_solution: string;
  code_language: string;
  code_task: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  track: 'quantum' | 'cybersec' | 'ai' | 'space';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'SINGULARITY';
  estimated_duration: string;
  xp_reward: number;
  neon_color: string;
  icon_name: string;
  organization_name?: string;
  organization_slug?: string;
  badge_title?: string;
  lessons_count: number;
  lessons: LessonSummary[];
}

export interface Badge {
  id?: number;
  code: string;
  title: string;
  description: string;
  icon_name: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  xp_bonus: number;
  hologram_visual?: string;
}

export interface SkillNode {
  id?: number;
  slug: string;
  title: string;
  track: 'quantum' | 'cybersec' | 'ai' | 'space';
  tier: number;
  parent_slug?: string | null;
  description: string;
  xp_cost: number;
  icon: string;
  is_unlocked_default: boolean;
  order: number;
}

export interface Quest {
  id?: number;
  code: string;
  title: string;
  description: string;
  quest_type: 'DAILY' | 'WEEKLY' | 'SPECIAL';
  target_metric: string;
  target_count: number;
  xp_reward: number;
  icon: string;
  is_active: boolean;
  current_progress?: number;
  is_claimed?: boolean;
}

export interface LearnerProfile {
  id?: number;
  callsign: string;
  avatar_url: string;
  role: 'LEARNER' | 'INSTRUCTOR' | 'ORG_ADMIN';
  current_xp: number;
  level: number;
  streak_days: number;
  badges: Badge[];
  unlocked_skills: string[];
  completed_lessons: number[];
  active_quests_progress: Record<string, number>;
  organization_name?: string;
  organization_slug?: string;
  next_level_xp: number;
  progress_to_next_level: number;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  options: string[];
  code_sample?: string;
}

export interface QuizData {
  id: number;
  title: string;
  course_slug: string;
  lesson_order: number;
  passing_score: number;
  time_limit_seconds: number;
  xp_bounty: number;
  questions: QuizQuestion[];
}

export interface QuizFeedbackItem {
  question_id: string;
  user_choice: number;
  correct_choice: number;
  is_correct: boolean;
  explanation: string;
}

export interface QuizSubmissionResult {
  attempt_id: number;
  score_percent: number;
  passed: boolean;
  passing_score: number;
  correct_count: number;
  total_questions: number;
  xp_awarded: number;
  total_learner_xp: number;
  level: number;
  feedback: QuizFeedbackItem[];
}

export interface LeaderboardEntry {
  rank: number;
  callsign: string;
  level: number;
  xp: number;
  badges: number;
  streak: number;
  status: string;
}

