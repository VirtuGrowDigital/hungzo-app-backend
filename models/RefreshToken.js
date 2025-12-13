import mongoose from "mongoose";


const refreshSchema = new mongoose.Schema(
{
token: String,
user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
expiresAt: Date,
},
{ timestamps: true }
);


const RefreshToken = mongoose.model("RefreshToken", refreshSchema);
export default RefreshToken;