import express from "express";
import initApp from "./src/app.router.js";
import path from "path";
import "mysql2";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { sequelize, User, Employee } from "./DataBase/model/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });

const app = express();
const PORT = 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connection established");

    await sequelize.sync({ alter: true });
    console.log("✅ Models synchronized with database");

    initApp(app, express);
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
};

startServer();
