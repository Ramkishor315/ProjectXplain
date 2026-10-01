# Feature Demonstration & Screenshot Checklist

This document provides a verification checklist and formal screenshot placeholders for all 10 implemented features of **ProjectXplain**.

---

## 1. Feature Demonstration Verification Checklist

| # | Feature Area | Implemented Artifacts / UI Views | Verification Criteria | Status |
| :-: | :--- | :--- | :--- | :---: |
| **1** | **Project Creation & View** | Projects Dashboard, "+ Create Project" Form | Clean project cards with timestamps; form validation on empty input. | **Verified** |
| **2** | **Project Overview Dashboard** | Dynamic StatCards, Project Metadata Header | Dynamic count metrics update across all design stages in real-time. | **Verified** |
| **3** | **Requirements Management** | Requirements List, Add Requirement Form | Priority badges (`High`, `Medium`, `Low`), inline error banners, delete button. | **Verified** |
| **4** | **User Stories / Use Cases** | Requirement-Grouped Story Cards, Add Story Form | Formatted "As a... I want to... so that..." cards nested under parent requirements. | **Verified** |
| **5** | **Database Design** | Entity Cards, Attribute Manager, Relationship Form, Schema View | Primary/Foreign key tags, SQL data types, inter-entity cardinalities. | **Verified** |
| **6** | **API Design** | REST API Catalog, Add Endpoint Modal/Form | Method badges (`GET`, `POST`, `PUT`, `DELETE`), URI paths, collapsible JSON previews. | **Verified** |
| **7** | **System Architecture** | Component Cards by Tier, Connection Links | Layer categorization (`Frontend`, `Backend`, `Database`), inter-component arrows. | **Verified** |
| **8** | **Request / Data Flow** | Sequential Step Flowchart Cards | Ordered step numbers, source/target components, linked API badge, action summaries. | **Verified** |
| **9** | **CSE Concepts** | 5 Subject Tabs, 17 Concept Cards, Mapping Modal | 4-facet concept breakdowns (Explanation, Relevance, Usage, Viva checklist), mapping rationale. | **Verified** |
| **10** | **AI Mentor** | Interactive Query Box, Formatted Markdown Output | Dynamic context assembly, viva defense questions, server-isolated key security. | **Verified** |

---

## 2. Screenshot Evidence Placeholders

Insert the project screenshot evidence into the designated blocks below:

---

### Feature 1: Project Creation & Projects Listing
[INSERT SCREENSHOT: Project Creation & Listing]
- **Visible Elements Required**:
  - The top navigation bar displaying the ProjectXplain logo.
  - The "Create New Project" modal/form with Project Name and Problem Idea fields.
  - The projects grid showing project cards with creation timestamps and action buttons.

---

### Feature 2: Project Overview Dashboard
[INSERT SCREENSHOT: Project Overview Dashboard]
- **Visible Elements Required**:
  - The project title banner and problem summary.
  - The aggregate StatCards displaying counts for Requirements, User Stories, Entities, APIs, Components, Flow Steps, and Concepts.
  - Quick action links allowing navigation directly into specific design modules.

---

### Feature 3: Requirements Engineering
[INSERT SCREENSHOT: Requirements Management]
- **Visible Elements Required**:
  - The Requirements workspace view.
  - The "Add Requirement" form showing title input, description textarea, and priority dropdown.
  - Rendered requirement cards displaying distinct color-coded priority badges (`High` in red, `Medium` in amber, `Low` in slate).

---

### Feature 4: User Stories & Use Cases
[INSERT SCREENSHOT: User Stories / Use Cases]
- **Visible Elements Required**:
  - User story cards grouped underneath their parent requirement header.
  - Agile user story format ("As a... I want to... so that...").
  - Actions to add a new story or delete an individual story.

---

### Feature 5: Relational Database Design
[INSERT SCREENSHOT: Database Design & Schema View]
- **Visible Elements Required**:
  - Entity cards showing table names (e.g., `users`, `orders`).
  - Column attributes showing attribute names, SQL data types, and key constraints (`Primary Key`, `Foreign Key`).
  - Active relationship cards (e.g., `users` → `orders` [One-to-Many]).
  - The formatted Schema View table.

---

### Feature 6: REST API Design Catalog
[INSERT SCREENSHOT: API Design Documentation]
- **Visible Elements Required**:
  - Documented API cards showing HTTP method badges (`GET`, `POST`, `PUT`, `DELETE`).
  - URI endpoints (e.g., `/api/orders`, `/api/auth/login`).
  - Expandable sample Request Body and Response Body JSON code blocks.

---

### Feature 7: System Architecture
[INSERT SCREENSHOT: System Architecture]
- **Visible Elements Required**:
  - Structural component cards categorized by tier (`Frontend`, `Backend`, `Database`, `Service`).
  - Directed communication links between components with protocol descriptions.

---

### Feature 8: Request & Data Flow
[INSERT SCREENSHOT: Request / Data Flow]
- **Visible Elements Required**:
  - Sequential step cards ordered by Step Number (Step 1, Step 2, Step 3...).
  - From and To component indicators showing data traversal across system tiers.
  - Associated HTTP methods, actions, and optional linked API badges.

---

### Feature 9: Computer Science Curriculum Concepts
[INSERT SCREENSHOT: CSE Concepts Knowledge Base]
- **Visible Elements Required**:
  - The 5 subject tabs (`DBMS`, `Computer Networks`, `OOPS`, `Operating Systems`, `System Design`).
  - Concept cards displaying the 4 facets: Explanation, Project Relevance, Project Usage, and What to Learn for Viva.
  - Concept mapping tags with custom student rationale displayed.

---

### Feature 10: Context-Aware AI Mentor
[INSERT SCREENSHOT: AI Mentor Viva Consultation]
- **Visible Elements Required**:
  - The student query input box and "Ask Mentor" button.
  - The generated response panel rendering student-friendly markdown viva coaching.
  - Evidence of project context utilization (referencing the student's actual tables, APIs, and components).
