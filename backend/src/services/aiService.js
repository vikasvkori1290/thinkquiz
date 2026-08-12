import OpenAI from "openai";

const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
const baseURL = process.env.GROQ_API_KEY ? "https://api.groq.com/openai/v1" : undefined;
const modelName = process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

let openaiClient = null;
if (apiKey) {
  openaiClient = new OpenAI({
    apiKey,
    baseURL,
  });
}

export const generateSocraticQuiz = async (problemData = null, topic = null) => {
  if (!openaiClient) {
    throw new Error("API key for AI provider (GROQ_API_KEY / OPENAI_API_KEY) is not configured.");
  }

  const numQuestions = topic ? 5 : 3;
  let prompt =
    `You are a Socratic tutor. Create a ${numQuestions}-question multiple choice quiz. ` +
    `You must write in clear, concise, natural English sentences. ` +
    `Do NOT generate lists of keywords, and strictly avoid token repetition loops.\n\n` +
    `You MUST return the output ONLY as a raw JSON object exactly matching this structure (no markdown formatting):\n` +
    `{\n` +
    `  "source": "string",\n` +
    `  "id_or_concept": "string",\n` +
    `  "questions": [\n` +
    `    {\n` +
    `      "question_text": "string",\n` +
    `      "options": [\n` +
    `        {\n` +
    `          "option_text": "string",\n` +
    `          "is_correct": true or false,\n` +
    `          "hint_if_wrong": "string"\n` +
    `        }\n` +
    `      ]\n` +
    `    }\n` +
    `  ]\n` +
    `}\n\n`;

  if (problemData) {
    prompt +=
      `Based on this LeetCode problem. Do NOT give the solution code. ` +
      `Focus on edge cases, time complexity, and the algorithmic pattern. ` +
      `Each incorrect option must have a specific hint.\n\n` +
      `Problem Data: ${JSON.stringify(problemData)}`;
  } else if (topic) {
    prompt +=
      `Based on this computer science concept: ${topic}. ` +
      `Focus on core principles, edge cases, and common misconceptions. ` +
      `Each incorrect option must have a specific hint.`;
  } else {
    throw new Error("Must provide either problemData or topic");
  }

  const response = await openaiClient.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
};
