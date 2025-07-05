import path from "path";
import dotenv from "dotenv";
import mammoth from "mammoth";
import { extractTextFromPDF } from "../../utils/pdf.js";
import { fileURLToPath } from "url";
import { CohereClient } from "cohere-ai";
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

  if (!question) return res.status(400).json({ error: "الرسالة مطلوبة." });

  if (!employeeId)
    return res.status(400).json({ error: "Employee ID غير موجود." });

  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) return res.status(404).json({ error: "الموظف غير موجود." });

    // تحليل الملف لو موجود
    let newKnowledge = "";
    if (file) {
      try {
        const mimeType = file.mimetype;
        if (mimeType === "application/pdf") {
          const data = await extractTextFromPDF(file.buffer);
          newKnowledge = data.text;
        } else if (
          mimeType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          newKnowledge = result.value;
        } else {
          return res.status(400).json({ error: "نوع الملف غير مدعوم." });
        }

        const egyptTime = getEgyptDateTime();
        const formattedKnowledge = `\n\n--- New Upload at ${egyptTime} ---\n${newKnowledge}`;
        employee.knowledgeText = `${
          employee.knowledgeText || ""
        }${formattedKnowledge}`;
        await employee.save();

        console.log("✅ Knowledge updated for employee:", employee.id);
        console.log("📄 Last upload snippet:", newKnowledge.slice(0, 100));
      } catch (err) {
        console.error("❌ تحليل الملف فشل:", err);
        return res.status(500).json({ error: "فشل تحليل الملف." });
      }
    }

    const egyptTimeNow = getEgyptDateTime();

    // إعداد الـ prompt بالتفاصيل الشخصية + السياق
    let prompt = `
🧠 You are EVE, a professional virtual employee.

👤 PERSONAL INFORMATION:
- Name: ${employee.name}
- Department: ${employee.department}
- Introduction: ${employee.introduction || "No introduction provided."}

🕐 Current Egypt time: ${egyptTimeNow}

📄 CONTEXT FROM FILES:
${employee.knowledgeText?.slice(-5000) || "No context available."}

❓ USER QUESTION:
${question}

📌 RULES:
- Always use your personal information when answering questions about yourself.
- Respond ONLY in the language of the question.
- If you don't know the answer, say you don't know.
- Do NOT hallucinate or make up facts.
- Base your answer ONLY on the provided context and your personal info.

🧾 ANSWER:
`;

    // لو السؤال إنجليزي، نبه الموديل
    if (/^[a-zA-Z0-9\s.,!?'"()\-]+$/.test(question)) {
      prompt +=
        "\n\nIMPORTANT: The question is in English. Respond ONLY in English.";
    }

    // إرسال الطلب لـ Cohere
    const response = await cohere.generate({
      model: "command-r-plus",
      prompt,
      max_tokens: 600,
      temperature: 0.5,
    });

    if (!response?.generations?.length) {
      return res.status(500).json({ error: "لم يتم توليد رد من Cohere." });
    }

    const reply = response.generations[0].text.trim();
    return res.json({ reply });
  } catch (err) {
    console.error("❌ Error:", err.message);
    return res.status(500).json({ error: "حدث خطأ أثناء المعالجة." });
  }
};
