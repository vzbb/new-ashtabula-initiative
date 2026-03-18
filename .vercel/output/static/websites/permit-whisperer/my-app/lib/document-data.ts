export interface DocumentInfo {
  id: string;
  name: string;
  jurisdiction: 'city' | 'county';
  category: string;
  description: string;
  whenRequired: string[];
  submitLocation: string;
  onlineLink?: string;
  downloadUrl?: string;
}

export const cityDocuments: DocumentInfo[] = [
  {
    id: 'city-zoning',
    name: 'Zoning Permit Application',
    jurisdiction: 'city',
    category: 'General',
    description: 'Primary application for all zoning permits including additions, decks, and sheds.',
    whenRequired: ['addition', 'deck', 'shed', 'demolition'],
    submitLocation: 'City of Ashtabula PCD, 4717 Main Ave',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/city-zoning-permit.pdf',
  },
  {
    id: 'city-pool',
    name: 'Pool Permit Application',
    jurisdiction: 'city',
    category: 'Pool',
    description: 'Application for in-ground and above-ground pools including safety enclosure details.',
    whenRequired: ['pool'],
    submitLocation: 'City of Ashtabula PCD, 4717 Main Ave',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/city-pool-permit.pdf',
  },
  {
    id: 'city-fence',
    name: 'Fence Permit Application',
    jurisdiction: 'city',
    category: 'Fence',
    description: 'Application for fences over 6ft or in front yard.',
    whenRequired: ['fence'],
    submitLocation: 'City of Ashtabula PCD, 4717 Main Ave',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/city-fence-permit.pdf',
  },
  {
    id: 'city-deck',
    name: 'Deck Permit Application',
    jurisdiction: 'city',
    category: 'Deck',
    description: 'Application for decks over 30" high or attached to dwelling.',
    whenRequired: ['deck'],
    submitLocation: 'City of Ashtabula PCD, 4717 Main Ave',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/city-deck-permit.pdf',
  },
  {
    id: 'city-historic',
    name: 'Historic District Review Application',
    jurisdiction: 'city',
    category: 'Historic',
    description: 'Required for any exterior work in the Historic District.',
    whenRequired: ['addition', 'deck', 'pool', 'fence', 'demolition'],
    submitLocation: 'City of Ashtabula PCD, 4717 Main Ave',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/city-historic-review.pdf',
  },
  {
    id: 'city-sign',
    name: 'Sign Permit Application',
    jurisdiction: 'city',
    category: 'Commercial',
    description: 'Application for business signs and commercial signage.',
    whenRequired: [],
    submitLocation: 'City of Ashtabula PCD, 4717 Main Ave',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/city-sign-permit.pdf',
  },
  {
    id: 'city-zoning-checklist',
    name: 'Zoning Permit Checklist',
    jurisdiction: 'city',
    category: 'Guide',
    description: 'Complete checklist of requirements for zoning permit applications.',
    whenRequired: ['addition', 'deck', 'shed', 'pool', 'fence', 'demolition'],
    submitLocation: 'Keep for your records',
    onlineLink: undefined,
    downloadUrl: '/forms/city-zoning-checklist.pdf',
  },
];

export const countyDocuments: DocumentInfo[] = [
  {
    id: 'county-residential',
    name: 'Residential Building Permit',
    jurisdiction: 'county',
    category: 'General',
    description: 'Primary building permit for new construction, additions, and major renovations.',
    whenRequired: ['addition', 'shed', 'deck', 'pool', 'demolition'],
    submitLocation: 'Ashtabula County Building, 25 W Jefferson St, Jefferson',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/county-residential-permit.pdf',
  },
  {
    id: 'county-alteration',
    name: 'Residential Alteration Permit',
    jurisdiction: 'county',
    category: 'Interior',
    description: 'Permit for interior remodeling, basement finishing, and minor renovations.',
    whenRequired: ['interior'],
    submitLocation: 'Ashtabula County Building, 25 W Jefferson St, Jefferson',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/county-alteration-permit.pdf',
  },
  {
    id: 'county-demolition',
    name: 'Demolition Permit',
    jurisdiction: 'county',
    category: 'Demolition',
    description: 'Permit for demolition of any structure.',
    whenRequired: ['demolition'],
    submitLocation: 'Ashtabula County Building, 25 W Jefferson St, Jefferson',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/county-demolition-permit.pdf',
  },
  {
    id: 'county-electrical',
    name: 'Electrical Permit',
    jurisdiction: 'county',
    category: 'Trade',
    description: 'Permit for electrical work including new circuits, panels, and service upgrades.',
    whenRequired: ['trade'],
    submitLocation: 'Ashtabula County Building, 25 W Jefferson St, Jefferson',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/county-electrical-permit.pdf',
  },
  {
    id: 'county-plumbing',
    name: 'Plumbing Permit',
    jurisdiction: 'county',
    category: 'Trade',
    description: 'Permit for plumbing work including new fixtures, water heaters, and sewer connections.',
    whenRequired: ['trade'],
    submitLocation: 'Ashtabula County Building, 25 W Jefferson St, Jefferson',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/county-plumbing-permit.pdf',
  },
  {
    id: 'county-hvac',
    name: 'HVAC Permit',
    jurisdiction: 'county',
    category: 'Trade',
    description: 'Permit for heating, ventilation, and air conditioning work.',
    whenRequired: ['trade'],
    submitLocation: 'Ashtabula County Building, 25 W Jefferson St, Jefferson',
    onlineLink: 'https://www.citizenserve.com/ashtabula',
    downloadUrl: '/forms/county-hvac-permit.pdf',
  },
];

export const allDocuments = [...cityDocuments, ...countyDocuments];