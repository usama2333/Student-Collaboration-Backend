const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  creator: { type: String, required: true },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
}, { timestamps: true }); // adds createdAt & updatedAt

module.exports = mongoose.model("Assignment", assignmentSchema);
