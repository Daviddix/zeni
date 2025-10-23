const express = require('express');
const { signUserUp, finishOnboardingProcess, updateUserCurrency } = require('../controllers/users.controller');
const userRouter = express.Router();
// const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
// const { db } = require('../config/firebase');

userRouter.post("/signup", signUserUp);
userRouter.post("/signup/info", finishOnboardingProcess);
userRouter.post("/signup/currency", updateUserCurrency);

module.exports = userRouter;