import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { DISPLAY_PHONE, WHATSAPP_NUMBER } from '../data/wafersData';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'What are the prices for Long and Round Banana Wafers?',
    a: 'We offer two signature varieties: 1. Long Banana Wafers (Long Cut Strips) at ₹210 per Kilogram (Kg). 2. Round Banana Wafers (Classic Round Chips) at ₹220 per Kilogram (Kg). We also offer 250g, 500g, 1kg, 2kg, and 5kg wholesale/family packs.'
  },
  {
    q: 'How do I place an order on WhatsApp?',
    a: `You can click any green "Order on WhatsApp" button on this website, or directly message us on WhatsApp at +91 ${WHATSAPP_NUMBER} with your required items, quantity, delivery address, and pincode. We confirm orders and dispatch schedules immediately.`
  },
  {
    q: 'Can these banana wafers be consumed during fasting (Vrat / Upvas)?',
    a: 'Yes, absolutely! Our Rock Salt (Sendha Namak) and Black Pepper wafers are prepared using 100% pure Himalayan Rock Salt and clean edible oil, making them completely compliant and pure for Ekadashi, Navratri, Shivratri, and other fasting rituals.'
  },
  {
    q: 'What is the delivery time?',
    a: 'Within Surat city, we provide same-day or 24-hour express doorstep delivery. For all other cities across Gujarat and India, we dispatch via reliable express couriers, typically arriving within 2 to 4 working days.'
  },
  {
    q: 'What is the shelf life of the wafers?',
    a: 'Our banana wafers are packed in food-grade, moisture-proof zip-lock pouches. Unopened, they retain full crispiness and fresh flavor for 60 to 90 days. Once opened, simply reseal the zip-lock or store in an airtight container.'
  },
  {
    q: 'Are wholesale or bulk discounts available for shops, caterers, or weddings?',
    a: `Yes! For bulk orders of 10 Kg, 25 Kg, 50 Kg, or 100+ Kg, we offer special discounted wholesale rates and customized packaging. Please message us directly on WhatsApp at ${DISPLAY_PHONE} to get our best wholesale quote.`
  },
  {
    q: 'Which payment methods are accepted?',
    a: 'We accept Cash on Delivery (COD) as well as instant digital UPI payments through Google Pay, PhonePe, Paytm, and direct bank transfers.'
  }
];

export const WaferFAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Got Questions? We Have Answers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Everything you need to know about pricing, quality, WhatsApp ordering, and delivery.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Strip */}
        <div className="mt-10 p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-amber-950 text-sm">
              Have another question or custom order requirement?
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Contact us directly via WhatsApp or Call: +91 {WHATSAPP_NUMBER}
            </p>
          </div>
          <a
            href={`https://wa.me/91${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
