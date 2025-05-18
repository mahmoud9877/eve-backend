import OpenAI from "openai";
const { token } = process.env.OPENAI_API_KEY;

async function chat(message) {
  const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token,
  });

  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "" },
      { role: "user", content: message },
    ],
    model: "openai/gpt-4o",
    temperature: 1,
    max_tokens: 4096,
    top_p: 1,
  });

  return response.choices[0].message.content;
}

export const createChat = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "الرسالة مطلوبة." });
  }

  try {
    const chatResponse = await chat(message);
    res.json({ response: chatResponse });
  } catch (error) {
    console.error("Error in createChat:", error);
    res.status(500).json({ error: "حدث خطأ في إنشاء الدردشة." });
  }
};
