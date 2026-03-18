export const projectCategories = [
  { value: 'roofing', label: 'Roofing', icon: '🏠' },
  { value: 'plumbing', label: 'Plumbing', icon: '🚿' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'hvac', label: 'HVAC', icon: '❄️' },
  { value: 'landscaping', label: 'Landscaping', icon: '🌳' },
  { value: 'remodeling', label: 'Remodeling', icon: '🔨' },
  { value: 'painting', label: 'Painting', icon: '🎨' },
  { value: 'flooring', label: 'Flooring', icon: '🪵' },
  { value: 'decks_fences', label: 'Decks & Fences', icon: '🏡' },
  { value: 'handyman', label: 'General Handyman', icon: '🛠️' },
]

export const subcategories: Record<string, string[]> = {
  roofing: ['Repair', 'Replacement', 'Inspection', 'Gutters', 'Skylights'],
  plumbing: ['Leak Repair', 'Pipe Replacement', 'Water Heater', 'Drain Cleaning', 'Fixture Installation'],
  electrical: ['Panel Upgrade', 'Wiring', 'Lighting Installation', 'Outlet Installation', 'Ceiling Fan'],
  hvac: ['AC Repair', 'Furnace Repair', 'Installation', 'Maintenance', 'Ductwork'],
  landscaping: ['Lawn Care', 'Tree Removal', 'Hardscaping', 'Garden Design', 'Irrigation'],
  remodeling: ['Kitchen', 'Bathroom', 'Basement', 'Addition', 'Whole House'],
  painting: ['Interior', 'Exterior', 'Cabinet', 'Deck Staining', 'Power Washing'],
  flooring: ['Hardwood', 'Tile', 'Carpet', 'Vinyl', 'Laminate'],
  decks_fences: ['Deck Building', 'Deck Repair', 'Fence Installation', 'Fence Repair', 'Pergola'],
  handyman: ['Furniture Assembly', 'TV Mounting', 'Drywall Repair', 'Door Repair', 'General Repairs'],
}