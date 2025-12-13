import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/RefreshToken.js";
import mongoose from "mongoose";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRES }
  );
};

export const generateRefreshToken = async (userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRES }
  );

  await RefreshToken.create({
    token,
    user: new mongoose.Types.ObjectId(userId),
    expiresAt: new Date(Date.now() + 30 * 86400000),
  });

  return token;
};

export const verifyRefreshToken = async (token) => {
  const stored = await RefreshToken.findOne({ token });
  if (!stored) return null;

  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
};

export const rotateRefreshToken = async (oldToken, userId) => {
  await RefreshToken.deleteOne({ token: oldToken });
  return await generateRefreshToken(userId);
};

export const revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
  return true;
};
