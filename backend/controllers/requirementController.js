const db = require('../db/connection');

// POST /api/projects/:projectId/requirements - Create a new requirement
function createRequirement(req, res) {
  const projectId = req.params.projectId;
  const { title, description, priority } = req.body;

  // Validation: check for missing/empty fields
  if (!title || !description || !priority || !title.trim() || !description.trim() || !priority.trim()) {
    return res.status(400).json({
      error: 'Title, description, and priority are required',
    });
  }

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({
      error: 'Invalid project ID',
    });
  }

  const sql = 'INSERT INTO requirements (project_id, title, description, priority) VALUES (?, ?, ?, ?)';

  db.query(sql, [projectId, title.trim(), description.trim(), priority.trim()], (err, result) => {
    if (err) {
      console.error('Error creating requirement:', err.message);
      return res.status(500).json({
        error: 'Failed to create requirement in database',
      });
    }

    res.status(201).json({
      message: 'Requirement created successfully',
      requirement: {
        id: result.insertId,
        project_id: Number(projectId),
        title: title.trim(),
        description: description.trim(),
        priority: priority.trim(),
      },
    });
  });
}

// GET /api/projects/:projectId/requirements - Get all requirements for a project
function getRequirements(req, res) {
  const projectId = req.params.projectId;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({
      error: 'Invalid project ID',
    });
  }

  const sql = `
    SELECT id, project_id, title, description, priority, created_at
    FROM requirements
    WHERE project_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching requirements:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch requirements from database',
      });
    }

    res.json(results);
  });
}

// DELETE /api/requirements/:id - Delete a single requirement
function deleteRequirement(req, res) {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid requirement ID',
    });
  }

  const sql = 'DELETE FROM requirements WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting requirement:', err.message);
      return res.status(500).json({
        error: 'Failed to delete requirement from database',
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Requirement not found',
      });
    }

    res.json({
      message: 'Requirement deleted successfully',
    });
  });
}

module.exports = {
  createRequirement,
  getRequirements,
  deleteRequirement,
};
