# Use Case Specifications

This document outlines the primary use cases supported by **ProjectXplain**, detailing actors, preconditions, triggers, main success scenarios, and alternative flows.

---

### UC-01: Create and Initialize a New Project
- **Primary Actor**: Undergraduate CSE Student
- **Preconditions**: ProjectXplain web application and backend server are running and connected to MySQL.
- **Trigger**: User navigates to the "Create Project" screen and submits the form.
- **Main Success Scenario**:
  1. User enters the Project Name and Project Idea in the input form.
  2. User clicks the "Create Project" button.
  3. Frontend sends `POST /api/projects` with JSON payload `{ name, idea }`.
  4. Backend validates that both fields are non-empty and inserts the record into MySQL `projects` table.
  5. Backend returns HTTP 201 with created project ID.
  6. Frontend updates local project state and navigates user to the Project Overview dashboard.
- **Alternate / Exception Flows**:
  - *4a. Missing name or idea*: Backend returns HTTP 400 `{ error: 'Project name and idea are required' }`. Frontend displays an inline error alert and prevents submission.
  - *4b. Database failure*: Backend returns HTTP 500 `{ error: 'Failed to create project in database' }`. Frontend displays an error notification.
- **Postconditions**: New project is persisted in MySQL and available in the projects list.

---

### UC-02: Manage Requirements and User Stories
- **Primary Actor**: Undergraduate CSE Student
- **Preconditions**: A project has been created and selected.
- **Trigger**: User selects the "Requirements" or "User Stories" tab in the workspace sidebar.
- **Main Success Scenario**:
  1. System loads and displays all existing requirements for the project via `GET /api/projects/:projectId/requirements`.
  2. User clicks "Add Requirement", enters title, description, and selects priority (`High`, `Medium`, or `Low`).
  3. Frontend sends `POST /api/projects/:projectId/requirements`.
  4. Backend persists the requirement to MySQL and returns the inserted object.
  5. User navigates to "User Stories" tab and clicks "Add Story" under a specific requirement card.
  6. Frontend sends `POST /api/requirements/:requirementId/user-stories`.
  7. Backend persists user story referencing the parent requirement ID.
- **Alternate / Exception Flows**:
  - *Requirement Deletion*: If user deletes a requirement (`DELETE /api/requirements/:id`), MySQL executes `ON DELETE CASCADE`, automatically removing all linked user stories.
- **Postconditions**: Structured requirements hierarchy is persisted and reflected in the project dashboard counts.

---

### UC-03: Design Relational Database Schema
- **Primary Actor**: Undergraduate CSE Student
- **Preconditions**: Project is open in the workspace.
- **Trigger**: User navigates to the "Database Design" tab.
- **Main Success Scenario**:
  1. User creates a database entity (e.g., `Students`) via `POST /api/projects/:projectId/entities`.
  2. Entity card is rendered. User expands the entity and adds attributes (e.g., `id`, `name`, `email`) specifying data types and key constraints (`Primary Key`, `Foreign Key`, `None`) via `POST /api/entities/:entityId/attributes`.
  3. User defines a relationship linking two entities (e.g., `Students` to `Enrollments` as `One-to-Many`) via `POST /api/projects/:projectId/relationships`.
  4. User views the live Schema View summarizing table structures, column definitions, and relationship maps.
- **Alternate / Exception Flows**:
  - *Entity Deletion*: Deleting an entity cascades removal of its associated attributes and relationship records in MySQL.
- **Postconditions**: Normalized schema metadata is stored in MySQL tables `database_entities`, `entity_attributes`, and `entity_relationships`.

---

### UC-04: Document Project REST API Endpoints
- **Primary Actor**: Undergraduate CSE Student
- **Preconditions**: Project is open in the workspace.
- **Trigger**: User navigates to the "API Design" tab.
- **Main Success Scenario**:
  1. System displays previously documented APIs via `GET /api/projects/:projectId/apis`.
  2. User clicks "Add API Endpoint" and enters:
     - Name (e.g., "Submit Assignment")
     - Method (`POST`)
     - Endpoint (`/api/assignments/submit`)
     - Description
     - Sample Request Body JSON
     - Sample Response Body JSON
  3. User clicks "Save API".
  4. Frontend sends `POST /api/projects/:projectId/apis`.
  5. Backend persists definition into `api_endpoints` and returns HTTP 201.
  6. Endpoint card is displayed in the catalog with colored HTTP method badges.
- **Postconditions**: Planned project API specification is recorded for architecture and viva reference.

---

### UC-05: Model System Architecture and Request/Data Flow
- **Primary Actor**: Undergraduate CSE Student
- **Preconditions**: Project is open; components and optional APIs are planned.
- **Trigger**: User navigates to "System Architecture" and "Request / Data Flow" tabs.
- **Main Success Scenario**:
  1. In System Architecture, user creates components (e.g., `React Frontend` [Frontend], `Express Server` [Backend], `MySQL DB` [Database]) via `POST /api/projects/:projectId/architecture/components`.
  2. User creates architecture connections (e.g., `React Frontend` → `Express Server`) via `POST /api/projects/:projectId/architecture/connections`.
  3. User switches to "Request / Data Flow" tab and adds ordered flow steps:
     - Step 1: `React Frontend` → `Express Server` [POST] "Submit Registration" (linked to documented API).
     - Step 2: `Express Server` → `MySQL DB` [SQL Query] "Insert user record into users table".
  4. Backend validates component foreign keys and stores ordered steps in `data_flow_steps`.
- **Postconditions**: System architecture and sequential runtime trace are saved and visible as cards.

---

### UC-06: Map CSE Curriculum Concepts to the Project
- **Primary Actor**: Undergraduate CSE Student
- **Preconditions**: Project is open in workspace.
- **Trigger**: User opens the "CSE Concepts" tab.
- **Main Success Scenario**:
  1. System queries seeded curriculum concepts via `GET /api/cse-concepts` and active mappings via `GET /api/projects/:projectId/cse-concepts`.
  2. User reviews concepts across DBMS, Computer Networks, OOPS, Operating Systems, and System Design.
  3. User clicks "Map to Project" on a concept (e.g., "Relational Database" under DBMS).
  4. A modal/form prompts the user to supply their project context: *"Why is this concept relevant to your project?"*
  5. User enters reasoning (e.g., *"Our project uses MySQL with foreign keys to guarantee referential integrity across users and orders"*).
  6. Frontend sends `POST /api/projects/:projectId/cse-concepts` with `{ concept_id, reason }`.
  7. Backend persists mapping in `project_concepts` table.
- **Postconditions**: Mapped concept is tagged on the project dashboard and concepts view, highlighting viva study points.

---

### UC-07: Engage Context-Aware AI Mentor for Viva Preparation
- **Primary Actor**: Undergraduate CSE Student
- **Preconditions**: Backend server is configured with a valid `OPENROUTER_API_KEY` in `backend/.env`.
- **Trigger**: User opens the "AI Mentor" tab and submits a technical question.
- **Main Success Scenario**:
  1. Student enters a query (e.g., *"What questions can the examiner ask about my database design and API structure?"*).
  2. User clicks "Ask Mentor".
  3. Frontend sends `POST /api/projects/:projectId/mentor` with payload `{ question }`.
  4. Backend controller executes parallel queries across MySQL to gather the complete project state: project name/idea, requirements, user stories, database tables/attributes/relations, APIs, architecture components, data flow steps, and mapped CSE concepts.
  5. Backend synthesizes a structured system prompt and context prompt.
  6. Backend securely sends the payload to OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`) using the server-side API key.
  7. OpenRouter returns AI response generated by `openrouter/free`.
  8. Backend returns `{ answer }` to the frontend.
  9. Frontend renders formatted Markdown answer with student-friendly viva guidance.
- **Alternate / Exception Flows**:
  - *4a. Missing API Key*: Backend returns HTTP 500 `{ error: 'AI Mentor service is not configured (missing OPENROUTER_API_KEY)' }`. Frontend warns the user to set up server configuration.
  - *4b. OpenRouter Network Error*: Backend catches error and returns HTTP 500 with descriptive error message.
  - *4c. Empty Question*: Backend returns HTTP 400 `{ error: 'Please enter a question for the AI Mentor' }`.
- **Postconditions**: Student receives project-tailored viva guidance without client exposing secret keys.
