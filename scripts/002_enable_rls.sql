-- Enable Row Level Security
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_of_delivery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (idempotent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='drivers' AND policyname='dev_all_drivers') THEN
    EXECUTE 'DROP POLICY "dev_all_drivers" ON public.drivers';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='orders' AND policyname='dev_all_orders') THEN
    EXECUTE 'DROP POLICY "dev_all_orders" ON public.orders';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='routes' AND policyname='dev_all_routes') THEN
    EXECUTE 'DROP POLICY "dev_all_routes" ON public.routes';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='stops' AND policyname='dev_all_stops') THEN
    EXECUTE 'DROP POLICY "dev_all_stops" ON public.stops';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='proof_of_delivery' AND policyname='dev_all_pod') THEN
    EXECUTE 'DROP POLICY "dev_all_pod" ON public.proof_of_delivery';
  END IF;
END $$;

-- Permissive policies for development
CREATE POLICY "dev_all_drivers" ON public.drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_routes" ON public.routes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_stops" ON public.stops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "dev_all_pod" ON public.proof_of_delivery FOR ALL USING (true) WITH CHECK (true);