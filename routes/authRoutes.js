const express = require("express");
const { signup, login, forgotPassword, resetPassword,logout } = require("../controllers/authController");
// const { logoutUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", protect, logout);

module.exports = router;
