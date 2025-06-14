// routes/chat/chat.router.js
import { Router } from "express";
import * as chatController from "./chat.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./chat.validation.js";
import upload from "../../utils/multer.js"; // ← استيراد من الملف الجديد

const router = Router();

router.post(
  "/",
  validation(validators.chatMessageSchema),
  upload.single("file"),
  chatController.uploadAndChat
);

export default router;
