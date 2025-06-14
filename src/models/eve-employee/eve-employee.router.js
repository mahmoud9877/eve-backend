import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as eveEmployeeController from "./eve-employee.js";
const router = Router();

router.get("/", auth(), eveEmployeeController.getAllEveEmployee);
router.get("/search", auth(), eveEmployeeController.searchEveEmployee);

router.get(
  "/my-employee",
  auth(),
  // upload.single("photoUrl"),
  // validation(validators.createEveEmployee),
  eveEmployeeController.getMyEveEmployee
);

router.post(
  "/",
  auth(),
  // upload.single("photoUrl"),
  // validation(validators.createEveEmployee),
  eveEmployeeController.createEveEmployee
);

router.put(
  "/:id",
  auth(),
  // upload.single("photoUrl"),
  // validation(validators.createEveEmployee),
  eveEmployeeController.updateEveEmployee
);

export default router;
