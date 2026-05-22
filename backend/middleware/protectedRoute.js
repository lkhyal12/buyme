import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
export const protectedRoute = async (req, res, next) => {
  const header = req.headers.authorization;
  const accessToken = header?.split(" ")[1];
  if (!accessToken)
    return res.status(401).json({ message: "Missing accessToken" });

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    console.log("error in the protected route middleware ", err);
    return res.status(401).json({ message: "Invalid accessToken" });
  }
};

export function adminRoute(req, res, next) {
  const user = req.user;
  if (user && user.role === "admin") {
    next();
  } else return res.status(403).json({ message: "Acces denied - Admin only" });
}
