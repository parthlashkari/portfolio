import { useState, useEffect, useMemo } from 'react';
import type { Submission } from '../types';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'under_review';

const STATUS_LABEL: Record<string, string> = {
  all:          'All',
  pending:      'Pending',
  approved:     'Approved',
  rejected:     'Rejected',
  under_review: 'Under Review',
};

const PAGE_SIZE = 8;

interface Props { submissions: Submission[]; }

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function SubmissionsPage({ submissions }: Props) {
  const [page, setPage]               = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const counts = useMemo(() => ({
    all:          submissions.length,
    pending:      submissions.filter(s => s.status === 'pending').length,
    approved:     submissions.filter(s => s.status === 'approved').length,
    rejected:     submissions.filter(s => s.status === 'rejected').length,
    under_review: submissions.filter(s => s.status === 'under_review').length,
  }), [submissions]);

  const filtered = useMemo(() =>
    statusFilter === 'all' ? submissions : submissions.filter(s => s.status === statusFilter),
    [submissions, statusFilter],
  );

  // Reset pagination when filter or upstream search changes
  useEffect(() => { setPage(0); }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="page-toolbar">
        <div className="filter-tabs">
          {(['all', 'pending', 'approved', 'under_review', 'rejected'] as const).map(s => (
            <button
              key={s}
              className={`filter-tab${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {STATUS_LABEL[s]} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      <div className="subs-table-wrap">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Form</th>
                <th>Submitter</th>
                <th>Email</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(sub => (
                <tr key={sub.id}>
                  <td><span className="sub-id">{sub.id}</span></td>
                  <td><span className="sub-form">{sub.formTitle}</span></td>
                  <td>
                    <div className="sub-submitter">
                      <div className="avatar-sm">{initials(sub.submitter)}</div>
                      {sub.submitter}
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{sub.email}</td>
                  <td style={{ color: 'var(--muted)' }}>{sub.date}</td>
                  <td>
                    <span className={`badge badge-${sub.status}`}>
                      {STATUS_LABEL[sub.status]}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button className="btn btn-ghost" style={{ padding: '0.2rem 0.5rem' }}>View</button>
                      {sub.status === 'pending' && (
                        <>
                          <button className="btn btn-success" style={{ padding: '0.2rem 0.5rem' }}>Approve</button>
                          <button className="btn btn-danger"  style={{ padding: '0.2rem 0.5rem' }}>Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span className="pagination-info">
            Showing {filtered.length === 0 ? 0 : page * PAGE_SIZE + 1}
            {'\u2013'}
            {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="pagination-btns">
            <button className="pg-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`pg-btn${page === i ? ' active' : ''}`} onClick={() => setPage(i)}>
                {i + 1}
              </button>
            ))}
            <button className="pg-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
