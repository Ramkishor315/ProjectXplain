const OpenAI = require('openai');
const db = require('../db/connection');

// POST /api/projects/:projectId/mentor - Context-aware AI Mentor
async function askMentor(req, res) {
  const { projectId } = req.params;
  const { question } = req.body;

  // 1. Validation
  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Please enter a question for the AI Mentor' });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'AI Mentor service is not configured (missing OPENROUTER_API_KEY)' });
  }

  try {
    const pId = Number(projectId);

    // 2. Fetch Project info
    const [projects] = await db.promise().query(
      'SELECT id, name, idea, created_at FROM projects WHERE id = ?',
      [pId]
    );

    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projects[0];

    // 3. Fetch all related project records across Features 2-9
    const [
      [requirements],
      [userStories],
      [entities],
      [attributes],
      [relationships],
      [apis],
      [components],
      [connections],
      [flowSteps],
      [concepts],
    ] = await Promise.all([
      db.promise().query(
        'SELECT id, title, description, priority FROM requirements WHERE project_id = ? ORDER BY id ASC',
        [pId]
      ),
      db.promise().query(
        'SELECT us.id, us.title, us.description, r.title AS requirement_title FROM user_stories us JOIN requirements r ON us.requirement_id = r.id WHERE r.project_id = ? ORDER BY us.id ASC',
        [pId]
      ),
      db.promise().query(
        'SELECT id, name, description FROM database_entities WHERE project_id = ? ORDER BY id ASC',
        [pId]
      ),
      db.promise().query(
        'SELECT ea.id, ea.entity_id, ea.name, ea.data_type, ea.key_type, de.name AS entity_name FROM entity_attributes ea JOIN database_entities de ON ea.entity_id = de.id WHERE de.project_id = ? ORDER BY ea.id ASC',
        [pId]
      ),
      db.promise().query(
        'SELECT er.id, de1.name AS from_entity, de2.name AS to_entity, er.relationship_type FROM entity_relationships er JOIN database_entities de1 ON er.from_entity_id = de1.id JOIN database_entities de2 ON er.to_entity_id = de2.id WHERE er.project_id = ? ORDER BY er.id ASC',
        [pId]
      ),
      db.promise().query(
        'SELECT id, name, method, endpoint, description, request_body, response_body FROM api_endpoints WHERE project_id = ? ORDER BY id ASC',
        [pId]
      ),
      db.promise().query(
        'SELECT id, name, type, description FROM architecture_components WHERE project_id = ? ORDER BY id ASC',
        [pId]
      ),
      db.promise().query(
        'SELECT ac.id, c1.name AS from_component, c2.name AS to_component, ac.description FROM architecture_connections ac JOIN architecture_components c1 ON ac.from_component_id = c1.id JOIN architecture_components c2 ON ac.to_component_id = c2.id WHERE ac.project_id = ? ORDER BY ac.id ASC',
        [pId]
      ),
      db.promise().query(
        'SELECT dfs.id, dfs.step_number, c1.name AS from_component, c2.name AS to_component, dfs.action, dfs.method, dfs.description, ae.endpoint AS api_endpoint FROM data_flow_steps dfs JOIN architecture_components c1 ON dfs.from_component_id = c1.id JOIN architecture_components c2 ON dfs.to_component_id = c2.id LEFT JOIN api_endpoints ae ON dfs.api_id = ae.id WHERE dfs.project_id = ? ORDER BY dfs.step_number ASC, dfs.id ASC',
        [pId]
      ),
      db.promise().query(
        'SELECT c.name, s.name AS subject_name, c.explanation, c.project_relevance, pc.reason FROM project_concepts pc JOIN cse_concepts c ON pc.concept_id = c.id JOIN cse_subjects s ON c.subject_id = s.id WHERE pc.project_id = ? ORDER BY s.id ASC, c.id ASC',
        [pId]
      ),
    ]);

    // 4. Assemble readable, structured Project Context
    let context = `Project Name: ${project.name}\nProject Idea: ${project.idea || 'N/A'}\n\n`;

    // Requirements
    if (requirements.length > 0) {
      context += `=== FUNCTIONAL REQUIREMENTS (${requirements.length}) ===\n`;
      requirements.forEach((r) => {
        context += `- [${r.priority} Priority] ${r.title}: ${r.description}\n`;
      });
      context += '\n';
    }

    // User Stories
    if (userStories.length > 0) {
      context += `=== USER STORIES (${userStories.length}) ===\n`;
      userStories.forEach((us) => {
        context += `- ${us.title} (under '${us.requirement_title}'): ${us.description}\n`;
      });
      context += '\n';
    }

    // Database Design
    if (entities.length > 0) {
      context += `=== DATABASE DESIGN ===\nTables and Attributes:\n`;
      entities.forEach((ent) => {
        const entAttrs = attributes.filter((a) => a.entity_id === ent.id);
        const attrStr = entAttrs.length > 0
          ? entAttrs.map((a) => `${a.name} (${a.data_type}${a.key_type && a.key_type !== 'None' ? `, ${a.key_type}` : ''})`).join(', ')
          : 'no attributes defined';
        context += `- Table "${ent.name}": ${attrStr}${ent.description ? ` (${ent.description})` : ''}\n`;
      });

      if (relationships.length > 0) {
        context += `Database Relationships:\n`;
        relationships.forEach((rel) => {
          context += `- ${rel.from_entity} → ${rel.to_entity} (${rel.relationship_type})\n`;
        });
      }
      context += '\n';
    }

    // API Design
    if (apis.length > 0) {
      context += `=== REST API DESIGN (${apis.length}) ===\n`;
      apis.forEach((api) => {
        context += `- ${api.method} ${api.endpoint} (${api.name}): ${api.description || 'No description'}\n`;
        if (api.request_body) context += `  Request Body: ${api.request_body}\n`;
        if (api.response_body) context += `  Response Body: ${api.response_body}\n`;
      });
      context += '\n';
    }

    // System Architecture
    if (components.length > 0) {
      context += `=== SYSTEM ARCHITECTURE ===\nArchitecture Components:\n`;
      components.forEach((c) => {
        context += `- ${c.name} [Type: ${c.type}]: ${c.description || 'No description'}\n`;
      });
      if (connections.length > 0) {
        context += `Architecture Connections:\n`;
        connections.forEach((conn) => {
          context += `- ${conn.from_component} → ${conn.to_component}: ${conn.description || 'Communicates'}\n`;
        });
      }
      context += '\n';
    }

    // Request / Data Flow
    if (flowSteps.length > 0) {
      context += `=== REQUEST / DATA FLOW (${flowSteps.length} steps) ===\n`;
      flowSteps.forEach((s) => {
        context += `Step ${s.step_number}: ${s.from_component} → ${s.to_component} [${s.method || 'INTERNAL'}] "${s.action}"${s.api_endpoint ? ` (API: ${s.api_endpoint})` : ''}\n  Details: ${s.description || 'None'}\n`;
      });
      context += '\n';
    }

    // CSE Concepts
    if (concepts.length > 0) {
      context += `=== CSE CONCEPTS APPLIED (${concepts.length}) ===\n`;
      concepts.forEach((c) => {
        context += `- ${c.name} (${c.subject_name}): ${c.explanation}\n  Project Relevance: ${c.project_relevance}\n  Context: ${c.reason || 'Core CSE concept'}\n`;
      });
      context += '\n';
    }

    // 5. OpenRouter Client initialization
    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const systemPrompt = `You are the AI Mentor of ProjectXplain.

Your job is to help a student understand their own software project and prepare for viva examinations and technical reviews.

Answer using the provided project context whenever relevant.

Explain concepts in simple student-friendly language suitable for 3rd-year Computer Science and Engineering students.

When explaining a CSE concept, connect it to the actual project (such as specific tables, APIs, architecture components, or data flow steps).

Do not invent project features, tables, APIs, or architecture that are not present in the provided context.

If the answer cannot be determined from the project context, clearly say that the available project information is insufficient and then give a general explanation if useful.

Do not claim that an API or feature exists unless it appears in the project context.`;

    const userMessage = `PROJECT CONTEXT:
${context}

STUDENT'S QUESTION:
${question.trim()}`;

    // 6. Request completion from OpenRouter
    const completion = await client.chat.completions.create({
      model: 'openrouter/free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });

    const answer = completion.choices && completion.choices[0] && completion.choices[0].message
      ? completion.choices[0].message.content
      : 'No response generated from AI Mentor.';

    return res.status(200).json({ answer });
  } catch (error) {
    console.error('AI Mentor Error:', error.message);
    return res.status(500).json({
      error: error.message || 'Failed to generate response from AI Mentor',
    });
  }
}

module.exports = {
  askMentor,
};
