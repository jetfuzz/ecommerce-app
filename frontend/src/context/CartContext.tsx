import { createContext, useContext, type ReactNode } from 'react';
import type { CartState } from '../types';
import { useCart } from '../hooks/useCart';

interface CartContextType {
  cartState: CartState;
  isMutating: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { cartState, isMutating, addToCart, updateQuantity, removeFromCart } = useCart();
  return (
    <CartContext.Provider
      value={{ cartState, isMutating, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
