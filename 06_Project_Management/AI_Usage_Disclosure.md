# Academic AI Usage Disclosure

In compliance with academic integrity standards and software engineering project evaluation guidelines, this document formally discloses the utilization of Artificial Intelligence (AI) tools throughout the development of **ProjectXplain**.

---

## 1. Summary of AI Tools Used

| Tool / Technology | Provider / Platform | Purpose & Usage Domain |
| :--- | :--- | :--- |
| **Antigravity (AI Coding Assistant)** | Google DeepMind / Google | Assisted with code navigation, boilerplate scaffolding, documentation structuring, and diagnostic troubleshooting. |
| **OpenRouter API (`openrouter/free`)** | OpenRouter.ai | Runtime LLM backend powering **Feature 10: AI Mentor** inside the application. |
| **GitHub Copilot / Inline Autocomplete** | GitHub / OpenAI | Code completion and syntax suggestions during local development *[To be verified by individual team members]*. |

---

## 2. Granular AI Utilization Breakdown

### 2.1 Architectural Scaffolding & Code Assistance (Antigravity)
- **Where Used**:
  - Drafting initial boilerplate for Express REST controllers and MySQL query helpers.
  - Assisting in styling modular UI cards and form layouts using Tailwind CSS.
  - Structuring comprehensive Mid-Semester documentation artifacts following strict academic guidelines.
- **Student Responsibility & Verification**:
  - The team designed the core requirements, feature progression, schema relationships, and architectural boundaries.
  - All AI-assisted code was manually reviewed, compiled, debugged, and tested locally by the student team.
  - Under no circumstances did AI operate autonomously without student direction, prompt constraints, and verification.

### 2.2 In-App Feature: AI Mentor (Feature 10 via OpenRouter)
- **Where Used**:
  - Integrated directly into `backend/controllers/mentorController.js` as an educational feature for student users.
- **Architectural Implementation**:
  - Employs the OpenAI JavaScript SDK configured to target `https://openrouter.ai/api/v1`.
  - Uses the accessible educational model: `openrouter/free`.
  - **Context Gathering**: The backend gathers relational data across Features 1 through 9 (requirements, user stories, database entities, attributes, relationships, APIs, architecture components, data flow steps, and mapped CSE concepts) and injects it as a structured system context.
  - **Security Guarantee**: The API key (`OPENROUTER_API_KEY`) is stored strictly on the server in `.env`. No credentials or bearer tokens are ever exposed to the client browser or committed to version control.

---

## 3. Academic Integrity Affirmation

The team affirms that:
1. **AI did not author the project without human understanding**: Every team member understands the architecture, database schema, API routing, and system data flows, and is fully prepared to defend the code line-by-line during the oral viva voce examination.
2. **Deterministic Foundations**: Foundational aspects of ProjectXplain—such as the relational database design, the deterministic CSE Concepts knowledge base (Feature 9), and RESTful route handling—are written in deterministic JavaScript/SQL code, ensuring reliable behavior independent of generative AI.
3. **No Hallucinated Claims**: All documentation and test reports reflect the actual, verifiable codebase.
