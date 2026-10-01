# Database Design Specification

This document details the relational database design implemented in **ProjectXplain** using MySQL and managed via `backend/db/connection.js`.

---

## 1. Schema Overview

The database schema comprises **13 tables** structured across five logical functional domains:
1. **Project Management Core**: `projects`
2. **Requirements & User Stories**: `requirements`, `user_stories`
3. **Software Design Artifacts**:
   - Database Design: `database_entities`, `entity_attributes`, `entity_relationships`
   - API Design: `api_endpoints`
   - Architecture: `architecture_components`, `architecture_connections`
   - Data Flow: `data_flow_steps`
4. **Computer Science Curriculum Knowledge Base**: `cse_subjects`, `cse_concepts`
5. **Educational Mapping**: `project_concepts`

---

## 2. Detailed Table Specifications

### 2.1 Table: `projects`
- **Purpose**: Stores the root software project entity and high-level student concept.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique project identifier |
  | `name` | `VARCHAR(150)` | `NOT NULL` | Name of the software project |
  | `idea` | `TEXT` | `NOT NULL` | High-level problem statement and idea description |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Project creation record timestamp |

---

### 2.2 Table: `requirements`
- **Purpose**: Stores functional requirements associated with a project.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique requirement identifier |
  | `project_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `projects(id)` `ON DELETE CASCADE` |
  | `title` | `VARCHAR(150)` | `NOT NULL` | Concise title of the requirement |
  | `description` | `TEXT` | `NOT NULL` | Detailed functional specification |
  | `priority` | `VARCHAR(20)` | `NOT NULL` | Priority level (`High`, `Medium`, `Low`) |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 2.3 Table: `user_stories`
- **Purpose**: Stores agile user stories broken down from parent requirements.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique user story identifier |
  | `requirement_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `requirements(id)` `ON DELETE CASCADE` |
  | `title` | `VARCHAR(150)` | `NOT NULL` | Short title or user role summary |
  | `description` | `TEXT` | `NOT NULL` | User story description ("As a... I want to... so that...") |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 2.4 Table: `database_entities`
- **Purpose**: Represents a database entity/table planned in the student's software project.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique entity identifier |
  | `project_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `projects(id)` `ON DELETE CASCADE` |
  | `name` | `VARCHAR(100)` | `NOT NULL` | Table/entity name (e.g., `users`, `orders`) |
  | `description` | `TEXT` | Nullable | Functional description of the entity |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 2.5 Table: `entity_attributes`
- **Purpose**: Stores fields/columns belonging to a database entity.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique attribute identifier |
  | `entity_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `database_entities(id)` `ON DELETE CASCADE` |
  | `name` | `VARCHAR(100)` | `NOT NULL` | Column/attribute name (e.g., `id`, `email`) |
  | `data_type` | `VARCHAR(50)` | `NOT NULL` | SQL data type (`INT`, `VARCHAR(100)`, `TEXT`, etc.) |
  | `key_type` | `VARCHAR(50)` | `DEFAULT 'None'` | Key constraint (`None`, `Primary Key`, `Foreign Key`) |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 2.6 Table: `entity_relationships`
- **Purpose**: Models relational links between two database entities.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique relationship identifier |
  | `project_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `projects(id)` `ON DELETE CASCADE` |
  | `from_entity_id`| `INT` | `NOT NULL`, `FOREIGN KEY` | References source `database_entities(id)` `ON DELETE CASCADE` |
  | `to_entity_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References target `database_entities(id)` `ON DELETE CASCADE` |
  | `relationship_type`| `VARCHAR(50)`| `NOT NULL` | Cardinality (`One-to-One`, `One-to-Many`, `Many-to-Many`) |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 2.7 Table: `api_endpoints`
- **Purpose**: Stores educational documentation of planned RESTful endpoints for the student's project.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique API record identifier |
  | `project_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `projects(id)` `ON DELETE CASCADE` |
  | `name` | `VARCHAR(100)` | `NOT NULL` | Human-readable operation name |
  | `method` | `VARCHAR(20)` | `NOT NULL` | HTTP method (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) |
  | `endpoint` | `VARCHAR(255)` | `NOT NULL` | URI path pattern (e.g., `/api/matches`) |
  | `description` | `TEXT` | Nullable | Summary of API operation |
  | `request_body` | `TEXT` | Nullable | Documented JSON request payload example |
  | `response_body`| `TEXT` | Nullable | Documented JSON response payload example |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 2.8 Table: `architecture_components`
- **Purpose**: Stores high-level structural components of the student's system.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique component identifier |
  | `project_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `projects(id)` `ON DELETE CASCADE` |
  | `name` | `VARCHAR(100)` | `NOT NULL` | Component name (e.g., `React Frontend`, `Express Server`) |
  | `type` | `VARCHAR(50)` | `NOT NULL` | Architectural tier (`Frontend`, `Backend`, `Database`, etc.) |
  | `description` | `TEXT` | Nullable | Component role and responsibilities |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 2.9 Table: `architecture_connections`
- **Purpose**: Models communication links between architectural components.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique connection identifier |
  | `project_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `projects(id)` `ON DELETE CASCADE` |
  | `from_component_id`| `INT` | `NOT NULL`, `FOREIGN KEY`| References source `architecture_components(id)` `CASCADE` |
  | `to_component_id` | `INT` | `NOT NULL`, `FOREIGN KEY`| References target `architecture_components(id)` `CASCADE` |
  | `description` | `TEXT` | Nullable | Protocol or communication description (e.g., "HTTP REST JSON") |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 2.10 Table: `data_flow_steps`
- **Purpose**: Stores ordered lifecycle steps tracing data movement across components and APIs.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique step identifier |
  | `project_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `projects(id)` `ON DELETE CASCADE` |
  | `step_number` | `INT` | `NOT NULL` | Step order sequence (1, 2, 3...) |
  | `from_component_id`| `INT` | `NOT NULL`, `FOREIGN KEY`| References source `architecture_components(id)` `CASCADE` |
  | `to_component_id` | `INT` | `NOT NULL`, `FOREIGN KEY`| References target `architecture_components(id)` `CASCADE` |
  | `api_id` | `INT` | Nullable, `FOREIGN KEY` | References optional `api_endpoints(id)` `ON DELETE SET NULL` |
  | `action` | `VARCHAR(150)`| `NOT NULL` | Action summary (e.g., "User submits login form") |
  | `method` | `VARCHAR(30)` | Nullable | Protocol or method (e.g., `POST`, `SELECT`, `TCP`) |
  | `description` | `TEXT` | Nullable | In-depth description of validation and processing |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 2.11 Table: `cse_subjects`
- **Purpose**: Predefined curriculum subjects for conceptual learning.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique subject identifier |
  | `name` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | Subject name (e.g., `DBMS`, `Computer Networks`, etc.) |

---

### 2.12 Table: `cse_concepts`
- **Purpose**: Predefined core computer science concepts with educational facets.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique concept identifier |
  | `subject_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `cse_subjects(id)` `ON DELETE CASCADE` |
  | `name` | `VARCHAR(150)` | `NOT NULL` | Concept name (e.g., `Relational Database`, `HTTP`) |
  | `explanation` | `TEXT` | `NOT NULL` | Academic definition of the concept |
  | `project_relevance`| `TEXT` | `NOT NULL` | Explanation of why this concept matters in software engineering |
  | `project_usage` | `TEXT` | `NOT NULL` | Concrete examples of where it applies in real applications |
  | `what_to_learn` | `TEXT` | `NOT NULL` | Bulleted viva revision checklist |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 2.13 Table: `project_concepts`
- **Purpose**: Associative junction table linking a student's project to specific CSE concepts with student reasoning.
- **Columns**:
  | Column Name | Data Type | Constraints | Description |
  | :--- | :--- | :--- | :--- |
  | `id` | `INT` | `AUTO_INCREMENT`, `PRIMARY KEY` | Unique mapping identifier |
  | `project_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `projects(id)` `ON DELETE CASCADE` |
  | `concept_id` | `INT` | `NOT NULL`, `FOREIGN KEY` | References `cse_concepts(id)` `ON DELETE CASCADE` |
  | `reason` | `TEXT` | Nullable | Student's custom justification for how their project uses this concept |
  | `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |
  | **Constraint** | `UNIQUE KEY` | `(project_id, concept_id)` | Prevents duplicate concept mappings for the same project |
