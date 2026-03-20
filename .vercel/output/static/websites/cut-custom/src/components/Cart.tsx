import { CartItem } from '../types';
import { animals } from '../data/animals';
import { motion } from 'motion/react';
import { Trash2, ArrowLeft, Receipt } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onBack: () => void;
  onCheckout: () => void;
}

export default function Cart({ items, onRemove, onBack, onCheckout }: CartProps) {
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.animalType]) {
      acc[item.animalType] = [];
    }
    acc[item.animalType].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const total = items.reduce((sum, item) => sum + item.cut.pricePerLb * item.quantityLbs, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={onBack}
        className="flex items-center text-stone-500 hover:text-stone-800 transition-colors mb-8 font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Continue Shopping
      </button>

      <div className="flex items-center justify-between mb-12 border-b border-stone-200 pb-8">
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 flex items-center">
          <Receipt className="w-10 h-10 mr-4 text-amber-800" />
          Your Cut Sheet
        </h1>
        <div className="text-right">
          <span className="text-sm text-stone-500 uppercase tracking-wider font-semibold block mb-1">Estimated Total</span>
          <span className="text-3xl font-medium text-stone-900">${total.toFixed(2)}</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-stone-50 rounded-3xl border border-stone-200">
          <Receipt className="w-16 h-16 mx-auto mb-6 text-stone-300" />
          <h2 className="text-2xl font-serif text-stone-800 mb-2">Your cut sheet is empty</h2>
          <p className="text-stone-500 mb-8 max-w-md mx-auto">Looks like you haven't selected any cuts yet. Head back to the farm to start building your order.</p>
          <button
            onClick={onBack}
            className="bg-stone-800 hover:bg-stone-900 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Browse Livestock
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedItems).map(([animalType, animalItems]) => {
            const animal = animals[animalType as keyof typeof animals];
            const animalTotal = animalItems.reduce((sum, item) => sum + item.cut.pricePerLb * item.quantityLbs, 0);

            return (
              <div key={animalType} className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
                  <h2 className="text-2xl font-serif text-stone-800 capitalize flex items-center">
                    {animal.name} Cuts
                  </h2>
                  <span className="text-lg font-medium text-stone-600">${animalTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-4">
                  {animalItems.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 group hover:border-stone-200 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-stone-900 mb-1">{item.cut.name}</h3>
                        <div className="flex items-center text-sm text-stone-500 space-x-4">
                          <span>{item.quantityLbs} lbs</span>
                          <span>&times;</span>
                          <span>${item.cut.pricePerLb.toFixed(2)}/lb</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <span className="text-xl font-medium text-stone-800">
                          ${(item.cut.pricePerLb * item.quantityLbs).toFixed(2)}
                        </span>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-stone-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex justify-end pt-8">
            <button
              onClick={onCheckout}
              className="bg-amber-800 hover:bg-amber-900 text-white px-12 py-4 rounded-2xl font-medium text-lg shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0"
            >
              Submit Order to Butcher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
