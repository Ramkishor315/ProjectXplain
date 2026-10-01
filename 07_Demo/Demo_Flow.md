# Demonstration Step-by-Step Flow Guide

This document outlines the precise screen navigation flow for the 5–7 minute live evaluation demonstration of **ProjectXplain**.

---

## 1. Pre-Demo Setup Checklist

1. [ ] MySQL Server running on `localhost:3306` with database `projectxplain` initialized.
2. [ ] Backend Express server running in Terminal 1 (`npm run dev` in `backend/`) on `http://localhost:4000`.
3. [ ] Frontend Vite development server running in Terminal 2 (`npm run dev` in `frontend/`) on `http://localhost:5173`.
4. [ ] Chrome browser opened to `http://localhost:5173` with browser console open to demonstrate clean network requests.
5. [ ] Ensure `OPENROUTER_API_KEY` is present in `backend/.env` to showcase Feature 10.

---

## 2. Sequential Navigation Sequence

```text
[Home / Projects Dashboard]
       │
       ▼ (Step 1: Create or select project)
[Project Overview Dashboard]
       │
       ├─► [Requirements Tab] (Step 2: Add Requirement with High priority)
       │         │
       │         ▼ (Step 3: Add nested User Story)
       ├─► [User Stories Tab]
       │
       ├─► [Database Design Tab] (Step 4: Create Entity, Attributes, Relations, Schema View)
       │
       ├─► [API Design Tab] (Step 5: Document REST endpoints with HTTP method badges)
       │
       ├─► [System Architecture Tab] (Step 6: Components & Communication Links)
       │
       ├─► [Request / Data Flow Tab] (Step 7: Trace sequential transaction steps)
       │
       ├─► [CSE Concepts Tab] (Step 8: Map DBMS/Networks concepts with custom reasoning)
       │
       ▼ (Step 9: Interactive Viva Coaching)
[AI Mentor Tab] (Submit live query -> View contextual viva advice)
```

---

## 3. Detailed Screen Actions

### Step 1: Projects Dashboard & Creation
- Start on the Projects listing screen.
- Highlight clean, responsive cards showing existing projects.
- Click "+ Create Project", enter a sample project (`Blood Donation Matcher`), and click Save.
- Highlight immediate transition to the Project Workspace.

### Step 2: Requirements & User Stories
- Click on the "Requirements" sidebar tab.
- Click "Add Requirement", enter:
  - Title: `User Authentication & Role Management`
  - Priority: `High`
  - Description: `Students and donors must register and securely log in.`
- Switch to "User Stories" tab and add a story under this requirement:
  - Title: `Donor Registration`
  - Description: `As a donor, I want to create an account so that I can receive blood request notifications.`

### Step 3: Database Design
- Click "Database Design".
- Add an entity `donors`.
- Expand `donors` and add attributes: `id` (INT, Primary Key), `blood_group` (VARCHAR, None), `city` (VARCHAR, None).
- Switch to Schema View tab to display the formatted table schema.

### Step 4: API Design & Architecture
- Open "API Design" tab.
- Add an API: `POST /api/donors/register`, explaining that this documents the student's project contract.
- Open "System Architecture" tab to show component tiers (`Web Client`, `Backend Server`, `MySQL DB`).

### Step 5: Request / Data Flow
- Open "Request / Data Flow" tab.
- Show Step 1: `Web Client` → `Backend Server` using `POST /api/donors/register`.
- Show Step 2: `Backend Server` → `MySQL DB` using `SQL INSERT`.

### Step 6: CSE Concepts Mapping
- Open "CSE Concepts" tab.
- Select the `DBMS` tab. Show the concept `Relational Database`.
- Click "Map to Project" and enter student rationale: *"We use MySQL with foreign keys to link donors and donation records."*
- Show how the mapped tag updates.

### Step 7: Live AI Mentor Viva Question
- Open "AI Mentor" tab.
- Enter query: *"What theoretical DBMS concepts from my project could an examiner ask about during my viva?"*
- Click "Ask Mentor".
- Highlight the real-time loading indicator.
- Review the generated response, pointing out how the AI references the student's actual database entities and concepts mapped in earlier steps.
