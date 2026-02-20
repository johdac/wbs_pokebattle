import { model, Schema, Types } from "mongoose";

const scoreSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "A userId is required"],
    },
    score: { type: Number, required: [true, "a score value is required"] },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Score = model("Score", scoreSchema);
