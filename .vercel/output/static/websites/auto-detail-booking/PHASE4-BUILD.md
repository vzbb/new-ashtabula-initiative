# Phase 4: Build Checklist — Auto Detail Booking

**MVP:** auto-detail-booking  
**Date:** 2026-02-18  
**Status:** Ready to implement

---

## Pre-Flight Setup

```bash
# 1. Ensure you're in the project directory
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/auto-detail-booking

# 2. Check Node.js version
node --version  # Should be 18+

# 3. Install dependencies (if not already)
npm install

# 4. Install required packages
npm install react-router-dom @stripe/stripe-js @stripe/react-stripe-js date-fns react-datepicker lucide-react clsx tailwind-merge

# 5. Start dev server
npm run dev
```

---

## Phase 4A: Project Structure Setup

### 1. Create Directory Structure
```bash
mkdir -p src/{components/{ui,booking,admin},pages,contexts,hooks,utils,data}
mkdir -p public/images
```

### 2. Update Tailwind Config
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
        secondary: '#00AA66',
        accent: '#FFD700',
      }
    },
  },
  plugins: [],
}
```

### 3. Create Utility Files

**src/utils/cn.js** — Class name merger
```javascript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

**src/data/sampleBusiness.js** — Sample data
```javascript
export const sampleBusiness = {
  id: '1',
  name: "Lakeside Auto Detail",
  slug: "lakeside-detail",
  type: "mobile",
  phone: "(440) 555-0123",
  email: "book@lakesidedetail.com",
  serviceArea: ["Ashtabula", "Geneva", "Conneaut"],
  hours: {
    monday: { open: "08:00", close: "18:00" },
    tuesday: { open: "08:00", close: "18:00" },
    wednesday: { open: "08:00", close: "18:00" },
    thursday: { open: "08:00", close: "18:00" },
    friday: { open: "08:00", close: "18:00" },
    saturday: { open: "09:00", close: "16:00" },
    sunday: { open: null, close: null },
  },
  services: [
    {
      id: "exterior-wash",
      name: "Exterior Wash",
      description: "Hand wash, dry, tire shine, window cleaning",
      duration: 60,
      basePrice: 35,
    },
    {
      id: "interior-detail",
      name: "Interior Detail",
      description: "Vacuum, steam clean, leather treatment, odor removal",
      duration: 120,
      basePrice: 85,
    },
    {
      id: "full-detail",
      name: "Full Detail",
      description: "Complete interior and exterior detailing",
      duration: 240,
      basePrice: 175,
    },
  ],
};

export const vehicleSizes = [
  { id: "compact", name: "Compact", modifier: 0 },
  { id: "midsize", name: "Mid-size SUV/Truck", modifier: 25 },
  { id: "fullsize", name: "Full-size Truck/Van", modifier: 50 },
];
```

---

## Phase 4B: Core Components

### 1. Create BookingContext
**src/contexts/BookingContext.jsx**
```jsx
import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext();

const initialState = {
  step: 1,
  business: null,
  selectedService: null,
  vehicleSize: null,
  selectedDate: null,
  selectedTime: null,
  customerInfo: null,
  totalPrice: 0,
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_BUSINESS':
      return { ...state, business: action.payload };
    case 'SELECT_SERVICE':
      return { ...state, selectedService: action.payload, step: 2 };
    case 'SET_VEHICLE_SIZE':
      return { ...state, vehicleSize: action.payload, step: 3 };
    case 'SELECT_DATETIME':
      return { 
        ...state, 
        selectedDate: action.payload.date, 
        selectedTime: action.payload.time,
        step: 4 
      };
    case 'SET_CUSTOMER_INFO':
      return { ...state, customerInfo: action.payload, step: 5 };
    case 'CALCULATE_TOTAL':
      return { ...state, totalPrice: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
```

### 2. Create ServiceCard Component
**src/components/booking/ServiceCard.jsx**
```jsx
import { Clock, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ServiceCard({ service, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-lg border-2 transition-all",
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:border-primary/50"
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{service.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{service.description}</p>
        </div>
        {selected && <CheckCircle className="w-5 h-5 text-primary" />}
      </div>
      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {service.duration} min
        </span>
        <span className="font-medium text-primary">${service.basePrice}</span>
      </div>
    </button>
  );
}
```

### 3. Create TimeSlotPicker Component
**src/components/booking/TimeSlotPicker.jsx**
```jsx
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '../../utils/cn';

export function TimeSlotPicker({ selectedDate, selectedTime, onSelect }) {
  const [date, setDate] = useState(selectedDate);
  
  // Generate time slots (mock - would come from API)
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', 
    '13:00', '14:00', '15:00', '16:00'
  ];

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onSelect({ date: newDate, time: null });
  };

  return (
    <div className="space-y-4">
      <DatePicker
        selected={date}
        onChange={handleDateChange}
        minDate={new Date()}
        inline
        className="rounded-lg border"
      />
      {date && (
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => onSelect({ date, time })}
              className={cn(
                "p-2 text-sm rounded border transition-all",
                selectedTime === time
                  ? "bg-primary text-white border-primary"
                  : "hover:border-primary"
              )}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Phase 4C: Pages

### 1. Create BookingPage
**src/pages/BookingPage.jsx**
```jsx
import { useParams } from 'react-router-dom';
import { BookingProvider, useBooking } from '../contexts/BookingContext';
import { ServiceCard } from '../components/booking/ServiceCard';
import { TimeSlotPicker } from '../components/booking/TimeSlotPicker';
import { sampleBusiness, vehicleSizes } from '../data/sampleBusiness';
import { Calendar, User, CreditCard, CheckCircle } from 'lucide-react';

function BookingFlow() {
  const { state, dispatch } = useBooking();
  
  // Load business data (would fetch by slug)
  const business = sampleBusiness;

  const steps = [
    { num: 1, label: 'Service', icon: CheckCircle },
    { num: 2, label: 'Vehicle', icon: User },
    { num: 3, label: 'Time', icon: Calendar },
    { num: 4, label: 'Details', icon: User },
    { num: 5, label: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{business.name}</h1>
        <p className="text-gray-600">Book your detailing appointment</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div key={step.num} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              state.step >= step.num ? 'bg-primary text-white' : 'bg-gray-200'
            }`}>
              <step.icon className="w-4 h-4" />
            </div>
            <span className="text-xs mt-1">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      {state.step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select a Service</h2>
          {business.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={state.selectedService?.id === service.id}
              onSelect={() => dispatch({ type: 'SELECT_SERVICE', payload: service })}
            />
          ))}
        </div>
      )}

      {state.step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Vehicle Size</h2>
          <div className="grid gap-3">
            {vehicleSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => dispatch({ type: 'SET_VEHICLE_SIZE', payload: size })}
                className={`p-4 border rounded-lg text-left ${
                  state.vehicleSize?.id === size.id ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{size.name}</span>
                  <span className="text-primary">
                    +${size.modifier > 0 ? size.modifier : 0}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {state.step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Date & Time</h2>
          <TimeSlotPicker
            selectedDate={state.selectedDate}
            selectedTime={state.selectedTime}
            onSelect={({ date, time }) => {
              if (time) {
                dispatch({ type: 'SELECT_DATETIME', payload: { date, time } });
              }
            }}
          />
        </div>
      )}

      {/* Continue steps 4-5 similarly */}
    </div>
  );
}

export default function BookingPage() {
  const { slug } = useParams();
  return (
    <BookingProvider>
      <BookingFlow />
    </BookingProvider>
  );
}
```

---

## Phase 4D: Routing & Entry

### 1. Update App.jsx
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/book/:slug" element={<BookingPage />} />
        <Route path="/" element={
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Auto Detail Booking</h1>
            <p className="text-gray-600">Simple online booking for auto detailers</p>
            <a href="/book/lakeside-detail" className="text-primary underline mt-4 block">
              View Demo Booking Page →
            </a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## Phase 4E: Build & Deploy

### 1. Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview build locally
npm run preview
```

### 2. Deployment Checklist
- [ ] Build succeeds without errors
- [ ] All routes work (test /book/lakeside-detail)
- [ ] Responsive on mobile
- [ ] Payment integration (Stripe) configured
- [ ] Domain configured
- [ ] SSL enabled

### 3. Post-Launch
- [ ] Add Google Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Create business onboarding flow
- [ ] Add admin dashboard
- [ ] SMS/email notification setup

---

## Quick Commands Reference

```bash
# Start development
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```
