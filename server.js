import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";
import { ensureDefaultAdmin } from "./utils/ensureDefaultAdmin.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Create default admin (runs only once)
    await ensureDefaultAdmin();

    // 3. Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Hungzo Backend Running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server Startup Error:", err);
    process.exit(1); // Stop process so nodemon restarts
  }
};

startServer();
