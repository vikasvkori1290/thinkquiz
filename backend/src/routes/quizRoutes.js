import express from 'express';
import { generateQuiz, getQuizById, submitQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateQuiz);
router.get('/:id', protect, getQuizById);
router.post('/submit', protect, submitQuiz);

export default router;
