-- Schema for Optimo Route Pro (Postgres/Supabase compatible)

-- Extensions (for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drivers
CREATE TABLE IF NOT EXISTS public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  vehicle_type text NOT NULL,
  vehicle_number text,
  status text NOT NULL DEFAULT 'Available' CHECK (status IN ('Available','On Route','Off Duty')),
  current_location_lat double precision,
  current_location_lng double precision,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Routes
CREATE TABLE IF NOT EXISTS public.routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'Planned' CHECK (status IN ('Planned','In Progress','Completed','Cancelled')),
  total_distance_km double precision DEFAULT 0,
  total_time_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  delivery_address text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  pickup_address text,
  notes text,
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High')),
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Assigned','In Progress','Delivered','Failed','Cancelled')),
  assigned_driver_id uuid REFERENCES public.drivers(id) ON DELETE SET NULL,
  route_id uuid REFERENCES public.routes(id) ON DELETE SET NULL,
  stop_number integer,
  latitude double precision,
  longitude double precision,
  service_time_minutes integer DEFAULT 5,
  delivery_window_start timestamptz,
  delivery_window_end timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Route stops (legs)
CREATE TABLE IF NOT EXISTS public.stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  stop_index integer NOT NULL,
  eta timestamptz,
  arrival_time timestamptz,
  departure_time timestamptz,
  distance_from_prev_km double precision DEFAULT 0,
  travel_time_from_prev_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Proof of delivery
CREATE TABLE IF NOT EXISTS public.proof_of_delivery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  photo_url text,
  signature_url text,
  notes text,
  delivered_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON public.orders(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_route ON public.orders(route_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status);
CREATE INDEX IF NOT EXISTS idx_routes_driver ON public.routes(driver_id);
CREATE INDEX IF NOT EXISTS idx_routes_date ON public.routes(date);
CREATE INDEX IF NOT EXISTS idx_stops_route ON public.stops(route_id);
CREATE INDEX IF NOT EXISTS idx_pod_order ON public.proof_of_delivery(order_id);