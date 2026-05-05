# Phase 1 — Vulnerable Employee Trainer Demo Site

## Status

Complete

## Objective

Build a **normal-looking** employee training website (example domain: internal finance training) that is intentionally wired with **realistic supply-chain weaknesses** so Phases 2–4 can demonstrate:

- Typosquatting
- Dependency confusion
- CI/CD injection

This site is the **premises / victim application** for class demos.  
The **SIEM + backend platform** will observe and analyze it in later phases.

## Scope

- New folder: `demo-site/` at repository root (not the same as `frontend/` SIEM console).
- Frontend-based trainer UI (Vite + React) for speed and clarity.
- Intentional weaknesses:
  - **ATK1 (typosquatting premise):** the **trainer `package.json` does not** ship the typo package; the minimal victim app `demo-site/lab-victim-typo-only/` depends on `training-leder` so each install-based demo starts fresh.
  - **ATK2 (dependency confusion premise):** dependency naming and comments simulating a **private internal** package name (`corp-internal-*`) alongside public-style deps (safe `file:` resolution for the lab).
  - **ATK3 (CI/CD injection premise):** GitHub Actions workflow with insecure patterns (unpinned action ref, overly broad permissions) — **lab only**, not production.

## Deliverables

- Runnable `demo-site` (`npm install`, `npm run dev`)
- Documented list of intentional weaknesses (in `demo-site/README.md`)
- No reliance on publishing packages to npm

## Test plan

- `npm install` succeeds in `demo-site/`
- `npm run dev` serves pages
- CI workflow file is present and parseable (may not run until pushed to GitHub)

## Exit criteria

- Trainer pages render (simple finance training narrative)
- Weaknesses are explicit and mapped to ATK1/ATK2/ATK3 for later scanners
- Team agrees this is the canonical “victim app” for demos

## Documentation updates

- Update `docs/IMPLEMENTATION_PLAN.md` status when complete
- Link `demo-site/README.md` from root `README.md` (optional)

## Evidence (commands)

```bash
cd demo-site
npm install
npm run build
```
