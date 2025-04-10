// /routes/userRoutes.js
const express = require("express");
const { protect, authenticateAdmin } = require("../middleware/authMiddleware");
const { updateUser, getAllUsers } = require("../controllers/userController");

const router = express.Router();

// POST route for updating user information (admin only)
router.post("/update", authenticateAdmin, updateUser);

// GET route for retrieving all users (admin only)
router.get("/", getAllUsers);

module.exports = router;
