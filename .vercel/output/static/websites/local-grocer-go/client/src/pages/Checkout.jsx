import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CreditCard, Banknote, Loader2, Check, Smartphone } from 'lucide-react';
import { api } from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/cartStore';

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const storeId = useCartStore((state) => state.storeId);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.getTotal());
  const subtotal = useCartStore((state) => state.getSubtotal());
  const tax = useCartStore((state) => state.getTax());
  const setCurrentOrder = useOrderStore((state) => state.setCurrentOrder);

  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [name, setName] = useState('');
  const [carDescription, setCarDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
      return;
    }
    loadSlots();
  }, []);

  async function loadSlots() {
    try {
      const data = await api.getSlots({ store_id: storeId });
      setSlots(data.slots.filter(s => s.available_spots > 0));
    } catch (err) {
      setError('Failed to load pickup slots');
    }
  }

  async function sendVerification() {
    try {
      setLoading(true);
      await api.sendVerification(phone);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    try {
      setLoading(true);
      await api.verifyCode(phone, verificationCode);
      setIsVerified(true);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitOrder() {
    try {
      setLoading(true);
      
      const orderData = {
        store_id: storeId,
        customer_phone: phone,
        customer_name: name,
        car_description: carDescription,
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price_cents: item.price_cents,
          subtotal_cents: item.price_cents * item.quantity
        })),
        pickup_slot_id: selectedSlot,
        payment_method: paymentMethod,
        notes
      };

      const result = await api.createOrder(orderData);
      setCurrentOrder(result.order);
      clearCart();
      navigate('/confirmation');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Step 1: Pickup Slot */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              selectedSlot ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'
            }`}>
              {selectedSlot ? <Check className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
            </div>
            <h2 className="text-xl font-bold">Choose Pickup Time</h2>
          </div>

          {!selectedSlot ? (
            <div className="space-y-4">
              {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                <div key={date}>
                  <h3 className="font-medium text-gray-700 mb-2">{formatDate(date)}</h3>
                  <div className="flex flex-wrap gap-2">
                    {dateSlots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        {slot.time_start.slice(0, 5)} - {slot.time_end.slice(0, 5)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
              <div>
                <p className="font-medium text-green-900">
                  {formatDate(slots.find(s => s.id === selectedSlot)?.date)}
                </p>
                <p className="text-green-700">
                  {slots.find(s => s.id === selectedSlot)?.time_start.slice(0, 5)} - 
                  {slots.find(s => s.id === selectedSlot)?.time_end.slice(0, 5)}
                </p>
              </div>
              <button 
                onClick={() => setSelectedSlot(null)}
                className="text-sm text-green-700 hover:underline"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Phone Verification */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isVerified ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'
            }`}>
              {isVerified ? <Check className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
            </div>
            <h2 className="text-xl font-bold">Verify Your Phone</h2>
          </div>

          {!isVerified ? (
            <div className="space-y-4">
              {step === 1 ? (
                <>
                  <input
                    type="tel"
                    placeholder="+1 (440) 555-0123"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                  />
                  <button
                    onClick={sendVerification}
                    disabled={!phone || loading}
                    className="btn-primary w-full"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Verification Code'}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600">Enter the 6-digit code sent to {phone}</p>
                  <input
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="input-field"
                  />
                  <button
                    onClick={verifyCode}
                    disabled={verificationCode.length !== 6 || loading}
                    className="btn-primary w-full"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify Code'}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-900">{phone} verified</span>
            </div>
          )}
        </div>

        {/* Step 3: Customer Details */}
        {isVerified && (
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Your Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Description (for pickup)</label>
                <input
                  type="text"
                  placeholder="Blue Honda Accord"
                  value={carDescription}
                  onChange={(e) => setCarDescription(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (optional)</label>
                <textarea
                  placeholder="Any special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field h-24 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {isVerified && name && (
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  paymentMethod === 'card' 
                    ? 'border-primary-600 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-8 w-8" />
                <span className="font-medium">Pay with Card</span>
              </button>

              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  paymentMethod === 'cash' 
                    ? 'border-primary-600 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Banknote className="h-8 w-8" />
                <span className="font-medium">Pay at Pickup</span>
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={submitOrder}
              disabled={loading}
              className="btn-primary w-full text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Placing Order...
                </>
              ) : (
                `Place Order - ${formatPrice(total)}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
