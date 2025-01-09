'use client';
// CartContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return currentItems.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return currentItems.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setItems(currentItems =>
      quantity === 0
        ? currentItems.filter(item => item.id !== id)
        : currentItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
    );
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};