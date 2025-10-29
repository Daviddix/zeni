const express = require('express');
const verifySession = require('../middleware/authMiddleware');
const transactionRouter = express.Router();

// transactionRouter.get("/all", verifySession, getUsersTransactions);
transactionRouter.post("/ai", verifySession, createTransactionFromText);

module.exports = transactionRouter;