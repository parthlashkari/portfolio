interface Props {
  title: string;
  subtitle: string;
  search?: string;
  setSearch?: (v: string) => void;
  placeholder?: string;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  showExport?: boolean;
  onExport?: () => void;
}

export default function Header({
  title, subtitle,
  search, setSearch, placeholder,
  theme, setTheme,
  showExport, onExport,
}: Props) {
  return (
    <header className="header">
      <div className="header-titles">
        <div className="header-title">{title}</div>
        <div className="header-sub">{subtitle}</div>
      </div>

      {setSearch !== undefined && (
        <div className="header-search">
          <span className="search-icon">{'○'}</span>
          <input
            value={search ?? ''}
            onChange={e => setSearch(e.target.value)}
            placeholder={placeholder ?? 'Search...'}
          />
        </div>
      )}

      <div className="header-actions">
        {showExport && (
          <button className="export-btn" onClick={onExport}>
            {'\u2193'} Export CSV
          </button>
        )}
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
        >
          {theme === 'dark' ? '\u2600' : '\u25D1'}
        </button>
      </div>
    </header>
  );
}
