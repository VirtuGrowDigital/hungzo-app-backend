import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import AWS from "aws-sdk";
const s3 = new AWS.S3();

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
      email
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

    const profilePicUrl = req.file ? req.file.location : null;

    // Create restaurant
    const restaurant = await Restaurant.create({
      owner: user._id,
      ownerName,
      email,               // from body
      name: restaurantName,
      gst,
      fssai,
      profilePic: profilePicUrl,
      addresses: [JSON.parse(address)],
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


// update restaurent profile
export const updateRestaurantProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ownerName, email } = req.body;

    //  Fetch restaurant
    const restaurant = await Restaurant.findOne({ owner: userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update restaurant fields
    if (ownerName) restaurant.ownerName = ownerName;

    //  Update email in USER (THIS WAS MISSING)
    if (email) {
      user.email = email.toLowerCase();
    }

    // Update profile pic if uploaded
    if (req.file) {
      if (restaurant.profilePic) {
        const oldKey = new URL(restaurant.profilePic).pathname.substring(1);
        await s3
          .deleteObject({
            Bucket: process.env.AWS_RESTAURANT_PROFILE_BUCKET,
            Key: oldKey,
          })
          .promise();
      }

      restaurant.profilePic = req.file.location;
    }

    await restaurant.save();
    await user.save();

    // RETURN COMBINED RESPONSE (IMPORTANT)
    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        ownerName: restaurant.ownerName,
        email: user.email,              // ✅ FROM USER
        profilePic: restaurant.profilePic,
      },
    });
  } catch (error) {
    console.error("Update Restaurant Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// Admin -->
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