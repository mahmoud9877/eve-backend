import "mysql2";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import initApp from "./src/app.router.js";
import { sequelize } from "./DataBase/model/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// محاولة الاتصال بقاعدة البيانات
await sequelize
  .authenticate()
  .then(() => console.log("✅ DB Connection established"))
  .catch((err) => {
    console.error("❌ DB Error:", err);
    process.exit(1); // نخرج من البرنامج لو فيه مشكلة في الاتصال
  });

// مزامنة الجداول
await sequelize
  .sync({ alter: true })
  // .sync({ force: true })

  .then(() => console.log("✅ Models synchronized with database"))
  .catch((err) => {
    console.error("❌ Sync Error:", err);
    process.exit(1);
  });

initApp(app, express);

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
