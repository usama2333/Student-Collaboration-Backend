const express = require("express");
const {
  createAssignment,
  getAllAssignments,
  deleteAssignment,
   updateAssignment,
} = require("../controllers/assignmentController");

const router = express.Router();

router.post("/", createAssignment);
router.post("/get", getAllAssignments);
router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

module.exports = router;
