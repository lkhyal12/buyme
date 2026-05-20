import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRouter);
app.listen(PORT, () => {
  console.log("server is running on port ", PORT);
});
