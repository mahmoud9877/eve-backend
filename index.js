import express from "express";
import initApp from "./src/app.router.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });
// index.js or app.js
import sequelize from "./DataBase/connection.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected...");
    await sequelize.sync(); // Create tables if not exist
    console.log("Tables synced...");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
})();

const app = express();
const PORT = 5000;
app.get("/", (req, res) => {
  res.send("🎉 API is working!");
});

initApp(app, express);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
