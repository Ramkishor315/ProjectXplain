const db = require('../db/connection');

// GET /api/cse-concepts/subjects - Retrieve all CSE subjects
function getSubjects(req, res) {
  const query = 'SELECT id, name FROM cse_subjects ORDER BY id ASC';
  db.query(query, (err, rows) => {
    if (err) {
      console.error('Error fetching CSE subjects:', err.message);
      return res.status(500).json({ error: 'Failed to fetch CSE subjects' });
    }
    return res.status(200).json(rows || []);
  });
}

// GET /api/cse-concepts - Retrieve all predefined CSE concepts
function getAllConcepts(req, res) {
  const subjectId = req.query.subject_id;
  let query = `
    SELECT c.id, c.subject_id, s.name AS subject_name, c.name, c.explanation, 
           c.project_relevance, c.project_usage, c.what_to_learn, c.created_at
    FROM cse_concepts c
    JOIN cse_subjects s ON c.subject_id = s.id
  `;
  const params = [];

  if (subjectId && !isNaN(subjectId)) {
    query += ' WHERE c.subject_id = ?';
    params.push(Number(subjectId));
  }

  query += ' ORDER BY s.id ASC, c.id ASC';

  db.query(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching CSE concepts:', err.message);
      return res.status(500).json({ error: 'Failed to fetch CSE concepts' });
    }
    return res.status(200).json(rows || []);
  });
}

// Helper to gather actual live project data (tables, APIs, components, flow steps)
function getProjectLiveEvidence(projectId, callback) {
  const sqlEntities = 'SELECT id, name FROM database_entities WHERE project_id = ? ORDER BY id ASC';
  const sqlApis = 'SELECT id, method, endpoint, name FROM api_endpoints WHERE project_id = ? ORDER BY id ASC';
  const sqlComps = 'SELECT id, name, type FROM architecture_components WHERE project_id = ? ORDER BY id ASC';
  const sqlFlow = 'SELECT count(*) AS count FROM data_flow_steps WHERE project_id = ?';

  db.query(sqlEntities, [projectId], (err1, entities) => {
    if (err1) return callback(err1);
    db.query(sqlApis, [projectId], (err2, apis) => {
      if (err2) return callback(err2);
      db.query(sqlComps, [projectId], (err3, comps) => {
        if (err3) return callback(err3);
        db.query(sqlFlow, [projectId], (err4, flowRes) => {
          if (err4) return callback(err4);
          callback(null, {
            entities: entities || [],
            apis: apis || [],
            components: comps || [],
            flowCount: (flowRes && flowRes[0] && flowRes[0].count) || 0,
          });
        });
      });
    });
  });
}

// Helper to assign live project evidence to a concept based on its subject/name
function attachProjectEvidence(concept, evidence) {
  const subject = concept.subject_name;
  const name = concept.name;

  if (subject === 'DBMS') {
    return {
      related_feature: 'Database Design',
      references: evidence.entities.length > 0
        ? evidence.entities.map((e) => e.name)
        : ['Database entities not yet created'],
    };
  }

  if (subject === 'Computer Networks') {
    return {
      related_feature: 'API Design',
      references: evidence.apis.length > 0
        ? evidence.apis.map((a) => `${a.method} ${a.endpoint}`)
        : ['REST API endpoints not yet created'],
    };
  }

  if (subject === 'System Design') {
    if (name === 'Data Flow') {
      return {
        related_feature: 'Request / Data Flow',
        references: evidence.flowCount > 0
          ? [`${evidence.flowCount} sequential request/data flow steps configured`]
          : ['Request/Data flow steps not yet configured'],
      };
    }
    return {
      related_feature: 'System Architecture',
      references: evidence.components.length > 0
        ? evidence.components.map((c) => `${c.name} (${c.type})`)
        : ['Architecture components not yet created'],
    };
  }

  if (subject === 'OOPS') {
    const frontends = evidence.components.filter(
      (c) => c.type === 'Frontend' || c.name.toLowerCase().includes('frontend') || c.name.toLowerCase().includes('react')
    );
    return {
      related_feature: 'System Architecture & Frontend',
      references: frontends.length > 0
        ? frontends.map((c) => `${c.name} (${c.type})`)
        : evidence.components.length > 0
        ? evidence.components.map((c) => c.name)
        : ['Frontend components not yet defined'],
    };
  }

  if (subject === 'Operating Systems') {
    const backends = evidence.components.filter(
      (c) => c.type === 'Backend' || c.name.toLowerCase().includes('backend') || c.name.toLowerCase().includes('node')
    );
    return {
      related_feature: 'System Architecture & Runtime',
      references: backends.length > 0
        ? backends.map((c) => `${c.name} (${c.type})`)
        : evidence.components.length > 0
        ? evidence.components.map((c) => c.name)
        : ['Backend runtime processes not yet defined'],
    };
  }

  return {
    related_feature: 'Project Implementation',
    references: ['Core CSE Concept'],
  };
}

// GET /api/projects/:projectId/cse-concepts - Retrieve concepts mapped to project (with auto-detection)
function getProjectConcepts(req, res) {
  const projectId = req.params.projectId;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  const parsedProjectId = Number(projectId);

  // Check if project exists
  db.query('SELECT id, name FROM projects WHERE id = ?', [parsedProjectId], (err, projects) => {
    if (err) {
      console.error('Error verifying project:', err.message);
      return res.status(500).json({ error: 'Failed to verify project' });
    }
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check existing project_concepts
    const selectQuery = `
      SELECT pc.id AS mapping_id, pc.project_id, pc.concept_id, pc.reason, pc.created_at,
             c.name, c.explanation, c.project_relevance, c.project_usage, c.what_to_learn,
             s.id AS subject_id, s.name AS subject_name
      FROM project_concepts pc
      JOIN cse_concepts c ON pc.concept_id = c.id
      JOIN cse_subjects s ON c.subject_id = s.id
      WHERE pc.project_id = ?
      ORDER BY s.id ASC, c.id ASC
    `;

    db.query(selectQuery, [parsedProjectId], (err, mappedRows) => {
      if (err) {
        console.error('Error fetching project concepts:', err.message);
        return res.status(500).json({ error: 'Failed to fetch project concepts' });
      }

      // If concepts are already mapped, gather live project evidence and return
      if (mappedRows && mappedRows.length > 0) {
        getProjectLiveEvidence(parsedProjectId, (errEvidence, evidence) => {
          if (errEvidence) {
            console.error('Error gathering live evidence:', errEvidence.message);
            // Return rows even if evidence gathering fails
            return res.status(200).json(mappedRows);
          }

          const enriched = mappedRows.map((row) => ({
            ...row,
            project_evidence: attachProjectEvidence(row, evidence),
          }));
          return res.status(200).json(enriched);
        });
        return;
      }

      // No concepts mapped yet -> perform deterministic initial mapping based on Features 5-8
      getProjectLiveEvidence(parsedProjectId, (errEvidence, evidence) => {
        if (errEvidence) {
          console.error('Error reading project features for auto-mapping:', errEvidence.message);
          return res.status(200).json([]);
        }

        const hasEntities = evidence.entities.length > 0;
        const hasApis = evidence.apis.length > 0;
        const hasComps = evidence.components.length > 0;
        const hasFlow = evidence.flowCount > 0;

        // If the project has NO features defined yet, return empty list
        if (!hasEntities && !hasApis && !hasComps && !hasFlow) {
          return res.status(200).json([]);
        }

        // Fetch all available concepts to match by name
        db.query('SELECT c.id, c.name, s.name AS subject_name FROM cse_concepts c JOIN cse_subjects s ON c.subject_id = s.id', (errAll, allConcepts) => {
          if (errAll || !allConcepts) {
            console.error('Error fetching all concepts for auto-mapping:', errAll ? errAll.message : 'No concepts');
            return res.status(200).json([]);
          }

          const conceptMap = {};
          allConcepts.forEach((c) => {
            conceptMap[c.name] = c.id;
          });

          const autoMappings = [];

          // 1. If project has database entities -> Map DBMS concepts
          if (hasEntities) {
            const entityList = evidence.entities.map((e) => e.name).slice(0, 4).join(', ');
            const reason = `Project defines database tables (${entityList})`;
            ['Relational Database', 'Primary Key', 'Foreign Key', 'Database Relationships', 'SQL'].forEach((name) => {
              if (conceptMap[name]) autoMappings.push([parsedProjectId, conceptMap[name], reason]);
            });
          }

          // 2. If project has API designs -> Map Computer Networks concepts
          if (hasApis) {
            const apiList = evidence.apis.map((a) => `${a.method} ${a.endpoint}`).slice(0, 3).join(', ');
            const reason = `Project exposes REST APIs (${apiList})`;
            ['HTTP', 'HTTP Methods', 'REST API', 'Client-Server Architecture'].forEach((name) => {
              if (conceptMap[name] && !autoMappings.some((m) => m[1] === conceptMap[name])) {
                autoMappings.push([parsedProjectId, conceptMap[name], reason]);
              }
            });
          }

          // 3. If project has architecture components -> Map System Design & OOPS
          if (hasComps) {
            const compList = evidence.components.map((c) => c.name).slice(0, 3).join(', ');
            const archReason = `Project defines system architecture (${compList})`;
            ['Client-Server Architecture', 'Layered Architecture', 'Component-Based Design'].forEach((name) => {
              if (conceptMap[name] && !autoMappings.some((m) => m[1] === conceptMap[name])) {
                autoMappings.push([parsedProjectId, conceptMap[name], archReason]);
              }
            });

            const oopsReason = `Project utilizes modular UI components and services`;
            ['Encapsulation', 'Abstraction', 'Modularity'].forEach((name) => {
              if (conceptMap[name] && !autoMappings.some((m) => m[1] === conceptMap[name])) {
                autoMappings.push([parsedProjectId, conceptMap[name], oopsReason]);
              }
            });

            const osReason = `Node.js and web runtime process execution with concurrent client requests`;
            ['Process', 'Concurrency'].forEach((name) => {
              if (conceptMap[name] && !autoMappings.some((m) => m[1] === conceptMap[name])) {
                autoMappings.push([parsedProjectId, conceptMap[name], osReason]);
              }
            });
          }

          // 4. If project has data-flow steps -> Map Data Flow
          if (hasFlow) {
            const flowReason = `Project configures ${evidence.flowCount} sequential request/data flow steps`;
            if (conceptMap['Data Flow'] && !autoMappings.some((m) => m[1] === conceptMap['Data Flow'])) {
              autoMappings.push([parsedProjectId, conceptMap['Data Flow'], flowReason]);
            }
          }

          if (autoMappings.length === 0) {
            return res.status(200).json([]);
          }

          // Insert deterministic auto-mappings
          db.query(
            'INSERT IGNORE INTO project_concepts (project_id, concept_id, reason) VALUES ?',
            [autoMappings],
            (errInsert) => {
              if (errInsert) {
                console.error('Error inserting auto-mappings:', errInsert.message);
                return res.status(500).json({ error: 'Failed to auto-map concepts' });
              }

              // Re-query to return mapped rows with live evidence
              db.query(selectQuery, [parsedProjectId], (errReload, freshRows) => {
                if (errReload) {
                  return res.status(500).json({ error: 'Failed to reload mapped concepts' });
                }

                const enriched = (freshRows || []).map((row) => ({
                  ...row,
                  project_evidence: attachProjectEvidence(row, evidence),
                }));
                return res.status(200).json(enriched);
              });
            }
          );
        });
      });
    });
  });
}

// POST /api/projects/:projectId/cse-concepts - Manually associate an existing concept with a project
function addProjectConcept(req, res) {
  const projectId = req.params.projectId;
  const { concept_id, reason } = req.body;

  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (!concept_id || isNaN(concept_id)) {
    return res.status(400).json({ error: 'Valid concept_id is required' });
  }

  const parsedProjectId = Number(projectId);
  const parsedConceptId = Number(concept_id);
  const trimmedReason = (reason || 'Manually associated by student').trim();

  // Verify project exists
  db.query('SELECT id FROM projects WHERE id = ?', [parsedProjectId], (err, pRows) => {
    if (err) return res.status(500).json({ error: 'Database error verifying project' });
    if (!pRows || pRows.length === 0) return res.status(404).json({ error: 'Project not found' });

    // Verify concept exists
    db.query('SELECT id FROM cse_concepts WHERE id = ?', [parsedConceptId], (err, cRows) => {
      if (err) return res.status(500).json({ error: 'Database error verifying concept' });
      if (!cRows || cRows.length === 0) return res.status(404).json({ error: 'CSE Concept not found' });

      // Check if already mapped
      db.query(
        'SELECT id FROM project_concepts WHERE project_id = ? AND concept_id = ?',
        [parsedProjectId, parsedConceptId],
        (err, existing) => {
          if (err) return res.status(500).json({ error: 'Database error checking association' });
          if (existing && existing.length > 0) {
            return res.status(400).json({ error: 'This concept is already associated with this project' });
          }

          // Insert mapping
          const insertQuery = 'INSERT INTO project_concepts (project_id, concept_id, reason) VALUES (?, ?, ?)';
          db.query(insertQuery, [parsedProjectId, parsedConceptId, trimmedReason], (err, result) => {
            if (err) {
              console.error('Error inserting project concept:', err.message);
              return res.status(500).json({ error: 'Failed to associate concept with project' });
            }

            return res.status(201).json({
              id: result.insertId,
              project_id: parsedProjectId,
              concept_id: parsedConceptId,
              reason: trimmedReason,
              message: 'Concept successfully associated with project',
            });
          });
        }
      );
    });
  });
}

// DELETE /api/project-concepts/:id - Remove a concept association from a project
function removeProjectConcept(req, res) {
  const mappingId = req.params.id;

  if (!mappingId || isNaN(mappingId)) {
    return res.status(400).json({ error: 'Invalid mapping ID' });
  }

  const deleteQuery = 'DELETE FROM project_concepts WHERE id = ?';
  db.query(deleteQuery, [Number(mappingId)], (err, result) => {
    if (err) {
      console.error('Error deleting project concept mapping:', err.message);
      return res.status(500).json({ error: 'Failed to remove concept from project' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Concept association not found' });
    }

    return res.status(200).json({ message: 'Concept association removed successfully' });
  });
}

module.exports = {
  getSubjects,
  getAllConcepts,
  getProjectConcepts,
  addProjectConcept,
  removeProjectConcept,
};
