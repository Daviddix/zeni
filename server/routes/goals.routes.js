const express = require('express');
const goalsRouter = express.Router();
const { getAllGoalsByUser, addGoalToFirestore, createAISessionForUser } = require('../controllers/goals.controllers');
const verifySession = require('../middleware/authMiddleware');

goalsRouter.get("/all", verifySession, getAllGoalsByUser);
goalsRouter.post("/ai/session", verifySession, createAISessionForUser);
goalsRouter.post("/ai/add", verifySession, addGoalToFirestore);

module.exports = goalsRouter;