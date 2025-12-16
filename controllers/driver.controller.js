import User from "../models/User.js";
import Driver from "../models/Driver.js";

// REGISTER DRIVER 
// export const registerDriver = async (req, res) => {
//   try {
//     const {
//       firebaseUid,
//       phone,
//       name,
//       vehicleType,
//       vehicleNumber,
//       licenseNumber
//     } = req.body;

//     let user = await User.findOne({ firebaseUid });

//     if (!user) {
//       user = await User.create({
//         firebaseUid,
//         phone,
//         name,
//         role: "DRIVER",
//         isVerified: true,
//       });
//     }

//     const driver = await Driver.create({
//       user: user._id,
//       vehicleType,
//       vehicleNumber,
//       licenseNumber,
//     });

//     user.driverId = driver._id;
//     await user.save();

//     res.json({
//       message: "Driver registered successfully",
//       status: driver.verificationStatus,
//       driver,
//       user
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


export const registerDriver = async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;
    const { phone, name, vehicleType, vehicleNumber, licenseNumber } = req.body;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid,
        phone,
        name,
        role: "DRIVER",
        isVerified: false, // admin approval
      });
    }

    // 🚫 Role lock
    if (user.role !== "DRIVER") {
      return res.status(403).json({
        message: `This account is registered as ${user.role}`,
      });
    }

    // 🚫 Prevent duplicate registration
    if (user.driverId) {
      return res.status(400).json({ message: "Driver already registered" });
    }

    // ✅ Update phone/name if changed
    if (phone && user.phone !== phone) user.phone = phone;
    if (name && user.name !== name) user.name = name;
    await user.save();

    const driver = await Driver.create({
      user: user._id,
      vehicleType,
      vehicleNumber,
      licenseNumber,
    });

    user.driverId = driver._id;
    await user.save();

    res.json({
      message: "Driver registered",
      status: driver.verificationStatus,
      driver,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ADMIN: GET PENDING DRIVERS
// =====================================================
export const getPendingDrivers = async (req, res) => {
  const list = await Driver.find({ verificationStatus: "PENDING" }).populate("user");
  res.json(list);
};

// =====================================================
// APPROVE DRIVER
// =====================================================
export const approveDriver = async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: "APPROVED" },
    { new: true }
  );

  await User.findByIdAndUpdate(driver.user, { isVerified: true });

  res.json({ msg: "Driver Approved", driver });
};

// =====================================================
// REJECT DRIVER
// =====================================================
export const rejectDriver = async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: "REJECTED" },
    { new: true }
  );

  res.json({ msg: "Driver Rejected", driver });
};