import { Router } from "express";
import * as validators from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
import * as authController from "../auth/controller/registration.js";
const router = Router();

router.post("/signup", validation(validators.signup), authController.signup);
router.post("/login", validation(validators.login), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
// router.post("/refresh-token", validation(validators.sendCode), authController.refreshToken);

export default router;
