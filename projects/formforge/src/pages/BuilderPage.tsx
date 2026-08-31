import { useState } from 'react';
import type { FormField, FieldType } from '../types';

interface PaletteItem { type: FieldType; label: string; icon: string; }

const PALETTE: PaletteItem[] = [
  { type: 'text',     label: 'Short Text', icon: 'Aa'  },
  { type: 'number',   label: 'Number',     icon: '##'  },
  { type: 'email',    label: 'Email',      icon: '@'   },
  { type: 'date',     label: 'Date',       icon: 'D'   },
  { type: 'dropdown', label: 'Dropdown',   icon: '\u25BC' },
  { type: 'checkbox', label: 'Checkbox',   icon: '\u2610' },
  { type: 'radio',    label: 'Radio',      icon: '\u25CE' },
  { type: 'textarea', label: 'Long Text',  icon: '\u00B6' },
];

const HAS_OPTIONS: FieldType[] = ['dropdown', 'radio', 'checkbox'];

function makeField(type: FieldType): FormField {
  return {
    id: crypto.randomUUID(),
    type,
    label: PALETTE.find(p => p.type === type)!.label,
    placeholder: '',
    required: false,
    options: HAS_OPTIONS.includes(type) ? ['Option 1', 'Option 2'] : [],
  };
}

const INITIAL_FIELDS: FormField[] = [
  { id: '1', type: 'text',     label: 'Full Name',       placeholder: 'Enter your full name',  required: true,  options: []                                          },
  { id: '2', type: 'email',    label: 'Email Address',   placeholder: 'you@company.com',       required: true,  options: []                                          },
  { id: '3', type: 'dropdown', label: 'Department',      placeholder: '',                      required: false, options: ['Engineering', 'HR', 'Finance', 'Marketing'] },
];

export default function BuilderPage() {
  const [formTitle, setFormTitle]     = useState('Employee Onboarding');
  const [fields, setFields]           = useState<FormField[]>(INITIAL_FIELDS);
  const [selectedId, setSelectedId]   = useState<string | null>('1');
  const [draggingId, setDraggingId]   = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved]             = useState(false);

  const addField = (type: FieldType) => {
    const f = makeField(type);
    setFields(prev => [...prev, f]);
    setSelectedId(f.id);
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  };

  const updateField = (id: string, patch: Partial<FormField>) => {
    setFields(prev => prev.map(f => (f.id === id ? { ...f, ...patch } : f)));
  };

  const handleDragStart = (id: string) => setDraggingId(id);

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;
    setFields(prev => {
      const arr      = [...prev];
      const fromIdx  = arr.findIndex(f => f.id === draggingId);
      const toIdx    = arr.findIndex(f => f.id === targetId);
      const [item]   = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, item);
      return arr;
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selected = fields.find(f => f.id === selectedId) ?? null;

  return (
    <div className="builder-container">
      {/* Toolbar */}
      <div className="builder-toolbar">
        <input
          value={formTitle}
          onChange={e => setFormTitle(e.target.value)}
          placeholder="Form title..."
        />
        <button className="btn btn-secondary" onClick={() => setShowPreview(true)}>Preview</button>
        <button className="btn btn-secondary" onClick={handleSave}>{saved ? 'Saved!' : 'Save Draft'}</button>
        <button className="btn btn-primary">Publish</button>
      </div>

      {/* 3-panel workspace */}
      <div className="builder-workspace">

        {/* Left: Field Palette */}
        <div className="builder-panel">
          <div className="builder-panel-title">Field Types</div>
          <div className="field-palette">
            {PALETTE.map(({ type, label, icon }) => (
              <div key={type} className="palette-item" onClick={() => addField(type)}>
                <span className="palette-icon">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Centre: Form Canvas */}
        <div className="builder-panel">
          <div className="builder-panel-title">
            Form Canvas — {fields.length} field{fields.length !== 1 ? 's' : ''}
          </div>
          {fields.length === 0 ? (
            <div className="canvas-empty">
              <div className="canvas-empty-icon">{'\u229E'}</div>
              <h3>Canvas is empty</h3>
              <p>Click a field type on the left to add it here.</p>
            </div>
          ) : (
            <div className="canvas-area">
              {fields.map(field => (
                <div
                  key={field.id}
                  className={`field-card${selectedId === field.id ? ' selected' : ''}${draggingId === field.id ? ' dragging' : ''}`}
                  draggable
                  onClick={() => setSelectedId(field.id)}
                  onDragStart={() => handleDragStart(field.id)}
                  onDragOver={e => handleDragOver(e, field.id)}
                  onDragEnd={() => setDraggingId(null)}
                >
                  <span className="field-drag">{'\u283F'}</span>
                  <div className="field-info">
                    <div className="field-card-label">
                      {field.label}
                      {field.required && <span className="field-required"> *</span>}
                    </div>
                    <div className="field-card-type">{field.type}</div>
                  </div>
                  <button
                    className="field-del"
                    onClick={e => { e.stopPropagation(); deleteField(field.id); }}
                  >
                    {'\u2715'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Properties Panel */}
        <div className="builder-panel">
          <div className="builder-panel-title">Properties</div>
          {!selected ? (
            <div className="props-empty">
              <span style={{ fontSize: '1.8rem', opacity: 0.3 }}>{'\u2699'}</span>
              <p style={{ fontSize: '0.78rem' }}>Select a field to edit its properties</p>
            </div>
          ) : (
            <div className="props-form">
              <div className="prop-group">
                <label className="prop-label">Label</label>
                <input
                  className="prop-input"
                  value={selected.label}
                  onChange={e => updateField(selected.id, { label: e.target.value })}
                />
              </div>

              {!['checkbox', 'radio', 'date'].includes(selected.type) && (
                <div className="prop-group">
                  <label className="prop-label">Placeholder</label>
                  <input
                    className="prop-input"
                    value={selected.placeholder}
                    onChange={e => updateField(selected.id, { placeholder: e.target.value })}
                  />
                </div>
              )}

              <div className="prop-group">
                <div className="prop-toggle">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={selected.required}
                      onChange={e => updateField(selected.id, { required: e.target.checked })}
                    />
                    <span className="toggle-slider" />
                  </label>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>Required field</span>
                </div>
              </div>

              {HAS_OPTIONS.includes(selected.type) && (
                <div className="prop-group">
                  <label className="prop-label">Options</label>
                  <div className="options-list">
                    {selected.options.map((opt, i) => (
                      <div key={i} className="option-row">
                        <input
                          className="prop-input"
                          value={opt}
                          onChange={e => {
                            const opts = [...selected.options];
                            opts[i]    = e.target.value;
                            updateField(selected.id, { options: opts });
                          }}
                        />
                        <button
                          className="option-del"
                          onClick={() => updateField(selected.id, { options: selected.options.filter((_, j) => j !== i) })}
                        >
                          {'\u2715'}
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}
                      onClick={() => updateField(selected.id, { options: [...selected.options, `Option ${selected.options.length + 1}`] })}
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{formTitle}</div>
              <button className="modal-close" onClick={() => setShowPreview(false)}>{'\u2715'}</button>
            </div>
            <div className="modal-body">
              {fields.length === 0 ? (
                <p style={{ color: 'var(--muted)', textAlign: 'center' }}>No fields added yet.</p>
              ) : (
                fields.map(field => (
                  <div key={field.id} className="preview-field">
                    <label>
                      {field.label}
                      {field.required && <span style={{ color: 'var(--error)', marginLeft: '3px' }}>*</span>}
                    </label>
                    {field.type === 'textarea' && (
                      <textarea placeholder={field.placeholder} rows={3} />
                    )}
                    {field.type === 'dropdown' && (
                      <select>
                        <option value="">Select an option...</option>
                        {field.options.map((o, i) => <option key={i}>{o}</option>)}
                      </select>
                    )}
                    {field.type === 'checkbox' && (
                      <div className="preview-checkbox-group">
                        {field.options.map((o, i) => (
                          <label key={i} className="preview-option">
                            <input type="checkbox" /> {o}
                          </label>
                        ))}
                      </div>
                    )}
                    {field.type === 'radio' && (
                      <div className="preview-radio-group">
                        {field.options.map((o, i) => (
                          <label key={i} className="preview-option">
                            <input type="radio" name={`rf-${field.id}`} /> {o}
                          </label>
                        ))}
                      </div>
                    )}
                    {!['textarea', 'dropdown', 'checkbox', 'radio'].includes(field.type) && (
                      <input type={field.type} placeholder={field.placeholder} />
                    )}
                  </div>
                ))
              )}
              <button className="btn btn-primary" style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem' }}>
                Submit Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
