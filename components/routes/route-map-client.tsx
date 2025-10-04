"use client"

import { useEffect, useRef, useState } from "react"
import type { Route } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock, Ruler } from "lucide-react"

interface RouteMapClientProps {
  route: Route
}

export function RouteMapClient({ route }: RouteMapClientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const [mapError, setMapError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let map: any = null

    const initMap = async () => {
      try {
        // Check for token
        const token = "pk.eyJ1IjoiYmVuem9tIiwiYSI6ImNtZ2J2dnRwNTBqcjkya3B1dHh1bGFmeGIifQ.VMNhjAeGV7IfJnbYJ6XP9A"

        if (!token) {
          console.warn("[v0] Mapbox token missing — falling back to SVG route view")
          setMapError(true)
          setIsLoading(false)
          return
        }

        // Dynamic import of mapbox-gl
        const mapboxgl = (await import("mapbox-gl")).default
        mapboxgl.accessToken = token

        // Get first stop coordinates or default to Windsor, Ontario
        const firstStop = route.orders[0]
        const centerLng = firstStop?.longitude ?? -83.0167
        const centerLat = firstStop?.latitude ?? 42.3149

        // Initialize map
        map = new mapboxgl.Map({
          container: containerRef.current as HTMLElement,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [centerLng, centerLat],
          zoom: 11,
        })

        mapRef.current = map

        map.on("load", () => {
          console.log("[v0] Mapbox map loaded successfully")
          setIsLoading(false)

          // Create route line coordinates
          const coordinates = route.orders.map((order) => [order.longitude, order.latitude])

          // Add route line
          if (coordinates.length > 1) {
            map.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: coordinates,
                },
              },
            })

            map.addLayer({
              id: "route-line",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#3b82f6",
                "line-width": 4,
              },
            })

            // Fit bounds to show all stops
            const bounds = coordinates.reduce(
              (bounds, coord) => bounds.extend(coord as [number, number]),
              new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]),
            )
            map.fitBounds(bounds, { padding: 60 })
          }

          // Add markers for each stop
          route.orders.forEach((order, index) => {
            // Create custom marker element
            const el = document.createElement("div")
            el.className = "route-marker"
            el.style.display = "flex"
            el.style.alignItems = "center"
            el.style.justifyContent = "center"
            el.style.width = "32px"
            el.style.height = "32px"
            el.style.borderRadius = "50%"
            el.style.backgroundColor = "#3b82f6"
            el.style.color = "#ffffff"
            el.style.fontSize = "14px"
            el.style.fontWeight = "bold"
            el.style.border = "3px solid white"
            el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)"
            el.style.cursor = "pointer"
            el.innerText = String(index + 1)

            // Create popup
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="padding: 8px; min-width: 200px;">
                <strong style="font-size: 14px;">${index + 1}. ${order.customer_name}</strong>
                <p style="margin: 4px 0; font-size: 12px; color: #666;">${order.delivery_address}</p>
                ${order.customer_phone ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">${order.customer_phone}</p>` : ""}
                <span style="display: inline-block; margin-top: 4px; padding: 2px 8px; background: #e0e7ff; color: #3730a3; border-radius: 4px; font-size: 11px; font-weight: 500;">${order.status}</span>
              </div>
            `)

            // Add marker to map
            new mapboxgl.Marker(el).setLngLat([order.longitude, order.latitude]).setPopup(popup).addTo(map)
          })
        })

        map.on("error", (e: any) => {
          console.error("[v0] Mapbox error:", e)
          setMapError(true)
          setIsLoading(false)
        })

        // Resize map after a short delay to ensure proper rendering
        setTimeout(() => {
          map?.resize()
        }, 300)
      } catch (err) {
        console.error("[v0] Mapbox initialization failed:", err)
        setMapError(true)
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      try {
        mapRef.current?.remove()
      } catch (e) {
        console.error("[v0] Error removing map:", e)
      }
    }
  }, [route])

  // Fallback SVG view if Mapbox fails
  if (mapError) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <svg className="h-full w-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
            {/* Route path */}
            {route.orders.length > 1 && (
              <path
                d={route.orders
                  .map((_, index) => {
                    const x = 100 + (index * 600) / (route.orders.length - 1)
                    const y = 225 + Math.sin(index * 0.8) * 80
                    return `${index === 0 ? "M" : "L"} ${x} ${y}`
                  })
                  .join(" ")}
                stroke="#3b82f6"
                strokeWidth="4"
                fill="none"
                strokeDasharray="8,4"
                className="animate-pulse"
              />
            )}

            {/* Stop markers */}
            {route.orders.map((order, index) => {
              const x = 100 + (index * 600) / Math.max(route.orders.length - 1, 1)
              const y = 225 + Math.sin(index * 0.8) * 80

              return (
                <g key={order.id}>
                  <circle cx={x} cy={y} r="24" fill="#1e40af" stroke="white" strokeWidth="3" />
                  <text x={x} y={y} textAnchor="middle" dy="0.35em" fill="white" fontSize="16" fontWeight="bold">
                    {index + 1}
                  </text>
                  <text
                    x={x}
                    y={y + 40}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="12"
                    className="fill-foreground"
                  >
                    {order.customer_name.split(" ")[0]}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted"
        style={{ minHeight: "400px" }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <MapPin className="mx-auto h-8 w-8 animate-pulse text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Route summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <Navigation className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Stops</p>
            <p className="text-sm font-semibold">{route.orders.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <Ruler className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Distance</p>
            <p className="text-sm font-semibold">{route.total_distance} mi</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <Clock className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-semibold">{route.estimated_duration} min</p>
          </div>
        </div>
      </div>

      {/* Route stops list */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Route Stops:</p>
        <div className="max-h-[300px] space-y-2 overflow-y-auto">
          {route.orders.map((order, index) => (
            <div
              key={order.id}
              className="flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{order.customer_name}</p>
                <p className="truncate text-xs text-muted-foreground">{order.delivery_address}</p>
                {order.customer_phone && <p className="text-xs text-muted-foreground">{order.customer_phone}</p>}
              </div>
              <Badge variant="outline" className="shrink-0">
                {order.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
