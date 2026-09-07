import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, IndianRupee, Building, CheckCircle2, Phone, Mail, User, Clock, AlertCircle, Star } from 'lucide-react';
import { EventOrganizer, OrganizerCategory } from '../types';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface BookEventModalProps {
  organizer: EventOrganizer;
  initialCategory?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORY_OPTIONS: OrganizerCategory[] = [
  'Wedding',
  'Corporate',
  'Exhibition',
  'Birthday & Parties',
  'Concerts & Shows',
  'Catering & Hospitality',
  'Photography & AV',
  'Full Production'
];

const GUEST_COUNT_OPTIONS = [
  '50 - 100 Guests',
  '100 - 250 Guests',
  '250 - 500 Guests',
  '500 - 1000 Guests',
  '1000+ Grand Gathering'
];

const BUDGET_OPTIONS = [
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,50,000',
  '₹1,50,000 - ₹3,00,000',
  '₹3,00,000 - ₹5,00,000',
  '₹5,00,000+ Luxury / Royal'
];

const POPULAR_SERVICES = [
  'Theme Stage & Mandap Decor',
  'Sound, DJ & Live Lighting',
  'LED Video Walls & Truss Setup',
  'VIP Guest Hospitality & Ushers',
  'Banquet Catering Coordination',
  'Cinematography & Drone Shoot',
  'Anchor / Emcee & Live Artists',
  'Event Helper Crew & Security'
];

export const BookEventModal: React.FC<BookEventModalProps> = ({
  organizer,
  initialCategory,
  onClose,
  onSuccess
}) => {
  const { user, activeCity } = useAuth();

  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState<OrganizerCategory>(
    (initialCategory && CATEGORY_OPTIONS.includes(initialCategory as any))
      ? (initialCategory as OrganizerCategory)
      : (organizer.categories[0] || 'Wedding')
  );
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('Evening (5:00 PM - 11:00 PM)');
  const [venueArea, setVenueArea] = useState(organizer.area || activeCity.name);
  const [guestCount, setGuestCount] = useState('250 - 500 Guests');
  const [budgetRange, setBudgetRange] = useState('₹50,000 - ₹1,50,000');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Theme Stage & Mandap Decor',
    'VIP Guest Hospitality & Ushers'
  ]);
  
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [clientEmail, setClientEmail] = useState(user?.email || '');
  const [specialNotes, setSpecialNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  const toggleService = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter(s => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) {
      setError('Please provide a name or title for your event/function.');
      return;
    }
    if (!eventDate) {
      setError('Please select an event date.');
      return;
    }
    if (!clientName.trim() || !clientPhone.trim()) {
      setError('Please enter your full name and contact mobile number.');
      return;
    }
    if (clientPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createEventBooking({
        organizerId: organizer.id,
        organizerName: organizer.name,
        organizerCompany: organizer.companyName,
        clientId: user?.id,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        clientCity: activeCity.name,
        eventName: eventName.trim(),
        category,
        eventDate,
        eventTime,
        venueArea: venueArea.trim(),
        guestCount,
        budgetRange,
        servicesRequested: selectedServices,
        specialNotes: specialNotes.trim()
      });

      setConfirmedBooking(res.booking);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
              {organizer.avatarUrl ? (
                <img src={organizer.avatarUrl} alt={organizer.companyName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Building className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-blue-200">
                  Book Event Organizer
                </span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> {organizer.rating} ({organizer.reviewCount} Reviews)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black leading-tight text-white mt-0.5">
                {organizer.companyName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-blue-100 mt-1">
                <MapPin className="w-3.5 h-3.5 text-blue-300" />
                <span>{organizer.area}, {organizer.city}</span>
                <span>•</span>
                <span>Starts at ₹{organizer.startingPriceInr.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {confirmedBooking ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                Booking Reference: {confirmedBooking.bookingRef}
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Booking Inquiry Sent Successfully!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                <strong>{organizer.companyName}</strong> has received your event requirements for <strong>{confirmedBooking.eventName}</strong> on <strong>{confirmedBooking.eventDate}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2 text-xs text-slate-700 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Organizer Contact:</span>
                <span className="font-bold text-slate-900">{organizer.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Estimated Guests:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.guestCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Budget Selected:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.budgetRange}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Location:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.venueArea}, {activeCity.name}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={`https://wa.me/91${organizer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi ${organizer.companyName}, I just submitted a booking inquiry on AboveZ (Ref: ${confirmedBooking.bookingRef}) for "${confirmedBooking.eventName}" on ${confirmedBooking.eventDate}. Looking forward to discussing details!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all"
              >
                <Phone className="w-4 h-4" /> Connect via WhatsApp
              </a>

              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-all"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Event Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                <Calendar className="w-4 h-4 text-blue-600" /> 1. Event Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event / Function Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sneha & Rohan's Royal Wedding & Reception"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  >
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Timing / Shift
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Evening 6 PM - 11 PM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Venue Area / Landmark <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Avadh Utopia / Vesu / VIP Road"
                    value={venueArea}
                    onChange={(e) => setVenueArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Scale & Budget */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                <Users className="w-4 h-4 text-blue-600" /> 2. Scale & Estimated Budget
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Guest Attendance
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  >
                    {GUEST_COUNT_OPTIONS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Budget Range
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  >
                    {BUDGET_OPTIONS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Services You Require:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {POPULAR_SERVICES.map(svc => {
                    const active = selectedServices.includes(svc);
                    return (
                      <button
                        type="button"
                        key={svc}
                        onClick={() => toggleService(svc)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left flex items-center justify-between border transition-all ${
                          active
                            ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate pr-2">{svc}</span>
                        {active ? (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">✓</span>
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-300"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3: Contact Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                <User className="w-4 h-4 text-blue-600" /> 3. Your Contact Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit number"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Notes or Specific Themes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. We require traditional Rajwadi entryway, liquid nitrogen mocktail counters, and Gujarati folk singers."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-black rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Send Booking Inquiry
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
