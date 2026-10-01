# Problem Statement

## 1. Background and Context

In undergraduate Computer Science and Engineering (CSE) programs, students frequently undertake academic software development projects (such as semester projects, capstone projects, and mini-projects). While students are taught foundational computer science subjects—including Database Management Systems (DBMS), Computer Networks (CN), Object-Oriented Programming (OOPS), Operating Systems (OS), and System Design—they typically learn these subjects in theoretical silos.

When building applications, students often jump directly to writing ad-hoc code (e.g., creating a simple user interface or copying basic tutorial code) without engaging in disciplined software engineering practices. As a result, critical engineering phases are routinely bypassed:

1. **Requirements Formulation**: Requirements are either unwritten or vaguely defined without priorities or validation boundaries.
2. **User Story Decomposition**: Ideas are not broken down into actionable user stories with explicit acceptance criteria.
3. **Database Normalization & Modeling**: Schemas are created without entity-relationship planning, attribute data types, or foreign key relationship mapping.
4. **API Specification**: REST endpoints, HTTP methods, request bodies, and expected JSON responses are not systematically designed or documented before frontend-backend integration.
5. **System Architecture**: High-level structural components (clients, servers, databases, third-party services) and their communication boundaries are rarely mapped out.
6. **Request and Data Flow**: The end-to-end lifecycle of an HTTP request traversing through the frontend, API route, controller, database query, and back is not understood or visualized.
7. **Theory-to-Implementation Gap**: Students struggle during viva examinations and technical reviews because they cannot connect foundational theoretical concepts (e.g., referential integrity, HTTP statelessness, process concurrency, encapsulation) to their actual codebase.

## 2. Core Problem Formulation

There is a significant educational tool gap for undergraduate engineering students: **Existing project management and software design tools are built for experienced industry professionals, not for learning.**

- **Industry Tools (Jira, Postman, Enterprise Architect, Lucidchart)**: These platforms assume prior professional knowledge, feature steep learning curves, lack integrated educational context, and do not explain *why* an architectural or database decision connects to foundational CSE principles.
- **Viva Voce Vulnerability**: In academic evaluations, students can demonstrate a working UI but fail to explain their database schema relationships, API status codes, request lifecycle, or architectural tradeoffs to examiners.
- **Mental Silos**: Students fail to recognize that the tables they write in MySQL directly embody DBMS concepts, the fetch calls in their React components exemplify Computer Networks protocols, and their modular folder structure demonstrates OOPS abstraction and separation of concerns.

## 3. The ProjectXplain Intervention

**ProjectXplain** directly addresses this problem by providing an integrated, guided educational software engineering workspace that transforms an initial software idea into structured, professional engineering artifacts while continuously connecting those artifacts back to core CSE curriculum concepts and offering an interactive AI Mentor.
