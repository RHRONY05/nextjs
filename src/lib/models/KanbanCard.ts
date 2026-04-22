import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IKanbanCard extends Document {
  userId: mongoose.Types.ObjectId;
  contestId: number;
  problemIndex: string;
  problemName: string;
  problemUrl: string;
  rating?: number;
  tags: string[];
  column: "to_upsolve" | "trying" | "solved";
  position: number;
  source: "contest_sync" | "topic_ladder" | "manual";
  contestName?: string;
  addedAt: Date;
  solvedAt?: Date;
  autoSolved: boolean;
  notes: string;
}

const KanbanCardSchema = new Schema<IKanbanCard>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    contestId: { type: Number, required: true },
    problemIndex: { type: String, required: true },
    problemName: { type: String, required: true },
    problemUrl: { type: String, required: true },
    rating: { type: Number },
    tags: { type: [String], default: [] },
    column: {
      type: String,
      enum: ["to_upsolve", "trying", "solved"],
      default: "to_upsolve",
      index: true,
    },
    position: { type: Number, default: 0 },
    source: {
      type: String,
      enum: ["contest_sync", "topic_ladder", "manual"],
      default: "manual",
    },
    contestName: { type: String },
    addedAt: { type: Date, default: Date.now },
    solvedAt: { type: Date },
    autoSolved: { type: Boolean, default: false },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound index for unique problem per user
KanbanCardSchema.index({ userId: 1, contestId: 1, problemIndex: 1 }, { unique: true });

const KanbanCardModel: Model<IKanbanCard> =
  mongoose.models.KanbanCard ?? mongoose.model<IKanbanCard>("KanbanCard", KanbanCardSchema);

export default KanbanCardModel;
