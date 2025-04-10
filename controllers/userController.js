
const User = require("../models/userModel");

// POST API for updating user information, including role and password (admin only)
const updateUser = async (req, res) => {
    try {
      const { email, name, department, phone, cnic, address, imageUrl, role,dob } = req.body;
      console.log('Received data:', req.body);
      // Check if the user with the provided email exists
      const userToUpdate = await User.findOne({ email });
      if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update user details
      userToUpdate.name = name || userToUpdate.name;
      userToUpdate.department = department || userToUpdate.department;
      userToUpdate.phone = phone || userToUpdate.phone;
      userToUpdate.cnic = cnic || userToUpdate.cnic;
      userToUpdate.address = address || userToUpdate.address;
      userToUpdate.imageUrl = imageUrl || userToUpdate.imageUrl;
      userToUpdate.dob = dob ? new Date(dob) : userToUpdate.dob;
  
      // Update role if provided and if the user is an admin
      if (role) {
        if (req.user.role !== "admin") {
          return res.status(403).json({ message: "Only admins can change roles" });
        }
        userToUpdate.role = role;
      }
  
      // Save updated user
      await userToUpdate.save();
  
      return res.status(200).json({ message: "User updated successfully", user: userToUpdate });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
  

// GET API for retrieving all users
const getAllUsers = async (req, res) => {
    try {
      // Find users who have all necessary fields filled out
      const users = await User.find({
        name: { $exists: true, $ne: "" },
        email: { $exists: true, $ne: "" },
        department: { $exists: true, $ne: "" },
        phone: { $exists: true, $ne: "" },
        cnic: { $exists: true, $ne: "" },
        address: { $exists: true, $ne: "" },
        dob: { $exists: true, $ne: null }
      }).select("-password"); // Exclude password from response
  
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
  

module.exports = {
  updateUser,
  getAllUsers,
};
