import React from 'react';
import { Truck, CheckCircle2, ShoppingCart, MessageCircle, ArrowRight } from 'lucide-react';
import { DISPLAY_PHONE, WHATSAPP_NUMBER } from '../data/wafersData';
import { useWaferCart } from '../context/WaferCartContext';

export const WaferHero: React.FC = () => {
  const { setIsCartOpen } = useWaferCart();

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 pt-8 pb-16 lg:py-20">
      {/* Background Subtle Circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-yellow-200/30 to-amber-100/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/60 shadow-xs text-xs sm:text-sm font-bold mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct From Kitchen • 100% Fresh Daily Batch</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              100% Fresh, Pure &{' '}
              <span className="text-amber-600 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">
                Ultra-Crispy
              </span>{' '}
              Banana Wafers
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Surat's favorite authentic crunch! Freshly fried every morning in pure edible oil from selected raw green bananas. Available in pure Rock Salt (Upvas / Fasting special) and spicy pepper flavors.
            </p>

            {/* Price Highlights Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto lg:mx-0 pt-2">
              {/* Long Wafers Card */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all text-left">
                <span className="absolute top-2 right-2 text-xs font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  Top Seller
                </span>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Long Banana Wafers (Strips)</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-amber-950">₹210</span>
                  <span className="text-sm font-semibold text-slate-500">/ per Kilogram (Kg)</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Crispy golden long cut strips • Unbeatable crunch
                </p>
                <a
                  href="#long-wafers"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900"
                >
                  <span>Select Size & Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Round Wafers Card */}
              <div className="p-4 rounded-2xl bg-yellow-50 border-2 border-yellow-300 shadow-xs relative overflow-hidden group hover:border-yellow-400 transition-all text-left">
                <span className="absolute top-2 right-2 text-xs font-black bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded-full">
                  Classic Favorite
                </span>
                <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Round Banana Wafers (Chips)</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-yellow-950">₹220</span>
                  <span className="text-sm font-semibold text-slate-500">/ per Kilogram (Kg)</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Traditional thin circular chips • Perfect tea companion
                </p>
                <a
                  href="#round-wafers"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-yellow-800 hover:text-yellow-950"
                >
                  <span>Select Size & Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello AboveZ! I want to order 1kg Long Banana Wafers and 1kg Round Banana Wafers.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Order via WhatsApp ({DISPLAY_PHONE})</span>
              </a>

              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-base shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>View & Customize Cart</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">100% Pure Oil</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Rock Salt (Fasting)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Zero Preservatives</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Airtight Zip-Lock</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Visual Card Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-amber-900/10">
                <img
                  src="https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=1000&q=80"
                  alt="Crispy Banana Wafers"
                  className="w-full h-[380px] sm:h-[460px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-amber-950 font-black text-xs uppercase tracking-wider">
                      Fresh Batch Ready
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-white font-bold text-xs">
                      Surat • Pan-India
                    </span>
                  </div>
                  <h3 className="text-2xl font-black leading-tight text-yellow-300">
                    AboveZ Banana Wafers
                  </h3>
                  <p className="text-sm text-slate-200 mt-1">
                    Long ₹210/kg • Round ₹220/kg • Authentic Crunchy Flavor
                  </p>
                </div>
              </div>

              {/* Floating Pill 1: WhatsApp Contact */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-amber-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageCircle className="w-6 h-6 fill-emerald-600 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">WhatsApp Inquiry</p>
                  <a
                    href={`https://wa.me/91${WHATSAPP_NUMBER}`}
                    className="text-sm font-black text-emerald-700 hover:underline"
                  >
                    +91 {WHATSAPP_NUMBER}
                  </a>
                </div>
              </div>

              {/* Floating Pill 2: Fast Dispatch */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-amber-500 text-amber-950 rounded-2xl px-4 py-2.5 shadow-xl border-2 border-white flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span className="text-xs font-black">Same-Day Dispatch</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
