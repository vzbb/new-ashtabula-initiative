import { Site, Incentive } from './types';

export const mockSites: Site[] = [
  {
    id: 'site-001',
    name: 'Former Manufacturing Complex',
    address: '4500 Main Avenue',
    city: 'Ashtabula',
    state: 'OH',
    zip: '44004',
    acres: 10,
    zoningType: 'Industrial',
    status: 'shovel_ready',
    priceType: 'sale',
    priceAmount: 850000,
    hasRail: true,
    hasPortAccess: false,
    hasFiber: true,
    utilities: ['Electric', 'Natural Gas', 'Water', 'Sewer', 'Fiber'],
    description: 'Former manufacturing facility with existing infrastructure. Fully permitted and ready for immediate development. Existing building pad and paved access.',
    features: [
      'Existing concrete slab (50,000 sq ft)',
      'Three-phase electric service',
      'Rail spur access available',
      'City water and sewer',
      'Fiber optic connectivity',
      'Security fencing'
    ],
    incentives: ['tax_abatement', 'workforce_grant'],
    coordinates: [-80.7831, 41.8653],
    photos: ['/sites/site-001-hero.jpg'],
    contactEmail: 'development@ashtacounty.org',
    distanceToI90: '2.5 miles',
    distanceToRail: 'On-site',
    distanceToPort: '4.2 miles'
  },
  {
    id: 'site-002',
    name: 'Downtown Commercial Opportunity',
    address: '1221 Bridge Street',
    city: 'Ashtabula',
    state: 'OH',
    zip: '44004',
    acres: 0.5,
    zoningType: 'TIF',
    status: 'available',
    priceType: 'lease',
    priceAmount: 4500,
    hasRail: false,
    hasPortAccess: false,
    hasFiber: true,
    utilities: ['Electric', 'Natural Gas', 'Water', 'Sewer'],
    description: 'Prime downtown commercial location in designated TIF district. Perfect for retail, office, or mixed-use development. High visibility with foot traffic.',
    features: [
      'High-visibility corner location',
      'Street-level retail frontage',
      'TIF eligible for improvements',
      'Municipal parking nearby',
      'Historic district aesthetic',
      'Walkable to restaurants and services'
    ],
    incentives: ['tax_abatement', 'infrastructure_grant'],
    coordinates: [-80.7956, 41.9025],
    photos: ['/sites/site-002-hero.jpg'],
    contactEmail: 'downtown@ashtacounty.org',
    distanceToI90: '1.8 miles',
    distanceToRail: 'N/A',
    distanceToPort: '3.5 miles'
  },
  {
    id: 'site-003',
    name: 'Waterfront Industrial Port Site',
    address: '1800 Lake Road',
    city: 'Ashtabula',
    state: 'OH',
    zip: '44004',
    acres: 25,
    zoningType: 'Industrial',
    status: 'available',
    priceType: 'contact',
    hasRail: true,
    hasPortAccess: true,
    hasFiber: true,
    utilities: ['Electric', 'Natural Gas', 'Water', 'Sewer'],
    description: 'Rare waterfront industrial property with direct Port of Ashtabula access. Ideal for manufacturing, distribution, or marine-related industries. Deep water access available.',
    features: [
      'Direct port access and dockage potential',
      '25 acres of developable land',
      'CSX rail mainline proximity',
      'Heavy industrial zoning',
      'Foreign Trade Zone eligible',
      'Excellent highway connectivity'
    ],
    incentives: ['ftz', 'infrastructure_grant', 'tax_abatement'],
    coordinates: [-80.8001, 41.9187],
    photos: ['/sites/site-003-hero.jpg'],
    contactEmail: 'port@ashtacounty.org',
    distanceToI90: '3.2 miles',
    distanceToRail: '0.5 miles',
    distanceToPort: 'On-site'
  }
];

export const mockIncentives: Incentive[] = [
  {
    id: 'incentive-001',
    name: 'City of Ashtabula Tax Abatement',
    type: 'tax_abatement',
    description: 'Property tax abatement for new commercial and industrial construction. Up to 100% abatement for 10-15 years depending on investment and job creation.',
    eligibilityCriteria: [
      'Minimum $250,000 investment in real property improvements',
      'Create or retain at least 5 full-time jobs',
      'Located within Ashtabula city limits',
      'Project must be approved by City Council'
    ],
    estimatedValue: 'Up to 100% property tax abatement for 15 years',
    contactInfo: 'City of Ashtabula Economic Development, (440) 992-7123',
    applyUrl: 'https://www.cityofashtabula.com'
  },
  {
    id: 'incentive-002',
    name: 'Ashtabula Opportunity Zone',
    type: 'opportunity_zone',
    description: 'Designated Opportunity Zone allows investors to defer, reduce, or eliminate capital gains taxes by reinvesting in qualified projects within the zone.',
    eligibilityCriteria: [
      'Investment must be in designated Opportunity Zone census tract',
      'Investment must be through Qualified Opportunity Fund',
      'Property or business must meet qualified requirements'
    ],
    estimatedValue: 'Defer capital gains; eliminate on investments held 10+ years',
    contactInfo: 'Ashtabula County Economic Development, (440) 576-2100'
  },
  {
    id: 'incentive-003',
    name: 'Ohio TechCred',
    type: 'workforce_grant',
    description: 'Reimbursement program for employers who upskill their workforce through industry-recognized credentials. Up to $2,000 per credential.',
    eligibilityCriteria: [
      'Ohio employer with employees in Ohio',
      'Credentials must be on approved list',
      'Employees must be Ohio residents',
      'Application must be submitted before training begins'
    ],
    estimatedValue: 'Up to $2,000 per employee credential',
    contactInfo: 'TechCred Ohio, (614) 466-2200',
    applyUrl: 'https://techcred.ohio.gov'
  },
  {
    id: 'incentive-004',
    name: 'Foreign Trade Zone #181',
    type: 'ftz',
    description: 'Foreign Trade Zone status at Port of Ashtabula allows duty deferral, reduction, and elimination on imported goods. Streamlined customs procedures.',
    eligibilityCriteria: [
      'Operations within FTZ #181 boundaries',
      'Import/export activity',
      'Approval from FTZ Board and local grantee'
    ],
    estimatedValue: 'Duty deferral, inverted tariff savings, quota avoidance',
    contactInfo: 'Port of Ashtabula, (440) 964-8200',
    applyUrl: 'https://portofashtabula.com'
  },
  {
    id: 'incentive-005',
    name: 'JobsOhio Infrastructure Grant',
    type: 'infrastructure_grant',
    description: 'Funding for critical infrastructure improvements supporting economic development projects. Covers roads, utilities, and site preparation.',
    eligibilityCriteria: [
      'Project must create or retain significant employment',
      'Competitive project considering multiple states',
      'Infrastructure gap must be documented',
      'Local match typically required'
    ],
    estimatedValue: '$100,000 - $5,000,000 depending on project scope',
    contactInfo: 'JobsOhio, (614) 224-6415',
    applyUrl: 'https://jobsohio.com'
  }
];

export const utilityData = {
  electric: {
    provider: 'AEP Ohio',
    zones: [
      { name: 'Ashtabula Central', status: 'available', capacity: '15 MW available' },
      { name: 'Harbor District', status: 'limited', capacity: '5 MW available - contact for large loads' },
      { name: 'Industrial Park West', status: 'available', capacity: '25 MW available' }
    ]
  },
  gas: {
    provider: 'Columbia Gas',
    zones: [
      { name: 'City Zone', status: 'available', pressure: 'High pressure available' },
      { name: 'Port Zone', status: 'available', pressure: 'Industrial pressure available' }
    ]
  },
  fiber: {
    providers: ['Lumen', 'Spectrum Business', 'Windstream'],
    coverage: '85% of industrial areas'
  }
};
