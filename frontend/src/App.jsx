import DashboardPage from "./pages/DashboardPage.jsx";
import { useMemo, useState } from "react";

const pageTitles = {
  "siem-dashboard": "SIEM Dashboard",
  "atk1-typosquatting": "Typosquatting",
  "atk2-dependency-confusion": "Dependency Confusion",
  "atk3-cicd-injection": "CI/CD Injection",
  "def1-name-checker": "Name Checker",
  "def2-safepip": "SafePip",
  "def3-provenance-verifier": "Provenance Verifier",
  "triage-queue": "Triage Queue",
  "attack-replay": "Attack Replay",
  events: "Event Feed",
  docs: "Documentation",
  "api-docs": "API Docs",
  settings: "Settings"
};

export default function App() {
  const [activePage, setActivePage] = useState("siem-dashboard");

  const activeTitle = useMemo(() => pageTitles[activePage] ?? "Page", [activePage]);

  return (
    <DashboardPage
      title={activeTitle}
      activePage={activePage}
      onSelectPage={setActivePage}
    />
  );
}
