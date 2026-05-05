const BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/v1";

export async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json();
}

export const api = {
  health: () => apiFetch("/health"),

  scanTyposquatting: (dependencies, source = "demo-site") =>
    apiFetch("/scan/typosquatting", {
      method: "POST",
      body: JSON.stringify({ dependencies, source }),
    }),

  simulateTyposquatting: (packageName) =>
    apiFetch("/simulate/typosquatting", {
      method: "POST",
      body: JSON.stringify({ package_name: packageName }),
    }),
};
