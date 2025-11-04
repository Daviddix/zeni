const express = require('express');
const goalsRouter = express.Router();
const { getAllGoalsByUser, addGoalToFirestore, createAISessionForUser, getAnalysisForGoal, deleteGoal } = require('../controllers/goals.controllers');
const verifySession = require('../middleware/authMiddleware');

goalsRouter.get("/all", verifySession, getAllGoalsByUser);
goalsRouter.post("/ai/session", verifySession, createAISessionForUser);
goalsRouter.post("/ai/add", verifySession, addGoalToFirestore);
goalsRouter.post("/ai/analysis", verifySession, getAnalysisForGoal);
goalsRouter.delete("/goal/:goalId", verifySession, deleteGoal);

module.exports = goalsRouter;