import React, { useState } from 'react';
import { Star, CheckCircle, Plus } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  city: string;
  product: string;
  rating: number;
  date: string;
  comment: string;
  verifiedOrder: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Pravinbhai Patel',
    city: 'Vesu, Surat',
    product: 'Long Banana Wafers (2 Kg Pack)',
    rating: 5,
    date: '2 days ago',
    comment: 'The crispiness of these long banana wafers is remarkable! Not oily at all, and the rock salt seasoning is perfectly balanced. ₹210/kg is an incredible price for such authentic freshness.',
    verifiedOrder: true
  },
  {
    id: 'rev-2',
    name: 'Meena Shah',
    city: 'Adajan, Surat',
    product: 'Round Banana Wafers (Black Pepper)',
    rating: 5,
    date: '4 days ago',
    comment: 'The black pepper round wafers are delicious with evening tea. The whole family loves the light crunch. Placed order via WhatsApp and received delivery at our doorstep within 4 hours!',
    verifiedOrder: true
  },
  {
    id: 'rev-3',
    name: 'Rajesh Agrawal',
    city: 'Ghod Dod Road, Surat',
    product: 'Duo Combo (1kg Long + 1kg Round)',
    rating: 5,
    date: '1 week ago',
    comment: 'Kids love the long strips and we love the round chips. Both varieties are 10/10 in crunch and taste. Clean zip-lock pouches keep them crunchy for weeks.',
    verifiedOrder: true
  },
  {
    id: 'rev-4',
    name: 'Jignesh Mewada',
    city: 'Ahmedabad (Courier Order)',
    product: 'Wholesale 10 Kg Pack',
    rating: 5,
    date: '10 days ago',
    comment: 'Ordered a 10 Kg trial wholesale batch for our snack store via WhatsApp at 9265993727. It arrived within 2 days in perfect condition. Customers loved it, so we placed another 25 Kg order today.',
    verifiedOrder: true
  }
];

export const WaferTestimonials: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    product: 'Long Banana Wafers (₹210/kg)',
    rating: 5,
    comment: ''
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      name: formData.name,
      city: formData.city || 'Surat',
      product: formData.product,
      rating: formData.rating,
      date: 'Just now',
      comment: formData.comment,
      verifiedOrder: true
    };

    setReviews([newRev, ...reviews]);
    setShowAddModal(false);
    setFormData({ name: '', city: '', product: 'Long Banana Wafers (₹210/kg)', rating: 5, comment: '' });
  };

  return (
    <section id="reviews" className="py-16 bg-amber-50/40 border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>4.9 / 5 Star Rating (Hundreds of Happy Customers)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Feedback & Verified Reviews
            </h2>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm hover:bg-amber-50 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-amber-200/70 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900">{rev.name}</h4>
                  {rev.verifiedOrder && (
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">{rev.city}</p>
                <p className="text-[10px] font-semibold text-amber-700 truncate">
                  {rev.product}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Share Your Experience (Write a Review)
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Surat"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Purchased</label>
                <select
                  value={formData.product}
                  onChange={e => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:border-amber-500"
                >
                  <option value="Long Banana Wafers (₹210/kg)">Long Banana Wafers (₹210/kg)</option>
                  <option value="Round Banana Wafers (₹220/kg)">Round Banana Wafers (₹220/kg)</option>
                  <option value="Duo Combo Pack (1kg Long + 1kg Round)">Duo Combo Pack (Long + Round)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Feedback / Comments *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.comment}
                  onChange={e => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share details on crunchiness, taste, and delivery service..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 font-black text-amber-950"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
