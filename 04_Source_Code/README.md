# Source Code Architecture & Setup Guide

This document serves as the guide to the ProjectXplain source code repository.

> [!IMPORTANT]
> **Source Code Location Policy**:
> As specified in the evaluation guidelines, the working application source code remains in its operational project directories (`frontend/` and `backend/`). Source files are not copied into this documentation folder to prevent redundancy and keep version control clean.

---

## 1. Repository Structure

```text
ProjectXplain/
├── backend/                       # Node.js + Express backend application
│   ├── controllers/               # Request handlers & business logic (10 modules)
│   │   ├── apiController.js
│   │   ├── architectureController.js
│   │   ├── cseConceptsController.js
│   │   ├── dataFlowController.js
│   │   ├── databaseController.js
│   │   ├── healthController.js
│   │   ├── mentorController.js
│   │   ├── projectController.js
│   │   ├── requirementController.js
│   │   └── userStoryController.js
│   ├── db/
│   │   └── connection.js          # MySQL connection pool & automatic table seeding
│   ├── routes/                    # REST route declarations (10 route modules)
│   ├── .env.example               # Template for environment variables (NO SECRETS)
│   ├── app.js                     # Express app setup, CORS, JSON middleware
│   ├── server.js                  # Entry point for backend listener
│   └── package.json               # Backend dependencies (express, mysql2, cors, openai, dotenv)
│
├── frontend/                      # React SPA with Vite & Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # Reusable UI component library (Button, Badge, Card, etc.)
│   │   │   ├── Navbar.jsx         # Global top navigation bar
│   │   │   └── ProjectSidebar.jsx # Workspace navigation sidebar
│   │   ├── pages/project/         # Modular workspace views (Features 1 to 10)
│   │   │   ├── ProjectOverview.jsx
│   │   │   ├── Requirements.jsx
│   │   │   ├── UserStories.jsx
│   │   │   ├── DatabaseDesign.jsx
│   │   │   ├── ApiDesign.jsx
│   │   │   ├── SystemArchitecture.jsx
│   │   │   ├── DataFlow.jsx
│   │   │   ├── CseConcepts.jsx
│   │   │   ├── AIMentor.jsx
│   │   │   └── PlaceholderSection.jsx
│   │   ├── services/
│   │   │   └── api.js             # Base API helper
│   │   ├── App.jsx                # Top-level workspace coordinator and view manager
│   │   ├── index.css              # Tailwind CSS directives
│   │   └── main.jsx               # React DOM root entry point
│   ├── index.html                 # Single page application HTML shell
│   ├── vite.config.js             # Vite bundler configuration
│   └── package.json               # Frontend dependencies (react, react-dom, tailwindcss, vite)
│
├── 01_Report/                     # Mid-Semester Evaluation Report & Outline
├── 02_Requirements/               # SRS, Backlog, User Stories, Use Cases
├── 03_Design/                     # Architecture, Database, API, Diagrams
├── 04_Source_Code/                # Source code documentation and setup guide
├── 05_Testing/                    # Test plan, Functional/API/DB test cases
├── 06_Project_Management/         # Task allocation, Git contributions, AI disclosure
└── 07_Demo/                       # Presentation script, flow, and demonstration checklist
```

---

## 2. Prerequisites

Ensure the following runtimes and services are installed on the host machine:
- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm**: Version 9.x or higher
- **MySQL Server**: Version 8.0 or higher running locally on port 3306

---

## 3. Environment Configuration

### Backend Configuration
Create a `.env` file inside the `backend/` directory by copying the provided template:

```bash
cd backend
cp .env.example .env
```

Populate the variables with your local development credentials:

```ini
# Server Port
PORT=4000

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=projectxplain

# External AI Service (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> [!CAUTION]
> Never commit actual passwords or API keys to Git. The `.gitignore` file is configured to exclude all `.env` files.

---

## 4. Installation & Setup

Install dependencies separately in the backend and frontend folders:

### 4.1 Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

### 4.2 Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

---

## 5. Database Initialization

1. Start your local MySQL service.
2. Create the target database using your preferred MySQL client (CLI or Workbench):
   ```sql
   CREATE DATABASE projectxplain;
   ```
3. Start the backend server (`npm run dev` in `backend/`). The `backend/db/connection.js` script will:
   - Connect to the database using configured credentials.
   - Automatically execute `CREATE TABLE IF NOT EXISTS` for all 13 relational tables.
   - Seed the initial 5 CSE subjects and 17 core concepts if not already populated.

---

## 6. Running the Applications Locally

Run each process in a separate terminal:

### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```
*Expected Output*:
- Express server running on `http://localhost:4000`
- `MySQL connected successfully`
- Table verification and seeding logs

### Terminal 2: Frontend Development Server
```bash
cd frontend
npm run dev
```
*Expected Output*:
- Vite development server ready at `http://localhost:5173`
- Open `http://localhost:5173` in your web browser to use ProjectXplain.
