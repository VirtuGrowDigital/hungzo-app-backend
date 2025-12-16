// import Admin from "../models/Admin.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";


// export const adminLogin = async (req, res) => {
//   const { username, password } = req.body;

//   const admin = await Admin.findOne({ username });
//   if (!admin) return res.status(404).json({ message: "Admin not found" });

//   const ok = await bcrypt.compare(password, admin.password);
//   if (!ok) return res.status(403).json({ message: "Incorrect password" });

//   const token = jwt.sign(
//     { id: admin._id, role: admin.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "2d" }
//   );

//   res.json({ token, role: admin.role });
// };


import  Admin  from "../models/Admin.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/token.service.js";

// =====================================================
// ADMIN LOGIN
// =====================================================
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(404).json({ msg: "Admin not found" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ msg: "Incorrect password" });

  const accessToken = generateAccessToken(admin);
  const refreshToken = await generateRefreshToken(admin._id);

  res.json({ admin, accessToken, refreshToken });
};

// =====================================================
// CREATE ADMIN (SUPERADMIN ONLY)
// =====================================================
export const createAdmin = async (req, res) => {
  const { username, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    username,
    password: hashed,
    role,
  });

  res.json({ msg: "Admin created", admin });
};

// =====================================================
// LIST ALL ADMINS
// =====================================================
export const listAdmins = async (req, res) => {
  const admins = await Admin.find();
  res.json(admins);
};

// =====================================================
// DELETE ADMIN
// =====================================================
export const deleteAdmin = async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ msg: "Admin deleted" });
};

