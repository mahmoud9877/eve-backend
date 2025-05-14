import { Router } from "express";
import * as chatController from "./chat.js";
import { validation } from "../../middleware/validation.js";
const router = Router();

router.post("/", chatController.createChat);

export default router;
