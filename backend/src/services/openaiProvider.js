import OpenAI from 'openai';

export async function callOpenAI(promptText) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is missing');

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a Socratic technical interview AI generator. Output raw JSON only.' },
      { role: 'user', content: promptText },
    ],
    response_format: { type: 'json_object' },
  });

  return response.choices[0]?.message?.content || '';
}
