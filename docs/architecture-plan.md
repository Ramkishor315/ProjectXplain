# ProjectXplain Architecture Plan

This document describes the small foundation that is currently implemented
and the simple direction planned for future features.

## Current request flow

```text
Browser (React)
    |
    | fetch('/api/health')
    v
Express server
    |
    v
routes/health.js -> controllers/healthController.js
```

The frontend development server proxies `/api` requests to the backend at
`http://localhost:4000`. The backend currently returns a health response and
does not require a database connection to start.

## Current folders

```text
frontend/src/
  App.jsx              # Main React component
  main.jsx             # React entry point
  index.css            # Plain CSS
  services/api.js      # Small fetch helper

backend/
  app.js               # Express configuration
  server.js            # Starts the server
  routes/              # URL definitions
  controllers/         # Request handlers
  db/                  # MySQL connection
```

## Future implementation order

Features should be added one small step at a time:

1. Add MySQL tables and simple SQL queries.
2. Add an endpoint for creating and viewing a project idea.
3. Add a React form that calls those endpoints with `fetch()`.
4. Add beginner-friendly project explanations.
5. Add backend-only Claude API calls using `CLAUDE_API_KEY`.
6. Add diagrams only when the related data and user workflow are working.

Each feature should have a route, a controller function, and a small frontend
API helper only when that separation makes the code easier to understand.
There is no need to add services, repositories, an ORM, authentication, or a
state-management library until the project genuinely needs one.
