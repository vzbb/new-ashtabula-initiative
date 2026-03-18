import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SiteMap } from '@/components/site-map';
import { InquiryModal } from '@/components/inquiry-modal';
import { mockSites, mockIncentives } from '@/lib/data';
import { 
  MapPin, 
  Ruler, 
  Train, 
  ArrowLeft,
  Download,
  Heart,
  Share2,
  Mail,
  CheckCircle2,
  Building2,
  Anchor
} from 'lucide-react';

interface SiteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return mockSites.map((site) => ({
    id: site.id,
  }));
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const { id } = await params;
  const site = mockSites.find(s => s.id === id);
  
  if (!site) {
    notFound();
  }

  const siteIncentives = mockIncentives.filter(inc => 
    site.incentives.includes(inc.id)
  );

  const statusColors: Record<string, string> = {
    available: 'bg-yellow-100 text-yellow-800',
    shovel_ready: 'bg-green-100 text-green-800',
    option: 'bg-blue-100 text-blue-800',
    leased: 'bg-gray-100 text-gray-800'
  };

  const zoningColors: Record<string, string> = {
    'Industrial': 'bg-blue-100 text-blue-800',
    'Commercial': 'bg-purple-100 text-purple-800',
    'Mixed-Use': 'bg-orange-100 text-orange-800',
    'TIF': 'bg-emerald-100 text-emerald-800'
  };

  const formatPrice = () => {
    if (site.priceType === 'contact') return 'Contact for pricing';
    if (site.priceType === 'lease') return `$${site.priceAmount?.toLocaleString()}/mo`;
    return `$${site.priceAmount?.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb & Actions */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link href="/sites">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sites
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <InquiryModal 
                siteId={site.id} 
                siteName={site.name}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={statusColors[site.status]}>
                  {site.status.replace('_', ' ')}
                </Badge>
                <Badge className={zoningColors[site.zoningType]}>
                  {site.zoningType}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold mb-2">{site.name}</h1>
              
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {site.address}, {site.city}, {site.state} {site.zip}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{formatPrice()}</span>
                {site.priceType === 'sale' && (
                  <span className="text-muted-foreground">
                    (${Math.round((site.priceAmount || 0) / site.acres).toLocaleString()}/acre)
                  </span>
                )}
              </div>
            </div>

            {/* Image Gallery Placeholder */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl h-80 flex items-center justify-center">
              <div className="text-center">
                <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-muted-foreground">Site photos coming soon</p>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {site.description}
                </p>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {site.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <SiteMap 
                  sites={[site]} 
                  center={site.coordinates} 
                  zoom={14}
                  height="300px"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Total Acres</span>
                    </div>
                    <span className="text-xl font-bold">{site.acres}</span>
                  </div>

                  {site.distanceToI90 && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-medium">To I-90</span>
                      </div>
                      <span>{site.distanceToI90}</span>
                    </div>
                  )}

                  {site.hasRail && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Train className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">Rail Access</span>
                      </div>
                      <Badge variant="outline">{site.distanceToRail || 'Yes'}</Badge>
                    </div>
                  )}

                  {site.hasPortAccess && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Anchor className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Port Access</span>
                      </div>
                      <Badge variant="outline">{site.distanceToPort || 'Yes'}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Utilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Utilities Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {site.utilities.map(utility => (
                    <Badge key={utility} variant="secondary">
                      {utility}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Incentives */}
            {siteIncentives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Eligible Incentives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {siteIncentives.map(incentive => (
                      <Link 
                        key={incentive.id} 
                        href="/incentives"
                        className="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="font-medium text-sm">{incentive.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {incentive.estimatedValue}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Interested in this site?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Contact AADC to schedule a site visit or request more information.
                </p>
                
                <InquiryModal 
                  siteId={site.id} 
                  siteName={site.name}
                  variant="secondary"
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                />

                <div className="mt-4 pt-4 border-t border-white/20">
                  <a 
                    href={`mailto:${site.contactEmail}`}
                    className="flex items-center gap-2 text-sm text-blue-100 hover:text-white"
                  >
                    <Mail className="w-4 h-4" />
                    {site.contactEmail}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  Site Plan (PDF)
                  <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
