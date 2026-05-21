import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  const header = req.headers.authorization;
  const accessToken = header?.split(" ")[1];
  if (!accessToken)
    return res.status(401).json({ message: "Missing accessToken" });

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log("error in the protected route middleware ", err);
    return res.status(401).json({ message: "Invalid accessToken" });
  }
};
