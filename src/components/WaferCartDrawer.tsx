import React from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, Truck, MapPin, Phone, User } from 'lucide-react';
import { useWaferCart } from '../context/WaferCartContext';
import { DISPLAY_PHONE, WHATSAPP_NUMBER } from '../data/wafersData';

export const WaferCartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    totalWeightKg,
    customerInfo,
    setCustomerInfo,
    submitWhatsAppOrder
  } = useWaferCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-amber-500 text-amber-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-lg font-black tracking-tight">
                Your Order List (Cart)
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-amber-700">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Your cart is empty
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Add Long Banana Wafers (₹210/kg) or Round Banana Wafers (₹220/kg) to build your customized order.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Selected Items ({cart.length})</span>
                    <button
                      onClick={clearCart}
                      className="text-rose-600 hover:underline text-[11px]"
                    >
                      Clear All
                    </button>
                  </div>

                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-slate-900 truncate">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-amber-800 font-semibold mt-0.5">
                          {item.flavorName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.weightLabel} • ₹{item.price} per pack
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-white rounded-lg border border-slate-300 p-1">
                        <button
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-amber-950">
                          ₹{item.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-rose-500 hover:text-rose-700 text-xs mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 ml-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Details Form */}
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Delivery Address & Contact Details</span>
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={customerInfo.name}
                          onChange={e => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Ramesh Patel"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1">
                        Mobile / WhatsApp Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          value={customerInfo.phone}
                          onChange={e => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1">
                        Complete Delivery Address *
                      </label>
                      <textarea
                        rows={2}
                        value={customerInfo.address}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="e.g. Flat 302, Royal Residency, Vesu"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={customerInfo.city}
                          onChange={e => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Surat"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-bold mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={customerInfo.pincode}
                          onChange={e => setCustomerInfo(prev => ({ ...prev, pincode: e.target.value }))}
                          placeholder="395007"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1">
                        Special Instructions / Notes
                      </label>
                      <input
                        type="text"
                        value={customerInfo.notes}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="e.g. Please provide Rock Salt fasting pack"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Note */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Truck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Delivery & Payment Information</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    • Same-day / 24-hour delivery across Surat.<br />
                    • Reliable courier service within 2-4 days for other cities.<br />
                    • Payment: Cash on Delivery (COD) or UPI (Google Pay / PhonePe / Paytm).
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer with Totals and WhatsApp CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total Weight:</span>
                  <span className="font-bold text-slate-900">{totalWeightKg.toFixed(2)} Kg</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-xl text-amber-900">₹{totalAmount}</span>
                </div>
              </div>

              {/* Primary WhatsApp Action */}
              <button
                type="button"
                onClick={submitWhatsAppOrder}
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Send Order via WhatsApp ({DISPLAY_PHONE})</span>
              </button>

              <p className="text-[11px] text-center text-slate-500">
                Clicking will open WhatsApp with your pre-filled order ready to send to <strong>+91 {WHATSAPP_NUMBER}</strong>.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
