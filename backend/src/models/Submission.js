import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true }, // e.g. 80 (%)
    totalQuestions: { type: Number, required: true },
    correctCount: { type: Number, required: true },
    xpEarned: { type: Number, required: true },
    userAnswers: [{ questionIndex: Number, selectedIndex: Number, isCorrect: Boolean }],
  },
  { timestamps: true }
);

export const Submission = mongoose.model('Submission', submissionSchema);
