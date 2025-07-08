// middlewares/uploadDocument.middleware.js
import multer from "multer";

const documentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const documentFilter = (req, file, cb) => {
    if (documentTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`نوع الملف (${file.mimetype}) غير مسموح به.`), false);
    }
};

const documentStorage = multer.memoryStorage();

export const uploadDocument = multer({
    storage: documentStorage,
    fileFilter: documentFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
