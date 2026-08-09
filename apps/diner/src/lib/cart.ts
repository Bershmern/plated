'use client';

export interface CartItemOption {
  id: string;
  name: string;
  price_delta_minor: number;
}

export interface CartItem {
  cart_item_id: string;
  menu_item_id: string;
  name: string;
  price_minor: number;
  qty: number;
  notes?: string;
  options: CartItemOption[];
}

export function formatNaira(koboMinor: number): string {
  const naira = Math.floor(koboMinor / 100);
  return `₦${naira.toLocaleString('en-NG')}`;
}
