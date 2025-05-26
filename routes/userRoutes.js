// /routes/userRoutes.js
const express = require("express");
const { protect, authenticateAdmin, authenticateUser } = require("../middleware/authMiddleware");
const { updateUser, getAllUsers,deleteUser, updateMessages } = require("../controllers/userController");

const router = express.Router();

// POST route for updating user information (admin only)
router.post("/update", authenticateUser, updateUser);
router.post("/update-messages", authenticateUser, updateMessages);

// GET route for retrieving all users (admin only)
router.get("/", getAllUsers);

// Delete user 
// DELETE route for deleting a user (admin or superadmin only)
router.delete("/:userId", authenticateAdmin, deleteUser);


module.exports = router;
