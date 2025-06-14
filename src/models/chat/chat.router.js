import { Router } from "express";
import * as chatController from "./chat.js";
import multer from "multer";
import { validation } from "../../middleware/validation.js";
import * as validators from "./chat.validation.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/",
  validation(validators.chatMessageSchema),
  upload.single("file"),
  chatController.uploadAndChat
);

export default router;
