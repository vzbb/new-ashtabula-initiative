import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockIncentives } from '@/lib/data';
import { 
  Search, 
  DollarSign, 
  Building2, 
  Users, 
  Anchor, 
  Truck, 
  ArrowRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function IncentivesPage() {
  const incentiveTypes = [
    { 
      type: 'tax_abatement', 
      label: 'Tax Abatement', 
      icon: DollarSign,
      color: 'bg-green-100 text-green-800'
    },
    { 
      type: 'opportunity_zone', 
      label: 'Opportunity Zone', 
      icon: Building2,
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      type: 'workforce_grant', 
      label: 'Workforce Grant', 
      icon: Users,
      color: 'bg-purple-100 text-purple-800'
    },
    { 
      type: 'infrastructure_grant', 
      label: 'Infrastructure', 
      icon: Truck,
      color: 'bg-orange-100 text-orange-800'
    },
    { 
      type: 'ftz', 
      label: 'Foreign Trade Zone', 
      icon: Anchor,
      color: 'bg-emerald-100 text-emerald-800'
    }
  ];

  const getTypeConfig = (type: string) => {
    return incentiveTypes.find(t => t.type === type) || incentiveTypes[0];
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Incentives & Programs</h1>
            <p className="text-lg text-blue-100">
              Discover federal, state, and local incentive programs available 
              to businesses locating or expanding in Ashtabula County.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search incentives by name, type, or keyword..."
              className="pl-12 py-6 text-lg shadow-sm"
            />
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button variant="default" size="sm">All</Button>
          {incentiveTypes.map(type => (
            <Button key={type.type} variant="outline" size="sm">
              <type.icon className="w-4 h-4 mr-1" />
              {type.label}
            </Button>
          ))}
        </div>

        {/* Incentives Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {mockIncentives.map(incentive => {
            const typeConfig = getTypeConfig(incentive.type);
            const Icon = typeConfig.icon;

            return (
              <Card key={incentive.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Badge className={`mb-2 ${typeConfig.color}`}>
                        <Icon className="w-3 h-3 mr-1 inline" />
                        {typeConfig.label}
                      </Badge>
                      <CardTitle className="text-xl">{incentive.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {incentive.description}
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 font-semibold mb-1">
                      <DollarSign className="w-4 h-4" />
                      Potential Value
                    </div>
                    <p className="text-green-700 text-sm">{incentive.estimatedValue}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Eligibility</h4>
                    <ul className="space-y-1">
                      {incentive.eligibilityCriteria.slice(0, 2).map((criterion, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {criterion}
                        </li>
                      ))}
                      {incentive.eligibilityCriteria.length > 2 && (
                        <li className="text-sm text-muted-foreground pl-6">
                          +{incentive.eligibilityCriteria.length - 2} more criteria
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Contact:</span> {incentive.contactInfo.split(',')[0]}
                    </div>
                    {incentive.applyUrl ? (
                      <a 
                        href={incentive.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm">
                          Apply
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </a>
                    ) : (
                      <Link href="/contact">
                        <Button variant="outline" size="sm">
                          Learn More
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white border-0">
            <CardContent className="p-8 md:p-12">
              <div className="md:flex items-center justify-between gap-8">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-bold mb-2">Need help finding the right incentives?</h2>
                  <p className="text-blue-100">
                    Our team can guide you through available programs and help 
                    maximize your investment in Ashtabula County.
                  </p>
                </div>
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 whitespace-nowrap">
                    Schedule a Consultation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
