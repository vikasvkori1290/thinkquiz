import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
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
    problem_slug: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    completed_at: {
      type: Date,
      default: Date.now,
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

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
