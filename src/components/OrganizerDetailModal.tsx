import React, { useEffect, useState } from 'react';
import { X, Star, MapPin, CheckCircle, ShieldCheck, Phone, Mail, Sparkles, Calendar, MessageSquare, IndianRupee, ArrowRight, Award, ThumbsUp } from 'lucide-react';
import { EventOrganizer, OrganizerReview } from '../types';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { BookEventModal } from './BookEventModal';
import { AddOrganizerReviewModal } from './AddOrganizerReviewModal';

interface OrganizerDetailModalProps {
  organizerId: string;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

export const OrganizerDetailModal: React.FC<OrganizerDetailModalProps> = ({
  organizerId,
  onClose,
  onBookingSuccess
}) => {
  const { activeCity } = useAuth();
  const [organizer, setOrganizer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const loadOrganizer = async () => {
    setLoading(true);
    try {
      const data = await api.getOrganizerById(organizerId);
      setOrganizer(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load organizer details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizer();
  }, [organizerId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-600">Loading Organizer Profile & Reviews...</p>
        </div>
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4">
          <p className="text-sm font-bold text-red-600">{error || 'Organizer not found'}</p>
          <button onClick={onClose} className="px-5 py-2 bg-slate-100 font-bold text-xs rounded-xl">Close</button>
        </div>
      </div>
    );
  }

  const reviews: OrganizerReview[] = organizer.reviews || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner & Header */}
        <div className="relative shrink-0">
          <div className="h-44 sm:h-52 w-full bg-slate-800 overflow-hidden relative">
            <img
              src={organizer.bannerUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
              alt={organizer.companyName}
              className="w-full h-full object-cover opacity-80 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/90 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Badge & Info Overlay */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
            <div className="flex items-end gap-3.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-1 shadow-xl shrink-0 overflow-hidden border-2 border-white">
                <img
                  src={organizer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={organizer.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" /> Verified Organizer
                  </span>
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-slate-950" /> {organizer.rating} ({organizer.reviewCount} Reviews)
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight mt-1 truncate max-w-md drop-shadow-sm">
                  {organizer.companyName}
                </h1>
                <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-blue-300" />
                  <span>{organizer.area}, {organizer.city}</span>
                  <span>•</span>
                  <span>Managed by {organizer.name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 shrink-0"
            >
              <Calendar className="w-4 h-4" /> Book Event
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Key Metrics / Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-center">
            <div className="border-r border-slate-200/60 last:border-0">
              <div className="text-base sm:text-lg font-black text-slate-900 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                {organizer.rating} <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Client Rating
              </div>
            </div>

            <div className="border-r border-slate-200/60 last:border-0">
              <div className="text-base sm:text-lg font-black text-blue-600">
                {organizer.completedEventsCount || 45}+
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Events Executed
              </div>
            </div>

            <div className="border-r border-slate-200/60 last:border-0">
              <div className="text-base sm:text-lg font-black text-emerald-600">
                ₹{organizer.startingPriceInr.toLocaleString('en-IN')}+
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Starting Budget
              </div>
            </div>

            <div>
              <div className="text-base sm:text-lg font-black text-purple-600">
                100%
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Verified Staffing
              </div>
            </div>
          </div>

          {/* Categories & Bio */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {organizer.categories.map((c: string) => (
                <span key={c} className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200/80 rounded-full text-xs font-bold">
                  {c}
                </span>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
              {organizer.bio}
            </p>
          </div>

          {/* Detailed Ratings Breakdown */}
          <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Ratings & Quality Breakdown
              </h3>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                + Write a Review
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600">Theme & Decor</span>
                  <span className="font-bold text-amber-600">{organizer.avgDecor || 4.9} / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${((organizer.avgDecor || 4.9) / 5) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600">Coordination</span>
                  <span className="font-bold text-blue-600">{organizer.avgCoordination || 4.8} / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${((organizer.avgCoordination || 4.8) / 5) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600">Punctuality</span>
                  <span className="font-bold text-emerald-600">{organizer.avgPunctuality || 4.9} / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${((organizer.avgPunctuality || 4.9) / 5) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Offered */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Services & Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {organizer.servicesOffered.map((svc: string) => (
                <div key={svc} className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{svc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Testimonials & Reviews */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" /> Client Reviews ({reviews.length})
              </h3>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 flex items-center gap-1"
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> Rate this Organizer
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                No reviews yet. Be the first client to review {organizer.companyName}!
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-slate-900">{rev.clientName}</div>
                        <div className="text-[10px] text-slate-400">
                          {rev.eventTitle} • {rev.clientCity || activeCity.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-800 font-black text-xs px-2 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
                      "{rev.comment}"
                    </p>

                    {rev.praiseTags && rev.praiseTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rev.praiseTags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Details Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-slate-900">Have specific questions before booking?</div>
              <div className="text-slate-600 mt-0.5">
                Call {organizer.companyName} at <strong>+91 {organizer.phone}</strong> or book directly online.
              </div>
            </div>
            <a
              href={`tel:+91${organizer.phone}`}
              className="px-4 py-2 bg-white text-blue-700 font-bold rounded-xl border border-blue-200 shadow-2xs hover:bg-blue-50 transition-colors shrink-0"
            >
              Call Organizer
            </a>
          </div>

        </div>

        {/* Sticky Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Starting Price</div>
            <div className="text-sm sm:text-base font-black text-slate-900">
              ₹{organizer.startingPriceInr.toLocaleString('en-IN')}+ <span className="text-[10px] font-medium text-slate-500">per event</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors hidden sm:block"
            >
              Add Review
            </button>
            <button
              onClick={() => setBookingModalOpen(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
            >
              <Calendar className="w-4 h-4" /> Book Event Now
            </button>
          </div>
        </div>

      </div>

      {/* Submodals */}
      {bookingModalOpen && (
        <BookEventModal
          organizer={organizer}
          onClose={() => setBookingModalOpen(false)}
          onSuccess={() => {
            if (onBookingSuccess) onBookingSuccess();
          }}
        />
      )}

      {reviewModalOpen && (
        <AddOrganizerReviewModal
          organizer={organizer}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => {
            loadOrganizer();
          }}
        />
      )}
    </div>
  );
};
