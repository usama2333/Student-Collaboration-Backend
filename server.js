const app = require('./app');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const chatSocket = require('./sockets/chatSocket');

dotenv.config();
const PORT = process.env.PORT || 5000;

// Create HTTP server (required for socket.io)
const server = http.createServer(app);

// Attach Socket.IO to HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Setup socket logic
chatSocket(io);

// ✅ FIX: Listen with server instead of app
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
