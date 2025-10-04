"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Navigation, CheckCircle2 } from "lucide-react"
import type { Order } from "@/lib/types"

interface DeliveryCardProps {
  order: Order
  stopNumber: number
  onNavigate: (address: string) => void
  onComplete: (orderId: string) => void
}

export function DeliveryCard({ order, stopNumber, onNavigate, onComplete }: DeliveryCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {stopNumber}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{order.customer_name}</h3>
                <Badge variant={order.priority === "High" ? "destructive" : "outline"}>{order.priority}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{order.id}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{order.delivery_address}</span>
              </div>
              {order.customer_phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${order.customer_phone}`} className="text-primary hover:underline">
                    {order.customer_phone}
                  </a>
                </div>
              )}
            </div>

            {order.notes && (
              <div className="rounded-lg bg-muted p-2">
                <p className="text-xs text-muted-foreground">Note: {order.notes}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => onNavigate(order.delivery_address)}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Navigate
              </Button>
              <Button size="sm" className="flex-1" onClick={() => onComplete(order.id)}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
