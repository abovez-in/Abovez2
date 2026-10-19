import React from 'react';
import { Phone, MessageCircle, MapPin, Mail, ShieldCheck, Heart, Package } from 'lucide-react';
import { DISPLAY_PHONE, WHATSAPP_NUMBER } from '../data/wafersData';

export const WaferFooter: React.FC = () => {
  return (
    <footer className="bg-amber-950 text-white border-t border-amber-900 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-950" />
              </div>
              <span className="text-2xl font-black tracking-tight font-serif text-white">
                Above<span className="text-amber-400">Z</span> Wafers
              </span>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Surat's premier destination for freshly prepared, super-crunchy banana wafers. Made using 100% pure edible oil and natural rock salt.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Purity & Crispiness Guaranteed</span>
            </div>
          </div>

          {/* Pricing Menu */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">
              Our Products & Current Rates
            </h4>
            <ul className="space-y-2 text-amber-200/80">
              <li className="flex justify-between items-center pb-1.5 border-b border-amber-900/60">
                <span className="font-medium">Long Banana Wafers (Strips)</span>
                <span className="font-black text-amber-400">₹210 / kg</span>
              </li>
              <li className="flex justify-between items-center pb-1.5 border-b border-amber-900/60">
                <span className="font-medium">Round Banana Wafers (Chips)</span>
                <span className="font-black text-amber-400">₹220 / kg</span>
              </li>
              <li className="flex justify-between items-center pb-1.5 border-b border-amber-900/60">
                <span className="font-medium">250g / 500g Retail Pouches</span>
                <span className="text-slate-300">Available</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium">10kg+ Bulk & Wholesale Orders</span>
                <span className="font-bold text-emerald-400">Special Discount</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2 text-amber-200/80">
              <li>
                <a href="#long-wafers" className="hover:text-amber-400 transition-colors">
                  Order Long Wafers (₹210/kg)
                </a>
              </li>
              <li>
                <a href="#round-wafers" className="hover:text-amber-400 transition-colors">
                  Order Round Wafers (₹220/kg)
                </a>
              </li>
              <li>
                <a href="#wholesale" className="hover:text-amber-400 transition-colors">
                  Wholesale & Bulk Inquiries
                </a>
              </li>
              <li>
                <a href="#quality" className="hover:text-amber-400 transition-colors">
                  Quality & Hygiene Standards
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-amber-400 transition-colors">
                  Verified Customer Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp & Contact */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">
              Direct Contact & WhatsApp
            </h4>
            <div className="space-y-2.5 text-amber-200/90">
              <a
                href={`https://wa.me/91${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400" />
                <span>WhatsApp: +91 {WHATSAPP_NUMBER}</span>
              </a>

              <a
                href={`tel:+91${WHATSAPP_NUMBER}`}
                className="flex items-center gap-2.5 hover:text-white"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call: {DISPLAY_PHONE}</span>
              </a>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Surat, Gujarat, India - 395007</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>abovez.in@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-amber-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-200/60">
          <p>© {new Date().getFullYear()} AboveZ Banana Wafers. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with purity in Surat</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>

      </div>
    </footer>
  );
};
