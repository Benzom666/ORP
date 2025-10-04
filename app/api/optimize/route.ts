
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const GRAPHHOPPER_API_KEY = process.env.GRAPHHOPPER_API_KEY
const GRAPHHOPPER_API_URL = "https://graphhopper.com/api/1/vrp"

interface OptimizeRequest {
  driver_id: string
  order_ids: string[]
}

type LatLng = { lat: number; lng: number }

function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371
  const toRad = (x: number) => (x * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function nearestNeighborOrder(
  orderCoords: Array<{ id: string; lat: number; lng: number }>,
  start: LatLng,
) {
  const remaining = orderCoords.slice()
  const route: string[] = []
  let cur = { ...start }
  while (remaining.length) {
    let bestIdx = 0
    let bestDist = Infinity
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(cur, { lat: remaining[i].lat, lng: remaining[i].lng })
      if (d < bestDist) {
        bestDist = d
        bestIdx = i
      }
    }
    const next = remaining.splice(bestIdx, 1)[0]
    route.push(next.id)
    cur = { lat: next.lat, lng: next.lng }
  }
  return route
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body: OptimizeRequest = await request.json()

    if (!body?.driver_id || !Array.isArray(body?.order_ids) || body.order_ids.length === 0) {
      return NextResponse.json({ error: "driver_id and order_ids are required" }, { status: 400 })
    }

    // Fetch driver
    const { data: driver, error: driverError } = await supabase.from("drivers").select("*").eq("id", body.driver_id).single()
    if (driverError || !driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    // Fetch orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .in("id", body.order_ids)

    if (ordersError || !orders || orders.length === 0) {
      return NextResponse.json({ error: "Orders not found" }, { status: 404 })
    }

    // Prepare coordinates
    const start: LatLng = {
      lat: Number(driver.current_location_lat ?? orders[0].latitude),
      lng: Number(driver.current_location_lng ?? orders[0].longitude),
    }
    const orderCoords = orders.map((o: any) => ({ id: o.id, lat: Number(o.latitude), lng: Number(o.longitude) }))

    // Decide optimization path
    let sequence: string[] = []
    if (GRAPHHOPPER_API_KEY) {
      // Build GraphHopper VRP request
      const ghBody = {
        vehicles: [
          {
            vehicle_id: driver.id,
            start_address: { location_id: "start", lat: start.lat, lon: start.lng },
          },
        ],
        services: orders.map((o: any) => ({
          id: o.id,
          name: o.customer_name || o.id,
          address: { location_id: o.id, lat: o.latitude, lon: o.longitude },
          size: [1],
          duration: (o.service_time_minutes ?? 5) * 60,
        })),
        objectives: [{ type: "min", value: "completion_time" }],
      }

      const resp = await fetch(GRAPHHOPPER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: GRAPHHOPPER_API_KEY,
        },
        body: JSON.stringify(ghBody),
      })

      if (!resp.ok) {
        console.warn("[optimize] GraphHopper failed, falling back to local heuristic.", await resp.text())
        sequence = nearestNeighborOrder(orderCoords, start)
      } else {
        const gh = await resp.json()
        // Parse solution: take first tour activities order excluding start/end
        const activities = gh?.solution?.routes?.[0]?.activities || []
        const orderedIds = activities
          .filter((a: any) => a.type === "service" && a.id)
          .map((a: any) => String(a.id))
        sequence = orderedIds.length ? orderedIds : nearestNeighborOrder(orderCoords, start)
      }
    } else {
      sequence = nearestNeighborOrder(orderCoords, start)
    }

    // Create route
    const { data: route, error: routeError } = await supabase
      .from("routes")
      .insert([
        {
          driver_id: driver.id,
          status: "Planned",
          total_distance_km: 0,
          total_time_minutes: 0,
        },
      ])
      .select()
      .single()

    if (routeError) throw routeError

    // Insert stops & update orders
    let totalKm = 0
    let totalMin = 0
    let prev = start
    const avgSpeedKmh = 40 // rough for ETA
    const now = new Date()

    for (let i = 0; i < sequence.length; i++) {
      const orderId = sequence[i]
      const order = orders.find((o: any) => o.id === orderId)!
      const cur = { lat: Number(order.latitude), lng: Number(order.longitude) }
      const legKm = haversineKm(prev, cur)
      const travelMin = Math.round((legKm / avgSpeedKmh) * 60)
      totalKm += legKm
      totalMin += travelMin + Number(order.service_time_minutes ?? 5)

      const eta = new Date(now.getTime() + totalMin * 60 * 1000)

      const { error: stopError } = await supabase.from("stops").insert([
        {
          route_id: route.id,
          order_id: order.id,
          stop_index: i + 1,
          eta: eta.toISOString(),
          distance_from_prev_km: legKm,
          travel_time_from_prev_minutes: travelMin,
        },
      ])

      if (stopError) throw stopError

      const { error: updateOrderErr } = await supabase
        .from("orders")
        .update({ route_id: route.id, assigned_driver_id: driver.id, stop_number: i + 1, status: "Assigned" })
        .eq("id", order.id)

      if (updateOrderErr) throw updateOrderErr

      prev = cur
    }

    // Update route totals
    const { data: completeRoute, error: fetchError } = await supabase
      .from("routes")
      .update({ total_distance_km: totalKm, total_time_minutes: totalMin })
      .eq("id", route.id)
      .select(`*, driver:drivers(*), stops(*, order:orders(*))`)
      .single()

    if (fetchError) throw fetchError

    return NextResponse.json(completeRoute)
  } catch (error) {
    console.error("[v0] Error optimizing route:", error)
    return NextResponse.json({ error: "Failed to optimize route" }, { status: 500 })
  }
}
