import { useState } from 'react';
import { AnimalType } from './data/animals';
import { CartItem, ViewState } from './types';
import AnimalSelector from './components/AnimalSelector';
import CutSheet from './components/CutSheet';
import Cart from './components/Cart';
import { ShoppingBag, Beef } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const logoSrc = `${import.meta.env.BASE_URL}trumbull-logo.png`;

  const handleSelectAnimal = (animalType: AnimalType) => {
    setSelectedAnimal(animalType);
    setView('cut-sheet');
  };

  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCart((prev) => [...prev, newItem]);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setOrderSubmitted(true);
    setTimeout(() => {
      setCart([]);
      setOrderSubmitted(false);
      setView('home');
    }, 3000);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantityLbs, 0);

  return (
    <div className="min-h-screen bg-[#f2efe7] font-sans text-stone-900 selection:bg-[#b9cbb6]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur border-b border-[#d8d0c2] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button 
            onClick={() => setView('home')}
            className="flex items-center space-x-3 group"
          >
            <img src={logoSrc} alt="Trumbull Meat Locker" className="h-12 w-12 object-contain rounded-xl bg-white p-1 shadow-sm" />
            <div className="text-left">
              <span className="block text-2xl font-serif font-medium tracking-tight text-[#24382f]">Trumbull Meat Locker</span>
              <span className="block text-[0.7rem] uppercase tracking-[0.34em] text-[#6b7d6f]">Rock Creek, OH • Cut Sheets and Freezer Orders</span>
            </div>
          </button>

          <button
            onClick={() => setView('cart')}
            className="flex items-center space-x-2 bg-[#e7efe6] hover:bg-[#d9e5d7] px-5 py-2.5 rounded-full transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5 text-[#254336]" />
            <span className="font-medium text-[#24382f]">Cut Sheet</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#254336] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        <AnimatePresence mode="wait">
          {orderSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto px-4 py-32 text-center"
              >
              <div className="w-24 h-24 bg-[#dde8db] text-[#254336] rounded-full flex items-center justify-center mx-auto mb-8">
                <Beef className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-serif text-[#24382f] mb-4">Order Sent to Trumbull Meat Locker!</h2>
              <p className="text-xl text-stone-600">
                Your custom cut sheet has been submitted. Our Rock Creek team will review it and reach out when your order is ready.
              </p>
            </motion.div>
          ) : view === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AnimalSelector onSelect={handleSelectAnimal} />
            </motion.div>
          ) : view === 'cut-sheet' && selectedAnimal ? (
            <motion.div
              key="cut-sheet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CutSheet
                animalType={selectedAnimal}
                onBack={() => setView('home')}
                onAddToCart={handleAddToCart}
                cartItems={cart}
              />
            </motion.div>
          ) : view === 'cart' ? (
            <motion.div
              key="cart"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <Cart
                items={cart}
                onRemove={handleRemoveFromCart}
                onBack={() => setView('home')}
                onCheckout={handleCheckout}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
