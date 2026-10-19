export interface WaferProduct {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  pricePerKg: number;
  image: string;
  description: string;
  tag: string;
  flavors: { id: string; name: string; isUpvasFriendly: boolean }[];
  packSizes: { weightGrams: number; label: string; price: number; discountBadge?: string }[];
  features: string[];
}

export const WAFER_PRODUCTS: WaferProduct[] = [
  {
    id: 'long-kela-wafers',
    name: 'Long Banana Wafers',
    subtitle: 'Golden Long-Cut Banana Strips',
    slug: 'long-kela-wafers',
    pricePerKg: 210,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
    description: 'Crispy, golden-yellow long cut banana wafers prepared from select raw green bananas. Sliced into long strips, deep-fried to golden perfection, and seasoned for supreme crunch.',
    tag: 'Bestseller | ₹210/kg',
    flavors: [
      { id: 'rock-salt', name: 'Rock Salt (Fasting / Upvas Special)', isUpvasFriendly: true },
      { id: 'black-pepper', name: 'Black Pepper (Mari)', isUpvasFriendly: true },
      { id: 'chatpata-masala', name: 'Chatpata Desi Masala', isUpvasFriendly: false }
    ],
    packSizes: [
      { weightGrams: 250, label: '250 gm Pack', price: 55 },
      { weightGrams: 500, label: '500 gm Pack', price: 105 },
      { weightGrams: 1000, label: '1 Kg Family Pack', price: 210, discountBadge: 'Standard Rate' },
      { weightGrams: 2000, label: '2 Kg Big Pack', price: 420 },
      { weightGrams: 5000, label: '5 Kg Wholesale Saver', price: 1000, discountBadge: 'Save ₹50' }
    ],
    features: [
      '100% Prepared Fresh Daily',
      'Pure Rock Salt (Upvas / Fasting Friendly)',
      'No Palm Oil, Light & Easily Digestible',
      'Sealed in Airtight Zip-Lock Pouches'
    ]
  },
  {
    id: 'round-kela-wafers',
    name: 'Round Banana Wafers',
    subtitle: 'Classic Thin-Cut Banana Chips',
    slug: 'round-kela-wafers',
    pricePerKg: 220,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional thin circular sliced banana chips with supreme crispiness and uniform golden hue. Perfectly seasoned and light — the ultimate tea-time snack.',
    tag: 'Popular Favorite | ₹220/kg',
    flavors: [
      { id: 'classic-salted', name: 'Classic Rock Salt (Upvas Special)', isUpvasFriendly: true },
      { id: 'mari-pepper', name: 'Spicy Black Pepper (Mari)', isUpvasFriendly: true },
      { id: 'peri-peri', name: 'Tangy Peri-Peri Spice', isUpvasFriendly: false }
    ],
    packSizes: [
      { weightGrams: 250, label: '250 gm Pack', price: 60 },
      { weightGrams: 500, label: '500 gm Pack', price: 110 },
      { weightGrams: 1000, label: '1 Kg Family Pack', price: 220, discountBadge: 'Standard Rate' },
      { weightGrams: 2000, label: '2 Kg Big Pack', price: 440 },
      { weightGrams: 5000, label: '5 Kg Wholesale Saver', price: 1050, discountBadge: 'Save ₹50' }
    ],
    features: [
      'Ultra-Crispy Thin Circular Slices',
      'Fried in 100% Pure & Clean Edible Oil',
      'Suitable for Religious Fasting (Vrat / Upvas)',
      '100% Guaranteed Long-Lasting Crunch'
    ]
  }
];

export const WHATSAPP_NUMBER = '9265993727';
export const DISPLAY_PHONE = '+91 9265993727';

export interface CartItem {
  productId: string;
  productName: string;
  flavorId: string;
  flavorName: string;
  weightGrams: number;
  weightLabel: string;
  price: number;
  quantity: number;
}

export function generateWhatsAppOrderUrl(
  items: CartItem[],
  customerInfo?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    notes?: string;
  }
): string {
  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalWeightKg = items.reduce((acc, item) => acc + (item.weightGrams * item.quantity) / 1000, 0);

  let message = `*Hello AboveZ! I want to order Fresh Banana Wafers:*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Order Items:*\n`;

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.productName}*\n`;
    message += `   • Size: ${item.weightLabel} x ${item.quantity}\n`;
    message += `   • Flavor: ${item.flavorName}\n`;
    message += `   • Price: ₹${item.price * item.quantity}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Total Weight:* ${totalWeightKg.toFixed(2)} Kg\n`;
  message += `*Total Amount: ₹${totalAmount}*\n\n`;

  if (customerInfo && customerInfo.name) {
    message += `*Customer Name:* ${customerInfo.name}\n`;
    message += `*Phone Number:* ${customerInfo.phone || DISPLAY_PHONE}\n`;
    message += `*Delivery Address:* ${customerInfo.address}\n`;
    message += `*City & Pincode:* ${customerInfo.city} - ${customerInfo.pincode}\n`;
    if (customerInfo.notes) {
      message += `*Notes:* ${customerInfo.notes}\n`;
    }
  }

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Please confirm my order with delivery time and payment details. Thank you!`;

  return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateSingleProductWhatsAppUrl(
  product: WaferProduct,
  flavorName: string,
  packSize: { weightGrams: number; label: string; price: number },
  qty: number = 1
): string {
  const total = packSize.price * qty;
  let message = `*Hello AboveZ! I want to place an order for Banana Wafers:*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Product:* ${product.name}\n`;
  message += `*Pack Size:* ${packSize.label} (Quantity: ${qty})\n`;
  message += `*Flavor:* ${flavorName}\n`;
  message += `*Total Price:* ₹${total}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Please share delivery and payment details. Thank you!`;

  return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateBulkInquiryWhatsAppUrl(
  productType: string,
  approxQuantityKg: number,
  city: string,
  businessType: string
): string {
  let message = `*Hello AboveZ! I would like to inquire about Bulk / Wholesale Banana Wafers:*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Product Type:* ${productType}\n`;
  message += `*Estimated Quantity:* ${approxQuantityKg} Kg\n`;
  message += `*Business Type:* ${businessType}\n`;
  message += `*City / Location:* ${city}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Please provide your best wholesale pricing and delivery schedule. Thank you!`;

  return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
