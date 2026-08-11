import { createContext, useContext, useState, ReactNode } from 'react';
import { Voucher } from '../types';

interface CartContextType {
  cartItems: Voucher[];
  addToCart: (voucher: Voucher) => void;
  removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Voucher[]>([]);

  const addToCart = (voucher: Voucher) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === voucher.id);
      if (exists) return prev;
      return [...prev, voucher];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
