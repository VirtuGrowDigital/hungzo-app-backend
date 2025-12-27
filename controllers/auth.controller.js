import User from "../models/User.js";
import { normalizeFirebaseUser } from "../services/firebaseUser.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
} from "../services/token.service.js";

/**
 * =====================================================
 * 1. Firebase Login → Issue JWT Tokens
 * =====================================================
 */
export const firebaseLogin = async (req, res) => {
  try {
    if (!req.firebaseUser) {
      return res.status(400).json({ msg: "Firebase user missing" });
    }

    const fb = normalizeFirebaseUser(req.firebaseUser);
    const { role } = req.body;

    if (!role || !["RESTAURANT", "DRIVER"].includes(role)) {
      return res.status(400).json({
        msg: "Role must be RESTAURANT or DRIVER",
      });
    }

    let user = await User.findOne({ firebaseUid: fb.firebaseUid });

    // First time login
    if (!user) {
      user = await User.create({
        firebaseUid: fb.firebaseUid,
        phone: fb.phone,
        // name: fb.name,
        email: fb.email,
        role,
        isVerified: false, // admin approval required
      });
    }

    // Existing user role mismatch
    if (user.role !== role) {
      return res.status(403).json({
        msg: `User already registered as ${user.role}`,
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id);

    return res.json({
      status: "SUCCESS",
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(500).json({ msg: "Login failed" });
  }
};

/**
 * =====================================================
 * 2. Refresh Access Token
 * =====================================================
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ msg: "Missing refresh token" });
    }

    const decoded = await verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    const newRefreshToken = await rotateRefreshToken(
      refreshToken,
      decoded.id
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ msg: "Token refresh failed" });
  }
};

/**
 * =====================================================
 * 3. Logout (invalidate refresh token)
 * =====================================================
 */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ msg: "Missing refresh token" });
    }

    await revokeRefreshToken(refreshToken);

    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ msg: "Logout failed" });
  }
};
