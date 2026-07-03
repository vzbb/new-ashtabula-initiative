import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, Leaf, Check } from 'lucide-react';
import { api } from '../lib/api';
import { useCartStore } from '../store/cartStore';

const categoryLabels = {
  eggs: 'Eggs',
  dairy: 'Dairy',
  bread: 'Bread',
  meat: 'Meat',
  produce: 'Produce',
  pantry: 'Pantry',
  'local-specialty': 'Local Specialties'
};

const categoryOrder = ['eggs', 'dairy', 'bread', 'meat', 'produce', 'pantry', 'local-specialty'];

export default function Shop() {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [quantities, setQuantities] = useState({});
  
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const cartStoreId = useCartStore((state) => state.storeId);

  useEffect(() => {
    loadStoreAndProducts();
  }, [storeId]);

  async function loadStoreAndProducts() {
    try {
      setLoading(true);
      const [storeData, productsData] = await Promise.all([
        api.getStore(storeId),
        api.getStoreProducts(storeId)
      ]);
      setStore(storeData.store);
      setProducts(productsData.grouped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateQuantity(productId, delta) {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta)
    }));
  }

  function addToCart(product) {
    const qty = quantities[product.id] || 1;
    addItem(product, qty);
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
  }

  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Stores
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">Failed to load store: {error}</p>
        </div>
      </div>
    );
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasDifferentStoreItems = cartStoreId && cartStoreId !== storeId && cartItems.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Stores
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
        <p className="text-gray-600 mt-1">{store.description}</p>
      </div>

      {hasDifferentStoreItems && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800 text-sm">
            Your cart has items from another store. Adding items here will clear your current cart.
          </p>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Items
        </button>
        {categoryOrder.map(cat => 
          products[cat]?.length > 0 ? (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ) : null
        )}
      </div>

      {/* Products */}
      <div className="space-y-8">
        {categoryOrder.map(category => {
          const categoryProducts = products[category];
          if (!categoryProducts?.length) return null;
          if (activeCategory !== 'all' && activeCategory !== category) return null;
          
          return (
            <div key={category}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                {categoryLabels[category]}
                {category === 'local-specialty' && (
                  <Leaf className="h-5 w-5 ml-2 text-green-600" />
                )}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryProducts.map(product => (
                  <div key={product.id} className="card p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary-600">{formatPrice(product.price_cents)}</p>
                        <p className="text-xs text-gray-500"> per {product.unit}</p>
                      </div>
                    </div>
                    
                    {product.is_local && (
                      <div className="flex items-center text-xs text-green-700 mb-3">
                        <Leaf className="h-3 w-3 mr-1" />
                        Local Product
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          disabled={!quantities[product.id]}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {quantities[product.id] || 0}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!quantities[product.id]}
                        className="btn-primary py-2 px-4 text-sm disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && cartStoreId === storeId && (
        <Link
          to="/cart"
          className="fixed bottom-6 right-6 bg-primary-600 text-white rounded-full px-6 py-4 shadow-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 z-50"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-medium">Cart ({cartItemCount})</span>
        </Link>
      )}
    </div>
  );
}
