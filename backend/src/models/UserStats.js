import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    current_xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    current_streak: {
      type: Number,
      default: 0,
    },
    last_active_date: {
      type: String, // ISO date string 'YYYY-MM-DD'
      default: null,
    },
    username: { type: String, default: "" },
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.user_id = ret.userId || ret.user.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const UserStats = mongoose.model("UserStats", userStatsSchema);
