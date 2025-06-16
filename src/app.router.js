import cors from "cors";
import authRouter from "./models/auth/auth.router.js";
import chatRouter from "./models/chat/chat.router.js";
import cookieParser from "cookie-parser";
// import officeRouter from "./models/office/office.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import eveEmployeeRouter from "./models/eve-employee/eve-employee.router.js";

const initApp = (app, express) => {
  const corsOptions = {
    origin: ["https://eve-frontend-eta.vercel.app", "http://localhost:3000"],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Optional: Logging middleware during development
  // app.use((req, res, next) => {
  //   console.log(`${req.method} ${req.url}`);
  //   next();
  // });

  // Health check
  app.get("/", (req, res) => {
    console.log("Health check route hit");
    res.send("API is working!");
  });

  // Ignore favicon requests
  app.get("/favicon.ico", (req, res) => res.status(204).end());
  app.get("/favicon.png", (req, res) => res.status(204).end());

  // API Routes
  app.use("/auth", authRouter);
  app.use("/eve-employee", eveEmployeeRouter);
  app.use("/chat", chatRouter);
  // app.use("/office", officeRouter);

  // Not Found Route
  app.all("*", (req, res) => {
    res.status(404).send("Invalid Routing. Please check URL or method.");
  });

  // Global Error Handler (only activate when defined)
  app.use(globalErrorHandling);
};

export default initApp;
