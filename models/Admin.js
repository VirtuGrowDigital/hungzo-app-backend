import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // hashed
        role: {
            type: String,
            enum: ["SUPERADMIN", "ADMIN"],
            default: "ADMIN",
        },
    },
    { timestamps: true }
);

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

adminSchema.methods.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
