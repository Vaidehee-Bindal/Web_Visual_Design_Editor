# SketchStack - Web-Based Visual Design Editor

SketchStack is a full-stack visual design editor for creating, editing, saving, and reloading simple graphical compositions. It combines a Next.js and React frontend with a React Konva canvas editor and an Express, MongoDB, and Mongoose backend.

The project demonstrates a maintainable separation between a browser-based scene editor and a REST API that owns persistence, validation, authentication, and canvas ownership.

## Live Demo
Try it here - https://web-visual-design-editor-qyjc.vercel.app/

## What We Built

The editor supports:

- Creating new canvases with a name and configurable dimensions.
- Adding rectangles, circles, text, straight lines, curved lines, and elbow lines.
- Selecting one or multiple elements on a React Konva stage.
- Dragging elements and updating their position in React state.
- Resizing and rotating selected shapes with Konva `Transformer` handles.
- Editing position, dimensions, radius, rotation, fill, stroke, opacity, text, font, alignment, and line settings.
- Inline text editing and multi-selection.
- Deleting selected elements with the toolbar or `Delete`/`Backspace`.
- Copying and pasting selected elements with `Ctrl/Cmd+C` and `Ctrl/Cmd+V`.
- Bringing selected elements forward or sending them backward.
- Undo and redo with `Ctrl/Cmd+Z` and `Ctrl/Cmd+Y`.
- Autosaving after a short period of inactivity, with a manual save option.
- Exporting the current Konva stage as a PNG image.
- Creating, listing, opening, updating, and soft-deleting saved canvases.
- A trash view with restore and permanent deletion actions.
- Google authentication through Auth.js/NextAuth.
- Per-user canvas ownership and server-side access control.
- Anonymous local editing before sign-in; saved cloud canvases require authentication.

## Technology Stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Frontend framework | Next.js 14 App Router | Application routing, server integration, and frontend build |
| UI | React 18 and TypeScript | Component-based editor UI and typed application state |
| Canvas rendering | React Konva and Konva | Scene graph, layers, dragging, selection, and transforms |
| Icons | Lucide React | Consistent toolbar and editor controls |
| Backend runtime | Node.js | API runtime |
| Backend framework | Express.js | REST routing, middleware, CORS, and error handling |
| Database | MongoDB | Persistent canvas and user storage |
| Database ODM | Mongoose | Schemas, indexes, timestamps, and persistence validation |
| Request validation | Zod | Strict API payload validation at the request boundary |
| Authentication | Auth.js/NextAuth with Google OAuth | Sign-in and encrypted session cookies |

## Prerequisites

- Node.js 18.17 or newer. Node.js 20 LTS is recommended.
- npm, included with Node.js.
- MongoDB 6 or newer locally, or a MongoDB Atlas deployment.
- A Google OAuth application if authenticated cloud saving is required.
- Git, if cloning the repository.

Check the installed versions:

```bash
node --version
npm --version
git --version
```

## Clone and Install

```bash
git clone <repository-url>
cd "Web-Based Visual Design Editor"

cd backend
npm install

cd ../frontend
npm install
```

On Windows PowerShell, the same commands work. Keep the backend and frontend in separate terminal windows when running them.

## Environment Configuration

Environment files are intentionally not committed with real credentials. Start from the supplied examples:

### macOS/Linux

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### Windows PowerShell

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env.local
```

### Backend variables

Create or update `backend/.env`:

| Variable | Example | Required | Description |
| --- | --- | --- | --- |
| `PORT` | `4000` | No | Port used by the Express API. Defaults to `4000`. |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/sketchstack` | Yes | MongoDB connection string. |
| `CLIENT_ORIGIN` | `http://localhost:3000,http://localhost:3001` | No | Comma-separated allowed frontend origins. |
| `AUTH_SECRET` | A long random value | Yes for auth | Must match the frontend Auth.js secret. |

### Frontend variables

Create or update `frontend/.env.local`:

| Variable | Example | Required | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | No | Direct backend API base URL. Defaults to the same-origin `/api/backend` proxy. |
| `BACKEND_API_URL` | `http://localhost:4000` | Required when using proxy | Backend URL used by the Next.js API proxy. |
| `AUTH_URL` | `http://localhost:3000` | Yes for auth | Local Auth.js application URL. |
| `AUTH_SECRET` | The same long random value as backend | Yes for auth | Signs and encrypts Auth.js sessions. |
| `AUTH_GOOGLE_ID` | Google client ID | Yes for Google sign-in | OAuth client identifier. |
| `AUTH_GOOGLE_SECRET` | Google client secret | Yes for Google sign-in | OAuth client secret. |

For local development, the simplest setup is `NEXT_PUBLIC_API_URL=http://localhost:4000/api`. The Next.js proxy is also available by leaving `NEXT_PUBLIC_API_URL` unset and setting `BACKEND_API_URL=http://localhost:4000`.

Never commit `.env`, `.env.local`, OAuth secrets, MongoDB credentials, or production session secrets.

## MongoDB Setup

### Local MongoDB

Start MongoDB using the installation method for your operating system. The default local URI is:

```text
mongodb://127.0.0.1:27017/sketchstack
```

The database and collections are created when the application first writes data.

### MongoDB Atlas

1. Create a cluster and database user in MongoDB Atlas.
2. Add your development IP address to the Atlas network access list.
3. Copy the driver connection string.
4. Set it as `MONGODB_URI` in `backend/.env`.
5. Replace the username, password, and database name in the URI as needed.

## Google OAuth Setup

Google sign-in is optional for trying the local canvas, but it is required to save canvases to the authenticated database account.

1. Create OAuth credentials in Google Cloud Console.
2. Configure the consent screen and add a test user if the app is still in testing.
3. Add this authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

4. Put the client ID and secret in `frontend/.env.local`.
5. Put the same `AUTH_SECRET` and `AUTH_URL` values in the frontend and backend configuration.

The backend does not trust a user ID sent by the browser. It decodes the Auth.js session cookie, upserts the signed-in user, and uses the authenticated subject to scope canvas queries.

## Run Locally

Open two terminals from the repository root.

### Terminal 1: backend

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:4000` by default. Verify it with:

```bash
curl http://localhost:4000/health
```

Expected response:

```json
{"status":"ok"}
```

### Terminal 2: frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

### Production-style local run

```bash
cd frontend
npm run build
npm run start
```

The backend can be started without Nodemon with `cd backend` followed by `npm start`.

## Application Workflow

1. Open the editor and create a blank canvas or open an existing canvas.
2. Use the toolbar to add a shape, text, or line.
3. Select an element on the stage, then drag, resize, rotate, or edit it in the properties panel.
4. Use the layer controls to change stacking order.
5. Save manually or leave autosave enabled.
6. Sign in with Google when prompted to persist the canvas to MongoDB.
7. Open `My Canvases` to reload or delete saved work.
8. Open `Trash` to restore a soft-deleted canvas or delete it permanently.

## REST API

The backend base URL is `http://localhost:4000`. All canvas routes require a valid Auth.js session cookie.

| Method | Endpoint | Status | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | `200` | Returns `{ "status": "ok" }`. |
| `POST` | `/api/canvases` | `201` | Creates an authenticated user's canvas. The server assigns ownership. |
| `GET` | `/api/canvases` | `200` | Lists the authenticated user's active canvases, newest updated first. |
| `GET` | `/api/canvases?view=trash` | `200` | Lists the authenticated user's soft-deleted canvases. |
| `GET` | `/api/canvases/:id` | `200` | Loads one active canvas owned by the current user. |
| `PUT` | `/api/canvases/:id` | `200` | Replaces the editable name, dimensions, and elements. |
| `DELETE` | `/api/canvases/:id` | `200` | Soft-deletes an active canvas into trash. |
| `POST` | `/api/canvases/:id/restore` | `200` | Restores a canvas from trash. |
| `DELETE` | `/api/canvases/:id/permanent` | `204` | Permanently deletes a canvas that is already in trash. |

### Canvas payload

Create and update requests use this shape:

```json
{
	"name": "My Design",
	"width": 1000,
	"height": 700,
	"elements": [
		{
			"id": "element-1",
			"type": "rectangle",
			"x": 100,
			"y": 150,
			"width": 200,
			"height": 100,
			"rotation": 0,
			"fill": "#8b5cf6"
		},
		{
			"id": "element-2",
			"type": "circle",
			"x": 400,
			"y": 200,
			"radius": 50,
			"rotation": 0,
			"fill": "#ff8a5b"
		},
		{
			"id": "element-3",
			"type": "text",
			"x": 300,
			"y": 400,
			"width": 250,
			"height": 46,
			"rotation": 0,
			"text": "Hello World",
			"fontSize": 24,
			"fill": "#1d1b24"
		}
	]
}
```

Validation limits include canvas widths from 320 to 2400, heights from 240 to 1600, names up to 80 characters, a maximum of 500 elements, finite numeric coordinates, six-digit hexadecimal colors, and type-specific positive dimensions.

## Bonus Features Implementation

The project implements the following bonus requirements beyond the basic rectangle, circle, and text editor:

| Bonus | Implementation |
| --- | --- |
| Layer management | Elements are stored in render order inside the canvas `elements` array. The properties panel can move selected elements forward or backward by swapping their array positions. |
| Undo and redo | `Editor.tsx` keeps bounded `history` and `future` arrays in React state. Mutating an element records the previous element array, while undo and redo move snapshots between the two stacks. |
| Autosave | Autosave is enabled by default. After an edit marks the canvas as unsaved, a short debounce waits for inactivity before calling the same create/update API path used by manual save. In-flight saves are coalesced and repeat when a newer edit arrives. |
| Authentication | Auth.js/NextAuth provides Google sign-in. The backend decodes the session cookie using `AUTH_SECRET`, synchronizes the user record, and derives `userId` from the verified session rather than from request data. |
| Export | The active Konva stage is converted to a PNG data URL with `stage.toDataURL({ pixelRatio: 2 })` and downloaded using the active canvas name. |
| Trash and restore | Normal deletion sets `deletedAt` instead of immediately removing the MongoDB document. Active and trash views use separate queries, and a restore endpoint clears the timestamp. Permanent deletion is available only for documents already in trash. |
| Additional drawing tools | The editor includes straight, curved, and elbow lines. Line points and style are persisted with the same element model as shapes and text. |
| Clipboard and multi-selection | Users can select multiple elements, copy them to an in-memory clipboard, and paste offset duplicates with new element IDs. |

These features are intentionally implemented in the editor state and API layers rather than as separate persistence systems. That keeps manual save, autosave, reload, and export behavior consistent.

## Architecture

### Frontend

- Next.js App Router provides application pages and the Auth.js route.
- `Editor` owns canvas documents, selection, history, autosave, clipboard, and save state.
- `CanvasStage` is the React Konva boundary. It renders a `Stage` and `Layer`, maps element types to Konva nodes, and synchronizes drag and transform events back into React state.
- `Toolbar`, `PropertiesPanel`, `CanvasList`, and collection pages keep UI responsibilities focused.
- `services/api.ts` provides a typed browser API client.
- The Next.js backend proxy can forward requests and Auth.js cookies when proxy configuration is used.

### Backend

The request path is:

```text
HTTP request
	-> CORS and JSON middleware
	-> requireAuth
	-> canvas route
	-> controller
	-> Zod validation
	-> Mongoose model and MongoDB
	-> JSON response or centralized error handler
```

The Express API contains no frontend rendering logic. Canvas names are unique per user, queries always include the authenticated user ID, and `deletedAt` distinguishes active documents from trash documents.

## Design and Architecture Decisions

### React Konva for the editor surface

The canvas uses React Konva `Stage`, `Layer`, shape nodes, and `Transformer` instead of HTML elements positioned with CSS. This gives the editor a scene graph suited to graphical composition, supports native dragging and transforms, and makes PNG export possible from the same rendered stage. Konva events are translated back into serializable React state so the persisted document remains independent of the canvas runtime.

### React state as the source of truth

The active canvas and its elements live in React state. Drag and transform handlers normalize changes into element properties such as `x`, `y`, `width`, `height`, `radius`, and `rotation`. This avoids keeping a separate hidden Konva document and makes properties-panel editing, undo/redo, autosave, and persistence operate on one consistent model.

### Focused frontend components

`Editor` coordinates workflow state, while `CanvasStage`, `Toolbar`, `PropertiesPanel`, `CanvasList`, and collection pages own focused UI concerns. This keeps rendering, controls, property editing, and saved-canvas navigation replaceable without putting the entire product in one component.

### Routes, controllers, validators, and models

The backend uses a conventional Express flow: routes authenticate and dispatch requests, controllers apply application rules, Zod validates external input, and Mongoose owns the database schema. The API does not contain frontend-specific rendering behavior, and the frontend does not construct MongoDB queries.

### REST payloads are full editable canvas documents

Create and update requests use the same canvas shape. This makes manual save and autosave share one API contract, keeps reload behavior predictable, and allows the backend to validate the complete document before replacing editable state. The server controls ownership, timestamps, normalized names, and deletion state.

### Per-user ownership and soft deletion

Every canvas query includes the authenticated user ID. Names are unique per user through a normalized `nameKey` and compound index, rather than globally across all accounts. Soft deletion preserves a recovery path and keeps permanent deletion as an explicit action from the trash view.

### Validation at two boundaries

Zod rejects malformed or oversized request data before database work begins. Mongoose then enforces schema types, enum values, limits, timestamps, and indexes at persistence time. The two layers protect both the HTTP boundary and direct model operations.

### Direct API and Next.js proxy support

The typed frontend client can call Express directly with `NEXT_PUBLIC_API_URL`, or use the Next.js catch-all proxy with `BACKEND_API_URL`. Supporting both keeps local development simple while allowing deployments where the browser should communicate with one same-origin frontend URL.

### Authentication is optional for local composition, required for persistence

Anonymous users can experiment with a local in-browser canvas without creating an account. Cloud CRUD operations require Google authentication, which keeps the first-use experience lightweight while ensuring saved documents have a verified owner.

## Safety and Security

- Authentication is required for every `/api/canvases` route.
- Canvas reads, updates, restores, and deletes are scoped to the authenticated user's ID.
- Client-supplied user IDs are ignored; ownership comes from the verified Auth.js session.
- Auth.js session cookies are decoded with the server-side `AUTH_SECRET`.
- Zod validates request bodies before they reach MongoDB.
- Mongoose schemas provide a second validation layer, strict element fields, size limits, timestamps, and indexes.
- CORS uses configured origins and permits local development hosts only.
- Express JSON parsing is limited to 1 MB to reduce oversized request risk.
- Secrets belong in environment files and must not be committed.
- MongoDB Atlas deployments should use a restricted database user and an allowlisted network rather than an open network rule.
- Production deployments should use HTTPS, a strong randomly generated `AUTH_SECRET`, restricted OAuth redirect URIs, and production-specific `CLIENT_ORIGIN` values.

## Project Structure

```text
Web-Based Visual Design Editor/
|
|-- README.md
|-- backend/
|   |-- .env.example
|   |-- package.json
|   |-- server.js
|   |-- config/database.js
|   |-- controllers/canvasController.js
|   |-- middleware/auth.js
|   |-- middleware/errorHandler.js
|   |-- models/Canvas.js
|   |-- models/User.js
|   |-- routes/canvases.js
|   |-- scripts/migrateOwnership.js
|   `-- validators/canvas.js
|
`-- frontend/
		|-- .env.example
		|-- package.json
		|-- next.config.mjs
		|-- auth.ts
		|-- app/
		|   |-- layout.tsx, page.tsx
		|   |-- api/auth/[...nextauth]/route.ts
		|   |-- api/backend/[...path]/route.ts
		|   |-- canvas/[id]/page.tsx
		|   |-- my-canvases/page.tsx
		|   |-- recent/
		|   |-- trash/page.tsx
		|   `-- *.css
		|-- components/
		|   |-- AuthProvider.tsx
		|   |-- CanvasCollectionPage.tsx
		|   |-- CanvasThumbnail.tsx
		|   |-- Editor.tsx
		|   |-- CanvasEditor/CanvasStage.tsx
		|   |-- CanvasList/CanvasList.tsx
		|   |-- Dropdown/Dropdown.tsx
		|   |-- PropertiesPanel/PropertiesPanel.tsx
		|   `-- Toolbar/Toolbar.tsx
		|-- services/api.ts
		`-- types/next-auth.d.ts
```

### Structure table

| Path | One-line responsibility |
| --- | --- |
| `backend/server.js` | Creates the Express app, configures middleware, connects MongoDB, and mounts routes. |
| `backend/config/database.js` | Opens and reuses the Mongoose MongoDB connection. |
| `backend/routes/canvases.js` | Defines authenticated canvas, trash, restore, and permanent-delete endpoints. |
| `backend/controllers/canvasController.js` | Implements canvas CRUD, ownership filters, name uniqueness, and trash behavior. |
| `backend/models/Canvas.js` | Defines canvas and element schemas, timestamps, and user-scoped indexes. |
| `backend/models/User.js` | Stores user identity synchronized from the Auth.js session. |
| `backend/validators/canvas.js` | Defines Zod rules for canvas and element request payloads. |
| `backend/middleware/auth.js` | Reads and verifies Auth.js cookies and attaches the authenticated user. |
| `backend/middleware/errorHandler.js` | Converts thrown API errors into consistent HTTP responses. |
| `backend/scripts/migrateOwnership.js` | Migrates legacy canvases to a selected user account. |
| `frontend/app/` | Contains Next.js routes, page layouts, server handlers, and styling. |
| `frontend/app/api/auth/[...nextauth]/route.ts` | Exposes the Auth.js Google authentication route. |
| `frontend/app/api/backend/[...path]/route.ts` | Optionally proxies frontend API requests and forwards session cookies. |
| `frontend/components/Editor.tsx` | Coordinates canvas state, selection, history, clipboard, saving, autosave, and export. |
| `frontend/components/CanvasEditor/CanvasStage.tsx` | Renders the React Konva `Stage`, `Layer`, shapes, lines, and transformers. |
| `frontend/components/Toolbar/Toolbar.tsx` | Provides creation, save, export, history, zoom, fullscreen, and autosave controls. |
| `frontend/components/PropertiesPanel/PropertiesPanel.tsx` | Edits the selected element's visual and geometric properties. |
| `frontend/components/CanvasList/CanvasList.tsx` | Displays saved canvas navigation items. |
| `frontend/components/CanvasCollectionPage.tsx` | Implements active-canvas and trash collection views. |
| `frontend/services/api.ts` | Provides typed frontend functions for all backend endpoints. |
| `frontend/auth.ts` | Configures the Auth.js provider and session behavior. |
| `frontend/.env.example` | Documents frontend API and Google OAuth configuration. |
| `backend/.env.example` | Documents backend, database, CORS, and session configuration. |

## Data Model

Each canvas stores `userId`, `name`, normalized `nameKey`, bounded `width` and `height`, an `elements` array, `deletedAt`, and Mongoose `createdAt`/`updatedAt` timestamps. Supported element types are `rectangle`, `circle`, `text`, `line`, and `curve`, with optional properties such as `radius`, `points`, `fontSize`, `stroke`, and `lineStyle`.

## Legacy Ownership Migration

If a database contains canvases from an older single-user version, set the intended Google subject as `LEGACY_USER_ID` and run:

```powershell
cd backend
$env:LEGACY_USER_ID="the-google-subject"
npm run migrate:ownership
```

The script requires `MONGODB_URI`. It assigns legacy records to the selected account and prepares ownership indexes. New records always get ownership from the server-side session.

## Known Limitations

- This is a lightweight design canvas, not a full vector design suite.
- Persistence is MongoDB-only; there is no offline database or conflict-resolution protocol.
- Autosave is client-driven and depends on an authenticated, reachable API.
- Undo/redo history is browser memory and resets after reload.
- PNG export is supported; SVG, PDF, and multi-page export are not.
- Google OAuth is required for cloud persistence, while anonymous edits remain local.
- There is no automated test suite or CI workflow included yet.
- Production deployment still requires HTTPS, secrets, database, and OAuth configuration.

## Available Scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Creates a production frontend build. |
| `npm run start` | Serves the production build. |
| `npm run lint` | Runs the configured Next.js lint command. |

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Starts Express with Nodemon reloads. |
| `npm start` | Starts Express with Node.js. |
| `npm run migrate:ownership` | Migrates legacy canvas ownership. |

## Troubleshooting

### API returns `Authentication required`

Check that the frontend and backend use the same `AUTH_SECRET`, Google OAuth is configured, the redirect URI is correct, and requests are made with credentials. Sign in again after changing environment variables.

### API cannot connect to MongoDB

Confirm that MongoDB is running, `MONGODB_URI` is present in `backend/.env`, and an Atlas deployment allows the current IP address. Restart the backend after changing environment variables.

### Frontend reports `BACKEND_API_URL is not configured`

Either set `BACKEND_API_URL=http://localhost:4000` for the Next.js proxy or set `NEXT_PUBLIC_API_URL=http://localhost:4000/api` to call the backend directly.

### Port already in use

Set `PORT` to another backend port and update `NEXT_PUBLIC_API_URL`, `BACKEND_API_URL`, and `CLIENT_ORIGIN` to match.

