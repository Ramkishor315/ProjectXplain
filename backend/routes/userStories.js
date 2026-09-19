const express = require('express');
const {
  createUserStory,
  getUserStories,
  deleteUserStory,
} = require('../controllers/userStoryController');

const router = express.Router();

// Define user story routes
router.post('/requirements/:requirementId/user-stories', createUserStory);
router.get('/requirements/:requirementId/user-stories', getUserStories);
router.delete('/user-stories/:id', deleteUserStory);

module.exports = router;
