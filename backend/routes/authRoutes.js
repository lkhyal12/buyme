import express from "express";
import {
  getProfileController,
  loginController,
  logoutController,
  refresh,
  signUpController,
} from "../controllers/authControllers.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const authRouter = express.Router();

authRouter.post("/sign-up", signUpController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/refresh", refresh);
authRouter.get("/profile", protectedRoute, getProfileController);
export default authRouter;
