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

  const accessToken = generateToken({
    payload: { id: user.id },
    expiresIn: 20, // 30 mins
  });

  const refreshToken = generateToken({
    payload: { id: user.id },
    expiresIn: "30d",
  });
  console.log("refreshToken", refreshToken);
  const userData = user.toJSON();
  const { id, email: userEmail, name } = userData;

  const employee = await Employee.findOne({
    where: { createdBy: id },
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  console.log("cookies:", req.cookies);

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
  console.log("🟡 Received Refresh Token:", refreshToken);

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const payload = verifyToken({ token: refreshToken }); // ✅ باستخدام الدالة
    const newAccessToken = generateToken({
      payload: { id: payload.id },
      expiresIn: 15 * 60, // 15 دقيقة
    });

    console.log("🟢 New Access Token:", newAccessToken);
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.log("🔴 Error verifying refresh token:", err.message);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logged out successfully" });
});
