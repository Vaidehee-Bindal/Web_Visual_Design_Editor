# 📁 Web-Based Visual Design Editor - Project Structure

*Generated on: 9/14/2026, 2:06:58 PM*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 51 |
| 📁 Total Folders | 27 |
| 🌳 Max Depth | 5 levels |
| 🛠️ Tech Stack | React, TypeScript, CSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📖 **README.md** - Project documentation

## 📊 File Statistics

### By File Type

- ⚛️ **.tsx** (React TypeScript files): 14 files (27.5%)
- 📜 **.js** (JavaScript files): 10 files (19.6%)
- 🎨 **.css** (Stylesheets): 9 files (17.6%)
- ⚙️ **.json** (JSON files): 6 files (11.8%)
- 🔷 **.ts** (TypeScript files): 5 files (9.8%)
- 📄 **.example** (Other files): 2 files (3.9%)
- 🚫 **.gitignore** (Git ignore): 1 files (2.0%)
- 📄 **.mjs** (Other files): 1 files (2.0%)
- 🖼️ **.png** (PNG images): 1 files (2.0%)
- 📄 **.tsbuildinfo** (Other files): 1 files (2.0%)
- 📖 **.md** (Markdown files): 1 files (2.0%)

### By Category

- **React**: 14 files (27.5%)
- **JavaScript**: 10 files (19.6%)
- **Styles**: 9 files (17.6%)
- **Config**: 6 files (11.8%)
- **TypeScript**: 5 files (9.8%)
- **Other**: 4 files (7.8%)
- **DevOps**: 1 files (2.0%)
- **Assets**: 1 files (2.0%)
- **Docs**: 1 files (2.0%)

### 📁 Largest Directories

- **root**: 51 files
- **frontend**: 35 files
- **frontend\app**: 15 files
- **backend**: 13 files
- **frontend\components**: 9 files

## 🌳 Directory Structure

```
Web-Based Visual Design Editor/
├── 🟡 🚫 **.gitignore**
├── 📂 backend/
│   ├── 📄 .env.example
│   ├── ⚙️ config/
│   │   └── 📜 database.js
│   ├── 📂 controllers/
│   │   └── 📜 canvasController.js
│   ├── 📂 middleware/
│   │   ├── 📜 auth.js
│   │   └── 📜 errorHandler.js
│   ├── 📂 models/
│   │   ├── 📜 Canvas.js
│   │   └── 📜 User.js
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 📂 routes/
│   │   └── 📜 canvases.js
│   ├── 📂 scripts/
│   │   └── 📜 migrateOwnership.js
│   ├── 📜 server.js
│   └── 📂 validators/
│   │   └── 📜 canvas.js
├── 📂 frontend/
│   ├── 📄 .env.example
│   ├── 🚀 app/
│   │   ├── 🔌 api/
│   │   │   └── 📂 auth/
│   │   │   │   └── 📂 [...nextauth]/
│   │   │   │   │   └── 🔷 route.ts
│   │   ├── 🎨 auth.css
│   │   ├── 📂 canvas/
│   │   │   └── 📂 [id]/
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── 🎨 canvas-size.css
│   │   ├── 🎨 editor-enhancements.css
│   │   ├── ⚛️ layout.tsx
│   │   ├── 🎨 line-tool.css
│   │   ├── 📂 my-canvases/
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ page.tsx
│   │   ├── 📂 recent/
│   │   ├── 🎨 right-panel.css
│   │   ├── 🎨 sidebar.css
│   │   ├── 🎨 styles.css
│   │   ├── 🎨 text-edit.css
│   │   ├── 🎨 title.css
│   │   └── 📂 trash/
│   │   │   └── ⚛️ page.tsx
│   ├── 🔷 auth.ts
│   ├── 🧩 components/
│   │   ├── ⚛️ AuthProvider.tsx
│   │   ├── ⚛️ CanvasCollectionPage.tsx
│   │   ├── 📂 CanvasEditor/
│   │   │   └── ⚛️ CanvasStage.tsx
│   │   ├── 📂 CanvasList/
│   │   │   └── ⚛️ CanvasList.tsx
│   │   ├── ⚛️ CanvasThumbnail.tsx
│   │   ├── 📂 Dropdown/
│   │   │   └── ⚛️ Dropdown.tsx
│   │   ├── ⚛️ Editor.tsx
│   │   ├── 📂 PropertiesPanel/
│   │   │   └── ⚛️ PropertiesPanel.tsx
│   │   └── 📂 Toolbar/
│   │   │   └── ⚛️ Toolbar.tsx
│   ├── 🔷 next-env.d.ts
│   ├── 📄 next.config.mjs
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 🌐 public/
│   │   └── 🖼️ sketchstack_logo.png
│   ├── 📂 services/
│   │   └── 🔷 api.ts
│   ├── 🟡 🔷 **tsconfig.json**
│   ├── 📄 tsconfig.tsbuildinfo
│   └── 📂 types/
│   │   └── 🔷 next-auth.d.ts
├── 🟡 🔒 **package-lock.json**
└── 🔴 📖 **README.md**
```

## 📖 Legend

### File Types
- 🚫 DevOps: Git ignore
- 📄 Other: Other files
- 📜 JavaScript: JavaScript files
- ⚙️ Config: JSON files
- 🔷 TypeScript: TypeScript files
- 🎨 Styles: Stylesheets
- ⚛️ React: React TypeScript files
- 🖼️ Assets: PNG images
- 📖 Docs: Markdown files

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
