import { AnimalType, Cut } from './data/animals';

export interface CartItem {
  id: string;
  animalType: AnimalType;
  cut: Cut;
  quantityLbs: number;
}

export type ViewState = 'home' | 'cut-sheet' | 'cart';
