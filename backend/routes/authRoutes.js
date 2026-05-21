import express from "express";
import {
  loginController,
  logoutController,
  refresh,
  signUpController,
} from "../controllers/authControllers.js";
const authRouter = express.Router();

authRouter.post("/sign-up", signUpController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/refresh", refresh);
export default authRouter;
