const express = require('express');
const {
  createDataFlowStep,
  getDataFlowSteps,
  deleteDataFlowStep,
} = require('../controllers/dataFlowController');

const router = express.Router();

router.post('/projects/:projectId/data-flow', createDataFlowStep);
router.get('/projects/:projectId/data-flow', getDataFlowSteps);
router.delete('/data-flow/:id', deleteDataFlowStep);

module.exports = router;
