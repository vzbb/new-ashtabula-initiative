import { AnimalType, animals } from '../data/animals';
import { Beef, PiggyBank, Bird, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AnimalSelectorProps {
  onSelect: (animalType: AnimalType) => void;
}

export default function AnimalSelector({ onSelect }: AnimalSelectorProps) {
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
        <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">Select Your Livestock</h2>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Choose from our premium, pasture-raised animals. Build your custom cut sheet and order exactly what you need for your freezer.
        </p>
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
              className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 text-left flex flex-col items-start transition-shadow hover:shadow-xl group"
            >
              <div className="bg-stone-100 p-4 rounded-2xl mb-6 group-hover:bg-stone-200 transition-colors">
                {getIcon(animal.icon)}
              </div>
              <h3 className="text-2xl font-serif text-stone-800 mb-3">{animal.name}</h3>
              <p className="text-stone-600 mb-8 flex-grow">{animal.description}</p>
              <div className="flex items-center text-amber-700 font-medium group-hover:text-amber-800">
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
