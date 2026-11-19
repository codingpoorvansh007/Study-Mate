# StudyMate

A full-stack MERN task manager for students: register, log in, add tasks with a
subject, priority and deadline, edit or delete them, mark them done, and see
task statistics.

**Stack:** React (Vite) + Bootstrap, Node.js + Express, MongoDB + Mongoose, JWT + bcryptjs.

## Folder structure

```
studymate/
├── server/                 Express API
│   ├── app.js
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js, Task.js
│   └── routes/auth.js, tasks.js
└── client/                 React app (Vite)
    └── src/
        ├── App.js, main.js, api.js, styles.css
        ├── context/AuthContext.js
        ├── components/Navbar.js, TaskCard.js, TaskForm.js, PrivateRoute.js
        └── pages/Landing, Register, Login, Dashboard, AddTask, EditTask, TaskList, Stats
```

## Run locally

Requirements: Node.js 18+ and a MongoDB database (local MongoDB or a free MongoDB Atlas cluster).

1. Install dependencies
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. Configure the server
   ```bash
   cd server
   cp .env.example .env      # then edit .env
   ```
   Set `MONGO_URI` (your MongoDB connection string) and `JWT_SECRET` (any long random string).
3. Start the API (terminal 1)
   ```bash
   cd server && npm run dev      # http://localhost:5000
   ```
4. Start the React app (terminal 2)
   ```bash
   cd client && npm run dev      # http://localhost:5173
   ```
   In development Vite forwards `/api` requests to the Express server automatically.

## API endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | /api/auth/register | Create account, returns token + user | Public |
| POST | /api/auth/login | Log in, returns token + user | Public |
| GET | /api/auth/me | Current user | JWT |
| GET | /api/tasks | List your tasks (newest first) | JWT |
| GET | /api/tasks/stats | Counts by status and priority | JWT |
| GET | /api/tasks/:id | Get one of your tasks | JWT + owner |
| POST | /api/tasks | Create a task | JWT |
| PUT | /api/tasks/:id | Update a task | JWT + owner |
| DELETE | /api/tasks/:id | Delete a task | JWT + owner |
| GET | /api, /api/healthz | Status / health check | Public |

## Deploy

**Option A: one server (simplest)** — build the client and let Express serve it.
```bash
npm install --prefix server && npm install --prefix client
npm run build            # creates client/dist
NODE_ENV=production npm start --prefix server
```
Set `MONGO_URI`, `JWT_SECRET` and `PORT` in your host's environment variables
(for example on Render, set the build command to
`npm install --prefix server && npm install --prefix client && npm run build`
and the start command to `NODE_ENV=production node server/app.js`).

**Option B: separate hosting** — deploy `client/` (for example on Vercel or Netlify)
and `server/` (for example on Render). On the client set `VITE_API_URL` to the
server's URL, and on the server set `CLIENT_URL` to the client's URL.

## Security notes

- Never commit `.env`; use a long random `JWT_SECRET` in production.
- Passwords are hashed with bcrypt; every task query is filtered by the logged-in user's id.
- The update route only accepts whitelisted fields, so `userId` cannot be changed from the request.
