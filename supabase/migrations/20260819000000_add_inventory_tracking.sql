-- 1. Add stock_count to outlet_menu_items
alter table public.outlet_menu_items
add column stock_count int null; -- null means unlimited

-- 2. Create inventory_ledger
create table public.inventory_ledger (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  delta int not null,
  reason text not null check (reason in ('order', 'restock', 'spoilage', 'manual_adjustment')),
  actor_id uuid, -- Can be null if system (e.g. order)
  created_at timestamptz not null default now()
);

-- 3. Create restaurant_notifications for out of stock alerts
create table public.restaurant_notifications (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  outlet_id uuid references public.outlets(id) on delete cascade,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index idx_inventory_ledger_item on public.inventory_ledger (outlet_id, menu_item_id, created_at desc);
create index idx_restaurant_notifications_chain on public.restaurant_notifications (chain_id, outlet_id, created_at desc);
