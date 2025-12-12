import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

// BASE TEST ROUTE
app.get("/", (req, res) => {
  res.send("Hungzo Backend Running...");
});

// MAIN ROUTES
app.use("/auth", authRoutes);
app.use("/restaurant", restaurantRoutes);
app.use("/driver", driverRoutes);
app.use("/admin", adminRoutes);

export default app;
