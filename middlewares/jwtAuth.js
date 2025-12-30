import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Missing Access Token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Normalize payload
    req.user = {
      id: decoded.id || decoded._id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or Expired Access Token" });
  }
};

/**
 * Allow MULTIPLE roles
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    // console.log("ROLE:", req.user.role, "ALLOWED:", roles, "URL:", req.originalUrl);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: Role Not Allowed" });
    }
    next();
  };
};
