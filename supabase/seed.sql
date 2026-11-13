-- SEED DATA FOR PLATED DEMO CHAINS & OUTLETS

-- 1. Insert Chains
insert into public.chains (id, name, slug, accent_hex, accent_ink, display_name, status, recognition_window_days) values
  ('11111111-1111-1111-1111-111111111111', 'Café Neo', 'cafe-neo', '#B08D57', '#FFFDF9', 'Café Neo', 'active', 90),
  ('11111111-1111-1111-1111-111111111112', 'The Yellow Chilli', 'yellow-chilli', '#F9C002', '#111111', 'The Yellow Chilli', 'active', 90),
  ('11111111-1111-1111-1111-111111111113', 'Chicken Republic', 'chicken-republic', '#E01B22', '#FFFFFF', 'Chicken Republic', 'active', 90),
  ('11111111-1111-1111-1111-111111111114', 'Kilimanjaro', 'kilimanjaro', '#DF2027', '#FFFFFF', 'Kilimanjaro', 'active', 90),
  ('11111111-1111-1111-1111-111111111115', 'Bukka Hut', 'bukka-hut', '#1C9347', '#FFFFFF', 'Bukka Hut', 'active', 90)
on conflict (slug) do nothing;

-- 2. Insert Outlets
insert into public.outlets (id, chain_id, name, slug, address, city, state, timezone, service_day_start, is_active) values
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Ikeja Branch', 'ikeja', 'Isaac John Street, Ikeja GRA', 'Lagos', 'Lagos', 'Africa/Lagos', '06:00', true),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111112', 'VI Branch', 'vi', 'Oju Olobun Close, Victoria Island', 'Lagos', 'Lagos', 'Africa/Lagos', '06:00', true),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111113', 'Lekki Branch', 'lekki', 'Admiralty Way, Lekki Phase 1', 'Lagos', 'Lagos', 'Africa/Lagos', '06:00', true),
  ('22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111114', 'Wuse 2 Branch', 'wuse-2', 'Aminu Kano Crescent', 'Abuja', 'FCT', 'Africa/Lagos', '06:00', true),
  ('22222222-2222-2222-2222-222222222225', '11111111-1111-1111-1111-111111111115', 'Surulere Branch', 'surulere', 'Bode Thomas Street, Surulere', 'Lagos', 'Lagos', 'Africa/Lagos', '06:00', true)
on conflict (chain_id, slug) do nothing;

-- 3. Insert Menu Categories
insert into public.menu_categories (id, chain_id, name, position) values
  ('6b7180ad-a783-43fb-b2d8-0a7c96cfd9a7', '11111111-1111-1111-1111-111111111111', 'Main Course', 1),
  ('e06cc6fb-1d3a-438a-b97b-6f8e02c62cbb', '11111111-1111-1111-1111-111111111111', 'Drinks & Beverages', 2),
  ('1978b147-6e9d-4243-8000-039097dba719', '11111111-1111-1111-1111-111111111111', 'Sides & Extras', 3),
  ('8ce07e94-41f8-44d6-9af7-7a4ec0a6ac56', '11111111-1111-1111-1111-111111111112', 'Swallow & Soups', 1),
  ('c3a0b6a5-c744-45c9-891f-a5640485ecd1', '11111111-1111-1111-1111-111111111112', 'Seafood', 2),
  ('ea203e66-187a-4c51-a8d3-b083c7040d2c', '11111111-1111-1111-1111-111111111112', 'Drinks', 3),
  ('fc416fb5-4ce1-4eb9-87a4-3224356a648a', '11111111-1111-1111-1111-111111111113', 'Everyday Value', 1),
  ('71f82ca5-f89b-4fd6-8ac9-8699b6a4bc0a', '11111111-1111-1111-1111-111111111113', 'Meals', 2),
  ('eeedc509-6a0b-4eb1-a3e1-3b915b34fbf8', '11111111-1111-1111-1111-111111111113', 'Sides', 3),
  ('b2fb136e-6881-4df4-b197-327031cc647b', '11111111-1111-1111-1111-111111111113', 'Drinks', 4),
  ('f530e7a1-7a2d-4376-af22-7082e8fbbab1', '11111111-1111-1111-1111-111111111114', 'Rice Dishes', 1),
  ('a545c9ca-b5f5-4428-8256-47056267ad2f', '11111111-1111-1111-1111-111111111114', 'Swallow', 2),
  ('8e91082c-6995-4e2e-a1fc-47ddd39bce6f', '11111111-1111-1111-1111-111111111114', 'Pastries', 3),
  ('46ca0e36-4cbb-4dff-9fb8-5208f0413203', '11111111-1111-1111-1111-111111111115', 'Local Delicacies', 1),
  ('a3483b90-e4d2-4596-9dde-2588301e052e', '11111111-1111-1111-1111-111111111115', 'Soups', 2),
  ('9ebceae4-7a07-44eb-aca9-f050bb6cdedf', '11111111-1111-1111-1111-111111111115', 'Extras', 3)
on conflict do nothing;

-- 4. Insert Menu Items
insert into public.menu_items (id, chain_id, category_id, name, description, price_minor, currency, image_ready, is_active, position) values
  ('5b573625-1f30-4223-acc9-580d878c2fab', '11111111-1111-1111-1111-111111111111', '6b7180ad-a783-43fb-b2d8-0a7c96cfd9a7', 'Smokey Jollof & Grilled Chicken', 'Authentic Lagos smokey jollof rice served with spiced grilled chicken leg and fried plantains.', 450000, 'NGN', true, true, 1),
  ('acd29edf-a31c-4f59-b73c-901d7bbe8091', '11111111-1111-1111-1111-111111111111', '6b7180ad-a783-43fb-b2d8-0a7c96cfd9a7', 'Special Beef Suya Platter', 'Tender strips of grilled beef coated in yaji spice.', 600000, 'NGN', true, true, 2),
  ('1fbee1ac-cea8-4a01-a5a8-7b9591baa814', '11111111-1111-1111-1111-111111111111', 'e06cc6fb-1d3a-438a-b97b-6f8e02c62cbb', 'House Zobo Iced Tea', 'Chilled hibiscus tea infused with fresh ginger.', 150000, 'NGN', true, true, 3),
  ('44be4891-a73f-4b22-95d0-677a8f0b9668', '11111111-1111-1111-1111-111111111111', '1978b147-6e9d-4243-8000-039097dba719', 'Fried Plantain (Dodo)', 'Sweet ripe yellow plantains golden-fried to perfection.', 120000, 'NGN', true, true, 4),
  ('8c691c06-b7f0-4706-9fd4-96019954f551', '11111111-1111-1111-1111-111111111112', '8ce07e94-41f8-44d6-9af7-7a4ec0a6ac56', 'Seafood Okra with Pounded Yam', 'Rich okra soup bursting with fresh prawns, crabs, and fish.', 850000, 'NGN', true, true, 1),
  ('2ec1dfba-2d7d-4a4b-b587-232ace11c110', '11111111-1111-1111-1111-111111111112', '8ce07e94-41f8-44d6-9af7-7a4ec0a6ac56', 'Jollof Rice Fiesta', 'Signature jollof rice with diced plantain and grilled croaker.', 700000, 'NGN', true, true, 2),
  ('e5556b1a-3487-4736-9248-dbfc78b063fd', '11111111-1111-1111-1111-111111111112', 'c3a0b6a5-c744-45c9-891f-a5640485ecd1', 'Spicy Snails', 'Sautéed jumbo snails in a rich pepper sauce.', 1200000, 'NGN', true, true, 3),
  ('0e404d0e-4fe9-4cc0-85e0-3ec6ccd011af', '11111111-1111-1111-1111-111111111112', 'ea203e66-187a-4c51-a8d3-b083c7040d2c', 'Chapman', 'Classic Nigerian mocktail with a hint of Angostura bitters.', 250000, 'NGN', true, true, 4),
  ('a9c65777-ca63-4fea-934a-02a243cce332', '11111111-1111-1111-1111-111111111113', 'fc416fb5-4ce1-4eb9-87a4-3224356a648a', 'Refuel Max', 'Spaghetti, fried plantain, and a crispy piece of fried chicken.', 250000, 'NGN', true, true, 1),
  ('6a924bc2-8b77-4015-93d8-1aacc7fc520c', '11111111-1111-1111-1111-111111111113', '71f82ca5-f89b-4fd6-8ac9-8699b6a4bc0a', 'Citizens Meal', 'Fried rice or jollof with two pieces of chicken and a soft drink.', 400000, 'NGN', true, true, 2),
  ('af6a4210-d1b7-4351-ae52-01ff2ff48ce6', '11111111-1111-1111-1111-111111111113', 'eeedc509-6a0b-4eb1-a3e1-3b915b34fbf8', 'Moin Moin', 'Steamed bean pudding made with peppers and onions.', 80000, 'NGN', true, true, 3),
  ('50876887-ff37-4a4f-b4f6-1a351efc359a', '11111111-1111-1111-1111-111111111113', 'b2fb136e-6881-4df4-b197-327031cc647b', 'Coca-Cola 50cl', 'Chilled pet bottle.', 50000, 'NGN', true, true, 4),
  ('45522e56-2438-4277-860c-cd1aa5f685d0', '11111111-1111-1111-1111-111111111114', 'f530e7a1-7a2d-4376-af22-7082e8fbbab1', 'Fried Rice & Chicken', 'Stir-fried rice with veggies, accompanied by roasted chicken.', 380000, 'NGN', true, true, 1),
  ('c8a3d0ad-2d18-4fc2-a6c3-081c9ec0cd27', '11111111-1111-1111-1111-111111111114', 'a545c9ca-b5f5-4428-8256-47056267ad2f', 'Edikaikong Soup & Semo', 'Nutritious vegetable soup with assorted meat, served with semo.', 450000, 'NGN', true, true, 2),
  ('3c53ac45-dfa8-43ed-9086-48cdf831c4c8', '11111111-1111-1111-1111-111111111114', '8e91082c-6995-4e2e-a1fc-47ddd39bce6f', 'Meat Pie', 'Flaky pastry filled with minced meat and potatoes.', 100000, 'NGN', true, true, 3),
  ('25150f80-3337-4140-b851-2f7aecaca66b', '11111111-1111-1111-1111-111111111114', '8e91082c-6995-4e2e-a1fc-47ddd39bce6f', 'Chicken Pie', 'Flaky pastry filled with creamy chicken and vegetables.', 110000, 'NGN', true, true, 4),
  ('a33936ac-e126-44df-9244-c552ea47cb4e', '11111111-1111-1111-1111-111111111115', '46ca0e36-4cbb-4dff-9fb8-5208f0413203', 'Ofada Rice and Ayamase', 'Local unpolished rice served with signature green pepper sauce and assorted meats.', 450000, 'NGN', true, true, 1),
  ('77a94996-1de9-42bd-ab1d-fe3b3c5d025e', '11111111-1111-1111-1111-111111111115', 'a3483b90-e4d2-4596-9dde-2588301e052e', 'Ewa Agoyin & Agege Bread', 'Mashed beans with spicy pepper sauce, paired with soft local bread.', 250000, 'NGN', true, true, 2),
  ('3e2e4956-1ee6-40d4-9a7e-ceba3a1a336d', '11111111-1111-1111-1111-111111111115', 'a3483b90-e4d2-4596-9dde-2588301e052e', 'Afang Soup', 'Rich dark vegetable soup with periwinkles and stockfish.', 350000, 'NGN', true, true, 3),
  ('e7ba86fb-116c-4ff4-a3cf-002e4e0d9ab5', '11111111-1111-1111-1111-111111111115', '9ebceae4-7a07-44eb-aca9-f050bb6cdedf', 'Ponmo', 'Soft cooked cow skin in spicy sauce.', 100000, 'NGN', true, true, 4)
on conflict do nothing;

-- 5. Outlet Menu Item Availability
insert into public.outlet_menu_items (outlet_id, menu_item_id, is_listed, in_stock) values
  ('22222222-2222-2222-2222-222222222221', '5b573625-1f30-4223-acc9-580d878c2fab', true, true),
  ('22222222-2222-2222-2222-222222222221', 'acd29edf-a31c-4f59-b73c-901d7bbe8091', true, true),
  ('22222222-2222-2222-2222-222222222221', '1fbee1ac-cea8-4a01-a5a8-7b9591baa814', true, true),
  ('22222222-2222-2222-2222-222222222221', '44be4891-a73f-4b22-95d0-677a8f0b9668', true, true),
  ('22222222-2222-2222-2222-222222222222', '8c691c06-b7f0-4706-9fd4-96019954f551', true, true),
  ('22222222-2222-2222-2222-222222222222', '2ec1dfba-2d7d-4a4b-b587-232ace11c110', true, true),
  ('22222222-2222-2222-2222-222222222222', 'e5556b1a-3487-4736-9248-dbfc78b063fd', true, true),
  ('22222222-2222-2222-2222-222222222222', '0e404d0e-4fe9-4cc0-85e0-3ec6ccd011af', true, true),
  ('22222222-2222-2222-2222-222222222223', 'a9c65777-ca63-4fea-934a-02a243cce332', true, true),
  ('22222222-2222-2222-2222-222222222223', '6a924bc2-8b77-4015-93d8-1aacc7fc520c', true, true),
  ('22222222-2222-2222-2222-222222222223', 'af6a4210-d1b7-4351-ae52-01ff2ff48ce6', true, true),
  ('22222222-2222-2222-2222-222222222223', '50876887-ff37-4a4f-b4f6-1a351efc359a', true, true),
  ('22222222-2222-2222-2222-222222222224', '45522e56-2438-4277-860c-cd1aa5f685d0', true, true),
  ('22222222-2222-2222-2222-222222222224', 'c8a3d0ad-2d18-4fc2-a6c3-081c9ec0cd27', true, true),
  ('22222222-2222-2222-2222-222222222224', '3c53ac45-dfa8-43ed-9086-48cdf831c4c8', true, true),
  ('22222222-2222-2222-2222-222222222224', '25150f80-3337-4140-b851-2f7aecaca66b', true, true),
  ('22222222-2222-2222-2222-222222222225', 'a33936ac-e126-44df-9244-c552ea47cb4e', true, true),
  ('22222222-2222-2222-2222-222222222225', '77a94996-1de9-42bd-ab1d-fe3b3c5d025e', true, true),
  ('22222222-2222-2222-2222-222222222225', '3e2e4956-1ee6-40d4-9a7e-ceba3a1a336d', true, true),
  ('22222222-2222-2222-2222-222222222225', 'e7ba86fb-116c-4ff4-a3cf-002e4e0d9ab5', true, true)
on conflict do nothing;
