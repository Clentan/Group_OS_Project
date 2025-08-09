export function connectWS(
  url = process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws"
) {
  const ws = new WebSocket(url)
  const listeners = new Set()
  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data)
      listeners.forEach((fn) => fn(data))
    } catch {}
  }
  const ping = () => {
    if (ws.readyState === 1) ws.send("ping")
  }
  const interval = setInterval(ping, 500)
  return {
    on(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    close() {
      clearInterval(interval)
      ws.close()
    },
  }
}
