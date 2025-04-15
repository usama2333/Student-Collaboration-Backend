const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");

// Helper to extract token from Authorization header
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

// Protect route - Verifies token and attaches user to req object
const protect = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const storedToken = await Token.findOne({
      token,
      isActive: true,
      userId: decoded.userId,
    });
    if (!storedToken) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // full user object
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Authenticate Admin - Verifies token and checks if the user is an admin/superadmin
const authenticateAdmin = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const storedToken = await Token.findOne({
      token,
      isActive: true,
      userId: decoded.userId,
    });
    if (!storedToken) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }

    const user = await User.findById(decoded.userId);
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { protect, authenticateAdmin };
