const menuGroups = [
  {
    title: "",
    items: [{ key: "siem-dashboard", label: "SIEM Dashboard", icon: "dashboard" }]
  },
  {
    title: "ATTACK SIMULATIONS",
    items: [
      { key: "atk1-typosquatting", label: "Typosquatting", icon: "bug" },
      {
        key: "atk2-dependency-confusion",
        label: "Dependency Confusion",
        icon: "package"
      },
      { key: "atk3-cicd-injection", label: "CI/CD Injection", icon: "pipeline" }
    ]
  },
  {
    title: "DEFENCE TOOLS",
    items: [
      { key: "def1-name-checker", label: "Name Checker", icon: "shield" },
      { key: "def2-safepip", label: "SafePip", icon: "lock" },
      {
        key: "def3-provenance-verifier",
        label: "Provenance Verifier",
        icon: "fingerprint"
      }
    ]
  },
  {
    title: "OPERATIONS",
    items: [
      { key: "triage-queue", label: "Triage Queue", icon: "inbox" },
      { key: "attack-replay", label: "Attack Replay", icon: "replay" },
      { key: "events", label: "Event Feed", icon: "activity" }
    ]
  },
  {
    title: "RESOURCES",
    items: [
      { key: "docs", label: "Documentation", icon: "book" },
      { key: "api-docs", label: "API Docs", icon: "code" }
    ]
  },
  {
    title: "SETTINGS",
    items: [{ key: "settings", label: "Settings", icon: "settings" }]
  }
];

function Icon({ name }) {
  const common = {
    className: "sidebar-icon",
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <path
            d="M4 13.5V6.5C4 5.67157 4.67157 5 5.5 5H10.5C11.3284 5 12 5.67157 12 6.5V13.5C12 14.3284 11.3284 15 10.5 15H5.5C4.67157 15 4 14.3284 4 13.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 18.5V11.5C12 10.6716 12.6716 10 13.5 10H18.5C19.3284 10 20 10.6716 20 11.5V18.5C20 19.3284 19.3284 20 18.5 20H13.5C12.6716 20 12 19.3284 12 18.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M4 18.5V17.5C4 16.6716 4.67157 16 5.5 16H10.5C11.3284 16 12 16.6716 12 17.5V18.5C12 19.3284 11.3284 20 10.5 20H5.5C4.67157 20 4 19.3284 4 18.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 8.5V6.5C12 5.67157 12.6716 5 13.5 5H18.5C19.3284 5 20 5.67157 20 6.5V8.5C20 9.32843 19.3284 10 18.5 10H13.5C12.6716 10 12 9.32843 12 8.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "bug":
      return (
        <svg {...common}>
          <path
            d="M9 9.5C9 7.567 10.567 6 12.5 6C14.433 6 16 7.567 16 9.5V16C16 18.2091 14.2091 20 12 20C9.79086 20 8 18.2091 8 16V12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7 13H4M20 13H17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8 8L6.5 6.5M17.5 6.5L16 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "package":
      return (
        <svg {...common}>
          <path
            d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 21V12.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M20 7.5L12 12.2L4 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "pipeline":
      return (
        <svg {...common}>
          <path
            d="M7 7H17M7 17H17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7 7V17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M17 7V12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M17 17V16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M17 14.5C18.3807 14.5 19.5 13.3807 19.5 12C19.5 10.6193 18.3807 9.5 17 9.5C15.6193 9.5 14.5 10.6193 14.5 12C14.5 13.3807 15.6193 14.5 17 14.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            d="M12 3L19 6V12.2C19 16.7 16.2 19.7 12 21C7.8 19.7 5 16.7 5 12.2V6L12 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 12L11.2 14.2L15.5 9.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <path
            d="M7 11V9C7 6.79086 8.79086 5 11 5H13C15.2091 5 17 6.79086 17 9V11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7.5 11H16.5C17.3284 11 18 11.6716 18 12.5V18.5C18 19.3284 17.3284 20 16.5 20H7.5C6.67157 20 6 19.3284 6 18.5V12.5C6 11.6716 6.67157 11 7.5 11Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "fingerprint":
      return (
        <svg {...common}>
          <path
            d="M12 12.5C12 16 10.5 17.5 10.5 19.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15.5 19.5C15.5 17.5 17 16 17 12.5C17 9.46243 14.5376 7 11.5 7C8.46243 7 6 9.46243 6 12.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8 12.5C8 10.567 9.567 9 11.5 9C13.433 9 15 10.567 15 12.5C15 14.7 14.2 15.9 14.2 19.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "inbox":
      return (
        <svg {...common}>
          <path
            d="M4 12L6.2 5.7C6.4 5.3 6.8 5 7.3 5H16.7C17.2 5 17.6 5.3 17.8 5.7L20 12V18.5C20 19.3284 19.3284 20 18.5 20H5.5C4.67157 20 4 19.3284 4 18.5V12Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M4 12H9.2L10.6 14H13.4L14.8 12H20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "replay":
      return (
        <svg {...common}>
          <path
            d="M7 7V11H11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 16.5C8.7 18.1 10.7 19 13 19C16.866 19 20 15.866 20 12C20 8.13401 16.866 5 13 5C10.6 5 8.5 6.2 7.3 8.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "activity":
      return (
        <svg {...common}>
          <path
            d="M4 13.5H8L10.2 7L13 17L15.2 11H20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path
            d="M7 5H18C19.1046 5 20 5.89543 20 7V19H8C6.89543 19 6 18.1046 6 17V6C6 5.44772 6.44772 5 7 5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M6 17C6 15.8954 6.89543 15 8 15H20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <path
            d="M9 8L5 12L9 16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 8L19 12L15 16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 7L11 17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <path
            d="M12 15.2C13.7673 15.2 15.2 13.7673 15.2 12C15.2 10.2327 13.7673 8.8 12 8.8C10.2327 8.8 8.8 10.2327 8.8 12C8.8 13.7673 10.2327 15.2 12 15.2Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M19.4 13.2V10.8L17.6 10.2C17.4 9.6 17.1 9 16.7 8.5L17.6 6.8L15.9 5.1L14.2 6C13.7 5.6 13.1 5.3 12.5 5.1L11.9 3.3H9.5L8.9 5.1C8.3 5.3 7.7 5.6 7.2 6L5.5 5.1L3.8 6.8L4.7 8.5C4.3 9 4 9.6 3.8 10.2L2 10.8V13.2L3.8 13.8C4 14.4 4.3 15 4.7 15.5L3.8 17.2L5.5 18.9L7.2 18C7.7 18.4 8.3 18.7 8.9 18.9L9.5 20.7H11.9L12.5 18.9C13.1 18.7 13.7 18.4 14.2 18L15.9 18.9L17.6 17.2L16.7 15.5C17.1 15 17.4 14.4 17.6 13.8L19.4 13.2Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return <span className="sidebar-icon-fallback" aria-hidden="true" />;
  }
}

export default function Sidebar({ activePage, onSelectPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Supply Chain Security Attack</div>
      <nav className="sidebar-nav">
        {menuGroups.map((group) => (
          <section key={group.title || "root"} className="sidebar-group">
            {group.title ? <p className="sidebar-group-title">{group.title}</p> : null}
            {group.items.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`sidebar-item ${activePage === item.key ? "active" : ""}`}
                onClick={() => onSelectPage(item.key)}
              >
                <Icon name={item.icon} />
                {item.label}
              </button>
            ))}
          </section>
        ))}
      </nav>
    </aside>
  );
}
