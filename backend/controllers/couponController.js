import CouponModel from "../models/couponModel.js";

export const getCoupon = async (req, res) => {
  const userId = req.user._id;
  try {
    const coupon = await CouponModel.findOne({ userId, isActive: true });
    if (!coupon) res.status(404).json({ message: "No coupon was found" });
    return res
      .status(200)
      .json({ message: "Coupon sent successfully", coupon });
  } catch (err) {
    console.log("error in the getCoupon controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// validate coupon controller
export const validateCoupon = async (req, res) => {
  try {
    const code = req.body.code;
    const coupon = await CouponModel.findOne({
      code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate > new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon expired" });
    }

    return res
      .status(200)
      .json({
        message: "Coupon is valid",
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
      });
  } catch (err) {
    console.log("error in the validatecoupon controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
};
