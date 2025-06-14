import cors from "cors";
import authRouter from "./models/auth/auth.router.js";
import chatRouter from "./models/chat/chat.router.js";
import cookieParser from "cookie-parser";
// import officeRouter from "./models/office/office.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import eveEmployeeRouter from "./models/eve-employee/eve-employee.router.js";

const initApp = (app, express) => {
  const corsOptions = {
    origin: ["https://eve-employee.vercel.app", "http://localhost:3000"],
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.get("/favicon.ico", (req, res) => res.status(204).end());

  app.get("/", (req, res) => {
    res.send("🎉 API is working!");
  });
  // app.get("/favicon.ico", (req, res) => res.status(204));

  app.use(`/auth`, authRouter);
  app.use(`/eve-employee`, eveEmployeeRouter);
  app.use(`/chat`, chatRouter);
  // app.use(`/office`, officeRouter);

  app.all("*", (req, res, next) => {
    res.status(404).send("In-valid Routing Plz check url or method");
  });
  app.use(globalErrorHandling);
};

export default initApp;
