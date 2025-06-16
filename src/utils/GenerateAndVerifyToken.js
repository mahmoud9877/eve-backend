import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../config/.env") });

export const generateToken = ({ payload = {}, expiresIn = "1h" } = {}) => {
  return jwt.sign(payload, process.env.TOKEN_SIGNATURE, { expiresIn });
};

export const verifyToken = ({ token }) => {
  return jwt.verify(token, process.env.TOKEN_SIGNATURE);
};
