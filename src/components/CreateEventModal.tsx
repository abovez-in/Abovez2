import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, IndianRupee, Users, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Building, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { EventCategory } from '../types';
import { CustomDatePicker } from './CustomDatePicker';

const CATEGORIES: EventCategory[] = [
  'Wedding',
  'Corporate',
  'Exhibition',
  'Concert/Stage',
  'Promotional',
  'Setup Crew',
  'Hospitality',
  'Other'
];

export const CreateEventModal: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { createEventModalOpen, closeCreateEventModal, user, activeCity } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Wedding');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('06:00 PM');
  
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [payPerPerson, setPayPerPerson] = useState<number | ''>(1200);
  const [totalCrewNeeded, setTotalCrewNeeded] = useState<number | ''>(5);

  const [workType, setWorkType] = useState('');
  const [instructions, setInstructions] = useState('');
  const [bannerUrl, setBannerUrl] = useState(''); // Optional, defaults to blank

  if (!createEventModalOpen) return null;

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Banner image must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!title || !eventDate) {
        setError('Please enter an event title and event date.');
        return;
      }
    } else if (step === 2) {
      if (!area || !fullAddress || !payPerPerson || !totalCrewNeeded) {
        setError('Please fill in area, full address, pay per person, and total crew count.');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handlePublish = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      await api.createEvent({
        handlerId: user.id,
        title,
        category,
        city: activeCity.name || 'Surat',
        area,
        fullAddress,
        eventDate,
        startTime,
        endTime,
        payPerPerson: Number(payPerPerson),
        totalCrewNeeded: Number(totalCrewNeeded),
        workType: workType || category + ' Event Crew',
        instructions,
        bannerUrl: bannerUrl || '' // Optional, left blank if user didn't select one
      });

      setLoading(false);
      closeCreateEventModal();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to publish event. Please check details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl relative overflow-hidden border border-slate-100 my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header & Progress Bar */}
        <div className="p-6 border-b border-slate-100 pb-4">
          <button
            onClick={closeCreateEventModal}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" /> Publish New Event • Step {step} of 4
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {step === 1 && 'Event Basics'}
            {step === 2 && 'Location & Payout'}
            {step === 3 && 'Requirements & Banner'}
            {step === 4 && 'Preview & Confirm'}
          </h3>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Wedding Hospitality & Welcoming Crew"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                        category === cat
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <CustomDatePicker
                    label="Event Date"
                    value={eventDate}
                    onChange={setEventDate}
                    minYear={2024}
                    maxYear={2035}
                    required
                    helperText="Select year & month easily"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    placeholder="09:00 AM"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    placeholder="06:00 PM"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & PAY */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    disabled
                    value={activeCity.name || 'Surat'}
                    className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Area / Suburb *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vesu, Piplod, Adajan"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Venue Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Platinum Hall, Near University Road, Vesu, Surat"
                  value={fullAddress}
                  onChange={e => setFullAddress(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">Payout / Person (₹) *</label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-blue-600" />
                    <input
                      type="number"
                      min={100}
                      required
                      placeholder="1200"
                      value={payPerPerson}
                      onChange={e => setPayPerPerson(e.target.value ? Number(e.target.value) : '')}
                      className="w-full pl-8 pr-3 py-2 text-sm font-bold border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">Crew Members Needed *</label>
                  <div className="relative">
                    <Users className="w-4 h-4 absolute left-3 top-2.5 text-blue-600" />
                    <input
                      type="number"
                      min={1}
                      required
                      placeholder="5"
                      value={totalCrewNeeded}
                      onChange={e => setTotalCrewNeeded(e.target.value ? Number(e.target.value) : '')}
                      className="w-full pl-8 pr-3 py-2 text-sm font-bold border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REQUIREMENTS & BANNER */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Description & Responsibilities</label>
                <textarea
                  rows={2}
                  placeholder="Describe the tasks (e.g., Guest check-in, managing gift counters, stage assistance)"
                  value={workType}
                  onChange={e => setWorkType(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dress Code & Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Formal Black Suit / Saree provided by venue. Reach 30 mins early."
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Event Banner Photo (Optional)</label>
                  <span className="text-[10px] text-slate-400">Upload custom banner or leave blank</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  {bannerUrl ? (
                    <div className="relative h-32 rounded-xl overflow-hidden border border-slate-200">
                      <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setBannerUrl('')}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs font-semibold text-slate-600">No banner uploaded (Blank)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Event will display with clean category styling if left blank.</p>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 mt-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs">
                        <Upload className="w-3.5 h-3.5" /> Upload Event Banner
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-4 space-y-3">
                <div className="h-32 rounded-xl overflow-hidden relative bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex items-center justify-center">
                  {bannerUrl ? (
                    <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-white/90 p-4">
                      <Building className="w-8 h-8 mx-auto mb-1 opacity-70" />
                      <span className="text-xs font-bold tracking-wide">{title || 'Event Preview'}</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                    {category}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{title}</h4>
                  <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-600" /> {area || 'Venue'}, {activeCity.name}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> {eventDate} ({startTime} - {endTime})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Payout / Person</span>
                    <span className="text-base font-extrabold text-blue-600">₹{payPerPerson}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Crew Required</span>
                    <span className="text-base font-extrabold text-slate-800">{totalCrewNeeded} Members</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handlePublish}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                {loading ? 'Publishing...' : 'Publish Event Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
