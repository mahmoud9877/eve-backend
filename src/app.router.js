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
  app.use(express.urlencoded({ extended: true })); // لتحليل البيانات من الفورم إن وجدت

  app.get("/", (req, res) => {
    console.log("Health check route hit");
    res.send("API is working!");
  });

  app.use("/auth", authRouter);
  app.use("/eve-employee", eveEmployeeRouter);
  app.use("/chat", chatRouter);
  // app.use("/office", officeRouter); // افعلها لما تحتاجها

  // أي Route مش معروف
  app.all("*", (req, res, next) => {
    res.status(404).send("In-valid Routing Plz check url or method");
  });

  // Global Error Handler
  app.use(globalErrorHandling); // لازم تكون 4 parameters في الفنكشن نفسها
};

export default initApp;
