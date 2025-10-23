const express = require('express');
const { signUserUp, finishOnboardingProcess, updateUserCurrency } = require('../controllers/users.controller');
const verifySession = require('../middleware/authMiddleware');
const userRouter = express.Router();
// const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
// const { db } = require('../config/firebase');

// userRouter.post("/signup", signUserUp);
userRouter.post("/signup/info", verifySession, finishOnboardingProcess);
userRouter.post("/signup/currency", verifySession, updateUserCurrency);

module.exports = userRouter;