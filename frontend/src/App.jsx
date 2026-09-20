import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Input from './components/ui/Input';
import Textarea from './components/ui/Textarea';
import EmptyState from './components/ui/EmptyState';
import PageHeader from './components/ui/PageHeader';
import {
  ArchitectureIcon,
  DataFlowIcon,
  ConceptsIcon,
  MentorIcon,
} from './components/ui/Icons';
import ProjectSidebar from './components/ProjectSidebar';
import ProjectOverview from './pages/project/ProjectOverview';
import Requirements from './pages/project/Requirements';
import UserStories from './pages/project/UserStories';
import DatabaseDesign from './pages/project/DatabaseDesign';
import ApiDesign from './pages/project/ApiDesign';
import SystemArchitecture from './pages/project/SystemArchitecture';
import DataFlow from './pages/project/DataFlow';
import CseConcepts from './pages/project/CseConcepts';
import AIMentor from './pages/project/AIMentor';
import PlaceholderSection from './pages/project/PlaceholderSection';

const API_PROJECTS_URL = 'http://localhost:4000/api/projects';
const API_REQUIREMENTS_URL = 'http://localhost:4000/api/requirements';
const API_USER_STORIES_URL = 'http://localhost:4000/api/user-stories';
const API_ENTITIES_URL = 'http://localhost:4000/api/entities';
const API_ATTRIBUTES_URL = 'http://localhost:4000/api/attributes';
const API_RELATIONSHIPS_URL = 'http://localhost:4000/api/relationships';
const API_APIS_URL = 'http://localhost:4000/api/apis';
const API_ARCHITECTURE_URL = 'http://localhost:4000/api/architecture';
const API_DATA_FLOW_URL = 'http://localhost:4000/api/data-flow';
const API_CSE_CONCEPTS_URL = 'http://localhost:4000/api/cse-concepts';
const API_PROJECT_CONCEPTS_URL = 'http://localhost:4000/api/project-concepts';

function App() {
  // Navigation view state: 'dashboard' | 'create' | 'detail'
  const [currentView, setCurrentView] = useState('dashboard');
  // Active navigation section in Project Detail view
  const [activeSection, setActiveSection] = useState('overview');

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

  // API Design states (Feature 6)
  const [apiEndpoints, setApiEndpoints] = useState([]);
  const [loadingApiEndpoints, setLoadingApiEndpoints] = useState(false);
  const [showAddApiForm, setShowAddApiForm] = useState(false);
  const [apiName, setApiName] = useState('');
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiDescription, setApiDescription] = useState('');
  const [apiRequestBody, setApiRequestBody] = useState('');
  const [apiResponseBody, setApiResponseBody] = useState('');
  const [isSavingApi, setIsSavingApi] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [isApiError, setIsApiError] = useState(false);

  // Architecture states (Feature 7)
  const [archComponents, setArchComponents] = useState([]);
  const [loadingComponents, setLoadingComponents] = useState(false);
  const [showAddCompForm, setShowAddCompForm] = useState(false);
  const [compName, setCompName] = useState('');
  const [compType, setCompType] = useState('Frontend');
  const [compDescription, setCompDescription] = useState('');
  const [isSavingComp, setIsSavingComp] = useState(false);
  const [compMessage, setCompMessage] = useState('');
  const [isCompError, setIsCompError] = useState(false);

  const [archConnections, setArchConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [showAddConnForm, setShowAddConnForm] = useState(false);
  const [connFromId, setConnFromId] = useState('');
  const [connToId, setConnToId] = useState('');
  const [connDescription, setConnDescription] = useState('');
  const [isSavingConn, setIsSavingConn] = useState(false);
  const [connMessage, setConnMessage] = useState('');
  const [isConnError, setIsConnError] = useState(false);

  // Request / Data Flow states (Feature 8)
  const [dataFlowSteps, setDataFlowSteps] = useState([]);
  const [loadingDataFlowSteps, setLoadingDataFlowSteps] = useState(false);
  const [showAddStepForm, setShowAddStepForm] = useState(false);
  const [stepNumber, setStepNumber] = useState(1);
  const [flowFromCompId, setFlowFromCompId] = useState('');
  const [flowToCompId, setFlowToCompId] = useState('');
  const [flowApiId, setFlowApiId] = useState('');
  const [flowAction, setFlowAction] = useState('');
  const [flowMethod, setFlowMethod] = useState('POST');
  const [flowDescription, setFlowDescription] = useState('');
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [flowMessage, setFlowMessage] = useState('');
  const [isFlowError, setIsFlowError] = useState(false);

  // CSE Concepts states (Feature 9)
  const [cseConcepts, setCseConcepts] = useState([]);
  const [allAvailableConcepts, setAllAvailableConcepts] = useState([]);
  const [cseSubjects, setCseSubjects] = useState([]);
  const [loadingCseConcepts, setLoadingCseConcepts] = useState(false);

  // Roadmap progress modules
  const progressModules = [
    { id: 1, name: 'Project Created', completed: true },
    { id: 2, name: 'Requirements', completed: requirements.length > 0 },
    { id: 3, name: 'User Stories / Use Cases', completed: Object.values(userStoriesMap).some((stories) => Array.isArray(stories) && stories.length > 0) },
    { id: 4, name: 'Database Design', completed: entities.length > 0 },
    { id: 5, name: 'API Design', completed: apiEndpoints.length > 0 },
    { id: 6, name: 'System Architecture', completed: archComponents.length > 0 },
    { id: 7, name: 'Request / Data Flow', completed: dataFlowSteps.length > 0 },
    { id: 8, name: 'CSE Concepts', completed: cseConcepts.length > 0 },
    { id: 9, name: 'AI Mentor', completed: true },
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

  // Fetch all API designs for a project (GET /api/projects/:projectId/apis)
  function fetchApiEndpoints(projectId) {
    setLoadingApiEndpoints(true);
    fetch(`${API_PROJECTS_URL}/${projectId}/apis`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch API designs');
        return response.json();
      })
      .then((data) => {
        setApiEndpoints(data);
      })
      .catch((error) => {
        console.error('Error fetching API designs:', error);
      })
      .finally(() => {
        setLoadingApiEndpoints(false);
      });
  }

  // Fetch all architecture components for a project (GET /api/projects/:projectId/architecture/components)
  function fetchArchComponents(projectId) {
    setLoadingComponents(true);
    fetch(`${API_PROJECTS_URL}/${projectId}/architecture/components`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch architecture components');
        return response.json();
      })
      .then((data) => {
        setArchComponents(data);
      })
      .catch((error) => {
        console.error('Error fetching architecture components:', error);
      })
      .finally(() => {
        setLoadingComponents(false);
      });
  }

  // Fetch all architecture connections for a project (GET /api/projects/:projectId/architecture/connections)
  function fetchArchConnections(projectId) {
    setLoadingConnections(true);
    fetch(`${API_PROJECTS_URL}/${projectId}/architecture/connections`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch architecture connections');
        return response.json();
      })
      .then((data) => {
        setArchConnections(data);
      })
      .catch((error) => {
        console.error('Error fetching architecture connections:', error);
      })
      .finally(() => {
        setLoadingConnections(false);
      });
  }

  // Fetch all data flow steps for a project (GET /api/projects/:projectId/data-flow)
  function fetchDataFlowSteps(projectId) {
    setLoadingDataFlowSteps(true);
    fetch(`${API_PROJECTS_URL}/${projectId}/data-flow`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch data flow steps');
        return response.json();
      })
      .then((data) => {
        setDataFlowSteps(data);
      })
      .catch((error) => {
        console.error('Error fetching data flow steps:', error);
      })
      .finally(() => {
        setLoadingDataFlowSteps(false);
      });
  }

  // Fetch project-specific CSE concepts (GET /api/projects/:projectId/cse-concepts)
  function fetchProjectCseConcepts(projectId) {
    setLoadingCseConcepts(true);
    fetch(`${API_PROJECTS_URL}/${projectId}/cse-concepts`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch CSE concepts');
        return response.json();
      })
      .then((data) => {
        setCseConcepts(data || []);
      })
      .catch((error) => {
        console.error('Error fetching project CSE concepts:', error);
      })
      .finally(() => {
        setLoadingCseConcepts(false);
      });
  }

  // Fetch all CSE subjects (GET /api/cse-concepts/subjects)
  function fetchCseSubjects() {
    fetch(`${API_CSE_CONCEPTS_URL}/subjects`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch CSE subjects');
        return response.json();
      })
      .then((data) => {
        setCseSubjects(data || []);
      })
      .catch((error) => {
        console.error('Error fetching CSE subjects:', error);
      });
  }

  // Fetch all available predefined CSE concepts (GET /api/cse-concepts)
  function fetchAllAvailableConcepts() {
    fetch(API_CSE_CONCEPTS_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch all CSE concepts');
        return response.json();
      })
      .then((data) => {
        setAllAvailableConcepts(data || []);
      })
      .catch((error) => {
        console.error('Error fetching all CSE concepts:', error);
      });
  }

  // Load all projects and CSE knowledge base on initial page mount
  useEffect(() => {
    fetchProjects();
    fetchCseSubjects();
    fetchAllAvailableConcepts();
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
    setApiEndpoints([]);
    setShowAddApiForm(false);
    setApiName('');
    setApiMethod('GET');
    setApiEndpoint('');
    setApiDescription('');
    setApiRequestBody('');
    setApiResponseBody('');
    setApiMessage('');
    setArchComponents([]);
    setLoadingComponents(false);
    setShowAddCompForm(false);
    setCompName('');
    setCompType('Frontend');
    setCompDescription('');
    setCompMessage('');
    setIsCompError(false);
    setArchConnections([]);
    setLoadingConnections(false);
    setShowAddConnForm(false);
    setConnFromId('');
    setConnToId('');
    setConnDescription('');
    setConnMessage('');
    setIsConnError(false);
    setDataFlowSteps([]);
    setLoadingDataFlowSteps(false);
    setShowAddStepForm(false);
    setStepNumber(1);
    setFlowFromCompId('');
    setFlowToCompId('');
    setFlowApiId('');
    setFlowAction('');
    setFlowMethod('POST');
    setFlowDescription('');
    setFlowMessage('');
    setIsFlowError(false);
    setCseConcepts([]);
    setLoadingCseConcepts(false);
    setActiveSection('overview');

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
        // Fetch API design data (Feature 6)
        fetchApiEndpoints(data.id);
        // Fetch architecture data (Feature 7)
        fetchArchComponents(data.id);
        fetchArchConnections(data.id);
        // Fetch data flow steps (Feature 8)
        fetchDataFlowSteps(data.id);
        // Fetch CSE concepts (Feature 9)
        fetchProjectCseConcepts(data.id);
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
    setApiEndpoints([]);
    setShowAddApiForm(false);
    setApiName('');
    setApiMethod('GET');
    setApiEndpoint('');
    setApiDescription('');
    setApiRequestBody('');
    setApiResponseBody('');
    setApiMessage('');
    setCseConcepts([]);
    setLoadingCseConcepts(false);
    setActiveSection('overview');
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

  // =========================================================
  // FEATURE 6: API DESIGN HANDLERS
  // =========================================================

  // Handle creating an API design (POST /api/projects/:projectId/apis)
  function handleCreateApi(event) {
    event.preventDefault();

    if (!apiName.trim() || !apiEndpoint.trim()) {
      setApiMessage('Please enter both API Name and Endpoint');
      setIsApiError(true);
      return;
    }

    setIsSavingApi(true);
    setApiMessage('');

    fetch(`${API_PROJECTS_URL}/${selectedProject.id}/apis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: apiName.trim(),
        method: apiMethod,
        endpoint: apiEndpoint.trim(),
        description: apiDescription.trim(),
        request_body: apiRequestBody.trim(),
        response_body: apiResponseBody.trim(),
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save API design');
        return response.json();
      })
      .then(() => {
        setApiName('');
        setApiMethod('GET');
        setApiEndpoint('');
        setApiDescription('');
        setApiRequestBody('');
        setApiResponseBody('');
        setShowAddApiForm(false);
        setApiMessage('');
        fetchApiEndpoints(selectedProject.id);
      })
      .catch((error) => {
        setApiMessage(error.message || 'Failed to save API design');
        setIsApiError(true);
      })
      .finally(() => {
        setIsSavingApi(false);
      });
  }

  // Handle deleting an API design (DELETE /api/apis/:id)
  function handleDeleteApi(apiId) {
    const confirmed = window.confirm('Are you sure you want to delete this API design?');
    if (!confirmed) return;

    fetch(`${API_APIS_URL}/${apiId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete API design');
        return response.json();
      })
      .then(() => {
        setApiEndpoints((prev) => prev.filter((api) => api.id !== apiId));
      })
      .catch((error) => {
        alert(error.message || 'Error deleting API design');
      });
  }

  // Handle creating an architecture component (POST /api/projects/:projectId/architecture/components)
  function handleCreateComponent(e) {
    e.preventDefault();
    if (!compName.trim()) {
      setCompMessage('Please enter a component name');
      setIsCompError(true);
      return;
    }

    setIsSavingComp(true);
    setCompMessage('');
    setIsCompError(false);

    fetch(`${API_PROJECTS_URL}/${selectedProject.id}/architecture/components`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: compName.trim(),
        type: compType,
        description: compDescription.trim(),
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save architecture component');
        return response.json();
      })
      .then(() => {
        setCompName('');
        setCompType('Frontend');
        setCompDescription('');
        setShowAddCompForm(false);
        setCompMessage('');
        fetchArchComponents(selectedProject.id);
      })
      .catch((error) => {
        setCompMessage(error.message || 'Failed to save architecture component');
        setIsCompError(true);
      })
      .finally(() => {
        setIsSavingComp(false);
      });
  }

  // Handle deleting an architecture component (DELETE /api/architecture/components/:id)
  function handleDeleteComponent(compId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this component? Any connections using it will also be deleted.'
    );
    if (!confirmed) return;

    fetch(`${API_ARCHITECTURE_URL}/components/${compId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete architecture component');
        return response.json();
      })
      .then(() => {
        setArchComponents((prev) => prev.filter((c) => c.id !== compId));
        // Refresh connections since cascade delete on backend removed related connections
        fetchArchConnections(selectedProject.id);
      })
      .catch((error) => {
        alert(error.message || 'Error deleting architecture component');
      });
  }

  // Handle creating an architecture connection (POST /api/projects/:projectId/architecture/connections)
  function handleCreateConnection(e) {
    e.preventDefault();
    if (!connFromId || !connToId) {
      setConnMessage('Please select both source and target components');
      setIsConnError(true);
      return;
    }

    if (Number(connFromId) === Number(connToId)) {
      setConnMessage('Source and target components cannot be the same');
      setIsConnError(true);
      return;
    }

    setIsSavingConn(true);
    setConnMessage('');
    setIsConnError(false);

    fetch(`${API_PROJECTS_URL}/${selectedProject.id}/architecture/connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_component_id: Number(connFromId),
        to_component_id: Number(connToId),
        description: connDescription.trim(),
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save connection');
        return response.json();
      })
      .then(() => {
        setConnFromId('');
        setConnToId('');
        setConnDescription('');
        setShowAddConnForm(false);
        setConnMessage('');
        fetchArchConnections(selectedProject.id);
      })
      .catch((error) => {
        setConnMessage(error.message || 'Failed to save connection');
        setIsConnError(true);
      })
      .finally(() => {
        setIsSavingConn(false);
      });
  }

  // Handle deleting an architecture connection (DELETE /api/architecture/connections/:id)
  function handleDeleteConnection(connId) {
    const confirmed = window.confirm('Are you sure you want to delete this connection?');
    if (!confirmed) return;

    fetch(`${API_ARCHITECTURE_URL}/connections/${connId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete connection');
        return response.json();
      })
      .then(() => {
        setArchConnections((prev) => prev.filter((c) => c.id !== connId));
      })
      .catch((error) => {
        alert(error.message || 'Error deleting connection');
      });
  }

  // Handle creating a data flow step (POST /api/projects/:projectId/data-flow)
  function handleCreateDataFlowStep(e) {
    e.preventDefault();
    const parsedStep = parseInt(stepNumber, 10);
    if (isNaN(parsedStep) || parsedStep <= 0) {
      setFlowMessage('Step number must be a positive integer');
      setIsFlowError(true);
      return;
    }

    if (!flowFromCompId || !flowToCompId) {
      setFlowMessage('Please select both source and destination components');
      setIsFlowError(true);
      return;
    }

    if (Number(flowFromCompId) === Number(flowToCompId)) {
      setFlowMessage('Source and destination components cannot be the same');
      setIsFlowError(true);
      return;
    }

    if (!flowAction.trim()) {
      setFlowMessage('Please enter an action for this flow step');
      setIsFlowError(true);
      return;
    }

    setIsSavingStep(true);
    setFlowMessage('');
    setIsFlowError(false);

    fetch(`${API_PROJECTS_URL}/${selectedProject.id}/data-flow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step_number: parsedStep,
        from_component_id: Number(flowFromCompId),
        to_component_id: Number(flowToCompId),
        api_id: flowApiId ? Number(flowApiId) : null,
        action: flowAction.trim(),
        method: flowMethod,
        description: flowDescription.trim(),
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to save data flow step');
        return response.json();
      })
      .then(() => {
        setFlowAction('');
        setFlowDescription('');
        setShowAddStepForm(false);
        setFlowMessage('');
        fetchDataFlowSteps(selectedProject.id);
      })
      .catch((error) => {
        setFlowMessage(error.message || 'Failed to save data flow step');
        setIsFlowError(true);
      })
      .finally(() => {
        setIsSavingStep(false);
      });
  }

  // Handle deleting a data flow step (DELETE /api/data-flow/:id)
  function handleDeleteDataFlowStep(stepId) {
    const confirmed = window.confirm('Are you sure you want to delete this flow step?');
    if (!confirmed) return;

    fetch(`${API_DATA_FLOW_URL}/${stepId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to delete data flow step');
        return response.json();
      })
      .then(() => {
        setDataFlowSteps((prev) => prev.filter((s) => s.id !== stepId));
      })
      .catch((error) => {
        alert(error.message || 'Error deleting data flow step');
      });
  }

  // Handle manually associating a concept with the project (POST /api/projects/:projectId/cse-concepts)
  function handleAssociateConcept(conceptId, reason) {
    if (!selectedProject) return Promise.reject(new Error('No project selected'));

    return fetch(`${API_PROJECTS_URL}/${selectedProject.id}/cse-concepts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concept_id: conceptId, reason }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error || 'Failed to associate concept');
          });
        }
        return response.json();
      })
      .then(() => {
        fetchProjectCseConcepts(selectedProject.id);
      });
  }

  // Handle removing a concept association from the project (DELETE /api/project-concepts/:id)
  function handleRemoveConcept(mappingId) {
    const confirmed = window.confirm('Are you sure you want to remove this concept from your project?');
    if (!confirmed) return;

    fetch(`${API_PROJECT_CONCEPTS_URL}/${mappingId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to remove concept mapping');
        return response.json();
      })
      .then(() => {
        setCseConcepts((prev) => prev.filter((c) => c.mapping_id !== mappingId));
      })
      .catch((error) => {
        alert(error.message || 'Error removing concept mapping');
      });
  }

  // Summary counts for sidebar and overview
  const counts = {
    requirements: requirements.length,
    userStories: Object.values(userStoriesMap || {}).reduce(
      (acc, list) => acc + (Array.isArray(list) ? list.length : 0),
      0
    ),
    entities: entities.length,
    apis: apiEndpoints.length,
    components: archComponents.length,
    connections: archConnections.length,
    dataFlow: dataFlowSteps.length,
    cseConcepts: cseConcepts.length,
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans text-stone-900">
      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        selectedProject={selectedProject}
        onBackToDashboard={handleBackToDashboard}
      />

      {/* VIEW 1: DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 md:px-8 py-8 flex-1">
          {/* Welcome Banner - Clean Off-White / Cream with Red Accent */}
          <div className="bg-white border border-stone-200 border-l-4 border-l-red-600 rounded-lg p-6 sm:p-8 mb-8 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded inline-block mb-3">
              CSE Learning Platform
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Understand your software project one idea at a time.
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed font-sans">
              ProjectXplain transforms raw software concepts into structured architectural blueprints — covering functional requirements, agile user stories, relational schemas, REST APIs, and core engineering principles.
            </p>
          </div>

          {/* Section Header */}
          <PageHeader
            title="My Projects"
            subtitle="Browse your active project workspaces or initiate a new system design."
            action={
              <Button
                variant="primary"
                onClick={() => {
                  setMessage('');
                  setIsError(false);
                  setCurrentView('create');
                }}
              >
                + New Project
              </Button>
            }
          />

          {/* Feedback banner */}
          {message && (
            <div
              className={`p-3.5 rounded text-xs sm:text-sm mb-6 ${
                isError
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-stone-100 text-stone-800 border border-stone-300'
              }`}
            >
              {message}
            </div>
          )}

          {loadingProjects ? (
            <div className="p-16 text-center text-xs sm:text-sm text-stone-500 bg-white border border-stone-200 rounded-lg">
              Loading your projects...
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects found"
              message="Get started by creating your first software project blueprint."
              action={
                <Button
                  onClick={() => {
                    setMessage('');
                    setCurrentView('create');
                  }}
                >
                  + New Project
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  padding="p-5"
                  className="flex flex-col justify-between border-stone-200 hover:border-red-300 hover:shadow-xs transition-all duration-150 group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-red-700 transition-colors">
                        {project.name}
                      </h3>
                      <span className="text-[11px] font-medium text-stone-400 shrink-0">
                        {formatDate(project.created_at)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 mt-3 line-clamp-3 leading-relaxed">
                      {project.idea}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openProject(project.id)}
                    >
                      Open Project &rarr;
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CREATE PROJECT VIEW */}
      {currentView === 'create' && (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 flex-1">
          <Card padding="p-6 sm:p-8" className="border-stone-200">
            <PageHeader
              title="Create New Project"
              subtitle="Describe your project vision and start architecting its modules."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBackToDashboard}
                >
                  &larr; Back
                </Button>
              }
            />

            {message && (
              <div
                className={`p-3.5 rounded text-xs sm:text-sm mb-5 ${
                  isError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-stone-100 text-stone-800 border border-stone-300'
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="projectName"
                label="Project Name"
                required
                placeholder="e.g. CrickArena, DevConnect, CodeReviewer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />

              <Textarea
                id="projectIdea"
                label="Project Idea & Problem Statement"
                required
                rows={4}
                placeholder="Describe what problem this project solves and the core features you envision..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                disabled={isSubmitting}
              />

              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Project...' : 'Create Project'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBackToDashboard}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* VIEW 3: PROJECT DETAIL / WORKSPACE VIEW */}
      {currentView === 'detail' && (
        <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 md:px-8 py-6 flex-1 flex flex-col">
          {loadingDetail ? (
            <div className="p-16 text-center text-xs sm:text-sm text-stone-500 bg-white rounded-lg border border-stone-200 shadow-2xs">
              Loading project details...
            </div>
          ) : detailError ? (
            <div className="p-4 rounded text-xs sm:text-sm bg-red-50 text-red-800 border border-red-200">
              {detailError}
            </div>
          ) : selectedProject ? (
            <div className="bg-white border border-stone-200 rounded-lg shadow-2xs overflow-hidden flex flex-col md:flex-row flex-1 min-h-[700px]">
              {/* Left Sidebar */}
              <ProjectSidebar
                activeSection={activeSection}
                onSelectSection={setActiveSection}
                counts={counts}
              />

              {/* Main Content Area - Wide & Balanced */}
              <main className="flex-1 min-w-0 p-5 sm:p-7 md:p-8 bg-white overflow-y-auto">
                {activeSection === 'overview' && (
                  <ProjectOverview
                    project={selectedProject}
                    formatDate={formatDate}
                    progressModules={progressModules}
                    counts={counts}
                    onNavigate={setActiveSection}
                  />
                )}

                {activeSection === 'requirements' && (
                  <Requirements
                    requirements={requirements}
                    loadingRequirements={loadingRequirements}
                    showAddReqForm={showAddReqForm}
                    setShowAddReqForm={setShowAddReqForm}
                    reqTitle={reqTitle}
                    setReqTitle={setReqTitle}
                    reqDescription={reqDescription}
                    setReqDescription={setReqDescription}
                    reqPriority={reqPriority}
                    setReqPriority={setReqPriority}
                    isSavingReq={isSavingReq}
                    reqMessage={reqMessage}
                    setReqMessage={setReqMessage}
                    isReqError={isReqError}
                    handleCreateRequirement={handleCreateRequirement}
                    handleDeleteRequirement={handleDeleteRequirement}
                    userStoriesMap={userStoriesMap}
                    showStoryFormMap={showStoryFormMap}
                    setShowStoryFormMap={setShowStoryFormMap}
                    storyInputMap={storyInputMap}
                    setStoryInputMap={setStoryInputMap}
                    storyLoadingMap={storyLoadingMap}
                    storySavingMap={storySavingMap}
                    storyErrorMap={storyErrorMap}
                    handleCreateUserStory={handleCreateUserStory}
                    handleDeleteUserStory={handleDeleteUserStory}
                  />
                )}

                {activeSection === 'user-stories' && (
                  <UserStories
                    requirements={requirements}
                    userStoriesMap={userStoriesMap}
                    storyInputMap={storyInputMap}
                    setStoryInputMap={setStoryInputMap}
                    storySavingMap={storySavingMap}
                    storyErrorMap={storyErrorMap}
                    handleCreateUserStory={handleCreateUserStory}
                    handleDeleteUserStory={handleDeleteUserStory}
                    onNavigate={setActiveSection}
                  />
                )}

                {activeSection === 'database-design' && (
                  <DatabaseDesign
                    entities={entities}
                    loadingEntities={loadingEntities}
                    showAddEntityForm={showAddEntityForm}
                    setShowAddEntityForm={setShowAddEntityForm}
                    entityName={entityName}
                    setEntityName={setEntityName}
                    entityDescription={entityDescription}
                    setEntityDescription={setEntityDescription}
                    isSavingEntity={isSavingEntity}
                    entityMessage={entityMessage}
                    setEntityMessage={setEntityMessage}
                    isEntityError={isEntityError}
                    handleCreateEntity={handleCreateEntity}
                    handleDeleteEntity={handleDeleteEntity}
                    openEntityMap={openEntityMap}
                    setOpenEntityMap={setOpenEntityMap}
                    attributesMap={attributesMap}
                    showAttrFormMap={showAttrFormMap}
                    setShowAttrFormMap={setShowAttrFormMap}
                    attrInputMap={attrInputMap}
                    setAttrInputMap={setAttrInputMap}
                    attrSavingMap={attrSavingMap}
                    attrErrorMap={attrErrorMap}
                    handleCreateAttribute={handleCreateAttribute}
                    handleDeleteAttribute={handleDeleteAttribute}
                    dbRelationships={dbRelationships}
                    loadingRelationships={loadingRelationships}
                    showAddRelForm={showAddRelForm}
                    setShowAddRelForm={setShowAddRelForm}
                    relFromEntityId={relFromEntityId}
                    setRelFromEntityId={setRelFromEntityId}
                    relToEntityId={relToEntityId}
                    setRelToEntityId={setRelToEntityId}
                    relType={relType}
                    setRelType={setRelType}
                    isSavingRel={isSavingRel}
                    relMessage={relMessage}
                    setRelMessage={setRelMessage}
                    isRelError={isRelError}
                    handleCreateRelationship={handleCreateRelationship}
                    handleDeleteRelationship={handleDeleteRelationship}
                  />
                )}

                {activeSection === 'api-design' && (
                  <ApiDesign
                    apiEndpoints={apiEndpoints}
                    loadingApiEndpoints={loadingApiEndpoints}
                    showAddApiForm={showAddApiForm}
                    setShowAddApiForm={setShowAddApiForm}
                    apiName={apiName}
                    setApiName={setApiName}
                    apiMethod={apiMethod}
                    setApiMethod={setApiMethod}
                    apiEndpoint={apiEndpoint}
                    setApiEndpoint={setApiEndpoint}
                    apiDescription={apiDescription}
                    setApiDescription={setApiDescription}
                    apiRequestBody={apiRequestBody}
                    setApiRequestBody={setApiRequestBody}
                    apiResponseBody={apiResponseBody}
                    setApiResponseBody={setApiResponseBody}
                    isSavingApi={isSavingApi}
                    apiMessage={apiMessage}
                    setApiMessage={setApiMessage}
                    isApiError={isApiError}
                    handleCreateApi={handleCreateApi}
                    handleDeleteApi={handleDeleteApi}
                  />
                )}

                {activeSection === 'architecture' && (
                  <SystemArchitecture
                    components={archComponents}
                    loadingComponents={loadingComponents}
                    showAddCompForm={showAddCompForm}
                    setShowAddCompForm={setShowAddCompForm}
                    compName={compName}
                    setCompName={setCompName}
                    compType={compType}
                    setCompType={setCompType}
                    compDescription={compDescription}
                    setCompDescription={setCompDescription}
                    isSavingComp={isSavingComp}
                    compMessage={compMessage}
                    setCompMessage={setCompMessage}
                    isCompError={isCompError}
                    handleCreateComponent={handleCreateComponent}
                    handleDeleteComponent={handleDeleteComponent}
                    connections={archConnections}
                    loadingConnections={loadingConnections}
                    showAddConnForm={showAddConnForm}
                    setShowAddConnForm={setShowAddConnForm}
                    connFromId={connFromId}
                    setConnFromId={setConnFromId}
                    connToId={connToId}
                    setConnToId={setConnToId}
                    connDescription={connDescription}
                    setConnDescription={setConnDescription}
                    isSavingConn={isSavingConn}
                    connMessage={connMessage}
                    setConnMessage={setConnMessage}
                    isConnError={isConnError}
                    handleCreateConnection={handleCreateConnection}
                    handleDeleteConnection={handleDeleteConnection}
                  />
                )}

                {activeSection === 'data-flow' && (
                  <DataFlow
                    dataFlowSteps={dataFlowSteps}
                    loadingDataFlowSteps={loadingDataFlowSteps}
                    showAddStepForm={showAddStepForm}
                    setShowAddStepForm={setShowAddStepForm}
                    stepNumber={stepNumber}
                    setStepNumber={setStepNumber}
                    flowFromCompId={flowFromCompId}
                    setFlowFromCompId={setFlowFromCompId}
                    flowToCompId={flowToCompId}
                    setFlowToCompId={setFlowToCompId}
                    flowApiId={flowApiId}
                    setFlowApiId={setFlowApiId}
                    flowAction={flowAction}
                    setFlowAction={setFlowAction}
                    flowMethod={flowMethod}
                    setFlowMethod={setFlowMethod}
                    flowDescription={flowDescription}
                    setFlowDescription={setFlowDescription}
                    isSavingStep={isSavingStep}
                    flowMessage={flowMessage}
                    setFlowMessage={setFlowMessage}
                    isFlowError={isFlowError}
                    handleCreateDataFlowStep={handleCreateDataFlowStep}
                    handleDeleteDataFlowStep={handleDeleteDataFlowStep}
                    components={archComponents}
                    apiEndpoints={apiEndpoints}
                    onNavigate={setActiveSection}
                  />
                )}

                {activeSection === 'cse-concepts' && (
                  <CseConcepts
                    concepts={cseConcepts}
                    allAvailableConcepts={allAvailableConcepts}
                    subjects={cseSubjects}
                    loading={loadingCseConcepts}
                    onAssociateConcept={handleAssociateConcept}
                    onRemoveConcept={handleRemoveConcept}
                    onNavigate={setActiveSection}
                  />
                )}

                {activeSection === 'ai-mentor' && (
                  <AIMentor
                    project={selectedProject}
                    onNavigate={setActiveSection}
                  />
                )}
              </main>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;