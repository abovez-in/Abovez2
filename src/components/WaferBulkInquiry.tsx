import React, { useState } from 'react';
import { Package, Truck, MessageCircle, Building2, BadgePercent } from 'lucide-react';
import { DISPLAY_PHONE, WHATSAPP_NUMBER, generateBulkInquiryWhatsAppUrl } from '../data/wafersData';

export const WaferBulkInquiry: React.FC = () => {
  const [productType, setProductType] = useState('Both Long & Round Wafers (Mix Combo)');
  const [quantityKg, setQuantityKg] = useState(25);
  const [city, setCity] = useState('Surat');
  const [businessType, setBusinessType] = useState('Retail Grocery / Sweet Shop');

  const handleSendInquiry = () => {
    const url = generateBulkInquiryWhatsAppUrl(productType, quantityKg, city, businessType);
    window.open(url, '_blank');
  };

  return (
    <section id="wholesale" className="py-16 bg-gradient-to-b from-amber-500/10 via-amber-100/40 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-yellow-300 border border-amber-500/30 text-xs font-bold">
                <BadgePercent className="w-4 h-4" />
                <span>Wholesale & Bulk Orders Inquiry</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                Special Wholesale Discounts for{' '}
                <span className="text-yellow-400">Retailers, Caterers & Events</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Looking for 10 Kg to 100+ Kg of fresh banana wafers for your retail store, supermarket, snack shop, catering, or wedding function? We offer daily fresh batch manufacturing with highly competitive wholesale margins and secure moisture-lock packing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Package className="w-5 h-5 text-yellow-400 mb-1" />
                  <p className="font-bold text-white">5kg / 10kg Bulk Bags</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Heavy-duty food grade packing</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Truck className="w-5 h-5 text-yellow-400 mb-1" />
                  <p className="font-bold text-white">Surat & Gujarat Transport</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Fast direct courier/cargo dispatch</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Building2 className="w-5 h-5 text-yellow-400 mb-1" />
                  <p className="font-bold text-white">Direct From Kitchen</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Zero middlemen, best factory rates</p>
                </div>
              </div>
            </div>

            {/* Right Form Box */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 text-slate-900 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center justify-between">
                <span>Request Wholesale Quotation</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  Instant Reply
                </span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Select Product Type
                  </label>
                  <select
                    value={productType}
                    onChange={e => setProductType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold outline-none focus:border-amber-500"
                  >
                    <option value="Long Banana Wafers">Long Banana Wafers (Base Rate ₹210/kg)</option>
                    <option value="Round Banana Wafers">Round Banana Wafers (Base Rate ₹220/kg)</option>
                    <option value="Both Long & Round Wafers (Mix Combo)">Both Long & Round Wafers (Mix Combo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Estimated Quantity (Kg)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 25, 50, 100].map(kg => (
                      <button
                        key={kg}
                        type="button"
                        onClick={() => setQuantityKg(kg)}
                        className={`py-1.5 rounded-lg border font-bold text-xs ${
                          quantityKg === kg
                            ? 'bg-amber-500 text-amber-950 border-amber-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {kg} Kg
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Your City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Surat, Mumbai"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Business Type
                    </label>
                    <select
                      value={businessType}
                      onChange={e => setBusinessType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold outline-none focus:border-amber-500"
                    >
                      <option value="Retail Grocery / Sweet Shop">Retail Grocery / Snack Shop</option>
                      <option value="Catering / Wedding Planner">Catering / Event Function</option>
                      <option value="Wholesale Distributor">Wholesale Distributor</option>
                      <option value="Personal Large Event">Personal Large Order</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendInquiry}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Inquire Wholesale Rates ({DISPLAY_PHONE})</span>
                </button>

                <p className="text-[11px] text-center text-slate-500">
                  Direct WhatsApp quotation and dispatch schedule will be shared instantly.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
