import mongoose from "mongoose";

const spacedRepetitionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    question_id: {
      type: String,
      required: true,
      index: true,
    },
    easiness_factor: {
      type: Number,
      default: 2.5,
    },
    repetitions: {
      type: Number,
      default: 0,
    },
    interval: {
      type: Number,
      default: 0,
    },
    next_review_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.user_id = ret.userId || ret.user.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

spacedRepetitionSchema.index({ user: 1, question_id: 1 }, { unique: true });

export const SpacedRepetition = mongoose.model(
  "SpacedRepetition",
  spacedRepetitionSchema
);
