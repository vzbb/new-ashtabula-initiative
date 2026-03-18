#!/usr/bin/env python3
"""
Permit-Whisperer Outreach Automation
Prepares and tracks outreach emails for NAI permit-whisperer launch.
"""

import json
import csv
from pathlib import Path
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from typing import List, Optional

# Configuration
OUTREACH_DIR = Path(__file__).parent / "outreach-tracking"
OUTREACH_DIR.mkdir(exist_ok=True)

CONTACTS_FILE = OUTREACH_DIR / "contacts.json"
STATUS_FILE = OUTREACH_DIR / "outreach_status.json"
EMAILS_DIR = OUTREACH_DIR / "prepared-emails"
EMAILS_DIR.mkdir(exist_ok=True)


@dataclass
class Contact:
    organization: str
    role: str
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    priority: str  # P0, P1, P2
    status: str = "not-contacted"  # not-contacted, emailed, called, meeting-scheduled, responded, declined
    last_contact: Optional[str] = None
    notes: str = ""


@dataclass
class OutreachStatus:
    contact: Contact
    email_sent: bool = False
    email_date: Optional[str] = None
    follow_up_1: bool = False
    follow_up_1_date: Optional[str] = None
    follow_up_2: bool = False
    follow_up_2_date: Optional[str] = None
    response_received: bool = False
    response_date: Optional[str] = None
    meeting_scheduled: bool = False
    meeting_date: Optional[str] = None


# Email templates
EMAIL_TEMPLATES = {
    "city-building": """Subject: Partnership Opportunity — Free Permit Guidance Tool for Ashtabula Residents

Dear Building Department Team,

I'm reaching out from Noirsys AI, a local technology company, to introduce permit-whisperer — a free digital assistant we're building to help Ashtabula residents and contractors navigate the permit process more easily.

What it does:
• Answers common permit questions 24/7
• Guides users through required steps
• Reduces incomplete applications
• Frees up staff time for complex issues

Why Ashtabula:
We're building this specifically for our community. The tool will be trained on Ashtabula's actual permit requirements, fees, and processes — not generic templates.

What we need:
We'd love 30 minutes of your time to:
1. Validate that we're solving real problems
2. Understand your most common questions
3. Ensure accuracy before launch

No cost, no obligation — we're building this as a community service and plan to offer it free to the City and residents.

Would you be open to a brief conversation this week or next?

Best regards,

Michael A. Vega
Founder, Noirsys AI
michael@noirsys.com | (440) 555-0142
""",
    
    "chamber": """Subject: New Tool to Help Local Contractors & DIYers — Partnership Opportunity

Dear {name},

I'm writing to introduce a new community resource that could benefit Chamber members and the broader business community.

permit-whisperer is an AI-powered permit assistant we're developing at Noirsys AI specifically for Ashtabula. It helps:

• Contractors quickly check permit requirements before bidding
• DIY homeowners understand what permits they need
• New businesses navigate occupancy and signage permits
• Property investors track permit status across multiple projects

Why partner with us:
• Free resource for your members
• Reduces project delays and compliance issues
• Positions Chamber as innovation-forward
• No technical setup required

What we're asking:
• 20-minute conversation about member pain points
• Introduction to contractors who might beta test
• Possible mention in newsletter when we launch

We're local, building this for our community, and not asking for funding — just feedback and connections.

Would you have time for a brief call?

Best,

Michael A. Vega
Founder, Noirsys AI
michael@noirsys.com | (440) 555-0142

P.S. — Happy to demo the prototype if helpful.
""",
    
    "sbdc": """Subject: Partnership Proposal — Permit Guidance Tool for Small Business Owners

Dear {name},

I hope this finds you well. I'm reaching out from Noirsys AI regarding a potential partnership opportunity that aligns with SBDC's mission of supporting small business success.

The Challenge:
Many small business owners and entrepreneurs struggle with permits — not knowing what's required, missing steps, or facing delays that cost money. This is especially true for:
• First-time business owners
• Home-based business conversions
• Restaurant/food service startups
• Contractors and tradespeople

Our Solution — permit-whisperer:
A free, AI-powered permit assistant specifically for Ashtabula that:
• Provides instant answers to permit questions
• Guides users through step-by-step processes
• Tracks requirements across business types
• Reduces back-and-forth with City offices

Partnership Opportunity:
We'd like to explore:
1. Co-marketing: SBDC endorsement as a resource for clients
2. Feedback loop: Input from SBDC advisors on common client questions
3. Referral pathway: Direct integration with SBDC intake process

What's in it for SBDC:
• Enhanced service offering at no cost
• Reduced client confusion about permits
• Data on common permit pain points
• Local innovation story for PR

Next Steps:
Would you be open to a 30-minute conversation to explore this further? I'm flexible on timing and happy to meet at your office or via video call.

Thank you for considering this partnership. I believe permit-whisperer can meaningfully reduce friction for entrepreneurs in our community.

Best regards,

Michael A. Vega
Founder, Noirsys AI
michael@noirsys.com | (440) 555-0142
"""
}


class OutreachTracker:
    """Track permit-whisperer outreach efforts."""
    
    def __init__(self):
        self.contacts: List[Contact] = []
        self.statuses: List[OutreachStatus] = []
        self._load_data()
    
    def _load_data(self):
        """Load existing contact and status data."""
        if CONTACTS_FILE.exists():
            with open(CONTACTS_FILE) as f:
                data = json.load(f)
                self.contacts = [Contact(**c) for c in data]
        else:
            self._init_default_contacts()
        
        if STATUS_FILE.exists():
            with open(STATUS_FILE) as f:
                data = json.load(f)
                self.statuses = [OutreachStatus(**s) for s in data]
    
    def _init_default_contacts(self):
        """Initialize with default Ashtabula contacts."""
        self.contacts = [
            Contact(
                organization="City of Ashtabula Building Department",
                role="Building Official / Permit Clerk",
                name=None,
                email="building@cityofashtabula.com",
                phone="440-992-7115",
                priority="P0"
            ),
            Contact(
                organization="Ashtabula Area Chamber of Commerce",
                role="Executive Director",
                name=None,
                email="info@ashtabulachamber.com",
                phone="440-998-4741",
                priority="P0"
            ),
            Contact(
                organization="SBDC at Lakeland Community College",
                role="Regional Director",
                name=None,
                email="sbdc@lakelandcc.edu",
                phone="440-525-7450",
                priority="P0"
            ),
            Contact(
                organization="Ashtabula County Commissioners",
                role="Economic Development Liaison",
                name=None,
                email=None,
                phone=None,
                priority="P1"
            )
        ]
        self._save_contacts()
    
    def _save_contacts(self):
        """Save contacts to file."""
        with open(CONTACTS_FILE, 'w') as f:
            json.dump([asdict(c) for c in self.contacts], f, indent=2)
    
    def _save_statuses(self):
        """Save statuses to file."""
        with open(STATUS_FILE, 'w') as f:
            json.dump([asdict(s) for s in self.statuses], f, indent=2, default=str)
    
    def prepare_emails(self):
        """Prepare email files for all contacts."""
        email_map = {
            "City of Ashtabula Building Department": "city-building",
            "Ashtabula Area Chamber of Commerce": "chamber",
            "SBDC at Lakeland Community College": "sbdc"
        }
        
        prepared = []
        for contact in self.contacts:
            if contact.email:
                template_key = email_map.get(contact.organization)
                if template_key:
                    template = EMAIL_TEMPLATES[template_key]
                    email_content = template.format(name=contact.name or "Director")
                    
                    # Save to file
                    filename = f"{contact.organization.replace(' ', '_').replace('/', '_')}.txt"
                    filepath = EMAILS_DIR / filename
                    with open(filepath, 'w') as f:
                        f.write(f"To: {contact.email}\n")
                        f.write(f"From: michael@noirsys.com\n")
                        f.write("=" * 60 + "\n\n")
                        f.write(email_content)
                    
                    prepared.append((contact.organization, filepath))
        
        return prepared
    
    def get_follow_up_queue(self) -> List[Contact]:
        """Get list of contacts needing follow-up."""
        queue = []
        today = datetime.now()
        
        for status in self.statuses:
            if not status.email_sent:
                queue.append(status.contact)
                continue
            
            # Check if follow-up needed
            if status.email_date:
                email_date = datetime.fromisoformat(status.email_date)
                days_since = (today - email_date).days
                
                if days_since >= 3 and not status.follow_up_1:
                    queue.append(status.contact)
                elif days_since >= 7 and not status.follow_up_2:
                    queue.append(status.contact)
        
        return queue
    
    def print_status_report(self):
        """Print current outreach status."""
        print("\n" + "=" * 60)
        print("PERMIT-WHISPERER OUTREACH STATUS")
        print("=" * 60)
        
        for contact in self.contacts:
            status_emoji = {
                "not-contacted": "⚪",
                "emailed": "📧",
                "called": "📞",
                "meeting-scheduled": "📅",
                "responded": "✅",
                "declined": "❌"
            }.get(contact.status, "⚪")
            
            print(f"\n{status_emoji} {contact.organization}")
            print(f"   Contact: {contact.name or 'Unknown'} ({contact.role})")
            print(f"   Email: {contact.email or 'N/A'}")
            print(f"   Phone: {contact.phone or 'N/A'}")
            print(f"   Status: {contact.status}")
            if contact.last_contact:
                print(f"   Last contact: {contact.last_contact}")
        
        print("\n" + "=" * 60)
        print(f"Total contacts: {len(self.contacts)}")
        responded = sum(1 for c in self.contacts if c.status == "responded")
        print(f"Responses received: {responded}")
        print("=" * 60 + "\n")
    
    def export_to_csv(self, filepath: str = "outreach-tracking/outreach.csv"):
        """Export contacts to CSV for spreadsheet tracking."""
        with open(filepath, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Organization', 'Role', 'Name', 'Email', 'Phone', 
                           'Priority', 'Status', 'Last Contact', 'Notes'])
            for contact in self.contacts:
                writer.writerow([
                    contact.organization,
                    contact.role,
                    contact.name or '',
                    contact.email or '',
                    contact.phone or '',
                    contact.priority,
                    contact.status,
                    contact.last_contact or '',
                    contact.notes
                ])
        print(f"Exported to {filepath}")


def main():
    """Main execution."""
    tracker = OutreachTracker()
    
    print("\n🚀 Permit-Whisperer Outreach Automation")
    print("=" * 60)
    
    # Prepare emails
    print("\n📧 Preparing email templates...")
    prepared = tracker.prepare_emails()
    for org, path in prepared:
        print(f"   ✓ {org}: {path}")
    
    # Print status
    tracker.print_status_report()
    
    # Export to CSV
    tracker.export_to_csv()
    
    print("\n📋 Next Steps:")
    print("   1. Review prepared emails in outreach-tracking/prepared-emails/")
    print("   2. Send emails to P0 contacts")
    print("   3. Update status in outreach-tracking/contacts.json")
    print("   4. Run this script weekly for follow-up reminders")
    print("\n")


if __name__ == "__main__":
    main()
