'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockSites } from '@/lib/data';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Ruler,
  Train,
  Anchor,
  Wifi
} from 'lucide-react';

export default function DashboardPage() {
  const stats = useMemo(() => {
    const totalSites = mockSites.length;
    const availableSites = mockSites.filter(s => s.status === 'available').length;
    const shovelReadySites = mockSites.filter(s => s.status === 'shovel_ready').length;
    const optionSites = mockSites.filter(s => s.status === 'option').length;
    const leasedSites = mockSites.filter(s => s.status === 'leased').length;
    
    const totalAcres = mockSites.reduce((sum, s) => sum + s.acres, 0);
    const avgAcres = totalSites > 0 ? totalAcres / totalSites : 0;
    
    const sitesWithRail = mockSites.filter(s => s.hasRail).length;
    const sitesWithPort = mockSites.filter(s => s.hasPortAccess).length;
    const sitesWithFiber = mockSites.filter(s => s.hasFiber).length;
    
    const industrialSites = mockSites.filter(s => s.zoningType === 'Industrial').length;
    const commercialSites = mockSites.filter(s => s.zoningType === 'Commercial').length;
    const mixedUseSites = mockSites.filter(s => s.zoningType === 'Mixed-Use').length;
    const tifSites = mockSites.filter(s => s.zoningType === 'TIF').length;

    return {
      totalSites,
      availableSites,
      shovelReadySites,
      optionSites,
      leasedSites,
      totalAcres,
      avgAcres,
      sitesWithRail,
      sitesWithPort,
      sitesWithFiber,
      industrialSites,
      commercialSites,
      mixedUseSites,
      tifSites
    };
  }, []);

  const availabilityRate = stats.totalSites > 0 
    ? ((stats.availableSites + stats.shovelReadySites) / stats.totalSites) * 100 
    : 0;

  const statusData = [
    { 
      label: 'Available', 
      count: stats.availableSites, 
      color: 'bg-yellow-500',
      icon: Clock
    },
    { 
      label: 'Shovel Ready', 
      count: stats.shovelReadySites, 
      color: 'bg-green-500',
      icon: CheckCircle2
    },
    { 
      label: 'Under Option', 
      count: stats.optionSites, 
      color: 'bg-blue-500',
      icon: AlertCircle
    },
    { 
      label: 'Leased/Sold', 
      count: stats.leasedSites, 
      color: 'bg-gray-500',
      icon: Building2
    },
  ];

  const zoningData = [
    { label: 'Industrial', count: stats.industrialSites, color: 'bg-blue-500' },
    { label: 'Commercial', count: stats.commercialSites, color: 'bg-purple-500' },
    { label: 'Mixed-Use', count: stats.mixedUseSites, color: 'bg-orange-500' },
    { label: 'TIF', count: stats.tifSites, color: 'bg-emerald-500' },
  ];

  const infrastructureData = [
    { 
      label: 'Rail Access', 
      count: stats.sitesWithRail, 
      total: stats.totalSites,
      icon: Train,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      label: 'Port Access', 
      count: stats.sitesWithPort, 
      total: stats.totalSites,
      icon: Anchor,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'Fiber Available', 
      count: stats.sitesWithFiber, 
      total: stats.totalSites,
      icon: Wifi,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Site Availability Dashboard</h1>
              <p className="text-blue-100">
                Real-time metrics and statistics for available properties in Ashtabula County
              </p>
            </div>
            <Badge variant="secondary" className="w-fit text-sm px-3 py-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              Last updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Sites</p>
                  <p className="text-3xl font-bold">{stats.totalSites}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Acres</p>
                  <p className="text-3xl font-bold">{stats.totalAcres}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Ruler className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Site Size</p>
                  <p className="text-3xl font-bold">{stats.avgAcres.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">acres</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Availability Rate</p>
                  <p className="text-3xl font-bold">{availabilityRate.toFixed(0)}%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Site Status Breakdown</CardTitle>
              <CardDescription>
                Distribution of sites by current availability status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusData.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{item.count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({stats.totalSites > 0 ? ((item.count / stats.totalSites) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ 
                          width: `${stats.totalSites > 0 ? (item.count / stats.totalSites) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zoning Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Zoning Distribution</CardTitle>
              <CardDescription>
                Sites categorized by zoning type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zoningData.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{item.count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({stats.totalSites > 0 ? ((item.count / stats.totalSites) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={stats.totalSites > 0 ? (item.count / stats.totalSites) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Infrastructure Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Infrastructure Overview</CardTitle>
            <CardDescription>
              Availability of key infrastructure across all sites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {infrastructureData.map((item) => (
                <div 
                  key={item.label}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                >
                  <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{item.count}</p>
                      <p className="text-xs text-muted-foreground">
                        of {item.total} sites
                      </p>
                    </div>
                    <div className="mt-1">
                      <Progress 
                        value={(item.count / item.total) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/sites"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-colors"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Browse All Sites
          </a>
          <a 
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Contact for More Info
          </a>
        </div>
      </div>
    </div>
  );
}
