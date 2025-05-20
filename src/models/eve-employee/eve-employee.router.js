import { Router } from "express";
import * as eveEmployeeController from "./eve-employee.js";
import upload from "../../utils/multer.js";
const router = Router();

router.get(
  "/all-eve-employee",
  // auth(roles.User),
  eveEmployeeController.getAllEveEmployee
);

router.post(
  "/:userId",
  // auth(roles.User),
  upload.single("photoUrl"),
  // validation(validators.createEveEmployee),
  eveEmployeeController.createEveEmployee
);

export default router;
