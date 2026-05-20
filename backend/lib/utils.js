import jwt from "jsonwebtoken";
import { redis } from "./redis.js";

export function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}

// store refresh token in redis
export async function storeRefreshToken(userId, refreshToken) {
  try {
    const result = await redis.set(
      `refreshToken:${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60,
    );
    return { success: true };
  } catch (err) {
    console.log("error in the storerefreshToken function", err);
    return { success: false };
  }
}

// set cookies
export function setCookies(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}
