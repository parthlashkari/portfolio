import { useState, useMemo } from 'react';
import type { FormTemplate } from '../types';

type StatusFilter = 'all' | 'published' | 'draft' | 'archived';

const CAT_COLOR: Record<string, string> = {
  HR:       'var(--accent)',
  IT:       'var(--info)',
  Finance:  'var(--warning)',
  CX:       'var(--success)',
  Security: 'var(--error)',
};

const STATUS_ICON: Record<string, string> = {
  published: '\u25CE',
  draft:     '\u25D1',
  archived:  '\u229F',
};

interface Props { forms: FormTemplate[]; }

export default function FormsPage({ forms }: Props) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const counts = useMemo(() => ({
    all:       forms.length,
    published: forms.filter(f => f.status === 'published').length,
    draft:     forms.filter(f => f.status === 'draft').length,
    archived:  forms.filter(f => f.status === 'archived').length,
  }), [forms]);

  const filtered = useMemo(() =>
    statusFilter === 'all' ? forms : forms.filter(f => f.status === statusFilter),
    [forms, statusFilter],
  );

  return (
    <div>
      <div className="page-toolbar">
        <div className="filter-tabs">
          {(['all', 'published', 'draft', 'archived'] as const).map(s => (
            <button
              key={s}
              className={`filter-tab${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
            </button>
          ))}
        </div>
        <button className="btn btn-primary">+ New Form</button>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' }}>No forms found.</p>
      ) : (
        <div className="forms-grid">
          {filtered.map(form => (
            <div key={form.id} className="form-card">
              <div className="fc-header">
                <div className="fc-icon">{STATUS_ICON[form.status]}</div>
                <span className={`badge badge-${form.status}`}>{form.status}</span>
              </div>
              <div>
                <div className="fc-title">{form.title}</div>
                <div className="fc-desc">{form.description}</div>
              </div>
              <div className="fc-meta">
                <span style={{ color: CAT_COLOR[form.category] ?? 'var(--muted)' }}>{form.category}</span>
                <span>{'\u25C8'} {form.fieldCount} fields</span>
                <span>{'\u2295'} {form.submissions} submissions</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                Modified {form.lastModified} &middot; {form.createdBy}
              </div>
              <div className="fc-actions">
                <button className="btn btn-secondary" style={{ flex: 1 }}>Edit</button>
                <button className="btn btn-ghost">Duplicate</button>
                {form.status === 'draft'     && <button className="btn btn-success">Publish</button>}
                {form.status === 'published' && <button className="btn btn-ghost">Archive</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
