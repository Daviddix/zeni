const express = require('express');
const verifySession = require('../middleware/authMiddleware');
const { createTransactionFromText, createAISessionForUser, getUsersTransactions, getTotalExpensesByPeriod, getAnalysisForTransactions, createTransactionFromImage } = require('../controllers/transactions.controller');
const transactionRouter = express.Router();

transactionRouter.get("/all", verifySession, getUsersTransactions);
transactionRouter.post("/ai", verifySession, createTransactionFromText);
transactionRouter.post("/ai/image", verifySession, createTransactionFromImage);
transactionRouter.post("/ai/session", verifySession, createAISessionForUser);
transactionRouter.post("/ai/analyze", verifySession, getAnalysisForTransactions);
transactionRouter.get("/:period", verifySession, getTotalExpensesByPeriod);

module.exports = transactionRouter;