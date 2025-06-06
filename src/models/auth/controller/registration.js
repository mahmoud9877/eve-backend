import User from "../../../../DataBase/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";
import { hash, compare } from "../../../utils/HashAndCompare.js";

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
    userId: user._id,
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

  const accessToken = generateToken({
    payload: { id: user.id, role: user.role },
    expiresIn: 30 * 60,
  });

  const refreshToken = generateToken({
    payload: { id: user.id, role: user.role },
    expiresIn: 30 * 60 * 24 * 365,
  });

  const userData = user.toJSON(); // ✅

  const { id, email: userEmail, name, role } = userData;

  return res.json({
    message: "Done",
    accessToken,
    refreshToken,
    user: {
      id,
      name,
      email: userEmail,
      role,
    },
  });
});
