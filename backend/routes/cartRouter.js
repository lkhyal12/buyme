import express from "express";
import {
  addToCartController,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cartController.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const cartRouter = express.Router();

cartRouter.post("/", protectedRoute, addToCartController);
cartRouter.get("/", protectedRoute, getCartProducts);
cartRouter.delete("/", protectedRoute, removeAllFromCart);
cartRouter.put("/:id", protectedRoute, updateQuantity);
export default cartRouter;
