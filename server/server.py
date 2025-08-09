# server.py
from __future__ import annotations
import threading, time
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# ---- import your simulation classes ----
from sim_core import Simulation, DeadlockDetector

app = FastAPI(title="Deadlock Simulator API", version="1.0")

# CORS for your React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Single simulation instance guarded by a lock ----
sim_lock = threading.RLock()
sim: Optional[Simulation] = None

def get_sim() -> Simulation:
    global sim
    with sim_lock:
        if sim is None:
            sim = Simulation(threads=10, resources=6)
        return sim

# ---------- Pydantic schemas ----------
class ResetRequest(BaseModel):
    threads: int
    resources: int

class ResolveRequest(BaseModel):
    policy: str = "min_cost"  # min_cost | max_unblock | most_resources
    victim: Optional[str] = None

# ---------- Helpers to shape responses ----------
def resource_snapshot(s: Simulation):
    rows, totals = [], {}
    r_rows, r_tot = s.resource_snapshot(s) if hasattr(s, 'resource_snapshot') else None, None
    # Use functions from your Streamlit code:
    r_rows, r_tot = _resource_snapshot(s)
    return {"rows": r_rows, "totals": r_tot}

def _resource_snapshot(sim: Simulation):
    rm = sim.rm
    with rm.cv:
        rows = []
        free = in_use = waiting = 0
        for r_id, stt in rm.resources.items():
            holder = stt.holder or "-"
            q = list(stt.wait_queue)
            qlen = len(q)
            if stt.holder is None:
                free += 1; left = 1
            else:
                in_use += 1; left = 0
            waiting += qlen
            rows.append({
                "resource": r_id,
                "holder": holder,
                "queue": q,
                "queued": qlen,
                "left": left,
            })
    totals = {"free": free, "in_use": in_use, "waiting": waiting, "total": len(rm.resources)}
    return rows, totals

def build_wfg_payload(s: Simulation):
    g = s.rm.build_wfg()
    nodes = [{"id": n} for n in g.nodes]
    edges = [{"source": u, "target": v, "resource": g.edges[(u, v)].get("resource")} for (u, v) in g.edges]
    # include current detected cycle if any
    info = s.pending_deadlock
    cycle_nodes, cycle_edges = [], []
    if info:
        cycle_nodes = info.get("nodes", [])
        cycle_edges = [{"source": u, "target": v} for (u, v) in info.get("edges", [])]
    return {"nodes": nodes, "edges": edges, "cycle": {"nodes": cycle_nodes, "edges": cycle_edges}}

def last_events(s: Simulation, limit=100, only_cycle: Optional[set]=None):
    with s.logger.lock:
        items = s.logger.buffer[-400:]
    rows = []
    for rec in items:
        if only_cycle and rec.tid and rec.tid not in only_cycle:
            continue
        rows.append(rec.as_dict())
    return rows[-limit:]

# ---------- REST endpoints ----------
@app.get("/status")
def status():
    s = get_sim()
    return {
        "running": s.running,
        "threads": len(s.workers),
        "resources": len(s.rm.resources),
        "deadlock_pending": s.pending_deadlock is not None
    }

@app.post("/start")
def start():
    s = get_sim()
    s.start()
    return {"ok": True}

@app.post("/stop")
def stop():
    s = get_sim()
    s.stop()
    return {"ok": True}

@app.post("/reset")
def reset(payload: ResetRequest):
    global sim
    with sim_lock:
        if sim and sim.running:
            sim.stop()
        sim = Simulation(threads=payload.threads, resources=payload.resources)
    return {"ok": True, "threads": payload.threads, "resources": payload.resources}

@app.get("/metrics")
def metrics():
    s = get_sim()
    return s.metrics()

@app.get("/resources")
def resources():
    s = get_sim()
    return resource_snapshot(s)

@app.get("/wfg")
def wfg():
    s = get_sim()
    return build_wfg_payload(s)

@app.get("/logs")
def logs(limit: int = 100, cycle_only: bool = False):
    s = get_sim()
    only = set(s.pending_deadlock["nodes"]) if (cycle_only and s.pending_deadlock) else None
    return {"items": last_events(s, limit=limit, only_cycle=only)}

@app.post("/scan")
def scan():
    s = get_sim()
    # Force the detector to run once (non-blocking): build WFG triggers the logic;
    # but we can just read pending. Detector thread already populates s.pending_deadlock.
    info = s.pending_deadlock or {}
    return {"deadlock": info}

@app.get("/deadlock")
def deadlock():
    s = get_sim()
    return {"deadlock": s.pending_deadlock or None}

@app.post("/resolve")
def resolve(req: ResolveRequest):
    s = get_sim()
    if not s.pending_deadlock:
        return {"ok": False, "message": "No deadlock pending."}

    victims = s.pending_deadlock.get("nodes", []) or []
    if not victims:
        return {"ok": False, "message": "No candidates found."}

    best_victim, explanation = DeadlockDetector.choose_victim_explained(s.rm, victims, policy=req.policy)
    chosen = req.victim or best_victim

    s.logger.log("ERROR", "RESOLUTION", tid=chosen,
                 details=f"terminate via API; policy={req.policy}; explanation={explanation}")
    s.rm.abort(chosen)
    s.pending_deadlock = None
    s.suppress_deadlock_until = time.time() + 2.0
    return {"ok": True, "victim": chosen, "explanation": explanation}

# (Optional) deterministically create contention to demo the UI
@app.post("/force-deadlock")
def force_deadlock():
    """
    Tries to quickly create a 2-thread cycle by orchestrating requests on R0 and R1.
    Non-guaranteed (since workers are active), but usually induces a cycle soon.
    """
    s = get_sim()
    rm = s.rm
    # Simple tactic: create two transient threads who grab in opposite order.
    import threading, random, time
    def grabber(tid, first, second):
        s.logger.log("INFO", "REQUEST", tid, details=str([first, second]))
        ok = rm.acquire([first], tid, shuffle=False)
        time.sleep(0.2)
        ok = rm.acquire([second], tid, shuffle=False)
        if ok:
            time.sleep(0.5)
        rm.release_all(tid)

    tA = threading.Thread(target=grabber, args=("TDL-A", "R0", "R1"), daemon=True)
    tB = threading.Thread(target=grabber, args=("TDL-B", "R1", "R0"), daemon=True)
    tA.start(); tB.start()
    return {"ok": True}

# ---------- WebSocket for live push (metrics & WFG & deadlock & logs) ----------
@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            s = get_sim()
            payload = {
                "metrics": s.metrics(),
                "wfg": build_wfg_payload(s),
                "deadlock": s.pending_deadlock or None,
                "logs": last_events(s, limit=50)
            }
            await ws.send_json(payload)
            await ws.receive_text()
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
