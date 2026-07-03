import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Hammer, Shield, Users, Clock, CheckCircle, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Trusted Contractors in Ashtabula County
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Connect with verified local contractors for your home improvement projects. 
              Compare quotes, check reviews, and hire with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Hammer className="w-5 h-5 mr-2" />
                  Start Your Project
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                  <Users className="w-5 h-5 mr-2" />
                  Join as Contractor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose ContractorMatch?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Verified Contractors</h3>
                <p className="text-gray-600">All contractors are verified for licensing, insurance, and background checks.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Clock className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                <p className="text-gray-600">Post your project once and get matched with qualified contractors automatically.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Star className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Compare Quotes</h3>
                <p className="text-gray-600">Receive and compare multiple quotes side-by-side to make the best decision.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Describe Your Project', desc: 'Tell us what you need done' },
              { step: '2', title: 'Get Matched', desc: 'We find the best contractors for you' },
              { step: '3', title: 'Compare Quotes', desc: 'Review quotes and contractor profiles' },
              { step: '4', title: 'Hire & Complete', desc: 'Choose your contractor and get the job done' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Popular Services</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Roofing', icon: '🏠' },
              { name: 'Plumbing', icon: '🚿' },
              { name: 'Electrical', icon: '⚡' },
              { name: 'HVAC', icon: '❄️' },
              { name: 'Landscaping', icon: '🌳' },
              { name: 'Remodeling', icon: '🔨' },
              { name: 'Painting', icon: '🎨' },
              { name: 'Flooring', icon: '🪵' },
              { name: 'Decks & Fences', icon: '🏡' },
              { name: 'Handyman', icon: '🛠️' },
            ].map((service) => (
              <Link 
                key={service.name}
                href="/register"
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <span className="text-3xl block mb-2">{service.icon}</span>
                <span className="font-medium text-sm">{service.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of homeowners who found their perfect contractor match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create Free Account
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center gap-8 mt-8 text-sm text-blue-200">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Free for homeowners
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> No obligation
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Verified contractors only
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">ContractorMatch</h3>
              <p className="text-sm">Connecting Ashtabula County homeowners with verified local contractors.</p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">For Homeowners</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="hover:text-white">Post a Project</Link></li>
                <li><Link href="/login" className="hover:text-white">Browse Contractors</Link></li>
                <li><Link href="/login" className="hover:text-white">How It Works</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">For Contractors</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="hover:text-white">Join Network</Link></li>
                <li><Link href="/login" className="hover:text-white">View Leads</Link></li>
                <li><Link href="/login" className="hover:text-white">Success Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/login" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/login" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            © 2026 ContractorMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}