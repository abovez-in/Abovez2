import React, { useState, useEffect } from 'react';
import {
  Building,
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  IndianRupee,
  Clock,
  Briefcase,
  Edit,
  Trash2,
  UserCheck,
  Phone,
  MapPin,
  Filter,
  Star,
  Eye,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { EventItem, Application } from '../types';
import { CreateEventModal } from '../components/CreateEventModal';
import { EditEventModal } from '../components/EditEventModal';
import { CrewVerifiedProfileModal } from '../components/CrewVerifiedProfileModal';
import { ReviewCrewModal } from '../components/ReviewCrewModal';

export const OrganizersPage: React.FC = () => {
  const { user, openAuthModal, openCreateEventModal, subscription, openSubscriptionModal } = useAuth();

  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Edit Event State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Verified Profile & Review Modal States
  const [profileModalCrewId, setProfileModalCrewId] = useState<string | null>(null);
  const [isPendingInModal, setIsPendingInModal] = useState(false);
  const [activeModalAppId, setActiveModalAppId] = useState<string | null>(null);
  
  const [reviewModalState, setReviewModalState] = useState<{
    isOpen: boolean;
    crewId: string;
    crewName: string;
    eventId: string;
    eventTitle: string;
  } | null>(null);

  // Applicants Filter Tab: 'all' | 'selected' | 'pending' | 'rejected'
  const [appFilter, setAppFilter] = useState<'all' | 'selected' | 'pending' | 'rejected'>('all');

  const fetchMyEvents = async () => {
    if (!user || user.role !== 'handler') return;
    setLoading(true);
    try {
      const allEvents = await api.getEvents();
      // Filter events owned by this handler
      const mine = allEvents.filter(e => e.handlerId === user.id);
      setMyEvents(mine);
      if (mine.length > 0) {
        if (!selectedEventId || !mine.some(e => e.id === selectedEventId)) {
          setSelectedEventId(mine[0].id);
        }
      } else {
        setSelectedEventId(null);
      }
    } catch (err) {
      console.error('Error fetching handler events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsForSelected = async () => {
    if (!selectedEventId) {
      setApplications([]);
      return;
    }
    try {
      const apps = await api.getEventApplications(selectedEventId);
      setApplications(apps || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  useEffect(() => {
    if (user && user.role === 'handler') {
      fetchMyEvents();
    }
  }, [user]);

  useEffect(() => {
    if (selectedEventId) {
      fetchApplicationsForSelected();
    }
  }, [selectedEventId]);

  const handleUpdateAppStatus = async (appId: string, status: 'approved' | 'rejected' | 'completed') => {
    setActionLoading(appId);
    try {
      await api.updateApplicationStatus(appId, status);
      await fetchApplicationsForSelected();
      await fetchMyEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to update application status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? All applicants will be notified.')) {
      return;
    }

    try {
      await api.deleteEvent(eventId, user?.id);
      await fetchMyEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to delete event.');
    }
  };

  // If NOT logged in as Event Handler, show the Organizers Landing Zone
  if (!user || user.role !== 'handler') {
    return (
      <div className="min-h-screen bg-slate-50/50 pb-16">
        
        {/* Organizer Hero Banner */}
        <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-16 sm:py-24 px-4 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-xs font-bold border border-blue-400/30">
              <Building className="w-3.5 h-3.5" /> Event Handler Portal
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Hire Verified Event Crew in Surat <br className="hidden sm:inline" />
              <span className="text-blue-400">Within Minutes.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
              Post your wedding, exhibition, or corporate event needs. Receive applications from local, ID-verified crew members with clear location distances and ratings.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => openAuthModal('handler-signup')}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Create Organizer Account <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openAuthModal('handler-login')}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 backdrop-blur-md transition-all"
              >
                Organizer Log In
              </button>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Identity Verified Crew</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review applicant ratings and verified identity status. No mystery staff — know exactly who is coming to your venue.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Distance-Based Hiring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                See distance from your event venue to applicant home location. Hire crew close to the event to avoid late arrivals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">1-Month Free Trial</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Start with 30 days of full platform access. Publish unlimited events and manage applications seamlessly.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // --- LOGGED-IN EVENT HANDLER DASHBOARD ---
  const activeEventsCount = myEvents.filter(e => e.status === 'active').length;
  const selectedEvent = myEvents.find(e => e.id === selectedEventId);

  // Filter applications by tab
  const filteredApps = applications.filter(app => {
    if (appFilter === 'selected') return app.status === 'approved' || app.status === 'completed';
    if (appFilter === 'pending') return app.status === 'pending';
    if (appFilter === 'rejected') return app.status === 'rejected';
    return true;
  });

  const selectedCount = applications.filter(a => a.status === 'approved' || a.status === 'completed').length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      
      {/* Dashboard Top Navigation / Header */}
      <section className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">
              {user.companyName || user.name} • Organizer Portal
            </div>
            <h1 className="text-2xl font-black text-slate-900">Event & Crew Management Dashboard</h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={openSubscriptionModal}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Plan: {subscription?.planName || 'Active'}</span>
            </button>

            <button
              onClick={openCreateEventModal}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Publish New Event
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Published Events</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{myEvents.length} Events</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Actively Hiring</span>
            <div className="text-2xl font-black text-blue-600 mt-1">{activeEventsCount} Active</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Applicants</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {applications.length} Applied
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selected & Working Crew</span>
            <div className="text-2xl font-black text-purple-600 mt-1">
              {selectedCount} Working
            </div>
          </div>
        </div>

        {/* My Events & Applicant Management View */}
        {myEvents.length === 0 ? (
          /* Proper Empty State for Handlers */
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">No Events Published Yet</h3>
              <p className="text-xs text-slate-500">
                You haven't posted any events yet. Publish an event in Surat to start receiving applications from local crew members.
              </p>
            </div>

            <button
              onClick={openCreateEventModal}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Publish Your First Event Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: My Events List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Events ({myEvents.length})</h3>
                <span className="text-[10px] text-slate-400 font-medium">Click to manage crew</span>
              </div>

              <div className="space-y-3">
                {myEvents.map(evt => {
                  const isSelected = evt.id === selectedEventId;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEventId(evt.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600/20'
                          : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          {evt.category}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            evt.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {evt.status.replace('_', ' ').toUpperCase()}
                          </span>

                          {/* Action Buttons: Edit / Delete */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEvent(evt);
                            }}
                            className="p-1 hover:bg-blue-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(evt.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{evt.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">📍 {evt.area}, {evt.city} • 📅 {evt.eventDate}</p>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                        <span className="text-blue-600 font-bold">₹{evt.payPerPerson}/person</span>
                        <span className="text-slate-600 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                          {evt.approvedCrewCount} / {evt.totalCrewNeeded} Selected
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Applications View for Selected Event */}
            <div className="lg:col-span-2 space-y-4">
              {selectedEvent ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                  
                  {/* Selected Event Details Header with Edit/Delete Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Managing Event</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                          {selectedEvent.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900">{selectedEvent.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {selectedEvent.eventDate} ({selectedEvent.startTime} - {selectedEvent.endTime})</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedEvent.fullAddress}</span>
                      </p>
                      <p className="text-xs text-slate-600 font-medium pt-1">
                        Pay: <strong className="text-blue-600">₹{selectedEvent.payPerPerson}/crew</strong> • Food: {selectedEvent.foodProvided ? 'Provided' : 'Not provided'} • Dress Code: {selectedEvent.dressCode}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Required Crew Status</span>
                        <span className="text-base font-black text-blue-600">
                          {selectedEvent.approvedCrewCount} / {selectedEvent.totalCrewNeeded} Selected
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingEvent(selectedEvent)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center gap-1 border border-blue-200 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit Event
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(selectedEvent.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center gap-1 border border-red-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Applicants Filter Tabs */}
                  <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAppFilter('all')}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                          appFilter === 'all'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        All Applicants ({applications.length})
                      </button>
                      <button
                        onClick={() => setAppFilter('selected')}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                          appFilter === 'selected'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Selected / Working Crew ({selectedCount})
                      </button>
                      <button
                        onClick={() => setAppFilter('pending')}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                          appFilter === 'pending'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-amber-700 hover:bg-amber-50'
                        }`}
                      >
                        Pending Review ({pendingCount})
                      </button>
                    </div>
                  </div>

                  {/* Applicants List */}
                  <div>
                    {filteredApps.length === 0 ? (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-8 text-center space-y-2">
                        <Users className="w-8 h-8 text-slate-400 mx-auto" />
                        <h4 className="font-bold text-slate-800 text-sm">
                          {appFilter === 'selected'
                            ? 'No Crew Selected Yet'
                            : appFilter === 'pending'
                            ? 'No Pending Applications'
                            : 'No Applications Found'}
                        </h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          {appFilter === 'selected'
                            ? 'Review applicants below and click "Approve Crew" to select crew members for this event.'
                            : 'Crew members in Surat will see your event on their dashboard and submit applications.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredApps.map(app => (
                          <div
                            key={app.id}
                            className={`p-4 rounded-2xl border transition-all space-y-3 ${
                              app.status === 'approved'
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : app.status === 'completed'
                                ? 'bg-blue-50/50 border-blue-200'
                                : app.status === 'rejected'
                                ? 'bg-slate-50 border-slate-200 opacity-60'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div 
                                className="flex items-center gap-3 cursor-pointer group"
                                onClick={() => {
                                  setProfileModalCrewId(app.crewId);
                                  setIsPendingInModal(app.status === 'pending');
                                  setActiveModalAppId(app.id);
                                }}
                              >
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black flex items-center justify-center text-sm shadow-md group-hover:scale-105 transition-transform">
                                  {app.crewName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                      {app.crewName}
                                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                        View Profile →
                                      </span>
                                    </h5>
                                    {app.idVerified && (
                                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300/60">
                                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> ID Verified
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                                    <span>Age {app.crewAge || 22}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {app.crewArea || 'Surat'}, {app.crewCity || 'Surat'}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5 font-black text-amber-600">
                                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                      {app.crewRating} Rating
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                                app.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : app.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {app.status === 'approved' ? 'SELECTED & WORKING' : app.status.toUpperCase()}
                              </span>
                            </div>

                            {/* Skills Chips & Experience */}
                            <div className="space-y-1.5 text-xs bg-slate-100/60 p-3 rounded-xl border border-slate-200/60">
                              <div className="text-slate-700 font-medium flex items-center gap-1.5 flex-wrap">
                                <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <strong>Experience:</strong> {app.crewExperience || 'Experienced event crew in Surat'}
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {app.crewSkills && app.crewSkills.map((sk, idx) => (
                                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-blue-600" /> {sk}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons for Handlers */}
                            <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5 flex-wrap">
                                <Phone className="w-3.5 h-3.5 text-blue-600" />
                                Phone: <a href={`tel:${app.crewPhone}`} className="font-bold text-blue-600 hover:underline">+91 {app.crewPhone}</a>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {/* Verified Profile Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProfileModalCrewId(app.crewId);
                                    setIsPendingInModal(app.status === 'pending');
                                    setActiveModalAppId(app.id);
                                  }}
                                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1 shadow-2xs transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600" /> View Verified Profile
                                </button>

                                {app.status === 'pending' && (
                                  <>
                                    <button
                                      disabled={actionLoading === app.id}
                                      onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                                    >
                                      Reject
                                    </button>
                                    <button
                                      disabled={actionLoading === app.id}
                                      onClick={() => handleUpdateAppStatus(app.id, 'approved')}
                                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-all"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Select Crew
                                    </button>
                                  </>
                                )}

                                {(app.status === 'approved' || app.status === 'completed') && (
                                  <>
                                    {app.status === 'approved' && (
                                      <button
                                        disabled={actionLoading === app.id}
                                        onClick={() => handleUpdateAppStatus(app.id, 'completed')}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                                      </button>
                                    )}

                                    {/* Rate & Review System ⭐ */}
                                    <button
                                      onClick={() => {
                                        if (selectedEvent) {
                                          setReviewModalState({
                                            isOpen: true,
                                            crewId: app.crewId,
                                            crewName: app.crewName,
                                            eventId: selectedEvent.id,
                                            eventTitle: selectedEvent.title
                                          });
                                        }
                                      }}
                                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-colors"
                                    >
                                      <Star className="w-3.5 h-3.5 fill-white text-white" /> Rate & Review Crew
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400">
                  Select an event from the left menu to view applicants.
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      <CreateEventModal onSuccess={fetchMyEvents} />
      
      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          onSuccess={fetchMyEvents}
        />
      )}

      {/* Crew Verified Profile Modal */}
      <CrewVerifiedProfileModal
        crewId={profileModalCrewId}
        isOpen={!!profileModalCrewId}
        onClose={() => {
          setProfileModalCrewId(null);
          setIsPendingInModal(false);
          setActiveModalAppId(null);
        }}
        isPendingApp={isPendingInModal}
        onApproveCrew={() => {
          if (activeModalAppId) {
            handleUpdateAppStatus(activeModalAppId, 'approved');
          }
        }}
      />

      {/* Rate & Review Crew Modal */}
      {reviewModalState && user && (
        <ReviewCrewModal
          isOpen={reviewModalState.isOpen}
          onClose={() => setReviewModalState(null)}
          crewId={reviewModalState.crewId}
          crewName={reviewModalState.crewName}
          eventId={reviewModalState.eventId}
          eventTitle={reviewModalState.eventTitle}
          handlerId={user.id}
          onSuccess={() => {
            fetchApplicationsForSelected();
            fetchMyEvents();
          }}
        />
      )}
    </div>
  );
};
