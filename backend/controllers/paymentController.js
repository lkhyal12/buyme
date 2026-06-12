import { stripe } from "../lib/stripe.js";
import CouponModel from "../models/couponModel.js";
import ProductModel from "../models/productModel.js";
import OrderModel from "../models/orderModel.js";
export const createCheckOutSession = async (req, res) => {
  const { products, couponCode } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Invalid or empty products array" });
  }

  try {
    let totalAmount = 0;

    const lineItems = await Promise.all(
      products.map(async (product) => {
        const dbProduct = await ProductModel.findById(product._id);

        if (!dbProduct) {
          throw new Error("Product not found");
        }

        const amount = dbProduct.price * 100;

        totalAmount += amount * product.quantity;

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: dbProduct.name,
              images: [dbProduct.image],
            },
            unit_amount: amount,
          },
          quantity: product.quantity || 1,
        };
      }),
    );

    let coupon = null;

    if (couponCode) {
      coupon = await CouponModel.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
    }
    console.log(lineItems);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/purchase-success/session_id={CHECKOUT_SESSION_ID}`,

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
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          })),
        ),
      },
    });

    if (totalAmount > 20000) {
      await createNewCoupon(req.user._id);
    }

    return res.status(200).json({
      message: "Purchase completed successfully",
      id: session.id,
      totalAmount: totalAmount / 100,
      url: session.url,
    });
  } catch (err) {
    console.log("error in the create checkout controller ", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

async function createNewCoupon(userId) {
  await CouponModel.findOneAndDelete({ userId: userId });
  const newCoupon = new CouponModel({
    code: "GIFT" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId,
  });

  await newCoupon.save();
}

// checkout success
export const checkoutSuccess = async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    const existingOrder = await OrderModel.findOne({
      stripeSessionId: sessionId,
    });
    if (existingOrder) {
      return res.status(200).json({
        message: "Order already processed",
        success: true,
        orderId: existingOrder._id,
      });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session?.payment_status === "paid") {
      // if (session.metadata.couponCode) {
      //   await CouponModel.findOneAndUpdate(
      //     {
      //       code: session.metadata.couponCode,
      //       userId: session.metadata.userId,
      //     },
      //     { isActive: false },
      //   );
      // }

      const products = JSON.parse(session.metadata.products);
      const newOrder = new OrderModel({
        userId: session.metadata.userId,
        products: products.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: Math.random().toString(),
      });
      await newOrder.save();
      return res.status(200).json({
        message:
          "Payment successfull, order created, and coupon deactivated if used.",
        success: true,
        orderId: newOrder._id,
      });
    }
  } catch (err) {
    console.log("error in the checkout success controlle ", err);
    return res.status(500).json({ message: "Server error" });
  }
};
