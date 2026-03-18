export interface FeeSchedule {
  projectType: string;
  cityFee: {
    base: number;
    percentage?: number;
    minimum?: number;
    maximum?: number;
    perSqFt?: number;
    description: string;
  };
  countyFee: {
    base: number;
    percentage?: number;
    minimum?: number;
    perSqFt?: number;
    planReviewThreshold?: number;
    planReviewPercentage?: number;
    description: string;
  };
}

// Fee schedules based on FEE-SCHEDULE.md
export const feeSchedules: FeeSchedule[] = [
  {
    projectType: 'shed',
    cityFee: {
      base: 0,
      percentage: 0.01,
      minimum: 50,
      description: 'Zoning Permit (1% of project value, min $50)',
    },
    countyFee: {
      base: 150,
      perSqFt: 0.15,
      description: 'Building Permit ($150 base + $0.15/sq ft)',
    },
  },
  {
    projectType: 'deck',
    cityFee: {
      base: 0,
      percentage: 0.01,
      minimum: 50,
      description: 'Zoning Permit (1% of project value, min $50)',
    },
    countyFee: {
      base: 100,
      perSqFt: 0.15,
      description: 'Building Permit ($100 base + $0.15/sq ft)',
    },
  },
  {
    projectType: 'pool',
    cityFee: {
      base: 150,
      description: 'Pool Permit ($150 base + $50/safety inspection)',
    },
    countyFee: {
      base: 200,
      description: 'Building Permit ($200 flat fee)',
    },
  },
  {
    projectType: 'fence',
    cityFee: {
      base: 50,
      description: 'Fence Permit ($50 flat fee per property line)',
    },
    countyFee: {
      base: 0,
      description: 'No county permit required',
    },
  },
  {
    projectType: 'addition',
    cityFee: {
      base: 0,
      percentage: 0.01,
      minimum: 50,
      maximum: 2500,
      description: 'Zoning Permit (1% of project value, $50-$2,500)',
    },
    countyFee: {
      base: 150,
      perSqFt: 0.20,
      planReviewThreshold: 50000,
      planReviewPercentage: 0.20,
      description: 'Building Permit ($150 base + $0.20/sq ft)',
    },
  },
  {
    projectType: 'interior',
    cityFee: {
      base: 0,
      description: 'No city permit required',
    },
    countyFee: {
      base: 150,
      perSqFt: 0.15,
      description: 'Alteration Permit ($150 base + $0.15/sq ft)',
    },
  },
  {
    projectType: 'trade',
    cityFee: {
      base: 0,
      description: 'No city permit required',
    },
    countyFee: {
      base: 75,
      description: 'Trade Permit (base $75, varies by type)',
    },
  },
  {
    projectType: 'demolition',
    cityFee: {
      base: 100,
      description: 'Zoning Clearance ($100 base + $25/structure)',
    },
    countyFee: {
      base: 100,
      description: 'Demolition Permit ($100 flat fee)',
    },
  },
];

export interface FeeCalculationOptions {
  projectValue?: number;
  squareFootage?: number;
  historicDistrict?: boolean;
}

export function calculateFees(
  projectType: string,
  options: FeeCalculationOptions = {}
): { cityFee: number; countyFee: number; total: number; breakdown: string[]; notes: string[] } {
  const { projectValue = 0, squareFootage = 0, historicDistrict = false } = options;
  const schedule = feeSchedules.find((s) => s.projectType === projectType);
  
  if (!schedule) {
    return { cityFee: 0, countyFee: 0, total: 0, breakdown: [], notes: [] };
  }

  const breakdown: string[] = [];
  const notes: string[] = [];

  // Calculate city fee
  let cityFee = schedule.cityFee.base;
  
  if (schedule.cityFee.percentage && projectValue > 0) {
    cityFee = projectValue * schedule.cityFee.percentage;
    // Apply minimum
    if (schedule.cityFee.minimum && cityFee < schedule.cityFee.minimum) {
      cityFee = schedule.cityFee.minimum;
      notes.push(`City fee adjusted to minimum $${schedule.cityFee.minimum}`);
    }
    // Apply maximum cap
    if (schedule.cityFee.maximum && cityFee > schedule.cityFee.maximum) {
      cityFee = schedule.cityFee.maximum;
      notes.push(`City fee capped at maximum $${schedule.cityFee.maximum.toLocaleString()}`);
    }
  }

  // Add historic district surcharge if applicable
  if (historicDistrict && cityFee > 0) {
    cityFee += 100; // Historic Review Certificate
    notes.push('Historic District Review Certificate: +$100');
  }

  if (cityFee > 0) {
    breakdown.push(`City: $${Math.round(cityFee)} — ${schedule.cityFee.description}`);
  }

  // Calculate county fee
  let countyFee = schedule.countyFee.base;
  
  // Add per sq ft rate if applicable
  if (schedule.countyFee.perSqFt && squareFootage > 0) {
    countyFee += squareFootage * schedule.countyFee.perSqFt;
  }

  // Add plan review fee if project value exceeds threshold
  if (schedule.countyFee.planReviewThreshold && schedule.countyFee.planReviewPercentage && 
      projectValue > schedule.countyFee.planReviewThreshold) {
    const planReviewFee = countyFee * schedule.countyFee.planReviewPercentage;
    countyFee += planReviewFee;
    notes.push(`Plan review fee (20%): +$${Math.round(planReviewFee)}`);
  }

  if (countyFee > 0) {
    breakdown.push(`County: $${Math.round(countyFee)} — ${schedule.countyFee.description}`);
  }

  // Add additional notes based on project type
  if (projectType === 'pool') {
    notes.push('Pool safety inspection: +$50 (not included in estimate)');
  }
  if (projectType === 'demolition') {
    notes.push('Additional $25 per structure may apply');
  }

  return {
    cityFee: Math.round(cityFee),
    countyFee: Math.round(countyFee),
    total: Math.round(cityFee + countyFee),
    breakdown,
    notes,
  };
}

// Helper to get fee range for a project type
export function getFeeRange(projectType: string): { min: number; max: number; typical: string } {
  const ranges: Record<string, { min: number; max: number; typical: string }> = {
    shed: { min: 245, max: 500, typical: '$275-$400' },
    deck: { min: 160, max: 600, typical: '$300-$500' },
    pool: { min: 350, max: 450, typical: '$400' },
    fence: { min: 50, max: 50, typical: '$50' },
    addition: { min: 200, max: 3000, typical: '$500-$1,500' },
    interior: { min: 150, max: 600, typical: '$200-$400' },
    trade: { min: 75, max: 200, typical: '$75-$150' },
    demolition: { min: 200, max: 300, typical: '$225' },
  };
  return ranges[projectType] || { min: 0, max: 0, typical: 'Varies' };
}