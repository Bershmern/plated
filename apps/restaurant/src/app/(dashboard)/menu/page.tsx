'use client';

import { useState } from 'react';
import { ManagerMenuCrud, MenuItemAdmin } from '@/components/views/ManagerMenuCrud/ManagerMenuCrud';

const INITIAL_MENU_ITEMS: MenuItemAdmin[] = [
  {
    id: '44444444-4444-4444-4444-444444444441',
    name: 'Smokey Jollof & Grilled Chicken',
    description: 'Lagos smokey jollof rice with grilled chicken leg and fried plantains.',
    price_minor: 450000,
    is_listed: true,
    in_stock: true,
    category: 'Main Course',
    stock_count: null,
  },
  {
    id: '44444444-4444-4444-4444-444444444442',
    name: 'Special Beef Suya Platter',
    description: 'Tender strips of grilled beef in yaji spice.',
    price_minor: 600000,
    is_listed: true,
    in_stock: true,
    category: 'Main Course',
    stock_count: 5,
  },
  {
    id: '44444444-4444-4444-4444-444444444446',
    name: 'Cold Malt Drink',
    description: 'Non-alcoholic premium malt beverage.',
    price_minor: 100000,
    is_listed: true,
    in_stock: false, // No Stock
    category: 'Drinks & Beverages',
    stock_count: 0,
  },
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItemAdmin[]>(INITIAL_MENU_ITEMS);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-28 font-bold text-text-primary">Menu Management</h1>
        <p className="text-14 text-text-secondary">Update pricing, availability, and menu items.</p>
      </header>

      <ManagerMenuCrud
        items={menuItems}
        onToggleStock={(id, inStock) =>
          setMenuItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, in_stock: inStock } : it))
          )
        }
        onUpdateStockCount={(id, stockCount) =>
          setMenuItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, stock_count: stockCount } : it))
          )
        }
        onToggleListed={(id, isListed) =>
          setMenuItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, is_listed: isListed } : it))
          )
        }
        onAddItem={(newItem) => setMenuItems((prev) => [...prev, newItem])}
      />
    </div>
  );
}
