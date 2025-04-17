const jwt = require('jsonwebtoken');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const connectedUsers = new Map();

module.exports = (io) => {
  // JWT authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      console.log(`Authenticated user: ${socket.user._id}`); // Log authenticated user details
      next();
    } catch (err) {
      console.log('Authentication failed:', err);
      next(new Error('Authentication error'));
    }
  });

  // Socket connection handling
  io.on('connection', (socket) => {
    console.log(`User ${socket.user._id} connected`);
    connectedUsers.set(socket.user._id.toString(), socket.id);
    console.log('Connected users:', connectedUsers); // Log connected users

    // Private message handler
    socket.on('private_message', async ({ recipientId, content, type, fileUrl }) => {
      try {
        const message = new Message({
          sender: socket.user._id,
          recipients: [recipientId],
          content,
          type,
          fileUrl,
        });
        await message.save();
        
        // Send the message to the recipient if they are connected
        const recipientSocketId = connectedUsers.get(recipientId);
        if (recipientSocketId) {
          console.log(`Sending private message to ${recipientId}`);
          io.to(recipientSocketId).emit('private_message', message);
        }
      } catch (err) {
        console.log('Error sending private message:', err);
      }
    });

    // Join room handler for group chat
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.user._id} joined room: ${roomId}`);
    });

    // Group message handler
    socket.on('group_message', async ({ roomId, content, type, fileUrl }) => {
      try {
        const message = new Message({
          sender: socket.user._id,
          room: roomId,
          content,
          type,
          fileUrl,
        });
        await message.save();
        
        // Send the group message to all users in the room
        console.log(`Sending group message to room: ${roomId}`);
        io.to(roomId).emit('group_message', message);
      } catch (err) {
        console.log('Error sending group message:', err);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      connectedUsers.delete(socket.user._id.toString());
      console.log(`User ${socket.user._id} disconnected`);
    });
  });
};
