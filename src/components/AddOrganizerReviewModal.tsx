import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { EventOrganizer } from '../types';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface AddOrganizerReviewModalProps {
  organizer: EventOrganizer;
  onClose: () => void;
  onSuccess: () => void;
}

const PRAISE_TAG_OPTIONS = [
  'Flawless Coordination',
  'Breathtaking Decor',
  'Polite Hospitality Crew',
  '100% On Time',
  'Budget Friendly',
  'High Technical AV Quality',
  'Delicious Catering Flow',
  'Stress-Free Planning'
];

export const AddOrganizerReviewModal: React.FC<AddOrganizerReviewModalProps> = ({
  organizer,
  onClose,
  onSuccess
}) => {
  const { user, activeCity } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [decorRating, setDecorRating] = useState<number>(5);
  const [coordinationRating, setCoordinationRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);

  const [clientName, setClientName] = useState(user?.name || '');
  const [clientCity, setClientCity] = useState(user?.city || activeCity.name);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState(organizer.categories[0] || 'Wedding');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Flawless Coordination', '100% On Time']);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!eventTitle.trim()) {
      setError('Please enter the event or function name you booked.');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a brief review testimonial.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.submitOrganizerReview(organizer.id, {
        clientId: user?.id,
        clientName: clientName.trim(),
        clientCity: clientCity.trim(),
        eventTitle: eventTitle.trim(),
        eventCategory,
        eventDate: new Date().toISOString().split('T')[0],
        rating,
        decorRating,
        coordinationRating,
        punctualityRating,
        comment: comment.trim(),
        praiseTags: selectedTags
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-amber-100 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> Rate & Review Organizer
          </div>
          <h2 className="text-xl font-black text-white mt-1 truncate">
            {organizer.companyName}
          </h2>
          <p className="text-xs text-amber-100 mt-0.5">
            Share your authentic experience to help other organizers and clients in {activeCity.name}.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Star Rating Selector */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-center">
            <label className="block text-xs font-black text-amber-900 mb-1">
              Overall Organizer Rating
            </label>
            <div className="flex items-center justify-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= rating
                        ? 'text-amber-500 fill-amber-400 filter drop-shadow-xs'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-amber-800">
              {rating === 5 ? 'Exceptional (5.0)' :
               rating === 4 ? 'Great Experience (4.0)' :
               rating === 3 ? 'Average (3.0)' :
               rating === 2 ? 'Needs Improvement (2.0)' : 'Unsatisfactory (1.0)'}
            </div>
          </div>

          {/* Sub-ratings */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 mb-1">Decor & Setup</span>
              <select
                value={decorRating}
                onChange={(e) => setDecorRating(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-bold text-slate-800"
              >
                <option value={5}>5.0 Rating</option>
                <option value={4}>4.0 Rating</option>
                <option value={3}>3.0 Rating</option>
              </select>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-500 mb-1">Coordination</span>
              <select
                value={coordinationRating}
                onChange={(e) => setCoordinationRating(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-bold text-slate-800"
              >
                <option value={5}>5.0 Rating</option>
                <option value={4}>4.0 Rating</option>
                <option value={3}>3.0 Rating</option>
              </select>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-500 mb-1">Punctuality</span>
              <select
                value={punctualityRating}
                onChange={(e) => setPunctualityRating(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-bold text-slate-800"
              >
                <option value={5}>5.0 Rating</option>
                <option value={4}>4.0 Rating</option>
                <option value={3}>3.0 Rating</option>
              </select>
            </div>
          </div>

          {/* Praise Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Highlight Highlights (Select all that apply):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRAISE_TAG_OPTIONS.map(tag => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                      active
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag} {active ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event & Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Shah"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your City / Area
              </label>
              <input
                type="text"
                placeholder="e.g. Vesu, Surat"
                value={clientCity}
                onChange={(e) => setClientCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Event / Function Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sangeet & Reception at Avadh Utopia"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
              >
                {organizer.categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Feedback Testimonial */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Review / Testimonial <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe their execution quality, decoration look, stage management, and how the guest crew performed..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-500 outline-none transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-xs font-black rounded-xl shadow-md shadow-amber-600/20 flex items-center gap-1.5 transition-all"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
