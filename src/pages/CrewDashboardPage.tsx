import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Clock,
  MapPin,
  Calendar,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Upload,
  Briefcase,
  Camera,
  Phone,
  MessageSquare,
  Check,
  Star,
  Eye,
  Award,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { EventItem, Application, CrewReview } from '../types';
import { EventCard } from '../components/EventCard';
import { EventDetailModal } from '../components/EventDetailModal';
import { CrewVerifiedProfileModal } from '../components/CrewVerifiedProfileModal';

export const CrewDashboardPage: React.FC = () => {
  const {
    user,
    openAuthModal,
    openIdUploadModal,
    openSubscriptionModal,
    openEditProfileModal,
    activeCity,
    subscription,
    setActiveTab
  } = useAuth();

  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<(EventItem & { distanceKm?: number })[]>([]);
  const [myReviews, setMyReviews] = useState<CrewReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<(EventItem & { distanceKm?: number }) | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Tab filter: 'all' | 'selected' | 'pending' | 'completed'
  const [appTab, setAppTab] = useState<'all' | 'selected' | 'pending' | 'completed'>('all');

  const fetchCrewData = async () => {
    if (!user || user.role !== 'crew') return;
    setLoading(true);
    try {
      // Fetch user's applications
      const apps = await api.getCrewApplications(user.id);
      setMyApplications(apps || []);

      // Fetch reviews received by crew
      const revs = await api.getCrewReviews(user.id);
      setMyReviews(revs || []);

      // Fetch nearby events in active city
      const events = await api.getEvents({ city: activeCity.name || 'Surat' });
      setNearbyEvents(events || []);
    } catch (err) {
      console.error('Error fetching crew dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'crew') {
      fetchCrewData();
    }
  }, [user, activeCity]);

  // If not logged in as Crew Member
  if (!user || user.role !== 'crew') {
    return (
      <div className="min-h-screen bg-slate-50/50 pb-16 flex flex-col justify-center items-center px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-lg w-full space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto font-black text-2xl">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">Crew Member Portal</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please log in or register as a Crew Member to view your applications, nearby events, and identity verification status.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => openAuthModal('crew-login')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              Log In as Crew Member
            </button>
            <button
              onClick={() => openAuthModal('crew-signup')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              Register New Crew Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedApps = myApplications.filter(a => a.status === 'approved');
  const pendingApps = myApplications.filter(a => a.status === 'pending');
  const completedApps = myApplications.filter(a => a.status === 'completed');

  const filteredApps = myApplications.filter(a => {
    if (appTab === 'selected') return a.status === 'approved';
    if (appTab === 'pending') return a.status === 'pending';
    if (appTab === 'completed') return a.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      
      {/* Header Profile Summary */}
      <section className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0 overflow-hidden border-2 border-slate-200">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <button
                onClick={openEditProfileModal}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white text-blue-600 rounded-full shadow-md border border-slate-200 hover:bg-blue-50 transition-colors"
                title="Change profile picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
                {user.idVerified ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ID Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> ID Verification Pending
                  </span>
                )}
                {user.rating && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {user.rating} ({user.reviewCount || 1} gigs)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {user.address || 'Surat'}, {user.city || activeCity.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {user.phone}</span>
              </p>
              {user.bio && (
                <p className="text-xs text-slate-600 mt-1 italic line-clamp-1 max-w-md">
                  "{user.bio}"
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View My Verified Profile Button */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> View My Verified Profile
            </button>

            <button
              onClick={openEditProfileModal}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" /> Edit Profile & Photo
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-purple-600" /> Share Experience / Post
            </button>

            {!user.idVerified && (
              <button
                onClick={openIdUploadModal}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Govt ID
              </button>
            )}

            <button
              onClick={openSubscriptionModal}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Pass: {subscription?.planName || 'Active'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Applied Events</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{myApplications.length} Events</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Selected / Working In</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {selectedApps.length} Events
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Applications</span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {pendingApps.length} Under Review
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Gigs</span>
            <div className="text-2xl font-black text-blue-600 mt-1">
              {completedApps.length} Gigs
            </div>
          </div>
        </div>

        {/* Verification & Trust Status Banner for Crew */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified Profile Trust Metrics
                </span>
              </div>
              <h3 className="text-xl font-black text-white">How Event Organizers in Surat See Your Profile</h3>
              <p className="text-xs text-blue-100 max-w-xl">
                Organizers look for verified mobile numbers, approved Govt ID proofs, high ratings, and reliable attendance when selecting crew.
              </p>
            </div>

            {/* Matrix badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Mobile */}
              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-center">
                <div className="text-emerald-400 text-sm font-black flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> VERIFIED
                </div>
                <div className="text-[10px] text-slate-300 font-medium mt-0.5">Mobile Number</div>
              </div>

              {/* ID proof */}
              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-center">
                <div className={`text-sm font-black flex items-center justify-center gap-1 ${
                  user.idVerified ? 'text-emerald-400' : 'text-amber-300'
                }`}>
                  {user.idVerified ? (
                    <>
                      <ShieldCheck className="w-4 h-4" /> VERIFIED
                    </>
                  ) : (
                    'PENDING'
                  )}
                </div>
                <div className="text-[10px] text-slate-300 font-medium mt-0.5">Govt ID Proof</div>
              </div>

              {/* Reliability */}
              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-center">
                <div className="text-blue-300 text-sm font-black flex items-center justify-center gap-1">
                  <Award className="w-4 h-4" /> {user.noShowCount ? `${Math.max(0, 100 - user.noShowCount * 15)}%` : '100%'}
                </div>
                <div className="text-[10px] text-slate-300 font-medium mt-0.5">
                  {user.noShowCount ? `${user.noShowCount} No-Show` : '0 No-Shows'}
                </div>
              </div>

              {/* Overall Rating */}
              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-center">
                <div className="text-amber-300 text-sm font-black flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-300" /> {user.rating || 5.0}
                </div>
                <div className="text-[10px] text-slate-300 font-medium mt-0.5">
                  {myReviews.length} Review(s)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: My Applications Status Tracker */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">My Event Applications</span>
              <h2 className="text-xl font-black text-slate-900">Applied & Selected Events Tracker</h2>
            </div>
            
            <button
              onClick={fetchCrewData}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors self-start sm:self-auto"
              title="Refresh applications"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Navigation for Applications */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
            <button
              onClick={() => setAppTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                appTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Applications ({myApplications.length})
            </button>
            <button
              onClick={() => setAppTab('selected')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                appTab === 'selected'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Selected & Working Events ({selectedApps.length})
            </button>
            <button
              onClick={() => setAppTab('pending')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                appTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Pending ({pendingApps.length})
            </button>
            <button
              onClick={() => setAppTab('completed')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                appTab === 'completed'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Completed ({completedApps.length})
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading your applications...</div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 text-center space-y-2">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">
                {appTab === 'selected'
                  ? 'No Selected Events Yet'
                  : appTab === 'pending'
                  ? 'No Pending Applications'
                  : 'No Applications Found'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {appTab === 'selected'
                  ? 'When event organizers approve your application, the event details and reporting timings will appear here!'
                  : 'Explore available events below in Surat and apply to start working.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map(app => (
                <div
                  key={app.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    app.status === 'approved'
                      ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                      : app.status === 'completed'
                      ? 'border-blue-200 bg-blue-50/30'
                      : app.status === 'rejected'
                      ? 'border-slate-200 bg-slate-50 opacity-60'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-black text-slate-900 text-base">{app.eventTitle}</h4>
                        
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                          app.status === 'approved'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : app.status === 'completed'
                            ? 'bg-blue-600 text-white'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {app.status === 'pending' && 'APPLICATION PENDING'}
                          {app.status === 'approved' && 'SELECTED & HIRED'}
                          {app.status === 'rejected' && 'NOT SELECTED'}
                          {app.status === 'completed' && 'WORK COMPLETED'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 pt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" /> {app.eventArea}, {app.eventCity}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {app.eventDate}
                        </span>
                        <span className="font-black text-blue-600 text-sm">
                          ₹{app.payPerPerson}/crew
                        </span>
                      </div>
                    </div>

                    {app.status === 'approved' && (
                      <div className="p-3.5 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs text-emerald-950 font-medium shrink-0 space-y-1 sm:max-w-xs">
                        <div className="flex items-center gap-1 text-emerald-800 font-bold">
                          <Phone className="w-3.5 h-3.5" /> Organizer Contact / Helpline:
                        </div>
                        <div className="font-extrabold text-slate-900 text-sm">
                          +91 92659 93727
                        </div>
                        <div className="text-[11px] text-emerald-800">
                          Please arrive 30 minutes before start time in clean formal/uniform attire.
                        </div>
                      </div>
                    )}
                  </div>

                  {app.status === 'approved' && (
                    <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> You are confirmed to work for this event.
                      </span>
                      <button
                        onClick={() => setActiveTab('community')}
                        className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 text-[11px]"
                      >
                        <Camera className="w-3.5 h-3.5" /> Post photo & review after work →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Organizer Reviews & Testimonials Received */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Organizer Ratings & Feedback</span>
              <h2 className="text-xl font-black text-slate-900">What Event Organizers Say About You</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 font-black text-xs rounded-xl border border-amber-200 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {user.rating || 5.0} Rating ({myReviews.length} Reviews)
              </span>
            </div>
          </div>

          {myReviews.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 text-center space-y-2">
              <Star className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Reviews Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once you complete your assigned events in Surat, event handlers and organizers will rate and review your work here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReviews.map(rev => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{rev.handlerName}</h4>
                      {rev.handlerCompany && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {rev.handlerCompany}
                        </span>
                      )}
                      <p className="text-xs text-slate-500 mt-0.5">
                        Event: <strong>{rev.eventTitle}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black text-amber-700">{rev.rating}.0</span>
                    </div>
                  </div>

                  {(rev.punctualityRating || rev.workQualityRating) && (
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl">
                      {rev.punctualityRating && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-600" /> Punctuality: <strong>{rev.punctualityRating}/5</strong></span>
                      )}
                      {rev.workQualityRating && (
                        <span className="flex items-center gap-1"><Award className="w-3 h-3 text-indigo-600" /> Grooming: <strong>{rev.workQualityRating}/5</strong></span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-700 italic bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Nearby Events in Surat */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Recommended Opportunities</span>
              <h2 className="text-xl font-black text-slate-900">More Events in {activeCity.name}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyEvents.map(evt => (
              <EventCard key={evt.id} event={evt} onSelect={setSelectedEvent} />
            ))}
          </div>
        </div>

      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onApplicationSuccess={() => {
            fetchCrewData();
          }}
        />
      )}

      {/* Public Verified Profile Modal Preview */}
      {user && (
        <CrewVerifiedProfileModal
          crewId={user.id}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};
