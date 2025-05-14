import cors from "cors";
import authRouter from "./models/auth/auth.router.js";
import chatRouter from "./models/chat/chat.router.js";
import profileRouter from "./models/profile/profile.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const initApp = (app, express) => {
  app.use(cors());
  app.use(express.json({}));
  app.use(`/auth`, authRouter);
  app.use(`/profile`, profileRouter);
  app.use(`/chat`, chatRouter);
  app.all("*", (req, res, next) => {
    res.send("In-valid Routing Plz check url or method");
  });
  app.use(globalErrorHandling);
};

export default initApp;
