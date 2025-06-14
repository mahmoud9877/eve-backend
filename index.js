import "mysql2";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import initApp from "./src/app.router.js";
import { sequelize, User, Employee } from "./DataBase/model/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });

const app = express();
const PORT = 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connection established");
    await sequelize.sync({ alter: false });
    console.log("✅ Models synchronized with database");

    app.use(express.static("public")); // ✅ أول حاجة بعد middlewares
    initApp(app, express); // ✅ بعدين الراوتات

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
};

startServer();
