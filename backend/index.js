import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import { connectToMongoDb } from "./lib/connectToMongoDB.js";
import cookieParser from "cookie-parser";
import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartRouter.js";
import couponRouter from "./routes/couponRouter.js";
import paymentRouter from "./routes/paymentRouter.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/payment", paymentRouter);

app.listen(PORT, () => {
  connectToMongoDb();
  console.log("server is running on port ", PORT);
});
