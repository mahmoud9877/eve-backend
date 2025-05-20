import eveEmployeeModel from "../../../DataBase/model/Employee.model.js";
import User from "../../../DataBase/model/User.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const getAllEveEmployee = asyncHandler(async (req, res) => {
  const allEveEmployee = await eveEmployeeModel.findAll();
  return res.status(200).json({ message: "Done", allEveEmployee });
});

export const createEveEmployee = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const checkUser = await User.findOne({ where: { id: userId } });
  if (!checkUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    return next(error);
  }
  const { name, department, gender, introduction, photoUrl } = req.body;

  console.log({ name, department, gender, introduction, photoUrl });
  const EveEmployee = await eveEmployeeModel.create({
    name,
    department,
    gender,
    introduction,
    photoUrl,
    createdBy: userId, // assuming you're using auth middleware
  });
  return res.status(201).json({ message: "Done", EveEmployee });
});
