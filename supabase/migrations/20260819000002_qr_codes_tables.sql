-- 1. Create the restaurant_qrs table
CREATE TABLE public.restaurant_qrs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chain_id uuid NOT NULL REFERENCES public.chains(id) ON DELETE CASCADE,
  outlet_id uuid NOT NULL REFERENCES public.outlets(id) ON DELETE CASCADE,
  label text NOT NULL,
  type text NOT NULL DEFAULT 'dine_in' CHECK (type IN ('dine_in', 'public')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Add indexes
CREATE INDEX idx_restaurant_qrs_outlet ON public.restaurant_qrs (outlet_id);
CREATE INDEX idx_restaurant_qrs_chain ON public.restaurant_qrs (chain_id);

-- 3. Enable RLS
ALTER TABLE public.restaurant_qrs ENABLE ROW LEVEL SECURITY;

-- 4. Add RLS Policies
-- Only authenticated users (admins/staff) can view, insert, update, or delete QRs for their chain
CREATE POLICY "Enable read access for authenticated staff" ON public.restaurant_qrs
  FOR SELECT TO authenticated
  USING (
    chain_id IN (
      SELECT su.chain_id FROM public.staff_users su WHERE su.id = auth.uid()
    )
  );

CREATE POLICY "Enable insert for authenticated staff" ON public.restaurant_qrs
  FOR INSERT TO authenticated
  WITH CHECK (
    chain_id IN (
      SELECT su.chain_id FROM public.staff_users su WHERE su.id = auth.uid()
    )
  );

CREATE POLICY "Enable update for authenticated staff" ON public.restaurant_qrs
  FOR UPDATE TO authenticated
  USING (
    chain_id IN (
      SELECT su.chain_id FROM public.staff_users su WHERE su.id = auth.uid()
    )
  );

CREATE POLICY "Enable delete for authenticated staff" ON public.restaurant_qrs
  FOR DELETE TO authenticated
  USING (
    chain_id IN (
      SELECT su.chain_id FROM public.staff_users su WHERE su.id = auth.uid()
    )
  );

-- Allow public read access so the diner app can query table details if needed, though mostly the URL holds the info.
CREATE POLICY "Enable read access for public" ON public.restaurant_qrs
  FOR SELECT TO anon
  USING (true);
