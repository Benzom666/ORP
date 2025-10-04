"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Printer, Download } from "lucide-react"
import type { Order } from "@/lib/types"

interface BulkLabelGeneratorProps {
  orders: Order[]
  selectedOrders: string[]
  onToggleOrder: (orderId: string) => void
  onToggleAll: () => void
  onPrint: () => void
  onDownload: () => void
}

export function BulkLabelGenerator({
  orders,
  selectedOrders,
  onToggleOrder,
  onToggleAll,
  onPrint,
  onDownload,
}: BulkLabelGeneratorProps) {
  const allSelected = orders.length > 0 && selectedOrders.length === orders.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Select Orders</CardTitle>
            <CardDescription>Choose orders to generate labels for</CardDescription>
          </div>
          <Badge variant="secondary">{selectedOrders.length} selected</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <Checkbox id="select-all" checked={allSelected} onCheckedChange={onToggleAll} />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All Orders
          </label>
        </div>

        <div className="max-h-96 space-y-2 overflow-y-auto">
          {orders.map((order) => (
            <div key={order.id} className="flex items-start gap-3 rounded-lg border p-3">
              <Checkbox
                id={order.id}
                checked={selectedOrders.includes(order.id)}
                onCheckedChange={() => onToggleOrder(order.id)}
              />
              <label htmlFor={order.id} className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{order.customer_name}</p>
                  {order.priority && (
                    <Badge variant={order.priority === "High" ? "destructive" : "outline"} className="ml-2 text-xs">
                      {order.priority}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{order.delivery_address}</p>
                <p className="text-xs text-muted-foreground">{order.id}</p>
              </label>
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-t pt-4">
          <Button onClick={onPrint} disabled={selectedOrders.length === 0} className="flex-1">
            <Printer className="mr-2 h-4 w-4" />
            Print Labels
          </Button>
          <Button
            onClick={onDownload}
            disabled={selectedOrders.length === 0}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
