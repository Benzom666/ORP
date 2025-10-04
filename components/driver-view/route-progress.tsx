import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Package, CheckCircle2, Clock } from "lucide-react"
import type { Route } from "@/lib/types"

interface RouteProgressProps {
  route: Route
}

export function RouteProgress({ route }: RouteProgressProps) {
  const completedStops = route.orders.filter((o) => o.status === "Delivered").length
  const totalStops = route.orders.length
  const progress = (completedStops / totalStops) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Route Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">
              {completedStops} of {totalStops} stops completed
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span className="text-xs">Total</span>
            </div>
            <p className="text-2xl font-bold">{totalStops}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">Done</span>
            </div>
            <p className="text-2xl font-bold">{completedStops}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Remaining</span>
            </div>
            <p className="text-2xl font-bold">{totalStops - completedStops}</p>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm font-medium">{route.name}</p>
          <p className="text-xs text-muted-foreground">
            {route.total_distance} mi • Est. {route.estimated_duration} min
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
