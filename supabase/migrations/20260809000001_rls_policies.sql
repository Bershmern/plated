-- Enable Row Level Security on all tables
alter table public.chains enable row level security;
alter table public.outlets enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.option_groups enable row level security;
alter table public.options enable row level security;
alter table public.outlet_menu_items enable row level security;
alter table public.diner_devices enable row level security;
alter table public.diner_profiles enable row level security;
alter table public.table_sessions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_item_options enable row level security;
alter table public.print_jobs enable row level security;
alter table public.staff_users enable row level security;
alter table public.platform_users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.announcements enable row level security;
alter table public.invoices enable row level security;
alter table public.support_tickets enable row level security;
alter table public.image_credit_ledger enable row level security;
alter table public.audit_log enable row level security;

-- Helper functions for JWT claim checking
create or replace function public.current_chain_id()
returns uuid language sql stable as $$
  select nullif(auth.jwt() -> 'app_metadata' ->> 'chain_id', '')::uuid;
$$;

create or replace function public.current_outlet_id()
returns uuid language sql stable as $$
  select nullif(auth.jwt() -> 'app_metadata' ->> 'outlet_id', '')::uuid;
$$;

create or replace function public.current_role()
returns text language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '');
$$;

create or replace function public.is_platform_user()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.platform_users
    where id = auth.uid() and is_active = true
  );
$$;

-- RLS POLICIES FOR RESTAURANT STAFF (Multi-tenant isolation by chain_id & outlet_id)

-- Chains
create policy "Staff read own chain" on public.chains
  for select using (id = public.current_chain_id() or public.is_platform_user());

create policy "Manager write own chain" on public.chains
  for update using (id = public.current_chain_id() and public.current_role() in ('manager', 'owner'));

-- Outlets
create policy "Staff read outlets" on public.outlets
  for select using (chain_id = public.current_chain_id() or public.is_platform_user());

create policy "Manager write outlets" on public.outlets
  for all using (chain_id = public.current_chain_id() and public.current_role() in ('manager', 'owner'));

-- Menu Categories, Menu Items, Option Groups, Options
create policy "Staff read menu categories" on public.menu_categories
  for select using (chain_id = public.current_chain_id() or public.is_platform_user());

create policy "Manager write menu categories" on public.menu_categories
  for all using (chain_id = public.current_chain_id() and public.current_role() in ('manager', 'owner'));

create policy "Staff read menu items" on public.menu_items
  for select using (chain_id = public.current_chain_id() or public.is_platform_user());

create policy "Manager write menu items" on public.menu_items
  for all using (chain_id = public.current_chain_id() and public.current_role() in ('manager', 'owner'));

create policy "Staff read option groups" on public.option_groups
  for select using (chain_id = public.current_chain_id() or public.is_platform_user());

create policy "Manager write option groups" on public.option_groups
  for all using (chain_id = public.current_chain_id() and public.current_role() in ('manager', 'owner'));

create policy "Staff read options" on public.options
  for select using (
    exists (
      select 1 from public.option_groups og
      where og.id = option_group_id and (og.chain_id = public.current_chain_id() or public.is_platform_user())
    )
  );

create policy "Manager write options" on public.options
  for all using (
    exists (
      select 1 from public.option_groups og
      where og.id = option_group_id and og.chain_id = public.current_chain_id() and public.current_role() in ('manager', 'owner')
    )
  );

-- Outlet Menu Items (Availability Toggles)
create policy "Staff read outlet menu items" on public.outlet_menu_items
  for select using (
    exists (
      select 1 from public.outlets o
      where o.id = outlet_id and (o.chain_id = public.current_chain_id() or public.is_platform_user())
    )
  );

create policy "Staff toggle outlet availability" on public.outlet_menu_items
  for all using (
    exists (
      select 1 from public.outlets o
      where o.id = outlet_id and o.chain_id = public.current_chain_id()
    )
  );

-- Table Sessions
create policy "Staff read sessions" on public.table_sessions
  for select using (
    chain_id = public.current_chain_id()
    and (public.current_outlet_id() is null or outlet_id = public.current_outlet_id())
    or public.is_platform_user()
  );

create policy "Staff update/settle sessions" on public.table_sessions
  for update using (
    chain_id = public.current_chain_id()
    and (public.current_outlet_id() is null or outlet_id = public.current_outlet_id())
  );

-- Orders & Order Items
create policy "Staff read orders" on public.orders
  for select using (
    chain_id = public.current_chain_id()
    and (public.current_outlet_id() is null or outlet_id = public.current_outlet_id())
    or public.is_platform_user()
  );

create policy "Staff transition order status" on public.orders
  for update using (
    chain_id = public.current_chain_id()
    and (public.current_outlet_id() is null or outlet_id = public.current_outlet_id())
  );

create policy "Staff read order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.chain_id = public.current_chain_id() or public.is_platform_user())
    )
  );

create policy "Staff read order item options" on public.order_item_options
  for select using (
    exists (
      select 1 from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where oi.id = order_item_id and (o.chain_id = public.current_chain_id() or public.is_platform_user())
    )
  );

-- Print Jobs
create policy "Staff read print jobs" on public.print_jobs
  for select using (
    chain_id = public.current_chain_id()
    and (public.current_outlet_id() is null or outlet_id = public.current_outlet_id())
  );

create policy "Staff insert print jobs" on public.print_jobs
  for insert with check (
    chain_id = public.current_chain_id()
    and (public.current_outlet_id() is null or outlet_id = public.current_outlet_id())
  );

-- Announcements
create policy "Staff read announcements" on public.announcements
  for select using (
    target_chain_id is null or target_chain_id = public.current_chain_id() or public.is_platform_user()
  );

-- Platform users RLS
create policy "Platform read all audit logs" on public.audit_log
  for select using (public.is_platform_user());

create policy "Platform write audit logs" on public.audit_log
  for insert with check (public.is_platform_user());
