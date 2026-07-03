export type ProjectCategory = 
  | 'shed' 
  | 'deck' 
  | 'pool' 
  | 'fence' 
  | 'addition' 
  | 'interior' 
  | 'trade' 
  | 'demolition';

export interface ProjectType {
  id: ProjectCategory;
  name: string;
  description: string;
  icon: string;
  requiresCityPermit: boolean | 'conditional';
  requiresCountyPermit: boolean | 'conditional';
}

export const projectTypes: ProjectType[] = [
  {
    id: 'shed',
    name: 'Storage Building',
    description: 'Shed, garage, or barn',
    icon: 'Warehouse',
    requiresCityPermit: 'conditional',
    requiresCountyPermit: 'conditional',
  },
  {
    id: 'deck',
    name: 'Deck or Patio',
    description: 'Outdoor living space',
    icon: 'LayoutGrid',
    requiresCityPermit: 'conditional',
    requiresCountyPermit: 'conditional',
  },
  {
    id: 'pool',
    name: 'Swimming Pool',
    description: 'In-ground or above-ground pool',
    icon: 'Waves',
    requiresCityPermit: true,
    requiresCountyPermit: true,
  },
  {
    id: 'fence',
    name: 'Fence',
    description: 'Privacy or decorative fence',
    icon: 'Fence',
    requiresCityPermit: 'conditional',
    requiresCountyPermit: false,
  },
  {
    id: 'addition',
    name: 'Home Addition',
    description: 'Room addition or bump-out',
    icon: 'Home',
    requiresCityPermit: true,
    requiresCountyPermit: true,
  },
  {
    id: 'interior',
    name: 'Interior Work',
    description: 'Basement finish or remodel',
    icon: 'Paintbrush',
    requiresCityPermit: false,
    requiresCountyPermit: true,
  },
  {
    id: 'trade',
    name: 'Trade Work',
    description: 'Electrical, plumbing, or HVAC',
    icon: 'Zap',
    requiresCityPermit: false,
    requiresCountyPermit: true,
  },
  {
    id: 'demolition',
    name: 'Demolition',
    description: 'Structure removal',
    icon: 'Trash2',
    requiresCityPermit: true,
    requiresCountyPermit: true,
  },
];

export interface WizardQuestion {
  id: string;
  question: string;
  type: 'number' | 'select' | 'boolean' | 'radio';
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
  dependsOn?: { field: string; value: any };
}

export const wizardQuestions: Record<ProjectCategory, WizardQuestion[]> = {
  shed: [
    {
      id: 'sqft',
      question: 'What is the square footage of your shed?',
      type: 'number',
      placeholder: 'e.g., 120',
      helpText: 'Length × Width = Square footage',
    },
    {
      id: 'height',
      question: 'What is the height of your shed?',
      type: 'number',
      placeholder: 'e.g., 10',
      helpText: 'Height in feet from ground to peak',
    },
    {
      id: 'electrical',
      question: 'Will your shed have electrical?',
      type: 'boolean',
      helpText: 'Any wiring, outlets, or lighting',
    },
  ],
  deck: [
    {
      id: 'height',
      question: 'How high will the deck be above grade?',
      type: 'number',
      placeholder: 'e.g., 24',
      helpText: 'Height in inches from ground to deck surface',
    },
    {
      id: 'attached',
      question: 'Will the deck be attached to your dwelling?',
      type: 'boolean',
      helpText: 'Physically connected to the house',
    },
    {
      id: 'covered',
      question: 'Will the deck have a roof or cover?',
      type: 'boolean',
    },
  ],
  pool: [
    {
      id: 'type',
      question: 'What type of pool are you installing?',
      type: 'select',
      options: [
        { value: 'inground', label: 'In-ground' },
        { value: 'aboveground', label: 'Above-ground' },
        { value: 'inflatable', label: 'Inflatable/Portable' },
      ],
    },
    {
      id: 'enclosure',
      question: 'Will you have a safety enclosure/fence?',
      type: 'boolean',
      helpText: 'Required for pools deeper than 24 inches',
    },
    {
      id: 'historic',
      question: 'Is your property in the Historic District?',
      type: 'boolean',
      helpText: 'Check with PCD if unsure',
    },
  ],
  fence: [
    {
      id: 'height',
      question: 'What is the height of your fence?',
      type: 'number',
      placeholder: 'e.g., 6',
      helpText: 'Height in feet',
    },
    {
      id: 'location',
      question: 'Where will the fence be located?',
      type: 'select',
      options: [
        { value: 'front', label: 'Front yard only' },
        { value: 'rear', label: 'Side or rear yard only' },
        { value: 'both', label: 'Front and other yards' },
      ],
    },
    {
      id: 'material',
      question: 'What material will you use?',
      type: 'select',
      options: [
        { value: 'wood', label: 'Wood' },
        { value: 'vinyl', label: 'Vinyl' },
        { value: 'chainlink', label: 'Chain link' },
        { value: 'other', label: 'Other' },
      ],
    },
  ],
  addition: [
    {
      id: 'sqft',
      question: 'What is the square footage of the addition?',
      type: 'number',
      placeholder: 'e.g., 400',
    },
    {
      id: 'stories',
      question: 'How many stories?',
      type: 'select',
      options: [
        { value: '1', label: '1 story' },
        { value: '2', label: '2 stories' },
      ],
    },
    {
      id: 'projectValue',
      question: 'Estimated project value?',
      type: 'number',
      placeholder: 'e.g., 50000',
      helpText: 'Total construction cost including materials and labor',
    },
  ],
  interior: [
    {
      id: 'type',
      question: 'What type of interior work?',
      type: 'select',
      options: [
        { value: 'basement', label: 'Basement finish' },
        { value: 'kitchen', label: 'Kitchen remodel' },
        { value: 'bathroom', label: 'Bathroom remodel' },
        { value: 'other', label: 'Other interior work' },
      ],
    },
    {
      id: 'sqft',
      question: 'Square footage affected?',
      type: 'number',
      placeholder: 'e.g., 500',
    },
    {
      id: 'projectValue',
      question: 'Estimated project value?',
      type: 'number',
      placeholder: 'e.g., 25000',
    },
  ],
  trade: [
    {
      id: 'tradeType',
      question: 'What type of trade work?',
      type: 'select',
      options: [
        { value: 'electrical', label: 'Electrical' },
        { value: 'plumbing', label: 'Plumbing' },
        { value: 'hvac', label: 'HVAC' },
        { value: 'multiple', label: 'Multiple trades' },
      ],
    },
    {
      id: 'description',
      question: 'Brief description of work',
      type: 'radio',
      options: [
        { value: 'new', label: 'New installation' },
        { value: 'replacement', label: 'Replacement/upgrade' },
        { value: 'repair', label: 'Repair' },
      ],
    },
  ],
  demolition: [
    {
      id: 'structureType',
      question: 'What type of structure?',
      type: 'select',
      options: [
        { value: 'house', label: 'House/Dwelling' },
        { value: 'garage', label: 'Garage/Outbuilding' },
        { value: 'shed', label: 'Shed' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'sqft',
      question: 'Square footage of structure?',
      type: 'number',
      placeholder: 'e.g., 1200',
    },
  ],
};

export interface PermitResult {
  cityPermit: {
    required: boolean;
    type?: string;
    fee?: string;
    timeline?: string;
    explanation?: string;
  };
  countyPermit: {
    required: boolean;
    type?: string;
    fee?: string;
    timeline?: string;
    explanation?: string;
  };
  documents: RequiredDocument[];
  specialRequirements: string[];
}

export interface RequiredDocument {
  name: string;
  jurisdiction: 'city' | 'county' | 'both';
  required: boolean;
  description: string;
  downloadUrl?: string;
}

export function determinePermits(
  projectType: ProjectCategory,
  answers: Record<string, any>
): PermitResult {
  const result: PermitResult = {
    cityPermit: { required: false },
    countyPermit: { required: false },
    documents: [],
    specialRequirements: [],
  };

  switch (projectType) {
    case 'shed':
      const shedSqft = parseFloat(answers.sqft) || 0;
      const shedHeight = parseFloat(answers.height) || 0;
      const hasElectrical = answers.electrical === true;

      if (shedSqft > 200 || shedHeight > 10) {
        result.cityPermit = {
          required: true,
          type: 'Zoning Permit',
          fee: '$150+',
          timeline: 'Up to 1 week',
          explanation: 'Sheds over 200 sq ft or 10ft height require city zoning approval.',
        };
      }
      if (shedSqft > 200 || hasElectrical) {
        result.countyPermit = {
          required: true,
          type: 'Residential Building Permit',
          fee: hasElectrical ? '$200+' : '$150+',
          timeline: 'Up to 30 days',
          explanation: 'Structures over 200 sq ft or with electrical require county building permit.',
        };
      }
      break;

    case 'deck':
      const deckHeight = parseFloat(answers.height) || 0;
      const attached = answers.attached === true;
      const covered = answers.covered === true;

      if (deckHeight > 30 || attached || covered) {
        result.cityPermit = {
          required: true,
          type: 'Zoning Permit',
          fee: '$150+',
          timeline: 'Up to 1 week',
          explanation: 'Decks over 30" high, attached to dwelling, or covered require city approval.',
        };
        result.countyPermit = {
          required: true,
          type: 'Residential Building Permit',
          fee: '$200+',
          timeline: 'Up to 30 days',
          explanation: 'Attached or elevated decks require county building permit.',
        };
      }
      break;

    case 'pool':
      result.cityPermit = {
        required: true,
        type: 'Pool Permit',
        fee: '$200+',
        timeline: 'Up to 1 week',
        explanation: 'All pools require city zoning approval.',
      };
      result.countyPermit = {
        required: true,
        type: 'Residential Building Permit',
        fee: '$250+',
        timeline: 'Up to 30 days',
        explanation: 'All pools require county building permit and inspection.',
      };
      if (answers.historic === true) {
        result.specialRequirements.push('Historic District Review (additional 14 days)');
      }
      if (answers.enclosure === false) {
        result.specialRequirements.push('Safety enclosure required before pool can be filled');
      }
      break;

    case 'fence':
      const fenceHeight = parseFloat(answers.height) || 0;
      const location = answers.location;

      if (fenceHeight > 6 || location === 'front' || location === 'both') {
        result.cityPermit = {
          required: true,
          type: 'Fence Permit',
          fee: '$50',
          timeline: 'Up to 1 week',
          explanation: 'Fences over 6ft or in front yard require city zoning approval.',
        };
      }
      break;

    case 'addition':
      const addValue = parseFloat(answers.projectValue) || 0;
      result.cityPermit = {
        required: true,
        type: 'Zoning Permit',
        fee: `$${Math.max(150, Math.round(addValue * 0.01))}`,
        timeline: 'Up to 1 week',
        explanation: 'All additions require city zoning approval (1% of project value).',
      };
      result.countyPermit = {
        required: true,
        type: 'Residential Building Permit',
        fee: '$300+',
        timeline: 'Up to 30 days',
        explanation: 'All additions require county building permit and plan review.',
      };
      break;

    case 'interior':
      const intValue = parseFloat(answers.projectValue) || 0;
      result.countyPermit = {
        required: true,
        type: 'Residential Alteration Permit',
        fee: `$${Math.max(100, Math.round(intValue * 0.01))}`,
        timeline: 'Up to 14 days',
        explanation: 'Interior work requires county building permit.',
      };
      break;

    case 'trade':
      const tradeType = answers.tradeType;
      const fees: Record<string, string> = {
        electrical: '$75',
        plumbing: '$50',
        hvac: '$100',
        multiple: '$150+',
      };
      result.countyPermit = {
        required: true,
        type: `${tradeType?.charAt(0).toUpperCase()}${tradeType?.slice(1)} Permit`,
        fee: fees[tradeType] || '$75',
        timeline: '3-5 days',
        explanation: 'All trade work requires county permit and inspection.',
      };
      break;

    case 'demolition':
      result.cityPermit = {
        required: true,
        type: 'Zoning Clearance',
        fee: '$100',
        timeline: 'Up to 1 week',
        explanation: 'Demolition requires city zoning clearance.',
      };
      result.countyPermit = {
        required: true,
        type: 'Demolition Permit',
        fee: '$150+',
        timeline: 'Up to 14 days',
        explanation: 'Demolition requires county permit and safety inspection.',
      };
      break;
  }

  // Generate documents based on permits
  if (result.cityPermit.required) {
    result.documents.push({
      name: 'City Zoning Permit Application',
      jurisdiction: 'city',
      required: true,
      description: 'Primary application for city zoning approval',
      downloadUrl: '#',
    });
  }
  if (result.countyPermit.required) {
    result.documents.push({
      name: projectType === 'interior' 
        ? 'Residential Alteration Permit' 
        : 'Residential Building Permit',
      jurisdiction: 'county',
      required: true,
      description: 'Primary application for county building approval',
      downloadUrl: '#',
    });
  }
  if (projectType === 'pool') {
    result.documents.push({
      name: 'Pool Permit Application',
      jurisdiction: 'city',
      required: true,
      description: 'Pool-specific application with safety plan',
      downloadUrl: '#',
    });
  }
  if (projectType === 'fence' && result.cityPermit.required) {
    result.documents.push({
      name: 'Fence Permit Application',
      jurisdiction: 'city',
      required: true,
      description: 'Fence-specific application with site plan',
      downloadUrl: '#',
    });
  }

  return result;
}