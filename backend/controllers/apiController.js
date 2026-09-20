const db = require('../db/connection');

// Supported HTTP methods
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

// POST /api/projects/:projectId/apis - Create a new API design
function createApiEndpoint(req, res) {
  const projectId = req.params.projectId;
  const { name, method, endpoint, description, request_body, response_body } = req.body;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'API name is required' });
  }

  const upperMethod = (method || '').trim().toUpperCase();
  if (!upperMethod || !ALLOWED_METHODS.includes(upperMethod)) {
    return res.status(400).json({
      error: 'Invalid HTTP method. Allowed methods: ' + ALLOWED_METHODS.join(', '),
    });
  }

  if (!endpoint || !endpoint.trim()) {
    return res.status(400).json({ error: 'Endpoint is required' });
  }

  const sql = `
    INSERT INTO api_endpoints (project_id, name, method, endpoint, description, request_body, response_body)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    projectId,
    name.trim(),
    upperMethod,
    endpoint.trim(),
    (description || '').trim(),
    (request_body || '').trim(),
    (response_body || '').trim(),
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error creating API design:', err.message);
      return res.status(500).json({ error: 'Failed to create API design in database' });
    }

    res.status(201).json({
      message: 'API design created successfully',
      api: {
        id: result.insertId,
        project_id: Number(projectId),
        name: name.trim(),
        method: upperMethod,
        endpoint: endpoint.trim(),
        description: (description || '').trim(),
        request_body: (request_body || '').trim(),
        response_body: (response_body || '').trim(),
      },
    });
  });
}

// GET /api/projects/:projectId/apis - Get all API designs for a project
function getApiEndpoints(req, res) {
  const projectId = req.params.projectId;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  const sql = `
    SELECT id, project_id, name, method, endpoint, description, request_body, response_body, created_at
    FROM api_endpoints
    WHERE project_id = ?
    ORDER BY created_at ASC
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching API designs:', err.message);
      return res.status(500).json({ error: 'Failed to fetch API designs from database' });
    }

    res.json(results);
  });
}

// DELETE /api/apis/:id - Delete an API design
function deleteApiEndpoint(req, res) {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid API design ID' });
  }

  const sql = 'DELETE FROM api_endpoints WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting API design:', err.message);
      return res.status(500).json({ error: 'Failed to delete API design from database' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'API design not found' });
    }

    res.json({ message: 'API design deleted successfully' });
  });
}

module.exports = {
  createApiEndpoint,
  getApiEndpoints,
  deleteApiEndpoint,
};
