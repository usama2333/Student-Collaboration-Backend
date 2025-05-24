const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  creator: { 
    ref:'User',
    type:mongoose.SchemaTypes.ObjectId
  },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed:{type:Boolean}
}, { timestamps: true }); // adds createdAt & updatedAt

module.exports = mongoose.model("Assignment", assignmentSchema);
