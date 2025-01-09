'use client'

import MenuItem from './MenuItem';

type MenuSectionProps = {
  title: string;
  items: Array<{
    id: number;
    name: string;
    description: string;
    price: number | string;
    image?: string;
    unit?: string;
    category?: string;
  }>;
  theme?: {
    backgroundColor?: string;
    titleColor?: string;
    textColor?: string;
    priceColor?: string;
  };
};

const MenuSection = ({ title, items = [], theme }: MenuSectionProps) => {
  // If items is undefined/null or empty, don't render the section
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`p-6 rounded-lg mb-8 ${theme?.backgroundColor || 'bg-gray-50'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme?.titleColor || 'text-gray-900'}`}>
        {title}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuItem
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            unit={item.unit}
            theme={{
              titleColor: theme?.titleColor,
              textColor: theme?.textColor,
              priceColor: theme?.priceColor
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuSection;
