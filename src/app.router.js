import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./models/auth/auth.router.js";
import chatRouter from "./models/chat/chat.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import eveEmployeeRouter from "./models/eve-employee/eve-employee.router.js";

const initApp = (app, express) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://eve-frontend-eta.vercel.app"
    // أضف أي دومين خارجي هنا لما ترفعه على سيرفر حقيقي
    // "https://example.com",
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  app.use(cors(corsOptions));

  // ✅ Middlewares
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ✅ Health check route
  app.get("/", (req, res) => {
    res.send("API is working!");
  });

  // ✅ API routes
  app.use("/auth", authRouter);
  app.use("/eve-employee", eveEmployeeRouter);
  app.use("/chat", chatRouter);

  // ✅ 404 fallback
  app.all("*", (req, res) => {
    res.status(404).send("Invalid Routing. Please check URL or method.");
  });

  // ✅ Global Error Handling
  app.use(globalErrorHandling);
};

export default initApp;
