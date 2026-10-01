# Stakeholder Analysis

This document identifies the primary and secondary stakeholders of **ProjectXplain**, detailing their roles, motivations, pain points, and expectations.

## 1. Stakeholder Matrix

| Stakeholder Group | Role in System | Key Pain Points | Value Provided by ProjectXplain |
| :--- | :--- | :--- | :--- |
| **Undergraduate CSE Students** (Primary Users) | Project creators, designers, learners, and viva candidates | • Difficulty translating high-level ideas into modular architecture.<br>• Unsure how to document APIs or model relational tables.<br>• Inability to answer examiner questions on CSE theory during project viva. | • Step-by-step guided project breakdown.<br>• Immediate visibility into how theory (DBMS, Networks, OOPS) applies to their specific code.<br>• Context-aware AI Mentor to simulate viva examinations. |
| **Academic Evaluators / Viva Examiners** (Key Evaluators) | Faculty members, external examiners, and lab instructors | • Students presenting monolithic, copy-pasted projects.<br>• Lack of structured documentation or schema rationale from students.<br>• Difficulty gauging individual conceptual clarity. | • Standardized, structured project artifacts.<br>• Explicit requirement tracing, database normalization, and data flow steps visible for direct grading. |
| **Project Mentors / Guides** (Advisors) | Departmental faculty guiding student capstone/semester projects | • High effort required to repeatedly teach basic requirements formulation and REST design.<br>• Inconsistent documentation formats submitted by students. | • Centralized platform to review student progress across all design stages from requirements to architecture. |
| **Student Development Team** (Authors) | Ram Kishor, Saksham, Ravi, Priyanshu | • Maintaining modularity, understandable code for viva defense, and robust integration without over-engineering. | • Cohesive, practical full-stack engineering experience applying React, Express, MySQL, and LLM APIs. |

## 2. Personas

### Persona 1: Third-Year CSE Student ("Aman")
- **Background**: Third-year computer science student building a "Blood Donation Matcher" project for their software engineering lab.
- **Goal**: Needs to submit requirements, an ER diagram, and an API list by next week, and needs to defend the project in front of an external examiner.
- **Challenge**: Aman knows how to write simple Node.js code, but struggles to explain foreign key constraints, HTTP response codes, and how a request moves between client and server.
- **Interaction with ProjectXplain**:
  1. Creates the project idea in ProjectXplain.
  2. Breaks down features into Requirements and User Stories.
  3. Models tables (`Users`, `Donors`, `Requests`) and sets Primary/Foreign keys.
  4. Documents API endpoints (`POST /api/requests`).
  5. Maps DBMS concepts ("Foreign Key", "Referential Integrity") and Computer Networks concepts ("HTTP Methods", "REST API").
  6. Uses the AI Mentor to practice: *"What questions can the examiner ask me about my database design?"*

### Persona 2: Faculty Project Evaluator ("Dr. Sharma")
- **Background**: Associate Professor evaluating 30 student project groups during the mid-semester evaluation.
- **Goal**: Quickly assess whether the group genuinely understands their software architecture, requirements hierarchy, and core computer science fundamentals.
- **Challenge**: Many groups show a pretty UI template downloaded online, but cannot explain their database relations or system communication flow.
- **Interaction with ProjectXplain**:
  1. Inspects the student's Project Overview dashboard.
  2. Verifies the mapping of Requirements to User Stories and Database Entities to APIs.
  3. Confirms the group's grasp of foundational principles through their mapped CSE Concepts and request/data flow tracing.
