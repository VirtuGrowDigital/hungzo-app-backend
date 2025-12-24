import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";


// Register Restaurent

export const registerRestaurant = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      ownerName,
      restaurantName,
      gst,
      fssai,
      address,
    } = req.body;

    // Validate required fields
    if (!ownerName || !restaurantName || !address) {
      return res.status(400).json({
        message: "Owner name, restaurant name, and address are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please login again.",
      });
    }

    // Prevent duplicate registration
    if (user.restaurantId) {
      return res.status(400).json({
        message: "Restaurant already registered",
      });
    }

    // Create restaurant
    const restaurant = await Restaurant.create({
      owner: user._id,
      ownerName,               // from body
      name: restaurantName,
      gst,
      fssai,
      addresses: [address],
    });

    //  Link restaurant to user
    user.restaurantId = restaurant._id;
    await user.save();

    return res.status(201).json({
      message: "Restaurant registered successfully",
      verificationStatus: restaurant.verificationStatus,
      restaurant,
      restaurantId: restaurant._id,
    });
  } catch (err) {
    console.error("Register restaurant error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};




// APPROVE RESTAURANT
export const approveRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: "APPROVED" },
    { new: true }
  );

  await User.findByIdAndUpdate(restaurant.owner, { isVerified: true });

  res.json({ msg: "Restaurant Approved", restaurant });
};


// REJECT RESTAURANT
export const rejectRestaurant = async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: "REJECTED" },
    { new: true }
  );

  res.json({ msg: "Restaurant Rejected", restaurant });
};