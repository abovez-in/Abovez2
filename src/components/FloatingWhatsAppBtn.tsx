import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { DISPLAY_PHONE, WHATSAPP_NUMBER } from '../data/wafersData';

export const FloatingWhatsAppBtn: React.FC = () => {
  const whatsappUrl = `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello AboveZ! I want to order Banana Wafers (Long: ₹210/kg, Round: ₹220/kg).')}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Phone Floating Quick Call */}
      <a
        href={`tel:+91${WHATSAPP_NUMBER}`}
        className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border-2 border-white"
        title="Call 9265993727"
        aria-label="Call 9265993727"
      >
        <Phone className="w-5 h-5 fill-amber-950 text-amber-950" />
      </a>

      {/* WhatsApp Main Floating Action */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white"
        aria-label="Order on WhatsApp"
      >
        {/* Radar Pulse Effect */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>

        <MessageCircle className="w-6 h-6 fill-white text-white shrink-0" />
        <div className="text-left leading-tight hidden sm:block">
          <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
            WhatsApp Inquiry
          </p>
          <p className="text-xs font-black">
            +91 {WHATSAPP_NUMBER}
          </p>
        </div>
      </a>
    </div>
  );
};
