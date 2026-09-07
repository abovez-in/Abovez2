import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Clock,
  Shirt,
  MessageSquare,
  ThumbsUp,
  UserCheck
} from 'lucide-react';
import { api } from '../lib/api';

interface ReviewCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  crewId: string;
  crewName: string;
  eventId: string;
  eventTitle: string;
  handlerId: string;
  onSuccess: () => void;
}

export const ReviewCrewModal: React.FC<ReviewCrewModalProps> = ({
  isOpen,
  onClose,
  crewId,
  crewName,
  eventId,
  eventTitle,
  handlerId,
  onSuccess
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [workQualityRating, setWorkQualityRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isNoShow, setIsNoShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickFeedbackOptions = [
    'Arrived 30 mins early',
    'Immaculate uniform & grooming',
    'Extremely polite with VIP guests',
    'Proactive & hardworking',
    'Highly recommended for future events',
    'Followed all instructions perfectly'
  ];

  const handleAddQuickTag = (tag: string) => {
    const cleanTag = tag.trim();
    if (comment.includes(cleanTag)) return;
    setComment(prev => prev ? `${prev}. ${cleanTag}` : cleanTag);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.submitCrewReview({
        handlerId,
        crewId,
        eventId,
        rating: isNoShow ? 1 : rating,
        punctualityRating: isNoShow ? 1 : punctualityRating,
        workQualityRating: isNoShow ? 1 : workQualityRating,
        comment: comment || (isNoShow ? 'Crew marked as No-Show by Organizer.' : 'Great work and timely performance!'),
        isNoShow
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5: return '⭐⭐⭐⭐⭐ Outstanding (5.0)';
      case 4: return '⭐⭐⭐⭐ Very Good (4.0)';
      case 3: return '⭐⭐⭐ Good / Satisfactory (3.0)';
      case 2: return '⭐⭐ Needs Improvement (2.0)';
      case 1: return '⭐ Poor (1.0)';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              Crew Rating & Review
            </span>
          </div>

          <h2 className="text-xl font-black text-white">Rate {crewName}</h2>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
            Event: <strong className="text-white">{eventTitle}</strong>
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* No-Show Flag Toggle */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isNoShow ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isNoShow}
                onChange={(e) => setIsNoShow(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  Report No-Show (Crew did not arrive at venue)
                </span>
                <p className="text-[11px] text-slate-500">
                  Enable this ONLY if the crew member failed to attend without prior notice. This will update their verified reliability score.
                </p>
              </div>
            </label>
          </div>

          {!isNoShow ? (
            <>
              {/* Overall Star Rating */}
              <div className="text-center space-y-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                  Overall Performance Rating
                </label>
                
                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          (hoverRating !== null ? star <= hoverRating : star <= rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="text-xs font-bold text-amber-800">
                  {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
                </div>
              </div>

              {/* Granular Ratings: Punctuality & Work Quality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Punctuality */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> Punctuality:
                    </span>
                    <span className="text-xs font-black text-blue-600">{punctualityRating}.0 ⭐</span>
                  </div>
                  <div className="flex gap-1 justify-center pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setPunctualityRating(star)}
                        className="p-1"
                      >
                        <Star className={`w-5 h-5 ${star <= punctualityRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Professionalism & Work Quality */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Shirt className="w-3.5 h-3.5 text-indigo-600" /> Work & Grooming:
                    </span>
                    <span className="text-xs font-black text-indigo-600">{workQualityRating}.0 ⭐</span>
                  </div>
                  <div className="flex gap-1 justify-center pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setWorkQualityRating(star)}
                        className="p-1"
                      >
                        <Star className={`w-5 h-5 ${star <= workQualityRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Quick Feedback Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">
                  Quick Praise & Compliments:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickFeedbackOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddQuickTag(opt)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:border-blue-300 text-slate-700 text-[11px] font-medium rounded-lg border border-slate-200 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Written Review */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Written Feedback / Testimonial:
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share feedback on attendance, attitude, and work quality..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all resize-none"
                />
              </div>
            </>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                No-Show Reporting Confirmation
              </p>
              <p>
                Marking <strong>{crewName}</strong> as No-Show will alert our admin team and reflect on their reliability metric.
              </p>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional explanation of no-show incident..."
                className="w-full px-3 py-2 bg-white border border-red-200 rounded-xl text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2.5 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 text-white ${
                isNoShow ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitting ? (
                'Submitting...'
              ) : isNoShow ? (
                <>Submit No-Show Report</>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Submit Rating & Review
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
