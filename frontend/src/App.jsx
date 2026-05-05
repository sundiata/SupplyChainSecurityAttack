import { useState } from "react";
import DashboardShell from "./pages/DashboardShell.jsx";

export default function App() {
  const [activePage, setActivePage] = useState("siem");
  return <DashboardShell activePage={activePage} onNavigate={setActivePage} />;
}
