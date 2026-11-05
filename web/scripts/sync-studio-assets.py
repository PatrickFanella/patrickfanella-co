"""Refresh the explicit portfolio asset selection from the owning Studio checkout.

Usage: python web/scripts/sync-studio-assets.py /path/to/subcult-tv
Never copies a directory or a private Studio catalog. Selected source hashes must
match the reviewed manifest; later product edits stop the refresh.
"""

import hashlib
import json
import sys
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
source = Path(sys.argv[1]).resolve()
manifest = json.loads((root / "docs/brand-asset-provenance.json").read_text())
for row in manifest["files"]:
    src, target = source / row["source"], root / row["target"]
    digest = hashlib.sha256(src.read_bytes()).hexdigest()
    if digest != row["sourceSha256"]:
        raise SystemExit(
            f"Studio source changed: {row['source']}; review a new selection first"
        )
    if (
        target.exists()
        and hashlib.sha256(target.read_bytes()).hexdigest() != row["sha256"]
    ):
        raise SystemExit(f"Portfolio asset changed: {row['target']}")
    target.parent.mkdir(parents=True, exist_ok=True)
    if row["kind"] == "Public capture downscaled for narrow screens":
        with Image.open(src) as image:
            image.thumbnail((720, 450))
            image.save(target, "WEBP", quality=86)
    else:
        target.write_bytes(src.read_bytes())
    if hashlib.sha256(target.read_bytes()).hexdigest() != row["sha256"]:
        raise SystemExit(f"Export bytes differ: {row['target']}")
print(f"Verified and refreshed {len(manifest['files'])} explicitly selected assets")
