const Assignment = require("../models/assignmentModel");

// Create Assignment
const createAssignment = async (req, res) => {
  try {
    const { creator, subject, title, dueDate } = req.body;

    const assignment = await Assignment.create({ creator, subject, title, dueDate });

    res.status(201).json({ message: "Assignment created", assignment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Assignment
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment updated", assignment: updatedAssignment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



// Delete Assignment
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Assignment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  deleteAssignment,
   updateAssignment,
};
