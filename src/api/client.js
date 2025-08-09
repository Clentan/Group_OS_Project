const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000"

async function j(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  status: () => j("/status"),
  start: () => j("/start", { method: "POST" }),
  stop: () => j("/stop", { method: "POST" }),
  reset: (threads, resources) =>
    j("/reset", {
      method: "POST",
      body: JSON.stringify({ threads, resources }),
    }),
  metrics: () => j("/metrics"),
  resources: () => j("/resources"),
  wfg: () => j("/wfg"),
  logs: (limit = 100, cycleOnly = false) =>
    j(`/logs?limit=${limit}&cycle_only=${cycleOnly}`),
  scan: () => j("/scan", { method: "POST" }),
  deadlock: () => j("/deadlock"),
  resolve: (policy = "min_cost", victim = null) =>
    j("/resolve", { method: "POST", body: JSON.stringify({ policy, victim }) }),
  forceDeadlock: () => j("/force-deadlock", { method: "POST" }),
}
