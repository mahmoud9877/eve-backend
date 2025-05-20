import Employee from "../../../DataBase/model/Employee.model.js";
import User from "../../../DataBase/model/User.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const getEmployee = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const checkUser = await User.findOne({ where: { id: userId } });
  if (!checkUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    return next(error);
  }
  const getOffice = await Employee.findAll({
    where: { createdBy: userId },
  });
  return res.status(200).json({ message: "Done", getOffice });
});
