import { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BuilderPage from './pages/BuilderPage';
import FormsPage from './pages/FormsPage';
import SubmissionsPage from './pages/SubmissionsPage';
import WorkflowPage from './pages/WorkflowPage';
import SettingsPage from './pages/SettingsPage';
import { submissions as allSubmissions, forms as allForms } from './data';

export type PageId = 'builder' | 'forms' | 'submissions' | 'workflow' | 'settings';

const PAGE_META: Record<PageId, { title: string; subtitle: string; searchPlaceholder?: string }> = {
  builder:     { title: 'Form Builder',         subtitle: 'Design dynamic forms with drag-and-drop field ordering' },
  forms:       { title: 'Forms Library',         subtitle: 'Manage and publish your form templates', searchPlaceholder: 'Search forms...' },
  submissions: { title: 'Submissions',           subtitle: 'Review, approve, and export form responses', searchPlaceholder: 'Search submissions...' },
  workflow:    { title: 'Workflow Automation',   subtitle: 'Automate form processing with conditional rules' },
  settings:    { title: 'Settings',              subtitle: 'Configure platform preferences and access control' },
};

export default function App() {
  const [page, setPage]           = useState<PageId>('builder');
  const [search, setSearch]       = useState('');
  const [theme, setTheme]         = useState<'dark' | 'light'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { setSearch(''); }, [page]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const filteredForms = useMemo(() =>
    allForms.filter(f =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const filteredSubmissions = useMemo(() =>
    allSubmissions.filter(s =>
      s.submitter.toLowerCase().includes(search.toLowerCase()) ||
      s.formTitle.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  function exportCSV() {
    const rows = filteredSubmissions.map(s =>
      [s.id, s.formTitle, s.submitter, s.email, s.date, s.status].join(',')
    );
    const csv  = ['ID,Form,Submitter,Email,Date,Status', ...rows].join('\n');
    const url  = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'submissions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const meta = PAGE_META[page];

  return (
    <div className={`app-shell${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
      <Sidebar page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="main-area">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          search={meta.searchPlaceholder ? search : undefined}
          setSearch={meta.searchPlaceholder ? setSearch : undefined}
          placeholder={meta.searchPlaceholder}
          theme={theme}
          setTheme={setTheme}
          showExport={page === 'submissions'}
          onExport={exportCSV}
        />
        <div className="page-content">
          {page === 'builder'     && <BuilderPage />}
          {page === 'forms'       && <FormsPage forms={filteredForms} />}
          {page === 'submissions' && <SubmissionsPage submissions={filteredSubmissions} />}
          {page === 'workflow'    && <WorkflowPage />}
          {page === 'settings'    && <SettingsPage theme={theme} setTheme={setTheme} />}
        </div>
      </div>
    </div>
  );
}
