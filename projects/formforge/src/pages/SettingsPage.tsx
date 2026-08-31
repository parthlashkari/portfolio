import { useState } from 'react';
import { roles } from '../data';

interface Props {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

const LANGS = [
  { code: 'en', label: 'English',      flag: 'EN' },
  { code: 'ar', label: 'Arabic (RTL)', flag: 'AR' },
  { code: 'es', label: 'Spanish',      flag: 'ES' },
  { code: 'fr', label: 'French',       flag: 'FR' },
] as const;

type NotifKey = 'newSubmission' | 'workflowRun' | 'formPublish' | 'weeklyReport';

const NOTIFS: { key: NotifKey; title: string; desc: string }[] = [
  { key: 'newSubmission', title: 'New Submission',  desc: 'Alert when any form receives a new submission'       },
  { key: 'workflowRun',   title: 'Workflow Run',    desc: 'Alert when an automation rule fires'                 },
  { key: 'formPublish',   title: 'Form Published',  desc: 'Alert when a draft form is published'                },
  { key: 'weeklyReport',  title: 'Weekly Report',   desc: 'Receive a weekly analytics digest every Monday'      },
];

type ProfileKey = 'name' | 'role' | 'email' | 'org';

const PROFILE_LABELS: Record<ProfileKey, string> = {
  name:  'Full Name',
  role:  'Job Title',
  email: 'Email',
  org:   'Organisation',
};

export default function SettingsPage({ theme, setTheme }: Props) {
  const [lang, setLang] = useState<string>('en');
  const [profile, setProfile] = useState<Record<ProfileKey, string>>({
    name:  'Parth Lashkari',
    role:  'Platform Administrator',
    email: 'parth@formforge.io',
    org:   'FormForge Enterprise',
  });
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    newSubmission: true,
    workflowRun:   true,
    formPublish:   false,
    weeklyReport:  true,
  });

  return (
    <div className="settings-grid">

      {/* Profile */}
      <div className="settings-section">
        <div className="settings-title">{'\u2295'} Profile</div>
        {(Object.keys(profile) as ProfileKey[]).map(key => (
          <div className="settings-row" key={key}>
            <label className="settings-label">{PROFILE_LABELS[key]}</label>
            <input
              className="settings-input"
              value={profile[key]}
              onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
            />
          </div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save Profile</button>
      </div>

      {/* Appearance & Language */}
      <div className="settings-section">
        <div className="settings-title">{'\u25D1'} Appearance &amp; Language</div>
        <div className="settings-row">
          <label className="settings-label">Theme</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['dark', 'light'] as const).map(t => (
              <button
                key={t}
                className={`btn ${theme === t ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setTheme(t)}
                style={{ flex: 1 }}
              >
                {t === 'dark' ? '\u25D1 Dark' : '\u2600 Light'}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-row">
          <label className="settings-label">Language</label>
          <div className="lang-grid">
            {LANGS.map(l => (
              <button
                key={l.code}
                className={`lang-btn${lang === l.code ? ' active' : ''}`}
                onClick={() => setLang(l.code)}
              >
                <strong>{l.flag}</strong>
                <br />
                <span style={{ fontSize: '0.7rem' }}>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <div className="settings-title">{'\u25CE'} Notifications</div>
        {NOTIFS.map(({ key, title, desc }) => (
          <div key={key} className="notif-row">
            <div className="notif-text">
              <strong>{title}</strong>
              <span>{desc}</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifs[key]}
                onChange={e => setNotifs(n => ({ ...n, [key]: e.target.checked }))}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </div>

      {/* Role Management */}
      <div className="settings-section">
        <div className="settings-title">{'\u229F'} Role Management</div>
        <table className="roles-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Users</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id}>
                <td style={{ fontWeight: 700, color: 'var(--text)' }}>{role.name}</td>
                <td>{role.users}</td>
                <td>
                  {role.permissions.map(p => (
                    <span key={p} className="perm-pill">{p}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
