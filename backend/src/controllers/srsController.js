import { SpacedRepetition } from '../models/SpacedRepetition.js';

export const getDueReviews = async (req, res) => {
  const now = new Date();
  const dueItems = await SpacedRepetition.find({
    userId: req.user._id,
    nextReviewDate: { $lte: now },
  }).sort({ nextReviewDate: 1 });

  res.json(dueItems);
};

export const submitSrsReview = async (req, res) => {
  const { srsId, qualityScore } = req.body; // SM-2 score (0 to 5)
  const item = await SpacedRepetition.findOne({ _id: srsId, userId: req.user._id });
  if (!item) return res.status(404).json({ message: 'SRS item not found' });

  // SM-2 Algorithm
  let { repetitionCount, easinessFactor, intervalDays } = item;
  const q = Math.max(0, Math.min(5, qualityScore));

  if (q >= 3) {
    if (repetitionCount === 0) intervalDays = 1;
    else if (repetitionCount === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easinessFactor);
    repetitionCount += 1;
  } else {
    repetitionCount = 0;
    intervalDays = 1;
  }

  easinessFactor = easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easinessFactor < 1.3) easinessFactor = 1.3;

  item.repetitionCount = repetitionCount;
  item.easinessFactor = easinessFactor;
  item.intervalDays = intervalDays;
  item.lastQualityScore = q;
  item.nextReviewDate = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);

  await item.save();
  res.json(item);
};
