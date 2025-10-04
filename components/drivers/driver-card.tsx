"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Truck, Clock, MoreVertical, MapPin } from "lucide-react"
import type { Driver } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DriverCardProps {
  driver: Driver
  onEdit: (driver: Driver) => void
  onDelete: (driverId: string) => void
  onViewRoute: (routeId: string) => void
}

export function DriverCard({ driver, onEdit, onDelete, onViewRoute }: DriverCardProps) {
  const getStatusColor = (status: Driver["status"]) => {
    switch (status) {
      case "On Route":
        return "default"
      case "Available":
        return "secondary"
      case "Offline":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {driver.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">{driver.name}</h3>
              <Badge variant={getStatusColor(driver.status)}>{driver.status}</Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(driver)}>Edit Driver</DropdownMenuItem>
              {driver.current_route_id && (
                <DropdownMenuItem onClick={() => onViewRoute(driver.current_route_id!)}>View Route</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(driver.id)} className="text-destructive">
                Remove Driver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{driver.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{driver.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            <span>{driver.vehicle_type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {driver.shift_start} - {driver.shift_end}
            </span>
          </div>
          {driver.current_route_id && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Route: {driver.current_route_id}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
