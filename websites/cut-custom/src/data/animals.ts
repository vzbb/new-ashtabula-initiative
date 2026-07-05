import { AnimalType, Cut } from '../types';

type AnimalEntry = {
  name: string;
  description: string;
  icon: 'beef' | 'piggy-bank' | 'bird';
  cuts: Cut[];
};

export const animals: Record<AnimalType, AnimalEntry> = {
  cow: {
    name: 'Beef',
    description: 'Premium beef cuts for grilling, roasting, and slow cooking.',
    icon: 'beef',
    cuts: [
      { id: 'c-chuck', name: 'Chuck', description: 'Rich and versatile for roasts or ground beef.', pricePerLb: 8.5, popular: true },
      { id: 'c-brisket', name: 'Brisket', description: 'Slow-smoke favorite with deep beef flavor.', pricePerLb: 9.75 },
      { id: 'c-rib', name: 'Rib', description: 'Premium steaks and rib roasts.', pricePerLb: 16.0, popular: true },
      { id: 'c-shortplate', name: 'Plate', description: 'Great for short ribs and skirt-style cuts.', pricePerLb: 10.25 },
      { id: 'c-loin', name: 'Loin', description: 'Tender cuts for strip steaks and roasts.', pricePerLb: 18.5, popular: true },
      { id: 'c-flank', name: 'Flank', description: 'Lean cut ideal for marinades and slicing thin.', pricePerLb: 11.0 },
      { id: 'c-sirloin', name: 'Sirloin', description: 'Balanced flavor and tenderness for everyday cooking.', pricePerLb: 14.25, popular: true },
      { id: 'c-round', name: 'Round', description: 'Lean, economical cuts for roasts and steaks.', pricePerLb: 9.0 },
      { id: 'c-shank', name: 'Shank', description: 'Best for broth, osso buco, and braising.', pricePerLb: 6.5 },
      { id: 'c-shank-hind', name: 'Hind Shank', description: 'Dense, flavorful braising cut from the rear leg.', pricePerLb: 6.75 },
    ],
  },
  pig: {
    name: 'Pork',
    description: 'Classic pork cuts from roasts to ribs, belly, and ham.',
    icon: 'piggy-bank',
    cuts: [
      { id: 'p-jowl', name: 'Jowl', description: 'Rich cured-meat cut with high fat content.', pricePerLb: 5.25 },
      { id: 'p-shoulder', name: 'Boston Butt', description: 'Ideal for pulled pork and smoking.', pricePerLb: 6.5, popular: true },
      { id: 'p-picnic', name: 'Picnic', description: 'Budget-friendly shoulder cut for roasts and braises.', pricePerLb: 5.75 },
      { id: 'p-loin', name: 'Loin', description: 'Tender chops and roasts with mild flavor.', pricePerLb: 8.75, popular: true },
      { id: 'p-spareribs', name: 'Spare Ribs', description: 'Meaty ribs for smoking or grilling.', pricePerLb: 7.25 },
      { id: 'p-belly', name: 'Belly', description: 'Great for bacon, porchetta, and crispy roasts.', pricePerLb: 9.5, popular: true },
      { id: 'p-ham', name: 'Ham', description: 'Lean rear leg cuts for roasts or curing.', pricePerLb: 7.0 },
      { id: 'p-hock-front', name: 'Front Hock', description: 'Flavorful soup and braise cut from the front leg.', pricePerLb: 4.5 },
      { id: 'p-hock-hind', name: 'Hind Hock', description: 'Hearty rear-leg hock for stews and stock.', pricePerLb: 4.75 },
    ],
  },
  chicken: {
    name: 'Chicken',
    description: 'Everyday poultry cuts for fast meals, roasting, and grilling.',
    icon: 'bird',
    cuts: [
      { id: 'ch-breast', name: 'Breast', description: 'Lean, boneless-friendly cut for quick cooking.', pricePerLb: 6.25, popular: true },
      { id: 'ch-wing', name: 'Wing', description: 'Party wings and snack-sized favorites.', pricePerLb: 4.0 },
      { id: 'ch-thigh', name: 'Thigh', description: 'Juicy dark meat for roasting or grilling.', pricePerLb: 5.5, popular: true },
      { id: 'ch-drumstick', name: 'Drumstick', description: 'Family-friendly cut with classic roast flavor.', pricePerLb: 4.75 },
    ],
  },
};
