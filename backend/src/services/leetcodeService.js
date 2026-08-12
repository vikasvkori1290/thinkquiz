import axios from "axios";
import { redis } from "./cacheService.js";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

export const fetchLeetCodeProblem = async (titleSlug) => {
  const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        content
        difficulty
      }
    }
  `;

  const response = await axios.post(
    LEETCODE_GRAPHQL_URL,
    {
      query,
      variables: { titleSlug },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 30000,
    }
  );

  return response.data;
};

export const getSlugFromNumber = async (number) => {
  const cacheKey = "leetcode_problems_list";
  try {
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const problems = typeof cached === "string" ? JSON.parse(cached) : cached;
        if (problems[String(number)]) return problems[String(number)];
      }
    }

    const response = await axios.get("https://leetcode.com/api/problems/all/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 30000,
    });

    const data = response.data;
    const problems = {};

    for (const item of data.stat_status_pairs || []) {
      const qId = item.stat?.frontend_question_id;
      const slug = item.stat?.question__title_slug;
      if (qId && slug) {
        problems[String(qId)] = slug;
      }
    }

    if (redis) {
      await redis.set(cacheKey, JSON.stringify(problems), { ex: 604800 });
    }

    return problems[String(number)] || null;
  } catch (err) {
    console.error("Error mapping number to slug:", err.message);
    return null;
  }
};
