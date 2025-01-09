'use client';

import { useState } from 'react';
import { useCart } from '@/components/menu/CartContext';
import Image from 'next/image';

type MenuItemProps = {
  id: number;
  name: string;
  description: string;
  price: number | string;
  unit?: string;
  image?: string;
  theme?: {
    backgroundColor?: string;
    titleColor?: string;
    textColor?: string;
    priceColor?: string;
  };
};

const MenuItem = ({ id, name, description, price, unit, image, theme }: MenuItemProps) => {
  console.log('MenuItem props:', { id, name, description, price, image, unit }); // Debug log
  
  const [isAnimating, setIsAnimating] = useState(false);
  const { items, addItem, removeItem } = useCart();
  
  const quantity = items.find(item => item.id === id)?.quantity || 0;

  const handleAdd = () => {
    addItem({ id, name, price: Number(price) });
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleRemove = () => {
    removeItem(id);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <div className={`${theme?.backgroundColor || 'bg-white'} rounded-lg shadow-md p-4 transition-all duration-200`}>
      {image && (
        <div className="relative w-full h-48 mb-4">
          <Image
            src={image}
            alt={name}
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-xl font-semibold ${theme?.titleColor || 'text-gray-900'}`}>
          {name}
        </h3>
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all duration-300"
          >
            <span className="text-2xl">+</span>
          </button>
        ) : (
          <div className="bg-emerald-500 text-white rounded-full px-4 py-1 flex items-center space-x-4 transition-all duration-300">
            <button
              onClick={handleRemove}
              className="text-xl font-medium"
            >
              -
            </button>
            <span className={`text-lg font-medium min-w-[20px] text-center`}>
              {quantity}
            </span>
            <button
              onClick={handleAdd}
              className="text-xl font-medium"
            >
              +
            </button>
          </div>
        )}
      </div>
      {description && (
        <p className={`mb-2 ${theme?.textColor || 'text-gray-600'}`}>
          {description}
        </p>
      )}
      <p className={`text-lg font-medium ${theme?.priceColor || 'text-gray-800'}`}>
        ${typeof price === 'number' ? price.toFixed(2) : price}{unit ? ` ${unit}` : ''}
      </p>
    </div>
  );
};

export default MenuItem;
