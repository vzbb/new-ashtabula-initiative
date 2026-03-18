import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { propertiesApi } from '../../lib/api.js';

export default function OwnerCalendar() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertiesApi.getMyProperties();
      setProperties(data.properties || []);
      if (data.properties?.length > 0) {
        setSelectedProperty(data.properties[0]);
      }
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailability = async () => {
    if (!selectedProperty) return;
    
    try {
      const monthStr = currentDate.toISOString().slice(0, 7);
      const data = await propertiesApi.getAvailability(selectedProperty.id, monthStr);
      setAvailability(data);
    } catch (error) {
      console.error('Failed to load availability:', error);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [selectedProperty, currentDate]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array(daysInMonth).fill(null).map((_, i) => i + 1);
  const emptyDays = Array(firstDay).fill(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Calendar</h1>
          
          {properties.length > 0 && (
            <select
              value={selectedProperty?.id}
              onChange={(e) => setSelectedProperty(properties.find(p => p.id === e.target.value))}
              className="input-field w-64"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>

        {properties.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500">Add a property to view and manage your calendar</p>
          </div>
        ) : (
          <div className="card">
            <div className="flex items-center justify-between p-6 border-b">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {emptyDays.map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {days.map((day) => {
                  const isBooked = availability.days?.[day - 1] === 0;
                  const dateStr = `${currentDate.toISOString().slice(0, 7)}-${String(day).padStart(2, '0')}`;
                  const isToday = new Date().toISOString().slice(0, 10) === dateStr;
                  
                  return (
                    <div
                      key={day}
                      className={`
                        aspect-square p-2 border rounded-lg flex flex-col items-center justify-center cursor-pointer
                        transition-colors hover:bg-gray-50
                        ${isBooked ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}
                        ${isToday ? 'ring-2 ring-primary-500' : ''}
                      `}
                    >
                      <span className={`text-sm font-medium ${isToday ? 'text-primary-600' : ''}`}>
                        {day}
                      </span>
                      {isBooked && (
                        <span className="text-xs text-red-600 mt-1">Booked</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border-2 border-primary-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Today</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}