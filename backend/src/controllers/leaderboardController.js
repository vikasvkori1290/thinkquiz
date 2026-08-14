import { User } from '../models/User.js';

export const getLeaderboard = async (req, res) => {
  const topUsers = await User.find()
    .select('firstName lastName username xp level streak leetcodeUrl')
    .sort({ xp: -1 })
    .limit(10);

  res.json(topUsers);
};
