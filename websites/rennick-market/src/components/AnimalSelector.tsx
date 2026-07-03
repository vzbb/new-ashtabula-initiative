import { AnimalType, animals } from '../data/animals';
import { Beef, PiggyBank, Bird, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AnimalSelectorProps {
  onSelect: (animalType: AnimalType) => void;
}

export default function AnimalSelector({ onSelect }: AnimalSelectorProps) {
  const brandPromises = [
    'Historic Bridge Street butcher counter',
    'Freezer packs, steaks, roasts, and custom trim',
    'Built for pickup-friendly local ordering',
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'beef': return <Beef className="w-12 h-12 text-amber-800" />;
      case 'piggy-bank': return <PiggyBank className="w-12 h-12 text-pink-600" />;
      case 'bird': return <Bird className="w-12 h-12 text-orange-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#f4e6d7] text-[#6a2b2b] text-sm font-semibold uppercase tracking-[0.28em] mb-6">
          Rennick Meat Market
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-[#4b1a1a] mb-4">Historic Bridge Street cut sheets</h2>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Custom cuts, freezer packs, and restaurant-ready orders from Ashtabula Harbor's butcher market.
        </p>
        <div className="mt-8 grid gap-3 text-left md:grid-cols-3">
          {brandPromises.map((promise) => (
            <div
              key={promise}
              className="rounded-2xl border border-[#e6d8c6] bg-white/80 px-5 py-4 text-sm font-medium text-stone-700 shadow-sm"
            >
              {promise}
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-3xl border border-[#d7bb7a] bg-[#fcf4ee] px-6 py-5 text-left shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8b6b45]">How the demo reads</p>
          <p className="mt-3 text-base leading-7 text-stone-700">
            Customers start with beef, pork, or poultry, build a cut sheet in pounds, and send Rennick a clean pickup request instead of calling in every detail.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(Object.keys(animals) as AnimalType[]).map((key) => {
          const animal = animals[key];
          return (
            <motion.button
              key={key}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(key)}
              className="bg-white rounded-3xl p-8 shadow-sm border border-[#e6d8c6] text-left flex flex-col items-start transition-shadow hover:shadow-xl group"
            >
              <div className="bg-[#f4e6d7] p-4 rounded-2xl mb-6 group-hover:bg-[#ebd6c0] transition-colors">
                {getIcon(animal.icon)}
              </div>
              <h3 className="text-2xl font-serif text-[#4b1a1a] mb-3">{animal.name}</h3>
              <p className="text-stone-600 mb-8 flex-grow">{animal.description}</p>
              <div className="flex items-center text-[#6a2b2b] font-medium group-hover:text-[#4b1a1a]">
                <span>View Cut Sheet</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
