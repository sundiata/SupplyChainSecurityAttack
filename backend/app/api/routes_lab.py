"""Read-only lab artifacts (e.g. last ATK1 postinstall report) for demos and the trainer UI."""
from __future__ import annotations

import json
import os
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/lab", tags=["Lab"])


def _candidate_report_paths() -> list[Path]:
    paths: list[Path] = []
    if env := os.environ.get("LAB_ATK1_REPORT_PATH"):
        paths.append(Path(env).expanduser())
    paths.append(Path.home() / ".supply-chain-lab" / "last-atk1-exfil.json")
    return paths


@router.get("/last-atk1-report")
def get_last_atk1_report() -> dict:
    """
    Return the latest JSON written by the lab `training-leder` postinstall hook.
    Primary location: ~/.supply-chain-lab/last-atk1-exfil.json (works from any install cwd).
    """
    for p in _candidate_report_paths():
        try:
            if p.is_file():
                return json.loads(p.read_text(encoding="utf-8"))
        except OSError:
            continue
        except json.JSONDecodeError:
            continue
    raise HTTPException(
        status_code=404,
        detail="No ATK1 lab report found. Run `npm install` in a project that depends on `training-leder`, then refresh.",
    )


@router.get("/atk1-periodic-snapshots")
def get_atk1_periodic_snapshots(limit: int = Query(default=40, ge=1, le=200)) -> dict:
    """
    Last N lines from ~/.supply-chain-lab/atk1-periodic-snapshots.jsonl
    (written when LAB_ATK1_PERIODIC_DEMO=1 during install — lab simulation only).
    """
    path = Path.home() / ".supply-chain-lab" / "atk1-periodic-snapshots.jsonl"
    if not path.is_file():
        return {
            "snapshots": [],
            "count": 0,
            "detail": "No periodic log yet. Reinstall with LAB_ATK1_PERIODIC_DEMO=1 to enable the lab timer.",
        }
    raw = path.read_text(encoding="utf-8").strip()
    if not raw:
        return {"snapshots": [], "count": 0}
    lines = raw.split("\n")
    tail = lines[-limit:]
    snapshots: list[dict] = []
    for line in tail:
        line = line.strip()
        if not line:
            continue
        try:
            snapshots.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return {"count": len(snapshots), "snapshots": snapshots}


# ─── ATK2 ────────────────────────────────────────────────────────────────────


@router.get("/last-atk2-report")
def get_last_atk2_report() -> dict:
    """
    Return the latest JSON written by the lab `corp-internal-ledger-api-public-twin` postinstall hook.
    Primary location: ~/.supply-chain-lab/last-atk2-exfil.json
    Run `npm install --foreground-scripts` inside demo-site/lab-victim-dep-confusion/confused/ first.
    """
    path = Path.home() / ".supply-chain-lab" / "last-atk2-exfil.json"
    if path.is_file():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            pass
    raise HTTPException(
        status_code=404,
        detail=(
            "No ATK2 lab report found. "
            "Run `npm install --foreground-scripts` in "
            "demo-site/lab-victim-dep-confusion/confused/, then retry."
        ),
    )
