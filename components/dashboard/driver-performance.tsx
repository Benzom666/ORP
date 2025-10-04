import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"

interface DriverPerformanceProps {
  data: Array<{ name: string; deliveries: number; onTime: number; rating: number }>
}

export function DriverPerformance({ data }: DriverPerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Performance</CardTitle>
        <CardDescription>Top performing drivers this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((driver) => {
            const onTimePercentage = Math.round((driver.onTime / driver.deliveries) * 100)
            return (
              <div key={driver.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {driver.deliveries} deliveries • {driver.onTime} on-time
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{driver.rating}</span>
                  </div>
                </div>
                <Progress value={onTimePercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">{onTimePercentage}% on-time delivery rate</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
