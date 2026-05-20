import { generateTokens, setCookies, storeRefreshToken } from "../lib/utils.js";
import UserModel from "../models/userModel.js";

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

export const loginController = async (req, res) => {};
