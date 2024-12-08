import { Router } from "express";
import {
  getAcceptedStudentsList,
  getUserInfo,
  handleTeacherRequest,
  pendingTeacherRequest,
  requestTeacher,
  teacherInfo,
  teacherList,
  userEditInfo,
  userInfo,
} from "../controller/userGeneral.js";

const userGeneralRouter = Router();

userGeneralRouter.post("/user/info", userInfo);
userGeneralRouter.post("/teacher/info", teacherInfo);
userGeneralRouter.post("/user/edit-info", userEditInfo);
userGeneralRouter.post("/user/request-teacher", requestTeacher);

userGeneralRouter.get("/user/:userType-:userId", getUserInfo);

userGeneralRouter.post("/teacher/list", teacherList);
userGeneralRouter.post("/teacher/handel-request", handleTeacherRequest);
userGeneralRouter.post("/teacher/pending-requests", pendingTeacherRequest);
userGeneralRouter.post("/teacher/get-accetped-students", getAcceptedStudentsList)

export default userGeneralRouter;
