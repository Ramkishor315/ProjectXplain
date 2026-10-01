# Non-Functional Requirements (NFR)

This document establishes the realistic, student-grade quality attributes and operational constraints for **ProjectXplain** as verified from the current repository architecture.

---

### NFR-01: Performance and Responsiveness
- **Specification**:
  - The local web interface shall render interactions (tab switching, form submissions, modal dialogues) with a perceived response time under 300 ms under typical single-user development conditions.
  - Local database read/write queries via Express and MySQL (`mysql2` connection pool/connection) shall execute within 100 ms for normal project dataset sizes (tens to hundreds of records per project).
  - The AI Mentor response time is dependent on the external OpenRouter API network roundtrip and model latency (typically 2 to 8 seconds for `openrouter/free`). The frontend shall display a clear loading spinner and disabled submit button during this period to prevent duplicate queries.

---

### NFR-02: Security and Credential Isolation
- **Specification**:
  - **Server-Side Secret Isolation**: Third-party API credentials (`OPENROUTER_API_KEY`) and database credentials (`DB_PASSWORD`, `DB_USER`) must strictly reside on the backend server within environment files (`.env`).
  - **No Client Exposure**: Under no circumstances shall third-party AI keys or database credentials be exposed to the browser client, frontend bundle, network payloads, or public Git commits.
  - **SQL Injection Prevention**: All SQL queries executed by the Node.js backend must utilize parameterized queries (`?` placeholders via `mysql2`) to prevent SQL injection vulnerabilities.
  - **CORS Configuration**: The backend enables CORS (`cors` middleware) to allow requests from the Vite frontend during development (`http://localhost:5173`).

---

### NFR-03: Usability and Educational Learnability
- **Specification**:
  - **Beginner-Friendly Interface**: The UI shall use clear visual hierarchy, consistent color-coded tags (e.g., green for GET, blue for POST, red for DELETE; priority badges for High/Medium/Low), and descriptive empty states with actionable guidance.
  - **Pedagogical Clarity**: All CSE concepts must present structured breakdowns: formal explanation, project relevance, actual project usage, and viva talking points ("What to learn").
  - **Error Visibility**: User input errors (e.g., missing project name, empty question, unlinked parent requirement) shall be communicated via clear, contextual inline alerts or error banners rather than silent failures or raw stack traces.

---

### NFR-04: Reliability and Data Integrity
- **Specification**:
  - **Referential Integrity**: Relational tables in MySQL must enforce foreign keys with `ON DELETE CASCADE` where parent deletion must cleanly clean up children (e.g., deleting a requirement cascades to its user stories; deleting an entity cascades to its attributes).
  - **Orphan Prevention**: Data flow steps referencing optional API definitions shall use `ON DELETE SET NULL` on `api_id` so that deleting an API does not unintentionally delete the flow step itself.
  - **Graceful Error Handling**: If MySQL or OpenRouter is temporarily unreachable, backend controllers must return structured JSON error messages (`500 Internal Server Error` with a human-readable `error` string) instead of crashing the Node.js process.

---

### NFR-05: Maintainability and Architecture Simplicity
- **Specification**:
  - **3-Tier Separation**: The system enforces clear separation of concerns: presentation layer (`frontend/src/pages/project/`), application API layer (`backend/routes/` and `backend/controllers/`), and data storage layer (`backend/db/`).
  - **Readable, Standard JavaScript**: The codebase avoids heavy enterprise abstractions (such as enterprise ORMs, vector databases, service meshes, or heavy microservice layers) to ensure that 3rd-year undergraduate team members can confidently understand, explain, and defend every line of code during viva voce examinations.
  - **Component Reusability**: Common UI elements (Buttons, Badges, Cards, Inputs, PageHeaders) are encapsulated as reusable components in `frontend/src/components/ui/`.
