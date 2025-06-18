// routes/chat/chat.router.js
import { Router } from "express";
import * as chatController from "./chat.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./chat.validation.js";
import { uploadDocument } from "../../utils/multer.js"; // ← استيراد من الملف الجديد
import { auth } from "../../middleware/auth.js";

const router = Router();

router.post(
  "/",
  auth(),
  validation(validators.chatMessageSchema),
  uploadDocument.single("file"),
  chatController.uploadAndChat
);

export default router;
