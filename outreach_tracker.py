#!/usr/bin/env python3
"""
Permit-Whisperer Outreach Tracker CLI
Tracks outreach campaign progress, follow-ups, and responses
"""

import sqlite3
import json
from datetime import datetime, timedelta
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Optional
import argparse

DB_PATH = Path("data/outreach.db")

@dataclass
class Contact:
    id: int
    organization: str
    role: str
    email: str
    phone: Optional[str]
    priority: str  # P0, P1, P2
    status: str  # not_contacted, emailed, called, meeting_scheduled, responded, declined
    last_contact_date: Optional[str]
    next_followup_date: Optional[str]
    notes: str
    response_sentiment: Optional[str]  # positive, neutral, negative

class OutreachTracker:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self.db_path.parent.mkdir(exist_ok=True)
        self._init_db()
    
    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        c.execute('''CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY,
            organization TEXT NOT NULL,
            role TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            priority TEXT DEFAULT 'P1',
            status TEXT DEFAULT 'not_contacted',
            last_contact_date TEXT,
            next_followup_date TEXT,
            notes TEXT DEFAULT '',
            response_sentiment TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )''')
        
        c.execute('''CREATE TABLE IF NOT EXISTS touchpoints (
            id INTEGER PRIMARY KEY,
            contact_id INTEGER,
            type TEXT,  -- email, call, meeting, followup
            date TEXT,
            notes TEXT,
            outcome TEXT,
            FOREIGN KEY (contact_id) REFERENCES contacts(id)
        )''')
        
        conn.commit()
        conn.close()
    
    def seed_contacts(self):
        """Seed with initial Ashtabula outreach targets"""
        contacts = [
            ("City of Ashtabula Building Dept", "Building Official", "building@cityofashtabula.com", None, "P0"),
            ("Ashtabula Area Chamber of Commerce", "Executive Director", "director@ashtabulachamber.com", None, "P0"),
            ("SBDC at Lakeland Community College", "Regional Director", "sbdc@lakelandcc.edu", None, "P0"),
            ("Ashtabula County Commissioners", "Economic Development Liaison", "econdev@ashtabulacounty.gov", None, "P1"),
        ]
        
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        for org, role, email, phone, priority in contacts:
            c.execute('''INSERT OR IGNORE INTO contacts 
                (organization, role, email, phone, priority, status)
                VALUES (?, ?, ?, ?, ?, 'not_contacted')''',
                (org, role, email, phone, priority))
        
        conn.commit()
        conn.close()
        print(f"✅ Seeded {len(contacts)} contacts")
    
    def log_contact(self, contact_id: int, contact_type: str, notes: str, outcome: str = ""):
        """Log a touchpoint with a contact"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Add touchpoint
        c.execute('''INSERT INTO touchpoints (contact_id, type, date, notes, outcome)
                     VALUES (?, ?, ?, ?, ?)''',
                  (contact_id, contact_type, today, notes, outcome))
        
        # Update contact status and dates
        if contact_type == "email":
            status = "emailed"
        elif contact_type == "call":
            status = "called"
        elif contact_type == "meeting":
            status = "meeting_scheduled"
        elif "response" in outcome.lower():
            status = "responded"
        else:
            status = "contacted"
        
        # Calculate next follow-up (3 business days for P0, 5 for P1)
        c.execute('SELECT priority FROM contacts WHERE id = ?', (contact_id,))
        priority = c.fetchone()[0]
        followup_days = 3 if priority == "P0" else 5
        next_followup = (datetime.now() + timedelta(days=followup_days)).strftime("%Y-%m-%d")
        
        c.execute('''UPDATE contacts 
                     SET status = ?, last_contact_date = ?, next_followup_date = ?
                     WHERE id = ?''',
                  (status, today, next_followup, contact_id))
        
        conn.commit()
        conn.close()
        print(f"✅ Logged {contact_type} with contact {contact_id}")
    
    def list_contacts(self, priority: Optional[str] = None, status: Optional[str] = None):
        """List all contacts with optional filtering"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        query = "SELECT * FROM contacts WHERE 1=1"
        params = []
        
        if priority:
            query += " AND priority = ?"
            params.append(priority)
        if status:
            query += " AND status = ?"
            params.append(status)
        
        query += " ORDER BY priority, organization"
        
        c.execute(query, params)
        rows = c.fetchall()
        conn.close()
        
        return [self._row_to_contact(row) for row in rows]
    
    def get_followups_due(self) -> List[Contact]:
        """Get contacts needing follow-up today or earlier"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        today = datetime.now().strftime("%Y-%m-%d")
        
        c.execute('''SELECT * FROM contacts 
                     WHERE next_followup_date <= ? 
                     AND status NOT IN ('responded', 'declined', 'partnership_agreed')
                     ORDER BY priority, next_followup_date''', (today,))
        
        rows = c.fetchall()
        conn.close()
        
        return [self._row_to_contact(row) for row in rows]
    
    def get_pipeline_stats(self) -> dict:
        """Get outreach campaign statistics"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        stats = {}
        
        # By status
        c.execute('SELECT status, COUNT(*) FROM contacts GROUP BY status')
        stats['by_status'] = dict(c.fetchall())
        
        # By priority
        c.execute('SELECT priority, COUNT(*) FROM contacts GROUP BY priority')
        stats['by_priority'] = dict(c.fetchall())
        
        # Total touchpoints
        c.execute('SELECT COUNT(*) FROM touchpoints')
        stats['total_touchpoints'] = c.fetchone()[0]
        
        # Follow-ups due
        today = datetime.now().strftime("%Y-%m-%d")
        c.execute('''SELECT COUNT(*) FROM contacts 
                     WHERE next_followup_date <= ? 
                     AND status NOT IN ('responded', 'declined')''', (today,))
        stats['followups_due'] = c.fetchone()[0]
        
        # Response rate
        c.execute("SELECT COUNT(*) FROM contacts WHERE status = 'responded'")
        responded = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM contacts WHERE status != 'not_contacted'")
        contacted = c.fetchone()[0]
        stats['response_rate'] = f"{(responded / contacted * 100):.1f}%" if contacted > 0 else "N/A"
        
        conn.close()
        return stats
    
    def _row_to_contact(self, row) -> Contact:
        return Contact(
            id=row[0],
            organization=row[1],
            role=row[2],
            email=row[3],
            phone=row[4],
            priority=row[5],
            status=row[6],
            last_contact_date=row[7],
            next_followup_date=row[8],
            notes=row[9],
            response_sentiment=row[10]
        )
    
    def export_json(self, output_path: str):
        """Export all data to JSON"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        c.execute('SELECT * FROM contacts')
        contacts = [self._row_to_contact(row).__dict__ for row in c.fetchall()]
        
        c.execute('SELECT * FROM touchpoints')
        touchpoints = [
            dict(zip(['id', 'contact_id', 'type', 'date', 'notes', 'outcome'], row))
            for row in c.fetchall()
        ]
        
        conn.close()
        
        data = {
            'exported_at': datetime.now().isoformat(),
            'contacts': contacts,
            'touchpoints': touchpoints,
            'stats': self.get_pipeline_stats()
        }
        
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ Exported to {output_path}")


def print_contacts_table(contacts: List[Contact]):
    """Pretty print contacts table"""
    if not contacts:
        print("No contacts found.")
        return
    
    print(f"\n{'ID':<4} {'Org':<35} {'Role':<25} {'Priority':<8} {'Status':<18} {'Next Follow-up':<12}")
    print("-" * 110)
    
    for c in contacts:
        followup = c.next_followup_date or "—"
        org = c.organization[:33] + ".." if len(c.organization) > 35 else c.organization
        role = c.role[:23] + ".." if len(c.role) > 25 else c.role
        print(f"{c.id:<4} {org:<35} {role:<25} {c.priority:<8} {c.status:<18} {followup:<12}")
    
    print()


def print_stats(stats: dict):
    """Pretty print statistics"""
    print("\n📊 OUTREACH PIPELINE STATISTICS")
    print("=" * 40)
    
    print("\nBy Status:")
    for status, count in stats.get('by_status', {}).items():
        print(f"  {status:<20}: {count}")
    
    print("\nBy Priority:")
    for priority, count in stats.get('by_priority', {}).items():
        print(f"  {priority}: {count}")
    
    print(f"\nTotal Touchpoints: {stats.get('total_touchpoints', 0)}")
    print(f"Follow-ups Due: {stats.get('followups_due', 0)}")
    print(f"Response Rate: {stats.get('response_rate', 'N/A')}")
    print()


def main():
    parser = argparse.ArgumentParser(description="Permit-Whisperer Outreach Tracker")
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Seed command
    subparsers.add_parser('seed', help='Seed database with initial contacts')
    
    # List command
    list_parser = subparsers.add_parser('list', help='List contacts')
    list_parser.add_argument('--priority', choices=['P0', 'P1', 'P2'], help='Filter by priority')
    list_parser.add_argument('--status', help='Filter by status')
    
    # Log command
    log_parser = subparsers.add_parser('log', help='Log a touchpoint')
    log_parser.add_argument('contact_id', type=int, help='Contact ID')
    log_parser.add_argument('type', choices=['email', 'call', 'meeting', 'followup'], help='Type of contact')
    log_parser.add_argument('notes', help='Notes about the interaction')
    log_parser.add_argument('--outcome', default='', help='Outcome/response')
    
    # Follow-ups command
    subparsers.add_parser('followups', help='Show contacts needing follow-up')
    
    # Stats command
    subparsers.add_parser('stats', help='Show pipeline statistics')
    
    # Export command
    export_parser = subparsers.add_parser('export', help='Export data to JSON')
    export_parser.add_argument('output', help='Output file path')
    
    args = parser.parse_args()
    
    tracker = OutreachTracker()
    
    if args.command == 'seed':
        tracker.seed_contacts()
    
    elif args.command == 'list':
        contacts = tracker.list_contacts(priority=args.priority, status=args.status)
        print_contacts_table(contacts)
    
    elif args.command == 'log':
        tracker.log_contact(args.contact_id, args.type, args.notes, args.outcome)
    
    elif args.command == 'followups':
        contacts = tracker.get_followups_due()
        if contacts:
            print(f"\n🔔 {len(contacts)} contact(s) need follow-up:")
            print_contacts_table(contacts)
        else:
            print("\n✅ No follow-ups due!")
    
    elif args.command == 'stats':
        stats = tracker.get_pipeline_stats()
        print_stats(stats)
    
    elif args.command == 'export':
        tracker.export_json(args.output)
    
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
