const express = require('express');
const {
  getSubjects,
  getAllConcepts,
  getProjectConcepts,
  addProjectConcept,
  removeProjectConcept,
} = require('../controllers/cseConceptsController');

const router = express.Router();

// General CSE Knowledge Base routes
router.get('/cse-concepts/subjects', getSubjects);
router.get('/cse-concepts', getAllConcepts);

// Project-specific CSE Concept routes
router.get('/projects/:projectId/cse-concepts', getProjectConcepts);
router.post('/projects/:projectId/cse-concepts', addProjectConcept);
router.delete('/project-concepts/:id', removeProjectConcept);

module.exports = router;
