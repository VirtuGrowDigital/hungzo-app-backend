import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";

export const registerRestaurant = async (req, res) => {
  try {
    const {
      firebaseUid,
      phone,
      name,
      restaurantName,
      gst,
      fssai,
      address,
    } = req.body;

    // Create User if not exist
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = await User.create({
        firebaseUid,
        phone,
        name,
        role: "RESTAURANT",
        isVerified: true,
      });
    }

    const restaurant = await Restaurant.create({
      owner: user._id,
      name: restaurantName,
      gst,
      fssai,
      addresses: [address]
    });

    user.restaurantId = restaurant._id;
    await user.save();

    res.json({
      message: "Restaurant registered successfully",
      status: restaurant.verificationStatus,
      restaurant,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
