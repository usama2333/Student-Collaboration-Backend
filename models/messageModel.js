const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  content: { type: String },
  type: { type: String, enum: ['text', 'image', 'audio', 'file'], default: 'text' },
  fileUrl: { type: String },
  room: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
