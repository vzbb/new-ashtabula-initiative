#!/bin/bash
# ============================================================================
# invest-ashtabula MVP Scaffold Script
# New Ashtabula Initiative — Investment Portal Quick Start
# ============================================================================
# Usage: curl -s https://.../scaffold-invest-mvp.sh | bash
#        ./scaffold-invest-mvp.sh [target-directory]
# ============================================================================

set -e

TARGET_DIR="${1:-na-invest-ashtabula}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🏗️  Invest Ashtabula MVP Scaffold"
echo "=================================="
echo "Target: $TARGET_DIR"
echo ""

# Create directory
if [ -d "$TARGET_DIR" ]; then
    echo "⚠️  Directory $TARGET_DIR exists. Remove first or choose new name."
    exit 1
fi

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"
echo "✅ Created directory: $(pwd)"

# Initialize Vite + React
echo ""
echo "📦 Initializing Vite + React..."
npm create vite@latest . -- --template react --force 2>/dev/null || {
    echo "⚠️  Vite create failed, trying alternative..."
    npm create vite@latest . -- --template react
}

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install tailwindcss @tailwindcss/vite react-router-dom lucide-react resend

# Create directory structure
echo ""
echo "📁 Creating project structure..."
mkdir -p src/components src/pages src/data src/utils public/images

# Configure Tailwind v4
echo ""
echo "🎨 Configuring Tailwind CSS v4..."
cat > src/index.css << 'EOF'
@import "tailwindcss";

:root {
  --color-primary: #1e40af;
  --color-secondary: #059669;
  --color-accent: #d97706;
  --color-bg: #f8fafc;
  --color-text: #1e293b;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
}
EOF

# Create brand colors config
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ashtabula: {
          primary: '#1e40af',
          secondary: '#059669',
          accent: '#d97706',
          bg: '#f8fafc',
          text: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
EOF

# Create sample site data
echo ""
echo "📝 Creating sample site data..."
cat > src/data/sites.json << 'EOF'
[
  {
    "id": "harbor-industrial-park",
    "name": "Harbor Industrial Park",
    "acres": 50,
    "type": "Heavy Industrial",
    "status": "Shovel-Ready",
    "features": ["Rail Access", "Port-Adjacent", "Utilities Ready"],
    "highlights": ["CSX Rail Spur", "50k SF Available", "Tax Incentives"],
    "description": "Prime industrial site with direct CSX rail spur and proximity to Port of Ashtabula. Ideal for manufacturing, distribution, or logistics operations seeking multimodal transportation access.",
    "location": {
      "lat": 41.865,
      "lng": -80.789,
      "address": "Harbor Street, Ashtabula, OH 44004"
    },
    "photos": ["/images/site1-1.jpg", "/images/site1-2.jpg"],
    "contact": {
      "name": "Ashtabula Area Development Corporation",
      "email": "invest@ashtabula.org",
      "phone": "(440) 998-6848"
    }
  },
  {
    "id": "route-20-commerce-center",
    "name": "Route 20 Commerce Center",
    "acres": 45,
    "type": "Light Industrial/Commercial",
    "status": "Available",
    "features": ["Highway Frontage", "High Visibility", "Flexible Zoning"],
    "highlights": ["I-90 Access", "30k Cars/Day", "Enterprise Zone"],
    "description": "High-visibility commercial site on US Route 20 with excellent highway access. Perfect for retail, hospitality, or light industrial use requiring maximum exposure and accessibility.",
    "location": {
      "lat": 41.855,
      "lng": -80.799,
      "address": "US-20, Ashtabula, OH 44004"
    },
    "photos": ["/images/site2-1.jpg", "/images/site2-2.jpg"],
    "contact": {
      "name": "Ashtabula Area Development Corporation",
      "email": "invest@ashtabula.org",
      "phone": "(440) 998-6848"
    }
  },
  {
    "id": "prospect-road-flex-campus",
    "name": "Prospect Road Flex Campus",
    "acres": 60,
    "type": "Mixed-Use",
    "status": "Planned",
    "features": ["Scalable Design", "Greenfield Site", "City Services"],
    "highlights": ["Phased Development", "TIF Eligible", "Workforce Proximity"],
    "description": "Large-scale mixed-use development opportunity with scalable design options. Suitable for corporate campus, industrial park, or mixed commercial/residential development.",
    "location": {
      "lat": 41.875,
      "lng": -80.779,
      "address": "Prospect Road, Ashtabula, OH 44004"
    },
    "photos": ["/images/site3-1.jpg", "/images/site3-2.jpg"],
    "contact": {
      "name": "Ashtabula Area Development Corporation",
      "email": "invest@ashtabula.org",
      "phone": "(440) 998-6848"
    }
  }
]
EOF

# Create Layout component
cat > src/components/Layout.jsx << 'EOF'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { useState } from 'react'

export function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/sites', label: 'Sites' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-ashtabula-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="font-bold text-xl">
              Invest Ashtabula
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`hover:text-ashtabula-accent transition ${
                    location.pathname === item.path ? 'text-ashtabula-accent' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-2 hover:bg-blue-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-ashtabula-text text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Invest Ashtabula</h3>
              <p className="text-gray-400 text-sm">
                Your gateway to industrial and commercial investment opportunities 
                in Ashtabula, Ohio — The Gateway to Lake Erie.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/sites" className="text-gray-400 hover:text-white">Available Sites</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact AADC</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  (440) 998-6848
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  invest@ashtabula.org
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2026 Ashtabula Area Development Corporation. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
EOF

# Create Hero component
cat > src/components/Hero.jsx << 'EOF'
import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <div className="relative bg-ashtabula-primary text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Invest in Ashtabula's Future
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Prime industrial and commercial sites with rail, port, and highway access 
            in Ohio's most connected lakeshore community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/sites"
              className="inline-flex items-center justify-center gap-2 bg-ashtabula-secondary hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition"
            >
              View Available Sites
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg transition"
            >
              Contact AADC
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold">3</div>
              <div className="text-blue-200 text-sm">Available Sites</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">150+</div>
              <div className="text-blue-200 text-sm">Total Acres</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">3</div>
              <div className="text-blue-200 text-sm">Transport Modes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

# Create SiteCard component
cat > src/components/SiteCard.jsx << 'EOF'
import { Link } from 'react-router-dom'
import { MapPin, Maximize, ArrowRight } from 'lucide-react'

export function SiteCard({ site }) {
  return (
    <Link 
      to={`/site/${site.id}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Maximize size={48} className="mx-auto mb-2 opacity-50" />
          <span className="text-sm">Site Photo</span>
        </div>
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
          site.status === 'Shovel-Ready' 
            ? 'bg-ashtabula-secondary text-white' 
            : 'bg-ashtabula-accent text-white'
        }`}>
          {site.status}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-ashtabula-text mb-2 group-hover:text-ashtabula-primary transition">
          {site.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex items-center gap-1">
          <MapPin size={16} />
          {site.location.address}
        </p>
        
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {site.acres} Acres
          </span>
          <span className="text-gray-600">{site.type}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {site.features.slice(0, 3).map((feature, i) => (
            <span 
              key={i}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>

        <span className="inline-flex items-center gap-1 text-ashtabula-primary font-semibold text-sm group-hover:gap-2 transition-all">
          View Details
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  )
}
EOF

# Create SiteGrid component
cat > src/components/SiteGrid.jsx << 'EOF'
import sites from '../data/sites.json'
import { SiteCard } from './SiteCard'

export function SiteGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-ashtabula-text mb-4">
          Available Investment Sites
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover prime development opportunities in Ashtabula, from shovel-ready 
          industrial parks to flexible commercial campuses.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sites.map(site => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  )
}
EOF

# Create Benefits section
cat > src/components/Benefits.jsx << 'EOF'
import { Train, Ship, Highway, BadgeDollarSign, Users, Building2 } from 'lucide-react'

const benefits = [
  {
    icon: Train,
    title: 'Rail Access',
    description: 'Direct CSX connections for freight mobility and supply chain efficiency.'
  },
  {
    icon: Ship,
    title: 'Port of Ashtabula',
    description: 'Great Lakes shipping access for international trade and bulk cargo.'
  },
  {
    icon: Highway,
    title: 'Highway Network',
    description: 'I-90 and US Route 20 provide east-west connectivity across the region.'
  },
  {
    icon: BadgeDollarSign,
    title: 'Tax Incentives',
    description: 'Enterprise Zone, TIF districts, and state job creation credits available.'
  },
  {
    icon: Users,
    title: 'Skilled Workforce',
    description: 'Access to 200k+ workers within 30-mile radius and training programs.'
  },
  {
    icon: Building2,
    title: 'Municipal Support',
    description: 'Streamlined permitting and dedicated AADC support for investors.'
  }
]

export function Benefits() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ashtabula-text mb-4">
            Why Invest in Ashtabula?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Strategic location, robust infrastructure, and pro-business environment 
            make Ashtabula ideal for your next development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-ashtabula-primary/10 rounded-lg flex items-center justify-center mb-4">
                <benefit.icon className="text-ashtabula-primary" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
EOF

# Create Home page
cat > src/pages/Home.jsx << 'EOF'
import { Layout } from '../components/Layout'
import { Hero } from '../components/Hero'
import { SiteGrid } from '../components/SiteGrid'
import { Benefits } from '../components/Benefits'

export function Home() {
  return (
    <Layout>
      <Hero />
      <SiteGrid />
      <Benefits />
    </Layout>
  )
}
EOF

# Create Sites listing page
cat > src/pages/Sites.jsx << 'EOF'
import { Layout } from '../components/Layout'
import { SiteCard } from '../components/SiteCard'
import sites from '../data/sites.json'

export function Sites() {
  return (
    <Layout>
      <div className="bg-ashtabula-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Available Sites</h1>
          <p className="text-blue-100 max-w-2xl">
            Browse our portfolio of investment-ready properties. Each site offers 
            unique advantages for industrial, commercial, or mixed-use development.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sites.map(site => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
EOF

# Create SiteDetail page
cat > src/pages/SiteDetail.jsx << 'EOF'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ArrowLeft, MapPin, Maximize, Check } from 'lucide-react'
import sites from '../data/sites.json'

export function SiteDetail() {
  const { siteId } = useParams()
  const site = sites.find(s => s.id === siteId)

  if (!site) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Site Not Found</h1>
          <Link to="/sites" className="text-ashtabula-primary hover:underline">
            ← Back to all sites
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to="/sites" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-ashtabula-primary mb-6"
        >
          <ArrowLeft size={20} />
          Back to all sites
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div>
            <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <Maximize size={64} className="mx-auto mb-4 opacity-50" />
                <span>Main Site Photo</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Photo 2</span>
              </div>
              <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Photo 3</span>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                site.status === 'Shovel-Ready' 
                  ? 'bg-ashtabula-secondary text-white' 
                  : 'bg-ashtabula-accent text-white'
              }`}>
                {site.status}
              </span>
              <span className="text-gray-600">{site.type}</span>
            </div>

            <h1 className="text-4xl font-bold text-ashtabula-text mb-4">
              {site.name}
            </h1>

            <p className="text-gray-600 flex items-center gap-2 mb-6">
              <MapPin size={18} />
              {site.location.address}
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">Site Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">Total Acreage</span>
                  <p className="text-2xl font-bold text-ashtabula-primary">{site.acres} acres</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Zoning</span>
                  <p className="font-semibold">{site.type}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Status</span>
                  <p className="font-semibold">{site.status}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Contact</span>
                  <p className="font-semibold">{site.contact.name}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {site.description}
            </p>

            <h3 className="font-bold text-lg mb-3">Key Features</h3>
            <ul className="space-y-2 mb-6">
              {site.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <Check size={18} className="text-ashtabula-secondary" />
                  {feature}
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-lg mb-3">Highlights</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {site.highlights.map((highlight, i) => (
                <span 
                  key={i}
                  className="bg-ashtabula-primary/10 text-ashtabula-primary px-3 py-1 rounded-full text-sm font-medium"
                >
                  {highlight}
                </span>
              ))}
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-ashtabula-secondary hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition w-full sm:w-auto"
            >
              Request Information
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
EOF

# Create Contact page with form
cat > src/pages/Contact.jsx << 'EOF'
import { useState } from 'react'
import { Layout } from '../components/Layout'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    // TODO: Integrate with Resend API
    // For MVP, just simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitting(false)
    setSuccess(true)
    setFormData({ name: '', company: '', email: '', phone: '', interest: '', message: '' })
  }

  return (
    <Layout>
      <div className="bg-ashtabula-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Contact AADC</h1>
          <p className="text-blue-100 max-w-2xl">
            Ready to explore investment opportunities? Our team is here to answer 
            your questions and facilitate site visits.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send an Inquiry</h2>
            
            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-green-800 mb-2">Thank you!</h3>
                <p className="text-green-700">
                  Your inquiry has been received. An AADC representative will 
                  contact you within 24 hours.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-green-700 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ashtabula-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ashtabula-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ashtabula-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ashtabula-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={e => setFormData({...formData, interest: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ashtabula-primary focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="harbor-industrial-park">Harbor Industrial Park</option>
                    <option value="route-20-commerce">Route 20 Commerce Center</option>
                    <option value="prospect-road">Prospect Road Flex Campus</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ashtabula-primary focus:border-transparent"
                    placeholder="Tell us about your project or questions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 bg-ashtabula-secondary hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg transition w-full sm:w-auto"
                >
                  {submitting ? 'Sending...' : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Ashtabula Area Development Corporation</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-ashtabula-primary mt-1" size={20} />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">Ashtabula, Ohio 44004</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="text-ashtabula-primary mt-1" size={20} />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">(440) 998-6848</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="text-ashtabula-primary mt-1" size={20} />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">invest@ashtabula.org</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2 text-blue-900">What happens next?</h3>
              <ol className="space-y-2 text-blue-800 text-sm">
                <li>1. We review your inquiry within 24 hours</li>
                <li>2. An AADC representative contacts you</li>
                <li>3. We schedule a site visit if desired</li>
                <li>4. We provide detailed site information and incentives</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
EOF

# Create main App.jsx
cat > src/App.jsx << 'EOF'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Sites } from './pages/Sites'
import { SiteDetail } from './pages/SiteDetail'
import { Contact } from './pages/Contact'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/site/:siteId" element={<SiteDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

export default App
EOF

# Update vite.config.js for Tailwind
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
EOF

# Create environment template
cat > .env.example << 'EOF'
# Resend API Key for contact form emails
# Get yours at https://resend.com
VITE_RESEND_API_KEY=your_resend_api_key_here

# Optional: Analytics
VITE_GA_ID=your_google_analytics_id
EOF

# Create README
cat > README.md << 'EOF'
# Invest Ashtabula — MVP

Investment portal for the New Ashtabula Initiative. Static React site showcasing 
industrial and commercial development sites.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and add your Resend API key:

```bash
cp .env.example .env
# Edit .env with your API keys
```

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# Drag dist/ folder to Netlify deploy
```

## Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Route pages
├── data/           # Static JSON data
├── utils/          # Helper functions
└── App.jsx         # Main app component
```

## Next Steps

- [ ] Add real site photography
- [ ] Integrate Resend for live contact form
- [ ] Add interactive maps (Mapbox/Leaflet)
- [ ] Set up custom domain
- [ ] Add analytics

## License

© 2026 Ashtabula Area Development Corporation
EOF

echo ""
echo "✅ Scaffold complete!"
echo ""
echo "Next steps:"
echo "  cd $TARGET_DIR"
echo "  npm run dev"
echo ""
echo "🚀 Ready for Day 1 development!"
