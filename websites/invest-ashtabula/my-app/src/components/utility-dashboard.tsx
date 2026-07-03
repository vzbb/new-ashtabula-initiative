'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Flame, 
  Wifi, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle 
} from 'lucide-react';
import { utilityData } from '@/lib/data';

interface UtilityDashboardProps {
  compact?: boolean;
}

export function UtilityDashboard({ compact = false }: UtilityDashboardProps) {
  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Utility Capacity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Electric</span>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700">Available</Badge>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Natural Gas</span>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700">Available</Badge>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Fiber</span>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700">85% Coverage</Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Electric */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              AEP Ohio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {utilityData.electric.zones.map(zone => (
              <div key={zone.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{zone.name}</span>
                  <StatusBadge status={zone.status} />
                </div>
                <p className="text-xs text-muted-foreground">{zone.capacity}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              Columbia Gas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {utilityData.gas.zones.map(zone => (
              <div key={zone.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{zone.name}</span>
                  <StatusBadge status={zone.status} />
                </div>
                <p className="text-xs text-muted-foreground">{zone.pressure}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Broadband */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-blue-600" />
              </div>
              Broadband
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Industrial Coverage</span>
                <span className="text-sm font-bold text-green-600">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div className="pt-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Providers:</p>
              <div className="flex flex-wrap gap-2">
                {utilityData.fiber.providers.map(provider => (
                  <Badge key={provider} variant="secondary" className="text-xs">
                    {provider}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Utility capacity data is updated periodically.</p>
              <p className="text-xs text-muted-foreground mt-1">
                For large power requirements (&gt;5MW) or specialized utility needs,
                please contact AADC to coordinate with utility providers for detailed capacity studies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'available') {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Available
      </Badge>
    );
  }
  if (status === 'limited') {
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Limited
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <HelpCircle className="w-3 h-3" />
      Contact
    </Badge>
  );
}
