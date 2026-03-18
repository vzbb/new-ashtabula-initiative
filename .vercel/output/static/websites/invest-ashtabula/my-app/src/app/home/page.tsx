import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SiteCard } from '@/components/site-card';
import { UtilityDashboard } from '@/components/utility-dashboard';
import { SiteMap } from '@/components/site-map';
import { mockSites } from '@/lib/data';
import { 
  MapPin, 
  Building2, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Briefcase,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const featuredSites = mockSites.slice(0, 3);
  
  const stats = [
    { label: 'Available Sites', value: '12+', icon: Building2 },
    { label: 'Total Acres', value: '150+', icon: Compass },
    { label: 'Incentive Programs', value: '8', icon: TrendingUp },
    { label: 'Employers Served', value: '200+', icon: Briefcase }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 text-white py-20 lg:py-32 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              Now Available: Interactive Site Map
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Next
              <span className="block bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Industrial Site
              </span>
              in Ashtabula County
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
              Discover shovel-ready properties, explore incentive programs, and connect 
              with the resources you need to grow your business in Northeast Ohio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sites">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold">
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore the Map
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Users className="w-5 h-5 mr-2" />
                  Talk to AADC
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-200 flex items-center justify-center gap-1">
                    <stat.icon className="w-4 h-4" />
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sites Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Sites</h2>
              <p className="text-slate-600 mt-1">Shovel-ready properties ready for development</p>
            </div>
            <Link href="/sites">
              <Button variant="outline">
                View All Sites
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSites.map(site => (
              <Link key={site.id} href={`/site/${site.id}`}>
                <SiteCard site={site} compact />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Interactive Site Map</h2>
            <p className="text-muted-foreground mt-2">Explore available properties across Ashtabula County</p>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-xl border">
            <SiteMap sites={mockSites} height="450px" />
          </div>
        </div>
      </section>

      {/* Utility Dashboard Teaser */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Utility Dashboard</Badge>
              <h2 className="text-3xl font-bold mb-4">
                Real-Time Utility Capacity
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Access up-to-date utility capacity information from AEP Ohio, 
                Columbia Gas, and fiber providers. Make informed decisions with 
                verified infrastructure data.
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Electric capacity by substation zone',
                  'Natural gas pressure and availability',
                  'Fiber optic coverage maps',
                  'Water and sewer service areas'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/sites">
                <Button>
                  Explore Utilities
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="lg:pl-8">
              <UtilityDashboard compact />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore Opportunities?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with the Ashtabula Area Development Corporation team 
              to discuss your project and find the perfect site.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Schedule a Consultation
                </Button>
              </Link>
              <Link href="/incentives">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  View Incentives
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
