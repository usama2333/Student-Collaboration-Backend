
const User = require("../models/userModel");

// POST API for updating user information, including role and password (admin only)
// POST API for updating user information, including role and password (admin or self-update)
const updateUser = async (req, res) => {
  try {
    const { email, name, department, phone, cnic, address, imageUrl, role, dob } = req.body;
    console.log('Received data:', req.body);

    // Check if user with provided email exists
    const userToUpdate = await User.findOne({ email });
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check permission: either admin or self
    const isAdmin = req.user.role === "admin";
    const isSuperAdmin = req.user.role === "superadmin";
    const isSelf = req.user.email === email;

  
    if (!isAdmin && !isSuperAdmin && !isSelf) {
      return res.status(403).json({ message: "Not authorized to update this user" });
    }

    // Prevent setting a future date for DOB
    if (dob) {
      const dobDate = new Date(dob);
      const today = new Date();

      if (dobDate > today) {
        return res.status(400).json({ message: "Date of birth cannot be in the future" });
      }

      userToUpdate.dob = dobDate;
    }

    // Update user details
    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.department = department || userToUpdate.department;
    userToUpdate.phone = phone || userToUpdate.phone;
    userToUpdate.cnic = cnic || userToUpdate.cnic;
    userToUpdate.address = address || userToUpdate.address;
    userToUpdate.imageUrl = imageUrl || userToUpdate.imageUrl;

    // Allow only admin to change role
    if (role && (isAdmin || isSuperAdmin)) {
      userToUpdate.role = role;
    }

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

  // delete user
  const deleteUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const userToDelete = await User.findById(userId);
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const requesterRole = req.user.role;
      const targetRole = userToDelete.role;
  
      // Restriction: Only superadmin can delete another superadmin
      if (targetRole === "superadmin" && requesterRole !== "superadmin") {
        return res.status(403).json({ message: "Only superadmin can delete another superadmin" });
      }
  
      // Restriction: Only admin or superadmin can delete an admin
      if (targetRole === "admin" && !(requesterRole === "admin" || requesterRole === "superadmin")) {
        return res.status(403).json({ message: "Only admin or superadmin can delete an admin" });
      }
  
      // Restriction: Only admin or superadmin can delete a user
      if (targetRole === "user" && !(requesterRole === "admin" || requesterRole === "superadmin")) {
        return res.status(403).json({ message: "Access denied" });
      }
  
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
  
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  };
  
  

module.exports = {
  updateUser,
  getAllUsers,
  deleteUser
};
