# ProjectXplain

ProjectXplain is a student software engineering project that will help users
understand how the parts of a software project fit together. The current
version is intentionally small: it displays a basic React page and checks
whether the Express backend is running.

## Technologies

- Frontend: React, Vite, JavaScript, and plain CSS
- Backend: Node.js, Express, and JavaScript
- Database: MySQL with `mysql2` (connection setup only for now)
- Future AI: Claude API, called by the backend only

## Folder structure

```
ProjectXplain/
├── frontend/
│   ├── src/
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/
│   ├── controllers/healthController.js
│   ├── db/connection.js
│   ├── routes/health.js
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── docs/
├── README.md
└── .gitignore
```

## Installation

Install dependencies separately in each project:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Copy `backend/.env.example` to `backend/.env` when you are ready to configure
the port or MySQL connection. It contains placeholders only; never commit real
passwords or API keys.

## Start the applications

Run each command in a separate terminal:

```bash
# Terminal 1
cd backend
npm run dev
```

```bash
# Terminal 2
cd frontend
npm run dev
```

The backend runs on `http://localhost:4000` and the frontend runs on the Vite
URL shown in the terminal, normally `http://localhost:5173`.

## Health endpoint

`GET http://localhost:4000/api/health` returns:

```json
{
	"status": "ok",
	"service": "projectxplain-backend"
}
```

The frontend calls this endpoint with the browser `fetch()` API.

## Roadmap

1. Add simple MySQL tables and basic project APIs.
2. Add a project idea form and beginner-friendly explanations.
3. Add backend-only Claude API calls using an environment variable.
4. Add diagrams and CSE concept links after the basic workflow is stable.

Authentication, AI generation, database tables, graph storage, and advanced
visualizations are deliberately not implemented yet.
