import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'thinkquiz_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return res.status(400).json({ message: 'User with this email or username already exists' });
  }
  const user = await User.create({ firstName, lastName, username, email, password });
  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    token: generateToken(user._id),
  });
};

export const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.mobile = req.body.mobile || user.mobile;
    user.socialUrl = req.body.socialUrl || user.socialUrl;
    user.leetcodeUrl = req.body.leetcodeUrl || user.leetcodeUrl;

    if (!user.isProfileComplete && user.firstName && user.lastName && user.mobile) {
      user.isProfileComplete = true;
      user.xp += 10; // +10 XP bonus
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      email: updatedUser.email,
      xp: updatedUser.xp,
      level: updatedUser.level,
      streak: updatedUser.streak,
      mobile: updatedUser.mobile,
      socialUrl: updatedUser.socialUrl,
      leetcodeUrl: updatedUser.leetcodeUrl,
      isProfileComplete: updatedUser.isProfileComplete,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
