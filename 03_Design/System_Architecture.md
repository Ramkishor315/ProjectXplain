# System Architecture Design

This document describes the concrete system architecture of **ProjectXplain** as implemented in the repository.

---

## 1. High-Level Architectural Pattern

ProjectXplain follows a classic **3-Tier Client-Server Architecture** combined with a secure **Server-Side External AI Service Gateway**:

```text
┌────────────────────────────────────────────────────────┐
│             Presentation Layer (Client)                │
│    React SPA (Vite, Tailwind CSS, Component Library)   │
│              Running on http://localhost:5173          │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / REST (JSON)
                           ▼
┌────────────────────────────────────────────────────────┐
│             Application Layer (Server)                 │
│         Node.js + Express.js REST API Server           │
│              Running on http://localhost:4000          │
│                                                        │
│  - Middleware: cors, express.json()                    │
│  - Routes & Controllers (10 Modules)                  │
│  - Environment Config (.env isolation)                 │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
        SQL Queries (mysql2)      HTTPS API Calls
               │                 (OpenAI SDK / Bearer)
               ▼                          ▼
┌─────────────────────────────┐  ┌─────────────────────────────┐
│       Data Storage Layer    │  │    External AI Gateway      │
│      MySQL Relational DB    │  │     OpenRouter API          │
│   Running on localhost:3306 │  │    (openrouter/free model)  │
└─────────────────────────────┘  └─────────────────────────────┘
```

---

## 2. Layer Breakdown and Responsibilities

### 2.1 Presentation Layer (Frontend)
- **Framework & Build Tool**: React 18+ with Vite as the build tool and development server.
- **Styling Engine**: Tailwind CSS utility framework with custom design tokens for card surfaces, badges, inputs, and interactive states.
- **State Management**: React state hooks (`useState`, `useEffect`) scoped within modular feature components and coordinated by the top-level workspace component (`App.jsx`).
- **Communication**: Native `fetch()` API executing asynchronous HTTP requests against the backend server endpoints.
- **Modular Directory Structure**:
  - `frontend/src/pages/project/`: Individual workspace views (`ProjectOverview.jsx`, `Requirements.jsx`, `UserStories.jsx`, `DatabaseDesign.jsx`, `ApiDesign.jsx`, `SystemArchitecture.jsx`, `DataFlow.jsx`, `CseConcepts.jsx`, `AIMentor.jsx`).
  - `frontend/src/components/ui/`: Reusable interface primitives (`Button.jsx`, `Badge.jsx`, `Card.jsx`, `Input.jsx`, `Textarea.jsx`, `Select.jsx`, `EmptyState.jsx`, `PageHeader.jsx`, `StatCard.jsx`).
  - `frontend/src/components/`: Layout components (`Navbar.jsx`, `ProjectSidebar.jsx`).

### 2.2 Application Layer (Backend)
- **Runtime & Framework**: Node.js with Express.js web framework.
- **Protocol**: HTTP/1.1 RESTful JSON API.
- **Configuration & Security**:
  - `dotenv`: Loads environment variables from a local `.env` file (`PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `OPENROUTER_API_KEY`).
  - `cors`: Configured to permit cross-origin requests from the React development server.
  - `express.json()`: Parses incoming JSON request bodies.
- **Modular Routing & Controller Separation**:
  - `backend/app.js`: Express application setup and route mounting.
  - `backend/server.js`: Server listener binding to the configured port (default: 4000).
  - `backend/routes/`: Declarative HTTP route definitions mapped to controller functions.
  - `backend/controllers/`: Request handling, input validation, SQL query execution, and response serialization.

### 2.3 Data Storage Layer (Database)
- **Database Engine**: MySQL relational database.
- **Driver**: `mysql2` driver executing parameterized queries with connection pooling.
- **Initialization and Seed Lifecycle**:
  - Upon startup (`backend/db/connection.js`), the server verifies and automatically creates necessary relational tables (`CREATE TABLE IF NOT EXISTS`).
  - The database auto-seeds 5 foundational computer science subjects (`cse_subjects`) and 17 core educational concepts (`cse_concepts`) if the catalog is initially empty.
- **Data Integrity**: Foreign keys enforce referential integrity using `ON DELETE CASCADE` for child records and `ON DELETE SET NULL` for optional references.

### 2.4 External AI Gateway (AI Mentor)
- **Provider**: OpenRouter API (`https://openrouter.ai/api/v1`).
- **Model**: `openrouter/free` (high-speed, accessible educational model).
- **Integration Library**: Official OpenAI Node.js SDK configured with custom `baseURL`.
- **Security Boundary**: The client browser never communicates directly with OpenRouter. All prompt construction, context gathering from MySQL, and API authentication occur strictly within `backend/controllers/mentorController.js`.

---

## 3. Communication Boundaries and Port Allocations

| Component | Default Host & Port | Inbound From | Outbound To | Security / Isolation Mechanism |
| :--- | :---: | :---: | :---: | :--- |
| **Frontend SPA** | `http://localhost:5173` | Browser Client | Express Backend | No credentials stored in client bundle |
| **Backend REST API** | `http://localhost:4000` | Frontend SPA | MySQL, OpenRouter | Parameterized SQL, `.env` secret storage |
| **MySQL Server** | `localhost:3306` | Backend REST API | None | Accessible only via authenticated credentials |
| **OpenRouter API** | `https://openrouter.ai` | Backend REST API | None | Bearer token authentication via `OPENROUTER_API_KEY` |
