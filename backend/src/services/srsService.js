import { SpacedRepetition } from "../models/SpacedRepetition.js";

export const processSrsUpdate = async (update) => {
  const { user_id, question_id, quality_score } = update;

  let record = await SpacedRepetition.findOne({ user: user_id, question_id });

  let easinessFactor = record ? record.easiness_factor : 2.5;
  let repetitions = record ? record.repetitions : 0;
  let interval = record ? record.interval : 0;

  const q = quality_score;

  // Standard SM-2 Algorithm
  if (q >= 3) {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
  } else {
    repetitions = 0;
    interval = 1;
  }

  easinessFactor = easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easinessFactor < 1.3) {
    easinessFactor = 1.3;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  const updatedRecord = await SpacedRepetition.findOneAndUpdate(
    { user: user_id, question_id },
    {
      user: user_id,
      userId: user_id,
      question_id,
      easiness_factor: easinessFactor,
      repetitions,
      interval,
      next_review_date: nextReviewDate,
    },
    { upsert: true, new: true }
  );

  return updatedRecord;
};
