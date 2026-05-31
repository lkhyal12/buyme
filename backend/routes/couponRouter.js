import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { getCoupon, validateCoupon } from "../controllers/couponController.js";
const couponRouter = express.Router();

couponRouter.get("/", protectedRoute, getCoupon);
couponRouter.post("/validate", protectedRoute, validateCoupon);
export default couponRouter;
