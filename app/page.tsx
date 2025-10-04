"use client"

import useSWR from "swr"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { DeliveriesChart } from "@/components/dashboard/deliveries-chart"
import { RouteEfficiencyChart } from "@/components/dashboard/route-efficiency-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DriverPerformance } from "@/components/dashboard/driver-performance"
import { Button } from "@/components/ui/button"
import { Upload, Route, Plus } from "lucide-react"
import Link from "next/link"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

export default function DashboardPage() {
  const { data: orders = [] } = useSWR("/api/orders", fetcher)
  const { data: drivers = [] } = useSWR("/api/drivers", fetcher)
  const { data: routes = [] } = useSWR("/api/routes", fetcher)

  const totalDeliveries = orders.length
  const activeDrivers = drivers.filter((d: any) => d.status === "On Route").length
  const activeRoutes = routes.filter((r: any) => r.status !== "Completed" && r.status !== "Cancelled").length

  // Simple aggregates for charts as placeholders using live data
  const deliveriesPerDay = Object.values(
    orders.reduce((acc: any, o: any) => {
      const day = (o.created_at || "").slice(0,10) || "Unknown"
      acc[day] = acc[day] || { date: day, deliveries: 0 }
      acc[day].deliveries += 1
      return acc
    }, {})
  ).sort((a: any,b: any) => a.date.localeCompare(b.date))

  const routeEfficiency = routes.map((r: any) => ({
    routeId: r.id.slice(0,8),
    km: r.total_distance_km || 0,
    minutes: r.total_time_minutes || 0,
  }))

  const driverPerformance = drivers.map((d: any) => {
    const completed = orders.filter((o: any) => o.assigned_driver_id === d.id && o.status === "Delivered").length
    return { driver: d.name, completed }
  })

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-2">
                <Link href="/orders">
                  <Button><Upload className="mr-2 h-4 w-4" /> Import Orders</Button>
                </Link>
                <Link href="/routes">
                  <Button variant="secondary"><Route className="mr-2 h-4 w-4" /> Optimize Routes</Button>
                </Link>
                <Link href="/drivers">
                  <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Driver</Button>
                </Link>
              </div>
            </div>

            <StatsCards
              totalDeliveries={totalDeliveries}
              activeDrivers={activeDrivers}
              activeRoutes={activeRoutes}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <DeliveriesChart data={deliveriesPerDay} />
              <RouteEfficiencyChart data={routeEfficiency} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <RecentActivity orders={orders.slice(0,20)} />
              <DriverPerformance data={driverPerformance} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}