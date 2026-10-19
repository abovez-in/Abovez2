import React from 'react';
import { WaferHero } from '../components/WaferHero';
import { WaferProductCard } from '../components/WaferProductCard';
import { WaferFeatures } from '../components/WaferFeatures';
import { WaferBulkInquiry } from '../components/WaferBulkInquiry';
import { WaferTestimonials } from '../components/WaferTestimonials';
import { WaferFAQ } from '../components/WaferFAQ';
import { WAFER_PRODUCTS, WHATSAPP_NUMBER } from '../data/wafersData';
import { useWaferCart } from '../context/WaferCartContext';
import { ShoppingBag, Sparkles, MessageCircle } from 'lucide-react';

export const WaferStorePage: React.FC = () => {
  const { addToCart, setIsCartOpen } = useWaferCart();

  const handleAddCombo = () => {
    // Add 1kg Long + 1kg Round
    addToCart({
      productId: 'long-kela-wafers',
      productName: 'Long Banana Wafers',
      flavorId: 'rock-salt',
      flavorName: 'Rock Salt (Fasting Special)',
      weightGrams: 1000,
      weightLabel: '1 Kg Family Pack',
      price: 210,
      quantity: 1
    });

    addToCart({
      productId: 'round-kela-wafers',
      productName: 'Round Banana Wafers',
      flavorId: 'classic-salted',
      flavorName: 'Classic Rock Salt',
      weightGrams: 1000,
      weightLabel: '1 Kg Family Pack',
      price: 220,
      quantity: 1
    });

    setIsCartOpen(true);
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <WaferHero />

      {/* 2. Main Product Showcase Section */}
      <section id="products" className="py-16 bg-slate-50/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Fresh Batch • Direct Prices</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Our Signature Banana Wafers & Rates
            </h2>
            <p className="text-sm text-slate-600">
              Select your favorite pack size (250g, 500g, 1kg, 2kg, 5kg) and flavor to order directly on WhatsApp.
            </p>
          </div>

          {/* Both Main Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {WAFER_PRODUCTS.map(product => (
              <WaferProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Duo Combo Offer Banner */}
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-amber-950 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-amber-300">
            <div className="space-y-2 text-center sm:text-left">
              <span className="px-3 py-1 rounded-full bg-amber-950 text-white font-black text-xs uppercase tracking-wider">
                Super Value Combo Pack
              </span>
              <h3 className="text-2xl font-black">
                Long + Round Duo Pack (2 Kg Total)
              </h3>
              <p className="text-sm font-semibold text-amber-950/90 max-w-lg">
                1 Kg Long Banana Wafers (₹210) + 1 Kg Round Banana Wafers (₹220) = 2 Kg total for just <strong>₹430</strong>! Experience both distinct cuts in one value pack.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAddCombo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-950 hover:bg-black text-white font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add Combo to Cart</span>
              </button>

              <a
                href={`https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello AboveZ! I want to order the 2kg Duo Combo (1kg Long + 1kg Round = ₹430). Please confirm delivery.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order Combo via WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Features & Preparation Process */}
      <WaferFeatures />

      {/* 4. Wholesale & Bulk Order Section */}
      <WaferBulkInquiry />

      {/* 5. Customer Testimonials */}
      <WaferTestimonials />

      {/* 6. FAQ Section */}
      <WaferFAQ />
    </div>
  );
};
