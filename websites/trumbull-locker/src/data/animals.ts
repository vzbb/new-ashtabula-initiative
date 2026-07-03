export type AnimalType = 'cow' | 'pig' | 'chicken';

export interface Cut {
  id: string;
  name: string;
  description: string;
  pricePerLb: number;
  image?: string;
  popular?: boolean;
}

export interface Animal {
  id: AnimalType;
  name: string;
  description: string;
  icon: string;
  cuts: Cut[];
}

export const animals: Record<AnimalType, Animal> = {
  cow: {
    id: 'cow',
    name: 'Beef',
    description: 'Premium grass-fed beef cuts, perfect for grilling, roasting, and slow cooking.',
    icon: 'beef',
    cuts: [
      { id: 'c-chuck', name: 'Chuck', description: 'Rich flavor, great for slow cooking and pot roasts.', pricePerLb: 6.99, popular: true },
      { id: 'c-rib', name: 'Rib', description: 'Tender and flavorful. Includes Ribeye and Prime Rib.', pricePerLb: 18.99, popular: true },
      { id: 'c-loin', name: 'Loin', description: 'The most tender cuts. Includes T-Bone, Porterhouse, and Tenderloin.', pricePerLb: 22.99, popular: true },
      { id: 'c-sirloin', name: 'Sirloin', description: 'Lean and versatile. Great for grilling and pan-searing.', pricePerLb: 12.99 },
      { id: 'c-round', name: 'Round', description: 'Lean cuts from the rear leg. Good for roasts and cube steaks.', pricePerLb: 7.99 },
      { id: 'c-brisket', name: 'Brisket', description: 'Tough cut that becomes incredibly tender when smoked slow and low.', pricePerLb: 8.99, popular: true },
      { id: 'c-shortplate', name: 'Short Plate', description: 'Fatty and flavorful. Includes short ribs and skirt steak.', pricePerLb: 10.99 },
      { id: 'c-flank', name: 'Flank', description: 'Lean and muscular. Perfect for fajitas and stir-fry.', pricePerLb: 11.99 },
      { id: 'c-shank', name: 'Shank', description: 'Tough, sinewy cut. Excellent for braising (Osso Buco) and soups.', pricePerLb: 5.99 },
    ],
  },
  pig: {
    id: 'pig',
    name: 'Pork',
    description: 'Heritage breed pork, offering rich marbling and exceptional flavor.',
    icon: 'piggy-bank',
    cuts: [
      { id: 'p-shoulder', name: 'Shoulder (Boston Butt)', description: 'Well-marbled, ideal for pulled pork and slow roasting.', pricePerLb: 4.99, popular: true },
      { id: 'p-picnic', name: 'Picnic Shoulder', description: 'Great for roasts and making sausage.', pricePerLb: 3.99 },
      { id: 'p-loin', name: 'Loin', description: 'Lean and tender. Includes pork chops and baby back ribs.', pricePerLb: 6.99, popular: true },
      { id: 'p-belly', name: 'Belly', description: 'Fatty and rich. Used for bacon and pancetta.', pricePerLb: 7.99, popular: true },
      { id: 'p-spareribs', name: 'Spare Ribs', description: 'Meaty ribs from the belly, perfect for BBQ.', pricePerLb: 5.99, popular: true },
      { id: 'p-ham', name: 'Ham (Leg)', description: 'Lean meat, often cured or smoked for holiday roasts.', pricePerLb: 4.49 },
      { id: 'p-jowl', name: 'Jowl', description: 'Rich, fatty cheek meat. Used for Guanciale.', pricePerLb: 8.99 },
      { id: 'p-hock', name: 'Hock', description: 'Flavorful cut used to enrich soups and stews.', pricePerLb: 3.49 },
    ],
  },
  chicken: {
    id: 'chicken',
    name: 'Poultry',
    description: 'Pasture-raised chicken, tender and juicy for any occasion.',
    icon: 'bird',
    cuts: [
      { id: 'ch-whole', name: 'Whole Chicken', description: 'Perfect for Sunday roasting or breaking down yourself.', pricePerLb: 3.99, popular: true },
      { id: 'ch-breast', name: 'Breast', description: 'Lean white meat, boneless and skinless.', pricePerLb: 6.99, popular: true },
      { id: 'ch-thigh', name: 'Thigh', description: 'Flavorful dark meat, great for grilling or braising.', pricePerLb: 4.99, popular: true },
      { id: 'ch-drumstick', name: 'Drumstick', description: 'Classic dark meat on the bone, perfect for frying or baking.', pricePerLb: 3.49 },
      { id: 'ch-wing', name: 'Wing', description: 'Great for appetizers and game day.', pricePerLb: 4.49 },
    ],
  },
};
