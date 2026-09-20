import { useEffect, useState } from 'react';

const API_PROJECTS_URL = 'http://localhost:4000/api/projects';
const API_REQUIREMENTS_URL = 'http://localhost:4000/api/requirements';
const API_USER_STORIES_URL = 'http://localhost:4000/api/user-stories';
const API_ENTITIES_URL = 'http://localhost:4000/api/entities';
const API_ATTRIBUTES_URL = 'http://localhost:4000/api/attributes';
const API_RELATIONSHIPS_URL = 'http://localhost:4000/api/relationships';

function App() {
  // Navigation view state: 'dashboard' | 'create' | 'detail'
  const [currentView, setCurrentView] = useState('dashboard');

  // List of all projects
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Create Project form states
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback messages for project actions
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Project detail states
  const [selectedProject, setSelectedProject] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');

  // Requirements states (Feature 3)
  const [requirements, setRequirements] = useState([]);
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [showAddReqForm, setShowAddReqForm] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDescription, setReqDescription] = useState('');
  const [reqPriority, setReqPriority] = useState('High');
  const [isSavingReq, setIsSavingReq] = useState(false);
  const [reqMessage, setReqMessage] = useState('');
  const [isReqError, setIsReqError] = useState(false);

  // User Stories states (Feature 4)
  // userStoriesMap: { [requirementId]: array of user stories }
  const [userStoriesMap, setUserStoriesMap] = useState({});
  // showStoryFormMap: { [requirementId]: boolean } - which req has form open
  const [showStoryFormMap, setShowStoryFormMap] = useState({});
  // storyInputMap: { [requirementId]: { title, description } } - per-req form inputs
  const [storyInputMap, setStoryInputMap] = useState({});
  // storyLoadingMap: { [requirementId]: boolean }
  const [storyLoadingMap, setStoryLoadingMap] = useState({});
  // storySavingMap: { [requirementId]: boolean }
  const [storySavingMap, setStorySavingMap] = useState({});
  // storyErrorMap: { [requirementId]: string }
  const [storyErrorMap, setStoryErrorMap] = useState({});

  // Database Design states (Feature 5)
  // entities: array of entity objects for current project
  const [entities, setEntities] = useState([]);
  const [loadingEntities, setLoadingEntities] = useState(false);
  // showAddEntityForm: toggle add entity form
  const [showAddEntityForm, setShowAddEntityForm] = useState(false);
  // entityName, entityDescription: add entity form inputs
  const [entityName, setEntityName] = useState('');
  const [entityDescription, setEntityDescription] = useState('');
  const [isSavingEntity, setIsSavingEntity] = useState(false);
  const [entityMessage, setEntityMessage] = useState('');
  const [isEntityError, setIsEntityError] = useState(false);
  // openEntityMap: { [entityId]: boolean } - toggle open/collapse entity
  const [openEntityMap, setOpenEntityMap] = useState({});

  // attributesMap: { [entityId]: array of attributes }
  const [attributesMap, setAttributesMap] = useState({});
  // showAttrFormMap: { [entityId]: boolean } - which entity has attr form open
  const [showAttrFormMap, setShowAttrFormMap] = useState({});
  // attrInputMap: { [entityId]: { name, data_type, key_type } }
  const [attrInputMap, setAttrInputMap] = useState({});
  const [attrSavingMap, setAttrSavingMap] = useState({});
  const [attrErrorMap, setAttrErrorMap] = useState({});

  // relationships: array of relationship objects for current project
  const [dbRelationships, setDbRelationships] = useState([]);
  const [loadingRelationships, setLoadingRelationships] = useState(false);
  const [showAddRelForm, setShowAddRelForm] = useState(false);
  const [relFromEntityId, setRelFromEntityId] = useState('');
  const [relToEntityId, setRelToEntityId] = useState('');
  const [relType, setRelType] = useState('One-to-Many');
  const [isSavingRel, setIsSavingRel] = useState(false);
  const [relMessage, setRelMessage] = useState('');
  const [isRelError, setIsRelError] = useState(false);

  // Roadmap progress modules
  const progressModules = [
    { id: 1, name: 'Project Created', completed: true },
    { id: 2, name: 'Requirements', completed: requirements.length > 0 },
    { id: 3, name: 'User Stories / Use Cases', completed: Object.values(userStoriesMap).some((stories) => stories.length > 0) },
    { id: 4, name: 'Database Design', completed: entities.length > 0 },
    { id: 5, name: 'API Design', completed: false },
    { id: 6, name: 'System Architecture', completed: false },
    { id: 7, name: 'Request / Data Flow', completed: false },
    { id: 8, name: 'CSE Concepts', completed: false },
    { id: 9, name: 'AI Mentor', completed: false },
  ];

  // Helper to format date like: 19 Sep 2026
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  // Fetch all projects (GET /api/projects)
  function fetchProjects() {
    setLoadingProjects(true);
    fetch(API_PROJECTS_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      })
      .finally(() => {
        setLoadingProjects(false);
      });
  }

  // Fetch requirements for a specific project (GET /api/projects/:projectId/requirements)
  function fetchRequirements(projectId) {
    setLoadingRequirements(true);
    fetch(`${API_PROJECTS_URL}/${projectId}/requirements`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch requirements');
        }
        return response.json();
      })
      .then((data) => {
        setRequirements(data);
        // After loading requirements, fetch user stories for each
        data.forEach((req) => fetchUserStories(req.id));
      })
      .catch((error) => {
        console.error('Error fetching requirements:', error);
      })
      .finally(() => {
        setLoadingRequirements(false);
      });
  }

  // Fetch user stories for a specific requirement (GET /api/requirements/:requirementId/user-stories)
  function fetchUserStories(requirementId) {
    setStoryLoadingMap((prev) => ({ ...prev, [requirementId]: true }));
    fetch(`${API_REQUIREMENTS_URL}/${requirementId}/user-stories`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user stories');
        }
        return response.json();
      })
      .then((data) => {
        setUserStoriesMap((prev) => ({ ...prev, [requirementId]: data }));
      })
      .catch((error) => {
        console.error('Error fetching user stories for req', requirementId, error);
      })
      .finally(() => {
        setStoryLoadingMap((prev) => ({ ...prev, [requirementId]: false }));
      });
  }

  // Fetch all entities for a project (GET /api/projects/:projectId/entities)
  function fetchEntities(projectId) {
    setLoadingEntities(true);
    fetch(`${API_PROJECTS_URL}/${projectId}/entities`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch entities');
        return response.json();
      })
      .then((data) => {
        setEntities(data);
        // Fetch attributes for each entity
        data.forEach((entity) => fetchAttributesForEntity(entity.id));
      })
      .catch((error) => {
        console.error('Error fetching entities:', error);
      })
      .finally(() => {
        setLoadingEntities(false);
      });
  }

  // Fetch attributes for one entity (GET /api/entities/:entityId/attributes)
  function fetchAttributesForEntity(entityId) {
    fetch(`${API_ENTITIES_URL}/${entityId}/attributes`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch attributes');
        return response.json();
      })
      .then((data) => {
        setAttributesMap((prev) => ({ ...prev, [entityId]: data }));
      })
      .catch((error) => {
        console.error('Error fetching attributes for entity', entityId, error);
      });
  }

  // Fetch relationships for a project (GET /api/projects/:projectId/relationships)
  function fetchRelationships(projectId) {
    setLoadingRelationships(true);
    fetch(`${API_PROJECTS_URL}/${projectId}/relationships`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch relationships');
        return response.json();
      })
      .then((data) => {
        setDbRelationships(data);
      })
      .catch((error) => {
        console.error('Error fetching relationships:', error);
      })
      .finally(() => {
        setLoadingRelationships(false);
      });
  }

  // Load all projects on initial page mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch a single project by ID and its requirements, then open detail view
  function openProject(id) {
    setCurrentView('detail');
    setLoadingDetail(true);
    setDetailError('');
    setSelectedProject(null);
    setRequirements([]);
    setShowAddReqForm(false);
    setReqMessage('');
    setUserStoriesMap({});
    setShowStoryFormMap({});
    setStoryInputMap({});
    setStoryErrorMap({});
    setEntities([]);
    setAttributesMap({});
    setShowAttrFormMap({});
    setAttrInputMap({});
    setAttrErrorMap({});
    setDbRelationships([]);
    setShowAddEntityForm(false);
    setEntityName('');
    setEntityDescription('');
    setEntityMessage('');
    setShowAddRelForm(false);
    setRelMessage('');
    setOpenEntityMap({});

    fetch(`${API_PROJECTS_URL}/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Project not found or failed to load');
        }
        return response.json();
      })
      .then((data) => {
        setSelectedProject(data);
        // Fetch requirements belonging specifically to this project
        fetchRequirements(data.id);
        // Fetch database design data (Feature 5)
        fetchEntities(data.id);
        fetchRelationships(data.id);
      })
      .catch((error) => {
        setDetailError(error.message || 'Could not load project');
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  }

  // Handle creating a new project (POST /api/projects)
  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !idea.trim()) {
      setMessage('Please enter both Project Name and Project Idea');
      setIsError(true);
      return;
    }

    setIsSubmitting(true);

    fetch(API_PROJECTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        idea: idea.trim(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to create project');
        }
        return response.json();
      })
      .then(() => {
        setName('');
        setIdea('');
        setMessage('Project created successfully!');
        setIsError(false);
        fetchProjects();
        setCurrentView('dashboard');
      })
      .catch((error) => {
        setMessage(error.message || 'Error connecting to backend');
        setIsError(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  // Handle creating a new requirement (POST /api/projects/:projectId/requirements)
  function handleCreateRequirement(event) {
    event.preventDefault();

    if (!reqTitle.trim() || !reqDescription.trim()) {
      setReqMessage('Please enter both requirement title and description');
      setIsReqError(true);
      return;
    }

    setIsSavingReq(true);
    setReqMessage('');

    fetch(`${API_PROJECTS_URL}/${selectedProject.id}/requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: reqTitle.trim(),
        description: reqDescription.trim(),
        priority: reqPriority,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save requirement');
        }
        return response.json();
      })
      .then(() => {
        setReqTitle('');
        setReqDescription('');
        setReqPriority('High');
        setShowAddReqForm(false);
        setReqMessage('');
        // Refresh requirements list
        fetchRequirements(selectedProject.id);
      })
      .catch((error) => {
        setReqMessage(error.message || 'Failed to save requirement');
        setIsReqError(true);
      })
      .finally(() => {
        setIsSavingReq(false);
      });
  }

  // Handle deleting a requirement (DELETE /api/requirements/:id)
  function handleDeleteRequirement(reqId) {
    const confirmed = window.confirm('Are you sure you want to delete this requirement?');
    if (!confirmed) return;

    fetch(`${API_REQUIREMENTS_URL}/${reqId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete requirement');
        }
        return response.json();
      })
      .then(() => {
        // Remove the deleted requirement from state
        setRequirements((prev) => prev.filter((r) => r.id !== reqId));
        // Also remove its user stories from state
        setUserStoriesMap((prev) => {
          const updated = { ...prev };
          delete updated[reqId];
          return updated;
        });
      })
      .catch((error) => {
        alert(error.message || 'Error deleting requirement');
      });
  }

  // Handle creating a user story (POST /api/requirements/:requirementId/user-stories)
  function handleCreateUserStory(event, requirementId) {
    event.preventDefault();
    const input = storyInputMap[requirementId] || {};
    const title = (input.title || '').trim();
    const description = (input.description || '').trim();

    if (!title || !description) {
      setStoryErrorMap((prev) => ({ ...prev, [requirementId]: 'Please enter both title and description' }));
      return;
    }

    setStorySavingMap((prev) => ({ ...prev, [requirementId]: true }));
    setStoryErrorMap((prev) => ({ ...prev, [requirementId]: '' }));

    fetch(`${API_REQUIREMENTS_URL}/${requirementId}/user-stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save user story');
        }
        return response.json();
      })
      .then(() => {
        // Reset form inputs and close form for this requirement
        setStoryInputMap((prev) => ({ ...prev, [requirementId]: { title: '', description: '' } }));
        setShowStoryFormMap((prev) => ({ ...prev, [requirementId]: false }));
        // Refresh user stories for this requirement
        fetchUserStories(requirementId);
      })
      .catch((error) => {
        setStoryErrorMap((prev) => ({ ...prev, [requirementId]: error.message || 'Failed to save user story' }));
      })
      .finally(() => {
        setStorySavingMap((prev) => ({ ...prev, [requirementId]: false }));
      });
  }

  // Handle deleting a user story (DELETE /api/user-stories/:id)
  function handleDeleteUserStory(storyId, requirementId) {
    const confirmed = window.confirm('Are you sure you want to delete this user story?');
    if (!confirmed) return;

    fetch(`${API_USER_STORIES_URL}/${storyId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete user story');
        }
        return response.json();
      })
      .then(() => {
        // Remove story from userStoriesMap for this requirement
        setUserStoriesMap((prev) => ({
          ...prev,
          [requirementId]: (prev[requirementId] || []).filter((s) => s.id !== storyId),
        }));
      })
      .catch((error) => {
        alert(error.message || 'Error deleting user story');
      });
  }

  // Return back to dashboard view
  function handleBackToDashboard() {
    setCurrentView('dashboard');
    setSelectedProject(null);
    setDetailError('');
    setRequirements([]);
    setShowAddReqForm(false);
    setUserStoriesMap({});
    setShowStoryFormMap({});
    setStoryInputMap({});
    setStoryErrorMap({});
    setEntities([]);
    setAttributesMap({});
    setShowAttrFormMap({});
    setAttrInputMap({});
    setAttrErrorMap({});
    setDbRelationships([]);
    setShowAddEntityForm(false);
    setEntityName('');
    setEntityDescription('');
    setEntityMessage('');
    setShowAddRelForm(false);
    setRelMessage('');
    setOpenEntityMap({});
  }

  // =========================================================
  // FEATURE 5: DATABASE DESIGN HANDLERS
  // =========================================================

  // Handle creating a new entity (POST /api/projects/:projectId/entities)
  function handleCreateEntity(event) {
    event.preventDefault();
    if (!entityName.trim()) {
      setEntityMessage('Entity name is required');
      setIsEntityError(true);
      return;
    }
    setIsSavingEntity(true);
    setEntityMessage('');

    fetch(`${API_PROJECTS_URL}/${selectedProject.id}/entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: entityName.trim(), description: entityDescription.trim() }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to create entity');
        return response.json();
      })
      .then(() => {
        setEntityName('');
        setEntityDescription('');
        setShowAddEntityForm(false);
        setEntityMessage('');
        fetchEntities(selectedProject.id);
      })
      .catch((error) => {
        setEntityMessage(error.message || 'Failed to create entity');
        setIsEntityError(true);
      })
      .finally(() => {
        setIsSavingEntity(false);
      });
  }

  // Handle deleting an entity (DELETE /api/entities/:id)
  function handleDeleteEntity(entityId) {
    const confirmed = window.confirm('Are you sure you want to delete this entity? All its attributes will also be deleted.');
    if (!confirmed) return;

    fetch(`${API_ENTITIES_URL}/${entityId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete entity');
        return response.json();
      })
      .then(() => {
        setEntities((prev) => prev.filter((e) => e.id !== entityId));
        setAttributesMap((prev) => {
          const updated = { ...prev };
          delete updated[entityId];
          return updated;
        });
        // Also remove relationships that used this entity
        setDbRelationships((prev) =>
          prev.filter((r) => r.from_entity_id !== entityId && r.to_entity_id !== entityId)
        );
      })
      .catch((error) => {
        alert(error.message || 'Error deleting entity');
      });
  }

  // Handle creating an attribute (POST /api/entities/:entityId/attributes)
  function handleCreateAttribute(event, entityId) {
    event.preventDefault();
    const input = attrInputMap[entityId] || {};
    const name = (input.name || '').trim();
    const data_type = input.data_type || 'INT';
    const key_type = input.key_type || 'None';

    if (!name) {
      setAttrErrorMap((prev) => ({ ...prev, [entityId]: 'Attribute name is required' }));
      return;
    }

    setAttrSavingMap((prev) => ({ ...prev, [entityId]: true }));
    setAttrErrorMap((prev) => ({ ...prev, [entityId]: '' }));

    fetch(`${API_ENTITIES_URL}/${entityId}/attributes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, data_type, key_type }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save attribute');
        return response.json();
      })
      .then(() => {
        setAttrInputMap((prev) => ({ ...prev, [entityId]: { name: '', data_type: 'INT', key_type: 'None' } }));
        setShowAttrFormMap((prev) => ({ ...prev, [entityId]: false }));
        fetchAttributesForEntity(entityId);
      })
      .catch((error) => {
        setAttrErrorMap((prev) => ({ ...prev, [entityId]: error.message || 'Failed to save attribute' }));
      })
      .finally(() => {
        setAttrSavingMap((prev) => ({ ...prev, [entityId]: false }));
      });
  }

  // Handle deleting an attribute (DELETE /api/attributes/:id)
  function handleDeleteAttribute(attrId, entityId) {
    const confirmed = window.confirm('Are you sure you want to delete this attribute?');
    if (!confirmed) return;

    fetch(`${API_ATTRIBUTES_URL}/${attrId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete attribute');
        return response.json();
      })
      .then(() => {
        setAttributesMap((prev) => ({
          ...prev,
          [entityId]: (prev[entityId] || []).filter((a) => a.id !== attrId),
        }));
      })
      .catch((error) => {
        alert(error.message || 'Error deleting attribute');
      });
  }

  // Handle creating a relationship (POST /api/projects/:projectId/relationships)
  function handleCreateRelationship(event) {
    event.preventDefault();
    if (!relFromEntityId || !relToEntityId) {
      setRelMessage('Please select both entities');
      setIsRelError(true);
      return;
    }
    if (String(relFromEntityId) === String(relToEntityId)) {
      setRelMessage('From and To entities must be different');
      setIsRelError(true);
      return;
    }

    setIsSavingRel(true);
    setRelMessage('');

    fetch(`${API_PROJECTS_URL}/${selectedProject.id}/relationships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_entity_id: Number(relFromEntityId),
        to_entity_id: Number(relToEntityId),
        relationship_type: relType,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save relationship');
        return response.json();
      })
      .then(() => {
        setRelFromEntityId('');
        setRelToEntityId('');
        setRelType('One-to-Many');
        setShowAddRelForm(false);
        setRelMessage('');
        fetchRelationships(selectedProject.id);
      })
      .catch((error) => {
        setRelMessage(error.message || 'Failed to save relationship');
        setIsRelError(true);
      })
      .finally(() => {
        setIsSavingRel(false);
      });
  }

  // Handle deleting a relationship (DELETE /api/relationships/:id)
  function handleDeleteRelationship(relId) {
    const confirmed = window.confirm('Are you sure you want to delete this relationship?');
    if (!confirmed) return;

    fetch(`${API_RELATIONSHIPS_URL}/${relId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete relationship');
        return response.json();
      })
      .then(() => {
        setDbRelationships((prev) => prev.filter((r) => r.id !== relId));
      })
      .catch((error) => {
        alert(error.message || 'Error deleting relationship');
      });
  }

  return (
    <main className="page">
      <div className="container">
        {/* Top Branding Section */}
        <header className="intro">
          <p className="eyebrow">ProjectXplain</p>
          <h1>Understand your software project one idea at a time.</h1>
          <p className="description">
            ProjectXplain turns your project idea into simple, connected
            explanations of its software engineering concepts.
          </p>
        </header>

        {/* ========================================================= */}
        {/* VIEW 1: DASHBOARD VIEW                                    */}
        {/* ========================================================= */}
        {currentView === 'dashboard' && (
          <section className="card">
            <div className="dashboard-header">
              <h2>My Projects</h2>
              <button
                className="action-btn new-btn"
                onClick={() => {
                  setMessage('');
                  setIsError(false);
                  setCurrentView('create');
                }}
              >
                + New Project
              </button>
            </div>

            {/* Feedback message banner */}
            {message && (
              <div className={`message-box ${isError ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            {loadingProjects ? (
              <p className="empty-text">Loading projects...</p>
            ) : projects.length === 0 ? (
              <div className="empty-state">
                <p className="empty-text">
                  No projects found. Create your first project.
                </p>
                <button
                  className="submit-btn"
                  onClick={() => {
                    setMessage('');
                    setCurrentView('create');
                  }}
                >
                  + New Project
                </button>
              </div>
            ) : (
              <div className="projects-list">
                {projects.map((project) => (
                  <article key={project.id} className="project-card">
                    <div className="project-header">
                      <h3 className="project-title">{project.name}</h3>
                      <span className="project-date">
                        Created: {formatDate(project.created_at)}
                      </span>
                    </div>
                    <p className="project-idea">{project.idea}</p>
                    <div className="card-actions">
                      <button
                        className="action-btn open-btn"
                        onClick={() => openProject(project.id)}
                      >
                        Open Project
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: CREATE PROJECT VIEW                               */}
        {/* ========================================================= */}
        {currentView === 'create' && (
          <section className="card">
            <div className="section-header">
              <h2>Create Project</h2>
              <button
                className="action-btn back-btn"
                onClick={handleBackToDashboard}
              >
                ← Back to Dashboard
              </button>
            </div>

            {message && (
              <div className={`message-box ${isError ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="e.g. CrickArena"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectIdea">Project Idea</label>
                <textarea
                  id="projectIdea"
                  rows="3"
                  placeholder="e.g. A real time ball by ball scoring platform"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleBackToDashboard}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: PROJECT DETAIL VIEW                               */}
        {/* ========================================================= */}
        {currentView === 'detail' && (
          <section className="card">
            <div className="section-header">
              <h2>Project Detail</h2>
              <button
                className="action-btn back-btn"
                onClick={handleBackToDashboard}
              >
                ← Back to Dashboard
              </button>
            </div>

            {loadingDetail ? (
              <p className="empty-text">Loading project details...</p>
            ) : detailError ? (
              <div className="message-box error">{detailError}</div>
            ) : selectedProject ? (
              <div className="detail-container">
                {/* Basic Project Info */}
                <div className="detail-info">
                  <div className="detail-field">
                    <span className="field-label">Project Name:</span>
                    <h3 className="detail-name">{selectedProject.name}</h3>
                  </div>

                  <div className="detail-field">
                    <span className="field-label">Project Idea:</span>
                    <p className="detail-idea">{selectedProject.idea}</p>
                  </div>

                  <div className="detail-field">
                    <span className="field-label">Created Date:</span>
                    <p className="detail-date">
                      {formatDate(selectedProject.created_at)}
                    </p>
                  </div>
                </div>

                <hr className="detail-divider" />

                {/* Progress Roadmap Section */}
                <div className="progress-section">
                  <h3 className="progress-title">Project Progress</h3>
                  <div className="progress-list">
                    {progressModules.map((module) => (
                      <div
                        key={module.id}
                        className={`progress-item ${
                          module.completed ? 'completed' : 'pending'
                        }`}
                      >
                        <span className="progress-icon">
                          {module.completed ? '✓' : '○'}
                        </span>
                        <span className="progress-name">{module.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="detail-divider" />

                {/* =================================================== */}
                {/* REQUIREMENTS MANAGEMENT (Feature 3)                */}
                {/* =================================================== */}
                <section className="requirements-section">
                  <div className="requirements-header">
                    <h3>Requirements</h3>
                    <button
                      className="action-btn new-btn"
                      onClick={() => {
                        setShowAddReqForm(!showAddReqForm);
                        setReqMessage('');
                      }}
                    >
                      {showAddReqForm ? 'Close Form' : '+ Add Requirement'}
                    </button>
                  </div>

                  {/* Add Requirement Form */}
                  {showAddReqForm && (
                    <div className="req-form-box">
                      <h4>Add New Requirement</h4>

                      {reqMessage && (
                        <div
                          className={`message-box ${
                            isReqError ? 'error' : 'success'
                          }`}
                        >
                          {reqMessage}
                        </div>
                      )}

                      <form
                        onSubmit={handleCreateRequirement}
                        className="project-form"
                      >
                        <div className="form-group">
                          <label htmlFor="reqTitle">Requirement Title</label>
                          <input
                            id="reqTitle"
                            type="text"
                            placeholder="e.g. User Login"
                            value={reqTitle}
                            onChange={(e) => setReqTitle(e.target.value)}
                            disabled={isSavingReq}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="reqDescription">Description</label>
                          <textarea
                            id="reqDescription"
                            rows="3"
                            placeholder="e.g. Users should be able to login to the system"
                            value={reqDescription}
                            onChange={(e) => setReqDescription(e.target.value)}
                            disabled={isSavingReq}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="reqPriority">Priority</label>
                          <select
                            id="reqPriority"
                            value={reqPriority}
                            onChange={(e) => setReqPriority(e.target.value)}
                            disabled={isSavingReq}
                            className="priority-select"
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>

                        <div className="form-actions">
                          <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSavingReq}
                          >
                            {isSavingReq ? 'Saving...' : 'Save Requirement'}
                          </button>
                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => {
                              setShowAddReqForm(false);
                              setReqMessage('');
                            }}
                            disabled={isSavingReq}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Requirements List */}
                  {loadingRequirements ? (
                    <p className="empty-text">Loading requirements...</p>
                  ) : requirements.length === 0 ? (
                    <p className="empty-text">No requirements added yet.</p>
                  ) : (
                    <div className="requirements-list">
                      {requirements.map((req) => (
                        <article key={req.id} className="requirement-card">
                          <div className="req-card-top">
                            <h4 className="req-title">{req.title}</h4>
                            <span
                              className={`priority-badge priority-${req.priority.toLowerCase()}`}
                            >
                              Priority: {req.priority}
                            </span>
                          </div>
                          <p className="req-description">{req.description}</p>
                          <div className="req-card-bottom">
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteRequirement(req.id)}
                            >
                              Delete
                            </button>
                          </div>

                          {/* ========================================= */}
                          {/* USER STORIES SECTION (Feature 4)         */}
                          {/* ========================================= */}
                          <div className="user-stories-section">
                            <div className="user-stories-header">
                              <h5>User Stories / Use Cases</h5>
                              <button
                                className="action-btn story-add-btn"
                                onClick={() =>
                                  setShowStoryFormMap((prev) => ({
                                    ...prev,
                                    [req.id]: !prev[req.id],
                                  }))
                                }
                              >
                                {showStoryFormMap[req.id] ? 'Close' : '+ Add User Story'}
                              </button>
                            </div>

                            {/* Add User Story Form */}
                            {showStoryFormMap[req.id] && (
                              <div className="story-form-box">
                                {storyErrorMap[req.id] && (
                                  <div className="message-box error">
                                    {storyErrorMap[req.id]}
                                  </div>
                                )}
                                <form
                                  onSubmit={(e) => handleCreateUserStory(e, req.id)}
                                  className="project-form"
                                >
                                  <div className="form-group">
                                    <label htmlFor={`storyTitle-${req.id}`}>Title</label>
                                    <input
                                      id={`storyTitle-${req.id}`}
                                      type="text"
                                      placeholder="e.g. User Login"
                                      value={(storyInputMap[req.id] || {}).title || ''}
                                      onChange={(e) =>
                                        setStoryInputMap((prev) => ({
                                          ...prev,
                                          [req.id]: { ...(prev[req.id] || {}), title: e.target.value },
                                        }))
                                      }
                                      disabled={storySavingMap[req.id]}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor={`storyDesc-${req.id}`}>Description</label>
                                    <textarea
                                      id={`storyDesc-${req.id}`}
                                      rows="3"
                                      placeholder="e.g. As a user, I want to login using my email and password so that I can access my account."
                                      value={(storyInputMap[req.id] || {}).description || ''}
                                      onChange={(e) =>
                                        setStoryInputMap((prev) => ({
                                          ...prev,
                                          [req.id]: { ...(prev[req.id] || {}), description: e.target.value },
                                        }))
                                      }
                                      disabled={storySavingMap[req.id]}
                                    />
                                  </div>
                                  <div className="form-actions">
                                    <button
                                      type="submit"
                                      className="submit-btn"
                                      disabled={storySavingMap[req.id]}
                                    >
                                      {storySavingMap[req.id] ? 'Saving...' : 'Save User Story'}
                                    </button>
                                    <button
                                      type="button"
                                      className="cancel-btn"
                                      onClick={() =>
                                        setShowStoryFormMap((prev) => ({
                                          ...prev,
                                          [req.id]: false,
                                        }))
                                      }
                                      disabled={storySavingMap[req.id]}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              </div>
                            )}

                            {/* User Stories List */}
                            {storyLoadingMap[req.id] ? (
                              <p className="empty-text">Loading user stories...</p>
                            ) : !userStoriesMap[req.id] || userStoriesMap[req.id].length === 0 ? (
                              <p className="empty-text">No user stories added yet.</p>
                            ) : (
                              <div className="stories-list">
                                {userStoriesMap[req.id].map((story) => (
                                  <div key={story.id} className="story-card">
                                    <div className="story-card-top">
                                      <h6 className="story-title">{story.title}</h6>
                                    </div>
                                    <p className="story-description">{story.description}</p>
                                    <div className="story-card-bottom">
                                      <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteUserStory(story.id, req.id)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                <hr className="detail-divider" />

                {/* =================================================== */}
                {/* DATABASE DESIGN (Feature 5)                         */}
                {/* =================================================== */}
                <section className="database-section">
                  <div className="database-header">
                    <div>
                      <h3>Database Design</h3>
                      <p className="section-subtitle">
                        Design the proposed database entities, attributes, and relationships.
                      </p>
                    </div>
                    <button
                      className="action-btn new-btn"
                      onClick={() => {
                        setShowAddEntityForm(!showAddEntityForm);
                        setEntityMessage('');
                      }}
                    >
                      {showAddEntityForm ? 'Close Form' : '+ Add Entity'}
                    </button>
                  </div>

                  {/* Add Entity Form */}
                  {showAddEntityForm && (
                    <div className="entity-form-box">
                      <h4>Add New Database Entity</h4>

                      {entityMessage && (
                        <div
                          className={`message-box ${
                            isEntityError ? 'error' : 'success'
                          }`}
                        >
                          {entityMessage}
                        </div>
                      )}

                      <form onSubmit={handleCreateEntity} className="project-form">
                        <div className="form-group">
                          <label htmlFor="entityName">Entity Name *</label>
                          <input
                            id="entityName"
                            type="text"
                            placeholder="e.g. users, orders, products"
                            value={entityName}
                            onChange={(e) => setEntityName(e.target.value)}
                            disabled={isSavingEntity}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="entityDescription">Description</label>
                          <textarea
                            id="entityDescription"
                            rows="2"
                            placeholder="e.g. Stores registered user accounts and credentials"
                            value={entityDescription}
                            onChange={(e) => setEntityDescription(e.target.value)}
                            disabled={isSavingEntity}
                          />
                        </div>

                        <div className="form-actions">
                          <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSavingEntity}
                          >
                            {isSavingEntity ? 'Saving...' : 'Save Entity'}
                          </button>
                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => {
                              setShowAddEntityForm(false);
                              setEntityMessage('');
                            }}
                            disabled={isSavingEntity}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Entities List */}
                  {loadingEntities ? (
                    <p className="empty-text">Loading database entities...</p>
                  ) : entities.length === 0 ? (
                    <div className="empty-box">
                      <p className="empty-text">No database entities created yet.</p>
                      <button
                        className="action-btn new-btn"
                        onClick={() => {
                          setShowAddEntityForm(true);
                          setEntityMessage('');
                        }}
                      >
                        + Add First Entity
                      </button>
                    </div>
                  ) : (
                    <div className="entities-list">
                      {entities.map((entity) => {
                        const entityAttrs = attributesMap[entity.id] || [];
                        const isOpen = openEntityMap[entity.id] !== false; // open by default

                        return (
                          <article key={entity.id} className="entity-card">
                            <div className="entity-card-top">
                              <div className="entity-title-group">
                                <span className="entity-icon">🗄️</span>
                                <h4 className="entity-name">{entity.name}</h4>
                                <span className="attribute-count-badge">
                                  {entityAttrs.length} {entityAttrs.length === 1 ? 'attribute' : 'attributes'}
                                </span>
                              </div>
                              <div className="entity-top-actions">
                                <button
                                  className="action-btn toggle-open-btn"
                                  onClick={() =>
                                    setOpenEntityMap((prev) => ({
                                      ...prev,
                                      [entity.id]: !isOpen,
                                    }))
                                  }
                                >
                                  {isOpen ? '▲ Collapse' : '▼ Open Entity'}
                                </button>
                                <button
                                  className="delete-btn"
                                  onClick={() => handleDeleteEntity(entity.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            {entity.description && (
                              <p className="entity-description">{entity.description}</p>
                            )}

                            {/* Attributes Section inside Entity (shown when open) */}
                            {isOpen && (
                              <div className="attributes-section">
                                <div className="attributes-header">
                                  <h5>Attributes</h5>
                                  <button
                                    className="action-btn attr-add-btn"
                                    onClick={() =>
                                      setShowAttrFormMap((prev) => ({
                                        ...prev,
                                        [entity.id]: !prev[entity.id],
                                      }))
                                    }
                                  >
                                    {showAttrFormMap[entity.id]
                                      ? 'Close Form'
                                      : '+ Add Attribute'}
                                  </button>
                                </div>

                                {/* Add Attribute Form */}
                                {showAttrFormMap[entity.id] && (
                                  <div className="attr-form-box">
                                    <h6>Add Attribute to {entity.name}</h6>
                                    {attrErrorMap[entity.id] && (
                                      <div className="message-box error">
                                        {attrErrorMap[entity.id]}
                                      </div>
                                    )}
                                    <form
                                      onSubmit={(e) => handleCreateAttribute(e, entity.id)}
                                      className="project-form attr-form"
                                    >
                                      <div className="form-group">
                                        <label htmlFor={`attrName-${entity.id}`}>
                                          Attribute Name *
                                        </label>
                                        <input
                                          id={`attrName-${entity.id}`}
                                          type="text"
                                          placeholder="e.g. id, email, total_amount"
                                          value={(attrInputMap[entity.id] || {}).name || ''}
                                          onChange={(e) =>
                                            setAttrInputMap((prev) => ({
                                              ...prev,
                                              [entity.id]: {
                                                ...(prev[entity.id] || { data_type: 'INT', key_type: 'None' }),
                                                name: e.target.value,
                                              },
                                            }))
                                          }
                                          disabled={attrSavingMap[entity.id]}
                                        />
                                      </div>

                                      <div className="form-row-2col">
                                        <div className="form-group">
                                          <label htmlFor={`attrDataType-${entity.id}`}>
                                            Data Type
                                          </label>
                                          <select
                                            id={`attrDataType-${entity.id}`}
                                            value={(attrInputMap[entity.id] || {}).data_type || 'INT'}
                                            onChange={(e) =>
                                              setAttrInputMap((prev) => ({
                                                ...prev,
                                                [entity.id]: {
                                                  ...(prev[entity.id] || { name: '', key_type: 'None' }),
                                                  data_type: e.target.value,
                                                },
                                              }))
                                            }
                                            disabled={attrSavingMap[entity.id]}
                                            className="priority-select"
                                          >
                                            <option value="INT">INT</option>
                                            <option value="VARCHAR">VARCHAR</option>
                                            <option value="TEXT">TEXT</option>
                                            <option value="DATE">DATE</option>
                                            <option value="BOOLEAN">BOOLEAN</option>
                                            <option value="DECIMAL">DECIMAL</option>
                                          </select>
                                        </div>

                                        <div className="form-group">
                                          <label htmlFor={`attrKeyType-${entity.id}`}>
                                            Key Type
                                          </label>
                                          <select
                                            id={`attrKeyType-${entity.id}`}
                                            value={(attrInputMap[entity.id] || {}).key_type || 'None'}
                                            onChange={(e) =>
                                              setAttrInputMap((prev) => ({
                                                ...prev,
                                                [entity.id]: {
                                                  ...(prev[entity.id] || { name: '', data_type: 'INT' }),
                                                  key_type: e.target.value,
                                                },
                                              }))
                                            }
                                            disabled={attrSavingMap[entity.id]}
                                            className="priority-select"
                                          >
                                            <option value="None">None</option>
                                            <option value="Primary Key">Primary Key</option>
                                            <option value="Foreign Key">Foreign Key</option>
                                          </select>
                                        </div>
                                      </div>

                                      <div className="form-actions">
                                        <button
                                          type="submit"
                                          className="submit-btn"
                                          disabled={attrSavingMap[entity.id]}
                                        >
                                          {attrSavingMap[entity.id] ? 'Saving...' : 'Save Attribute'}
                                        </button>
                                        <button
                                          type="button"
                                          className="cancel-btn"
                                          onClick={() =>
                                            setShowAttrFormMap((prev) => ({
                                              ...prev,
                                              [entity.id]: false,
                                            }))
                                          }
                                          disabled={attrSavingMap[entity.id]}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                )}

                                {/* Attributes List / Table */}
                                {entityAttrs.length === 0 ? (
                                  <p className="empty-text attr-empty-text">
                                    No attributes added yet. Click "+ Add Attribute" to define columns.
                                  </p>
                                ) : (
                                  <div className="attributes-table-wrapper">
                                    <table className="attributes-table">
                                      <thead>
                                        <tr>
                                          <th>Attribute Name</th>
                                          <th>Data Type</th>
                                          <th>Key Type</th>
                                          <th className="th-action">Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {entityAttrs.map((attr) => (
                                          <tr key={attr.id} className="attribute-row">
                                            <td className="attr-name-cell">
                                              <code>{attr.name}</code>
                                            </td>
                                            <td className="attr-type-cell">
                                              <span className="type-badge">
                                                {attr.data_type}
                                              </span>
                                            </td>
                                            <td className="attr-key-cell">
                                              {attr.key_type === 'Primary Key' ? (
                                                <span className="key-badge key-pk">
                                                  PK (Primary Key)
                                                </span>
                                              ) : attr.key_type === 'Foreign Key' ? (
                                                <span className="key-badge key-fk">
                                                  FK (Foreign Key)
                                                </span>
                                              ) : (
                                                <span className="key-badge key-none">
                                                  None
                                                </span>
                                              )}
                                            </td>
                                            <td className="attr-action-cell">
                                              <button
                                                className="delete-btn delete-btn-small"
                                                onClick={() =>
                                                  handleDeleteAttribute(attr.id, entity.id)
                                                }
                                                title="Delete attribute"
                                              >
                                                Delete
                                              </button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}

                  {/* =================================================== */}
                  {/* ENTITY RELATIONSHIPS SUB-SECTION                    */}
                  {/* =================================================== */}
                  <div className="relationships-section">
                    <div className="relationships-header">
                      <div>
                        <h4>Entity Relationships</h4>
                        <p className="section-subtitle">
                          Connect entities using One-to-One, One-to-Many, or Many-to-Many relations.
                        </p>
                      </div>
                      <button
                        className="action-btn new-btn"
                        onClick={() => {
                          setShowAddRelForm(!showAddRelForm);
                          setRelMessage('');
                        }}
                        disabled={entities.length < 2}
                        title={
                          entities.length < 2
                            ? 'Create at least 2 entities to define relationships'
                            : '+ Add Relationship'
                        }
                      >
                        {showAddRelForm ? 'Close Form' : '+ Add Relationship'}
                      </button>
                    </div>

                    {entities.length < 2 && (
                      <p className="info-text">
                        Tip: You need at least 2 entities to create relationships between them.
                      </p>
                    )}

                    {/* Add Relationship Form */}
                    {showAddRelForm && (
                      <div className="relationship-form-box">
                        <h5>Add Relationship</h5>

                        {relMessage && (
                          <div
                            className={`message-box ${
                              isRelError ? 'error' : 'success'
                            }`}
                          >
                            {relMessage}
                          </div>
                        )}

                        <form
                          onSubmit={handleCreateRelationship}
                          className="project-form"
                        >
                          <div className="form-row-2col">
                            <div className="form-group">
                              <label htmlFor="relFromEntity">From Entity *</label>
                              <select
                                id="relFromEntity"
                                value={relFromEntityId}
                                onChange={(e) => setRelFromEntityId(e.target.value)}
                                disabled={isSavingRel}
                                className="priority-select"
                              >
                                <option value="">-- Select From Entity --</option>
                                {entities.map((ent) => (
                                  <option key={ent.id} value={ent.id}>
                                    {ent.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group">
                              <label htmlFor="relToEntity">To Entity *</label>
                              <select
                                id="relToEntity"
                                value={relToEntityId}
                                onChange={(e) => setRelToEntityId(e.target.value)}
                                disabled={isSavingRel}
                                className="priority-select"
                              >
                                <option value="">-- Select To Entity --</option>
                                {entities.map((ent) => (
                                  <option key={ent.id} value={ent.id}>
                                    {ent.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="relType">Relationship Type *</label>
                            <select
                              id="relType"
                              value={relType}
                              onChange={(e) => setRelType(e.target.value)}
                              disabled={isSavingRel}
                              className="priority-select"
                            >
                              <option value="One-to-One">One-to-One</option>
                              <option value="One-to-Many">One-to-Many</option>
                              <option value="Many-to-Many">Many-to-Many</option>
                            </select>
                          </div>

                          <div className="form-actions">
                            <button
                              type="submit"
                              className="submit-btn"
                              disabled={isSavingRel}
                            >
                              {isSavingRel ? 'Saving...' : 'Save Relationship'}
                            </button>
                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={() => {
                                setShowAddRelForm(false);
                                setRelMessage('');
                              }}
                              disabled={isSavingRel}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Relationships List */}
                    {loadingRelationships ? (
                      <p className="empty-text">Loading relationships...</p>
                    ) : dbRelationships.length === 0 ? (
                      <p className="empty-text">No relationships defined yet.</p>
                    ) : (
                      <div className="relationships-list">
                        {dbRelationships.map((rel) => (
                          <div key={rel.id} className="relationship-card">
                            <div className="rel-card-left">
                              <div className="rel-flow">
                                <span className="rel-entity-pill">
                                  {rel.from_entity_name || `Entity #${rel.from_entity_id}`}
                                </span>
                                <span className="rel-connector">
                                  <span className="rel-line"></span>
                                  <span className="rel-type-tag">
                                    {rel.relationship_type}
                                  </span>
                                  <span className="rel-arrow">➔</span>
                                </span>
                                <span className="rel-entity-pill">
                                  {rel.to_entity_name || `Entity #${rel.to_entity_id}`}
                                </span>
                              </div>
                            </div>
                            <div className="rel-card-right">
                              <button
                                className="delete-btn delete-btn-small"
                                onClick={() => handleDeleteRelationship(rel.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            ) : null}
          </section>
        )}
      </div>
    </main>
  );
}

export default App;