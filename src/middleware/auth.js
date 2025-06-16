import { asyncHandler } from "../utils/errorHandling.js";
import userModel from "../../DataBase/model/User.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";

export const roles = {
  Admin: "Admin",
  User: "User",
};

export const auth = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    console.log("authorization", authorization);

    // Check if authorization header starts with the correct bearer key
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return next(new Error("Invalid bearer key", { cause: 400 }));
    }

    // Extract the token from the authorization header
    const token = authorization.split(process.env.BEARER_KEY)[1];
    if (!token) {
      return next(new Error("Missing Token", { cause: 404 }));
    }

    // Verify the token
    const decoded = verifyToken({ token });
    console.log("Decoded token:", decoded);

    if (!decoded?.id) {
      return next(new Error("Invalid payload token", { cause: 404 }));
    }

    // Find the user by ID and select specific fields
    const user = await userModel.findByPk(decoded.id, {
      attributes: ["id", "name", "email"],
    });

    if (!user) {
      return next(new Error("User not found", { cause: 401 }));
    }

    // Attach user to the request object
    req.user = user;
    return next();
  });
};
