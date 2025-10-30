const express = require('express');
const verifySession = require('../middleware/authMiddleware');
const { createTransactionFromText, createAISessionForUser, getUsersTransactions } = require('../controllers/transactions.controller');
const transactionRouter = express.Router();

transactionRouter.get("/all", verifySession, getUsersTransactions);
transactionRouter.post("/ai", verifySession, createTransactionFromText);
transactionRouter.post("/ai/session", verifySession, createAISessionForUser);

module.exports = transactionRouter;