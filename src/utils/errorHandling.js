import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../config/.env") });

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      err.statusCode = err.statusCode || 500;
      return next(err);
    });
  };
};

export const globalErrorHandling = (err, req, res, next) => {
  const status = err.statusCode || 500;
  if (process.env.MOOD === "DEV") {
    return res.status(status).json({
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  return res.status(status).json({
    message: err.message || "Internal Server Error",
  });
};
