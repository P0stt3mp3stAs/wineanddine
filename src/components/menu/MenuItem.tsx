'use client';

import { useState } from 'react';
import { useCart } from '@/components/menu/CartContext';
import Image from 'next/image';

type MenuItemProps = {
  id: number | string;
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
  // console.log('MenuItem props:', { id, name, description, price, image, unit }); 
  
  const [, setIsAnimating] = useState(false);
  const { items, addItem, removeItem } = useCart();
  const [isClicked, setIsClicked] = useState(false);
  
  const quantity = items.find(item => item.id === id)?.quantity || 0;

  const handleAdd = () => {
    addItem({ id, name, price: Number(price) });
    setIsAnimating(true);
    setIsClicked(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsClicked(false);
    }, 200);
  };
  
  const handleRemove = () => {
    removeItem(id);
    setIsAnimating(true);
    setIsClicked(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsClicked(false);
    }, 200);
  };

  return (
    <div className="bg-c7 border-2 border-c8 text-c9 rounded-lg shadow-lg flex flex-col h-96 transform hover:scale-105 transition-transform duration-200">
      {image && (
        <div className="relative h-1/2">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4 flex flex-col justify-between h-1/2">
        <div>
          <h3 className="text-xl font-bold mb-2 truncate">{name}</h3>
          {description && (
            <p className="text-sm mb-2 line-clamp-3">{description}</p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">
            ${typeof price === 'number' ? price.toFixed(2) : price}
            {unit ? ` ${unit}` : ''}
          </p>
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-10 h-10 rounded-full bg-c8 text-white flex items-center justify-center hover:bg-c9 transition-all duration-300"
            >
              <span className="text-2xl">+</span>
            </button>
          ) : (
            <div className={`${isClicked ? 'bg-c8' : 'bg-c9'} text-white rounded-full px-4 py-1 flex items-center space-x-4 transition-all duration-300`}>
              <button
                onClick={handleRemove}
                className="text-xl font-medium"
              >
                -
              </button>
              <span className="text-lg font-medium min-w-[20px] text-center">
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
      </div>
    </div>
  );
};

export default MenuItem;
