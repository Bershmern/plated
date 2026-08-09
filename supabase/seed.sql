-- SEED DATA FOR PLATED DEMO CHAIN & OUTLET
-- Chain: Café Neo
-- Outlet: Ikeja Branch

-- 1. Insert Chain
insert into public.chains (id, name, slug, accent_hex, accent_ink, display_name, status, recognition_window_days)
values (
  '11111111-1111-1111-1111-111111111111',
  'Café Neo',
  'cafe-neo',
  '#B08D57',
  '#FFFDF9',
  'Café Neo',
  'active',
  90
) on conflict (slug) do nothing;

-- 2. Insert Outlet
insert into public.outlets (id, chain_id, name, slug, address, city, state, timezone, service_day_start, is_active)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Ikeja Branch',
  'ikeja',
  'Isaac John Street, Ikeja GRA',
  'Lagos',
  'Lagos',
  'Africa/Lagos',
  '06:00',
  true
) on conflict (chain_id, slug) do nothing;

-- 3. Insert Menu Categories
insert into public.menu_categories (id, chain_id, name, position)
values
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'Main Course', 1),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'Drinks & Beverages', 2),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Sides & Extras', 3)
on conflict do nothing;

-- 4. Insert Menu Items (prices in kobo_minor: N4,500 = 450000 kobo)
insert into public.menu_items (id, chain_id, category_id, name, description, price_minor, currency, image_ready, is_active, position)
values
  -- Mains
  ('44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'Smokey Jollof & Grilled Chicken', 'Authentic Lagos smokey jollof rice served with spiced grilled chicken leg and fried plantains.', 450000, 'NGN', true, true, 1),
  ('44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'Special Beef Suya Platter', 'Tender strips of grilled beef coated in yaji spice, served with sliced red onions and cabbage.', 600000, 'NGN', true, true, 2),
  ('44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', 'Pounded Yam & Egusi Soup', 'Smooth pounded yam with rich melon seed egusi soup, assorted meat, and stockfish.', 550000, 'NGN', true, true, 3),

  -- Drinks
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'House Zobo Iced Tea', 'Chilled hibiscus tea infused with fresh ginger, pineapple juice, and cloves.', 150000, 'NGN', true, true, 1),
  ('44444444-4444-4444-4444-444444444445', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'Fresh Palm Wine', 'Naturally sweet freshly tapped palm wine served ice cold in a traditional gourd.', 200000, 'NGN', true, true, 2),
  ('44444444-4444-4444-4444-444444444446', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', 'Cold Malt Drink', 'Non-alcoholic premium malt beverage served extra chilled.', 100000, 'NGN', true, true, 3),

  -- Sides
  ('44444444-4444-4444-4444-444444444447', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Fried Plantain (Dodo)', 'Sweet ripe yellow plantains golden-fried to perfection.', 120000, 'NGN', true, true, 1),
  ('44444444-4444-4444-4444-444444444448', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Extra Yaji Suya Spice', 'Authentic Hausa suya pepper blend in a side dish.', 50000, 'NGN', true, true, 2)
on conflict do nothing;

-- 5. Option Groups for Smokey Jollof
insert into public.option_groups (id, chain_id, menu_item_id, name, min_select, max_select, position)
values
  ('55555555-5555-5555-5555-555555555551', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', 'Spice Level', 1, 1, 1),
  ('55555555-5555-5555-5555-555555555552', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444441', 'Extra Add-ons', 0, 2, 2)
on conflict do nothing;

-- 6. Options
insert into public.options (id, option_group_id, name, price_delta_minor, is_active, position)
values
  ('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555551', 'Medium Spice', 0, true, 1),
  ('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555551', 'Extra Hot Pepper', 0, true, 2),
  ('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555552', 'Extra Fried Egg', 50000, true, 1),
  ('66666666-6666-6666-6666-666666666664', '55555555-5555-5555-5555-555555555552', 'Grilled Peppered Gizzard', 100000, true, 2)
on conflict do nothing;

-- 7. Outlet Menu Item Availability (Make "Cold Malt Drink" out of stock for testing unlit visual state)
insert into public.outlet_menu_items (outlet_id, menu_item_id, is_listed, in_stock)
values
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444441', true, true),
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444442', true, true),
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444443', true, true),
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', true, true),
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444445', true, true),
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444446', true, false), -- Cold Malt OUT OF STOCK
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444447', true, true),
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444448', true, true)
on conflict do nothing;
