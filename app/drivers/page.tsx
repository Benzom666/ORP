"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DriverCard } from "@/components/drivers/driver-card"
import { AddDriverDialog } from "@/components/drivers/add-driver-dialog"
import { EditDriverDialog } from "@/components/drivers/edit-driver-dialog"
import { useDrivers } from "@/lib/hooks/use-drivers"
import type { Driver } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DriversPage() {
  const { drivers, isLoading, mutate } = useDrivers()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddDriver = async (newDriver: Omit<Driver, "id">) => {
    try {
      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDriver),
      })

      if (!response.ok) throw new Error("Failed to add driver")

      const driver = await response.json()
      mutate() // Refresh data
      toast({
        title: "Driver added",
        description: `${driver.name} has been added to your fleet`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add driver",
        variant: "destructive",
      })
    }
  }

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver)
    setEditDialogOpen(true)
  }

  const handleSaveDriver = async (updatedDriver: Driver) => {
    try {
      const response = await fetch(`/api/drivers/${updatedDriver.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDriver),
      })

      if (!response.ok) throw new Error("Failed to update driver")

      mutate() // Refresh data
      toast({
        title: "Driver updated",
        description: `${updatedDriver.name}'s information has been updated`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update driver",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDriver = async (driverId: string) => {
    const driver = drivers.find((d: Driver) => d.id === driverId)
    try {
      const response = await fetch(`/api/drivers/${driverId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete driver")

      mutate() // Refresh data
      toast({
        title: "Driver removed",
        description: `${driver?.name} has been removed from your fleet`,
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete driver",
        variant: "destructive",
      })
    }
  }

  const handleViewRoute = (routeId: string) => {
    toast({
      title: "View route",
      description: `Navigating to route ${routeId}`,
    })
  }

  const activeDrivers = drivers.filter((d: Driver) => d.status === "on_route")
  const availableDrivers = drivers.filter((d: Driver) => d.status === "available")
  const offlineDrivers = drivers.filter((d: Driver) => d.status === "offline")

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">
              <p className="text-center text-muted-foreground">Loading drivers...</p>
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
                <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
                <p className="text-muted-foreground">Manage your delivery fleet</p>
              </div>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{drivers.length}</p>
                    <p className="text-sm text-muted-foreground">Total Drivers</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{activeDrivers.length}</p>
                    <p className="text-sm text-muted-foreground">On Route</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{availableDrivers.length}</p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Drivers ({drivers.length})</TabsTrigger>
                <TabsTrigger value="active">On Route ({activeDrivers.length})</TabsTrigger>
                <TabsTrigger value="available">Available ({availableDrivers.length})</TabsTrigger>
                <TabsTrigger value="offline">Offline ({offlineDrivers.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {drivers.map((driver: Driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      onEdit={handleEditDriver}
                      onDelete={handleDeleteDriver}
                      onViewRoute={handleViewRoute}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeDrivers.map((driver: Driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      onEdit={handleEditDriver}
                      onDelete={handleDeleteDriver}
                      onViewRoute={handleViewRoute}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="available" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableDrivers.map((driver: Driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      onEdit={handleEditDriver}
                      onDelete={handleDeleteDriver}
                      onViewRoute={handleViewRoute}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="offline" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {offlineDrivers.map((driver: Driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      onEdit={handleEditDriver}
                      onDelete={handleDeleteDriver}
                      onViewRoute={handleViewRoute}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <AddDriverDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={handleAddDriver} />
      <EditDriverDialog
        driver={editingDriver}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveDriver}
      />
    </div>
  )
}
