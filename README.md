# SketchStack — Mini Design Canvas

SketchStack is a small, full-stack visual design editor for creating, editing, and persisting simple graphical compositions. It uses React Konva for the scene graph and an Express/MongoDB API for canvas persistence.

## Technologies

- Frontend: Next.js (App Router), React, React Konva, Konva, TypeScript
- Backend: Node.js, Express.js, Mongoose, Zod, CORS
- Persistence: MongoDB

## Prerequisites

- Node.js 18.17+
- MongoDB 6+ locally, or a MongoDB Atlas connection string

## Setup

Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Copy the environment examples:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local
```

Update `backend/.env` with a reachable MongoDB URI. The frontend API URL defaults to `http://localhost:4000/api`.

Run both applications in separate terminals:

```bash
cd backend
npm run dev

cd frontend
npm run dev
```

Open http://localhost:3000. The API health check is available at http://localhost:4000/health.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/canvases` | Create a canvas |
| GET | `/api/canvases` | List canvases, newest first |
| GET | `/api/canvases/:id` | Fetch one canvas |
| PUT | `/api/canvases/:id` | Replace a canvas's editable data |
| DELETE | `/api/canvases/:id` | Delete a canvas |

Canvas documents contain a name, dimensions, and a normalized `elements` array. Each element has a stable client id and a type-specific set of properties. Zod validates request payloads at the API boundary; Mongoose adds persistence-level validation.

## Architecture decisions

The frontend is split into a page-level editor container and focused toolbar, canvas, properties, and saved-canvas list components. Editor history is maintained in React state, while Konva's `Stage` and `Layer` are responsible for rendering and interaction. Shape transforms are normalized back into width/height/scale-free state after each transform.

The backend uses routes → controllers → model boundaries. It has no frontend-specific logic, reads configuration only from environment variables, and returns consistent JSON errors. Updating a canvas uses the same payload shape as creating one, which keeps autosave and manual save predictable.

## Features and limitations

Implemented: rectangle/circle/text tools, selection, drag, resize/rotate via Transformer, property editing, delete, layer forward/backward, undo/redo, autosave after 1.2 seconds, PNG export, and full CRUD persistence.

Authentication uses Google through Auth.js. Anonymous visitors can edit locally in the browser, but saving and the saved-canvas/trash views require sign-in. The API verifies the Auth.js encrypted session token and scopes every MongoDB query to that account's stable Google subject, so canvas IDs cannot be used to cross account boundaries.

## Authentication setup

Set the same values in both `frontend/.env` and `backend/.env`:

```env
AUTH_URL=http://localhost:3000
AUTH_SECRET=use-the-same-long-random-secret-in-both-apps
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

Register `http://localhost:3000/api/auth/callback/google` as an authorized Google OAuth redirect URI. If the database already contains canvases from the old single-user version, choose the Google subject that should own them and run:

```powershell
cd backend
$env:LEGACY_USER_ID="the-google-subject"
npm run migrate:ownership
```

The migration removes the old globally-unique canvas-name index, assigns legacy records to that account, and creates the per-user indexes. New records always receive `userId` from the server-side session; client-provided user IDs are ignored.
