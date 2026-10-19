import React from 'react';
import { ShoppingBag, Phone, Sparkles } from 'lucide-react';
import { useWaferCart } from '../context/WaferCartContext';
import { DISPLAY_PHONE, WHATSAPP_NUMBER } from '../data/wafersData';

export const WaferNavbar: React.FC = () => {
  const { totalItemsCount, totalAmount, setIsCartOpen } = useWaferCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-amber-100">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white text-xs md:text-sm font-medium py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-spin" />
            100% Fresh & Crispy Banana Wafers • Pure Rock Salt
          </span>
          <p className="mx-auto sm:mx-0 flex items-center gap-2">
            <span>🚀 Order instantly via WhatsApp:</span>
            <a
              href={`https://wa.me/91${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold underline decoration-yellow-300 hover:text-yellow-200 transition-colors"
            >
              +91 {WHATSAPP_NUMBER}
            </a>
          </p>
          <span className="hidden md:inline text-yellow-200 font-medium">
            Same-Day Surat Delivery | Pan-India Courier
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-2xl" role="img" aria-label="banana">🍌</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-amber-950 font-serif">
                Above<span className="text-amber-600">Z</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                Wafers
              </span>
            </div>
            <p className="text-xs text-amber-700/90 font-medium">
              Fresh & Crispy Banana Chips
            </p>
          </div>
        </a>

        {/* Quick Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <a href="#products" className="hover:text-amber-600 transition-colors">
            Our Products
          </a>
          <a href="#long-wafers" className="hover:text-amber-600 transition-colors flex items-center gap-1">
            <span>Long Wafers</span>
            <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">₹210/kg</span>
          </a>
          <a href="#round-wafers" className="hover:text-amber-600 transition-colors flex items-center gap-1">
            <span>Round Wafers</span>
            <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">₹220/kg</span>
          </a>
          <a href="#wholesale" className="hover:text-amber-600 transition-colors">
            Wholesale / Bulk
          </a>
          <a href="#quality" className="hover:text-amber-600 transition-colors">
            Our Quality
          </a>
          <a href="#reviews" className="hover:text-amber-600 transition-colors">
            Reviews
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Phone Call */}
          <a
            href={`tel:+91${WHATSAPP_NUMBER}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-700 transition-all"
            title="Call to Order"
          >
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>{DISPLAY_PHONE}</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello AboveZ! I want to inquire and order fresh banana wafers.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-base leading-none">💬</span>
            <span className="hidden xs:inline">WhatsApp</span>
            <span>Order</span>
          </a>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs sm:text-sm shadow-sm shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-amber-950 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
              {totalItemsCount}
            </span>
            {totalAmount > 0 && (
              <span className="hidden md:inline font-extrabold text-amber-950">
                ₹{totalAmount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
