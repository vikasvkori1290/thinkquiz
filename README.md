# 🧠 ThinkQuiz

> **Stop Copying. Start Thinking.** > An AI-powered, gamified learning platform that transforms standard LeetCode grinds into interactive Socratic tutoring sessions.

## 🚀 Overview
ThinkQuiz is a decoupled full-stack application designed to help developers actually learn algorithms rather than just memorizing solutions. When a user inputs a LeetCode problem or a technical concept, the platform leverages Google Gemini 2.0 to generate a contextual, Socratic-style quiz. 

Instead of giving you the answer, ThinkQuiz asks probing questions about time complexity, edge cases, and algorithmic patterns. Correct answers earn XP and build daily streaks, bringing a Duolingo-style gamification loop to technical interview prep.

---

## ✨ Key Features
* **Socratic AI Engine:** Powered by Google Gemini 2.0 Flash. Strict prompt engineering forces the LLM to output structured JSON quizzes with contextual hints for incorrect answers.
* **Live LeetCode Integration:** Fetches real problem descriptions and difficulties directly from LeetCode's GraphQL API.
* **High-Performance Caching:** Upstash Redis intercepts repeated queries to serve instant results and drastically reduce LLM API costs.
* **Gamification System:** Custom algorithm to track user XP, calculate level-ups, and manage daily activity streaks.
* **Secure Authentication:** Complete Email/Password login flow and protected dashboard routes via Supabase Auth.
* **Premium UI/UX:** Built with Next.js App Router, Tailwind CSS, Shadcn/UI, Dark Mode, and micro-interactions (including canvas-confetti rewards).

---

## 🏗️ System Architecture

### Frontend (User Interface)
* **Framework:** Next.js (App Router, React 18)
* **Styling:** Tailwind CSS & Shadcn/UI
* **State & Fetching:** React Hooks, native `fetch` API

### Backend (The Engine)
* **Framework:** Python 3.10+ & FastAPI
* **Server:** Uvicorn
* **Data Validation:** Pydantic

### Cloud & Infrastructure
* **Database:** Supabase (PostgreSQL)
* **Authentication:** Supabase SSR Auth
* **Caching Layer:** Upstash Serverless Redis
* **AI Provider:** Google Generative AI (Gemini)

---

## ⚙️ Local Setup Instructions

Want to run ThinkQuiz on your local machine? Follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/thinkquiz.git](https://github.com/yourusername/thinkquiz.git)
cd thinkquiz