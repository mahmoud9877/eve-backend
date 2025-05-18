import { Router } from "express";
import * as virtualOfficeController from "./VirtualOffice";
import { validation } from "../../middleware/validation.js";
import * as validators from "./profile.validation.js";
import { auth, roles } from "../../middleware/auth.js";
const router = Router();

router.post(
  "/",
  auth(roles.Admin),
  validation(validators.createProfile),
  profileController.createProfile
);

export default router;
