import { fetchLeetCodeProblem, getSlugFromNumber } from "../services/leetcodeService.js";
import { generateSocraticQuiz } from "../services/aiService.js";
import { getCachedQuiz, setCachedQuiz, redis } from "../services/cacheService.js";
import { processQuizSubmission } from "../services/gamificationService.js";
import { processSrsUpdate } from "../services/srsService.js";
import { UserStats } from "../models/UserStats.js";
import { User } from "../models/User.js";
import { QuizAttempt } from "../models/QuizAttempt.js";

// @desc Health check
// @route GET /api/health
export const getHealth = async (req, res) => {
  return res.json({
    status: "awake",
    timestamp: new Date().toISOString(),
  });
};

// @desc Fetch problem details from LeetCode
// @route GET /api/leetcode/:title_slug
export const getLeetcodeProblem = async (req, res) => {
  try {
    const { title_slug } = req.params;
    const data = await fetchLeetCodeProblem(title_slug);
    if (!data.data || !data.data.question) {
      return res.status(404).json({ detail: "Problem not found" });
    }
    return res.json(data.data.question);
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

// @desc Get user gamification stats
// @route GET /api/user/:user_id/stats
export const getUserStatsRoute = async (req, res) => {
  try {
    const { user_id } = req.params;
    let stats = await UserStats.findOne({ user: user_id });

    if (!stats) {
      // Check if user exists and auto-create stats
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ detail: "User stats not found" });
      }
      stats = await UserStats.create({
        user: user._id,
        userId: user._id.toString(),
        username: user.username,
        first_name: user.firstName,
        last_name: user.lastName,
        current_xp: 0,
        level: 1,
        current_streak: 0,
      });
    }

    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

// @desc Get user quiz attempts history
// @route GET /api/user/:user_id/history
export const getUserHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const attempts = await QuizAttempt.find({ user: user_id })
      .sort({ completed_at: -1 })
      .lean();

    return res.json(
      attempts.map((a) => ({
        id: a._id.toString(),
        user_id: a.userId || a.user.toString(),
        problem_slug: a.problem_slug,
        score: a.score,
        completed_at: a.completed_at ? a.completed_at.toISOString() : new Date().toISOString(),
      }))
    );
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

// @desc Get top 10 leaderboard users
// @route GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const cacheKey = "cache:leaderboard";

    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return res.json(typeof cached === "string" ? JSON.parse(cached) : cached);
        }
      } catch (err) {
        console.error("Redis get leaderboard error:", err.message);
      }
    }

    const leaderboard = await UserStats.find({})
      .sort({ current_xp: -1 })
      .limit(10)
      .lean();

    const data = leaderboard.map((item) => ({
      user_id: item.userId || item.user.toString(),
      current_xp: item.current_xp,
      level: item.level,
      first_name: item.first_name || "",
      last_name: item.last_name || "",
      username: item.username || "",
      email_prefix: item.username || "user",
    }));

    if (redis) {
      try {
        await redis.set(cacheKey, JSON.stringify(data), { ex: 300 });
      } catch (err) {
        console.error("Redis set leaderboard error:", err.message);
      }
    }

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ detail: `Database error: ${error.message}` });
  }
};

// @desc Flush leaderboard cache (Dev utility)
// @route DELETE /api/leaderboard/cache
export const flushLeaderboardCache = async (req, res) => {
  try {
    if (redis) {
      await redis.del("cache:leaderboard");
      return res.json({ message: "Leaderboard cache cleared." });
    }
    return res.json({ message: "Redis not available, skipping." });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

// @desc Generate Socratic Quiz
// @route POST /api/generate
export const generateQuiz = async (req, res) => {
  try {
    const { leetcode_slug, concept_topic } = req.body;

    if (!leetcode_slug && !concept_topic) {
      return res
        .status(400)
        .json({ detail: "Must provide either leetcode_slug or concept_topic" });
    }

    let cacheKey;
    let targetSlug = leetcode_slug;

    if (leetcode_slug) {
      if (/^\d+$/.test(leetcode_slug.trim())) {
        const mappedSlug = await getSlugFromNumber(parseInt(leetcode_slug.trim(), 10));
        if (mappedSlug) {
          targetSlug = mappedSlug;
        } else {
          return res
            .status(404)
            .json({ detail: `Question number ${leetcode_slug} not found.` });
        }
      }
      cacheKey = `quiz_v2:leetcode:${targetSlug}`;
    } else {
      const safeTopic = concept_topic.toLowerCase().replace(/\s+/g, "-");
      cacheKey = `quiz_v2:concept:${safeTopic}`;
    }

    const cachedData = await getCachedQuiz(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    let problemData = null;
    if (targetSlug) {
      const lcData = await fetchLeetCodeProblem(targetSlug);
      if (!lcData.data || !lcData.data.question) {
        return res.status(404).json({ detail: "Problem not found" });
      }
      problemData = lcData.data.question;
    }

    const quizJson = await generateSocraticQuiz(problemData, concept_topic);
    await setCachedQuiz(cacheKey, quizJson);

    return res.json(quizJson);
  } catch (error) {
    if (error.status === 429 || error.message?.includes("429")) {
      return res.status(429).json({
        detail:
          "The AI brain is currently overwhelmed by too many users. Please try again in 30 seconds.",
      });
    }
    return res.status(500).json({ detail: error.message });
  }
};

// @desc Submit Quiz
// @route POST /api/quiz/submit
export const submitQuiz = async (req, res) => {
  try {
    const result = await processQuizSubmission(req.body);
    return res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ detail: error.message });
    }
    return res.status(500).json({ detail: error.message });
  }
};

// @desc Update SRS (Spaced Repetition)
// @route POST /api/srs/update
export const updateSrs = async (req, res) => {
  try {
    const result = await processSrsUpdate(req.body);
    return res.json({ status: "success", data: result });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};
