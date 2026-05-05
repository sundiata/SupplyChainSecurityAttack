# Implementation Plan (5 Phases — Chronological)

This plan follows **sequential execution**: each phase completes before the next starts.  
Documentation is updated at the **end of each phase** (and during the phase for decisions).

## Phase sequence (agreed)

1. **Vulnerable employee trainer demo site** — realistic “normal” website with intentional weaknesses so attacks can be demonstrated later.
2. **Typosquatting (ATK1)** — first attack wired end-to-end into the SIEM.
3. **Dependency confusion (ATK2) + CI/CD injection (ATK3)** — remaining attacks wired into the SIEM.
4. **Baseline (state of the art) vs our improved solution** — compare detectors in the live SIEM (includes AI-assisted layer).
5. **Open platform + evaluation** — packaging so others can connect their repos/apps; final metrics, report, and demo hardening.

## Phase documents

| Phase | File |
|------|------|
| 1 | `docs/phases/PHASE_1_VULNERABLE_DEMO_SITE.md` |
| 2 | `docs/phases/PHASE_2_TYPOSQUATTING.md` |
| 3 | `docs/phases/PHASE_3_DEP_CONFUSION_CICD.md` |
| 4 | `docs/phases/PHASE_4_BASELINE_VS_OUR_SOLUTION.md` |
| 5 | `docs/phases/PHASE_5_OPEN_PLATFORM_AND_EVALUATION.md` |

## Documentation workflow (every phase)

1. Set phase status to **In progress**
2. Record assumptions + threat model notes for that phase
3. List completed tasks + commands used (evidence)
4. Mark exit criteria **Done**
5. Set phase status to **Complete**
6. Add 5–10 lines to a running “changelog” section in this file (optional)

## Current status

- Phase 1: **Complete** (`demo-site/` vulnerable trainer scaffold + lab CI workflow)
- Phase 2: **Complete** (typosquatting end-to-end — backend API + SIEM frontend)
- Phase 3: Planned
- Phase 4: Planned
- Phase 5: Planned
