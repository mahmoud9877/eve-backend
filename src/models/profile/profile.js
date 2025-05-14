import userModel from "../../../DataBase/model/User.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const createProfile = asyncHandler(async (req, res) => {
  const { name, department, gender, introduction, photoUrl } = req.body;
  const profile = await userModel.create({
    name,
    department,
    gender,
    introduction,
    photoUrl,
  });
  return res.status(201).json({ message: "Done", profile });
});
