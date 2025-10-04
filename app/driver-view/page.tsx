"use client"

import { useState } from "react"
import { DeliveryCard } from "@/components/driver-view/delivery-card"
import { RouteProgress } from "@/components/driver-view/route-progress"
import { ProofOfDeliveryDialog } from "@/components/driver-view/proof-of-delivery-dialog"
import type { ProofOfDelivery } from "@/components/driver-view/proof-of-delivery-dialog"
import { mockRoutes } from "@/lib/mock-data"
import type { Order, Route } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Menu } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DriverViewPage() {
  // Simulate logged-in driver with assigned route
  const [route, setRoute] = useState<Route>(mockRoutes[0])
  const [completingOrder, setCompletingOrder] = useState<Order | null>(null)
  const [podDialogOpen, setPodDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleNavigate = (address: string) => {
    // In production, open Google Maps or Apple Maps
    toast({
      title: "Opening navigation",
      description: `Navigating to ${address}`,
    })
  }

  const handleCompleteDelivery = (orderId: string) => {
    const order = route.orders.find((o) => o.id === orderId)
    if (order) {
      setCompletingOrder(order)
      setPodDialogOpen(true)
    }
  }

  const handleSubmitProof = (orderId: string, proof: ProofOfDelivery) => {
    // Update order status
    const updatedOrders = route.orders.map((order) =>
      order.id === orderId ? { ...order, status: "Delivered" as const } : order,
    )

    setRoute({ ...route, orders: updatedOrders })

    toast({
      title: "Delivery completed",
      description: `Order ${orderId} marked as delivered`,
    })
  }

  const pendingOrders = route.orders.filter((o) => o.status !== "Delivered")
  const completedOrders = route.orders.filter((o) => o.status === "Delivered")

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-optimized header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">Driver View</h1>
            <p className="text-xs text-muted-foreground">James Anderson</p>
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container max-w-2xl space-y-4 p-4 pb-20">
        <RouteProgress route={route} />

        {pendingOrders.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Upcoming Deliveries</h2>
            {pendingOrders.map((order, index) => (
              <DeliveryCard
                key={order.id}
                order={order}
                stopNumber={completedOrders.length + index + 1}
                onNavigate={handleNavigate}
                onComplete={handleCompleteDelivery}
              />
            ))}
          </div>
        )}

        {completedOrders.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-muted-foreground">Completed ({completedOrders.length})</h2>
            {completedOrders.map((order, index) => (
              <div key={order.id} className="rounded-lg border bg-muted/50 p-4 opacity-60">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                    ✓
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{order.customer_name}</h3>
                    <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pendingOrders.length === 0 && (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <div className="mb-4 text-4xl">🎉</div>
              <h3 className="text-lg font-semibold">All deliveries completed!</h3>
              <p className="text-sm text-muted-foreground">Great job today</p>
            </div>
          </div>
        )}
      </main>

      <ProofOfDeliveryDialog
        order={completingOrder}
        open={podDialogOpen}
        onOpenChange={setPodDialogOpen}
        onSubmit={handleSubmitProof}
      />
    </div>
  )
}
