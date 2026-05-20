import express from "express";
import {
  loginController,
  signUpController,
} from "../controllers/authControllers.js";
const authRouter = express.Router();

authRouter.post("/sign-up", signUpController);
authRouter.post("/login", loginController);

export default authRouter;
