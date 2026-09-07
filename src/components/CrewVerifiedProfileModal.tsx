import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Phone,
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  AlertTriangle,
  Award,
  Briefcase,
  User,
  Clock,
  ThumbsUp,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { api } from '../lib/api';
import { CrewVerifiedProfile } from '../types';

interface CrewVerifiedProfileModalProps {
  crewId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveCrew?: () => void;
  isPendingApp?: boolean;
}

export const CrewVerifiedProfileModal: React.FC<CrewVerifiedProfileModalProps> = ({
  crewId,
  isOpen,
  onClose,
  onApproveCrew,
  isPendingApp
}) => {
  const [profile, setProfile] = useState<CrewVerifiedProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'reviews'>('overview');

  useEffect(() => {
    if (isOpen && crewId) {
      setLoading(true);
      api.getCrewVerifiedProfile(crewId)
        .then(data => {
          setProfile(data);
        })
        .catch(err => {
          console.error('Error fetching crew verified profile:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setProfile(null);
    }
  }, [isOpen, crewId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Crew Profile
            </span>
            <span className="px-2.5 py-1 bg-white/10 text-slate-200 rounded-full text-xs font-medium">
              ID: {crewId?.substring(0, 10)}
            </span>
          </div>

          {loading ? (
            <div className="py-6 text-center text-slate-300 text-sm">Loading verified credentials...</div>
          ) : profile ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
              <div className="w-20 h-20 rounded-2xl bg-white text-blue-800 font-black text-3xl flex items-center justify-center shadow-lg border-2 border-white/40 overflow-hidden shrink-0">
                {profile.user.avatarUrl ? (
                  <img src={profile.user.avatarUrl} alt={profile.user.name} className="w-full h-full object-cover" />
                ) : (
                  profile.user.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-black text-white">{profile.user.name}</h2>
                  {profile.stats.idVerified && (
                    <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-300 text-[11px] font-extrabold rounded-md border border-emerald-400/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> ID VERIFIED
                    </span>
                  )}
                </div>

                <p className="text-xs text-blue-100 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-300" />
                    {profile.user.area || 'Surat'}, {profile.user.city || 'Surat'}
                  </span>
                  <span>•</span>
                  <span>Age {profile.user.dob ? (new Date().getFullYear() - new Date(profile.user.dob).getFullYear()) : 22}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    {profile.stats.rating} ({profile.stats.reviewCount} reviews)
                  </span>
                </p>

                {profile.user.bio && (
                  <p className="text-xs text-blue-100/90 italic line-clamp-2 pt-0.5">
                    "{profile.user.bio}"
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-slate-300 text-sm">Crew profile not found.</div>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Trust & Verified Credentials
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'events'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Previous Events ({profile?.previousEvents.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Organizer Reviews ({profile?.reviews.length || 0})
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading profile details...</div>
          ) : profile ? (
            <>
              {/* TAB 1: OVERVIEW & TRUST BADGES */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Trust Badges Matrix */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Verification & Trust Matrix</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* Mobile Verified */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-slate-900 text-xs">Mobile Verified</h4>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <p className="text-[11px] text-emerald-800 font-medium">
                            +91 {profile.user.phone} • Verified
                          </p>
                        </div>
                      </div>

                      {/* Govt ID Verified */}
                      <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                        profile.stats.idVerified 
                          ? 'bg-emerald-50/80 border-emerald-200' 
                          : 'bg-amber-50/80 border-amber-200'
                      }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          profile.stats.idVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-slate-900 text-xs">Govt ID Verification</h4>
                            {profile.stats.idVerified ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">Pending</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium">
                            {profile.stats.idVerified ? 'Aadhaar / Voter ID verified by Admin' : 'Govt identity document submission pending'}
                          </p>
                        </div>
                      </div>

                      {/* Attendance Reliability */}
                      <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-slate-900 text-xs">Attendance Reliability</h4>
                            <span className="text-[10px] bg-blue-600 text-white font-black px-1.5 py-0.2 rounded-md">
                              {profile.stats.reliabilityScore}%
                            </span>
                          </div>
                          <p className="text-[11px] text-blue-900 font-medium">
                            {profile.stats.noShowCount === 0 ? '0 No-Shows Recorded (100% Reliable)' : `${profile.stats.noShowCount} No-Show(s) reported`}
                          </p>
                        </div>
                      </div>

                      {/* Completed Events */}
                      <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-slate-900 text-xs">Completed Gigs</h4>
                            <span className="text-[10px] bg-purple-600 text-white font-black px-1.5 py-0.2 rounded-md">
                              {profile.stats.completedEventsCount}
                            </span>
                          </div>
                          <p className="text-[11px] text-purple-900 font-medium">
                            {profile.stats.completedEventsCount} successful event(s) worked
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Skills & Experience */}
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Experience & Specialization</h4>
                      <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                        {profile.experience || 'Experienced Event Staff in Surat with professional grooming and guest handling skills.'}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verified Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills && profile.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-blue-600" /> {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rating Summary Bar */}
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-black text-amber-600 flex items-center gap-1">
                        <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
                        {profile.stats.rating}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Overall Organizer Rating</div>
                        <div className="text-[11px] text-slate-500">Based on {profile.stats.reviewCount} reviews from Surat event handlers</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors shrink-0 shadow-xs"
                    >
                      Read Reviews ({profile.reviews.length}) →
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: PREVIOUS EVENTS HISTORY */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Work History in Surat</h3>
                    <span className="text-xs text-slate-500 font-medium">{profile.previousEvents.length} Events Total</span>
                  </div>

                  {profile.previousEvents.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
                      <h4 className="font-bold text-slate-700 text-sm">New Crew Member</h4>
                      <p className="text-xs text-slate-500">
                        This crew member has recently joined the platform and is ready for their upcoming event assignments.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {profile.previousEvents.map((evt, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                {evt.eventCategory}
                              </span>
                              <h4 className="font-extrabold text-slate-900 text-sm mt-1">{evt.eventTitle}</h4>
                              <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {evt.eventArea}</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {evt.eventDate}</span>
                                <span>₹{evt.eventPay}/crew</span>
                              </p>
                            </div>

                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                              evt.status === 'completed' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {evt.status === 'completed' ? 'COMPLETED' : 'HIRED / SELECTED'}
                            </span>
                          </div>

                          {/* Attached Review if available */}
                          {evt.review && (
                            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1 mt-2">
                              <div className="flex items-center justify-between text-amber-900 font-bold">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  {evt.review.rating}.0 / 5.0 from {evt.review.handlerName} ({evt.review.handlerCompany})
                                </span>
                                <span className="text-[10px] text-slate-400">{evt.review.createdAt.split('T')[0]}</span>
                              </div>
                              <p className="text-slate-700 italic">
                                "{evt.review.comment}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ORGANIZER REVIEWS & TESTIMONIALS */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ratings & Feedback by Event Organizers</h3>
                    <div className="flex items-center gap-1 text-sm font-black text-amber-600">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {profile.stats.rating} ({profile.reviews.length} reviews)
                    </div>
                  </div>

                  {profile.reviews.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <Star className="w-8 h-8 text-slate-300 mx-auto" />
                      <h4 className="font-bold text-slate-700 text-sm">No Reviews Yet</h4>
                      <p className="text-xs text-slate-500">
                        Reviews will appear here once event organizers submit ratings after completed gigs.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {profile.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-black text-slate-900 text-sm">{rev.handlerName}</h4>
                                {rev.handlerCompany && (
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                    {rev.handlerCompany}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Event: <strong>{rev.eventTitle}</strong> • {rev.createdAt.split('T')[0]}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-black text-amber-700">{rev.rating}.0</span>
                            </div>
                          </div>

                          {/* Breakdown stars if present */}
                          {(rev.punctualityRating || rev.workQualityRating) && (
                            <div className="flex flex-wrap gap-3 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                              {rev.punctualityRating && (
                                <span className="flex items-center gap-1 font-medium">
                                  <Clock className="w-3.5 h-3.5 text-blue-600" /> Punctuality: <strong className="text-slate-900">{rev.punctualityRating}/5</strong>
                                </span>
                              )}
                              {rev.workQualityRating && (
                                <span className="flex items-center gap-1 font-medium">
                                  <Award className="w-3.5 h-3.5 text-indigo-600" /> Work Quality: <strong className="text-slate-900">{rev.workQualityRating}/5</strong>
                                </span>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            "{rev.comment}"
                          </p>

                          {rev.isNoShow && (
                            <div className="text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-lg flex items-center gap-1.5 border border-red-200">
                              <AlertTriangle className="w-3.5 h-3.5" /> Flagged as No-Show by Organizer
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            {profile?.stats.idVerified ? (
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% ID Verified & Background Checked
              </span>
            ) : (
              <span>Verified Profile • CrewConnect Surat</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isPendingApp && onApproveCrew && (
              <button
                onClick={() => {
                  onApproveCrew();
                  onClose();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Hire This Crew
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
