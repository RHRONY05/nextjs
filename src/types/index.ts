// ============================================================
// AlgoBoard — Shared TypeScript Types
// Matches the MongoDB schema defined in AlgoBoard-SRS.md §5
// ============================================================

// ── CF API types ──────────────────────────────────────────

export type CfRank =
  | "newbie"
  | "pupil"
  | "specialist"
  | "expert"
  | "candidate master"
  | "master"
  | "international master"
  | "grandmaster"
  | "international grandmaster"
  | "legendary grandmaster";

export interface CfUserInfo {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: CfRank;
  maxRank?: CfRank;
  country?: string;
  organization?: string;
  avatar?: string;
  titlePhoto?: string;
}

export interface CfSubmission {
  id: number;
  contestId?: number;
  problem: {
    contestId?: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
  };
  verdict?: string;
  creationTimeSeconds: number;
}

export interface CfRatingChange {
  contestId: number;
  contestName: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

// ── User model ────────────────────────────────────────────

export interface SolvedProblem {
  contestId: number;
  problemIndex: string;
  problemName: string;
  rating?: number;
  tags: string[];
  solvedAt: Date;
}

export interface ContestHistoryEntry {
  contestId: number;
  contestName: string;
  rank: number;
  oldRating: number;
  newRating: number;
  ratingChange: number;
  participatedAt: Date;
}

export interface CfProfile {
  rating?: number;
  maxRating?: number;
  rank?: CfRank;
  maxRank?: CfRank;
  country?: string;
  organization?: string;
  cfAvatar?: string;
  lastSyncedAt?: Date;
}

export interface CfVerification {
  initiatedAt: Date;
  problem: string;
  expiresAt: Date;
}

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface EarnedBadge {
  badgeId: string;
  earnedAt: Date;
}

export interface Gamification {
  xp: number;
  level: string;
  currentStreak: number;
  longestStreak: number;
  lastSolvedDate?: Date;
  streakShieldActive: boolean;
  earnedBadges: EarnedBadge[];
}

export type EmailFrequency = "daily" | "every_2_days" | "weekly" | "off";

export interface EmailPreferences {
  enabled: boolean;
  frequency: EmailFrequency;
  preferredHour: number; // 0–23 UTC
  timezone: string;
}

export type TargetRank = "specialist" | "expert" | "candidate_master" | "master";

export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  cfHandle?: string;
  cfHandleVerified: boolean;
  cfVerification?: CfVerification;
  cfProfile?: CfProfile;
  solvedProblems: SolvedProblem[];
  contestHistory: ContestHistoryEntry[];
  gamification: Gamification;
  targetRank?: TargetRank;
  targetRating?: number;
  topicProgress: Record<string, number>;
  emailPreferences: EmailPreferences;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── KanbanCard model ──────────────────────────────────────

export type KanbanColumn = "to_upsolve" | "trying" | "solved";
export type CardSource = "contest_sync" | "topic_ladder" | "manual";

export interface KanbanCard {
  _id: string;
  userId: string;
  contestId: number;
  problemIndex: string;
  problemName: string;
  problemUrl: string;
  rating?: number;
  tags: string[];
  column: KanbanColumn;
  position: number;
  source: CardSource;
  contestName?: string;
  addedAt: Date;
  solvedAt?: Date;
  autoSolved: boolean;
  notes: string;
}

// ── CuratedProblem model ──────────────────────────────────

export type ProblemTier = "canonical" | "core" | "contest";
export type Platform = "codeforces" | "cses";

export interface CuratedProblem {
  _id: string;
  contestId?: number;
  problemIndex: string;
  problemName: string;
  problemUrl: string;
  platform: Platform;
  topicSlug: string;
  tier: ProblemTier;
  rating?: number;
  estimatedRating?: number;
  solveCount?: number;
  hasEditorial: boolean;
  editorialUrl?: string;
  worthScore: number;
  tags: string[];
  lastRefreshedAt?: Date;
  solved?: boolean; // client-side only — cross-referenced against user.solvedProblems
}

// ── TopicMeta model ───────────────────────────────────────

export type DifficultyLayer = 1 | 2 | 3 | 4;
export type DifficultyLabel = "Foundation" | "Intermediate" | "Advanced" | "Expert";

export interface TopicMeta {
  _id: string;
  slug: string;
  displayName: string;
  icon: string;
  description: string;
  layer: DifficultyLayer;
  difficultyLabel: DifficultyLabel;
  recommendedFor: TargetRank[];
  prerequisites: string[];
  totalProblems: number;
  isActive: boolean;
  solvedCount?: number; // client-side only — from user.topicProgress
}

// ── Badge model ───────────────────────────────────────────

export interface Badge {
  badgeId: string;
  displayName: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  condition: {
    type: string;
    threshold: number;
    filter?: string;
  };
  earned?: boolean;       // client-side only
  earnedAt?: Date;        // client-side only
  progress?: number;      // client-side only — e.g. 7
  progressMax?: number;   // client-side only — e.g. 10
}

// ── Level config ──────────────────────────────────────────

export interface LevelConfig {
  name: string;
  minXp: number;
  maxXp: number;
}

// ── CF Rank color map ─────────────────────────────────────

export const CF_RANK_COLORS: Record<string, string> = {
  newbie:                      "#808080",
  pupil:                       "#008000",
  specialist:                  "#03A89E",
  expert:                      "#0000FF",
  "candidate master":          "#AA00AA",
  candidate_master:            "#AA00AA",
  master:                      "#FF8C00",
  "international master":      "#FF8C00",
  grandmaster:                 "#FF0000",
  "international grandmaster": "#FF0000",
  "legendary grandmaster":     "#FF0000",
};

export const LEVEL_CONFIG: LevelConfig[] = [
  { name: "Newcomer",        minXp: 0,      maxXp: 5000   },
  { name: "Problem Solver",  minXp: 5000,   maxXp: 35000  },
  { name: "Algorithm Adept", minXp: 35000,  maxXp: 80000  },
  { name: "Code Warrior",    minXp: 80000,  maxXp: 150000 },
  { name: "Grandmaster",     minXp: 150000, maxXp: 250000 },
  { name: "CF Warrior",      minXp: 250000, maxXp: Infinity },
];

export function getLevelFromXp(xp: number): LevelConfig {
  return (
    LEVEL_CONFIG.find((l) => xp >= l.minXp && xp < l.maxXp) ??
    LEVEL_CONFIG[LEVEL_CONFIG.length - 1]
  );
}
