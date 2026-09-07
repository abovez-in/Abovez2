import React, { useState, useMemo } from 'react';
import { MapPin, X, Check, Search, Sparkles, Navigation, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { City } from '../types';
import { ALL_INDIAN_CITIES } from '../data/indianCities';

export const CitySelectorModal: React.FC = () => {
  const { cityModalOpen, closeCityModal, activeCity, setActiveCity } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const zoneFilters = [
    { id: 'all', label: 'All India' },
    { id: 'popular', label: '⭐ Top Metros' },
    { id: 'gujarat', label: 'Gujarat' },
    { id: 'maharashtra', label: 'Maharashtra' },
    { id: 'north', label: 'North India' },
    { id: 'south', label: 'South India' },
    { id: 'east', label: 'East & NE' },
  ];

  const filteredCities = useMemo(() => {
    let list = ALL_INDIAN_CITIES;

    if (selectedZone === 'popular') {
      list = list.filter(c => c.isPopular);
    } else if (selectedZone === 'gujarat') {
      list = list.filter(c => c.state?.toLowerCase().includes('gujarat'));
    } else if (selectedZone === 'maharashtra') {
      list = list.filter(c => c.state?.toLowerCase().includes('maharashtra'));
    } else if (selectedZone === 'north') {
      list = list.filter(c => 
        ['Delhi NCR', 'Rajasthan', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Chandigarh', 'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir', 'Ladakh']
          .includes(c.state || '')
      );
    } else if (selectedZone === 'south') {
      list = list.filter(c => 
        ['Karnataka', 'Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Kerala', 'Puducherry', 'Goa']
          .includes(c.state || '')
      );
    } else if (selectedZone === 'east') {
      list = list.filter(c => 
        ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Chhattisgarh', 'Madhya Pradesh', 'Assam', 'Meghalaya', 'Sikkim', 'Tripura', 'Manipur', 'Mizoram', 'Nagaland', 'Arunachal Pradesh']
          .includes(c.state || '')
      );
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = ALL_INDIAN_CITIES.filter(c => 
        c.name.toLowerCase().includes(q) || 
        (c.state && c.state.toLowerCase().includes(q))
      );
    }

    return list;
  }, [searchTerm, selectedZone]);

  if (!cityModalOpen) return null;

  const handleSelect = (c: City) => {
    setActiveCity(c);
    try {
      localStorage.setItem('crewconnect_city', JSON.stringify(c));
    } catch (e) {
      console.warn('Could not persist selected city', e);
    }
    closeCityModal();
  };

  const handleSelectCustom = () => {
    if (!searchTerm.trim()) return;
    const customCity: City = {
      id: searchTerm.toLowerCase().replace(/\s+/g, '-'),
      name: searchTerm.trim(),
      state: 'India',
      isActive: true,
      lat: 20.5937,
      lng: 78.9629
    };
    handleSelect(customCity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl relative overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md text-amber-400 flex items-center justify-center font-bold border border-white/10">
              <Globe className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">Select Location (All India)</h3>
              <p className="text-xs text-blue-200">Serving events, crew hiring & organizers across 100+ Indian cities</p>
            </div>
          </div>
          <button
            onClick={closeCityModal}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 shrink-0 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city (e.g. Surat, Mumbai, Delhi, Jaipur, Bengaluru...)"
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs"
              autoFocus
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Zone Filter Chips */}
          {!searchTerm && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {zoneFilters.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all text-xs ${
                    selectedZone === z.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Currently Selected Banner */}
        <div className="px-5 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 shrink-0">
          <span className="font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            Current Location: <strong className="font-black text-blue-700">{activeCity.name}</strong> {activeCity.state ? `(${activeCity.state})` : ''}
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        {/* Cities Grid List */}
        <div className="overflow-y-auto p-4 flex-1 space-y-1.5 divide-y divide-slate-50">
          {filteredCities.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-3">
              <p className="text-slate-500 text-sm font-medium">
                No location found for "<span className="text-slate-800 font-bold">{searchTerm}</span>"
              </p>
              <button
                onClick={handleSelectCustom}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5" /> Use "{searchTerm}" as custom location
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {filteredCities.map((c) => {
                const isSelected = activeCity.id === c.id || activeCity.name.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/90 text-blue-950 font-bold shadow-2xs'
                        : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {c.name}
                        </div>
                        {c.state && (
                          <span className="text-[10px] text-slate-500 block truncate font-normal mt-0.5">
                            {c.state}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50 text-xs text-slate-500">
          <span>{filteredCities.length} Indian Locations Ready</span>
          <button
            onClick={closeCityModal}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
