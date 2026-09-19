const db = require('../db/connection');

// POST /api/projects - Create a new project
function createProject(req, res) {
  const { name, idea } = req.body;

  // Validation: check if name or idea is missing
  if (!name || !idea || !name.trim() || !idea.trim()) {
    return res.status(400).json({
      error: 'Project name and idea are required',
    });
  }

  const sql = 'INSERT INTO projects (name, idea) VALUES (?, ?)';

  db.query(sql, [name.trim(), idea.trim()], (err, result) => {
    if (err) {
      console.error('Error inserting project into database:', err.message);
      return res.status(500).json({
        error: 'Failed to create project in database',
      });
    }

    // Return the newly created project with its generated id
    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: result.insertId,
        name: name.trim(),
        idea: idea.trim(),
      },
    });
  });
}

// GET /api/projects - Get all projects
function getAllProjects(req, res) {
  const sql = 'SELECT id, name, idea, created_at FROM projects ORDER BY created_at DESC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching projects from database:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch projects from database',
      });
    }

    res.json(results);
  });
}

// GET /api/projects/:id - Get single project by id
function getProjectById(req, res) {
  const projectId = req.params.id;
  const sql = 'SELECT id, name, idea, created_at FROM projects WHERE id = ?';

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching project by id:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch project from database',
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Project not found',
      });
    }

    res.json(results[0]);
  });
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
};
