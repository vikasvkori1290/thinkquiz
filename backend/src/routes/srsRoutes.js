import express from 'express';
import { getDueReviews, submitSrsReview } from '../controllers/srsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/due', protect, getDueReviews);
router.post('/review', protect, submitSrsReview);

export default router;
