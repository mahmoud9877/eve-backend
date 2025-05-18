import eveEmployeeModel from "../../../DataBase/model/Employee.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const getAllEveEmployee = asyncHandler(async (req, res) => {
  const allEveEmployee = await eveEmployeeModel.findAll();
  return res.status(200).json({ message: "Done", allEveEmployee });
});

export const createEveEmployee = asyncHandler(async (req, res) => {
  const { name, department, gender, introduction, photoUrl } = req.body;

  console.log({ name, department, gender, introduction, photoUrl });
  const EveEmployee = await eveEmployeeModel.create({
    name,
    department,
    gender,
    introduction,
    photoUrl,
    createdBy: req.user._id, // assuming you're using auth middleware
  });
  return res.status(201).json({ message: "Done", EveEmployee });
});
