const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Enable CORS for all routes and origins
app.use(cors({
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST'],        
    credentials: true                
  }));

app.use("/api/auth", authRoutes);

module.exports = app;
