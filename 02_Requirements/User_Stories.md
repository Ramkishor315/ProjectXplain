# User Stories

This document specifies the user stories for **ProjectXplain** along with their acceptance criteria, grounded in the actual implemented features.

---

### US-01: Create and Initialize Project
**As a** CSE student starting a software project,  
**I want to** enter my project's name and high-level problem idea,  
**so that** I can create a dedicated workspace to systematically design and understand my application.

#### Acceptance Criteria:
1. The student must provide a non-empty name and idea.
2. If either field is empty, the interface displays a validation error message.
3. Upon submission, the project is stored in the database, and the user is redirected to the active project workspace.

---

### US-02: View Projects List and Switch Workspaces
**As a** student or evaluator,  
**I want to** see a list of all created projects and select any of them,  
**so that** I can switch between different project design workspaces seamlessly.

#### Acceptance Criteria:
1. The dashboard displays all projects sorted by creation date (newest first).
2. Each card shows the project name, creation date, and an excerpt of the idea.
3. Clicking "Open Project" or the project card loads the specific project's overview.

---

### US-03: View Project Overview Dashboard
**As a** student working on my project,  
**I want to** view a central dashboard displaying summary statistics of all my project artifacts,  
**so that** I can quickly gauge the completeness of my requirements, database schema, APIs, architecture, and theoretical mappings.

#### Acceptance Criteria:
1. Displays count metrics for requirements, user stories, database tables, APIs, architecture components, data flow steps, and mapped concepts.
2. Provides quick links to jump directly to any design stage.

---

### US-04: Document Functional Requirements with Priorities
**As a** student software designer,  
**I want to** create and organize requirements with explicit priority levels (High, Medium, Low),  
**so that** I can establish a clear development hierarchy for my project.

#### Acceptance Criteria:
1. A form allows input of requirement title, detailed description, and priority dropdown.
2. Requirements appear in a list displaying color-coded priority badges.
3. Deleting a requirement removes it from the database and automatically cleans up any nested user stories.

---

### US-05: Deconstruct Requirements into User Stories
**As a** student learning agile methods,  
**I want to** add user stories directly underneath a specific requirement,  
**so that** I can express feature functionality from the perspective of end users.

#### Acceptance Criteria:
1. User stories can be added under any existing requirement.
2. Displays standard "As a... I want to... so that..." formatting or title and description.
3. Deleting a user story removes the single record without affecting the parent requirement.

---

### US-06: Model Relational Database Schema
**As a** student designing the data layer,  
**I want to** define database entities, add attributes with data types and key constraints, and establish relationships,  
**so that** I can build a normalized database design for my project.

#### Acceptance Criteria:
1. Allows creation of entities (e.g., `Users`, `Orders`).
2. Attributes can be added to an entity with specific data types (`INT`, `VARCHAR`, `TEXT`, `TIMESTAMP`, etc.) and key roles (`Primary Key`, `Foreign Key`, `None`).
3. Relationships can be declared between two entities with cardinality (`One-to-One`, `One-to-Many`, `Many-to-Many`).
4. A dedicated Schema View displays a summary of the entire relational structure.

---

### US-07: Design and Document RESTful APIs
**As a** student building a client-server application,  
**I want to** document the HTTP method, endpoint route, description, and request/response payloads for planned APIs,  
**so that** I can clearly understand the communication contract between my frontend and backend.

#### Acceptance Criteria:
1. Allows specification of HTTP method (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`), URI endpoint, description, request body JSON, and response body JSON.
2. The catalog clearly displays color-coded HTTP method badges.
3. Deleting an API removes its documentation card.

---

### US-08: Model System Architecture and Connections
**As a** student presenting my software structure,  
**I want to** identify my system components and draw connections between them,  
**so that** I can articulate my high-level multi-tier architecture to project examiners.

#### Acceptance Criteria:
1. Components can be created with types: `Frontend`, `Backend`, `Database`, `Service`, `External API`, `Cache`, `Other`.
2. Connections can be established from one component to another with a communication description.
3. Components and their active relationships are displayed in a clean, categorized layout.

---

### US-09: Trace Request and Data Flow Steps
**As a** student preparing to explain how an operation works end-to-end,  
**I want to** define step-by-step sequential flows between components, linking actions to documented APIs,  
**so that** I can visualize the entire journey of an HTTP request and database transaction.

#### Acceptance Criteria:
1. Steps are ordered chronologically by `step_number`.
2. Each step specifies the source component, target component, action taken, method, and optional linked API endpoint.
3. The interface displays an ordered sequence of flow cards showing the step number, communication path, and operational details.

---

### US-10: Connect CSE Curriculum Concepts to the Project
**As a** student preparing for viva voce examinations,  
**I want to** explore fundamental CSE concepts across DBMS, Networks, OOPS, OS, and System Design, and map them to my project with my own reasoning,  
**so that** I can confidently explain the theoretical basis of my project code to faculty evaluators.

#### Acceptance Criteria:
1. Browse 17 core concepts categorized under 5 foundational subjects.
2. Each concept presents its definition, project relevance, project usage, and viva review topics.
3. Students can map a concept to their project by providing a customized justification.
4. Mapped concepts are prominently highlighted on the project dashboard and concepts tab.

---

### US-11: Prepare with the Context-Aware AI Mentor
**As a** student seeking interactive viva coaching,  
**I want to** ask natural language questions to an AI Mentor that understands my entire project's requirements, database, APIs, and architecture,  
**so that** I can receive personalized viva practice questions and explanations without revealing private API keys.

#### Acceptance Criteria:
1. The student submits a question via a conversational input prompt.
2. The backend automatically injects the active project's complete design context (Features 1–9) into the prompt sent to OpenRouter.
3. The AI Mentor responds with tailored explanations grounded in the student's actual tables, APIs, and components.
4. API keys are strictly kept server-side and never exposed to the client.
