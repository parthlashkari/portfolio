import { useState } from 'react';
import { workflowRules } from '../data';
import type { WorkflowRule } from '../types';

export default function WorkflowPage() {
  const [rules, setRules] = useState<WorkflowRule[]>(workflowRules);

  const toggle = (id: string) => {
    setRules(prev =>
      prev.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r),
    );
  };

  const activeCount = rules.filter(r => r.status === 'active').length;

  return (
    <div>
      <div className="page-toolbar">
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          {activeCount} of {rules.length} rules active
        </span>
        <button className="btn btn-primary">+ New Rule</button>
      </div>

      <div className="workflows-list">
        {rules.map(rule => (
          <div key={rule.id} className="workflow-card">
            <div className="wf-header">
              <div>
                <div className="wf-name">{rule.name}</div>
                <div className="wf-form">Form: {rule.formTitle}</div>
              </div>
              <div className="wf-right">
                <div className="wf-meta">
                  <span>{rule.runs} runs</span>
                  <span>Last: {rule.lastRun}</span>
                </div>
                <span className={`badge badge-${rule.status}`}>{rule.status}</span>
                <button
                  className={`wf-toggle ${rule.status}`}
                  onClick={() => toggle(rule.id)}
                >
                  {rule.status === 'active' ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>

            <div className="wf-pipeline">
              <span className="wf-step trigger">TRIGGER: {rule.trigger}</span>
              <span className="wf-arrow">{'\u2192'}</span>
              <span className="wf-step condition">IF: {rule.condition}</span>
              <span className="wf-arrow">{'\u2192'}</span>
              <span className="wf-step action">THEN: {rule.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
