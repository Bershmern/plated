create or replace function public.place_order_transaction(
  p_device_id uuid,
  p_outlet_id uuid,
  p_table_label text,
  p_client_created_at timestamptz,
  p_idempotency_key text,
  p_items jsonb,
  p_fulfillment_type text default 'dine_in',
  p_customer_name text default null,
  p_customer_phone text default null,
  p_delivery_address text default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_chain_id uuid;
  v_outlet_active boolean;
  v_chain_status text;
  v_existing_order_id uuid;
  v_existing_order_payload jsonb;
  v_session_id uuid := null;
  v_session_status text;
  v_profile_id uuid;
  v_profile_order_count int;
  v_order_id uuid;
  v_subtotal_minor bigint := 0;
  v_total_minor bigint := 0;
  v_item jsonb;
  v_menu_item record;
  v_option record;
  v_item_price bigint;
  v_options_price bigint;
  v_line_total bigint;
  v_order_item_id uuid;
  v_option_id uuid;
  v_new_stock int;
begin
  -- 1. Resolve outlet & chain
  select o.chain_id, o.is_active, c.status
  into v_chain_id, v_outlet_active, v_chain_status
  from public.outlets o
  join public.chains c on c.id = o.chain_id
  where o.id = p_outlet_id;

  if not found or not v_outlet_active or v_chain_status <> 'active' then
    raise exception 'outlet_not_found' using errcode = 'P0002';
  end if;

  -- 2. Check Idempotency Key Replay (API_CONTRACTS.md §5)
  select id into v_existing_order_id
  from public.orders
  where outlet_id = p_outlet_id and idempotency_key = p_idempotency_key;

  if v_existing_order_id is not null then
    select jsonb_build_object(
      'is_replay', true,
      'order_id', v_existing_order_id
    ) into v_existing_order_payload;
    return v_existing_order_payload;
  end if;

  -- 3. Resolve Tab (table_sessions) IF p_table_label is provided
  if p_table_label is not null then
    select id, status into v_session_id, v_session_status
    from public.table_sessions
    where outlet_id = p_outlet_id and table_label = p_table_label and status = 'open'
    for update;

    if v_session_id is null then
      -- Check if table had a recently settled tab or open one
      insert into public.table_sessions (chain_id, outlet_id, table_label, status, service_day, opened_at)
      values (v_chain_id, p_outlet_id, p_table_label, 'open', current_date, now())
      on conflict (outlet_id, table_label) where (status = 'open')
      do update set table_label = excluded.table_label
      returning id into v_session_id;
    end if;
  end if;

  -- 4. Upsert diner_profiles for (device_id, chain_id)
  insert into public.diner_profiles (device_id, chain_id, order_count, first_order_at, last_seen_at)
  values (p_device_id, v_chain_id, 0, now(), now())
  on conflict (device_id, chain_id)
  do update set last_seen_at = now()
  returning id, order_count into v_profile_id, v_profile_order_count;

  -- 5. Calculate line items & verify availability
  v_order_id := gen_random_uuid();

  -- Temporary calculation pass to compute subtotal
  for v_item in select * from jsonb_array_elements(p_items) loop
    select mi.id, mi.name, mi.price_minor, mi.is_active, omi.in_stock, omi.stock_count
    into v_menu_item
    from public.menu_items mi
    left join public.outlet_menu_items omi on omi.menu_item_id = mi.id and omi.outlet_id = p_outlet_id
    where mi.id = (v_item ->> 'menu_item_id')::uuid and mi.chain_id = v_chain_id;

    if not found or not v_menu_item.is_active or coalesce(v_menu_item.in_stock, true) = false then
      raise exception 'item_unavailable' using errcode = 'P0003';
    end if;
    
    if v_menu_item.stock_count is not null and v_menu_item.stock_count < (v_item ->> 'qty')::int then
      raise exception 'out_of_stock' using errcode = 'P0004';
    end if;

    -- Calculate item options
    v_options_price := 0;
    if v_item -> 'option_ids' is not null and jsonb_array_length(v_item -> 'option_ids') > 0 then
      for v_option_id in select (jsonb_array_elements_text(v_item -> 'option_ids'))::uuid loop
        select price_delta_minor into v_option
        from public.options
        where id = v_option_id and is_active = true;

        if found then
          v_options_price := v_options_price + v_option.price_delta_minor;
        end if;
      end loop;
    end if;

    v_line_total := (v_item ->> 'qty')::int * (v_menu_item.price_minor + v_options_price);
    v_subtotal_minor := v_subtotal_minor + v_line_total;
  end loop;

  v_total_minor := v_subtotal_minor;

  -- 6. Insert Order
  insert into public.orders (
    id, chain_id, outlet_id, session_id, diner_profile_id,
    fulfillment_type, customer_name, customer_phone, delivery_address,
    status, subtotal_minor, total_minor, currency,
    client_created_at, placed_at, idempotency_key
  ) values (
    v_order_id, v_chain_id, p_outlet_id, v_session_id, v_profile_id,
    p_fulfillment_type, p_customer_name, p_customer_phone, p_delivery_address,
    'incoming', v_subtotal_minor, v_total_minor, 'NGN',
    p_client_created_at, now(), p_idempotency_key
  );

  -- 7. Insert Order Items & Options
  for v_item in select * from jsonb_array_elements(p_items) loop
    select id, name, price_minor into v_menu_item
    from public.menu_items
    where id = (v_item ->> 'menu_item_id')::uuid;

    v_order_item_id := gen_random_uuid();

    insert into public.order_items (
      id, order_id, menu_item_id, qty, position, notes, name_snapshot, price_minor_snapshot
    ) values (
      v_order_item_id, v_order_id, v_menu_item.id, (v_item ->> 'qty')::int, 0,
      v_item ->> 'notes', v_menu_item.name, v_menu_item.price_minor
    );

    if v_item -> 'option_ids' is not null and jsonb_array_length(v_item -> 'option_ids') > 0 then
      for v_option_id in select (jsonb_array_elements_text(v_item -> 'option_ids'))::uuid loop
        select name, price_delta_minor into v_option
        from public.options
        where id = v_option_id;

        if found then
          insert into public.order_item_options (
            order_item_id, option_id, name_snapshot, price_delta_minor_snapshot
          ) values (
            v_order_item_id, v_option_id, v_option.name, v_option.price_delta_minor
          );
        end if;
      end loop;
    end if;
    
    -- Deduct stock and record ledger
    update public.outlet_menu_items
    set stock_count = stock_count - (v_item ->> 'qty')::int
    where outlet_id = p_outlet_id and menu_item_id = v_menu_item.id and stock_count is not null
    returning stock_count into v_new_stock;

    if v_new_stock is not null then
      insert into public.inventory_ledger (chain_id, outlet_id, menu_item_id, delta, reason)
      values (v_chain_id, p_outlet_id, v_menu_item.id, -((v_item ->> 'qty')::int), 'order');

      if v_new_stock <= 0 then
        update public.outlet_menu_items
        set in_stock = false
        where outlet_id = p_outlet_id and menu_item_id = v_menu_item.id;

        insert into public.restaurant_notifications (chain_id, outlet_id, title, body)
        values (v_chain_id, p_outlet_id, 'Item Out of Stock', v_menu_item.name || ' has run out of stock and is now marked as unavailable.');
      end if;
    end if;
    
  end loop;

  -- 8. Update Diner Profile
  update public.diner_profiles
  set
    order_count = order_count + 1,
    last_order_id = v_order_id,
    last_order_at = now()
  where id = v_profile_id
  returning order_count into v_profile_order_count;

  return jsonb_build_object(
    'is_replay', false,
    'order_id', v_order_id,
    'session_id', v_session_id,
    'order_count', v_profile_order_count,
    'subtotal_minor', v_subtotal_minor,
    'total_minor', v_total_minor
  );
end;
$$;
