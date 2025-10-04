export type OrderStatus = "Pending" | "Assigned" | "In Progress" | "Delivered" | "Failed"
export type DriverStatus = "Available" | "On Route" | "Offline"

export interface Order {
  id: string
  customer_name: string
  delivery_address: string
  customer_phone: string
  customer_email?: string
  pickup_address?: string
  notes?: string
  priority: "Low" | "Medium" | "High"
  status: OrderStatus
  route_id?: string
  driver_id?: string
  stop_number?: number
  created_at: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Driver {
  id: string
  name: string
  phone: string
  email?: string
  vehicle_type: string
  status: DriverStatus
  current_route_id?: string
  shift_start?: string
  shift_end?: string
}

export interface Route {
  id: string
  name: string
  driver_id?: string
  orders: Order[]
  status: "Draft" | "Active" | "Completed"
  total_distance?: number
  estimated_duration?: number
  created_at: string
  polyline?: Array<[number, number]>
}

export interface ProofOfDelivery {
  id: string
  order_id: string
  photo_url?: string
  signature_url?: string
  notes?: string
  delivered_at: string
  delivered_by: string
}
