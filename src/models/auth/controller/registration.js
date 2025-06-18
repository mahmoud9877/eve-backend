import User from "../../../../DataBase/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { hash, compare } from "../../../utils/HashAndCompare.js";
import Employee from "../../../../DataBase/model/Employee.model.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/GenerateAndVerifyToken.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ where: { email } });
  if (checkUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    return next(error);
  }
  const hashPassword = await hash({ plaintext: password });
  const user = await User.create({
    email,
    password: hashPassword,
  });
  return res.status(201).json({
    message: "Signup successful",
    userId: user.id,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    const error = new Error("Email not found");
    error.statusCode = 404;
    return next(error);
  }

  const isMatch = await compare({
    plaintext: password,
    hashValue: user.password,
  });

  if (!isMatch) {
    const error = new Error("Invalid login credentials");
    error.statusCode = 401;
    return next(error);
  }

  const token = generateToken({
    payload: { id: user.id },
    expiresIn: 60 * 60 * 24 * 30, // = 2592000 ثانية (30 يوم)
  });

  const userData = user.toJSON();
  const { id, email: userEmail, name } = userData;

  return res.status(200).json({
    token,
    user: {
      id,
      name,
      email: userEmail,
    },
  });
});
