const express = require('express');
const {
  createApiEndpoint,
  getApiEndpoints,
  deleteApiEndpoint,
} = require('../controllers/apiController');

const router = express.Router();

// Define API design routes
router.post('/projects/:projectId/apis', createApiEndpoint);
router.get('/projects/:projectId/apis', getApiEndpoints);
router.delete('/apis/:id', deleteApiEndpoint);

module.exports = router;
