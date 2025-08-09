from __future__ import annotations
import time, random, threading, queue
from collections import defaultdict, deque
from dataclasses import dataclass, field
from typing import Dict, Deque, Optional, Set, List, Tuple
import numpy as np
import networkx as nx
import psutil

# ----------------------------- Simulation core -----------------------------
@dataclass
class LogRecord:
    level: str
    event: str
    tid: Optional[str] = None
    res: Optional[str] = None
    details: Optional[str] = None
    def as_dict(self):
        return {
            "level": self.level,
            "event": self.event,
            "tid": self.tid,
            "res": self.res,
            "details": self.details,
        }

@dataclass
class ResourceState:
    holder: Optional[str] = None
    wait_queue: Deque[str] = field(default_factory=deque)

class Logger:
    def __init__(self):
        self.q: queue.Queue[LogRecord] = queue.Queue()
        self.buffer: List[LogRecord] = []
        self.lock = threading.Lock()
    def log(self, level: str, event: str, tid: Optional[str] = None, res: Optional[str] = None, details: Optional[str] = None):
        rec = LogRecord(level, event, tid, res, details)
        self.q.put(rec)
        with self.lock:
            self.buffer.append(rec)
            if len(self.buffer) > 5000:
                self.buffer = self.buffer[-5000:]
    def drain(self) -> List[LogRecord]:
        drained: List[LogRecord] = []
        while not self.q.empty():
            drained.append(self.q.get())
        return drained

class ResourceManager:
    def __init__(self, resource_ids: List[str], logger: Logger):
        self.resources: Dict[str, ResourceState] = {r: ResourceState() for r in resource_ids}
        self.held_by_thread: Dict[str, Set[str]] = defaultdict(set)
        self.waiting_for: Dict[str, Optional[str]] = defaultdict(lambda: None)
        self.waiting_since: Dict[str, Optional[float]] = defaultdict(lambda: None)  # when a thread started waiting
        self.cv = threading.Condition()
        self.logger = logger
        self.aborted: Set[str] = set()

    def try_acquire(self, r: str, tid: str) -> bool:
        with self.cv:
            stt = self.resources[r]
            if stt.holder is None:
                stt.holder = tid
                self.held_by_thread[tid].add(r)
                self.waiting_since[tid] = None
                self.logger.log("INFO", "GRANT", tid, r)
                return True
            # Re-entrant request
            if stt.holder == tid:
                self.logger.log("INFO", "REENTRANT", tid, r, details="already holds; treat as granted")
                return True
            # Otherwise, block
            if tid not in stt.wait_queue:
                stt.wait_queue.append(tid)
            self.waiting_for[tid] = r
            if self.waiting_since[tid] is None:
                self.waiting_since[tid] = time.time()
            self.logger.log("WARN", "BLOCK", tid, r, details=f"holder={stt.holder}")
            return False

    def acquire(self, resources: List[str], tid: str, shuffle=True):
        order = random.sample(resources, len(resources)) if shuffle else sorted(resources)
        for r in order:
            while True:
                if tid in self.aborted:
                    return False
                if self.try_acquire(r, tid):
                    break
                with self.cv:
                    self.cv.wait(timeout=0.2)
        return True

    def release_all(self, tid: str):
        with self.cv:
            held = list(self.held_by_thread.get(tid, set()))
            for r in held:
                stt = self.resources[r]
                if stt.holder == tid:
                    stt.holder = None
                    self.logger.log("INFO", "RELEASE", tid, r)
                    # Wake the first non-aborted waiter
                    if stt.wait_queue:
                        nxt = None
                        while stt.wait_queue and nxt is None:
                            cand = stt.wait_queue.popleft()
                            if cand not in self.aborted:
                                nxt = cand
                        if nxt:
                            stt.holder = nxt
                            self.held_by_thread[nxt].add(r)
                            self.waiting_for[nxt] = None
                            self.waiting_since[nxt] = None
                            self.logger.log("INFO", "GRANT", nxt, r, details="wakeup")
            self.held_by_thread[tid].clear()
            self.waiting_for[tid] = None
            self.waiting_since[tid] = None
            self.cv.notify_all()

    def build_wfg(self) -> nx.DiGraph:
        g = nx.DiGraph()
        with self.cv:
            for t in set(list(self.held_by_thread.keys()) + list(self.waiting_for.keys())):
                g.add_node(t)
            for r, stt in self.resources.items():
                if stt.holder is None:
                    continue
                holder = stt.holder
                for waiter in list(stt.wait_queue):
                    g.add_edge(waiter, holder, resource=r)
        return g

    def build_rag(self) -> nx.DiGraph:
        g = nx.DiGraph()
        with self.cv:
            for r in self.resources:
                g.add_node(r, kind="res")
            for t in set(list(self.held_by_thread.keys()) + list(self.waiting_for.keys())):
                g.add_node(t, kind="proc")
            for r, stt in self.resources.items():
                if stt.holder:
                    g.add_edge(stt.holder, r, kind="holds")
                for waiter in list(stt.wait_queue):
                    g.add_edge(waiter, r, kind="waits")
        return g

    def edge_resource(self, waiter: str, holder: str) -> Optional[str]:
        with self.cv:
            for r, stt in self.resources.items():
                if stt.holder == holder and waiter in stt.wait_queue:
                    return r
        return None

    def abort(self, tid: str):
        with self.cv:
            self.aborted.add(tid)
            self.logger.log("ERROR", "TERMINATE", tid, details="victim termination")
            # Purge from all wait queues
            for stt in self.resources.values():
                try:
                    while tid in stt.wait_queue:
                        stt.wait_queue.remove(tid)
                except ValueError:
                    pass
            # Release any held resources
            self.release_all(tid)
            self.waiting_for[tid] = None
            self.waiting_since[tid] = None
            self.cv.notify_all()

class DeadlockDetector(threading.Thread):
    def __init__(self, rm: ResourceManager, logger: Logger, interval: float = 0.5, on_deadlock=None):
        super().__init__(daemon=True)
        self.rm = rm
        self.logger = logger
        self.interval = interval
        self.running = True
        self.on_deadlock = on_deadlock

    def run(self):
        while self.running:
            g = self.rm.build_wfg()
            try:
                cyc = nx.find_cycle(g, orientation="original")
                edges = [(u, v) for u, v, _ in cyc]
                nodes = list({u for u, v in edges} | {v for u, v in edges})
                self_waiters = [u for (u, v) in edges if u == v]
                deadlock_type = "self-wait" if self_waiters else "cycle"
                edge_details = [{"waiter": u, "holder": v, "resource": self.rm.edge_resource(u, v)} for (u, v) in edges]
                self.logger.log("ERROR", "DEADLOCK_DETECTED", details=f"type={deadlock_type} cycle={'→'.join(nodes)}")
                if self.on_deadlock:
                    self.on_deadlock({
                        "nodes": nodes,
                        "edges": edges,
                        "edge_details": edge_details,
                        "deadlock_type": deadlock_type,
                        "self_waiters": self_waiters
                    })
            except nx.exception.NetworkXNoCycle:
                pass
            time.sleep(self.interval)

    # -------- Victim selection with explanation --------
    @staticmethod
    def _features_for(rm: ResourceManager, tid: str) -> dict:
        # How many resources it holds
        holds = list(rm.held_by_thread.get(tid, set()))
        holds_count = len(holds)
        # How many threads are waiting on resources it holds (how much we unblock)
        dependents = 0
        with rm.cv:
            for r in holds:
                stt = rm.resources[r]
                dependents += len(stt.wait_queue)
        # How long this thread has been waiting (favor aborting newer waiters)
        ws = rm.waiting_since.get(tid)
        wait_age = 0.0 if ws is None else max(0.0, time.time() - ws)
        return {"holds_count": holds_count, "dependents": dependents, "wait_age": wait_age}

    @staticmethod
    def choose_victim_explained(rm: ResourceManager, candidates: List[str], policy: str = "min_cost") -> Tuple[str, dict]:
        """
        policy options:
          - 'min_cost'      : abort fewest-held-resources (cheap rollback), tie-break by lowest wait_age then dependents
          - 'max_unblock'   : abort the one that unblocks the most others (highest dependents), tie-break by holds then wait_age
          - 'most_resources': current classic heuristic (holds_count desc), tie-break by dependents desc, then wait_age
        Returns (victim_tid, explanation_dict)
        """
        feats = {t: DeadlockDetector._features_for(rm, t) for t in candidates}

        def key_min_cost(t):
            f = feats[t]
            return (f["holds_count"], f["wait_age"], f["dependents"])  # ascending

        def key_max_unblock(t):
            f = feats[t]
            return (-f["dependents"], f["holds_count"], f["wait_age"])  # dependents desc

        def key_most_resources(t):
            f = feats[t]
            return (-f["holds_count"], -f["dependents"], f["wait_age"])  # holds desc

        if policy == "max_unblock":
            victim = sorted(candidates, key=key_max_unblock)[0]
            rationale = "Chosen to unblock the most waiting threads."
        elif policy == "most_resources":
            victim = sorted(candidates, key=key_most_resources)[0]
            rationale = "Chosen because it holds the most resources"
        else:
            victim = sorted(candidates, key=key_min_cost)[0]
            rationale = "Chosen for minimal rollback cost."

        exp = {
            "policy": policy,
            "rationale": rationale,
            "candidates": {
                t: {
                    "holds_count": feats[t]["holds_count"],
                    "dependents": feats[t]["dependents"],
                    "wait_age_sec": round(feats[t]["wait_age"], 3),
                } for t in candidates
            },
            "winner": victim,
            "winner_features": {
                **feats[victim],
                "wait_age_sec": round(feats[victim]["wait_age"], 3),
            },
        }
        return victim, exp

    # Backwards-compatible method used elsewhere
    @staticmethod
    def choose_victim(rm: ResourceManager, candidates: List[str]) -> str:
        v, _ = DeadlockDetector.choose_victim_explained(rm, candidates, policy="most_resources")
        return v

class Worker(threading.Thread):
    def __init__(self, tid: str, rm: ResourceManager, logger: Logger):
        super().__init__(daemon=True)
        self.tid = tid
        self.rm = rm
        self.logger = logger
        self.running = True
    def run(self):
        while self.running:
            all_res = list(self.rm.resources.keys())
            k = random.randint(1, min(3, len(all_res)))
            req = random.sample(all_res, k)
            self.logger.log("INFO", "REQUEST", self.tid, details=str(req))
            ok = self.rm.acquire(req, self.tid, shuffle=True)
            if not ok:
                self.logger.log("WARN", "ABORTED", self.tid, details="aborted while waiting")
                break
            t0 = time.time(); hold = random.uniform(0.5, 1.5)
            while time.time() - t0 < hold:
                if self.tid in self.rm.aborted: break
                time.sleep(0.05)
            self.rm.release_all(self.tid)
            time.sleep(random.uniform(0.1, 0.4))

class Simulation:
    def __init__(self, threads=10, resources=6):
        self.logger = Logger()
        self.rm = ResourceManager([f"R{i}" for i in range(resources)], self.logger)
        self.workers: List[Worker] = [Worker(f"T{i}", self.rm, self.logger) for i in range(threads)]
        self.pending_deadlock: Optional[dict] = None
        self.suppress_deadlock_until: float = 0.0
        def on_deadlock(info):
            # Ignore detector events during the suppression window
            if time.time() < self.suppress_deadlock_until:
                return
            self.pending_deadlock = info
        self.detector = DeadlockDetector(self.rm, self.logger, on_deadlock=on_deadlock)
        self.running = False
    def start(self):
        if self.running: return
        self.running = True
        for w in self.workers: w.start()
        self.detector.start()
        self.logger.log("INFO", "SIM_START", details=f"threads={len(self.workers)} resources={len(self.rm.resources)}")
    def stop(self):
        if not self.running: return
        self.detector.running = False
        for w in self.workers: w.running = False
        with self.rm.cv:
            self.rm.cv.notify_all()
        self.running = False
        self.logger.log("INFO", "SIM_STOP")
    def metrics(self):
        p = psutil.Process()
        return {
            "cpu": p.cpu_percent(interval=0.2),
            "mem_mb": p.memory_info().rss / (1024*1024),
            "threads_alive": sum(1 for w in self.workers if w.is_alive()),
            "resources": len(self.rm.resources),
        }
