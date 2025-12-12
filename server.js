import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";
import { ensureDefaultAdmin } from "./utils/ensureDefaultAdmin.js";

const PORT = process.env.PORT || 5000;

// Connect DB → then start server
connectDB();

await ensureDefaultAdmin();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
