const express = require('express');
const { askMentor } = require('../controllers/mentorController');

const router = express.Router();

// POST /api/projects/:projectId/mentor - Ask AI Mentor about the project
router.post('/projects/:projectId/mentor', askMentor);

module.exports = router;
