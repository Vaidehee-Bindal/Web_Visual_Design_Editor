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

This is intentionally a single-user demo: authentication, collaboration, image assets, and per-user authorization are not included. The canvas coordinate system is fixed to the selected canvas dimensions and is displayed responsively through CSS scaling.

