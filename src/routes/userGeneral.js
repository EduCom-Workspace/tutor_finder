import { Router } from "express";
import { teacherInfo, userInfo } from "../controller/userGeneral.js";

const userGeneralRouter = Router();

userGeneralRouter.post("/user/info", userInfo);
userGeneralRouter.post("/teacher/info", teacherInfo);

userGeneralRouter;

export default userGeneralRouter;
