import React from 'react';
import { Award, Sparkles } from 'lucide-react';

export const WaferFeatures: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'A-Grade Fresh Green Bananas',
      subtitle: 'Farm Direct Raw Produce',
      desc: 'We strictly source solid, mature green raw bananas directly from trusted growers to ensure consistent crunch and golden texture.'
    },
    {
      num: '02',
      title: 'Precision Slicing',
      subtitle: 'Consistent Strips & Round Cuts',
      desc: 'Uniformly thin circular chips and golden long strips sliced with specialized food-grade cutters for even frying and light crispiness.'
    },
    {
      num: '03',
      title: '100% Pure Oil Frying',
      subtitle: 'Fresh Daily Batch Cooking',
      desc: 'Fried in fresh, clean edible oil without palm oil or burnt oil reuse, keeping our wafers light, crispy, and easy on digestion.'
    },
    {
      num: '04',
      title: 'Pure Rock Salt & Spices',
      subtitle: 'Upvas / Fasting Compliant',
      desc: 'Seasoned with 100% authentic Sendha Namak (Rock Salt) and fresh stone-ground black pepper, making it pure and auspicious for fasting days.'
    },
    {
      num: '05',
      title: 'Moisture-Lock Sealed Packing',
      subtitle: 'Crunch Preserved for Weeks',
      desc: 'Multi-layer airtight zip-lock pouches ensure moisture stays out and freshness stays locked, even weeks after delivery.'
    }
  ];

  return (
    <section id="quality" className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>100% Purity & Crunch Guarantee</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Why Our Banana Wafers Taste Incomparably Crispy
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            We never compromise on ingredient quality. Here is how our team prepares the freshest batch every morning.
          </p>
        </div>

        {/* 5 Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 hover:bg-amber-50 hover:shadow-md transition-all space-y-3 relative overflow-hidden group"
            >
              <div className="text-3xl font-black text-amber-300 group-hover:text-amber-500 transition-colors font-mono">
                {step.num}
              </div>
              <h3 className="text-base font-black text-slate-900">
                {step.title}
              </h3>
              <p className="text-xs font-semibold text-amber-800">
                {step.subtitle}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Upvas / Vrat Special Highlight Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 to-yellow-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>Religious Fasting (Upvas / Vrat Special)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Prepared with 100% Pure Rock Salt (Sendha Namak)
            </h3>
            <p className="text-xs sm:text-sm text-yellow-100 max-w-xl">
              Enjoy without hesitation during Ekadashi, Navratri, Shivratri, and other fasting days. Our rock salt and black pepper wafers are prepared with high sanctity.
            </p>
          </div>

          <a
            href="#products"
            className="shrink-0 px-6 py-3 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Order Fresh Wafers Now
          </a>
        </div>
      </div>
    </section>
  );
};
