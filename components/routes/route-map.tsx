"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { Route } from "@/lib/types"

const RouteMapClient = dynamic(() => import("./route-map-client").then((mod) => ({ default: mod.RouteMapClient })), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <div className="text-center">
        <MapPin className="mx-auto h-8 w-8 animate-pulse text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

interface RouteMapProps {
  route: Route | null
}

export function RouteMap({ route }: RouteMapProps) {
  if (!route) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
          <CardDescription>Select a route to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">Select a route to view on map</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Route Map</CardTitle>
        <CardDescription>Viewing {route.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <RouteMapClient route={route} />
      </CardContent>
    </Card>
  )
}
