import User from "../../../../DataBase/model/User.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { hash, compare } from "../../../utils/HashAndCompare.js";
import Employee from "../../../../DataBase/model/Employee.model.js";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";

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
    payload: { id: user.id },
    expiresIn: 20, // 30 mins
  });

  const refreshToken = generateToken({
    payload: { id: user.id },
    expiresIn: "30d",
  });

  const userData = user.toJSON();
  const { id, email: userEmail, name } = userData;

  const employee = await Employee.findOne({
    where: { createdBy: id },
  });
  console.log("mode env", process.env.NODE_ENV);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    // message: "Done",
    accessToken,
    user: {
      id,
      name,
      email: userEmail,
      employee: employee?.id || null,
    },
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.TOKEN_SIGNATURE);
    const newAccessToken = jwt.sign(
      { id: payload.id },
      process.env.TOKEN_SIGNATURE,
      { expiresIn: "15m" }
    );
    console.log("newAccessToken", newAccessToken);
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});
