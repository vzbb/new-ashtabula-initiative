export type AnimalType = 'cow' | 'pig' | 'chicken';

export interface Cut {
  id: string;
  name: string;
  description: string;
  pricePerLb: number;
  popular?: boolean;
}

export interface CartItem {
  id: string;
  animalType: AnimalType;
  cut: Cut;
  quantityLbs: number;
}

export type ViewState = 'home' | 'cut-sheet' | 'cart';
