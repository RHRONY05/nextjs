// ============================================================
// AlgoBoard — Shared Mock Data (TypeScript)
// Mirrors frontend/js/mock-data.js — used across all pages
// until real CF API + MongoDB is wired up
// ============================================================

import type {
  User,
  KanbanCard,
  TopicMeta,
  Badge,
  ContestHistoryEntry,
} from "@/types";

// ── Mock User ─────────────────────────────────────────────

export const MOCK_USER: User = {
  _id: "mock_user_id",
  googleId: "mock_google_id",
  email: "rony@example.com",
  name: "Rony",
  avatar:
    "https://ui-avatars.com/api/?name=Rony&background=5865F2&color=fff&size=128&bold=true",
  cfHandle: "rony_cf",
  cfHandleVerified: true,
  cfProfile: {
    rating: 1342,
    maxRating: 1398,
    rank: "specialist",
    maxRank: "specialist",
    country: "Bangladesh",
    organization: "RUET",
    cfAvatar: "https://userpic.codeforces.org/no-avatar.jpg",
    lastSyncedAt: new Date("2026-04-11T10:30:00Z"),
  },
  solvedProblems: [],
  contestHistory: [],
  gamification: {
    xp: 24500,
    level: "Problem Solver",
    currentStreak: 5,
    longestStreak: 12,
    lastSolvedDate: new Date("2026-04-10"),
    streakShieldActive: true,
    earnedBadges: [
      { badgeId: "first_blood",     earnedAt: new Date("2026-03-01") },
      { badgeId: "upsolve_warrior", earnedAt: new Date("2026-03-08") },
      { badgeId: "seven_day_streak",earnedAt: new Date("2026-03-15") },
    ],
  },
  targetRank: "expert",
  targetRating: 1600,
  topicProgress: {
    arrays:       6,
    sorting:      6,
    recursion:    4,
    "prefix-sums": 3,
    "binary-search": 3,
    "two-pointers":  2,
    greedy:       1,
  },
  emailPreferences: {
    enabled: true,
    frequency: "daily",
    preferredHour: 8,
    timezone: "Asia/Dhaka",
  },
  onboardingComplete: true,
  createdAt: new Date("2026-03-01"),
  updatedAt: new Date("2026-04-11"),
};

// ── Mock Kanban Cards ─────────────────────────────────────

export const MOCK_KANBAN_CARDS: KanbanCard[] = [
  {
    _id: "c1", userId: "mock_user_id",
    contestId: 1844, problemIndex: "C",
    problemName: "Subtraction Game",
    problemUrl: "https://codeforces.com/problemset/problem/1844/C",
    rating: 1200, tags: ["constructive algorithms", "math"],
    column: "to_upsolve", position: 0,
    source: "contest_sync", contestName: "Round 884 Div.2",
    addedAt: new Date("2026-03-10"), autoSolved: false, notes: "",
  },
  {
    _id: "c2", userId: "mock_user_id",
    contestId: 1856, problemIndex: "D",
    problemName: "Powering the Hero",
    problemUrl: "https://codeforces.com/problemset/problem/1856/D",
    rating: 1400, tags: ["greedy", "data structures"],
    column: "to_upsolve", position: 1,
    source: "contest_sync", contestName: "Round 891 Div.3",
    addedAt: new Date("2026-03-18"), autoSolved: false, notes: "",
  },
  {
    _id: "c3", userId: "mock_user_id",
    contestId: 1833, problemIndex: "E",
    problemName: "Round Corridor",
    problemUrl: "https://codeforces.com/problemset/problem/1833/E",
    rating: 1600, tags: ["math", "number theory"],
    column: "to_upsolve", position: 2,
    source: "contest_sync", contestName: "Round 876 Div.2",
    addedAt: new Date("2026-03-20"), autoSolved: false, notes: "",
  },
  {
    _id: "c4", userId: "mock_user_id",
    contestId: 1851, problemIndex: "C",
    problemName: "Tiles",
    problemUrl: "https://codeforces.com/problemset/problem/1851/C",
    rating: 1500, tags: ["combinatorics", "math"],
    column: "to_upsolve", position: 3,
    source: "topic_ladder", contestName: "Round 887 Div.2",
    addedAt: new Date("2026-03-22"), autoSolved: false, notes: "",
  },
  {
    _id: "c5", userId: "mock_user_id",
    contestId: 702, problemIndex: "C",
    problemName: "Cellular Network",
    problemUrl: "https://codeforces.com/problemset/problem/702/C",
    rating: 1600, tags: ["binary search", "implementation"],
    column: "trying", position: 0,
    source: "topic_ladder", contestName: "Round 366 Div.2",
    addedAt: new Date("2026-03-25"), autoSolved: false, notes: "",
  },
  {
    _id: "c6", userId: "mock_user_id",
    contestId: 1399, problemIndex: "C",
    problemName: "Boats Competition",
    problemUrl: "https://codeforces.com/problemset/problem/1399/C",
    rating: 1500, tags: ["binary search", "two pointers", "sorting"],
    column: "trying", position: 1,
    source: "topic_ladder", contestName: "Round 667 Div.3",
    addedAt: new Date("2026-03-28"), autoSolved: false, notes: "",
  },
  {
    _id: "c7", userId: "mock_user_id",
    contestId: 1742, problemIndex: "C",
    problemName: "Stripes",
    problemUrl: "https://codeforces.com/problemset/problem/1742/C",
    rating: 1300, tags: ["constructive algorithms"],
    column: "solved", position: 0,
    source: "contest_sync", contestName: "Round 824 Div.2",
    addedAt: new Date("2026-03-12"), solvedAt: new Date("2026-03-15"),
    autoSolved: false, notes: "",
  },
  {
    _id: "c8", userId: "mock_user_id",
    contestId: 1398, problemIndex: "C",
    problemName: "Good Subarrays",
    problemUrl: "https://codeforces.com/problemset/problem/1398/C",
    rating: 1400, tags: ["two pointers", "implementation"],
    column: "solved", position: 1,
    source: "contest_sync", contestName: "Round 666 Div.2",
    addedAt: new Date("2026-03-15"), solvedAt: new Date("2026-03-20"),
    autoSolved: true, notes: "",
  },
];

// ── Mock Rating History ────────────────────────────────────

export const MOCK_RATING_HISTORY: ContestHistoryEntry[] = [
  { contestId: 1621, contestName: "Round 762 Div.3", rank: 2341, oldRating: 1200, newRating: 1243, ratingChange: 43,  participatedAt: new Date("2025-06-10") },
  { contestId: 1650, contestName: "Round 776 Div.2", rank: 3102, oldRating: 1243, newRating: 1221, ratingChange: -22, participatedAt: new Date("2025-07-02") },
  { contestId: 1680, contestName: "Round 790 Div.2", rank: 1890, oldRating: 1221, newRating: 1278, ratingChange: 57,  participatedAt: new Date("2025-07-28") },
  { contestId: 1700, contestName: "Round 806 Div.3", rank: 1450, oldRating: 1278, newRating: 1315, ratingChange: 37,  participatedAt: new Date("2025-08-15") },
  { contestId: 1742, contestName: "Round 824 Div.2", rank: 2100, oldRating: 1315, newRating: 1298, ratingChange: -17, participatedAt: new Date("2025-09-10") },
  { contestId: 1780, contestName: "Round 844 Div.3", rank: 890,  oldRating: 1298, newRating: 1342, ratingChange: 44,  participatedAt: new Date("2025-10-05") },
  { contestId: 1810, contestName: "Round 858 Div.2", rank: 1720, oldRating: 1342, newRating: 1320, ratingChange: -22, participatedAt: new Date("2025-11-01") },
  { contestId: 1833, contestName: "Round 876 Div.2", rank: 1205, oldRating: 1320, newRating: 1372, ratingChange: 52,  participatedAt: new Date("2025-12-12") },
  { contestId: 1856, contestName: "Round 891 Div.3", rank: 760,  oldRating: 1372, newRating: 1398, ratingChange: 26,  participatedAt: new Date("2026-01-20") },
  { contestId: 1870, contestName: "Round 899 Div.2", rank: 2800, oldRating: 1398, newRating: 1355, ratingChange: -43, participatedAt: new Date("2026-02-14") },
  { contestId: 1884, contestName: "Round 907 Div.3", rank: 1100, oldRating: 1355, newRating: 1342, ratingChange: -13, participatedAt: new Date("2026-03-05") },
];

// ── Mock Problems by Rating Bucket ─────────────────────────

export const MOCK_PROBLEMS_BY_RATING = [
  { rating: 800,  count: 28 },
  { rating: 900,  count: 34 },
  { rating: 1000, count: 41 },
  { rating: 1100, count: 29 },
  { rating: 1200, count: 22 },
  { rating: 1300, count: 18 },
  { rating: 1400, count: 9  },
  { rating: 1500, count: 5  },
];

// ── Mock Problems by Tag ───────────────────────────────────

export const MOCK_TOPICS_SOLVED = [
  { tag: "implementation", count: 48 },
  { tag: "math",           count: 32 },
  { tag: "greedy",         count: 27 },
  { tag: "dp",             count: 18 },
  { tag: "binary search",  count: 14 },
  { tag: "two pointers",   count: 12 },
  { tag: "constructive",   count: 11 },
  { tag: "graphs",         count: 6  },
];

// ── Mock Topics ────────────────────────────────────────────

export const MOCK_TOPICS: (TopicMeta & { locked?: boolean })[] = [
  { _id: "t1",  slug: "arrays",        displayName: "Arrays",        icon: "📦", layer: 1, difficultyLabel: "Foundation",   description: "Core array manipulation",  recommendedFor: [], prerequisites: [], totalProblems: 6, isActive: true, solvedCount: 6 },
  { _id: "t2",  slug: "sorting",       displayName: "Sorting",       icon: "🔢", layer: 1, difficultyLabel: "Foundation",   description: "Sorting algorithms",        recommendedFor: [], prerequisites: [], totalProblems: 6, isActive: true, solvedCount: 6 },
  { _id: "t3",  slug: "recursion",     displayName: "Recursion",     icon: "🔄", layer: 1, difficultyLabel: "Foundation",   description: "Recursive thinking",        recommendedFor: ["expert"], prerequisites: [], totalProblems: 6, isActive: true, solvedCount: 4 },
  { _id: "t4",  slug: "prefix-sums",   displayName: "Prefix Sums",   icon: "➕", layer: 1, difficultyLabel: "Foundation",   description: "Prefix sum technique",     recommendedFor: ["expert"], prerequisites: [], totalProblems: 6, isActive: true, solvedCount: 3 },
  { _id: "t5",  slug: "binary-search", displayName: "Binary Search", icon: "🔍", layer: 2, difficultyLabel: "Intermediate", description: "Binary search patterns",   recommendedFor: ["expert"], prerequisites: ["sorting"], totalProblems: 6, isActive: true, solvedCount: 3 },
  { _id: "t6",  slug: "two-pointers",  displayName: "Two Pointers",  icon: "👆", layer: 2, difficultyLabel: "Intermediate", description: "Two pointer technique",    recommendedFor: ["expert"], prerequisites: ["sorting"], totalProblems: 6, isActive: true, solvedCount: 2 },
  { _id: "t7",  slug: "greedy",        displayName: "Greedy",        icon: "💡", layer: 2, difficultyLabel: "Intermediate", description: "Greedy algorithms",        recommendedFor: ["expert"], prerequisites: [], totalProblems: 6, isActive: true, solvedCount: 1 },
  { _id: "t8",  slug: "hashing",       displayName: "Hashing",       icon: "🔑", layer: 2, difficultyLabel: "Intermediate", description: "Hash map techniques",      recommendedFor: [], prerequisites: [], totalProblems: 6, isActive: true, solvedCount: 0 },
  { _id: "t9",  slug: "bfs-dfs",       displayName: "BFS / DFS",     icon: "🌐", layer: 3, difficultyLabel: "Advanced",     description: "Graph traversal",          recommendedFor: [], prerequisites: ["recursion"], totalProblems: 6, isActive: true, solvedCount: 0, locked: true },
  { _id: "t10", slug: "dp-basic",      displayName: "DP Basics",     icon: "🧩", layer: 3, difficultyLabel: "Advanced",     description: "Dynamic programming",     recommendedFor: [], prerequisites: ["recursion"], totalProblems: 6, isActive: true, solvedCount: 0, locked: true },
  { _id: "t11", slug: "segment-trees", displayName: "Segment Trees", icon: "🌲", layer: 3, difficultyLabel: "Advanced",     description: "Segment tree structure",  recommendedFor: [], prerequisites: ["prefix-sums"], totalProblems: 6, isActive: true, solvedCount: 0, locked: true },
  { _id: "t12", slug: "disjoint-set",  displayName: "Disjoint Set",  icon: "🔗", layer: 3, difficultyLabel: "Advanced",     description: "Union-find algorithm",    recommendedFor: [], prerequisites: [], totalProblems: 6, isActive: true, solvedCount: 0, locked: true },
  { _id: "t13", slug: "flows",         displayName: "Network Flows", icon: "🌊", layer: 4, difficultyLabel: "Expert",       description: "Max flow / min cut",      recommendedFor: [], prerequisites: [], totalProblems: 6, isActive: true, solvedCount: 0, locked: true },
  { _id: "t14", slug: "fft",           displayName: "FFT",           icon: "📡", layer: 4, difficultyLabel: "Expert",       description: "Fast Fourier Transform",  recommendedFor: [], prerequisites: [], totalProblems: 6, isActive: true, solvedCount: 0, locked: true },
];

// ── Mock Badges ────────────────────────────────────────────

export const MOCK_BADGES: Badge[] = [
  {
    badgeId: "first_blood",     displayName: "First Blood",     icon: "🩸",
    rarity: "common",           description: "Solve your first problem on AlgoBoard",
    condition: { type: "solve_count", threshold: 1 },
    earned: true,               earnedAt: new Date("2026-03-01"),
  },
  {
    badgeId: "upsolve_warrior", displayName: "Upsolve Warrior", icon: "⚔️",
    rarity: "rare",             description: "Move 10 cards to Solved column",
    condition: { type: "solved_cards", threshold: 10 },
    earned: true,               earnedAt: new Date("2026-03-08"),
  },
  {
    badgeId: "seven_day_streak", displayName: "7-Day Streak",  icon: "🔥",
    rarity: "epic",              description: "Solve a problem every day for 7 days",
    condition: { type: "streak", threshold: 7 },
    earned: true,                earnedAt: new Date("2026-03-15"),
  },
  {
    badgeId: "topic_explorer",  displayName: "Topic Explorer",  icon: "🗺️",
    rarity: "rare",             description: "Complete problems in 5 different topics",
    condition: { type: "topic_count", threshold: 5 },
    earned: false,              progress: 3, progressMax: 5,
  },
  {
    badgeId: "contest_regular", displayName: "Contest Regular", icon: "🏆",
    rarity: "rare",             description: "Participate in 10 rated contests",
    condition: { type: "contest_count", threshold: 10 },
    earned: false,              progress: 7, progressMax: 10,
  },
  {
    badgeId: "binary_bandit",   displayName: "Binary Bandit",   icon: "⚡",
    rarity: "epic",             description: "Solve all 6 Binary Search topic problems",
    condition: { type: "topic_complete", threshold: 6, filter: "binary-search" },
    earned: false,              progress: 2, progressMax: 6,
  },
  {
    badgeId: "speed_learner",   displayName: "Speed Learner",   icon: "🚀",
    rarity: "legendary",        description: "Complete a topic within 48 hours of starting",
    condition: { type: "topic_speed", threshold: 1 },
    earned: false,              progress: 0, progressMax: 1,
  },
  {
    badgeId: "dp_disciple",     displayName: "DP Disciple",     icon: "🧩",
    rarity: "epic",             description: "Solve all 6 DP Basics topic problems",
    condition: { type: "topic_complete", threshold: 6, filter: "dp-basic" },
    earned: false,              progress: 0, progressMax: 6,
  },
  {
    badgeId: "graph_walker",    displayName: "Graph Walker",    icon: "🌐",
    rarity: "epic",             description: "Solve all 6 BFS/DFS topic problems",
    condition: { type: "topic_complete", threshold: 6, filter: "bfs-dfs" },
    earned: false,              progress: 0, progressMax: 6,
  },
  {
    badgeId: "algoboard_og",    displayName: "AlgoBoard OG",    icon: "👑",
    rarity: "legendary",        description: "Join AlgoBoard during the first month of launch",
    condition: { type: "early_adopter", threshold: 1 },
    earned: false,              progress: 0, progressMax: 1,
  },
];
