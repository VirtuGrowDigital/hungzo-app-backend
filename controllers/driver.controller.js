const User = require("../models/User");
const Driver = require("../models/Driver");

exports.registerDriver = async (req, res) => {
  try {
    const {
      firebaseUid,
      phone,
      name,
      vehicleType,
      vehicleNumber,
      licenseNumber
    } = req.body;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid,
        phone,
        name,
        role: "DRIVER",
        isVerified: true,
      });
    }

    const driver = await Driver.create({
      user: user._id,
      vehicleType,
      vehicleNumber,
      licenseNumber,
    });

    user.driverId = driver._id;
    await user.save();

    res.json({
      message: "Driver registered successfully",
      status: driver.verificationStatus,
      driver,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
