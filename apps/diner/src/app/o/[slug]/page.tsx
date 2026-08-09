'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VenueHeader } from '../../../components/VenueHeader';
import { CategoryRail } from '../../../components/CategoryRail';
import { MenuItemCard, MenuItem } from '../../../components/MenuItemCard';
import { OptionsModal } from '../../../components/OptionsModal';
import { CartDrawer } from '../../../components/CartDrawer';
import { OrderStatusView } from '../../../components/OrderStatusView';
import { RecognitionBanner } from '../../../components/RecognitionBanner';
import { FeaturedDishHero } from '../../../components/FeaturedDishHero';
import { CartItem, CartItemOption } from '../../../lib/cart';
import { UtensilsCrossed } from 'lucide-react';

interface PageProps {
  params: { slug: string };
  searchParams: { t?: string };
}

export default function DinerOutletPage({ params, searchParams }: PageProps) {
  const tableLabel = searchParams.t || '4';
  const slug = params.slug || 'ikeja';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`/api/scan/${slug}?t=${tableLabel}`);
        const payload = await res.json();
        setData(payload);
        if (payload.categories?.length > 0) {
          setActiveCategoryId(payload.categories[0].id);
        }
      } catch (err) {
        console.error('Scan API error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, [slug, tableLabel]);

  const handleSelectItem = (item: MenuItem) => {
    if (item.option_groups && item.option_groups.length > 0) {
      setSelectedMenuItem(item);
    } else {
      handleAddToCart(item, []);
    }
  };

  const handleAddToCart = (item: MenuItem, selectedOptions: CartItemOption[]) => {
    const cartItemId = `${item.id}-${selectedOptions
      .map((o) => o.id)
      .sort()
      .join('-')}`;
    const existingIndex = cartItems.findIndex((ci) => ci.cart_item_id === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].qty += 1;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          cart_item_id: cartItemId,
          menu_item_id: item.id,
          name: item.name,
          price_minor: item.price_minor,
          qty: 1,
          options: selectedOptions,
        },
      ]);
    }

    setSelectedMenuItem(null);
  };

  const handleReorder = (lastOrder: any) => {
    const liveItems: MenuItem[] = data?.items || [];
    const newCart: CartItem[] = [];

    lastOrder.items.forEach((pastItem: any) => {
      const matchedLiveItem = liveItems.find(
        (it) => it.id === pastItem.menu_item_id && it.in_stock && it.is_listed
      );
      if (matchedLiveItem) {
        const cartItemId = `${matchedLiveItem.id}-${(pastItem.options || [])
          .map((o: any) => o.id)
          .sort()
          .join('-')}`;
        newCart.push({
          cart_item_id: cartItemId,
          menu_item_id: matchedLiveItem.id,
          name: matchedLiveItem.name,
          price_minor: matchedLiveItem.price_minor,
          qty: pastItem.qty || 1,
          options: pastItem.options || [],
        });
      }
    });

    if (newCart.length > 0) {
      setCartItems(newCart);
    } else {
      alert('Items from your past order are currently out of stock at this outlet.');
    }
  };

  const handleUpdateQty = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems(cartItems.filter((ci) => ci.cart_item_id !== cartItemId));
    } else {
      setCartItems(
        cartItems.map((ci) => (ci.cart_item_id === cartItemId ? { ...ci, qty: newQty } : ci))
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] text-slate-100 gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-600/30"
        >
          <UtensilsCrossed className="w-5 h-5" />
        </motion.div>
        <span className="text-xs font-black text-slate-300 tracking-wider uppercase">
          Loading Menu...
        </span>
      </div>
    );
  }

  if (activeOrder) {
    return (
      <OrderStatusView
        order={activeOrder}
        onOrderAnother={() => setActiveOrder(null)}
      />
    );
  }

  const outlet = data?.outlet || {
    name: 'Ikeja Branch',
    chain: { display_name: 'Café Neo' },
  };
  const categories = data?.categories || [];
  const items: MenuItem[] = data?.items || [];
  const recognition = data?.recognition || null;

  // Filter items by category OR search query
  const filteredItems = items.filter((it) => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        it.name.toLowerCase().includes(q) ||
        (it.description && it.description.toLowerCase().includes(q))
      );
    }
    return it.category_id === activeCategoryId;
  });

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 pb-28 max-w-md mx-auto relative border-x border-slate-800/60 shadow-2xl">
      {/* Sticky Venue Header */}
      <VenueHeader
        venueName={`${outlet.chain.display_name} · ${outlet.name}`}
        tableLabel={tableLabel}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Loginless Recognition Banner (USP 2) */}
      {!searchQuery && recognition && (
        <RecognitionBanner
          chainName={outlet.chain.display_name}
          orderCount={recognition.order_count}
          lastOrder={recognition.last_order}
          onReorder={handleReorder}
        />
      )}

      {/* Featured Chef Specials Carousel (StoreHub Inspired) */}
      {!searchQuery && (
        <FeaturedDishHero items={items} onSelectDish={handleSelectItem} />
      )}

      {/* Sticky Category Tabs Rail */}
      {!searchQuery && (
        <CategoryRail
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
        />
      )}

      {/* Menu Item Cards List */}
      <section className="p-4 space-y-3">
        {searchQuery && (
          <p className="text-xs font-bold text-slate-400 mb-2">
            Search results for "{searchQuery}" ({filteredItems.length})
          </p>
        )}

        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs font-medium">
            No menu items found in this section.
          </div>
        ) : (
          filteredItems.map((item: MenuItem) => (
            <MenuItemCard key={item.id} item={item} onSelect={handleSelectItem} />
          ))
        )}
      </section>

      {/* Customization Options Modal */}
      {selectedMenuItem && (
        <OptionsModal
          item={selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Sticky Bottom Floating Cart Bar */}
      <CartDrawer
        items={cartItems}
        outletId={outlet.id}
        tableLabel={tableLabel}
        onUpdateQty={handleUpdateQty}
        onOrderSuccess={(order) => {
          setCartItems([]);
          setActiveOrder(order);
        }}
      />
    </main>
  );
}
