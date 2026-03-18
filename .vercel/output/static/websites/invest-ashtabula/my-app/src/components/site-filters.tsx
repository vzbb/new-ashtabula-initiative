'use client';

import { FilterState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Train, Ship, Wifi, X, Filter } from 'lucide-react';
import { useState } from 'react';

interface SiteFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
  compact?: boolean;
}

export function SiteFilters({ filters, onChange, resultCount, compact = false }: SiteFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);

  const acreageRanges = [
    { label: '1–5 acres', min: 1, max: 5 },
    { label: '5–20 acres', min: 5, max: 20 },
    { label: '20–50 acres', min: 20, max: 50 },
    { label: '50+ acres', min: 50, max: undefined }
  ];

  const zoningTypes = ['Industrial', 'Commercial', 'Mixed-Use', 'TIF'];
  const statuses = ['available', 'shovel_ready', 'option'];

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'zoningType' | 'status', value: string) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated.length > 0 ? updated : undefined);
  };

  const clearFilters = () => {
    onChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => 
    v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  );

  const FilterContent = () => (
    <>
      <div className="space-y-4">
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider mb-2 block">Acreage</Label>
          <div className="flex flex-wrap gap-2">
            {acreageRanges.map(range => (
              <Button
                key={range.label}
                variant={filters.acreageMin === range.min ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  if (filters.acreageMin === range.min) {
                    updateFilter('acreageMin', undefined);
                    updateFilter('acreageMax', undefined);
                  } else {
                    updateFilter('acreageMin', range.min);
                    updateFilter('acreageMax', range.max);
                  }
                }}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider mb-2 block">Zoning Type</Label>
          <div className="flex flex-wrap gap-2">
            {zoningTypes.map(type => (
              <Button
                key={type}
                variant={filters.zoningType?.includes(type) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleArrayFilter('zoningType', type)}
                className="text-xs"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider mb-2 block">Status</Label>
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <Button
                key={status}
                variant={filters.status?.includes(status) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleArrayFilter('status', status)}
                className="text-xs capitalize"
              >
                {status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider mb-2 block">Infrastructure</Label>
          <div className="space-y-2">
            <Button
              variant={filters.hasRail ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('hasRail', filters.hasRail ? undefined : true)}
              className="w-full justify-start text-xs"
            >
              <Train className="w-3.5 h-3.5 mr-2" />
              Rail Access
            </Button>
            <Button
              variant={filters.hasPortAccess ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('hasPortAccess', filters.hasPortAccess ? undefined : true)}
              className="w-full justify-start text-xs"
            >
              <Ship className="w-3.5 h-3.5 mr-2" />
              Port Access
            </Button>
            <Button
              variant={filters.hasFiber ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('hasFiber', filters.hasFiber ? undefined : true)}
              className="w-full justify-start text-xs"
            >
              <Wifi className="w-3.5 h-3.5 mr-2" />
              Fiber Available
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            <strong className="text-foreground">{resultCount}</strong> sites found
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );

  if (compact) {
    return (
      <div className="bg-background border rounded-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="font-medium text-sm">Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">Active</Badge>
            )}
          </div>
          <Badge variant="outline" className="text-xs">{resultCount}</Badge>
        </button>
        {isExpanded && (
          <div className="p-3 border-t">
            <FilterContent />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-background border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </div>
      <FilterContent />
    </div>
  );
}
