# Supply Chain Security Project

This project demonstrates three supply-chain attacks in a controlled lab:

- Typosquatting
- Dependency Confusion
- CI/CD Injection

The platform has two outputs:

- A SIEM-style employee trainer web app (live simulations + visual analysis)
- A reusable security engine (API/CLI/container) that other teams can integrate

## 5-Phase Build Plan

We will implement the project in five sequential phases with incremental documentation.

- Master plan: `docs/IMPLEMENTATION_PLAN.md`
- Phase 1: `docs/phases/PHASE_1_VULNERABLE_DEMO_SITE.md` (vulnerable employee trainer app in `demo-site/`)
- Phase 2: `docs/phases/PHASE_2_TYPOSQUATTING.md`
- Phase 3: `docs/phases/PHASE_3_DEP_CONFUSION_CICD.md`
- Phase 4: `docs/phases/PHASE_4_BASELINE_VS_OUR_SOLUTION.md`
- Phase 5: `docs/phases/PHASE_5_OPEN_PLATFORM_AND_EVALUATION.md`

Each phase includes:

- Objective
- Scope
- Deliverables
- Test plan
- Exit criteria
- Documentation update checklist

## Vulnerable employee trainer (Phase 1 demo target)

This is the **normal-looking finance training website** we attack and later observe from the SIEM.

```bash
cd demo-site
npm install
npm run dev
```

See `demo-site/README.md` for the intentional ATK1/ATK2/ATK3 premises.

## Run the typosquatting attack (ATK1) and see the output

The attacker publishes a package named `training-leder` — one character different from the
legitimate `training-ledger`. A developer who mistypes the name installs the malicious package
and the backdoor fires automatically via the `postinstall` hook.

### Step 1 — navigate into the victim folder

```bash
cd ~/Desktop/SupplyChainSecurityPROJECT/demo-site/lab-victim-typo-only
```

### Step 2 — optional: add a fake secret to show environment capture

```bash
export DEMO_SECRET="your-demo-value"
```

### Step 3 — trigger the attack (installs the typo package, backdoor fires)

```bash
npm install --foreground-scripts
```

The terminal prints only short, **benign-looking** `[training-leder] …` lines. No error shown.

For full forensic output on screen add `LAB_ATK1_VERBOSE=1`:

```bash
LAB_ATK1_VERBOSE=1 npm install --foreground-scripts
```

Look for lines between `__LAB_ATK1_JSON__` and `__LAB_ATK1_JSON_END__` in the output.

### Step 4 — read what the attacker captured

```bash
cat ~/.supply-chain-lab/last-atk1-exfil.json
```

### Step 5 — or read via the API (backend must be running)

```bash
curl -s http://127.0.0.1:8000/v1/lab/last-atk1-report | python3 -m json.tool
```

### Step 6 — reset for a fresh run

```bash
rm -rf node_modules
```

More detail (periodic demo, `LAB_EXFIL_PATH`, stopping background jobs): `demo-site/packages/training-leder/ATK1_README.md`.

## Run the dependency confusilson attack (ATK2) and see the output

In dependency confusion the package name is **correct** — no typo. The attacker publishes a
higher-versioned package to the *public* registry under the same name as an internal package.
The package manager picks the highest version → attacker wins without any developer mistake.

The demo-site already depends on `corp-internal-ledger-api` (internal v1.4.2). When a developer
runs `npm upgrade`, the package manager resolves the attacker's public v9.9.9 instead — silently.

### Step 1 — navigate into the demo-site

```bash
cd ~/Desktop/SupplyChainSecurityPROJECT/demo-site
```

### Step 2 — optional: add a fake secret to show environment capture

```bash
export DEMO_SECRET="corp-api-key-2026"
```

### Step 3 — run the attack (simulates developer running `npm upgrade`)

```bash
bash simulate-atk2-upgrade.sh
```

The terminal prints a **benign-looking** line only. No error, no warning. The backdoor already ran.

For full forensic output on screen add `LAB_ATK2_VERBOSE=1`:

```bash
LAB_ATK2_VERBOSE=1 bash simulate-atk2-upgrade.sh
```

### Step 4 — read what the attacker captured

```bash
cat ~/.supply-chain-lab/last-atk2-exfil.json
```

### Step 5 — or read via the API (backend must be running)

```bash
curl -s http://127.0.0.1:8000/v1/lab/last-atk2-report | python3 -m json.tool
```

### Step 6 — restore the demo-site to the clean state

```bash
bash reset-atk2.sh
```

Detailed setup and package internals: `demo-site/lab-victim-dep-confusion/README.md`

## Run the CI/CD injection attack (ATK3) and see the output

In CI/CD injection the attacker does not install a package at all. Instead they craft a malicious
**pull request title, body, or branch name** that gets interpolated into a GitHub Actions `run:`
shell step. The shell executes the attacker's command and the `GITHUB_TOKEN` (and any CI secrets)
are exfiltrated — with zero code review required.

### Step 1 — make sure the backend is running

```bash
cd ~/Desktop/SupplyChainSecurityPROJECT/backend
uvicorn app.main:app --reload --port 8000
```

### Step 2 — scan the vulnerable workflow

```bash
curl -s -X POST http://127.0.0.1:8000/v1/scan/ci-cd-injection \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": {
      "name": "Vulnerable CI",
      "on": ["pull_request"],
      "jobs": {
        "build": {
          "name": "Build",
          "runs-on": "ubuntu-latest",
          "steps": [
            { "name": "Checkout", "uses": "actions/checkout@main" },
            { "name": "Print PR", "run": "echo ${{ github.event.pull_request.title }}" },
            { "name": "Deploy",   "run": "curl -s https://example.com/deploy.sh | bash" }
          ]
        }
      }
    }
  }' | python3 -m json.tool
```

Expected: `"overall_severity": "critical"` — flags RULE-01 (script injection), RULE-03 (unpinned action), RULE-04 (no permissions), RULE-05 (curl|bash).

### Step 3 — simulate the full attack narrative

```bash
curl -s -X POST http://127.0.0.1:8000/v1/simulate/ci-cd-injection \
  -H "Content-Type: application/json" \
  -d '{"attack_vector": "script_injection", "workflow_name": "Vulnerable CI"}' \
  | python3 -m json.tool
```

Other vectors: `"prt_checkout"` (fork checkout via pull_request_target), `"unpinned_action"` (compromised @main tag).

### Step 4 — scan the hardened workflow (should be clean)

```bash
curl -s -X POST http://127.0.0.1:8000/v1/scan/ci-cd-injection \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": {
      "name": "Hardened CI",
      "on": ["pull_request"],
      "permissions": { "contents": "read" },
      "jobs": {
        "build": {
          "name": "Build",
          "runs-on": "ubuntu-latest",
          "permissions": { "contents": "read" },
          "steps": [
            { "name": "Checkout", "uses": "actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332" },
            { "name": "Print PR", "env": { "PR_TITLE": "${{ github.event.pull_request.title }}" }, "run": "echo $PR_TITLE" }
          ]
        }
      }
    }
  }' | python3 -m json.tool
```

Expected: `"overall_severity": "clean"`, zero findings.

Lab workflow files: `demo-site/lab-victim-cicd/workflows/vulnerable.yml` and `hardened.yml`.
Full detail: `demo-site/lab-victim-cicd/README.md`

## SIEM console frontend (platform UI)

Run these commands from the project root:

```bash
cd frontend
npm install
npm run dev
```

After the dev server starts, open the local URL shown in terminal (usually `http://localhost:5173`).

## Team Workflow (Branch First)

Before starting any task, create and switch to a new branch.

Example:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-task-name
```

Do all your work on that branch, then open a Pull Request to `main`.
