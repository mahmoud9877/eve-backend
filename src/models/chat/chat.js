import path from "path";
import dotenv from "dotenv";
import mammoth from "mammoth";
import pdfParse from "../../utils/pdf-parse/lib/pdf-parse.js";
import { fileURLToPath } from "url";
import { CohereClient } from "cohere-ai";
import Employee from "../../../DataBase/model/Employee.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../../config/.env") });

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// دالة بتجيب الوقت الحالي في مصر
const getEgyptDateTime = () => {
  const now = new Date().toLocaleString("ar-EG", {
    timeZone: "Africa/Cairo",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return now;
};

export const uploadAndChat = async (req, res) => {
  const file = req.file;
  const question = req.body.message;
  const employeeId = req.body.employeeId;

  if (!question) {
    return res.status(400).json({ error: "الرسالة مطلوبة." });
  }

  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID غير موجود." });
  }

  try {
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "الموظف غير موجود." });
    }

    let newKnowledge = "";
    if (file) {
      try {
        const mimeType = file.mimetype;

        if (mimeType === "application/pdf") {
          const data = await pdfParse(file.buffer);
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

        newKnowledge = `This knowledge was uploaded on: ${egyptTime}\n${newKnowledge}`;

        // تحديث قاعدة البيانات
        employee.knowledgeText = `${
          employee.knowledgeText || ""
        }\n\n${newKnowledge}`.trim();
        await employee.save();
      } catch (err) {
        return res.status(500).json({ error: "فشل تحليل الملف." });
      }
    }

    const egyptTimeNow = getEgyptDateTime();

    let prompt = `
    Current Egypt time: ${egyptTimeNow}.
You are an AI assistant that must always respond in the same language used in the question.
Do not translate. Do not answer in a different language. Do not mix languages.

KNOWLEDGE:
${employee.knowledgeText?.slice(0, 3000) || "No knowledge provided."}

QUESTION:
${question}

Respond ONLY in the language of the question.
ANSWER:
`;

    if (/^[a-zA-Z0-9\s.,!?'"()\-]+$/.test(question)) {
      prompt +=
        "\n\nIMPORTANT: The question is in English. Respond ONLY in English.";
    }

    const response = await cohere.generate({
      model: "command-r-plus",
      prompt,
      max_tokens: 300,
      temperature: 0.7,
    });

    if (!response?.generations || response.generations.length === 0) {
      return res.status(500).json({ error: "لم يتم توليد رد من Cohere." });
    }

    const reply = response.generations[0].text.trim();

    return res.json({ reply });
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "حدث خطأ أثناء المعالجة." });
  }
};
