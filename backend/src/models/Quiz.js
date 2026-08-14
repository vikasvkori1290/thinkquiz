import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  codeSnippet: { type: String, default: '' },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
  socraticHint: { type: String, required: true },
  explanation: { type: String, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    mode: { type: String, enum: ['leetcode', 'webdev'], required: true },
    topicOrSlug: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Conceptual'], default: 'Medium' },
    questions: [questionSchema],
    providerUsed: { type: String, default: 'Gemini' },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
