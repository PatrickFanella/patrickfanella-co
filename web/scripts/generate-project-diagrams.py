from pathlib import Path
import json
import html
import textwrap

root = Path(__file__).resolve().parents[2]
# Selected paths, with names and edges taken from the reviewed repository notes.
graphs = {
    "clpr": (
        "Clip retrieval and durable state",
        [
            "React web client",
            "Versioned Go API",
            "PostgreSQL records",
            "OpenSearch retrieval",
            "Redis sessions / cache",
        ],
        [
            (0, 1, "requests"),
            (1, 2, "durable writes"),
            (1, 3, "hybrid search"),
            (1, 4, "sessions"),
        ],
    ),
    "hasanara": (
        "From a recording to a source timestamp",
        [
            "Source recordings",
            "GPU transcription",
            "PostgreSQL jobs / text",
            "OpenSearch index",
            "Rekolekt FastAPI",
            "HasanAra web",
        ],
        [
            (0, 1, "ingest"),
            (1, 2, "timestamped text"),
            (2, 3, "index"),
            (3, 4, "search"),
            (4, 5, "results + passages"),
        ],
    ),
    "undertow": (
        "Local video export",
        [
            "Audio / artwork / lyrics",
            "React layer editor",
            "WebGL compositor",
            "WebCodecs encoder",
            "Local video file",
        ],
        [
            (0, 1, "compose"),
            (1, 2, "layer state"),
            (2, 3, "frames + audio"),
            (3, 4, "encode"),
        ],
    ),
    "tadooer": (
        "Task replay and calendar authority",
        [
            "Web / desktop client",
            "IndexedDB outbox",
            "Suite API",
            "SQLite task state",
            "CalDAV connector",
            "Calendar server",
        ],
        [
            (0, 1, "queue task edits"),
            (1, 2, "replay / conflicts"),
            (2, 3, "authoritative state"),
            (2, 4, "online commands"),
            (4, 5, "ETag checks"),
        ],
    ),
    "patchwork": (
        "Public records with approximate locations",
        [
            "AT Protocol records",
            "Jetstream ingestion",
            "Indexer / privacy rules",
            "PostgreSQL store",
            "Query API",
            "React map / feed",
        ],
        [
            (0, 1, "record events"),
            (1, 2, "ingest"),
            (2, 3, "coarse areas"),
            (3, 4, "query"),
            (4, 5, "public discovery"),
        ],
    ),
    "super-productivity-mcp": (
        "Two clients, one local bridge",
        [
            "AI client",
            "Go MCP server",
            "Local inbox / outbox",
            "In-app plugin bridge",
            "Super Productivity",
            "Desktop quick-add",
        ],
        [
            (0, 1, "MCP / stdio"),
            (1, 2, "file IPC"),
            (2, 3, "requests / replies"),
            (3, 4, "PluginAPI"),
            (5, 2, "file IPC"),
        ],
    ),
}
graphs.update(
    {
        "chatty-cat": [
            "Chat transport stays independent",
            [
                "Twitch IRC",
                "Go chat service",
                "Workspace client",
                "Pane presentation",
                "Public backfill",
                "Optional providers",
            ],
            [
                [0, 1, "chat"],
                [1, 2, "live updates"],
                [2, 3, "render"],
                [4, 1, "restore"],
                [5, 2, "context"],
            ],
        ],
        "commons": [
            "Ownership before project control",
            [
                "React workspace",
                "Node API",
                "SQLite state",
                "Repository proof",
                "Project roles",
                "Progress / threads",
            ],
            [
                [0, 1, "requests"],
                [1, 2, "persist"],
                [1, 3, "verify claim"],
                [3, 4, "grant rights"],
                [4, 5, "coordinate"],
            ],
        ],
        "headcount": [
            "Observations before interpretation",
            [
                "Twitch Helix / IRC",
                "Go collectors",
                "TimescaleDB",
                "Detector evidence",
                "Sus quotient",
                "Read-only web",
            ],
            [
                [0, 1, "observe"],
                [1, 2, "aggregates"],
                [2, 3, "analyze"],
                [3, 4, "combine"],
                [4, 5, "publish"],
            ],
        ],
        "left-field": [
            "A score keeps its sources",
            [
                "Public records",
                "Candidate ingest",
                "Postgres evidence",
                "Review / version",
                "Published read API",
                "Research frontend",
            ],
            [
                [0, 1, "collect"],
                [1, 2, "retain"],
                [2, 3, "check"],
                [3, 4, "publish"],
                [4, 5, "explain"],
            ],
        ],
        "rekolekt": [
            "A headless core, an independent frontend",
            [
                "Recordings",
                "Transcription jobs",
                "Postgres / search",
                "Rekolekt HTTP API",
                "HasanAra frontend",
                "Source timestamp",
            ],
            [
                [0, 1, "ingest"],
                [1, 2, "index"],
                [2, 3, "retrieve"],
                [3, 4, "contract"],
                [4, 5, "return to source"],
            ],
        ],
        "arkhiv": [
            "One engine, independent collection apps",
            [
                "Collection source",
                "Review / ingest",
                "Headless engine",
                "Versioned API",
                "Branded frontends",
                "Reader / playback",
            ],
            [
                [0, 1, "select"],
                [1, 2, "retain context"],
                [2, 3, "serve"],
                [3, 4, "pinned release"],
                [4, 5, "access policy"],
            ],
        ],
        "subsets": [
            "Select the working set",
            [
                "Skill folders",
                "Discovery / owners",
                "Named groups",
                "Preview plan",
                "Checked apply",
                "Recovery journal",
            ],
            [
                [0, 1, "inspect"],
                [1, 2, "group"],
                [2, 3, "choose"],
                [3, 4, "confirm"],
                [4, 5, "retain"],
            ],
        ],
        "patstack": [
            "Source, plan, installed tree",
            [
                "Sources / profiles",
                "Source hashes",
                "Expected / desired",
                "Guarded installer",
                "Installed views",
                "Verified receipt",
            ],
            [
                [0, 1, "snapshot"],
                [1, 2, "compare"],
                [2, 3, "refuse drift"],
                [3, 4, "apply"],
                [4, 5, "verify"],
            ],
        ],
        "obsidian-plugin-metronome-tuner": [
            "Timing and pitch stay local",
            [
                "Obsidian commands",
                "Plugin panel",
                "Web Audio clock",
                "Metronome pulse",
                "Opt-in microphone",
                "Pitch detection",
            ],
            [
                [0, 1, "open"],
                [1, 2, "start timing"],
                [2, 3, "schedule"],
                [4, 5, "permission"],
                [5, 1, "pitch display"],
            ],
        ],
        "ytclip": [
            "A URL and a bounded excerpt",
            [
                "URL / timestamps",
                "Bash validation",
                "yt-dlp",
                "Retrieved media",
                "ffmpeg",
                "Output file",
            ],
            [
                [0, 1, "parse"],
                [1, 2, "retrieve"],
                [2, 3, "download"],
                [3, 4, "trim / encode"],
                [4, 5, "write"],
            ],
        ],
        "twitchdl": [
            "Capture, finalize, validate",
            [
                "Public URL",
                "Go orchestration",
                "Media backend",
                "Recoverable .part",
                "ffmpeg / ffprobe",
                "Final recording",
            ],
            [
                [0, 1, "validate"],
                [1, 2, "delegate"],
                [2, 3, "capture"],
                [3, 4, "finalize"],
                [4, 5, "publish locally"],
            ],
        ],
        "clustr-galaxy": [
            "A session keeps its graph revision",
            [
                "Clustr HTTP API",
                "Snapshot checks",
                "Pinned session",
                "Explore navigation",
                "Survey progress",
                "Verified cache",
            ],
            [
                [0, 1, "bounded data"],
                [1, 2, "accept"],
                [2, 3, "navigate"],
                [2, 4, "scan"],
                [5, 1, "offline source"],
            ],
        ],
        "the-common-house": [
            "Evidence, choice, aftermath",
            [
                "Authored evidence",
                "Case-state model",
                "Recipient review",
                "Explicit choice",
                "Send or refuse",
                "Saved aftermath",
            ],
            [
                [0, 1, "inspect"],
                [1, 2, "compare"],
                [2, 3, "understand"],
                [3, 4, "decide"],
                [4, 5, "retain outcome"],
            ],
        ],
        "backline": [
            "Only the modules a server enables",
            [
                "Staff dashboard",
                "Policy-checked API",
                "PostgreSQL",
                "Bot modules",
                "Discord server",
            ],
            [
                [0, 1, "configure"],
                [1, 2, "persist"],
                [1, 3, "enabled policy"],
                [3, 4, "act"],
            ],
        ],
        "tmux-popups": [
            "One registry for keys, menus, and checks",
            [
                "Registry rows",
                "Local overrides",
                "Generated bindings",
                "Quick menu",
                "Popup command",
                "Doctor checks",
            ],
            [
                [0, 1, "merge"],
                [1, 2, "generate"],
                [2, 3, "choose"],
                [3, 4, "launch"],
                [1, 5, "dependencies"],
            ],
        ],
        "prichal": [
            "Control plane and account server",
            [
                "Management UI",
                "Go control plane",
                "Desired state",
                "Restricted agent",
                "Upstream PDS",
                "AT Protocol apps",
            ],
            [
                [0, 1, "request"],
                [1, 2, "record"],
                [2, 3, "reconcile"],
                [3, 4, "manage"],
                [4, 5, "serve records"],
            ],
        ],
        "pirs": [
            "Event delivery and separate host research",
            [
                "Upstream PDS",
                "Sequencer bridge",
                "Retained events",
                "Durable cursor",
                "Isolated host tests",
                "Draft hook contract",
            ],
            [
                [0, 1, "observe"],
                [1, 2, "retain"],
                [2, 3, "resume"],
                [5, 4, "host research"],
            ],
        ],
        "subcult-os": [
            "From the plan to the door",
            [
                "Event draft",
                "Crew / schedule",
                "Free reservations",
                "Door check-in",
                "Close-out report",
            ],
            [
                [0, 1, "coordinate"],
                [1, 2, "publish"],
                [2, 3, "admit"],
                [3, 4, "review"],
            ],
        ],
        "kork": [
            "A link page keeps payments direct",
            [
                "Creator editor",
                "Go API",
                "Postgres page",
                "Public link page",
                "Creator accounts",
            ],
            [
                [0, 1, "save"],
                [1, 2, "persist"],
                [2, 3, "publish"],
                [3, 4, "open payment link"],
            ],
        ],
    }
)
# Six positions keep the selected paths on one canvas, with room for edge labels.
coords = [(56, 170), (456, 170), (856, 170), (856, 450), (456, 450), (56, 450)]
output = root / "web/public/assets/projects/diagrams"
output.mkdir(exist_ok=True)
data = json.loads((root / "db/seed/portfolio.json").read_text())
for slug, (title, nodes, edges) in graphs.items():
    project = next(p for p in data["projects"] if p["slug"] == slug)
    elements = []
    for a, b, label in edges:
        x, y = coords[a]
        xx, yy = coords[b]
        sx = x + 160
        sy = y + 95
        tx = xx + 160
        ty = yy + 95
        if y == yy:
            sx = x + 320 if xx > x else x
            tx = xx if xx > x else xx + 320
            sy = ty = y + 68
            path = f"M{sx} {sy} L{tx} {ty}"
            lx = (sx + tx) / 2
            ly = y + 160
        elif x == xx:
            sx = tx = x + 160
            sy = y + 136 if yy > y else y
            ty = yy if yy > y else yy + 136
            path = f"M{sx} {sy} L{tx} {ty}"
            lx = sx - 70
            ly = (sy + ty) / 2
        else:
            sx = x + 160
            sy = y + 136
            tx = xx + 160
            ty = yy
            mid = 380 if a != 5 else 410
            if a == 5:
                sx = x + 320
                sy = y + 68
                tx = xx + 160
                ty = yy + 136
            path = f"M{sx} {sy} V{mid} H{tx} V{ty}"
            lx = (sx + tx) / 2
            ly = mid - 12
        label_svg = "".join(
            f'<text x="{lx if x != xx else sx + 26}" y="{ly + n * 22 if x != xx else (sy + ty) / 2 - 10 + n * 22}" fill="#d7d7eb" text-anchor="{"middle" if x != xx else "start"}" font-family="monospace" font-size="18">{html.escape(line)}</text>'
            for n, line in enumerate(textwrap.wrap(label, 14) if x == xx else [label])
        )
        elements.append(
            f'<path d="{path}" fill="none" stroke="#bd93f9" stroke-width="3" marker-end="url(#arrow)"/>{label_svg}'
        )
    for i, label in enumerate(nodes):
        x, y = coords[i]
        lines = textwrap.wrap(label, 16)
        elements.append(
            f'<rect x="{x}" y="{y}" width="320" height="136" fill="#21222c" stroke="#805bca" stroke-width="2"/>'
        )
        for n, line in enumerate(lines):
            elements.append(
                f'<text x="{x + 24}" y="{y + 58 + n * 34}" fill="#f8f8f2" font-family="sans-serif" font-size="25" font-weight="600">{html.escape(line)}</text>'
            )
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-labelledby="title desc"><title id="title">{html.escape(project["title"])}: {html.escape(title)}</title><desc id="desc">Selected data path from the project repository notes. An architecture explanation, not a measurement of live traffic.</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="#bd93f9"/></marker></defs><rect width="1280" height="720" fill="#282a36"/><text x="56" y="65" fill="#50fa7b" font-family="monospace" font-size="20">{html.escape(project["title"].upper())} / SELECTED DATA PATH</text><text x="56" y="118" fill="#f8f8f2" font-family="sans-serif" font-size="36" font-weight="700">{html.escape(title)}</text>{"".join(elements)}<text x="56" y="674" fill="#b4b5c4" font-family="sans-serif" font-size="20">{html.escape("Conceptual component flow. Delivery: " + project["deliveryStatus"] + ".")}</text></svg>"""
    (output / (slug + "-data-path.svg")).write_text(svg)
    project["media"] = [
        item
        for item in project["media"]
        if not item["src"].endswith(slug + "-data-path.svg")
    ]
    project["media"].append(
        {
            "src": "/assets/projects/diagrams/" + slug + "-data-path.svg",
            "alt": project["title"] + " component flow: " + ", ".join(nodes) + ".",
            "caption": "Selected component flow from the project’s repository architecture notes.",
        }
    )
(root / "db/seed/portfolio.json").write_text(
    json.dumps(data, indent=2, ensure_ascii=False) + "\n"
)
