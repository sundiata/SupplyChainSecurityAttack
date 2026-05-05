const NAV = [
  { key: "siem", label: "SIEM Dashboard", icon: "◫", group: "" },
  { key: "atk1", label: "Typosquatting", icon: "⚔", group: "ATTACK SIMULATIONS" },
  { key: "atk2", label: "Dependency Confusion", icon: "◈", group: "ATTACK SIMULATIONS" },
  { key: "atk3", label: "CI/CD Injection", icon: "⛓", group: "ATTACK SIMULATIONS" },
  { key: "def1", label: "Name Checker", icon: "◍", group: "DEFENCE TOOLS" },
  { key: "def2", label: "SafePip", icon: "⌂", group: "DEFENCE TOOLS" },
  { key: "def3", label: "Provenance Verifier", icon: "◔", group: "DEFENCE TOOLS" },
  { key: "triage", label: "Triage Queue", icon: "◌", group: "OPERATIONS" },
  { key: "replay", label: "Attack Replay", icon: "⟲", group: "OPERATIONS" },
  { key: "events", label: "Event Feed", icon: "⌁", group: "OPERATIONS" },
  { key: "docs", label: "Documentation", icon: "◫", group: "RESOURCES" },
  { key: "api-docs", label: "API Docs", icon: "◇", group: "RESOURCES" },
  { key: "settings", label: "Settings", icon: "⚙", group: "SETTINGS" },
];

export default function Sidebar({ activePage, onNavigate }) {
  const groups = [...new Set(NAV.map((n) => n.group))];
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>Supply Chain Security</span>
        <span>Attack</span>
      </div>
      <nav className="sidebar-nav">
        {groups.map((g) => (
          <section key={g || "_root"} className="sidebar-group">
            {g && <p className="sidebar-group-title">{g}</p>}
            {NAV.filter((n) => n.group === g).map((item) => (
              <button
                key={item.key}
                type="button"
                className={`sidebar-item ${activePage === item.key ? "active" : ""}`}
                onClick={() => onNavigate(item.key)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </section>
        ))}
      </nav>
    </aside>
  );
}
