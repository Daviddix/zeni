const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users.routes.js');
const transactionRoutes = require('./routes/transactions.routes.js');
const sessionRoutes = require('./routes/auth.routes.js');
const cookieParser = require('cookie-parser');
const goalsRoutes = require('./routes/goals.routes.js');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = ["http://localhost:3000", "https://zeni-psi.vercel.app"]

// Middleware
app.use(cors({
  origin : allowedOrigins,
  credentials : true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use("/api/session-logic", sessionRoutes);
app.use("/api/goals", goalsRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
