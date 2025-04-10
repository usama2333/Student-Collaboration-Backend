const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Protect route - Verifies token and attaches user to req object
const protect = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;  // Make sure 'userId' is used consistently in the token
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Authenticate Admin - Verifies token and checks if the user is an admin
// const authenticateAdmin = async (req, res, next) => {
//   try {
//     // Get token from the request headers (assuming Bearer token)
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token provided" });

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Check if the user is an admin
//     const user = await User.findById(decoded.userId);
//     if (!user || user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     req.user = user; // Attach user to the request object
//     next();
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error });
//   }
// };

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is an admin
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { protect, authenticateAdmin };
