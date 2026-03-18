'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Maximize2, Ruler, Train, Ship, Zap, Heart } from 'lucide-react';
import { Site } from '@/lib/types';

interface SiteCardProps {
  site: Site;
  onViewDetails?: (site: Site) => void;
  onAddToShortlist?: (site: Site) => void;
  isShortlisted?: boolean;
  compact?: boolean;
}

export function SiteCard({ 
  site, 
  onViewDetails, 
  onAddToShortlist, 
  isShortlisted = false,
  compact = false 
}: SiteCardProps) {
  const [imageError, setImageError] = useState(false);

  const statusColors = {
    available: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    shovel_ready: 'bg-green-100 text-green-800 border-green-200',
    option: 'bg-blue-100 text-blue-800 border-blue-200',
    leased: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const zoningColors = {
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
    <Card className={`overflow-hidden transition-shadow hover:shadow-lg ${compact ? 'h-full' : ''}`}>
      <div className={`relative ${compact ? 'h-32' : 'h-48'} bg-slate-200`}>
        {!imageError ? (
          <img
            src={site.photos[0] || '/placeholder-site.jpg'}
            alt={site.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
            <MapPin className="w-12 h-12 text-slate-300" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className={statusColors[site.status]}>
            {site.status.replace('_', ' ')}
          </Badge>
        </div>
        {isShortlisted && (
          <div className="absolute top-3 left-3">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
        )}
      </div>
      
      <CardHeader className={compact ? 'p-3 pb-2' : 'pb-2'}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className={`font-semibold truncate ${compact ? 'text-sm' : 'text-lg'}`}>
              {site.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground truncate">
              {site.address}, {site.city}, {site.state}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className={compact ? 'p-3 pt-0' : 'pt-0'}>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className={zoningColors[site.zoningType]}>
            {site.zoningType}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Ruler className="w-3 h-3" />
            {site.acres} acres
          </Badge>
        </div>

        {!compact && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {site.description}
          </p>
        )}

        <div className={`flex items-center gap-3 ${compact ? 'mb-2' : 'mb-4'}`}>
          {site.hasRail && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Rail access">
              <Train className="w-3.5 h-3.5" />
              {!compact && <span>Rail</span>}
            </div>
          )}
          {site.hasPortAccess && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Port access">
              <Ship className="w-3.5 h-3.5" />
              {!compact && <span>Port</span>}
            </div>
          )}
          {site.hasFiber && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Fiber available">
              <Zap className="w-3.5 h-3.5" />
              {!compact && <span>Fiber</span>}
            </div>
          )}
        </div>

        <div className={`flex items-center justify-between ${compact ? '' : 'pt-3 border-t'}`}>
          <span className="font-semibold text-primary text-sm">
            {formatPrice()}
          </span>
          <div className="flex gap-2">
            {onAddToShortlist && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddToShortlist(site)}
                className="h-8 w-8 p-0"
              >
                <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            )}
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(site)}
                className="h-8"
              >
                <Maximize2 className="w-3.5 h-3.5 mr-1" />
                {compact ? '' : 'Details'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
