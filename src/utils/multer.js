import multer from "multer";
import path from "path";
import fs from "fs";

// تأكد من وجود مجلد uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// إعداد تخزين الصور على القرص
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // امتداد الصورة
    const baseName = path.basename(file.originalname, ext); // اسم الملف بدون الامتداد
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${baseName}${ext}`;
    cb(null, uniqueName);
  },
});

// إعداد تخزين الملفات في الذاكرة
const memoryStorage = multer.memoryStorage();

// أنواع الملفات المسموح بها
const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
const documentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// فلتر لأنواع الملفات
const fileFilter = (req, file, cb) => {
  if (
    imageTypes.includes(file.mimetype) ||
    documentTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("نوع الملف غير مسموح به"), false);
  }
};

// 📌 رفع صورة وتخزينها على القرص
export const uploadImage = multer({
  storage: imageStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 ميجا
});

// 📌 رفع ملف وتخزينه في الذاكرة
export const uploadDocument = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 ميجا
});
