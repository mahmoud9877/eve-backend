import { Router } from "express";
import * as chatController from "./chat.js";
import { validation } from "../../middleware/validation.js";
import { auth, roles } from "../../middleware/auth.js";
const router = Router();

router.post("/", chatController.createChat);

router.post("/", auth(roles.User), chatController.createChat);

export default router;
