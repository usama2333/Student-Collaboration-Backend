// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/messageModel');

router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipients: req.params.userId },
        { sender: req.params.userId, recipients: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

router.delete('/:messageId', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    // Check if the user is the sender or a recipient
    const isSender = message.sender.toString() === req.user._id.toString();
    const isRecipient = message.recipients.some(
      recipient => recipient.toString() === req.user._id.toString()
    );

    if (!isSender && !isRecipient) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await await message.deleteOne();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message' });
  }
});





module.exports = router;
