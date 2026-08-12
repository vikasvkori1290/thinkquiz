import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { UserStats } from "../models/UserStats.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { SpacedRepetition } from "../models/SpacedRepetition.js";
import { redis } from "../services/cacheService.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "thinkquiz_secret_key_2026", {
    expiresIn: "30d",
  });
};

// @desc Register user
// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { email, password, username, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ detail: "Please provide email and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ detail: "User already exists with this email" });
    }

    const user = await User.create({
      email,
      password,
      username: username || email.split("@")[0],
      firstName: firstName || "",
      lastName: lastName || "",
    });

    // Initialize user stats
    await UserStats.create({
      user: user._id,
      userId: user._id.toString(),
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
      current_xp: 0,
      level: 1,
      current_streak: 0,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ detail: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

// @desc Get current user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

// @desc Update profile info (username, firstName, lastName)
// @route PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { username, first_name, last_name } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }

    if (username !== undefined) user.username = username;
    if (first_name !== undefined) user.firstName = first_name;
    if (last_name !== undefined) user.lastName = last_name;

    await user.save();

    // Update UserStats denormalized name info
    await UserStats.findOneAndUpdate(
      { user: req.user.id },
      {
        username: user.username,
        first_name: user.firstName,
        last_name: user.lastName,
      }
    );

    // Flush leaderboard cache
    if (redis) {
      await redis.del("cache:leaderboard");
    }

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};

// @desc Delete account
// @route DELETE /api/user
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await QuizAttempt.deleteMany({ user: userId });
    await SpacedRepetition.deleteMany({ user: userId });
    await UserStats.deleteOne({ user: userId });
    await User.findByIdAndDelete(userId);

    if (redis) {
      await redis.del("cache:leaderboard");
    }

    return res.json({ status: "success", message: "User deleted successfully." });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
};
