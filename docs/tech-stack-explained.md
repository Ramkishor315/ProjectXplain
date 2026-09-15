

## Frontend

- **React** builds the page from components.
- **JavaScript** is used instead of TypeScript to keep the examples simple.
- **Vite** starts the development server and builds the React app.
- **Plain CSS** styles the page without a CSS framework.
- **fetch()** sends requests from the browser to the backend.

## Backend

- **Node.js** runs JavaScript on the server.
- **Express** defines HTTP routes and sends JSON responses.
- **JavaScript** keeps the server code easy to read and debug.
- **cors** allows the frontend development server to call the backend.
- **dotenv** reads local settings from a `.env` file.

The backend is divided into three simple parts:

1. `routes/` defines URL paths and HTTP methods.
2. `controllers/` contains the function that handles each request.
3. `db/` contains the MySQL connection for future database features.

## Database

MySQL will store ProjectXplain data in a later phase. The project already has
a small `mysql2` connection module, but it does not create tables or query the
database yet.

## Future AI

The Claude API will eventually be called by the backend. Its API key will be
stored in `backend/.env`, never in frontend code.


