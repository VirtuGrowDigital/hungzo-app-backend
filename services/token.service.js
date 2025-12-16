import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import mongoose from "mongoose";

// ================================
// ACCESS TOKEN
// ================================
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    }
  );
};

// ================================
// REFRESH TOKEN
// ================================
export const generateRefreshToken = async (userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "30d",
    }
  );

  await RefreshToken.create({
    token,
    user: new mongoose.Types.ObjectId(userId),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return token;
};

// ================================
// VERIFY REFRESH TOKEN
// ================================
export const verifyRefreshToken = async (token) => {
  const stored = await RefreshToken.findOne({ token });
  if (!stored) return null;

  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
};

// ================================
// ROTATE REFRESH TOKEN
// ================================
export const rotateRefreshToken = async (oldToken, userId) => {
  await RefreshToken.deleteOne({ token: oldToken });
  return await generateRefreshToken(userId);
};

// ================================
// LOGOUT / REVOKE
// ================================
export const revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
  return true;
};
