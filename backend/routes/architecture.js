const express = require('express');
const {
  createComponent,
  getComponents,
  deleteComponent,
  createConnection,
  getConnections,
  deleteConnection,
} = require('../controllers/architectureController');

const router = express.Router();

// Architecture Components routes
router.post('/projects/:projectId/architecture/components', createComponent);
router.get('/projects/:projectId/architecture/components', getComponents);
router.delete('/architecture/components/:id', deleteComponent);

// Architecture Connections routes
router.post('/projects/:projectId/architecture/connections', createConnection);
router.get('/projects/:projectId/architecture/connections', getConnections);
router.delete('/architecture/connections/:id', deleteConnection);

module.exports = router;
