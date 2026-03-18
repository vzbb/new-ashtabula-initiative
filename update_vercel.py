import json

with open('allsites.txt', 'r') as f:
    sites = [line.strip() for line in f if line.strip()]

# Add custom mappings for short names
short_mappings = {
    "civic-insight": "civic-insight-engine",
    "contractors": "contractor-match",
    "eligibility": "eligibility-screener",
    "harbor": "harbor-cam-dashboard",
    "invest": "invest-ashtabula",
    "grocer": "local-grocer-go",
    "permits": "permit-whisperer",
    "parts": "parts-finder",
    "plating": "plating-tracker",
    "site-ops": "site-ops-pro",
    "adaptive-reuse": "adaptive-reuse-planner",
    "blueprint": "blueprint-analyzer",
    "boxflow": "boxflow-estimator",
    "cashflow": "cashflow-tracker",
    "landlord": "landlord-repair-queue",
    "lawn": "lawn-quote-tool",
    "hvac": "hvac-tuneup",
    "snow-plow": "snow-plow-tracker",
    "dirt-quote": "instant-dirt-quote",
    "rental": "rental-availability",
    "engineers": "engineers-assistant",
    "curbside": "curbside-pickup-tracker",
    "farm-stand": "farm-stand-finder",
    "notary": "mobile-notary",
    "auto-detail": "auto-detail-booking",
    "truck-wash": "truck-wash-booking",
    "concierge": "virtual-concierge",
    "parking": "visitor-parking-finder",
    "routes": "route-optimizer",
    "charter": "charter-booking",
    "marina": "marina-slip-waitlist",
    "compassionate": "compassionate-planner",
    "aidflow": "aidflow-navigator",
    "boat-storage": "boat-storage-waitlist",
    "harvest": "harvest-alert",
    "artist-commission": "artist-commission-form",
    "gotl": "gotl-weekend-planner",
    "pet-match": "pet-matchmaker",
    "portfolio": "visual-portfolio",
    "volunteer": "volunteer-scheduler",
    "wedding": "wedding-lead-form",
    "license": "license-wizard",
    "event-permit": "event-permit-express",
    "zoning": "zoning-clerk",
    "govtech": "govtech-box",
    "historian-pro": "pocket-historian-pro",
    "historian": "pocket-historian",
    "sommelier-pro": "pocket-sommelier-pro",
    "sommelier": "pocket-sommelier",
    "resource-pro": "resource-compass-pro",
    "resource": "resource-compass",
    "scheduler-sms": "service-scheduler-sms",
    "scheduler": "service-scheduler",
    "plating-pro": "plating-tracker-pro",
    "parts-request": "parts-finder-request",
    "mytrip-export": "mytrip-planner-export",
    "mytrip": "mytrip-planner",
}

routes = []
# Ensure full names are mapped
for site in sites:
    routes.append({"src": f"/{site}/?(.*)", "dest": f"/websites/{site}/dist/$1"})

# Add short name mappings
for short, full in short_mappings.items():
    if short != full:
        routes.append({"src": f"/{short}/?(.*)", "dest": f"/websites/{full}/dist/$1"})

# Special case for grocer client dist
for route in routes:
    if "local-grocer-go" in route["dest"]:
        route["dest"] = route["dest"].replace("dist", "client/dist")

# SORT ROUTES BY LENGTH (Longest first to avoid prefix matching issues)
routes.sort(key=lambda x: len(x["src"]), reverse=True)

# Add landing page and catch-all
routes.append({"src": "/all-mvps/?(.*)", "dest": "/landing-page/all-mvps.html"})
routes.append({"src": "/(.*)", "dest": "/landing-page/index.html"})

vercel_config = {
    "version": 2,
    "name": "new-ashtabula-initiative",
    "routes": routes
}

with open('vercel.json', 'w') as f:
    json.dump(vercel_config, f, indent=2)

print("vercel.json updated successfully with sorted routes.")
