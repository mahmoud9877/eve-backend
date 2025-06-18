import { Router } from "express";
import * as validators from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
import * as authController from "../auth/controller/registration.js";
const router = Router();

router.post("/signup", validation(validators.signup), authController.signup);
router.post("/login", validation(validators.login), authController.login);

export default router;
