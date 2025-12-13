import jwt from "jsonwebtoken";


export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Missing Access Token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // contains { id, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid or Expired Access Token" });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ msg: "Forbidden: Role Not Allowed" });
    }
    next();
  };
};
