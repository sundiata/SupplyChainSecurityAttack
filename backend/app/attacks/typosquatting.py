"""
ATK1 — Typosquatting attack module.

Provides:
  - levenshtein_distance()     edit-distance between two names
  - analyze_name_risk()        risk tier for a candidate vs canonical name
  - simulate_install()         resolve a name against a local demo registry
  - scan_manifest()            scan a dict of {name: version} pairs for risky names
  - to_siem_event()            convert a result into a standard SIEM event dict
"""

from __future__ import annotations

import unicodedata
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Final, Optional


# ── helpers ──────────────────────────────────────────────────────────────────

def _norm(name: str) -> str:
    """Lowercase, strip whitespace, normalise unicode."""
    return unicodedata.normalize("NFKC", name).strip().casefold()


def levenshtein_distance(a: str, b: str) -> int:
    """Classic Levenshtein edit distance (insert / delete / substitute)."""
    if a == b:
        return 0
    if not a:
        return len(b)
    if not b:
        return len(a)
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + (0 if ca == cb else 1)))
        prev = cur
    return prev[-1]


# ── name-risk analysis ────────────────────────────────────────────────────────

@dataclass(frozen=True)
class TyposquatAnalysis:
    requested: str
    canonical: str
    distance: int
    risk_tier: str          # none | low | medium | high | critical
    confidence: float       # 0.0–1.0
    note: str


def analyze_name_risk(requested: str, canonical: str) -> TyposquatAnalysis:
    """
    Compare *requested* against *canonical* and return a risk tier.

    Tiers:
      critical  dist == 0 but different letter-case (homoglyph / unicode trick)
      high      dist == 1
      medium    dist == 2, similarity ≥ 0.75
      low       dist == 3
      none      otherwise
    """
    rq, cn = _norm(requested), _norm(canonical)
    if not rq or not cn:
        return TyposquatAnalysis(requested, canonical, 999, "none", 0.0, "Empty name.")

    dist = levenshtein_distance(rq, cn)
    max_len = max(len(rq), len(cn), 1)
    similarity = 1.0 - dist / max_len

    if rq == cn:
        tier, conf, note = "none", 1.0, "Exact normalised match — not a typosquat."
    elif dist == 1:
        tier, conf, note = "high", 0.90, "Single edit away — classic typosquat distance."
    elif dist == 2 and similarity >= 0.75:
        tier, conf, note = "medium", 0.72, "Two edits, still visually similar."
    elif dist <= 3:
        tier, conf, note = "low", 0.45, "Somewhat similar; context-dependent."
    else:
        tier, conf, note = "none", 0.10, "Too dissimilar to be a typosquat of this canonical."

    return TyposquatAnalysis(
        requested=requested,
        canonical=canonical,
        distance=dist,
        risk_tier=tier,
        confidence=conf,
        note=note,
    )


# ── demo registry (local lab only, no public npm/PyPI) ────────────────────────

@dataclass(frozen=True)
class PackageRecord:
    display_name: str
    trusted: bool
    publisher: str
    summary: str
    simulated_effect: str
    # For malicious lab packages only — what install-time code can do (teaching aid).
    attacker_capabilities: tuple[str, ...] = ()
    masquerades_as: Optional[str] = None  # intended legitimate package name


def attacker_access_preview(rec: PackageRecord) -> dict[str, Any]:
    """Structured list of what a real postinstall typosquat could observe (lab narrative)."""
    return {
        "malicious_package": rec.display_name,
        "masquerades_as": rec.masquerades_as,
        "capabilities": list(rec.attacker_capabilities),
        "typical_exfil_surface": [
            "Process environment (CI tokens, registry auth, cloud keys, internal URLs)",
            "Host identity (hostname, OS, username)",
            "Repository context (cwd, branch hints from env, package manager metadata)",
            "Network egress to attacker-controlled HTTPS endpoint (or DNS exfiltration)",
        ],
        "lab_artifact": "After a real `npm install`, see demo-site/attack-exfil-report.json",
    }


DEMO_REGISTRY: Final[dict[str, PackageRecord]] = {
    # ── ATK1 demo pair (matches demo-site/packages/) ──────────────────────────
    "training-ledger": PackageRecord(
        display_name="training-ledger",
        trusted=True,
        publisher="internal-lab",
        summary="Intended finance-training helper (correct spelling).",
        simulated_effect="No-op: trusted package runs normal library code.",
    ),
    "training-leder": PackageRecord(
        display_name="training-leder",
        trusted=False,
        publisher="unknown-squatter",
        summary="Typosquat of training-ledger (missing 'g').",
        simulated_effect=(
            "[DEMO ONLY] Postinstall hook would read env vars "
            "(DEMO_SECRET, CI tokens) and POST to attacker collector."
        ),
        masquerades_as="training-ledger",
        attacker_capabilities=(
            "postinstall script runs automatically on npm/yarn install",
            "read process environment (tokens, secrets, internal endpoints)",
            "read cwd / repo path; infer project and CI context",
            "open outbound HTTPS to exfiltrate captured data (lab: writes attack-exfil-report.json)",
            "run arbitrary Node code as the developer or CI user",
        ),
    ),
    # ── secondary demo pair ──────────────────────────────────────────────────
    "acme-ledger": PackageRecord(
        display_name="acme-ledger",
        trusted=True,
        publisher="acme-oss",
        summary="Legitimate demo helper (acme example).",
        simulated_effect="No-op.",
    ),
    "acme-leder": PackageRecord(
        display_name="acme-leder",
        trusted=False,
        publisher="unknown-maintainer-4821",
        summary="Typosquat of acme-ledger.",
        simulated_effect=(
            "[DEMO ONLY] Postinstall script would exfiltrate env vars."
        ),
        masquerades_as="acme-ledger",
        attacker_capabilities=(
            "postinstall script runs automatically on npm/yarn install",
            "read process environment and host metadata",
            "exfiltrate over network or write local staging files",
        ),
    ),
}


# ── install simulation ────────────────────────────────────────────────────────

@dataclass
class InstallSimulationResult:
    requested: str
    resolved_key: Optional[str]
    outcome: str            # trusted_install | typosquat_install | not_found
    record: Optional[PackageRecord]
    attacker_success: bool
    presentation_lines: list[str] = field(default_factory=list)
    attacker_access_preview: Optional[dict[str, Any]] = None


def simulate_install(requested: str) -> InstallSimulationResult:
    """Resolve *requested* against the local demo registry (exact name, case-insensitive)."""
    key = _norm(requested)
    rec = DEMO_REGISTRY.get(key)
    lines: list[str] = [f"resolver: looking up '{requested}' …"]

    if rec is None:
        lines.append("resolver: not found in demo registry.")
        return InstallSimulationResult(
            requested=requested, resolved_key=None,
            outcome="not_found", record=None,
            attacker_success=False, presentation_lines=lines,
            attacker_access_preview=None,
        )

    lines += [
        f"resolver: found '{rec.display_name}'",
        f"resolver: publisher = {rec.publisher}",
        f"resolver: trusted   = {rec.trusted}",
    ]

    if rec.trusted:
        lines.append("post-install: benign — expected library behaviour.")
        return InstallSimulationResult(
            requested=requested, resolved_key=key,
            outcome="trusted_install", record=rec,
            attacker_success=False, presentation_lines=lines,
            attacker_access_preview=None,
        )

    preview = attacker_access_preview(rec)
    lines += [
        "post-install: *** TYPOSQUAT DETECTED — attacker code path triggered ***",
        rec.simulated_effect,
        "attacker: would gain the access surface described in attacker_access_preview (API + postinstall report).",
    ]
    return InstallSimulationResult(
        requested=requested, resolved_key=key,
        outcome="typosquat_install", record=rec,
        attacker_success=True, presentation_lines=lines,
        attacker_access_preview=preview,
    )


# ── manifest scanner (reads package.json-style dict) ─────────────────────────

@dataclass
class ManifestScanResult:
    scanned: int
    findings: list[dict[str, Any]]
    risk_summary: dict[str, int]


def scan_manifest(dependencies: dict[str, str]) -> ManifestScanResult:
    """
    Scan a *dependencies* dict ``{name: version}`` and cross-check every name
    against the demo registry to detect typosquat patterns.
    Returns structured findings suitable for the SIEM.
    """
    findings: list[dict[str, Any]] = []
    risk_summary: dict[str, int] = {"high": 0, "medium": 0, "low": 0, "none": 0}

    trusted_names = [k for k, v in DEMO_REGISTRY.items() if v.trusted]

    for pkg_name in dependencies:
        normed = _norm(pkg_name)
        # check against each trusted name for similarity
        for canonical in trusted_names:
            if normed == canonical:
                continue        # exact match is fine
            analysis = analyze_name_risk(pkg_name, canonical)
            if analysis.risk_tier == "none":
                continue
            sim_result = simulate_install(pkg_name)
            findings.append({
                "package": pkg_name,
                "canonical": canonical,
                "distance": analysis.distance,
                "risk_tier": analysis.risk_tier,
                "confidence": analysis.confidence,
                "note": analysis.note,
                "attacker_success": sim_result.attacker_success,
                "simulated_effect": (
                    sim_result.record.simulated_effect if sim_result.record else "n/a"
                ),
                "attacker_access_preview": sim_result.attacker_access_preview,
            })
            risk_summary[analysis.risk_tier] = risk_summary.get(analysis.risk_tier, 0) + 1

    return ManifestScanResult(
        scanned=len(dependencies),
        findings=findings,
        risk_summary=risk_summary,
    )


# ── SIEM event builder ────────────────────────────────────────────────────────

def to_siem_event(finding: dict[str, Any], source: str = "demo-site") -> dict[str, Any]:
    """Convert a manifest finding into the standard SIEM event schema."""
    ev: dict[str, Any] = {
        "event_id": f"ATK1-{finding['package']}-{finding['canonical']}",
        "attack_type": "typosquatting",
        "severity": finding["risk_tier"],
        "confidence": finding["confidence"],
        "source": source,
        "package": finding["package"],
        "canonical": finding["canonical"],
        "distance": finding["distance"],
        "attacker_success": finding["attacker_success"],
        "simulated_effect": finding["simulated_effect"],
        "note": finding["note"],
        "recommendation": (
            f"Replace '{finding['package']}' with the intended "
            f"'{finding['canonical']}' and pin the exact version."
        ),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if finding.get("attacker_access_preview"):
        ev["attacker_access_preview"] = finding["attacker_access_preview"]
    return ev
