// import path from "path";
// import dotenv from "dotenv";
// import mammoth from "mammoth";
// import pdfParse from "pdf-parse";
// import { fileURLToPath } from "url";
// import { CohereClient } from "cohere-ai";
// import Employee from "../../../DataBase/model/Employee.model.js";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: path.join(__dirname, "../../../config/.env") });

// const cohere = new CohereClient({
//   token: process.env.COHERE_API_KEY,
// });

// export const uploadAndChat = async (req, res) => {
//   const file = req.file;
//   const question = req.body.message;

//   if (!question) {
//     return res.status(400).json({ error: "الرسالة مطلوبة." });
//   }

//   let knowledge = "هذا مثال على نص المعرفة. يمكنك رفع ملفات لتحليله لاحقاً.";

//   if (file) {
//     try {
//       const mimeType = file.mimetype;

//       if (mimeType === "application/pdf") {
//         const data = await pdfParse(file.buffer);
//         knowledge = data.text;
//       } else if (
//         mimeType ===
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//       ) {
//         const result = await mammoth.extractRawText({ buffer: file.buffer });
//         knowledge = result.value;
//       } else {
//         return res.status(400).json({ error: "نوع الملف غير مدعوم." });
//       }
//     } catch (err) {
//       return res.status(500).json({ error: "فشل تحليل الملف." });
//     }
//   }

//   const prompt = `المعرفة التالية مستخرجة من ملف:\n${knowledge.slice(
//     0,
//     3000
//   )}\n\nالسؤال: ${question}\nالرجاء الرد بنفس لغة السؤال.\nالجواب:`;

//   try {
//     const response = await cohere.generate({
//       model: "command-r-plus",
//       prompt,
//       max_tokens: 300,
//       temperature: 0.7,
//     });

//     if (!response?.generations || response.generations.length === 0) {
//       return res.status(500).json({ error: "لم يتم توليد رد من Cohere." });
//     }

//     const reply = response.generations[0].text.trim();

//     try {
//       const employeeId = req.body.employeeId;
//       if (!employeeId) {
//         return res.status(400).json({ error: "Employee ID غير موجود." });
//       }

//       const employee = await Employee.findByPk(employeeId);
//       if (!employee) {
//         return res.status(404).json({ error: "الموظف غير موجود." });
//       }

//       employee.knowledgeText = reply;
//       await employee.save();

//       // ✅ نخرج مباشرة بعد إرسال الرد
//       return res.json({ reply });
//     } catch (dbError) {
//       console.error("Database Error:", dbError.message);
//       return res.status(500).json({ error: "فشل تحديث بيانات الموظف." });
//     }
//   } catch (err) {
//     console.error("Cohere Error:", err.message);
//     return res.status(500).json({ error: "فشل إنشاء الرد من البوت." });
//   }
// };

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

        // إضافة التاريخ والوقت في بداية المعرفة الجديدة
        newKnowledge = `تم رفع هذه المعرفة في: ${egyptTime}\n${newKnowledge}`;

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

    const prompt = `تاريخ ووقت مصر الحالي: ${egyptTimeNow}.
المعرفة التالية تم جمعها مسبقاً عن الموظف:
${employee.knowledgeText?.slice(0, 3000) || "لا توجد معرفة بعد"}

السؤال: ${question}
الرجاء الرد بنفس لغة الرسالة أعلاه دون تغيير اللغة.
الجواب:`;

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
