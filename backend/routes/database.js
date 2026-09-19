const express = require('express');
const {
  createEntity,
  getEntities,
  deleteEntity,
  createAttribute,
  getAttributes,
  deleteAttribute,
  createRelationship,
  getRelationships,
  deleteRelationship,
} = require('../controllers/databaseController');

const router = express.Router();

// Entity routes
router.post('/projects/:projectId/entities', createEntity);
router.get('/projects/:projectId/entities', getEntities);
router.delete('/entities/:id', deleteEntity);

// Attribute routes
router.post('/entities/:entityId/attributes', createAttribute);
router.get('/entities/:entityId/attributes', getAttributes);
router.delete('/attributes/:id', deleteAttribute);

// Relationship routes
router.post('/projects/:projectId/relationships', createRelationship);
router.get('/projects/:projectId/relationships', getRelationships);
router.delete('/relationships/:id', deleteRelationship);

module.exports = router;
