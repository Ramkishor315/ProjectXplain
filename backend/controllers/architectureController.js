const db = require('../db/connection');

// Allowed architecture component types
const ALLOWED_COMPONENT_TYPES = [
  'Frontend',
  'Backend',
  'Database',
  'API',
  'External Service',
  'Other',
];

// =========================================================
// ARCHITECTURE COMPONENTS
// =========================================================

// POST /api/projects/:projectId/architecture/components - Create a component
function createComponent(req, res) {
  const projectId = req.params.projectId;
  const { name, type, description } = req.body;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Component name is required' });
  }

  const trimmedType = (type || '').trim();
  if (!trimmedType || !ALLOWED_COMPONENT_TYPES.includes(trimmedType)) {
    return res.status(400).json({
      error: 'Invalid component type. Allowed types: ' + ALLOWED_COMPONENT_TYPES.join(', '),
    });
  }

  const sql = `
    INSERT INTO architecture_components (project_id, name, type, description)
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    projectId,
    name.trim(),
    trimmedType,
    (description || '').trim(),
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error creating architecture component:', err.message);
      return res.status(500).json({ error: 'Failed to create architecture component in database' });
    }

    res.status(201).json({
      message: 'Architecture component created successfully',
      component: {
        id: result.insertId,
        project_id: Number(projectId),
        name: name.trim(),
        type: trimmedType,
        description: (description || '').trim(),
      },
    });
  });
}

// GET /api/projects/:projectId/architecture/components - Get all components for a project
function getComponents(req, res) {
  const projectId = req.params.projectId;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  const sql = `
    SELECT id, project_id, name, type, description, created_at
    FROM architecture_components
    WHERE project_id = ?
    ORDER BY created_at ASC
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching architecture components:', err.message);
      return res.status(500).json({ error: 'Failed to fetch architecture components from database' });
    }

    res.json(results);
  });
}

// DELETE /api/architecture/components/:id - Delete an architecture component
function deleteComponent(req, res) {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid component ID' });
  }

  const sql = 'DELETE FROM architecture_components WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting architecture component:', err.message);
      return res.status(500).json({ error: 'Failed to delete architecture component from database' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Architecture component not found' });
    }

    res.json({ message: 'Architecture component deleted successfully' });
  });
}

// =========================================================
// ARCHITECTURE CONNECTIONS
// =========================================================

// POST /api/projects/:projectId/architecture/connections - Create a connection between two components
function createConnection(req, res) {
  const projectId = req.params.projectId;
  const { from_component_id, to_component_id, description } = req.body;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (!from_component_id || isNaN(from_component_id)) {
    return res.status(400).json({ error: 'from_component_id is required and must be a valid number' });
  }

  if (!to_component_id || isNaN(to_component_id)) {
    return res.status(400).json({ error: 'to_component_id is required and must be a valid number' });
  }

  if (Number(from_component_id) === Number(to_component_id)) {
    return res.status(400).json({ error: 'Cannot connect a component to itself' });
  }

  const sql = `
    INSERT INTO architecture_connections (project_id, from_component_id, to_component_id, description)
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    projectId,
    Number(from_component_id),
    Number(to_component_id),
    (description || '').trim(),
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error creating architecture connection:', err.message);
      return res.status(500).json({ error: 'Failed to create architecture connection in database' });
    }

    res.status(201).json({
      message: 'Architecture connection created successfully',
      connection: {
        id: result.insertId,
        project_id: Number(projectId),
        from_component_id: Number(from_component_id),
        to_component_id: Number(to_component_id),
        description: (description || '').trim(),
      },
    });
  });
}

// GET /api/projects/:projectId/architecture/connections - Get all connections for a project
function getConnections(req, res) {
  const projectId = req.params.projectId;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  const sql = `
    SELECT 
      c.id,
      c.project_id,
      c.from_component_id,
      c.to_component_id,
      c.description,
      c.created_at,
      from_comp.name AS from_component_name,
      from_comp.type AS from_component_type,
      to_comp.name AS to_component_name,
      to_comp.type AS to_component_type
    FROM architecture_connections c
    LEFT JOIN architecture_components from_comp ON c.from_component_id = from_comp.id
    LEFT JOIN architecture_components to_comp ON c.to_component_id = to_comp.id
    WHERE c.project_id = ?
    ORDER BY c.created_at ASC
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching architecture connections:', err.message);
      return res.status(500).json({ error: 'Failed to fetch architecture connections from database' });
    }

    res.json(results);
  });
}

// DELETE /api/architecture/connections/:id - Delete an architecture connection
function deleteConnection(req, res) {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid connection ID' });
  }

  const sql = 'DELETE FROM architecture_connections WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting architecture connection:', err.message);
      return res.status(500).json({ error: 'Failed to delete architecture connection from database' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Architecture connection not found' });
    }

    res.json({ message: 'Architecture connection deleted successfully' });
  });
}

module.exports = {
  createComponent,
  getComponents,
  deleteComponent,
  createConnection,
  getConnections,
  deleteConnection,
  ALLOWED_COMPONENT_TYPES,
};
