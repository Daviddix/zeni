const express = require('express');
const verifySession = require('../middleware/authMiddleware');
const { createTransactionFromText } = require('../controllers/transactions.controller');
const transactionRouter = express.Router();

// transactionRouter.get("/all", verifySession, getUsersTransactions);
transactionRouter.post("/ai", verifySession, createTransactionFromText);

module.exports = transactionRouter;