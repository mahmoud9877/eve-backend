import "mysql2";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import initApp from "./src/app.router.js";
import { sequelize } from "./DataBase/model/index.js";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });

const app = express();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// 🟢 توفير الملفات الاستاتيكية
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🟢 تشغيل التطبيق
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected");
    await sequelize.sync({ alter: false });
    console.log("✅ DB Synced");

    initApp(app, express);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
};
startServer();
