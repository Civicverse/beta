#!/usr/bin/env python3
"""
civicverse_master.py
Single-file Web UI dashboard to control Civicverse services and CRAIG.
Run: python civicverse_master.py
Dashboard: http://0.0.0.0:8080
"""

import os
import subprocess
import threading
import time
from datetime import datetime
from flask import Flask, render_template_string, request, jsonify

ROOT = os.path.dirname(os.path.abspath(__file__))

# --------------- CONFIG: Edit this if you add/rename services ---------------
# Each service: key (id), human name, docker_name fragment (optional), fallback start/stop commands (optional), port (optional)
SERVICES = {
    "game": {
        "display": "Civicverse Game Server",
        "docker_name": "repo-game-server",
        "start_cmd": "cd /opt/civicverse/repo/game && ./start_game_server.sh",
        "stop_cmd": None,
        "port": 4000
    },
    "frontend": {
        "display": "Civicverse Frontend",
        "docker_name": "repo-frontend",
        "start_cmd": "cd /opt/civicverse/repo/frontend && npm start",
        "stop_cmd": None,
        "port": 3000
    },
    "backend": {
        "display": "Civicverse Backend",
        "docker_name": "repo-backend",
        "start_cmd": "cd /opt/civicverse/repo/backend && python server.py",
        "stop_cmd": None,
        "port": 8000
    },
    "mining": {
        "display": "Civicverse Mining",
        "docker_name": "repo-mining",
        "start_cmd": "cd /opt/civicverse/repo/mining && ./start_miner.sh",
        "stop_cmd": None,
        "port": None
    },
    "craig": {
        "display": "CRAIG AI",
        "docker_name": None,
        "start_cmd": f"cd {ROOT}/AI_Agent/Civicverse/ai_agents && source ../venv_craig/bin/activate && python craig_v2.py",
        "stop_cmd": None,
        "port": None
    }
}
# ---------------------------------------------------------------------------

app = Flask(__name__)

# Keep track of subprocess objects for services started by this master
processes = {}
process_lock = threading.Lock()


# ------------------ Helper utilities ------------------

def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def run_background(cmd, service_id):
    """
    Run command in background and capture its stdout/stderr to a rolling file.
    If the service is a Docker container (exists), try to start the container instead.
    """
    svc = SERVICES[service_id]
    # If Docker container exists, try to start it
    if is_docker_available() and svc.get("docker_name"):
        if docker_container_exists(svc["docker_name"]):
            # use docker start
            try:
                subprocess.check_output(["docker", "start", svc["docker_name"]], stderr=subprocess.STDOUT)
                log(f"{svc['display']}: docker start issued")
                return {"ok": True, "msg": "docker start issued"}
            except subprocess.CalledProcessError as e:
                return {"ok": False, "msg": f"docker start failed: {e.output.decode()}"}

    # Fallback: run the provided start command
    if not cmd:
        return {"ok": False, "msg": "No start command configured for this service."}

    # Launch a process and log its output to file
    logfile = os.path.join(ROOT, f"logs/{service_id}.log")
    os.makedirs(os.path.dirname(logfile), exist_ok=True)
    with open(logfile, "ab") as out:
        # Start process in a shell to allow complex commands; runs detached in a new process group
        p = subprocess.Popen(cmd, shell=True, stdout=out, stderr=out, preexec_fn=os.setsid)
    with process_lock:
        processes[service_id] = {"proc": p, "logfile": logfile, "cmd": cmd}
    return {"ok": True, "msg": f"Started (pid {p.pid}), logging to {logfile}"}


def stop_service_process(service_id):
    svc = SERVICES[service_id]
    # If docker container exists, try stop it
    if is_docker_available() and svc.get("docker_name"):
        if docker_container_exists(svc["docker_name"]):
            try:
                subprocess.check_output(["docker", "stop", svc["docker_name"]], stderr=subprocess.STDOUT, timeout=20)
                return {"ok": True, "msg": "docker stop issued"}
            except subprocess.CalledProcessError as e:
                return {"ok": False, "msg": f"docker stop failed: {e.output.decode()}"}
    # fallback: if we started process, terminate it
    with process_lock:
        rec = processes.get(service_id)
        if not rec:
            return {"ok": False, "msg": "No managed process found"}
        p = rec["proc"]
        try:
            p.terminate()
            p.wait(timeout=10)
            del processes[service_id]
            return {"ok": True, "msg": f"Process {p.pid} terminated"}
        except Exception as e:
            try:
                p.kill()
                del processes[service_id]
                return {"ok": True, "msg": f"Process {p.pid} killed"}
            except Exception as e2:
                return {"ok": False, "msg": f"Failed to stop process: {e} / {e2}"}


def is_docker_available():
    try:
        subprocess.check_output(["docker", "info"], stderr=subprocess.DEVNULL, timeout=5)
        return True
    except Exception:
        return False


def docker_container_exists(name_fragment):
    try:
        out = subprocess.check_output(["docker", "ps", "-a", "--format", "{{.Names}}"], text=True)
        names = out.splitlines()
        for n in names:
            if name_fragment in n:
                return True
        return False
    except Exception:
        return False


def docker_container_running(name_fragment):
    try:
        out = subprocess.check_output(["docker", "ps", "--format", "{{.Names}}"], text=True)
        names = out.splitlines()
        for n in names:
            if name_fragment in n:
                return True
        return False
    except Exception:
        return False


def service_status(service_id):
    svc = SERVICES[service_id]
    # Docker-based status preferred
    if is_docker_available() and svc.get("docker_name") and docker_container_exists(svc["docker_name"]):
        running = docker_container_running(svc["docker_name"])
        return {"present": True, "running": running, "mode": "docker"}
    # If master started a process for it
    with process_lock:
        rec = processes.get(service_id)
        if rec:
            p = rec["proc"]
            alive = (p.poll() is None)
            return {"present": True, "running": alive, "mode": "managed", "pid": p.pid}
    # Otherwise unknown / not running
    return {"present": False, "running": False, "mode": "none"}


def tail_log(service_id, lines=200):
    logfile = os.path.join(ROOT, f"logs/{service_id}.log")
    if not os.path.exists(logfile):
        # If Docker, return docker logs
        svc = SERVICES[service_id]
        if is_docker_available() and svc.get("docker_name") and docker_container_exists(svc["docker_name"]):
            try:
                out = subprocess.check_output(["docker", "logs", "--tail", str(lines), svc["docker_name"]], text=True)
                return out
            except Exception as e:
                return f"docker logs failed: {e}"
        return "Log file not found."
    # tail the file
    try:
        with open(logfile, "rb") as f:
            f.seek(0, os.SEEK_END)
            size = f.tell()
            block = 1024
            data = b""
            while size > 0 and len(data) < 200*1024:
                size -= block
                if size < 0:
                    block += size
                    size = 0
                f.seek(size)
                data = f.read() + data
            text = data.decode(errors="replace")
            return "\n".join(text.splitlines()[-lines:])
    except Exception as e:
        return f"Failed reading log: {e}"


def log(msg):
    print(f"{now()} | {msg}")


# ------------------ Flask routes ------------------

UI_HTML = """
<!doctype html>
<html>
<head>
  <title>Civicverse Master Control</title>
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background:#0b1020;color:#dbe9ff; padding:12px;}
    h1 { color:#6ff; }
    .services { display:flex; flex-wrap:wrap; gap:12px; }
    .card { background:#0f1724; border:1px solid #1f6feb; padding:12px; border-radius:8px; width:320px;}
    .btn { margin:6px 6px 6px 0; padding:8px; border-radius:6px; border:none; cursor:pointer }
    .start { background:#00c853; color:black }
    .stop  { background:#ff5252; color:black }
    .restart { background:#ffd600; color:black }
    pre { background:#010317; color:#7fe; padding:8px; max-height:240px; overflow:auto; }
    .topbar { margin-bottom:12px; }
    .small { color:#93b0ff; font-size:0.9em; }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>Civicverse Master Control</h1>
    <div class="small">Single UI to monitor & control Civicverse services. CRAIG integrated.</div>
  </div>

  <div class="services">
    {% for id, svc in services.items() %}
    <div class="card">
      <h3>{{ svc.display }}</h3>
      <p class="small">id: <b>{{ id }}</b> | port: {{ svc.port }}</p>
      <p>Status: <b id="stat-{{ id }}">loading...</b></p>
      <div>
        <button class="btn start" onclick="action('{{id}}','start')">Start</button>
        <button class="btn stop" onclick="action('{{id}}','stop')">Stop</button>
        <button class="btn restart" onclick="action('{{id}}','restart')">Restart</button>
        <button class="btn" onclick="viewLogs('{{id}}')">Logs</button>
      </div>
      <pre id="log-{{ id }}">-- logs --</pre>
    </div>
    {% endfor %}
  </div>

<script>
function updateStatus() {
  fetch('/status').then(r=>r.json()).then(data=>{
    for(const id in data) {
      const s = data[id];
      const el = document.getElementById('stat-'+id);
      if(!el) continue;
      el.innerText = s.present ? (s.running ? 'RUNNING ('+s.mode+')' : 'STOPPED ('+s.mode+')') : 'NOT FOUND';
    }
  });
}
function action(id, act) {
  fetch('/action', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:id, action:act})})
  .then(r=>r.json()).then(j=>{ alert(j.msg); updateStatus(); if(act=='start') setTimeout(()=>viewLogs(id),800); });
}
function viewLogs(id) {
  fetch('/logs?id='+id).then(r=>r.text()).then(t=>{ document.getElementById('log-'+id).innerText = t; });
}
setInterval(updateStatus, 2000);
updateStatus();
</script>

</body>
</html>
"""

@app.route("/")
def index():
    return render_template_string(UI_HTML, services=SERVICES)


@app.route("/status")
def status():
    out = {}
    for sid in SERVICES.keys():
        out[sid] = service_status(sid)
    return jsonify(out)


@app.route("/action", methods=["POST"])
def action():
    data = request.get_json()
    sid = data.get("id")
    act = data.get("action")
    if sid not in SERVICES:
        return jsonify({"ok": False, "msg": "Unknown service id"}), 400
    svc = SERVICES[sid]
    if act == "start":
        res = run_background(svc.get("start_cmd"), sid)
        return jsonify(res)
    if act == "stop":
        res = stop_service_process(sid)
        return jsonify(res)
    if act == "restart":
        stop_service_process(sid)
        time.sleep(1)
        res = run_background(svc.get("start_cmd"), sid)
        return jsonify(res)
    return jsonify({"ok": False, "msg": "Unknown action"}), 400


@app.route("/logs")
def logs_route():
    sid = request.args.get("id")
    if not sid or sid not in SERVICES:
        return "Unknown service id", 400
    return tail_log(sid)


# ------------------ Start server ------------------
if __name__ == "__main__":
    os.makedirs(os.path.join(ROOT, "logs"), exist_ok=True)
    print(f"{now()} | Starting Civicverse Master UI on http://0.0.0.0:8080")
    app.run(host="0.0.0.0", port=8080, debug=False)
