"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RouteEfficiencyChartProps {
  data: Array<{ month: string; timeSaved: number; distanceSaved: number }>
}

export function RouteEfficiencyChart({ data }: RouteEfficiencyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Optimization Efficiency</CardTitle>
        <CardDescription>Time and distance saved through route optimization</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            timeSaved: {
              label: "Time Saved (min)",
              color: "hsl(var(--chart-2))",
            },
            distanceSaved: {
              label: "Distance Saved (mi)",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="timeSaved" stroke="var(--color-timeSaved)" strokeWidth={2} />
              <Line type="monotone" dataKey="distanceSaved" stroke="var(--color-distanceSaved)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
