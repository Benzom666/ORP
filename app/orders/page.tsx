"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { UploadDialog } from "@/components/orders/upload-dialog"
import { OrdersTable } from "@/components/orders/orders-table"
import { EditOrderDialog } from "@/components/orders/edit-order-dialog"
import { DatabaseSetupBanner } from "@/components/database-setup-banner"
import { useOrders } from "@/lib/hooks/use-orders"
import type { Order, OrderStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function OrdersPage() {
  const { orders, isLoading, isDatabaseNotSetup, mutate } = useOrders()
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleUpload = (file: File) => {
    // In a real app, parse CSV/XLSX and add orders
    toast({
      title: "Orders uploaded",
      description: `Successfully uploaded ${file.name}`,
    })
  }

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      mutate() // Refresh data
      toast({
        title: "Status updated",
        description: `Order status changed to ${status}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    setEditDialogOpen(true)
  }

  const handleSave = async (updatedOrder: Order) => {
    try {
      const response = await fetch(`/api/orders/${updatedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      })

      if (!response.ok) throw new Error("Failed to update order")

      mutate() // Refresh data
      toast({
        title: "Order updated",
        description: `Order has been updated`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete order")

      mutate() // Refresh data
      toast({
        title: "Order deleted",
        description: `Order has been deleted`,
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Downloading orders as CSV...",
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">
              <p className="text-center text-muted-foreground">Loading orders...</p>
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
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">Manage and track all delivery orders</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Order
                </Button>
                <UploadDialog onUpload={handleUpload} />
              </div>
            </div>

            {isDatabaseNotSetup && <DatabaseSetupBanner />}

            <OrdersTable
              orders={orders}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </main>
      </div>

      <EditOrderDialog
        order={editingOrder}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
