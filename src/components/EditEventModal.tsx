import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, IndianRupee, Users, MapPin, Briefcase, FileText, Check, AlertCircle } from 'lucide-react';
import { EventItem, EventCategory } from '../types';
import { api } from '../lib/api';
import { CustomDatePicker } from './CustomDatePicker';

interface EditEventModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
  onEventUpdated: (updatedEvent: EventItem) => void;
}

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

export const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  event,
  onClose,
  onEventUpdated
}) => {
  if (!isOpen || !event) return null;

  const [title, setTitle] = useState(event.title);
  const [category, setCategory] = useState<EventCategory>(event.category);
  const [eventDate, setEventDate] = useState(event.eventDate);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [payPerPerson, setPayPerPerson] = useState(event.payPerPerson);
  const [totalCrewNeeded, setTotalCrewNeeded] = useState(event.totalCrewNeeded);
  const [city, setCity] = useState(event.city);
  const [area, setArea] = useState(event.area);
  const [fullAddress, setFullAddress] = useState(event.fullAddress);
  const [workType, setWorkType] = useState(event.workType);
  const [instructions, setInstructions] = useState(event.instructions || '');
  const [bannerUrl, setBannerUrl] = useState(event.bannerUrl || '');
  const [status, setStatus] = useState(event.status);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setCategory(event.category);
      setEventDate(event.eventDate);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setPayPerPerson(event.payPerPerson);
      setTotalCrewNeeded(event.totalCrewNeeded);
      setCity(event.city);
      setArea(event.area);
      setFullAddress(event.fullAddress);
      setWorkType(event.workType);
      setInstructions(event.instructions || '');
      setBannerUrl(event.bannerUrl || '');
      setStatus(event.status);
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.updateEvent(event.id, {
        handlerId: event.handlerId,
        title,
        category,
        eventDate,
        startTime,
        endTime,
        payPerPerson: Number(payPerPerson),
        totalCrewNeeded: Number(totalCrewNeeded),
        city,
        area,
        fullAddress,
        workType,
        instructions,
        bannerUrl,
        status
      });

      onEventUpdated(res.event);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-black text-slate-900">Edit Event Details</h2>
            <p className="text-[11px] text-slate-500">Update date, location, timings, pay rate, and crew requirements</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker with Year Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <CustomDatePicker
                label="Event Date"
                value={eventDate}
                onChange={setEventDate}
                minYear={2024}
                maxYear={2035}
                required
                helperText="Switch year or month easily"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Time *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Pay & Crew Needed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pay Per Person (₹) *</label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="number"
                  required
                  min={100}
                  value={payPerPerson}
                  onChange={e => setPayPerPerson(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Crew Needed *</label>
              <div className="relative">
                <Users className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="number"
                  required
                  min={1}
                  value={totalCrewNeeded}
                  onChange={e => setTotalCrewNeeded(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Event Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-bold text-slate-800"
              >
                <option value="active">Active (Hiring Open)</option>
                <option value="crew_full">Crew Full (Locked)</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Area / Locality *</label>
              <input
                type="text"
                required
                placeholder="e.g. Vesu, Adajan, Citylight"
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Venue Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. Surat International Exhibition and Convention Centre (SIECC), Sarsana"
              value={fullAddress}
              onChange={e => setFullAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Work Type & Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Description / Roles *</label>
            <input
              type="text"
              required
              placeholder="e.g. Stage ushering, guest hospitality, backstage coordination"
              value={workType}
              onChange={e => setWorkType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Special Instructions & Dress Code</label>
            <textarea
              rows={2}
              placeholder="e.g. Dress code: Formal Black Shirt & Trousers. Report 30 mins before start time."
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Banner URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Event Banner Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={bannerUrl}
              onChange={e => setBannerUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              {loading ? 'Saving Changes...' : 'Save & Update Event'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
