

## Frontend Setup and Run

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
