import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, IndianRupee, Users, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Building, Sparkles } from 'lucide-react';
import { EventItem, Application } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface EventDetailModalProps {
  event: (EventItem & { distanceKm?: number }) | null;
  onClose: () => void;
  onApplicationSuccess?: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onApplicationSuccess }) => {
  const { user, openAuthModal, openSubscriptionModal } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!event) return null;

  const handleApplyClick = () => {
    if (!user) {
      openAuthModal('crew-signup');
      return;
    }
    if (user.role !== 'crew') {
      setError('Only registered Crew Members can apply for events. Please switch to a Crew account.');
      return;
    }
    setError(null);
    setConfirming(true);
  };

  const handleConfirmSubmit = async () => {
    if (!user) return;
    setApplying(true);
    setError(null);

    try {
      await api.applyForEvent(event.id, user.id);
      setApplying(false);
      setSuccess(true);
      if (onApplicationSuccess) onApplicationSuccess();
    } catch (err: any) {
      setApplying(false);
      if (err.message?.includes('expired')) {
        setError(err.message);
      } else {
        setError(err.message || 'Failed to submit application. Please try again.');
      }
    }
  };

  const isFull = event.approvedCrewCount >= event.totalCrewNeeded || event.status === 'crew_full';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative overflow-hidden border border-slate-100 my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Header */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900">
          <img
            src={event.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'}
            alt={event.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {event.category}
              </span>
              {event.distanceKm !== undefined && (
                <span className="bg-white/20 backdrop-blur-md font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.distanceKm} km away from you
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight drop-shadow-sm">
              {event.title}
            </h2>
            <p className="text-xs text-blue-200 flex items-center gap-1.5 font-medium">
              <Building className="w-3.5 h-3.5" />
              Organized by {event.handlerCompany || event.handlerName}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Daily Payout</span>
              <div className="text-xl font-black text-blue-900 flex items-center mt-0.5">
                <IndianRupee className="w-5 h-5" />
                {event.payPerPerson.toLocaleString()}
                <span className="text-xs font-normal text-blue-700 ml-1">/ person</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Crew Needed</span>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                {event.approvedCrewCount} / {event.totalCrewNeeded} Selected
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Event Status</span>
              <div className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {isFull ? 'Crew Full' : 'Actively Hiring'}
              </div>
            </div>
          </div>

          {/* Date, Time & Location Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Location Details</h4>
            
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{event.eventDate}</div>
                  <div className="text-slate-500">{event.startTime} - {event.endTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{event.area}, {event.city}</div>
                  <div className="text-slate-500">{event.fullAddress}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Role & Work Instructions */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Work Description & Role</h4>
              <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                {event.workType || 'General event management support, guest welcoming, hospitality, and coordination.'}
              </p>
            </div>

            {event.instructions && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Special Instructions & Dress Code</h4>
                <p className="text-xs text-slate-600 bg-amber-50/70 text-amber-900 p-3 rounded-xl border border-amber-200">
                  {event.instructions}
                </p>
              </div>
            )}
          </div>

          {/* Status / Confirming / Success Message States */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <div>
                {error}
                {error.includes('expired') && (
                  <button
                    onClick={() => {
                      onClose();
                      openSubscriptionModal();
                    }}
                    className="ml-2 font-bold underline hover:text-red-900"
                  >
                    Renew Plan Now →
                  </button>
                )}
              </div>
            </div>
          )}

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-950">Application Submitted!</h3>
              <p className="text-xs text-emerald-800">
                The event organizer will review your profile. You will receive an in-app notification as soon as your status is updated.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Close & View My Applications
              </button>
            </div>
          ) : confirming ? (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Confirm Application Details
              </div>
              <p className="text-xs text-blue-800">
                You are applying as <strong className="text-blue-950">{user?.name}</strong> ({user?.phone}). Your rating, distance, and verified status will be shared with the event organizer.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={applying}
                  onClick={handleConfirmSubmit}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                >
                  {applying ? 'Submitting...' : 'Confirm & Send Application'}
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              {!isFull ? (
                <button
                  onClick={handleApplyClick}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base"
                >
                  Apply for This Event <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-full py-3.5 bg-slate-200 text-slate-500 font-bold rounded-2xl text-center text-sm">
                  Crew Requirement Completed
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
