const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// ROUTES
const authRoutes = require("./routes/auth.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const driverRoutes = require("./routes/driver.routes");
// const adminRoutes = require("./routes/admin.routes");

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
// app.use("/admin", adminRoutes);

module.exports = app;
