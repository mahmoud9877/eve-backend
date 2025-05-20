import userModel from "../../DataBase/model/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";

export const roles = {
  Admin: "Admin",
  User: "User",
};

export const auth = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    // مثال: افترض إن الـ user ID جاي في body أو query (مؤقتًا)
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return next(new Error("User ID is required", { cause: 400 }));
    }

    const user = await userModel.findByPk(userId, {
      attributes: ["name", "email", "photoUrl", "role"],
    });

    if (!user) {
      return next(new Error("User not found", { cause: 401 }));
    }

    if (!accessRoles.includes(user.role)) {
      return next(new Error("Not authorized", { cause: 403 }));
    }

    req.user = user;
    next();
  });
};
