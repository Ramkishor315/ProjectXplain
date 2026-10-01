# Functional Requirements

This document specifies the functional requirements for **ProjectXplain** based on the actual verified implementation in the repository.

---

### FR-01: Project Creation
- **ID**: `FR-01`
- **Feature**: Feature 1 (Create Project)
- **Description**: The system shall allow a student to register a new software engineering project idea.
- **Input**:
  - `name`: String (required, non-empty, trimmed)
  - `idea`: Text (required, non-empty, trimmed description of problem and concept)
- **Processing**:
  - Validates that both `name` and `idea` are provided and non-empty.
  - Inserts a record into the `projects` table with the current timestamp.
- **Output**: HTTP 201 Created with JSON containing `id`, `name`, and `idea`.
- **Validation / Error Cases**: Returns HTTP 400 if `name` or `idea` is missing or whitespace-only; returns HTTP 500 if database insertion fails.

---

### FR-02: Project Listing and Navigation
- **ID**: `FR-02`
- **Feature**: Feature 1 (View Projects)
- **Description**: The system shall display all existing projects in reverse chronological order and allow the user to select any project to open its dedicated workspace.
- **Input**: None (HTTP GET request).
- **Processing**:
  - Queries `projects` table ordered by `created_at DESC`.
- **Output**: Array of project objects (`id`, `name`, `idea`, `created_at`).
- **UI Interaction**: User clicks a project card to load the project detail workspace.

---

### FR-03: Project Overview Dashboard
- **ID**: `FR-03`
- **Feature**: Feature 2 (Project Dashboard)
- **Description**: The system shall provide an aggregate overview dashboard for a selected project, displaying project metadata and live counts of all associated design artifacts.
- **Input**: `projectId` (numeric URL parameter).
- **Processing**:
  - Aggregates counts across: requirements, user stories, database entities, documented APIs, architecture components, data flow steps, and mapped CSE concepts.
- **Output**: High-level statistical cards, quick-navigation action links, and project description summary.

---

### FR-04: Requirements Management
- **ID**: `FR-04`
- **Feature**: Feature 3 (Requirements)
- **Description**: The system shall allow students to create, list, and delete functional requirements associated with the project, assigning explicit priority levels.
- **Input**:
  - Creation: `title` (required string <= 150 chars), `description` (required text), `priority` (`High`, `Medium`, or `Low`).
  - Deletion: `id` (requirement ID).
- **Processing**:
  - Creates record in `requirements` linked via foreign key `project_id -> projects(id)` with `ON DELETE CASCADE`.
  - On delete, removes requirement and cascades deletion to child user stories.
- **Output**: Real-time updated list of requirements tagged with priority badges.

---

### FR-05: User Stories & Use Cases Management
- **ID**: `FR-05`
- **Feature**: Feature 4 (User Stories / Use Cases)
- **Description**: The system shall allow students to break down specific requirements into user stories following agile formatting.
- **Input**:
  - `requirementId` (parent requirement ID).
  - `title` (required string <= 150 chars), `description` (required text, typically "As a... I want to... so that...").
- **Processing**:
  - Stores story in `user_stories` referencing `requirement_id -> requirements(id)` with `ON DELETE CASCADE`.
- **Output**: Grouped user story cards nested under their respective parent requirements.

---

### FR-06: Relational Database Design
- **ID**: `FR-06`
- **Feature**: Feature 5 (Database Design)
- **Description**: The system shall allow students to design relational schemas by defining entities, entity attributes, and inter-entity relationships.
- **Sub-capabilities**:
  - **FR-06.1 (Entities)**: Create/delete database entities (`name`, `description`).
  - **FR-06.2 (Attributes)**: Add/delete attributes belonging to an entity (`name`, `data_type`, `key_type` from `['None', 'Primary Key', 'Foreign Key']`).
  - **FR-06.3 (Relationships)**: Define relationships between entities (`from_entity_id`, `to_entity_id`, `relationship_type` from `['One-to-One', 'One-to-Many', 'Many-to-Many']`).
  - **FR-06.4 (Schema Viewer)**: Visual summary cards presenting tables, column constraints, and relationship paths.
- **Processing**: Enforces relational integrity with cascade deletes on MySQL tables `database_entities`, `entity_attributes`, `entity_relationships`.

---

### FR-07: REST API Design & Documentation
- **ID**: `FR-07`
- **Feature**: Feature 6 (API Design)
- **Description**: The system shall allow students to document planned RESTful API endpoints for their project.
- **Input**:
  - `name`: Feature/action name (e.g., "User Registration").
  - `method`: HTTP method (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`).
  - `endpoint`: Resource path (e.g., `/api/users/register`).
  - `description`: Text explanation.
  - `request_body`: Optional JSON string.
  - `response_body`: Optional JSON string.
- **Processing**:
  - Saves record in `api_endpoints` linked to `project_id`.
- **Output**: Formatted API catalog displaying method badges, URI routes, and expandable JSON schema previews.
- **Clarification**: These represent the student's *intended software APIs*, not the ProjectXplain backend routes.

---

### FR-08: System Architecture Modeling
- **ID**: `FR-08`
- **Feature**: Feature 7 (System Architecture)
- **Description**: The system shall allow students to model system components and communication paths representing high-level system architecture.
- **Sub-capabilities**:
  - **FR-08.1 (Components)**: Add/delete components specifying `name`, `type` (`Frontend`, `Backend`, `Database`, `Service`, `External API`, `Cache`, `Other`), and `description`.
  - **FR-08.2 (Connections)**: Define directed communication links specifying `from_component_id`, `to_component_id`, and `description`.
- **Output**: Visual component cards categorized by architectural layer with active connection badges.

---

### FR-09: Request & Data Flow Tracing
- **ID**: `FR-09`
- **Feature**: Feature 8 (Request / Data Flow)
- **Description**: The system shall allow students to define sequential lifecycle flow steps tracing how data moves through components during a specific transaction.
- **Input**:
  - `step_number`: Positive integer ordering the sequence.
  - `from_component_id`: Source component (foreign key).
  - `to_component_id`: Target component (foreign key).
  - `api_id`: Optional reference to a documented API endpoint (foreign key).
  - `action`: Short summary of the operation (e.g., "Submit registration form").
  - `method`: Protocol method (e.g., "POST", "SQL QUERY", "TCP").
  - `description`: Detailed explanation of data transformation and validation.
- **Processing**:
  - Validates components and saves into `data_flow_steps`.
- **Output**: Ordered visual flowchart cards illustrating data traversal across the architectural tiers.

---

### FR-10: CSE Concepts Knowledge Base & Project Mapping
- **ID**: `FR-10`
- **Feature**: Feature 9 (CSE Concepts)
- **Description**: The system shall provide a deterministic repository of foundational Computer Science concepts and allow students to map them to their project with explicit educational justification.
- **Sub-capabilities**:
  - **FR-10.1 (Curriculum Catalog)**: Display predefined concepts categorized by 5 subjects (DBMS, Computer Networks, OOPS, Operating Systems, System Design).
  - **FR-10.2 (Concept Details)**: Present 4 structured educational facets for each concept: Definition/Explanation, Project Relevance, Project Usage, and What to Learn for Viva.
  - **FR-10.3 (Project Mapping)**: Allow students to attach a concept to their project with a custom `reason` explaining how their specific code implements that concept.
  - **FR-10.4 (Removal)**: Allow students to unlink concepts from their project.

---

### FR-11: Context-Aware AI Mentor Viva Preparation
- **ID**: `FR-11`
- **Feature**: Feature 10 (AI Mentor)
- **Description**: The system shall provide an interactive AI-assisted mentor to prepare students for technical defense and viva voce evaluations.
- **Input**:
  - `projectId`: Current active project identifier.
  - `question`: Natural language student question or viva query.
- **Processing**:
  - Backend retrieves project information and records across Features 1 through 9.
  - Assembles a structured system prompt and comprehensive context string.
  - Sends query server-side via OpenAI SDK pointing to OpenRouter API (`openrouter/free`).
  - Strict privacy: `OPENROUTER_API_KEY` remains server-side only in `.env`.
- **Output**: Student-friendly markdown response explaining theoretical concepts, suggesting viva answers, or identifying architectural gaps based strictly on the student's project context.
