import { User } from '../models/User.js';
import { Submission } from '../models/Submission.js';
import { SpacedRepetition } from '../models/SpacedRepetition.js';

export const getUserDashboardStats = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  const recentSubmissions = await Submission.find({ userId: req.user._id })
    .populate('quizId', 'title mode topicOrSlug difficulty')
    .sort({ createdAt: -1 })
    .limit(10);

  const dueSrsCount = await SpacedRepetition.countDocuments({
    userId: req.user._id,
    nextReviewDate: { $lte: new Date() },
  });

  res.json({
    user,
    recentSubmissions,
    dueSrsCount,
  });
};

export const deleteAccount = async (req, res) => {
  const userId = req.user._id;
  await User.findByIdAndDelete(userId);
  await Submission.deleteMany({ userId });
  await SpacedRepetition.deleteMany({ userId });

  res.json({ message: 'Account and associated data deleted successfully' });
};
