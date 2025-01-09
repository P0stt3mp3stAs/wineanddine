'use client';

import { CartProvider } from '@/components/menu/CartContext';
import { ReactNode } from 'react';

export default function CartWrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}