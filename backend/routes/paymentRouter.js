import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  checkoutSuccess,
  createCheckOutSession,
} from "../controllers/paymentController.js";
import { stripe } from "../lib/stripe.js";
import CouponModel from "../models/couponModel.js";
import OrderModel from "../models/orderModel.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-checkout-session",
  protectedRoute,
  createCheckOutSession,
);

paymentRouter.post("/checkout-success", protectedRoute, checkoutSuccess);
export default paymentRouter;
