# Request & Data Flow Design

This document details the architecture and operational mechanics of **Feature 8: Request / Data Flow** in **ProjectXplain**.

---

## 1. Feature Purpose and Educational Value

Understanding the end-to-end journey of an HTTP request is one of the most critical conceptual leaps for undergraduate computer science students. Students often struggle to explain how a user's button click on the browser transitions across network boundaries, triggers backend controller logic, executes SQL against a database, and returns a response payload.

**Feature 8 provides a structured, step-by-step tracing tool** that allows students to decompose an operation (such as "User Login", "Checkout Order", or "Process Payment") into an ordered sequence of lifecycle steps.

> [!NOTE]
> **Documentation Tool vs. Runtime Execution Engine**:
> Feature 8 is designed to **model, persist, and visualize** the sequential steps of an operation for educational and viva defense purposes. It **does not execute live network requests** or orchestrate actual microservices. Instead, it records the conceptual and architectural flow steps in MySQL (`data_flow_steps` table) so students and evaluators can trace and review system dynamics.

---

## 2. Data Flow Architecture & Data Model

Each flow step connects components modeled in Feature 7 (System Architecture) and optionally links to an API documented in Feature 6 (API Design):

```text
┌────────────────────────────────────────────────────────┐
│               Data Flow Step Lifecycle                 │
│                                                        │
│  [Step Number]                                         │
│       │                                                │
│       ▼                                                │
│  [Source Component] ──(Method / Action)──► [Target]    │
│  (e.g., React Client)                   (e.g., Server) │
│       │                                                │
│       ├── Linked API: Optional (e.g., POST /api/login) │
│       └── Technical Description: Payload details       │
└────────────────────────────────────────────────────────┘
```

### 2.1 Database Schema Representation (`data_flow_steps`)
- `id`: Unique step identifier (Auto-Increment Primary Key).
- `project_id`: Foreign key referencing `projects(id)` with `ON DELETE CASCADE`.
- `step_number`: Integer specifying execution sequence (e.g., 1, 2, 3).
- `from_component_id`: Foreign key referencing source `architecture_components(id)` with `ON DELETE CASCADE`.
- `to_component_id`: Foreign key referencing target `architecture_components(id)` with `ON DELETE CASCADE`.
- `api_id`: Optional foreign key referencing `api_endpoints(id)` with `ON DELETE SET NULL` (preserving step history even if the API definition is later removed).
- `action`: Concise summary string (e.g., "Submit user credentials").
- `method`: Communication method (e.g., `POST`, `GET`, `SQL QUERY`, `TCP ACK`).
- `description`: Detailed operational narrative (e.g., "Validates email format, hashes password, and issues JWT token").

---

## 3. Concrete Request/Data Flow Example

Below is a standard multi-tier authentication flow modeled using Feature 8:

| Step | From Component | To Component | Linked API | Method | Action Summary | Detailed Description |
| :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| **1** | Web Browser (Frontend) | API Gateway / Express Server | `POST /api/auth/login` | `POST` | Dispatch credentials | User submits email and password via form; frontend packages payload into JSON and sends HTTP request. |
| **2** | API Gateway / Express Server | MySQL Database | *None* | `SQL` | Query user record | Backend executes `SELECT * FROM users WHERE email = ?` using parameterized query. |
| **3** | MySQL Database | API Gateway / Express Server | *None* | `RESULT` | Return row data | Database returns matching row with hashed password and salt. |
| **4** | API Gateway / Express Server | Web Browser (Frontend) | `POST /api/auth/login` | `JSON` | Return Auth Token | Backend compares password hashes; if valid, returns HTTP 200 with JWT bearer token. |

---

## 4. Integration with AI Mentor (Feature 10)

Because data flow steps are persisted with relational links to components and APIs, the **AI Mentor** automatically pulls these ordered steps into its prompt context. During viva preparation, the mentor can ask students:
- *"Explain the exact journey of a request in Step 1 through Step 4."*
- *"What happens if the database is unreachable at Step 2? How does your server handle that error?"*
