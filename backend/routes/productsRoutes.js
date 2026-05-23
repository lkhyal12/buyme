import express from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getFeaturedProducts,
  getProductsByCategory,
  getrecommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/productsController.js";
import { adminRoute, protectedRoute } from "../middleware/protectedRoute.js";
const productsRouter = express.Router();
productsRouter.get("/", protectedRoute, adminRoute, getAllProductsController);
productsRouter.get("/featured", getFeaturedProducts);
productsRouter.get("/recommendations", getrecommendedProducts);
productsRouter.get("/category/:category", getProductsByCategory);
productsRouter.post("/", protectedRoute, adminRoute, createProductController);
productsRouter.delete(
  "/:id",
  protectedRoute,
  adminRoute,
  deleteProductController,
);

productsRouter.patch("/:id", protectedRoute, adminRoute, toggleFeaturedProduct);

export default productsRouter;
