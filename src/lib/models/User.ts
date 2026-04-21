import mongoose, { Schema, type Document, type Model } from "mongoose";

// ── Sub-schemas ──────────────────────────────────────────────────────────────

const SolvedProblemSchema = new Schema(
  {
    contestId: { type: Number, required: true },
    problemIndex: { type: String, required: true },
    problemName: { type: String, required: true },
    rating: { type: Number },
    tags: { type: [String], default: [] },
    solvedAt: { type: Date, required: true },
  },
  { _id: false },
);

const ContestHistorySchema = new Schema(
  {
    contestId: { type: Number, required: true },
    contestName: { type: String, required: true },
    rank: { type: Number, required: true },
    oldRating: { type: Number, required: true },
    newRating: { type: Number, required: true },
    ratingChange: { type: Number, required: true },
    participatedAt: { type: Date, required: true },
  },
  { _id: false },
);

const CfProfileSchema = new Schema(
  {
    rating: { type: Number },
    maxRating: { type: Number },
    rank: { type: String },
    maxRank: { type: String },
    country: { type: String },
    organization: { type: String },
    cfAvatar: { type: String },
    lastSyncedAt: { type: Date },
  },
  { _id: false },
);

const CfVerificationSchema = new Schema(
  {
    initiatedAt: { type: Date, required: true },
    problem: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false },
);

const EarnedBadgeSchema = new Schema(
  {
    badgeId: { type: String, required: true },
    earnedAt: { type: Date, required: true },
  },
  { _id: false },
);

const GamificationSchema = new Schema(
  {
    xp: { type: Number, default: 0 },
    level: { type: String, default: "Newcomer" },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastSolvedDate: { type: Date },
    streakShieldActive: { type: Boolean, default: false },
    earnedBadges: { type: [EarnedBadgeSchema], default: [] },
  },
  { _id: false },
);

const EmailPreferencesSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    frequency: {
      type: String,
      default: "weekly",
      enum: ["daily", "every_2_days", "weekly", "off"],
    },
    preferredHour: { type: Number, default: 9 },
    timezone: { type: String, default: "UTC" },
  },
  { _id: false },
);

// ── Main User schema ─────────────────────────────────────────────────────────

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  cfHandle?: string;
  cfHandleVerified: boolean;
  cfVerification?: {
    initiatedAt: Date;
    problem: string;
    expiresAt: Date;
  };
  cfProfile?: {
    rating?: number;
    maxRating?: number;
    rank?: string;
    maxRank?: string;
    country?: string;
    organization?: string;
    cfAvatar?: string;
    lastSyncedAt?: Date;
  };
  solvedProblems: Array<{
    contestId: number;
    problemIndex: string;
    problemName: string;
    rating?: number;
    tags: string[];
    solvedAt: Date;
  }>;
  contestHistory: Array<{
    contestId: number;
    contestName: string;
    rank: number;
    oldRating: number;
    newRating: number;
    ratingChange: number;
    participatedAt: Date;
  }>;
  gamification: {
    xp: number;
    level: string;
    currentStreak: number;
    longestStreak: number;
    lastSolvedDate?: Date;
    streakShieldActive: boolean;
    earnedBadges: Array<{ badgeId: string; earnedAt: Date }>;
  };
  targetRank?: string;
  targetRating?: number;
  topicProgress: Map<string, number>;
  emailPreferences: {
    enabled: boolean;
    frequency: string;
    preferredHour: number;
    timezone: string;
  };
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String },
    cfHandle: { type: String },
    cfHandleVerified: { type: Boolean, default: false },
    cfVerification: { type: CfVerificationSchema },
    cfProfile: { type: CfProfileSchema },
    solvedProblems: { type: [SolvedProblemSchema], default: [] },
    contestHistory: { type: [ContestHistorySchema], default: [] },
    gamification: { type: GamificationSchema, default: () => ({}) },
    targetRank: {
      type: String,
      enum: ["specialist", "expert", "candidate_master", "master"],
    },
    targetRating: { type: Number },
    topicProgress: { type: Map, of: Number, default: () => new Map() },
    emailPreferences: { type: EmailPreferencesSchema, default: () => ({}) },
    onboardingComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const UserModel: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default UserModel;
