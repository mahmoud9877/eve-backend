import path from "path";
import dotenv from "dotenv";
import mammoth from "mammoth";
import { fileURLToPath } from "url";
import { CohereClient } from "cohere-ai";
import { extractTextFromPDF } from "../../utils/pdf.js";
import Employee from "../../../DataBase/model/Employee.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../../config/.env") });

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const getEgyptDateTime = () => {
  return new Date().toLocaleString("ar-EG", {
    timeZone: "Africa/Cairo",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const uploadAndChat = async (req, res) => {
  const file = req.file;
  const question = req.body.message;
  const employeeId = req.body.employeeId;

  if (!question && !file) {
    return res.status(400).json({
      error: "Either message or file is required.",
    });
  }

  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID is required." });
  }

  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ error: "Employee not found." });

    let newKnowledge = "";

    if (file) {
      try {
        const mimeType = file.mimetype;
        if (mimeType === "application/pdf") {
          const data = await extractTextFromPDF(file.buffer);
          newKnowledge = data.text;
        } else if (
          mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          newKnowledge = result.value;
        } else {
          return res.status(400).json({ error: "Unsupported file type." });
        }

        if (newKnowledge.length > 10000) {
          const summaryResponse = await cohere.summarize({
            text: newKnowledge,
            model: "command-r-plus",
            length: "long",
          });
          newKnowledge = summaryResponse.summary || newKnowledge;
        }

        const egyptTime = getEgyptDateTime();
        const formattedKnowledge = `\n\n--- New Upload at ${egyptTime} ---\n${newKnowledge}`;
        const totalKnowledge = `${employee.knowledgeText || ""}${formattedKnowledge}`;

        if (totalKnowledge.length > 500000) {
          return res.status(400).json({ error: "The total knowledge size exceeds the allowed limit." });
        }

        employee.knowledgeText = totalKnowledge;
        await employee.save();

        console.log("✅ Knowledge updated for employee:", employee.id);
        console.log("📄 Snippet:", newKnowledge.slice(0, 200));
      } catch (err) {
        console.error("❌ File analysis failed:", err);
        return res.status(500).json({ error: "File analysis failed." });
      }
    }

    const egyptTimeNow = getEgyptDateTime();
    let prompt = `
🧠 You are EVE, a professional virtual employee.

👤 PERSONAL INFORMATION:
- Name: ${employee.name}
- Department: ${employee.department}
- Introduction: ${employee.introduction || "No introduction provided."}

🕐 Current Egypt time: ${egyptTimeNow}

📄 CONTEXT FROM ALL FILES:
${employee.knowledgeText?.slice(-5000) || "No context available."}

❓ USER QUESTION:
${question || "No question provided. Only a file was uploaded."}

📌 RULES:
- Always use your personal information when answering questions about yourself.
- Respond ONLY in the language of the question.
- If you don't know the answer, say you don't know.
- Do NOT hallucinate or make up facts.
- Base your answer ONLY on the provided context and your personal info.

🧾 ANSWER:
`;

    if (/^[a-zA-Z0-9\s.,!?'"()\-]+$/.test(question)) {
      prompt += "\n\nIMPORTANT: The question is in English. Respond ONLY in English.";
    }

    const response = await cohere.generate({
      model: "command-r-plus",
      prompt,
      max_tokens: 600,
      temperature: 0.5,
    });

    if (!response?.generations?.length) {
      return res.status(500).json({ error: "No response generated from Cohere." });
    }
    const reply = response.generations[0].text.trim();
    return res.json({ reply });
  } catch (err) {
    console.error("❌ Error:", err.message);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};
