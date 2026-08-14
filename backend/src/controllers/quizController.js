import { Quiz } from '../models/Quiz.js';
import { Submission } from '../models/Submission.js';
import { User } from '../models/User.js';
import { SpacedRepetition } from '../models/SpacedRepetition.js';
import { aiTrafficController } from '../services/aiTrafficController.js';

export const generateQuiz = async (req, res) => {
  const { mode, topicOrSlug, difficulty = 'Medium' } = req.body;
  if (!mode || !topicOrSlug) {
    return res.status(400).json({ message: 'mode and topicOrSlug are required' });
  }

  const promptText = `
You are a world-class Socratic technical interviewer.
Generate a Socratic quiz for mode "${mode}" on topic/problem "${topicOrSlug}" with difficulty "${difficulty}".
Number of questions: ${mode === 'leetcode' ? 3 : 5}.

Return ONLY valid JSON matching this structure:
{
  "title": "Socratic Quiz on ${topicOrSlug}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "questionText": "Socratic probing question text...",
      "codeSnippet": "optional code snippet if applicable",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "socraticHint": "Helpful conceptual hint guiding the user without revealing the answer...",
      "explanation": "Detailed explanation of why this choice is correct..."
    }
  ]
}
`;

  try {
    const aiResult = await aiTrafficController.generateSocraticQuiz(promptText);
    const quizData = aiResult.data;

    const quiz = await Quiz.create({
      title: quizData.title || `Socratic Quiz on ${topicOrSlug}`,
      mode,
      topicOrSlug,
      difficulty: quizData.difficulty || difficulty,
      questions: quizData.questions,
      providerUsed: aiResult.providerUsed,
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error(`[Quiz Generation Error]:`, error);
    res.status(500).json({ message: error.message || 'Failed to generate quiz' });
  }
};

export const getQuizById = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  res.json(quiz);
};

export const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body; // answers = [{ questionIndex, selectedIndex }]
  const quiz = await Quiz.findById(quizId);
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

  let correctCount = 0;
  const userAnswers = quiz.questions.map((q, idx) => {
    const userChoice = answers.find((a) => a.questionIndex === idx);
    const selectedIndex = userChoice ? userChoice.selectedIndex : -1;
    const isCorrect = selectedIndex === q.correctAnswerIndex;
    if (isCorrect) correctCount++;
    return { questionIndex: idx, selectedIndex, isCorrect };
  });

  const totalQuestions = quiz.questions.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const xpEarned = scorePercent * 10; // XP = Score * 10

  const submission = await Submission.create({
    userId: req.user._id,
    quizId: quiz._id,
    score: scorePercent,
    totalQuestions,
    correctCount,
    xpEarned,
    userAnswers,
  });

  // Update User XP & Level & Streak
  const user = await User.findById(req.user._id);
  user.xp += xpEarned;
  user.level = Math.floor(user.xp / 100) + 1;

  // Streak logic
  const now = new Date();
  if (user.lastQuizDate) {
    const diffHours = (now - new Date(user.lastQuizDate)) / (1000 * 60 * 60);
    if (diffHours >= 24 && diffHours <= 48) {
      user.streak += 1;
    } else if (diffHours > 48) {
      user.streak = 1;
    }
  } else {
    user.streak = 1;
  }
  user.lastQuizDate = now;
  await user.save();

  // Create SRS entry for incorrect questions
  for (const item of userAnswers) {
    if (!item.isCorrect) {
      const q = quiz.questions[item.questionIndex];
      await SpacedRepetition.create({
        userId: user._id,
        topicTitle: quiz.title,
        questionText: q.questionText,
        socraticHint: q.socraticHint,
        nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Review tomorrow
      });
    }
  }

  res.json({
    submission,
    userStats: {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
    },
  });
};
