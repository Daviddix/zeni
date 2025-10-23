const express = require('express');
const { signUserUp } = require('../controllers/users.controller');
const userRouter = express.Router();
// const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
// const { db } = require('../config/firebase');

// // Example route to get all users (admin only)
userRouter.get("/signup", signUserUp);

module.exports = userRouter;