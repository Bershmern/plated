-- Migration: 20260814000004_realignment_moniepoint_whitelabel.sql
-- Description: Clean up Monnify columns, add Whitelabeling fields, Moniepoint 0.5% fee split fields, and update RPC transactions.

-- 1. CHAINS TABLE CLEANUP & EXTENSIONS
ALTER TABLE public.chains
  DROP COLUMN IF EXISTS monnify_api_key,
  DROP COLUMN IF EXISTS monnify_secret_key,
  DROP COLUMN IF EXISTS monnify_contract_code;

ALTER TABLE public.chains
  ADD COLUMN IF NOT EXISTS primary_color_hex text NOT NULL DEFAULT '#000000',
  ADD COLUMN IF NOT EXISTS secondary_color_hex text NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS typography_font text NOT NULL DEFAULT 'Inter' CHECK (typography_font IN ('Inter', 'Plus Jakarta Sans', 'Outfit', 'Playfair Display', 'Space Grotesk', 'Cormorant Garamond')),
  ADD COLUMN IF NOT EXISTS moniepoint_subaccount_code text,
  ADD COLUMN IF NOT EXISTS moniepoint_account_number text,
  ADD COLUMN IF NOT EXISTS moniepoint_bank_code text;

-- 2. ORDERS TABLE PAYMENT & FEE EXTENSIONS
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'counter_cash' CHECK (payment_method IN ('online', 'counter_cash', 'counter_pos', 'counter_transfer')),
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  ADD COLUMN IF NOT EXISTS platform_fee_minor bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS moniepoint_reference text;

-- 3. RPC TO CONFIRM COUNTER PAYMENTS (Staff counter action)
CREATE OR REPLACE FUNCTION public.confirm_counter_payment(
  p_order_id uuid,
  p_payment_method text,
  p_staff_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order record;
BEGIN
  SELECT id, session_id, payment_status, total_minor
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'order_not_found' USING errcode = 'P0002';
  END IF;

  IF p_payment_method NOT IN ('counter_cash', 'counter_pos', 'counter_transfer') THEN
    RAISE EXCEPTION 'invalid_payment_method' USING errcode = 'P0003';
  END IF;

  UPDATE public.orders
  SET 
    payment_status = 'paid',
    payment_method = p_payment_method
  WHERE id = p_order_id;

  -- Update associated table session cash collection if applicable
  IF v_order.session_id IS NOT NULL AND p_payment_method = 'counter_cash' THEN
    UPDATE public.table_sessions
    SET 
      cash_collected_minor = cash_collected_minor + v_order.total_minor,
      settled_by = p_staff_id
    WHERE id = v_order.session_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'payment_status', 'paid',
    'payment_method', p_payment_method
  );
END;
$$;

-- 4. UPDATE place_order_transaction RPC TO CALCULATE 0.5% PLATFORM FEE
CREATE OR REPLACE FUNCTION public.place_order_transaction(
  p_device_id uuid,
  p_outlet_id uuid,
  p_table_label text,
  p_client_created_at timestamptz,
  p_idempotency_key text,
  p_items jsonb,
  p_fulfillment_type text DEFAULT 'dine_in',
  p_customer_name text DEFAULT NULL,
  p_customer_phone text DEFAULT NULL,
  p_delivery_address text DEFAULT NULL,
  p_payment_method text DEFAULT 'counter_cash'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_chain_id uuid;
  v_outlet_active boolean;
  v_chain_status text;
  v_existing_order_id uuid;
  v_existing_order_payload jsonb;
  v_session_id uuid := NULL;
  v_session_status text;
  v_profile_id uuid;
  v_profile_order_count int;
  v_order_id uuid;
  v_subtotal_minor bigint := 0;
  v_total_minor bigint := 0;
  v_platform_fee_minor bigint := 0;
  v_item jsonb;
  v_menu_item record;
  v_option record;
  v_item_price bigint;
  v_options_price bigint;
  v_line_total bigint;
  v_order_item_id uuid;
  v_option_id uuid;
BEGIN
  -- 1. Resolve outlet & chain
  SELECT o.chain_id, o.is_active, c.status
  INTO v_chain_id, v_outlet_active, v_chain_status
  FROM public.outlets o
  JOIN public.chains c ON c.id = o.chain_id
  WHERE o.id = p_outlet_id;

  IF NOT FOUND OR NOT v_outlet_active OR v_chain_status <> 'active' THEN
    RAISE EXCEPTION 'outlet_not_found' USING errcode = 'P0002';
  END IF;

  -- 2. Check Idempotency Key Replay
  SELECT id INTO v_existing_order_id
  FROM public.orders
  WHERE outlet_id = p_outlet_id AND idempotency_key = p_idempotency_key;

  IF v_existing_order_id IS NOT NULL THEN
    SELECT jsonb_build_object(
      'is_replay', true,
      'order_id', v_existing_order_id
    ) INTO v_existing_order_payload;
    RETURN v_existing_order_payload;
  END IF;

  -- 3. Resolve Tab (table_sessions) IF p_table_label is provided
  IF p_table_label IS NOT NULL THEN
    SELECT id, status INTO v_session_id, v_session_status
    FROM public.table_sessions
    WHERE outlet_id = p_outlet_id AND table_label = p_table_label AND status = 'open'
    FOR UPDATE;

    IF v_session_id IS NULL THEN
      INSERT INTO public.table_sessions (chain_id, outlet_id, table_label, status, service_day, opened_at)
      VALUES (v_chain_id, p_outlet_id, p_table_label, 'open', CURRENT_DATE, NOW())
      ON CONFLICT (outlet_id, table_label) WHERE (status = 'open')
      DO UPDATE SET table_label = EXCLUDED.table_label
      RETURNING id INTO v_session_id;
    END IF;
  END IF;

  -- 4. Upsert diner_profiles for (device_id, chain_id)
  INSERT INTO public.diner_profiles (device_id, chain_id, order_count, first_order_at, last_seen_at)
  VALUES (p_device_id, v_chain_id, 1, NOW(), NOW())
  ON CONFLICT (device_id, chain_id)
  DO UPDATE SET 
    order_count = public.diner_profiles.order_count + 1,
    last_seen_at = NOW()
  RETURNING id, order_count INTO v_profile_id, v_profile_order_count;

  -- 5. Calculate line items & subtotal
  v_order_id := gen_random_uuid();

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    SELECT id, name, price_minor, is_active INTO v_menu_item
    FROM public.menu_items
    WHERE id = (v_item ->> 'menu_item_id')::uuid AND chain_id = v_chain_id;

    IF NOT FOUND OR NOT v_menu_item.is_active THEN
      RAISE EXCEPTION 'item_unavailable' USING errcode = 'P0003';
    END IF;

    v_item_price := v_menu_item.price_minor;
    v_options_price := 0;

    IF v_item ? 'options' AND jsonb_array_length(v_item -> 'options') > 0 THEN
      FOR v_option_id IN SELECT (jsonb_array_elements_text(v_item -> 'options'))::uuid LOOP
        SELECT price_delta_minor INTO v_option
        FROM public.options
        WHERE id = v_option_id;

        IF FOUND THEN
          v_options_price := v_options_price + v_option.price_delta_minor;
        END IF;
      END LOOP;
    END IF;

    v_line_total := (v_item_price + v_options_price) * (v_item ->> 'qty')::int;
    v_subtotal_minor := v_subtotal_minor + v_line_total;
  END LOOP;

  v_total_minor := v_subtotal_minor;
  -- Calculate 0.5% platform fee (rounded)
  v_platform_fee_minor := ROUND(v_total_minor * 0.005);

  -- 6. Insert Order Record
  INSERT INTO public.orders (
    id, chain_id, outlet_id, session_id, diner_profile_id,
    fulfillment_type, customer_name, customer_phone, delivery_address,
    status, payment_method, payment_status, subtotal_minor, total_minor, platform_fee_minor,
    currency, client_created_at, placed_at, idempotency_key
  ) VALUES (
    v_order_id, v_chain_id, p_outlet_id, v_session_id, v_profile_id,
    p_fulfillment_type, p_customer_name, p_customer_phone, p_delivery_address,
    'incoming', p_payment_method, 'pending', v_subtotal_minor, v_total_minor, v_platform_fee_minor,
    'NGN', p_client_created_at, NOW(), p_idempotency_key
  );

  -- Update diner profile last_order_id
  UPDATE public.diner_profiles
  SET last_order_id = v_order_id
  WHERE id = v_profile_id;

  RETURN jsonb_build_object(
    'is_replay', false,
    'order_id', v_order_id,
    'order_count', v_profile_order_count,
    'total_minor', v_total_minor,
    'platform_fee_minor', v_platform_fee_minor,
    'greeting_message', 'Welcome back! This is your ' || v_profile_order_count || 'th order with us.'
  );
END;
$$;
