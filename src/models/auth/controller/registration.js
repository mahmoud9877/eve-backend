import User from "../../../../DataBase/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/GenerateAndVerifyToken.js";
import { hash, compare } from "../../../utils/HashAndCompare.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ where: { email } });
  if (checkUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    return next(error);
  }
  // Ensure the password is hashed
  const hashPassword = await hash({ plaintext: password });
  // Create the user in the database
  const user = await User.create({
    email,
    password: hashPassword,
  });

  return res.status(201).json({
    message: "Signup successful",
    userId: user._id,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new Error("Email Not found", { cause: 404 }));
  }
  if (!compare({ plaintext: password, hashValue: user.password })) {
    return next(new Error("In-Valid Login", { cause: 404 }));
  }
  const access_token = generateToken({
    payload: { id: user._id, role: user.role },
    expiresIn: 30 * 60,
  });

  const refresh_token = generateToken({
    payload: { id: user._id, role: user.role },
    expiresIn: 30 * 60 * 24 * 365,
  });
  user.status = "online";
  user.save();
  return res.status(201).json({ message: "Done", access_token, refresh_token });
});
