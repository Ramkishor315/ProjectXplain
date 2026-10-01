# Project Scope

This document specifies the precise boundaries of **ProjectXplain** as evaluated in the Mid-Semester milestone.

## 1. In-Scope Functionality (Implemented in Current Repository)

The current implementation covers Features 1 through 10 in a unified, modern web application running on React (Vite + Tailwind CSS), Node.js (Express), MySQL, and OpenRouter AI:

| Area | In-Scope Features / Capabilities |
| :--- | :--- |
| **Project Management** | • Creation of software projects with title and description.<br>• Listing and navigation between active projects.<br>• Project Overview dashboard displaying counts of requirements, stories, entities, APIs, components, flow steps, and mapped concepts. |
| **Requirements Engineering** | • Adding, viewing, and deleting requirements.<br>• Assigning priorities: High, Medium, Low.<br>• Real-time updates and persistence in MySQL. |
| **User Stories** | • Adding and viewing user stories attached directly to a specific parent requirement.<br>• Deletion of user stories.<br>• Cascade deletion when a parent requirement is removed. |
| **Database Design** | • Entity (table) creation and deletion.<br>• Attribute creation with Data Type (`VARCHAR`, `INT`, `TEXT`, `BOOLEAN`, `TIMESTAMP`, etc.) and Key Type (`None`, `Primary Key`, `Foreign Key`).<br>• Relationship modeling between entities (`One-to-One`, `One-to-Many`, `Many-to-Many`).<br>• Visual schema summary presentation. |
| **API Design** | • Educational documentation of planned REST endpoints.<br>• Specification of HTTP Method, URI pattern, description, sample Request Body, and sample Response Body.<br>• CRUD operations on documented endpoint definitions. |
| **System Architecture** | • Component modeling with name, type (Frontend, Backend, Database, Service, External API, Cache, Other), and description.<br>• Architecture connection modeling (from component, to component, communication description). |
| **Request / Data Flow** | • Ordered sequential flow step specification (`step_number`).<br>• Source and target component selection.<br>• Association with documented project API endpoints.<br>• Documenting HTTP action/method and lifecycle description. |
| **CSE Concepts** | • Predefined seeded repository across 5 academic subjects (DBMS, Computer Networks, OOPS, Operating Systems, System Design) and 17 core concepts.<br>• Project-to-concept association with custom academic rationale/justification.<br>• Structured concept breakdown: Explanation, Project Relevance, Project Usage, What to Learn for Viva. |
| **AI Mentor** | • Interactive prompt interface for student viva preparation.<br>• Backend assembly of comprehensive project context across Features 1–9.<br>• Server-side API dispatch to OpenRouter (`openrouter/free`) using server environment variables.<br>• Secure token handling (API keys strictly restricted to backend `.env`). |

## 2. Out-of-Scope (Deliberate Design Boundaries / Future Work)

The following items are intentionally outside the current Mid-Semester project scope:

1. **User Authentication & Multi-Tenancy**: The application is designed for local student use and pair programming; there is no login/signup, password hashing, or role-based access control.
2. **Automated Code Generation / Scaffolding**: ProjectXplain is an *educational design and understanding platform*, not an automated code generator or low-code builder.
3. **Execution of Documented APIs**: Documented APIs created under Feature 6 are educational specifications stored in `api_endpoints`; they do not automatically spin up runtime mock servers or execute live network requests.
4. **Live Execution of Data Flow Steps**: Feature 8 records the architectural trace for study purposes; it does not execute live network packets between physical machines.
5. **Interactive Drag-and-Drop Canvas / React Flow**: Component positioning is handled via structured form-driven cards and lists rather than a heavy canvas graphing library.
6. **Distributed Cloud Infrastructure**: The system runs locally using Node.js, Express, and MySQL; distributed caching (Redis cluster), microservices orchestration, and multi-region deployment are out of scope.
