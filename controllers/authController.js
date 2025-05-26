const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const axios = require('axios');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: 'User already exists' });

    const API_KEY = 'fc2492628cceb1ff1a6c6b97813ded46';

    const response = await axios.get(`https://apilayer.net/api/check`, {
      params: {
        access_key: API_KEY,
        email: email,
        smtp: 1,
        format: 1
      }
    });

    if (!response.data.mx_found) {
    return  res.status(400).json({ message: 'Email does not exists' });
    }

    user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Check if the password matches
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Create JWT token with user ID and role
//     const token = jwt.sign(
//       { userId: user._id, role: user.role },  // Include role in the token
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Save token to DB
//     await Token.create({
//       userId: user._id,
//       token,
//       isActive: true,
//     });

//     // Return the token to the client
//     return res.status(200).json({ token });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Create a token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // 3. Check if a token already exists for this user
    const existingToken = await Token.findOne({ userId: user._id });

    if (existingToken) {
      // Update existing token
      existingToken.token = token;
      existingToken.isActive = true;
      await existingToken.save();
    } else {
      // Save new token if none exists
      await Token.create({ userId: user._id, token, isActive: true });
    }

    // 4. Respond with token and user info
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req, res) => {
  const bearerToken = req.header('Authorization');
  const token = bearerToken?.split(' ')[1] || bearerToken;

  try {
    await Token.findOneAndUpdate({ token, userId: req.user }, { isActive: false });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetURL = `http://localhost:3000/update-password/${resetToken}`;
    const message = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Password Reset</title>
    </head>
    <body>
      <p>Click the link below to reset your password:</p>
      <p>
        <a href="${resetURL}" target="_blank" style="color: blue; text-decoration: underline;">Click here to reset your password</a>
      </p>
    </body>
  </html>
`;

    await sendEmail({ to: user.email, subject: 'Password Reset Request', text: message });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, forgotPassword, resetPassword, logout };
