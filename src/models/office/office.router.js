import { Router } from "express";
import * as officeController from "./office.js";
import { auth, roles } from "../../middleware/auth.js";
const router = Router();

router.get(
  "/:userId",
  auth(roles.User),
  // validation(validators.createProfile),
  officeController.getEmployee
);

export default router;
