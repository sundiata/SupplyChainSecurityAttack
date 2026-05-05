# Phase 3 — Dependency Confusion (ATK2) + CI/CD Injection (ATK3)

## Status

Planned

## Objective

Add the remaining two attacks, each observable in the SIEM, using weaknesses introduced in Phase 1.

## Scope

- Backend modules + APIs for ATK2 and ATK3
- Workflow scanner for `.github/workflows/*`
- Dependency policy checks for `package.json` / lockfiles (as applicable)

## Exit criteria

- All three attacks demonstrable against `demo-site/` artifacts
- SIEM can filter and compare attack families
