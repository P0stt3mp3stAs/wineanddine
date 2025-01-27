import MenuItem from './MenuItem';

interface MenuSectionProps {
  title: string;
  items: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string;
    unit?: string;
  }>;
  sectionKey: string;
  theme?: {
    backgroundColor?: string;
    titleColor?: string;
    textColor?: string;
    priceColor?: string;
  };
  layout?: {
    columns: {
      sm?: number;
      md?: number;
      lg?: number;
    };
  };
}

const MenuSection = ({ title, items = [], sectionKey, theme, layout }: MenuSectionProps) => {
  if (!items || items.length === 0) {
    return null;
  }
  
  const gridColumns = layout?.columns || { sm: 1, md: 2, lg: 3 };

  return (
    <div className={`p-6 rounded-lg mb-8 ${theme?.backgroundColor || 'bg-gray-50'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme?.titleColor || 'text-gray-900'}`}>
        {title}
      </h2>
      <div className={`grid gap-6
        grid-cols-${gridColumns.sm || 1}
        md:grid-cols-${gridColumns.md || 2}
        lg:grid-cols-4
      `}>
        {items.map((item) => (
          <MenuItem
          key={`${sectionKey}_${item.id}`}
          id={`${sectionKey}_${item.id}`}
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
