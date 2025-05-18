import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../../config/.env") });

const apiKey = process.env.OPENAI_API_KEY;
console.log(apiKey);

async function chat(userMessage) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return "حدث خطأ أثناء الاتصال بـ OpenAI.";
  }
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
