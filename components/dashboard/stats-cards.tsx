import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, Route, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  totalDeliveries: number
  activeDrivers: number
  activeRoutes: number
  completionRate: number
}

export function StatsCards({ totalDeliveries, activeDrivers, activeRoutes, completionRate }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Deliveries",
      value: totalDeliveries,
      icon: Package,
      description: "Today",
      trend: "+12% from yesterday",
    },
    {
      title: "Active Drivers",
      value: activeDrivers,
      icon: Users,
      description: "On route",
      trend: "2 available",
    },
    {
      title: "Active Routes",
      value: activeRoutes,
      icon: Route,
      description: "In progress",
      trend: "Avg 8 stops/route",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      description: "This week",
      trend: "+5% from last week",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
