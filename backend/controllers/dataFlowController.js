const db = require('../db/connection');

// Allowed flow methods
const ALLOWED_FLOW_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'SQL',
  'JSON',
  'INTERNAL',
  'OTHER',
];

// POST /api/projects/:projectId/data-flow - Create a new data-flow step
function createDataFlowStep(req, res) {
  const projectId = req.params.projectId;
  const {
    step_number,
    from_component_id,
    to_component_id,
    api_id,
    action,
    method,
    description,
  } = req.body;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  const parsedStepNumber = parseInt(step_number, 10);
  if (isNaN(parsedStepNumber) || parsedStepNumber <= 0) {
    return res.status(400).json({ error: 'Step number must be a positive number' });
  }

  if (!from_component_id || isNaN(from_component_id)) {
    return res.status(400).json({ error: 'from_component_id is required and must be a valid number' });
  }

  if (!to_component_id || isNaN(to_component_id)) {
    return res.status(400).json({ error: 'to_component_id is required and must be a valid number' });
  }

  if (Number(from_component_id) === Number(to_component_id)) {
    return res.status(400).json({ error: 'From Component and To Component cannot be the same' });
  }

  if (!action || !action.trim()) {
    return res.status(400).json({ error: 'Action is required' });
  }

  const trimmedMethod = (method || 'INTERNAL').trim().toUpperCase();
  const validMethod = ALLOWED_FLOW_METHODS.includes(trimmedMethod) ? trimmedMethod : 'OTHER';

  // api_id is optional (can be null or number)
  let parsedApiId = null;
  if (api_id && !isNaN(api_id) && Number(api_id) > 0) {
    parsedApiId = Number(api_id);
  }

  const sql = `
    INSERT INTO data_flow_steps (
      project_id,
      step_number,
      from_component_id,
      to_component_id,
      api_id,
      action,
      method,
      description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    Number(projectId),
    parsedStepNumber,
    Number(from_component_id),
    Number(to_component_id),
    parsedApiId,
    action.trim(),
    validMethod,
    (description || '').trim(),
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error creating data flow step:', err.message);
      return res.status(500).json({ error: 'Failed to create data flow step in database' });
    }

    res.status(201).json({
      message: 'Data flow step created successfully',
      step: {
        id: result.insertId,
        project_id: Number(projectId),
        step_number: parsedStepNumber,
        from_component_id: Number(from_component_id),
        to_component_id: Number(to_component_id),
        api_id: parsedApiId,
        action: action.trim(),
        method: validMethod,
        description: (description || '').trim(),
      },
    });
  });
}

// GET /api/projects/:projectId/data-flow - Get all data-flow steps for a project ordered by step_number
function getDataFlowSteps(req, res) {
  const projectId = req.params.projectId;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  const sql = `
    SELECT 
      s.id,
      s.project_id,
      s.step_number,
      s.from_component_id,
      s.to_component_id,
      s.api_id,
      s.action,
      s.method,
      s.description,
      s.created_at,
      fc.name AS from_component_name,
      fc.type AS from_component_type,
      tc.name AS to_component_name,
      tc.type AS to_component_type,
      a.name AS api_name,
      a.method AS api_method,
      a.endpoint AS api_endpoint
    FROM data_flow_steps s
    LEFT JOIN architecture_components fc ON s.from_component_id = fc.id
    LEFT JOIN architecture_components tc ON s.to_component_id = tc.id
    LEFT JOIN api_endpoints a ON s.api_id = a.id
    WHERE s.project_id = ?
    ORDER BY s.step_number ASC, s.created_at ASC
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching data flow steps:', err.message);
      return res.status(500).json({ error: 'Failed to fetch data flow steps from database' });
    }

    res.json(results);
  });
}

// DELETE /api/data-flow/:id - Delete a data-flow step
function deleteDataFlowStep(req, res) {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid data flow step ID' });
  }

  const sql = 'DELETE FROM data_flow_steps WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data flow step:', err.message);
      return res.status(500).json({ error: 'Failed to delete data flow step from database' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data flow step not found' });
    }

    res.json({ message: 'Data flow step deleted successfully' });
  });
}

module.exports = {
  createDataFlowStep,
  getDataFlowSteps,
  deleteDataFlowStep,
  ALLOWED_FLOW_METHODS,
};
