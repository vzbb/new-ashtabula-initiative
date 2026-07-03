#!/usr/bin/env python3
"""Initialize the lightweight SQLite store for Saybrook request intake."""

from __future__ import annotations

import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "data" / "saybrook-zoning-requests.db"
SCHEMA_PATH = ROOT / "data" / "saybrook-zoning-requests.sql"


def main() -> int:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    schema = SCHEMA_PATH.read_text(encoding="utf-8")
    with sqlite3.connect(DB_PATH) as connection:
        connection.executescript(schema)
        connection.commit()

    print(f"Initialized {DB_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
