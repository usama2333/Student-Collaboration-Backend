const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Enable CORS for all routes and origins
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST','PUT', 'PATCH','DELETE'],        
    credentials: true                
  }));

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes);
// Routes
app.use("/api/users", userRoutes);

app.use('/api/chat', chatRoutes);

app.use('/api/messages', messageRoutes);



module.exports = app;
