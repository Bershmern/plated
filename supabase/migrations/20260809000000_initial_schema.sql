-- Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- 1. CHAINS (Tenant boundary)
create table public.chains (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  accent_hex text not null,
  accent_ink text not null,
  display_name text not null,
  logo_url text,
  logo_mono_url text,
  status text not null default 'active' check (status in ('active', 'suspended')),
  cancel_window text not null default 'incoming_only' check (cancel_window in ('incoming_only', 'through_processing')),
  recognition_window_days int not null default 90,
  monnify_api_key text,
  monnify_secret_key text,
  monnify_contract_code text,
  created_at timestamptz not null default now()
);

-- 2. OUTLETS
create table public.outlets (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  name text not null,
  slug text not null,
  address text,
  city text,
  state text,
  timezone text not null default 'Africa/Lagos',
  service_day_start time not null default '06:00',
  is_active boolean not null default true,
  unique (chain_id, slug)
);

-- 3. MENU CATEGORIES
create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  name text not null,
  position int not null default 0
);

-- 4. MENU ITEMS
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price_minor bigint not null,
  currency text not null default 'NGN',
  image_url text,
  image_ready boolean not null default false,
  is_active boolean not null default true,
  position int not null default 0
);

-- 5. OPTION GROUPS
create table public.option_groups (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  name text not null,
  min_select int not null default 0,
  max_select int not null default 1,
  position int not null default 0
);

-- 6. OPTIONS
create table public.options (
  id uuid primary key default gen_random_uuid(),
  option_group_id uuid not null references public.option_groups(id) on delete cascade,
  name text not null,
  price_delta_minor bigint not null default 0,
  is_active boolean not null default true,
  position int not null default 0
);

-- 7. OUTLET MENU ITEMS
create table public.outlet_menu_items (
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  is_listed boolean not null default true,
  in_stock boolean not null default true,
  restock_at timestamptz,
  primary key (outlet_id, menu_item_id)
);

-- 8. DINER DEVICES
create table public.diner_devices (
  id uuid primary key default gen_random_uuid(),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

-- 9. DINER PROFILES (USP 2 recognition)
create table public.diner_profiles (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.diner_devices(id) on delete cascade,
  chain_id uuid not null references public.chains(id) on delete cascade,
  order_count int not null default 0,
  last_order_id uuid,
  first_order_at timestamptz,
  last_order_at timestamptz,
  last_seen_at timestamptz,
  unique (device_id, chain_id)
);

-- 10. TABLE SESSIONS (The Tab & Cash tracking)
create table public.table_sessions (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  table_label text not null,
  status text not null default 'open' check (status in ('open', 'settled', 'void')),
  cash_collected_minor bigint not null default 0,
  service_day date not null default current_date,
  opened_at timestamptz not null default now(),
  settled_at timestamptz,
  settled_by uuid
);

-- 11. ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  session_id uuid references public.table_sessions(id) on delete cascade, -- Optional for pickup/delivery
  diner_profile_id uuid not null references public.diner_profiles(id) on delete cascade,
  fulfillment_type text not null default 'dine_in' check (fulfillment_type in ('dine_in', 'pickup', 'delivery')),
  customer_name text,
  customer_phone text,
  delivery_address text,
  status text not null default 'incoming' check (status in ('incoming', 'processing', 'ready', 'delivered', 'cancelled')),
  cancel_reason text check (cancel_reason in ('cancelled', 'wasted', 'other')),
  cancel_note text,
  cancelled_by uuid,
  subtotal_minor bigint not null,
  total_minor bigint not null,
  currency text not null default 'NGN',
  client_created_at timestamptz,
  placed_at timestamptz not null default now(),
  idempotency_key text not null
);

alter table public.diner_profiles
  add constraint fk_diner_profiles_last_order
  foreign key (last_order_id) references public.orders(id) on delete set null;

-- 12. ORDER ITEMS
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id),
  qty int not null default 1,
  position int not null default 0,
  notes text,
  name_snapshot text not null,
  price_minor_snapshot bigint not null
);

-- 13. ORDER ITEM OPTIONS
create table public.order_item_options (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  option_id uuid not null references public.options(id),
  name_snapshot text not null,
  price_delta_minor_snapshot bigint not null
);

-- 14. PRINT JOBS
create table public.print_jobs (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  session_id uuid references public.table_sessions(id) on delete set null,
  type text not null check (type in ('kitchen_ticket', 'order_receipt', 'bill')),
  status text not null default 'sent' check (status in ('sent', 'failed_to_send')),
  attempt int not null default 1,
  created_at timestamptz not null default now()
);

-- 15. STAFF USERS
create table public.staff_users (
  id uuid primary key,
  chain_id uuid not null references public.chains(id) on delete cascade,
  outlet_id uuid references public.outlets(id) on delete set null,
  role text not null check (role in ('counter', 'manager', 'owner')),
  name text not null,
  is_active boolean not null default true
);

-- 16. PLATFORM USERS
create table public.platform_users (
  id uuid primary key,
  name text not null,
  role text not null check (role in ('support', 'admin')),
  is_active boolean not null default true
);

-- 17. SUBSCRIPTIONS (With Moniepoint customer fields)
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  tier text not null check (tier in ('tablet', 'software_only')),
  setup_fee_minor bigint not null,
  retainer_minor bigint not null,
  outlet_count int not null default 1,
  status text not null default 'active' check (status in ('active', 'past_due', 'suspended')),
  moniepoint_customer_id text,
  moniepoint_subscription_code text,
  moniepoint_email text,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  grace_until timestamptz,
  onboarding_until timestamptz
);

-- 18. ANNOUNCEMENTS (Broadcast notifications from internal ops)
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  target_chain_id uuid references public.chains(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

-- 19. INVOICES
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  period_start timestamptz not null,
  period_end timestamptz not null,
  amount_minor bigint not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'overdue', 'void')),
  due_at timestamptz not null,
  paid_at timestamptz,
  note text
);

-- 20. SUPPORT TICKETS
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  outlet_id uuid references public.outlets(id) on delete set null,
  opened_by uuid not null,
  subject text not null,
  body text not null,
  status text not null default 'open' check (status in ('open', 'pending', 'resolved')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- 21. IMAGE CREDIT LEDGER
create table public.image_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  delta int not null,
  reason text not null check (reason in ('monthly_grant', 'purchase', 'process', 'adjustment')),
  menu_item_id uuid references public.menu_items(id) on delete set null,
  at timestamptz not null default now()
);

-- 22. AUDIT LOG
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null check (actor_type in ('staff', 'platform', 'system')),
  actor_id uuid not null,
  chain_id uuid references public.chains(id) on delete set null,
  action text not null,
  target_table text not null,
  target_id text,
  payload jsonb,
  at timestamptz not null default now()
);

-- INDEXES
create unique index idx_diner_profiles_device_chain on public.diner_profiles (device_id, chain_id);
create index idx_orders_diner_profile on public.orders (diner_profile_id, placed_at desc);
create index idx_orders_session on public.orders (session_id, placed_at);
create index idx_orders_outlet_status on public.orders (outlet_id, status, placed_at desc);
create unique index idx_orders_outlet_idempotency on public.orders (outlet_id, idempotency_key);
create index idx_print_jobs_order on public.print_jobs (order_id, created_at desc);
create index idx_print_jobs_session on public.print_jobs (session_id, created_at desc);
create unique index idx_table_sessions_open_table on public.table_sessions (outlet_id, table_label) where status = 'open';
create index idx_table_sessions_service_day on public.table_sessions (outlet_id, service_day, status);
create index idx_menu_items_pos on public.menu_items (chain_id, category_id, position);
create index idx_option_groups_pos on public.option_groups (menu_item_id, position);
create index idx_options_pos on public.options (option_group_id, position);
create index idx_order_items_pos on public.order_items (order_id, position);
create index idx_order_item_options_item on public.order_item_options (order_item_id);
create index idx_staff_users_outlet on public.staff_users (chain_id, outlet_id);
create index idx_image_credit_ledger_chain on public.image_credit_ledger (chain_id, at desc);
create index idx_audit_log_chain on public.audit_log (chain_id, at desc);
