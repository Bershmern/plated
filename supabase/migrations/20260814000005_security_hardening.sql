-- Migration: 20260814000005_security_hardening.sql
-- Description: Security hardening for RLS, SECURITY DEFINER functions, and RPC permissions.

-- 1. Add Explicit RLS Policies for Diner Tables
-- Without these, anon access to these tables via PostgREST is completely blocked.
CREATE POLICY "Allow anon insert to diner_devices" ON public.diner_devices FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select from diner_devices" ON public.diner_devices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anon update to diner_devices" ON public.diner_devices FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "Allow anon select from diner_profiles" ON public.diner_profiles FOR SELECT TO anon, authenticated USING (true);
-- Note: Insert/Update to diner_profiles and orders are securely handled by the place_order_transaction SECURITY DEFINER RPC.

-- 2. Harden SECURITY DEFINER Functions to Prevent Search Path Hijacking
ALTER FUNCTION public.confirm_counter_payment(uuid, text, uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.place_order_transaction(uuid, uuid, text, timestamptz, text, jsonb, text, text, text, text, text) SET search_path = public, pg_temp;

-- 3. Restrict Execution Permissions on Sensitive RPCs
-- Revoke default public execution and grant explicitly to required roles.
REVOKE EXECUTE ON FUNCTION public.confirm_counter_payment(uuid, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_counter_payment(uuid, text, uuid) TO authenticated; -- Only staff should confirm payments

REVOKE EXECUTE ON FUNCTION public.place_order_transaction(uuid, uuid, text, timestamptz, text, jsonb, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order_transaction(uuid, uuid, text, timestamptz, text, jsonb, text, text, text, text, text) TO anon, authenticated;
