import express from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getFeaturedProducts,
} from "../controllers/productsController.js";
import { adminRoute, protectedRoute } from "../middleware/protectedRoute.js";
const productsRouter = express.Router();
productsRouter.get("/", protectedRoute, adminRoute, getAllProductsController);
productsRouter.get("/featured", getFeaturedProducts);
productsRouter.post("/", protectedRoute, adminRoute, createProductController);
productsRouter.delete(
  "/:id",
  protectedRoute,
  adminRoute,
  deleteProductController,
);

export default productsRouter;
