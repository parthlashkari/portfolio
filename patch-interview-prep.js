const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'interview-prep.html');
let html = fs.readFileSync(file, 'utf8');
// Normalize CRLF to LF for reliable string matching
html = html.replace(/\r\n/g, '\n');

// 1. Update hero subtitle
html = html.replace(
  'code walkthrough, best practices, and 30+ Q&amp;A.',
  'code walkthrough, best practices, and 40+ Q&amp;A.'
);

// 2. Update sidebar TOC — add new sections
html = html.replace(
  '    <a href="#qa-deploy">Deployment &amp; CI/CD</a>\n    <a href="#cheatsheet">Quick Cheatsheet</a>',
  `    <a href="#qa-deploy">Deployment &amp; CI/CD</a>
    <a href="#qa-redux">Redux Toolkit</a>
    <a href="#qa-nextjs">Next.js &amp; SSR</a>
    <a href="#qa-advanced">Advanced Patterns</a>
    <a href="#qa-leadership">Leadership &amp; Behavioural</a>
    <a href="#qa-sysdesign">System Design</a>
    <a href="#cheatsheet">Quick Cheatsheet</a>`
);

// 3. Insert new Q&A sections before the cheatsheet comment
const newSections = `
<!-- ──────────────────────────────────────────────
     REDUX TOOLKIT
────────────────────────────────────────────── -->
<section class="section" id="qa-redux">
  <h2>🎯 Interview Questions — Redux Toolkit &amp; State</h2>

  <div class="qa-item">
    <div class="qa-q">Q21. How does Redux Toolkit differ from plain Redux? Why did you adopt it? <span class="qa-tag badge-indigo">RTK</span></div>
    <div class="qa-a">
      <p>Plain Redux requires manually writing action type strings, action creators, and verbose switch-case reducers. RTK's <code>createSlice</code> collapses all three into one declaration and uses <strong>Immer</strong> internally so you write "mutating" syntax that is actually immutable:</p>
      <pre><code>const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [] as Task[],
  reducers: {
    addTask:    (state, action: PayloadAction&lt;Task&gt;) => { state.push(action.payload); },
    removeTask: (state, action: PayloadAction&lt;string&gt;) => {
      return state.filter(t => t.id !== action.payload);
    },
  },
});
export const { addTask, removeTask } = tasksSlice.actions;</code></pre>
      <p>Benefits over plain Redux: ~60% less boilerplate, built-in Immer (immutable updates with mutable syntax), auto-generated action creators, and built-in Redux DevTools support.</p>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q22. When do you choose Redux over React Context? <span class="qa-tag badge-indigo">State Design</span></div>
    <div class="qa-a">
      <p><strong>Rule:</strong> Context for configuration, Redux for data flow.</p>
      <ul>
        <li><strong>Use Context for:</strong> theme, locale, current user object, feature flags — data that changes rarely and is read by many components.</li>
        <li><strong>Use Redux for:</strong> frequently updating shared state (cart, notifications), complex transitions with multiple conditions, state that needs DevTools time-travel, or any state that crosses many unrelated parts of the tree.</li>
      </ul>
      <pre><code>// Context — theme never changes mid-session, simple
const ThemeContext = createContext&lt;'dark' | 'light'&gt;('dark');

// Redux — form state updates on every keystroke across many components
const { data, loading, error } = useSelector(s => s.formBuilder);</code></pre>
      <p>In my professional work I used RTK for dynamic form configuration (fields, validation rules, user inputs) and Context for theme and user session.</p>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q23. What is createAsyncThunk? How do you handle loading and error states? <span class="qa-tag badge-indigo">Async</span></div>
    <div class="qa-a">
      <p><code>createAsyncThunk</code> automatically generates three action types — <code>pending</code>, <code>fulfilled</code>, <code>rejected</code> — and handles the async lifecycle:</p>
      <pre><code>export const fetchUser = createAsyncThunk('user/fetch', async (id: string) => {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
});

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null as string | null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending,   state => { state.loading = true; state.error = null; })
      .addCase(fetchUser.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchUser.rejected,  (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed'; });
  },
});</code></pre>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q24. How do you prevent unnecessary re-renders with useSelector? <span class="qa-tag badge-indigo">Performance</span></div>
    <div class="qa-a">
      <p>Every <code>useSelector</code> call re-renders the component when the selected value changes. Avoid selecting the entire store or large objects:</p>
      <pre><code>// ✗ Bad — re-renders whenever ANY part of state changes
const state = useSelector(s => s);

// ✓ Good — re-renders only when user.name changes
const userName = useSelector((s: RootState) => s.user.name);

// ✓ Best for derived data — memoised with createSelector
const selectVisibleTasks = createSelector(
  [(s: RootState) => s.tasks.items, (s: RootState) => s.tasks.filter],
  (items, filter) => items.filter(t => t.status === filter)  // only re-runs when deps change
);
const visibleTasks = useSelector(selectVisibleTasks);</code></pre>
      <p><code>createSelector</code> from RTK memoises the derived result — the expensive filter only re-runs when <code>items</code> or <code>filter</code> actually changes.</p>
    </div>
  </div>
</section>

<!-- ──────────────────────────────────────────────
     NEXT.JS & SSR
────────────────────────────────────────────── -->
<section class="section" id="qa-nextjs">
  <h2>🎯 Interview Questions — Next.js &amp; SSR</h2>

  <div class="qa-item">
    <div class="qa-q">Q25. Explain SSR, SSG, and ISR. When did you use each? <span class="qa-tag badge-amber">Next.js</span></div>
    <div class="qa-a">
      <table style="width:100%;border-collapse:collapse;font-size:.83rem;margin:.5rem 0">
        <tr style="border-bottom:1px solid var(--border)"><th style="padding:.5rem .75rem;text-align:left;color:var(--muted);font-size:.68rem;text-transform:uppercase">Strategy</th><th style="padding:.5rem .75rem;text-align:left;color:var(--muted);font-size:.68rem;text-transform:uppercase">When rendered</th><th style="padding:.5rem .75rem;text-align:left;color:var(--muted);font-size:.68rem;text-transform:uppercase">Best for</th></tr>
        <tr style="border-bottom:1px solid rgba(45,40,80,.4)"><td style="padding:.5rem .75rem;color:var(--text)">CSR</td><td style="padding:.5rem .75rem;color:var(--text2)">In the browser</td><td style="padding:.5rem .75rem;color:var(--text2)">Dashboards, auth-gated content, real-time data</td></tr>
        <tr style="border-bottom:1px solid rgba(45,40,80,.4)"><td style="padding:.5rem .75rem;color:var(--text)">SSR (getServerSideProps)</td><td style="padding:.5rem .75rem;color:var(--text2)">On every request</td><td style="padding:.5rem .75rem;color:var(--text2)">Personalised pages, always-fresh data</td></tr>
        <tr style="border-bottom:1px solid rgba(45,40,80,.4)"><td style="padding:.5rem .75rem;color:var(--text)">SSG (getStaticProps)</td><td style="padding:.5rem .75rem;color:var(--text2)">At build time</td><td style="padding:.5rem .75rem;color:var(--text2)">Blog posts, marketing pages, documentation</td></tr>
        <tr><td style="padding:.5rem .75rem;color:var(--text)">ISR (revalidate)</td><td style="padding:.5rem .75rem;color:var(--text2)">Build time + periodic refresh</td><td style="padding:.5rem .75rem;color:var(--text2)">Product pages — static but needs periodic freshness</td></tr>
      </table>
      <p>In my professional work: <strong>SSR</strong> for the form rendering engine (each user receives a different form config based on role/context — must be fresh per request). <strong>SSG</strong> for documentation pages. I used <code>revalidate: 60</code> (ISR) for the forms catalogue page which changes daily but doesn't need per-request freshness.</p>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q26. What are React Server Components? How do they differ from Client Components? <span class="qa-tag badge-amber">App Router</span></div>
    <div class="qa-a">
      <p>Server Components (RSC) run <em>only on the server</em> — they can fetch data directly, query databases, and import heavy server-only libraries without sending any of that code to the browser.</p>
      <pre><code>// app/forms/page.tsx — Server Component (default in App Router)
async function FormsPage() {
  const forms = await db.forms.findMany();  // direct DB access, no API layer needed
  return &lt;FormsList forms={forms} /&gt;;       // props are serialised and sent to client
}

// app/forms/FormsList.tsx — Client Component (needs interactivity)
'use client';
export function FormsList({ forms }: { forms: Form[] }) {
  const [filter, setFilter] = useState('all');
  // useState, event handlers, useEffect all work here
}</code></pre>
      <p>Key rule: use Client Components (<code>'use client'</code>) only when you need <code>useState</code>, <code>useEffect</code>, event listeners, or browser-only APIs. Everything else should be a Server Component to keep the JS bundle small.</p>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q27. What is a hydration mismatch and how do you fix it? <span class="qa-tag badge-amber">SSR</span></div>
    <div class="qa-a">
      <p>Hydration is where React attaches event listeners to the server-rendered HTML. A mismatch occurs when what React renders on the client differs from the server HTML:</p>
      <pre><code>// ✗ Bad — window doesn't exist on server, causes mismatch + error
function Component() {
  return &lt;div&gt;{window.innerWidth}px&lt;/div&gt;;
}

// ✓ Fix — access browser APIs only after mount
function Component() {
  const [width, setWidth] = useState(0);
  useEffect(() =&gt; { setWidth(window.innerWidth); }, []);
  return &lt;div&gt;{width}px&lt;/div&gt;;
}</code></pre>
      <p>Other common causes: <code>Date.now()</code>, <code>Math.random()</code>, user locale differences between server and client, and reading from <code>localStorage</code> during render.</p>
    </div>
  </div>
</section>

<!-- ──────────────────────────────────────────────
     ADVANCED PATTERNS
────────────────────────────────────────────── -->
<section class="section" id="qa-advanced">
  <h2>🎯 Interview Questions — Advanced Patterns (FormForge)</h2>

  <div class="qa-item">
    <div class="qa-q">Q28. Explain <code>Partial&lt;T&gt;</code>. Why is it better than individual field setters? <span class="qa-tag badge-indigo">TypeScript</span></div>
    <div class="qa-a">
      <p><code>Partial&lt;T&gt;</code> is a utility type that makes all properties of <code>T</code> optional. In FormForge's <code>updateField</code>, one function replaces ~8 individual setters:</p>
      <pre><code>// Without Partial — requires a separate setter for each field property
const setLabel       = (id: string, v: string)   => setFields(prev => prev.map(f => f.id===id ? {...f,label:v}:f));
const setRequired    = (id: string, v: boolean)  => setFields(prev => prev.map(f => f.id===id ? {...f,required:v}:f));
const setPlaceholder = (id: string, v: string)   => setFields(prev => prev.map(f => f.id===id ? {...f,placeholder:v}:f));
// ...5 more...

// ✓ With Partial&lt;FormField&gt; — ONE function, TypeScript enforces valid keys
const updateField = (id: string, patch: Partial&lt;FormField&gt;) =>
  setFields(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));

// Callers are type-safe:
updateField(id, { label: 'New Label' });              // ✓
updateField(id, { required: true, placeholder: '' }); // ✓ — multiple at once
updateField(id, { typo: 'x' });                       // ✗ — TypeScript error at compile time</code></pre>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q29. How would you extend FormForge to support conditional field logic? <span class="qa-tag badge-amber">Architecture</span></div>
    <div class="qa-a">
      <p>Pure additive extension — no existing code needs to change. Add an optional <code>conditions</code> array to <code>FormField</code>:</p>
      <pre><code>interface Condition { fieldId: string; operator: 'equals' | 'not_equals'; value: string; }

interface FormField {
  // ...existing fields...
  conditions?: Condition[];  // optional — all existing fields work unchanged
}

// In the preview renderer:
function isVisible(field: FormField, values: Record&lt;string, string&gt;): boolean {
  if (!field.conditions?.length) return true;
  return field.conditions.every(c => {
    const actual = values[c.fieldId] ?? '';
    return c.operator === 'equals' ? actual === c.value : actual !== c.value;
  });
}

// Usage:
{fields.filter(f => isVisible(f, formValues)).map(field => &lt;FieldRenderer field={field} /&gt;)}</code></pre>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q30. What patterns did you use to write scalable, maintainable component code? <span class="qa-tag badge-purple">Architecture</span></div>
    <div class="qa-a">
      <ul>
        <li><strong>Single responsibility</strong> — each component does one thing. <code>BuilderPage</code> manages state; <code>FieldCard</code> just renders a field.</li>
        <li><strong>Prop drilling avoidance</strong> — lift state to the closest common ancestor, pass callbacks down. Only reach for Context or Redux when state crosses 3+ levels.</li>
        <li><strong>Derived state over synced state</strong> — <code>const filtered = useMemo(() =&gt; items.filter(...), [items, query])</code> is always correct. Two synced state variables can diverge.</li>
        <li><strong>Immutable updates</strong> — always <code>[...prev]</code> before mutating, or <code>prev.map/filter</code> for arrays. Never mutate React state in place.</li>
        <li><strong>TypeScript union exhaustiveness</strong> — <code>type FieldType = 'text' | 'number' | 'email' | ...</code> makes the compiler flag unhandled cases when a new type is added.</li>
      </ul>
    </div>
  </div>
</section>

<!-- ──────────────────────────────────────────────
     LEADERSHIP & BEHAVIOURAL
────────────────────────────────────────────── -->
<section class="section" id="qa-leadership">
  <h2>🎯 Interview Questions — Leadership &amp; Behavioural</h2>

  <div class="qa-item">
    <div class="qa-q">Q31. Tell me about yourself. <span class="qa-tag badge-green">Intro</span></div>
    <div class="qa-a">
      <p>"I'm a Lead Frontend Engineer with 5.6 years of experience, currently leading the frontend development of an enterprise form and workflow automation platform used by global clients. I joined as a mid-level React developer and progressed to leading a team of 4, defining the frontend architecture, introducing TypeScript across the codebase, and building a 50+ component library from scratch.</p>
      <p>I've received my company's highest peer recognition 3 times for delivering major product milestones on time. Outside of my day job, I've built and deployed 4 production React projects to demonstrate depth of knowledge — an admin dashboard, a Kanban board, a GitHub profile explorer, and an enterprise form builder — all without any UI library.</p>
      <p>I'm now looking for a senior or lead frontend role at a product-first company where I can have a larger impact on both the technical direction and the team's growth."</p>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q32. How do you conduct a code review? <span class="qa-tag badge-green">Leadership</span></div>
    <div class="qa-a">
      <p>I review code at 4 levels, in order of importance:</p>
      <ul>
        <li><strong>Correctness</strong> — Does it handle edge cases? Are there race conditions or null access risks?</li>
        <li><strong>Architecture</strong> — Is the abstraction at the right level? Is there unnecessary coupling or duplication?</li>
        <li><strong>Performance</strong> — Missing memoisation? Unnecessary re-renders? Synchronous blocking on the main thread?</li>
        <li><strong>Readability</strong> — Clear naming? Magic numbers? Would a new team member understand this in 6 months?</li>
      </ul>
      <p>Principles: comments on the <em>code</em>, not the person. For blocking issues I explain the <em>why</em>, not just "do it differently." I use reviews as teaching moments — linking to docs or showing an alternative pattern. Non-blocking suggestions I prefix with "nit:" so the author knows it's optional.</p>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q33. Describe your most challenging technical problem and how you solved it. <span class="qa-tag badge-green">Problem Solving</span></div>
    <div class="qa-a">
      <p>The MUI v4 to v5 migration was the most complex. v5 changed the styling engine from JSS (<code>makeStyles</code>) to Emotion (<code>sx</code> prop / <code>styled</code>), meaning 200+ components needed to be rewritten.</p>
      <p><strong>My approach:</strong></p>
      <ul>
        <li>Wrote a script to inventory all <code>makeStyles</code> usages and generate a migration priority list</li>
        <li>Created an internal migration pattern guide with before/after examples</li>
        <li>Migrated the 20 highest-traffic components first to validate the pattern end-to-end</li>
        <li>Ran both v4 and v5 components in parallel during the transition (via a compatibility layer), avoiding a big-bang cutover</li>
        <li>Shipped incrementally over 6 weeks — never blocked a release cycle</li>
      </ul>
      <p><strong>Result:</strong> Zero production incidents. 40% bundle size reduction (v5 tree-shakes better). All team members followed the guide independently after the first 2 weeks.</p>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q34. How do you mentor junior developers? <span class="qa-tag badge-green">Mentoring</span></div>
    <div class="qa-a">
      <ul>
        <li><strong>Pair programming on complex features</strong> — I think out loud about tradeoffs, not just show the answer</li>
        <li><strong>Code review as teaching</strong> — detailed PR comments with examples, references, and alternative patterns</li>
        <li><strong>Full task ownership</strong> — I assign juniors complete features (not subtasks) so they learn end-to-end thinking: requirements → design → implementation → testing → deployment</li>
        <li><strong>RFC habit</strong> — I ask them to write a one-paragraph plan before coding. Catches design issues before any code is written — the cheapest point to fix them</li>
        <li><strong>30-minute rule</strong> — Let them struggle for 30 minutes before helping. They retain far more from working through the problem than from receiving the answer directly</li>
      </ul>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q35. Why are you exploring new opportunities? <span class="qa-tag badge-green">Motivation</span></div>
    <div class="qa-a">
      <p>"I've had an excellent run — led major architecture decisions, built a large component library, mentored teammates, and delivered multiple flagship releases. I've received the company's highest recognition 3 times.</p>
      <p>I'm now at a point where I want to work on a product where I can see direct user impact more immediately, work at a larger scale of system design, and continue growing toward a staff or engineering lead role. I'm specifically looking for a company with strong engineering culture, meaningful technical challenges, and room to contribute to both product direction and team growth — not just feature delivery."</p>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q36. How do you handle disagreements with a backend developer or PM? <span class="qa-tag badge-green">Collaboration</span></div>
    <div class="qa-a">
      <ul>
        <li><strong>Understand their constraint first</strong> — backend devs have DB/performance concerns, PMs have deadline/scope concerns. Listen before responding.</li>
        <li><strong>Data over opinion</strong> — use benchmarks, bundle sizes, or user metrics to make the case. "It will be slow" is an opinion; "it adds 200ms to LCP per Lighthouse" is a fact.</li>
        <li><strong>Spike before debating</strong> — "let me spend 2 hours proving it works" often ends arguments faster than back-and-forth discussion.</li>
        <li><strong>Distinguish reversible from irreversible decisions</strong> — accept reversible decisions quickly and defer to others; fight only for architectural choices that are expensive to undo later.</li>
        <li><strong>Document the outcome</strong> — write a short ADR (Architecture Decision Record) so the decision and its reasoning are preserved for future team members.</li>
      </ul>
    </div>
  </div>
</section>

<!-- ──────────────────────────────────────────────
     SYSTEM DESIGN
────────────────────────────────────────────── -->
<section class="section" id="qa-sysdesign">
  <h2>🎯 Interview Questions — System Design &amp; Architecture</h2>

  <div class="qa-item">
    <div class="qa-q">Q37. How would you architect a React app expected to scale to 50+ features? <span class="qa-tag badge-amber">Architecture</span></div>
    <div class="qa-a">
      <p><strong>Key decisions at the start:</strong></p>
      <pre><code>src/
  features/          // organised by domain, not by file type
    users/           // UserList.tsx, UserForm.tsx, userSlice.ts, userApi.ts, index.ts
    orders/          // OrderTable.tsx, orderSlice.ts, orderApi.ts, index.ts
  ui/                // pure design-system components (Button, Input, Modal — no business logic)
  hooks/             // shared custom hooks (useDebounce, usePagination)
  store/             // Redux store configuration
  utils/             // pure utility functions</code></pre>
      <ul>
        <li><strong>Barrel exports</strong> — each feature exposes only what's needed via <code>index.ts</code>, preventing cross-feature imports from going deep into implementation files</li>
        <li><strong>RTK Query for all server state</strong> — eliminates loading/error/cache boilerplate, handles re-fetching automatically</li>
        <li><strong>Lazy-loaded routes</strong> — <code>React.lazy(() =&gt; import('./features/users'))</code> so the initial bundle stays small</li>
        <li><strong>ESLint import boundaries</strong> — <code>eslint-plugin-boundaries</code> enforces that features don't import directly from each other, only through a shared layer</li>
        <li><strong>Absolute imports</strong> — <code>import { Button } from 'ui/Button'</code> instead of <code>../../../ui/Button</code></li>
      </ul>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q38. How do you render a table with 50,000 rows without freezing the browser? <span class="qa-tag badge-amber">Performance</span></div>
    <div class="qa-a">
      <p><strong>Virtualisation</strong> — only render the ~20 rows visible in the viewport. The DOM stays small regardless of list size.</p>
      <pre><code>import { useVirtualizer } from '@tanstack/react-virtual';

function BigTable({ rows }: { rows: Row[] }) {
  const parentRef = useRef&lt;HTMLDivElement&gt;(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () =&gt; parentRef.current,
    estimateSize: () =&gt; 48,  // row height in px
  });

  return (
    &lt;div ref={parentRef} style={{ overflow:'auto', height:'600px' }}&gt;
      &lt;div style={{ height: virtualizer.getTotalSize() }}&gt;
        {virtualizer.getVirtualItems().map(vItem =&gt; (
          &lt;div key={vItem.key} style={{ position:'absolute', top:vItem.start }}&gt;
            &lt;TableRow row={rows[vItem.index]} /&gt;
          &lt;/div&gt;
        ))}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}</code></pre>
      <p>Other optimisations: <code>React.memo</code> on <code>TableRow</code>, stable key props, avoid inline objects/functions as props, and use <code>createSelector</code> for filtered/sorted derived data.</p>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q39. How would you implement role-based access control (RBAC) in a React frontend? <span class="qa-tag badge-amber">Security</span></div>
    <div class="qa-a">
      <pre><code>// 1. Permission context — populated from the auth response
const PermissionCtx = createContext&lt;string[]&gt;([]);

// 2. Hook to check a single permission
function usePermission(perm: string) {
  return useContext(PermissionCtx).includes(perm);
}

// 3. Conditional UI — hides elements the user can't use
function DeleteButton({ id }: { id: string }) {
  const canDelete = usePermission('delete');
  return canDelete ? &lt;button onClick={() =&gt; remove(id)}&gt;Delete&lt;/button&gt; : null;
}

// 4. Route guard — redirects unauthorised users
function RequirePermission({ perm, children }: { perm: string; children: ReactNode }) {
  const has = usePermission(perm);
  return has ? &lt;&gt;{children}&lt;/&gt; : &lt;Navigate to="/unauthorised" replace /&gt;;
}</code></pre>
      <div class="tip-box warn" style="margin-top:.75rem">
        <div class="tip-label">Critical Security Note</div>
        <p>Frontend RBAC is <strong>UX protection only</strong>, not security. The real authorization must happen on the server/API for every request. The frontend prevents accidental navigation to forbidden areas — it does not prevent a determined attacker from calling the API directly.</p>
      </div>
    </div>
  </div>

  <div class="qa-item">
    <div class="qa-q">Q40. What is code splitting and how do you implement it in React? <span class="qa-tag badge-green">Performance</span></div>
    <div class="qa-a">
      <p>Code splitting breaks the JS bundle into smaller chunks loaded on demand. Without it, users download <em>all</em> application code on first visit — including pages they may never open.</p>
      <pre><code>// ✗ Eager — user downloads every page on initial load
import UserPage    from './pages/UserPage';
import ReportsPage from './pages/ReportsPage';
import AdminPage   from './pages/AdminPage';

// ✓ Lazy — each page is a separate chunk, loaded only when navigated to
const UserPage    = React.lazy(() =&gt; import('./pages/UserPage'));
const ReportsPage = React.lazy(() =&gt; import('./pages/ReportsPage'));
const AdminPage   = React.lazy(() =&gt; import('./pages/AdminPage'));

// Suspense provides the loading fallback while the chunk downloads
&lt;Suspense fallback={&lt;PageSpinner /&gt;}&gt;
  &lt;Routes&gt;
    &lt;Route path="/users"   element={&lt;UserPage /&gt;} /&gt;
    &lt;Route path="/reports" element={&lt;ReportsPage /&gt;} /&gt;
  &lt;/Routes&gt;
&lt;/Suspense&gt;</code></pre>
      <p>In a large app with 20 routes this can reduce the initial bundle by <strong>60–70%</strong>. Vite handles the chunk splitting automatically — each dynamic import becomes a separate file in <code>dist/</code>.</p>
    </div>
  </div>
</section>

`;

html = html.replace(
  `<!-- ──────────────────────────────────────────────
     CHEATSHEET`,
  newSections + `<!-- ──────────────────────────────────────────────
     CHEATSHEET`
);

// 4. Update cheatsheet — add Redux and Next.js items
html = html.replace(
  `    <div class="bp-item"><div class="bp-item-title">Why encodeURIComponent?</div><p>Encodes special chars in user input before using in URLs. Prevents URL injection, handles spaces, slashes, and non-ASCII chars safely.</p></div>
  </div>`,
  `    <div class="bp-item"><div class="bp-item-title">Why encodeURIComponent?</div><p>Encodes special chars in user input before using in URLs. Prevents URL injection, handles spaces, slashes, and non-ASCII chars safely.</p></div>
    <div class="bp-item"><div class="bp-item-title">Redux vs Context</div><p>Context for config (theme, locale). Redux for frequently changing shared data (cart, form state, notifications) needing predictable updates and DevTools.</p></div>
    <div class="bp-item"><div class="bp-item-title">createSlice vs createReducer</div><p><code>createSlice</code> = action types + action creators + reducer in one. Auto-generates action creators. Uses Immer for immutable updates.</p></div>
    <div class="bp-item"><div class="bp-item-title">SSR vs SSG</div><p>SSR: rendered per request (fresh, personalised). SSG: rendered at build time (fast, cached). ISR: SSG + revalidate on a timer.</p></div>
    <div class="bp-item"><div class="bp-item-title">Partial&lt;T&gt; utility type</div><p>Makes all properties of T optional. Useful for update patches — one <code>updateField(id, patch)</code> replaces N individual setters.</p></div>
    <div class="bp-item"><div class="bp-item-title">Code splitting benefit</div><p>Lazy-loading 20 routes can cut the initial bundle by 60–70%. Users only download the page they navigate to.</p></div>
    <div class="bp-item"><div class="bp-item-title">RBAC — frontend vs backend</div><p>Frontend RBAC = UX only. Real security lives on the server. Always validate permissions in API responses, not just in UI conditionals.</p></div>
  </div>`
);

// 5. Update key numbers to mention FormForge
html = html.replace(
  '<div class="hero-stat"><div class="hero-stat-val">React 18.3</div><div class="hero-stat-lbl">All 3 projects use concurrent features</div></div>',
  '<div class="hero-stat"><div class="hero-stat-val">React 18.3</div><div class="hero-stat-lbl">All 4 projects use concurrent features</div></div>'
);

fs.writeFileSync(file, html, 'utf8');
console.log('Done. Lines:', html.split('\n').length);
