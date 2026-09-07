import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Calendar, 
  IndianRupee, 
  CheckCircle2, 
  Building, 
  ChevronRight, 
  Star, 
  Award, 
  MessageSquare,
  Heart,
  Briefcase,
  Cake,
  Music,
  Utensils,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { EventItem, EventCategory, EventOrganizer } from '../types';
import { EventCard } from '../components/EventCard';
import { EventDetailModal } from '../components/EventDetailModal';

const CATEGORY_CHIPS: { label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { label: 'Wedding', icon: Heart, desc: 'Planners, Mandap & Royal Weddings' },
  { label: 'Corporate', icon: Briefcase, desc: 'Conferences, Seminars & Launches' },
  { label: 'Exhibition', icon: Building, desc: 'Trade Expos & 3D Stalls' },
  { label: 'Birthday & Parties', icon: Cake, desc: 'Theme Parties & Baby Showers' },
  { label: 'Concerts & Shows', icon: Music, desc: 'Live Artists, Sound & Lights' },
  { label: 'Catering & Hospitality', icon: Utensils, desc: 'Live Counters & Trained Staff' },
  { label: 'Photography & AV', icon: Camera, desc: 'Cinematography & Stage LED' }
];

export const HomePage: React.FC = () => {
  const { activeCity, setActiveTab, openAuthModal, openCityModal, user, navigateToBookEvent } = useAuth();
  
  const [events, setEvents] = useState<(EventItem & { distanceKm?: number })[]>([]);
  const [featuredOrganizers, setFeaturedOrganizers] = useState<EventOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<(EventItem & { distanceKm?: number }) | null>(null);

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const [eventsData, organizersData] = await Promise.all([
        api.getEvents({ city: activeCity.name || 'Surat' }),
        api.getOrganizersDirectory({ city: activeCity.name || 'Surat' })
      ]);
      setEvents(eventsData || []);
      setFeaturedOrganizers((organizersData || []).slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch home data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, [activeCity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase().includes('book') || searchQuery.toLowerCase().includes('organizer') || searchQuery.toLowerCase().includes('wedding')) {
      navigateToBookEvent();
    } else {
      setActiveTab('events');
    }
  };

  const handleCategoryClick = (cat: string) => {
    navigateToBookEvent(cat);
  };


  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      <div>
        
        {/* --- HERO SECTION --- */}
        <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden py-12 sm:py-20 px-4">
          
          {/* Subtle Background Accent Lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
            
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-none">
              Find the Right Crew for Your Event.
            </h1>
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
              Connecting Event Organizers with trusted, local Crew Members for weddings, exhibitions, concerts, and corporate shows.
            </p>

            {/* Bold Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
              <div className="bg-white p-2 rounded-2xl shadow-2xl flex items-center gap-2 border border-blue-100">
                <div className="flex items-center gap-2 pl-3 flex-1 text-slate-800">
                  <Search className="w-5 h-5 text-blue-600 shrink-0" />
                  <input
                    type="text"
                    placeholder={`Search events, roles, or venues in ${activeCity.name}...`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm py-2 font-medium focus:outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
                >
                  Find Events <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Trust Metrics Pill */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs font-medium text-blue-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Identity Verified Crew
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" /> Distance-based Matching
              </span>
              <span className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-blue-300" /> Direct Daily Payouts
              </span>
            </div>

          </div>
        </section>

        {/* --- SCROLLABLE CATEGORY CHIPS (Book Event Flow) --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Book Event Organizers by Category
                </span>
                <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Top Planners
                </span>
              </div>
              <button
                onClick={() => navigateToBookEvent()}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All Categories <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {CATEGORY_CHIPS.map(cat => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.label}
                    onClick={() => handleCategoryClick(cat.label)}
                    className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 border border-slate-200/90 rounded-2xl text-center group transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-slate-800 group-hover:text-blue-700 leading-tight">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-full">
                      Explore Planners →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* --- SPOTLIGHT: BOOK TOP-RATED ORGANIZERS WITH REAL REVIEWS --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-blue-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="max-w-xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded-full text-xs font-bold">
                  <span>Planning a Wedding, Corporate Meet or Grand Party?</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Book Top Event Organizers in {activeCity.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Select your preferred event category, compare planners, check verified portfolio photos, and book with complete confidence.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigateToBookEvent('Wedding')}
                  className="px-5 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" /> Wedding Planners
                </button>
                <button
                  onClick={() => navigateToBookEvent('Corporate')}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" /> Corporate Events
                </button>
                <button
                  onClick={() => navigateToBookEvent()}
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Building className="w-4 h-4 text-blue-600" /> Browse & Book All Organizers
                </button>
              </div>
            </div>

            {/* Featured Organizers Mini Cards */}
            {featuredOrganizers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 relative z-10">
                {featuredOrganizers.map((org) => (
                  <div
                    key={org.id}
                    onClick={() => navigateToBookEvent(org.categories[0])}
                    className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-2xl p-4 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white p-0.5 overflow-hidden shrink-0">
                        <img src={org.avatarUrl} alt={org.companyName} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-white truncate group-hover:text-amber-300 transition-colors">
                          {org.companyName}
                        </h4>
                        <p className="text-slate-300 text-xs mt-0.5 truncate">
                          {org.categories ? org.categories.slice(0, 2).join(' • ') : 'Verified Planner'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-white/10 text-slate-300">
                      <span>{org.area}, {org.city}</span>
                      <span className="font-bold text-white group-hover:text-blue-300 flex items-center gap-1">
                        Book Now →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>


        {/* --- LIVE EVENTS IN SURAT SECTION --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Real-time Hiring</span>
              <h2 className="text-2xl font-black text-slate-900">Events in {activeCity.name}</h2>
            </div>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3.5 py-2 rounded-xl hover:bg-blue-100 transition-colors"
            >
              View All Events <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 h-64 animate-pulse space-y-4">
                  <div className="bg-slate-200 h-32 rounded-xl"></div>
                  <div className="bg-slate-200 h-4 w-3/4 rounded-md"></div>
                  <div className="bg-slate-200 h-4 w-1/2 rounded-md"></div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            /* --- PROPER EMPTY STATE (NO DUMMY DATA) --- */
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto my-4 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">No Events Published Yet in {activeCity.name}</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first Event Handler to publish an event or check back soon for new crew hiring alerts in Surat.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => openAuthModal('handler-signup')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Building className="w-4 h-4" /> Publish Event as Organizer
                </button>
                <button
                  onClick={() => openAuthModal('crew-signup')}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Register as Crew Member
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
        </section>

        {/* --- HOW IT WORKS (CREW-FIRST) --- */}
        <section className="bg-white border-y border-slate-200 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Simple 4-Step Process</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">How AboveZ Works for You</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">Create Profile</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sign up with your mobile number, select your event work skills, and upload an ID document for verification.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">Find Nearby Events</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse live wedding, exhibition, and corporate events in Surat sorted by distance and payout per person.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">Apply in One Click</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit your application directly to the Event Handler. Get instant in-app alerts when approved.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  4
                </div>
                <h3 className="font-bold text-slate-900 text-base">Work & Get Paid</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Attend the event, complete your work hours, and receive your payment directly from the event handler.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- ORGANIZER COMPACT BANNER (Non-dominating) --- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
            <div className="space-y-2 text-center sm:text-left">
              <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                Event Organizer Zone
              </span>
              <h3 className="text-2xl font-black">Organizing an Event in Surat?</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Need temporary staff for weddings, expos, or corporate stage shows? Publish your event and review verified crew applications in minutes.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('organizers')}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg transition-all shrink-0 flex items-center gap-2"
            >
              Publish Event Here <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onApplicationSuccess={() => {
            fetchRealData();
          }}
        />
      )}

    </div>
  );
};
