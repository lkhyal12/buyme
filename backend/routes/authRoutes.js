import express from "express";
import { signUpController } from "../controllers/authControllers";
const authRouter = express.Router();

authRouter.post("/sign-up", signUpController);
