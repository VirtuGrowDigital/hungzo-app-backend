import Driver from "../models/Driver.js";
import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";

// VERIFIED RESTAURANTS
export const verifiedRestaurants = async (req, res) => {
  const list = await Restaurant.find({ verificationStatus: "APPROVED" }).populate("owner");
  res.json(list);
};

// VERIFIED DRIVERS
export const verifiedDrivers = async (req, res) => {
  const list = await Driver.find({ verificationStatus: "APPROVED" }).populate("user");
  res.json(list);
};

// REJECTED RESTAURENT
export const getRejectedRestaurants = async (req, res) => {
    const list = await Restaurant.find({ verificationStatus: "REJECTED" }).populate("owner");
    res.json(list);
  };

// REJECTED DRIVERS
export const getRejectedDrivers = async (req, res) => {
    const list = await Driver.find({ verificationStatus: "REJECTED" }).populate("user");
    res.json(list);
  };


// PENDING RESTAURANTS
export const getPendingRestaurants = async (req, res) => {
    const list = await Restaurant.find({ verificationStatus: "PENDING" }).populate("owner");
    res.json(list);
  };

// GET PENDING DRIVERS
export const getPendingDrivers = async (req, res) => {
    const list = await Driver.find({ verificationStatus: "PENDING" }).populate("user");
    res.json(list);
  };