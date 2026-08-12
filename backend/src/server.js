import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Configure CORS
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const origins = [frontendUrl, "https://thinkquiz.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origins.includes(origin) || origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(null, true); // Allow for development flexibility
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", quizRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.stack);
  res.status(err.statusCode || 500).json({
    detail: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`[ThinkQuiz Express Server] Running on port ${PORT}`);
});
