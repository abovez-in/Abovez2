import React, { useState, useEffect } from 'react';
import { Search, MapPin, SlidersHorizontal, Calendar, IndianRupee, RefreshCw, X, Filter, Sparkles, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { EventItem, EventCategory } from '../types';
import { EventCard } from '../components/EventCard';
import { EventDetailModal } from '../components/EventDetailModal';

const CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Wedding',
  'Corporate',
  'Exhibition',
  'Concert/Stage',
  'Promotional',
  'Setup Crew',
  'Hospitality',
  'Other'
];

export const EventsPage: React.FC = () => {
  const { activeCity, openCityModal, openAuthModal, user } = useAuth();

  const [events, setEvents] = useState<(EventItem & { distanceKm?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<'All' | EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPay, setMinPay] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<(EventItem & { distanceKm?: number }) | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getEvents({
        city: activeCity.name || 'Surat',
        category: selectedCategory === 'All' ? '' : selectedCategory,
        minPay: minPay > 0 ? minPay : undefined,
        search: searchQuery
      });
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeCity, selectedCategory, minPay]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPay(0);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Browse & Apply</span>
              <button
                onClick={openCityModal}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
              >
                <MapPin className="w-3 h-3 text-blue-600" />
                {activeCity.name}
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Event Jobs in {activeCity.name}
            </h1>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search event title, role or area..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Category Tabs & Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-slate-200/80 mb-6 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-900 font-bold">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filter Payout:
            </span>

            <div className="flex items-center gap-1.5">
              {[0, 800, 1200, 1500].map(pay => (
                <button
                  key={pay}
                  onClick={() => setMinPay(pay)}
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                    minPay === pay
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {pay === 0 ? 'All Pay' : `₹${pay}+`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-bold">{events.length} Events Available</span>
            {(selectedCategory !== 'All' || searchQuery || minPay > 0) && (
              <button
                onClick={clearFilters}
                className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Event List / Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 h-64 animate-pulse space-y-4">
                <div className="bg-slate-200 h-32 rounded-xl"></div>
                <div className="bg-slate-200 h-4 w-3/4 rounded-md"></div>
                <div className="bg-slate-200 h-4 w-1/2 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          /* Proper Empty State */
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center max-w-lg mx-auto my-8 space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No Events Found in {activeCity.name}</h3>
              <p className="text-xs text-slate-500">
                {searchQuery || selectedCategory !== 'All' || minPay > 0
                  ? 'No events matched your filter criteria. Try clearing filters or searching another keyword.'
                  : `There are currently no active event hiring listings in ${activeCity.name}. Check back shortly or publish your own event.`}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Reset Filters
              </button>
              <button
                onClick={() => openAuthModal('handler-signup')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Publish Event
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(evt => (
              <EventCard key={evt.id} event={evt} onSelect={setSelectedEvent} />
            ))}
          </div>
        )}

      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onApplicationSuccess={() => {
            fetchEvents();
          }}
        />
      )}
    </div>
  );
};
