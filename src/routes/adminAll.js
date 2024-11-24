import { Router } from "express";
import {
  adminLogin,
  adminSignup,
  deleteReview,
  getTotalList,
  reviewsList,
  verifyTeacher,
} from "../controller/adminAll.js";

const adminRouter = Router();

adminRouter.post("/admin/signup", adminSignup);
adminRouter.post("/admin/login", adminLogin);

adminRouter.get("/admin/get-total-lists", getTotalList);
adminRouter.post("/admin/reviews-list", reviewsList);
adminRouter.delete("/admin/delete-review", deleteReview);
adminRouter.post("/admin/verify-teacher", verifyTeacher);

export default adminRouter;
