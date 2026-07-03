#!/usr/bin/env python3
"""Tiny local request API that persists Saybrook intake packets to SQLite.

This service is intentionally small:
- `GET /health` reports readiness
- `POST /saybrook-zoning-request` writes one intake row to SQLite

It is meant to be called by n8n after the webhook request has already been
normalized into a canonical request record.
"""

from __future__ import annotations

import argparse
import json
import sqlite3
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB_PATH = ROOT / "data" / "saybrook-zoning-requests.db"
SCHEMA_PATH = ROOT / "data" / "saybrook-zoning-requests.sql"
DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORT = 18765


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _read_schema() -> str:
    return SCHEMA_PATH.read_text(encoding="utf-8")


def ensure_db(db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    schema = _read_schema()
    with sqlite3.connect(db_path) as connection:
        connection.execute("PRAGMA journal_mode=WAL;")
        connection.execute("PRAGMA foreign_keys=ON;")
        connection.executescript(schema)
        connection.commit()


def _first_non_empty(*values: Any, default: str = "") -> str:
    for value in values:
        if value is None:
            continue
        if isinstance(value, str):
            cleaned = value.strip()
            if cleaned:
                return cleaned
        elif isinstance(value, (int, float)):
            return str(value)
        else:
            text = str(value).strip()
            if text and text not in {"[]", "{}", "null"}:
                return text
    return default


def _ensure_list(value: Any) -> list[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        text = value.strip()
        if not text:
            return []
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            return [text]
        return parsed if isinstance(parsed, list) else [parsed]
    return [value]


def _normalize_payload(payload: dict[str, Any]) -> dict[str, Any]:
    record = payload.get("record") if isinstance(payload.get("record"), dict) else payload
    contact = record.get("contact") if isinstance(record.get("contact"), dict) else {}

    source_citations = record.get("source_citations_json")
    if source_citations is None:
        source_citations = record.get("sourceCitations", record.get("citations", []))

    attachments = record.get("attachments_json")
    if attachments is None:
        attachments = record.get("attachments", record.get("images", record.get("image_urls", [])))

    chat_transcript = record.get("chat_transcript_json")
    if chat_transcript is None:
        chat_transcript = record.get("chatTranscript", record.get("chat_transcript", []))

    normalized = {
        "submitted_at": _first_non_empty(
            record.get("submitted_at"),
            record.get("submittedAt"),
            default=_utc_now(),
        ),
        "slug": _first_non_empty(record.get("slug"), default="saybrook-zoning"),
        "jurisdiction": _first_non_empty(record.get("jurisdiction"), default="Saybrook Township"),
        "request_type": _first_non_empty(
            record.get("request_type"),
            record.get("requestType"),
            record.get("projectType"),
            default="zoning guidance",
        ),
        "applicant_name": _first_non_empty(
            record.get("applicant_name"),
            record.get("fullName"),
            record.get("applicantName"),
            contact.get("name"),
        ),
        "email": _first_non_empty(record.get("email"), contact.get("email")),
        "phone": _first_non_empty(record.get("phone"), contact.get("phone")),
        "preferred_contact": _first_non_empty(
            record.get("preferred_contact"),
            record.get("preferredContact"),
            default="email",
        ),
        "property_address": _first_non_empty(
            record.get("property_address"),
            record.get("propertyAddress"),
            record.get("address"),
        ),
        "project_type": _first_non_empty(record.get("project_type"), record.get("projectType")),
        "project_summary": _first_non_empty(
            record.get("project_summary"),
            record.get("projectSummary"),
            record.get("draftRequest"),
            record.get("residentSummary"),
        ),
        "specific_question": _first_non_empty(
            record.get("specific_question"),
            record.get("specificQuestion"),
            record.get("sourceQuestion"),
            record.get("question"),
        ),
        "ai_summary": _first_non_empty(
            record.get("ai_summary"),
            record.get("aiSummary"),
            record.get("aiContextSummary"),
        ),
        "source_answer": _first_non_empty(
            record.get("source_answer"),
            record.get("sourceAnswer"),
            record.get("aiContextSummary"),
        ),
        "source_citations_json": json.dumps(_ensure_list(source_citations), ensure_ascii=False),
        "attachments_json": json.dumps(_ensure_list(attachments), ensure_ascii=False),
        "chat_transcript_json": json.dumps(_ensure_list(chat_transcript), ensure_ascii=False),
        "status": _first_non_empty(record.get("status"), default="new"),
    }
    return normalized


def _insert_record(db_path: Path, record: dict[str, Any]) -> int:
    columns = [
        "submitted_at",
        "slug",
        "jurisdiction",
        "request_type",
        "applicant_name",
        "email",
        "phone",
        "preferred_contact",
        "property_address",
        "project_type",
        "project_summary",
        "specific_question",
        "ai_summary",
        "source_answer",
        "source_citations_json",
        "attachments_json",
        "chat_transcript_json",
        "status",
    ]
    placeholders = ", ".join(f":{column}" for column in columns)
    sql = f"INSERT INTO saybrook_zoning_requests ({', '.join(columns)}) VALUES ({placeholders})"

    with sqlite3.connect(db_path) as connection:
        connection.execute("PRAGMA journal_mode=WAL;")
        connection.execute("PRAGMA foreign_keys=ON;")
        cursor = connection.execute(sql, record)
        connection.commit()
        return int(cursor.lastrowid)


def _deserialize_json_field(value: Any) -> Any:
    if not isinstance(value, str):
        return value
    text = value.strip()
    if not text:
        return value
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return value


def _list_requests(db_path: Path, limit: int = 25) -> list[dict[str, Any]]:
    safe_limit = max(1, min(limit, 100))
    sql = """
        SELECT
            id,
            submitted_at,
            slug,
            jurisdiction,
            request_type,
            applicant_name,
            email,
            phone,
            preferred_contact,
            property_address,
            project_type,
            project_summary,
            specific_question,
            ai_summary,
            source_answer,
            source_citations_json,
            attachments_json,
            chat_transcript_json,
            status
        FROM saybrook_zoning_requests
        ORDER BY id DESC
        LIMIT ?
    """
    with sqlite3.connect(db_path) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(sql, (safe_limit,)).fetchall()

    requests: list[dict[str, Any]] = []
    for row in rows:
        record = dict(row)
        record["source_citations"] = _deserialize_json_field(record.pop("source_citations_json", "[]"))
        record["attachments"] = _deserialize_json_field(record.pop("attachments_json", "[]"))
        record["chat_transcript"] = _deserialize_json_field(record.pop("chat_transcript_json", "[]"))
        requests.append(record)
    return requests


class RequestHandler(BaseHTTPRequestHandler):
    server_version = "SaybrookRequestAPI/1.0"

    def log_message(self, format: str, *args: Any) -> None:  # noqa: A003
        print(f"[{_utc_now()}] {self.address_string()} - {format % args}")

    def _json_response(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            parsed = json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise ValueError(f"Invalid JSON body: {exc}") from exc
        if not isinstance(parsed, dict):
            raise ValueError("JSON body must be an object")
        return parsed

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        if path == "/health":
            db_path = Path(self.server.db_path)  # type: ignore[attr-defined]
            ensure_db(db_path)
            with sqlite3.connect(db_path) as connection:
                count = connection.execute(
                    "SELECT COUNT(*) FROM saybrook_zoning_requests"
                ).fetchone()[0]
            self._json_response(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "service": "saybrook-request-api",
                    "dbPath": str(db_path),
                    "rowCount": count,
                    "time": _utc_now(),
                },
            )
            return

        if path in {"/requests", "/saybrook-zoning-requests"}:
            db_path = Path(self.server.db_path)  # type: ignore[attr-defined]
            ensure_db(db_path)
            params = parse_qs(parsed.query)
            try:
                limit = int(params.get("limit", ["25"])[0])
            except ValueError:
                limit = 25
            requests = _list_requests(db_path, limit=limit)
            self._json_response(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "count": len(requests),
                    "requests": requests,
                    "time": _utc_now(),
                },
            )
            return

        self._json_response(
            HTTPStatus.NOT_FOUND,
            {"ok": False, "error": "Not found", "path": self.path},
        )

    def do_POST(self) -> None:  # noqa: N802
        path = self.path.rstrip("/")
        if path not in {"/saybrook-zoning-request", "/requests"}:
            self._json_response(
                HTTPStatus.NOT_FOUND,
                {"ok": False, "error": "Unknown endpoint", "path": self.path},
            )
            return

        try:
            payload = self._read_json_body()
            normalized = _normalize_payload(payload)
            db_path = Path(self.server.db_path)  # type: ignore[attr-defined]
            ensure_db(db_path)
            row_id = _insert_record(db_path, normalized)
        except Exception as exc:  # noqa: BLE001
            self._json_response(
                HTTPStatus.BAD_REQUEST,
                {"ok": False, "error": str(exc), "time": _utc_now()},
            )
            return

        response = {
            "ok": True,
            "status": "queued",
            "id": row_id,
            "queueId": row_id,
            "receivedAt": normalized["submitted_at"],
            "dbPath": str(db_path),
            "record": normalized,
        }
        self._json_response(HTTPStatus.OK, response)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Serve Saybrook request intake over HTTP")
    parser.add_argument("--host", default=DEFAULT_HOST, help="host to bind")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="port to bind")
    parser.add_argument(
        "--db-path",
        type=Path,
        default=DEFAULT_DB_PATH,
        help="SQLite database path to write into",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()
    ensure_db(args.db_path)
    server = ThreadingHTTPServer((args.host, args.port), RequestHandler)
    server.db_path = str(args.db_path)  # type: ignore[attr-defined]
    print(f"Saybrook request API listening on http://{args.host}:{args.port}")
    print(f"Writing intake rows to {args.db_path}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Saybrook request API.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
