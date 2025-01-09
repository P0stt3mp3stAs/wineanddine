'use client'

import MenuItem from './MenuItem';

type MenuSectionProps = {
  title: string;
  items: Array<{
    id: number;
    name: string;
    description: string;
    price: number | string;
    unit?: string;
  }>;
  theme?: {
    backgroundColor?: string;
    titleColor?: string;
    textColor?: string;
    priceColor?: string;
  };
};

const MenuSection = ({ title, items, theme }: MenuSectionProps) => {
  return (
    <section className="mb-8">
      <h2 className={`text-2xl font-bold mb-4 ${theme?.titleColor || 'text-gray-900'}`}>
        {title}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <MenuItem
            key={item.id}
            {...item}
            theme={theme}
          />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;