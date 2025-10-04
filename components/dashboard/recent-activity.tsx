import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import type { Order } from "@/lib/types"

interface RecentActivityProps {
  orders: Order[]
}

export function RecentActivity({ orders }: RecentActivityProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default"
      case "In Progress":
        return "secondary"
      case "Assigned":
        return "outline"
      case "Pending":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest delivery updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{order.customer_name}</p>
                <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                  <span className="text-xs text-muted-foreground">{order.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
