import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Building2, 
  Users, 
  TrendingUp, 
  Anchor, 
  Train, 
  ArrowRight,
  Target,
  Globe,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const advantages = [
    {
      icon: Anchor,
      title: 'Port Access',
      description: 'Direct access to the Port of Ashtabula on Lake Erie, with Foreign Trade Zone capabilities for international trade.'
    },
    {
      icon: Train,
      title: 'Rail Connectivity',
      description: 'CSX rail service connects Ashtabula to major markets across the Midwest and Eastern United States.'
    },
    {
      icon: MapPin,
      title: 'Strategic Location',
      description: 'Located on I-90, midway between Cleveland and Erie, PA - within 500 miles of half the US population.'
    },
    {
      icon: Users,
      title: 'Skilled Workforce',
      description: 'Access to a dedicated workforce with experience in manufacturing, logistics, and agriculture.'
    },
    {
      icon: Building2,
      title: 'Affordable Real Estate',
      description: 'Competitive land and building costs compared to major metropolitan areas in Ohio and the Midwest.'
    },
    {
      icon: TrendingUp,
      title: 'Business-Friendly',
      description: 'Pro-business local government with streamlined permitting and active economic development support.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">About AADC</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Building Economic Prosperity in Ashtabula County
            </h1>
            <p className="text-lg text-blue-100">
              The Ashtabula Area Development Corporation (AADC) is the leading 
              economic development organization dedicated to attracting investment, 
              supporting business growth, and creating quality jobs in Ashtabula County, Ohio.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  To facilitate economic growth and diversification by attracting 
                  new businesses and supporting the expansion of existing industries.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Our Vision</h3>
                <p className="text-muted-foreground">
                  A thriving, diverse economy where businesses succeed and residents 
                  enjoy abundant opportunities for meaningful employment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Our Impact</h3>
                <p className="text-muted-foreground">
                  Over $200M in new investment facilitated, 1,500+ jobs created, 
                  and 50+ businesses assisted in the past decade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Ashtabula */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Ashtabula County?</h2>
            <p className="text-lg text-muted-foreground">
              Located in Northeast Ohio along the shores of Lake Erie, Ashtabula County 
              offers unique advantages for businesses of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, i) => (
              <Card key={i} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-emerald-200 transition-colors">
                    <advantage.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{advantage.title}</h3>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '97,000', label: 'County Population' },
              { value: '27', label: 'Miles of Lakefront' },
              { value: '500+', label: 'Miles to 50% of US Population' },
              { value: '100+', label: 'Available Sites' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Leadership Placeholder */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-muted-foreground">
              Experienced professionals dedicated to your business success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Executive Director', title: 'Leading AADC Strategy' },
              { name: 'Economic Development Director', title: 'Site Selection & Incentives' },
              { name: 'Business Retention Manager', title: 'Existing Industry Support' }
            ].map((member, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Learn More?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with our team to discuss how Ashtabula County can be the 
              right location for your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sites">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Explore Sites
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
