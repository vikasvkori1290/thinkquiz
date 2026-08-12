import express from "express";
import {
  getHealth,
  getLeetcodeProblem,
  getUserStatsRoute,
  getUserHistory,
  getLeaderboard,
  flushLeaderboardCache,
  generateQuiz,
  submitQuiz,
  updateSrs,
} from "../controllers/quizController.js";
import { deleteAccount } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/health", getHealth);
router.get("/leetcode/:title_slug", getLeetcodeProblem);
router.get("/user/:user_id/stats", getUserStatsRoute);
router.get("/user/:user_id/history", getUserHistory);
router.get("/leaderboard", getLeaderboard);
router.delete("/leaderboard/cache", flushLeaderboardCache);

router.post("/generate", protect, generateQuiz);
router.post("/quiz/submit", protect, submitQuiz);
router.post("/srs/update", protect, updateSrs);

// Map /api/user deletion to protect middleware
router.delete("/user", protect, deleteAccount);

export default router;
