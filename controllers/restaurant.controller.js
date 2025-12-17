import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";

// REGISTER RESTAURANT
// export const registerRestaurant = async (req, res) => {
//   try {
//     const {
//       firebaseUid,
//       phone,
//       name,
//       restaurantName,
//       gst,
//       fssai,
//       address,
//     } = req.body;

//     // Create User if not exist
//     let user = await User.findOne({ firebaseUid });

//     if (!user) {
//       user = await User.create({
//         firebaseUid,
//         phone,
//         name,
//         role: "RESTAURANT",
//         isVerified: true,
//       });
//     }

//     const restaurant = await Restaurant.create({
//       owner: user._id,
//       name: restaurantName,
//       gst,
//       fssai,
//       addresses: [address]
//     });

//     user.restaurantId = restaurant._id;
//     await user.save();

//     res.json({
//       message: "Restaurant registered successfully",
//       status: restaurant.verificationStatus,
//       restaurant,
//       user
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const registerRestaurant = async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;
    const { phone, name, restaurantName, gst, fssai, address } = req.body;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid,
        phone,
        name,
        role: "RESTAURANT",
        isVerified: false,
      });
    }

     // 🚫 Role lock
     if (user.role !== "RESTAURANT") {
      return res.status(403).json({
        message: `This account is registered as ${user.role}`,
      });
    }

    // 🚫 Prevent duplicate restaurant
    if (user.restaurantId) {
      return res.status(400).json({ message: "Restaurant already registered" });
    }

    // ✅ Update phone/name if changed
    if (phone && user.phone !== phone) user.phone = phone;
    if (name && user.name !== name) user.name = name;
    await user.save();

    const restaurant = await Restaurant.create({
      owner: user._id,
      name: restaurantName,
      gst,
      fssai,
      addresses: [address],
    });

    user.restaurantId = restaurant._id;
    await user.save();

    res.json({
      message: "Restaurant registered",
      status: restaurant.verificationStatus,
      restaurant,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// =====================================================
// APPROVE RESTAURANT
// =====================================================
export const approveRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: "APPROVED" },
    { new: true }
  );

  await User.findByIdAndUpdate(restaurant.owner, { isVerified: true });

  res.json({ msg: "Restaurant Approved", restaurant });
};

// =====================================================
// REJECT RESTAURANT
// =====================================================
export const rejectRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: "REJECTED" },
    { new: true }
  );

  res.json({ msg: "Restaurant Rejected", restaurant });
};