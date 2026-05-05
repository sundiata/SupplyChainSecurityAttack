# Phase 2 — Typosquatting (ATK1) End-to-End

## Status

**Complete**

## Objective

Demonstrate typosquatting against the Phase 1 demo site and show results in the SIEM.

## Scope

- Backend: `typosquatting` analysis + simulation APIs
- Emit SIEM events for trainer-driven actions
- Frontend SIEM: ATK1 panel + live feed entries

## Deliverables

- Passing unit tests for typosquatting module
- API endpoint(s) for scan/simulate
- SIEM visualization for ATK1

## Deliverables shipped

| Item | Location |
|---|---|
| Core logic + Levenshtein | `backend/app/attacks/typosquatting.py` |
| 7 passing unit tests | `backend/tests/test_typosquatting.py` |
| FastAPI app entry point | `backend/app/main.py` |
| Health route | `backend/app/api/routes_health.py` |
| ATK1 API routes (`/v1/scan/typosquatting`, `/v1/simulate/typosquatting`) | `backend/app/api/routes_attacks.py` |
| API client utility | `frontend/src/UTILS/api.js` |
| SIEM dashboard with live event feed | `frontend/src/pages/SiemDashboard.jsx` |
| ATK1 simulation page | `frontend/src/pages/Atk1Page.jsx` |
| Rebuilt sidebar + shell | `frontend/src/Components/layout/Sidebar.jsx` |

## Exit criteria

- 7 / 7 unit tests pass (`python -m unittest tests.test_typosquatting -v`)
- `GET /v1/health` returns `{"status": "ok"}`
- `POST /v1/scan/typosquatting` with `demo-site` deps returns high-severity event for `training-leder`
- `POST /v1/simulate/typosquatting` with `training-leder` returns `attacker_success: true` and SIEM event
- SIEM Dashboard auto-scans on load and renders event feed; click event → incident detail panel
- ATK1 page allows interactive simulation from the browser
