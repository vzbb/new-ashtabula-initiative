export interface Site {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  acres: number;
  zoningType: 'Industrial' | 'Commercial' | 'Mixed-Use' | 'TIF';
  status: 'available' | 'shovel_ready' | 'option' | 'leased';
  priceType: 'sale' | 'lease' | 'contact';
  priceAmount?: number;
  hasRail: boolean;
  hasPortAccess: boolean;
  hasFiber: boolean;
  utilities: string[];
  description: string;
  features: string[];
  incentives: string[];
  coordinates: [number, number]; // [lng, lat]
  photos: string[];
  contactEmail: string;
  distanceToI90?: string;
  distanceToRail?: string;
  distanceToPort?: string;
}

export interface Incentive {
  id: string;
  name: string;
  type: 'tax_abatement' | 'opportunity_zone' | 'workforce_grant' | 'infrastructure_grant' | 'ftz';
  description: string;
  eligibilityCriteria: string[];
  estimatedValue: string;
  contactInfo: string;
  applyUrl?: string;
}

export interface FilterState {
  acreageMin?: number;
  acreageMax?: number;
  zoningType?: string[];
  status?: string[];
  hasRail?: boolean;
  hasPortAccess?: boolean;
  hasFiber?: boolean;
  utilities?: string[];
}
