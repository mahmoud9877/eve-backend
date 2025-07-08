import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./models/auth/auth.router.js";
import chatRouter from "./models/chat/chat.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import eveEmployeeRouter from "./models/eve-employee/eve-employee.router.js";

const initApp = (app, express) => {
  const corsOptions = {
    origin: ["https://eve-frontend-eta.vercel.app", "http://localhost:3000"],
    credentials: true,
  };

  // ✅ التعامل مع preflight requests (CORS manual headers)
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://eve-frontend-eta.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

    // ✅ رد فوري على preflight requests
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  // ✅ تفعيل CORS رسمي باستخدام middleware
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ✅ Health check route
  app.get("/", (req, res) => {
    res.send("API is working!");
  });

  // ✅ Routes
  app.use("/auth", authRouter);
  app.use("/eve-employee", eveEmployeeRouter);
  app.use("/chat", chatRouter);

  // ✅ 404 fallback
  app.all("*", (req, res) => {
    res.status(404).send("Invalid Routing. Please check URL or method.");
  });

  // ✅ Global Error Handler
  app.use(globalErrorHandling);
};

export default initApp;
