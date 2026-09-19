const db = require('../db/connection');

// POST /api/requirements/:requirementId/user-stories - Create a new user story
function createUserStory(req, res) {
  const requirementId = req.params.requirementId;
  const { title, description } = req.body;

  // Validate requirementId
  if (!requirementId || isNaN(requirementId)) {
    return res.status(400).json({
      error: 'Invalid requirement ID',
    });
  }

  // Validate title and description
  if (!title || !description || !title.trim() || !description.trim()) {
    return res.status(400).json({
      error: 'Title and description are required',
    });
  }

  const sql = 'INSERT INTO user_stories (requirement_id, title, description) VALUES (?, ?, ?)';

  db.query(sql, [requirementId, title.trim(), description.trim()], (err, result) => {
    if (err) {
      console.error('Error creating user story:', err.message);
      return res.status(500).json({
        error: 'Failed to create user story in database',
      });
    }

    res.status(201).json({
      message: 'User story created successfully',
      userStory: {
        id: result.insertId,
        requirement_id: Number(requirementId),
        title: title.trim(),
        description: description.trim(),
      },
    });
  });
}

// GET /api/requirements/:requirementId/user-stories - Get all user stories for a requirement
function getUserStories(req, res) {
  const requirementId = req.params.requirementId;

  if (!requirementId || isNaN(requirementId)) {
    return res.status(400).json({
      error: 'Invalid requirement ID',
    });
  }

  const sql = `
    SELECT id, requirement_id, title, description, created_at
    FROM user_stories
    WHERE requirement_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [requirementId], (err, results) => {
    if (err) {
      console.error('Error fetching user stories:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch user stories from database',
      });
    }

    res.json(results);
  });
}

// DELETE /api/user-stories/:id - Delete a user story by id
function deleteUserStory(req, res) {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid user story ID',
    });
  }

  const sql = 'DELETE FROM user_stories WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user story:', err.message);
      return res.status(500).json({
        error: 'Failed to delete user story from database',
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'User story not found',
      });
    }

    res.json({
      message: 'User story deleted successfully',
    });
  });
}

module.exports = {
  createUserStory,
  getUserStories,
  deleteUserStory,
};
