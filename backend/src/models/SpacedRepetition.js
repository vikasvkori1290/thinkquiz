import mongoose from 'mongoose';

const spacedRepetitionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topicTitle: { type: String, required: true },
    questionText: { type: String, required: true },
    socraticHint: { type: String, required: true },
    repetitionCount: { type: Number, default: 0 },
    easinessFactor: { type: Number, default: 2.5 },
    intervalDays: { type: Number, default: 1 },
    nextReviewDate: { type: Date, required: true, index: true },
    lastQualityScore: { type: Number, default: 0 }, // 0 to 5 SM-2 scale
  },
  { timestamps: true }
);

export const SpacedRepetition = mongoose.model('SpacedRepetition', spacedRepetitionSchema);
