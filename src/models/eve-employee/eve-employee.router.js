import { Router } from "express";
const router = Router();
import { auth } from "../../middleware/auth.js";
import { uploadImage } from "../../utils/uploadImage.js";
import * as eveEmployeeController from "./eve-employee.js";

router.get("/", auth(), eveEmployeeController.getAllEveEmployee);
router.get("/my-employee", auth(), eveEmployeeController.getMyEveEmployee);

router.get("/:id", auth(), eveEmployeeController.getEmployeeById);

router.post(
  "/",
  auth(),
  uploadImage.single("photoUrl"),
  // validation(validators.createEveEmployee),
  eveEmployeeController.createEveEmployee
);

router.put(
  "/:id",
  auth(),
  uploadImage.single("photoUrl"),
  // validation(validators.createEveEmployee),
  eveEmployeeController.updateEveEmployee
);

export default router;
