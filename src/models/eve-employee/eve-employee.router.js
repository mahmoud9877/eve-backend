import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as eveEmployeeController from "./eve-employee.js";
import { uploadImage } from "../../utils/multer.js";
const router = Router();

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
  // upload.single("photoUrl"),
  // validation(validators.createEveEmployee),
  eveEmployeeController.updateEveEmployee
);

export default router;
