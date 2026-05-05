import Sidebar from "../Components/layout/Sidebar.jsx";
import SiemDashboard from "./SiemDashboard.jsx";
import Atk1Page from "./Atk1Page.jsx";

const TITLES = {
  siem: "SIEM Dashboard",
  atk1: "Typosquatting — ATK1",
  atk2: "Dependency Confusion — ATK2",
  atk3: "CI/CD Injection — ATK3",
  def1: "Name Checker — DEF1",
  def2: "SafePip — DEF2",
  def3: "Provenance Verifier — DEF3",
  events: "Event Feed",
  settings: "Settings",
};

export default function DashboardShell({ activePage, onNavigate }) {
  return (
    <div className="shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="shell-main">
        <header className="topbar">
          <h1 className="topbar-title">{TITLES[activePage] ?? "Page"}</h1>
          <div className="topbar-right">
            <span className="avatar">SC</span>
            <button type="button" className="logout-btn">Logout</button>
          </div>
        </header>
        <main className="content">
          {activePage === "siem" && <SiemDashboard onNavigate={onNavigate} />}
          {activePage === "atk1" && <Atk1Page />}
          {!["siem", "atk1"].includes(activePage) && (
            <div className="empty-card">
              <p>Coming in Phase 3</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
