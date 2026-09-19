const express = require('express');
const {
  createProject,
  getAllProjects,
  getProjectById,
} = require('../controllers/projectController');

const router = express.Router();

// Define project routes
router.post('/projects', createProject);
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);

module.exports = router;
