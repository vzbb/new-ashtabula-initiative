'use client';

import { useState, useMemo } from 'react';
import { SiteMap } from '@/components/site-map';
import { SiteCard } from '@/components/site-card';
import { SiteFilters } from '@/components/site-filters';
import { Input } from '@/components/ui/input';
import { Site, FilterState } from '@/lib/types';
import { mockSites } from '@/lib/data';
import { Search, Map as MapIcon, List, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SitesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const filteredSites = useMemo(() => {
    return mockSites.filter(site => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          site.name.toLowerCase().includes(query) ||
          site.address.toLowerCase().includes(query) ||
          site.city.toLowerCase().includes(query) ||
          site.zoningType.toLowerCase().includes(query) ||
          site.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Acreage filter
      if (filters.acreageMin !== undefined && site.acres < filters.acreageMin) return false;
      if (filters.acreageMax !== undefined && site.acres > filters.acreageMax) return false;

      // Zoning type filter
      if (filters.zoningType?.length && !filters.zoningType.includes(site.zoningType)) return false;

      // Status filter
      if (filters.status?.length && !filters.status.includes(site.status)) return false;

      // Infrastructure filters
      if (filters.hasRail && !site.hasRail) return false;
      if (filters.hasPortAccess && !site.hasPortAccess) return false;
      if (filters.hasFiber && !site.hasFiber) return false;

      return true;
    });
  }, [searchQuery, filters]);

  const handleSiteSelect = (site: Site) => {
    setSelectedSiteId(site.id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Available Sites</h1>
              <p className="text-sm text-muted-foreground">
                Browse {filteredSites.length} industrial and commercial properties
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search sites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full lg:w-64"
                />
              </div>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-r-none"
                >
                  <MapIcon className="w-4 h-4 mr-1" />
                  Map
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'map' ? (
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-full lg:w-96 border-r bg-background overflow-y-auto hidden lg:block">
              <div className="p-4 space-y-4">
                <SiteFilters 
                  filters={filters} 
                  onChange={setFilters} 
                  resultCount={filteredSites.length}
                />

                <div className="space-y-3">
                  <h3 className="font-semibold">Results</h3>
                  {filteredSites.map(site => (
                    <div 
                      key={site.id}
                      className={`cursor-pointer transition-all ${
                        selectedSiteId === site.id ? 'ring-2 ring-primary rounded-lg' : ''
                      }`}
                      onClick={() => handleSiteSelect(site)}
                    >
                      <Link href={`/site/${site.id}`}>
                        <SiteCard site={site} compact />
                      </Link>
                    </div>
                  ))}
                  {filteredSites.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No sites match your filters.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
              <SiteMap
                sites={filteredSites}
                selectedSiteId={selectedSiteId}
                onSiteSelect={handleSiteSelect}
                height="100%"
                fullscreen={isMapFullscreen}
                onToggleFullscreen={() => setIsMapFullscreen(!isMapFullscreen)}
              />

              {/* Mobile Filters Toggle */}
              <div className="lg:hidden absolute bottom-4 left-4 right-4">
                <SiteFilters 
                  filters={filters} 
                  onChange={setFilters} 
                  resultCount={filteredSites.length}
                  compact
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <SiteFilters 
                  filters={filters} 
                  onChange={setFilters} 
                  resultCount={filteredSites.length}
                />
              </div>

              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSites.map(site => (
                    <Link key={site.id} href={`/site/${site.id}`}>
                      <SiteCard site={site} />
                    </Link>
                  ))}
                </div>

                {filteredSites.length === 0 && (
                  <div className="text-center py-16">
                    <Grid3X3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No sites found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
