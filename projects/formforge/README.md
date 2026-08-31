# FormForge â€” Enterprise Form Builder & Workflow Platform

A production-inspired enterprise form builder and workflow automation platform built with **React 18 + TypeScript + Vite**. No external UI library â€” every component hand-crafted with CSS custom properties.

**[Live Demo](https://formforge-sand.vercel.app)** Â· **[Portfolio](https://parthlashkari.github.io/portfolio/)**

---

## Features

| Page | What it does |
|---|---|
| **Builder** | 3-panel drag-and-drop form builder â€” field palette, live canvas, properties panel. Click to add, drag to reorder, live preview modal |
| **Forms** | Form template library with status filter (Draft / Published / Archived) and search |
| **Submissions** | Paginated submissions table with status filter, search, and CSV export |
| **Workflow** | Visual TRIGGER â†’ IF â†’ THEN automation rules, toggle active/paused per rule |
| **Settings** | Theme toggle (dark/light), language selector (EN/AR/ES/FR), notification toggles, RBAC roles table |

---

## Tech Stack

- **React 18** with functional components and hooks
- **TypeScript** (strict mode) â€” no `any`, full type safety
- **Vite** â€” instant HMR, optimised production build
- **HTML5 Drag and Drop API** â€” native DnD, no extra library
- **CSS Custom Properties** â€” full dark/light theme via `data-theme` attribute
- **Zero UI dependencies** â€” no MUI, Tailwind, or Ant Design

---

## Getting Started

```bash
git clone https://github.com/parthlashkari/formforge.git
cd formforge
npm install
npm run dev
```

Open [http://localhost:5174](http://localhost:5174)

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
â”œâ”€â”€ App.tsx              # Root â€” routing, search state, theme, CSV export
â”œâ”€â”€ App.css              # All styles (CSS variables, dark/light theme)
â”œâ”€â”€ types.ts             # TypeScript interfaces (FormField, Submission, WorkflowRuleâ€¦)
â”œâ”€â”€ data.ts              # Mock data â€” 8 forms, 15 submissions, 5 workflow rules
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Sidebar.tsx      # Navigation sidebar with collapse toggle
â”‚   â””â”€â”€ Header.tsx       # Title, search bar, theme toggle, export button
â””â”€â”€ pages/
    â”œâ”€â”€ BuilderPage.tsx  # Interactive 3-panel form builder
    â”œâ”€â”€ FormsPage.tsx    # Form library grid with status filter
    â”œâ”€â”€ SubmissionsPage.tsx # Paginated submissions table
    â”œâ”€â”€ WorkflowPage.tsx # Workflow automation rule visualiser
    â””â”€â”€ SettingsPage.tsx # Theme, language, notifications, RBAC
```

---

## Key Implementation Details

### Generic `updateField` with `Partial<T>`
```ts
const updateField = (id: string, patch: Partial<FormField>) => {
  setFields(prev => prev.map(f => (f.id === id ? { ...f, ...patch } : f)));
};
```

### HTML5 DnD reorder via splice
```ts
const handleDragOver = (e: React.DragEvent, targetId: string) => {
  e.preventDefault();
  setFields(prev => {
    const arr = [...prev];
    const [item] = arr.splice(arr.findIndex(f => f.id === draggingId), 1);
    arr.splice(arr.findIndex(f => f.id === targetId), 0, item);
    return arr;
  });
};
```

### CSS theme switching
```ts
document.documentElement.setAttribute('data-theme', theme); // triggers CSS variable swap
```

---

## Author

**Parth Lashkari** â€” Lead Frontend Engineer Â· [LinkedIn](https://www.linkedin.com/in/parth-lashkari-5b730a189/) Â· [Portfolio](https://parthlashkari.github.io/portfolio/)

