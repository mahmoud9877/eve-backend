import express from "express";
import initApp from "./src/app.router.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import sequelize from "./DataBase/connection.js";
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });
const app = express();
const PORT = 5000;

await sequelize.sync({ alter: true });

app.get("/", (req, res) => {
  res.send("🎉 API is working!");
});

initApp(app, express);
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
