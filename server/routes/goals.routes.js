const express = require('express');
const goalsRouter = express.Router();
const { auth, db } = require("../config/firebase");
const { getAllGoalsByUser } = require('../controllers/goals.controllers');
const verifySession = require('../middleware/authMiddleware');

goalsRouter.get("/all", verifySession, getAllGoalsByUser);

module.exports = goalsRouter;