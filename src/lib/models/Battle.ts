import mongoose, { Schema, Document } from "mongoose";

export interface IBattle extends Document {
  userId: mongoose.Types.ObjectId; // The registered user who started it
  userHandle: string; // The CF handle of the registered user
  opponentHandle: string; // CF handle of the opponent
  problem: {
    contestId: number;
    index: string;
    name: string;
    rating?: number;
    tags?: string[];
  };
  startTime?: Date;
  endTime?: Date;
  status: "pending" | "active" | "completed" | "declined";
  winner: "user" | "opponent" | "draw" | null;
  userSolveTime?: Date;
  opponentSolveTime?: Date;
  createdAt: Date;
}

const BattleSchema = new Schema<IBattle>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userHandle: { type: String, required: true },
    opponentHandle: { type: String, required: true },
    problem: {
      contestId: { type: Number, required: true },
      index: { type: String, required: true },
      name: { type: String, required: true },
      rating: { type: Number },
      tags: { type: [String], default: [] },
    },
    startTime: { type: Date, required: false, default: undefined },
    endTime: { type: Date, required: false, default: undefined },
    status: { 
      type: String, 
      enum: {
        values: ["pending", "active", "completed", "declined"],
        message: '{VALUE} is not a valid status'
      },
      default: "pending",
      required: true
    },
    winner: { type: String, enum: ["user", "opponent", "draw", null], default: null },
    userSolveTime: { type: Date },
    opponentSolveTime: { type: Date },
  },
  { timestamps: true }
);

// Index to easily fetch active battles for a user
BattleSchema.index({ userId: 1, status: 1 });

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Battle;
}

const BattleModel =
  mongoose.models.Battle || mongoose.model<IBattle>("Battle", BattleSchema);

export default BattleModel;
