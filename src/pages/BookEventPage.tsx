import React, { useEffect, useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  Filter, 
  MessageSquare, 
  IndianRupee, 
  CheckCircle, 
  ArrowUpDown, 
  SlidersHorizontal,
  Award,
  Layers,
  Zap,
  Heart,
  Briefcase,
  Building,
  Cake,
  Music,
  Utensils,
  Camera,
  X
} from 'lucide-react';
import { EventOrganizer, OrganizerCategory } from '../types';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { OrganizerDetailModal } from '../components/OrganizerDetailModal';
import { BookEventModal } from '../components/BookEventModal';

interface CategoryItem {
  id: string;
  name: OrganizerCategory | 'All';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  color: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    name: 'All',
    label: 'All Categories',
    icon: Zap,
    desc: 'Explore all event organizers',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'wedding',
    name: 'Wedding',
    label: 'Wedding Planners',
    icon: Heart,
    desc: 'Mandap, Haldi, Sangeet & Royal Weddings',
    color: 'from-pink-600 to-rose-600'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    label: 'Corporate Events',
    icon: Briefcase,
    desc: 'Conferences, AGMs & Product Launches',
    color: 'from-blue-700 to-cyan-700'
  },
  {
    id: 'exhibition',
    name: 'Exhibition',
    label: 'Exhibitions & Stalls',
    icon: Building,
    desc: 'Trade Expos, 3D Stalls & SIECC Setup',
    color: 'from-amber-600 to-orange-600'
  },
  {
    id: 'birthday',
    name: 'Birthday & Parties',
    label: 'Birthday & Parties',
    icon: Cake,
    desc: 'Theme Birthdays, Baby Showers & Galas',
    color: 'from-purple-600 to-fuchsia-600'
  },
  {
    id: 'concerts',
    name: 'Concerts & Shows',
    label: 'Concerts & Shows',
    icon: Music,
    desc: 'Live Sound, Line Array & Garba Megafests',
    color: 'from-red-600 to-rose-700'
  },
  {
    id: 'catering',
    name: 'Catering & Hospitality',
    label: 'Catering & Banquet',
    icon: Utensils,
    desc: 'Live Gourmet Counters & Trained Waiters',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'photography',
    name: 'Photography & AV',
    label: 'Stage AV & Photo',
    icon: Camera,
    desc: '4K Multi-Cam, Drone & LED Rigging',
    color: 'from-indigo-600 to-violet-700'
  }
];

export const BookEventPage: React.FC = () => {
  const { activeCity, selectedBookingCategory, setSelectedBookingCategory, openCityModal } = useAuth();

  const [organizers, setOrganizers] = useState<EventOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedBookingCategory || 'All');
  const [sortBy, setSortBy] = useState<string>('rating_high');
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);

  // Modals
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | null>(null);
  const [bookingOrganizer, setBookingOrganizer] = useState<EventOrganizer | null>(null);

  // Synchronize category if context changes
  useEffect(() => {
    if (selectedBookingCategory && selectedBookingCategory !== selectedCategory) {
      setSelectedCategory(selectedBookingCategory);
    }
  }, [selectedBookingCategory]);

  const fetchOrganizers = async () => {
    setLoading(true);
    try {
      const data = await api.getOrganizersDirectory({
        city: activeCity?.name || 'Surat',
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery.trim() || undefined,
        minRating: minRatingFilter > 0 ? minRatingFilter : undefined,
        sort: sortBy
      });
      setOrganizers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch organizers:', err);
      setOrganizers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, [activeCity?.name, selectedCategory, sortBy, minRatingFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrganizers();
  };

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    setSelectedBookingCategory(catName);
  };

  const currentCategoryMeta = CATEGORIES.find(c => c.name === selectedCategory) || CATEGORIES[0];
  const CurrentCatIcon = currentCategoryMeta.icon;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* Hero / Header Section */}
      <div className="bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-black text-blue-200">
                <span>Verified Event Organizers in {activeCity?.name || 'Surat'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Book Top-Rated Event Organizers
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                Browse verified wedding planners, corporate stage managers, birthday decorators and exhibition creators. Check authentic client ratings and reviews, and book directly.
              </p>
            </div>
          </div>

          {/* Search & Sort Bar */}
          <div className="mt-8 bg-white rounded-2xl p-2.5 sm:p-3 shadow-xl flex flex-col sm:flex-row gap-2.5 text-slate-900">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 px-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={`Search organizer name, area (Vesu, Piplod, Adajan) or decor service in ${activeCity?.name || 'Surat'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 text-xs font-medium bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    fetchOrganizers();
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            <div className="flex items-center gap-2">
              {/* Sorting Filter */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent outline-none font-bold cursor-pointer"
                >
                  <option value="rating_high">Highest Rated</option>
                  <option value="reviews_high">Most Reviews</option>
                  <option value="price_low">Budget: Low to High</option>
                  <option value="price_high">Budget: High to Low</option>
                </select>
              </div>

              {/* City Switch Button */}
              <button
                type="button"
                onClick={openCityModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{activeCity?.name || 'Surat'}</span>
              </button>

              <button
                type="button"
                onClick={fetchOrganizers}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm transition-all shrink-0"
              >
                Search
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Step 1: Category Selection Carousel / Grid */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                Select Event Category
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Showing planners in {activeCity?.name || 'Surat'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`p-3 rounded-2xl text-center flex flex-col items-center justify-center gap-1.5 transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20 ring-2 ring-blue-600/30 -translate-y-0.5'
                      : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <IconComp className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                  <span className={`text-[11px] font-black leading-tight truncate max-w-full ${
                    isSelected ? 'text-white' : 'text-slate-800'
                  }`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Filter Summary & Ratings Status */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <CurrentCatIcon className="w-5 h-5 text-blue-600" />
              <span>{selectedCategory === 'All' ? 'All Verified Organizers' : `${selectedCategory} Organizers`} in {activeCity?.name || 'Surat'}</span>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {organizers.length} Available
              </span>
            </h3>
          </div>

          {/* Quick Rating Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-500 font-semibold text-xs mr-1">Min Rating:</span>
            <button
              onClick={() => setMinRatingFilter(0)}
              className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                minRatingFilter === 0
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMinRatingFilter(4.5)}
              className={`px-2.5 py-1 rounded-lg font-bold border transition-colors flex items-center gap-1 ${
                minRatingFilter === 4.5
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
              }`}
            >
              <Star className="w-3 h-3 fill-current" /> 4.5+ (Top Rated)
            </button>
            <button
              onClick={() => setMinRatingFilter(4.8)}
              className={`px-2.5 py-1 rounded-lg font-bold border transition-colors flex items-center gap-1 ${
                minRatingFilter === 4.8
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
              }`}
            >
              <Star className="w-3 h-3 fill-current" /> 4.8+ (Premier)
            </button>
          </div>
        </div>

        {/* Step 3: Organizers List (Review-Based Booking Cards) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs animate-pulse space-y-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-16 bg-slate-100 rounded-2xl"></div>
                <div className="h-9 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : organizers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs mt-4 space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900">No organizers found</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We could not find any organizers matching your selected filters in {activeCity?.name || 'Surat'}. Try switching to "All Categories" or adjusting your search.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setMinRatingFilter(0);
              }}
              className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {organizers.map((org) => {
              const latestReview = org.reviews && org.reviews.length > 0 ? org.reviews[0] : null;
              const startingPrice = org.startingPriceInr || (typeof org.startingPrice === 'number' ? org.startingPrice : 20000);
              const orgCategories = Array.isArray(org.categories) ? org.categories : ['Wedding', 'Corporate'];

              return (
                <div
                  key={org.id}
                  className="bg-white rounded-3xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Card Header & Banner Preview */}
                  <div>
                    <div className="h-32 w-full bg-slate-800 relative overflow-hidden">
                      <img
                        src={org.bannerUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                        alt={org.companyName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                      {/* Badges on banner */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        {org.verified && (
                          <span className="bg-emerald-500/90 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                        {org.featured && (
                          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Star className="w-3 h-3 fill-current" /> Top Rated
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 right-3 text-white text-xs font-bold drop-shadow-sm flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{org.area || 'Surat Central'}, {org.city || activeCity?.name || 'Surat'}</span>
                      </div>
                    </div>

                    {/* Organizer Main Info */}
                    <div className="p-5 pb-3 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-white p-0.5 shadow-md shrink-0 -mt-8 border-2 border-white overflow-hidden relative z-10">
                          <img
                            src={org.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={org.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {org.companyName}
                          </h4>
                          <div className="flex items-center gap-2 text-xs mt-0.5">
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-black text-[11px]">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              {org.rating || 4.9}
                            </span>
                            <span className="text-slate-500 font-semibold text-[11px]">
                              ({org.reviewCount || 0} client reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Categories Pill List */}
                      <div className="flex flex-wrap gap-1">
                        {orgCategories.slice(0, 3).map((cat: string) => (
                          <span
                            key={cat}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              cat === selectedCategory
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {org.bio || 'Verified professional event organizer and management firm.'}
                      </p>

                      {/* Review Spotlight */}
                      {latestReview ? (
                        <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-amber-900 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-600" /> {latestReview.rating}.0 • {latestReview.clientName}
                            </span>
                            <span className="text-[10px] text-amber-800/70">{latestReview.eventCategory}</span>
                          </div>
                          <p className="text-[11px] text-slate-700 italic line-clamp-2 leading-snug">
                            "{latestReview.comment}"
                          </p>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-2.5 text-center text-[11px] text-slate-500 font-medium">
                          {org.completedEventsCount || 20}+ Events Organized in {activeCity?.name || 'Surat'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Starting Price & Booking Actions */}
                  <div className="p-5 pt-0 space-y-3">
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Starting From</span>
                        <span className="text-sm font-black text-slate-900">
                          ₹{Number(startingPrice).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {org.completedEventsCount || 30}+ Executed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedOrganizerId(org.id)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reviews</span>
                      </button>

                      <button
                        onClick={() => setBookingOrganizer(org)}
                        className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Event</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Organizer Detail & Reviews Modal */}
      {selectedOrganizerId && (
        <OrganizerDetailModal
          organizerId={selectedOrganizerId}
          onClose={() => setSelectedOrganizerId(null)}
          onBookingSuccess={() => {
            fetchOrganizers();
          }}
        />
      )}

      {/* Book Event Modal */}
      {bookingOrganizer && (
        <BookEventModal
          organizer={bookingOrganizer}
          initialCategory={selectedCategory === 'All' ? undefined : selectedCategory}
          onClose={() => setBookingOrganizer(null)}
          onSuccess={() => {
            fetchOrganizers();
          }}
        />
      )}

    </div>
  );
};
