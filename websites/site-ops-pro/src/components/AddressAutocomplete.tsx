import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface AddressAutocompleteProps {
  onSelect: (lat: number, lon: number, address: string) => void;
  placeholder?: string;
  theme?: 'indigo' | 'emerald' | 'amber';
  value?: string;
  onChange?: (val: string) => void;
}

export default function AddressAutocomplete({ onSelect, placeholder = "Enter address...", theme = 'indigo', value, onChange }: AddressAutocompleteProps) {
  const [internalQuery, setInternalQuery] = useState('');
  const query = value !== undefined ? value : internalQuery;
  
  const setQuery = (newQuery: string) => {
    if (onChange) onChange(newQuery);
    setInternalQuery(newQuery);
  };

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const themeClasses = {
    indigo: {
      input: 'focus:ring-indigo-500/20 focus:border-indigo-500',
      spinner: 'border-indigo-500',
    },
    emerald: {
      input: 'focus:ring-emerald-500/20 focus:border-emerald-500',
      spinner: 'border-emerald-500',
    },
    amber: {
      input: 'focus:ring-amber-500/20 focus:border-amber-500',
      spinner: 'border-amber-500',
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=${encodeURIComponent(query)}&f=json&countryCode=USA`);
        const data = await res.json();
        if (data.suggestions) {
          setSuggestions(data.suggestions);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = async (suggestion: any) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    setIsLoading(true);
    try {
      const res = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${encodeURIComponent(suggestion.text)}&magicKey=${suggestion.magicKey}&f=json&maxLocations=1`);
      const data = await res.json();
      if (data.candidates && data.candidates.length > 0) {
        const { y, x } = data.candidates[0].location;
        onSelect(y, x, suggestion.text);
      } else {
        alert("Could not find exact coordinates for this address.");
      }
    } catch (error) {
      console.error("Error geocoding:", error);
      alert("Error finding address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 w-full">
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${themeClasses[theme].input}`}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${themeClasses[theme].spinner}`}></div>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-[1001] w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto text-left">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 flex items-start gap-3 border-b border-slate-100 last:border-0 transition-colors"
            >
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span className="leading-tight">{suggestion.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
