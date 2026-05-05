import { useEffect, useState } from "react";
import { api } from "../UTILS/api.js";

/** Matches clean `demo-site/package.json` (no `training-leder`). Run the victim app to introduce the typo dep, then rescan from API or Typosquatting page. */
const DEMO_DEPS = {
  "training-ledger": "1.0.0",
  react: "18.3.1",
  "corp-internal-ledger-api": "1.0.0",
};

export default function SiemDashboard({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [backendOk, setBackendOk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewTab, setViewTab] = useState("feed");
  const [chartType, setChartType] = useState("histogram");

  useEffect(() => {
    async function load() {
      try {
        await api.health();
        setBackendOk(true);
        const data = await api.scanTyposquatting(DEMO_DEPS, "demo-site");
        setEvents(data.siem_events || []);
      } catch {
        setBackendOk(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const feedEvents = events.length
    ? events.slice(0, 4).map((ev, i) => ({
        id: ev.event_id,
        dot: i === 0 ? "red" : i === 1 ? "amber" : "green",
        title: `${ev.package} ${ev.attack_type}`,
        sub: ev.note,
        time: new Date(ev.timestamp || Date.now()).toLocaleTimeString(),
      }))
    : [
        { id: "f1", dot: "red", title: "internal-utils==9.9.9 dep confusion", sub: "Resolved from public registry · DEF2 blocked", time: "12:04:51" },
        { id: "f2", dot: "amber", title: "requests==2.31.0 typosquat", sub: "Levenshtein=1 vs 'requests' · DEF1 blocked", time: "12:04:49" },
        { id: "f3", dot: "red", title: ".github/workflows/build.yml ci injection", sub: "Unpinned action ref · uses@main · DEF3 flagged", time: "12:04:44" },
        { id: "f4", dot: "green", title: "numpy==1.26.4 clean install", sub: "Hash verified · provenance logged", time: "12:04:40" },
      ];

  const totalEvents = events.length ? events.length + 842 : 846;
  const attacksBlocked = Math.max(175, events.filter((e) => e.attacker_success).length + 172);
  const missedCount = Math.max(3, feedEvents.filter((e) => e.dot === "red").length - 1);
  const pendingTriage = 126 + Math.max(0, feedEvents.length - 4);

  const kpis = [
    { label: "TOTAL EVENTS", value: totalEvents, sub: "+4 / min", delta: "+1" },
    { label: "ATTACKS BLOCKED", value: attacksBlocked, sub: "91.2% block rate", delta: "-1" },
    { label: "MISSED (SLIPPED THROUGH)", value: missedCount, sub: "ATK2 ×2, ATK3 ×1", danger: true, delta: "+0" },
    { label: "PENDING TRIAGE", value: pendingTriage, sub: "2 critical unreviewed", delta: "+1" },
  ];

  return (
    <div className="siem-page siem-v2">
      <section className="threat-story">
        <div>
          <h3>Threat Story</h3>
          <p>
            Last 5 minutes: dependency confusion attempts are leading risk. DEF2 blocks most attempts,
            but CI injection remains the highest severity vector.
          </p>
        </div>
        <div className="live-pill">
          <span className={`dot-live ${backendOk ? "green" : "red"}`} />
          Last updated 0s ago
        </div>
      </section>

      <div className="kpi-row">
        {kpis.map((k) => (
          <div key={k.label} className={`kpi-card ${k.danger ? "danger" : ""}`}>
            <p>{k.label}</p>
            <h2>{k.value}</h2>
            <div className="kpi-subline">
              <span>{k.sub}</span>
              <span className="kpi-delta">{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="siem-grid-v2">
        <section className="panel panel-feed">
          <div className="panel-head">
            <h3>Live Event Feed</h3>
            <span className="feed-live">
              <span className={`dot-live ${backendOk ? "green" : "red"}`} />
              live
            </span>
            <div className="tab-switch">
              <button className={viewTab === "feed" ? "active" : ""} onClick={() => setViewTab("feed")} type="button">Feed</button>
              <button className={viewTab === "graphs" ? "active" : ""} onClick={() => setViewTab("graphs")} type="button">Graphs</button>
            </div>
          </div>

          {loading && <p className="muted">Scanning demo-site dependencies…</p>}

          {viewTab === "feed" && (
            <div className="event-list-v2">
              {feedEvents.map((ev) => (
                <div key={ev.id} className="event-row-v2">
                  <span className={`sev-dot ${ev.dot}`} />
                  <div>
                    <p className="ev-pkg">{ev.title}</p>
                    <p className="ev-detail">{ev.sub}</p>
                  </div>
                  <span className="ev-time">{ev.time}</span>
                </div>
              ))}
            </div>
          )}

          {viewTab === "graphs" && (
            <div className="graph-wrap">
              <div className="graph-controls">
                <label>
                  Graph
                  <select>
                    <option>Events by attack type</option>
                  </select>
                </label>
                <label>
                  Chart type
                  <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                    <option value="histogram">Histogram</option>
                    <option value="bar">Bar chart</option>
                    <option value="line">Line graph</option>
                    <option value="dotted">Dotted line</option>
                  </select>
                </label>
                <button type="button" className="share-btn">Share link</button>
              </div>
              <div className="fake-chart">
                {[3, 1, 0, 0, 0].map((h, i) => (
                  <div key={i} className="fc-col">
                    <div className="fc-bar" style={{ height: `${h * 34}px` }} />
                    <span>{["0-20", "20-40", "40-60", "60-80", "80-100"][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="right-col">
          <section className="panel">
            <div className="module-head">
              <h3>Module health</h3>
              <span>3 / 3 up</span>
            </div>
            {[
              ["DEF1 name checker", "online · 0ms lag"],
              ["DEF2 SafePip", "online · 12ms lag"],
              ["DEF3 provenance", "warn · 340ms lag"],
            ].map(([name, status]) => (
              <div key={name} className="mh-row">
                <strong>{name}</strong>
                <span>{status}</span>
              </div>
            ))}
          </section>

          <section className="panel">
            <h3>Defence block rates</h3>
            <div className="rings">
              {[["DEF1", 96], ["DEF2", 80], ["DEF3", 95]].map(([n, p]) => (
                <div key={n} className="ring-wrap">
                  <div className="ring" style={{ "--p": p }} >
                    <span>{p}%</span>
                  </div>
                  <small>{n}</small>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="bottom-grid">
        <section className="panel">
          <h3>Attack volume by type last 24 hrs</h3>
          {[
            ["Typosquat", 18],
            ["Dep. conf.", 11],
            ["CI inject.", 5],
          ].map(([name, val]) => (
            <div key={name} className="volume-row">
              <span>{name}</span>
              <div><i style={{ width: `${val * 5}%` }} /></div>
              <strong>{val}</strong>
            </div>
          ))}
          <p className="heat-title">Activity heatmap (typosquat)</p>
          <div className="heatmap">
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} style={{ opacity: 0.2 + ((i % 7) + 1) / 10 }} />
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="module-head">
            <h3>Triage queue</h3>
            <span>7 open</span>
          </div>
          {[
            "internal-utils dep confusion",
            "build.yml uses@main",
            "pypi0 homograph",
          ].map((item) => (
            <div key={item} className="triage-row">
              <div>
                <strong>{item}</strong>
                <p>ALT-004 · High</p>
              </div>
              <button type="button">Threat</button>
            </div>
          ))}
        </section>
      </div>

      <div className="quick-nav">
        <p>Run specific attack simulations:</p>
        <div className="quick-btns">
          <button type="button" className="qbtn atk" onClick={() => onNavigate("atk1")}>
            ⚠ Typosquatting
          </button>
          <button type="button" className="qbtn disabled" disabled>⚡ Dep Confusion (Phase 3)</button>
          <button type="button" className="qbtn disabled" disabled>⛓ CI/CD Injection (Phase 3)</button>
        </div>
      </div>
    </div>
  );
}
