import Admin from "../models/Admin.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/token.service.js";

/**
 * =====================================================
 * ADMIN LOGIN (ADMIN + SUPERADMIN)
 * =====================================================
 */
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "username and password required",
      });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const match = await admin.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials, Password do not matched" });
    }

    //  Both ADMIN and SUPERADMIN can login
    const accessToken = generateAccessToken({
      _id: admin._id,
      role: admin.role,
    });

    const refreshToken = await generateRefreshToken(admin._id);

    res.json({
      message: "Login successful",
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({
      message: "Admin login failed",
    });
  }
};

/**
 * =====================================================
 * CREATE ADMIN (SUPERADMIN ONLY)
 * =====================================================
 */
export const createAdmin = async (req, res) => {
  try {
    //  Role check must be enforced by middleware
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "username and password required",
      });
    }

    if (!["ADMIN", "SUPERADMIN"].includes(role)) {
      return res.status(400).json({
        message: "Invalid admin role",
      });
    }

    const exists = await Admin.findOne({ username });
    if (exists) {
      return res.status(400).json({
        message: "Admin username already exists",
      });
    }


    const admin = await Admin.create({
      username,
      password,
      role,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({
      message: "Failed to create admin",
    });
  }
};

/**
 * =====================================================
 * LIST ADMINS (ADMIN + SUPERADMIN)
 * =====================================================
 */
export const listAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 });
    res.json(admins);
  } catch (err) {
    console.error("List admins error:", err);
    res.status(500).json({
      message: "Failed to fetch admins",
    });
  }
};

/**
 * =====================================================
 * DELETE ADMIN (SUPERADMIN ONLY)
 * =====================================================
 */
export const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // Prevent deleting yourself
    if (req.user.id === adminId) {
      return res.status(400).json({
        message: "You cannot delete yourself",
      });
    }

    await Admin.findByIdAndDelete(adminId);

    res.json({
      message: "Admin deleted successfully",
    });
  } catch (err) {
    console.error("Delete admin error:", err);
    res.status(500).json({
      message: "Failed to delete admin",
    });
  }
};
