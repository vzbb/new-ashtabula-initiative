import { useState } from 'react';
import { AnimalType, animals, Cut } from '../data/animals';
import { CartItem } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Minus, ShoppingBag, Check, Beef } from 'lucide-react';
import CutDiagram from './CutDiagram';

interface CutSheetProps {
  animalType: AnimalType;
  onBack: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  cartItems: CartItem[];
}

export default function CutSheet({ animalType, onBack, onAddToCart, cartItems }: CutSheetProps) {
  const animal = animals[animalType];
  const [selectedCut, setSelectedCut] = useState<Cut | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (selectedCut) {
      onAddToCart({
        animalType,
        cut: selectedCut,
        quantityLbs: quantity,
      });
      setSelectedCut(null);
      setQuantity(1);
    }
  };

  const getCutQuantityInCart = (cutId: string) => {
    return cartItems
      .filter(item => item.cut.id === cutId)
      .reduce((sum, item) => sum + item.quantityLbs, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-stone-500 hover:text-stone-800 transition-colors mb-8 font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Livestock
      </button>

      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-4">{animal.name} Cut Sheet</h1>
        <p className="text-xl text-stone-600 max-w-3xl">
          Select the specific cuts you want from the diagram below. Customize your order by choosing the exact weight in pounds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Diagram & List */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <CutDiagram 
            animalType={animalType} 
            selectedCutId={selectedCut?.id || null} 
            onSelectCut={(id) => {
              const cut = animal.cuts.find(c => c.id === id);
              if (cut) {
                setSelectedCut(cut);
                setQuantity(1);
              }
            }} 
          />
          
          {/* List of cuts as pills */}
          <div>
            <h3 className="text-xl font-serif text-stone-800 mb-4">All Available Cuts</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {animal.cuts.map((cut) => {
                const isSelected = selectedCut?.id === cut.id;
                const inCartQty = getCutQuantityInCart(cut.id);
                return (
                  <button
                    key={cut.id}
                    onClick={() => {
                      setSelectedCut(cut);
                      setQuantity(1);
                    }}
                    className={`
                      relative px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all flex flex-col items-start justify-center group overflow-hidden
                      ${isSelected 
                        ? 'border-amber-600 bg-amber-50 shadow-md transform scale-[1.02]' 
                        : 'border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:shadow-sm'
                      }
                    `}
                  >
                    {isSelected && (
                      <motion.div 
                        layoutId="activeCut" 
                        className="absolute inset-0 bg-amber-100/40" 
                        initial={false} 
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} 
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <span className={`flex items-center ${isSelected ? 'text-amber-900' : ''}`}>
                        {isSelected && <Check className="w-4 h-4 mr-1.5 text-amber-600" />}
                        {cut.name}
                      </span>
                      {inCartQty > 0 && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${isSelected ? 'bg-amber-800 text-amber-100' : 'bg-emerald-100 text-emerald-700'}`}>
                          {inCartQty} lbs
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selection Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-stone-50 rounded-3xl p-8 border border-stone-200 shadow-sm">
            {selectedCut ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedCut.id}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-3xl font-serif text-stone-900">{selectedCut.name}</h3>
                  {selectedCut.popular && (
                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-stone-600 mb-6">{selectedCut.description}</p>
                
                <div className="flex justify-between items-end mb-8 pb-6 border-b border-stone-200">
                  <div>
                    <span className="text-sm text-stone-500 uppercase tracking-wider font-semibold block mb-1">Price</span>
                    <span className="text-3xl font-medium text-stone-900">${selectedCut.pricePerLb.toFixed(2)}<span className="text-lg text-stone-500 font-normal">/lb</span></span>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-sm text-stone-500 uppercase tracking-wider font-semibold block mb-3">Quantity (lbs)</label>
                  <div className="flex items-center justify-between bg-white border border-stone-200 rounded-xl p-2">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-medium text-stone-800 w-16 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-stone-600 font-medium">Estimated Total:</span>
                  <span className="text-2xl font-serif text-stone-900">${(selectedCut.pricePerLb * quantity).toFixed(2)}</span>
                </div>

                <button
                  onClick={handleAdd}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center transition-colors shadow-md"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cut Sheet
                </button>
              </motion.div>
            ) : (
              <div className="text-center py-16 text-stone-400">
                <Beef className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium text-stone-500">Select a cut from the diagram to customize your order</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
