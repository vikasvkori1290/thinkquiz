-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User Stats Table
CREATE TABLE user_stats (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
    current_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    last_active_date DATE DEFAULT CURRENT_DATE
);

-- Quiz Attempts Table
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    problem_slug TEXT NOT NULL,
    score INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
