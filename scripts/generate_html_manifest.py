#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML_DIR = ROOT / "html"
MANIFEST_PATH = HTML_DIR / "manifest.json"


def main() -> None:
    archivos = sorted(
        p.name for p in HTML_DIR.glob("*.html") if p.name.lower() != "index.html"
    )

    data = {"files": archivos}
    MANIFEST_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Manifest actualizado: {MANIFEST_PATH}")
    print(f"Archivos incluidos: {len(archivos)}")


if __name__ == "__main__":
    main()
