import { Redis } from "@upstash/redis";

let redisClient = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (e) {
  console.error("Upstash Redis init error:", e.message);
}

export const getCachedQuiz = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch (err) {
    console.error("Redis get error:", err.message);
    return null;
  }
};

export const setCachedQuiz = async (key, data, ttlSeconds = 86400) => {
  if (!redisClient) return;
  try {
    await redisClient.set(key, JSON.stringify(data), { ex: ttlSeconds });
  } catch (err) {
    console.error("Redis set error:", err.message);
  }
};

export const redis = redisClient;
