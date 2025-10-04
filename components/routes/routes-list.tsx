"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Truck, MoreVertical, Eye, Pencil, Trash2, Download } from "lucide-react"
import type { Route } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RoutesListProps {
  routes: Route[]
  selectedRoute: Route | null
  onSelectRoute: (route: Route) => void
  onDeleteRoute: (routeId: string) => void
  onExportRoute?: (route: Route) => void
}

export function RoutesList({ routes, selectedRoute, onSelectRoute, onDeleteRoute, onExportRoute }: RoutesListProps) {
  const getStatusColor = (status: Route["status"]) => {
    switch (status) {
      case "Active":
        return "default"
      case "Completed":
        return "secondary"
      case "Draft":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Routes</CardTitle>
        <CardDescription>Manage and view all delivery routes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {routes.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">No routes created yet</p>
            </div>
          ) : (
            routes.map((route) => (
              <div
                key={route.id}
                className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent ${
                  selectedRoute?.id === route.id ? "border-primary bg-accent" : ""
                }`}
                onClick={() => onSelectRoute(route)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{route.name}</h4>
                      <Badge variant={getStatusColor(route.status)}>{route.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{route.orders.length} stops</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{route.estimated_duration} min</span>
                      </div>
                      {route.total_distance && (
                        <div className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          <span>{route.total_distance} mi</span>
                        </div>
                      )}
                    </div>

                    {route.driver_id && (
                      <div className="text-xs text-muted-foreground">Assigned to driver {route.driver_id}</div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onSelectRoute(route)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {onExportRoute && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onExportRoute(route)
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export to CSV
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Route
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteRoute(route.id)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
