# 🧠 ThinkQuiz Features & System Brain Map

ThinkQuiz is an AI-powered, gamified technical interview preparation platform designed to help developers build algorithmic intuition through Socratic learning rather than rote memorization.

---

## 🚀 Core Features

### 1. Socratic AI Quiz Generator
* **Purpose:** Converts traditional coding problems or concepts into interactive multiple-choice questions. Instead of showing the answer, it asks probing questions about time complexity, edge cases, and patterns.
* **LeetCode Mode:** Fetches real problem data (difficulty, descriptions) from LeetCode GraphQL API and generates a 3-question Socratic quiz.
* **Web Dev Mode:** Allows selecting key web technologies (HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, SQL) to generate a 5-question Socratic conceptual quiz.
* **Contextual Hinting:** For every incorrect answer, the AI provides a specific, helpful hint instead of revealing the correct choice.

### 2. Gamification System
* **XP Tracking:** Users earn XP on every quiz completed based on their performance (Score × 10 XP).
* **Level Progression:** Dynamic leveling formula where users level up for every 100 XP gained (`Level = floor(XP / 100) + 1`).
* **Daily Streak Loop:** Tracks daily activity streaks. If a user completes a quiz on consecutive days, their streak increments. Breaks if a day is missed.
* **Anti-Farming Cooldown:** Restricts users from farming XP on the same topic/slug multiple times in a single day.
* **Interactive Celebration:** Utilizes `canvas-confetti` animations to reward users upon profile completion or leveling up.

### 3. Spaced Repetition System (SRS)
* **SM-2 Algorithm:** Automatically schedules follow-up review times for quiz questions based on the user's performance.
* **Quality Score Map:** Converts the user's score to the SM-2 Quality scale (0 to 5).
* **Automatic Queue:** Places weak topics back into the user's "Daily Reviews" dashboard section to prevent memory decay.
* **Dynamic Interval Calculation:** Adjusts review intervals (in days) using repetitions and easiness factors.

### 4. Interactive Dashboard
* **Profile Header:** Displays custom user credentials, avatar with initials, and customizable details (First Name, Last Name, Username, Mobile, Social/LeetCode URLs).
* **Gamification Stats:** Highlights Total XP, Current Level, and Streak Day Count.
* **Activity Calendar:** Displays a contribution graph (like GitHub commits) showing quiz completions over the past 365 days.
* **Analytics Chart:** Visualizes cumulative XP growth over the last 30 days.
* **Recent Submissions:** Lists the last 10 completed quizzes with relative time details and scores.
* **Spaced Repetition Reminders:** Populates warning notifications when review items are due.

### 5. Global Leaderboard
* **Rankings:** Displays the top 10 highest-ranked users sorted by Total XP.
* **High-Performance Caching:** Utilizes Upstash Serverless Redis caching for the leaderboard endpoint (`cache:leaderboard`) with a 5-minute TTL to reduce database query load and latency.

### 6. Profile & Account Settings
* **Profile Editing:** Allows updating user info with a gamification incentive (+10 XP profile completion bonus).
* **Account Deletion:** Permanently purges user account, history, stats, and spaced repetition data.

---

## 🏗️ Tech Stack

* **Frontend:** Next.js (App Router, React 18, TypeScript), Tailwind CSS, Shadcn UI components.
* **Backend:** Node.js, Express.js (Model-Controller architecture), Mongoose.
* **Database:** MongoDB Atlas (Cloud Database).
* **Cache & Rate-Limiter:** Upstash Serverless Redis.
* **AI Engine:** Google Gemini / Groq / OpenAI API.
