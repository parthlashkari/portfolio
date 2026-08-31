import type { PageId } from '../App';

interface Props {
  page: PageId;
  setPage: (p: PageId) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const NAV: { id: PageId; icon: string; label: string }[] = [
  { id: 'builder',     icon: '⊞', label: 'Builder'    },
  { id: 'forms',       icon: '≡', label: 'Forms'       },
  { id: 'submissions', icon: '◈', label: 'Submissions' },
  { id: 'workflow',    icon: '⚡', label: 'Workflow'    },
  { id: 'settings',   icon: '⚙', label: 'Settings'    },
];

export default function Sidebar({ page, setPage, open, setOpen }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sb-logo">F</div>
        {open && (
          <div>
            <div className="sb-name">FormForge</div>
            <div className="sb-sub">Enterprise Platform</div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <div
            key={item.id}
            className={`nav-item${page === item.id ? ' active' : ''}`}
            onClick={() => setPage(item.id)}
            title={!open ? item.label : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {open && <span className="nav-label">{item.label}</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-toggle"
          onClick={() => setOpen(!open)}
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {open ? '« Collapse' : '»'}
        </button>
      </div>
    </aside>
  );
}
