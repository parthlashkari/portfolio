# Portfolio Projects — Source Code

3 complete, production-quality React + TypeScript projects you can upload to GitHub.

---

## Projects

### 1. 🟣 NovaDash — Admin Analytics Dashboard
**Repo name to create:** `nova-dash`

```bash
cd admin-dashboard
npm install
npm run dev     # → http://localhost:5173
npm run build   # production build
```

**What it demonstrates:**
- Custom SVG line chart & bar chart (no recharts/chart.js — built from scratch, more impressive to interviewers)
- Dark / light mode with CSS custom properties
- Sidebar collapse animation
- Sortable, paginated data table with live search
- React state with `useState` + `useMemo`
- TypeScript strict mode — all types defined

---

### 2. 📋 TaskFlow — Kanban Task Manager
**Repo name to create:** `taskflow`

```bash
cd taskflow
npm install
npm run dev     # → http://localhost:5174
```

**What it demonstrates:**
- Native HTML5 drag-and-drop between columns (no react-dnd or similar)
- Full CRUD: Add, Edit, Delete tasks via slide-in modal
- Priority system (High / Medium / Low) with color coding
- Tag-based organization
- `localStorage` persistence — data survives page refreshes
- Custom `useLocalStorage` hook (reusable pattern)
- TypeScript discriminated unions for types

---

### 3. 🔍 DevFinder — GitHub Profile Explorer
**Repo name to create:** `devfinder`

```bash
cd devfinder
npm install
npm run dev     # → http://localhost:5175
```

**What it demonstrates:**
- Real GitHub REST API integration (no API key needed for public endpoints)
- Custom `useGitHub` async hook with proper loading/error states
- Loading skeleton animations
- Language filter for repositories
- Error handling (404, rate limit, network error)
- `Promise.all` for parallel API calls
- Language color mapping

---

## How to upload each project to GitHub

### For each project (repeat 3 times):

1. Create a new **public** repo on GitHub (e.g. `nova-dash`)
2. Open a terminal in the project folder (e.g. `admin-dashboard/`)
3. Run:
```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nova-dash.git
git push -u origin main
```

---

## How to deploy for free (get a live demo URL)

### Option A — Vercel (recommended, zero config)
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click "Add New Project" → Import your repo
3. Framework: Vite (auto-detected)
4. Click Deploy
5. Live in ~30 seconds at `nova-dash-parthlashkari.vercel.app`

### Option B — Netlify
1. Go to [netlify.com](https://netlify.com) → Sign in with GitHub
2. "Add new site" → "Import an existing project" → Pick your repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click Deploy

### Option C — GitHub Pages (with Vite)
Add to `vite.config.ts`:
```ts
export default defineConfig({
  plugins: [react()],
  base: '/YOUR_REPO_NAME/',  // ← add this
})
```
Then run:
```bash
npm install --save-dev gh-pages
```
Add to `package.json` scripts:
```json
"deploy": "npm run build && npx gh-pages -d dist"
```
Then: `npm run deploy`

---

## After deploying — update portfolio links

In all 3 portfolio HTML files, add your live demo URL next to the GitHub link:
```html
<a href="https://nova-dash-your-name.vercel.app" target="_blank">Live Demo ↗</a>
<a href="https://github.com/YOUR_USERNAME/nova-dash" target="_blank">GitHub ↗</a>
```
