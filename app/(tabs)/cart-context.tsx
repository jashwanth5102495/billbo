import React, { createContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  time: string;
  price: string;
  desc: string;
  date: string;
  slot: string;
  videoUri?: string;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateCartItem: (index: number, updates: Partial<CartItem>) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItem: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const addToCart = (item: CartItem) => setCart((prev) => [...prev, item]);
  const removeFromCart = (index: number) => setCart((prev) => prev.filter((_, i) => i !== index));
  const updateCartItem = (index: number, updates: Partial<CartItem>) => {
    setCart((prev) => prev.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };
  const clearCart = () => setCart([]);
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider; 