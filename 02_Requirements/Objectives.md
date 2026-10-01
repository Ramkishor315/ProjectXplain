# Project Objectives

The primary aim of **ProjectXplain** is to provide an educational platform tailored for undergraduate engineering students to systematically design, understand, and defend full-stack software applications.

## 1. Educational Objectives

1. **Bridge Academic Theory with Practical Implementation**:
   - Provide direct mappings between theoretical CSE concepts (DBMS, Computer Networks, OOPS, Operating Systems, System Design) and tangible code artifacts (tables, REST endpoints, UI components, background processes).
   - Empower students to perform exceptionally well during viva voce examinations and technical defense interviews.

2. **Demystify the Software Engineering Lifecycle**:
   - Guide students through a structured 10-feature progression: Idea Formulation → Requirements → User Stories → Database Design → API Design → System Architecture → Request/Data Flow → Theory Mapping → AI-assisted Viva Preparation.

3. **Foster Architectural Thinking Early**:
   - Encourage students to think about components, client-server separation, protocol choices, and schema relationships before committing code.

## 2. Technical and Functional Objectives

1. **Centralized Project Idea Management (Features 1 & 2)**:
   - Enable students to create and browse projects with a title and high-level problem description.
   - Provide an informative dashboard summarizing key project metrics and active design stages.

2. **Hierarchical Requirements & Story Engineering (Features 3 & 4)**:
   - Provide structured entry of functional requirements with priority classifications (High, Medium, Low).
   - Enable hierarchical decomposition of requirements into user stories following standard software engineering formats.

3. **Relational Schema Modeling (Feature 5)**:
   - Allow students to define database entities (tables), assign attributes with specific data types and key constraints (Primary Key, Foreign Key, None), and establish entity relationships (One-to-One, One-to-Many, Many-to-Many).

4. **REST API Design & Documentation (Feature 6)**:
   - Provide a dedicated interface to document planned REST endpoints, including HTTP method (GET, POST, PUT, DELETE, PATCH), URI pattern, description, and request/response JSON payloads.

5. **Component-Based Architecture Modeling (Feature 7)**:
   - Allow students to model the structural blocks of their system (Frontend, Backend, Database, Cache, External API) and record connection links between them.

6. **Sequential Request and Data Flow Modeling (Feature 8)**:
   - Enable ordered, step-by-step tracing of data interactions between system components, linking each step to documented APIs and actions.

7. **Deterministic CSE Curriculum Knowledge Base (Feature 9)**:
   - Provide a curated repository of core academic subjects (DBMS, Computer Networks, OOPS, Operating Systems, System Design) and concepts with explicit project relevance, usage guidelines, and viva study topics.
   - Allow students to attach relevant concepts to their specific project with custom contextual justification.

8. **Context-Aware AI Mentor (Feature 10)**:
   - Integrate a server-side AI Mentor powered by OpenRouter (`openrouter/free`) that consumes the entire project context (Features 1–9) and answers student questions with tailored viva explanations without exposing client credentials.
