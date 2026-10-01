# API Design Specification

This document provides the complete API design specification for **ProjectXplain**. 

> [!IMPORTANT]
> **CRITICAL ARCHITECTURAL DISTINCTION**:
> 1. **Section A (Platform APIs)** documents the **actual HTTP REST APIs implemented by the ProjectXplain Node.js/Express backend** (`http://localhost:4000/api/...`) that power the web platform.
> 2. **Section B (Educational Project-Designed APIs)** documents the **educational metadata recorded by students under Feature 6** (e.g., `POST /api/matches`, `GET /api/inventory`). These are project design artifacts stored in the `api_endpoints` database table and are NOT routes implemented on the ProjectXplain backend.

---

## Section A: ProjectXplain Platform Backend REST APIs

These endpoints are implemented in `backend/routes/` and handled by `backend/controllers/`. All routes return JSON responses.

### A.1 Health & Service Verification
- **GET `/api/health`**
  - *Controller*: `healthController.js`
  - *Description*: Verifies server execution and connectivity.
  - *Response (200)*:
    ```json
    {
      "status": "ok",
      "service": "projectxplain-backend"
    }
    ```

### A.2 Project Management (Features 1 & 2)
- **POST `/api/projects`**
  - *Controller*: `projectController.createProject`
  - *Description*: Creates a new project workspace.
  - *Request Body*: `{ "name": "Blood Bank Portal", "idea": "An online platform connecting voluntary blood donors with patients." }`
  - *Response (201)*: `{ "message": "Project created successfully", "project": { "id": 1, "name": "...", "idea": "..." } }`
  - *Errors*: `400 Bad Request` (missing name/idea), `500 Internal Server Error`.

- **GET `/api/projects`**
  - *Controller*: `projectController.getAllProjects`
  - *Description*: Retrieves all projects sorted by `created_at DESC`.
  - *Response (200)*: Array of project objects `[{ "id": 1, "name": "...", "idea": "...", "created_at": "..." }]`.

- **GET `/api/projects/:id`**
  - *Controller*: `projectController.getProjectById`
  - *Description*: Retrieves metadata for a single project.
  - *Response (200)*: Project object.
  - *Errors*: `404 Not Found`, `500 Internal Server Error`.

### A.3 Requirements & User Stories (Features 3 & 4)
- **GET `/api/projects/:projectId/requirements`**: Returns all requirements for the project.
- **POST `/api/projects/:projectId/requirements`**: Creates a requirement (`title`, `description`, `priority`).
- **DELETE `/api/requirements/:id`**: Deletes a requirement and cascades to associated user stories.
- **GET `/api/requirements/:requirementId/user-stories`**: Returns all user stories under a specific requirement.
- **POST `/api/requirements/:requirementId/user-stories`**: Creates a user story (`title`, `description`).
- **DELETE `/api/user-stories/:id`**: Deletes a single user story.

### A.4 Database Design Management (Feature 5)
- **GET `/api/projects/:projectId/entities`**: Retrieves all database entities for the project.
- **POST `/api/projects/:projectId/entities`**: Creates an entity (`name`, `description`).
- **DELETE `/api/entities/:id`**: Deletes an entity and cascades to attributes and relationships.
- **GET `/api/entities/:entityId/attributes`**: Retrieves attributes for a specific entity.
- **POST `/api/entities/:entityId/attributes`**: Adds an attribute (`name`, `data_type`, `key_type`).
- **DELETE `/api/attributes/:id`**: Deletes an attribute.
- **GET `/api/projects/:projectId/relationships`**: Retrieves entity relationships for the project.
- **POST `/api/projects/:projectId/relationships`**: Creates a relationship (`from_entity_id`, `to_entity_id`, `relationship_type`).
- **DELETE `/api/relationships/:id`**: Deletes an entity relationship.

### A.5 API Design Management (Feature 6)
- **GET `/api/projects/:projectId/apis`**: Retrieves all documented APIs designed for the student's project.
- **POST `/api/projects/:projectId/apis`**: Creates a documented API record (`name`, `method`, `endpoint`, `description`, `request_body`, `response_body`).
- **DELETE `/api/apis/:id`**: Deletes a documented API record.

### A.6 System Architecture Management (Feature 7)
- **GET `/api/projects/:projectId/architecture/components`**: Retrieves all architecture components.
- **POST `/api/projects/:projectId/architecture/components`**: Creates a component (`name`, `type`, `description`).
- **DELETE `/api/architecture/components/:id`**: Deletes a component and cascades to connections.
- **GET `/api/projects/:projectId/architecture/connections`**: Retrieves all architecture connections.
- **POST `/api/projects/:projectId/architecture/connections`**: Creates a connection (`from_component_id`, `to_component_id`, `description`).
- **DELETE `/api/architecture/connections/:id`**: Deletes an architecture connection.

### A.7 Request / Data Flow Management (Feature 8)
- **GET `/api/projects/:projectId/data-flow`**: Retrieves ordered data flow steps for the project.
- **POST `/api/projects/:projectId/data-flow`**: Creates a flow step (`step_number`, `from_component_id`, `to_component_id`, `api_id`, `action`, `method`, `description`).
- **DELETE `/api/data-flow/:id`**: Deletes a data flow step.

### A.8 CSE Concepts Management (Feature 9)
- **GET `/api/cse-concepts/subjects`**: Retrieves all 5 predefined curriculum subjects.
- **GET `/api/cse-concepts`**: Retrieves all 17 predefined educational concepts.
- **GET `/api/projects/:projectId/cse-concepts`**: Retrieves concepts mapped to the specified project with custom student reasoning.
- **POST `/api/projects/:projectId/cse-concepts`**: Maps a concept to the project (`concept_id`, `reason`).
- **DELETE `/api/project-concepts/:id`**: Removes a concept mapping.

### A.9 AI Mentor (Feature 10)
- **POST `/api/projects/:projectId/mentor`**
  - *Controller*: `mentorController.askMentor`
  - *Description*: Assembles comprehensive project context (Features 1–9) and sends query to OpenRouter (`openrouter/free`).
  - *Request Body*: `{ "question": "Explain how my database design demonstrates referential integrity." }`
  - *Response (200)*:
    ```json
    {
      "answer": "In your project, referential integrity is enforced by foreign keys linking the 'orders' table to the 'users' table via user_id..."
    }
    ```
  - *Errors*: `400 Bad Request` (invalid projectId / empty question), `404 Not Found` (project missing), `500 Internal Server Error` (missing API key or upstream API error).

---

## Section B: Educational Project-Designed APIs (Feature 6)

When students use Feature 6 in the ProjectXplain UI, they document APIs intended for their *own* application. For example:

| Field | Example Project API #1 | Example Project API #2 |
| :--- | :--- | :--- |
| **API Name** | Register Donor | Match Donors |
| **HTTP Method** | `POST` | `GET` |
| **URI Endpoint** | `/api/donors/register` | `/api/matches?blood_group=O_POS` |
| **Description** | Registers a new blood donor with contact details and location. | Finds compatible donors within a specified geographic radius. |
| **Request Body** | `{"name":"Aman","blood_group":"O+","city":"Prayagraj"}` | *None (Query Params)* |
| **Response Body** | `{"status":"success","donor_id":102}` | `{"matches":[{"donor_id":102,"name":"Aman"}]}` |

**Key Clarification for Evaluators**:
These definitions are stored as data rows inside ProjectXplain's `api_endpoints` table. ProjectXplain does not execute or host these mock endpoints; rather, it allows students to structure and learn API specification principles.
