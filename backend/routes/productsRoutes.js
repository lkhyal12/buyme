import express from "express";
import { getAllProductsController } from "../controllers/productsController.js";
import { adminRoute, protectedRoute } from "../middleware/protectedRoute.js";
const productsRouter = express.Router();
productsRouter.get("/", protectedRoute, adminRoute, getAllProductsController);

export default productsRouter;
