import cors from "cors";
import authRouter from "./models/auth/auth.router.js";
import chatRouter from "./models/chat/chat.router.js";
import eveEmployeeRouter from "./models/eve-employee/eve-employee.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const initApp = (app, express) => {
  app.use(cors());
  app.use(express.json({}));
  app.get("/", (req, res) => {
    res.send("🎉 API is working!");
  });
  app.use(`/auth`, authRouter);
  app.use(`/eve-employee`, eveEmployeeRouter);
  app.use(`/chat`, chatRouter);
  app.all("*", (req, res, next) => {
    res.send("In-valid Routing Plz check url or method");
  });
  app.use(globalErrorHandling);
};

export default initApp;
