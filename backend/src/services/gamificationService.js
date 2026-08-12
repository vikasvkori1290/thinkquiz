import { QuizAttempt } from "../models/QuizAttempt.js";
import { UserStats } from "../models/UserStats.js";
import { redis } from "./cacheService.js";

export const processQuizSubmission = async (submission) => {
  const { user_id, quiz_id_or_concept, score, xp_earned } = submission;

  // Anti-Farming Security: Check if user already submitted this topic today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const recentAttempt = await QuizAttempt.findOne({
    user: user_id,
    problem_slug: quiz_id_or_concept,
    completed_at: { $gte: todayStart },
  });

  if (recentAttempt) {
    const error = new Error("Cooldown: You have already completed this topic today.");
    error.statusCode = 403;
    throw error;
  }

  // Step 1: Insert into quiz_attempts
  await QuizAttempt.create({
    user: user_id,
    userId: user_id,
    problem_slug: quiz_id_or_concept,
    score,
  });

  // Step 2: Fetch or initialize user's stats
  let stats = await UserStats.findOne({ user: user_id });

  let currentXp = stats ? stats.current_xp : 0;
  let level = stats ? stats.level : 1;
  let currentStreak = stats ? stats.current_streak : 0;
  let lastActiveDate = stats ? stats.last_active_date : null;

  // Step 3: XP & Level
  const newXp = currentXp + xp_earned;
  const newLevel = Math.floor(newXp / 100) + 1;
  const leveledUp = newLevel > level;

  // Step 4: Streaks
  const todayStr = new Date().toISOString().split("T")[0];
  let newStreak = 1;

  if (lastActiveDate) {
    const todayDate = new Date(todayStr);
    const lastDate = new Date(lastActiveDate);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 1) {
      newStreak = currentStreak + 1;
    } else if (diffDays === 0) {
      newStreak = currentStreak;
    } else {
      newStreak = 1;
    }
  }

  // Step 5: Update user_stats
  stats = await UserStats.findOneAndUpdate(
    { user: user_id },
    {
      user: user_id,
      userId: user_id,
      current_xp: newXp,
      level: newLevel,
      current_streak: newStreak,
      last_active_date: todayStr,
    },
    { upsert: true, new: true }
  );

  // Flush leaderboard cache
  if (redis) {
    try {
      await redis.del("cache:leaderboard");
    } catch (err) {
      console.error("Redis leaderboard delete error:", err.message);
    }
  }

  return {
    new_xp: newXp,
    new_level: newLevel,
    streak: newStreak,
    leveled_up: leveledUp,
  };
};
