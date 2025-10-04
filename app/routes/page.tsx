"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { RoutesList } from "@/components/routes/routes-list"
import { RouteMap } from "@/components/routes/route-map"
import { OptimizeRoutesDialog } from "@/components/routes/optimize-routes-dialog"
import type { OptimizationConfig } from "@/components/routes/optimize-routes-dialog"
import { useRoutes } from "@/lib/hooks/use-routes"
import { useOrders } from "@/lib/hooks/use-orders"
import { useDrivers } from "@/lib/hooks/use-drivers"
import type { Route } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { exportRouteToCSV, exportMultipleRoutesToCSV } from "@/lib/export-csv"

export default function RoutesPage() {
  const { routes, isLoading: routesLoading, mutate: mutateRoutes } = useRoutes()
  const { orders } = useOrders()
  const { drivers } = useDrivers()
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [optimizeDialogOpen, setOptimizeDialogOpen] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const { toast } = useToast()

  const pendingOrders = orders.filter((o: any) => o.status === "pending")
  const availableDrivers = drivers.filter((d: any) => d.status === "available")

  const handleOptimize = async (config: OptimizationConfig) => {
    if (pendingOrders.length === 0 || availableDrivers.length === 0) {
      toast({
        title: "Cannot optimize",
        description: "No pending orders or available drivers",
        variant: "destructive",
      })
      return
    }

    setIsOptimizing(true)
    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver_id: availableDrivers[0].id,
          order_ids: pendingOrders.slice(0, config.maxStopsPerRoute).map((o: any) => o.id),
        }),
      })

      if (!response.ok) throw new Error("Failed to optimize route")

      const newRoute = await response.json()
      mutateRoutes() // Refresh routes
      toast({
        title: "Route optimized",
        description: `Created optimized route with ${newRoute.stops?.length || 0} stops`,
      })
    } catch (error) {
      console.error("[v0] Optimization error:", error)
      toast({
        title: "Error",
        description: "Failed to optimize route",
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleDeleteRoute = async (routeId: string) => {
    try {
      const response = await fetch(`/api/routes/${routeId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete route")

      if (selectedRoute?.id === routeId) {
        setSelectedRoute(null)
      }
      mutateRoutes() // Refresh routes
      toast({
        title: "Route deleted",
        description: `Route has been removed`,
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete route",
        variant: "destructive",
      })
    }
  }

  const handleExportRoute = (route: Route) => {
    exportRouteToCSV(route)
    toast({
      title: "Route exported",
      description: `${route.name} has been exported to CSV`,
    })
  }

  const handleExportAllRoutes = () => {
    if (routes.length === 0) {
      toast({
        title: "No routes to export",
        description: "Create some routes first",
        variant: "destructive",
      })
      return
    }

    exportMultipleRoutesToCSV(routes)
    toast({
      title: "All routes exported",
      description: `${routes.length} routes have been exported to CSV`,
    })
  }

  if (routesLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">
              <p className="text-center text-muted-foreground">Loading routes...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Routes</h1>
                <p className="text-muted-foreground">Optimize and manage delivery routes</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleExportAllRoutes} disabled={routes.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Export All Routes
                </Button>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Route
                </Button>
                <Button
                  onClick={() => setOptimizeDialogOpen(true)}
                  disabled={pendingOrders.length === 0 || isOptimizing}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isOptimizing ? "Optimizing..." : "Optimize Routes"}
                </Button>
              </div>
            </div>

            {pendingOrders.length > 0 && (
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
                <p className="text-sm font-medium">
                  {pendingOrders.length} pending orders ready for route optimization
                </p>
                <p className="text-xs text-muted-foreground">
                  Click "Optimize Routes" to automatically generate efficient delivery routes
                </p>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <RoutesList
                routes={routes}
                selectedRoute={selectedRoute}
                onSelectRoute={setSelectedRoute}
                onDeleteRoute={handleDeleteRoute}
                onExportRoute={handleExportRoute}
              />
              <RouteMap route={selectedRoute} />
            </div>
          </div>
        </main>
      </div>

      <OptimizeRoutesDialog
        open={optimizeDialogOpen}
        onOpenChange={setOptimizeDialogOpen}
        pendingOrders={pendingOrders}
        availableDrivers={availableDrivers}
        onOptimize={handleOptimize}
      />
    </div>
  )
}
