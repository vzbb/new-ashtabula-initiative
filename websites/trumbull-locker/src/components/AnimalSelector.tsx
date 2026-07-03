import { AnimalType, animals } from '../data/animals';
import { Beef, PiggyBank, Bird, ArrowRight, Phone, Clock3, Flame } from 'lucide-react';
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
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#e7efe6] text-[#254336] text-sm font-semibold uppercase tracking-[0.28em] mb-6">
          Trumbull Meat Locker
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-[#24382f] mb-4">Trumbull Meat Locker cut sheets</h2>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Family-owned since 1947, Trumbull Locker helps Northeast Ohio families and farmers turn custom processing orders into ready-for-the-freezer cut sheets.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-[#d8d0c2] bg-white px-6 py-5 text-left shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4eadc] text-[#7b341e]">
              <Flame className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7b341e]">Since 1947</p>
            <p className="mt-2 text-stone-600">Heritage processing rooted in hickory-smoked meats and longtime local trust.</p>
          </div>
          <div className="rounded-3xl border border-[#d8d0c2] bg-white px-6 py-5 text-left shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7efe6] text-[#254336]">
              <Clock3 className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#254336]">Fresh cuts 7 days</p>
            <p className="mt-2 text-stone-600">Build a freezer order for beef, pork, lamb, or goat with locker-ready quantities.</p>
          </div>
          <div className="rounded-3xl border border-[#d8d0c2] bg-white px-6 py-5 text-left shadow-sm">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7efe6] text-[#254336]">
              <Phone className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#254336]">Need help?</p>
            <p className="mt-2 text-stone-600">Call 440-474-4631 if you want the locker team to walk through your order.</p>
          </div>
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
              className="bg-white rounded-3xl p-8 shadow-sm border border-[#d8d0c2] text-left flex flex-col items-start transition-shadow hover:shadow-xl group"
            >
              <div className="bg-[#e7efe6] p-4 rounded-2xl mb-6 group-hover:bg-[#d9e5d7] transition-colors">
                {getIcon(animal.icon)}
              </div>
              <h3 className="text-2xl font-serif text-[#24382f] mb-3">{animal.name}</h3>
              <p className="text-stone-600 mb-8 flex-grow">{animal.description}</p>
              <div className="flex items-center text-[#254336] font-medium group-hover:text-[#24382f]">
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
