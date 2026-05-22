import { redis } from "../lib/redis.js";
import { generateTokens, setCookies, storeRefreshToken } from "../lib/utils.js";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const signUpController = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  const trimmedEmail = email?.trim();
  const trimmedName = name?.trim();
  if (!trimmedEmail || !trimmedName || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const existingUser = await UserModel.findOne({ email: trimmedEmail });
    if (existingUser)
      return res.status(409).json({ message: "This email is already taken" });
    // the password is hashed in the pre middleware
    const user = await UserModel.create({ email, name, password });
    const { accessToken, refreshToken } = generateTokens(user._id);
    const { success } = await storeRefreshToken(user._id, refreshToken);
    setCookies(res, refreshToken);
    return res.status(201).json({
      message: "Account created successfully",
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
      accessToken,
    });
  } catch (err) {
    console.log("error in sign up controller ", err);
    return res.status(500).json({ message: err?.message || "Server error" });
  }
};

// login controller

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const trimmedEmail = email?.trim();
  if (!trimmedEmail || !password)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const user = await UserModel.findOne({ email: trimmedEmail });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      const { success } = await storeRefreshToken(user._id, refreshToken);
      setCookies(res, refreshToken);
      return res.status(200).json({
        message: "You logged in successfully",
        user: {
          _id: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
        },
        accessToken,
      });
    }

    return res.status(400).json({ message: "Invalid crenetials" });
  } catch (err) {
    console.log("error occured in  the login controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// logout controller
export const logoutController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "Missign refreshToken" });
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await redis.del(`refreshToken:${decoded.userId}`);
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "You logged out successfully" });
  } catch (err) {
    console.log("error in the logout controller ", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// refresh controller
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  // console.log(refreshToken);
  if (!refreshToken)
    return res.status(401).json({ message: "Missing refreshToken" });
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedRefreshToken = await redis.get(
      `refreshToken:${decoded.userId}`,
    );
    if (refreshToken !== storedRefreshToken) {
      return res.status(401).json({ message: "Invalid refreshToken" });
    }
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    return res.status(200).json({
      message: "New accessToken was issued",
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.log("error in the refresh controller ", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// get profile controllers
export const getProfileController = async (req, res) => {
  try {
    const user = req.user;
    return res
      .status(200)
      .json({ message: "User info sent successfully", user });
  } catch (err) {
    console.log("error in the getProfile controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
};
