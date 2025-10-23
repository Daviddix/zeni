const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users.routes.js');
const sessionRoutes = require('./routes/auth.routes.js');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"

// Middleware
app.use(cors({
  origin : FRONTEND_URL,
  credentials : true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use("/api/session-logic", sessionRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
