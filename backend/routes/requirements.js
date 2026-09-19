const express = require('express');
const {
  createRequirement,
  getRequirements,
  deleteRequirement,
} = require('../controllers/requirementController');

const router = express.Router();

// Define requirement routes
router.post('/projects/:projectId/requirements', createRequirement);
router.get('/projects/:projectId/requirements', getRequirements);
router.delete('/requirements/:id', deleteRequirement);

module.exports = router;
