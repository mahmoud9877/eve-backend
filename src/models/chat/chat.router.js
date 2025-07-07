// routes/chat/chat.router.js
import { Router } from "express";
import * as chatController from "./chat.js";
import { auth } from "../../middleware/auth.js";
import * as validators from "./chat.validation.js";
import { uploadDocument } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";

const router = Router();

router.post(
  "/",
  auth(),
  uploadDocument.single("file"),
  validation(validators.chatMessageSchema),
  chatController.uploadAndChat
);

export default router;
