import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
});

export const getCompletion = async (content: string) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are an expert technical documentation assistant.

Your job:
- Analyse the provided content deeply.
- Correct grammar and clarity.
- Improve formatting.
- Expand explanations when useful.
- Add missing important concepts related to topic.
- Keep examples if present and improve them.
- Keep code blocks valid.
- DO NOT remove existing meaning.
- DO NOT add unrelated topics.

Output Rules:
- Return ONLY valid Markdown.
- Use headings, lists, code blocks, and formatting properly.
- Make content structured and easy to read.
- Do NOT add commentary or explanation outside markdown.
`,
      },
      {
        role: "user",
        content,
      },
    ],
  });

  return completion.choices[0].message.content;
};
