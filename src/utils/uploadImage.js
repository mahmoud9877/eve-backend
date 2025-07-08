// middlewares/uploadImage.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

const isVercel = process.env.VERCEL === "1";
const uploadDir = path.join(process.cwd(), "uploads");

if (!isVercel && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const imageTypes = ["image/jpeg", "image/png", "image/jpg"];

const imageFilter = (req, file, cb) => {
  if (imageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`نوع الملف (${file.mimetype}) غير مسموح به.`), false);
  }
};

const imageStorage = isVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName}${ext}`;
      cb(null, uniqueName);
    },
  });

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
