import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { createCheckOutSession } from "../controllers/paymentController.js";
import { stripe } from "../lib/stripe.js";
import CouponModel from "../models/couponModel";
const paymentRouter = express.Router();
paymentRouter.post(
  "/create-checkout-session",
  protectedRoute,
  async (req, res) => {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty products array" });
    }
    try {
      let totalAmount = 0;
      const lineItems = products.map((product) => {
        const amount = product.price * 100;
        totalAmount += amount * product.quantity;
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              images: [product.image],
            },
            unit_amount: amount,
          },
        };
      });

      let coupon = null;
      if (couponCode) {
        coupon = await CouponModel.findOne({
          code: couponCode,
          userId: req.user._id,
          isActive: true,
        });
        if (coupon) {
          totalAmount -= Math.round(
            (totalAmount * coupon.discountPercentage) / 100,
          );
        }
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/purchase-sucess?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
        discounts: coupon
          ? [
              {
                coupon: await createStripeCoupon(coupon.discountPercentage),
              },
            ]
          : [],
        metadata: {
          userId: req.user._id.toString(),
          couponCode: couponCode || "",
        },
      });

      if (totalAmount > 20000) {
        await createNewCoupon(req.user._d);
      }
      return res.status(200).json({
        message: "Purchase cmpleted successfully",
        id: session.id,
        totalAmount: totalAmount / 100,
      });
    } catch (err) {
      console.log("error in the create checkout controller ", err);
      return res.status(500).json({ message: "Server error" });
    }
  },
);
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}
async function createNewCoupon(userId) {
  const newCoupon = new CouponModel({
    code: "GIFT" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });
}
export default paymentRouter;
