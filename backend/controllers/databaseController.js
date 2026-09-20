const db = require('../db/connection');

// Allowed values for validation
const ALLOWED_DATA_TYPES = ['INT', 'VARCHAR', 'TEXT', 'DATE', 'BOOLEAN', 'DECIMAL'];
const ALLOWED_KEY_TYPES = ['None', 'Primary Key', 'Foreign Key'];
const ALLOWED_RELATIONSHIP_TYPES = ['One-to-One', 'One-to-Many', 'Many-to-Many'];

// =========================================================
// ENTITY FUNCTIONS
// =========================================================

// POST /api/projects/:projectId/entities
function createEntity(req, res) {
  const projectId = req.params.projectId;
  const { name, description } = req.body;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Entity name is required' });
  }

  const sql = `
    INSERT INTO database_entities (project_id, name, description)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [projectId, name.trim(), (description || '').trim()], (err, result) => {
    if (err) {
      console.error('Error creating entity:', err.message);
      return res.status(500).json({ error: 'Failed to create entity in database' });
    }

    res.status(201).json({
      message: 'Entity created successfully',
      entity: {
        id: result.insertId,
        project_id: Number(projectId),
        name: name.trim(),
        description: (description || '').trim(),
      },
    });
  });
}

// GET /api/projects/:projectId/entities
function getEntities(req, res) {
  const projectId = req.params.projectId;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  const sql = `
    SELECT id, project_id, name, description, created_at
    FROM database_entities
    WHERE project_id = ?
    ORDER BY created_at ASC
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching entities:', err.message);
      return res.status(500).json({ error: 'Failed to fetch entities from database' });
    }

    res.json(results);
  });
}

// DELETE /api/entities/:id
function deleteEntity(req, res) {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid entity ID' });
  }

  db.query('DELETE FROM database_entities WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting entity:', err.message);
      return res.status(500).json({ error: 'Failed to delete entity from database' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    res.json({ message: 'Entity deleted successfully' });
  });
}

// =========================================================
// ATTRIBUTE FUNCTIONS
// =========================================================

// POST /api/entities/:entityId/attributes
function createAttribute(req, res) {
  const entityId = req.params.entityId;
  const { name, data_type, key_type } = req.body;

  if (!entityId || isNaN(entityId)) {
    return res.status(400).json({ error: 'Invalid entity ID' });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Attribute name is required' });
  }

  if (!data_type || !ALLOWED_DATA_TYPES.includes(data_type)) {
    return res.status(400).json({ error: 'Invalid data type. Allowed: ' + ALLOWED_DATA_TYPES.join(', ') });
  }

  const resolvedKeyType = key_type || 'None';
  if (!ALLOWED_KEY_TYPES.includes(resolvedKeyType)) {
    return res.status(400).json({ error: 'Invalid key type. Allowed: ' + ALLOWED_KEY_TYPES.join(', ') });
  }

  const sql = `
    INSERT INTO entity_attributes (entity_id, name, data_type, key_type)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [entityId, name.trim(), data_type, resolvedKeyType], (err, result) => {
    if (err) {
      console.error('Error creating attribute:', err.message);
      return res.status(500).json({ error: 'Failed to create attribute in database' });
    }

    res.status(201).json({
      message: 'Attribute created successfully',
      attribute: {
        id: result.insertId,
        entity_id: Number(entityId),
        name: name.trim(),
        data_type,
        key_type: resolvedKeyType,
      },
    });
  });
}

// GET /api/entities/:entityId/attributes
function getAttributes(req, res) {
  const entityId = req.params.entityId;

  if (!entityId || isNaN(entityId)) {
    return res.status(400).json({ error: 'Invalid entity ID' });
  }

  const sql = `
    SELECT id, entity_id, name, data_type, key_type, created_at
    FROM entity_attributes
    WHERE entity_id = ?
    ORDER BY created_at ASC
  `;

  db.query(sql, [entityId], (err, results) => {
    if (err) {
      console.error('Error fetching attributes:', err.message);
      return res.status(500).json({ error: 'Failed to fetch attributes from database' });
    }

    res.json(results);
  });
}

// DELETE /api/attributes/:id
function deleteAttribute(req, res) {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid attribute ID' });
  }

  db.query('DELETE FROM entity_attributes WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting attribute:', err.message);
      return res.status(500).json({ error: 'Failed to delete attribute from database' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Attribute not found' });
    }

    res.json({ message: 'Attribute deleted successfully' });
  });
}

// =========================================================
// RELATIONSHIP FUNCTIONS
// =========================================================

// POST /api/projects/:projectId/relationships
function createRelationship(req, res) {
  const projectId = req.params.projectId;
  const { from_entity_id, to_entity_id, relationship_type } = req.body;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (!from_entity_id || isNaN(from_entity_id)) {
    return res.status(400).json({ error: 'from_entity_id is required and must be valid' });
  }

  if (!to_entity_id || isNaN(to_entity_id)) {
    return res.status(400).json({ error: 'to_entity_id is required and must be valid' });
  }

  if (!relationship_type || !ALLOWED_RELATIONSHIP_TYPES.includes(relationship_type)) {
    return res.status(400).json({ error: 'Invalid relationship type. Allowed: ' + ALLOWED_RELATIONSHIP_TYPES.join(', ') });
  }

  const sql = `
    INSERT INTO entity_relationships (project_id, from_entity_id, to_entity_id, relationship_type)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [projectId, from_entity_id, to_entity_id, relationship_type], (err, result) => {
    if (err) {
      console.error('Error creating relationship:', err.message);
      return res.status(500).json({ error: 'Failed to create relationship in database' });
    }

    res.status(201).json({
      message: 'Relationship created successfully',
      relationship: {
        id: result.insertId,
        project_id: Number(projectId),
        from_entity_id: Number(from_entity_id),
        to_entity_id: Number(to_entity_id),
        relationship_type,
      },
    });
  });
}

// GET /api/projects/:projectId/relationships
function getRelationships(req, res) {
  const projectId = req.params.projectId;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  // Left join to get entity names for display even if referenced row differs
  const sql = `
    SELECT
      er.id,
      er.project_id,
      er.from_entity_id,
      er.to_entity_id,
      er.relationship_type,
      er.created_at,
      COALESCE(fe.name, 'Unknown Entity') AS from_entity_name,
      COALESCE(te.name, 'Unknown Entity') AS to_entity_name
    FROM entity_relationships er
    LEFT JOIN database_entities fe ON er.from_entity_id = fe.id
    LEFT JOIN database_entities te ON er.to_entity_id = te.id
    WHERE er.project_id = ?
    ORDER BY er.created_at ASC
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) {
      console.error('Error fetching relationships:', err.message);
      return res.status(500).json({ error: 'Failed to fetch relationships from database' });
    }

    res.json(results);
  });
}

// DELETE /api/relationships/:id
function deleteRelationship(req, res) {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid relationship ID' });
  }

  db.query('DELETE FROM entity_relationships WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting relationship:', err.message);
      return res.status(500).json({ error: 'Failed to delete relationship from database' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relationship not found' });
    }

    res.json({ message: 'Relationship deleted successfully' });
  });
}

module.exports = {
  createEntity,
  getEntities,
  deleteEntity,
  createAttribute,
  getAttributes,
  deleteAttribute,
  createRelationship,
  getRelationships,
  deleteRelationship,
};
