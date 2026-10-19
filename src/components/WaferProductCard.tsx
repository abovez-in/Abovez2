import React, { useState } from 'react';
import { WaferProduct, generateSingleProductWhatsAppUrl } from '../data/wafersData';
import { useWaferCart } from '../context/WaferCartContext';
import { Check, MessageCircle, ShoppingBag, Plus, Minus, Sparkles } from 'lucide-react';

interface Props {
  product: WaferProduct;
}

export const WaferProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart } = useWaferCart();

  const [selectedPackIndex, setSelectedPackIndex] = useState(2); // default 1kg
  const [selectedFlavorId, setSelectedFlavorId] = useState(product.flavors[0].id);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const currentPack = product.packSizes[selectedPackIndex];
  const currentFlavor = product.flavors.find(f => f.id === selectedFlavorId) || product.flavors[0];
  const totalPrice = currentPack.price * quantity;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      flavorId: currentFlavor.id,
      flavorName: currentFlavor.name,
      weightGrams: currentPack.weightGrams,
      weightLabel: currentPack.label,
      price: currentPack.price,
      quantity
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const directWhatsAppUrl = generateSingleProductWhatsAppUrl(
    product,
    currentFlavor.name,
    currentPack,
    quantity
  );

  return (
    <div
      id={product.id === 'long-kela-wafers' ? 'long-wafers' : 'round-wafers'}
      className="bg-white rounded-3xl border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Product Visual Container */}
        <div className="relative h-64 sm:h-72 overflow-hidden bg-amber-100/50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top Tag */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-amber-950 shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {product.tag}
            </span>
          </div>

          {/* Rate Badge */}
          <div className="absolute bottom-3 left-3 text-white">
            <p className="text-xs font-medium text-amber-300">{product.subtitle}</p>
            <h3 className="text-xl sm:text-2xl font-black">{product.name}</h3>
          </div>

          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-amber-200 text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Rate per Kg</p>
            <p className="text-lg font-black text-amber-900">₹{product.pricePerKg}/kg</p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Description */}
          <div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Flavor Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Select Flavor:
              </label>
              {currentFlavor.isUpvasFriendly && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Fasting / Upvas Friendly</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {product.flavors.map(flavor => {
                const isSelected = selectedFlavorId === flavor.id;
                return (
                  <button
                    key={flavor.id}
                    type="button"
                    onClick={() => setSelectedFlavorId(flavor.id)}
                    className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 text-amber-950 ring-2 ring-amber-400/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{flavor.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weight Pack Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>2. Select Pack Size:</span>
              <span className="text-amber-800 font-bold text-xs">{currentPack.label} = ₹{currentPack.price}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {product.packSizes.map((pack, idx) => {
                const isSelected = selectedPackIndex === idx;
                return (
                  <button
                    key={pack.weightGrams}
                    type="button"
                    onClick={() => setSelectedPackIndex(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500 text-amber-950 font-black shadow-md ring-2 ring-amber-400'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300'
                    }`}
                  >
                    {pack.discountBadge && (
                      <span className="absolute -top-2 right-1.5 text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                        {pack.discountBadge}
                      </span>
                    )}
                    <p className={`text-xs ${isSelected ? 'font-black' : 'font-semibold'}`}>
                      {pack.label}
                    </p>
                    <p className={`text-sm mt-0.5 ${isSelected ? 'text-amber-950 font-black' : 'text-slate-900 font-extrabold'}`}>
                      ₹{pack.price}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector & Price Summary */}
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Quantity</p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold active:scale-95 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-black text-base text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold active:scale-95 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500 font-semibold">Total Price</p>
              <p className="text-2xl font-black text-amber-950 mt-0.5">
                ₹{totalPrice}
              </p>
            </div>
          </div>

          {/* Key Product Features */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
            {product.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 sm:p-6 pt-0 space-y-2.5">
        {/* Direct WhatsApp Order Button */}
        <a
          href={directWhatsAppUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Order on WhatsApp</span>
        </a>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-sm border border-amber-300 transition-all active:scale-[0.99]"
        >
          <ShoppingBag className="w-4 h-4 text-amber-800" />
          <span>{addedToast ? 'Added to Cart!' : 'Add to Order List'}</span>
        </button>
      </div>
    </div>
  );
};
