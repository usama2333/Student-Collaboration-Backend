const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const Group = require('../models/groupModel');
const { protect } = require('../middleware/authMiddleware');

// Create a group
// Create a group
router.post('/', protect, async (req, res) => {
  const { name } = req.body;

  try {
    // Check for duplicate group name (case insensitive)
    const existingGroup = await Group.findOne({ name: new RegExp(`^${name}$`, 'i') });

    if (existingGroup) {
      return res.status(400).json({ message: 'Group name already exists' });
    }

    const group = await Group.create({
      name,
      members: [req.user._id],
      createdBy: req.user._id
    });

    res.status(201).json(group);
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error fallback
      return res.status(400).json({ message: 'Group name already exists' });
    }
    res.status(500).json({ message: 'Group creation failed' });
  }
});


// Get all groups the user is part of
// Get all groups (visible to all users)
router.get('/', protect, async (req, res) => {
  try {
    const groups = await Group.find(); // No filtering
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

// Fetch messages by group ID
router.get('/:groupId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.groupId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Get messages for a group
router.get('/:groupId/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.groupId }).sort({ createdAt: 1 }).populate('sender', 'name');;
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch group messages' });
  }
});

router.delete('/:groupId/messages/:messageId', protect, async (req, res) => {
  const { groupId, messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findOne({ _id: messageId, room: groupId });

    if (!message) return res.status(404).json({ error: 'Message not found' });

// if (
//   message.sender.toString() !== userId.toString() &&
//   userRole !== 'admin' &&
//   userRole !== 'superadmin'
// ) {
//   return res.status(403).json({ error: 'Not authorized to delete this message' });
// }
    await Message.deleteOne({ _id: messageId });

    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a group (only the admin can delete it)
router.delete('/:groupId', protect, async (req, res) => {
  const { groupId } = req.params;

  try {
    // Find the group by its ID
    const group = await Group.findById(groupId);

    // Check if the group exists
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is the admin (creator of the group)
if (
  group.createdBy.toString() !== req.user._id.toString() &&
  req.user.role !== 'admin' &&
  req.user.role !== 'superadmin'
) {
  return res.status(403).json({ message: 'You are not authorized to delete this group' });
}


    // Delete the group
    await Group.deleteOne({ _id: groupId });

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ message: 'Failed to delete the group' });
  }
});

router.put('/:groupId', protect, async (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (
      group.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'superadmin'
    ) {
      return res.status(403).json({ message: 'You are not authorized to update this group' });
    }


    // Check for duplicate group name
    const existingGroup = await Group.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingGroup && existingGroup._id.toString() !== groupId) {
      return res.status(400).json({ message: 'Group name already exists' });
    }

    group.name = name;
    await group.save();

    res.status(200).json({ message: 'Group name updated successfully', group });
  } catch (error) {
    console.error('Update group name error:', error);
    res.status(500).json({ message: 'Failed to update group name' });
  }
});




module.exports = router;
