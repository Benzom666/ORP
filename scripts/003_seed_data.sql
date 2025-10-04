-- Seed sample drivers
INSERT INTO public.drivers (id, name, phone, email, vehicle_type, vehicle_number, status, current_location_lat, current_location_lng) VALUES
  ('11111111-1111-1111-1111-111111111111','John Doe','+1-555-0101','john.doe@optimo.test','Van','ON-1A2B3C','Available',37.7749,-122.4194),
  ('22222222-2222-2222-2222-222222222222','Sarah Johnson','+1-555-0102','sarah.j@optimo.test','Truck','ON-4D5E6F','Available',37.7833,-122.4094),
  ('33333333-3333-3333-3333-333333333333','Mike Chen','+1-555-0103','mike.chen@optimo.test','Van','ON-7G8H9I','Available',37.7919,-122.4047)
ON CONFLICT (id) DO NOTHING;

-- Seed sample orders
INSERT INTO public.orders (id, customer_name, delivery_address, customer_phone, customer_email, pickup_address, notes, priority, status, latitude, longitude, service_time_minutes) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Acme Corp','123 Market St, San Francisco, CA','+1-555-1001','ops@acme.test',NULL,'Fragile','High','Pending',37.7749,-122.4194,5),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Tech Solutions','780 Mission St, San Francisco, CA','+1-555-1002','admin@tech.test',NULL,'Office delivery','Medium','Pending',37.7833,-122.3967,5),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc','Global Industries','600 Montgomery St, San Francisco, CA','+1-555-1003','desk@global.test',NULL,'Urgent','High','Pending',37.7919,-122.4047,5),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd','Bay Area Retail','245 2nd St, San Francisco, CA','+1-555-1004','contact@bar.test',NULL,'Heavy','Low','Pending',37.7825,-122.3964,5),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','Sunset Cafe','987 Irving St, San Francisco, CA','+1-555-1005','hello@sunset.test',NULL,'Perishables','Medium','Pending',37.7636,-122.4686,5),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff','Marina Shop','246 Chestnut St, San Francisco, CA','+1-555-1006','shop@marina.test',NULL,'Normal','Medium','Pending',37.8021,-122.4343,5)
ON CONFLICT (id) DO NOTHING;