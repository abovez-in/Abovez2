import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, generateWhatsAppOrderUrl } from '../data/wafersData';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
}

interface WaferCartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalWeightKg: number;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  submitWhatsAppOrder: () => void;
}

const WaferCartContext = createContext<WaferCartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'abovez_wafer_cart_v2_en';
const LOCAL_STORAGE_CUSTOMER = 'abovez_customer_info_v2_en';

export const WaferCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default initial cart: 1kg Long + 1kg Round
    return [
      {
        productId: 'long-kela-wafers',
        productName: 'Long Banana Wafers',
        flavorId: 'rock-salt',
        flavorName: 'Rock Salt (Fasting Special)',
        weightGrams: 1000,
        weightLabel: '1 Kg Family Pack',
        price: 210,
        quantity: 1
      },
      {
        productId: 'round-kela-wafers',
        productName: 'Round Banana Wafers',
        flavorId: 'classic-salted',
        flavorName: 'Classic Rock Salt',
        weightGrams: 1000,
        weightLabel: '1 Kg Family Pack',
        price: 220,
        quantity: 1
      }
    ];
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOMER);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: '',
      phone: '',
      address: '',
      city: 'Surat',
      pincode: '',
      notes: ''
    };
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOMER, JSON.stringify(customerInfo));
    } catch (e) {}
  }, [customerInfo]);

  const addToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.productId === newItem.productId && i.flavorId === newItem.flavorId && i.weightGrams === newItem.weightGrams
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += newItem.quantity;
        return copy;
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], quantity };
      return copy;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalWeightKg = cart.reduce((acc, item) => acc + (item.weightGrams * item.quantity) / 1000, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const submitWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const url = generateWhatsAppOrderUrl(cart, customerInfo);
    window.open(url, '_blank');
  };

  return (
    <WaferCartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalWeightKg,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        customerInfo,
        setCustomerInfo,
        submitWhatsAppOrder
      }}
    >
      {children}
    </WaferCartContext.Provider>
  );
};

export const useWaferCart = () => {
  const context = useContext(WaferCartContext);
  if (!context) {
    throw new Error('useWaferCart must be used within a WaferCartProvider');
  }
  return context;
};
